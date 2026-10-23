'use client';
import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Sparkles, FileText, FileStack, Heart, User, BookOpen, ClipboardList, Cpu, FlaskConical, Atom, Leaf, Library, Calculator, Zap } from 'lucide-react';
import { useWizardStore } from '@/store/useWizardStore';
import { useWorksheetStore } from '@/store/useWorksheetStore';
import { fetchNavConfig, NavConfigEntry } from '@/lib/navConfig';
import { resolveIcon } from '@/lib/iconRegistry';

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

// CMS Phase 1: the real nav config now lives in the nav_items DB table,
// editable at /admin/menu -- this static array is ONLY the fallback shown
// instantly while the live config loads (or if the fetch fails/the user is
// offline), so the sidebar is never empty for a flash of missing content.
// Keep it roughly in sync with whatever admins have configured as "normal"
// -- it doesn't need to be perfect, it's a safety net, not the source of
// truth anymore.
function buildStaticFallback(isTeacherOrParent: boolean, resetWizard: () => void): NavEntry[] {
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
      items: [
        { href: '/tech-lab', label: 'Tech Lab', icon: Cpu },
        { href: '/chem-lab', label: 'Chem Lab', icon: FlaskConical },
        { href: '/physics-lab', label: 'Physics Lab', icon: Atom },
        { href: '/biology-lab', label: 'Biology Lab', icon: Leaf },
        { href: '/math-lab', label: 'Math Lab', icon: Calculator },
        { href: '/electronics-lab', label: 'Electronics Lab', icon: Zap },
      ],
    },
    { href: '/favorites', label: 'Favorites', icon: Heart },
    { href: '/profile', label: 'Profile', icon: User },
  ];
}

// Module-level cache so Sidebar and MobileMenu (both mounted at once, both
// calling this hook independently) share one fetch instead of firing two
// identical requests every page load.
let cachedLiveConfig: NavConfigEntry[] | null = null;
let inFlightFetch: Promise<NavConfigEntry[]> | null = null;

function getLiveNavConfig(): Promise<NavConfigEntry[]> {
  if (cachedLiveConfig) return Promise.resolve(cachedLiveConfig);
  if (!inFlightFetch) {
    inFlightFetch = fetchNavConfig()
      .then((res) => {
        cachedLiveConfig = res.data;
        return res.data;
      })
      .finally(() => { inFlightFetch = null; });
  }
  return inFlightFetch;
}

function mapConfigToEntries(config: NavConfigEntry[], resetWizard: () => void): NavEntry[] {
  const toLink = (item: { href: string | null; label: string; iconName: string }): NavLink => ({
    href: item.href || '#',
    label: item.label,
    icon: resolveIcon(item.iconName),
    onClick: item.href === '/generate' ? resetWizard : undefined,
  });
  return config.map((entry) =>
    entry.type === 'group'
      ? { type: 'group', label: entry.label, icon: resolveIcon(entry.iconName), items: entry.items.map(toLink) }
      : toLink(entry)
  );
}

// Single source of truth for "what's in the app's main navigation" -- used
// by both the desktop Sidebar and the mobile drawer (MobileMenu), so the
// two can never drift out of sync. As of CMS Phase 1, the real config is
// fetched live from /api/nav-config (already role-filtered server-side);
// buildStaticFallback() above is only the instant-paint placeholder.
export function useNavItems(): NavEntry[] {
  const resetWizard = useWizardStore((s) => s.reset);
  const role = useWorksheetStore((s) => s.userProfile.role);
  const isTeacherOrParent = role === 'teacher' || role === 'parent';

  const [liveEntries, setLiveEntries] = useState<NavEntry[] | null>(cachedLiveConfig ? mapConfigToEntries(cachedLiveConfig, resetWizard) : null);

  useEffect(() => {
    let cancelled = false;
    getLiveNavConfig()
      .then((config) => { if (!cancelled) setLiveEntries(mapConfigToEntries(config, resetWizard)); })
      .catch(() => { /* keep the static fallback -- a nav fetch failure shouldn't break navigation */ });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return liveEntries ?? buildStaticFallback(isTeacherOrParent, resetWizard);
}
