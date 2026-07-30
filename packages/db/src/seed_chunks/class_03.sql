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
  -- CLASS 3
  -- ==========================================
  INSERT INTO public.classes (id, grade_number, name)
  VALUES (gen_random_uuid(), 3, 'Class 3')
  ON CONFLICT (grade_number) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO v_class_id;

  -- Mathematics (Maths Mela)
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'Mathematics (Maths Mela)', 'MATH3')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'What''s in a Name', 'What''s in a Name')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Number Names', 'Number Names'),
  (gen_random_uuid(), v_chap_id, 2, 'Reading Numbers', 'Reading Numbers'),
  (gen_random_uuid(), v_chap_id, 3, 'Place Value Basics', 'Place Value Basics')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'Toy Joy', 'Toy Joy')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, '3-Digit Numbers', '3-Digit Numbers'),
  (gen_random_uuid(), v_chap_id, 2, 'Comparing Numbers', 'Comparing Numbers'),
  (gen_random_uuid(), v_chap_id, 3, 'Ordering Numbers', 'Ordering Numbers')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'Double Century', 'Double Century')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Numbers up to 200', 'Numbers up to 200'),
  (gen_random_uuid(), v_chap_id, 2, 'Skip Counting', 'Skip Counting'),
  (gen_random_uuid(), v_chap_id, 3, 'Number Patterns', 'Number Patterns')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'Vacation with My Nani Maa', 'Vacation with My Nani Maa')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Addition up to 3 Digits', 'Addition up to 3 Digits'),
  (gen_random_uuid(), v_chap_id, 2, 'Subtraction up to 3 Digits', 'Subtraction up to 3 Digits'),
  (gen_random_uuid(), v_chap_id, 3, 'Word Problems', 'Word Problems')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'Fun with Shapes', 'Fun with Shapes')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, '2D Shapes', '2D Shapes'),
  (gen_random_uuid(), v_chap_id, 2, 'Symmetry', 'Symmetry'),
  (gen_random_uuid(), v_chap_id, 3, 'Tiling Patterns', 'Tiling Patterns')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'House of Hundreds - I', 'House of Hundreds - I')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Place Value', 'Place Value'),
  (gen_random_uuid(), v_chap_id, 2, 'Expanded Form', 'Expanded Form'),
  (gen_random_uuid(), v_chap_id, 3, 'Regrouping', 'Regrouping')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'Raksha Bandhan', 'Raksha Bandhan')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Measurement of Length', 'Measurement of Length'),
  (gen_random_uuid(), v_chap_id, 2, 'Comparing Lengths', 'Comparing Lengths'),
  (gen_random_uuid(), v_chap_id, 3, 'Standard Units', 'Standard Units')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'Fair Share', 'Fair Share')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Introduction to Fractions', 'Introduction to Fractions'),
  (gen_random_uuid(), v_chap_id, 2, 'Equal Parts', 'Equal Parts'),
  (gen_random_uuid(), v_chap_id, 3, 'Sharing Equally', 'Sharing Equally')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'House of Hundreds - II', 'House of Hundreds - II')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Addition with Regrouping', 'Addition with Regrouping'),
  (gen_random_uuid(), v_chap_id, 2, 'Subtraction with Regrouping', 'Subtraction with Regrouping'),
  (gen_random_uuid(), v_chap_id, 3, 'Applications', 'Applications')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'Fun at Class Party', 'Fun at Class Party')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Data Collection', 'Data Collection'),
  (gen_random_uuid(), v_chap_id, 2, 'Simple Tables', 'Simple Tables'),
  (gen_random_uuid(), v_chap_id, 3, 'Pictographs', 'Pictographs')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 11, 'Filling and Lifting', 'Filling and Lifting')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Measurement of Capacity', 'Measurement of Capacity'),
  (gen_random_uuid(), v_chap_id, 2, 'Measurement of Weight', 'Measurement of Weight'),
  (gen_random_uuid(), v_chap_id, 3, 'Comparing Quantities', 'Comparing Quantities')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 12, 'Give and Take', 'Give and Take')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Addition Word Problems', 'Addition Word Problems'),
  (gen_random_uuid(), v_chap_id, 2, 'Subtraction Word Problems', 'Subtraction Word Problems'),
  (gen_random_uuid(), v_chap_id, 3, 'Mixed Problems', 'Mixed Problems')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 13, 'Time Goes On', 'Time Goes On')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Reading a Clock', 'Reading a Clock'),
  (gen_random_uuid(), v_chap_id, 2, 'Calendar Basics', 'Calendar Basics'),
  (gen_random_uuid(), v_chap_id, 3, 'Days and Months', 'Days and Months')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 14, 'The Surajkund Fair', 'The Surajkund Fair')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Recognising Money', 'Recognising Money'),
  (gen_random_uuid(), v_chap_id, 2, 'Simple Money Calculations', 'Simple Money Calculations'),
  (gen_random_uuid(), v_chap_id, 3, 'Making Change', 'Making Change')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  -- English (Santoor)
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'English (Santoor)', 'ENGL3')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'Colours', 'Colours')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Colour Vocabulary', 'Colour Vocabulary'),
  (gen_random_uuid(), v_chap_id, 3, 'Rhyming Words', 'Rhyming Words')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'Badal and Moti', 'Badal and Moti')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'New Vocabulary', 'New Vocabulary'),
  (gen_random_uuid(), v_chap_id, 3, 'Discussion Questions', 'Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'Best Friends', 'Best Friends')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'New Vocabulary', 'New Vocabulary'),
  (gen_random_uuid(), v_chap_id, 3, 'Discussion Questions', 'Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'Out in the Garden', 'Out in the Garden')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Rhyming Words', 'Rhyming Words'),
  (gen_random_uuid(), v_chap_id, 3, 'New Vocabulary', 'New Vocabulary')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'Talking Toys', 'Talking Toys')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'New Vocabulary', 'New Vocabulary'),
  (gen_random_uuid(), v_chap_id, 3, 'Discussion Questions', 'Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'Paper Boats', 'Paper Boats')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Rhyming Words', 'Rhyming Words'),
  (gen_random_uuid(), v_chap_id, 3, 'New Vocabulary', 'New Vocabulary')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'The Big Laddoo', 'The Big Laddoo')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'New Vocabulary', 'New Vocabulary'),
  (gen_random_uuid(), v_chap_id, 3, 'Sequencing Events', 'Sequencing Events')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'Thank God', 'Thank God')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'New Vocabulary', 'New Vocabulary'),
  (gen_random_uuid(), v_chap_id, 3, 'Discussion Questions', 'Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'Madhu''s Wish', 'Madhu''s Wish')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'New Vocabulary', 'New Vocabulary'),
  (gen_random_uuid(), v_chap_id, 3, 'Discussion Questions', 'Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'Night', 'Night')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Rhyming Words', 'Rhyming Words'),
  (gen_random_uuid(), v_chap_id, 3, 'New Vocabulary', 'New Vocabulary')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 11, 'Chanda Mama Counts the Stars', 'Chanda Mama Counts the Stars')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'New Vocabulary', 'New Vocabulary'),
  (gen_random_uuid(), v_chap_id, 3, 'Discussion Questions', 'Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 12, 'Chandrayaan', 'Chandrayaan')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'New Vocabulary', 'New Vocabulary'),
  (gen_random_uuid(), v_chap_id, 3, 'Discussion Questions', 'Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  -- EVS (Our Wondrous World)
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'EVS (Our Wondrous World)', 'EVS3')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'Family and Friends', 'Family and Friends')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Types of Families', 'Types of Families'),
  (gen_random_uuid(), v_chap_id, 2, 'Roles in a Family', 'Roles in a Family'),
  (gen_random_uuid(), v_chap_id, 3, 'Friendship', 'Friendship')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'Going to the Mela', 'Going to the Mela')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Fairs and Markets', 'Fairs and Markets'),
  (gen_random_uuid(), v_chap_id, 2, 'Buying and Selling', 'Buying and Selling'),
  (gen_random_uuid(), v_chap_id, 3, 'Community Gatherings', 'Community Gatherings')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'Celebrating Festivals', 'Celebrating Festivals')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Festivals We Celebrate', 'Festivals We Celebrate'),
  (gen_random_uuid(), v_chap_id, 2, 'Festival Customs', 'Festival Customs'),
  (gen_random_uuid(), v_chap_id, 3, 'Unity in Diversity', 'Unity in Diversity')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'Getting to Know Plants', 'Getting to Know Plants')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Parts of a Plant', 'Parts of a Plant'),
  (gen_random_uuid(), v_chap_id, 2, 'Types of Plants', 'Types of Plants'),
  (gen_random_uuid(), v_chap_id, 3, 'Plant Life Cycle', 'Plant Life Cycle')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'Plants and Animals Live Together', 'Plants and Animals Live Together')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Interdependence', 'Interdependence'),
  (gen_random_uuid(), v_chap_id, 2, 'Habitats', 'Habitats'),
  (gen_random_uuid(), v_chap_id, 3, 'Food Chains', 'Food Chains')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'Living in Harmony', 'Living in Harmony')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Balance in Nature', 'Balance in Nature'),
  (gen_random_uuid(), v_chap_id, 2, 'Human Impact', 'Human Impact'),
  (gen_random_uuid(), v_chap_id, 3, 'Caring for Nature', 'Caring for Nature')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'Water A Precious Gift', 'Water A Precious Gift')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Sources of Water', 'Sources of Water'),
  (gen_random_uuid(), v_chap_id, 2, 'Uses of Water', 'Uses of Water'),
  (gen_random_uuid(), v_chap_id, 3, 'Conserving Water', 'Conserving Water')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'Food We Eat', 'Food We Eat')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Food Sources', 'Food Sources'),
  (gen_random_uuid(), v_chap_id, 2, 'Balanced Diet', 'Balanced Diet'),
  (gen_random_uuid(), v_chap_id, 3, 'Healthy Eating Habits', 'Healthy Eating Habits')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'Staying Healthy and Happy', 'Staying Healthy and Happy')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Personal Hygiene', 'Personal Hygiene'),
  (gen_random_uuid(), v_chap_id, 2, 'Exercise and Rest', 'Exercise and Rest'),
  (gen_random_uuid(), v_chap_id, 3, 'Emotional Wellbeing', 'Emotional Wellbeing')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'This World of Things', 'This World of Things')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Materials Around Us', 'Materials Around Us'),
  (gen_random_uuid(), v_chap_id, 2, 'Properties of Materials', 'Properties of Materials'),
  (gen_random_uuid(), v_chap_id, 3, 'Uses of Materials', 'Uses of Materials')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 11, 'Making Things', 'Making Things')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Simple Tools', 'Simple Tools'),
  (gen_random_uuid(), v_chap_id, 2, 'How Things are Made', 'How Things are Made'),
  (gen_random_uuid(), v_chap_id, 3, 'Craftsmanship', 'Craftsmanship')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 12, 'Taking Charge of Waste', 'Taking Charge of Waste')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Types of Waste', 'Types of Waste'),
  (gen_random_uuid(), v_chap_id, 2, 'Waste Disposal', 'Waste Disposal'),
  (gen_random_uuid(), v_chap_id, 3, 'Reduce Reuse Recycle', 'Reduce Reuse Recycle')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  -- Hindi (Veena)
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'Hindi (Veena)', 'HIND3')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'Seekho', 'Seekho')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'Chinti', 'Chinti')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'Kitne Pair?', 'Kitne Pair?')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'Baya Hamari Chidiya Rani!', 'Baya Hamari Chidiya Rani!')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Kavita Paath', 'Kavita Paath'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Tuk Wale Shabd', 'Tuk Wale Shabd')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'Aam Ka Ped', 'Aam Ka Ped')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'Birbal Ki Khichadi', 'Birbal Ki Khichadi')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'Mitra Ko Patra', 'Mitra Ko Patra')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'Chatur Gidda', 'Chatur Gidda')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'Prakriti Parv - Phooldei', 'Prakriti Parv - Phooldei')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'Rassaakashi', 'Rassaakashi')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 11, 'Ek Jadui Pitara', 'Ek Jadui Pitara')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 12, 'Apna Apna Kaam', 'Apna Apna Kaam')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 13, 'Pedon Ki Amma Thimakka', 'Pedon Ki Amma Thimakka')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 14, 'Kisaan Ki Hoshiyari', 'Kisaan Ki Hoshiyari')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 15, 'Bharat', 'Bharat')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Kavita Paath', 'Kavita Paath'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Tuk Wale Shabd', 'Tuk Wale Shabd')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 16, 'Chandrayaan (Samvad)', 'Chandrayaan (Samvad)')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 17, 'Bolne Vali Mand', 'Bolne Vali Mand')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 18, 'Ham Anek Kintu Ek', 'Ham Anek Kintu Ek')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

END $$;
