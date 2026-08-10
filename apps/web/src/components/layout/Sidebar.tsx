'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useLogout } from '@/hooks/useLogout';
import { NavLinkContent } from './NavLinkContent';
import { NavGroupSection } from './NavGroupSection';
import { useNavItems } from './navItems';
import { useBranding } from './BrandingProvider';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, isLoggingOut } = useLogout();
  const navItems = useNavItems();
  const branding = useBranding();

  return (
    <aside className="w-64 border-r-[3px] border-slate-900 dark:border-[#FDF3D9] bg-surface-light dark:bg-surface-dark flex-col h-full hidden lg:flex select-none transition-colors">
      <Link href="/dashboard" className="p-6 flex items-center gap-3 border-b-[3px] border-slate-900 dark:border-[#FDF3D9] hover:bg-secondary-50 dark:hover:bg-slate-800/40 transition-colors">
        <Logo size={36} overrideSrc={branding.logoUrl || undefined} />
        <div className="min-w-0">
          <span className="font-display text-lg font-semibold tracking-tight text-slate-900 dark:text-white leading-tight block truncate">
            {branding.siteName}
          </span>
          <span className="block text-[10px] text-primary-600 dark:text-primary-300 font-bold uppercase tracking-wider">{branding.tagline}</span>
        </div>
      </Link>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          if (item.type === 'group') {
            return <NavGroupSection key={item.label} label={item.label} icon={item.icon} items={item.items} />;
          }
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={item.onClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-[0.97] font-medium text-sm cursor-pointer border-2 ${
                isActive
                  ? 'bg-primary-600 text-white border-slate-900 dark:border-[#FDF3D9] shadow-[3px_3px_0_var(--color-ink)] dark:shadow-[3px_3px_0_rgba(253,243,217,0.9)] font-bold'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-secondary-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white hover:border-slate-900 dark:hover:border-[#FDF3D9]/60'
              }`}
            >
              <NavLinkContent icon={item.icon} label={item.label} isActive={isActive} />
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t-[3px] border-slate-900 dark:border-[#FDF3D9] space-y-3">
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
