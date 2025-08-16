import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// GET /api/auth/me - Get current user info using NextAuth session
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET 
    })
    
    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'No valid session found'
      }, { status: 401 })
    }
    
    return NextResponse.json({
      success: true,
      data: {
        userId: parseInt(token.sub || '0'),
        email: token.email,
        role: token.role,
        canAccessAll: token.canAccessAll,
        stationId: token.stationId,
        sessionActive: true
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Invalid or expired session'
    }, { status: 401 })
  }
}
