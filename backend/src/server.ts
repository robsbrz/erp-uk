import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import { createLogger } from './utils/logger';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import templateRoutes from './routes/template.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const logger = createLogger('Server');

const startServer = async () => {
  try {
    // Initialize database connection
    const connection = await initializeDatabase();
    logger.info('Database connected successfully');

    const app = express();

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Request logging in development
    if (process.env.NODE_ENV !== 'production') {
      app.use((req, res, next) => {
        logger.debug(`${req.method} ${req.path}`, {
          query: req.query,
          body: req.body
        });
        next();
      });
    }

    // Health check
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      });
    });

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/templates', templateRoutes);

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({
        status: 'error',
        message: 'Route not found',
        path: req.path
      });
    });

    // Error handling
    app.use(errorHandler);

    const port = process.env.PORT || 5001;

    app.listen(port, () => {
      logger.info(`Server running on port ${port}`, {
        port,
        environment: process.env.NODE_ENV,
        nodeVersion: process.version
      });
    });

    // Handle shutdown gracefully
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      connection.close().then(() => {
        logger.info('Database connection closed.');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Error starting server:', { error });
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', { error });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', { reason, promise });
  process.exit(1);
});

startServer();
