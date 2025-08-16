import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/middleware/auth';
import { makeAuthenticatedExternalRequest } from '../../../lib/auth/tokenManager';

// GET /api/stations - Get all stations using user's stored tokens
export async function GET(request: NextRequest) {
  try {
    // Verify user token
    const user = verifyToken(request);
    console.log(`🔐 Authenticated user: ${user.email} (${user.role})`);

    // Make request to external API using user's stored tokens
    const stations = await makeAuthenticatedExternalRequest(
      user.userId.toString(),
      '/stationinfo/all'
    );
		console.log(stations)
    
    return NextResponse.json({
      success: true,
      data: stations.data || stations,
      count: Array.isArray(stations.data) ? stations.data.length : Array.isArray(stations) ? stations.length : 0,
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
