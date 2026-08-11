'use client';
import { useEffect, useState } from 'react';
import {
  Loader2, ChevronDown, ChevronRight, ArrowUp, ArrowDown, Trash2, Plus,
  ExternalLink, ShieldCheck, AlertTriangle, Clock,
} from 'lucide-react';
import {
  Board, ClassRow, Subject, Chapter, Topic,
  fetchBoards, fetchClasses, fetchSubjects, fetchChapters, fetchTopics,
  updateSubject, verifySubject, createChapter, updateChapter, deleteChapter,
  createTopic, updateTopic, deleteTopic, isSubjectStale,
} from '@/lib/curriculumAdmin';

// The mechanism behind "how do we make sure CBSE/ICSE content stays
// current" -- deliberately NOT an automated scrape of the board websites
// (that would reintroduce unverified content into an app built entirely on
// hand-verified facts). Instead: an admin can edit the real chapter/topic
// backbone directly, record where they sourced it from, and mark it
// verified after actually checking it against the official syllabus. The
// dashboard (see AdminCurriculumHealth) nudges when a subject hasn't been
// checked in over a year.
export default function CurriculumManagerPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [boardId, setBoardId] = useState<string>('');
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [classId, setClassId] = useState<string>('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectId, setSubjectId] = useState<string>('');
  const [loadingBoards, setLoadingBoards] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  useEffect(() => {
    fetchBoards().then((res) => {
      setBoards(res.data);
      if (res.data.length > 0) setBoardId(res.data[0].id);
    }).finally(() => setLoadingBoards(false));
  }, []);

  useEffect(() => {
    if (!boardId) return;
    setLoadingClasses(true);
    setClassId(''); setSubjectId('');
    fetchClasses(boardId).then((res) => {
      setClasses(res.data);
      if (res.data.length > 0) setClassId(res.data[0].id);
    }).finally(() => setLoadingClasses(false));
  }, [boardId]);

  useEffect(() => {
    if (!classId) { setSubjects([]); return; }
    setLoadingSubjects(true);
    setSubjectId('');
    fetchSubjects(classId, boardId).then((res) => {
      setSubjects(res.data);
      if (res.data.length > 0) setSubjectId(res.data[0].id);
    }).finally(() => setLoadingSubjects(false));
  }, [classId, boardId]);

  const activeSubject = subjects.find((s) => s.id === subjectId);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold">Curriculum Manager</h2>
        <p className="text-sm text-slate-500">
          Edit the real chapter/topic backbone behind every worksheet and lab -- and record when you last checked it against the actual CBSE/ICSE syllabus. This never syncs automatically; a human verifying against the real document is the whole point.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-4 flex flex-wrap gap-4">
        <Picker label="Board" loading={loadingBoards}>
          {boards.map((b) => (
            <button key={b.id} onClick={() => setBoardId(b.id)} className={pickerBtn(boardId === b.id)}>{b.name}</button>
          ))}
        </Picker>
        <Picker label="Class" loading={loadingClasses}>
          {classes.map((c) => (
            <button key={c.id} onClick={() => setClassId(c.id)} className={pickerBtn(classId === c.id)}>{c.name}</button>
          ))}
        </Picker>
        <Picker label="Subject" loading={loadingSubjects}>
          {subjects.map((s) => (
            <button key={s.id} onClick={() => setSubjectId(s.id)} className={pickerBtn(subjectId === s.id)}>
              {s.name}{isSubjectStale(s) && <AlertTriangle className="inline w-3 h-3 ml-1 text-amber-500" />}
            </button>
          ))}
          {!loadingSubjects && subjects.length === 0 && classId && <p className="text-xs text-slate-400">No subjects for this class/board yet.</p>}
        </Picker>
      </div>

      {activeSubject && <SubjectPanel key={activeSubject.id} subject={activeSubject} onSubjectChange={(s) => setSubjects((prev) => prev.map((p) => (p.id === s.id ? s : p)))} />}
    </div>
  );
}

function pickerBtn(active: boolean) {
  return `px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${active ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-800 hover:border-primary-300'}`;
}

function Picker({ label, loading, children }: { label: string; loading: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5 min-w-[160px]">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
      {loading ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" /> : <div className="flex flex-wrap gap-1.5">{children}</div>}
    </div>
  );
}

function daysAgo(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / (24 * 60 * 60 * 1000));
}

