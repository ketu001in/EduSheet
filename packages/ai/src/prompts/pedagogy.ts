// Alternative-pedagogy boards (Montessori, Reggio Emilia, Steiner/Waldorf)
// need a fundamentally different tone and structure than a standard exam
// board like CBSE/ICSE -- not just "easier questions for younger kids".
// Each has real, documented philosophies that actively reject rote drilling
// (especially Reggio Emilia and Waldorf's early years), so the standard MCQ/
// fill-in-the-blank worksheet format is often the WRONG shape of content
// entirely, not just the wrong difficulty. This maps a board name to
// specific guidance injected into both the system prompt and the per-request
// prompt.
function matchBoard(board: string | undefined, needle: string): boolean {
  return !!board && board.toLowerCase().includes(needle);
}

export function isAlternativePedagogy(board?: string): boolean {
  return matchBoard(board, 'montessori') || matchBoard(board, 'reggio') || matchBoard(board, 'waldorf') || matchBoard(board, 'steiner');
}

// Kept intentionally terse (this text is added to EVERY alternative-pedagogy
// request's system prompt, on top of the base prompt and per-question-type
// instructions) -- a verbose version of this once pushed a 15-question/hard
// request over Groq's per-minute token limit (413, request too large).
export function getPedagogySystemGuidance(board?: string): string {
  if (matchBoard(board, 'montessori')) {
    return `
This is for MONTESSORI, not a standard exam board: self-directed, hands-on, five curriculum areas (Practical
Life, Sensorial, Language, Mathematics, Cultural Studies). Favor concrete materials-based tasks and self-
correcting activities over graded/timed exam framing.`;
  }
  if (matchBoard(board, 'reggio')) {
    return `
This is for REGGIO EMILIA, not a standard exam board: project-based, emergent, for ages 0-6, built on "the
hundred languages of children." Avoid conventional drill questions (MCQ/fill-blank/true-false) as the main
content -- favor open-ended, exploratory, creative-arts framing even where the question type is structured.`;
  }
  if (matchBoard(board, 'steiner') || matchBoard(board, 'waldorf')) {
    return `
This is for STEINER/WALDORF, not a standard exam board: "head, heart, hands," avoiding early formal testing.
Early Childhood (0-7): no test-style questions, favor stories/rhymes/imitative play. Elementary (7-14): frame
like a Waldorf "main lesson" -- narrative/thematic (mythology, nature stories) tied to artistic/practical work.
Secondary (14-18): more academic depth is fine, still prefer thematic/project framing over rote drilling.`;
  }
  return '';
}

export function getPedagogyRequestGuidance(board?: string): string {
  if (matchBoard(board, 'montessori')) {
    return `Montessori framing: curriculum-area language (Practical Life, Sensorial, Cultural Studies), self-correcting and hands-on, not exam-style.\n`;
  }
  if (matchBoard(board, 'reggio')) {
    return `Reggio Emilia framing: open-ended, exploratory, creative-arts -- not conventional test questions.\n`;
  }
  if (matchBoard(board, 'steiner') || matchBoard(board, 'waldorf')) {
    return `Waldorf framing: narrative, artistic, practical -- avoid rote-testing language, especially for Early Childhood.\n`;
  }
  return '';
}
