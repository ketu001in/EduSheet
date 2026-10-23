import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router: Router = Router();

router.use(requireAuth);

router.get('/boards', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { data, error } = await req.supabase!.from('boards').select('*').order('name');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/classes', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { boardId } = req.query;

    // Alternative-pedagogy boards (Montessori/Reggio Emilia/Steiner-Waldorf)
    // have their own age-stage classes scoped to them via board_id -- e.g.
    // "Primary (Ages 3-6)" instead of "Class 1". Prefer those when the board
    // has any; otherwise fall back to the shared/global classes (CBSE/ICSE's
    // Class 1-12, LKG, UKG, which have board_id NULL).
    if (boardId) {
      const { data: scoped, error: scopedError } = await req.supabase!
        .from('classes')
        .select('*')
        .eq('board_id', boardId)
        .order('grade_number');
      if (scopedError) throw scopedError;
      if (scoped && scoped.length > 0) {
        return res.json({ success: true, data: scoped });
      }
    }

    const { data, error } = await req.supabase!.from('classes').select('*').is('board_id', null).order('grade_number');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/subjects', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { classId, boardId } = req.query;
    let query = req.supabase!.from('subjects').select('*');
    if (classId) query = query.eq('class_id', classId);
    if (boardId) query = query.eq('board_id', boardId);
    
    const { data, error } = await query.order('name');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/chapters', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { subjectId } = req.query;
    if (!subjectId) return res.status(400).json({ success: false, error: 'subjectId is required' });
    
    const { data, error } = await req.supabase!.from('chapters').select('*').eq('subject_id', subjectId).order('chapter_number');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/topics', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { chapterId } = req.query;
    if (!chapterId) return res.status(400).json({ success: false, error: 'chapterId is required' });
    
    const { data, error } = await req.supabase!.from('topics').select('*').eq('chapter_id', chapterId).order('topic_number');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

export default router;
