'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trash2, Eye, Printer, X, Sparkles, Cpu, Loader2, RefreshCw, FileDown,
  Bot, Brain, Code2, Wrench, ShieldAlert, PlayCircle, ExternalLink, ArrowRight, FolderOpen,
} from 'lucide-react';
import {
  fetchTechProjects, fetchTechProject, deleteTechProject, downloadTechProjectPdf, regenerateTechProjectPdf,
  techProjectToMarkdown, CATEGORY_LABEL, TechProjectSummary, TechProjectDetail, TechProjectCategory,
} from '@/lib/techProject';
import { downloadMarkdownFile } from '@/lib/studyMaterial';
import { Logo } from '@/components/Logo';

const CATEGORY_ICON: Record<TechProjectCategory, typeof Bot> = { robotics: Bot, ai: Brain, coding: Code2 };

export default function TechLabPage() {
  const [projects, setProjects] = useState<TechProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<TechProjectDetail | null>(null);
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [regeneratingPdf, setRegeneratingPdf] = useState(false);

  useEffect(() => {
    fetchTechProjects()
      .then((res) => setProjects(res.data))
      .catch((err) => console.error('Failed to load tech projects:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const openProject = async (p: TechProjectSummary) => {
    setLoadingProjectId(p.id);
    try {
      const res = await fetchTechProject(p.id);
      setSelectedProject(res.data);
    } catch (err) {
      console.error('Failed to load tech project:', err);
    } finally {
      setLoadingProjectId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setDeletingId(id);
    try {
      await deleteTechProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete tech project:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadPdf = async (id: string) => {
    setPdfError(null);
    setDownloadingPdf(true);
    try {
      await downloadTechProjectPdf(id);
    } catch (err) {
      console.error('Failed to open PDF:', err);
      setPdfError('The PDF isn\'t ready yet — it may have failed to generate. Try regenerating it below.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleRegeneratePdf = async (id: string) => {
    setPdfError(null);
    setRegeneratingPdf(true);
    try {
      await regenerateTechProjectPdf(id);
      setPdfError(null);
    } catch (err) {
      console.error('Failed to regenerate PDF:', err);
      setPdfError('Regeneration failed. Please try again in a moment.');
    } finally {
      setRegeneratingPdf(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tech Lab</h1>
          <p className="text-slate-500 text-sm">Robotics, AI, and Coding -- three labs, each with real study content plus hands-on projects you can build.</p>
        </div>
        <Link
          href="/tech-lab/new"
          className="btn-brutal px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-sm shadow-primary-500/20 flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Sparkles className="w-4 h-4" /> New Build
        </Link>
      </div>

      <div className="space-y-3">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Choose a Lab</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <LabHubCard
            href="/tech-lab/robotics"
            icon={Bot}
            name="Robotics Lab"
            description="Real sensor specs, actuator math, control theory, and 24 real robots doing real jobs -- every one genuinely playable."
            colorClasses={{ badge: 'bg-indigo-600', ring: 'hover:border-indigo-500', stripe: 'bg-indigo-600', cta: 'text-indigo-600 dark:text-indigo-400' }}
          />
          <LabHubCard
            href="/tech-lab/ai"
            icon={Brain}
            name="AI Lab"
            description="What machine learning actually is, real classic ML algorithms, and a working perceptron you can train by hand."
            colorClasses={{ badge: 'bg-violet-600', ring: 'hover:border-violet-500', stripe: 'bg-violet-600', cta: 'text-violet-600 dark:text-violet-400' }}
          />
          <LabHubCard
            href="/tech-lab/coding"
            icon={Code2}
            name="Coding Lab"
            description="Algorithms, loops, conditionals, functions -- and a real race between linear and binary search."
            colorClasses={{ badge: 'bg-teal-600', ring: 'hover:border-teal-500', stripe: 'bg-teal-600', cta: 'text-teal-600 dark:text-teal-400' }}
          />
        </div>
      </div>

      <div className="torn-edge" />

      <div className="flex items-center gap-2">
        <FolderOpen className="w-4 h-4 text-slate-400" />
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Your Builds</p>
      </div>

      {isLoading ? (
        <div className="glass-card p-12 rounded-3xl text-center flex items-center justify-center gap-2 text-slate-400 my-8">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading your Tech Lab projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center max-w-md mx-auto space-y-4 my-8">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl flex items-center justify-center mx-auto">
            <Cpu className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold">No Builds Yet</h3>
          <p className="text-sm text-slate-500">You have not built any Robotics, AI, or Coding projects yet.</p>
          <Link href="/tech-lab/new" className="inline-flex items-center gap-2 btn-brutal px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl text-sm">
            <Sparkles className="w-4 h-4" /> Start a Build
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => {
            const Icon = CATEGORY_ICON[p.category];
            return (
              <div key={p.id} className="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between hover:border-primary-500/50 transition-all">
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-bold flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" /> {CATEGORY_LABEL[p.category]}
                    </span>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete Project"
                    >
                      {deletingId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>

                  <h3 className="font-bold text-lg leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-400">{p.boards?.name || ''} {p.classes?.name ? `• ${p.classes.name}` : ''}</p>
                  <p className="text-xs font-medium text-slate-500 line-clamp-2">{p.idea_prompt}</p>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => openProject(p)}
                    disabled={loadingProjectId === p.id}
                    className="w-full py-2.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors disabled:opacity-50"
                  >
                    {loadingProjectId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />} View & Print
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative space-y-6">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-between items-center pr-8 border-b pb-4 border-slate-200 dark:border-slate-800">
              <div>
                <span className="px-2.5 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-bold uppercase">
                  {CATEGORY_LABEL[selectedProject.category]} • {selectedProject.classes?.name}
                </span>
                <h2 className="text-xl font-bold mt-2">{selectedProject.title}</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadMarkdownFile(
                    `${selectedProject.title.replace(/[^a-z0-9]+/gi, '-')}.md`,
                    techProjectToMarkdown(selectedProject)
                  )}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold flex items-center gap-2 hover:border-primary-300"
                >
                  <FileDown className="w-4 h-4" /> .md
                </button>
                <button
                  onClick={() => handleDownloadPdf(selectedProject.id)}
                  disabled={downloadingPdf}
                  className="btn-brutal px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {downloadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />} PDF
                </button>
              </div>
            </div>
            {pdfError && (
              <div className="flex items-center justify-between gap-3 bg-red-50 dark:bg-red-950/30 rounded-xl px-4 py-2.5">
                <p className="text-xs text-red-600 font-medium">{pdfError}</p>
                <button
                  onClick={() => handleRegeneratePdf(selectedProject.id)}
                  disabled={regeneratingPdf}
                  className="shrink-0 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {regeneratingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />} Regenerate PDF
                </button>
              </div>
            )}

            <div className="bg-white text-slate-900 p-6 rounded-2xl border border-slate-200 space-y-8 text-left">
              <div className="flex justify-end items-center gap-1.5">
                <Logo size={16} />
                <span className="text-[10px] font-bold text-slate-400 tracking-wide">BOSKET&apos;S EDUSHEET</span>
              </div>
              <div className="text-center border-b pb-4 border-slate-900 -mt-2">
                <h1 className="text-2xl font-bold uppercase">{selectedProject.title}</h1>
                <p className="text-sm font-semibold text-slate-600">{CATEGORY_LABEL[selectedProject.category]} • {selectedProject.classes?.name}</p>
              </div>

              <div className="space-y-8 text-sm">
                <div>
                  <h4 className="font-bold text-base mb-2">Purpose &amp; Core Idea</h4>
                  <p className="text-justify leading-relaxed">{selectedProject.purpose}</p>
                </div>

                <div>
                  <h4 className="font-bold text-base mb-2">What You&apos;ll Need</h4>
                  <ul className="space-y-1.5">
                    {selectedProject.materials.map((m, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border border-slate-400 rounded-sm shrink-0" /> {m}
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedProject.hardware_upgrade?.available && selectedProject.hardware_upgrade.items.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5" /> Optional Hardware Upgrade -- not required
                    </p>
                    <ul className="space-y-1.5">
                      {selectedProject.hardware_upgrade.items.map((it, i) => (
                        <li key={i}>
                          <span className="font-semibold">{it.name}</span>{it.approxCostINR ? ` (~${it.approxCostINR})` : ''} — {it.purpose}
                        </li>
                      ))}
                    </ul>
                    {selectedProject.hardware_upgrade.note && <p className="text-xs text-slate-600 mt-2">{selectedProject.hardware_upgrade.note}</p>}
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-base mb-3">Step-by-Step Build</h4>
                  <ol className="space-y-5">
                    {selectedProject.steps.map((s) => (
                      <li key={s.number} className="flex gap-3">
                        <span className="w-7 h-7 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{s.number}</span>
                        <div className="pt-0.5 flex-1">
                          <p className="font-semibold mb-1">{s.title}</p>
                          <p className="leading-relaxed">{s.instruction}</p>
                          {s.imageUrl && (
                            <div className="mt-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={s.imageUrl} alt={s.title} className="max-w-xs rounded-lg border border-slate-200" />
                              <p className="text-[10px] text-amber-700 italic mt-1 max-w-xs">
                                AI-generated illustration — verify against the written steps before wiring or connecting anything.
                              </p>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {selectedProject.simulation_guide && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <PlayCircle className="w-3.5 h-3.5" /> Try It in Simulation
                    </p>
                    <p className="font-semibold">{selectedProject.simulation_guide.tool}</p>
                    <a href={selectedProject.simulation_guide.toolUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline text-xs flex items-center gap-1 mt-0.5">
                      {selectedProject.simulation_guide.toolUrl} <ExternalLink className="w-3 h-3" />
                    </a>
                    <p className="mt-2 leading-relaxed">{selectedProject.simulation_guide.instructions}</p>
                  </div>
                )}

                {selectedProject.code_snippet && (
                  <div>
                    <h4 className="font-bold text-base mb-2">Code {selectedProject.code_language ? `(${selectedProject.code_language})` : ''}</h4>
                    <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 text-xs overflow-x-auto"><code>{selectedProject.code_snippet}</code></pre>
                  </div>
                )}

                {selectedProject.troubleshooting?.length > 0 && (
                  <div>
                    <h4 className="font-bold text-base mb-2">Troubleshooting</h4>
                    <ul className="space-y-2">
                      {selectedProject.troubleshooting.map((t, i) => (
                        <li key={i}>
                          <span className="font-semibold">{t.issue}</span> — <span className="text-slate-600">{t.fix}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedProject.safety_notes?.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-[10px] font-bold text-red-800 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" /> Safety Notes
                    </p>
                    <ul className="space-y-1 list-disc list-inside">
                      {selectedProject.safety_notes.map((n, i) => <li key={i}>{n}</li>)}
                    </ul>
                  </div>
                )}

                {selectedProject.extensions?.length > 0 && (
                  <div>
                    <h4 className="font-bold text-base mb-2">Go Further</h4>
                    <ul className="space-y-1.5 list-disc list-inside">
                      {selectedProject.extensions.map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// The 3 primary lab entry points -- deliberately louder and more colorful
// than the "Your Builds" project cards below (a full-color icon badge, a
// colored top stripe, a distinct color per lab, an explicit "Explore Lab"
// CTA) specifically so they read as top-level NAVIGATION into a whole
// lab, not as one more item in the list of things you've generated.
// Direct fix for feedback that the two card types were visually
// indistinguishable.
function LabHubCard({ href, icon: Icon, name, description, colorClasses }: {
  href: string;
  icon: typeof Bot;
  name: string;
  description: string;
  colorClasses: { badge: string; ring: string; stripe: string; cta: string };
}) {
  return (
    <Link href={href} className={`group block glass-card rounded-2xl overflow-hidden ${colorClasses.ring} hover:-translate-y-1 transition-all`}>
      <div className={`h-1.5 ${colorClasses.stripe}`} />
      <div className="p-5 space-y-3">
        <div className={`w-12 h-12 rounded-xl ${colorClasses.badge} text-white flex items-center justify-center shadow-sm`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-base">{name}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
        <p className={`text-xs font-bold flex items-center gap-1 ${colorClasses.cta} group-hover:gap-1.5 transition-all`}>
          Explore Lab <ArrowRight className="w-3.5 h-3.5" />
        </p>
      </div>
    </Link>
  );
}
