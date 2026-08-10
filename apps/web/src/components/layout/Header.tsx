'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Bell, Search, Moon, Sun, User, KeyRound, LogOut, ChevronDown, Loader2 } from 'lucide-react';
import { useWorksheetStore } from '@/store/useWorksheetStore';
import { createClient } from '@/lib/supabase/client';
import { api } from '@/lib/api';
import { useLogout } from '@/hooks/useLogout';
import { useClickOutside } from '@/hooks/useClickOutside';
import MobileMenu from './MobileMenu';

interface NotificationRow {
  id: string;
  title: string;
  message: string | null;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { searchQuery, setSearchQuery, userProfile, updateProfile, hasLoadedProfile } = useWorksheetStore();
  const { logout, isLoggingOut } = useLogout();

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [notifLoaded, setNotifLoaded] = useState(false);
  const notifRef = useClickOutside<HTMLDivElement>(() => setNotifOpen(false), notifOpen);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useClickOutside<HTMLDivElement>(() => setMenuOpen(false), menuOpen);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const dark = saved ? saved === 'dark' : document.documentElement.classList.contains('dark');
    setIsDarkMode(dark);
  }, []);

  // Load the real signed-in user's name/board/grade once per session, in place
  // of the generic default profile shown before this ran.
  useEffect(() => {
    if (hasLoadedProfile) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data, error }) => {
      // Bail out entirely if there's no signed-in user -- in particular,
      // this guards the role fetch below. resetSession() (see useLogout)
      // flips hasLoadedProfile back to false on logout, which re-triggers
      // this effect while the session has already been cleared; without
      // this guard, the api.get call below fires with no auth token and
      // logs a 401 on every logout.
      if (error || !data.user) return;
      const meta = data.user.user_metadata || {};
      updateProfile({
        name: meta.full_name || data.user.email?.split('@')[0] || 'Student',
        email: data.user.email || '',
        board: meta.board || 'CBSE',
        grade: meta.grade ? `Class ${meta.grade}` : '',
      });

      // Role must come from the backend (public.users.role), not Supabase Auth
      // user_metadata -- that only ever reflects the role picked at signup and
      // goes stale the moment someone self-changes their role from Profile
      // settings. This is what actually gates the Study Material nav item.
      api.get<{ success: boolean; data: { users?: { role?: string } } }>('/api/users/profile')
        .then((res) => {
          const role = res.data.users?.role;
          if (role) updateProfile({ role: role as any });
        })
        .catch((err) => console.error('Failed to load user role:', err));
    });
  }, [hasLoadedProfile, updateProfile]);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setIsDarkMode(next);
  };

  const openNotifications = useCallback(async () => {
    setNotifOpen((v) => !v);
    if (notifLoaded) return;
    try {
      const res = await api.get<{ success: boolean; data: NotificationRow[] }>('/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setNotifLoaded(true);
    }
  }, [notifLoaded]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await api.patch('/api/notifications/read-all');
    } catch (err) {
      console.error('Failed to mark notifications read:', err);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'ED';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 border-b-[3px] border-slate-900 dark:border-[#FDF3D9] bg-surface-light dark:bg-surface-dark flex items-center justify-between gap-2 px-3 sm:px-6 sticky top-0 z-40 transition-colors">
      <div className="flex items-center gap-1 sm:gap-3 flex-1 min-w-0">
        <MobileMenu />
        <div className="relative flex-1 min-w-0 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search worksheets, subjects, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-light dark:bg-surface-dark rounded-full border-2 border-slate-900 dark:border-[#FDF3D9]/80 focus:border-primary-600 outline-none text-sm transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-3 shrink-0">
        <button
          onClick={toggleDarkMode}
          title="Toggle Dark Mode"
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-secondary-500" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={openNotifications}
            title="Notifications"
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full"></span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b-2 border-slate-900 dark:border-[#FDF3D9]/40">
                <span className="font-bold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {!notifLoaded && (
                  <div className="p-6 flex items-center justify-center text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                )}
                {notifLoaded && notifications.length === 0 && (
                  <div className="p-6 text-center text-sm text-slate-400">You&apos;re all caught up — no notifications yet.</div>
                )}
                {notifications.map((n) => (
                  <div key={n.id} className={`px-4 py-3 border-b border-slate-50 dark:border-slate-800/60 text-sm ${!n.is_read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</p>
                    {n.message && <p className="text-slate-500 text-xs mt-0.5">{n.message}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1"></div>

        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-3 rounded-xl px-1.5 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-primary-600 border-2 border-slate-900 dark:border-[#FDF3D9]/80 text-white font-bold flex items-center justify-center text-sm">
              {getInitials(userProfile?.name)}
            </div>
            <div className="hidden md:block text-left text-xs">
              <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{userProfile?.name || 'Student'}</p>
              <p className="text-slate-400 font-medium">{userProfile?.grade ? `${userProfile.grade} • ` : ''}{userProfile?.board || 'CBSE'}</p>
            </div>
            <ChevronDown className={`hidden md:block w-4 h-4 text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl overflow-hidden z-50 py-1.5">
              <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                <User className="w-4 h-4" /> Edit Profile
              </Link>
              <Link href="/profile#security" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                <KeyRound className="w-4 h-4" /> Change Password
              </Link>
              <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />
              <button
                onClick={logout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" /> {isLoggingOut ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
