import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/middleware/auth';
import stationService from '../../../../lib/services/stationService';

// GET /api/dashboard/overview - General manager dashboard data
export async function GET(request: NextRequest) {
  try {
    // Verify token with NextAuth
    const user = await verifyToken(request);

    const stations = await stationService.getAllStations();
    
    // Calculate overview metrics
    const totalRevenue = stations.reduce((sum: number, station: any) => {
      const revenue = parseInt(station.todayRevenue?.replace(/[$,]/g, '') || '0') || 0;
      return sum + revenue;
    }, 0);
    
    const totalAlerts = stations.reduce((sum: number, station: any) => sum + (station.alertCount || 0), 0);
    const activeStations = stations.filter((s: any) => s.status !== 'poor').length;
    const averageEfficiency = stations.length > 0 ? 
      Math.round(stations.reduce((sum: number, s: any) => sum + (s.efficiency || 0), 0) / stations.length) : 0;

    // Recent alerts (mock data)
    const recentAlerts = [
      {
        id: 1,
        station: 'Station 1',
        type: 'Low Fuel',
        severity: 'high',
        time: '10 minutes ago',
        status: 'active'
      },
      {
        id: 2,
        station: 'Station 3',
        type: 'System Error',
        severity: 'medium',
        time: '25 minutes ago',
        status: 'resolved'
      }
    ];

    const dashboardData = {
      overview: {
        totalRevenue: `$${totalRevenue.toLocaleString()}`,
        totalAlerts,
        activeStations,
        averageEfficiency: `${averageEfficiency}%`
      },
      stations: stations.map((station: any) => ({
        id: station.id,
        name: station.name,
        status: station.status || 'good',
        revenue: station.todayRevenue || '$0',
        efficiency: `${station.efficiency || 85}%`,
        lastUpdate: station.lastUpdate || new Date().toISOString()
      })),
      recentAlerts,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: dashboardData
    });
  } catch (error: any) {
    if (error.message.includes('token')) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 401 });
    }
    
    console.error('Dashboard API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch dashboard data'
    }, { status: 500 });
  }
}