import Link from 'next/link';
import { Sparkles, BookOpen, ArrowRight, Printer, Zap, Users, Languages } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-slate-900 dark:text-slate-100 selection:bg-primary-200 selection:text-primary-900 relative overflow-hidden transition-colors">
      {/* Offset decorative blocks -- flat shapes in place of a gradient glow */}
      <div className="absolute top-16 -left-16 w-56 h-56 bg-secondary-200 dark:bg-secondary-900/30 border-[3px] border-slate-900/10 dark:border-secondary-800/40 rounded-[40px] rotate-12 pointer-events-none" aria-hidden="true"></div>
      <div className="absolute top-40 -right-20 w-64 h-64 bg-accent-200 dark:bg-accent-900/30 border-[3px] border-slate-900/10 dark:border-accent-800/40 rounded-[40px] -rotate-6 pointer-events-none" aria-hidden="true"></div>

      {/* Header Nav */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <Logo size={40} />
          <span className="font-display text-xl sm:text-2xl font-semibold tracking-tight">Bosket&apos;s EDStudio</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="btn-brutal px-6 py-2.5 rounded-xl font-display font-medium text-sm bg-primary-600 text-white hover:bg-primary-500">
            Get Started Free
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-24 text-center relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 border-2 border-slate-900 dark:border-primary-700 text-xs font-bold text-primary-700 dark:text-primary-300 tracking-wide uppercase">
          <Sparkles className="w-4 h-4 text-secondary-500" /> AI Learning Platform for CBSE &amp; ICSE, Classes 1&ndash;12
        </div>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.08] text-balance">
          Every worksheet, project, and lab
          <br />
          <span className="text-gradient">your child needs, ready in seconds</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Curriculum-accurate worksheets, study material, and hands-on Tech &amp; Chem Labs, with instructor-quality PDFs &mdash; built for CBSE &amp; ICSE students, parents, and teachers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/register"
            className="btn-brutal w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-display font-medium text-lg flex items-center justify-center gap-3"
          >
            Create Your First Worksheet <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="btn-brutal w-full sm:w-auto px-8 py-4 bg-surface-light dark:bg-surface-dark hover:bg-secondary-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white rounded-2xl font-display font-medium text-lg"
          >
            Sign In to Dashboard
          </Link>
        </div>

        {/* Hero Preview Card */}
        <div className="pt-12 max-w-4xl mx-auto">
          <div className="glass-card bg-surface-light dark:bg-surface-dark rounded-3xl p-6 md:p-8 text-left space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-900 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border-2 border-slate-900 dark:border-primary-800 rounded-lg text-xs font-bold uppercase">
                  Class 8 &bull; Science
                </span>
                <span className="px-3 py-1 bg-secondary-50 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 border-2 border-slate-900 dark:border-secondary-800 rounded-lg text-xs font-bold">
                  Medium Difficulty
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                <Printer className="w-4 h-4 text-primary-500" /> Printable PDF &bull; Answer Key Included
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl font-semibold">Chapter: Cell Structure and Functions</h3>
              <div className="p-4 rounded-xl bg-bg-light dark:bg-slate-900/60 border-2 border-slate-900 dark:border-slate-700 space-y-2">
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
      </section>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20 relative z-10 border-t-[3px] border-slate-900 dark:border-slate-800">
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
            <div key={i} className="p-8 rounded-3xl bg-surface-light dark:bg-surface-dark border-[3px] border-slate-900 dark:border-slate-700 space-y-4 shadow-[6px_6px_0_var(--color-ink)] dark:shadow-[6px_6px_0_rgba(51,49,42,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--color-ink)] transition-transform group">
              <div className="w-12 h-12 rounded-2xl bg-primary-600 border-2 border-slate-900 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-[3px] border-slate-900 dark:border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <Logo size={24} />
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-700 dark:text-slate-300">Bosket&apos;s EDStudio</span> &bull; Developed by Bosket&apos;s Tech Ventures &bull; v1.0 &copy; {new Date().getFullYear()}
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
