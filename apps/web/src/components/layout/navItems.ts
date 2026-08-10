'use client';
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Sparkles, FileText, FileStack, Heart, User, BookOpen, ClipboardList, Cpu, FlaskConical, Atom, Leaf, Library, Calculator } from 'lucide-react';
import { useWizardStore } from '@/store/useWizardStore';
import { useWorksheetStore } from '@/store/useWorksheetStore';

export interface NavLink {
  type?: 'link';
  href: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
}

// A collapsible section -- e.g. "My Library" or "Virtual Labs" -- rendered
// by NavGroupSection.tsx. Has no href of its own; it just toggles open/shut.
export interface NavGroup {
  type: 'group';
  label: string;
  icon: LucideIcon;
  items: NavLink[];
}

export type NavEntry = NavLink | NavGroup;

// Single source of truth for "what's in the app's main navigation" -- used
// by both the desktop Sidebar and the mobile drawer (MobileMenu), so the
// two can never drift out of sync the way a bottom tab bar and a full
// sidebar naturally would if each kept its own hand-written list.
//
// Grouped into two collapsible sections (via NavGroup) once the flat list
// grew to ~10-12 items and started feeling scattered: "My Library" holds
// every generated-document type (Worksheets/Projects/Study Material/
// Activity Sheet), "Virtual Labs" holds the four interactive labs. Dashboard,
// Generate, Favorites, and Profile stay top-level since they're used every
// visit and aren't "a kind of content" the way the grouped items are.
export function useNavItems(): NavEntry[] {
  const resetWizard = useWizardStore((s) => s.reset);
  const role = useWorksheetStore((s) => s.userProfile.role);
  // Additive: students keep exactly today's flow. Teachers/parents get
  // everything students get, plus Study Material. See middleware/auth.ts's
  // requireRole for the server-side enforcement this UI gating mirrors.
  const isTeacherOrParent = role === 'teacher' || role === 'parent';

  return [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/generate', label: 'Generate Worksheet', icon: Sparkles, onClick: resetWizard },
    {
      type: 'group',
      label: 'My Library',
      icon: Library,
      items: [
        { href: '/worksheets', label: 'My Worksheets', icon: FileText },
        { href: '/projects', label: 'My Projects', icon: FileStack },
        ...(isTeacherOrParent ? [
          { href: '/study-material', label: 'Study Material', icon: BookOpen },
          { href: '/activity-sheet', label: 'Activity Sheet', icon: ClipboardList },
        ] : []),
      ],
    },
    {
      type: 'group',
      label: 'Virtual Labs',
      icon: FlaskConical,
      // Tech Lab (Robotics/AI/Coding) is open to every role -- unlike Study
      // Material/Activity Sheet, students build these for themselves too. See
      // apps/api/src/routes/techProjectRoutes.ts (requireAuth only, no
      // requireRole gate). Same for Chem/Physics/Biology Lab.
      items: [
        { href: '/tech-lab', label: 'Tech Lab', icon: Cpu },
        { href: '/chem-lab', label: 'Chem Lab', icon: FlaskConical },
        { href: '/physics-lab', label: 'Physics Lab', icon: Atom },
        { href: '/biology-lab', label: 'Biology Lab', icon: Leaf },
        { href: '/math-lab', label: 'Math Lab', icon: Calculator },
      ],
    },
    { href: '/favorites', label: 'Favorites', icon: Heart },
    { href: '/profile', label: 'Profile', icon: User },
  ];
}
