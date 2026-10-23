import Link from 'next/link';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Logo } from '@/components/Logo';

export const metadata = { title: "Contact Us - Bosket's EDStudio" };

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-slate-900 dark:text-slate-100 transition-colors">
      <header className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Logo size={32} />
          <span className="font-display text-lg font-semibold">Bosket&apos;s EDStudio</span>
        </Link>
        <Link href="/" className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline">Back to Home</Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-24">
        <div className="mb-10">
          <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">Get in touch</span>
          <h1 className="font-display text-4xl font-semibold mt-2 mb-3">Contact Us</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-lg">
            Questions about your account, a worksheet, or Bosket&apos;s EDStudio in general &mdash; we&apos;re happy to help.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="glass-card p-6 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-primary-700 flex items-center justify-center text-white">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold">Email</h3>
            <p className="text-sm text-slate-500">support@bosketstech.example</p>
            <p className="text-xs text-slate-400">Placeholder &mdash; replace with a real support address.</p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-primary-700 flex items-center justify-center text-white">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold">Phone</h3>
            <p className="text-sm text-slate-500">+91 00000 00000</p>
            <p className="text-xs text-slate-400">Placeholder &mdash; replace with a real support number.</p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-primary-700 flex items-center justify-center text-white">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold">Office</h3>
            <p className="text-sm text-slate-500">Bosket&apos;s Tech Ventures, India</p>
            <p className="text-xs text-slate-400">Placeholder &mdash; replace with a real registered address.</p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-primary-700 flex items-center justify-center text-white">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold">Support hours</h3>
            <p className="text-sm text-slate-500">Mon&ndash;Sat, 10:00&ndash;18:00 IST</p>
          </div>
        </div>

        <div className="mt-10 p-6 rounded-2xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-900 text-sm text-slate-600 dark:text-slate-300">
          Looking for how we handle your data? Read our <Link href="/privacy" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Privacy Policy</Link>.
        </div>
      </main>
    </div>
  );
}
