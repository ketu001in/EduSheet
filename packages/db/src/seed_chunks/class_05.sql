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
  -- CLASS 5
  -- ==========================================
  INSERT INTO public.classes (id, grade_number, name)
  VALUES (gen_random_uuid(), 5, 'Class 5')
  ON CONFLICT (grade_number) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO v_class_id;

  -- Mathematics (Maths Mela)
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'Mathematics (Maths Mela)', 'MATH5')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'We the Travellers - I', 'We the Travellers - I')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Distance and Direction', 'Distance and Direction'),
  (gen_random_uuid(), v_chap_id, 2, 'Reading Maps', 'Reading Maps'),
  (gen_random_uuid(), v_chap_id, 3, 'Travel Word Problems', 'Travel Word Problems')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'Fractions', 'Fractions')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Like and Unlike Fractions', 'Like and Unlike Fractions'),
  (gen_random_uuid(), v_chap_id, 2, 'Operations on Fractions', 'Operations on Fractions'),
  (gen_random_uuid(), v_chap_id, 3, 'Fraction Word Problems', 'Fraction Word Problems')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'Angles as Turns', 'Angles as Turns')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Types of Angles', 'Types of Angles'),
  (gen_random_uuid(), v_chap_id, 2, 'Measuring Angles', 'Measuring Angles'),
  (gen_random_uuid(), v_chap_id, 3, 'Angles in Shapes', 'Angles in Shapes')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'We the Travellers - II', 'We the Travellers - II')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Speed and Time', 'Speed and Time'),
  (gen_random_uuid(), v_chap_id, 2, 'Distance Calculations', 'Distance Calculations'),
  (gen_random_uuid(), v_chap_id, 3, 'Travel Word Problems', 'Travel Word Problems')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'Far and Near', 'Far and Near')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Measurement of Distance', 'Measurement of Distance'),
  (gen_random_uuid(), v_chap_id, 2, 'Estimation', 'Estimation'),
  (gen_random_uuid(), v_chap_id, 3, 'Comparing Distances', 'Comparing Distances')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'The Dairy Farm', 'The Dairy Farm')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Measurement of Capacity', 'Measurement of Capacity'),
  (gen_random_uuid(), v_chap_id, 2, 'Data on a Farm', 'Data on a Farm'),
  (gen_random_uuid(), v_chap_id, 3, 'Word Problems', 'Word Problems')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'Shapes and Patterns', 'Shapes and Patterns')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, '2D and 3D Shapes', '2D and 3D Shapes'),
  (gen_random_uuid(), v_chap_id, 2, 'Patterns', 'Patterns'),
  (gen_random_uuid(), v_chap_id, 3, 'Tiling', 'Tiling')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'Weight and Capacity', 'Weight and Capacity')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Units of Weight', 'Units of Weight'),
  (gen_random_uuid(), v_chap_id, 2, 'Units of Capacity', 'Units of Capacity'),
  (gen_random_uuid(), v_chap_id, 3, 'Word Problems', 'Word Problems')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'Coconut Farm', 'Coconut Farm')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Multiplication and Division', 'Multiplication and Division'),
  (gen_random_uuid(), v_chap_id, 2, 'Word Problems', 'Word Problems'),
  (gen_random_uuid(), v_chap_id, 3, 'Estimation', 'Estimation')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'Symmetrical Designs', 'Symmetrical Designs')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Line Symmetry', 'Line Symmetry'),
  (gen_random_uuid(), v_chap_id, 2, 'Rotational Symmetry', 'Rotational Symmetry'),
  (gen_random_uuid(), v_chap_id, 3, 'Creating Symmetrical Designs', 'Creating Symmetrical Designs')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 11, 'Grandmother''s Quilt', 'Grandmother''s Quilt')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Area and Perimeter', 'Area and Perimeter'),
  (gen_random_uuid(), v_chap_id, 2, 'Patchwork Patterns', 'Patchwork Patterns'),
  (gen_random_uuid(), v_chap_id, 3, 'Word Problems', 'Word Problems')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 12, 'Racing Seconds', 'Racing Seconds')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Measurement of Time', 'Measurement of Time'),
  (gen_random_uuid(), v_chap_id, 2, 'Seconds Minutes Hours', 'Seconds Minutes Hours'),
  (gen_random_uuid(), v_chap_id, 3, 'Word Problems', 'Word Problems')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 13, 'Animal Jumps', 'Animal Jumps')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comparing Measurements', 'Comparing Measurements'),
  (gen_random_uuid(), v_chap_id, 2, 'Data Handling', 'Data Handling'),
  (gen_random_uuid(), v_chap_id, 3, 'Graphs', 'Graphs')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 14, 'Maps and Locations', 'Maps and Locations')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Reading Maps', 'Reading Maps'),
  (gen_random_uuid(), v_chap_id, 2, 'Scale', 'Scale'),
  (gen_random_uuid(), v_chap_id, 3, 'Directions', 'Directions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 15, 'Data Through Pictures', 'Data Through Pictures')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Pictographs', 'Pictographs'),
  (gen_random_uuid(), v_chap_id, 2, 'Bar Graphs', 'Bar Graphs'),
  (gen_random_uuid(), v_chap_id, 3, 'Interpreting Data', 'Interpreting Data')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  -- English (Santoor)
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'English (Santoor)', 'ENGL5')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'Papa''s Spectacles', 'Papa''s Spectacles')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'New Vocabulary', 'New Vocabulary'),
  (gen_random_uuid(), v_chap_id, 3, 'Discussion Questions', 'Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'Gone with the Scooter', 'Gone with the Scooter')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'New Vocabulary', 'New Vocabulary'),
  (gen_random_uuid(), v_chap_id, 3, 'Discussion Questions', 'Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'The Rainbow', 'The Rainbow')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Rhyme Scheme', 'Rhyme Scheme'),
  (gen_random_uuid(), v_chap_id, 3, 'New Vocabulary', 'New Vocabulary')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'The Wise Parrot', 'The Wise Parrot')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'Moral of the Story', 'Moral of the Story'),
  (gen_random_uuid(), v_chap_id, 3, 'New Vocabulary', 'New Vocabulary')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'The Frog', 'The Frog')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Rhyme Scheme', 'Rhyme Scheme'),
  (gen_random_uuid(), v_chap_id, 3, 'New Vocabulary', 'New Vocabulary')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'What a Tank!', 'What a Tank!')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'New Vocabulary', 'New Vocabulary'),
  (gen_random_uuid(), v_chap_id, 3, 'Discussion Questions', 'Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'Gilli Danda', 'Gilli Danda')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'New Vocabulary', 'New Vocabulary'),
  (gen_random_uuid(), v_chap_id, 3, 'Discussion Questions', 'Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'The Decision of the Panchayat', 'The Decision of the Panchayat')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'New Vocabulary', 'New Vocabulary'),
  (gen_random_uuid(), v_chap_id, 3, 'Discussion Questions', 'Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'Vocation', 'Vocation')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Poem Reading', 'Poem Reading'),
  (gen_random_uuid(), v_chap_id, 2, 'Rhyme Scheme', 'Rhyme Scheme'),
  (gen_random_uuid(), v_chap_id, 3, 'New Vocabulary', 'New Vocabulary')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'Glass Bangles', 'Glass Bangles')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Comprehension', 'Comprehension'),
  (gen_random_uuid(), v_chap_id, 2, 'New Vocabulary', 'New Vocabulary'),
  (gen_random_uuid(), v_chap_id, 3, 'Discussion Questions', 'Discussion Questions')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  -- EVS (Our Wondrous World)
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'EVS (Our Wondrous World)', 'EVS5')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'Water - The Essence of Life', 'Water - The Essence of Life')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Importance of Water', 'Importance of Water'),
  (gen_random_uuid(), v_chap_id, 2, 'Sources of Water', 'Sources of Water'),
  (gen_random_uuid(), v_chap_id, 3, 'Water Conservation', 'Water Conservation')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'Journey of a River', 'Journey of a River')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'River Systems', 'River Systems'),
  (gen_random_uuid(), v_chap_id, 2, 'Stages of a River', 'Stages of a River'),
  (gen_random_uuid(), v_chap_id, 3, 'Uses of Rivers', 'Uses of Rivers')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'The Mystery of Food', 'The Mystery of Food')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Nutrients', 'Nutrients'),
  (gen_random_uuid(), v_chap_id, 2, 'Balanced Diet', 'Balanced Diet'),
  (gen_random_uuid(), v_chap_id, 3, 'Food Preservation', 'Food Preservation')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'Our School - A Happy Place', 'Our School - A Happy Place')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'School Environment', 'School Environment'),
  (gen_random_uuid(), v_chap_id, 2, 'Roles at School', 'Roles at School'),
  (gen_random_uuid(), v_chap_id, 3, 'Community at School', 'Community at School')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'Our Vibrant Country', 'Our Vibrant Country')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Cultural Diversity', 'Cultural Diversity'),
  (gen_random_uuid(), v_chap_id, 2, 'States of India', 'States of India'),
  (gen_random_uuid(), v_chap_id, 3, 'Unity in Diversity', 'Unity in Diversity')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'Some Unique Places', 'Some Unique Places')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Famous Landmarks', 'Famous Landmarks'),
  (gen_random_uuid(), v_chap_id, 2, 'Natural Wonders', 'Natural Wonders'),
  (gen_random_uuid(), v_chap_id, 3, 'Heritage Sites', 'Heritage Sites')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'Energy - How Things Work', 'Energy - How Things Work')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Sources of Energy', 'Sources of Energy'),
  (gen_random_uuid(), v_chap_id, 2, 'Uses of Energy', 'Uses of Energy'),
  (gen_random_uuid(), v_chap_id, 3, 'Saving Energy', 'Saving Energy')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'Clothes - How Things are Made', 'Clothes - How Things are Made')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Fibres and Fabrics', 'Fibres and Fabrics'),
  (gen_random_uuid(), v_chap_id, 2, 'Making Clothes', 'Making Clothes'),
  (gen_random_uuid(), v_chap_id, 3, 'Traditional Clothing', 'Traditional Clothing')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'Rhythms of Nature', 'Rhythms of Nature')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Seasons', 'Seasons'),
  (gen_random_uuid(), v_chap_id, 2, 'Day and Night', 'Day and Night'),
  (gen_random_uuid(), v_chap_id, 3, 'Natural Cycles', 'Natural Cycles')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'Earth - Our Shared Home', 'Earth - Our Shared Home')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Earth’s Resources', 'Earth’s Resources'),
  (gen_random_uuid(), v_chap_id, 2, 'Caring for the Planet', 'Caring for the Planet'),
  (gen_random_uuid(), v_chap_id, 3, 'Environmental Responsibility', 'Environmental Responsibility')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  -- Hindi (Veena)
  INSERT INTO public.subjects (id, class_id, board_id, name, code)
  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, 'Hindi (Veena)', 'HIND5')
  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code
  RETURNING id INTO v_subj_id;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 1, 'Kiran', 'Kiran')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 2, 'Nyay Ki Kursi', 'Nyay Ki Kursi')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 3, 'Chand ka Kurata', 'Chand ka Kurata')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 4, 'Saanaken', 'Saanaken')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Kavita Paath', 'Kavita Paath'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Tuk Wale Shabd', 'Tuk Wale Shabd')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 5, 'Sundariya', 'Sundariya')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 6, 'Chatur Chitrakar', 'Chatur Chitrakar')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 7, 'Mera Bachapan', 'Mera Bachapan')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 8, 'Kajiranga Rashtriya Udyan ki Yatra', 'Kajiranga Rashtriya Udyan ki Yatra')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 9, 'Nyay', 'Nyay')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Kavita Paath', 'Kavita Paath'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Tuk Wale Shabd', 'Tuk Wale Shabd')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 10, 'Teen Machhaliyan', 'Teen Machhaliyan')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 11, 'Hamare Ye Kalamandir', 'Hamare Ye Kalamandir')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)
  VALUES (gen_random_uuid(), v_subj_id, 12, 'Ganga ki Kahani', 'Ganga ki Kahani')
  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_chap_id;
  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES
  (gen_random_uuid(), v_chap_id, 1, 'Path ka Saransh', 'Path ka Saransh'),
  (gen_random_uuid(), v_chap_id, 2, 'Naye Shabd', 'Naye Shabd'),
  (gen_random_uuid(), v_chap_id, 3, 'Prashn Uttar', 'Prashn Uttar')
  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;

END $$;
