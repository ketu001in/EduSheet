'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, X, Search, Thermometer, Layers, Hash, Scale,
  Flame, Wind, History, Volume2, VolumeX,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { PERIODIC_TABLE, PeriodicElement } from '@edusheets/content';
import { isSpeechSupported, speak, stopSpeaking } from '@/lib/speech';
import { useDeepDives } from '@/lib/useDeepDives';
import DeepDiveTrigger from '@/components/labshared/DeepDiveTrigger';

const PeriodicTable3DScene = dynamic(() => import('@/components/chemlab/PeriodicTable3DScene'), {
  ssr: false,
  loading: () => <div className="w-full h-[560px] rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});

const CATEGORY_COLOR: Record<string, string> = {
  'alkali metal': 'bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300',
  'alkaline earth metal': 'bg-orange-100 dark:bg-orange-900/40 border-orange-300 dark:border-orange-800 text-orange-800 dark:text-orange-300',
  'transition metal': 'bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300',
  'post-transition metal': 'bg-lime-100 dark:bg-lime-900/40 border-lime-300 dark:border-lime-800 text-lime-800 dark:text-lime-300',
  metalloid: 'bg-teal-100 dark:bg-teal-900/40 border-teal-300 dark:border-teal-800 text-teal-800 dark:text-teal-300',
  nonmetal: 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300',
  halogen: 'bg-sky-100 dark:bg-sky-900/40 border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300',
  'noble gas': 'bg-violet-100 dark:bg-violet-900/40 border-violet-300 dark:border-violet-800 text-violet-800 dark:text-violet-300',
  lanthanide: 'bg-pink-100 dark:bg-pink-900/40 border-pink-300 dark:border-pink-800 text-pink-800 dark:text-pink-300',
  actinide: 'bg-fuchsia-100 dark:bg-fuchsia-900/40 border-fuchsia-300 dark:border-fuchsia-800 text-fuchsia-800 dark:text-fuchsia-300',
  unknown: 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400',
};

const STATE_LABEL: Record<PeriodicElement['state'], string> = {
  solid: 'Solid',
  liquid: 'Liquid',
  gas: 'Gas',
  'unknown (synthetic)': 'Unknown (synthetic)',
};

function colorFor(category: string) {
  return CATEGORY_COLOR[category] || CATEGORY_COLOR.unknown;
}

// One flowing spoken paragraph built from the same facts already shown on
// the card -- narrated as a story rather than a stat sheet is genuinely a
// different (and fuller-feeling) way to take the information in, without
// risking 118 hand-written "bonus facts" drifting out of sync with the
// data on screen.
function composeNarration(el: PeriodicElement): string {
  const stateLine = el.state === 'unknown (synthetic)'
    ? "So little of it has ever been made that nobody actually knows what state it would be in at room temperature."
    : `At room temperature, it's a ${el.state}, melting at ${el.meltingPointC} degrees and boiling at ${el.boilingPointC} degrees Celsius.`;
  return `${el.name}, symbol ${el.symbol}. This is element number ${el.atomicNumber} on the periodic table, part of the ${el.category} family. ${stateLine} ${el.discovery}. ${el.summary}`;
}

export default function PeriodicTablePage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<PeriodicElement | null>(null);
  const [speechReady, setSpeechReady] = useState(false);
  const [speaking, setSpeaking] = useState<'name' | 'full' | null>(null);
  const deepDives = useDeepDives();

  useEffect(() => setSpeechReady(isSpeechSupported()), []);

  const normalizedQuery = query.trim().toLowerCase();
  const matches = (el: PeriodicElement) => {
    const queryMatch = !normalizedQuery
      || el.name.toLowerCase().includes(normalizedQuery)
      || el.symbol.toLowerCase().includes(normalizedQuery)
      || String(el.atomicNumber) === normalizedQuery;
    const categoryMatch = !activeCategory || el.category === activeCategory;
    return queryMatch && categoryMatch;
  };
  const isFiltering = !!normalizedQuery || !!activeCategory;
  const matchCount = useMemo(() => PERIODIC_TABLE.filter(matches).length, [normalizedQuery, activeCategory]);

  const announceName = (el: PeriodicElement) => {
    if (!speechReady) return;
    setSpeaking('name');
    speak(el.name, { onEnd: () => setSpeaking((s) => (s === 'name' ? null : s)) });
  };

  const openElement = (el: PeriodicElement) => {
    setSelected(el);
    announceName(el);
  };
  const navigate = (dir: 1 | -1) => {
    if (!selected) return;
    const next = PERIODIC_TABLE.find((e) => e.atomicNumber === selected.atomicNumber + dir);
    if (next) { setSelected(next); announceName(next); }
  };
  const closeModal = () => {
    stopSpeaking();
    setSpeaking(null);
    setSelected(null);
  };
  const toggleFullNarration = () => {
    if (!selected) return;
    if (speaking === 'full') {
      stopSpeaking();
      setSpeaking(null);
      return;
    }
    setSpeaking('full');
    speak(composeNarration(selected), { onEnd: () => setSpeaking((s) => (s === 'full' ? null : s)) });
  };

  useEffect(() => () => stopSpeaking(), []);

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6">
      {/* Deliberately NOT sticky -- direct feedback that pinning this bar
          over the tall 3D table felt cramped/"disturbing" rather than
          helpful. The 3D scene is fully visible/rotatable within its own
          fixed-height canvas, so there's no long list to keep search
          pinned against the way there would be for a scrolling list. */}
      <div className="space-y-3 pb-3">
        <Link href="/chem-lab" className="text-sm font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1.5 w-fit pt-1">
          <ChevronLeft className="w-4 h-4" /> Back to Chem Lab
        </Link>
        <div className="glass-card rounded-2xl p-3 flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, symbol, or atomic number..."
              className="w-full pl-9 pr-9 py-2.5 rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {isFiltering && (
            <span className="text-xs font-bold text-slate-400 whitespace-nowrap">{matchCount} match{matchCount === 1 ? '' : 'es'}</span>
          )}
        </div>
      </div>

      <div>
        <h1 className="font-display text-3xl font-semibold mb-2">Periodic Table</h1>
        <p className="text-slate-500 text-sm">
          Search, filter by category, or tap any element for the full picture{speechReady ? ' -- it talks back too' : ''}.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(CATEGORY_COLOR).filter(([k]) => k !== 'unknown').map(([k, cls]) => (
          <button
            key={k}
            onClick={() => setActiveCategory((cur) => (cur === k ? null : k))}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${cls} ${
              activeCategory && activeCategory !== k ? 'opacity-30' : 'opacity-100'
            } ${activeCategory === k ? 'ring-2 ring-offset-1 ring-primary-500 dark:ring-offset-slate-900' : ''}`}
          >
            {k}
          </button>
        ))}
      </div>

      <PeriodicTable3DScene elements={PERIODIC_TABLE} matches={matches} isFiltering={isFiltering} onSelect={openElement} />

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={closeModal} />
          <div className="relative w-full max-w-md max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-y-auto animate-in zoom-in-95 fade-in duration-200">
            <div className={`p-8 pb-10 rounded-t-3xl ${colorFor(selected.category)} border-b-4 border-current/20`}>
              <div className="flex justify-end mb-6">
                <button onClick={closeModal} className="p-2 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white/80 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-4">
                <button onClick={() => navigate(-1)} disabled={selected.atomicNumber <= 1} className="p-2 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white/80 disabled:opacity-30 transition-colors shrink-0" title="Previous element">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-center">
                  <div className={`w-24 h-24 mx-auto rounded-3xl border-2 border-current/30 bg-white/60 dark:bg-black/20 flex flex-col items-center justify-center mb-4 transition-shadow ${speaking === 'name' ? 'periodic-speaking' : ''}`}>
                    <span className="text-[10px] font-bold opacity-70">{selected.atomicNumber}</span>
                    <span className="text-4xl font-bold leading-none">{selected.symbol}</span>
                  </div>
                  <h2 className="text-2xl font-bold">{selected.name}</h2>
                  <p className="text-sm capitalize opacity-80">{selected.category}</p>
                </div>
                <button onClick={() => navigate(1)} disabled={selected.atomicNumber >= 118} className="p-2 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white/80 disabled:opacity-30 transition-colors shrink-0" title="Next element">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {speechReady && (
                <div className="flex justify-center mt-5">
                  <button
                    onClick={toggleFullNarration}
                    className="btn-brutal px-4 py-2 bg-white/80 dark:bg-black/30 rounded-xl text-xs font-bold flex items-center gap-2"
                  >
                    {speaking === 'full' ? <><VolumeX className="w-4 h-4" /> Stop</> : <><Volume2 className="w-4 h-4" /> Listen to the Full Story</>}
                  </button>
                </div>
              )}
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Hash className="w-3 h-3" /> Atomic Number</p>
                  <p className="font-bold text-base">{selected.atomicNumber}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Scale className="w-3 h-3" /> Atomic Mass</p>
                  <p className="font-bold text-base">{selected.atomicMass}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Layers className="w-3 h-3" /> Period / Group</p>
                  <p className="font-bold text-base">{selected.period} / {selected.group ?? '-'}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Thermometer className="w-3 h-3" /> State at Room Temp</p>
                  <p className="font-bold text-base">{STATE_LABEL[selected.state]}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Flame className="w-3 h-3" /> Melting Point (°C)</p>
                  <p className="font-bold text-base">{selected.meltingPointC}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Wind className="w-3 h-3" /> Boiling Point (°C)</p>
                  <p className="font-bold text-base">{selected.boilingPointC}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1"><History className="w-3 h-3" /> Discovery</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{selected.discovery}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Did You Know?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{selected.summary}</p>
              </div>

              {deepDives.some((d) => d.id === `chem-element-${selected.symbol.toLowerCase()}`) && (
                <DeepDiveTrigger id={`chem-element-${selected.symbol.toLowerCase()}`} label="Explore This Element Further" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
