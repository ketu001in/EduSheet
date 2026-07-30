import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { encryptSecret } from '../lib/encryption';
import { z } from 'zod';
import { validate } from '../middleware/validate';

const router: Router = Router();
router.use(requireAuth);

const profileUpdateSchema = z.object({
  full_name: z.string().optional(),
  avatar_url: z.string().url().optional(),
  board_id: z.string().optional(),
  class_id: z.string().optional()
});

router.get('/profile', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { data, error } = await req.supabase!
      .from('user_profiles')
      .select('*, boards(*), classes(*), users(full_name, email, avatar_url, role)')
      .eq('user_id', req.user!.id)
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.patch('/profile', validate(profileUpdateSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const { full_name, avatar_url, ...profileFields } = req.body;

    if (full_name !== undefined || avatar_url !== undefined) {
      const { error: userError } = await req.supabase!
        .from('users')
        .update({ ...(full_name !== undefined && { full_name }), ...(avatar_url !== undefined && { avatar_url }) })
        .eq('id', req.user!.id);
      if (userError) throw userError;
    }

    const { data, error } = await req.supabase!
      .from('user_profiles')
      .update(profileFields)
      .eq('user_id', req.user!.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/children', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { data, error } = await req.supabase!
      .from('parent_children')
      .select('child_id, status, users!parent_children_child_id_fkey(*)')
      .eq('parent_id', req.user!.id)
      .eq('status', 'approved');

    if (error) throw error;
    res.json({ success: true, data: data.map((d: any) => d.users) });
  } catch (error) {
    next(error);
  }
});

router.get('/ai-settings', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { data, error } = await req.supabase!
      .from('user_profiles')
      .select('ai_provider, ai_api_key_encrypted')
      .eq('user_id', req.user!.id)
      .single();

    if (error) throw error;
    res.json({ success: true, data: { provider: data.ai_provider, hasKey: !!data.ai_api_key_encrypted } });
  } catch (error) {
    next(error);
  }
});

const aiSettingsSchema = z.object({
  provider: z.enum(['groq', 'openai', 'gemini']),
  apiKey: z.string().min(10, 'That API key looks too short.'),
});

router.put('/ai-settings', validate(aiSettingsSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const encrypted = encryptSecret(req.body.apiKey);
    const { error } = await req.supabase!
      .from('user_profiles')
      .update({ ai_provider: req.body.provider, ai_api_key_encrypted: encrypted })
      .eq('user_id', req.user!.id);

    if (error) throw error;
    res.json({ success: true, data: { provider: req.body.provider, hasKey: true } });
  } catch (error) {
    next(error);
  }
});

router.delete('/ai-settings', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { error } = await req.supabase!
      .from('user_profiles')
      .update({ ai_provider: null, ai_api_key_encrypted: null })
      .eq('user_id', req.user!.id);

    if (error) throw error;
    res.json({ success: true, data: { provider: null, hasKey: false } });
  } catch (error) {
    next(error);
  }
});

const linkChildSchema = z.object({
  child_email: z.string().email(),
  link_code: z.string()
});

router.post('/link-child', validate(linkChildSchema), async (req: AuthenticatedRequest, res, next) => {
  // Implementation depends on exactly how child linking is structured
  res.status(501).json({ success: false, error: 'Not implemented yet' });
});

export default router;
