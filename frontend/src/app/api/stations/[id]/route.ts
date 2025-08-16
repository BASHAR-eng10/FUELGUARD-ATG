import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';
import { makeAuthenticatedExternalRequest } from '@/lib/auth/tokenManager';

// GET /api/stations - Get all stations using user's stored tokens
export async function GET(request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
		const { id } = await params;
    // Verify user token
    const user = await verifyToken(request);

    // Make request to external API using user's stored tokens
    const stations = await makeAuthenticatedExternalRequest(
      user.userId.toString(),
      `/stationinfo/${id}`
    );

    return NextResponse.json({
      success: true,
      data: stations,
      source: 'external_api_user_authenticated',
      timestamp: new Date().toISOString(),
      user: {
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Stations API error:', error);
    
    if (error.message.includes('token') || error.message.includes('Session')) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 401 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch stations',
      details: error.message
    }, { status: 500 });
  }
}

