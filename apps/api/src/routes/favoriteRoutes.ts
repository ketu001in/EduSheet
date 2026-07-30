import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';
import { validate } from '../middleware/validate';

const router: Router = Router();
router.use(requireAuth);

const favoriteSchema = z.object({
  entity_type: z.enum(['worksheet', 'topic', 'chapter']),
  entity_id: z.string()
});

router.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { data, error } = await req.supabase!
      .from('favorites')
      .select('*')
      .eq('user_id', req.user.id);
      
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.post('/', validate(favoriteSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const { data, error } = await req.supabase!
      .from('favorites')
      .insert({
        user_id: req.user.id,
        entity_type: req.body.entity_type,
        entity_id: req.body.entity_id
      })
      .select()
      .single();
      
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { error } = await req.supabase!
      .from('favorites')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);
      
    if (error) throw error;
    res.json({ success: true, message: 'Favorite removed' });
  } catch (error) {
    next(error);
  }
});

export default router;
