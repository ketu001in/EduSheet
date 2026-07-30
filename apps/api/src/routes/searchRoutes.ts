import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router: Router = Router();
router.use(requireAuth);

router.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { q, type, filters } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ success: false, error: 'Query parameter q is required' });
    }

    // A simple full text search implementation using Supabase textSearch
    const results = [];
    
    if (!type || type === 'worksheets') {
      const { data, error } = await req.supabase!
        .from('worksheets')
        .select('id, title, created_at')
        .eq('user_id', req.user.id)
        .ilike('title', `%${q}%`)
        .limit(10);
      if (!error && data) results.push(...data.map(d => ({ ...d, type: 'worksheet' })));
    }
    
    if (!type || type === 'topics') {
      const { data, error } = await req.supabase!
        .from('topics')
        .select('id, name')
        .ilike('name', `%${q}%`)
        .limit(10);
      if (!error && data) results.push(...data.map(d => ({ ...d, type: 'topic' })));
    }

    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
});

export default router;
