import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export interface AuthenticatedUser {
  userId: number;
  email: string;
  role: string;
  canAccessAll: boolean;
  stationId: number | null;
  externalUserId: number;
}

export async function verifyToken(request: NextRequest): Promise<AuthenticatedUser> {
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET 
    })
    
    if (!token) {
      throw new Error('Access denied. No valid session found.')
    }

    return {
      userId: parseInt(token.sub || '0'),
      email: token.email || '',
      role: token.role as string,
      canAccessAll: token.canAccessAll as boolean,
      stationId: token.stationId as number | null,
      externalUserId: parseInt(token.sub || '0')
    }
  } catch (error) {
    throw new Error('Invalid or expired session.')
  }
}

// For backward compatibility with existing API routes
export function verifyTokenSync(request: NextRequest): AuthenticatedUser {
  // This is a fallback for any routes still using the old system
  const authHeader = request.headers.get('authorization')
  const bearerToken = authHeader?.replace('Bearer ', '')
  
  if (!bearerToken) {
    throw new Error('Access denied. No token provided.')
  }

  // This should not be used in production with NextAuth
  // It's here only for transition period
  try {
    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET || 'your-secret-key') as AuthenticatedUser
    return decoded
  } catch (error) {
    throw new Error('Invalid token.')
  }
}
