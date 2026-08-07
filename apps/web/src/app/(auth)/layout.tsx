import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left sidebar - Branding */}
      <div className="hidden lg:flex w-1/2 bg-primary-600 border-r-[3px] border-slate-900 p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Offset decorative block -- the flat-shape signature this direction uses in place of a gradient glow */}
        <div className="absolute -right-10 top-24 w-40 h-40 bg-secondary-500 border-[3px] border-slate-900 rounded-[28px] rotate-12" aria-hidden="true" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2 bg-white rounded-xl border-[3px] border-slate-900">
            <Logo size={32} />
          </div>
          <span className="font-display text-2xl font-semibold tracking-tight">Bosket&apos;s EduSheet</span>
        </div>
        <div className="relative z-10 max-w-lg">
          <h1 className="font-display text-4xl font-semibold mb-6 leading-tight text-balance">Every worksheet, checked and ready in seconds</h1>
          <p className="text-lg text-primary-50">AI-generated, curriculum-aligned CBSE practice papers for Classes 1&ndash;10 &mdash; with full answer keys, built for students, parents, and teachers.</p>
        </div>
        <div className="relative z-10 text-xs text-primary-100">
          &copy; {new Date().getFullYear()} Bosket&apos;s Tech Ventures &bull; v1.0
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-bg-light dark:bg-bg-dark">
        <div className="w-full max-w-md glass-card rounded-3xl p-8">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <Logo size={32} />
            <span className="font-display text-xl font-semibold">Bosket&apos;s EduSheet</span>
          </div>
          {children}
        </div>
        <div className="mt-8 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/privacy" className="hover:underline">Privacy</Link> &middot; <Link href="/contact" className="hover:underline">Contact</Link>
        </div>
      </div>
    </div>
  );
}
