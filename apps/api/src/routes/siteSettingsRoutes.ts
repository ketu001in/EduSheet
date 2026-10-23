import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router: Router = Router();
router.use(requireAuth);

// Any signed-in user can read site settings (branding + voice preference
// need to apply for every role, not just admins).
router.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { data, error } = await req.supabase!.from('site_settings').select('*');
    if (error) throw error;
    const asMap: Record<string, unknown> = {};
    for (const row of data || []) asMap[row.key] = row.value;
    res.json({ success: true, data: asMap });
  } catch (error) {
    next(error);
  }
});

// Only admins can change them -- the Site Settings screen at /admin/settings.
router.use(requireRole('admin'));

const putSchema = z.object({ value: z.record(z.string(), z.any()) });

router.put('/:key', validate(putSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const { data, error } = await req.supabase!
      .from('site_settings')
      .upsert({ key: req.params.key, value: req.body.value }, { onConflict: 'key' })
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

export default router;
