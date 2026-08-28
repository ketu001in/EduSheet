import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router: Router = Router();
router.use(requireAuth);

// Any signed-in user can read the overrides for a content type -- their
// app needs these to render the merged (static + admin-edited) content,
// see apps/web/src/lib/useContent.ts.
router.get('/:type', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { data, error } = await req.supabase!
      .from('content_overrides')
      .select('*')
      .eq('content_type', req.params.type);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Everything past here is admin-only -- the Content Manager at /admin/content.
router.use(requireRole('admin'));

const upsertSchema = z.object({
  data: z.record(z.string(), z.any()),
});

router.put('/:type/:itemKey', validate(upsertSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const { data, error } = await req.supabase!
      .from('content_overrides')
      .upsert(
        {
          content_type: req.params.type,
          item_key: req.params.itemKey,
          data: req.body.data,
          deleted: false,
          updated_by: req.user!.id,
        },
        { onConflict: 'content_type,item_key' }
      )
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Soft-delete: marks a static item as hidden (deleted=true, data cleared)
// rather than removing the row, so the merge logic knows to hide it even
// though the static base array still has it.
router.post('/:type/:itemKey/hide', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { data, error } = await req.supabase!
      .from('content_overrides')
      .upsert(
        { content_type: req.params.type, item_key: req.params.itemKey, data: null, deleted: true, updated_by: req.user!.id },
        { onConflict: 'content_type,item_key' }
      )
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Fully removes the override row -- reverts an edited item back to its
// original static values, or removes a hide-flag, or deletes a brand-new
// admin-created item entirely.
router.delete('/:type/:itemKey', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { error } = await req.supabase!
      .from('content_overrides')
      .delete()
      .eq('content_type', req.params.type)
      .eq('item_key', req.params.itemKey);
    if (error) throw error;
    res.json({ success: true, message: 'Override removed -- reverted to the original static content' });
  } catch (error) {
    next(error);
  }
});

export default router;
