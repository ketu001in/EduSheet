DO $$
DECLARE
  v_board_cbse UUID;
  v_class_id UUID;
  v_subj_id UUID;
  v_chap_id UUID;
BEGIN

  INSERT INTO public.boards (id, code, name, description, is_active)
  VALUES (gen_random_uuid(), 'CBSE', 'Central Board of Secondary Education', 'National board of education in India', true)
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO v_board_cbse;

  -- ==========================================
  -- CLASS 8
  -- ==========================================
  INSERT INTO public.classes (id, grade_number, name)
  VALUES (gen_random_uuid(), 8, 'Class 8')
  ON CONFLICT (grade_number) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO v_class_id;

  -- English
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'English', 'ENGL8')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'The Wit that Won Hearts', 'The Wit that Won Hearts')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Vocabulary and Word Meanings', 'Vocabulary and Word Meanings'),
  (gen_random_uuid(), v_chap_id, 3, 'Theme and Discussion Questions', 'Theme and Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'A Concrete Example', 'A Concrete Example')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Vocabulary and Word Meanings', 'Vocabulary and Word Meanings'),
  (gen_random_uuid(), v_chap_id, 3, 'Theme and Discussion Questions', 'Theme and Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'Wisdom Paves the Way', 'Wisdom Paves the Way')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Rhyme and Rhythm', 'Rhyme and Rhythm'),
  (gen_random_uuid(), v_chap_id, 3, 'Central Idea', 'Central Idea')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'A Tale of Valour: Major Somnath Sharma and the Battle of Badgam', 'A Tale of Valour: Major Somnath Sharma and the Battle of Badgam')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Vocabulary and Word Meanings', 'Vocabulary and Word Meanings'),
  (gen_random_uuid(), v_chap_id, 3, 'Theme and Discussion Questions', 'Theme and Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'Somebody''s Mother', 'Somebody''s Mother')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Rhyme and Rhythm', 'Rhyme and Rhythm'),
  (gen_random_uuid(), v_chap_id, 3, 'Central Idea', 'Central Idea')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'Verghese Kurien - I Too Had A Dream', 'Verghese Kurien - I Too Had A Dream')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Vocabulary and Word Meanings', 'Vocabulary and Word Meanings'),
  (gen_random_uuid(), v_chap_id, 3, 'Theme and Discussion Questions', 'Theme and Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'The Case of the Fifth Word', 'The Case of the Fifth Word')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Vocabulary and Word Meanings', 'Vocabulary and Word Meanings'),
  (gen_random_uuid(), v_chap_id, 3, 'Theme and Discussion Questions', 'Theme and Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'The Magic Brush of Dreams', 'The Magic Brush of Dreams')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Vocabulary and Word Meanings', 'Vocabulary and Word Meanings'),
  (gen_random_uuid(), v_chap_id, 3, 'Theme and Discussion Questions', 'Theme and Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'Spectacular Wonders', 'Spectacular Wonders')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Rhyme and Rhythm', 'Rhyme and Rhythm'),
  (gen_random_uuid(), v_chap_id, 3, 'Central Idea', 'Central Idea')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'The Cherry Tree', 'The Cherry Tree')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Vocabulary and Word Meanings', 'Vocabulary and Word Meanings'),
  (gen_random_uuid(), v_chap_id, 3, 'Theme and Discussion Questions', 'Theme and Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 11, 'Harvest Hymn', 'Harvest Hymn')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Rhyme and Rhythm', 'Rhyme and Rhythm'),
  (gen_random_uuid(), v_chap_id, 3, 'Central Idea', 'Central Idea')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 12, 'Waiting for the Rain', 'Waiting for the Rain')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Vocabulary and Word Meanings', 'Vocabulary and Word Meanings'),
  (gen_random_uuid(), v_chap_id, 3, 'Theme and Discussion Questions', 'Theme and Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  -- Mathematics
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'Mathematics', 'MATH8')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'A Square and A Cube', 'A Square and A Cube')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Perfect Squares', 'Perfect Squares'),
  (gen_random_uuid(), v_chap_id, 2, 'Perfect Cubes', 'Perfect Cubes'),
  (gen_random_uuid(), v_chap_id, 3, 'Square and Cube Roots', 'Square and Cube Roots')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'Power Play', 'Power Play')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Laws of Exponents', 'Laws of Exponents'),
  (gen_random_uuid(), v_chap_id, 2, 'Negative Exponents', 'Negative Exponents'),
  (gen_random_uuid(), v_chap_id, 3, 'Expressing Large Numbers', 'Expressing Large Numbers')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'A Story of Numbers', 'A Story of Numbers')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Number Systems', 'Number Systems'),
  (gen_random_uuid(), v_chap_id, 2, 'Rational Numbers', 'Rational Numbers'),
  (gen_random_uuid(), v_chap_id, 3, 'Number Patterns', 'Number Patterns')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'Quadrilaterals', 'Quadrilaterals')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Classification of Polygons', 'Classification of Polygons'),
  (gen_random_uuid(), v_chap_id, 2, 'Properties of Parallelograms', 'Properties of Parallelograms'),
  (gen_random_uuid(), v_chap_id, 3, 'Types of Quadrilaterals', 'Types of Quadrilaterals')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'Number Play', 'Number Play')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Divisibility Rules', 'Divisibility Rules'),
  (gen_random_uuid(), v_chap_id, 2, 'Number Puzzles', 'Number Puzzles'),
  (gen_random_uuid(), v_chap_id, 3, 'Patterns in Numbers', 'Patterns in Numbers')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'We Distribute, Yet Things Multiply', 'We Distribute, Yet Things Multiply')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Distributive Property', 'Distributive Property'),
  (gen_random_uuid(), v_chap_id, 2, 'Multiplying Algebraic Expressions', 'Multiplying Algebraic Expressions'),
  (gen_random_uuid(), v_chap_id, 3, 'Applications', 'Applications')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'Proportional Reasoning-1', 'Proportional Reasoning-1')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Ratio and Proportion', 'Ratio and Proportion'),
  (gen_random_uuid(), v_chap_id, 2, 'Direct Proportion', 'Direct Proportion'),
  (gen_random_uuid(), v_chap_id, 3, 'Applications', 'Applications')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'Fractions in Disguise', 'Fractions in Disguise')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Operations on Fractions', 'Operations on Fractions'),
  (gen_random_uuid(), v_chap_id, 2, 'Fractions and Decimals', 'Fractions and Decimals'),
  (gen_random_uuid(), v_chap_id, 3, 'Word Problems', 'Word Problems')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'The Baudhayana-Pythagoras Theorem', 'The Baudhayana-Pythagoras Theorem')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Statement and Proof', 'Statement and Proof'),
  (gen_random_uuid(), v_chap_id, 2, 'Applications', 'Applications'),
  (gen_random_uuid(), v_chap_id, 3, 'Right-Angled Triangles', 'Right-Angled Triangles')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'Proportional Reasoning-2', 'Proportional Reasoning-2')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Inverse Proportion', 'Inverse Proportion'),
  (gen_random_uuid(), v_chap_id, 2, 'Compound Proportion', 'Compound Proportion'),
  (gen_random_uuid(), v_chap_id, 3, 'Applications', 'Applications')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 11, 'Exploring Some Geometric Themes', 'Exploring Some Geometric Themes')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Geometric Constructions', 'Geometric Constructions'),
  (gen_random_uuid(), v_chap_id, 2, 'Properties of Shapes', 'Properties of Shapes'),
  (gen_random_uuid(), v_chap_id, 3, 'Symmetry', 'Symmetry')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 12, 'Tales by Dots and Lines', 'Tales by Dots and Lines')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Data Representation', 'Data Representation'),
  (gen_random_uuid(), v_chap_id, 2, 'Graphs', 'Graphs'),
  (gen_random_uuid(), v_chap_id, 3, 'Interpreting Visual Data', 'Interpreting Visual Data')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 13, 'Algebra Play', 'Algebra Play')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Algebraic Identities', 'Algebraic Identities'),
  (gen_random_uuid(), v_chap_id, 2, 'Factorisation', 'Factorisation'),
  (gen_random_uuid(), v_chap_id, 3, 'Simplifying Expressions', 'Simplifying Expressions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 14, 'Area', 'Area')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Area of Trapezium', 'Area of Trapezium'),
  (gen_random_uuid(), v_chap_id, 2, 'Surface Area of Solids', 'Surface Area of Solids'),
  (gen_random_uuid(), v_chap_id, 3, 'Volume of Solids', 'Volume of Solids')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  -- Science
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'Science', 'SCIE8')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'Exploring the Investigative World of Science', 'Exploring the Investigative World of Science')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Scientific Investigation', 'Scientific Investigation'),
  (gen_random_uuid(), v_chap_id, 2, 'Observation and Inference', 'Observation and Inference'),
  (gen_random_uuid(), v_chap_id, 3, 'Recording Data', 'Recording Data')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'The Invisible Living World: Beyond Our Naked Eye', 'The Invisible Living World: Beyond Our Naked Eye')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Microorganisms', 'Microorganisms'),
  (gen_random_uuid(), v_chap_id, 2, 'Useful and Harmful Microbes', 'Useful and Harmful Microbes'),
  (gen_random_uuid(), v_chap_id, 3, 'Microscopy', 'Microscopy')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'Health: The Ultimate Treasure', 'Health: The Ultimate Treasure')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Components of Health', 'Components of Health'),
  (gen_random_uuid(), v_chap_id, 2, 'Disease Prevention', 'Disease Prevention'),
  (gen_random_uuid(), v_chap_id, 3, 'Healthy Habits', 'Healthy Habits')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'Electricity: Magnetic and Heating Effects', 'Electricity: Magnetic and Heating Effects')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Heating Effect of Current', 'Heating Effect of Current'),
  (gen_random_uuid(), v_chap_id, 2, 'Magnetic Effect of Current', 'Magnetic Effect of Current'),
  (gen_random_uuid(), v_chap_id, 3, 'Electromagnets', 'Electromagnets')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'Exploring Forces', 'Exploring Forces')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Types of Force', 'Types of Force'),
  (gen_random_uuid(), v_chap_id, 2, 'Balanced and Unbalanced Forces', 'Balanced and Unbalanced Forces'),
  (gen_random_uuid(), v_chap_id, 3, 'Effects of Force', 'Effects of Force')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'Pressure, Winds, Storms, and Cyclones', 'Pressure, Winds, Storms, and Cyclones')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Air Pressure', 'Air Pressure'),
  (gen_random_uuid(), v_chap_id, 2, 'Formation of Winds and Storms', 'Formation of Winds and Storms'),
  (gen_random_uuid(), v_chap_id, 3, 'Cyclone Safety', 'Cyclone Safety')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'Particulate Nature of Matter', 'Particulate Nature of Matter')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'States of Matter', 'States of Matter'),
  (gen_random_uuid(), v_chap_id, 2, 'Diffusion', 'Diffusion'),
  (gen_random_uuid(), v_chap_id, 3, 'Kinetic Theory Basics', 'Kinetic Theory Basics')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'Nature of Matter: Elements, Compounds, and Mixtures', 'Nature of Matter: Elements, Compounds, and Mixtures')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Elements', 'Elements'),
  (gen_random_uuid(), v_chap_id, 2, 'Compounds', 'Compounds'),
  (gen_random_uuid(), v_chap_id, 3, 'Mixtures', 'Mixtures')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'The Amazing World of Solutes, Solvents, and Solutions', 'The Amazing World of Solutes, Solvents, and Solutions')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Solutions and Solubility', 'Solutions and Solubility'),
  (gen_random_uuid(), v_chap_id, 2, 'Concentration', 'Concentration'),
  (gen_random_uuid(), v_chap_id, 3, 'Saturated Solutions', 'Saturated Solutions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'Light: Mirrors and Lenses', 'Light: Mirrors and Lenses')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Reflection by Mirrors', 'Reflection by Mirrors'),
  (gen_random_uuid(), v_chap_id, 2, 'Refraction by Lenses', 'Refraction by Lenses'),
  (gen_random_uuid(), v_chap_id, 3, 'Image Formation', 'Image Formation')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 11, 'Keeping Time with the Skies', 'Keeping Time with the Skies')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Calendars and Time Measurement', 'Calendars and Time Measurement'),
  (gen_random_uuid(), v_chap_id, 2, 'Celestial Motion', 'Celestial Motion'),
  (gen_random_uuid(), v_chap_id, 3, 'Seasons', 'Seasons')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 12, 'How Nature Works in Harmony', 'How Nature Works in Harmony')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Ecosystems', 'Ecosystems'),
  (gen_random_uuid(), v_chap_id, 2, 'Interdependence', 'Interdependence'),
  (gen_random_uuid(), v_chap_id, 3, 'Balance in Nature', 'Balance in Nature')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 13, 'Our Home: Earth, A Unique Life Sustaining Planet', 'Our Home: Earth, A Unique Life Sustaining Planet')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Conditions for Life', 'Conditions for Life'),
  (gen_random_uuid(), v_chap_id, 2, 'Earth''s Resources', 'Earth''s Resources'),
  (gen_random_uuid(), v_chap_id, 3, 'Environmental Care', 'Environmental Care')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  -- Social Science
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'Social Science', 'SOCI8')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'Natural Resources and Their Use', 'Natural Resources and Their Use')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Types of Natural Resources', 'Types of Natural Resources'),
  (gen_random_uuid(), v_chap_id, 2, 'Conservation', 'Conservation'),
  (gen_random_uuid(), v_chap_id, 3, 'Sustainable Use', 'Sustainable Use')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'Reshaping India''s Political Map', 'Reshaping India''s Political Map')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Formation of States', 'Formation of States'),
  (gen_random_uuid(), v_chap_id, 2, 'Linguistic Reorganisation', 'Linguistic Reorganisation'),
  (gen_random_uuid(), v_chap_id, 3, 'Administrative Changes', 'Administrative Changes')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'The Rise of the Marathas', 'The Rise of the Marathas')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shivaji and the Maratha Kingdom', 'Shivaji and the Maratha Kingdom'),
  (gen_random_uuid(), v_chap_id, 2, 'Maratha Administration', 'Maratha Administration'),
  (gen_random_uuid(), v_chap_id, 3, 'Maratha Expansion', 'Maratha Expansion')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'The Colonial Era in India', 'The Colonial Era in India')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Establishment of British Rule', 'Establishment of British Rule'),
  (gen_random_uuid(), v_chap_id, 2, 'Economic Impact', 'Economic Impact'),
  (gen_random_uuid(), v_chap_id, 3, 'Resistance Movements', 'Resistance Movements')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'Universal Franchise and India''s Electoral System', 'Universal Franchise and India''s Electoral System')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Right to Vote', 'Right to Vote'),
  (gen_random_uuid(), v_chap_id, 2, 'Election Commission', 'Election Commission'),
  (gen_random_uuid(), v_chap_id, 3, 'Electoral Process', 'Electoral Process')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'The Parliamentary System: Legislature and Executive', 'The Parliamentary System: Legislature and Executive')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Structure of Parliament', 'Structure of Parliament'),
  (gen_random_uuid(), v_chap_id, 2, 'Role of the Executive', 'Role of the Executive'),
  (gen_random_uuid(), v_chap_id, 3, 'Law-Making Process', 'Law-Making Process')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'Factors of Production', 'Factors of Production')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Land Labour Capital', 'Land Labour Capital'),
  (gen_random_uuid(), v_chap_id, 2, 'Entrepreneurship', 'Entrepreneurship'),
  (gen_random_uuid(), v_chap_id, 3, 'Production Process', 'Production Process')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  -- Hindi
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'Hindi', 'HIND8')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'Laakh Ki Choodiyaan', 'Laakh Ki Choodiyaan')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'Bus Ki Yaatra', 'Bus Ki Yaatra')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'Deevano Ki Hasti', 'Deevano Ki Hasti')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Kavita ka Bhavarth', 'Kavita ka Bhavarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'Bhagavan Ke Daakie', 'Bhagavan Ke Daakie')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Kavita ka Bhavarth', 'Kavita ka Bhavarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'Kya Niraash Hua Jae', 'Kya Niraash Hua Jae')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'Yah Sabase Kathin Samay Nahin', 'Yah Sabase Kathin Samay Nahin')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'Kabeer Ki Saakhiyon', 'Kabeer Ki Saakhiyon')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Sakhiyon ka Bhavarth', 'Sakhiyon ka Bhavarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Kanth Path', 'Kanth Path')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'Sudama Charit', 'Sudama Charit')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'Jahaan Pahiya Hai', 'Jahaan Pahiya Hai')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'Akabari Lota', 'Akabari Lota')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 11, 'Soor Ke Pad', 'Soor Ke Pad')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Kavita ka Bhavarth', 'Kavita ka Bhavarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 12, 'Pani Ki Kahani', 'Pani Ki Kahani')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 13, 'Baaj Aur Saanp', 'Baaj Aur Saanp')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  -- Sanskrit
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'Sanskrit', 'SANS8')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'संगच्छध्वं संवदध्वम्', 'संगच्छध्वं संवदध्वम्')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Kanth Path', 'Kanth Path')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'अल्पानामपि वस्तूनां संहतिः कार्यसाधिका', 'अल्पानामपि वस्तूनां संहतिः कार्यसाधिका')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'सुभाषितरस पीत्वा जीवनं सफलं कुरु', 'सुभाषितरस पीत्वा जीवनं सफलं कुरु')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'प्रणम्य देशभक्तोऽयं गोपबन्धुर्महामनाः', 'प्रणम्य देशभक्तोऽयं गोपबन्धुर्महामनाः')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'गीता सुगीता कर्तव्या', 'गीता सुगीता कर्तव्या')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'डिजिभारतम् युगपरिवर्तनम्', 'डिजिभारतम् युगपरिवर्तनम्')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'मञ्जुलमञ्जूषा सुन्दरसुरभाषा', 'मञ्जुलमञ्जूषा सुन्दरसुरभाषा')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'पश्यत कोणमैशान्यं भारतस्य मनोहरम्', 'पश्यत कोणमैशान्यं भारतस्य मनोहरम्')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'कोऽरुक्?', 'कोऽरुक्?')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'सन्निमित्ते वरं त्यागः (क-भागः)', 'सन्निमित्ते वरं त्यागः (क-भागः)')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 11, 'सन्निमित्ते वरं त्यागः (ख-भागः)', 'सन्निमित्ते वरं त्यागः (ख-भागः)')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 12, 'सम्यग्वर्णप्रयोगेण ब्रह्मलोके महीयते', 'सम्यग्वर्णप्रयोगेण ब्रह्मलोके महीयते')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 13, 'वर्णोच्चारण-शिक्षा १', 'वर्णोच्चारण-शिक्षा १')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Uchcharan Abhyas', 'Uchcharan Abhyas'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Anuvad Abhyas', 'Anuvad Abhyas')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

END $$;
