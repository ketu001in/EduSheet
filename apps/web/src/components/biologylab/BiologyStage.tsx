'use client';
import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { BIOLOGY_EQUIPMENT, BiologyExperiment, BiologySimType, FOOD_TEST_RESULTS } from '@edusheets/content';
import {
  microscopeClarity, osmosisDirection, osmosisTargetSizeFactor, CELL_BASELINE_CONCENTRATION,
  punnettSquare, gametesFor,
} from '@/lib/biologyEngine';
import { easeToward } from '@/lib/simEngine';
import { playChime, playThud, isSoundMuted, setSoundMuted } from '@/lib/sound';
import { speak, isSpeechSupported } from '@/lib/speech';
import { Hotspot, HoverLabel, EquipmentModal, LabEquipmentLike } from '@/components/labshared/LabHotspot';

export interface BiologyStageProps {
  simType: BiologySimType;
  params: Record<string, number>;
  running: boolean;
  resetKey: number | string;
  apparatusIds: string[];
  experiment?: BiologyExperiment;
}

export default function BiologyStage({ simType, params, running, resetKey, experiment }: BiologyStageProps) {
  const [osmosisFactor, setOsmosisFactor] = useState(1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [openEquipmentId, setOpenEquipmentId] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const lastFrameRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const hasMountedRef = useRef(false);

  useEffect(() => { setSoundOn(!isSoundMuted()); }, []);
  const toggleSound = () => { const next = !soundOn; setSoundOn(next); setSoundMuted(!next); };

  // Reset on resetKey -- also where the (guarded, so it never fires on
  // first mount) food-test result sound plays, matching the "release"
  // moment in the guided flow.
  useEffect(() => {
    setOsmosisFactor(1);
    lastFrameRef.current = null;
    if (hasMountedRef.current && soundOn && simType === 'foodtest' && experiment) {
      const result = FOOD_TEST_RESULTS[experiment.id]?.[params.foodSample ?? 0];
      if (result) (result.positive ? playChime : playThud)();
    }
    hasMountedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  // Osmosis is the only sim type here needing a continuous animation loop
  // -- everything else (microscope blur, food-test color, Punnett grid,
  // explorer diagrams) is a direct, static function of the current params.
  useEffect(() => {
    if (!running || simType !== 'osmosis') { lastFrameRef.current = null; return; }
    const loop = (now: number) => {
      if (lastFrameRef.current === null) lastFrameRef.current = now;
      const dt = Math.min(0.05, (now - lastFrameRef.current) / 1000);
      lastFrameRef.current = now;
      const target = osmosisTargetSizeFactor({ cellConcentration: CELL_BASELINE_CONCENTRATION, solutionConcentration: params.solutionConcentration ?? 300 });
      setOsmosisFactor((prev) => {
        const next = easeToward(prev, target, dt);
        if (Math.abs(next - target) < 0.01 && Math.abs(prev - target) >= 0.01 && soundOn) playThud();
        return next;
      });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, simType, soundOn, params.solutionConcentration]);

  const combinedEquipment: LabEquipmentLike[] = [
    ...BIOLOGY_EQUIPMENT,
    ...(experiment?.explorerParts || []).map((p) => ({ id: p.id, name: p.label, description: p.info, deepDive: p.deepDive })),
  ];

  const hover = (id: string) => setHoveredId(id);
  const unhover = () => setHoveredId(null);
  const openEquipment = (id: string) => {
    setOpenEquipmentId(id);
    if (isSpeechSupported()) {
      const eq = combinedEquipment.find((e) => e.id === id);
      if (eq) speak(`${eq.name}. ${eq.description}`);
    }
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-emerald-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-2 border-slate-200 dark:border-slate-800 overflow-hidden">
      <button
        onClick={toggleSound}
        title={soundOn ? 'Mute lab sounds' : 'Enable lab sounds'}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform"
      >
        {soundOn ? <Volume2 className="w-4 h-4 text-primary-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
      </button>

      {simType === 'microscope' && (
        <MicroscopeScene params={params} hoveredId={hoveredId} onHover={hover} onUnhover={unhover} onClick={openEquipment} />
      )}
      {simType === 'foodtest' && experiment && (
        <FoodTestScene experimentId={experiment.id} params={params} hoveredId={hoveredId} onHover={hover} onUnhover={unhover} onClick={openEquipment} />
      )}
      {simType === 'osmosis' && (
        <OsmosisScene params={params} sizeFactor={osmosisFactor} hoveredId={hoveredId} onHover={hover} onUnhover={unhover} onClick={openEquipment} />
      )}
      {simType === 'punnett' && (
        <PunnettScene params={params} hoveredId={hoveredId} onHover={hover} onUnhover={unhover} onClick={openEquipment} />
      )}
      {simType === 'explorer' && experiment?.diagramId && experiment.explorerParts && (
        <ExplorerScene diagramId={experiment.diagramId} parts={experiment.explorerParts} hoveredId={hoveredId} onHover={hover} onUnhover={unhover} onClick={openEquipment} />
      )}

      {openEquipmentId && <EquipmentModal equipmentId={openEquipmentId} equipment={combinedEquipment} onClose={() => setOpenEquipmentId(null)} />}
      <p className="text-center text-[11px] text-slate-400 pb-2">Click any equipment or labeled part for details</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Microscope scene
// ---------------------------------------------------------------------------
function MicroscopeScene({ params, hoveredId, onHover, onUnhover, onClick }: {
  params: Record<string, number>; hoveredId: string | null; onHover: (id: string) => void; onUnhover: () => void; onClick: (id: string) => void;
}) {
  const focus = params.focus ?? 50;
  const magnification = params.magnification ?? 0;
  const clarity = microscopeClarity(focus, 50, 12);
  const blurPx = (1 - clarity) * 9;
  const scale = magnification === 1 ? 1.8 : 1;

  const cx = 160;
  const cy = 155;
  const r = 105;
  const cellW = 32;
  const cellH = 22;
  const gap = 3;
  const cells: { x: number; y: number }[] = [];
  for (let row = -4; row <= 4; row++) {
    for (let col = -5; col <= 5; col++) {
      const x = col * (cellW + gap);
      const y = row * (cellH + gap);
      if (Math.hypot(x, y) < r * 0.92) cells.push({ x, y });
    }
  }

  const clarityLabel = clarity > 0.85 ? 'In sharp focus!' : clarity > 0.4 ? 'Getting closer...' : 'Blurry -- keep adjusting the focus';

  return (
    <svg viewBox="0 0 320 320" className="w-full h-72">
      <defs>
        <clipPath id="scope-view"><circle cx={cx} cy={cy} r={r} /></clipPath>
      </defs>

      <Hotspot x={cx} y={cy - r - 26} hovered={hoveredId === 'microscope'} onEnter={() => onHover('microscope')} onLeave={onUnhover} onClick={() => onClick('microscope')}>
        <rect x={cx - 22} y={cy - r - 40} width={44} height={16} rx={4} className="fill-slate-700 dark:fill-slate-300" />
        {hoveredId === 'microscope' && <HoverLabel x={cx} y={cy - r - 62} text="Compound Microscope" />}
      </Hotspot>

      <circle cx={cx} cy={cy} r={r + 12} className="fill-slate-800 dark:fill-slate-700" />
      <g clipPath="url(#scope-view)">
        <circle cx={cx} cy={cy} r={r} className="fill-lime-50 dark:fill-lime-950/30" />
        <g transform={`translate(${cx},${cy}) scale(${scale})`} style={{ filter: `blur(${blurPx}px)`, transition: 'filter 0.15s ease-out' }}>
          {cells.map((c, i) => (
            <g key={i} transform={`translate(${c.x},${c.y})`}>
              <rect x={-cellW / 2} y={-cellH / 2} width={cellW} height={cellH} rx={2} className="fill-lime-100 dark:fill-lime-900/40" stroke="#65a30d" strokeWidth={1} />
              <circle cx={0} cy={0} r={4} className="fill-lime-700 dark:fill-lime-400" opacity={0.75} />
            </g>
          ))}
        </g>
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" className="stroke-slate-900 dark:stroke-slate-200" strokeWidth={4} />

      <Hotspot x={cx - r - 30} y={cy + r + 20} hovered={hoveredId === 'glass-slide'} onEnter={() => onHover('glass-slide')} onLeave={onUnhover} onClick={() => onClick('glass-slide')}>
        <rect x={cx - r - 50} y={cy + r + 12} width={40} height={16} rx={2} className="fill-sky-200 dark:fill-sky-900/50" stroke="#0369a1" strokeWidth={1} />
        {hoveredId === 'glass-slide' && <HoverLabel x={cx - r - 30} y={cy + r} text="Glass Slide" />}
      </Hotspot>
      <Hotspot x={cx + r + 30} y={cy + r + 20} hovered={hoveredId === 'onion-peel'} onEnter={() => onHover('onion-peel')} onLeave={onUnhover} onClick={() => onClick('onion-peel')}>
        <ellipse cx={cx + r + 30} cy={cy + r + 20} rx={22} ry={14} className="fill-amber-100 dark:fill-amber-900/40" stroke="#b45309" strokeWidth={1} />
        {hoveredId === 'onion-peel' && <HoverLabel x={cx + r + 30} y={cy + r} text="Onion Peel" />}
      </Hotspot>

      <text x={12} y={20} fontSize={12} fontWeight={700} className="fill-slate-500">{clarityLabel}</text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Food test scene
// ---------------------------------------------------------------------------
function FoodTestScene({ experimentId, params, hoveredId, onHover, onUnhover, onClick }: {
  experimentId: string; params: Record<string, number>; hoveredId: string | null; onHover: (id: string) => void; onUnhover: () => void; onClick: (id: string) => void;
}) {
  const foodSample = params.foodSample ?? 0;
  const result = FOOD_TEST_RESULTS[experimentId]?.[foodSample];
  const liquidColor = result?.colorHex || '#cbd5e1';

  const tubeX = 150;
  const tubeTop = 40;
  const tubeBottom = 230;
  const tubeW = 44;

  return (
    <svg viewBox="0 0 300 280" className="w-full h-72">
      <Hotspot x={tubeX} y={(tubeTop + tubeBottom) / 2} hovered={hoveredId === 'test-tube-food'} onEnter={() => onHover('test-tube-food')} onLeave={onUnhover} onClick={() => onClick('test-tube-food')}>
        <path
          d={`M ${tubeX - tubeW / 2} ${tubeTop} L ${tubeX - tubeW / 2} ${tubeBottom - tubeW / 2} A ${tubeW / 2} ${tubeW / 2} 0 0 0 ${tubeX + tubeW / 2} ${tubeBottom - tubeW / 2} L ${tubeX + tubeW / 2} ${tubeTop}`}
          fill="none" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth={3}
        />
        <path
          d={`M ${tubeX - tubeW / 2 + 2} ${tubeTop + 60} L ${tubeX - tubeW / 2 + 2} ${tubeBottom - tubeW / 2} A ${tubeW / 2 - 2} ${tubeW / 2 - 2} 0 0 0 ${tubeX + tubeW / 2 - 2} ${tubeBottom - tubeW / 2} L ${tubeX + tubeW / 2 - 2} ${tubeTop + 60} Z`}
          fill={liquidColor} style={{ transition: 'fill 0.4s ease-out' }}
        />
        {hoveredId === 'test-tube-food' && <HoverLabel x={tubeX} y={tubeTop - 20} text="Test Tube" />}
      </Hotspot>

      {result && (
        <g transform="translate(210, 100)">
          <circle r={20} className={result.positive ? 'fill-accent-500' : 'fill-slate-300 dark:fill-slate-700'} />
          <text textAnchor="middle" y={6} fontSize={18} fontWeight={700} className="fill-white">{result.positive ? '✓' : '✗'}</text>
        </g>
      )}

      <text x={12} y={20} fontSize={12} fontWeight={700} className="fill-slate-500">
        {result ? `Result: ${result.colorChange}` : 'Add the reagent to see the result'}
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Osmosis scene
// ---------------------------------------------------------------------------
function OsmosisScene({ params, sizeFactor, hoveredId, onHover, onUnhover, onClick }: {
  params: Record<string, number>; sizeFactor: number; hoveredId: string | null; onHover: (id: string) => void; onUnhover: () => void; onClick: (id: string) => void;
}) {
  const solutionConcentration = params.solutionConcentration ?? 300;
  const direction = osmosisDirection({ cellConcentration: CELL_BASELINE_CONCENTRATION, solutionConcentration });

  const beakerX = 100;
  const beakerY = 30;
  const beakerW = 140;
  const beakerH = 210;
  const stripBaseW = 26;
  const stripBaseH = 110;
  const stripW = stripBaseW * sizeFactor;
  const stripH = stripBaseH * sizeFactor;
  const cx = beakerX + beakerW / 2;
  const cy = beakerY + beakerH / 2 + 15;
  const solutionOpacity = Math.min(0.55, (solutionConcentration / 1000) * 0.5 + 0.08);

  return (
    <svg viewBox="0 0 340 280" className="w-full h-72">
      <Hotspot x={cx} y={beakerY + beakerH / 2} hovered={hoveredId === 'salt-solution'} onEnter={() => onHover('salt-solution')} onLeave={onUnhover} onClick={() => onClick('salt-solution')}>
        <rect x={beakerX} y={beakerY} width={beakerW} height={beakerH} rx={6} fill="none" className="stroke-slate-400 dark:stroke-slate-600" strokeWidth={3} />
        <rect x={beakerX + 2} y={beakerY + 30} width={beakerW - 4} height={beakerH - 34} fill="#0ea5e9" opacity={solutionOpacity} style={{ transition: 'opacity 0.4s' }} />
        {hoveredId === 'salt-solution' && <HoverLabel x={cx} y={beakerY - 14} text="Solution" />}
      </Hotspot>

      <Hotspot x={cx} y={cy} hovered={hoveredId === 'potato-strip'} onEnter={() => onHover('potato-strip')} onLeave={onUnhover} onClick={() => onClick('potato-strip')}>
        <rect x={cx - stripW / 2} y={cy - stripH / 2} width={stripW} height={stripH} rx={6} className="fill-amber-200 dark:fill-amber-800/70" stroke="#b45309" strokeWidth={1.5} style={{ transition: 'width 0.05s, height 0.05s' }} />
        {hoveredId === 'potato-strip' && <HoverLabel x={cx} y={cy - stripH / 2 - 14} text="Potato Strip" />}
      </Hotspot>

      <text x={12} y={20} fontSize={12} fontWeight={700} className="fill-slate-500">
        {direction === 'shrinks' ? 'Losing water -- shrinking' : direction === 'swells' ? 'Gaining water -- swelling' : 'No net change (isotonic)'}
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Punnett square scene
// ---------------------------------------------------------------------------
function PunnettScene({ params, hoveredId, onHover, onUnhover, onClick }: {
  params: Record<string, number>; hoveredId: string | null; onHover: (id: string) => void; onUnhover: () => void; onClick: (id: string) => void;
}) {
  const p1 = params.parent1Genotype ?? 1;
  const p2 = params.parent2Genotype ?? 1;
  const g1 = gametesFor(p1);
  const g2 = gametesFor(p2);
  const result = punnettSquare({ parent1Genotype: p1, parent2Genotype: p2 });

  const gridX = 90;
  const gridY = 60;
  const cellSize = 64;

  return (
    <svg viewBox="0 0 320 280" className="w-full h-72">
      <Hotspot x={gridX + cellSize} y={gridY + cellSize} hovered={hoveredId === 'punnett-chart'} onEnter={() => onHover('punnett-chart')} onLeave={onUnhover} onClick={() => onClick('punnett-chart')}>
        <rect x={gridX} y={gridY} width={cellSize * 2} height={cellSize * 2} fill="none" className="stroke-slate-900 dark:stroke-slate-200" strokeWidth={2} />
        <line x1={gridX + cellSize} y1={gridY} x2={gridX + cellSize} y2={gridY + cellSize * 2} className="stroke-slate-900 dark:stroke-slate-200" strokeWidth={2} />
        <line x1={gridX} y1={gridY + cellSize} x2={gridX + cellSize * 2} y2={gridY + cellSize} className="stroke-slate-900 dark:stroke-slate-200" strokeWidth={2} />
        {result.combos.map((c, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = gridX + col * cellSize + cellSize / 2;
          const y = gridY + row * cellSize + cellSize / 2;
          return (
            <g key={i}>
              <rect x={gridX + col * cellSize + 2} y={gridY + row * cellSize + 2} width={cellSize - 4} height={cellSize - 4} className={c.dominant ? 'fill-accent-100 dark:fill-accent-900/30' : 'fill-amber-100 dark:fill-amber-900/30'} style={{ transition: 'fill 0.3s' }} />
              <text x={x} y={y + 6} textAnchor="middle" fontSize={20} fontWeight={700} className={c.dominant ? 'fill-accent-700 dark:fill-accent-400' : 'fill-amber-700 dark:fill-amber-400'}>{c.genotype}</text>
            </g>
          );
        })}
        {hoveredId === 'punnett-chart' && <HoverLabel x={gridX + cellSize} y={gridY - 16} text="Punnett Square" />}
      </Hotspot>

      {/* Parent gamete labels */}
      <text x={gridX + cellSize / 2} y={gridY - 8} textAnchor="middle" fontSize={16} fontWeight={700} className="fill-primary-600">{g2[0]}</text>
      <text x={gridX + cellSize * 1.5} y={gridY - 8} textAnchor="middle" fontSize={16} fontWeight={700} className="fill-primary-600">{g2[1]}</text>
      <text x={gridX - 16} y={gridY + cellSize / 2 + 6} textAnchor="middle" fontSize={16} fontWeight={700} className="fill-primary-600">{g1[0]}</text>
      <text x={gridX - 16} y={gridY + cellSize * 1.5 + 6} textAnchor="middle" fontSize={16} fontWeight={700} className="fill-primary-600">{g1[1]}</text>

      <text x={12} y={20} fontSize={12} fontWeight={700} className="fill-slate-500">
        Tall: {result.tallCount}/4 &middot; Short: {result.shortCount}/4
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Explorer scene -- labeled diagram (cell / body system / food chain)
// ---------------------------------------------------------------------------
const DIAGRAM_LAYOUTS: Record<string, { id: string; x: number; y: number }[]> = {
  'plant-cell': [
    { id: 'cell-wall', x: 40, y: 40 },
    { id: 'cell-membrane', x: 280, y: 40 },
    { id: 'nucleus', x: 160, y: 140 },
    { id: 'chloroplast', x: 90, y: 210 },
    { id: 'vacuole', x: 230, y: 210 },
    { id: 'mitochondria', x: 160, y: 250 },
  ],
  'digestive-system': [
    { id: 'mouth', x: 160, y: 30 },
    { id: 'esophagus', x: 160, y: 75 },
    { id: 'stomach', x: 110, y: 120 },
    { id: 'liver', x: 210, y: 120 },
    { id: 'pancreas', x: 210, y: 165 },
    { id: 'small-intestine', x: 140, y: 190 },
    { id: 'large-intestine', x: 140, y: 245 },
  ],
  'food-chain': [
    { id: 'producer', x: 30, y: 150 },
    { id: 'primary-consumer', x: 100, y: 150 },
    { id: 'secondary-consumer', x: 170, y: 150 },
    { id: 'tertiary-consumer', x: 240, y: 150 },
    { id: 'apex-predator', x: 300, y: 150 },
    { id: 'decomposer', x: 165, y: 240 },
  ],
};

const DIAGRAM_COLORS = ['fill-emerald-300', 'fill-lime-300', 'fill-sky-300', 'fill-amber-300', 'fill-rose-300', 'fill-violet-300'];

function ExplorerScene({ diagramId, parts, hoveredId, onHover, onUnhover, onClick }: {
  diagramId: string; parts: { id: string; label: string }[]; hoveredId: string | null; onHover: (id: string) => void; onUnhover: () => void; onClick: (id: string) => void;
}) {
  const layout = DIAGRAM_LAYOUTS[diagramId] || [];

  return (
    <svg viewBox="0 0 330 290" className="w-full h-80">
      {diagramId === 'plant-cell' && (
        <rect x={20} y={20} width={290} height={250} rx={24} fill="none" className="stroke-emerald-600 dark:stroke-emerald-500" strokeWidth={4} strokeDasharray="0" />
      )}
      {diagramId === 'digestive-system' && (
        <path d="M 160 20 L 160 70 Q 160 90 110 100 Q 90 105 100 140 Q 110 175 140 180 Q 130 200 140 230 L 140 260" fill="none" className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={14} strokeLinecap="round" />
      )}
      {diagramId === 'food-chain' && (
        <>
          {[30, 100, 170, 240].map((x) => (
            <line key={x} x1={x + 18} y1={150} x2={x + 62} y2={150} className="stroke-slate-400 dark:stroke-slate-600" strokeWidth={2} markerEnd="url(#chain-arrow)" />
          ))}
          <path d="M 165 175 Q 165 215 165 218 Q 30 218 30 175" fill="none" className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={2} strokeDasharray="4 3" markerEnd="url(#chain-arrow)" />
          <defs>
            <marker id="chain-arrow" markerWidth={8} markerHeight={8} refX={6} refY={3} orient="auto"><path d="M0,0 L6,3 L0,6 z" className="fill-slate-400 dark:fill-slate-600" /></marker>
          </defs>
        </>
      )}

      {layout.map((node, i) => {
        const part = parts.find((p) => p.id === node.id);
        if (!part) return null;
        return (
          <Hotspot key={node.id} x={node.x} y={node.y} hovered={hoveredId === node.id} onEnter={() => onHover(node.id)} onLeave={onUnhover} onClick={() => onClick(node.id)}>
            <circle cx={node.x} cy={node.y} r={22} className={`${DIAGRAM_COLORS[i % DIAGRAM_COLORS.length]} dark:opacity-70`} stroke="#1e293b" strokeWidth={1.5} />
            <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize={9} fontWeight={700} className="fill-slate-900">{i + 1}</text>
            {hoveredId === node.id && <HoverLabel x={node.x} y={node.y - 38} text={part.label} />}
          </Hotspot>
        );
      })}
    </svg>
  );
}
