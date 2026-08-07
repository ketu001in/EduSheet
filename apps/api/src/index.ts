import express from 'express';
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
import behaviorRoutes from './routes/behaviorRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import notificationRoutes from './routes/notificationRoutes';
import userRoutes from './routes/userRoutes';
import searchRoutes from './routes/searchRoutes';
import adminRoutes from './routes/adminRoutes';

import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const app = express();
const PORT = process.env.PORT || 4000;

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
app.use('/api/behavior', behaviorRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`[Server]: EduSheets API is running at http://localhost:${PORT}`);
});
