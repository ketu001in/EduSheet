import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-bg-light dark:bg-bg-dark print:bg-white print:h-auto overflow-hidden print:overflow-visible">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 print:min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-safe-nav print:p-0 print:overflow-visible">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
