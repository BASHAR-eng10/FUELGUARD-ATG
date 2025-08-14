// server.js - Complete server with all routes
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const stationRoutes = require("./routes/stations");
const dashboardRoutes = require("./routes/dashboard");

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(compression());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.json({
    message: "Fuel Station Backend API",
    status: "running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      "GET /",
      "GET /health",
      "POST /api/auth/login",
      "POST /api/auth/logout",
      "GET /api/auth/me",
      "GET /api/stations/pumps",
      "GET /api/stations (requires auth)",
      "GET /api/stations/stats (requires auth)",
      "GET /api/stations/:id (requires auth)",
      "POST /api/stations/refresh (requires auth)",
      "GET /api/dashboard/overview (requires auth)",
      "GET /api/dashboard/station/:id (requires auth)",
    ],
  });
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const externalApiService = require("./services/externalApiService");
    const apiHealth = await externalApiService.healthCheck();

    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
      externalApi: apiHealth,
    });
  } catch (error) {
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
      externalApi: {
        status: "error",
        message: error.message,
      },
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("🚨 Error:", err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`💡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`⛽ Stations API: http://localhost:${PORT}/api/stations`);
  console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard`);
});

module.exports = app;
