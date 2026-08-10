'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Users, Menu as MenuIcon, Settings, Loader2, Database } from 'lucide-react';
import { useWorksheetStore } from '@/store/useWorksheetStore';

const ADMIN_TABS = [
  { href: '/admin', label: 'Users & Analytics', icon: Users },
  { href: '/admin/menu', label: 'Menu Manager', icon: MenuIcon },
  { href: '/admin/content', label: 'Content Manager', icon: Database },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
];

// CMS Phase 1's admin area. Gated client-side here for UX (redirect a
// non-admin straight back to their dashboard instead of showing a broken
// page) -- the REAL enforcement is server-side: every /api/admin,
// /api/nav-config (mutations), and /api/site-settings (mutations) route is
// behind requireRole('admin'), same as every other role-gated route in
// this app. Hiding a button is not access control; that's what actually
// stops a non-admin account from calling these endpoints directly.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const role = useWorksheetStore((s) => s.userProfile.role);
  const hasLoadedProfile = useWorksheetStore((s) => s.hasLoadedProfile);

  useEffect(() => {
    if (hasLoadedProfile && role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [hasLoadedProfile, role, router]);

  if (!hasLoadedProfile) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
      </div>
    );
  }
  if (role !== 'admin') return null; // redirect is in flight

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2"><ShieldCheck className="w-7 h-7 text-primary-600" /> Admin</h1>
        <p className="text-slate-500 text-sm">Manage users, the site&apos;s navigation menu, and site-wide settings -- changes apply to everyone immediately.</p>
      </div>

      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-fit">
        {ADMIN_TABS.map((t) => {
          const active = pathname === t.href;
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${active ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
