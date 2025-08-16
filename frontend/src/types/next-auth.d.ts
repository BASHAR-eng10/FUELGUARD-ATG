import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT } from 'next-auth/jwt'

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

  interface User extends DefaultUser {
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
