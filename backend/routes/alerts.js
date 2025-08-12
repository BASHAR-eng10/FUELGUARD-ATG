// routes/alerts.js - Alerts routes placeholder
const express = require('express');
const router = express.Router();

// Simple placeholder route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Alerts routes - Coming soon',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 
