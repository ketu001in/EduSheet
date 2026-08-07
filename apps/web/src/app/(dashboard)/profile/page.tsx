'use client';
import { useState, useEffect, useRef } from 'react';
import { User, Check, Save, LogOut, Shield, KeyRound, Cpu, ExternalLink, AlertTriangle, Type, Users } from 'lucide-react';
import Link from 'next/link';
import { useWorksheetStore } from '@/store/useWorksheetStore';
import { createClient } from '@/lib/supabase/client';
import { api } from '@/lib/api';
import { useLogout } from '@/hooks/useLogout';
import { useFontPreference, FONT_OPTIONS } from '@/hooks/useFontPreference';
import { AI_PROVIDERS } from '@/lib/aiProviders';

export default function ProfilePage() {
  const { userProfile, updateProfile } = useWorksheetStore();
  const { logout, isLoggingOut } = useLogout();
  const { font, setFont } = useFontPreference();

  const [name, setName] = useState(userProfile.name || 'Student User');
  const [board, setBoard] = useState(userProfile.board || 'CBSE');
  const [grade, setGrade] = useState(userProfile.grade || 'Class 8');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const syncedOnce = useRef(false);

  // The real profile loads asynchronously (fetched once in Header); pick up
  // that first load without clobbering anything the user is mid-editing.
  useEffect(() => {
    if (syncedOnce.current) return;
    if (userProfile.name && userProfile.name !== 'Student User') {
      setName(userProfile.name);
      setBoard(userProfile.board || 'CBSE');
      setGrade(userProfile.grade || grade);
      syncedOnce.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile.name, userProfile.board, userProfile.grade]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, board, grade });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // --- Role ---
  // Deliberately self-service for now (any account can switch freely between
  // student/parent/teacher) so teacher/parent-only features can be tested
  // without a separate onboarding flow -- see apps/api's PATCH /users/profile
  // and requireRole gate for where this actually gets enforced server-side.
  const ROLE_OPTIONS: { id: 'student' | 'parent' | 'teacher'; label: string; hint: string }[] = [
    { id: 'student', label: 'Student', hint: 'Worksheet and project generation.' },
    { id: 'parent', label: 'Parent', hint: 'Everything a student gets, plus Study Material generation.' },
    { id: 'teacher', label: 'Teacher', hint: 'Everything a student gets, plus Study Material generation.' },
  ];
  const [roleSaving, setRoleSaving] = useState(false);
  const [roleMessage, setRoleMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const currentRole = userProfile.role || 'student';

  const handleChangeRole = async (role: 'student' | 'parent' | 'teacher') => {
    if (role === currentRole || roleSaving) return;
    setRoleSaving(true);
    setRoleMessage(null);
    try {
      await api.patch('/api/users/profile', { role });
      updateProfile({ role });
      setRoleMessage({ type: 'success', text: `Switched to ${role}. Reload the page if the navigation doesn't update.` });
    } catch (err: any) {
      setRoleMessage({ type: 'error', text: err.message || 'Could not change your role.' });
    } finally {
      setRoleSaving(false);
    }
  };

  // --- Change password ---
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: "Passwords don't match." });
      return;
    }
    setPasswordSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordMessage({ type: 'success', text: 'Password updated.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMessage({ type: 'error', text: err.message || 'Could not update password.' });
    } finally {
      setPasswordSaving(false);
    }
  };

  // --- AI provider / key ---
  const [aiProvider, setAiProvider] = useState<string>('groq');
  const [aiApiKey, setAiApiKey] = useState('');
  const [aiHasKey, setAiHasKey] = useState(false);
  const [aiLoaded, setAiLoaded] = useState(false);
  const [aiSaving, setAiSaving] = useState(false);
  const [aiMessage, setAiMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    api.get<{ success: boolean; data: { provider: string | null; hasKey: boolean } }>('/api/users/ai-settings')
      .then((res) => {
        if (res.data.provider) setAiProvider(res.data.provider);
        setAiHasKey(res.data.hasKey);
      })
      .catch((err) => console.error('Failed to load AI settings:', err))
      .finally(() => setAiLoaded(true));
  }, []);

  const handleSaveAiSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiMessage(null);
    setAiSaving(true);
    try {
      await api.put('/api/users/ai-settings', { provider: aiProvider, apiKey: aiApiKey });
      setAiHasKey(true);
      setAiApiKey('');
      setAiMessage({ type: 'success', text: 'Saved! Worksheets and projects will now generate using your key.' });
    } catch (err: any) {
      setAiMessage({ type: 'error', text: err.message || 'Could not save your API key.' });
    } finally {
      setAiSaving(false);
    }
  };

  const handleClearAiSettings = async () => {
    setAiSaving(true);
    setAiMessage(null);
    try {
      await api.del('/api/users/ai-settings');
      setAiHasKey(false);
      setAiProvider('groq');
      setAiMessage({ type: 'success', text: 'Removed. Add a new key to generate again.' });
    } catch (err: any) {
      setAiMessage({ type: 'error', text: err.message || 'Could not remove your API key.' });
    } finally {
      setAiSaving(false);
    }
  };

  const activeProviderInfo = AI_PROVIDERS.find((p) => p.id === aiProvider) || AI_PROVIDERS[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 select-none">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-2">Profile Settings</h1>
        <p className="text-slate-500 text-sm">Manage your account credentials and default learning preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary-600 text-white border-2 border-slate-900 dark:border-primary-800 rounded-xl font-bold text-left shadow-[3px_3px_0_var(--color-ink)] text-sm">
            <User className="w-5 h-5" /> Personal Info
          </button>
          <Link href="/privacy" className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl font-medium text-left text-sm transition-colors">
            <Shield className="w-5 h-5" /> Privacy Policy
          </Link>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
            <h2 className="font-display text-xl font-semibold">Personal Information</h2>

            {savedSuccess && (
              <div className="p-4 bg-accent-50 dark:bg-accent-950/40 text-accent-600 dark:text-accent-300 rounded-xl text-sm font-bold flex items-center gap-2 border border-accent-200 dark:border-accent-800">
                <Check className="w-5 h-5" /> Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3.5 rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-transparent focus:border-primary-600 outline-none font-medium text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  value={userProfile.email || ''}
                  disabled
                  className="w-full p-3.5 rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-400 outline-none cursor-not-allowed text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Target Board</label>
                  <select
                    value={board}
                    onChange={(e) => setBoard(e.target.value)}
                    className="w-full p-3.5 rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark outline-none focus:border-primary-600 text-sm font-medium"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Target Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full p-3.5 rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark outline-none focus:border-primary-600 text-sm font-medium"
                  >
                    {Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`).map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="btn-brutal px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-sm flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>

          <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
            <div>
              <h2 className="font-display text-xl font-semibold flex items-center gap-2"><Users className="w-5 h-5" /> Account Type</h2>
              <p className="text-sm text-slate-500 mt-1">
                Teachers and parents get everything students get, plus Study Material generation. Switch freely for now while this is new.
              </p>
            </div>

            {roleMessage && (
              <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 border ${
                roleMessage.type === 'success'
                  ? 'bg-accent-50 dark:bg-accent-950/40 text-accent-600 dark:text-accent-300 border-accent-200 dark:border-accent-800'
                  : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 border-red-200 dark:border-red-900'
              }`}>
                {roleMessage.type === 'success' ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />} {roleMessage.text}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ROLE_OPTIONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  disabled={roleSaving}
                  onClick={() => handleChangeRole(r.id)}
                  className={`p-4 rounded-xl border text-left transition-all disabled:opacity-50 ${
                    currentRole === r.id
                      ? 'border-slate-900 bg-primary-50 dark:bg-primary-900/20 shadow-[3px_3px_0_var(--color-ink)]'
                      : 'border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:shadow-[3px_3px_0_var(--color-ink)]'
                  }`}
                >
                  <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">{r.label}</span>
                  <span className="block text-xs text-slate-400 mt-0.5">{r.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
            <div>
              <h2 className="font-display text-xl font-semibold flex items-center gap-2"><Type className="w-5 h-5" /> Appearance</h2>
              <p className="text-sm text-slate-500 mt-1">Choose the font used throughout the tool. Applies instantly and only on this device.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FONT_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFont(f.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    font === f.id
                      ? 'border-slate-900 bg-primary-50 dark:bg-primary-900/20 shadow-[3px_3px_0_var(--color-ink)]'
                      : 'border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:shadow-[3px_3px_0_var(--color-ink)]'
                  }`}
                >
                  <span className="block text-lg font-semibold mb-1" style={{ fontFamily: `var(${f.cssVar})` }}>Aa</span>
                  <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">{f.label}</span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">{f.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <div id="security" className="glass-card p-6 md:p-8 rounded-3xl space-y-6 scroll-mt-6">
            <h2 className="font-display text-xl font-semibold flex items-center gap-2"><KeyRound className="w-5 h-5" /> Change Password</h2>

            {passwordMessage && (
              <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 border ${
                passwordMessage.type === 'success'
                  ? 'bg-accent-50 dark:bg-accent-950/40 text-accent-600 dark:text-accent-300 border-accent-200 dark:border-accent-800'
                  : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 border-red-200 dark:border-red-900'
              }`}>
                {passwordMessage.type === 'success' ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />} {passwordMessage.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-3.5 rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-transparent focus:border-primary-600 outline-none font-medium text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-3.5 rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-transparent focus:border-primary-600 outline-none font-medium text-sm"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={passwordSaving}
                className="btn-brutal px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4" /> {passwordSaving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          <div id="ai-provider" className="glass-card p-6 md:p-8 rounded-3xl space-y-6 scroll-mt-6">
            <div>
              <h2 className="font-display text-xl font-semibold flex items-center gap-2"><Cpu className="w-5 h-5" /> AI Provider</h2>
              <p className="text-sm text-slate-500 mt-1">
                Bosket&apos;s EduSheet doesn&apos;t come with a built-in AI key &mdash; add your own from any supported provider below to generate worksheets and projects.
              </p>
            </div>

            {aiMessage && (
              <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 border ${
                aiMessage.type === 'success'
                  ? 'bg-accent-50 dark:bg-accent-950/40 text-accent-600 dark:text-accent-300 border-accent-200 dark:border-accent-800'
                  : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 border-red-200 dark:border-red-900'
              }`}>
                {aiMessage.type === 'success' ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />} {aiMessage.text}
              </div>
            )}

            {aiLoaded && (
              <>
                <div className={`p-3.5 rounded-xl text-sm font-semibold ${aiHasKey ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'}`}>
                  {aiHasKey ? `Using your own ${activeProviderInfo.label} key.` : 'No AI key configured yet — generation is disabled until you add one.'}
                </div>

                <form onSubmit={handleSaveAiSettings} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Provider</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {AI_PROVIDERS.map((p) => (
                        <button
                          type="button"
                          key={p.id}
                          onClick={() => setAiProvider(p.id)}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            aiProvider === p.id
                              ? 'border-slate-900 bg-primary-50 dark:bg-primary-900/20 font-bold shadow-[3px_3px_0_var(--color-ink)]'
                              : 'border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:shadow-[3px_3px_0_var(--color-ink)]'
                          }`}
                        >
                          <span className="block font-semibold text-sm">{p.label}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">{activeProviderInfo.hint}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-900 dark:border-slate-700 space-y-2">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">How to get a {activeProviderInfo.label} key</p>
                    <ol className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-decimal list-inside">
                      {activeProviderInfo.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                    <a
                      href={activeProviderInfo.keyPageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline mt-1"
                    >
                      Open {activeProviderInfo.label} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">API Key</label>
                    <input
                      type="password"
                      value={aiApiKey}
                      onChange={(e) => setAiApiKey(e.target.value)}
                      placeholder={aiHasKey ? 'Enter a new key to replace the saved one' : 'Paste your API key'}
                      className="w-full p-3.5 rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-transparent focus:border-primary-600 outline-none font-medium text-sm"
                    />
                    <p className="text-xs text-slate-400 mt-2">Stored encrypted; never shown again after saving.</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={aiSaving || !aiApiKey}
                      className="btn-brutal px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" /> {aiSaving ? 'Saving...' : 'Save Key'}
                    </button>
                    {aiHasKey && (
                      <button
                        type="button"
                        onClick={handleClearAiSettings}
                        disabled={aiSaving}
                        className="px-5 py-3 border-2 border-slate-900 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-secondary-50 dark:hover:bg-slate-800 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                      >
                        Remove key
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>

          <div className="glass-card p-6 md:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-semibold text-slate-800 dark:text-slate-200">Sign out</h3>
              <p className="text-sm text-slate-500">End your session on this device.</p>
            </div>
            <button
              onClick={logout}
              disabled={isLoggingOut}
              className="px-5 py-2.5 border-2 border-red-600 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" /> {isLoggingOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
