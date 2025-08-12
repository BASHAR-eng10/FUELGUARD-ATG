// routes/stations.js - Station management routes
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

// GET /api/stations - Get all stations
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const stations = await stationService.getAllStations();
    res.json({
      success: true,
      data: stations,
      count: stations.length,
      source: 'external_api',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/stations/stats - Get station statistics
router.get('/stats', verifyToken, async (req, res, next) => {
  try {
    const stats = await stationService.getStationStats();
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/stations/health - Check external API health
router.get('/health', verifyToken, async (req, res, next) => {
  try {
    const externalApiService = require('../services/externalApiService');
    const health = await externalApiService.healthCheck();
    
    res.json({
      success: true,
      data: {
        externalApi: health,
        cacheInfo: stationService.getCacheInfo ? stationService.getCacheInfo() : 'N/A'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/stations/:id - Get specific station
router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const stations = await stationService.getAllStations();
    const station = stations.find(s => s.id === parseInt(req.params.id));
    
    if (!station) {
      return res.status(404).json({
        success: false,
        error: `Station with ID ${req.params.id} not found`
      });
    }

    res.json({
      success: true,
      data: station,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/stations/refresh - Refresh station cache
router.post('/refresh', verifyToken, async (req, res, next) => {
  try {
    const stations = await stationService.refreshCache();
    res.json({
      success: true,
      message: 'Station data refreshed successfully from external API',
      data: stations,
      count: stations.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 