function SubjectPanel({ subject, onSubjectChange }: { subject: Subject; onSubjectChange: (s: Subject) => void }) {
  const [sourceUrl, setSourceUrl] = useState(subject.syllabus_source_url || '');
  const [verifying, setVerifying] = useState(false);
  const [savingUrl, setSavingUrl] = useState(false);
  const stale = isSubjectStale(subject);

  const saveSourceUrl = async () => {
    if (sourceUrl === (subject.syllabus_source_url || '')) return;
    setSavingUrl(true);
    try {
      const res = await updateSubject(subject.id, { syllabus_source_url: sourceUrl || undefined });
      onSubjectChange(res.data);
    } catch (err) {
      console.error(err);
      alert('Could not save the source URL.');
    } finally {
      setSavingUrl(false);
    }
  };

  const markVerified = async () => {
    setVerifying(true);
    try {
      const res = await verifySubject(subject.id);
      onSubjectChange(res.data);
    } catch (err) {
      console.error(err);
      alert('Could not mark this verified.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className={`glass-card rounded-2xl p-4 space-y-3 border-2 ${stale ? 'border-amber-300 dark:border-amber-800' : 'border-transparent'}`}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h3 className="font-bold text-sm flex items-center gap-1.5">
              {subject.name} -- Syllabus Currency
              {stale
                ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full"><AlertTriangle className="w-3 h-3" /> Needs a check</span>
                : <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-600 bg-accent-50 dark:bg-accent-950/30 px-2 py-0.5 rounded-full"><ShieldCheck className="w-3 h-3" /> Verified</span>}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" />
              {subject.syllabus_last_verified_at
                ? `Last verified ${daysAgo(subject.syllabus_last_verified_at)} day(s) ago`
                : 'Never verified against an official syllabus'}
            </p>
          </div>
          <button onClick={markVerified} disabled={verifying} className="btn-brutal px-3.5 py-2 bg-accent-600 hover:bg-accent-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 disabled:opacity-50">
            {verifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />} Mark Verified Today
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            onBlur={saveSourceUrl}
            placeholder="Link to the official CBSE/CISCE syllabus document you checked this against"
            className="flex-1 rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-transparent px-2.5 py-1.5 text-xs font-mono"
          />
          {savingUrl && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />}
          {subject.syllabus_source_url && (
            <a href={subject.syllabus_source_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-primary-600">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      <ChapterList subjectId={subject.id} />
    </div>
  );
}

function ChapterList({ subjectId }: { subjectId: string }) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetchChapters(subjectId).then((res) => setChapters(res.data.sort((a, b) => a.chapter_number - b.chapter_number))).finally(() => setLoading(false));
  };
  useEffect(load, [subjectId]);

  const patch = async (id: string, changes: Partial<Pick<Chapter, 'title' | 'description'>>) => {
    setChapters((prev) => prev.map((c) => (c.id === id ? { ...c, ...changes } : c)));
    try { await updateChapter(id, changes); } catch (err) { console.error(err); load(); }
  };

  const move = async (id: string, direction: -1 | 1) => {
    const sorted = [...chapters].sort((a, b) => a.chapter_number - b.chapter_number);
    const idx = sorted.findIndex((c) => c.id === id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx], b = sorted[swapIdx];
    setChapters((prev) => prev.map((c) => {
      if (c.id === a.id) return { ...c, chapter_number: b.chapter_number };
      if (c.id === b.id) return { ...c, chapter_number: a.chapter_number };
      return c;
    }));
    try {
      await Promise.all([updateChapter(a.id, { chapter_number: b.chapter_number }), updateChapter(b.id, { chapter_number: a.chapter_number })]);
    } catch (err) { console.error(err); load(); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this chapter? Its topics will be deleted too.')) return;
    try { await deleteChapter(id); load(); } catch (err) { console.error(err); alert('Could not delete.'); }
  };

  const add = async () => {
    const nextNumber = chapters.length > 0 ? Math.max(...chapters.map((c) => c.chapter_number)) + 1 : 1;
    await createChapter({ subjectId, chapterNumber: nextNumber, title: 'New Chapter' });
    load();
  };

  if (loading) return <div className="flex items-center gap-2 text-sm text-slate-400 py-4"><Loader2 className="w-4 h-4 animate-spin" /> Loading chapters...</div>;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-sm">Chapters ({chapters.length})</h4>
        <button onClick={add} className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add Chapter</button>
      </div>
      {chapters.map((c) => (
        <div key={c.id} className="glass-card rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2">
            <button onClick={() => setExpandedId((e) => (e === c.id ? null : c.id))} className="p-1 text-slate-400 hover:text-primary-600">
              {expandedId === c.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            <span className="text-xs font-bold text-slate-400 w-6 shrink-0">{c.chapter_number}.</span>
            <input
              defaultValue={c.title}
              onBlur={(e) => e.target.value !== c.title && patch(c.id, { title: e.target.value })}
              className="flex-1 min-w-[140px] rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-transparent px-2 py-1 text-sm font-bold"
            />
            <div className="flex flex-col">
              <button onClick={() => move(c.id, -1)} className="p-0.5 text-slate-400 hover:text-primary-600"><ArrowUp className="w-3 h-3" /></button>
              <button onClick={() => move(c.id, 1)} className="p-0.5 text-slate-400 hover:text-primary-600"><ArrowDown className="w-3 h-3" /></button>
            </div>
            <button onClick={() => remove(c.id)} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          {expandedId === c.id && (
            <div className="pl-8">
              <textarea
                defaultValue={c.description || ''}
                onBlur={(e) => e.target.value !== (c.description || '') && patch(c.id, { description: e.target.value })}
                placeholder="Chapter description"
                rows={2}
                className="w-full rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-transparent px-2 py-1.5 text-xs mb-2"
              />
              <TopicList chapterId={c.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TopicList({ chapterId }: { chapterId: string }) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchTopics(chapterId).then((res) => setTopics(res.data.sort((a, b) => a.topic_number - b.topic_number))).finally(() => setLoading(false));
  };
  useEffect(load, [chapterId]);

  const patch = async (id: string, changes: Partial<Pick<Topic, 'title' | 'summary'>>) => {
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));
    try { await updateTopic(id, changes); } catch (err) { console.error(err); load(); }
  };

  const move = async (id: string, direction: -1 | 1) => {
    const sorted = [...topics].sort((a, b) => a.topic_number - b.topic_number);
    const idx = sorted.findIndex((t) => t.id === id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx], b = sorted[swapIdx];
    setTopics((prev) => prev.map((t) => {
      if (t.id === a.id) return { ...t, topic_number: b.topic_number };
      if (t.id === b.id) return { ...t, topic_number: a.topic_number };
      return t;
    }));
    try {
      await Promise.all([updateTopic(a.id, { topic_number: b.topic_number }), updateTopic(b.id, { topic_number: a.topic_number })]);
    } catch (err) { console.error(err); load(); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this topic?')) return;
    try { await deleteTopic(id); load(); } catch (err) { console.error(err); alert('Could not delete.'); }
  };

  const add = async () => {
    const nextNumber = topics.length > 0 ? Math.max(...topics.map((t) => t.topic_number)) + 1 : 1;
    await createTopic({ chapterId, topicNumber: nextNumber, title: 'New Topic' });
    load();
  };

  if (loading) return <div className="flex items-center gap-2 text-xs text-slate-400 py-2"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading topics...</div>;

  return (
    <div className="space-y-1.5 border-l-2 border-slate-200 dark:border-slate-800 pl-3">
      {topics.map((t) => (
        <div key={t.id} className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 w-5 shrink-0">{t.topic_number}.</span>
          <input
            defaultValue={t.title}
            onBlur={(e) => e.target.value !== t.title && patch(t.id, { title: e.target.value })}
            className="flex-1 min-w-[120px] rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-transparent px-2 py-1 text-xs"
          />
          <div className="flex flex-col">
            <button onClick={() => move(t.id, -1)} className="p-0.5 text-slate-400 hover:text-primary-600"><ArrowUp className="w-2.5 h-2.5" /></button>
            <button onClick={() => move(t.id, 1)} className="p-0.5 text-slate-400 hover:text-primary-600"><ArrowDown className="w-2.5 h-2.5" /></button>
          </div>
          <button onClick={() => remove(t.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
        </div>
      ))}
      <button onClick={add} className="text-[11px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 pt-1"><Plus className="w-3 h-3" /> Add Topic</button>
    </div>
  );
}
