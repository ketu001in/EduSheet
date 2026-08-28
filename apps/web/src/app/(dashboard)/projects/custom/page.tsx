'use client';
import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { downloadProjectPdf, ProjectSection } from '@/lib/project';
import { Logo } from '@/components/Logo';
import { Sparkles, Check, Printer, AlertTriangle, Loader2 } from 'lucide-react';

const LENGTH_OPTIONS = [
  { id: 'short', label: 'Short', hint: '4-5 sections, ~600 words' },
  { id: 'medium', label: 'Medium', hint: '6-8 sections, ~1200 words' },
  { id: 'long', label: 'Long', hint: '8-10 sections, ~2200 words' },
] as const;

interface GeneratedProjectResult {
  id: string;
  title: string;
  sections: ProjectSection[];
  bibliography: string[];
}

export default function CustomProjectPage() {
  const [title, setTitle] = useState('');
  const [className, setClassName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedProjectResult | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const isValid = className.trim() && subjectName.trim() && topic.trim();

  const handleGenerate = async () => {
    if (!isValid) return;
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const res = await api.post<{ success: boolean; data: { project: any; sections: ProjectSection[]; bibliography: string[] } }>(
        '/api/projects/generate-custom',
        {
          title: title.trim() || undefined,
          className: className.trim(),
          subjectName: subjectName.trim(),
          topic: topic.trim(),
          description: description.trim() || undefined,
          length,
        }
      );

      const { project, sections, bibliography } = res.data;
      setResult({ id: project.id, title: project.title, sections, bibliography });
    } catch (err: any) {
      console.error('Custom project generation error:', err);
      setGenerationError(err.message || 'Error generating project. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!result) return;
    setPdfError(null);
    setDownloadingPdf(true);
    try {
      await downloadProjectPdf(result.id);
    } catch (err) {
      console.error('Failed to open PDF:', err);
      setPdfError('The PDF isn\'t ready yet — it finishes shortly after generation. Try again in a few seconds.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const resetAll = () => {
    setTitle('');
    setClassName('');
    setSubjectName('');
    setTopic('');
    setDescription('');
    setLength('medium');
    setResult(null);
    setGenerationError(null);
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 select-none">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Custom Project</h1>
        <p className="text-slate-500">Generate a project report for any board, class, or subject — just describe what you need.</p>
      </div>

      <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
        {!result && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Class / Standard</label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. Class 8, Grade 10, Year 12"
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-transparent focus:border-primary-500/50 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="e.g. Biology, Economics"
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-transparent focus:border-primary-500/50 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Renewable Energy Sources"
                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-transparent focus:border-primary-500/50 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description / Requirements <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Any extra instructions — e.g. focus areas, required sections, real-world examples to include..."
                rows={4}
                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-transparent focus:border-primary-500/50 outline-none text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Title <span className="text-slate-400 font-normal">(optional)</span></label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Leave blank to auto-generate a title"
                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-transparent focus:border-primary-500/50 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Project Length</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {LENGTH_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setLength(opt.id)}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      length === opt.id
                        ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 font-bold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark hover:border-primary-300'
                    }`}
                  >
                    <span className="block text-sm font-bold">{opt.label}</span>
                    <span className="block text-xs text-slate-500 mt-1">{opt.hint}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {!isGenerating && !result && (
          <div className="flex flex-col items-center justify-center py-4 space-y-6 text-center border-t border-slate-200 dark:border-slate-800 pt-8">
            {generationError === 'AI_KEY_REQUIRED' && (
              <div className="w-full max-w-md p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl text-amber-800 dark:text-amber-300 text-sm font-medium space-y-3">
                <p className="flex items-center gap-3"><AlertTriangle className="w-5 h-5 shrink-0" /> You need an AI key to generate projects.</p>
                <Link href="/profile#ai-provider" className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-xs">
                  Set up your key
                </Link>
              </div>
            )}
            {generationError && generationError !== 'AI_KEY_REQUIRED' && (
              <div className="w-full max-w-md p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-300 text-sm font-medium flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" /> {generationError}
              </div>
            )}
            <button
              onClick={handleGenerate}
              disabled={!isValid}
              className="btn-brutal px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-display font-medium text-lg flex items-center gap-3 disabled:opacity-50"
            >
              <Sparkles className="w-6 h-6" /> Generate Project Report
            </button>
          </div>
        )}

        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
              <Sparkles className="w-10 h-10 text-primary-600 animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Writing Your Project Report...</h3>
              <p className="text-primary-600 dark:text-primary-400 font-medium animate-pulse">Asking your AI provider to draft the report...</p>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="p-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500 text-white rounded-xl">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-900 dark:text-green-200">Project Generated & Saved! 🎉</h3>
                  <p className="text-sm text-green-700 dark:text-green-400">Your AI-drafted project report is ready to print & download.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <button
                  onClick={handleDownloadPdf}
                  disabled={downloadingPdf}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 disabled:opacity-50"
                >
                  {downloadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />} Download PDF
                </button>
                <button
                  onClick={resetAll}
                  className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Create Another
                </button>
              </div>
              {pdfError && <p className="w-full text-xs text-red-600 dark:text-red-400 font-medium">{pdfError}</p>}
            </div>

            <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 print:shadow-none print:border-none print:p-0">
              <div className="flex justify-end items-center gap-1.5 mb-3">
                <Logo size={16} />
                <span className="text-[10px] font-bold text-slate-400 tracking-wide">BOSKET&apos;S EDUSHEET</span>
              </div>
              <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
                <h1 className="text-2xl font-bold uppercase tracking-wide">{result.title}</h1>
                <p className="text-sm font-medium text-slate-600">{subjectName} • Topic: {topic}</p>
                <div className="flex justify-between items-center text-xs mt-4 pt-2 border-t border-slate-200">
                  <span>Name: ________________________</span>
                  <span>Class: {className}</span>
                </div>
              </div>

              <div className="space-y-6 text-sm">
                {result.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="font-bold text-base">{sec.heading}</h4>
                    <p className="text-justify leading-relaxed">{sec.content}</p>
                  </div>
                ))}
                {result.bibliography.length > 0 && (
                  <div className="space-y-2 border-t border-slate-200 pt-4">
                    <h4 className="font-bold text-base">Bibliography</h4>
                    {result.bibliography.map((b, idx) => (
                      <p key={idx}>{idx + 1}. {b}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {!result && (
        <div className="text-center mt-6">
          <Link href="/projects" className="text-xs text-slate-400 hover:text-primary-600">View saved projects</Link>
        </div>
      )}
    </div>
  );
}
