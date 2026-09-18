'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Eye, Printer, X, Sparkles, BookOpen, Loader2, RefreshCw, FileDown, User, GraduationCap, ClipboardList } from 'lucide-react';
import {
  fetchStudyMaterials, fetchStudyMaterial, deleteStudyMaterial, downloadStudyMaterialPdf, regenerateStudyMaterialPdf,
  downloadMarkdownFile, studyMaterialToMarkdown, StudyMaterialSummary, StudyMaterialDetail,
} from '@/lib/studyMaterial';
import { Logo } from '@/components/Logo';
import { LessonPlanContent } from '@/components/LessonPlanContent';
import RoleGate from '@/components/RoleGate';

export default function StudyMaterialPage() {
  return (
    <RoleGate allow={['teacher', 'parent']}>
      <StudyMaterialPageContent />
    </RoleGate>
  );
}

function StudyMaterialPageContent() {
  const [materials, setMaterials] = useState<StudyMaterialSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterialDetail | null>(null);
  const [loadingMaterialId, setLoadingMaterialId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [regeneratingPdf, setRegeneratingPdf] = useState(false);

  useEffect(() => {
    fetchStudyMaterials()
      .then((res) => setMaterials(res.data))
      .catch((err) => console.error('Failed to load study material:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const openMaterial = async (m: StudyMaterialSummary) => {
    setLoadingMaterialId(m.id);
    try {
      const res = await fetchStudyMaterial(m.id);
      setSelectedMaterial(res.data);
    } catch (err) {
      console.error('Failed to load study material:', err);
    } finally {
      setLoadingMaterialId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this study material?')) return;
    setDeletingId(id);
    try {
      await deleteStudyMaterial(id);
      setMaterials((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Failed to delete study material:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadPdf = async (id: string) => {
    setPdfError(null);
    setDownloadingPdf(true);
    try {
      await downloadStudyMaterialPdf(id);
    } catch (err) {
      console.error('Failed to open PDF:', err);
      setPdfError('The PDF isn\'t ready yet — it may have failed to generate. Try regenerating it below.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Pre-fills the standalone Activity Sheet wizard from an already-generated
  // study material. boardId isn't stored directly on study_materials, but
  // subjects always carry an explicit board_id (there's no "shared/global"
  // subject the way classes work -- CBSE Class 5 has "EVS", ICSE Class 5 has
  // "Science" instead, as entirely different subject rows) -- so the
  // subject's own board_id reliably identifies the right board. Without
  // this, defaulting to CBSE would silently fail to find a non-CBSE
  // subject/chapter and leave the wizard stuck on the subject step.
  const activitySheetHref = (m: StudyMaterialDetail) => {
    const params = new URLSearchParams();
    if (m.subjects?.board_id) params.set('boardId', m.subjects.board_id);
    if (m.class_id) params.set('classId', m.class_id);
    if (m.subject_id) params.set('subjectId', m.subject_id);
    if (m.chapter_id) params.set('chapterId', m.chapter_id);
    const topicIds = m.settings?.topicIds;
    const topics = m.settings?.topics;
    if (topicIds?.length) params.set('topicIds', topicIds.join('|'));
    if (topics?.length) params.set('topics', topics.join('|'));
    return `/activity-sheet/new?${params.toString()}`;
  };

  const handleRegeneratePdf = async (id: string) => {
    setPdfError(null);
    setRegeneratingPdf(true);
    try {
      await regenerateStudyMaterialPdf(id);
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
          <h1 className="text-3xl font-bold">Study Material</h1>
          <p className="text-slate-500 text-sm">Combined teaching notes and student revision notes you&apos;ve generated.</p>
        </div>
        <Link
          href="/study-material/new"
          className="btn-brutal px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-sm shadow-primary-500/20 flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Sparkles className="w-4 h-4" /> Create Study Material
        </Link>
      </div>

      {isLoading ? (
        <div className="glass-card p-12 rounded-3xl text-center flex items-center justify-center gap-2 text-slate-400 my-8">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading your study material...
        </div>
      ) : materials.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center max-w-md mx-auto space-y-4 my-8">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold">No Study Material Yet</h3>
          <p className="text-sm text-slate-500">You have not generated any study material yet.</p>
          <Link href="/study-material/new" className="inline-flex items-center gap-2 btn-brutal px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl text-sm">
            <Sparkles className="w-4 h-4" /> Generate Study Material
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((m) => (
            <div key={m.id} className="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between hover:border-primary-500/50 transition-all">
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-bold">
                    {m.subjects?.name || 'Study Material'}
                  </span>
                  <button
                    onClick={() => handleDelete(m.id)}
                    disabled={deletingId === m.id}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete Study Material"
                  >
                    {deletingId === m.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>

                <h3 className="font-bold text-lg leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-400">{m.classes?.name || ''}</p>
                <p className="text-xs font-medium text-slate-500 line-clamp-1">
                  Chapter: {m.chapters?.title || 'General'}
                </p>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => openMaterial(m)}
                  disabled={loadingMaterialId === m.id}
                  className="w-full py-2.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors disabled:opacity-50"
                >
                  {loadingMaterialId === m.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />} View & Print
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMaterial && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative space-y-6">
            <button
              onClick={() => setSelectedMaterial(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-between items-center pr-8 border-b pb-4 border-slate-200 dark:border-slate-800">
              <div>
                <span className="px-2.5 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-bold uppercase">
                  {selectedMaterial.subjects?.name} • {selectedMaterial.classes?.name}
                </span>
                <h2 className="text-xl font-bold mt-2">{selectedMaterial.title}</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadMarkdownFile(`${selectedMaterial.title.replace(/[^a-z0-9]+/gi, '-')}.md`, studyMaterialToMarkdown(selectedMaterial.title, selectedMaterial.sections))}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold flex items-center gap-2 hover:border-primary-300"
                >
                  <FileDown className="w-4 h-4" /> .md
                </button>
                <button
                  onClick={() => handleDownloadPdf(selectedMaterial.id)}
                  disabled={downloadingPdf}
                  className="btn-brutal px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {downloadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />} PDF
                </button>
                <Link
                  href={activitySheetHref(selectedMaterial)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg"
                >
                  <ClipboardList className="w-4 h-4" /> Activity Sheet
                </Link>
              </div>
            </div>
            {pdfError && (
              <div className="flex items-center justify-between gap-3 bg-red-50 dark:bg-red-950/30 rounded-xl px-4 py-2.5">
                <p className="text-xs text-red-600 font-medium">{pdfError}</p>
                <button
                  onClick={() => handleRegeneratePdf(selectedMaterial.id)}
                  disabled={regeneratingPdf}
                  className="shrink-0 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {regeneratingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />} Regenerate PDF
                </button>
              </div>
            )}

            <div className="bg-white text-slate-900 p-6 rounded-2xl border border-slate-200 space-y-6 text-left">
              <div className="flex justify-end items-center gap-1.5">
                <Logo size={16} />
                <span className="text-[10px] font-bold text-slate-400 tracking-wide">BOSKET&apos;S EDUSHEET</span>
              </div>
              <div className="text-center border-b pb-4 border-slate-900 -mt-2">
                <h1 className="text-2xl font-bold uppercase">{selectedMaterial.title}</h1>
                <p className="text-sm font-semibold text-slate-600">Chapter: {selectedMaterial.chapters?.title || 'General'} • Grade: {selectedMaterial.classes?.name}</p>
              </div>

              <div className="space-y-6 text-sm">
                {selectedMaterial.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-2">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                      sec.audience === 'teacher' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {sec.audience === 'teacher' ? <><User className="w-3 h-3" /> For Teachers/Parents</> : <><GraduationCap className="w-3 h-3" /> For Students</>}
                    </span>
                    <h4 className="font-bold text-base">{sec.heading}</h4>
                    {sec.audience === 'teacher' ? <LessonPlanContent content={sec.content} /> : <p className="text-justify leading-relaxed">{sec.content}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
