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
  -- CLASS 4
  -- ==========================================
  INSERT INTO public.classes (id, grade_number, name)
  VALUES (gen_random_uuid(), 4, 'Class 4')
  ON CONFLICT (grade_number) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO v_class_id;

  -- Mathematics (Math-Magic 4)
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'Mathematics (Math-Magic 4)', 'MATH4')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'Building with Bricks', 'Building with Bricks')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Patterns and Tiling', 'Patterns and Tiling'),
  (gen_random_uuid(), v_chap_id, 2, 'Area Basics', 'Area Basics'),
  (gen_random_uuid(), v_chap_id, 3, 'Shapes and Bricks', 'Shapes and Bricks')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'Long and Short', 'Long and Short')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Measuring Length', 'Measuring Length'),
  (gen_random_uuid(), v_chap_id, 2, 'Units of Length', 'Units of Length'),
  (gen_random_uuid(), v_chap_id, 3, 'Comparing Lengths', 'Comparing Lengths')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'A Trip to Bhopal', 'A Trip to Bhopal')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Multiplication', 'Multiplication'),
  (gen_random_uuid(), v_chap_id, 2, 'Word Problems', 'Word Problems'),
  (gen_random_uuid(), v_chap_id, 3, 'Estimation', 'Estimation')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'Tick-Tick-Tick', 'Tick-Tick-Tick')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Reading Time', 'Reading Time'),
  (gen_random_uuid(), v_chap_id, 2, 'Duration', 'Duration'),
  (gen_random_uuid(), v_chap_id, 3, 'Calendar Basics', 'Calendar Basics')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'The Way The World Looks', 'The Way The World Looks')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Views of Objects', 'Views of Objects'),
  (gen_random_uuid(), v_chap_id, 2, 'Maps', 'Maps'),
  (gen_random_uuid(), v_chap_id, 3, 'Perspective', 'Perspective')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'The Junk Seller', 'The Junk Seller')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Weight and Measurement', 'Weight and Measurement'),
  (gen_random_uuid(), v_chap_id, 2, 'Money Calculations', 'Money Calculations'),
  (gen_random_uuid(), v_chap_id, 3, 'Word Problems', 'Word Problems')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'Jugs and Mugs', 'Jugs and Mugs')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Measuring Capacity', 'Measuring Capacity'),
  (gen_random_uuid(), v_chap_id, 2, 'Litres and Millilitres', 'Litres and Millilitres'),
  (gen_random_uuid(), v_chap_id, 3, 'Word Problems', 'Word Problems')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'Carts and Wheels', 'Carts and Wheels')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Circles', 'Circles'),
  (gen_random_uuid(), v_chap_id, 2, 'Symmetry in Wheels', 'Symmetry in Wheels'),
  (gen_random_uuid(), v_chap_id, 3, 'Measurement', 'Measurement')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'Halves and Quarters', 'Halves and Quarters')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Fractions Basics', 'Fractions Basics'),
  (gen_random_uuid(), v_chap_id, 2, 'Halves and Quarters', 'Halves and Quarters'),
  (gen_random_uuid(), v_chap_id, 3, 'Fraction Word Problems', 'Fraction Word Problems')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'Play with Patterns', 'Play with Patterns')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Number Patterns', 'Number Patterns'),
  (gen_random_uuid(), v_chap_id, 2, 'Shape Patterns', 'Shape Patterns'),
  (gen_random_uuid(), v_chap_id, 3, 'Making Patterns', 'Making Patterns')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 11, 'Tables and Shares', 'Tables and Shares')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Multiplication Tables', 'Multiplication Tables'),
  (gen_random_uuid(), v_chap_id, 2, 'Division Basics', 'Division Basics'),
  (gen_random_uuid(), v_chap_id, 3, 'Equal Sharing', 'Equal Sharing')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 12, 'How Heavy? How Light?', 'How Heavy? How Light?')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Measuring Weight', 'Measuring Weight'),
  (gen_random_uuid(), v_chap_id, 2, 'Comparing Weights', 'Comparing Weights'),
  (gen_random_uuid(), v_chap_id, 3, 'Word Problems', 'Word Problems')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 13, 'Fields and Fences', 'Fields and Fences')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Perimeter', 'Perimeter'),
  (gen_random_uuid(), v_chap_id, 2, 'Area of Simple Shapes', 'Area of Simple Shapes'),
  (gen_random_uuid(), v_chap_id, 3, 'Word Problems', 'Word Problems')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 14, 'Smart Charts', 'Smart Charts')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Reading Charts', 'Reading Charts'),
  (gen_random_uuid(), v_chap_id, 2, 'Making Charts', 'Making Charts'),
  (gen_random_uuid(), v_chap_id, 3, 'Interpreting Data', 'Interpreting Data')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  -- English (Marigold 4)
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'English (Marigold 4)', 'ENGL4')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'Wake Up!', 'Wake Up!')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Morning Vocabulary', 'Morning Vocabulary'),
  (gen_random_uuid(), v_chap_id, 3, 'Action Words', 'Action Words')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'Neha''s Alarm Clock', 'Neha''s Alarm Clock')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Sequencing Events', 'Sequencing Events'),
  (gen_random_uuid(), v_chap_id, 3, 'New Words', 'New Words')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'Noses', 'Noses')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Descriptive Words', 'Descriptive Words'),
  (gen_random_uuid(), v_chap_id, 3, 'Rhyme Scheme', 'Rhyme Scheme')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'The Little Fir Tree', 'The Little Fir Tree')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Moral of the Story', 'Moral of the Story'),
  (gen_random_uuid(), v_chap_id, 3, 'New Vocabulary', 'New Vocabulary')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'Run!', 'Run!')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Action Words', 'Action Words'),
  (gen_random_uuid(), v_chap_id, 3, 'Rhyme Scheme', 'Rhyme Scheme')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'Nasruddin''s Aim', 'Nasruddin''s Aim')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Moral of the Story', 'Moral of the Story'),
  (gen_random_uuid(), v_chap_id, 3, 'New Vocabulary', 'New Vocabulary')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'Why?', 'Why?')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Rhyme Scheme', 'Rhyme Scheme'),
  (gen_random_uuid(), v_chap_id, 3, 'New Vocabulary', 'New Vocabulary')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'Alice in Wonderland', 'Alice in Wonderland')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'New Vocabulary', 'New Vocabulary'),
  (gen_random_uuid(), v_chap_id, 3, 'Discussion Questions', 'Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'Don''t be Afraid of the Dark', 'Don''t be Afraid of the Dark')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Rhyme Scheme', 'Rhyme Scheme'),
  (gen_random_uuid(), v_chap_id, 3, 'New Vocabulary', 'New Vocabulary')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'Helen Keller', 'Helen Keller')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'New Vocabulary', 'New Vocabulary'),
  (gen_random_uuid(), v_chap_id, 3, 'Discussion Questions', 'Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 11, 'The Donkey', 'The Donkey')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Rhyme Scheme', 'Rhyme Scheme'),
  (gen_random_uuid(), v_chap_id, 3, 'New Vocabulary', 'New Vocabulary')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 12, 'I had a Little Pony', 'I had a Little Pony')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Rhyme Scheme', 'Rhyme Scheme'),
  (gen_random_uuid(), v_chap_id, 3, 'New Vocabulary', 'New Vocabulary')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 13, 'The Milkman''s Cow', 'The Milkman''s Cow')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Moral of the Story', 'Moral of the Story'),
  (gen_random_uuid(), v_chap_id, 3, 'New Vocabulary', 'New Vocabulary')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 14, 'Hiawatha', 'Hiawatha')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Rhyme Scheme', 'Rhyme Scheme'),
  (gen_random_uuid(), v_chap_id, 3, 'New Vocabulary', 'New Vocabulary')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 15, 'The Scholar''s Mother Tongue', 'The Scholar''s Mother Tongue')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'New Vocabulary', 'New Vocabulary'),
  (gen_random_uuid(), v_chap_id, 3, 'Discussion Questions', 'Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 16, 'A Watering Rhyme', 'A Watering Rhyme')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Rhyme Scheme', 'Rhyme Scheme'),
  (gen_random_uuid(), v_chap_id, 3, 'New Vocabulary', 'New Vocabulary')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 17, 'The Giving Tree', 'The Giving Tree')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Moral of the Story', 'Moral of the Story'),
  (gen_random_uuid(), v_chap_id, 3, 'New Vocabulary', 'New Vocabulary')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 18, 'Books', 'Books')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Rhyme Scheme', 'Rhyme Scheme'),
  (gen_random_uuid(), v_chap_id, 3, 'New Vocabulary', 'New Vocabulary')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 19, 'Going to Buy a Book', 'Going to Buy a Book')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'New Vocabulary', 'New Vocabulary'),
  (gen_random_uuid(), v_chap_id, 3, 'Discussion Questions', 'Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 20, 'The Naughty Boy', 'The Naughty Boy')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Rhyme Scheme', 'Rhyme Scheme'),
  (gen_random_uuid(), v_chap_id, 3, 'New Vocabulary', 'New Vocabulary')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  -- EVS (Looking Around 4)
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'EVS (Looking Around 4)', 'EVS4')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'Going to School', 'Going to School')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Modes of Travel', 'Modes of Travel'),
  (gen_random_uuid(), v_chap_id, 2, 'Bridges and Roads', 'Bridges and Roads'),
  (gen_random_uuid(), v_chap_id, 3, 'Challenges in Travel', 'Challenges in Travel')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'Ear to Ear', 'Ear to Ear')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'The Sense of Hearing', 'The Sense of Hearing'),
  (gen_random_uuid(), v_chap_id, 2, 'Sounds Around Us', 'Sounds Around Us'),
  (gen_random_uuid(), v_chap_id, 3, 'Care of Ears', 'Care of Ears')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'A Day with Nandu', 'A Day with Nandu')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Life of an Elephant', 'Life of an Elephant'),
  (gen_random_uuid(), v_chap_id, 2, 'Animal Behaviour', 'Animal Behaviour'),
  (gen_random_uuid(), v_chap_id, 3, 'Human-Animal Interaction', 'Human-Animal Interaction')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'The Story of Amrita', 'The Story of Amrita')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Environmental Movements', 'Environmental Movements'),
  (gen_random_uuid(), v_chap_id, 2, 'Conservation of Trees', 'Conservation of Trees'),
  (gen_random_uuid(), v_chap_id, 3, 'Community Action', 'Community Action')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'Anita and the Honeybees', 'Anita and the Honeybees')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Bee Keeping', 'Bee Keeping'),
  (gen_random_uuid(), v_chap_id, 2, 'Life Cycle of Bees', 'Life Cycle of Bees'),
  (gen_random_uuid(), v_chap_id, 3, 'Products from Bees', 'Products from Bees')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'Omana''s Journey', 'Omana''s Journey')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Modes of Transport', 'Modes of Transport'),
  (gen_random_uuid(), v_chap_id, 2, 'Travel Experiences', 'Travel Experiences'),
  (gen_random_uuid(), v_chap_id, 3, 'Geography of Travel', 'Geography of Travel')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'From the Window', 'From the Window')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Observing Surroundings', 'Observing Surroundings'),
  (gen_random_uuid(), v_chap_id, 2, 'Rural and Urban Views', 'Rural and Urban Views'),
  (gen_random_uuid(), v_chap_id, 3, 'Describing Landscapes', 'Describing Landscapes')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'Reaching Grandmother''s House', 'Reaching Grandmother''s House')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Family Journeys', 'Family Journeys'),
  (gen_random_uuid(), v_chap_id, 2, 'Modes of Travel', 'Modes of Travel'),
  (gen_random_uuid(), v_chap_id, 3, 'Mapping a Route', 'Mapping a Route')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'Changing Families', 'Changing Families')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Types of Families', 'Types of Families'),
  (gen_random_uuid(), v_chap_id, 2, 'Family Roles', 'Family Roles'),
  (gen_random_uuid(), v_chap_id, 3, 'Family Traditions', 'Family Traditions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'Hu Tu Tu, Hu Tu Tu', 'Hu Tu Tu, Hu Tu Tu')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Traditional Games', 'Traditional Games'),
  (gen_random_uuid(), v_chap_id, 2, 'Rules of Kabaddi', 'Rules of Kabaddi'),
  (gen_random_uuid(), v_chap_id, 3, 'Games Around India', 'Games Around India')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 11, 'The Valley of Flowers', 'The Valley of Flowers')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Mountain Ecosystems', 'Mountain Ecosystems'),
  (gen_random_uuid(), v_chap_id, 2, 'Flora and Fauna', 'Flora and Fauna'),
  (gen_random_uuid(), v_chap_id, 3, 'Conservation', 'Conservation')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 12, 'Changing Times', 'Changing Times')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Old vs New Ways of Life', 'Old vs New Ways of Life'),
  (gen_random_uuid(), v_chap_id, 2, 'Technology Changes', 'Technology Changes'),
  (gen_random_uuid(), v_chap_id, 3, 'Comparing Generations', 'Comparing Generations')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 13, 'A River''s Tale', 'A River''s Tale')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'River Systems', 'River Systems'),
  (gen_random_uuid(), v_chap_id, 2, 'Uses of Rivers', 'Uses of Rivers'),
  (gen_random_uuid(), v_chap_id, 3, 'River Pollution', 'River Pollution')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 14, 'Basva''s Farm', 'Basva''s Farm')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Farming Practices', 'Farming Practices'),
  (gen_random_uuid(), v_chap_id, 2, 'Crops and Seasons', 'Crops and Seasons'),
  (gen_random_uuid(), v_chap_id, 3, 'Farm Life', 'Farm Life')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 15, 'From Market to Home', 'From Market to Home')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Types of Markets', 'Types of Markets'),
  (gen_random_uuid(), v_chap_id, 2, 'Buying and Selling', 'Buying and Selling'),
  (gen_random_uuid(), v_chap_id, 3, 'Money Basics', 'Money Basics')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 16, 'A busy Month', 'A busy Month')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Seasonal Activities', 'Seasonal Activities'),
  (gen_random_uuid(), v_chap_id, 2, 'Festivals and Work', 'Festivals and Work'),
  (gen_random_uuid(), v_chap_id, 3, 'Community Life', 'Community Life')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 17, 'Nandita in Mumbai', 'Nandita in Mumbai')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'City Life', 'City Life'),
  (gen_random_uuid(), v_chap_id, 2, 'Urban Transport', 'Urban Transport'),
  (gen_random_uuid(), v_chap_id, 3, 'City vs Village Life', 'City vs Village Life')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  -- Hindi (Rimjhim 4)
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'Hindi (Rimjhim 4)', 'HIND4')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'Man Ke Bhole Bhole Badal', 'Man Ke Bhole Bhole Badal')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Kavita Paath', 'Kavita Paath'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Tuk Wale Shabd', 'Tuk Wale Shabd')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'Jaisa Sawal Vaisa Jawab', 'Jaisa Sawal Vaisa Jawab')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Buddhi Kaushal', 'Buddhi Kaushal'),
  (gen_random_uuid(), v_chap_id, 3, 'Naye Shabd', 'Naye Shabd')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'Kirmich ki Gend', 'Kirmich ki Gend')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'Koi Laake Mujhe De', 'Koi Laake Mujhe De')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Kavita Paath', 'Kavita Paath'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Tuk Wale Shabd', 'Tuk Wale Shabd')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'Dost ki Poshak', 'Dost ki Poshak')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'Naav Banao', 'Naav Banao')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'Daan ka Hisaab', 'Daan ka Hisaab')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'Kaun', 'Kaun')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Kavita Paath', 'Kavita Paath'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Tuk Wale Shabd', 'Tuk Wale Shabd')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'Svatantra ki Aur', 'Svatantra ki Aur')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'Thap Roti Thap Dal', 'Thap Roti Thap Dal')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Kavita Paath', 'Kavita Paath'),
  (gen_random_uuid(), v_chap_id, 2, 'Bhavarth', 'Bhavarth'),
  (gen_random_uuid(), v_chap_id, 3, 'Tuk Wale Shabd', 'Tuk Wale Shabd')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 11, 'Padakku ki Soojh', 'Padakku ki Soojh')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 12, 'Sunita ki Pahiya Kursi', 'Sunita ki Pahiya Kursi')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 13, 'HudHud', 'HudHud')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 14, 'Muft Hi Muft', 'Muft Hi Muft')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

END $$;
