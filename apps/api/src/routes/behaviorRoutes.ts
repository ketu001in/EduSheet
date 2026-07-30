import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { trackActivity, getStats, getRecommendations } from '../services/behaviorService';
import { z } from 'zod';
import { validate } from '../middleware/validate';

const router: Router = Router();
router.use(requireAuth);

const trackSchema = z.object({
  topic_id: z.string(),
  score: z.number().min(0).max(100).optional(),
  time_spent: z.number().min(0).optional()
});

router.post('/track', validate(trackSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    await trackActivity(req.user.id, req.body.topic_id, req.body);
    res.json({ success: true, message: 'Activity tracked successfully' });
  } catch (error) {
    next(error);
  }
});

router.get('/recommendations', async (req: AuthenticatedRequest, res, next) => {
  try {
    const recommendations = await getRecommendations(req.user.id);
    res.json({ success: true, data: recommendations });
  } catch (error) {
    next(error);
  }
});

router.get('/stats', async (req: AuthenticatedRequest, res, next) => {
  try {
    const stats = await getStats(req.user.id);
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

export default router;
