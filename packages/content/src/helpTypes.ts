// Shared types for the in-app Help system: the same content feeds the F1
// contextual drawer (compact), the /help Documentation Center (full
// article), and the downloadable PDF user guide (same data, printable
// layout). One content source, three consumers -- see helpRegistry.ts.

export type HelpCategory = 'getting-started' | 'labs' | 'library' | 'admin' | 'account';

export interface HelpCategoryInfo {
  id: HelpCategory;
  label: string;
  description: string;
}

export const HELP_CATEGORIES: HelpCategoryInfo[] = [
  { id: 'getting-started', label: 'Getting Started', description: 'The basics: what this tool is, how boards/classes/curriculum work, and who does what.' },
  { id: 'labs', label: 'Virtual Labs', description: 'Hands-on simulations for Math, Physics, Chemistry, Biology, Electronics, and Tech.' },
  { id: 'library', label: 'My Library', description: 'Worksheets, activity sheets, study material, and projects you generate and keep.' },
  { id: 'admin', label: 'Admin Tools', description: 'Curriculum, content, navigation, and site settings for administrators.' },
  { id: 'account', label: 'Account & Dashboard', description: 'Your dashboard, profile, and the worksheet generator.' },
];

export interface DocRouteEntry {
  id: string; // slug, used for /help/[slug]
  // Path(s) this entry answers F1 help for. A route ending in '/' matches
  // any path starting with it (used for dynamic segments like
  // worksheets/[id]); otherwise it must match exactly. getHelpEntryForPath
  // prefers an exact match, then the longest matching prefix.
  routes: string[];
  category: HelpCategory;
  title: string;
  summary: string; // 1-2 sentences -- shown in the F1 drawer and at the top of the article
  keyActions: string[]; // "What you can do here" bullets -- F1 drawer + article
  tips?: string[]; // optional gotchas / pro-tips -- F1 drawer + article
  longDescription?: string[]; // extra paragraphs, article page and PDF only (not the F1 drawer)
}
