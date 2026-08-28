'use client';
import { useMemo, useState } from 'react';
import { DndContext, useDraggable, useDroppable, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import {
  ChemistryExperiment, CHEM_EQUIPMENT, CHEM_REAGENTS, ExperimentStep,
} from '@edusheets/content';
import {
  Check, ChevronRight, FlaskConical, Sparkles, AlertTriangle, ShieldAlert,
  Wrench, Lightbulb, HelpCircle, Send, Loader2, NotebookText, ClipboardCheck,
  Beaker, ChevronsDown, FlaskRound,
} from 'lucide-react';
import { ReactionStage } from './ReactionStage';

// Apparatus ids can carry a "#N" instance suffix (e.g. "test-tube#1") when
// an experiment genuinely needs several of the same vessel at once, like
// picking a specific tube from a rack. The suffix is purely a display/key
// concern -- CHEM_EQUIPMENT only knows the base id ("test-tube").
function parseVesselId(id: string): { baseId: string; instance?: number } {
  const match = id.match(/^(.*)#(\d+)$/);
  if (match) return { baseId: match[1], instance: Number(match[2]) };
  return { baseId: id };
}

function vesselDisplayName(id: string): string {
  const { baseId, instance } = parseVesselId(id);
  const base = CHEM_EQUIPMENT.find((a) => a.id === baseId);
  const name = base?.name || baseId;
  return instance ? `${name} ${instance}` : name;
}

function ReagentBottle({ id, name, disabled, isNeeded }: { id: string; name: string; disabled?: boolean; isNeeded?: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `reagent:${id}`, disabled });
  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      disabled={disabled}
      className={`shrink-0 px-3 py-2.5 rounded-xl border-2 text-left transition-all select-none touch-none ${
        disabled
          ? 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 text-slate-400 cursor-not-allowed'
          : isNeeded
          ? 'chem-needed border-primary-600 bg-primary-50 dark:bg-primary-900/20 cursor-grab active:cursor-grabbing scale-105'
          : 'border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-grab active:cursor-grabbing hover:shadow-[3px_3px_0_var(--color-ink)]'
      } ${isDragging ? 'opacity-30' : ''}`}
    >
      <span className="flex items-center gap-1.5 text-xs font-bold whitespace-nowrap">
        {isNeeded && <FlaskRound className="w-3.5 h-3.5 shrink-0" />} {name}
      </span>
    </button>
  );
}

// The floating visual that follows the pointer/finger while dragging --
// tilted like it's actually being tipped to pour, so picking a bottle up
// and carrying it to the beaker reads as a real action instead of an
// abstract element sliding around.
function DraggedBottlePreview({ name }: { name: string }) {
  return (
    <div className="chem-bottle-overlay px-3 py-2.5 rounded-xl border-2 border-primary-600 bg-white dark:bg-slate-800 shadow-2xl flex items-center gap-1.5 cursor-grabbing">
      <FlaskRound className="w-4 h-4 text-primary-600 shrink-0" />
      <span className="text-xs font-bold whitespace-nowrap">{name}</span>
    </div>
  );
}

function ApparatusZone({ id, name, isTarget, isDone, isPouring }: { id: string; name: string; isTarget?: boolean; isDone?: boolean; isPouring?: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: `apparatus:${id}`, disabled: isDone });
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[160px] rounded-2xl border-2 p-3 text-center transition-all ${isPouring ? 'chem-pouring' : ''} ${
        isOver
          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 shadow-[4px_4px_0_var(--color-ink)] scale-105'
          : isTarget
          ? 'chem-needed border-primary-500 dark:border-primary-500 bg-primary-50/40 dark:bg-primary-900/10'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{name}</p>
      {isTarget && !isDone && <p className="text-[10px] text-primary-600 dark:text-primary-400 font-bold mt-0.5">↓ pour here</p>}
      {isDone && <p className="text-[10px] text-accent-600 dark:text-accent-400 font-bold mt-0.5">✓ already used</p>}
    </div>
  );
}

// Not every listed apparatus is something a step ever asks you to drop a
// reagent onto (e.g. a test tube rack or a delivery tube is realistically
// "on the bench" for a whole experiment, not a drag target for any single
// step). Rendering those as an interactive-looking drop zone made them look
// permanently broken/disabled -- nothing ever highlighted them because
// nothing ever could. Render them as plain, clearly non-interactive chips
// instead, so only genuinely usable drop zones look like drop zones.
function SupportingEquipmentChip({ name }: { name: string }) {
  return (
    <div className="shrink-0 px-3 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400">
      <span className="block text-[11px] font-medium whitespace-nowrap">{name} <span className="text-slate-400 dark:text-slate-500">(on the bench)</span></span>
    </div>
  );
}

