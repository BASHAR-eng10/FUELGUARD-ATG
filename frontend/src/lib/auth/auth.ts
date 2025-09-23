// src/lib/auth/auth.ts
import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

// Type definitions without conflicts
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

// Extend NextAuth types properly
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      canAccessAll: boolean
      stationId: number | null
    } & DefaultSession['user']
    accessToken: string
    refreshToken: string
  }

  interface User {
    role: string
    canAccessAll: boolean
    stationId: number | null
    accessToken: string
    refreshToken: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    canAccessAll: boolean
    stationId: number | null
    accessToken: string
    refreshToken: string
  }
}

const config = {
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
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
            console.error('Login failed:', response.status)
            return null
          }

          const res: ExternalApiResponse = await response.json()
          const data = res.data

          console.log('Login successful for:', credentials.email)

          const user = {
            id: data.user_record.id.toString(),
            email: data.user_record.email,
            name: data.user_record.email,
            role: data.user_record.roles.name === "SuperAdmin" ? "System Administrator" : data.user_record.roles.name,
            canAccessAll: data.user_record.roles.name === "SuperAdmin",
            stationId: data.user_record.associated_station,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          }

          return user
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }: { token: any; user: any }) => {
      if (user) {
        token.role = user.role
        token.canAccessAll = user.canAccessAll
        token.stationId = user.stationId
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }
      return token
    },
    session: async ({ session, token }: { session: any; token: any }) => {
      if (token) {
        session.user.id = token.sub as string
        session.user.role = token.role
        session.user.canAccessAll = token.canAccessAll
        session.user.stationId = token.stationId
        session.accessToken = token.accessToken
        session.refreshToken = token.refreshToken
      }
      return session
    }
  },
  pages: {
    signIn: '/signin',
    error: '/signin'
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 8 * 60 * 60, // 8 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)