// /ak4tek/tanks/
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';
import { makeAuthenticatedExternalRequest } from '@/lib/auth/tokenManager';

// GET /api/stations - Get all stations using user's stored tokens
export async function GET(request: NextRequest,
	  { params }: { params: Promise<{ id: string }> }
) {
  try {
		const {id } = await params;
    // Verify user token
    const user = verifyToken(request);
    console.log(`🔐 Authenticated user: ${user.email} (${user.role})`);

    // Make request to external API using user's stored tokens
    const tanks = await makeAuthenticatedExternalRequest(
      user.userId.toString(),
      '/ak4tek/tanks/'
    );
		if (!Array.isArray(tanks.data)) {
			console.error('Invalid tanks data format:', tanks.data);
			return NextResponse.json({
				success: false,
				error: 'Invalid tanks data format'
			}, { status: 400 });
		}

		// determine the station_id based on the tanks ewuralicense
    // Make request to external API using user's stored tokens
    const stations = await makeAuthenticatedExternalRequest(
      user.userId.toString(),
      '/stationinfo/all'
    );
		// filter by station id
		const filteredTanks = tanks.data?.filter((tank: any) => {
			const station = stations.data.find((s: any) => s.EWURALicenseNo === tank.EWURALicenseNo);
			return station ? station.id === Number(id) : false;
		});

		// Filter only latest tanks by grouping by tank ID and getting the most recent entry
		const latestTanks = filteredTanks.reduce((acc: any[], tank: any) => {
			const existingIndex = acc.findIndex(existing => existing.tank_id === tank.tank_id);
			
			if (existingIndex === -1) {
				// First occurrence of this tank
				acc.push(tank);
			} else {
				// Compare timestamps and keep the latest
				const existingDate = new Date(acc[existingIndex].timestamp || acc[existingIndex].created_at || acc[existingIndex].date || 0);
				const currentDate = new Date(tank.timestamp || tank.created_at || tank.date || 0);
				
				if (currentDate > existingDate) {
					acc[existingIndex] = tank;
				}
			}
			
			return acc;
		}, []) || [];


		// const revisedTanks = latestTanks.map((tank: any) => {
		// 	const station = stations.data.find((s: any) => s.EWURALicenseNo === tank.EWURALicenseNo);
		// 	return {
		// 		...tank,
		// 		station_id: station ? station.id : null
		// 	};
		// });


    return NextResponse.json({
      success: true,
      data: latestTanks,
      source: 'external_api_user_authenticated',
      timestamp: new Date().toISOString(),
      user: {
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Tanks API error:', error);
    
    if (error.message.includes('token') || error.message.includes('Session')) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 401 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch tanks',
      details: error.message
    }, { status: 500 });
  }
}

