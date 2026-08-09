import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { submitPhysicsAttempt, regeneratePhysicsAttemptPdf } from '../services/physicsLabService';
import { getSignedURL } from '../services/storageService';
import { z } from 'zod';
import { validate } from '../middleware/validate';

const router: Router = Router();

router.use(requireAuth);
// Physics Lab is open to ALL roles -- no requireRole gate, same as Chem Lab
// and Tech Lab. No aiLimiter here either: this route never calls an AI
// provider (see physicsLabService.ts's header comment).

const submitSchema = z.object({
  experimentId: z.string().min(1),
  experimentTitle: z.string().optional(),
  boardId: z.string().optional(),
  classId: z.string().optional(),
  className: z.string().optional(),
  predictAnswerIndex: z.number(),
  predictCorrect: z.boolean(),
  observations: z.record(z.string(), z.string()).default({}),
  finalParams: z.record(z.string(), z.number()).optional(),
  language: z.string().optional(),
});

router.post('/attempts', validate(submitSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await submitPhysicsAttempt(req.body, req.user!.id, req.supabase);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/attempts', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { data, error } = await req.supabase!
      .from('physics_experiment_attempts')
      .select('*, classes(name), boards(name)')
      .eq('user_id', req.user!.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/attempts/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { data, error } = await req.supabase!
      .from('physics_experiment_attempts')
      .select('*, classes(name), boards(name)')
      .eq('id', req.params.id)
      .eq('user_id', req.user!.id)
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.delete('/attempts/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { error } = await req.supabase!
      .from('physics_experiment_attempts')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user!.id);

    if (error) throw error;
    res.json({ success: true, message: 'Physics Lab attempt deleted' });
  } catch (error) {
    next(error);
  }
});

router.post('/attempts/:id/regenerate-pdf', async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await regeneratePhysicsAttemptPdf(req.params.id, req.user!.id, req.supabase);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/attempts/:id/pdf', async (req: AuthenticatedRequest, res, next) => {
  try {
    const path = `physics-lab-reports/${req.user!.id}/${req.params.id}.pdf`;
    const url = await getSignedURL(path);
    res.json({ success: true, url });
  } catch (error) {
    next(error);
  }
});

export default router;
