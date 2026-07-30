import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { supabaseAdmin } from '../lib/supabase';

const router: Router = Router();

// Ensure only admins can access these routes
const requireAdmin = async (req: AuthenticatedRequest, res: any, next: any) => {
  try {
    const { data: profile } = await req.supabase!
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();
      
    if (profile?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden: Admins only' });
    }
    next();
  } catch (error) {
    next(error);
  }
};

router.use(requireAuth, requireAdmin);

router.get('/users', async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.patch('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ role })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/analytics', async (req, res, next) => {
  try {
    // Simple mock analytics
    const { count: userCount } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true });
    const { count: worksheetCount } = await supabaseAdmin.from('worksheets').select('*', { count: 'exact', head: true });
    
    res.json({ 
      success: true, 
      data: {
        total_users: userCount,
        total_worksheets: worksheetCount
      } 
    });
  } catch (error) {
    next(error);
  }
});

// Curriculum Management
const curriculumTypes = ['subjects', 'chapters', 'topics'] as const;

router.post('/curriculum/:type', async (req, res, next) => {
  try {
    const type = req.params.type as typeof curriculumTypes[number];
    if (!curriculumTypes.includes(type)) return res.status(400).json({ error: 'Invalid type' });
    
    const { data, error } = await supabaseAdmin.from(type).insert(req.body).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.put('/curriculum/:type/:id', async (req, res, next) => {
  try {
    const type = req.params.type as typeof curriculumTypes[number];
    if (!curriculumTypes.includes(type)) return res.status(400).json({ error: 'Invalid type' });

    const { data, error } = await supabaseAdmin.from(type).update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.delete('/curriculum/:type/:id', async (req, res, next) => {
  try {
    const type = req.params.type as typeof curriculumTypes[number];
    if (!curriculumTypes.includes(type)) return res.status(400).json({ error: 'Invalid type' });

    const { error } = await supabaseAdmin.from(type).delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
