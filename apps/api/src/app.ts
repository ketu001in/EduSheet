import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';

import curriculumRoutes from './routes/curriculumRoutes';
import worksheetRoutes from './routes/worksheetRoutes';
import projectRoutes from './routes/projectRoutes';
import studyMaterialRoutes from './routes/studyMaterialRoutes';
import activitySheetRoutes from './routes/activitySheetRoutes';
import techProjectRoutes from './routes/techProjectRoutes';
import chemistryLabRoutes from './routes/chemistryLabRoutes';
import physicsLabRoutes from './routes/physicsLabRoutes';
import behaviorRoutes from './routes/behaviorRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import notificationRoutes from './routes/notificationRoutes';
import userRoutes from './routes/userRoutes';
import searchRoutes from './routes/searchRoutes';
import adminRoutes from './routes/adminRoutes';

import path from 'path';
// Only meaningful for local dev (tsx runs this as CommonJS, where
// __dirname exists) -- on Vercel this file is bundled as ESM, where
// __dirname is simply not defined (referencing it directly throws;
// `typeof` is the safe way to check without doing that), and env vars come
// from the project's own Environment Variables settings instead.
if (typeof __dirname !== 'undefined') {
  dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
}

// The Express app itself, with no app.listen() call -- kept separate from
// index.ts (local dev entrypoint) and api/index.ts (Vercel serverless
// entrypoint) so both can import the exact same configured app instead of
// duplicating this setup.
const app: Express = express();

// Running behind Vercel's own proxy -- without this, Express doesn't trust
// the X-Forwarded-For header it receives, which breaks express-rate-limit's
// per-IP tracking (it logs a ValidationError on every request otherwise).
app.set('trust proxy', 1);

// Global Middlewares
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', process.env.FRONTEND_URL!].filter(Boolean),
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(generalLimiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount Routes
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/worksheets', worksheetRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/study-materials', studyMaterialRoutes);
app.use('/api/activity-sheets', activitySheetRoutes);
app.use('/api/tech-projects', techProjectRoutes);
app.use('/api/chem-lab', chemistryLabRoutes);
app.use('/api/physics-lab', physicsLabRoutes);
app.use('/api/behavior', behaviorRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
