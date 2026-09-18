import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { aiLimiter } from '../middleware/rateLimiter';
import { generateTechProject, regenerateTechProjectPdf } from '../services/techProjectService';
import { getSignedURL } from '../services/storageService';
import { resolveAiOverride, AiKeyRequiredError } from '../lib/resolveAiOverride';
import { z } from 'zod';
import { validate } from '../middleware/validate';

const router: Router = Router();

router.use(requireAuth);
// Tech Lab (Robotics/AI/Coding) is open to ALL roles -- students generate
// these for themselves too, same access model as worksheets/projects. No
// requireRole gate here, unlike Study Material / Activity Sheet.

const generateSchema = z.object({
  title: z.string().optional(),
  boardId: z.string().optional(),
  board: z.string().optional(),
  classId: z.string(),
  className: z.string(),
  category: z.enum(['robotics', 'ai', 'coding']),
  ideaPrompt: z.string().min(1),
  language: z.string().optional(),
});

router.post('/generate', aiLimiter, validate(generateSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const aiOverride = await resolveAiOverride(req.supabase, req.user!.id);
    const result = await generateTechProject(req.body, req.user!.id, req.supabase, aiOverride);
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
      .from('tech_projects')
      .select('*, classes(name), boards(name)')
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
    const { data: techProject, error } = await req.supabase!
      .from('tech_projects')
      .select('*, classes(name), boards(name)')
      .eq('id', req.params.id)
      .eq('creator_id', req.user!.id)
      .single();

    if (error) throw error;
    res.json({ success: true, data: techProject });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { error } = await req.supabase!
      .from('tech_projects')
      .delete()
      .eq('id', req.params.id)
      .eq('creator_id', req.user!.id);

    if (error) throw error;
    res.json({ success: true, message: 'Tech project deleted' });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/regenerate-pdf', async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await regenerateTechProjectPdf(req.params.id, req.user!.id, req.supabase);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/pdf', async (req: AuthenticatedRequest, res, next) => {
  try {
    const path = `tech-projects/${req.user!.id}/${req.params.id}.pdf`;
    const url = await getSignedURL(path);
    res.json({ success: true, url });
  } catch (error) {
    next(error);
  }
});

export default router;
