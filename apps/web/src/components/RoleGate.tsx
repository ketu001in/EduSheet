'use client';
import Link from 'next/link';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useWorksheetStore, UserRole } from '@/store/useWorksheetStore';

// Client-side mirror of the server-side requireRole gate (see
// apps/api/src/middleware/auth.ts) -- the backend is what actually enforces
// this, but without this, a student hitting a teacher/parent-only page
// directly (e.g. a bookmarked URL) would see a raw failed-fetch/console error
// instead of a clear "you need a different account type" message.
export default function RoleGate({ allow, children }: { allow: UserRole[]; children: React.ReactNode }) {
  const role = useWorksheetStore((s) => s.userProfile.role);
  const hasLoadedProfile = useWorksheetStore((s) => s.hasLoadedProfile);

  if (!hasLoadedProfile) {
    return (
      <div className="max-w-4xl mx-auto py-24 flex items-center justify-center gap-2 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading...
      </div>
    );
  }

  if (!role || !allow.includes(role)) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">Teacher/Parent Feature</h2>
        <p className="text-sm text-slate-500">
          This feature is only available to teacher and parent accounts. Switch your account type in Profile settings to access it.
        </p>
        <Link href="/profile" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform text-sm">
          Go to Profile Settings
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
