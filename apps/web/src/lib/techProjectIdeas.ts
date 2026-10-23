// Curated Tech Lab project ideas -- researched, not AI-generated filler.
// Framed honestly as "popular project ideas", not live "trending" data (the
// app has no way to know what's trending in real time without a paid
// service -- see the conversation this was scoped in). Grounded in what
// Indian Atal Tinkering Labs, CBSE's AI curriculum, and free tools like
// Google Teachable Machine, Scratch, and Tinkercad/Wokwi actually cover.
//
// Each idea's `prompt` is exactly what gets sent to the AI as the project's
// theme -- write these as if briefing a project designer, not as a UI label.

export type TechProjectCategory = 'robotics' | 'ai' | 'coding';

export interface TechProjectIdea {
  id: string;
  title: string;
  hook: string; // one-line description shown on the card
  prompt: string; // sent to the AI as `ideaPrompt`
}

export interface GradeBand {
  id: string;
  label: string;
  classNumbers: number[]; // grade_number values this band covers
}

export const GRADE_BANDS: GradeBand[] = [
  { id: 'early', label: 'Class 1-3', classNumbers: [1, 2, 3] },
  { id: 'junior', label: 'Class 4-6', classNumbers: [4, 5, 6] },
  { id: 'middle', label: 'Class 7-8', classNumbers: [7, 8] },
  { id: 'senior', label: 'Class 9-10', classNumbers: [9, 10] },
  { id: 'plusTwo', label: 'Class 11-12', classNumbers: [11, 12] },
];

export function gradeBandForClass(gradeNumber: number): GradeBand {
  return GRADE_BANDS.find((b) => b.classNumbers.includes(gradeNumber)) || GRADE_BANDS[GRADE_BANDS.length - 1];
}

