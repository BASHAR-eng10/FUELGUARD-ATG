'use client'

import { useSession, signOut } from 'next-auth/react'

export function useAuth() {
  const { data: session, status } = useSession()
  
  const user = session?.user
  const isLoading = status === 'loading'
  const isAuthenticated = !!session
  
  const logout = async () => {
    await signOut({ callbackUrl: '/signin' })
  }
  
  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    logout,
    // For backward compatibility
    token: session?.accessToken,
    refreshToken: session?.refreshToken
  }
}
