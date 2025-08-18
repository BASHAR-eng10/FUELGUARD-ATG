import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';
import { makeAuthenticatedExternalRequest } from '@/lib/auth/tokenManager';
import { getAlerts } from '@/lib/services/externalApiService';
import { time, timeStamp } from 'console';

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

		// get alerts
		const alerts = await getAlerts(id);

    return NextResponse.json({
      success: true,
      data: alerts.map(alert => ({
        id: alert.id,
        message: alert.alert,
				timestamp: alert.date,
      })),
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
      error: 'Failed to fetch cash information',
      details: error.message
    }, { status: 500 });
  }
}

