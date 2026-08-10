'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useLogout } from '@/hooks/useLogout';
import { NavLinkContent } from './NavLinkContent';
import { useNavItems } from './navItems';

// The full site nav as a slide-in drawer, for viewports below `lg` where
// Sidebar is hidden. Before this existed, the ONLY mobile nav was
// MobileNav's 5-icon bottom bar -- there was no way to reach Tech Lab,
// Chem Lab, Physics Lab, My Projects, Study Material, Activity Sheet, or
// Logout from a phone at all. Shares its item list with Sidebar via
// useNavItems() so the two can't drift apart again.
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const navItems = useNavItems();
  const { logout, isLoggingOut } = useLogout();

  // Closing on route change covers back/forward navigation and any nav
  // that doesn't go through a plain <Link> click inside the drawer.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent the page behind the drawer from scrolling while it's open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="lg:hidden -ml-1.5 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[mobile-drawer-fade_0.2s_ease-out]" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[80vw] max-w-72 bg-surface-light dark:bg-surface-dark border-r-[3px] border-slate-900 dark:border-[#FDF3D9] flex flex-col animate-[mobile-drawer-slide-in_0.22s_ease-out]">
            <div className="p-5 flex items-center justify-between border-b-[3px] border-slate-900 dark:border-[#FDF3D9]">
              <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
                <Logo size={32} />
                <span className="font-display text-sm font-semibold tracking-tight text-slate-900 dark:text-white truncate">
                  Bosket&apos;s EDStudio
                </span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={item.onClick}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-[0.97] font-medium text-sm cursor-pointer border-2 ${
                      isActive
                        ? 'bg-primary-600 text-white border-slate-900 dark:border-[#FDF3D9] shadow-[3px_3px_0_var(--color-ink)] dark:shadow-[3px_3px_0_rgba(253,243,217,0.9)] font-bold'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-secondary-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <NavLinkContent icon={item.icon} label={item.label} isActive={isActive} />
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t-[3px] border-slate-900 dark:border-[#FDF3D9]">
              <button
                onClick={logout}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition-colors font-medium text-sm disabled:opacity-50"
              >
                <LogOut className="w-5 h-5" /> {isLoggingOut ? 'Signing out...' : 'Logout'}
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
