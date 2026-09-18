'use client';
import { useState } from 'react';
import { Zap, Sparkles, Search } from 'lucide-react';
import { STUDY_OUTCOMES, evaluateSplit, bestSplit, parentEntropy } from '@/lib/aiCodingEngine';

// A branching tree structure is genuinely clearest as an actual tree
// diagram, not a 3D scene -- so this leans into a different kind of
// playful: try any threshold yourself and watch the real entropy/
// information-gain numbers respond live, then reveal the true optimal
// split the real ID3 algorithm would pick, with an animated tree diagram.
const HOURS_MAX = 8;
function toX(hours: number) { return 20 + (hours / HOURS_MAX) * 220; }

export default function DecisionTreeScene() {
  const [threshold, setThreshold] = useState(4);
  const [revealed, setRevealed] = useState(false);

  const split = evaluateSplit(STUDY_OUTCOMES, threshold);
  const parentH = parentEntropy(STUDY_OUTCOMES);
  const best = bestSplit(STUDY_OUTCOMES);
  const isOptimal = Math.abs(split.infoGain - best.infoGain) < 1e-9;

  const findBest = () => { setThreshold(best.threshold); setRevealed(true); };

  const leftPassed = STUDY_OUTCOMES.filter((d) => d.hours < threshold && d.passed).length;
  const rightPassed = STUDY_OUTCOMES.filter((d) => d.hours >= threshold && d.passed).length;
  const leftMajority = leftPassed >= split.leftCount / 2 ? 'Pass' : 'Fail';
  const rightMajority = rightPassed >= split.rightCount / 2 ? 'Pass' : 'Fail';

  return (
    <div className="rounded-2xl border-2 border-primary-200 dark:border-primary-900 bg-gradient-to-br from-primary-50/60 via-white to-accent-50/40 dark:from-primary-950/20 dark:via-slate-950 dark:to-accent-950/10 p-4 md:p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
        <Zap className="w-4 h-4 text-primary-600" /> Find the Best Yes/No Question
      </div>
      <p className="text-center text-xs text-slate-500">12 students, hours studied vs pass/fail. Drag the threshold and watch real entropy and information gain respond -- then let the real algorithm find the actual best split.</p>

      <svg viewBox="0 0 260 70" className="w-full h-16">
        <line x1={20} y1={40} x2={240} y2={40} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={1.5} />
        <line x1={toX(threshold)} y1={15} x2={toX(threshold)} y2={65} stroke="#7c3aed" strokeWidth={2} strokeDasharray="4 3" />
        {STUDY_OUTCOMES.map((d, i) => (
          <circle key={i} cx={toX(d.hours)} cy={40} r={5} className={d.passed ? 'fill-accent-500' : 'fill-red-500'} />
        ))}
      </svg>
      <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-500">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-accent-500 inline-block" /> Passed</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Failed</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-primary-600 inline-block" style={{ borderTop: '2px dashed #7c3aed', background: 'transparent' }} /> Threshold</span>
      </div>

      <label className="block text-xs font-bold text-slate-500 space-y-1 max-w-sm mx-auto">
        <span>Split at: hours &lt; {threshold.toFixed(1)}</span>
        <input type="range" min={0.5} max={7.5} step={0.1} value={threshold} onChange={(e) => { setThreshold(parseFloat(e.target.value)); setRevealed(false); }} className="w-full accent-primary-600" />
      </label>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-2.5">
          <p className="text-[9px] font-bold text-slate-400 uppercase">Parent Entropy</p>
          <p className="text-sm font-mono font-bold text-slate-700 dark:text-slate-200">{parentH.toFixed(3)}</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-2.5">
          <p className="text-[9px] font-bold text-slate-400 uppercase">Weighted Child Entropy</p>
          <p className="text-sm font-mono font-bold text-slate-700 dark:text-slate-200">{(split.leftEntropy * split.leftCount / STUDY_OUTCOMES.length + split.rightEntropy * split.rightCount / STUDY_OUTCOMES.length).toFixed(3)}</p>
        </div>
        <div className={`rounded-xl p-2.5 ${isOptimal ? 'bg-accent-50 dark:bg-accent-900/20' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
          <p className="text-[9px] font-bold text-slate-400 uppercase">Information Gain</p>
          <p className={`text-sm font-mono font-bold ${isOptimal ? 'text-accent-600' : 'text-slate-700 dark:text-slate-200'}`}>{split.infoGain.toFixed(3)}</p>
        </div>
      </div>

      <div className="flex justify-center">
        <button onClick={findBest} className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"><Search className="w-4 h-4" /> Find Best Split</button>
      </div>

      {revealed && isOptimal && (
        <div className="space-y-2 animate-[fadeIn_0.3s_ease-in]">
          <p className="text-center text-xs font-bold text-accent-600 flex items-center justify-center gap-1"><Sparkles className="w-3.5 h-3.5" /> This is the real optimal split -- highest information gain of every threshold tested.</p>
          <div className="flex flex-col items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg border-2 border-primary-400 bg-primary-50 dark:bg-primary-900/20 text-xs font-bold">hours &lt; {threshold.toFixed(1)}?</div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-bold mb-1">YES</p>
                <div className="px-3 py-1.5 rounded-lg border-2 border-slate-300 dark:border-slate-700 text-xs font-bold">{leftMajority} ({split.leftCount})</div>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-bold mb-1">NO</p>
                <div className="px-3 py-1.5 rounded-lg border-2 border-slate-300 dark:border-slate-700 text-xs font-bold">{rightMajority} ({split.rightCount})</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
