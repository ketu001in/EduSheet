import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { fetchNavConfigForRole } from '../services/navConfigService';

const router: Router = Router();
router.use(requireAuth);

// Any signed-in role can read the live menu, already filtered/nested for
// their own role -- this is what apps/web's useNavItems() hook fetches on
// every page load (with the previous static list as an instant fallback
// while this resolves).
router.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const tree = await fetchNavConfigForRole(req.userRole || 'student');
    res.json({ success: true, data: tree });
  } catch (error) {
    next(error);
  }
});

// Everything past here is admin-only -- the Menu Manager screen at /admin/menu.
router.use(requireRole('admin'));

router.get('/raw', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { data, error } = await req.supabase!.from('nav_items').select('*').order('order_index');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

const itemSchema = z.object({
  label: z.string().min(1),
  href: z.string().nullable().optional(),
  iconName: z.string().min(1),
  isGroup: z.boolean().optional(),
  parentGroupId: z.string().uuid().nullable().optional(),
  orderIndex: z.number().optional(),
  visible: z.boolean().optional(),
  roleVisibility: z.array(z.enum(['student', 'parent', 'teacher', 'admin'])).min(1).optional(),
});

router.post('/', validate(itemSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const b = req.body;
    const { data, error } = await req.supabase!
      .from('nav_items')
      .insert({
        label: b.label,
        href: b.href ?? null,
        icon_name: b.iconName,
        is_group: b.isGroup ?? false,
        parent_group_id: b.parentGroupId ?? null,
        order_index: b.orderIndex ?? 0,
        visible: b.visible ?? true,
        role_visibility: b.roleVisibility ?? ['student', 'parent', 'teacher', 'admin'],
      })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

const updateSchema = itemSchema.partial();

router.put('/:id', validate(updateSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const b = req.body;
    const patch: Record<string, unknown> = {};
    if (b.label !== undefined) patch.label = b.label;
    if (b.href !== undefined) patch.href = b.href;
    if (b.iconName !== undefined) patch.icon_name = b.iconName;
    if (b.isGroup !== undefined) patch.is_group = b.isGroup;
    if (b.parentGroupId !== undefined) patch.parent_group_id = b.parentGroupId;
    if (b.orderIndex !== undefined) patch.order_index = b.orderIndex;
    if (b.visible !== undefined) patch.visible = b.visible;
    if (b.roleVisibility !== undefined) patch.role_visibility = b.roleVisibility;

    const { data, error } = await req.supabase!.from('nav_items').update(patch).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Batch reorder -- the Menu Manager sends the full new order in one call
// after a drag/move rather than one PUT per item.
const reorderSchema = z.object({
  items: z.array(z.object({ id: z.string().uuid(), orderIndex: z.number() })).min(1),
});

router.put('/reorder', validate(reorderSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    for (const item of req.body.items) {
      const { error } = await req.supabase!.from('nav_items').update({ order_index: item.orderIndex }).eq('id', item.id);
      if (error) throw error;
    }
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { error } = await req.supabase!.from('nav_items').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Nav item deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
