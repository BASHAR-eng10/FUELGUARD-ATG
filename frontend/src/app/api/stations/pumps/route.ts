import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';
import { makeAuthenticatedExternalRequest } from '@/lib/auth/tokenManager';

// GET /api/stations - Get all stations using user's stored tokens
export async function GET(request: NextRequest) {
  try {
    // Verify user token
    const user = await verifyToken(request);
    console.log(`🔐 Authenticated user: ${user.email} (${user.role})`);

    // Make request to external API using user's stored tokens
    const stations = await makeAuthenticatedExternalRequest(
      user.userId.toString(),
      '/station/pumps'
    );
		console.log(stations)

		const data = stations.data.page_records.map((pump: any, i:number) => ({
			id: i + 1,
			sold: Math.floor(Math.random() * 100),
			percentage: Math.floor(Math.random() * 100),
			status: Math.random() > 0.5,
			...pump,
		}))

    return NextResponse.json({
      success: true,
      data: data,
      count: Array.isArray(data) ? data.length : 0,
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

