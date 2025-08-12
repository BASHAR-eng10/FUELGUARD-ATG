// routes/auth.js - Authentication routes
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const stationService = require('../services/stationService');

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Get station accounts for authentication
    let stations = [];
    try {
      stations = await stationService.getAllStations();
    } catch (error) {
      console.warn('Could not fetch stations for auth:', error.message);
    }
    
    // Build accounts map including general manager
    const accounts = {
  'manager@fuelstation.com': {
    password: 'manager123',
    role: 'General Manager',
    canAccessAll: true,
    stationId: null
  },
  // Add your account here
  'ak4tek@admin.com': {
    password: '!Ak4tek12*',
    role: 'System Administrator',
    canAccessAll: true,
    stationId: null
  }
};

    // Add station-specific accounts
    stations.forEach(station => {
      if (station.automation?.username) {
        accounts[station.automation.username] = {
          password: 'unga1441', // In production, this should be hashed
          role: station.name,
          canAccessAll: false,
          stationId: station.id
        };
      }
    });

    const account = accounts[email];
    if (!account) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // In production, use bcrypt.compare for hashed passwords
    if (account.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email,
        role: account.role,
        canAccessAll: account.canAccessAll,
        stationId: account.stationId
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '8h' }
    );

    console.log(`✅ User authenticated: ${email} (${account.role})`);

    res.json({
      success: true,
      data: {
        token,
        user: {
          email,
          role: account.role,
          canAccessAll: account.canAccessAll,
          stationId: account.stationId
        }
      },
      message: `Welcome ${account.role}!`
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// GET /api/auth/me - Get current user info
router.get('/me', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    res.json({
      success: true,
      data: {
        ...decoded,
        sessionActive: true
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

module.exports = router; 
