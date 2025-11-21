import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB, { getDBStatus } from './config/database.js';
import authRoutes from './routes/auth.js';
import workspaceRoutes from './routes/workspace.js';
import pageRoutes from './routes/page.js';
import aiRoutes from './routes/ai.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { sanitizeAll } from './middleware/sanitizer.js';
import { consoleLogger, httpLogger, logger } from './middleware/logger.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Logging middleware
if (process.env.NODE_ENV === 'production') {
  app.use(httpLogger);
} else {
  app.use(consoleLogger);
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitizeAll);

// Enhanced health check route with database status
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  const healthStatus = {
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus.status,
      connected: dbStatus.isConnected,
    },
  };

  // If database is not connected, return 503 Service Unavailable
  if (!dbStatus.isConnected) {
    return res.status(503).json({
      ...healthStatus,
      status: 'SERVICE_UNAVAILABLE',
      message: 'Server is running but database is not connected',
    });
  }

  res.status(200).json(healthStatus);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start listening
    app.listen(PORT, () => {
      const dbStatus = getDBStatus();
      
      logger.info('Server started successfully', {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        database: dbStatus.status,
      });
      
      console.log(`\nServer is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Database: ${dbStatus.status}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close server gracefully
  process.exit(1);
});

// Start the server
startServer();

export default app;