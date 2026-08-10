'use client';
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Sparkles, FileText, FileStack, Heart, User, BookOpen, ClipboardList, Cpu, FlaskConical, Atom, Leaf } from 'lucide-react';
import { useWizardStore } from '@/store/useWizardStore';
import { useWorksheetStore } from '@/store/useWorksheetStore';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
}

// Single source of truth for "what's in the app's main navigation" -- used
// by both the desktop Sidebar and the mobile drawer (MobileMenu), so the
// two can never drift out of sync the way a bottom tab bar and a full
// sidebar naturally would if each kept its own hand-written list.
export function useNavItems(): NavItem[] {
  const resetWizard = useWizardStore((s) => s.reset);
  const role = useWorksheetStore((s) => s.userProfile.role);
  // Additive: students keep exactly today's flow. Teachers/parents get
  // everything students get, plus Study Material. See middleware/auth.ts's
  // requireRole for the server-side enforcement this UI gating mirrors.
  const isTeacherOrParent = role === 'teacher' || role === 'parent';

  return [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/generate', label: 'Generate', icon: Sparkles, onClick: resetWizard },
    { href: '/worksheets', label: 'My Worksheets', icon: FileText },
    { href: '/projects', label: 'My Projects', icon: FileStack },
    // Tech Lab (Robotics/AI/Coding) is open to every role -- unlike Study
    // Material/Activity Sheet, students build these for themselves too. See
    // apps/api/src/routes/techProjectRoutes.ts (requireAuth only, no
    // requireRole gate). Same for Chem Lab and Physics Lab.
    { href: '/tech-lab', label: 'Tech Lab', icon: Cpu },
    { href: '/chem-lab', label: 'Chem Lab', icon: FlaskConical },
    { href: '/physics-lab', label: 'Physics Lab', icon: Atom },
    { href: '/biology-lab', label: 'Biology Lab', icon: Leaf },
    ...(isTeacherOrParent ? [
      { href: '/study-material', label: 'Study Material', icon: BookOpen },
      { href: '/activity-sheet', label: 'Activity Sheet', icon: ClipboardList },
    ] : []),
    { href: '/favorites', label: 'Favorites', icon: Heart },
    { href: '/profile', label: 'Profile', icon: User },
  ];
}
