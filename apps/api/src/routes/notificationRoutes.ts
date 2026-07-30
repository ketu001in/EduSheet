import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router: Router = Router();
router.use(requireAuth);

router.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { data, error } = await req.supabase!
      .from('notifications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('is_read', { ascending: true })
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/read', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { error } = await req.supabase!
      .from('notifications')
      .update({ is_read: true })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);
      
    if (error) throw error;
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
});

router.patch('/read-all', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { error } = await req.supabase!
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', req.user.id)
      .eq('is_read', false);
      
    if (error) throw error;
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
});

export default router;
