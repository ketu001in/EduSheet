'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, FileText, FileStack, Loader2, GraduationCap, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { fetchAdminUsers, fetchAdminAnalytics, updateUserRole, AdminUser, AdminAnalytics } from '@/lib/admin';
import { fetchCurriculumHealth, CurriculumHealth } from '@/lib/curriculumAdmin';

const ROLES: AdminUser['role'][] = ['student', 'parent', 'teacher', 'admin'];

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [curriculumHealth, setCurriculumHealth] = useState<CurriculumHealth | null>(null);

  useEffect(() => {
    Promise.all([fetchAdminUsers(), fetchAdminAnalytics()])
      .then(([u, a]) => { setUsers(u.data); setAnalytics(a.data); })
      .catch((err) => { console.error(err); setError('Could not load admin data.'); })
      .finally(() => setLoading(false));
    // Fetched independently -- a failure here shouldn't block the rest of
    // the dashboard from loading, it just means the nudge doesn't show.
    fetchCurriculumHealth().then((res) => setCurriculumHealth(res.data)).catch((err) => console.error(err));
  }, []);

  const handleRoleChange = async (id: string, role: AdminUser['role']) => {
    setUpdatingId(id);
    try {
      await updateUserRole(id, role);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    } catch (err: any) {
      alert(err?.message || 'Could not update role.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="glass-card p-12 rounded-3xl text-center flex items-center justify-center gap-2 text-slate-400"><Loader2 className="w-5 h-5 animate-spin" /> Loading...</div>;
  }
  if (error) {
    return <div className="glass-card p-8 rounded-3xl text-center text-red-500 text-sm">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Users', value: analytics?.total_users ?? 0, icon: Users },
          { label: 'Worksheets Generated', value: analytics?.total_worksheets ?? 0, icon: FileText },
          { label: 'Projects Generated', value: analytics?.total_projects ?? 0, icon: FileStack },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card rounded-2xl p-5 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {curriculumHealth && curriculumHealth.staleCount > 0 && (
        <div className="glass-card rounded-2xl p-5 border-2 border-amber-300 dark:border-amber-800 space-y-3">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-amber-500" /> Curriculum Currency Check</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {curriculumHealth.staleCount} of {curriculumHealth.totalSubjects} subjects haven&apos;t been checked against the real CBSE/ICSE syllabus in over a year
                  {curriculumHealth.neverVerifiedCount > 0 ? ` (${curriculumHealth.neverVerifiedCount} never verified at all)` : ''}.
                </p>
              </div>
            </div>
            <Link href="/admin/curriculum" className="btn-brutal px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0">
              Review <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {curriculumHealth.stale.slice(0, 6).map((s) => (
              <span key={s.id} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300">
                {s.boardName} {s.className} {s.name}
              </span>
            ))}
            {curriculumHealth.stale.length > 6 && <span className="text-[11px] text-slate-400 self-center">+{curriculumHealth.stale.length - 6} more</span>}
          </div>
        </div>
      )}
      {curriculumHealth && curriculumHealth.staleCount === 0 && curriculumHealth.totalSubjects > 0 && (
        <div className="glass-card rounded-2xl p-4 flex items-center gap-3 border-2 border-accent-200 dark:border-accent-900">
          <ShieldCheck className="w-5 h-5 text-accent-600 shrink-0" />
          <p className="text-sm text-slate-600 dark:text-slate-300">All {curriculumHealth.totalSubjects} subjects have been verified against the real syllabus within the last year.</p>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold mb-3">All Users ({users.length})</h2>
        <div className="glass-card rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-xs text-slate-400 uppercase">
                <th className="p-4 font-bold">Name</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold">Joined</th>
                <th className="p-4 font-bold">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                  <td className="p-4 font-medium">{u.full_name || u.username || '(no name)'}</td>
                  <td className="p-4 text-slate-500">{u.email}</td>
                  <td className="p-4 text-slate-400 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <select
                      value={u.role}
                      disabled={updatingId === u.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as AdminUser['role'])}
                      className="rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-transparent px-2.5 py-1.5 text-xs font-bold disabled:opacity-50"
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
