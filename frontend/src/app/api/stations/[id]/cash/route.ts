import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';
import { makeAuthenticatedExternalRequest } from '@/lib/auth/tokenManager';
import { getCurrentManualCashEntries, updateCurrentManualCashEntries } from '@/lib/services/externalApiService';

export async function GET(request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
		const { id } = await params;
    // Verify user token
    const user = await verifyToken(request);

    // Make request to external API using user's stored tokens
    await makeAuthenticatedExternalRequest(
      user.userId.toString(),
      `/stationinfo/${id}`
    );

		// update cash
		const cashEntries = await getCurrentManualCashEntries(id);

    return NextResponse.json({
      success: true,
      data: cashEntries,
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




export async function POST(request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
		const { id } = await params;
		// get data from request body
		// actual amount , requested amount
		const requestData = await request.json();
		const { actualReading, manualReading } = requestData;

    // Verify user token
    const user = await verifyToken(request);

    // Make request to external API using user's stored tokens
    await makeAuthenticatedExternalRequest(
      user.userId.toString(),
      `/stationinfo/${id}`
    );

		// update cash
		await updateCurrentManualCashEntries(id, parseFloat(actualReading), parseFloat(manualReading));

    return NextResponse.json({
      success: true,
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