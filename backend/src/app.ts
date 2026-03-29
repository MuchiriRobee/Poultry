import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes';
import farmRoutes from './routes/farm.routes';
import flockRoutes from './routes/flock.routes';
import eggRoutes from './routes/egg.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// Security & Middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' })); // Vite default port
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);   
app.use('/api/flocks', flockRoutes);
app.use('/api/eggs', eggRoutes);

// Error handling
app.use(errorHandler);

export default app;