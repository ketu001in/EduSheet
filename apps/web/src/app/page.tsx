import Link from 'next/link';
import { Sparkles, BookOpen, ArrowRight, Printer, Zap, Users, Languages } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-slate-900 dark:text-slate-100 selection:bg-primary-200 selection:text-primary-900 relative overflow-hidden transition-colors">
      {/* Background Glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[420px] bg-gradient-to-tr from-primary-300/30 to-secondary-300/20 dark:from-primary-700/20 dark:to-secondary-700/10 blur-[140px] pointer-events-none rounded-full"></div>

      {/* Header Nav */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <Logo size={40} />
          <span className="font-display text-xl sm:text-2xl font-semibold tracking-tight">Bosket&apos;s EduSheet</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="px-6 py-2.5 rounded-xl font-bold text-sm bg-primary-700 text-white hover:bg-primary-800 hover:scale-[1.03] transition-all shadow-lg shadow-primary-700/25">
            Get Started Free
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-24 text-center relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200/70 dark:border-primary-800 text-xs font-bold text-primary-700 dark:text-primary-300 tracking-wide uppercase">
          <Sparkles className="w-4 h-4 text-secondary-500" /> AI Worksheet Generator for CBSE, Classes 1&ndash;10
        </div>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.08] text-balance">
          Every worksheet your child needs,
          <br />
          <span className="text-gradient">checked and ready in seconds</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Curriculum-accurate practice papers, complete answer keys, and instructor-quality PDFs &mdash; built for CBSE students, parents, and teachers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 bg-primary-700 hover:bg-primary-800 text-white rounded-2xl font-extrabold text-lg hover:scale-105 transition-all shadow-xl shadow-primary-700/25 flex items-center justify-center gap-3"
          >
            Create Your First Worksheet <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 bg-surface-light dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-2xl font-bold text-lg transition-all"
          >
            Sign In to Dashboard
          </Link>
        </div>

        {/* Hero Preview Card */}
        <div className="pt-12 max-w-4xl mx-auto">
          <div className="rounded-3xl p-1 bg-gradient-to-b from-primary-200/60 dark:from-primary-800/40 via-white/40 dark:via-slate-800/20 to-transparent shadow-2xl">
            <div className="bg-surface-light dark:bg-surface-dark rounded-[22px] p-6 md:p-8 text-left border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 rounded-lg text-xs font-bold uppercase">
                    Class 8 &bull; Science
                  </span>
                  <span className="px-3 py-1 bg-secondary-50 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 border border-secondary-200 dark:border-secondary-800 rounded-lg text-xs font-bold">
                    Medium Difficulty
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                  <Printer className="w-4 h-4 text-primary-500" /> Printable PDF &bull; Answer Key Included
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">Chapter: Cell Structure and Functions</h3>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <p className="font-semibold text-sm">1. Which organelle is known as the powerhouse of the cell and produces ATP?</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 pl-4">
                    <span>(A) Endoplasmic Reticulum</span>
                    <span className="text-accent-600 dark:text-accent-400 font-bold">(B) Mitochondria &#10003;</span>
                    <span>(C) Golgi Apparatus</span>
                    <span>(D) Lysosome</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20 relative z-10 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">Built for the whole CBSE household</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">Whichever seat you're in &mdash; student, parent, or teacher &mdash; the worksheet you need is a few taps away.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: 'AI Question Engine',
              desc: 'Generates fresh, non-repetitive questions tailored to chosen chapters, difficulty levels, and Bloom’s taxonomy.'
            },
            {
              icon: BookOpen,
              title: 'Classes 1–10, All Core Subjects',
              desc: 'Curriculum coverage across Mathematics, Science, English, EVS, Social Science, Hindi, and Sanskrit.'
            },
            {
              icon: Printer,
              title: 'One-Click Print & PDF Export',
              desc: 'Clean, printable worksheets with answer keys formatted for standard A4 printing and digital practice.'
            },
            {
              icon: Users,
              title: 'Built for Every Role',
              desc: 'Students practice, parents track progress, and teachers generate for a full classroom — one platform.'
            },
            {
              icon: Languages,
              title: 'Multilingual by Design',
              desc: 'English today, with Hindi and regional-language worksheet generation on the roadmap.'
            },
            {
              icon: Sparkles,
              title: 'Adaptive Practice',
              desc: 'Worksheet history feeds back into future suggestions, so practice targets what actually needs work.'
            },
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 space-y-4 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-primary-700 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <Logo size={24} />
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-700 dark:text-slate-300">Bosket&apos;s EduSheet</span> &bull; Developed by Bosket&apos;s Tech Ventures &bull; v1.0 &copy; {new Date().getFullYear()}
            </div>
          </div>
          <div className="flex gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link href="/login" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Register</Link>
            <Link href="/privacy" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
