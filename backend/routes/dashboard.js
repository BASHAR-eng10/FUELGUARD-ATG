// routes/dashboard.js - Dashboard data routes
const express = require('express');
const router = express.Router();
const stationService = require('../services/stationService');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No token provided.'
    });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token.'
    });
  }
};

// GET /api/dashboard/overview - General manager dashboard data
router.get('/overview', verifyToken, async (req, res, next) => {
  try {
    const stations = await stationService.getAllStations();
    const stats = await stationService.getStationStats();
    
    // Calculate overview metrics
    const totalRevenue = stations.reduce((sum, station) => {
      const revenue = parseInt(station.todayRevenue.replace(/[$,]/g, '')) || 0;
      return sum + revenue;
    }, 0);
    
    const totalAlerts = stations.reduce((sum, station) => sum + (station.alertCount || 0), 0);
    const activeStations = stations.filter(s => s.status !== 'poor').length;
    const averageEfficiency = stations.length > 0 ? 
      Math.round(stations.reduce((sum, s) => sum + (s.efficiency || 0), 0) / stations.length) : 0;

    // Recent alerts (mock data)
    const recentAlerts = [
      {
        id: 1,
        type: 'Water Detection',
        station: 'Main Street',
        severity: 'high',
        time: '2 hours ago',
        color: '#dc2626'
      },
      {
        id: 2,
        type: 'Cash Discrepancy',
        station: 'Highway Junction',
        severity: 'medium',
        time: '4 hours ago',
        color: '#eab308'
      },
      {
        id: 3,
        type: 'Tank Level Low',
        station: 'Airport Road',
        severity: 'low',
        time: '6 hours ago',
        color: '#3b82f6'
      }
    ];

    res.json({
      success: true,
      data: {
        metrics: {
          totalStations: stations.length,
          activeStations,
          totalAlerts,
          totalRevenue: `$${totalRevenue.toLocaleString()}`,
          averageEfficiency
        },
        stations: stations.map(station => ({
          id: station.id,
          name: station.name,
          location: station.location ? `${station.location.ward}, ${station.location.district}` : 'Unknown',
          status: station.status,
          efficiency: station.efficiency,
          revenue: station.todayRevenue,
          alertCount: station.alertCount,
          tanks: station.technical?.totalTanks || 0,
          nozzles: station.nozzleCount,
          operator: station.operator?.name,
          lastUpdate: station.lastUpdate
        })),
        recentAlerts,
        stats
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/dashboard/station/:id - Individual station dashboard
router.get('/station/:id', verifyToken, async (req, res, next) => {
  try {
    const stations = await stationService.getAllStations();
    const station = stations.find(s => s.id === parseInt(req.params.id));
    
    if (!station) {
      return res.status(404).json({
        success: false,
        error: `Station with ID ${req.params.id} not found`
      });
    }

    // Mock tank data
    const tanks = [
      {
        id: 1,
        name: 'Tank 1 - Unleaded',
        fuelType: 'Unleaded',
        capacity: 95000,
        currentLevel: 71250,
        percentage: 75,
        temperature: 20,
        waterLevel: 0.5,
        status: 'normal'
      },
      {
        id: 2,
        name: 'Tank 2 - Diesel',
        fuelType: 'Diesel',
        capacity: 95000,
        currentLevel: 57000,
        percentage: 60,
        temperature: 22,
        waterLevel: 2.0,
        status: 'warning'
      }
    ];

    // Mock sales data
    const sales = {
      today: {
        totalLiters: 10020,
        totalRevenue: 14629,
        unleadedPrice: 1.45,
        dieselPrice: 1.52
      },
      nozzlePerformance: Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        name: `Nozzle ${i + 1}`,
        liters: Math.floor(Math.random() * 1000) + 500,
        percentage: Math.floor(Math.random() * 10) + 10,
        status: Math.random() > 0.8 ? 'inactive' : 'active'
      }))
    };

    // Mock alerts
    const alerts = [
      {
        id: 1,
        type: 'Tank Level Monitor',
        severity: 'medium',
        message: 'Tank 2 water level elevated',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ];

    res.json({
      success: true,
      data: {
        station: {
          id: station.id,
          name: station.name,
          location: station.location ? `${station.location.ward}, ${station.location.district}` : 'Unknown',
          operator: station.operator?.name,
          ewuraLicense: station.ewuraLicense,
          tanks: station.technical?.totalTanks || 2,
          contact: station.contact
        },
        tanks,
        sales,
        alerts,
        metrics: {
          efficiency: station.efficiency,
          uptime: 98,
          todayRevenue: station.todayRevenue
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 
