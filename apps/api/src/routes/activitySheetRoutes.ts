import { Router } from 'express';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { aiLimiter } from '../middleware/rateLimiter';
import { generateActivitySheet, regenerateActivitySheetPdf } from '../services/activitySheetService';
import { getSignedURL } from '../services/storageService';
import { resolveAiOverride, AiKeyRequiredError } from '../lib/resolveAiOverride';
import { z } from 'zod';
import { validate } from '../middleware/validate';

const router: Router = Router();

router.use(requireAuth);
// Activity Sheet generation is teacher/parent-only, same gate as Study
// Material -- an adult-facilitated tool, not something students generate for
// themselves. See middleware/auth.ts.
router.use(requireRole('teacher', 'parent'));

const generateSchema = z.object({
  title: z.string().optional(),
  board: z.string().optional(),
  classId: z.string(),
  className: z.string(),
  subjectId: z.string(),
  subjectName: z.string(),
  chapterId: z.string().optional(),
  chapterName: z.string().optional(),
  topicIds: z.array(z.string()).default([]),
  topics: z.array(z.string()).min(1),
  language: z.string().optional(),
});

router.post('/generate', aiLimiter, validate(generateSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const aiOverride = await resolveAiOverride(req.supabase, req.user!.id);
    const result = await generateActivitySheet(req.body, req.user!.id, req.supabase, aiOverride);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof AiKeyRequiredError) {
      return res.status(400).json({ success: false, error: 'AI_KEY_REQUIRED' });
    }
    next(error);
  }
});

router.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { data, error } = await req.supabase!
      .from('activity_sheets')
      .select('*, classes(name), subjects(name), chapters(title)')
      .eq('creator_id', req.user!.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { data: activitySheet, error } = await req.supabase!
      .from('activity_sheets')
      .select('*, classes(name), subjects(name), chapters(title)')
      .eq('id', req.params.id)
      .eq('creator_id', req.user!.id)
      .single();

    if (error) throw error;
    res.json({ success: true, data: activitySheet });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { error } = await req.supabase!
      .from('activity_sheets')
      .delete()
      .eq('id', req.params.id)
      .eq('creator_id', req.user!.id);

    if (error) throw error;
    res.json({ success: true, message: 'Activity sheet deleted' });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/regenerate-pdf', async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await regenerateActivitySheetPdf(req.params.id, req.user!.id, req.supabase);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/pdf', async (req: AuthenticatedRequest, res, next) => {
  try {
    const path = `activity-sheets/${req.user!.id}/${req.params.id}.pdf`;
    const url = await getSignedURL(path);
    res.json({ success: true, url });
  } catch (error) {
    next(error);
  }
});

export default router;
