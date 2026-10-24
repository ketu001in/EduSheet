// The in-app Help content registry -- one entry per page/space in the app,
// plus concept articles, role-based onboarding journeys, cross-page how-to
// guides, and an FAQ/Troubleshooting set with no single page of their own.
// This single array feeds three things: the "?" contextual drawer (opened
// with the ? key, or the Help button in the top bar -- shows summary,
// keyActions, steps, tips, AND longDescription, so it's a real explanation,
// not just a hint), the /help Documentation Center (full article, same
// fields), and the downloadable PDF user guide (same data, printable
// layout). Edit content here; the UI never hardcodes copy.
//
// routes: a page can list more than one path. A route ending in '/' matches
// any path that starts with it (used for dynamic segments, e.g.
// 'worksheets/[id]'); every other route must match exactly. See
// getHelpEntryForPath below for the matching rule. Entries with no page of
// their own (concept articles, role journeys, guides, FAQ) use [].

import { DocRouteEntry } from './helpTypes';

export const HELP_REGISTRY: DocRouteEntry[] = [
  // -- Getting Started: concept articles -----------------------------------
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
    steps: [
      'Set your board and class once on Profile so every generator and lab pre-fills correctly from then on',
      'Open Generate to create your first worksheet, or pick a lab from the sidebar to try a hands-on simulation instead',
      'Press ? on any page whenever you want an explanation of exactly what\'s there',
    ],
    tips: [
      'Every page in the app has its own instant help -- you never have to guess what a button does.',
      'If you\'re a student, teacher, parent, or admin and want a guided first walkthrough rather than this overview, see the role-based "Getting Started" guide for your role at the top of the Documentation Center home page.',
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
    steps: [
      'Go to Profile and set your default board (e.g. CBSE or ICSE) and class',
      'Open any generator or lab -- the board and class are already filled in for you',
      'Pick a subject, then a chapter if the tool offers one, to narrow the content further',
      'If something looks missing, ask your administrator to check Admin > Curriculum',
    ],
    tips: [
      'If a subject or chapter looks missing, an administrator manages the curriculum tree under Admin > Curriculum and may need to add it.',
      'CBSE and ICSE share the same Class 1-12 numbering, but a subject can look different between them -- e.g. ICSE keeps Physics, Chemistry, and Biology separate earlier, and splits History & Civics from Geography, where CBSE merges several of these into one "Social Science" subject for Classes 6-10.',
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
      'Teachers and Parents: also get Activity Sheets, Study Material, and Ask AI, for setting work or supporting learning at home',
      'Admins: get the Admin section -- curriculum, content, navigation menu, and site settings',
      'Check your Profile page to see (and, where allowed, change) your current role',
    ],
    steps: [
      'Open Profile to see your current role',
      'Compare what you see in the sidebar against what this article says your role should unlock',
      'If something looks wrong, contact whoever administers your school\'s account -- roles aren\'t fully self-service beyond what Profile allows',
    ],
    tips: [
      'If a sidebar item like Study Material, Activity Sheet, or Admin is missing for you, that\'s expected -- it\'s gated by role, not a bug.',
      'Ask AI (the floating chat bubble) is also teacher/parent-only, for the same reason Activity Sheets and Study Material are -- it spends your own configured AI key, and student accounts don\'t have one.',
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
    steps: [
      'Use the sidebar on the left to jump between sections',
      'Use the top bar\'s search box, ? help icon, dark mode toggle, notifications bell, and profile menu',
      'On a phone or narrow window, tap the menu icon for the same navigation as a slide-out drawer',
    ],
    tips: [
      'The sidebar is centrally managed, so its exact items can change over time -- if something moves, help on the new page will explain it.',
      'The floating "Ask AI" bubble (bottom-right, teacher/parent accounts only) is separate from the ? help drawer -- ? explains the page you\'re on, Ask AI is a conversation you can ask follow-up questions in.',
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
      'Browse by category: Getting Started, Virtual Labs, My Library, Admin Tools, Account, and Troubleshooting & FAQ',
      'Open any article for the full write-up with numbered steps, or press ? on the actual page for a quick, page-specific summary',
      'Download the complete guide as a single PDF',
    ],
    steps: [
      'Type in the search box to filter articles by title or summary',
      'Or scroll down and browse by category, starting with the "Start here" role guides at the top',
      'Click an article to open its full write-up, including numbered steps and tips',
      'Click "Download full guide (PDF)" for every article in one printable document',
    ],
    longDescription: [
      'There is only one source of help content in the app -- this registry -- and it\'s rendered three different ways. Press ? on any page and you get a compact drawer scoped to that exact page. Come here to /help and you get the same content laid out as a full, browsable, searchable library. Click "Download full guide (PDF)" (here, or from the drawer) and you get every article bundled into one printable document, organized the same way as this page.',
      'Because it\'s one content source, an article can never say something in the drawer that contradicts what it says here -- there\'s nothing to keep in sync, since both are reading the exact same entry. If you improve your understanding of a page from the drawer and want more, the "View full article" link inside the drawer takes you straight to that same article\'s full page here, with its related-articles list for whatever else is nearby in the same category.',
      'New to the app? The "Start here" row at the top of this page links to four role-based onboarding journeys (Student, Teacher, Parent, Admin), each a genuine first-walkthrough rather than a reference article -- worth reading before diving into individual page articles.',
    ],
  },

  // -- Getting Started: role-based onboarding journeys ---------------------
  {
    id: 'start-student',
    routes: [],
    category: 'getting-started',
    title: 'Getting Started: Student',
    summary: 'Your first steps as a student -- generate a worksheet, try a lab, and know where to find what you made.',
    keyActions: [
      'Generate your first worksheet from the curriculum you actually study',
      'Try a guided experiment in any virtual lab and see a genuinely calculated result',
      'Find anything you\'ve made again from Dashboard, Worksheets, or Favorites',
    ],
    steps: [
      'Open Profile and set your board and class -- this pre-fills every generator and lab from here on',
      'Click Generate in the sidebar, pick a subject and chapter, choose question types, and generate your first worksheet',
      'Download the PDF, or click the star icon to add it to Favorites so you can find it again quickly',
      'Open any lab from the sidebar (Electronics Lab and Chemistry Lab are good first tries) and run a guided New Experiment -- predict the outcome before you run it, then see the real result',
      'Press ? any time you\'re unsure what a page does',
    ],
    tips: [
      'You don\'t need to ask a teacher or parent to generate a worksheet or use a lab -- those are open to student accounts directly.',
      'Activity Sheets, Study Material, and Ask AI are teacher/parent tools, not missing features on your account -- see "Roles: Student, Teacher, Parent, and Admin" if you\'re curious why.',
    ],
    longDescription: [
      'As a student, the two things you\'ll use most are Generate (for worksheets) and the virtual labs (for hands-on experiments). Both start the same way: pick your board, class, and subject, then a chapter if the tool asks for one. Setting your board and class once on Profile means you only confirm a subject and chapter after that, rather than re-entering everything each time.',
      'The labs are worth trying even if you came here just for a worksheet -- every guided experiment follows the same predict-before-you-see-it structure (predict, run the real simulation, observe, explain), which turns a page you\'d otherwise just read into something you actually do. Electronics Lab, Chemistry Lab, Physics Lab, Biology Lab, and Math Lab all work this way; Tech Lab is organized a little differently around Knowledge Base + Hands-On tabs for Robotics, AI, and Coding.',
      'Everything you generate collects in My Library (Worksheets, and for teacher/parent accounts also Projects, Study Material, and Activity Sheets) -- Dashboard shows your most recent items for quick access, Favorites holds anything you\'ve starred regardless of age, and the full Worksheets list is always searchable if you need to find something older.',
    ],
  },
  {
    id: 'start-teacher',
    routes: [],
    category: 'getting-started',
    title: 'Getting Started: Teacher',
    summary: 'Setting work for a class, using Activity Sheets and Study Material, and letting Ask AI set up a worksheet for you in plain language.',
    keyActions: [
      'Generate worksheets, activity sheets, and study material for your class',
      'Use Ask AI to describe what you need in plain language and have it set up the Generate wizard for you',
      'See what your students will be using by browsing the virtual labs yourself',
    ],
    steps: [
      'Open Profile and set your default board and class',
      'Generate a worksheet for your class from Generate, or a hands-on classroom activity from Activity Sheet > New',
      'Try Study Material > New for a single document that combines your own lesson-plan notes with student-facing explanatory content',
      'Open Ask AI (the floating bubble, bottom-right) and ask it in plain language for a worksheet -- it resolves your request against the real curriculum and shows you an "Open in Generate" button that pre-fills the wizard for your review, rather than generating anything without you seeing it first',
      'Browse the virtual labs from the sidebar so you know what a guided experiment looks like before assigning one',
    ],
    tips: [
      'Activity Sheets are specifically designed with a facilitation-notes section for the adult running the activity -- that\'s why generating one is restricted to teacher/parent accounts rather than open to students.',
      'Ask AI only ever proposes a worksheet setup for you to review and click through -- it never generates and saves a worksheet on its own.',
    ],
    longDescription: [
      'As a teacher, you have access to everything a student does (Generate, every virtual lab) plus three more tools: Activity Sheets (short, hands-on tasks with a facilitation-notes box for you), Study Material (a combined lesson-plan-and-revision-notes document), and Ask AI (a chat assistant that can set up a worksheet for you). All four generators -- Generate, Activity Sheet, Study Material, and Projects -- follow the same curriculum-first pattern: board, class, subject, chapter, then generate.',
      'Ask AI is worth trying specifically because it collapses the curriculum-picking steps into a plain-language request -- ask for "a Class 8 Science worksheet on photosynthesis, 10 questions, medium difficulty" and it resolves that against the real curriculum tree and routes you into the Generate wizard already filled in, ready for your own click to actually generate. See the dedicated Ask AI article for exactly how it decides what to do.',
      'Everything you generate lives in My Library, searchable and re-downloadable later -- Worksheets, Activity Sheets, Study Material, and Projects each have their own list with regenerate and PDF-download options, so you\'re not starting from scratch if you want a fresh variant of something you made before.',
    ],
  },
  {
    id: 'start-parent',
    routes: [],
    category: 'getting-started',
    title: 'Getting Started: Parent',
    summary: 'Helping your child learn at home -- activity sheets for hands-on time together, study material for explaining concepts, and the virtual labs for real hands-on practice.',
    keyActions: [
      'Generate activity sheets and study material matched to your child\'s board and class',
      'Explore a virtual lab together before your child uses it independently',
      'Use Ask AI to quickly set up a worksheet in plain language',
    ],
    steps: [
      'Open Profile and set your child\'s board and class as your default',
      'Try Activity Sheet > New for a short, hands-on task you can do together, with notes for you on how to run it',
      'Try Study Material > New for a document that explains a chapter to your child while also giving you teaching notes',
      'Open a virtual lab from the sidebar and try a guided experiment yourself first, so you know what your child will see',
      'Open Ask AI (bottom-right) if you\'d rather describe what you need in plain language than click through the curriculum picker yourself',
    ],
    tips: [
      'Activity Sheets include a "for the grown-up running this" facilitation-notes box specifically so you don\'t need teaching experience to run one.',
      'You don\'t need to be present for every lab session -- the guided predict/simulate/explain structure is designed to work for a student working alone, with real calculated results either way.',
    ],
    longDescription: [
      'As a parent account, you have the same tools a teacher does -- Generate, Activity Sheets, Study Material, Projects, every virtual lab, and Ask AI -- the role distinction in this app is about adult-facilitated tools being available to any adult account, not specifically classroom teachers.',
      'Activity Sheets are probably the most parent-shaped tool here: short, concrete, hands-on tasks (materials, numbered steps, a couple of reflection questions) with a dedicated notes box for you as the adult running it -- what to watch for, how to help without doing it for your child, and how to make it harder or easier.',
      'The virtual labs are worth exploring together at least once, since the predict-before-you-see-it structure works best when your child commits to a real guess before the simulation runs -- after that, every lab (Electronics, Chemistry, Physics, Biology, Math) works the same way, so what you learn in one carries over to the others.',
    ],
  },
  {
    id: 'start-admin',
    routes: [],
    category: 'getting-started',
    title: 'Getting Started: Admin',
    summary: 'Where the curriculum tree, site content, navigation, and branding actually live -- and the order to check them in.',
    keyActions: [
      'Review and verify the curriculum tree under Curriculum Manager',
      'Edit lab/reference content or add overrides under Content Manager',
      'Control the sidebar and mobile navigation under Navigation Menu',
      'Set site-wide branding and voice/speech settings under Site Settings',
    ],
    steps: [
      'Open Admin from the sidebar -- only visible to admin accounts',
      'Start on the Admin Dashboard to see user roles, usage, and curriculum health at a glance',
      'Open Curriculum Manager to add or verify boards, classes, subjects, chapters, and topics',
      'Open Content Manager if you need to edit or override any registered content type, including this Help documentation itself',
      'Open Navigation Menu if the sidebar needs to change for every user',
      'Open Site Settings for branding and voice/speech configuration',
    ],
    tips: [
      'Navigation Menu and Content Manager changes apply live to every signed-in user the moment you save -- treat them with the same care as any other production change.',
      'Prefer an override in Content Manager over a direct edit when you\'re not fully certain a change is right -- an override is reversible, a direct edit is more final.',
    ],
    longDescription: [
      'The Admin section is a separate tier from Student/Teacher/Parent, unlocked only for admin accounts, and it covers infrastructure for the whole deployment rather than any one user\'s content. The four tools under it -- Curriculum Manager, Content Manager, Navigation Menu, Site Settings -- each own one specific area, and the Admin Dashboard itself is just an overview, not a place to make changes.',
      'Curriculum Manager is the one you\'ll likely touch most: it\'s the single source of truth every generator and lab\'s board/class/subject/chapter picker reads from, so adding a chapter here makes it available everywhere else in the app immediately, with no duplication needed. The verification tracking exists to distinguish "added" from "actually reviewed," which is what the Admin Dashboard\'s curriculum-health summary reflects.',
      'Content Manager is broader -- it\'s a generic editor across every registered content type (lab experiments, equipment, reagents, concept cards, and this Help documentation itself), with an override mechanism that lets you change built-in content reversibly rather than mutating it permanently.',
    ],
  },

  // -- Getting Started: cross-page how-to guides ---------------------------
  {
    id: 'guide-worksheet-set',
    routes: [],
    category: 'getting-started',
    title: 'How To: Generate and Manage a Worksheet Set for a Class',
    summary: 'A full walkthrough from "I need worksheets for Class 8 Science" to a downloaded set with answer keys, kept organized in My Library.',
    keyActions: [
      'Generate multiple worksheets across chapters for the same class/subject',
      'Download each worksheet\'s PDF and its matching answer key separately',
      'Star the ones you\'ll reuse so they\'re quick to find later',
    ],
    steps: [
      'Set your board and class on Profile once, so you don\'t re-enter it for every worksheet',
      'Open Generate, pick the subject and first chapter, choose your question mix, and generate',
      'Download the worksheet PDF and, separately, its answer key',
      'Click Generate again (or use the sidebar) to make the next chapter\'s worksheet -- your board/class stay selected',
      'Star the worksheets you\'ll reuse so they collect in Favorites instead of getting lost in the full Worksheets list',
      'Come back to Worksheets any time to search, re-download, or regenerate a fresh variant of any of them',
    ],
    tips: [
      'Regenerating produces a new variant on the same curriculum selection without overwriting or losing the original -- both exist afterward.',
      'If you want manual control over the exact question mix per section rather than the curriculum-driven default, use Custom Worksheet instead of Generate.',
    ],
    longDescription: [
      'This guide ties together three pages that each have their own article but are usually used in sequence: Generate (to create), the worksheet\'s answer key download (a separate PDF, not bundled into the worksheet itself), and Worksheets/Favorites (to find things again later). There\'s no "batch generate a whole chapter list" button -- you generate one worksheet at a time, which keeps each one\'s question mix deliberate rather than automated.',
      'A practical pattern for a full class set: generate one worksheet per chapter you\'re covering, download both the worksheet and its answer key for each, and star the ones you expect to reuse next term. Everything stays searchable in the full Worksheets list regardless of whether you starred it, so starring is purely a convenience, not a requirement to keep something.',
    ],
  },
  {
    id: 'guide-lab-experiment',
    routes: [],
    category: 'getting-started',
    title: 'How To: Run a Guided Lab Experiment End-to-End',
    summary: 'The same predict-simulate-observe-explain flow works identically across Chemistry, Physics, Biology, and Math Lab -- here\'s the full walkthrough once, so you know it everywhere.',
    keyActions: [
      'Pick a chapter-matched guided experiment in any lab',
      'Commit to a real prediction before running the simulation',
      'Observe the actual, calculated result -- not a scripted animation',
      'Submit your explanation to complete the attempt and get a downloadable PDF report',
    ],
    steps: [
      'Open a lab from the sidebar (Chemistry, Physics, Biology, or Math Lab) and click New Experiment',
      'Pick a chapter-matched experiment from the list',
      'Write down your prediction honestly, before seeing anything run',
      'Run the simulation on the lab bench and watch the real result',
      'Compare the actual result to your prediction',
      'Submit your explanation of why the result came out the way it did',
      'Download the PDF report, which includes your prediction, the real result, and your explanation',
    ],
    tips: [
      'A wrong prediction isn\'t a failed attempt -- the whole point of predicting first is learning from the gap between what you expected and what actually happened.',
      'Electronics Lab works differently (no formal predict/observe attempt flow) -- see its own article for how Projects and Free Play work there instead.',
    ],
    longDescription: [
      'Four of the six labs (Chemistry, Physics, Biology, Math) share one exact flow for their "New Experiment" tool, which is why this guide exists separately from each lab\'s own article -- once you\'ve done it in one, you already know how to do it in all four. The structure is deliberately the same shape a real science class uses: predict before you see the answer, run the real thing, observe what actually happened, then explain it in your own words.',
      'The result you observe is genuinely calculated from the parameters of that specific experiment, not a fixed animation that plays regardless of your prediction -- that\'s true across all four labs, whether it\'s a chemical reaction, a physics simulation, a biological process, or a mathematical relationship. Submitting your explanation is what completes the attempt and triggers the PDF report; until then, the attempt isn\'t saved.',
      'Tech Lab and Electronics Lab are structured differently on purpose. Tech Lab pairs a Knowledge Base with Hands-On tools rather than predict/observe attempts; Electronics Lab centers on guided Projects (with step-by-step build instructions and a reference circuit) or open-ended Free Play, with the oscilloscope providing real-time feedback instead of a submitted attempt. See each lab\'s own article for specifics.',
    ],
  },
  {
    id: 'guide-ask-ai-worksheet',
    routes: [],
    category: 'getting-started',
    title: 'How To: Use Ask AI to Jump-Start a Worksheet',
    summary: 'Describe what you need in plain language and let Ask AI fill in the Generate wizard for you -- you still click Generate yourself.',
    keyActions: [
      'Open Ask AI and describe the worksheet you want in plain language',
      'Review the action card it proposes',
      'Click through to the pre-filled Generate wizard',
      'Generate as you normally would',
    ],
    steps: [
      'Click the "Ask AI" bubble, bottom-right of the screen (teacher/parent accounts only)',
      'Type something like "make a Class 8 Science worksheet on photosynthesis, 10 questions, medium difficulty"',
      'Wait for Ask AI\'s response -- if it understood this as a worksheet request, you\'ll see a short summary and an "Open in Generate" button',
      'Click "Open in Generate" -- this takes you to the Generate wizard with your board, class, subject, chapter, and settings already filled in',
      'Review the pre-filled selection (change anything you like) and click Generate yourself to actually create it',
    ],
    tips: [
      'If Ask AI couldn\'t match your subject or chapter to the real curriculum, it tells you plainly rather than guessing -- try naming the exact class/subject, or just open Generate directly.',
      'Ask AI never generates and saves a worksheet without you clicking Generate yourself in the wizard.',
    ],
    longDescription: [
      'This is the one place in the app where a chat conversation can take an action instead of just answering a question. Under the hood, Ask AI decides whether your message is a worksheet request; if it is, it resolves the board/class/subject/chapter names you used against the real curriculum tables (the same ones every generator reads from), and only then shows you the "Open in Generate" action -- it never has enough information to generate blind, and it\'s built not to try.',
      'Everything Ask AI proposes is a starting point for you to review, not a finished product -- clicking "Open in Generate" is identical to manually picking the same board/class/subject/chapter/settings yourself, just faster. See the dedicated Ask AI article for the full picture of what else it can do (plain Q&A about the page you\'re on) and its limitations (teacher/parent accounts only, uses your own configured AI key).',
    ],
  },
  {
    id: 'guide-admin-rollout',
    routes: [],
    category: 'getting-started',
    title: 'How To: Roll Out a New Curriculum Topic as an Admin',
    summary: 'Add a chapter or topic once in Curriculum Manager and it becomes available to every generator and lab immediately -- here\'s the order to do it in.',
    keyActions: [
      'Add the chapter/topic in Curriculum Manager',
      'Mark it verified once you\'ve reviewed it',
      'Confirm it appears correctly in a generator and a lab before announcing it',
    ],
    steps: [
      'Open Admin > Curriculum Manager',
      'Find the board, class, and subject the new content belongs under',
      'Add the chapter, and topics under it if you\'re going that granular',
      'Mark the entry verified once you\'ve reviewed it for accuracy',
      'Open Generate (or any relevant lab) as a quick check that the new chapter actually appears in the picker',
      'Let your students/teachers know it\'s available',
    ],
    tips: [
      'Verification exists to separate "added" from "actually checked" -- the Admin Dashboard\'s curriculum-health summary reflects verified entries, not just raw count, so don\'t skip it.',
      'A new chapter is usable the moment it\'s saved -- verification doesn\'t gate availability, it\'s a quality-tracking signal for you and other admins, not an approval step users wait on.',
    ],
    longDescription: [
      'There\'s no separate "publish" step between adding curriculum content and it being usable -- every generator and lab\'s board/class/subject/chapter picker reads live from the same tables Curriculum Manager edits, so a save here is immediately visible everywhere else in the app. That\'s exactly why the verification tracking matters: it\'s the only record of whether an entry has actually been checked, since availability itself doesn\'t tell you that.',
      'A quick sanity check after adding anything curriculum-level is worth the extra minute -- open Generate (or whichever lab is relevant) and confirm the new chapter shows up correctly in the picker before telling anyone it\'s ready, since a typo in a chapter name is otherwise easy to miss until a user stumbles on it.',
    ],
  },
  {
    id: 'guide-electronics-breadboard',
    routes: [],
    category: 'getting-started',
    title: 'How To: Build a Circuit on the Electronics Lab Breadboard',
    summary: 'From an empty breadboard to a working, electrically-validated circuit -- picking up parts, placing them, wiring them, and reading the oscilloscope.',
    keyActions: [
      'Pick up a component from the Cupboard',
      'Place it on the breadboard at a valid position',
      'Wire connections between components',
      'Read the oscilloscope for timer/oscillator circuits',
    ],
    steps: [
      'Open Electronics Lab from the sidebar',
      'Open Projects for a guided build with step-by-step instructions, or open the Cupboard directly for Free Play',
      'Pick up a component -- watch the "Now Placing" banner, which tells you exactly what\'s in your hand and where it can legally go',
      'Click a valid position on the breadboard to place it',
      'Repeat for every component the circuit needs',
      'Wire connections between component pins',
      'Check the result -- component behavior (LED brightness, buzzer, etc.) and the oscilloscope (for timer/oscillator circuits) reflect genuinely calculated electrical values from your actual wiring',
    ],
    tips: [
      'If something doesn\'t light up or behave as expected, that\'s real feedback that the wiring is actually wrong -- the same as it would be on a physical breadboard, not a bug to report.',
      'The oscilloscope only shows a trace once the relevant part of the circuit is electrically complete.',
    ],
    longDescription: [
      'This lab is the most hands-on of the six because it has an explicit pick-up-and-place interaction model other labs don\'t -- you\'re not choosing from a dropdown, you\'re physically selecting a part from the Cupboard and placing it, the same motion a real breadboard session involves. The "Now Placing" banner exists specifically to keep that in sync with what you\'re actually doing, since it\'s easy to lose track of what\'s in your hand once you\'ve picked several parts up in a row.',
      'Guided Projects give you a defined goal with a reference circuit to check yourself against; Free Play removes that structure entirely so you can experiment without a target. Either way, the underlying calculation is identical -- real Ohm\'s Law, real component thresholds, real RC/555-timer formulas -- so a circuit that works in Free Play would work in a guided Project\'s reference too, and vice versa.',
    ],
  },
  {
    id: 'guide-document-types',
    routes: [],
    category: 'getting-started',
    title: 'How To: Choose the Right Document Type',
    summary: 'Worksheet, Project, Study Material, or Activity Sheet -- four different generators that produce four genuinely different documents, not four names for the same thing.',
    keyActions: [
      'Use a Worksheet for quiz-style questions with an answer key',
      'Use a Project for a structured, multi-section report with a bibliography',
      'Use Study Material for a combined teacher-notes-plus-student-notes document',
      'Use an Activity Sheet for a short, hands-on task with facilitation notes',
    ],
    steps: [
      'Decide what the output needs to look like: questions to answer, a report to read, notes to teach from, or a hands-on task to do',
      'Open Generate for a worksheet, Projects > New for a report, Study Material > New for combined notes, or Activity Sheet > New for a hands-on task',
      'Pick board, class, subject, and chapter -- the same curriculum-first pattern on every one of these generators',
      'Generate and download',
    ],
    longDescription: [
      'A Worksheet is questions-and-answers: multiple choice, fill-in-the-blank, short/long answer, and more, with a separately downloadable answer key -- the shape most people mean by "worksheet". A Project is the opposite shape: structured prose in headed sections, plus a bibliography where relevant, with no questions at all, for when you need a report rather than a quiz.',
      'Study Material is the only one of the four that deliberately serves two readers in one document -- sections marked "for teachers/parents" (lesson-plan style, step-by-step facilitation guidance) alongside sections marked "for students" (the actual explanatory content), combined into a single PDF. An Activity Sheet is the shortest and most hands-on: a materials list, numbered steps, a couple of reflection questions, and a facilitation-notes box for whichever adult is running it -- not a worksheet with questions, and not prose to read.',
      'All four are gated the same way for who can generate what: Worksheets and Projects are open to every role; Study Material and Activity Sheets are teacher/parent-only, since both assume an adult is involved in using the result.',
    ],
  },
  {
    id: 'guide-find-reuse',
    routes: [],
    category: 'getting-started',
    title: 'How To: Find and Reuse What You\'ve Already Made',
    summary: 'Dashboard, Favorites, and the full library lists each answer a different question -- "what did I just make," "what do I want to keep," and "everything, searchable."',
    keyActions: [
      'Check Dashboard for your most recently generated worksheets',
      'Check Favorites for anything you\'ve starred, regardless of age',
      'Search the full Worksheets/Projects/Study Material/Activity Sheet lists for anything older or unstarred',
    ],
    steps: [
      'Open Dashboard for a quick look at your most recent worksheets',
      'If what you need isn\'t recent, open the relevant library page (Worksheets, Projects, Study Material, or Activity Sheet) and search',
      'Star anything you expect to need again -- it collects in Favorites so you don\'t have to search for it next time',
      'From any of these, download the PDF again, regenerate a fresh variant, or (on Worksheets/Projects/Study Material/Activity Sheet) delete it',
    ],
    longDescription: [
      'These three views overlap in content but answer different questions, which is why there are three of them instead of one. Dashboard is recency-based and narrow on purpose -- a fast-access strip of whatever you generated most recently, not a management view. Favorites is the opposite axis: everything you\'ve starred, regardless of when you made it, for things you genuinely want to keep coming back to.',
      'The full library lists (Worksheets, Projects, Study Material, Activity Sheet) are the complete, searchable record of everything you\'ve ever generated of that type -- this is where you go when something isn\'t recent enough for Dashboard and you never starred it. Regenerating from any of these produces a fresh variant on the same curriculum selection without touching or losing the original.',
    ],
  },
  {
    id: 'ask-ai',
    routes: [],
    category: 'account',
    title: 'Ask AI',
    summary: 'A floating chat assistant (teacher/parent accounts only) that can explain the page you\'re on, and -- for worksheet requests -- set up the Generate wizard for you.',
    keyActions: [
      'Click the "Ask AI" bubble (bottom-right) on any page to ask about what\'s currently shown',
      'Ask in plain language for a worksheet and get a pre-filled "Open in Generate" action instead of a text answer',
      'Speak your question with the mic button, and have answers read aloud',
      'Open the conversation history\'s Trash icon to start a fresh topic, or just navigate to a new page',
    ],
    steps: [
      'Click the "Ask AI" bubble, bottom-right of any dashboard page',
      'Type or speak your question',
      'If it\'s a plain question, read the text answer that appears',
      'If it\'s a worksheet request, review the action card and click "Open in Generate" to go to the pre-filled wizard',
      'Click the speaker icon on any answer to have it read aloud, or toggle read-aloud on by default with the volume icon in the panel header',
    ],
    tips: [
      'Ask AI is teacher/parent-only because it spends your own configured AI key (set up on Profile) -- student accounts don\'t have one.',
      'Worksheet-request answers arrive as one complete block rather than typed out gradually, unlike plain-question answers -- the underlying decision step can\'t stream and decide at the same time.',
      'If you see "Add your AI provider key," set one up on Profile under AI Provider -- there\'s no shared fallback key.',
    ],
    longDescription: [
      'Ask AI has two distinct behaviors depending on what you ask. For a plain question about the page you\'re on ("explain this", "how do I teach this to a child"), it answers in text, using the page\'s own help content plus what\'s currently visible on screen as context -- the same kind of explanation the ? drawer gives, but conversational and able to take follow-up questions.',
      'For a worksheet request ("make a Class 8 Science worksheet on photosynthesis"), it does something different: it decides you want to create something, resolves the board/class/subject/chapter you named against the real curriculum tables, and -- if it found a match -- shows you an "Open in Generate" button rather than a text answer. Clicking it takes you to the Generate wizard with your selection already filled in; you still click Generate yourself to actually create anything. See "How To: Use Ask AI to Jump-Start a Worksheet" for the full walkthrough.',
      'If your board/class/subject/chapter couldn\'t be matched to the real curriculum, Ask AI says so plainly rather than guessing wrong -- try naming things more precisely, or just open Generate directly and pick from the curriculum tree yourself.',
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
    steps: [
      'Open Dashboard from the sidebar',
      'Scroll your recently generated worksheets',
      'Click one to preview, download, or star it',
      'Click Generate when you want to create something new',
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
      'Switch to Custom Worksheet (link at the top of step 1) for manual, section-by-section control instead',
    ],
    steps: [
      'Pick your board',
      'Pick your class',
      'Pick a subject',
      'Pick a chapter, and topics if the picker offers them',
      'Choose question types and how many of each you want',
      'Click Generate, preview the result, then download the PDF or its answer key',
    ],
    tips: [
      'You can regenerate with different question types without losing your curriculum selection.',
      'If Ask AI set this page up for you, double-check the pre-filled selection before generating -- it\'s a starting point, not a guaranteed-correct match.',
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
      'Add your own AI provider key if you want to use Ask AI or your own generation quota',
      'Sign out from here',
    ],
    steps: [
      'Open Profile from the top bar\'s profile menu',
      'Set your default board and class',
      'Add your AI provider key if you want to use Ask AI (teacher/parent accounts)',
      'Choose a reading font if you want',
      'Save your changes',
    ],
    longDescription: [
      'Your default board and grade here are what every generator and lab picker starts from -- change it once and it follows you everywhere, rather than having to reselect your class on every single page. This is also where your account role lives (see "Roles: Student, Teacher, Parent, and Admin"), which controls what parts of the app are visible to you at all.',
      'The AI provider key is for anyone who wants to use Ask AI (teacher/parent accounts) or generation to run against their own account and quota -- there is no shared fallback key, so "Add your AI provider key" messages elsewhere in the app mean you need to set one here first.',
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
    steps: [
      'Open Projects for a guided build, or the Cupboard for Free Play',
      'Pick up a component -- watch the "Now Placing" banner for exactly what\'s in your hand',
      'Place it on the breadboard at a valid position',
      'Wire connections between components',
      'Check your circuit -- component behavior and the oscilloscope reflect real electrical calculations',
    ],
    tips: [
      'When you pick up a part from the Cupboard, watch for the "Now Placing" banner -- it tells you exactly what\'s in your hand and where it can legally go.',
      'The oscilloscope only shows a trace once your circuit is electrically complete -- it explains in plain language what you\'re looking at.',
      'See "How To: Build a Circuit on the Electronics Lab Breadboard" for a full walkthrough if this is your first time.',
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
    steps: [
      'Open Chemistry Lab from the sidebar',
      'Review your past attempts at the top of the page',
      'Click New Experiment for a guided, curriculum-matched lab, or jump to a specific tool from the quick links',
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
    steps: [
      'Pick a chapter-matched experiment',
      'Write your prediction before running anything',
      'Run the simulation on the lab bench',
      'Observe the real, calculated result',
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
    steps: [
      'Pick a calculator (moles, gas laws, pH, kinetics, or electrochemistry)',
      'Enter your known values',
      'Read the calculated result and the formula it used',
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
    steps: [
      'Browse concept cards by topic',
      'Read one before or after a related guided experiment',
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
    steps: [
      'Click any element',
      'Review its real properties in the 3D-assisted view',
      'Filter or scan by category if you\'re looking for a group',
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
    steps: [
      'Browse the available charts',
      'Reference one while working a problem elsewhere in the app',
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
    steps: [
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
    steps: [
      'Browse reagents',
      'Click one for its real properties and safe-handling notes',
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
    steps: [
      'Choose your first chemical',
      'Choose your second chemical',
      'Watch the reaction play out in 3D and read the real result explanation',
      'Try another combination to explore the pattern',
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
    steps: [
      'Pick benzene or one of its derivatives',
      'Rotate the 3D structure',
      'Explore substituent positions',
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
    steps: [
      'Pick an element\'s atomic model to view',
      'Step through the ionic or covalent bonding example',
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
    steps: [
      'Open Physics Lab from the sidebar',
      'Review past attempts at the top',
      'Click New Experiment for a guided lab, or Playground for free exploration',
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
    steps: [
      'Pick a chapter-matched experiment',
      'Predict the outcome',
      'Run the real simulation',
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
    steps: [
      'Pick a simulation type (pendulum, spring, projectile, etc.)',
      'Adjust a parameter',
      'Watch the real result change',
      'Reset and try an extreme value to build intuition',
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
    steps: [
      'Open Biology Lab from the sidebar',
      'Review past attempts',
      'Click New Experiment, open Anatomy Explorer, or open Playground',
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
    steps: [
      'Pick a body system or model',
      'Click a structure for its real label and detail',
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
    steps: [
      'Pick a chapter-matched experiment',
      'Predict the outcome',
      'Run the real simulation',
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
    steps: [
      'Pick an experiment to explore',
      'Change inputs',
      'Observe the real, calculated outcome',
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
    steps: [
      'Open Math Lab from the sidebar',
      'Pick a section: New Experiment, Theorems, Formulas, Grapher, Games, Vedic Math, or Ancient Math History',
      'Use New Experiment for the structured predict/observe flow, or the others as references and open exploration',
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
    steps: [
      'Pick a chapter-matched experiment',
      'Predict the outcome before the figure reveals it',
      'Run the real simulation',
      'Explain your reasoning to complete the attempt',
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
    steps: [
      'Open Tech Lab from the sidebar',
      'Browse your generated tech projects by category',
      'Open Robotics, AI, or Coding for that area\'s tools, or click Generate New Project to create one',
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
    steps: [
      'Read the Knowledge Base tab for AI/ML foundations',
      'Switch to Hands-On',
      'Adjust the decision threshold and watch precision/recall/F1 recompute live',
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
    steps: [
      'Read the Knowledge Base tab',
      'Switch to Hands-On',
      'Try the block-based editor, the sorting race, or the recursion visualizer',
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
    steps: [
      'Read the Knowledge Base tab',
      'Switch to Hands-On for interactive experiments',
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
    steps: [
      'Choose a category: Robotics, AI, or Coding',
      'Pick your curriculum/class details',
      'Pick or type a project idea',
      'Generate and download the PDF',
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
    steps: [
      'Search or filter the list',
      'Click a worksheet to preview it',
      'Download its PDF or answer key',
      'Regenerate for a fresh variant, or open Custom to build one by hand',
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
    steps: [
      'Add a section',
      'Choose question types and counts for that section',
      'Add more sections if needed',
      'Generate the finished worksheet',
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
    steps: [
      'Open a worksheet from the Worksheets list or Dashboard',
      'Review its details',
      'Download its PDF here, or from the Worksheets list if this page\'s button isn\'t active',
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
    steps: [
      'Browse your generated activity sheets',
      'Download as PDF or export as Markdown',
      'Regenerate for a fresh variant, or click New to create another',
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
    steps: [
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
    steps: [
      'Browse your generated study material',
      'Download or regenerate an item',
      'Click New to create more',
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
    steps: [
      'Pick board, class, subject, and chapter',
      'Generate the material',
      'Download it',
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
    steps: [
      'Browse your generated projects',
      'Download or regenerate a project\'s PDF',
      'Click New for the standard wizard, or Custom to control the length',
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
    steps: [
      'Pick your curriculum details',
      'Choose a length: short, medium, or long',
      'Generate and download',
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
    steps: [
      'Pick board, class, subject, and chapter',
      'Generate the project',
      'Download it',
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
    steps: [
      'Star a worksheet anywhere in the app',
      'Come back to Favorites to find it again',
      'Unstar to remove it from this list',
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
    steps: [
      'Review users and roles',
      'Check usage analytics',
      'Check the curriculum health summary',
      'Move on to Curriculum Manager, Content Manager, Navigation Menu, or Site Settings to make changes',
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
    steps: [
      'Choose a content type to edit',
      'Edit a record directly, or add an override on top of it',
      'Save your change',
    ],
    tips: [
      'Overrides are safer than direct edits when you\'re not sure -- they can be reverted without touching the original content.',
    ],
    longDescription: [
      'Most of the app\'s reference content -- lab experiments, equipment, reagents, concept cards, and this Help documentation itself -- is registered as an editable content type here rather than hardcoded in a way only a developer could change. Content Manager gives you a single, generic interface across all of them instead of a separate admin screen per content type.',
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
    steps: [
      'Pick a board',
      'Add or edit a class, subject, chapter, or topic',
      'Mark entries verified once reviewed',
    ],
    tips: [
      'If students report a missing subject or chapter elsewhere in the app, this is where it gets added.',
      'See "How To: Roll Out a New Curriculum Topic as an Admin" for the full process, including the sanity check worth doing before announcing anything new.',
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
    steps: [
      'Open Navigation Menu',
      'Add, edit, remove, or reorder an item',
      'Save -- the change applies live to every signed-in user',
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
    steps: [
      'Update branding (name, logo, colors)',
      'Configure voice/speech settings',
      'Save your changes',
    ],
    longDescription: [
      'Branding set here (site name, logo, color scheme) is what actually renders in the top bar, sidebar, and generated PDFs across the whole app -- one central place rather than something configured per page. Voice/speech settings here control the app\'s spoken-content features where they exist.',
    ],
  },

  // -- Troubleshooting & FAQ ------------------------------------------------
  {
    id: 'faq-ai-key-required',
    routes: [],
    category: 'faq',
    title: 'Why does it say "Add your AI provider key"?',
    summary: 'Generation and Ask AI spend your own configured AI key -- there\'s no shared fallback key, so this message means Profile needs one set up first.',
    keyActions: [
      'Open Profile and add an AI provider key under AI Provider',
      'Try generating or asking again once it\'s saved',
    ],
    steps: [
      'Open Profile',
      'Find the AI Provider section',
      'Add your API key',
      'Save, then retry the generation or Ask AI question',
    ],
    longDescription: [
      'Every generator (worksheets, projects, study material, activity sheets, tech projects) and Ask AI runs against your own account\'s configured AI provider key -- this app doesn\'t have a shared key every user draws from. If you haven\'t set one up on Profile yet, any of these will show this message instead of generating anything.',
    ],
  },
  {
    id: 'faq-rate-limited',
    routes: [],
    category: 'faq',
    title: 'Why am I told "Too many questions, please wait a minute"?',
    summary: 'AI-powered actions (generating, or asking Ask AI) are capped at a small number per minute per account, to keep the shared service responsive for everyone.',
    keyActions: [
      'Wait about a minute',
      'Try again',
    ],
    steps: [
      'Stop retrying immediately -- it won\'t succeed faster',
      'Wait roughly a minute',
      'Try your generation or question again',
    ],
    longDescription: [
      'This isn\'t specific to one feature -- every AI-calling action in the app (Generate, Custom Worksheet, Projects, Study Material, Activity Sheets, Tech Projects, and Ask AI) shares the same short-window rate limit per account. It resets automatically after about a minute; there\'s nothing to configure or request an exception for.',
    ],
  },
  {
    id: 'faq-missing-sidebar-item',
    routes: [],
    category: 'faq',
    title: 'Why can\'t I see Study Material, Activity Sheet, or Admin?',
    summary: 'These are role-gated, not missing or broken -- Study Material and Activity Sheet need a teacher/parent account, Admin needs an admin account.',
    keyActions: [
      'Check your role on Profile',
      'Ask whoever administers your school\'s account if you believe your role is wrong',
    ],
    steps: [
      'Open Profile and check your current role',
      'If it matches what you expect but the item is still missing, contact your account administrator',
    ],
    longDescription: [
      'See "Roles: Student, Teacher, Parent, and Admin" for the full breakdown -- in short, Study Material and Activity Sheet assume an adult is using the result, and Admin is a separate infrastructure tier entirely. None of these are things you can self-escalate into from Profile beyond what your account was set up with.',
    ],
  },
  {
    id: 'faq-pdf-not-ready',
    routes: [],
    category: 'faq',
    title: 'Why didn\'t my PDF download, or it says "not ready yet"?',
    summary: 'PDFs are generated right after the content itself, which can take a few seconds -- trying again shortly after usually resolves it.',
    keyActions: [
      'Wait a few seconds and try the download again',
      'Use Regenerate if it still fails, to produce a fresh copy',
    ],
    steps: [
      'Wait a few seconds',
      'Click Download again',
      'If it still fails, use Regenerate on the item to produce a fresh PDF',
    ],
    longDescription: [
      'PDF generation happens as a follow-up step after the worksheet/project/study material/activity sheet content itself is created, so there can be a short gap where the content exists but its PDF isn\'t ready yet. This resolves itself within moments in almost every case; Regenerate is the fallback if a specific item\'s PDF seems permanently stuck.',
    ],
  },
  {
    id: 'faq-missing-chapter',
    routes: [],
    category: 'faq',
    title: 'Why is a subject or chapter missing for my class?',
    summary: 'The curriculum tree is curated by administrators and doesn\'t yet cover every possible board/class/subject/chapter combination -- this is a real content gap, not a search problem.',
    keyActions: [
      'Try a nearby chapter or a broader subject selection',
      'Report the gap to your administrator so they can add it under Admin > Curriculum',
    ],
    steps: [
      'Double-check you\'ve got the right board and class selected',
      'If the subject/chapter genuinely isn\'t in the list, it hasn\'t been added yet',
      'Ask your administrator to add it under Admin > Curriculum',
    ],
    longDescription: [
      'Every picker across the app reads from the same curriculum tree, so if something\'s missing in one place, it\'s missing everywhere -- it\'s not a bug specific to the page you\'re on. Curriculum breadth varies by board and class: for example, Classes 11-12 and the ICSE board were built out more recently than CBSE Classes 1-10, so coverage there, while real and growing, is a smaller set of subjects so far.',
    ],
  },
  {
    id: 'faq-ask-ai-role',
    routes: [],
    category: 'faq',
    title: 'Why is Ask AI only available to teacher and parent accounts?',
    summary: 'Ask AI spends your own configured AI key, same as every generator -- student accounts don\'t have one configured, by design.',
    keyActions: [
      'If you\'re a student wanting this kind of help, ask a teacher or parent to try it',
    ],
    longDescription: [
      'This mirrors the same reasoning as Study Material and Activity Sheets being teacher/parent-only -- it\'s not about trust or maturity, it\'s that the feature spends an AI provider key configured on Profile, and that configuration path is only exposed to teacher/parent accounts in this app today.',
    ],
  },
  {
    id: 'faq-ask-ai-not-streaming',
    routes: [],
    category: 'faq',
    title: 'Why does Ask AI\'s worksheet-request answer appear all at once instead of typing out?',
    summary: 'Deciding whether to take an action (vs. just answering) requires a different kind of AI call than streaming text does -- this is a known, accepted tradeoff, not a bug.',
    keyActions: [],
    longDescription: [
      'Plain questions to Ask AI stream in token by token, the same as a typical chat experience. Worksheet-request answers go through an extra decision step first (deciding whether to propose an action), which technically can\'t be streamed the same way -- so those responses arrive as one complete block a few seconds later instead. This is a deliberate, known tradeoff in how Ask AI\'s action-taking was built, not something going wrong.',
    ],
  },
  {
    id: 'faq-ask-ai-action-card',
    routes: [],
    category: 'faq',
    title: 'I asked Ask AI for a worksheet and got a button instead of a worksheet -- why?',
    summary: 'Ask AI never generates a worksheet directly -- it proposes a pre-filled setup for you to review and click Generate on yourself.',
    keyActions: [
      'Click "Open in Generate" on the action card',
      'Review the pre-filled selection',
      'Click Generate yourself to actually create the worksheet',
    ],
    longDescription: [
      'This is intentional, not a missing step -- see the dedicated "Ask AI" article and "How To: Use Ask AI to Jump-Start a Worksheet" for the full reasoning. Letting you review the curriculum match before anything is generated avoids a wrong guess turning into a wasted generation against your rate limit.',
    ],
  },
  {
    id: 'faq-generate-vs-custom',
    routes: [],
    category: 'faq',
    title: 'What\'s the difference between Generate and Custom Worksheet?',
    summary: 'Generate makes the question-mix decision for you from your curriculum selection; Custom Worksheet hands you direct, section-by-section control instead.',
    keyActions: [
      'Use Generate for the fastest path from curriculum to worksheet',
      'Use Custom Worksheet when you need an exact structure (specific sections, specific counts per type)',
    ],
    longDescription: [
      'Both produce a real, downloadable worksheet with an answer key -- the difference is entirely in how much control you have over question composition. Generate is curriculum-first and faster; Custom Worksheet is structure-first and more deliberate. Neither is "better", they\'re suited to different situations.',
    ],
  },
  {
    id: 'faq-document-types',
    routes: [],
    category: 'faq',
    title: 'What\'s the difference between a Worksheet, Project, Study Material, and Activity Sheet?',
    summary: 'Four genuinely different document shapes -- quiz questions, a structured report, combined teacher/student notes, and a short hands-on task.',
    keyActions: [
      'See "How To: Choose the Right Document Type" for the full comparison',
    ],
    longDescription: [
      'Short version: Worksheet = questions with an answer key. Project = structured prose report with a bibliography. Study Material = one document combining teacher-facing lesson notes and student-facing explanatory content. Activity Sheet = a short, hands-on task with facilitation notes for the adult running it. See the dedicated guide for the full breakdown and when to use each.',
    ],
  },
  {
    id: 'faq-dark-mode',
    routes: [],
    category: 'faq',
    title: 'How do I switch between light and dark mode?',
    summary: 'Click the sun/moon icon in the top bar.',
    keyActions: [
      'Click the sun/moon icon in the top bar to toggle',
    ],
    steps: [
      'Look at the top bar, right side',
      'Click the sun or moon icon',
    ],
    longDescription: [
      'The toggle is available on every dashboard page in the same spot -- the top bar, near the help and notification icons. Your preference is remembered for future visits.',
    ],
  },
  {
    id: 'faq-change-role',
    routes: [],
    category: 'faq',
    title: 'How do I change my role?',
    summary: 'Some role changes are self-service from Profile; anything beyond that needs whoever administers your school\'s account.',
    keyActions: [
      'Check Profile first for a role option',
      'Otherwise, contact your account administrator',
    ],
    longDescription: [
      'See "Roles: Student, Teacher, Parent, and Admin" for what each role actually unlocks before requesting a change -- a missing sidebar item is more often expected role-gating than something worth escalating.',
    ],
  },
  {
    id: 'faq-mobile-nav',
    routes: [],
    category: 'faq',
    title: 'I\'m on my phone and can\'t find the sidebar -- where did it go?',
    summary: 'On a phone or narrow window, the sidebar collapses into a menu icon that opens the same navigation as a slide-out drawer.',
    keyActions: [
      'Tap the menu icon (usually top-left) to open the navigation drawer',
    ],
    steps: [
      'Tap the menu icon, top-left of the top bar',
      'Use the slide-out drawer the same way you\'d use the sidebar on a larger screen',
    ],
    longDescription: [
      'Nothing is actually missing on mobile -- the same navigation exists, just reachable through a drawer instead of a fixed column, to save space on a small screen. See "Finding Your Way Around the App" for the full layout tour.',
    ],
  },
  {
    id: 'faq-delete-worksheet',
    routes: [],
    category: 'faq',
    title: 'How do I delete a worksheet or project?',
    summary: 'Open the item from its library list (Worksheets, Projects, Study Material, or Activity Sheet) and use the delete option there.',
    keyActions: [
      'Open the relevant library list',
      'Find the item and use its delete option',
    ],
    longDescription: [
      'Deletion is per-item from within each library list -- there\'s no bulk-delete across your whole library. If you\'re trying to tidy up rather than permanently remove something, consider just leaving it unstarred so it doesn\'t appear in Favorites, rather than deleting it outright.',
    ],
  },
  {
    id: 'faq-simulation-honesty',
    routes: [],
    category: 'faq',
    title: 'Are the labs really calculating results, or just showing an animation?',
    summary: 'Genuinely calculated, with one honest, explicitly-labeled exception: real-world signal reception (like an actual radio broadcast) that a browser can\'t physically do.',
    keyActions: [
      'See each lab\'s own article for how its calculation actually works',
    ],
    longDescription: [
      'Every lab\'s results come from real underlying rules applied to your actual inputs -- Ohm\'s Law and component thresholds in Electronics Lab, real reaction behavior in Chemistry, real physical formulas in Physics, and so on -- not a fixed animation that plays regardless of what you did. The one honestly-stated exception is Electronics Lab\'s handling of real analog/RF signal reception, which a browser genuinely cannot do -- any project needing that plays a clearly-labeled simulated output instead of pretending to receive a real signal.',
    ],
  },
  {
    id: 'faq-oscilloscope-blank',
    routes: [],
    category: 'faq',
    title: 'Why does the Electronics Lab oscilloscope show nothing?',
    summary: 'The oscilloscope only shows a trace once the relevant part of your circuit is electrically complete -- a blank screen usually means the wiring isn\'t finished or is incorrect.',
    keyActions: [
      'Check your wiring against the "Now Placing" guidance and the reference circuit',
      'Confirm every connection the circuit needs is actually wired, not just placed',
    ],
    longDescription: [
      'Placing a component isn\'t the same as wiring it -- the oscilloscope reflects a genuinely calculated voltage trace, so if the circuit isn\'t actually complete (a missing wire, a component in the wrong position), there\'s nothing real to show yet. This is accurate behavior, the same as a real oscilloscope on an incomplete real circuit, not a rendering bug.',
    ],
  },
  {
    id: 'faq-language',
    routes: [],
    category: 'faq',
    title: 'Can I generate material in Hindi or another language?',
    summary: 'Several generators support a language setting -- check the generator\'s own options; availability can vary by document type.',
    keyActions: [
      'Look for a language option on the relevant generator before generating',
    ],
    longDescription: [
      'Language support exists at the generator level rather than as a single global app setting, so check the specific tool you\'re using (Generate, Custom Worksheet, Projects, Study Material, Activity Sheets) for its own language option rather than assuming it\'s set elsewhere.',
    ],
  },
  {
    id: 'faq-regenerate-vs-edit',
    routes: [],
    category: 'faq',
    title: 'Can I edit a worksheet after generating it, or only regenerate?',
    summary: 'There\'s no in-place question editor -- Regenerate produces a fresh variant on the same curriculum selection, it doesn\'t modify the original.',
    keyActions: [
      'Use Regenerate for a fresh variant if the current one isn\'t right',
      'Use Custom Worksheet from the start if you need precise control over the exact questions',
    ],
    longDescription: [
      'Regenerate and the original worksheet both exist afterward -- regenerating never overwrites or edits what you already had, it creates a new one alongside it. If you need fine control over exact question content rather than a fresh AI-generated variant, Custom Worksheet\'s section-by-section builder is the closer fit, though it still doesn\'t offer after-the-fact editing of individual generated questions.',
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
