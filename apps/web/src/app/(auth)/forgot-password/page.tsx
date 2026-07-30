'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-6">
      <Link href="/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to login
      </Link>
      
      <div className="text-center md:text-left mb-8">
        <h2 className="text-3xl font-bold mb-2">Forgot password?</h2>
        <p className="text-slate-500 dark:text-slate-400">No worries, we'll send you reset instructions.</p>
      </div>

      {!submitted ? (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" required className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Enter your email" />
          </div>
          <button type="submit" className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors">Reset Password</button>
        </form>
      ) : (
        <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-900/50">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-2">Check your email</h3>
          <p className="text-green-600 dark:text-green-500 text-sm">We sent a password reset link to your email address.</p>
        </div>
      )}
    </div>
  );
}
