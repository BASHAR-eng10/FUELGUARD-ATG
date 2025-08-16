import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// GET /api/auth/me - Get current user info
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'No token provided'
      }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    return NextResponse.json({
      success: true,
      data: {
        ...decoded,
        sessionActive: true
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Invalid token'
    }, { status: 401 });
  }
}