// A vessel's state, once produced, never gets thrown away -- it stays
// visible here (settled, no longer animating) for the rest of the
// experiment, exactly like a real bench where nothing vanishes just
// because you moved on to the next step.
function VesselCard({ label, reaction, isActive }: { label: string; reaction?: ExperimentStep['reaction']; isActive?: boolean }) {
  return (
    <div className={`rounded-xl border-2 p-2 text-center transition-all ${isActive ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10' : 'border-slate-200 dark:border-slate-800'}`}>
      <ReactionStage reaction={reaction} idle={!reaction} compact settled={!isActive} />
      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1">{label}</p>
    </div>
  );
}

interface LabBenchProps {
  experiment: ChemistryExperiment;
  onComplete: (result: { predictAnswerIndex: number; predictCorrect: boolean; observations: Record<string, string> }) => void;
  submitting?: boolean;
}

type Phase = 'predict' | 'steps' | 'wrapup';
interface VesselState { label: string; reaction?: ExperimentStep['reaction'] }
interface LogEntry { stepNumber: number; text: string }

export function LabBench({ experiment, onComplete, submitting }: LabBenchProps) {
  const [phase, setPhase] = useState<Phase>('predict');
  const [predictIndex, setPredictIndex] = useState<number | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [observations, setObservations] = useState<Record<string, string>>({});

  // Persisted across the whole run -- never reset when a step finishes.
  // This is the direct fix for "the beaker shouldn't disappear": once a
  // vessel gets a color/bubbles/precipitate, it stays on the bench, in that
  // state, for the rest of the experiment.
  const [vesselStates, setVesselStates] = useState<Record<string, VesselState>>({});
  const [benchOrder, setBenchOrder] = useState<string[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [stepDone, setStepDone] = useState(false);
  const [draggingReagentId, setDraggingReagentId] = useState<string | null>(null);
  const [pouringVesselId, setPouringVesselId] = useState<string | null>(null);

  const apparatus = useMemo(
    () => experiment.apparatusIds.map((id) => {
      const { baseId } = parseVesselId(id);
      const base = CHEM_EQUIPMENT.find((a) => a.id === baseId);
      return base ? { id, name: vesselDisplayName(id) } : null;
    }).filter(Boolean) as { id: string; name: string }[],
    [experiment]
  );
  const reagents = useMemo(
    () => experiment.reagentIds.map((id) => CHEM_REAGENTS.find((r) => r.id === id)).filter(Boolean) as typeof CHEM_REAGENTS,
    [experiment]
  );
  // Only apparatus that at least one step actually asks you to drop a
  // reagent onto is rendered as an interactive drop zone -- everything else
  // (a rack, a delivery tube, a retort stand) is real equipment for the
  // experiment but was never meant to be draggable-onto, so it renders as a
  // plain supporting chip instead. See SupportingEquipmentChip's comment.
  const targetableApparatusIds = useMemo(
    () => new Set(experiment.steps.map((s) => s.dragTargetApparatusId).filter(Boolean) as string[]),
    [experiment]
  );
  const activeApparatus = apparatus.filter((a) => targetableApparatusIds.has(a.id));
  const supportingApparatus = apparatus.filter((a) => !targetableApparatusIds.has(a.id));

  const currentStep = experiment.steps[stepIndex];
  const isLastStep = stepIndex === experiment.steps.length - 1;
  const stepNeedsDrag = !!(currentStep?.dragReagentId && currentStep?.dragTargetApparatusId);

  const handlePredictSubmit = () => {
    if (predictIndex === null) return;
    setPhase('steps');
  };

  const recordVesselResult = (vesselId: string, reaction?: ExperimentStep['reaction']) => {
    setVesselStates((prev) => ({ ...prev, [vesselId]: { label: vesselDisplayName(vesselId), reaction } }));
    setBenchOrder((prev) => (prev.includes(vesselId) ? prev : [...prev, vesselId]));
  };

  const completeCurrentStep = (vesselId?: string) => {
    if (!currentStep) return;
    if (vesselId) recordVesselResult(vesselId, currentStep.reaction);
    setLog((prev) => [...prev, { stepNumber: currentStep.number, text: currentStep.reaction?.description || currentStep.instruction }]);
    setStepDone(true);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setDraggingReagentId(String(event.active.id).replace('reagent:', ''));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggingReagentId(null);
    setHint(null);
    const { active, over } = event;
    if (!over || !currentStep) return;
    const droppedReagent = String(active.id).replace('reagent:', '');
    const droppedOn = String(over.id).replace('apparatus:', '');
    if (droppedReagent === currentStep.dragReagentId && droppedOn === currentStep.dragTargetApparatusId) {
      completeCurrentStep(droppedOn);
      setPouringVesselId(droppedOn);
      setTimeout(() => setPouringVesselId(null), 500);
    } else {
      setHint(currentStep.hint || 'Not quite -- check the instruction above for which reagent and apparatus this step needs.');
    }
  };

  const handlePerformClick = () => {
    completeCurrentStep(currentStep?.dragTargetApparatusId);
  };

  const advanceStep = () => {
    setStepDone(false);
    setHint(null);
    if (isLastStep) {
      setPhase('wrapup');
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const handleObservationChange = (idx: number, value: string) => {
    setObservations((prev) => ({ ...prev, [idx]: value }));
  };

  const handleFinish = () => {
    if (predictIndex === null) return;
    onComplete({
      predictAnswerIndex: predictIndex,
      predictCorrect: predictIndex === experiment.correctPredictIndex,
      observations,
    });
  };

  if (phase === 'predict') {
    return (
      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold">Predict, then Observe</h2>
            <p className="text-sm text-slate-500">Make your best guess before you see what actually happens.</p>
          </div>
        </div>
        <p className="font-medium">{experiment.predictPrompt}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {experiment.predictOptions.map((opt, i) => (
            <button
              key={i}
              onClick={() => setPredictIndex(i)}
              className={`p-4 rounded-xl text-left text-sm font-medium transition-all border-2 ${
                predictIndex === i
                  ? 'border-slate-900 bg-primary-600 text-white shadow-[3px_3px_0_var(--color-ink)]'
                  : 'border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:shadow-[3px_3px_0_var(--color-ink)]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <button
          onClick={handlePredictSubmit}
          disabled={predictIndex === null}
          className="btn-brutal px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold disabled:opacity-50 flex items-center gap-2"
        >
          Start the Experiment <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  if (phase === 'steps' && currentStep) {
    const focusVesselId = currentStep.dragTargetApparatusId;
    const focusReaction = focusVesselId ? vesselStates[focusVesselId]?.reaction : undefined;

    return (
      <div className="space-y-6">
        <div className="glass-card rounded-3xl p-6 md:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wide">Step {currentStep.number} of {experiment.steps.length}</span>
            <div className="flex gap-1">
              {experiment.steps.map((s, i) => (
                <span key={s.number} className={`w-2 h-2 rounded-full ${i <= stepIndex ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
              ))}
            </div>
          </div>
          <p className="font-medium text-lg">{currentStep.instruction}</p>
          {hint && (
            <div className="flex items-start gap-2 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl px-4 py-2.5 text-sm">
              <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" /> {hint}
            </div>
          )}

          <div className="flex justify-center">
            <ReactionStage reaction={focusReaction} idle={!focusReaction} />
          </div>

          {stepDone && (
            <div className="flex flex-col items-center gap-3 bg-accent-50 dark:bg-accent-950/20 border-2 border-accent-300 dark:border-accent-800 rounded-2xl p-4">
              {currentStep.reaction?.description && (
                <p className="text-sm text-center text-slate-700 dark:text-slate-200 max-w-md">{currentStep.reaction.description}</p>
              )}
              <button
                onClick={advanceStep}
                className="btn-brutal px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold flex items-center gap-2"
              >
                {isLastStep ? 'Finish Steps' : 'Continue to Next Step'} <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {!stepDone && !stepNeedsDrag && (
            <div className="flex justify-center">
              <button
                onClick={handlePerformClick}
                className="btn-brutal px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold flex items-center gap-2"
              >
                <ClipboardCheck className="w-5 h-5" /> Perform This Step
              </button>
            </div>
          )}
        </div>

        {/* The full lab, laid out like a real one and always fully stocked:
            a chemical shelf up top (where you pick a reagent from) and your
            workbench below it (the apparatus you pour/drop into) -- both
            stay visible and equipped for the WHOLE experiment, not just
            whatever the current step happens to need, so dragging a bottle
            "down off the shelf and into the beaker" always feels like the
            same real place rather than a UI that reshuffles every step. */}
        <div className={`glass-card rounded-3xl p-6 md:p-8 space-y-6 transition-opacity ${stepDone ? 'opacity-50 pointer-events-none' : ''}`}>
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div>
              <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wide flex items-center gap-1.5">
                <Beaker className="w-3.5 h-3.5" /> Chemical Shelf -- pick up the glowing bottle and carry it down to your equipment
              </p>
              <div className="flex flex-wrap gap-2 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-3 border border-slate-200 dark:border-slate-800">
                {reagents.map((r) => (
                  <ReagentBottle
                    key={r.id}
                    id={r.id}
                    name={r.name}
                    disabled={!stepNeedsDrag}
                    isNeeded={stepNeedsDrag && r.id === currentStep.dragReagentId}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-center text-slate-300 dark:text-slate-700">
              <ChevronsDown className="w-5 h-5" />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wide flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" /> Your Workbench
              </p>
              <div className="flex flex-wrap gap-2">
                {activeApparatus.map((a) => (
                  <ApparatusZone
                    key={a.id}
                    id={a.id}
                    name={a.name}
                    isTarget={stepNeedsDrag && a.id === currentStep.dragTargetApparatusId}
                    isDone={benchOrder.includes(a.id) && a.id !== currentStep.dragTargetApparatusId}
                    isPouring={pouringVesselId === a.id}
                  />
                ))}
              </div>
              {supportingApparatus.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {supportingApparatus.map((a) => (
                    <SupportingEquipmentChip key={a.id} name={a.name} />
                  ))}
                </div>
              )}
            </div>

            <DragOverlay dropAnimation={null}>
              {draggingReagentId ? <DraggedBottlePreview name={reagents.find((r) => r.id === draggingReagentId)?.name || ''} /> : null}
            </DragOverlay>
          </DndContext>
        </div>

        {benchOrder.length > 0 && (
          <div className="glass-card rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5"><FlaskConical className="w-3.5 h-3.5" /> Your Bench (everything stays as you left it)</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {benchOrder.map((vid) => (
                <VesselCard key={vid} label={vesselStates[vid].label} reaction={vesselStates[vid].reaction} isActive={vid === focusVesselId} />
              ))}
            </div>
          </div>
        )}

        {log.length > 0 && (
          <div className="glass-card rounded-3xl p-5 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5"><NotebookText className="w-3.5 h-3.5" /> Lab Log</h3>
            <ul className="space-y-1.5 text-sm">
              {log.map((entry, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary-600 font-bold shrink-0">{entry.stepNumber}.</span>
                  <span className="text-slate-600 dark:text-slate-300">{entry.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // wrapup
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-accent-100 dark:bg-accent-900/30 text-accent-600 flex items-center justify-center shrink-0">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold">Experiment Complete</h2>
            <p className="text-sm text-slate-500">
              {predictIndex === experiment.correctPredictIndex ? 'Your prediction was correct! 🎉' : 'Your prediction was different from what happened -- that\'s exactly how real science works.'}
            </p>
          </div>
        </div>

        {benchOrder.length > 0 && (
          <div>
            <h3 className="font-bold text-sm mb-2 flex items-center gap-2"><FlaskConical className="w-4 h-4 text-primary-600" /> Your Finished Bench</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {benchOrder.map((vid) => (
                <VesselCard key={vid} label={vesselStates[vid].label} reaction={vesselStates[vid].reaction} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2"><FlaskConical className="w-4 h-4 text-primary-600" /> What Happened, and Why</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{experiment.explanation}</p>
          {experiment.balancedEquation && (
            <p className="mt-2 text-sm font-mono bg-slate-900 text-slate-100 rounded-lg px-3 py-2 inline-block">{experiment.balancedEquation}</p>
          )}
        </div>

        {experiment.realWorldApplications.length > 0 && (
          <div>
            <h3 className="font-bold text-sm mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary-600" /> Where This Shows Up in Real Life</h3>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
              {experiment.realWorldApplications.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
        )}

        {experiment.safetyNotes.length > 0 && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-4">
            <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5"><ShieldAlert className="w-4 h-4" /> Safety Notes</p>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 list-disc list-inside">
              {experiment.safetyNotes.map((n, i) => <li key={i}>{n}</li>)}
            </ul>
          </div>
        )}

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-4 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700 dark:text-amber-400" />
          <p className="text-sm text-amber-800 dark:text-amber-300">{experiment.realLifeNote}</p>
        </div>

        {experiment.extensions.length > 0 && (
          <div>
            <h3 className="font-bold text-sm mb-2 flex items-center gap-2"><Wrench className="w-4 h-4 text-primary-600" /> Go Further</h3>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
              {experiment.extensions.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
        <h3 className="font-display text-lg font-semibold">Your Lab Notebook</h3>
        <p className="text-sm text-slate-500">Fill in your own observations -- these get saved into your lab report.</p>
        {experiment.observationPrompts.map((prompt, i) => (
          <div key={i} className="space-y-1.5">
            <label className="text-sm font-medium">{prompt}</label>
            <textarea
              value={observations[i] || ''}
              onChange={(e) => handleObservationChange(i, e.target.value)}
              rows={2}
              className="w-full p-3 rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        ))}
        <button
          onClick={handleFinish}
          disabled={submitting}
          className="btn-brutal px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
        >
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />} Save Lab Report
        </button>
      </div>
    </div>
  );
}
