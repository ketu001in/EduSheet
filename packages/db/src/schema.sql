-- schema.sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('student', 'parent', 'teacher', 'admin');
CREATE TYPE question_type AS ENUM ('mcq', 'fill_in_blank', 'true_false', 'match_following', 'short_answer', 'long_answer', 'word_problem', 'diagram_based', 'logical_reasoning', 'coloring_sheet', 'tracing');
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard', 'mixed');
CREATE TYPE linking_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE favorite_type AS ENUM ('topic', 'chapter', 'worksheet');
CREATE TYPE tech_project_category AS ENUM ('robotics', 'ai', 'coding');

-- Helper function for updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. users
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  -- Nullable at the DB level (existing rows predate this column) even though
  -- the signup flow always requires and sets it for new accounts.
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'student',
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. boards (create before user_profiles)
CREATE TABLE public.boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. classes (create before user_profiles)
-- board_id NULL = a shared/global class (e.g. CBSE/ICSE's Class 1-12, LKG,
-- UKG -- grade_number is a real, globally-unique grade). board_id set = a
-- stage scoped to one alternative-pedagogy board (Montessori/Reggio Emilia/
-- Steiner-Waldorf), whose age-stage names don't correspond to a numbered
-- grade at all -- grade_number there is just a display-order key, unique
-- only within that board, not a real grade (see the two partial unique
-- indexes below instead of one global UNIQUE).
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grade_number INT NOT NULL CHECK (grade_number BETWEEN -5 AND 20),
  name TEXT NOT NULL,
  board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX classes_grade_number_global_uidx ON public.classes(grade_number) WHERE board_id IS NULL;
CREATE UNIQUE INDEX classes_grade_number_per_board_uidx ON public.classes(board_id, grade_number) WHERE board_id IS NOT NULL;

-- 2. user_profiles
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  board_id UUID REFERENCES public.boards(id) ON DELETE SET NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  school_name TEXT,
  preferred_language TEXT DEFAULT 'en',
  parent_name TEXT,
  country TEXT,
  state TEXT,
  city TEXT,
  mobile TEXT,
  -- User-supplied AI provider credentials. There is no app-wide shared key --
  -- every user must bring their own, so worksheet/project generation always
  -- runs against this. ai_api_key_encrypted is AES-256-GCM ciphertext (see
  -- apps/api/src/lib/encryption.ts) -- never store plaintext.
  ai_provider TEXT,
  ai_api_key_encrypted TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. subjects
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  icon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, board_id, name)
);

-- 6. chapters
CREATE TABLE public.chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(subject_id, chapter_number)
);

-- 7. topics
CREATE TABLE public.topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  topic_number INT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(chapter_id, topic_number)
);

-- 8. worksheets
CREATE TABLE public.worksheets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
  difficulty difficulty_level DEFAULT 'medium',
  total_marks INT DEFAULT 0,
  time_limit_minutes INT,
  question_count INT DEFAULT 0,
  question_types JSONB,
  settings JSONB,
  pdf_storage_path TEXT,
  answer_key_pdf_path TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8b. projects (text-based project/assignment reports -- distinct from worksheets:
-- prose sections instead of graded questions, no question_types/difficulty).
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
  length TEXT DEFAULT 'medium',
  settings JSONB,
  sections JSONB NOT NULL,
  bibliography JSONB,
  pdf_storage_path TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8c. study_materials (teacher/parent-only, role-gated at the app layer --
-- role-gating itself has NO database enforcement here since the underlying
-- data isn't sensitive; access is refused server-side via requireRole
-- middleware before this table is ever touched, see apps/api/src/middleware/auth.ts).
CREATE TABLE public.study_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
  settings JSONB,
  -- Each section: { heading, content, audience: 'teacher' | 'student' } --
  -- combines educator teaching-notes and child-facing revision-notes
  -- sections in one document, per the user's explicit choice.
  sections JSONB NOT NULL,
  pdf_storage_path TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8d. activity_sheets (teacher/parent-only, same role-gating model as
-- study_materials -- enforced server-side, not by RLS). A hands-on activity
-- FOR THE STUDENT to do (materials + numbered steps + reflection questions),
-- plus a short facilitation note for the adult running it -- deliberately a
-- different shape than a worksheet (no MCQ/fill-blank/answer-key questions)
-- and different than study_materials (this is a "do this" sheet, not notes).
CREATE TABLE public.activity_sheets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
  settings JSONB,
  materials JSONB NOT NULL, -- string[] of items needed for the activity
  steps JSONB NOT NULL, -- string[] of numbered procedure steps for the student
  reflection_questions JSONB, -- string[] of post-activity reflection prompts
  facilitation_notes TEXT, -- short guidance for the adult running the activity
  pdf_storage_path TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8e. tech_projects ("Tech Lab" -- Robotics/AI/Coding builds). Open to ALL
