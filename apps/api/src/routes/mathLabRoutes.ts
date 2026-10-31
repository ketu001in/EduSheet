import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { submitMathAttempt, regenerateMathAttemptPdf } from '../services/mathLabService';
import { getSignedURL } from '../services/storageService';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { MATH_GRADE_BANDS } from '@edusheets/content';
import { resolveCurriculumSelection } from '../lib/curriculumResolve';

const router: Router = Router();

router.use(requireAuth);
// Math Lab is open to ALL roles -- no requireRole gate, same as every other
// lab. No aiLimiter here either: this route never calls an AI provider (see
// mathLabService.ts's header comment).

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
    const result = await submitMathAttempt(req.body, req.user!.id, req.supabase);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/attempts', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { data, error } = await req.supabase!
      .from('math_experiment_attempts')
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
      .from('math_experiment_attempts')
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
      .from('math_experiment_attempts')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user!.id);

    if (error) throw error;
    res.json({ success: true, message: 'Math Lab attempt deleted' });
  } catch (error) {
    next(error);
  }
});

router.post('/attempts/:id/regenerate-pdf', async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await regenerateMathAttemptPdf(req.params.id, req.user!.id, req.supabase);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/attempts/:id/pdf', async (req: AuthenticatedRequest, res, next) => {
  try {
    const path = `math-lab-reports/${req.user!.id}/${req.params.id}.pdf`;
    const url = await getSignedURL(path);
    res.json({ success: true, url });
  } catch (error) {
    next(error);
  }
});

// Powers Math Lab's "Generate a worksheet on this" links -- the same
// board/class/subject/chapter resolution Ask AI's generate_worksheet tool
// uses (resolveCurriculumSelection), just reached directly with a Math Lab
// content entry's own chapterTags/gradeBand/board instead of an LLM's
// free-text guess. Subject is always "Mathematics" here, never guessed.
// Tries each chapterTag in turn (a chapter match is optional on the
// resolver, so this just gives several real-chapter-name shots at finding
// one before falling through to a board/class/subject-only selection).
const resolveTopicSchema = z.object({
  chapterTags: z.array(z.string()).default([]),
  gradeBand: z.enum(['early', 'junior', 'middle', 'senior', 'plusTwo']),
  board: z.enum(['CBSE', 'ICSE', 'both']),
});

router.post('/resolve-topic', validate(resolveTopicSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const { chapterTags, gradeBand, board } = req.body as z.infer<typeof resolveTopicSchema>;
    const band = MATH_GRADE_BANDS.find((b) => b.id === gradeBand);
    const classNumber = band?.classNumbers[0] ?? 6;
    const boardCode = board === 'both' ? 'CBSE' : board;

    let result = await resolveCurriculumSelection(req.supabase, {
      boardCode,
      className: `Class ${classNumber}`,
      subjectName: 'Mathematics',
    });
    if ('error' in result) {
      res.status(404).json({ success: false, error: result.error });
      return;
    }

    for (const tag of chapterTags) {
      const withChapter = await resolveCurriculumSelection(req.supabase, {
        boardCode,
        className: `Class ${classNumber}`,
        subjectName: 'Mathematics',
        chapterName: tag,
      });
      if (!('error' in withChapter) && withChapter.chapterId) {
        result = withChapter;
        break;
      }
    }

    res.json({ success: true, selection: result });
  } catch (error) {
    next(error);
  }
});

export default router;
