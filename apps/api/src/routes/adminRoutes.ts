import { Router } from 'express';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { supabaseAdmin } from '../lib/supabase';

const router: Router = Router();

// Was previously gated by a locally-defined requireAdmin that queried a
// `profiles` table -- that table doesn't exist in this schema (the real
// one is `public.users`, see middleware/auth.ts), so every admin route was
// silently 500ing. Fixed to reuse the same requireRole('admin') every other
// role-gated route in the app already uses, checked against req.userRole
// (populated by requireAuth from the real `users.role` column).
router.use(requireAuth, requireRole('admin'));

router.get('/users', async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, username, role, created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.patch('/users/:id/role', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { role } = req.body;
    const validRoles = ['student', 'parent', 'teacher', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, error: `role must be one of: ${validRoles.join(', ')}` });
    }
    // An admin can't demote themselves via this route -- avoids a single
    // careless click accidentally locking the only admin out of /admin.
    if (req.params.id === req.user!.id && role !== 'admin') {
      return res.status(400).json({ success: false, error: "You can't remove your own admin role here -- have another admin do it." });
    }
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ role })
      .eq('id', req.params.id)
      .select('id, email, full_name, username, role')
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/analytics', async (req, res, next) => {
  try {
    const [{ count: totalUsers }, { count: totalWorksheets }, { count: totalProjects }] = await Promise.all([
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('worksheets').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('projects').select('*', { count: 'exact', head: true }),
    ]);

    res.json({
      success: true,
      data: { total_users: totalUsers ?? 0, total_worksheets: totalWorksheets ?? 0, total_projects: totalProjects ?? 0 },
    });
  } catch (error) {
    next(error);
  }
});

// Curriculum Management -- these three tables (subjects/chapters/topics)
// are real and already used by worksheet generation, so this part was
// already correct; kept as-is.
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
