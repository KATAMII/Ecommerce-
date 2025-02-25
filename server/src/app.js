import express from 'express';
import { createServer } from 'http';
import { rateLimit } from 'express-rate-limit';
import session from 'express-session';
import { loadEnv } from './config/env.js';
import { connectDB } from './config/db.js';
import { configureSocket } from './config/socket.js';
import { corsMiddleware } from './middleware/corsMiddleware.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { setupSocketRoutes } from './routes/socketRoutes.js';
import { logger } from './utils/logger.js';

// Load environment variables
loadEnv();

// Create Express app
const app = express();
const httpServer = createServer(app);

// Connect to database
connectDB();

// Configure WebSocket
const io = configureSocket(httpServer);
setupSocketRoutes(io);

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Error handling
app.use(errorHandler);

export { app, httpServer };
