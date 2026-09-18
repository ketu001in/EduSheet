'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import { Play, RotateCcw, Code2, Blocks as BlocksIcon, Loader2, CheckCircle2, Lightbulb, Target } from 'lucide-react';
import {
  BLOCK_TOOLBOX, BLOCK_MISSIONS, BlockLanguage, generateCode, buildMission, checkMissionOutput, ensureGeneratorPatches,
} from '@/lib/blockCodingEngine';

// Real drag-and-drop block programming, built on Google Blockly (see
// blockCodingEngine.ts's header). Blocks generate genuinely real
// JavaScript and Python live -- the Blocks/Code toggle shows the literal
// code that "Run" will actually execute, and execution happens for real
// (in a dedicated, disposable Web Worker per language -- see
// /public/workers/{jsRunner,pyRunner}.worker.js), not a canned response.
export default function BlockCodingStudio() {
  const divRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const languageRef = useRef<BlockLanguage>('javascript');
  const pyWorkerRef = useRef<Worker | null>(null);

  const [viewMode, setViewMode] = useState<'blocks' | 'code'>('blocks');
  const [language, setLanguage] = useState<BlockLanguage>('javascript');
  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [pyFirstLoad, setPyFirstLoad] = useState(false);
  const [output, setOutput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [missionId, setMissionId] = useState<string | null>(null);
  const [missionPassed, setMissionPassed] = useState(false);

  useEffect(() => { languageRef.current = language; }, [language]);

  useEffect(() => {
    ensureGeneratorPatches();
    if (!divRef.current) return undefined;
    const workspace = Blockly.inject(divRef.current, {
      toolbox: BLOCK_TOOLBOX,
      grid: { spacing: 24, length: 2, colour: '#e2e8f0', snap: true },
      trashcan: true,
      zoom: { controls: true, wheel: true, startScale: 0.85 },
    });
    workspaceRef.current = workspace;
    const listener = () => {
      setCode(generateCode(workspace, languageRef.current));
    };
    workspace.addChangeListener(listener);
    return () => {
      workspace.removeChangeListener(listener);
      workspace.dispose();
      workspaceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    setCode(generateCode(workspace, language));
  }, [language]);

  useEffect(() => () => { pyWorkerRef.current?.terminate(); }, []);

  const showBlocks = useCallback(() => {
    setViewMode('blocks');
    requestAnimationFrame(() => {
      if (workspaceRef.current) Blockly.svgResize(workspaceRef.current);
    });
  }, []);

  const runCode = useCallback(() => {
    setRunning(true); setOutput(''); setErrorMsg(null); setMissionPassed(false);
    const isPy = language === 'python';
    const timeoutMs = isPy ? 25000 : 4000;
    let worker: Worker;
    if (isPy) {
      if (!pyWorkerRef.current) {
        setPyFirstLoad(true);
        pyWorkerRef.current = new Worker('/workers/pyRunner.worker.js');
      }
      worker = pyWorkerRef.current;
    } else {
      worker = new Worker('/workers/jsRunner.worker.js');
    }
    const timer = setTimeout(() => {
      worker.terminate();
      if (isPy) pyWorkerRef.current = null;
      setRunning(false); setPyFirstLoad(false);
      setErrorMsg('Execution timed out (possibly an infinite loop) -- stopped automatically.');
    }, timeoutMs);
    worker.onmessage = (e: MessageEvent<{ ok: boolean; output: string; error?: string }>) => {
      clearTimeout(timer);
      setRunning(false); setPyFirstLoad(false);
      const out = e.data.output || '';
      setOutput(out);
      setErrorMsg(e.data.ok ? null : (e.data.error || 'Unknown error'));
      if (!isPy) worker.terminate();
      if (missionId && e.data.ok) setMissionPassed(checkMissionOutput(missionId, out));
    };
    worker.onerror = (e: ErrorEvent) => {
      clearTimeout(timer);
      setRunning(false); setPyFirstLoad(false);
      setErrorMsg(e.message || 'Worker error');
      worker.terminate();
      if (isPy) pyWorkerRef.current = null;
    };
    worker.postMessage({ code });
  }, [code, language, missionId]);

  const loadMission = (id: string) => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    buildMission(workspace, id);
    setMissionId(id);
    setMissionPassed(false);
    setOutput(''); setErrorMsg(null);
    setCode(generateCode(workspace, language));
  };

  const resetWorkspace = () => {
    workspaceRef.current?.clear();
    setMissionId(null); setMissionPassed(false);
    setOutput(''); setErrorMsg(null);
    setCode('');
  };

  const activeMission = BLOCK_MISSIONS.find((m) => m.id === missionId) ?? null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {BLOCK_MISSIONS.map((m) => (
          <button
            key={m.id}
            onClick={() => loadMission(m.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${missionId === m.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-800 hover:border-primary-300'}`}
          >
            {m.title}
          </button>
        ))}
      </div>

      {activeMission && (
        <div className="rounded-xl border-2 border-dashed border-primary-300 dark:border-primary-800 bg-primary-50/40 dark:bg-primary-950/10 p-3 space-y-1">
          <p className="text-xs font-bold flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-primary-600" /> Goal: {activeMission.goal}</p>
          <p className="text-[11px] text-slate-500 flex items-start gap-1.5"><Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" /> {activeMission.hint}</p>
          {missionPassed && <p className="text-xs font-bold text-accent-600 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Mission complete -- real output matched exactly.</p>}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
          <button onClick={showBlocks} className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${viewMode === 'blocks' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}>
            <BlocksIcon className="w-3.5 h-3.5" /> Blocks
          </button>
          <button onClick={() => setViewMode('code')} className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${viewMode === 'code' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}>
            <Code2 className="w-3.5 h-3.5" /> Code
          </button>
        </div>
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
          <button onClick={() => setLanguage('javascript')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${language === 'javascript' ? 'bg-white dark:bg-slate-900 shadow-sm text-amber-600' : 'text-slate-500'}`}>JavaScript</button>
          <button onClick={() => setLanguage('python')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${language === 'python' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}>Python</button>
        </div>
      </div>

      <div className={viewMode === 'blocks' ? 'block' : 'hidden'}>
        <div ref={divRef} className="w-full rounded-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden" style={{ height: 380 }} />
      </div>
      {viewMode === 'code' && (
        <pre className="w-full rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 p-4 overflow-auto text-xs leading-relaxed" style={{ height: 380 }}>
          {code || '// Drag blocks in the Blocks view to see real generated code here.'}
        </pre>
      )}

      <div className="flex flex-wrap justify-center gap-2">
        <button onClick={runCode} disabled={running || !code.trim()} className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} Run
        </button>
        <button onClick={resetWorkspace} className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"><RotateCcw className="w-4 h-4" /> Clear Workspace</button>
      </div>

      {pyFirstLoad && <p className="text-center text-xs text-slate-400">Loading the real Python runtime (Pyodide, first run only) -- this can take a few seconds...</p>}

      {(output || errorMsg) && (
        <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-3 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Output</p>
          {output && <pre className="text-xs whitespace-pre-wrap font-mono">{output}</pre>}
          {errorMsg && <p className="text-xs font-mono text-red-600">{errorMsg}</p>}
        </div>
      )}
    </div>
  );
}
