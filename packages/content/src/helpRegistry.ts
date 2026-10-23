// The in-app Help content registry -- one entry per page/space in the app,
// plus a handful of concept articles with no single page of their own. This
// single array feeds three things: the "?" contextual drawer (opened with
// the ? key, or the Help button in the top bar -- shows summary, keyActions,
// tips, AND longDescription, so it's a real explanation, not just a hint),
// the /help Documentation Center (full article, same fields), and the
// downloadable PDF user guide (same data, printable layout). Edit content
// here; the UI never hardcodes copy.
//
// routes: a page can list more than one path. A route ending in '/' matches
// any path that starts with it (used for dynamic segments, e.g.
// 'worksheets/[id]'); every other route must match exactly. See
// getHelpEntryForPath below for the matching rule.

import { DocRouteEntry } from './helpTypes';

export const HELP_REGISTRY: DocRouteEntry[] = [
  // -- Getting Started (concept articles, no single page) -----------------
  {
    id: 'welcome',
    routes: [],
    category: 'getting-started',
    title: 'Welcome to EduSheets',
    summary: 'EduSheets turns your school curriculum into ready-to-use worksheets, projects, study material, and hands-on virtual labs -- built around your actual board, class, and subject.',
    keyActions: [
      'Generate a worksheet in minutes from Generate on the sidebar',
      'Explore six virtual labs (Math, Physics, Chemistry, Biology, Electronics, Tech) for hands-on, real-result simulations',
      'Keep everything you create in My Library (Worksheets, Activity Sheets, Study Material, Projects)',
      'Press ? anywhere, or click the ? icon in the top bar, for help on the page you\'re on',
    ],
    tips: [
      'Every page in the app has its own instant help -- you never have to guess what a button does.',
    ],
    longDescription: [
      'The tool has two halves that work together. One half is a generator: you tell it your board, class, subject, and (usually) a chapter, and it produces printable/downloadable material -- worksheets with an answer key, school projects with a bibliography, study material with separate teacher and student sections, or a short hands-on activity sheet. The other half is a set of virtual labs where you don\'t read about a concept, you run it: wire an actual circuit, titrate an actual reagent, plot an actual function, and see a genuinely calculated result rather than a canned animation or a pre-written "correct answer".',
      'Everything is scoped to what you actually study. Setting your board and class once on your Profile page means every generator and every lab pre-fills correctly from then on, and every chapter/topic you pick anywhere in the app comes from the same curriculum tree an administrator maintains -- so a worksheet you generate and an experiment you run in a lab are both grounded in the same syllabus, not two different guesses at what "Class 8 Science" might mean.',
      'If you\'re not sure what a page does, you don\'t have to leave it to find out -- press the ? key (or click the ? icon in the top bar) and a panel opens with an explanation of exactly the page you\'re looking at, plus a link to an even fuller article here in the Documentation Center if you want more detail.',
    ],
  },
  {
    id: 'curriculum-boards',
    routes: [],
    category: 'getting-started',
    title: 'Understanding Boards, Classes, and Curriculum',
    summary: 'Nearly every generator and lab starts by asking for a board, class, and subject/chapter -- this is how the app matches content to what you actually study, rather than generic material.',
    keyActions: [
      'Pick your board (e.g. CBSE, ICSE) once in your Profile so it pre-fills everywhere',
      'Choose a class and subject before generating a worksheet, project, or lab experiment',
      'Drill into a chapter or topic for more targeted content where the generator offers it',
      'Expect the same curriculum tree to show up consistently across every tool in the app',
    ],
    tips: [
      'If a subject or chapter looks missing, an administrator manages the curriculum tree under Admin > Curriculum and may need to add it.',
    ],
    longDescription: [
      'Behind the scenes, the curriculum is organized as a tree: a board contains classes, a class contains subjects, a subject contains chapters, and a chapter can contain individual topics. Every generator (worksheets, projects, study material, activity sheets) and every guided lab experiment asks you to walk down that same tree before it produces anything, which is what keeps a worksheet, a lab report, and a project all speaking the same curriculum language instead of drifting apart.',
      'You don\'t have to re-enter this every time. Your default board and grade live on your Profile page and pre-fill the picker wherever you go, so day-to-day you\'re usually just confirming a subject and chapter rather than starting from scratch. You can always override the default for a one-off worksheet without changing your saved profile.',
      'The tree itself is curated centrally by administrators (see Admin: Curriculum Manager), including a verification step so chapters and topics have actually been reviewed rather than added speculatively. If something you need genuinely isn\'t there yet, that\'s the right place to flag it -- it isn\'t something an individual worksheet or lab page can add on its own.',
    ],
  },
  {
    id: 'roles-permissions',
    routes: [],
    category: 'getting-started',
    title: 'Roles: Student, Teacher, Parent, and Admin',
    summary: 'What you can see and do depends on your account role, set on your Profile or by an administrator -- this is why the sidebar can look different for different people.',
    keyActions: [
      'Students: generate worksheets and use every virtual lab',
      'Teachers and Parents: also get Activity Sheets and Study Material, for setting work or supporting learning at home',
      'Admins: get the Admin section -- curriculum, content, navigation menu, and site settings',
      'Check your Profile page to see (and, where allowed, change) your current role',
    ],
    tips: [
      'If a sidebar item like Study Material or Admin is missing for you, that\'s expected -- it\'s gated by role, not a bug.',
    ],
    longDescription: [
      'Every account has exactly one role, and that role is the single source of truth for what you can reach -- not just what\'s shown in the sidebar, but what the server itself will let you do. A student account, for example, can generate worksheets and use every lab, but Activity Sheets and Study Material are deliberately adult-facilitated tools (Activity Sheets in particular assume a grown-up is running the activity), so they\'re only available to teacher and parent accounts.',
      'Admin is a separate tier again: it unlocks a whole extra section of the app (user management, the curriculum tree, site-wide content, navigation, and branding/settings) that has nothing to do with generating a worksheet at all. Most users will never see it, which is intentional -- it\'s infrastructure for whoever runs the deployment, not a feature every learner needs.',
      'If your role ever looks wrong (say, a teacher account that can\'t see Study Material), the fix is on your Profile page or through whoever administers your school\'s account -- it\'s not something a lab or generator page itself can grant.',
    ],
  },
  {
    id: 'interface-tour',
    routes: [],
    category: 'getting-started',
    title: 'Finding Your Way Around the App',
    summary: 'The sidebar (left) holds every section you have access to; the top bar (right) holds search, help, dark mode, notifications, and your profile.',
    keyActions: [
      'Use the sidebar to jump between My Library, Virtual Labs, Favorites, and your Profile',
      'Press ? anywhere, or click the ? icon in the top bar, for help on your current page',
      'Toggle dark mode with the sun/moon icon in the top bar',
      'On mobile, tap the menu icon to open the same navigation as a slide-out drawer',
    ],
    tips: [
      'The sidebar is centrally managed, so its exact items can change over time -- if something moves, help on the new page will explain it.',
    ],
    longDescription: [
      'The layout is the same shape on every dashboard page: a sidebar on the left for moving between sections, a top bar that stays put as you scroll, and the page content itself in the middle. That consistency is deliberate -- once you know where the search box, the help button, and your profile menu live, they\'re in the same place no matter which lab or generator you\'re in.',
      'The top bar carries five things: a search box, the ? help button, a dark/light mode toggle, a notifications bell, and your profile menu (which also holds a direct link into this Documentation Center). On a phone or narrow window, the sidebar collapses into a menu icon that opens the same navigation as a slide-out drawer instead of a fixed column, so nothing in it is actually missing on mobile -- just reachable a different way.',
      'The sidebar\'s exact contents are centrally managed (an administrator can add, remove, or reorder items under Admin > Navigation Menu), so it can genuinely change over time as the app grows. That\'s also why context-sensitive help matters: instead of memorizing a fixed map of the app, you can always press ? on whatever page you\'ve landed on and get an explanation of it specifically.',
    ],
  },
  {
    id: 'help-center',
    routes: ['/help'],
    category: 'getting-started',
    title: 'Using Help & Documentation',
    summary: 'This Documentation Center is the full, searchable version of the same help you get from pressing ? on any page -- the place to come for a deeper explanation than the quick drawer gives.',
    keyActions: [
      'Search articles by title or keyword using the search box',
      'Browse by category: Getting Started, Virtual Labs, My Library, Admin Tools, Account',
      'Open any article for the full write-up, or press ? on the actual page for a quick, page-specific summary',
      'Download the complete guide as a single PDF',
    ],
    longDescription: [
      'There is only one source of help content in the app -- this registry -- and it\'s rendered three different ways. Press ? on any page and you get a compact drawer scoped to that exact page. Come here to /help and you get the same content laid out as a full, browsable, searchable library. Click "Download full guide (PDF)" (here, or from the drawer) and you get every article bundled into one printable document, organized the same way as this page.',
      'Because it\'s one content source, an article can never say something in the drawer that contradicts what it says here -- there\'s nothing to keep in sync, since both are reading the exact same entry. If you improve your understanding of a page from the drawer and want more, the "View full article" link inside the drawer takes you straight to that same article\'s full page here, with its related-articles list for whatever else is nearby in the same category.',
    ],
  },

  // -- Account & Dashboard --------------------------------------------------
  {
    id: 'dashboard',
    routes: ['/dashboard'],
    category: 'account',
    title: 'Dashboard',
    summary: 'Your home page -- a quick view of the worksheets you\'ve generated most recently, with one-click favorite, download, and preview, so you don\'t have to dig through the full Worksheets list for something you just made.',
    keyActions: [
      'Open, preview, or download any recent worksheet directly from the list',
      'Star a worksheet to add it to Favorites',
      'Jump to Generate to create something new',
    ],
    longDescription: [
      'Dashboard is intentionally narrow in scope: it\'s a fast-access strip of whatever you\'ve generated most recently, not a full management view. For the complete searchable list of everything you\'ve ever generated -- with regenerate, answer-key download, and more -- go to Worksheets in the sidebar instead; Dashboard is the "I made this five minutes ago and want it again" page.',
      'Starring a worksheet here does the same thing as starring it anywhere else in the app -- it adds it to Favorites, which is its own dedicated page for the things you want to keep coming back to regardless of how recently you made them.',
    ],
  },
  {
    id: 'generate',
    routes: ['/generate'],
    category: 'account',
    title: 'Generate a Worksheet',
    summary: 'The main worksheet wizard: pick your curriculum, choose question types, then generate a downloadable worksheet with its own answer key.',
    keyActions: [
      'Select board, class, subject, and chapter/topic',
      'Choose question types (MCQ, fill-in-the-blank, short/long answer, diagrams, and more) and how many of each you want',
      'Generate, preview the result, then download as PDF or favorite it for later',
    ],
    tips: [
      'You can regenerate with different question types without losing your curriculum selection.',
    ],
    longDescription: [
      'This is the tool most people use most often, and it\'s deliberately a straight line: curriculum first, question mix second, generate third. Every worksheet comes with a matching answer key generated alongside it, and both are downloadable as separate PDFs so you can hand one to a student and keep the other for yourself.',
      'Question type support is broad on purpose -- multiple choice, fill-in-the-blank, true/false, matching, short and long answer, word problems, logical reasoning, and even diagram-based, coloring, and tracing questions for younger learners. Not every type makes sense for every subject or class, so the picker only offers what\'s actually sensible for your current curriculum selection.',
      'Once a worksheet exists, it lives in Worksheets (and Dashboard, if it\'s recent) where you can revisit, re-download, or regenerate it later -- Generate itself doesn\'t keep any history of its own; it\'s the creation step, not the library.',
    ],
  },
  {
    id: 'profile',
    routes: ['/profile'],
    category: 'account',
    title: 'Profile & Settings',
    summary: 'Your personal settings: name, default board/class, reading font, an optional AI provider key, and sign-out.',
    keyActions: [
      'Set your default board and grade so generators and labs pre-fill correctly',
      'Choose a reading font for generated documents',
      'Add your own AI provider key if you want to use your own quota instead of the shared default',
      'Sign out from here',
    ],
    longDescription: [
      'Your default board and grade here are what every generator and lab picker starts from -- change it once and it follows you everywhere, rather than having to reselect your class on every single page. This is also where your account role lives (see "Roles: Student, Teacher, Parent, and Admin"), which controls what parts of the app are visible to you at all.',
      'The optional AI provider key is for anyone who wants generation to run against their own account and quota rather than the app\'s shared default -- entirely optional, and only relevant if you already have your own key from an AI provider.',
    ],
  },

  // -- Virtual Labs -----------------------------------------------------
  {
    id: 'electronics-lab',
    routes: ['/electronics-lab'],
    category: 'labs',
    title: 'Electronics Lab',
    summary: 'A real DC circuit simulator: pick components from the Cupboard, wire them on a breadboard, and see genuinely calculated results -- voltages, currents, LED brightness, 555-timer blink rates -- not canned animations.',
    keyActions: [
      'Browse Projects for a guided build (grade-banded, curriculum-tagged) with step-by-step instructions',
      'Open the Cupboard to pick up individual components and place them freely in Free Play',
      'Wire components together on the breadboard, then check your circuit for real electrical validity',
      'Use the oscilloscope to see a live, explained voltage trace for timer/oscillator circuits',
    ],
    tips: [
      'When you pick up a part from the Cupboard, watch for the "Now Placing" banner -- it tells you exactly what\'s in your hand and where it can legally go.',
      'The oscilloscope only shows a trace once your circuit is electrically complete -- it explains in plain language what you\'re looking at.',
    ],
    longDescription: [
      'This lab genuinely evaluates the circuit you build, rather than playing a fixed animation once you\'ve roughly assembled something. Under the hood, an electrical engine walks the connections you\'ve actually wired and applies real circuit laws -- Ohm\'s Law for resistors, real component thresholds for LEDs and diodes, and real RC/555-timer timing formulas for anything involving a capacitor or a 555 chip. If your wiring is wrong, the circuit simply doesn\'t work correctly, the same as it wouldn\'t on a real breadboard.',
      'Guided Projects give you a specific goal (grade-banded and tagged to real curriculum chapters where applicable) with step-by-step build instructions and a reference circuit to check yourself against. Free Play removes that structure entirely -- you open the Cupboard, pick up any component, and place it wherever you like on the breadboard, useful for exploring rather than following a script.',
      'One honesty note worth knowing: this lab intentionally does not simulate real analog/RF signal reception (an actual radio broadcast, for instance) -- any project whose real-world version would need that plays a clearly-labeled simulated output once the circuit is wired correctly, because a browser genuinely cannot receive real radio waves. Everything electrical about the circuit itself, though, is calculated for real from your actual wiring, not faked.',
    ],
  },
  {
    id: 'chem-lab',
    routes: ['/chem-lab'],
    category: 'labs',
    title: 'Chemistry Lab',
    summary: 'The Chemistry Lab hub -- your past experiment attempts, plus quick links into every chemistry tool: guided experiments, physical chemistry calculators, concepts, the periodic table, charts, equipment, reagents, free-mix, aromatic, and atomic chemistry.',
    keyActions: [
      'Start a guided New Experiment for a curriculum-matched, step-by-step lab',
      'Review your past attempts and re-download their result PDFs',
      'Jump into any specialized tool (Periodic Table, Free-Mix, Equipment, Reagents, etc.) from the quick links',
    ],
    longDescription: [
      'Chemistry Lab is the widest of the six labs -- rather than one single tool, it\'s a hub in front of ten distinct sub-tools, each with its own dedicated help article (see "Related articles" below, or the Virtual Labs category on the Documentation Center home). This hub page is where you land first, review anything you\'ve already attempted, and decide which specific tool to open next.',
      'If you\'re not sure where to start, New Experiment is the safest first stop -- it\'s a guided, curriculum-matched flow with a defined beginning and end, versus the more open-ended sandboxes like Free-Mix or the reference tools like the Periodic Table and Charts.',
    ],
  },
  {
    id: 'chem-lab-new',
    routes: ['/chem-lab/new'],
    category: 'labs',
    title: 'Chemistry: New Guided Experiment',
    summary: 'A predict-simulate-observe-explain flow for a curriculum-matched chemistry experiment, ending in a submitted attempt and a downloadable PDF report.',
    keyActions: [
      'Choose a chapter-matched experiment',
      'Make a prediction before you run it',
      'Run the simulation on the lab bench and observe the real result',
      'Submit your explanation to complete the attempt and generate a PDF',
    ],
    longDescription: [
      'Every guided experiment across every lab (not just Chemistry) follows the same four-step shape on purpose: predict what you think will happen before you see the answer, run the simulation and actually observe what happens, then explain the result in your own words. That predict-before-you-see-it step is what turns a simulation into a genuine experiment rather than a demonstration -- it\'s the same reason a real science class asks you to hypothesize before running the reaction.',
      'Once you submit your explanation, the attempt is complete and a PDF report is generated summarizing your prediction, what you actually observed, and your explanation -- useful as a record for yourself or to hand in. Completed attempts are listed back on the Chemistry Lab hub page so you can revisit or re-download them later.',
    ],
  },
  {
    id: 'chem-lab-physical',
    routes: ['/chem-lab/physical'],
    category: 'labs',
    title: 'Chemistry: Physical Chemistry Calculators',
    summary: 'Interactive calculators for moles, gas laws, pH, reaction kinetics, and electrochemistry -- enter values and get real, worked-out results.',
    keyActions: [
      'Pick a calculator (moles, gas laws, pH, kinetics, electrochemistry)',
      'Enter your known values',
      'See the calculated result along with the formula used',
    ],
    longDescription: [
      'Unlike the guided experiments, these are direct-manipulation tools -- there\'s no predict/observe flow, just a real calculator per topic that shows you both the numeric result and the formula it used to get there, so you can check your own by-hand working against it. Useful on its own, or as a companion while working through a physical chemistry chapter\'s numerical problems.',
    ],
  },
  {
    id: 'chem-lab-concepts',
    routes: ['/chem-lab/concepts'],
    category: 'labs',
    title: 'Chemistry: Concepts Corner',
    summary: 'Short, curriculum-aligned knowledge cards covering core chemistry concepts -- a quick-reference companion to the hands-on tools.',
    keyActions: [
      'Browse concept cards by topic',
      'Use these alongside a guided experiment for background theory',
    ],
    longDescription: [
      'Concepts Corner is reference material, not a simulation -- short, focused cards explaining an idea rather than letting you manipulate it. It\'s meant to sit alongside the hands-on tools: read the relevant card here before or after running a related guided experiment or using the Free-Mix sandbox, rather than as a standalone course.',
    ],
  },
  {
    id: 'chem-lab-periodic-table',
    routes: ['/chem-lab/periodic-table'],
    category: 'labs',
    title: 'Chemistry: Interactive Periodic Table',
    summary: 'A full interactive periodic table -- click any element for its real properties in a 3D-assisted view.',
    keyActions: [
      'Click an element to see its properties (atomic number, mass, category, etc.)',
      'Filter or scan by element category',
    ],
    longDescription: [
      'This is a reference tool you\'ll likely open repeatedly rather than work through once -- keep it open in another tab while doing Atomic Chemistry, Physical Chemistry calculations, or any guided experiment that references specific elements, since it\'s faster to look an element up here than to recall its properties from memory.',
    ],
  },
  {
    id: 'chem-lab-charts',
    routes: ['/chem-lab/charts'],
    category: 'labs',
    title: 'Chemistry: Reference Charts',
    summary: 'A quick-lookup library of standard chemistry reference charts.',
    keyActions: [
      'Browse available charts',
      'Use alongside calculators or guided experiments as a reference',
    ],
    longDescription: [
      'A plain reference library -- no interaction beyond browsing and reading. Useful the same way a printed chart on a classroom wall is: something to check against while you\'re working through a problem elsewhere in the app, rather than a tool with its own workflow.',
    ],
  },
  {
    id: 'chem-lab-equipment',
    routes: ['/chem-lab/equipment'],
    category: 'labs',
    title: 'Chemistry: Equipment Studio',
    summary: 'A catalog of real lab equipment -- click any item to open a detailed 3D view and learn what it\'s for.',
    keyActions: [
      'Browse the equipment catalog',
      'Click an item to open its 3D view and description',
    ],
    longDescription: [
      'Meant for familiarizing yourself with real lab apparatus you may not have hands-on access to -- each item\'s 3D view and description covers what it looks like and what it\'s actually used for, useful preparation before a real physical lab session, or as a reference while reading a procedure that names equipment by term.',
    ],
  },
  {
    id: 'chem-lab-reagents',
    routes: ['/chem-lab/reagents'],
    category: 'labs',
    title: 'Chemistry: Reagents Studio',
    summary: 'A catalog of common reagents with real properties, shown with 3D bottle visuals.',
    keyActions: [
      'Browse reagents',
      'Click one for its real chemical properties and safe-handling notes',
    ],
    longDescription: [
      'Same purpose as Equipment Studio but for the chemicals themselves -- a browsable reference of common reagents with their real properties and safe-handling notes, useful before running Free-Mix or a guided experiment that uses them, or just to build familiarity with what a given reagent actually is.',
    ],
  },
  {
    id: 'chem-lab-free-mix',
    routes: ['/chem-lab/free-mix'],
    category: 'labs',
    title: 'Chemistry: Free-Mix Sandbox',
    summary: 'Free Play for chemistry -- pick any two chemicals and see a real reaction play out in a 3D scene, with no fixed script to follow.',
    keyActions: [
      'Choose two chemicals to combine',
      'Watch the reaction and read the real result explanation',
      'Try different combinations to explore reaction types',
    ],
    tips: [
      'Not every combination reacts -- that\'s expected and accurate, not a bug.',
    ],
    longDescription: [
      'This is the open-ended counterpart to the guided New Experiment flow: no prediction step, no fixed goal, just pick two chemicals and see what genuinely happens when you combine them. Because the outcome is calculated rather than scripted per-pair, some combinations you try simply won\'t react -- that\'s an accurate result, the same as it would be with real reagents, not a missing feature.',
      'A good way to use it: once you\'ve learned a reaction type in a guided experiment or Concepts Corner, come here and try variations on it -- different reagent pairs in the same family -- to build intuition for the pattern rather than just the one example you were shown.',
    ],
  },
  {
    id: 'chem-lab-aromatic',
    routes: ['/chem-lab/aromatic'],
    category: 'labs',
    title: 'Chemistry: Aromatic Chemistry',
    summary: 'A 3D builder for benzene and its derivatives -- explore aromatic ring structures and substituent effects.',
    keyActions: [
      'Build and rotate aromatic structures in 3D',
      'Explore common benzene derivatives',
    ],
    longDescription: [
      'Organic ring structures are genuinely hard to reason about from a flat textbook diagram -- this tool exists specifically so you can rotate a benzene ring and its derivatives in 3D and see substituent positions the way a real molecule actually occupies space, rather than the simplified hexagon-with-lines convention.',
    ],
  },
  {
    id: 'chem-lab-atomic',
    routes: ['/chem-lab/atomic'],
    category: 'labs',
    title: 'Chemistry: Atomic Structure & Bonding',
    summary: 'Explore atomic models, subatomic particles, and how ionic and covalent bonds actually form.',
    keyActions: [
      'View atomic models for different elements',
      'Step through ionic and covalent bonding examples',
    ],
    longDescription: [
      'Bonding is usually taught as a static diagram of electrons being "given" or "shared" -- this tool lets you step through that process instead of just looking at the end state, which is where the Periodic Table (for an element\'s properties) and this tool (for how those properties translate into bonding behavior) are meant to be used together.',
    ],
  },
  {
    id: 'physics-lab',
    routes: ['/physics-lab'],
    category: 'labs',
    title: 'Physics Lab',
    summary: 'The Physics Lab hub -- your past experiment attempts, plus quick links to start a new guided experiment or open the free-play Playground.',
    keyActions: [
      'Start a guided New Experiment matched to your curriculum',
      'Open Playground for open-ended, real-physics simulations',
      'Review and re-download past attempts',
    ],
    longDescription: [
      'Physics Lab follows the same guided-vs-free-play split as Chemistry and Biology: New Experiment gives you a specific, curriculum-matched goal with a predict/observe/explain structure and a PDF report at the end, while Playground removes the goal entirely and lets you adjust real physical parameters (mass, angle, initial velocity, and so on) and watch the actual physics play out.',
    ],
  },
  {
    id: 'physics-lab-new',
    routes: ['/physics-lab/new'],
    category: 'labs',
    title: 'Physics: New Guided Experiment',
    summary: 'A predict-simulate-observe-explain flow for a curriculum-matched physics experiment, ending in a submitted attempt and a downloadable PDF.',
    keyActions: [
      'Choose a chapter-matched experiment',
      'Predict the outcome, then run the real simulation',
      'Submit your explanation to complete the attempt',
    ],
    longDescription: [
      'Same predict-simulate-observe-explain shape used across every lab in the app (see Chemistry\'s New Guided Experiment article for the full reasoning behind that structure): commit to a prediction first, then run the real simulation and see whether your intuition matched what actually happened, then explain the result in your own words to complete the attempt and generate your PDF report.',
    ],
  },
  {
    id: 'physics-lab-playground',
    routes: ['/physics-lab/playground'],
    category: 'labs',
    title: 'Physics: Free Play Playground',
    summary: 'Open-ended physics simulations (pendulum, spring, projectile motion, and more) with real, adjustable parameters and real calculated results.',
    keyActions: [
      'Pick a simulation type',
      'Adjust parameters (e.g. mass, angle, initial velocity) and watch real physics play out',
      'Reset and try different values to build intuition',
    ],
    longDescription: [
      'There\'s no prediction step or completion state here -- Playground is for exploration. Pick a simulation type, drag a parameter, and watch how the real result changes; reset and try an extreme value to see where the behavior breaks down or changes character. It\'s the tool to reach for after a guided experiment has taught you the core idea and you want to build a feel for how the variables actually interact.',
    ],
  },
  {
    id: 'biology-lab',
    routes: ['/biology-lab'],
    category: 'labs',
    title: 'Biology Lab',
    summary: 'The Biology Lab hub -- your past experiment attempts, plus quick links to a new guided experiment, the Anatomy Explorer, and the free-play Playground.',
    keyActions: [
      'Start a guided New Experiment matched to your curriculum',
      'Explore the interactive Anatomy Explorer',
      'Open Playground for free-form biology experiments',
    ],
    longDescription: [
      'Biology Lab has a third tool the other labs don\'t: Anatomy Explorer, a dedicated structural-exploration space rather than an experiment or sandbox, since a lot of biology curriculum is about labeled structure (organ systems, cell parts) rather than a process you\'d simulate. New Experiment and Playground otherwise follow the same guided-vs-open-ended split used across every other lab.',
    ],
  },
  {
    id: 'biology-lab-anatomy',
    routes: ['/biology-lab/anatomy'],
    category: 'labs',
    title: 'Biology: Anatomy Explorer',
    summary: 'An interactive anatomy model explorer -- click through systems and structures for real, labeled detail.',
    keyActions: [
      'Choose a body system or model to explore',
      'Click structures for labels and detail',
    ],
    longDescription: [
      'A structural reference rather than an experiment -- click through a system to see its real parts labeled, useful the same way a labeled diagram in a textbook is, but explorable in more depth than a flat page allows. Good preparation before or reinforcement after a related guided experiment.',
    ],
  },
  {
    id: 'biology-lab-new',
    routes: ['/biology-lab/new'],
    category: 'labs',
    title: 'Biology: New Guided Experiment',
    summary: 'A predict-simulate-observe-explain flow for a curriculum-matched biology experiment, ending in a submitted attempt and a downloadable PDF.',
    keyActions: [
      'Choose a chapter-matched experiment',
      'Predict the outcome, then run the real simulation',
      'Submit your explanation to complete the attempt',
    ],
    longDescription: [
      'Same predict-simulate-observe-explain structure used across every lab -- see Chemistry\'s New Guided Experiment article for the reasoning. Complete the attempt by submitting your own explanation of the result, which generates a downloadable PDF report of the whole attempt.',
    ],
  },
  {
    id: 'biology-lab-playground',
    routes: ['/biology-lab/playground'],
    category: 'labs',
    title: 'Biology: Free Play Playground',
    summary: 'A curated set of biology experiments you can explore freely, with no fixed script to follow.',
    keyActions: [
      'Pick an experiment to explore',
      'Change inputs and observe real, calculated outcomes',
    ],
    longDescription: [
      'The open-ended counterpart to New Experiment -- no prediction step, no completion state, just a curated set of experiments you can revisit and vary at will to build intuition, rather than a single scripted run with one correct explanation to submit.',
    ],
  },
  {
    id: 'math-lab',
    routes: ['/math-lab'],
    category: 'labs',
    title: 'Math Lab',
    summary: 'A large hub of hands-on math tools: games, guided experiments, theorems, formulas, geometry, Vedic Math, the history of mathematics, and a function grapher.',
    keyActions: [
      'Start a guided New Experiment for a curriculum-matched topic',
      'Browse Theorems and Formulas for quick reference with worked examples',
      'Use the Grapher to plot and explore functions',
      'Try Vedic Math sutras or explore the Ancient Math History timeline',
      'Play math Games to practice concepts',
    ],
    longDescription: [
      'Math Lab is the broadest hub in the app -- rather than a small number of distinct tools, it groups together several genuinely different kinds of math resource in one place: a guided New Experiment flow (same predict/observe/explain structure as the other labs), quick-reference Theorems and Formulas with worked examples, an interactive function Grapher, practice Games, and two more unusual sections -- Vedic Math (a set of classical calculation techniques/sutras) and Ancient Math History (a timeline of how key ideas developed).',
      'Because it covers so much ground, it\'s worth thinking of Math Lab less as one tool and more as a small library within the app -- go to New Experiment when you want the structured predict/observe flow, Theorems/Formulas when you just need a reference while doing homework, the Grapher when you want to visualize a function, and Vedic Math or Ancient Math History when you\'re exploring rather than working a specific problem.',
    ],
  },
  {
    id: 'math-lab-new',
    routes: ['/math-lab/new'],
    category: 'labs',
    title: 'Math: New Guided Experiment',
    summary: 'A predict-simulate-observe-explain flow for a curriculum-matched math experiment, ending in a submitted attempt and a downloadable PDF.',
    keyActions: [
      'Choose a chapter-matched experiment',
      'Predict the outcome, then run the real simulation',
      'Submit your explanation to complete the attempt',
    ],
    longDescription: [
      'Same predict-simulate-observe-explain structure used across every lab in the app. In math specifically this usually means predicting a numeric or geometric result before an interactive figure reveals it, then explaining the reasoning behind what you actually got -- closer to a guided proof-by-exploration than a worksheet problem.',
    ],
  },
  {
    id: 'tech-lab',
    routes: ['/tech-lab'],
    category: 'labs',
    title: 'Tech Lab',
    summary: 'The Tech Lab hub -- your generated tech projects across Robotics, AI, and Coding, plus quick links into each specialized lab.',
    keyActions: [
      'Browse your generated tech projects, grouped by category',
      'Download or regenerate a project\'s PDF',
      'Open Robotics, AI, or Coding for that area\'s knowledge base and hands-on tools',
      'Generate a new tech project',
    ],
    longDescription: [
      'Tech Lab is structured differently from the other five labs: instead of predict/observe experiments, its three sub-areas (Robotics, AI, Coding) each pair a Knowledge Base (concept cards) with a Hands-On section (interactive tools specific to that area -- see each sub-area\'s own article). This hub page is where generated tech projects live and where you jump into whichever sub-area you want.',
    ],
  },
  {
    id: 'tech-lab-ai',
    routes: ['/tech-lab/ai'],
    category: 'labs',
    title: 'Tech Lab: AI',
    summary: 'AI fundamentals and machine learning knowledge cards, plus hands-on AI experiments, in one tabbed space.',
    keyActions: [
      'Read the Knowledge Base tab for AI/ML foundations',
      'Switch to Hands-On for interactive AI experiments',
    ],
    longDescription: [
      'The Knowledge Base tab covers AI and machine learning foundations as reference cards; Hands-On is where you actually interact with a working example -- for instance, adjusting a real decision threshold on a trained classifier and watching metrics like precision, recall, and F1 score recompute live from the real predictions that threshold produces, rather than reading about what those metrics mean in the abstract.',
    ],
  },
  {
    id: 'tech-lab-coding',
    routes: ['/tech-lab/coding'],
    category: 'labs',
    title: 'Tech Lab: Coding',
    summary: 'Coding concept knowledge cards plus hands-on tools -- a block-based editor, a sorting-algorithm race, and a recursion visualizer.',
    keyActions: [
      'Read the Knowledge Base tab for core coding concepts',
      'Switch to Hands-On to build with blocks, race sorting algorithms, or visualize recursion',
    ],
    longDescription: [
      'Hands-On here is three distinct tools in one tab: a block-based editor for building simple programs visually, a sorting-algorithm race that runs different algorithms side by side so you can see their real relative speed rather than just their theoretical complexity, and a recursion visualizer that steps through a recursive call so the "function calling itself" idea becomes something you watch happen rather than something you have to imagine.',
    ],
  },
  {
    id: 'tech-lab-robotics',
    routes: ['/tech-lab/robotics'],
    category: 'labs',
    title: 'Tech Lab: Robotics',
    summary: 'Robotics fundamentals and real-world applications, plus hands-on robotics experiments, in one tabbed space.',
    keyActions: [
      'Read the Knowledge Base tab for robotics fundamentals and applications',
      'Switch to Hands-On for interactive robotics experiments',
    ],
    longDescription: [
      'Same Knowledge Base + Hands-On split as AI and Coding: reference material on one tab, interactive experiments on the other. Good pattern for using it: read the relevant Knowledge Base card first if a concept is new to you, then switch to Hands-On to interact with it directly.',
    ],
  },
  {
    id: 'tech-lab-new',
    routes: ['/tech-lab/new'],
    category: 'labs',
    title: 'Tech Lab: Generate a New Project',
    summary: 'A wizard to generate a new tech project in Robotics, AI, or Coding, matched to your curriculum.',
    keyActions: [
      'Choose a category: Robotics, AI, or Coding',
      'Select your curriculum details',
      'Generate the project and download its PDF',
    ],
    tips: [
      'Tech projects are deliberately not tied to a specific curriculum chapter the way other generators are -- they\'re organized by category (Robotics/AI/Coding) instead.',
    ],
    longDescription: [
      'This is the generator step for Tech Lab, distinct from the Knowledge Base/Hands-On tools inside Robotics, AI, and Coding -- it produces a downloadable project (with a step-by-step build, and where relevant a code snippet, simulation guidance, and troubleshooting section) rather than an in-browser interactive experience. Finished projects show up back on the Tech Lab hub page, grouped by category, where you can revisit or regenerate them.',
    ],
  },

  // -- My Library -----------------------------------------------------------
  {
    id: 'worksheets',
    routes: ['/worksheets'],
    category: 'library',
    title: 'Worksheets',
    summary: 'Every worksheet you\'ve generated, in one searchable, manageable list.',
    keyActions: [
      'Search or filter your worksheets',
      'Download a worksheet\'s PDF or its answer key',
      'Regenerate a worksheet if you want a fresh variant',
      'Open Custom to build a worksheet manually, section by section',
    ],
    longDescription: [
      'This is the full library view Dashboard only shows a small slice of -- everything you\'ve ever generated through Generate or built manually through Custom lives here, searchable rather than limited to the most recent handful. Each worksheet\'s PDF and answer key download separately, and regenerating produces a fresh variant on the same curriculum selection without losing your original.',
    ],
  },
  {
    id: 'worksheets-custom',
    routes: ['/worksheets/custom'],
    category: 'library',
    title: 'Custom Worksheet Builder',
    summary: 'Build a worksheet by hand -- add your own sections and choose exactly which question types go in each.',
    keyActions: [
      'Add one or more sections',
      'Choose question types and counts per section',
      'Generate the finished, downloadable worksheet',
    ],
    longDescription: [
      'Where Generate makes a curriculum-driven decision about question mix for you, Custom hands that control to you directly -- you decide the sections and exactly how many of each question type go into each one. Useful when you have a specific structure in mind (say, a fixed number of MCQs followed by two long-answer questions) rather than a general topic to cover.',
    ],
  },
  {
    id: 'worksheet-detail',
    routes: ['/worksheets/'],
    category: 'library',
    title: 'Worksheet Detail',
    summary: 'The detail view for a single worksheet.',
    keyActions: [
      'Review the worksheet\'s details',
      'Download its PDF from the Worksheets list if the button here isn\'t active yet',
    ],
    longDescription: [
      'Opened by clicking into an individual worksheet from the Worksheets list or Dashboard. If a download option here doesn\'t respond, the same PDF and answer key are always reachable from the main Worksheets list as a fallback.',
    ],
  },
  {
    id: 'activity-sheet',
    routes: ['/activity-sheet'],
    category: 'library',
    title: 'Activity Sheets',
    summary: 'Activity sheets you\'ve generated for classroom or at-home use -- available to teacher and parent accounts.',
    keyActions: [
      'Browse and manage your generated activity sheets',
      'Download as PDF, or export as Markdown',
      'Regenerate a sheet for a fresh variant',
      'Create a new one from Activity Sheet > New',
    ],
    longDescription: [
      'Activity Sheets are shorter and more hands-on than a worksheet -- structured as "what you\'ll need", numbered steps, reflection questions, and a facilitation-notes box specifically for the adult running the activity, which is why generating one is restricted to teacher and parent accounts rather than open to students directly. The Markdown export exists alongside the PDF for anyone who wants to paste the content into another document rather than print it as-is.',
    ],
  },
  {
    id: 'activity-sheet-new',
    routes: ['/activity-sheet/new'],
    category: 'library',
    title: 'New Activity Sheet',
    summary: 'A wizard to generate a new activity sheet from your curriculum.',
    keyActions: [
      'Pick board, class, subject, and chapter',
      'Generate the sheet',
      'Download it as PDF or Markdown',
    ],
    longDescription: [
      'Same curriculum-first pattern as every other generator in the app -- board, class, subject, chapter, then generate. What comes out is specifically an activity structure (materials, steps, reflection questions, facilitation notes), not a worksheet with questions and an answer key.',
    ],
  },
  {
    id: 'study-material',
    routes: ['/study-material'],
    category: 'library',
    title: 'Study Material',
    summary: 'Generated study material and lesson plans -- available to teacher and parent accounts.',
    keyActions: [
      'Browse and manage your generated study material',
      'Download or regenerate any item',
      'Create new material from Study Material > New',
    ],
    longDescription: [
      'Each piece of study material is generated as one combined document with two audiences built in -- sections clearly marked "for teachers/parents" (lesson-plan style, step-by-step facilitation guidance) alongside sections marked "for students" (the actual explanatory content), so a single PDF serves both the person teaching and the person learning rather than requiring two separate generations.',
    ],
  },
  {
    id: 'study-material-new',
    routes: ['/study-material/new'],
    category: 'library',
    title: 'New Study Material',
    summary: 'A wizard to generate new study material or a lesson plan from your curriculum.',
    keyActions: [
      'Pick board, class, subject, and chapter',
      'Generate the material and download it',
    ],
    longDescription: [
      'Same curriculum-first generation pattern as everywhere else in My Library. The result combines teacher-facing lesson-plan content and student-facing explanatory content in one document, as described in the Study Material article.',
    ],
  },
  {
    id: 'projects',
    routes: ['/projects'],
    category: 'library',
    title: 'School Projects',
    summary: 'Every school project you\'ve generated, in one manageable list.',
    keyActions: [
      'Browse and manage your generated projects',
      'Download or regenerate a project\'s PDF',
      'Generate a new one from Projects > New, or build a custom-length one from Projects > Custom',
    ],
    longDescription: [
      'A school project here comes out as a structured document -- multiple headed sections plus, where relevant, a bibliography -- distinct from a worksheet\'s question-and-answer format. Two ways to generate one: the standard curriculum-driven wizard (Projects > New), or the custom-length version (Projects > Custom) if you want to control how substantial the final project is.',
    ],
  },
  {
    id: 'projects-custom',
    routes: ['/projects/custom'],
    category: 'library',
    title: 'Custom-Length Project',
    summary: 'Generate a project at the length you choose -- short, medium, or long.',
    keyActions: [
      'Pick your curriculum details',
      'Choose a length: short, medium, or long',
      'Generate and download the project',
    ],
    longDescription: [
      'Same curriculum-driven generation as Projects > New, with one extra control: an explicit length setting, for when the standard project length doesn\'t fit what you actually need (a quick one-page overview versus a fuller multi-section report, for instance).',
    ],
  },
  {
    id: 'projects-new',
    routes: ['/projects/new'],
    category: 'library',
    title: 'New Project',
    summary: 'A curriculum-driven wizard for generating a new school project.',
    keyActions: [
      'Pick board, class, subject, and chapter',
      'Generate the project and download it',
    ],
    longDescription: [
      'The standard project generator -- board, class, subject, chapter, then generate a structured, sectioned document with a bibliography where relevant. If you specifically want control over how long the final project is, use Projects > Custom instead.',
    ],
  },
  {
    id: 'favorites',
    routes: ['/favorites'],
    category: 'library',
    title: 'Favorites',
    summary: 'Worksheets you\'ve starred, kept together for quick access.',
    keyActions: [
      'Open, preview, or download any favorited worksheet',
      'Unstar a worksheet to remove it from this list',
    ],
    longDescription: [
      'Starring works the same everywhere you see it -- Dashboard, the Worksheets list, or a worksheet\'s detail page -- and everything you\'ve starred collects here regardless of when you generated it, which is the difference between this page and Dashboard (recency-based) or Worksheets (the complete, unfiltered list).',
    ],
  },

  // -- Admin Tools ------------------------------------------------------
  {
    id: 'admin',
    routes: ['/admin'],
    category: 'admin',
    title: 'Admin Dashboard',
    summary: 'An overview for administrators: user accounts and roles, usage analytics, and curriculum health at a glance.',
    keyActions: [
      'Review users and their assigned roles',
      'Check analytics on tool usage',
      'See a summary of curriculum completeness and verification status',
    ],
    longDescription: [
      'This is the landing page for the whole Admin section, only reachable by accounts with the admin role (see "Roles: Student, Teacher, Parent, and Admin"). Think of it as a starting point rather than a place to make changes directly -- for actual edits, you\'ll move on to Curriculum Manager, Content Manager, Navigation Menu, or Site Settings, each covering one specific area in depth.',
    ],
  },
  {
    id: 'admin-content',
    routes: ['/admin/content'],
    category: 'admin',
    title: 'Admin: Content Manager',
    summary: 'A general-purpose editor for any registered content type in the app -- edit records directly, or add overrides on top of built-in content.',
    keyActions: [
      'Choose a content type to edit',
      'Edit a record\'s fields directly via the JSON editor',
      'Add an override row to change built-in content without deleting the original',
    ],
    tips: [
      'Overrides are safer than direct edits when you\'re not sure -- they can be reverted without touching the original content.',
    ],
    longDescription: [
      'Most of the app\'s reference content -- lab experiments, equipment, reagents, concept cards, and now this Help documentation itself -- is registered as an editable content type here rather than hardcoded in a way only a developer could change. Content Manager gives you a single, generic interface across all of them instead of a separate admin screen per content type.',
      'The override mechanism exists specifically so a change here is reversible: rather than mutating the built-in record permanently, an override sits on top of it and can be removed later to fall back to the original -- worth reaching for whenever you\'re not fully certain a change is right, versus a direct edit which is more final.',
    ],
  },
  {
    id: 'admin-curriculum',
    routes: ['/admin/curriculum'],
    category: 'admin',
    title: 'Admin: Curriculum Manager',
    summary: 'Manage the full curriculum tree -- boards, classes, subjects, chapters, and topics -- and track what\'s been verified.',
    keyActions: [
      'Add or edit boards, classes, subjects, chapters, and topics',
      'Track verification status as curriculum entries are reviewed',
    ],
    tips: [
      'If students report a missing subject or chapter elsewhere in the app, this is where it gets added.',
    ],
    longDescription: [
      'This is the single source of truth referenced everywhere else in the app -- every generator and every guided lab experiment\'s board/class/subject/chapter picker is reading directly from this tree, so a change here (adding a chapter, say) becomes immediately available across the whole app rather than needing to be duplicated anywhere.',
      'The verification tracking exists because curriculum entries can be added faster than they can be reviewed for accuracy -- it lets you distinguish "added" from "actually checked" so the health summary on the main Admin Dashboard reflects real confidence, not just raw entry count.',
    ],
  },
  {
    id: 'admin-menu',
    routes: ['/admin/menu'],
    category: 'admin',
    title: 'Admin: Navigation Menu',
    summary: 'Control what appears in the sidebar and mobile navigation drawer for every user, including order and grouping.',
    keyActions: [
      'Add, edit, remove, or reorder navigation items',
      'Changes here apply live across the app for all users',
    ],
    longDescription: [
      'The sidebar and mobile drawer aren\'t fixed in the app\'s code -- they\'re rendered from whatever this page defines, which is why the interface tour article notes the sidebar\'s contents "can change over time". Because changes apply live to every signed-in user immediately, treat this page with the same care as any other production configuration change, not as a personal preference setting.',
    ],
  },
  {
    id: 'admin-settings',
    routes: ['/admin/settings'],
    category: 'admin',
    title: 'Admin: Site Settings',
    summary: 'Site-wide branding and voice/speech settings.',
    keyActions: [
      'Update branding (name, logo, colors) shown throughout the app',
      'Configure voice/speech feature settings',
    ],
    longDescription: [
      'Branding set here (site name, logo, color scheme) is what actually renders in the top bar, sidebar, and generated PDFs across the whole app -- one central place rather than something configured per page. Voice/speech settings here control the app\'s spoken-content features where they exist.',
    ],
  },
];

export function getHelpEntryForPath(pathname: string): DocRouteEntry {
  const exact = HELP_REGISTRY.find((entry) => entry.routes.includes(pathname));
  if (exact) return exact;

  let best: DocRouteEntry | null = null;
  let bestRouteLength = 0;
  for (const entry of HELP_REGISTRY) {
    for (const route of entry.routes) {
      if (route.endsWith('/') && pathname.startsWith(route) && route.length > bestRouteLength) {
        best = entry;
        bestRouteLength = route.length;
      }
    }
  }
  return best ?? HELP_REGISTRY.find((entry) => entry.id === 'welcome')!;
}

export function getHelpEntryById(id: string): DocRouteEntry | undefined {
  return HELP_REGISTRY.find((entry) => entry.id === id);
}
