'use client';
import { use } from 'react';
import { Download, Share2, Heart, Printer, CheckCircle2 } from 'lucide-react';

export default function WorksheetDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Left Sidebar - Meta */}
      <div className="w-full lg:w-64 space-y-6">
        <div className="glass p-6 rounded-2xl">
          <h2 className="font-bold text-lg mb-4">Details</h2>
          <div className="space-y-3 text-sm">
            <div><span className="text-slate-500">Subject</span><p className="font-medium">Science</p></div>
            <div><span className="text-slate-500">Class</span><p className="font-medium">Class 8</p></div>
            <div><span className="text-slate-500">Topic</span><p className="font-medium">Cell Structure</p></div>
            <div><span className="text-slate-500">Questions</span><p className="font-medium">20 Questions</p></div>
            <div><span className="text-slate-500">Difficulty</span><p className="font-medium text-amber-500">Medium</p></div>
          </div>
        </div>
        
        <div className="space-y-3">
          <button className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
            <Download className="w-5 h-5" /> Download PDF
          </button>
          <button className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
            <Download className="w-5 h-5" /> Answer Key
          </button>
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-slate-600 dark:text-slate-300">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="flex-1 py-3 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-slate-600 dark:text-slate-300 hover:text-red-500">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right - Preview */}
      <div className="flex-1">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl p-8 md:p-12 min-h-[800px]">
          {/* Header */}
          <div className="text-center mb-8 border-b pb-6 dark:border-slate-800">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Cell Structure and Functions</h1>
            <p className="text-slate-500">Class 8 • Science • Time: 45 mins • Max Marks: 20</p>
          </div>
          
          {/* Questions */}
          <div className="space-y-8">
            <section>
              <h3 className="font-bold text-lg mb-4 text-primary-600 dark:text-primary-400">Section A: Multiple Choice (1 mark each)</h3>
              <div className="space-y-6">
                {[1, 2, 3].map((q) => (
                  <div key={q} className="flex gap-4">
                    <span className="font-bold">{q}.</span>
                    <div>
                      <p className="mb-3">Which of the following is known as the powerhouse of the cell?</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {['a) Nucleus', 'b) Mitochondria', 'c) Ribosome', 'd) Lysosome'].map(opt => (
                          <div key={opt} className="p-3 border rounded-lg border-slate-200 dark:border-slate-700 text-sm">{opt}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
