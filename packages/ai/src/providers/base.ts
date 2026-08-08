export interface WorksheetPromptConfig {
  classLevel: string;
  subject: string;
  chapter?: string;
  topics: string[];
  questionTypes: Record<string, number>;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  language?: string;
  // Free-text ask from the "custom" generation flow (any class/board, not tied
  // to the curriculum tables) -- extra instructions layered on top of the
  // standard prompt, e.g. "focus on real-life examples involving cricket".
  customInstructions?: string;
  // The board/pedagogy name (e.g. "CBSE", "Montessori", "Reggio Emilia",
  // "Steiner / Waldorf") -- alternative pedagogies need a fundamentally
  // different tone/structure than a standard exam board, not just an
  // easier reading level (see prompts/systemPrompt.ts and worksheetPrompt.ts).
  board?: string;
}

// Legacy vector-shape schema -- kept only so already-saved worksheets (whose
// `diagram` JSONB still has this shape) keep rendering after this change. The
// AI is no longer instructed to produce these; see DiagramSpec's imagePrompt/
// labelPoints instead, which uses a real generated image.
export interface DiagramShape {
  type: 'rect' | 'circle' | 'ellipse' | 'line' | 'arrow' | 'polygon';
  x: number;
  y: number;
  width?: number;
  height?: number;
  rx?: number;
  ry?: number;
  x2?: number;
  y2?: number;
  points?: string;
  fill?: string;
  rotation?: number;
  label: string;
}

// A point identifying a named part's approximate location on the generated
// image, as a percentage of the image's width/height (0-100) -- used to
// overlay a numbered marker (worksheet) or the real label (answer key).
export interface DiagramLabelPoint {
  x: number;
  y: number;
  label: string;
}

// Doubles as the general-purpose "question extras" shape stored in
// worksheet_questions.diagram (JSONB) -- despite the name, it also carries
// tracing/picture-matching data (traceContent/matchImages/matchImageUrls),
// reusing one column/type end-to-end (AI -> DB -> PDF -> web preview) instead
// of a dedicated column per new question type.
export interface DiagramSpec {
  // "diagram"/"coloring" questions: a real image generated from `imagePrompt`
  // (filled in by apps/api after generation, not by the AI itself), with
  // named parts pinned to approximate locations via `labelPoints` ("coloring"
  // omits labelPoints -- there's nothing to label, just color).
  imagePrompt?: string;
  imageUrl?: string;
  labelPoints?: DiagramLabelPoint[];
  // True only when `labelPoints` came from a vision model that actually
  // looked at the generated image (AIProvider.verifyImageLabels) -- the AI's
  // original labelPoints are a blind guess made before the image exists, and
  // often don't match where the image model actually drew each part. Callers
  // must NOT render pinpoint markers unless this is true; render a plain
  // unpinned list instead (see pdfService.tsx's ImageWithLegendView).
  labelPointsVerified?: boolean;

  // "tracing" questions: the short text to trace (e.g. "A", "3", "cat").
  traceContent?: string;

  // "match" questions: an optional image-generation prompt for each Column A
  // entry (parallel array to `options`), turning a plain text-match question
  // into a picture-matching one, plus the resulting stored image URLs (same
  // order/length, `null` for any single image that failed to generate).
  matchImages?: string[];
  matchImageUrls?: (string | null)[];

  // Legacy vector-shape schema (see DiagramShape) -- present only on
  // worksheets generated before this change.
  viewBox?: string;
  shapes?: DiagramShape[];
}

export interface Question {
  id: string;
  type: string;
  text: string;
  options?: string[];
  answer: string | string[] | boolean;
  explanation?: string;
  marks: number;
  // "diagram" and "coloring" type questions: for "coloring", only imagePrompt
  // is used (a real outline/line-art image to color in) -- labelPoints don't
  // apply since there's nothing to label, just color.
  diagram?: DiagramSpec;
  // "tracing" type questions: the short text to trace (e.g. "A", "3", "cat").
  traceContent?: string;
  // "match" type questions: an optional image-generation prompt for each
  // Column A entry (parallel array to `options`), turning a plain text-match
  // question into a picture-matching one -- e.g. a small apple icon next to
  // the word "Apple" for a child to match to its meaning in Column B.
  matchImages?: string[];
  // Filled in by apps/api after generating each matchImages prompt -- parallel
  // array of the resulting stored image URLs (same order/length as matchImages,
  // with `null` for any single image that failed to generate).
  matchImageUrls?: (string | null)[];
}

export interface GeneratedWorksheet {
  title: string;
  description: string;
  questions: Question[];
  totalMarks: number;
}

export interface ProjectPromptConfig {
  classLevel: string;
  subject: string;
  chapter?: string;
  topics: string[];
  length: 'short' | 'medium' | 'long';
  language?: string;
  // Free-text ask from the "custom" generation flow -- see WorksheetPromptConfig.
  customInstructions?: string;
  // See WorksheetPromptConfig's `board` -- same pedagogy-awareness applies to
  // project/report generation.
  board?: string;
}

export interface ProjectSection {
  heading: string;
  content: string;
}

export interface GeneratedProject {
  title: string;
  sections: ProjectSection[];
  bibliography: string[];
}

export interface StudyMaterialPromptConfig {
  classLevel: string;
  subject: string;
  chapter?: string;
  topics: string[];
  language?: string;
  // See WorksheetPromptConfig's `board` -- same pedagogy-awareness applies to
  // study material generation.
  board?: string;
}

export interface StudyMaterialSection {
  heading: string;
  content: string;
  // Which reader this section is written for -- a single document combines
  // both, per the teacher/parent user's explicit choice to get educator
  // teaching-notes AND child-facing revision-notes in one generation rather
  // than two separate documents.
  audience: 'teacher' | 'student';
}

