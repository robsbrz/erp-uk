import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import templateRoutes from './routes/template.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const startServer = async () => {
  try {
    // Initialize database connection
    const connection = await initializeDatabase();
    console.log('Database connected successfully');

    const app = express();

    app.use(cors());
    app.use(express.json());

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/templates', templateRoutes);

    // Error handling
    app.use(errorHandler);

    const port = process.env.PORT || 5001;

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
