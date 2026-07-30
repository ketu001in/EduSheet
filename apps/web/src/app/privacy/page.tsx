import Link from 'next/link';
import { Logo } from '@/components/Logo';

export const metadata = { title: "Privacy Policy - Bosket's EduSheet" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-slate-900 dark:text-slate-100 transition-colors">
      <header className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Logo size={32} />
          <span className="font-display text-lg font-semibold">Bosket&apos;s EduSheet</span>
        </Link>
        <Link href="/" className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline">Back to Home</Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-24">
        <div className="mb-10">
          <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">Legal</span>
          <h1 className="font-display text-4xl font-semibold mt-2 mb-3">Privacy Policy</h1>
          <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>

        <div className="prose-content space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">1. Who we are</h2>
            <p>Bosket&apos;s EduSheet is developed and operated by <strong>Bosket&apos;s Tech Ventures</strong> (&quot;we&quot;, &quot;us&quot;). This policy explains what information we collect from students, parents, and teachers who use the platform, and how we use it.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">2. Information we collect</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Account information</strong>: name, email address, role (student/parent/teacher), and academic details (board, class) provided at registration.</li>
              <li><strong>Worksheet activity</strong>: subjects, chapters, and topics you generate worksheets for, difficulty settings, and generation history.</li>
              <li><strong>Technical data</strong>: basic usage and device information collected automatically to keep the service reliable and secure.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">3. How we use this information</h2>
            <p>We use your information to generate worksheets, maintain your history and favorites, personalize the dashboard, and improve the quality of generated content. We do not sell your personal information.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">4. Third-party AI providers</h2>
            <p>Worksheet content is generated using a third-party AI language model provider. The class, subject, chapter, and topic details you select are sent to that provider to generate questions &mdash; we do not send your name, email, or other directly identifying information as part of that request.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">5. Children&apos;s privacy</h2>
            <p>This platform is intended for use by school-age students under the guidance of a parent, guardian, or teacher. Where a student account is created for a child, we rely on the registering parent, guardian, or teacher to provide any consent required under applicable law.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">6. Data security</h2>
            <p>We use industry-standard practices, including encrypted connections and access-controlled databases, to protect your information. No online service can guarantee absolute security, but we work to keep your data safe.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">7. Your rights</h2>
            <p>You can review and update your profile information at any time from your account settings, and you may request deletion of your account and associated data by contacting us.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">8. Changes to this policy</h2>
            <p>We may update this policy from time to time. Material changes will be reflected by updating the &quot;Last updated&quot; date above.</p>
          </section>

          <section className="p-5 rounded-2xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">9. Contact us</h2>
            <p>Questions about this policy or your data can be sent to <strong>privacy@bosketstech.example</strong> <span className="text-slate-400">(placeholder — replace with a real support address before launch)</span>. See our <Link href="/contact" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Contact page</Link> for more ways to reach us.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
