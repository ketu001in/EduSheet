'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'student' | 'parent' | 'teacher'>('student');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [board, setBoard] = useState('CBSE');
  const [grade, setGrade] = useState('1');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, username, role, board, grade })
      });

      const resData = await response.json();

      if (!response.ok || resData.error) {
        setError(resData.error || 'Registration failed. Please check your inputs.');
        return;
      }

      if (resData.session) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(resData.message || 'Registration successful! Please check your email to verify your account.');
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err?.message || 'Network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left mb-8">
        <h2 className="font-display text-3xl font-semibold mb-2">Create an account</h2>
        <p className="text-slate-500 dark:text-slate-400">Join Bosket&apos;s EDStudio and start generating worksheets, projects, and labs.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
          {typeof error === 'string' && error.trim() !== '{}' && error.trim() !== '' 
            ? error 
            : 'Registration failed. Please try a different email or check your details.'}
        </div>
      )}

      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-2.5 flex-1 rounded-full border-2 border-slate-900 dark:border-slate-600 ${s <= step ? 'bg-primary-500' : 'bg-transparent'}`}></div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">I am a...</h3>
          <div className="grid grid-cols-1 gap-4">
            {(['student', 'parent', 'teacher'] as const).map((r) => (
              <button 
                key={r} 
                onClick={() => { setRole(r); setStep(2); }} 
                className={`p-4 border-2 border-slate-900 dark:border-slate-600 rounded-xl text-left font-bold capitalize transition-all ${role === r ? 'bg-primary-600 text-white shadow-[3px_3px_0_var(--color-ink)] dark:shadow-[3px_3px_0_rgba(253,243,217,0.9)]' : 'hover:bg-secondary-50 dark:hover:bg-slate-800'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-900 dark:border-slate-600 bg-transparent focus:border-primary-600 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              required
              minLength={3}
              maxLength={20}
              pattern="[a-zA-Z0-9_]+"
              title="3-20 characters: letters, numbers, and underscores only"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. rahul_08"
              className="w-full p-3 rounded-xl border-2 border-slate-900 dark:border-slate-600 bg-transparent focus:border-primary-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-900 dark:border-slate-600 bg-transparent focus:border-primary-600 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-900 dark:border-slate-600 bg-transparent focus:border-primary-600 outline-none" />
          </div>
          <button type="submit" className="btn-brutal w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-display font-medium">Continue</button>
        </form>
      )}

      {step === 3 && (
        <form className="space-y-4" onSubmit={handleComplete}>
          <div>
            <label className="block text-sm font-medium mb-1">Board</label>
            <select value={board} onChange={e => setBoard(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-900 dark:border-slate-600 bg-transparent focus:border-primary-600 outline-none">
              <option>CBSE</option>
              <option>ICSE</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
            <select value={grade} onChange={e => setGrade(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-900 dark:border-slate-600 bg-transparent focus:border-primary-600 outline-none">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(c => <option key={c} value={c}>Class {c}</option>)}
            </select>
          </div>
          <button type="submit" disabled={isLoading} className="btn-brutal w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-display font-medium disabled:opacity-50">
            {isLoading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>
      )}

      <p className="text-center text-slate-500 mt-8">
        Already have an account? <Link href="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
