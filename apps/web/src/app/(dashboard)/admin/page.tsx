'use client';
import { useEffect, useState } from 'react';
import { Users, FileText, FileStack, Loader2 } from 'lucide-react';
import { fetchAdminUsers, fetchAdminAnalytics, updateUserRole, AdminUser, AdminAnalytics } from '@/lib/admin';

const ROLES: AdminUser['role'][] = ['student', 'parent', 'teacher', 'admin'];

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchAdminUsers(), fetchAdminAnalytics()])
      .then(([u, a]) => { setUsers(u.data); setAnalytics(a.data); })
      .catch((err) => { console.error(err); setError('Could not load admin data.'); })
      .finally(() => setLoading(false));
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
