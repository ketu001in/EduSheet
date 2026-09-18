'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import { NavLinkContent } from './NavLinkContent';
import type { NavLink as NavLinkItem } from './navItems';

// One collapsible group in the sidebar/mobile drawer -- e.g. "My Library"
// (Worksheets/Projects/Study Material/Activity Sheet) or "Virtual Labs"
// (Tech/Chem/Physics/Biology Lab). Auto-expands the moment one of its own
// children is the active route, so landing on e.g. /physics-lab directly
// (a refresh, a bookmark) never leaves the group looking collapsed and
// empty; otherwise it's a plain manual toggle that stays how the user left
// it. Shared between Sidebar and MobileMenu so the two can't drift apart,
// matching how useNavItems() is already shared for the flat entries.
export function NavGroupSection({ label, icon: Icon, items }: {
  label: string;
  icon: LucideIcon;
  items: NavLinkItem[];
}) {
  const pathname = usePathname();
  const isChildActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`);
  const hasActiveChild = items.some((item) => isChildActive(item.href));
  const [open, setOpen] = useState(hasActiveChild);

  useEffect(() => {
    if (hasActiveChild) setOpen(true);
  }, [hasActiveChild]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
          hasActiveChild
            ? 'text-primary-600 dark:text-primary-400 font-bold'
            : 'text-slate-600 dark:text-slate-400 hover:bg-secondary-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Icon className={`w-5 h-5 shrink-0 ${hasActiveChild ? '' : 'text-slate-400'}`} />
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-200 dark:border-slate-800 space-y-1">
          {items.map((item) => {
            const active = isChildActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={item.onClick}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all active:scale-[0.97] font-medium text-sm cursor-pointer border-2 ${
                  active
                    ? 'bg-primary-600 text-white border-slate-900 dark:border-[#FDF3D9] shadow-[3px_3px_0_var(--color-ink)] dark:shadow-[3px_3px_0_rgba(253,243,217,0.9)] font-bold'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-secondary-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <NavLinkContent icon={item.icon} label={item.label} isActive={active} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
