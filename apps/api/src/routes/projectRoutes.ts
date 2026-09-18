import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { aiLimiter } from '../middleware/rateLimiter';
import { generateProject, generateCustomProject, regenerateProjectPdf } from '../services/projectService';
import { getSignedURL } from '../services/storageService';
import { resolveAiOverride, AiKeyRequiredError } from '../lib/resolveAiOverride';
import { z } from 'zod';
import { validate } from '../middleware/validate';

const router: Router = Router();

router.use(requireAuth);

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
  length: z.enum(['short', 'medium', 'long']).default('medium'),
  language: z.string().optional(),
});

router.post('/generate', aiLimiter, validate(generateSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const aiOverride = await resolveAiOverride(req.supabase, req.user!.id);
    const result = await generateProject(req.body, req.user!.id, req.supabase, aiOverride);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof AiKeyRequiredError) {
      return res.status(400).json({ success: false, error: 'AI_KEY_REQUIRED' });
    }
    next(error);
  }
});

const generateCustomSchema = z.object({
  title: z.string().optional(),
  className: z.string().min(1),
  subjectName: z.string().min(1),
  topic: z.string().min(1),
  description: z.string().optional(),
  length: z.enum(['short', 'medium', 'long']).default('medium'),
  language: z.string().optional(),
});

router.post('/generate-custom', aiLimiter, validate(generateCustomSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const aiOverride = await resolveAiOverride(req.supabase, req.user!.id);
    const result = await generateCustomProject(req.body, req.user!.id, req.supabase, aiOverride);
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
      .from('projects')
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
    const { data: project, error } = await req.supabase!
      .from('projects')
      .select('*, classes(name), subjects(name), chapters(title)')
      .eq('id', req.params.id)
      .eq('creator_id', req.user!.id)
      .single();

    if (error) throw error;
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { error } = await req.supabase!
      .from('projects')
      .delete()
      .eq('id', req.params.id)
      .eq('creator_id', req.user!.id);

    if (error) throw error;
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/regenerate-pdf', async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await regenerateProjectPdf(req.params.id, req.user!.id, req.supabase);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/pdf', async (req: AuthenticatedRequest, res, next) => {
  try {
    const path = `projects/${req.user!.id}/${req.params.id}.pdf`;
    const url = await getSignedURL(path);
    res.json({ success: true, url });
  } catch (error) {
    next(error);
  }
});

export default router;
