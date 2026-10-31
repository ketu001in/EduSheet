// Shared types for the in-app Help system: the same content feeds the "?"
// contextual drawer (compact, but includes longDescription too -- see
// HelpPanel.tsx), the /help Documentation Center (full article), and the
// downloadable PDF user guide (same data, printable layout). One content
// source, three consumers -- see helpRegistry.ts.

export type HelpCategory = 'getting-started' | 'labs' | 'library' | 'admin' | 'account' | 'faq';

export interface HelpCategoryInfo {
  id: HelpCategory;
  label: string;
  description: string;
}

export const HELP_CATEGORIES: HelpCategoryInfo[] = [
  { id: 'getting-started', label: 'Getting Started', description: 'The basics, role-based onboarding journeys, and cross-page how-to guides.' },
  { id: 'labs', label: 'Virtual Labs', description: 'Hands-on simulations for Math, Physics, Chemistry, Biology, Electronics, and Tech.' },
  { id: 'library', label: 'My Library', description: 'Worksheets, activity sheets, study material, and projects you generate and keep.' },
  { id: 'admin', label: 'Admin Tools', description: 'Curriculum, content, navigation, and site settings for administrators.' },
  { id: 'account', label: 'Account & Dashboard', description: 'Your dashboard, profile, the worksheet generator, and Ask AI.' },
  { id: 'faq', label: 'Troubleshooting & FAQ', description: 'Common questions and the real reasons behind them -- error messages, role visibility, and how features actually differ.' },
];

export interface DocRouteEntry {
  id: string; // slug, used for /help/[slug]
  // Path(s) this entry answers help for. A route ending in '/' matches any
  // path starting with it (used for dynamic segments like worksheets/[id]);
  // otherwise it must match exactly. getHelpEntryForPath prefers an exact
  // match, then the longest matching prefix. Entries with no page of their
  // own (concept articles, role journeys, cross-page guides, FAQ) use [].
  routes: string[];
  category: HelpCategory;
  title: string;
  summary: string; // 1-2 sentences -- shown in the drawer and at the top of the article
  keyActions: string[]; // "What you can do here" bullets -- drawer + article
  // Numbered "how to do the main task here" walkthrough -- distinct from
  // keyActions (quick bullets of what's possible) and longDescription
  // (context/why) -- drawer, article, and PDF.
  steps?: string[];
  tips?: string[]; // optional gotchas / pro-tips -- drawer + article
  longDescription?: string[]; // fuller explanatory paragraphs -- drawer, article, and PDF
}
