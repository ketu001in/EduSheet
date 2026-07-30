'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const resData = await response.json();

      if (!response.ok || resData.error) {
        setError(resData.error || 'Invalid email or password.');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.message || 'Network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to initialize Google login.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left mb-8">
        <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
        <p className="text-slate-500 dark:text-slate-400">Please enter your details to sign in.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
          {typeof error === 'string' && error.trim() !== '{}' && error.trim() !== '' 
            ? error 
            : 'Invalid email or password. Please try again.'}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary-500 outline-none" 
            placeholder="Enter your email" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input 
            type="password" 
            required 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary-500 outline-none" 
            placeholder="••••••••" 
          />
        </div>
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded text-primary-500" />
            <span>Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-primary-600 hover:underline font-medium">Forgot password?</Link>
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
        <div className="relative flex justify-center text-sm"><span className="px-2 bg-surface-light dark:bg-surface-dark text-slate-500">Or continue with</span></div>
      </div>

      <button 
        type="button"
        onClick={handleGoogleLogin}
        className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        Google
      </button>

      <p className="text-center text-slate-500 mt-8">
        Don't have an account? <Link href="/register" className="text-primary-600 font-semibold hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
