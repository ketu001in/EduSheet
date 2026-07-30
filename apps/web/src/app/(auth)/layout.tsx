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
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-900 to-primary-700 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2 bg-white/15 rounded-xl backdrop-blur-md">
            <Logo size={32} />
          </div>
          <span className="font-display text-2xl font-semibold tracking-tight">Bosket&apos;s EduSheet</span>
        </div>
        <div className="relative z-10 max-w-lg">
          <h1 className="font-display text-4xl font-semibold mb-6 leading-tight text-balance">Every worksheet, checked and ready in seconds</h1>
          <p className="text-lg text-primary-100">AI-generated, curriculum-aligned CBSE practice papers for Classes 1&ndash;10 &mdash; with full answer keys, built for students, parents, and teachers.</p>
        </div>
        <div className="relative z-10 text-xs text-primary-200/80">
          &copy; {new Date().getFullYear()} Bosket&apos;s Tech Ventures &bull; v1.0
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-surface-light dark:bg-surface-dark">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <Logo size={32} />
            <span className="font-display text-xl font-semibold">Bosket&apos;s EduSheet</span>
          </div>
          {children}
        </div>
        <div className="lg:hidden mt-10 text-xs text-slate-400">
          <Link href="/privacy" className="hover:underline">Privacy</Link> &middot; <Link href="/contact" className="hover:underline">Contact</Link>
        </div>
      </div>
    </div>
  );
}
