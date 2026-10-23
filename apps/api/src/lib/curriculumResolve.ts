// Resolves the free-text board/class/subject/chapter names an LLM's
// generate_worksheet tool call produces into the real curriculum IDs
// /api/worksheets/generate actually needs -- the model can't know real UUIDs,
// so this is a deterministic, non-AI lookup against the same tables
// apps/api/src/routes/curriculumRoutes.ts already queries.
//
// Matching is intentionally simple (case-insensitive exact-or-contains) --
// it will not resolve every synonym a user might say (e.g. "Civics" doesn't
// match the real subject name "Political Science" at Class 11-12). A failed
// match is reported by name so the caller can ask the user to be more
// specific rather than silently guessing.

export interface ResolvedCurriculumSelection {
  boardId: string;
  board: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  chapterId?: string;
  chapterName?: string;
}

export interface CurriculumResolveFailure {
  error: string; // names exactly what wasn't found, e.g. "the subject \"Biology\" for Class 8 CBSE"
}

export async function resolveCurriculumSelection(
  supabase: any,
  input: { boardCode: string; className: string; subjectName: string; chapterName?: string }
): Promise<ResolvedCurriculumSelection | CurriculumResolveFailure> {
  // Two sequential queries rather than a single `.or()` filter string --
  // the free-text boardCode comes straight from the LLM, and interpolating
  // it into a PostgREST filter-string expression (which uses its own
  // comma/paren syntax) is a needless injection/parsing risk for no benefit
  // over a plain second query.
  let board;
  {
    const { data } = await supabase.from('boards').select('id, code, name').ilike('code', input.boardCode).limit(1);
    board = data?.[0];
  }
  if (!board) {
    const { data } = await supabase.from('boards').select('id, code, name').ilike('name', `%${input.boardCode}%`).limit(1);
    board = data?.[0];
  }
  if (!board) return { error: `the board "${input.boardCode}"` };

  // Classes are shared/global (board_id NULL) for real exam boards like
  // CBSE/ICSE -- only alt-pedagogy boards (Montessori etc.) have board_id set.
  // Prefer a grade number parsed from the name ("Class 8" -> 8); fall back to
  // a name match for alt-pedagogy stage names ("Lower Elementary").
  const gradeMatch = input.className.match(/\d+/);
  let classRow;
  if (gradeMatch) {
    const { data } = await supabase
      .from('classes')
      .select('id, grade_number, name')
      .is('board_id', null)
      .eq('grade_number', Number(gradeMatch[0]))
      .limit(1);
    classRow = data?.[0];
  }
  if (!classRow) {
    const { data } = await supabase
      .from('classes')
      .select('id, grade_number, name')
      .or(`board_id.is.null,board_id.eq.${board.id}`)
      .ilike('name', `%${input.className}%`)
      .limit(1);
    classRow = data?.[0];
  }
  if (!classRow) return { error: `"${input.className}" for ${board.code}` };

  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name')
    .eq('class_id', classRow.id)
    .eq('board_id', board.id)
    .ilike('name', `%${input.subjectName}%`)
    .order('name')
    .limit(1);
  const subject = subjects?.[0];
  if (!subject) return { error: `the subject "${input.subjectName}" for ${classRow.name} ${board.code}` };

  let chapter: { id: string; title: string } | undefined;
  if (input.chapterName) {
    const { data: chapters } = await supabase
      .from('chapters')
      .select('id, title')
      .eq('subject_id', subject.id)
      .ilike('title', `%${input.chapterName}%`)
      .order('chapter_number')
      .limit(1);
    chapter = chapters?.[0];
    // A chapter name that doesn't match isn't a hard failure -- chapterId is
    // optional on the generate endpoint, so fall through without one rather
    // than blocking the whole selection over it.
  }

  return {
    boardId: board.id,
    board: board.code,
    classId: classRow.id,
    className: classRow.name,
    subjectId: subject.id,
    subjectName: subject.name,
    chapterId: chapter?.id,
    chapterName: chapter?.title,
  };
}