export interface GeneratedStudyMaterial {
  title: string;
  sections: StudyMaterialSection[];
}

export interface ActivitySheetPromptConfig {
  classLevel: string;
  subject: string;
  chapter?: string;
  topics: string[];
  language?: string;
  // See WorksheetPromptConfig's `board` -- same pedagogy-awareness applies to
  // activity sheet generation.
  board?: string;
}

// Deliberately a different shape than GeneratedWorksheet (no questions/
// answers/marks) and different than GeneratedStudyMaterial (no audience-
// tagged prose sections) -- an activity sheet is a hands-on "do this" task
// for the student, not a quiz and not notes to read.
export interface GeneratedActivitySheet {
  title: string;
  materials: string[];
  steps: string[];
  reflectionQuestions: string[];
  // Short guidance for the adult running the activity -- what to watch for,
  // how to help without doing it for the student, how to extend/simplify it.
  facilitationNotes: string;
}

// "Tech Lab" -- Robotics/AI/Coding builds. Deliberately NOT curriculum-linked
// (no subject/chapter/topic) -- see tech_projects table comment in schema.sql
// for why. Open to all roles (unlike study material/activity sheet).
export interface TechProjectPromptConfig {
  classLevel: string;
  board?: string;
  category: 'robotics' | 'ai' | 'coding';
  // The chosen idea/theme -- either picked from the curated idea gallery or
  // typed freeform by the user.
  ideaPrompt: string;
  language?: string;
}

export interface TechProjectStep {
  number: number;
  title: string;
  instruction: string;
  // A real illustration prompt, same mechanism as worksheet diagrams (see
  // DiagramSpec.imagePrompt) -- imageUrl is filled in by apps/api after
  // generation. Rendered with a "verify before use" disclaimer in the PDF/UI
  // since the free image model isn't reliably accurate for technical
  // diagrams -- see apps/api/src/services/pdfService.tsx.
  imagePrompt?: string;
  imageUrl?: string;
}

export interface TechProjectHardwareItem {
  name: string;
  purpose: string;
  approxCostINR?: string;
}

// Always optional -- `materials` (the free software/simulation path) must
// stand alone as a complete, genuinely free way to do the whole project.
// This is an upgrade, never a requirement.
export interface TechProjectHardwareUpgrade {
  available: boolean;
  items: TechProjectHardwareItem[];
  note?: string;
}

export interface TechProjectSimulationGuide {
  tool: string;
  toolUrl: string;
  instructions: string;
}

export interface TechProjectTroubleshootingItem {
  issue: string;
  fix: string;
}

export interface GeneratedTechProject {
  title: string;
  purpose: string;
  materials: string[];
  hardwareUpgrade?: TechProjectHardwareUpgrade;
  steps: TechProjectStep[];
  simulationGuide?: TechProjectSimulationGuide;
  codeSnippet?: string;
  codeLanguage?: string;
  troubleshooting: TechProjectTroubleshootingItem[];
  safetyNotes: string[];
  extensions: string[];
}

export interface AIConfig {
  provider: 'groq' | 'openai' | 'gemini' | 'anthropic' | 'sarvam';
  apiKey: string;
  model?: string;
}

export abstract class AIProvider {
  abstract name: string;

  /**
   * Generates a worksheet based on the provided configuration.
   * @param config - The configuration for the worksheet prompt.
   * @returns A promise that resolves to the generated worksheet.
   */
  abstract generateWorksheet(config: WorksheetPromptConfig): Promise<GeneratedWorksheet>;

  /**
   * Generates a text-based project/assignment report based on the provided configuration.
   * @param config - The configuration for the project prompt.
   * @returns A promise that resolves to the generated project.
   */
  abstract generateProject(config: ProjectPromptConfig): Promise<GeneratedProject>;

  /**
   * Generates a combined teacher-notes + student-revision-notes study
   * material document based on the provided configuration.
   * @param config - The configuration for the study material prompt.
   * @returns A promise that resolves to the generated study material.
   */
  abstract generateStudyMaterial(config: StudyMaterialPromptConfig): Promise<GeneratedStudyMaterial>;

  /**
   * Generates a hands-on activity sheet (materials, numbered steps,
   * reflection questions, facilitation notes) for a teacher/parent to run
   * with a student -- distinct from a worksheet (no quiz questions) and
   * from study material (no prose notes to read).
   * @param config - The configuration for the activity sheet prompt.
   * @returns A promise that resolves to the generated activity sheet.
   */
  abstract generateActivitySheet(config: ActivitySheetPromptConfig): Promise<GeneratedActivitySheet>;

  /**
   * Generates a Robotics/AI/Coding "Tech Lab" project: purpose, a free
   * software/simulation-only materials path, numbered build steps, an
   * optional hardware upgrade tier, a simulation-tool guide, code where
   * relevant, safety notes, troubleshooting, and extension ideas.
   * @param config - The configuration for the tech project prompt.
   * @returns A promise that resolves to the generated tech project.
   */
  abstract generateTechProject(config: TechProjectPromptConfig): Promise<GeneratedTechProject>;

  /**
   * Given a real generated image and a list of part names, asks a
   * vision-capable model to identify each part's actual x/y position
   * (0-100 percentages) in the image -- used to place accurate labels AFTER
   * the image exists, instead of the AI's blind pre-generation guess.
   * Returns null if this provider has no vision-capable model available
   * (the default here) or the call fails for any reason -- callers must
   * treat null as "cannot verify" and fall back to a safe, non-pinpoint
   * presentation rather than trusting an unverified guess.
   */
  async verifyImageLabels(_imageUrl: string, _labels: string[]): Promise<DiagramLabelPoint[] | null> {
    return null;
  }
}
