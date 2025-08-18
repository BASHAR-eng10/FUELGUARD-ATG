import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';
import { getAllAlerts } from '@/lib/services/externalApiService';

export async function GET(request: NextRequest) {
  try {
    // Verify user token
    const user = await verifyToken(request);
		console.log("Role of USER FOR ALERTS:", user.role, "HAS TO BE ADMIN"); //TODO: Implement role check

		// get alerts
		const alerts = await getAllAlerts();

    return NextResponse.json({
      success: true,
      data: alerts.map(alert => ({
        id: alert.id,
				stationId: alert.stationId,
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


