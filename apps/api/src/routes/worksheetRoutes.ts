import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { aiLimiter } from '../middleware/rateLimiter';
import { generateWorksheet, generateCustomWorksheet, regenerateWorksheetPdf } from '../services/worksheetService';
import { getSignedURL } from '../services/storageService';
import { resolveAiOverride, AiKeyRequiredError } from '../lib/resolveAiOverride';
import { z } from 'zod';
import { validate } from '../middleware/validate';

const router: Router = Router();

router.use(requireAuth);

const generateSchema = z.object({
  title: z.string().optional(),
  board: z.string().default('CBSE'),
  classId: z.string(),
  className: z.string(),
  subjectId: z.string(),
  subjectName: z.string(),
  chapterId: z.string().optional(),
  chapterName: z.string().optional(),
  topicIds: z.array(z.string()).default([]),
  topics: z.array(z.string()).default([]),
  difficulty: z.enum(['easy', 'medium', 'hard', 'mixed']),
  questionCount: z.number().min(1).max(50),
  questionTypes: z.array(z.string()).min(1),
  language: z.string().optional(),
});

router.post('/generate', aiLimiter, validate(generateSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const aiOverride = await resolveAiOverride(req.supabase, req.user!.id);
    const result = await generateWorksheet(req.body, req.user!.id, req.supabase, aiOverride);
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
  requirement: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard', 'mixed']).default('mixed'),
  questionCount: z.number().min(1).max(50),
  questionTypes: z.array(z.string()).min(1),
  language: z.string().optional(),
});

router.post('/generate-custom', aiLimiter, validate(generateCustomSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const aiOverride = await resolveAiOverride(req.supabase, req.user!.id);
    const result = await generateCustomWorksheet(req.body, req.user!.id, req.supabase, aiOverride);
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
      .from('worksheets')
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
    const { data: worksheet, error: wsError } = await req.supabase!
      .from('worksheets')
      .select('*, classes(name), subjects(name), chapters(title), worksheet_questions(*)')
      .eq('id', req.params.id)
      .eq('creator_id', req.user!.id)
      .single();

    if (wsError) throw wsError;
    res.json({ success: true, data: worksheet });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { error } = await req.supabase!
      .from('worksheets')
      .delete()
      .eq('id', req.params.id)
      .eq('creator_id', req.user!.id);

    if (error) throw error;
    res.json({ success: true, message: 'Worksheet deleted' });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/duplicate', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { data: original, error: fetchError } = await req.supabase!
      .from('worksheets')
      .select('*, worksheet_questions(*)')
      .eq('id', req.params.id)
      .eq('creator_id', req.user!.id)
      .single();

    if (fetchError) throw fetchError;

    const { worksheet_questions, id, created_at, updated_at, ...worksheetFields } = original;

    const { data: copy, error: copyError } = await req.supabase!
      .from('worksheets')
      .insert({ ...worksheetFields, title: `${original.title} (Copy)`, creator_id: req.user!.id })
      .select()
      .single();

    if (copyError) throw copyError;

    if (worksheet_questions?.length > 0) {
      const questionsCopy = worksheet_questions.map((q: any) => {
        const { id: _qid, worksheet_id, created_at: _qcreated, ...rest } = q;
        return { ...rest, worksheet_id: copy.id };
      });
      const { error: qError } = await req.supabase!.from('worksheet_questions').insert(questionsCopy);
      if (qError) throw qError;
    }

    res.status(201).json({ success: true, data: copy });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/regenerate-pdf', async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await regenerateWorksheetPdf(req.params.id, req.user!.id, req.supabase);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/pdf', async (req: AuthenticatedRequest, res, next) => {
  try {
    const path = `${req.user!.id}/${req.params.id}.pdf`;
    const url = await getSignedURL(path);
    res.json({ success: true, url });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/answer-key', async (req: AuthenticatedRequest, res, next) => {
  try {
    const path = `${req.user!.id}/${req.params.id}-answers.pdf`;
    const url = await getSignedURL(path);
    res.json({ success: true, url });
  } catch (error) {
    next(error);
  }
});

export default router;
