// Generates packages/db/src/seed.sql from the CURRICULUM data structure below.
// Run with: node packages/db/scripts/generate-seed.js
//
// Every insert uses ON CONFLICT ... DO UPDATE ... RETURNING id, which makes the
// whole script safe to run repeatedly (unlike the old SELECT-then-INSERT-IF-NULL
// pattern, which threw a duplicate-key error on a second run because chapters/
// topics had no existence check at all).

const fs = require('fs');
const path = require('path');

// Chapters reuse the same 4-topic pattern across most subjects for brevity;
// topics are named after real, generic curriculum concepts for that chapter,
// not NCERT-verbatim page titles (Phase 0 goal: real, class-appropriate
// curriculum data to drive the wizard, not a certified textbook mirror).
// Class 1 uses the new 2026-27 foundational-stage NCERT textbooks (Mridang /
// Sarangi / Joyful Mathematics), replacing the old Marigold / Rimjhim /
// Math-Magic books. NCERT does not introduce a separate EVS book until
// Class 3, so Class 1-2 only have these three subjects.
const CURRICULUM = {
  1: {
    subjects: [
      {
        name: 'Mathematics (Joyful Mathematics)', code: 'MATH1',
        chapters: [
          { title: 'Finding the Furry Cat!', topics: ['Sorting and Matching', 'Pre-Number Concepts', 'Comparing Objects'] },
          { title: 'What is Long? What is Round?', topics: ['Identifying Shapes', 'Rolling and Sliding', 'Shapes Around Us'] },
          { title: 'Mango Treat', topics: ['Counting 1 to 9', 'Reading and Writing Numbers', 'More and Less'] },
          { title: 'Making 10', topics: ['Numbers 10 to 20', 'Grouping in Tens', 'Number Names'] },
          { title: 'How Many?', topics: ['Addition of Single Digits', 'Subtraction of Single Digits', 'Simple Word Problems'] },
          { title: 'Vegetable Farm', topics: ['Addition up to 20', 'Subtraction up to 20', 'Word Problems'] },
          { title: "Lina's Family", topics: ['Comparing Lengths', 'Comparing Heights', 'Informal Measurement'] },
          { title: 'Fun with Numbers', topics: ['Numbers 21 to 99', 'Reading Numbers', 'Number Patterns'] },
          { title: 'Utsav', topics: ['Recognising Patterns', 'Extending Patterns', 'Patterns in Nature'] },
          { title: 'How do I Spend My Day?', topics: ['Reading the Clock', 'Sequencing the Day', 'Days of the Week'] },
          { title: 'How Many Times?', topics: ['Repeated Addition', 'Grouping', 'Introduction to Multiplication'] },
          { title: 'How Much Can We Spend?', topics: ['Recognising Coins and Notes', 'Simple Money Problems', 'Buying and Selling'] },
          { title: 'So Many Toys', topics: ['Collecting Data', 'Simple Pictographs', 'Reading Data'] },
        ],
      },
      {
        name: 'English (Mridang)', code: 'ENGL1',
        chapters: [
          { title: 'Two Little Hands', topics: ['Poem Reading', 'New Words', 'Actions and Rhymes'] },
          { title: 'Greetings', topics: ['Simple Greetings', 'Speaking Practice', 'Everyday Phrases'] },
          { title: 'Picture Time', topics: ['Picture Reading', 'Naming Objects', 'Simple Sentences'] },
          { title: 'The Cap Seller and the Monkeys', topics: ['Story Listening', 'New Vocabulary', 'Sequencing Events'] },
          { title: 'A Farm', topics: ['Farm Animals', 'Vocabulary Building', 'Describing Pictures'] },
          { title: 'Fun with Pictures', topics: ['Picture Reading', 'Naming Objects', 'Simple Sentences'] },
          { title: 'The Food We Eat', topics: ['Names of Food Items', 'Healthy Eating', 'Simple Sentences'] },
          { title: 'The Four Seasons', topics: ['Names of Seasons', 'Poem Reading', 'Describing Weather'] },
          { title: "Anandi's Rainbow", topics: ['Story Listening', 'Colour Names', 'New Vocabulary'] },
        ],
      },
      {
        name: 'Hindi (Sarangi)', code: 'HIND1',
        chapters: [
          { title: 'Meena Ka Parivar', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Dada-Dadi', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Reena Ka Din', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Rani Bhi', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Mithai', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Teen Saathi', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Waah Mere Ghode', topics: ['Kavita Paath', 'Naye Shabd', 'Tuk Wale Shabd'] },
          { title: 'Khatre Mein Saanp', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Aaloo Ki Sadak', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Jhulam Jhuli', topics: ['Kavita Paath', 'Naye Shabd', 'Tuk Wale Shabd'] },
          { title: 'Bhutte', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Phooli Roti', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Mela', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Barkha Aur Megha', topics: ['Kavita Paath', 'Naye Shabd', 'Tuk Wale Shabd'] },
          { title: 'Holi', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Janamdiwas Par Ped Lagao', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Kitni Pyari Hai Ye Duniya', topics: ['Kavita Paath', 'Naye Shabd', 'Tuk Wale Shabd'] },
          { title: 'Chaand Ka Bacha', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
        ],
      },
    ],
  },
  // Class 2 also uses the new Joyful Mathematics / Mridang / Sarangi 2 series
  // (still no separate EVS book -- that starts Class 3).
  2: {
    subjects: [
      {
        name: 'Mathematics (Joyful Mathematics)', code: 'MATH2',
        chapters: [
          { title: 'A Day at the Beach', topics: ['Counting in Groups', 'Grouping Objects', 'Estimating Quantities'] },
          { title: 'Shapes Around Us', topics: ['3D Shapes', 'Identifying Solids', 'Shapes in Everyday Objects'] },
          { title: 'Fun with Numbers', topics: ['Numbers 1 to 100', 'Reading and Writing Numbers', 'Number Patterns'] },
          { title: 'Shadow Story (Togalu)', topics: ['2D Shapes', 'Tracing Shapes', 'Shape Properties'] },
          { title: 'Playing with Lines', topics: ['Straight and Curved Lines', 'Orientation of Lines', 'Drawing Lines'] },
          { title: 'Decoration for Festival', topics: ['Addition up to 99', 'Subtraction up to 99', 'Word Problems'] },
          { title: "Rani's Gift", topics: ['Measuring Length', 'Comparing Lengths', 'Non-Standard Units'] },
          { title: 'Grouping and Sharing', topics: ['Introduction to Multiplication', 'Introduction to Division', 'Equal Grouping'] },
          { title: 'Which Season is it?', topics: ['Measurement of Time', 'Days and Months', 'Seasons'] },
          { title: 'Fun at the Fair', topics: ['Recognising Money', 'Simple Money Problems', 'Making Change'] },
          { title: 'Data Handling', topics: ['Collecting Data', 'Simple Pictographs', 'Reading Data'] },
        ],
      },
      {
        name: 'English (Mridang)', code: 'ENGL2',
        chapters: [
          { title: 'My Bicycle', topics: ['Comprehension', 'New Vocabulary', 'Simple Sentences'] },
          { title: 'Picture Reading', topics: ['Picture Reading', 'Naming Objects', 'Describing Pictures'] },
          { title: 'It is Fun', topics: ['Poem Reading', 'Rhyming Words', 'New Vocabulary'] },
          { title: 'Seeing without Seeing', topics: ['Comprehension', 'New Vocabulary', 'Discussion Questions'] },
          { title: 'Come Back Soon', topics: ['Comprehension', 'New Vocabulary', 'Sequencing Events'] },
          { title: 'Between Home and School', topics: ['Comprehension', 'New Vocabulary', 'Discussion Questions'] },
          { title: 'This is My Town', topics: ['Comprehension', 'New Vocabulary', 'Describing Places'] },
          { title: 'A Show of Clouds', topics: ['Poem Reading', 'Rhyming Words', 'New Vocabulary'] },
          { title: 'My Name', topics: ['Poem Reading', 'Rhyming Words', 'New Vocabulary'] },
          { title: 'The Crow', topics: ['Comprehension', 'New Vocabulary', 'Moral of the Story'] },
          { title: 'The Smart Monkey', topics: ['Comprehension', 'New Vocabulary', 'Moral of the Story'] },
          { title: 'Little Drops of Water', topics: ['Poem Reading', 'Rhyming Words', 'New Vocabulary'] },
        ],
      },
      {
        name: 'Hindi (Sarangi)', code: 'HIND2',
        chapters: [
          { title: 'Neema Ki Dadi', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Ghar', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Mala Ki Chandi Ki Payal', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Maa', topics: ['Kavita Paath', 'Naye Shabd', 'Tuk Wale Shabd'] },
          { title: 'Thathoo Aur Main', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Cheenta', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Tilloo Ji', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Teen Dost', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Duniya Rang-Birangi', topics: ['Kavita Paath', 'Naye Shabd', 'Tuk Wale Shabd'] },
          { title: 'Kaun', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Baingani Jojo', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Tosiya Ka Sapna', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Talab', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Beej', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Kisan', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Mooli', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Barsat Aur Mendhak', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Sher Aur Chuhe Ki Dosti', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Aaut', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Chhupan-Chhupai', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Haathi Saikil Chala Raha Tha', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Char Dishayein', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Chanda Mama', topics: ['Kavita Paath', 'Naye Shabd', 'Tuk Wale Shabd'] },
          { title: 'Gire Tal Mein Chanda Mama', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Sabse Bada Chhata', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Badal', topics: ['Kavita Paath', 'Naye Shabd', 'Tuk Wale Shabd'] },
        ],
      },
    ],
  },
  // Class 3 introduces EVS for the first time (Our Wondrous World), plus new
  // Maths Mela / Santoor / Veena books, replacing the old Math-Magic /
  // Marigold / Looking Around / Rimjhim series.
  3: {
    subjects: [
      {
        name: 'Mathematics (Maths Mela)', code: 'MATH3',
        chapters: [
          { title: "What's in a Name", topics: ['Number Names', 'Reading Numbers', 'Place Value Basics'] },
          { title: 'Toy Joy', topics: ['3-Digit Numbers', 'Comparing Numbers', 'Ordering Numbers'] },
          { title: 'Double Century', topics: ['Numbers up to 200', 'Skip Counting', 'Number Patterns'] },
          { title: 'Vacation with My Nani Maa', topics: ['Addition up to 3 Digits', 'Subtraction up to 3 Digits', 'Word Problems'] },
          { title: 'Fun with Shapes', topics: ['2D Shapes', 'Symmetry', 'Tiling Patterns'] },
          { title: 'House of Hundreds - I', topics: ['Place Value', 'Expanded Form', 'Regrouping'] },
          { title: 'Raksha Bandhan', topics: ['Measurement of Length', 'Comparing Lengths', 'Standard Units'] },
          { title: 'Fair Share', topics: ['Introduction to Fractions', 'Equal Parts', 'Sharing Equally'] },
          { title: 'House of Hundreds - II', topics: ['Addition with Regrouping', 'Subtraction with Regrouping', 'Applications'] },
          { title: 'Fun at Class Party', topics: ['Data Collection', 'Simple Tables', 'Pictographs'] },
          { title: 'Filling and Lifting', topics: ['Measurement of Capacity', 'Measurement of Weight', 'Comparing Quantities'] },
          { title: 'Give and Take', topics: ['Addition Word Problems', 'Subtraction Word Problems', 'Mixed Problems'] },
          { title: 'Time Goes On', topics: ['Reading a Clock', 'Calendar Basics', 'Days and Months'] },
          { title: 'The Surajkund Fair', topics: ['Recognising Money', 'Simple Money Calculations', 'Making Change'] },
        ],
      },
      {
        name: 'English (Santoor)', code: 'ENGL3',
        chapters: [
          { title: 'Colours', topics: ['Poem Reading', 'Colour Vocabulary', 'Rhyming Words'] },
          { title: 'Badal and Moti', topics: ['Comprehension', 'New Vocabulary', 'Discussion Questions'] },
          { title: 'Best Friends', topics: ['Comprehension', 'New Vocabulary', 'Discussion Questions'] },
          { title: 'Out in the Garden', topics: ['Poem Reading', 'Rhyming Words', 'New Vocabulary'] },
          { title: 'Talking Toys', topics: ['Comprehension', 'New Vocabulary', 'Discussion Questions'] },
          { title: 'Paper Boats', topics: ['Poem Reading', 'Rhyming Words', 'New Vocabulary'] },
          { title: 'The Big Laddoo', topics: ['Comprehension', 'New Vocabulary', 'Sequencing Events'] },
          { title: 'Thank God', topics: ['Comprehension', 'New Vocabulary', 'Discussion Questions'] },
          { title: "Madhu's Wish", topics: ['Comprehension', 'New Vocabulary', 'Discussion Questions'] },
          { title: 'Night', topics: ['Poem Reading', 'Rhyming Words', 'New Vocabulary'] },
          { title: 'Chanda Mama Counts the Stars', topics: ['Comprehension', 'New Vocabulary', 'Discussion Questions'] },
          { title: 'Chandrayaan', topics: ['Comprehension', 'New Vocabulary', 'Discussion Questions'] },
        ],
      },
      {
        name: 'EVS (Our Wondrous World)', code: 'EVS3',
        chapters: [
          { title: 'Family and Friends', topics: ['Types of Families', 'Roles in a Family', 'Friendship'] },
          { title: 'Going to the Mela', topics: ['Fairs and Markets', 'Buying and Selling', 'Community Gatherings'] },
          { title: 'Celebrating Festivals', topics: ['Festivals We Celebrate', 'Festival Customs', 'Unity in Diversity'] },
          { title: 'Getting to Know Plants', topics: ['Parts of a Plant', 'Types of Plants', 'Plant Life Cycle'] },
          { title: 'Plants and Animals Live Together', topics: ['Interdependence', 'Habitats', 'Food Chains'] },
          { title: 'Living in Harmony', topics: ['Balance in Nature', 'Human Impact', 'Caring for Nature'] },
          { title: 'Water A Precious Gift', topics: ['Sources of Water', 'Uses of Water', 'Conserving Water'] },
          { title: 'Food We Eat', topics: ['Food Sources', 'Balanced Diet', 'Healthy Eating Habits'] },
          { title: 'Staying Healthy and Happy', topics: ['Personal Hygiene', 'Exercise and Rest', 'Emotional Wellbeing'] },
          { title: 'This World of Things', topics: ['Materials Around Us', 'Properties of Materials', 'Uses of Materials'] },
          { title: 'Making Things', topics: ['Simple Tools', 'How Things are Made', 'Craftsmanship'] },
          { title: 'Taking Charge of Waste', topics: ['Types of Waste', 'Waste Disposal', 'Reduce Reuse Recycle'] },
        ],
      },
      {
        name: 'Hindi (Veena)', code: 'HIND3',
        chapters: [
          { title: 'Seekho', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Chinti', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Kitne Pair?', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Baya Hamari Chidiya Rani!', topics: ['Kavita Paath', 'Naye Shabd', 'Tuk Wale Shabd'] },
          { title: 'Aam Ka Ped', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Birbal Ki Khichadi', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Mitra Ko Patra', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Chatur Gidda', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Prakriti Parv - Phooldei', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Rassaakashi', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Ek Jadui Pitara', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Apna Apna Kaam', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: "Pedon Ki Amma Thimakka", topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Kisaan Ki Hoshiyari', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Bharat', topics: ['Kavita Paath', 'Naye Shabd', 'Tuk Wale Shabd'] },
          { title: 'Chandrayaan (Samvad)', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Bolne Vali Mand', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Ham Anek Kintu Ek', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
        ],
      },
    ],
  },
  // Class 4 is the one exception in the NEP-2020 rollout: as of this data
  // pull, NCERT has NOT yet replaced its Class 4 books (unlike 1-3 and 5-9),
  // so Math-Magic / Marigold / Looking Around / Rimjhim remain the real,
  // current 2026-27 curriculum here. Chapter titles below are the actual
  // book contents, not the old generic 4-chapter placeholders.
  4: {
    subjects: [
      {
        name: 'Mathematics (Math-Magic 4)', code: 'MATH4',
        chapters: [
          { title: 'Building with Bricks', topics: ['Patterns and Tiling', 'Area Basics', 'Shapes and Bricks'] },
          { title: 'Long and Short', topics: ['Measuring Length', 'Units of Length', 'Comparing Lengths'] },
          { title: 'A Trip to Bhopal', topics: ['Multiplication', 'Word Problems', 'Estimation'] },
          { title: 'Tick-Tick-Tick', topics: ['Reading Time', 'Duration', 'Calendar Basics'] },
          { title: 'The Way The World Looks', topics: ['Views of Objects', 'Maps', 'Perspective'] },
          { title: 'The Junk Seller', topics: ['Weight and Measurement', 'Money Calculations', 'Word Problems'] },
          { title: 'Jugs and Mugs', topics: ['Measuring Capacity', 'Litres and Millilitres', 'Word Problems'] },
          { title: 'Carts and Wheels', topics: ['Circles', 'Symmetry in Wheels', 'Measurement'] },
          { title: 'Halves and Quarters', topics: ['Fractions Basics', 'Halves and Quarters', 'Fraction Word Problems'] },
          { title: 'Play with Patterns', topics: ['Number Patterns', 'Shape Patterns', 'Making Patterns'] },
          { title: 'Tables and Shares', topics: ['Multiplication Tables', 'Division Basics', 'Equal Sharing'] },
          { title: 'How Heavy? How Light?', topics: ['Measuring Weight', 'Comparing Weights', 'Word Problems'] },
          { title: 'Fields and Fences', topics: ['Perimeter', 'Area of Simple Shapes', 'Word Problems'] },
          { title: 'Smart Charts', topics: ['Reading Charts', 'Making Charts', 'Interpreting Data'] },
        ],
      },
      {
        name: 'English (Marigold 4)', code: 'ENGL4',
        chapters: [
          { title: 'Wake Up!', topics: ['Poem Reading', 'Morning Vocabulary', 'Action Words'] },
          { title: "Neha's Alarm Clock", topics: ['Comprehension', 'Sequencing Events', 'New Words'] },
          { title: 'Noses', topics: ['Poem Reading', 'Descriptive Words', 'Rhyme Scheme'] },
          { title: 'The Little Fir Tree', topics: ['Comprehension', 'Moral of the Story', 'New Vocabulary'] },
          { title: 'Run!', topics: ['Poem Reading', 'Action Words', 'Rhyme Scheme'] },
          { title: "Nasruddin's Aim", topics: ['Comprehension', 'Moral of the Story', 'New Vocabulary'] },
          { title: 'Why?', topics: ['Poem Reading', 'Rhyme Scheme', 'New Vocabulary'] },
          { title: 'Alice in Wonderland', topics: ['Comprehension', 'New Vocabulary', 'Discussion Questions'] },
          { title: "Don't be Afraid of the Dark", topics: ['Poem Reading', 'Rhyme Scheme', 'New Vocabulary'] },
          { title: 'Helen Keller', topics: ['Comprehension', 'New Vocabulary', 'Discussion Questions'] },
          { title: 'The Donkey', topics: ['Poem Reading', 'Rhyme Scheme', 'New Vocabulary'] },
          { title: 'I had a Little Pony', topics: ['Poem Reading', 'Rhyme Scheme', 'New Vocabulary'] },
          { title: "The Milkman's Cow", topics: ['Comprehension', 'Moral of the Story', 'New Vocabulary'] },
          { title: 'Hiawatha', topics: ['Poem Reading', 'Rhyme Scheme', 'New Vocabulary'] },
          { title: "The Scholar's Mother Tongue", topics: ['Comprehension', 'New Vocabulary', 'Discussion Questions'] },
          { title: 'A Watering Rhyme', topics: ['Poem Reading', 'Rhyme Scheme', 'New Vocabulary'] },
          { title: 'The Giving Tree', topics: ['Comprehension', 'Moral of the Story', 'New Vocabulary'] },
          { title: 'Books', topics: ['Poem Reading', 'Rhyme Scheme', 'New Vocabulary'] },
          { title: 'Going to Buy a Book', topics: ['Comprehension', 'New Vocabulary', 'Discussion Questions'] },
          { title: 'The Naughty Boy', topics: ['Poem Reading', 'Rhyme Scheme', 'New Vocabulary'] },
        ],
      },
      {
        name: 'EVS (Looking Around 4)', code: 'EVS4',
        chapters: [
          { title: 'Going to School', topics: ['Modes of Travel', 'Bridges and Roads', 'Challenges in Travel'] },
          { title: 'Ear to Ear', topics: ['The Sense of Hearing', 'Sounds Around Us', 'Care of Ears'] },
          { title: 'A Day with Nandu', topics: ['Life of an Elephant', 'Animal Behaviour', 'Human-Animal Interaction'] },
          { title: 'The Story of Amrita', topics: ['Environmental Movements', 'Conservation of Trees', 'Community Action'] },
          { title: 'Anita and the Honeybees', topics: ['Bee Keeping', 'Life Cycle of Bees', 'Products from Bees'] },
          { title: "Omana's Journey", topics: ['Modes of Transport', 'Travel Experiences', 'Geography of Travel'] },
          { title: 'From the Window', topics: ['Observing Surroundings', 'Rural and Urban Views', 'Describing Landscapes'] },
          { title: "Reaching Grandmother's House", topics: ['Family Journeys', 'Modes of Travel', 'Mapping a Route'] },
          { title: 'Changing Families', topics: ['Types of Families', 'Family Roles', 'Family Traditions'] },
          { title: 'Hu Tu Tu, Hu Tu Tu', topics: ['Traditional Games', 'Rules of Kabaddi', 'Games Around India'] },
          { title: 'The Valley of Flowers', topics: ['Mountain Ecosystems', 'Flora and Fauna', 'Conservation'] },
          { title: 'Changing Times', topics: ['Old vs New Ways of Life', 'Technology Changes', 'Comparing Generations'] },
          { title: "A River's Tale", topics: ['River Systems', 'Uses of Rivers', 'River Pollution'] },
          { title: "Basva's Farm", topics: ['Farming Practices', 'Crops and Seasons', 'Farm Life'] },
          { title: 'From Market to Home', topics: ['Types of Markets', 'Buying and Selling', 'Money Basics'] },
          { title: 'A busy Month', topics: ['Seasonal Activities', 'Festivals and Work', 'Community Life'] },
          { title: 'Nandita in Mumbai', topics: ['City Life', 'Urban Transport', 'City vs Village Life'] },
        ],
      },
      {
        name: 'Hindi (Rimjhim 4)', code: 'HIND4',
        chapters: [
          { title: 'Man Ke Bhole Bhole Badal', topics: ['Kavita Paath', 'Bhavarth', 'Tuk Wale Shabd'] },
          { title: 'Jaisa Sawal Vaisa Jawab', topics: ['Path ka Saransh', 'Buddhi Kaushal', 'Naye Shabd'] },
          { title: 'Kirmich ki Gend', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Koi Laake Mujhe De', topics: ['Kavita Paath', 'Bhavarth', 'Tuk Wale Shabd'] },
          { title: 'Dost ki Poshak', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Naav Banao', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Daan ka Hisaab', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Kaun', topics: ['Kavita Paath', 'Bhavarth', 'Tuk Wale Shabd'] },
          { title: 'Svatantra ki Aur', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Thap Roti Thap Dal', topics: ['Kavita Paath', 'Bhavarth', 'Tuk Wale Shabd'] },
          { title: 'Padakku ki Soojh', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Sunita ki Pahiya Kursi', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'HudHud', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Muft Hi Muft', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
        ],
      },
    ],
  },
  // Class 5 also uses the new Maths Mela / Santoor / Veena / Our Wondrous
  // World series, replacing Math-Magic / Marigold / Rimjhim / Looking Around.
  5: {
    subjects: [
      {
        name: 'Mathematics (Maths Mela)', code: 'MATH5',
        chapters: [
          { title: 'We the Travellers - I', topics: ['Distance and Direction', 'Reading Maps', 'Travel Word Problems'] },
          { title: 'Fractions', topics: ['Like and Unlike Fractions', 'Operations on Fractions', 'Fraction Word Problems'] },
          { title: 'Angles as Turns', topics: ['Types of Angles', 'Measuring Angles', 'Angles in Shapes'] },
          { title: 'We the Travellers - II', topics: ['Speed and Time', 'Distance Calculations', 'Travel Word Problems'] },
          { title: 'Far and Near', topics: ['Measurement of Distance', 'Estimation', 'Comparing Distances'] },
          { title: 'The Dairy Farm', topics: ['Measurement of Capacity', 'Data on a Farm', 'Word Problems'] },
          { title: 'Shapes and Patterns', topics: ['2D and 3D Shapes', 'Patterns', 'Tiling'] },
          { title: 'Weight and Capacity', topics: ['Units of Weight', 'Units of Capacity', 'Word Problems'] },
          { title: 'Coconut Farm', topics: ['Multiplication and Division', 'Word Problems', 'Estimation'] },
          { title: 'Symmetrical Designs', topics: ['Line Symmetry', 'Rotational Symmetry', 'Creating Symmetrical Designs'] },
          { title: "Grandmother's Quilt", topics: ['Area and Perimeter', 'Patchwork Patterns', 'Word Problems'] },
          { title: 'Racing Seconds', topics: ['Measurement of Time', 'Seconds Minutes Hours', 'Word Problems'] },
          { title: 'Animal Jumps', topics: ['Comparing Measurements', 'Data Handling', 'Graphs'] },
          { title: 'Maps and Locations', topics: ['Reading Maps', 'Scale', 'Directions'] },
          { title: 'Data Through Pictures', topics: ['Pictographs', 'Bar Graphs', 'Interpreting Data'] },
        ],
      },
      {
        name: 'English (Santoor)', code: 'ENGL5',
        chapters: [
          { title: "Papa's Spectacles", topics: ['Comprehension', 'New Vocabulary', 'Discussion Questions'] },
          { title: 'Gone with the Scooter', topics: ['Comprehension', 'New Vocabulary', 'Discussion Questions'] },
          { title: 'The Rainbow', topics: ['Poem Reading', 'Rhyme Scheme', 'New Vocabulary'] },
          { title: 'The Wise Parrot', topics: ['Comprehension', 'Moral of the Story', 'New Vocabulary'] },
          { title: 'The Frog', topics: ['Poem Reading', 'Rhyme Scheme', 'New Vocabulary'] },
          { title: 'What a Tank!', topics: ['Comprehension', 'New Vocabulary', 'Discussion Questions'] },
          { title: 'Gilli Danda', topics: ['Comprehension', 'New Vocabulary', 'Discussion Questions'] },
          { title: 'The Decision of the Panchayat', topics: ['Comprehension', 'New Vocabulary', 'Discussion Questions'] },
          { title: 'Vocation', topics: ['Poem Reading', 'Rhyme Scheme', 'New Vocabulary'] },
          { title: 'Glass Bangles', topics: ['Comprehension', 'New Vocabulary', 'Discussion Questions'] },
        ],
      },
      {
        name: 'EVS (Our Wondrous World)', code: 'EVS5',
        chapters: [
          { title: 'Water - The Essence of Life', topics: ['Importance of Water', 'Sources of Water', 'Water Conservation'] },
          { title: 'Journey of a River', topics: ['River Systems', 'Stages of a River', 'Uses of Rivers'] },
          { title: 'The Mystery of Food', topics: ['Nutrients', 'Balanced Diet', 'Food Preservation'] },
          { title: 'Our School - A Happy Place', topics: ['School Environment', 'Roles at School', 'Community at School'] },
          { title: 'Our Vibrant Country', topics: ['Cultural Diversity', 'States of India', 'Unity in Diversity'] },
          { title: 'Some Unique Places', topics: ['Famous Landmarks', 'Natural Wonders', 'Heritage Sites'] },
          { title: 'Energy - How Things Work', topics: ['Sources of Energy', 'Uses of Energy', 'Saving Energy'] },
          { title: 'Clothes - How Things are Made', topics: ['Fibres and Fabrics', 'Making Clothes', 'Traditional Clothing'] },
          { title: 'Rhythms of Nature', topics: ['Seasons', 'Day and Night', 'Natural Cycles'] },
          { title: 'Earth - Our Shared Home', topics: ['Earth’s Resources', 'Caring for the Planet', 'Environmental Responsibility'] },
        ],
      },
      {
        name: 'Hindi (Veena)', code: 'HIND5',
        chapters: [
          { title: 'Kiran', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Nyay Ki Kursi', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Chand ka Kurata', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Saanaken', topics: ['Kavita Paath', 'Naye Shabd', 'Tuk Wale Shabd'] },
          { title: 'Sundariya', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Chatur Chitrakar', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Mera Bachapan', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Kajiranga Rashtriya Udyan ki Yatra', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Nyay', topics: ['Kavita Paath', 'Naye Shabd', 'Tuk Wale Shabd'] },
          { title: 'Teen Machhaliyan', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Hamare Ye Kalamandir', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
          { title: 'Ganga ki Kahani', topics: ['Path ka Saransh', 'Naye Shabd', 'Prashn Uttar'] },
        ],
      },
    ],
  },
};

// Real NCERT chapter lists (CBSE's default prescribed textbooks) for Math,
// Science, and a representative Social Science selection, Classes 6-10.
// Topics are the chapter's actual sub-concepts, not generic filler.
// Based on the long-standing NCERT syllabus structure; NCERT has been
// rolling out revised editions per NEP 2020 in phases, so exact chapter
// numbering/titles for the very latest print run may differ slightly --
// worth a periodic review against the current-year textbooks.
// Class 6 reflects the NEW NEP-2020/NCF-SE-2023 NCERT textbooks in force for
// the 2026-27 session (Ganita Prakash / Curiosity / Exploring Society: India
// and Beyond / Poorvi / Malhar / Deepakam), which fully replaced the older
// Knowing Our Numbers / Food Where Does It Come From / Honeysuckle-era books
// this academic year. Chapter titles verified against multiple current
// (2026-27) sources; topics are a reasonable breakdown of each chapter's
// sub-concepts since NCERT doesn't publish topic-level granularity separately.
const REAL_SECONDARY_CHAPTERS = {
  6: {
    Mathematics: [
      { title: 'Patterns in Mathematics', topics: ['Number Patterns', 'Shape Patterns', 'Patterns in Nature'] },
      { title: 'Lines and Angles', topics: ['Types of Lines', 'Measuring Angles', 'Angle Types'] },
      { title: 'Number Play', topics: ['Estimation', 'Number Puzzles', 'Palindromes'] },
      { title: 'Data Handling and Presentation', topics: ['Collecting Data', 'Pictographs and Bar Graphs', 'Interpreting Data'] },
      { title: 'Prime Time', topics: ['Prime and Composite Numbers', 'Factors and Multiples', 'HCF and LCM'] },
      { title: 'Perimeter and Area', topics: ['Perimeter of Shapes', 'Area of Rectangles and Squares', 'Area of Irregular Figures'] },
      { title: 'Fractions', topics: ['Types of Fractions', 'Comparing Fractions', 'Operations on Fractions'] },
      { title: 'Playing with Constructions', topics: ['Using a Compass', 'Constructing Circles', 'Constructing Perpendiculars'] },
      { title: 'Symmetry', topics: ['Line Symmetry', 'Symmetrical Figures', 'Symmetry in Nature'] },
      { title: 'The Other Side of Zero', topics: ['Introduction to Negative Numbers', 'Number Line with Integers', 'Real-Life Uses of Negative Numbers'] },
    ],
    Science: [
      { title: 'The Wonderful World of Science', topics: ['What is Science', 'Scientific Method', 'Curiosity and Observation'] },
      { title: 'Diversity in the Living World', topics: ['Classification of Organisms', 'Plant and Animal Diversity', 'Adaptation'] },
      { title: 'Mindful Eating: A Path to a Healthy Body', topics: ['Balanced Diet', 'Nutrients', 'Healthy Food Habits'] },
      { title: 'Measurement of Length and Motion', topics: ['Units of Measurement', 'Types of Motion', 'Measuring Instruments'] },
      { title: 'Materials Around Us', topics: ['Properties of Materials', 'Grouping Materials', 'Everyday Uses'] },
      { title: 'Temperature and its Measurement', topics: ['Thermometers', 'Temperature Scales', 'Heat vs Temperature'] },
      { title: 'A Journey through States of Water', topics: ['States of Matter', 'Water Cycle', 'Change of State'] },
      { title: 'Methods of Separation in Everyday Life', topics: ['Handpicking and Sieving', 'Filtration and Evaporation', 'Winnowing'] },
      { title: 'Light, Shadows and Reflections', topics: ['Formation of Shadows', 'Opaque Transparent Translucent', 'Mirrors and Reflection'] },
      { title: 'Electricity and Circuits', topics: ['Electric Cells', 'Simple Circuits', 'Conductors and Insulators'] },
      { title: 'Fun with Magnets', topics: ['Magnetic and Non-Magnetic Materials', 'Poles of a Magnet', 'Uses of Magnets'] },
      { title: 'Air Around Us', topics: ['Composition of Air', 'Importance of Air', 'Air Pollution'] },
      { title: 'Beyond Earth', topics: ['Solar System', 'Moon and Stars', 'Space Exploration'] },
    ],
    'Social Science': [
      { title: 'Locating Places on the Earth', topics: ['Latitude and Longitude', 'Globe and Maps', 'Grid Reference'] },
      { title: 'Oceans and Continents', topics: ['Major Oceans', 'Major Continents', 'Distribution of Land and Water'] },
      { title: 'Landforms and Life', topics: ['Mountains Plateaus and Plains', 'Landforms and Human Life', 'Landform Features'] },
      { title: 'Timeline and Sources of History', topics: ['Reading a Timeline', 'Sources of History', 'Archaeological Evidence'] },
      { title: 'India, That Is Bharat', topics: ["Physical Features of India", "India's Neighbours", 'Names of India'] },
      { title: 'The Beginnings of Indian Civilisation', topics: ['Harappan Civilisation', 'Vedic Age', 'Early Settlements'] },
      { title: "India's Cultural Roots", topics: ['Ancient Texts', 'Languages and Scripts', 'Art and Architecture'] },
      { title: "Unity in Diversity, or 'Many in the One'", topics: ['Diversity in India', 'Unity in Diversity', 'Festivals and Traditions'] },
      { title: 'Family and Community', topics: ['Types of Families', 'Roles in a Family', 'Community Life'] },
      { title: 'Grassroots Democracy — Part 1: Governance', topics: ['Need for Government', 'Levels of Government', 'Democratic Governance'] },
      { title: 'Grassroots Democracy — Part 2: Local Government in Rural Areas', topics: ['Gram Sabha', 'Gram Panchayat', 'Panchayati Raj'] },
      { title: 'Grassroots Democracy — Part 3: Local Government in Urban Areas', topics: ['Municipal Corporation', 'Municipality', 'Urban Governance'] },
      { title: 'The Value of Work', topics: ['Types of Work', 'Value of Labour', 'Work and Dignity'] },
      { title: 'Economic Activities Around Us', topics: ['Production and Consumption', 'Goods and Services', 'Economic Activities'] },
    ],
    English: [
      { title: 'A Bottle of Dew', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'The Raven and the Fox', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Moral of the Story'] },
      { title: 'Rama to the Rescue', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'The Unlikely Best Friends', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: "A Friend's Prayers", topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'The Chair', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Neem Baba', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'What a Bird Thought', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'Spices that Heal Us', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Change of Heart', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'The Winner', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Yoga: A Way of Life', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Hamara Bharat: Incredible India', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'The Kites', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'Ila Sachani: Embroidering Dreams with her Feet', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'National War Memorial', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
    ],
    Hindi: [
      { title: 'Matribhoomi', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Gol', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Pehli Boond', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Haar Ki Jeet', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Rahim Ke Dohe', topics: ['Dohon ka Bhavarth', 'Alankar', 'Kanth Path'] },
      { title: 'Meri Maa', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Jalate Chalo', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Satriya Aur Bihu Nritya', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Maiya Main Nahin Makhan Khayo', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Pariksha', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Chetak Ki Veerta', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Hind Mahasagar Mein Chhota Sa Hindustan', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Ped Ki Baat', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
    ],
    Sanskrit: [
      { title: 'वयं वर्णमालां पठामः', topics: ['Shabdarth', 'Varnamala Gyan', 'Uchcharan Abhyas'] },
      { title: 'एषः कः? एषा का? एतत् किम्?', topics: ['Shabdarth', 'Sarvanam Gyan', 'Anuvad Abhyas'] },
      { title: 'अहं च त्वं च', topics: ['Shabdarth', 'Vyakaran', 'Anuvad Abhyas'] },
      { title: 'अहं प्रातः उत्तिष्ठामि', topics: ['Shabdarth', 'Dhatu Roop', 'Anuvad Abhyas'] },
      { title: 'शूराः वयं धीराः वयम्', topics: ['Shabdarth', 'Bhavarth', 'Kanth Path'] },
      { title: 'सः एव महान् चित्रकारः', topics: ['Shabdarth', 'Bhavarth', 'Anuvad Abhyas'] },
      { title: 'अतिथिदेवो भव', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'बुद्धिः सर्वार्थसाधिका', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'यो जानाति सः पण्डितः', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'त्वम् आपणं गच्छ', topics: ['Shabdarth', 'Vyakaran', 'Anuvad Abhyas'] },
      { title: 'पृथिव्यां त्रीणि रत्नानि', topics: ['Shabdarth', 'Bhavarth', 'Kanth Path'] },
      { title: 'आलस्यं हि मनुष्याणां शरीरस्थो महान् रिपुः', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'सङ्ख्यागणना ननु सरला', topics: ['Sankhya Gyan', 'Shabdarth', 'Anuvad Abhyas'] },
      { title: 'माधवस्य प्रियम् अङ्गम्', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'वृक्षाः सत्पुरुषाः इव', topics: ['Shabdarth', 'Bhavarth', 'Kanth Path'] },
    ],
  },
  // Class 7 reflects the new 2026-27 NCERT textbooks (Ganita Prakash /
  // Curiosity / Exploring Society: India and Beyond / Poorvi / Malhar /
  // Deepakam), replacing the old Integers / Nutrition in Plants / Tracing
  // Changes-era books.
  7: {
    Mathematics: [
      { title: 'Large Numbers Around Us', topics: ['Estimating Large Quantities', 'Powers of 10', 'Comparing Large Numbers'] },
      { title: 'Arithmetic Expressions', topics: ['Order of Operations', 'Simplifying Expressions', 'Word Problems'] },
      { title: 'A Peek Beyond the Point', topics: ['Decimal Place Value', 'Comparing Decimals', 'Operations on Decimals'] },
      { title: 'Expressions using Letter-Numbers', topics: ['Variables and Constants', 'Forming Expressions', 'Evaluating Expressions'] },
      { title: 'Parallel and Intersecting Lines', topics: ['Properties of Parallel Lines', 'Transversals', 'Angle Relationships'] },
      { title: 'Number Play', topics: ['Number Patterns', 'Divisibility Rules', 'Number Puzzles'] },
      { title: 'A Tale of Three Intersecting Lines', topics: ['Angle Sum Property of a Triangle', 'Exterior Angle Property', 'Triangle Inequality'] },
      { title: 'Working with Fractions', topics: ['Operations on Fractions', 'Mixed Numbers', 'Fraction Word Problems'] },
      { title: 'Geometric Twins', topics: ['Congruence of Figures', 'Congruence Criteria', 'Symmetry in Congruent Shapes'] },
      { title: 'Operations with Integers', topics: ['Multiplication of Integers', 'Division of Integers', 'Properties of Integer Operations'] },
      { title: 'Finding Common Ground', topics: ['HCF and LCM', 'Ratio and Proportion', 'Unitary Method'] },
      { title: 'Another Peek Beyond the Point', topics: ['Percentages', 'Profit and Loss', 'Simple Interest'] },
      { title: 'Connecting the Dots', topics: ['Data Collection', 'Bar Graphs and Pie Charts', 'Interpreting Data'] },
      { title: 'Constructions and Tilings', topics: ['Constructing Triangles', 'Tiling Patterns', 'Using a Compass and Ruler'] },
      { title: 'Finding the Unknown', topics: ['Forming Simple Equations', 'Solving Equations', 'Applications of Equations'] },
    ],
    Science: [
      { title: 'The Ever-Evolving World of Science', topics: ['Nature of Scientific Knowledge', 'Scientific Temper', 'History of Discoveries'] },
      { title: 'Exploring Substances: Acidic, Basic and Neutral', topics: ['Identifying Acids and Bases', 'Indicators', 'Neutralisation'] },
      { title: 'Electricity: Circuits and their Components', topics: ['Simple Circuits', 'Circuit Symbols', 'Conductors and Insulators'] },
      { title: 'The World of Metals and Non-metals', topics: ['Physical Properties', 'Chemical Properties', 'Uses of Metals and Non-Metals'] },
      { title: 'Changes Around Us: Physical and Chemical', topics: ['Identifying Changes', 'Rusting', 'Crystallisation'] },
      { title: 'Adolescence: A Stage of Growth and Change', topics: ['Puberty Changes', 'Hormones', 'Emotional Wellbeing'] },
      { title: 'Heat Transfer in Nature', topics: ['Conduction Convection Radiation', 'Temperature Measurement', 'Everyday Examples'] },
      { title: 'Measurement of Time and Motion', topics: ['Units of Time', 'Speed and Distance-Time Graphs', 'Measuring Instruments'] },
      { title: 'Life Processes in Animals', topics: ['Digestive System', 'Respiration in Animals', 'Circulatory System'] },
      { title: 'Life Processes in Plants', topics: ['Photosynthesis', 'Transport in Plants', 'Reproduction in Plants'] },
      { title: 'Light: Shadows and Reflections', topics: ['Formation of Shadows', 'Laws of Reflection', 'Mirrors'] },
      { title: 'Earth, Moon, and the Sun', topics: ['Phases of the Moon', 'Eclipses', 'Earth-Sun-Moon System'] },
    ],
    'Social Science': [
      { title: 'Geographical Diversity of India', topics: ['Physical Features of India', 'States and Regions', 'Diversity in Landscape'] },
      { title: 'Understanding the Weather', topics: ['Elements of Weather', 'Weather Instruments', 'Weather Forecasting'] },
      { title: 'Climates of India', topics: ['Climate Zones of India', 'Monsoons', 'Factors Affecting Climate'] },
      { title: 'New Beginnings: Cities and States', topics: ['Rise of Early States', 'Urbanisation', 'Trade and Society'] },
      { title: 'The Rise of Empires', topics: ['Mauryan Empire', 'Administration', 'Ashoka and His Edicts'] },
      { title: 'The Age of Reorganisation', topics: ['Post-Mauryan Kingdoms', 'Regional Powers', 'Cultural Developments'] },
      { title: 'The Gupta Era: An Age of Tireless Creativity', topics: ['Gupta Administration', 'Art and Science', 'Golden Age Achievements'] },
      { title: 'How the Land Becomes Sacred', topics: ['Sacred Geography', 'Pilgrimage Sites', 'Cultural Landscapes'] },
      { title: 'From the Rulers to the Ruled: Types of Governments', topics: ['Forms of Government', 'Monarchy vs Democracy', 'Citizen Participation'] },
      { title: 'The Constitution of India — An Introduction', topics: ['Need for a Constitution', 'Preamble', 'Fundamental Values'] },
      { title: 'From Barter to Money', topics: ['Barter System', 'Evolution of Money', 'Functions of Money'] },
      { title: 'Understanding Markets', topics: ['Types of Markets', 'Buyers and Sellers', 'Local and Global Markets'] },
    ],
    English: [
      { title: 'The Day the River Spoke', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Try Again', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'Three Days to See', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Animals, Birds and Dr. Dolittle', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'A Funny Man', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'Say the Right Thing', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: "My Brother's Great Invention", topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Paper Boats', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'North, South, East, West', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'The Tunnel', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Travel', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'Conquering the Summit', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'A Homage to Our Brave Soldiers', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'My Dear Soldiers', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'Rani Abbakka', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
    ],
    Hindi: [
      { title: 'Maa, Kah Ek Kahani', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Teen Buddhiman', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Phool aur Kanta', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Pani Re Pani', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Nahi Hona Bemar', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Girdhar Kaviray Ki Kundaliya', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Varsha Bahar', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Birju Maharaj Se Sakshatkar', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Chidiya', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Mira Ke Pad', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
    ],
    Sanskrit: [
      { title: 'वन्दे भारतमातरम्', topics: ['Shabdarth', 'Bhavarth', 'Kanth Path'] },
      { title: 'नित्यं पिबामः सुभाषितरसम्', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'मित्राय नमः', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'न लभ्यते चेत् आम्लं द्राक्षाफलम्', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'सेवा हि परमो धर्मः', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'क्रीडाम वयं श्लोकान्त्याक्षरीम्', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'ईशावास्यम् इदं सर्वम्', topics: ['Shabdarth', 'Bhavarth', 'Kanth Path'] },
      { title: 'हितं मनोहारि च दुर्लभं वचः', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'अन्नाद् भवन्ति भूतानि', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'दशमः कः', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: "द्वीपेषु रम्यः द्वीपो'ण्डमानः", topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'वीराङ्गना पन्नाधाया', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
    ],
  },
  // Class 8 reflects the new 2026-27 NCERT textbooks (Ganita Prakash /
  // Curiosity / Exploring Society: India and Beyond / Poorvi / Malhar /
  // Deepakam), replacing the old Rational Numbers / Crop Production-era books.
  8: {
    Mathematics: [
      { title: 'A Square and A Cube', topics: ['Perfect Squares', 'Perfect Cubes', 'Square and Cube Roots'] },
      { title: 'Power Play', topics: ['Laws of Exponents', 'Negative Exponents', 'Expressing Large Numbers'] },
      { title: 'A Story of Numbers', topics: ['Number Systems', 'Rational Numbers', 'Number Patterns'] },
      { title: 'Quadrilaterals', topics: ['Classification of Polygons', 'Properties of Parallelograms', 'Types of Quadrilaterals'] },
      { title: 'Number Play', topics: ['Divisibility Rules', 'Number Puzzles', 'Patterns in Numbers'] },
      { title: 'We Distribute, Yet Things Multiply', topics: ['Distributive Property', 'Multiplying Algebraic Expressions', 'Applications'] },
      { title: 'Proportional Reasoning-1', topics: ['Ratio and Proportion', 'Direct Proportion', 'Applications'] },
      { title: 'Fractions in Disguise', topics: ['Operations on Fractions', 'Fractions and Decimals', 'Word Problems'] },
      { title: 'The Baudhayana-Pythagoras Theorem', topics: ['Statement and Proof', 'Applications', 'Right-Angled Triangles'] },
      { title: 'Proportional Reasoning-2', topics: ['Inverse Proportion', 'Compound Proportion', 'Applications'] },
      { title: 'Exploring Some Geometric Themes', topics: ['Geometric Constructions', 'Properties of Shapes', 'Symmetry'] },
      { title: 'Tales by Dots and Lines', topics: ['Data Representation', 'Graphs', 'Interpreting Visual Data'] },
      { title: 'Algebra Play', topics: ['Algebraic Identities', 'Factorisation', 'Simplifying Expressions'] },
      { title: 'Area', topics: ['Area of Trapezium', 'Surface Area of Solids', 'Volume of Solids'] },
    ],
    Science: [
      { title: 'Exploring the Investigative World of Science', topics: ['Scientific Investigation', 'Observation and Inference', 'Recording Data'] },
      { title: 'The Invisible Living World: Beyond Our Naked Eye', topics: ['Microorganisms', 'Useful and Harmful Microbes', 'Microscopy'] },
      { title: 'Health: The Ultimate Treasure', topics: ['Components of Health', 'Disease Prevention', 'Healthy Habits'] },
      { title: 'Electricity: Magnetic and Heating Effects', topics: ['Heating Effect of Current', 'Magnetic Effect of Current', 'Electromagnets'] },
      { title: 'Exploring Forces', topics: ['Types of Force', 'Balanced and Unbalanced Forces', 'Effects of Force'] },
      { title: 'Pressure, Winds, Storms, and Cyclones', topics: ['Air Pressure', 'Formation of Winds and Storms', 'Cyclone Safety'] },
      { title: 'Particulate Nature of Matter', topics: ['States of Matter', 'Diffusion', 'Kinetic Theory Basics'] },
      { title: 'Nature of Matter: Elements, Compounds, and Mixtures', topics: ['Elements', 'Compounds', 'Mixtures'] },
      { title: 'The Amazing World of Solutes, Solvents, and Solutions', topics: ['Solutions and Solubility', 'Concentration', 'Saturated Solutions'] },
      { title: 'Light: Mirrors and Lenses', topics: ['Reflection by Mirrors', 'Refraction by Lenses', 'Image Formation'] },
      { title: 'Keeping Time with the Skies', topics: ['Calendars and Time Measurement', 'Celestial Motion', 'Seasons'] },
      { title: 'How Nature Works in Harmony', topics: ['Ecosystems', 'Interdependence', 'Balance in Nature'] },
      { title: 'Our Home: Earth, A Unique Life Sustaining Planet', topics: ['Conditions for Life', "Earth's Resources", 'Environmental Care'] },
    ],
    'Social Science': [
      { title: 'Natural Resources and Their Use', topics: ['Types of Natural Resources', 'Conservation', 'Sustainable Use'] },
      { title: "Reshaping India's Political Map", topics: ['Formation of States', 'Linguistic Reorganisation', 'Administrative Changes'] },
      { title: 'The Rise of the Marathas', topics: ['Shivaji and the Maratha Kingdom', 'Maratha Administration', 'Maratha Expansion'] },
      { title: 'The Colonial Era in India', topics: ['Establishment of British Rule', 'Economic Impact', 'Resistance Movements'] },
      { title: "Universal Franchise and India's Electoral System", topics: ['Right to Vote', 'Election Commission', 'Electoral Process'] },
      { title: 'The Parliamentary System: Legislature and Executive', topics: ['Structure of Parliament', 'Role of the Executive', 'Law-Making Process'] },
      { title: 'Factors of Production', topics: ['Land Labour Capital', 'Entrepreneurship', 'Production Process'] },
    ],
    English: [
      { title: 'The Wit that Won Hearts', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'A Concrete Example', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Wisdom Paves the Way', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'A Tale of Valour: Major Somnath Sharma and the Battle of Badgam', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: "Somebody's Mother", topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'Verghese Kurien - I Too Had A Dream', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'The Case of the Fifth Word', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'The Magic Brush of Dreams', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Spectacular Wonders', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'The Cherry Tree', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Harvest Hymn', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'Waiting for the Rain', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
    ],
    Hindi: [
      { title: 'Laakh Ki Choodiyaan', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Bus Ki Yaatra', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Deevano Ki Hasti', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Bhagavan Ke Daakie', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Kya Niraash Hua Jae', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Yah Sabase Kathin Samay Nahin', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Kabeer Ki Saakhiyon', topics: ['Sakhiyon ka Bhavarth', 'Shabd Arth', 'Kanth Path'] },
      { title: 'Sudama Charit', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Jahaan Pahiya Hai', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Akabari Lota', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Soor Ke Pad', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Pani Ki Kahani', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Baaj Aur Saanp', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
    ],
    Sanskrit: [
      { title: 'संगच्छध्वं संवदध्वम्', topics: ['Shabdarth', 'Bhavarth', 'Kanth Path'] },
      { title: 'अल्पानामपि वस्तूनां संहतिः कार्यसाधिका', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'सुभाषितरस पीत्वा जीवनं सफलं कुरु', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'प्रणम्य देशभक्तोऽयं गोपबन्धुर्महामनाः', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'गीता सुगीता कर्तव्या', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'डिजिभारतम् युगपरिवर्तनम्', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'मञ्जुलमञ्जूषा सुन्दरसुरभाषा', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'पश्यत कोणमैशान्यं भारतस्य मनोहरम्', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'कोऽरुक्?', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'सन्निमित्ते वरं त्यागः (क-भागः)', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'सन्निमित्ते वरं त्यागः (ख-भागः)', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'सम्यग्वर्णप्रयोगेण ब्रह्मलोके महीयते', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'वर्णोच्चारण-शिक्षा १', topics: ['Uchcharan Abhyas', 'Shabdarth', 'Anuvad Abhyas'] },
    ],
  },
  // Class 9 reflects the brand-new 2026-27 NCERT textbooks (Ganita Manjari /
  // Science Exploration / Kaveri / Ganga / Sharda / Understanding Society:
  // India and Beyond), which fully replaced the old Number Systems / Matter
  // in Our Surroundings / Beehive-era books this academic year -- the
  // single biggest NCERT curriculum change in over 20 years. Social Science
  // lists only Part 1's 9 chapters since NCERT had not yet published Part 2
  // as of this data pull; add Part 2 once it's released.
  9: {
    Mathematics: [
      { title: 'Orienting Yourself: The Use of Coordinates', topics: ['Cartesian Plane', 'Plotting Points', 'Real-Life Applications of Coordinates'] },
      { title: 'Introduction to Linear Polynomials', topics: ['Degree of a Polynomial', 'Zeroes of a Linear Polynomial', 'Graphing Linear Polynomials'] },
      { title: 'The World of Numbers', topics: ['Rational and Irrational Numbers', 'Real Numbers on a Number Line', 'Laws of Exponents'] },
      { title: 'Exploring Algebraic Identities', topics: ['Standard Identities', 'Applying Identities', 'Factorisation Using Identities'] },
      { title: "I'm Up and Down, and Round and Round", topics: ['Symmetry and Transformations', 'Patterns of Motion', 'Real-Life Examples'] },
      { title: 'Measuring Space: Perimeter and Area', topics: ['Perimeter of Plane Figures', 'Area of Plane Figures', "Heron's Formula"] },
      { title: 'The Mathematics of Maybe: Introduction to Probability', topics: ['Experimental Probability', 'Sample Space', 'Simple Probability Problems'] },
      { title: 'Predicting What Comes Next: Exploring Sequences and Progressions', topics: ['Arithmetic Sequences', 'Patterns in Sequences', 'Applications of Progressions'] },
    ],
    Science: [
      { title: 'Exploration: Entering the World of Secondary Science', topics: ['What is Secondary Science', 'Scientific Enquiry', 'Branches of Science'] },
      { title: 'Cell: The Building Block of Life', topics: ['Cell Theory', 'Cell Organelles', 'Cell Division'] },
      { title: 'Tissues in Action', topics: ['Plant Tissues', 'Animal Tissues', 'Functions of Tissues'] },
      { title: 'Describing Motion Around Us', topics: ['Distance and Displacement', 'Velocity and Acceleration', 'Equations of Motion'] },
      { title: 'Exploring Mixtures and Their Separation', topics: ['Mixtures and Solutions', 'Separation Techniques', 'Physical and Chemical Changes'] },
      { title: 'How Forces Affect Motion', topics: ["Newton's Laws", 'Inertia', 'Conservation of Momentum'] },
      { title: 'Work, Energy, and Simple Machines', topics: ['Work Done', 'Kinetic and Potential Energy', 'Simple Machines'] },
      { title: 'Journey Inside the Atom', topics: ['Discovery of Subatomic Particles', "Bohr's Model", 'Isotopes and Isobars'] },
      { title: 'Atomic Foundations of Matter', topics: ['Laws of Chemical Combination', 'Atomic Mass', 'Molecular Mass'] },
      { title: 'Sound Waves: Characteristics and Applications', topics: ['Production and Propagation', 'Reflection of Sound', 'Human Ear'] },
      { title: 'Reproduction: How Life Continues', topics: ['Modes of Reproduction', 'Human Reproductive System', 'Reproductive Health'] },
      { title: 'Patterns in Life: Diversity and Classification', topics: ['Classification Systems', 'Five Kingdom Classification', 'Nomenclature'] },
      { title: 'Earth as a System: Energy, Matter, and Life', topics: ['The Biosphere', 'Water and Nitrogen Cycle', 'Ozone Layer'] },
    ],
    'Social Science': [
      { title: 'Understanding Social Science', topics: ['What is Social Science', 'Branches of Social Science', 'Why We Study Society'] },
      { title: "Shaping of the Earth's Surface", topics: ['Endogenic Processes', 'Exogenic Processes', 'Landform Formation'] },
      { title: 'Atmosphere and Climate', topics: ['Layers of the Atmosphere', 'Elements of Climate', 'Factors Affecting Climate'] },
      { title: 'Early Humans and Beginning of Civilisation', topics: ['Evolution of Early Humans', 'Neolithic Revolution', 'Rise of Early Civilisations'] },
      { title: 'State and Society up to 1000 CE', topics: ['Early Kingdoms', 'Administration and Society', 'Trade and Culture'] },
      { title: 'Democracy', topics: ['Meaning of Democracy', 'Features of Democracy', 'Democracy vs Other Forms of Government'] },
      { title: 'Elections', topics: ['Need for Elections', 'Election Process in India', 'Free and Fair Elections'] },
      { title: 'Building Blocks in Economics: The Problem of Choice', topics: ['Scarcity and Choice', 'Opportunity Cost', 'Basic Economic Problems'] },
      { title: 'The Price Puzzle: What Drives the Market', topics: ['Demand and Supply', 'Price Determination', 'Market Equilibrium'] },
    ],
    English: [
      { title: 'How I Taught My Grandmother to Read', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Bharat Our Land', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'The Pot Maker', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Gifts of Grace: Honouring Our Vocations', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'Winds of Change', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Canvas of Soil', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'Vitamin-M', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'I Cannot Remember My Mother', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'The World of Limitless Possibilities', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Nine Gold Medals', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'Twin Melodies', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'A Friend Found in Music', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'Carrier of Words', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Words', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'Follow That Dream', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Believe in Yourself', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
    ],
    Hindi: [
      { title: 'Do Bailon Ki Katha', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Kya Likhoon?', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Samvadaheen', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Reedh Ki Haddi', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Main Aur Mera Desh', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Nana Saheb Ki Putri Devi Maina Ko Bhasm Kar Diya Gaya', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Premchand Ke Phate Joote', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Pad', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Ram-Lakshman-Parashuram Samvad', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Bharati, Jay Vijay Karo', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Jhansi Ki Rani', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Ghar Ki Yaad', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
    ],
    Sanskrit: [
      { title: 'सत्यं शिवं सुन्दरं संस्कृतम्', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'सुखस्य मूलं धर्मः धर्मस्य मूलम् अर्थः', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'आत्मवत्सर्वभूतेषु यः पश्यति सः पण्डितः', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'न खलु वयस्तेजसो हेतुः', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'एषा सा कृतकबुद्धिः मानवबुद्धेः सहकरी', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'मनःपूतं समाचरेत्', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'उपायं चिन्तयेत् प्राज्ञस्तथापायं च चिन्तयेत्', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'अन्नाद् आनन्दं प्रति', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'कृतं प्रतिकृतं भूयादेष धर्मः सनातनः', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'णमो अरिहन्ताणम्', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'वर्णोच्चारण-शिक्षा २', topics: ['Uchcharan Abhyas', 'Shabdarth', 'Anuvad Abhyas'] },
    ],
  },
  10: {
    Mathematics: [
      { title: 'Real Numbers', topics: ['Euclid’s Division Lemma', 'Fundamental Theorem of Arithmetic', 'Irrational Numbers'] },
      { title: 'Polynomials', topics: ['Zeroes of a Polynomial', 'Relationship Between Zeroes and Coefficients', 'Division Algorithm'] },
      { title: 'Pair of Linear Equations in Two Variables', topics: ['Graphical Method', 'Substitution and Elimination', 'Cross-Multiplication Method'] },
      { title: 'Quadratic Equations', topics: ['Standard Form', 'Factorisation Method', 'Quadratic Formula'] },
      { title: 'Arithmetic Progressions', topics: ['nth Term', 'Sum of n Terms', 'Applications'] },
      { title: 'Triangles', topics: ['Similar Triangles', 'Criteria for Similarity', 'Areas of Similar Triangles'] },
      { title: 'Coordinate Geometry', topics: ['Distance Formula', 'Section Formula', 'Area of a Triangle'] },
      { title: 'Introduction to Trigonometry', topics: ['Trigonometric Ratios', 'Trigonometric Identities', 'Ratios of Specific Angles'] },
      { title: 'Some Applications of Trigonometry', topics: ['Heights and Distances', 'Angle of Elevation', 'Angle of Depression'] },
      { title: 'Circles', topics: ['Tangent to a Circle', 'Number of Tangents', 'Properties of Tangents'] },
      { title: 'Areas Related to Circles', topics: ['Area of a Circle', 'Sector and Segment', 'Combinations of Plane Figures'] },
      { title: 'Surface Areas and Volumes', topics: ['Combination of Solids', 'Frustum of a Cone', 'Conversion of Solids'] },
      { title: 'Statistics', topics: ['Mean of Grouped Data', 'Mode and Median of Grouped Data', 'Cumulative Frequency Curve'] },
      { title: 'Probability', topics: ['Theoretical Probability', 'Complementary Events', 'Applications'] },
    ],
    Science: [
      { title: 'Chemical Reactions and Equations', topics: ['Balancing Chemical Equations', 'Types of Reactions', 'Oxidation and Reduction'] },
      { title: 'Acids, Bases and Salts', topics: ['pH Scale', 'Reactions of Acids and Bases', 'Common Salts'] },
      { title: 'Metals and Non-metals', topics: ['Physical and Chemical Properties', 'Reactivity Series', 'Extraction of Metals'] },
      { title: 'Carbon and Its Compounds', topics: ['Covalent Bonding', 'Homologous Series', 'Nomenclature of Carbon Compounds'] },
      { title: 'Life Processes', topics: ['Nutrition', 'Respiration', 'Circulation and Excretion'] },
      { title: 'Control and Coordination', topics: ['Nervous System', 'Reflex Action', 'Plant Hormones'] },
      { title: 'How Do Organisms Reproduce?', topics: ['Modes of Reproduction', 'Human Reproductive System', 'Reproductive Health'] },
      { title: 'Heredity and Evolution', topics: ['Mendel’s Laws', 'Sex Determination', 'Evolution by Natural Selection'] },
      { title: 'Light: Reflection and Refraction', topics: ['Laws of Reflection', 'Refraction Through Lenses', 'Lens Formula'] },
      { title: 'The Human Eye and the Colourful World', topics: ['Structure of the Eye', 'Defects of Vision', 'Dispersion of Light'] },
      { title: 'Electricity', topics: ['Ohm’s Law', 'Series and Parallel Circuits', 'Electric Power'] },
      { title: 'Magnetic Effects of Electric Current', topics: ['Magnetic Field Lines', 'Electromagnetic Induction', 'Electric Motor and Generator'] },
      { title: 'Sources of Energy', topics: ['Conventional Sources', 'Non-Conventional Sources', 'Environmental Consequences'] },
      { title: 'Our Environment', topics: ['Ecosystems', 'Food Chains and Webs', 'Ozone Depletion'] },
      { title: 'Sustainable Management of Natural Resources', topics: ['Forest and Wildlife', 'Water Harvesting', 'The Three R’s'] },
    ],
    'Social Science': [
      { title: 'The Rise of Nationalism in Europe', topics: ['Age of Revolutions', 'Making of Germany and Italy', 'Visualising the Nation'] },
      { title: 'Nationalism in India', topics: ['The First World War and Nationalism', 'Non-Cooperation Movement', 'Civil Disobedience Movement'] },
      { title: 'Resources and Development', topics: ['Types of Resources', 'Land Resources', 'Soil Conservation'] },
      { title: 'Water Resources', topics: ['Water Scarcity', 'Multi-Purpose Projects', 'Rainwater Harvesting'] },
      { title: 'Power Sharing', topics: ['Forms of Power Sharing', 'Belgium and Sri Lanka', 'Why Power Sharing is Desirable'] },
      { title: 'Federalism', topics: ['Features of Federalism', 'Decentralisation in India', 'Local Government'] },
      { title: 'Development', topics: ['Notions of Development', 'National Income', 'Sustainability of Development'] },
      { title: 'Sectors of the Indian Economy', topics: ['Primary Secondary Tertiary Sectors', 'Organised and Unorganised Sector', 'Employment'] },
    ],
    // Class 10 keeps the existing (pre-NEP-2020-revision) NCERT textbooks for
    // the 2026-27 session -- new Class 10 books arrive 2027-28. English/Hindi/
    // Sanskrit real chapters added here; Hindi follows Course A (Kshitij +
    // Kritika), the most common CBSE default.
    English: [
      { title: 'A Letter to God', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Dust of Snow', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'Nelson Mandela: Long Walk to Freedom', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Fire and Ice', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'Two Stories about Flying', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'A Tiger in the Zoo', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'From the Diary of Anne Frank', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'How to Tell Wild Animals', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'The Hundred Dresses - I', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'The Ball Poem', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'The Hundred Dresses - II', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Amanda', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'Glimpses of India', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'The Trees', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'Mijbil the Otter', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Fog', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'Madam Rides the Bus', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'The Tale of Custard the Dragon', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'The Sermon at Benares', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'For Anne Gregory', topics: ['Poem Reading', 'Rhyme and Rhythm', 'Central Idea'] },
      { title: 'The Proposal', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'A Triumph of Surgery', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: "The Thief's Story", topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'The Midnight Visitor', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'A Question of Trust', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Footprints without Feet', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'The Making of a Scientist', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'The Necklace', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'Bholi', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
      { title: 'The Book that Saved the Earth', topics: ['Comprehension', 'Vocabulary and Word Meanings', 'Theme and Discussion Questions'] },
    ],
    Hindi: [
      { title: 'Pad (Surdas)', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Kanth Path'] },
      { title: 'Ram-Lakshman-Parashuram Samvad', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Savaiya aur Kavitt', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Aatmakathya', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Utsah, Atbhi Nahin Rahi', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Yah Danturit Muskan, Fasal', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Chhaya Mat Chhuna', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Kanyadan', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Sangatkar', topics: ['Kavita ka Bhavarth', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Netaji ka Chashma', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Balgobin Bhagat', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Lakhnavi Andaz', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Manviya Karuna ki Divya Chamak', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Ek Kahani Yah Bhi', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Stree Shiksha ke Virudh Bayanbazi ek Ayojan', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Naubatkhane mein Ibadat', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Sanskriti', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Mata Ka Aanchal', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'George Pancham Ki Naak', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Sana Sana Hath Jodi', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Ehi Thaiya Jhulni', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
      { title: 'Main Kyun Likhta Hoon', topics: ['Path ka Saransh', 'Shabd Arth', 'Prashn Uttar'] },
    ],
    Sanskrit: [
      { title: 'शुचिपर्यावरणम्', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'बुद्धिर्बलवती सदा', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'शिशुलालनम्', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'जननी तुल्यवत्सला', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'सुभाषितानि', topics: ['Shabdarth', 'Bhavarth', 'Kanth Path'] },
      { title: 'सौहार्दं प्रकृतेः शोभा', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'विचित्रः साक्षी', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'सूक्तयः', topics: ['Shabdarth', 'Bhavarth', 'Kanth Path'] },
      { title: 'भूकंपविभीषिका', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
      { title: 'अन्योक्तः', topics: ['Shabdarth', 'Bhavarth', 'Prashn Uttar'] },
    ],
  },
};

const SECONDARY_SUBJECT_TEMPLATES = {
  English: (grade) => [
    { title: 'Prose: Reading and Comprehension', topics: ['Main Idea and Theme', 'Character Study', 'Inference Questions'] },
    { title: 'Poetry Appreciation', topics: ['Rhyme and Rhythm', 'Figures of Speech', 'Central Idea'] },
    { title: 'Grammar in Use', topics: ['Tenses', 'Parts of Speech', 'Sentence Correction'] },
    { title: 'Writing Skills', topics: ['Paragraph Writing', 'Letter and Email Writing', 'Story Writing'] },
  ],
  Hindi: (grade) => [
    { title: 'Gadya Khand', topics: ['Path Vishleshan', 'Shabd Arth', 'Prashn Uttar'] },
    { title: 'Padya Khand', topics: ['Kavita Vishleshan', 'Alankar', 'Bhavarth'] },
    { title: 'Vyakaran', topics: ['Sandhi aur Samas', 'Kaal', 'Vakya Shuddhi'] },
    { title: 'Lekhan Kaushal', topics: ['Nibandh Lekhan', 'Patra Lekhan', 'Anuchhed Lekhan'] },
  ],
  Sanskrit: (grade) => [
    { title: 'Shabd Roop', topics: ['Sangya Shabd Roop', 'Sarvanam Shabd Roop', 'Vibhakti Gyan'] },
    { title: 'Dhatu Roop', topics: ['Lat Lakar', 'Lot Lakar', 'Kriya Roop'] },
    { title: 'Gadya Path', topics: ['Path Vachan', 'Shabd Arth', 'Anuvad'] },
    { title: 'Subhashitani', topics: ['Shlok Path', 'Bhavarth', 'Kanth Path'] },
  ],
};

for (let grade = 6; grade <= 10; grade++) {
  const subjectNames = ['English', 'Mathematics', 'Science', 'Social Science', 'Hindi', 'Sanskrit'];
  CURRICULUM[grade] = {
    subjects: subjectNames.map((name) => ({
      name,
      code: `${name.replace(/\s+/g, '').slice(0, 4).toUpperCase()}${grade}`,
      chapters: REAL_SECONDARY_CHAPTERS[grade]?.[name] || SECONDARY_SUBJECT_TEMPLATES[name](grade),
    })),
  };
}

function esc(s) {
  return String(s).replace(/'/g, "''");
}

function boardBlock() {
  return `  INSERT INTO public.boards (id, code, name, description, is_active)\n` +
    `  VALUES (gen_random_uuid(), 'CBSE', 'Central Board of Secondary Education', 'National board of education in India', true)\n` +
    `  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name\n` +
    `  RETURNING id INTO v_board_cbse;\n\n`;
}

function classBlock(grade, gradeData) {
  let sql = '';
  sql += `  -- ==========================================\n`;
  sql += `  -- CLASS ${grade}\n`;
  sql += `  -- ==========================================\n`;
  sql += `  INSERT INTO public.classes (id, grade_number, name)\n`;
  sql += `  VALUES (gen_random_uuid(), ${grade}, 'Class ${grade}')\n`;
  sql += `  ON CONFLICT (grade_number) DO UPDATE SET name = EXCLUDED.name\n`;
  sql += `  RETURNING id INTO v_class_id;\n\n`;

  for (const subject of gradeData.subjects) {
    sql += `  -- ${subject.name}\n`;
    sql += `  INSERT INTO public.subjects (id, class_id, board_id, name, code)\n`;
    sql += `  VALUES (gen_random_uuid(), v_class_id, v_board_cbse, '${esc(subject.name)}', '${esc(subject.code)}')\n`;
    sql += `  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code\n`;
    sql += `  RETURNING id INTO v_subj_id;\n\n`;

    subject.chapters.forEach((chapter, chapterIdx) => {
      const chapterNumber = chapterIdx + 1;
      sql += `  INSERT INTO public.chapters (id, subject_id, chapter_number, title, description)\n`;
      sql += `  VALUES (gen_random_uuid(), v_subj_id, ${chapterNumber}, '${esc(chapter.title)}', '${esc(chapter.title)}')\n`;
      sql += `  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title\n`;
      sql += `  RETURNING id INTO v_chap_id;\n`;
      sql += `  INSERT INTO public.topics (id, chapter_id, topic_number, title, summary) VALUES\n`;
      const topicRows = chapter.topics.map((topic, topicIdx) =>
        `  (gen_random_uuid(), v_chap_id, ${topicIdx + 1}, '${esc(topic)}', '${esc(topic)}')`
      );
      sql += topicRows.join(',\n') + '\n';
      sql += `  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;\n\n`;
    });
  }
  return sql;
}

const header = `-- Seed file for CBSE Curriculum
-- Generated by packages/db/scripts/generate-seed.js -- do not hand-edit large sections,
-- update CURRICULUM in that script and regenerate instead.
--
-- Idempotent: every insert uses ON CONFLICT ... DO UPDATE ... RETURNING id, so this
-- script can be run repeatedly (e.g. as part of a migration pipeline) without erroring
-- on rows that already exist.

`;

const declareBlock = `DECLARE\n  v_board_cbse UUID;\n  v_class_id UUID;\n  v_subj_id UUID;\n  v_chap_id UUID;\n`;

// Full combined seed.sql (single DO block) -- canonical, checked-in source of truth.
let fullSql = header + `DO $$\n${declareBlock}BEGIN\n\n${boardBlock()}`;
for (let grade = 1; grade <= 10; grade++) {
  fullSql += classBlock(grade, CURRICULUM[grade]);
}
fullSql += `END $$;\n`;

const outPath = path.resolve(__dirname, '../src/seed.sql');
fs.writeFileSync(outPath, fullSql, 'utf8');
console.log(`Wrote ${outPath} (${fullSql.length} bytes)`);

// Per-class self-contained files -- each is independently idempotent (re-resolves
// the board/class ids itself), used to apply the seed in smaller chunks.
const chunksDir = path.resolve(__dirname, '../src/seed_chunks');
fs.mkdirSync(chunksDir, { recursive: true });
for (let grade = 1; grade <= 10; grade++) {
  const chunkSql = `DO $$\n${declareBlock}BEGIN\n\n${boardBlock()}${classBlock(grade, CURRICULUM[grade])}END $$;\n`;
  const chunkPath = path.join(chunksDir, `class_${String(grade).padStart(2, '0')}.sql`);
  fs.writeFileSync(chunkPath, chunkSql, 'utf8');
}
console.log(`Wrote 10 per-class chunk files to ${chunksDir}`);
