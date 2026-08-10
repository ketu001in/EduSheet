import {
  LayoutDashboard, Sparkles, FileText, FileStack, Heart, User, BookOpen, ClipboardList,
  Cpu, FlaskConical, Atom, Leaf, Library, Calculator, ShieldCheck, Home, Star, Award,
  Settings, Users, LineChart, Gamepad2, BookOpenCheck, Ruler, Scroll, Landmark,
  type LucideIcon,
} from 'lucide-react';

// Nav items now live in the DB (CMS Phase 1) as a plain `icon_name` string
// rather than a real component reference -- can't store a React component
// in Postgres. This is the allowlist that maps a stored name back to an
// actual icon component. Deliberately an allowlist, not a dynamic lookup
// into lucide's full export set -- an admin typing an arbitrary string
// into Menu Manager should never be able to reference something that
// doesn't render cleanly (or, worse, isn't actually an icon component).
export const ICON_REGISTRY: Record<string, LucideIcon> = {
  LayoutDashboard, Sparkles, FileText, FileStack, Heart, User, BookOpen, ClipboardList,
  Cpu, FlaskConical, Atom, Leaf, Library, Calculator, ShieldCheck, Home, Star, Award,
  Settings, Users, LineChart, Gamepad2, BookOpenCheck, Ruler, Scroll, Landmark,
};

export const ICON_NAMES = Object.keys(ICON_REGISTRY);

export function resolveIcon(name: string): LucideIcon {
  return ICON_REGISTRY[name] || Star; // Star is the visible "unrecognized icon" fallback
}