// bandId -> category -> ideas
export const TECH_PROJECT_IDEAS: Record<string, Record<TechProjectCategory, TechProjectIdea[]>> = {
  early: {
    robotics: [
      { id: 'early-robo-lever', title: 'Lever-Powered Toy Crane', hook: 'A simple machine that lifts things using a lever and pivot.', prompt: 'A simple, screen-free machine using a lever and a pivot point (like a see-saw) to lift a small toy load -- introducing the idea that machines can multiply the force we apply.' },
      { id: 'early-robo-maze', title: 'Program a Virtual Robot Through a Maze', hook: 'Give step-by-step directions to a robot character in a simple block-coding maze game.', prompt: 'Using a free block-based tool, program a simple on-screen robot character to move through a maze by giving it a sequence of forward/turn instructions -- introducing the idea that robots only do exactly what they are told, in order.' },
      { id: 'early-robo-pulley', title: 'Pulley Flag-Raiser', hook: 'Raise a tiny flag using a thread-and-spool pulley system.', prompt: 'A simple pulley made from a thread wound around a spool/pencil that raises a tiny paper flag when turned -- introducing pulleys as a way machines change the direction of a force.' },
      { id: 'early-robo-sensor-story', title: 'What Is a Sensor? A Torch-and-Shadow Game', hook: 'Act out how a robot "senses" light and dark using a torch.', prompt: 'A hands-on, screen-free activity using a torch and shadows to role-play how a light sensor works -- reacting differently to light vs dark -- as an intro to what "sensors" mean for robots, before ever touching a real one.' },
    ],
    ai: [
      { id: 'early-ai-sort', title: 'Sort It Like a Computer', hook: 'Sort a pile of objects by one rule, then talk about how a computer would "learn" that rule.', prompt: 'A hands-on sorting game (e.g. sorting toy animals by "has fur" vs "does not") that leads into a simple explanation of how AI image sorters learn from many labeled examples, without using any software -- an unplugged introduction to what "training" means.' },
      { id: 'early-ai-pattern', title: 'Guess My Pattern', hook: 'A simple pattern-guessing game that mirrors how AI spots patterns in data.', prompt: 'An unplugged pattern-recognition game (e.g. clap-clap-stomp sequences) where the class has to guess the next item in a pattern, connecting it to how AI looks for patterns in data.' },
      { id: 'early-ai-face', title: 'Meet a Friendly AI: What Can It "See"?', hook: 'A gentle, guided look at a working image classifier trained live in class.', prompt: 'A teacher/parent-led demo (the child watches and participates) of a very simple Google Teachable Machine image model trained on 2-3 obvious objects, so the child sees a computer "learn" to tell them apart in real time.' },
      { id: 'early-ai-robot-friend', title: 'Design a Helper Robot on Paper', hook: 'Draw and describe an imaginary AI helper and what it would need to "see" or "hear".', prompt: 'A creative, paper-based design activity where the student invents a helpful robot/AI friend and describes what it would need to sense (see, hear, feel) to do its job -- building intuition for AI inputs before any coding.' },
    ],
    coding: [
      { id: 'early-code-dance', title: 'Dancing Character (Scratch)', hook: 'Make a sprite dance and play a sound when clicked.', prompt: 'A beginner Scratch project: a sprite that dances (changes costumes/moves) and plays a sound when clicked, teaching motion blocks and event blocks.' },
      { id: 'early-code-story', title: 'Animated Greeting Card (Scratch)', hook: 'A card that changes color and plays a chime when tapped.', prompt: 'A beginner Scratch "magic greeting card" project: clicking the card changes its background/costume and plays a sound -- teaching events and simple looks/sound blocks.' },
      { id: 'early-code-catch', title: 'Simple Catch Game (Scratch)', hook: 'Move a basket left and right to catch falling items.', prompt: 'A beginner Scratch catch game: a sprite falls from the top of the screen and the player moves a basket with arrow keys to catch it, introducing motion, keyboard events, and simple collision.' },
      { id: 'early-code-story2', title: 'Two-Character Animated Story (Scratch)', hook: 'Two sprites take turns "talking" using speech bubbles.', prompt: 'A beginner Scratch animated story with two sprites that take turns using speech-bubble blocks to tell a short story, teaching sequencing and the "say" block.' },
    ],
  },
  junior: {
    robotics: [
      { id: 'junior-robo-obstacle', title: 'Obstacle-Avoiding Robot (Simulated)', hook: 'An ultrasonic sensor that makes a virtual robot stop and turn before it bumps into anything.', prompt: 'An obstacle-avoiding robot built and tested in a free Arduino simulator, using an ultrasonic distance sensor to detect objects ahead and stop/turn before colliding -- a classic beginner Atal Tinkering Lab project.' },
      { id: 'junior-robo-fire-alarm', title: 'Smart Fire/Smoke Alarm (Simulated)', hook: 'A sensor-triggered alarm that sounds a buzzer when it detects heat or smoke.', prompt: 'A simple fire/smoke-alarm circuit built in a free Arduino simulator, where a heat or smoke-style sensor input triggers an LED and buzzer alert -- introducing sensors, thresholds, and safety systems.' },
      { id: 'junior-robo-traffic', title: 'Automatic Traffic Light', hook: 'A 3-LED traffic light that cycles red-yellow-green on a timer.', prompt: 'A traffic-light simulator using three LEDs (red/yellow/green) that cycle automatically on a timed sequence, built in a free Arduino simulator -- introducing timing/sequencing logic in code.' },
      { id: 'junior-robo-simon', title: 'Simon Says Memory Game', hook: 'A light-and-sound memory game where players repeat a growing sequence.', prompt: 'A "Simon Says"-style memory game using LEDs, push buttons, and a buzzer (built in a free Arduino simulator) where the device shows a growing sequence of lights/sounds and the player must repeat it correctly.' },
    ],
    ai: [
      { id: 'junior-ai-recycle', title: 'Recyclable vs Non-Recyclable Sorter', hook: 'Train an image classifier to tell recyclable items from non-recyclable ones.', prompt: 'Using Google Teachable Machine (free, browser-based, no signup needed), train an image classifier that distinguishes recyclable items (paper, plastic bottles) from non-recyclable ones, then discuss what the model got right/wrong and why -- a real, socially useful AI project.' },
      { id: 'junior-ai-gesture', title: 'Gesture-Controlled Mini Game', hook: 'Control a simple on-screen action using hand poses instead of a keyboard.', prompt: 'Using Google Teachable Machine\'s pose/image model, train the computer to recognize 2-3 hand gestures and map each to a simple on-screen action (like moving left/right/jump), demonstrating how AI can replace a keyboard as an input device.' },
      { id: 'junior-ai-sound', title: 'Clap/Whistle Sound Detector', hook: 'Train an AI to tell claps, whistles, and silence apart.', prompt: 'Using Google Teachable Machine\'s audio model (free, browser-based), train a sound classifier that tells apart claps, whistles, and silence, then discuss how this is similar to how voice assistants "listen" for wake words.' },
      { id: 'junior-ai-animal', title: 'Animal Identifier', hook: 'A trained AI that tells apart photos of 3-4 different animals.', prompt: 'Using Google Teachable Machine, collect/photograph examples of 3-4 different animals (or animal pictures) and train an image classifier to identify them, then test it on new photos it hasn\'t seen before.' },
    ],
    coding: [
      { id: 'junior-code-quiz', title: 'Build a Quiz Game (Scratch)', hook: 'A multiple-choice quiz that keeps score and reacts to right/wrong answers.', prompt: 'A Scratch quiz game with 5 multiple-choice questions on a school subject of the student\'s choice, that keeps score using a variable and shows a different reaction for right vs wrong answers -- teaching variables and conditionals (if/else).' },
      { id: 'junior-code-chase', title: 'Chase Game with Clones (Scratch)', hook: 'A sprite that clones itself into multiple chasers.', prompt: 'A Scratch game where an enemy sprite uses the "clone" feature to create multiple copies that chase the player, teaching the clone/broadcast system and simple collision detection.' },
      { id: 'junior-code-turtle', title: 'Draw Shapes with Code (Python Turtle)', hook: 'Use short Python commands to draw geometric patterns.', prompt: 'Using Python\'s free built-in "turtle" graphics module, write a short program that draws a geometric pattern (like a star or spiral) using loops -- an accessible first taste of real text-based code after block coding.' },
      { id: 'junior-code-chatbot', title: 'Simple Rule-Based Chatbot (Scratch)', hook: 'A chatbot that replies differently based on keywords it hears.', prompt: 'A simple rule-based chatbot in Scratch that asks the user to type a message and gives a different canned reply depending on keywords found in it (using the "contains" block), introducing the idea of rule-based (non-AI) chatbots as a contrast to real AI.' },
    ],
  },
  middle: {
    robotics: [
      { id: 'middle-robo-lineFollower', title: 'Line-Following Robot (Simulated)', hook: 'A robot that steers itself by following a line using light sensors.', prompt: 'A line-following robot built and tested in a free Arduino simulator, using two IR/light sensors to detect a dark line on a light floor and steer two motors to stay on track -- a staple robotics-club project.' },
      { id: 'middle-robo-parking', title: 'Smart Reverse-Parking Sensor', hook: 'A distance sensor that beeps faster the closer an object gets, like a car\'s parking sensor.', prompt: 'A reverse-parking sensor simulation: an ultrasonic distance sensor that makes a buzzer beep faster as an object gets closer, mimicking real car parking-assist systems.' },
      { id: 'middle-robo-hand', title: 'Robotic Gripper Hand', hook: 'A simple servo-powered gripper that opens and closes to pick things up.', prompt: 'A simple robotic gripper/hand using 1-2 servo motors controlled by code (built and tested in simulation first), that opens and closes to grip a small object -- an intro to actuators and automation.' },
      { id: 'middle-robo-plant', title: 'Automatic Plant-Watering Alert', hook: 'A soil-moisture sensor that tells you when a plant needs water.', prompt: 'A soil-moisture-sensing circuit (simulated) that lights an LED or sounds a buzzer when soil moisture drops below a threshold, framed as a real agriculture-tech application students can relate to.' },
    ],
    ai: [
      { id: 'middle-ai-emotion', title: 'Facial Expression Classifier', hook: 'Train an AI to tell happy, sad, and surprised faces apart.', prompt: 'Using Google Teachable Machine\'s image model, train a classifier that distinguishes 3 facial expressions (e.g. happy/sad/surprised) from webcam photos, then discuss the ethics and limits of emotion-detection AI (it detects the expression, not the real feeling).' },
      { id: 'middle-ai-bias', title: 'AI Bias Investigation', hook: 'Deliberately train a "bad" model to see how biased training data causes biased results.', prompt: 'An investigative project: train two versions of the same Teachable Machine image classifier -- one with varied, balanced examples and one with narrow, unbalanced examples -- and compare how differently they perform, to concretely demonstrate what "AI bias" means and why training data matters.' },
      { id: 'middle-ai-spam', title: 'Spam Message Detector (Beginner Python)', hook: 'A simple program that flags messages containing common spam words/patterns.', prompt: 'A beginner Python project (using free Google Colab, no install needed) that checks a list of sample messages against common spam indicators (keywords, excessive punctuation, all-caps) and flags likely spam -- a gentle, code-based intro to classification before real machine learning.' },
      { id: 'middle-ai-translator', title: 'Sign-to-Text Gesture Recognizer', hook: 'Train an AI to recognize a handful of simple hand signs and display the matching word.', prompt: 'Using Google Teachable Machine\'s image model, train a classifier to recognize 4-5 simple hand signs (e.g. thumbs up, peace sign, open palm) and map each one to displaying its meaning as text -- an accessible starting point for exploring assistive tech.' },
    ],
    coding: [
      { id: 'middle-code-game', title: 'Space Shooter Game (Scratch)', hook: 'A side-scrolling shooter with score, lives, and increasing difficulty.', prompt: 'A Scratch space-shooter game with a player ship, spawning enemies (via clones), a score variable, a lives system, and difficulty that increases over time -- combining several intermediate Scratch concepts into one complete game.' },
      { id: 'middle-code-calc', title: 'Build a Calculator (Python)', hook: 'A simple command-line calculator that handles +, -, x, /.', prompt: 'A beginner Python command-line calculator (using free Google Colab or Replit) that takes two numbers and an operator from the user and returns the result, handling basic error cases like division by zero.' },
      { id: 'middle-code-app', title: 'Simple Mobile App (MIT App Inventor)', hook: 'Build a real installable Android app -- like a to-do list -- using drag-and-drop blocks.', prompt: 'A simple to-do-list or quiz mobile app built with MIT App Inventor (free, browser-based, block coding, produces a real installable Android app) -- a natural next step after Scratch for students ready to build something that runs on a real phone.' },
      { id: 'middle-code-guess', title: 'Guess-the-Number Game with Hints (Python)', hook: 'A number-guessing game that gives "higher/lower" hints and counts attempts.', prompt: 'A Python guess-the-number game where the computer picks a random number and gives "too high"/"too low" hints, counting the player\'s attempts -- introducing randomness, loops, and conditionals in real code.' },
    ],
  },
  senior: {
    robotics: [
      { id: 'senior-robo-selfBalance', title: 'Self-Parking Car Logic (Simulated)', hook: 'Program the sensor logic a self-parking car would use to find and enter a gap.', prompt: 'A simulated self-parking-car logic project: using distance sensors to detect a gap of sufficient size between two "cars" and then executing a steering sequence to park into it -- a more advanced sensor-and-logic robotics challenge.' },
      { id: 'senior-robo-homeAutomation', title: 'IoT Smart Home Controller', hook: 'Control lights and a fan remotely using an ESP32 and a simple app/webpage.', prompt: 'A simulated IoT home-automation project (using Wokwi\'s ESP32 simulation) where a webpage or simple app can toggle simulated lights/a fan over WiFi, introducing Internet-of-Things concepts alongside embedded programming.' },
      { id: 'senior-robo-weatherStation', title: 'Automatic Weather Station', hook: 'Log temperature and humidity readings and trigger alerts on extreme values.', prompt: 'A simulated weather-station project that reads temperature/humidity sensor values, logs them, and triggers an alert (LED/buzzer) if a value crosses a set threshold -- combining sensing, data logging, and conditional logic.' },
      { id: 'senior-robo-maze', title: 'Maze-Solving Robot Algorithm', hook: 'Implement a real maze-solving algorithm (wall-following) for a simulated robot.', prompt: 'A maze-solving robot project (simulated) that implements the classic "wall-following" algorithm to navigate and escape a maze using side-mounted distance sensors -- an introduction to real robotics algorithms, not just reactive sensing.' },
    ],
    ai: [
      { id: 'senior-ai-sentiment', title: 'Movie Review Sentiment Analyzer', hook: 'A Python model that predicts if a review is positive or negative.', prompt: 'A beginner machine learning project in a free Google Colab notebook: train a simple sentiment classifier (using a small, freely available dataset and a basic library like scikit-learn) to predict whether a movie/product review is positive or negative, and evaluate its accuracy.' },
      { id: 'senior-ai-recommender', title: 'Simple Movie/Book Recommender', hook: 'Build a basic "if you liked X, you might like Y" recommendation system.', prompt: 'A beginner recommendation-system project in Python (free Google Colab) using a small dataset to suggest similar movies/books based on shared genres/tags -- introducing the core idea behind real-world recommendation engines (Netflix, Spotify) at an approachable level.' },
      { id: 'senior-ai-chatbot', title: 'Rule-Based vs AI Chatbot Comparison', hook: 'Build a simple rule-based chatbot, then compare it against a real language model\'s responses.', prompt: 'Build a simple rule-based chatbot in Python, then compare its responses side-by-side against a free-tier AI chatbot on the same set of questions, writing up an analysis of what genuinely "understanding" language would require versus pattern-matching.' },
      { id: 'senior-ai-vision', title: 'Real-Time Object Counter', hook: 'Use a webcam-based model to count how many of a specific object appear in view.', prompt: 'Using Google Teachable Machine or a free browser-based object-detection demo, build a real-time counter that tracks how many of a specific object (e.g. a particular colored ball) are visible via webcam at once, discussing where this kind of tech is used in industry (inventory counting, quality control).' },
    ],
    coding: [
      { id: 'senior-code-webpage', title: 'Personal Portfolio Webpage (HTML/CSS)', hook: 'Build and style a real, personal webpage from scratch.', prompt: 'A personal portfolio webpage built with plain HTML and CSS (no framework needed, free to write and preview in any browser), covering structure, styling, and basic responsive layout -- a genuinely useful first web project.' },
      { id: 'senior-code-todoApp', title: 'To-Do List Web App (JavaScript)', hook: 'A working to-do list with add/remove/complete, built with real JavaScript.', prompt: 'A to-do list web app built with HTML/CSS/vanilla JavaScript (no signup or paid tools needed) supporting adding, completing, and deleting tasks, stored in the browser -- a solid first "real" JavaScript project beyond block coding.' },
      { id: 'senior-code-dataViz', title: 'Data Visualization from a CSV', hook: 'Load a real dataset and turn it into charts using Python.', prompt: 'A Python data-visualization project in free Google Colab: load a small real-world CSV dataset (e.g. weather, cricket, or population data) and produce 2-3 meaningful charts using a free plotting library, drawing one real conclusion from the data.' },
      { id: 'senior-code-game2', title: 'Text-Based Adventure Game (Python)', hook: 'A choose-your-own-adventure game with branching story paths.', prompt: 'A text-based adventure game in Python with at least 3 branching decision points leading to different endings, using functions and dictionaries to organize the story -- a solid intermediate project in program structure.' },
    ],
  },
  plusTwo: {
    robotics: [
      { id: 'plusTwo-robo-gestureArm', title: 'Gesture-Controlled Robotic Arm', hook: 'Control a simulated robotic arm\'s movement using hand gestures via a webcam.', prompt: 'A gesture-controlled robotic arm project: use a free webcam-based hand-tracking model to control the joint angles of a simulated robotic arm, combining computer vision with servo-control logic -- an advanced, portfolio-worthy project.' },
      { id: 'plusTwo-robo-autonomousNav', title: 'Autonomous Delivery Robot Path-Planning', hook: 'Implement a real pathfinding algorithm for a simulated delivery robot navigating a grid.', prompt: 'An autonomous-navigation project: implement a real pathfinding algorithm (like breadth-first search or A*) for a simulated robot navigating a grid of "streets" to reach a delivery point while avoiding obstacles -- connects robotics to real computer science (algorithms), appropriate for Class 11-12 Computer Science students.' },
      { id: 'plusTwo-robo-iotFarm', title: 'IoT Precision-Irrigation System', hook: 'A multi-sensor system that decides when and how much to water based on real conditions.', prompt: 'A simulated IoT precision-irrigation system combining soil moisture, temperature, and a simple rain-forecast input to decide whether/how long to run a simulated pump -- a real agri-tech application combining sensors, logic, and IoT communication (Wokwi ESP32 simulation).' },
      { id: 'plusTwo-robo-voiceControl', title: 'Voice-Controlled Home Assistant Logic', hook: 'Program a simulated device to respond to a small set of spoken commands.', prompt: 'A simulated voice-controlled assistant project: use a free browser speech-recognition API to capture a small set of spoken commands (e.g. "lights on", "fan off") and map each to controlling a simulated device, introducing speech-to-text alongside embedded control logic.' },
    ],
    ai: [
      { id: 'plusTwo-ai-mlModel', title: 'Build a Real ML Model From Scratch', hook: 'Train and evaluate a genuine machine learning classifier on a real dataset, end to end.', prompt: 'A full beginner-to-intermediate machine learning pipeline in free Google Colab: load a real public dataset, clean it, train a classifier (e.g. decision tree or logistic regression via scikit-learn), evaluate its accuracy/precision, and explain the results -- a genuine, CV-worthy AI project for Class 11-12.' },
      { id: 'plusTwo-ai-nlp', title: 'Text Summarizer', hook: 'A program that condenses a long article into a few key sentences.', prompt: 'A basic extractive text-summarization tool built in free Google Colab using a simple, well-known algorithm (e.g. frequency-based sentence scoring) that reduces a long article to its 3-5 most important sentences -- an accessible real NLP (Natural Language Processing) project.' },
      { id: 'plusTwo-ai-fakeNews', title: 'Fake News / Misinformation Detector', hook: 'Train a model that flags likely-fake headlines based on linguistic patterns.', prompt: 'A machine learning project in free Google Colab using a small, freely available labeled dataset to train a classifier that predicts whether a news headline is likely real or fake, paired with a critical discussion of the model\'s real-world limits and the danger of over-trusting it -- a socially relevant, exam-portfolio-worthy AI project.' },
      { id: 'plusTwo-ai-healthPredict', title: 'Health Risk Predictor (Educational)', hook: 'A model that estimates risk category from a small set of health indicators, for learning purposes only.', prompt: 'An educational machine learning project (explicitly NOT for real medical use, clearly labeled as such) using a small public health dataset in free Google Colab to predict a general risk category from indicators like age/BMI/activity level, focused on understanding the modeling process and its ethical limits, not on giving real medical advice.' },
    ],
    coding: [
      { id: 'plusTwo-code-fullApp', title: 'Full-Stack To-Do App with a Database', hook: 'A to-do app with real user accounts and data that persists, built with free tools.', prompt: 'A full-stack web application (e.g. using free-tier tools like Python Flask + SQLite, no paid hosting required to build and run locally) with a real database storing tasks per user -- a genuinely portfolio-worthy Class 11-12 Computer Science project.' },
      { id: 'plusTwo-code-algoViz', title: 'Sorting Algorithm Visualizer', hook: 'Watch bubble sort, merge sort, and quicksort race each other, animated.', prompt: 'A sorting-algorithm visualizer (built with free tools like Python + a plotting/animation library, or plain JavaScript/HTML5 Canvas) that animates how bubble sort, merge sort, and quicksort each rearrange the same array step by step -- directly reinforces CBSE/ICSE Class 11-12 Computer Science algorithm topics.' },
      { id: 'plusTwo-code-compiler', title: 'Build a Simple Calculator Language Interpreter', hook: 'Write a program that reads and evaluates its own tiny expression language.', prompt: 'A beginner "build your own interpreter" project in Python: write a program that can parse and evaluate simple arithmetic expressions typed as text (like a calculator language), introducing the basics of how real programming languages are processed -- an advanced, genuinely impressive Class 12 project.' },
      { id: 'plusTwo-code-api', title: 'Weather Dashboard Using a Free Public API', hook: 'Fetch and display real live weather data on a custom-built webpage.', prompt: 'A weather-dashboard web app that fetches real live data from a free public weather API and displays it with simple HTML/CSS/JavaScript, introducing how real-world apps talk to external services over the internet.' },
    ],
  },
};
