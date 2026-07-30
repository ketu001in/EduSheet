'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Sparkles, FileText, FileStack, Heart, User, LogOut } from 'lucide-react';
import { useWizardStore } from '@/store/useWizardStore';
import { Logo } from '@/components/Logo';
import { useLogout } from '@/hooks/useLogout';
import { NavLinkContent } from './NavLinkContent';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, isLoggingOut } = useLogout();
  const resetWizard = useWizardStore((s) => s.reset);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/generate', label: 'Generate', icon: Sparkles, onClick: resetWizard },
    { href: '/worksheets', label: 'My Worksheets', icon: FileText },
    { href: '/projects', label: 'My Projects', icon: FileStack },
    { href: '/favorites', label: 'Favorites', icon: Heart },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800/80 bg-surface-light dark:bg-surface-dark flex-col h-full hidden lg:flex select-none transition-colors">
      <Link href="/dashboard" className="p-6 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
        <Logo size={36} />
        <div className="min-w-0">
          <span className="font-display text-lg font-semibold tracking-tight text-slate-900 dark:text-white leading-tight block truncate">
            Bosket&apos;s EduSheet
          </span>
          <span className="block text-[10px] text-primary-600 dark:text-primary-300 font-bold uppercase tracking-wider">AI Study Companion</span>
        </div>
      </Link>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={item.onClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-[0.97] font-medium text-sm cursor-pointer ${
                isActive
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <NavLinkContent icon={item.icon} label={item.label} isActive={isActive} />
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
        <button
          onClick={logout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition-colors font-medium text-sm disabled:opacity-50"
        >
          <LogOut className="w-5 h-5" /> {isLoggingOut ? 'Signing out...' : 'Logout'}
        </button>
        <div className="flex items-center justify-between px-1 text-[10px] text-slate-400">
          <span>&copy; {new Date().getFullYear()} Bosket&apos;s Tech Ventures</span>
          <Link href="/privacy" className="hover:text-primary-600 dark:hover:text-primary-400 hover:underline">Privacy</Link>
        </div>
      </div>
    </aside>
  );
}
