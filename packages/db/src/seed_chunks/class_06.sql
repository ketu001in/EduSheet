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
  -- CLASS 6
  -- ==========================================
  INSERT INTO public.classes (id, grade_number, name)
  VALUES (gen_random_uuid(), 6, 'Class 6')
  ON CONFLICT (grade_number) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO v_class_id;

  -- English
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'English', 'ENGL6')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'A Bottle of Dew', 'A Bottle of Dew')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Vocabulary and Word Meanings', 'Vocabulary and Word Meanings'),
  (gen_random_uuid(), v_chap_id, 3, 'Theme and Discussion Questions', 'Theme and Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'The Raven and the Fox', 'The Raven and the Fox')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Vocabulary and Word Meanings', 'Vocabulary and Word Meanings'),
  (gen_random_uuid(), v_chap_id, 3, 'Moral of the Story', 'Moral of the Story')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'Rama to the Rescue', 'Rama to the Rescue')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Vocabulary and Word Meanings', 'Vocabulary and Word Meanings'),
  (gen_random_uuid(), v_chap_id, 3, 'Theme and Discussion Questions', 'Theme and Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'The Unlikely Best Friends', 'The Unlikely Best Friends')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Vocabulary and Word Meanings', 'Vocabulary and Word Meanings'),
  (gen_random_uuid(), v_chap_id, 3, 'Theme and Discussion Questions', 'Theme and Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'A Friend''s Prayers', 'A Friend''s Prayers')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Rhyme and Rhythm', 'Rhyme and Rhythm'),
  (gen_random_uuid(), v_chap_id, 3, 'Central Idea', 'Central Idea')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'The Chair', 'The Chair')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Vocabulary and Word Meanings', 'Vocabulary and Word Meanings'),
  (gen_random_uuid(), v_chap_id, 3, 'Theme and Discussion Questions', 'Theme and Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'Neem Baba', 'Neem Baba')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Rhyme and Rhythm', 'Rhyme and Rhythm'),
  (gen_random_uuid(), v_chap_id, 3, 'Central Idea', 'Central Idea')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'What a Bird Thought', 'What a Bird Thought')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Rhyme and Rhythm', 'Rhyme and Rhythm'),
  (gen_random_uuid(), v_chap_id, 3, 'Central Idea', 'Central Idea')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'Spices that Heal Us', 'Spices that Heal Us')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Vocabulary and Word Meanings', 'Vocabulary and Word Meanings'),
  (gen_random_uuid(), v_chap_id, 3, 'Theme and Discussion Questions', 'Theme and Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'Change of Heart', 'Change of Heart')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Vocabulary and Word Meanings', 'Vocabulary and Word Meanings'),
  (gen_random_uuid(), v_chap_id, 3, 'Theme and Discussion Questions', 'Theme and Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 11, 'The Winner', 'The Winner')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Vocabulary and Word Meanings', 'Vocabulary and Word Meanings'),
  (gen_random_uuid(), v_chap_id, 3, 'Theme and Discussion Questions', 'Theme and Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 12, 'Yoga: A Way of Life', 'Yoga: A Way of Life')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Vocabulary and Word Meanings', 'Vocabulary and Word Meanings'),
  (gen_random_uuid(), v_chap_id, 3, 'Theme and Discussion Questions', 'Theme and Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 13, 'Hamara Bharat: Incredible India', 'Hamara Bharat: Incredible India')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Vocabulary and Word Meanings', 'Vocabulary and Word Meanings'),
  (gen_random_uuid(), v_chap_id, 3, 'Theme and Discussion Questions', 'Theme and Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 14, 'The Kites', 'The Kites')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Rhyme and Rhythm', 'Rhyme and Rhythm'),
  (gen_random_uuid(), v_chap_id, 3, 'Central Idea', 'Central Idea')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 15, 'Ila Sachani: Embroidering Dreams with her Feet', 'Ila Sachani: Embroidering Dreams with her Feet')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Vocabulary and Word Meanings', 'Vocabulary and Word Meanings'),
  (gen_random_uuid(), v_chap_id, 3, 'Theme and Discussion Questions', 'Theme and Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 16, 'National War Memorial', 'National War Memorial')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Vocabulary and Word Meanings', 'Vocabulary and Word Meanings'),
  (gen_random_uuid(), v_chap_id, 3, 'Theme and Discussion Questions', 'Theme and Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  -- Mathematics
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'Mathematics', 'MATH6')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'Patterns in Mathematics', 'Patterns in Mathematics')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Number Patterns', 'Number Patterns'),
  (gen_random_uuid(), v_chap_id, 2, 'Shape Patterns', 'Shape Patterns'),
  (gen_random_uuid(), v_chap_id, 3, 'Patterns in Nature', 'Patterns in Nature')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'Lines and Angles', 'Lines and Angles')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Types of Lines', 'Types of Lines'),
  (gen_random_uuid(), v_chap_id, 2, 'Measuring Angles', 'Measuring Angles'),
  (gen_random_uuid(), v_chap_id, 3, 'Angle Types', 'Angle Types')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'Number Play', 'Number Play')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Estimation', 'Estimation'),
  (gen_random_uuid(), v_chap_id, 2, 'Number Puzzles', 'Number Puzzles'),
  (gen_random_uuid(), v_chap_id, 3, 'Palindromes', 'Palindromes')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'Data Handling and Presentation', 'Data Handling and Presentation')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Collecting Data', 'Collecting Data'),
  (gen_random_uuid(), v_chap_id, 2, 'Pictographs and Bar Graphs', 'Pictographs and Bar Graphs'),
  (gen_random_uuid(), v_chap_id, 3, 'Interpreting Data', 'Interpreting Data')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'Prime Time', 'Prime Time')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Prime and Composite Numbers', 'Prime and Composite Numbers'),
  (gen_random_uuid(), v_chap_id, 2, 'Factors and Multiples', 'Factors and Multiples'),
  (gen_random_uuid(), v_chap_id, 3, 'HCF and LCM', 'HCF and LCM')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'Perimeter and Area', 'Perimeter and Area')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Perimeter of Shapes', 'Perimeter of Shapes'),
  (gen_random_uuid(), v_chap_id, 2, 'Area of Rectangles and Squares', 'Area of Rectangles and Squares'),
  (gen_random_uuid(), v_chap_id, 3, 'Area of Irregular Figures', 'Area of Irregular Figures')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'Fractions', 'Fractions')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Types of Fractions', 'Types of Fractions'),
  (gen_random_uuid(), v_chap_id, 2, 'Comparing Fractions', 'Comparing Fractions'),
  (gen_random_uuid(), v_chap_id, 3, 'Operations on Fractions', 'Operations on Fractions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'Playing with Constructions', 'Playing with Constructions')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Using a Compass', 'Using a Compass'),
  (gen_random_uuid(), v_chap_id, 2, 'Constructing Circles', 'Constructing Circles'),
  (gen_random_uuid(), v_chap_id, 3, 'Constructing Perpendiculars', 'Constructing Perpendiculars')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'Symmetry', 'Symmetry')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Line Symmetry', 'Line Symmetry'),
  (gen_random_uuid(), v_chap_id, 2, 'Symmetrical Figures', 'Symmetrical Figures'),
  (gen_random_uuid(), v_chap_id, 3, 'Symmetry in Nature', 'Symmetry in Nature')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'The Other Side of Zero', 'The Other Side of Zero')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Introduction to Negative Numbers', 'Introduction to Negative Numbers'),
  (gen_random_uuid(), v_chap_id, 2, 'Number Line with Integers', 'Number Line with Integers'),
  (gen_random_uuid(), v_chap_id, 3, 'Real-Life Uses of Negative Numbers', 'Real-Life Uses of Negative Numbers')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  -- Science
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'Science', 'SCIE6')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'The Wonderful World of Science', 'The Wonderful World of Science')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'What is Science', 'What is Science'),
  (gen_random_uuid(), v_chap_id, 2, 'Scientific Method', 'Scientific Method'),
  (gen_random_uuid(), v_chap_id, 3, 'Curiosity and Observation', 'Curiosity and Observation')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'Diversity in the Living World', 'Diversity in the Living World')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Classification of Organisms', 'Classification of Organisms'),
  (gen_random_uuid(), v_chap_id, 2, 'Plant and Animal Diversity', 'Plant and Animal Diversity'),
  (gen_random_uuid(), v_chap_id, 3, 'Adaptation', 'Adaptation')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'Mindful Eating: A Path to a Healthy Body', 'Mindful Eating: A Path to a Healthy Body')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Balanced Diet', 'Balanced Diet'),
  (gen_random_uuid(), v_chap_id, 2, 'Nutrients', 'Nutrients'),
  (gen_random_uuid(), v_chap_id, 3, 'Healthy Food Habits', 'Healthy Food Habits')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'Measurement of Length and Motion', 'Measurement of Length and Motion')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Units of Measurement', 'Units of Measurement'),
  (gen_random_uuid(), v_chap_id, 2, 'Types of Motion', 'Types of Motion'),
  (gen_random_uuid(), v_chap_id, 3, 'Measuring Instruments', 'Measuring Instruments')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'Materials Around Us', 'Materials Around Us')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Properties of Materials', 'Properties of Materials'),
  (gen_random_uuid(), v_chap_id, 2, 'Grouping Materials', 'Grouping Materials'),
  (gen_random_uuid(), v_chap_id, 3, 'Everyday Uses', 'Everyday Uses')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'Temperature and its Measurement', 'Temperature and its Measurement')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Thermometers', 'Thermometers'),
  (gen_random_uuid(), v_chap_id, 2, 'Temperature Scales', 'Temperature Scales'),
  (gen_random_uuid(), v_chap_id, 3, 'Heat vs Temperature', 'Heat vs Temperature')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'A Journey through States of Water', 'A Journey through States of Water')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'States of Matter', 'States of Matter'),
  (gen_random_uuid(), v_chap_id, 2, 'Water Cycle', 'Water Cycle'),
  (gen_random_uuid(), v_chap_id, 3, 'Change of State', 'Change of State')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'Methods of Separation in Everyday Life', 'Methods of Separation in Everyday Life')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Handpicking and Sieving', 'Handpicking and Sieving'),
  (gen_random_uuid(), v_chap_id, 2, 'Filtration and Evaporation', 'Filtration and Evaporation'),
  (gen_random_uuid(), v_chap_id, 3, 'Winnowing', 'Winnowing')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'Light, Shadows and Reflections', 'Light, Shadows and Reflections')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Formation of Shadows', 'Formation of Shadows'),
  (gen_random_uuid(), v_chap_id, 2, 'Opaque Transparent Translucent', 'Opaque Transparent Translucent'),
  (gen_random_uuid(), v_chap_id, 3, 'Mirrors and Reflection', 'Mirrors and Reflection')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'Electricity and Circuits', 'Electricity and Circuits')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Electric Cells', 'Electric Cells'),
  (gen_random_uuid(), v_chap_id, 2, 'Simple Circuits', 'Simple Circuits'),
  (gen_random_uuid(), v_chap_id, 3, 'Conductors and Insulators', 'Conductors and Insulators')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 11, 'Fun with Magnets', 'Fun with Magnets')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Magnetic and Non-Magnetic Materials', 'Magnetic and Non-Magnetic Materials'),
  (gen_random_uuid(), v_chap_id, 2, 'Poles of a Magnet', 'Poles of a Magnet'),
  (gen_random_uuid(), v_chap_id, 3, 'Uses of Magnets', 'Uses of Magnets')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 12, 'Air Around Us', 'Air Around Us')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Composition of Air', 'Composition of Air'),
  (gen_random_uuid(), v_chap_id, 2, 'Importance of Air', 'Importance of Air'),
  (gen_random_uuid(), v_chap_id, 3, 'Air Pollution', 'Air Pollution')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 13, 'Beyond Earth', 'Beyond Earth')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Solar System', 'Solar System'),
  (gen_random_uuid(), v_chap_id, 2, 'Moon and Stars', 'Moon and Stars'),
  (gen_random_uuid(), v_chap_id, 3, 'Space Exploration', 'Space Exploration')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  -- Social Science
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'Social Science', 'SOCI6')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'Locating Places on the Earth', 'Locating Places on the Earth')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Latitude and Longitude', 'Latitude and Longitude'),
  (gen_random_uuid(), v_chap_id, 2, 'Globe and Maps', 'Globe and Maps'),
  (gen_random_uuid(), v_chap_id, 3, 'Grid Reference', 'Grid Reference')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'Oceans and Continents', 'Oceans and Continents')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Major Oceans', 'Major Oceans'),
  (gen_random_uuid(), v_chap_id, 2, 'Major Continents', 'Major Continents'),
  (gen_random_uuid(), v_chap_id, 3, 'Distribution of Land and Water', 'Distribution of Land and Water')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'Landforms and Life', 'Landforms and Life')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Mountains Plateaus and Plains', 'Mountains Plateaus and Plains'),
  (gen_random_uuid(), v_chap_id, 2, 'Landforms and Human Life', 'Landforms and Human Life'),
  (gen_random_uuid(), v_chap_id, 3, 'Landform Features', 'Landform Features')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'Timeline and Sources of History', 'Timeline and Sources of History')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Reading a Timeline', 'Reading a Timeline'),
  (gen_random_uuid(), v_chap_id, 2, 'Sources of History', 'Sources of History'),
  (gen_random_uuid(), v_chap_id, 3, 'Archaeological Evidence', 'Archaeological Evidence')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'India, That Is Bharat', 'India, That Is Bharat')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Physical Features of India', 'Physical Features of India'),
  (gen_random_uuid(), v_chap_id, 2, 'India''s Neighbours', 'India''s Neighbours'),
  (gen_random_uuid(), v_chap_id, 3, 'Names of India', 'Names of India')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'The Beginnings of Indian Civilisation', 'The Beginnings of Indian Civilisation')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Harappan Civilisation', 'Harappan Civilisation'),
  (gen_random_uuid(), v_chap_id, 2, 'Vedic Age', 'Vedic Age'),
  (gen_random_uuid(), v_chap_id, 3, 'Early Settlements', 'Early Settlements')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'India''s Cultural Roots', 'India''s Cultural Roots')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Ancient Texts', 'Ancient Texts'),
  (gen_random_uuid(), v_chap_id, 2, 'Languages and Scripts', 'Languages and Scripts'),
  (gen_random_uuid(), v_chap_id, 3, 'Art and Architecture', 'Art and Architecture')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'Unity in Diversity, or ''Many in the One''', 'Unity in Diversity, or ''Many in the One''')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Diversity in India', 'Diversity in India'),
  (gen_random_uuid(), v_chap_id, 2, 'Unity in Diversity', 'Unity in Diversity'),
  (gen_random_uuid(), v_chap_id, 3, 'Festivals and Traditions', 'Festivals and Traditions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'Family and Community', 'Family and Community')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Types of Families', 'Types of Families'),
  (gen_random_uuid(), v_chap_id, 2, 'Roles in a Family', 'Roles in a Family'),
  (gen_random_uuid(), v_chap_id, 3, 'Community Life', 'Community Life')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'Grassroots Democracy — Part 1: Governance', 'Grassroots Democracy — Part 1: Governance')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Need for Government', 'Need for Government'),
  (gen_random_uuid(), v_chap_id, 2, 'Levels of Government', 'Levels of Government'),
  (gen_random_uuid(), v_chap_id, 3, 'Democratic Governance', 'Democratic Governance')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 11, 'Grassroots Democracy — Part 2: Local Government in Rural Areas', 'Grassroots Democracy — Part 2: Local Government in Rural Areas')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Gram Sabha', 'Gram Sabha'),
  (gen_random_uuid(), v_chap_id, 2, 'Gram Panchayat', 'Gram Panchayat'),
  (gen_random_uuid(), v_chap_id, 3, 'Panchayati Raj', 'Panchayati Raj')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 12, 'Grassroots Democracy — Part 3: Local Government in Urban Areas', 'Grassroots Democracy — Part 3: Local Government in Urban Areas')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Municipal Corporation', 'Municipal Corporation'),
  (gen_random_uuid(), v_chap_id, 2, 'Municipality', 'Municipality'),
  (gen_random_uuid(), v_chap_id, 3, 'Urban Governance', 'Urban Governance')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 13, 'The Value of Work', 'The Value of Work')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Types of Work', 'Types of Work'),
  (gen_random_uuid(), v_chap_id, 2, 'Value of Labour', 'Value of Labour'),
  (gen_random_uuid(), v_chap_id, 3, 'Work and Dignity', 'Work and Dignity')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 14, 'Economic Activities Around Us', 'Economic Activities Around Us')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Production and Consumption', 'Production and Consumption'),
  (gen_random_uuid(), v_chap_id, 2, 'Goods and Services', 'Goods and Services'),
  (gen_random_uuid(), v_chap_id, 3, 'Economic Activities', 'Economic Activities')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  -- Hindi
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'Hindi', 'HIND6')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'Matribhoomi', 'Matribhoomi')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'Gol', 'Gol')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'Pehli Boond', 'Pehli Boond')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'Haar Ki Jeet', 'Haar Ki Jeet')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'Rahim Ke Dohe', 'Rahim Ke Dohe')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Dohon ka Bhavarth', 'Dohon ka Bhavarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Alankar', 'Alankar'),
  (gen_random_uuid(), v_chap_id, 3, 'Kanth Path', 'Kanth Path')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'Meri Maa', 'Meri Maa')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Kavita ka Bhavarth', 'Kavita ka Bhavarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'Jalate Chalo', 'Jalate Chalo')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Kavita ka Bhavarth', 'Kavita ka Bhavarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'Satriya Aur Bihu Nritya', 'Satriya Aur Bihu Nritya')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'Maiya Main Nahin Makhan Khayo', 'Maiya Main Nahin Makhan Khayo')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Kavita ka Bhavarth', 'Kavita ka Bhavarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'Pariksha', 'Pariksha')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 11, 'Chetak Ki Veerta', 'Chetak Ki Veerta')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 12, 'Hind Mahasagar Mein Chhota Sa Hindustan', 'Hind Mahasagar Mein Chhota Sa Hindustan')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 13, 'Ped Ki Baat', 'Ped Ki Baat')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabd Arth', 'Shabd Arth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  -- Sanskrit
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'Sanskrit', 'SANS6')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'वयं वर्णमालां पठामः', 'वयं वर्णमालां पठामः')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Varnamala Gyan', 'Varnamala Gyan'),
  (gen_random_uuid(), v_chap_id, 3, 'Uchcharan Abhyas', 'Uchcharan Abhyas')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'एषः कः? एषा का? एतत् किम्?', 'एषः कः? एषा का? एतत् किम्?')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Sarvanam Gyan', 'Sarvanam Gyan'),
  (gen_random_uuid(), v_chap_id, 3, 'Anuvad Abhyas', 'Anuvad Abhyas')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'अहं च त्वं च', 'अहं च त्वं च')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Vyakaran', 'Vyakaran'),
  (gen_random_uuid(), v_chap_id, 3, 'Anuvad Abhyas', 'Anuvad Abhyas')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'अहं प्रातः उत्तिष्ठामि', 'अहं प्रातः उत्तिष्ठामि')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Dhatu Roop', 'Dhatu Roop'),
  (gen_random_uuid(), v_chap_id, 3, 'Anuvad Abhyas', 'Anuvad Abhyas')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'शूराः वयं धीराः वयम्', 'शूराः वयं धीराः वयम्')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Kanth Path', 'Kanth Path')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'सः एव महान् चित्रकारः', 'सः एव महान् चित्रकारः')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Anuvad Abhyas', 'Anuvad Abhyas')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'अतिथिदेवो भव', 'अतिथिदेवो भव')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'बुद्धिः सर्वार्थसाधिका', 'बुद्धिः सर्वार्थसाधिका')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'यो जानाति सः पण्डितः', 'यो जानाति सः पण्डितः')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'त्वम् आपणं गच्छ', 'त्वम् आपणं गच्छ')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Vyakaran', 'Vyakaran'),
  (gen_random_uuid(), v_chap_id, 3, 'Anuvad Abhyas', 'Anuvad Abhyas')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 11, 'पृथिव्यां त्रीणि रत्नानि', 'पृथिव्यां त्रीणि रत्नानि')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Kanth Path', 'Kanth Path')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 12, 'आलस्यं हि मनुष्याणां शरीरस्थो महान् रिपुः', 'आलस्यं हि मनुष्याणां शरीरस्थो महान् रिपुः')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 13, 'सङ्ख्यागणना ननु सरला', 'सङ्ख्यागणना ननु सरला')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Sankhya Gyan', 'Sankhya Gyan'),
  (gen_random_uuid(), v_chap_id, 2, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Anuvad Abhyas', 'Anuvad Abhyas')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 14, 'माधवस्य प्रियम् अङ्गम्', 'माधवस्य प्रियम् अङ्गम्')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 15, 'वृक्षाः सत्पुरुषाः इव', 'वृक्षाः सत्पुरुषाः इव')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Shabdarth', 'Shabdarth'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Kanth Path', 'Kanth Path')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

END $$;
