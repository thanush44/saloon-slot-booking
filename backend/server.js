const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Import Database module
const { connectDB, Service, Admin, seedDatabase } = require('../database');

// Import Route handlers
const serviceRoutes = require('./src/routes/serviceRoutes');
const stylistRoutes = require('./src/routes/stylistRoutes');
const availabilityRoutes = require('./src/routes/availabilityRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const authRoutes = require('./src/routes/authRoutes');
const statsRoutes = require('./src/routes/statsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow both user-frontend, admin-frontend, or any dev port
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/services', serviceRoutes);
app.use('/api/stylists', stylistRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);

// Health check / welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'Salon Appointment Booking API',
    status: 'online',
    version: '1.0.0',
    documentation: {
      services: '/api/services',
      stylists: '/api/stylists',
      availability: '/api/availability?date=YYYY-MM-DD&duration=30&stylistId=any',
      appointments: '/api/appointments',
      auth: '/api/auth/login',
      stats: '/api/stats',
    },
  });
});

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[ServerError] Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Server Initialization
const startServer = async () => {
  try {
    // 1. Connect to Database via database module
    await connectDB();

    // 2. Check if database is empty; if so, automatically seed default data
    const serviceCount = await Service.countDocuments();
    const adminCount = await Admin.countDocuments();

    if (serviceCount === 0 || adminCount === 0) {
      console.log('[Server] Database appears empty. Running automatic seeder...');
      await seedDatabase();
      console.log('[Server] Initial salon data populated successfully.');
    }

    // 3. Start listening
    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`✨ Salon Booking Backend Server running on port ${PORT}`);
      console.log(`🌐 API Endpoint: http://localhost:${PORT}/`);
      console.log(`🚀 Ready for user-frontend & admin-frontend requests`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error('[Server] Critical error starting server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
