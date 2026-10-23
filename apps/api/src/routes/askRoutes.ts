import { Router } from 'express';
import { z } from 'zod';
import { streamTutorAnswer, TutorPageContext, TutorTurn } from '@edusheets/ai';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { aiLimiter } from '../middleware/rateLimiter';
import { validate } from '../middleware/validate';
import { resolveAiOverride, AiKeyRequiredError } from '../lib/resolveAiOverride';

const router: Router = Router();

router.use(requireAuth);
// "Ask about this page" is teacher/parent-only for now -- it spends the
// account's own AI key, and students don't have one. See middleware/auth.ts.
router.use(requireRole('teacher', 'parent'));

const askSchema = z.object({
  question: z.string().trim().min(1).max(1000),
  page: z.object({
    path: z.string().max(300),
    title: z.string().max(200),
    summary: z.string().max(1000).optional(),
    details: z.string().max(8000).optional(),
  }),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(4000),
  })).max(10).default([]),
});

// Streams the answer as plain UTF-8 text so the client can render (and
// start reading aloud) as it arrives. Errors before the first byte are
// normal JSON responses; an error after streaming has begun can only be
// signalled in-band, so it's appended after STREAM_ERROR_MARKER, which the
// client looks for (see apps/web/src/lib/ask.ts).
const STREAM_ERROR_MARKER = '\u0000ERROR:';

router.post('/', aiLimiter, validate(askSchema), async (req: AuthenticatedRequest, res, next) => {
  let aiOverride;
  try {
    aiOverride = await resolveAiOverride(req.supabase, req.user!.id);
  } catch (error) {
    if (error instanceof AiKeyRequiredError) {
      return res.status(400).json({ success: false, error: 'AI_KEY_REQUIRED' });
    }
    return next(error);
  }

  // Explicit types rather than z.infer: under a non-strict tsconfig z.infer
  // marks every field optional, which Vercel's stricter build rejects.
  const { question, page, history } = req.body as { question: string; page: TutorPageContext; history: TutorTurn[] };
  const audience = req.userRole === 'teacher' ? 'teacher' : 'parent';

  let started = false;
  try {
    for await (const text of streamTutorAnswer(aiOverride, page, audience, history, question)) {
      if (!started) {
        started = true;
        res.status(200);
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('X-Accel-Buffering', 'no');
      }
      res.write(text);
    }
    if (!started) return res.status(502).json({ success: false, error: 'The AI returned an empty answer. Please try again.' });
    res.end();
  } catch (error) {
    console.error('Ask stream failed:', error);
    const message = error instanceof Error ? error.message : 'The AI request failed.';
    if (!started) return res.status(502).json({ success: false, error: `AI provider error: ${message}` });
    res.end(`${STREAM_ERROR_MARKER}${message}`);
  }
});

export default router;