-- roles (no requireRole gate, same access model as worksheets/projects) --
-- unlike study_materials/activity_sheets, this is explicitly for students
-- too. Deliberately NOT linked to subjects/chapters/topics (no official
-- CBSE/ICSE Computer Science/AI curriculum is seeded in this app yet, and
-- the user chose to keep this curriculum-loose rather than block on that
-- research) -- board_id/class_id are kept directly on the row (not derived
-- via a subject join) specifically because study_materials' lack of a
-- direct board_id caused a real bug earlier (the Activity Sheet prefill
-- silently defaulted to the wrong board) -- don't repeat that here.
CREATE TABLE public.tech_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  board_id UUID REFERENCES public.boards(id) ON DELETE SET NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  category tech_project_category NOT NULL,
  idea_prompt TEXT NOT NULL, -- the chosen/typed project idea or theme
  settings JSONB,
  purpose TEXT NOT NULL, -- why this project, what concept it teaches
  materials JSONB NOT NULL, -- string[] -- the always-free software/simulation-path materials
  -- { available: boolean, items: [{ name, purpose, approxCostINR }], note } --
  -- optional, never required; the free `materials` path above always stands alone.
  hardware_upgrade JSONB,
  -- [{ number, title, instruction, imagePrompt?, imageUrl? }] -- imageUrl filled in
  -- by apps/api after generation, same pattern as worksheet_questions.diagram.
  steps JSONB NOT NULL,
  simulation_guide JSONB, -- { tool, toolUrl, instructions } -- e.g. Tinkercad/Wokwi/Scratch
  code_snippet TEXT, -- only for coding/AI projects that involve actual code
  code_language TEXT,
  troubleshooting JSONB, -- [{ issue, fix }]
  safety_notes JSONB, -- string[] -- populated for anything electrical/hardware-adjacent
  extensions JSONB, -- string[] -- ideas to extend the project further
  pdf_storage_path TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8f. chemistry_experiment_attempts ("Chem Lab" -- interactive Robotics-Lab
-- sibling for Chemistry). The experiment SCRIPTS themselves (reaction steps,
-- equations, safety notes) are deliberately NOT stored here -- they live as
-- curated, hand-authored static data in packages/content (never AI-generated
-- at request time; see that package's header comment for the safety
-- rationale: a wrong AI guess about a real chemical reaction is dangerous,
-- not just a bad worksheet answer). This table only tracks a user's PROGRESS
-- through one of those curated experiments -- their predict-then-observe
-- answer and filled-in observations -- so `experiment_id` is a plain TEXT key
-- matching packages/content's CHEMISTRY_EXPERIMENTS[].id, not a DB foreign
-- key. Open to ALL roles, same access model as tech_projects, but scoped to
-- own-or-parent (no is_public sharing -- this is a personal lab notebook,
-- not a document meant to be shared/browsed).
CREATE TABLE public.chemistry_experiment_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  experiment_id TEXT NOT NULL,
  experiment_title TEXT NOT NULL,
  board_id UUID REFERENCES public.boards(id) ON DELETE SET NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  predict_answer_index INT,
  predict_correct BOOLEAN,
  observations JSONB, -- { [promptIndex]: studentAnswerText }
  completed_at TIMESTAMPTZ,
  pdf_storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8g. physics_experiment_attempts ("Physics Lab" -- same personal-lab-
-- notebook model as chemistry_experiment_attempts, for exactly the same
-- reason: the experiment scripts (steps, formulas, safety notes) are
-- curated, hand-authored static data in packages/content (see
-- physicsTypes.ts's header comment), never AI-generated -- a wrong physics
-- formula silently teaches a misconception. `experiment_id` is a plain TEXT
-- key matching packages/content's PHYSICS_EXPERIMENTS[].id, not a DB
-- foreign key. Open to ALL roles, own-or-parent access, no is_public.
-- `final_params` additionally records the simulation parameter values the
-- student ended up testing (e.g. the pendulum length they tried), so a
-- regenerated report can show exactly what was explored, not just the
-- default script.
CREATE TABLE public.physics_experiment_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  experiment_id TEXT NOT NULL,
  experiment_title TEXT NOT NULL,
  board_id UUID REFERENCES public.boards(id) ON DELETE SET NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  predict_answer_index INT,
  predict_correct BOOLEAN,
  observations JSONB, -- { [promptIndex]: studentAnswerText }
  final_params JSONB, -- { [paramKey]: numberTheyEndedUpTesting }
  completed_at TIMESTAMPTZ,
  pdf_storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8h. biology_experiment_attempts ("Biology Lab" -- same personal-lab-
-- notebook model as physics/chemistry_experiment_attempts, for exactly the
-- same reason: food-test colors, osmosis direction, and Punnett-square
-- ratios are curated, hand-verified static data in packages/content (see
-- biologyTypes.ts's header comment), never AI-generated. `experiment_id` is
-- a plain TEXT key matching packages/content's BIOLOGY_EXPERIMENTS[].id,
-- not a DB foreign key. Open to ALL roles, own-or-parent access, no
-- is_public.
CREATE TABLE public.biology_experiment_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  experiment_id TEXT NOT NULL,
  experiment_title TEXT NOT NULL,
  board_id UUID REFERENCES public.boards(id) ON DELETE SET NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  predict_answer_index INT,
  predict_correct BOOLEAN,
  observations JSONB, -- { [promptIndex]: studentAnswerText }
  final_params JSONB, -- { [paramKey]: numberTheyEndedUpTesting }
  completed_at TIMESTAMPTZ,
  pdf_storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8i. math_experiment_attempts ("Math Lab" -- same personal-lab-notebook
-- model as physics/chemistry/biology_experiment_attempts: every theorem,
-- formula, and experiment is curated, hand-verified static data in
-- packages/content (see mathTypes.ts's header comment), never AI-generated.
-- `experiment_id` is a plain TEXT key matching packages/content's
-- MATH_EXPERIMENTS[].id, not a DB foreign key. Open to ALL roles,
-- own-or-parent access, no is_public.
CREATE TABLE public.math_experiment_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  experiment_id TEXT NOT NULL,
  experiment_title TEXT NOT NULL,
  board_id UUID REFERENCES public.boards(id) ON DELETE SET NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  predict_answer_index INT,
  predict_correct BOOLEAN,
  observations JSONB, -- { [promptIndex]: studentAnswerText }
  final_params JSONB, -- { [paramKey]: numberTheyEndedUpTesting }
  completed_at TIMESTAMPTZ,
  pdf_storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. worksheet_questions
CREATE TABLE public.worksheet_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worksheet_id UUID REFERENCES public.worksheets(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type question_type NOT NULL,
  options JSONB,
  correct_answer TEXT,
  explanation TEXT,
  hints TEXT,
  -- Simplified shape-based schematic for "diagram_based" questions (see
  -- packages/ai's DiagramSpec) -- rendered as an unlabeled wireframe on the
  -- worksheet and a fully-labeled diagram in the answer key PDF.
  diagram JSONB,
  marks INT DEFAULT 1,
  order_index INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. worksheet_history
CREATE TABLE public.worksheet_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  worksheet_id UUID REFERENCES public.worksheets(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('viewed', 'downloaded', 'attempted', 'submitted')),
  score_achieved NUMERIC,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. favorites
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  entity_type favorite_type NOT NULL,
  entity_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, entity_type, entity_id)
);

-- 12. user_behavior
CREATE TABLE public.user_behavior (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
  time_spent_seconds INT DEFAULT 0,
  questions_attempted INT DEFAULT 0,
  questions_correct INT DEFAULT 0,
  performance_score NUMERIC GENERATED ALWAYS AS (
    CASE WHEN questions_attempted > 0 THEN (questions_correct::NUMERIC / questions_attempted::NUMERIC) * 100 ELSE 0 END
  ) STORED,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- 13. notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT,
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. parent_children
CREATE TABLE public.parent_children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  child_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status linking_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, child_id),
  CHECK (parent_id != child_id)
);

-- 15. teacher_classrooms
CREATE TABLE public.teacher_classrooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  join_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. teacher_classroom_students
CREATE TABLE public.teacher_classroom_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classroom_id UUID REFERENCES public.teacher_classrooms(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(classroom_id, student_id)
);

-- Handle New User Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_val user_role := 'student';
BEGIN
  IF NEW.raw_user_meta_data->>'role' IS NOT NULL AND NEW.raw_user_meta_data->>'role' IN ('student', 'parent', 'teacher', 'admin') THEN
    user_role_val := (NEW.raw_user_meta_data->>'role')::user_role;
  END IF;

  INSERT INTO public.users (id, email, full_name, username, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'avatar_url',
    user_role_val
  )
  ON CONFLICT (id) DO NOTHING;
  
  INSERT INTO public.user_profiles (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_subjects_class_board ON public.subjects(class_id, board_id);
CREATE INDEX idx_chapters_subject ON public.chapters(subject_id);
CREATE INDEX idx_topics_chapter ON public.topics(chapter_id);
CREATE INDEX idx_worksheets_creator ON public.worksheets(creator_id);
CREATE INDEX idx_worksheets_filters ON public.worksheets(class_id, subject_id, chapter_id, difficulty);
CREATE INDEX idx_projects_creator ON public.projects(creator_id);
CREATE INDEX idx_projects_filters ON public.projects(class_id, subject_id, chapter_id);
CREATE INDEX idx_worksheet_questions_worksheet ON public.worksheet_questions(worksheet_id);
CREATE INDEX idx_worksheet_history_user ON public.worksheet_history(user_id);
CREATE INDEX idx_favorites_user ON public.favorites(user_id);
CREATE INDEX idx_user_behavior_user ON public.user_behavior(user_id);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read);
CREATE INDEX idx_parent_children_parent ON public.parent_children(parent_id);
CREATE INDEX idx_parent_children_child ON public.parent_children(child_id);
CREATE INDEX idx_teacher_classrooms_teacher ON public.teacher_classrooms(teacher_id);
CREATE INDEX idx_teacher_classroom_students_classroom ON public.teacher_classroom_students(classroom_id);
CREATE INDEX idx_teacher_classroom_students_student ON public.teacher_classroom_students(student_id);

-- Updated_at Triggers
CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_worksheets_updated_at BEFORE UPDATE ON public.worksheets FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_study_materials_updated_at BEFORE UPDATE ON public.study_materials FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_activity_sheets_updated_at BEFORE UPDATE ON public.activity_sheets FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_tech_projects_updated_at BEFORE UPDATE ON public.tech_projects FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_chemistry_experiment_attempts_updated_at BEFORE UPDATE ON public.chemistry_experiment_attempts FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_physics_experiment_attempts_updated_at BEFORE UPDATE ON public.physics_experiment_attempts FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_biology_experiment_attempts_updated_at BEFORE UPDATE ON public.biology_experiment_attempts FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_math_experiment_attempts_updated_at BEFORE UPDATE ON public.math_experiment_attempts FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_user_behavior_updated_at BEFORE UPDATE ON public.user_behavior FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_parent_children_updated_at BEFORE UPDATE ON public.parent_children FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_teacher_classrooms_updated_at BEFORE UPDATE ON public.teacher_classrooms FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Helper RLS functions
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS user_role AS $$
  SELECT role FROM public.users WHERE id = user_uuid;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT get_user_role(auth.uid()) = 'admin'::user_role;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_parent_of(child_uuid UUID)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.parent_children
    WHERE parent_id = auth.uid() AND child_id = child_uuid AND status = 'approved'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_teacher_of(student_uuid UUID)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.teacher_classrooms tc
    JOIN public.teacher_classroom_students tcs ON tc.id = tcs.classroom_id
    WHERE tc.teacher_id = auth.uid() AND tcs.student_id = student_uuid
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- RLS Policies

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tech_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chemistry_experiment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.physics_experiment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biology_experiment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.math_experiment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worksheet_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worksheet_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_behavior ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_classroom_students ENABLE ROW LEVEL SECURITY;

-- Catalog tables (boards, classes, subjects, chapters, topics)
CREATE POLICY "Catalog SELECT for all authenticated" ON public.boards FOR SELECT TO authenticated USING (true);
CREATE POLICY "Catalog ALL for admins" ON public.boards FOR ALL TO authenticated USING (is_admin());

CREATE POLICY "Catalog SELECT for all authenticated" ON public.classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Catalog ALL for admins" ON public.classes FOR ALL TO authenticated USING (is_admin());

CREATE POLICY "Catalog SELECT for all authenticated" ON public.subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Catalog ALL for admins" ON public.subjects FOR ALL TO authenticated USING (is_admin());

CREATE POLICY "Catalog SELECT for all authenticated" ON public.chapters FOR SELECT TO authenticated USING (true);
CREATE POLICY "Catalog ALL for admins" ON public.chapters FOR ALL TO authenticated USING (is_admin());

CREATE POLICY "Catalog SELECT for all authenticated" ON public.topics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Catalog ALL for admins" ON public.topics FOR ALL TO authenticated USING (is_admin());

-- Users
CREATE POLICY "Users SELECT own + children + students" ON public.users FOR SELECT TO authenticated
USING (id = auth.uid() OR is_parent_of(id) OR is_teacher_of(id) OR is_admin());

CREATE POLICY "Users UPDATE own" ON public.users FOR UPDATE TO authenticated
USING (id = auth.uid() OR is_admin());

-- User Profiles
CREATE POLICY "User profiles SELECT own + children + students" ON public.user_profiles FOR SELECT TO authenticated
USING (user_id = auth.uid() OR is_parent_of(user_id) OR is_teacher_of(user_id) OR is_admin());

CREATE POLICY "User profiles UPDATE own" ON public.user_profiles FOR UPDATE TO authenticated
USING (user_id = auth.uid() OR is_admin());

-- Worksheets
CREATE POLICY "Worksheets SELECT public or related" ON public.worksheets FOR SELECT TO authenticated
USING (is_public = true OR creator_id = auth.uid() OR is_parent_of(creator_id) OR is_admin());

CREATE POLICY "Worksheets INSERT own" ON public.worksheets FOR INSERT TO authenticated
WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Worksheets UPDATE own or admin" ON public.worksheets FOR UPDATE TO authenticated
USING (creator_id = auth.uid() OR is_admin());

CREATE POLICY "Worksheets DELETE own or admin" ON public.worksheets FOR DELETE TO authenticated
USING (creator_id = auth.uid() OR is_admin());

-- Projects
CREATE POLICY "Projects SELECT public or related" ON public.projects FOR SELECT TO authenticated
USING (is_public = true OR creator_id = auth.uid() OR is_parent_of(creator_id) OR is_admin());

CREATE POLICY "Projects INSERT own" ON public.projects FOR INSERT TO authenticated
WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Projects UPDATE own or admin" ON public.projects FOR UPDATE TO authenticated
USING (creator_id = auth.uid() OR is_admin());

CREATE POLICY "Projects DELETE own or admin" ON public.projects FOR DELETE TO authenticated
USING (creator_id = auth.uid() OR is_admin());

-- Study Materials (role-gating itself is enforced server-side, not by RLS --
-- see apps/api/src/middleware/auth.ts's requireRole)
CREATE POLICY "Study materials SELECT public or related" ON public.study_materials FOR SELECT TO authenticated
USING (is_public = true OR creator_id = auth.uid() OR is_parent_of(creator_id) OR is_admin());

CREATE POLICY "Study materials INSERT own" ON public.study_materials FOR INSERT TO authenticated
WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Study materials UPDATE own or admin" ON public.study_materials FOR UPDATE TO authenticated
USING (creator_id = auth.uid() OR is_admin());

CREATE POLICY "Study materials DELETE own or admin" ON public.study_materials FOR DELETE TO authenticated
USING (creator_id = auth.uid() OR is_admin());

-- Activity Sheets (role-gating itself is enforced server-side, not by RLS --
-- see apps/api/src/middleware/auth.ts's requireRole)
CREATE POLICY "Activity sheets SELECT public or related" ON public.activity_sheets FOR SELECT TO authenticated
USING (is_public = true OR creator_id = auth.uid() OR is_parent_of(creator_id) OR is_admin());

CREATE POLICY "Activity sheets INSERT own" ON public.activity_sheets FOR INSERT TO authenticated
WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Activity sheets UPDATE own or admin" ON public.activity_sheets FOR UPDATE TO authenticated
USING (creator_id = auth.uid() OR is_admin());

CREATE POLICY "Activity sheets DELETE own or admin" ON public.activity_sheets FOR DELETE TO authenticated
USING (creator_id = auth.uid() OR is_admin());

-- Tech Projects (open to all roles, same access model as Projects/Worksheets --
-- no role-gating, server-side or otherwise)
CREATE POLICY "Tech projects SELECT public or related" ON public.tech_projects FOR SELECT TO authenticated
USING (is_public = true OR creator_id = auth.uid() OR is_parent_of(creator_id) OR is_admin());

CREATE POLICY "Tech projects INSERT own" ON public.tech_projects FOR INSERT TO authenticated
WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Tech projects UPDATE own or admin" ON public.tech_projects FOR UPDATE TO authenticated
USING (creator_id = auth.uid() OR is_admin());

CREATE POLICY "Tech projects DELETE own or admin" ON public.tech_projects FOR DELETE TO authenticated
USING (creator_id = auth.uid() OR is_admin());

-- Chemistry Experiment Attempts (open to all roles, own-or-parent only --
-- a personal lab notebook, not a shareable document)
CREATE POLICY "Chem attempts SELECT own or related" ON public.chemistry_experiment_attempts FOR SELECT TO authenticated
USING (user_id = auth.uid() OR is_parent_of(user_id) OR is_admin());

CREATE POLICY "Chem attempts INSERT own" ON public.chemistry_experiment_attempts FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Chem attempts UPDATE own or admin" ON public.chemistry_experiment_attempts FOR UPDATE TO authenticated
USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Chem attempts DELETE own or admin" ON public.chemistry_experiment_attempts FOR DELETE TO authenticated
USING (user_id = auth.uid() OR is_admin());

-- Physics Experiment Attempts (same own-or-parent model as Chem attempts)
CREATE POLICY "Physics attempts SELECT own or related" ON public.physics_experiment_attempts FOR SELECT TO authenticated
USING (user_id = auth.uid() OR is_parent_of(user_id) OR is_admin());

CREATE POLICY "Physics attempts INSERT own" ON public.physics_experiment_attempts FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Physics attempts UPDATE own or admin" ON public.physics_experiment_attempts FOR UPDATE TO authenticated
USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Physics attempts DELETE own or admin" ON public.physics_experiment_attempts FOR DELETE TO authenticated
USING (user_id = auth.uid() OR is_admin());

-- Biology Experiment Attempts (same own-or-parent model as Physics/Chem)
CREATE POLICY "Biology attempts SELECT own or related" ON public.biology_experiment_attempts FOR SELECT TO authenticated
USING (user_id = auth.uid() OR is_parent_of(user_id) OR is_admin());

CREATE POLICY "Biology attempts INSERT own" ON public.biology_experiment_attempts FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Biology attempts UPDATE own or admin" ON public.biology_experiment_attempts FOR UPDATE TO authenticated
USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Biology attempts DELETE own or admin" ON public.biology_experiment_attempts FOR DELETE TO authenticated
USING (user_id = auth.uid() OR is_admin());

-- Math Experiment Attempts (same own-or-parent model as Physics/Chem/Biology)
CREATE POLICY "Math attempts SELECT own or related" ON public.math_experiment_attempts FOR SELECT TO authenticated
USING (user_id = auth.uid() OR is_parent_of(user_id) OR is_admin());

CREATE POLICY "Math attempts INSERT own" ON public.math_experiment_attempts FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Math attempts UPDATE own or admin" ON public.math_experiment_attempts FOR UPDATE TO authenticated
USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Math attempts DELETE own or admin" ON public.math_experiment_attempts FOR DELETE TO authenticated
USING (user_id = auth.uid() OR is_admin());

-- Worksheet Questions
CREATE POLICY "Questions SELECT if worksheet accessible" ON public.worksheet_questions FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.worksheets w WHERE w.id = worksheet_questions.worksheet_id AND
    (w.is_public = true OR w.creator_id = auth.uid() OR is_parent_of(w.creator_id) OR is_admin())
  )
);

CREATE POLICY "Questions ALL if creator or admin" ON public.worksheet_questions FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.worksheets w WHERE w.id = worksheet_questions.worksheet_id AND
    (w.creator_id = auth.uid() OR is_admin())
  )
);

-- Worksheet History
CREATE POLICY "History SELECT own or parent or teacher or admin" ON public.worksheet_history FOR SELECT TO authenticated
USING (user_id = auth.uid() OR is_parent_of(user_id) OR is_teacher_of(user_id) OR is_admin());

CREATE POLICY "History INSERT own" ON public.worksheet_history FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- User Behavior
CREATE POLICY "Behavior SELECT own or parent or teacher or admin" ON public.user_behavior FOR SELECT TO authenticated
USING (user_id = auth.uid() OR is_parent_of(user_id) OR is_teacher_of(user_id) OR is_admin());

CREATE POLICY "Behavior ALL own" ON public.user_behavior FOR ALL TO authenticated
USING (user_id = auth.uid());

-- Favorites
CREATE POLICY "Favorites ALL own" ON public.favorites FOR ALL TO authenticated
USING (user_id = auth.uid());

-- Notifications
CREATE POLICY "Notifications SELECT own" ON public.notifications FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Notifications UPDATE own" ON public.notifications FOR UPDATE TO authenticated
USING (user_id = auth.uid());

-- Parent Children
CREATE POLICY "Parent Children SELECT involved" ON public.parent_children FOR SELECT TO authenticated
USING (parent_id = auth.uid() OR child_id = auth.uid() OR is_admin());

CREATE POLICY "Parent Children INSERT parent" ON public.parent_children FOR INSERT TO authenticated
WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Parent Children UPDATE child or parent or admin" ON public.parent_children FOR UPDATE TO authenticated
USING (parent_id = auth.uid() OR child_id = auth.uid() OR is_admin());

-- Teacher Classrooms
CREATE POLICY "Classrooms SELECT teacher or enrolled" ON public.teacher_classrooms FOR SELECT TO authenticated
USING (
  teacher_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.teacher_classroom_students tcs WHERE tcs.classroom_id = id AND tcs.student_id = auth.uid()) OR
  is_admin()
);

CREATE POLICY "Classrooms ALL teacher" ON public.teacher_classrooms FOR ALL TO authenticated
USING (teacher_id = auth.uid() OR is_admin());

-- Teacher Classroom Students
CREATE POLICY "Classroom Students SELECT teacher or enrolled" ON public.teacher_classroom_students FOR SELECT TO authenticated
USING (
  student_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.teacher_classrooms tc WHERE tc.id = classroom_id AND tc.teacher_id = auth.uid()) OR
  is_admin()
);

CREATE POLICY "Classroom Students INSERT student" ON public.teacher_classroom_students FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Classroom Students DELETE teacher or student" ON public.teacher_classroom_students FOR DELETE TO authenticated
USING (
  student_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.teacher_classrooms tc WHERE tc.id = classroom_id AND tc.teacher_id = auth.uid()) OR
  is_admin()
);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('worksheets', 'worksheets', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Worksheets Storage Select" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'worksheets' AND (
  true
));

CREATE POLICY "Worksheets Storage Insert" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'worksheets');

CREATE POLICY "Worksheets Storage Update" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'worksheets' AND auth.uid() = owner);

CREATE POLICY "Worksheets Storage Delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'worksheets' AND auth.uid() = owner);
