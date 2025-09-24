import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import apiService from "@/lib/services/api";

interface ExternalApiResponse {
  status_code: number;
  data: {
    refresh_token: string;
    access_token: string;
    user_record: {
      id: number;
      creation_date: string;
      email: string;
      roles: {
        id: number;
        name: string;
      };
      associated_station: number | null;
    };
  };
  message: string;
}

// Optional: Store user token in memory cache (instead of database)
const userSessionCache = new Map();

async function storeUserToken(userId: string, accessToken: string, refreshToken: string) {
  try {
    const expiresAt = new Date(Date.now() + (8 * 60 * 60 * 1000)); // 8 hours
    
    // Store in memory cache instead of database
    userSessionCache.set(`user_session_${userId}`, {
      access_token: accessToken,
      refresh_token: refreshToken,
      created_at: new Date().toISOString(),
      expires_at: expiresAt
    });

    console.log(`🗄️ User session stored in memory for user ${userId}`);
  } catch (error) {
    console.warn('Failed to store user session:', error);
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const response = await fetch('http://server.oktin.ak4tek.com:3950/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            }),
            cache: 'no-store'
          })

          if (!response.ok) {
            console.error('Login failed:', await response.text())
            return null
          }

          const res: ExternalApiResponse = await response.json()
          const data = res.data

          // Store tokens in memory cache
          await storeUserToken(
            data.user_record.id.toString(),
            data.access_token,
            data.refresh_token
          )
          console.log(`✅ User authenticated: ${credentials.email} (${data.user_record.roles.name})`)

          const stationResponse = await fetch('http://server.oktin.ak4tek.com:3950/stationinfo/all', {
            headers: {
              'Authorization': data.access_token,
              'Content-Type': 'application/json',
            }
          });

          const stationData = await stationResponse.json();
          console.log("stat res", stationData.data[0].id);
          return {
            id: data.user_record.id.toString(),
            email: data.user_record.email,
            name: data.user_record.email,
            role: data.user_record.roles.name === "SuperAdmin" ? "System Administrator" : data.user_record.roles.name,
            canAccessAll: data.user_record.roles.name === "SuperAdmin",
            stationId: data.user_record.associated_station ? stationData.data[0].id : null,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.canAccessAll = user.canAccessAll
        token.stationId = user.stationId
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.canAccessAll = token.canAccessAll as boolean
        session.user.stationId = token.stationId as number | null
      }
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      return session
    }
  },
  pages: {
    signIn: '/signin',
    error: '/signin'
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
  trustHost: true, // Trust the host in development and production
})