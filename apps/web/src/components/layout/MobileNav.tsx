'use client';
import Link, { useLinkStatus } from 'next/link';
import { Home, Sparkles, FileText, Heart, User, Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useWizardStore } from '@/store/useWizardStore';

// Child of <Link> -- useLinkStatus only works inside one. Swaps the icon for
// a spinner while the route transition is pending, so a tap gives instant
// feedback instead of feeling unresponsive during page compile/fetch.
function MobileNavIcon({ icon: Icon, isActive }: { icon: typeof Home; isActive: boolean }) {
  const { pending } = useLinkStatus();
  const cls = `w-5 h-5 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400'}`;
  return pending ? <Loader2 className={`${cls} animate-spin`} /> : <Icon className={cls} />;
}

export default function MobileNav() {
  const pathname = usePathname();
  const resetWizard = useWizardStore((s) => s.reset);

  const navItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Generate', href: '/generate', icon: Sparkles, onClick: resetWizard },
    { name: 'Files', href: '/worksheets', icon: FileText },
    { name: 'Favorites', href: '/favorites', icon: Heart },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="print:hidden lg:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-slate-200 dark:border-slate-800 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-lg flex items-center justify-around z-50 px-2 pb-safe">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={item.onClick}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all active:scale-[0.92] active:bg-slate-100 dark:active:bg-slate-800/60 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400'}`}
          >
            <MobileNavIcon icon={item.icon} isActive={isActive} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
