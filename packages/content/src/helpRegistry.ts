// The in-app Help content registry -- one entry per page/space in the app,
// plus a handful of concept articles with no single page of their own. This
// single array feeds three things: the F1 contextual drawer (summary +
// keyActions + tips only), the /help Documentation Center (full article,
// including longDescription), and the downloadable PDF user guide (same
// data, printable layout). Edit content here; the UI never hardcodes copy.
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
    summary: 'EduSheets turns your school curriculum into ready-to-use worksheets, projects, study material, and hands-on virtual labs.',
    keyActions: [
      'Generate a worksheet in minutes from Generate on the sidebar',
      'Explore six virtual labs (Math, Physics, Chemistry, Biology, Electronics, Tech) for hands-on, real-result simulations',
      'Keep everything you create in My Library (Worksheets, Activity Sheets, Study Material, Projects)',
      'Press F1 anywhere, or click the ? icon in the top bar, for help on the page you\'re on',
    ],
    tips: [
      'Every page in the app has its own F1 help -- you never have to guess what a button does.',
    ],
    longDescription: [
      'Everything you generate or simulate is scoped to your selected board (e.g. CBSE, ICSE), class, and subject, so content matches what you\'re actually teaching or studying.',
      'The tool has two halves: a generator for printable/downloadable materials (worksheets, activity sheets, study material, projects), and a set of virtual labs where you run real simulations with real, calculated results rather than pre-recorded answers.',
    ],
  },
  {
    id: 'curriculum-boards',
    routes: [],
    category: 'getting-started',
    title: 'Understanding Boards, Classes, and Curriculum',
    summary: 'Nearly every generator and lab starts by asking for a board, class, and subject/chapter -- this is how the app matches content to what you actually study.',
    keyActions: [
      'Pick your board (e.g. CBSE, ICSE) once in your Profile so it pre-fills everywhere',
      'Choose a class and subject before generating a worksheet, project, or lab experiment',
      'Drill into a chapter or topic for more targeted content where the generator offers it',
    ],
    tips: [
      'If a subject or chapter looks missing, an administrator manages the curriculum tree under Admin > Curriculum and may need to add it.',
    ],
  },
  {
    id: 'roles-permissions',
    routes: [],
    category: 'getting-started',
    title: 'Roles: Student, Teacher, Parent, and Admin',
    summary: 'What you can see and do depends on your account role, set on your Profile or by an administrator.',
    keyActions: [
      'Students: generate worksheets and use every virtual lab',
      'Teachers and Parents: also get Activity Sheets and Study Material, for setting work or supporting learning at home',
      'Admins: get the Admin section -- curriculum, content, navigation menu, and site settings',
    ],
    tips: [
      'If a sidebar item like Study Material or Admin is missing for you, that\'s expected -- it\'s gated by role, not a bug.',
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
      'Click the ? icon in the top bar, or press F1, for help on your current page',
      'Toggle dark mode with the sun/moon icon in the top bar',
      'On mobile, tap the menu icon to open the same navigation as a slide-out drawer',
    ],
    tips: [
      'The sidebar is centrally managed, so its exact items can change over time -- if something moves, F1 on the new page will explain it.',
    ],
  },
  {
    id: 'help-center',
    routes: ['/help'],
    category: 'getting-started',
    title: 'Using Help & Documentation',
    summary: 'This Documentation Center is the full, searchable version of the same help you get from pressing F1 on any page.',
    keyActions: [
      'Search articles by title or keyword using the search box',
      'Browse by category: Getting Started, Virtual Labs, My Library, Admin Tools, Account',
      'Open any article for the full write-up, or press F1 on the actual page for a quick summary',
      'Download the complete guide as a single PDF',
    ],
  },

  // -- Account & Dashboard --------------------------------------------------
  {
    id: 'dashboard',
    routes: ['/dashboard'],
    category: 'account',
    title: 'Dashboard',
    summary: 'Your home page -- a quick view of the worksheets you\'ve generated most recently, with one-click favorite, download, and preview.',
    keyActions: [
      'Open, preview, or download any recent worksheet directly from the list',
      'Star a worksheet to add it to Favorites',
      'Jump to Generate to create something new',
    ],
  },
  {
    id: 'generate',
    routes: ['/generate'],
    category: 'account',
    title: 'Generate a Worksheet',
    summary: 'The main worksheet wizard: pick your curriculum, choose question types, then generate a downloadable worksheet.',
    keyActions: [
      'Select board, class, subject, and chapter/topic',
      'Choose question types and how many of each you want',
      'Generate, preview the result, then download as PDF or favorite it for later',
    ],
    tips: [
      'You can regenerate with different question types without losing your curriculum selection.',
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
      'Add your own AI provider key if you want to use your own quota',
      'Sign out from here',
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
      'This lab intentionally does not simulate real analog/RF signal reception (e.g. an actual radio broadcast) -- any project like that plays a clearly-labeled simulated output once the circuit is wired correctly, because a browser genuinely can\'t receive real radio waves. Everything electrical (Ohm\'s Law, component thresholds, RC timing, 555-timer behavior) is calculated for real from your actual wiring.',
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
