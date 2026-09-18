// On-screen equivalent of apps/api's pdfService.tsx DiagramView -- same shape
// normalization/coloring/rotation logic, rendered as plain browser SVG instead
// of react-pdf primitives, so the "diagram" question type actually shows a
// picture in the in-app preview, not just a blank line.

export interface DiagramShape {
  type: 'rect' | 'circle' | 'ellipse' | 'line' | 'arrow' | 'polygon';
  x: number;
  y: number;
  width?: number;
  height?: number;
  rx?: number;
  ry?: number;
  x2?: number;
  y2?: number;
  points?: string;
  fill?: string;
  rotation?: number;
  label: string;
}

export interface DiagramLabelPoint {
  x: number;
  y: number;
  label: string;
}

export interface DiagramSpec {
  // Current schema: a real generated image with named parts pinned to
  // approximate x/y percentage positions on it. "coloring" questions only use
  // imageUrl (no labelPoints -- there's nothing to label, just color).
  imagePrompt?: string;
  imageUrl?: string;
  labelPoints?: DiagramLabelPoint[];
  // True only when labelPoints came from a vision model that actually looked
  // at the generated image -- the AI's original guess (made before the image
  // exists) was confirmed wrong often enough to be misleading. When false,
  // pinpoint markers are not rendered; see ImageWithLegendPreview.
  labelPointsVerified?: boolean;

  // "tracing" questions: the short text to trace.
  traceContent?: string;

  // "match" questions: real image URLs for each Column A entry (young-learner
  // picture matching), same order as the question's `options`.
  matchImageUrls?: (string | null)[];

  // Legacy vector-shape schema, kept only for worksheets saved before real
  // image generation was added.
  viewBox?: string;
  shapes?: DiagramShape[];
}

const IMAGE_RENDER_WIDTH = 220;
const IMAGE_ASPECT = 350 / 500; // matches diagramImageService.ts's generated 500x350

interface NormalizedShape {
  type: DiagramShape['type'];
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
  ry: number;
  x2: number;
  y2: number;
  points: string;
  fill: string;
  rotation: number;
  label: string;
}

const FALLBACK_PALETTE = ['#FDE68A', '#F9A8D4', '#86EFAC', '#93C5FD', '#FCA5A5', '#D8B4FE', '#FDBA74', '#67E8F9'];
const HEX_COLOR_RE = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
const POLYGON_POINTS_RE = /^(-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?\s+){2,}-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/;

function normalizeShape(raw: any, idx: number): NormalizedShape {
  const num = (v: any, fallback: number) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback);
  const x = num(raw?.x ?? raw?.x1, 60);
  const y = num(raw?.y ?? raw?.y1, 90);
  const fill = typeof raw?.fill === 'string' && HEX_COLOR_RE.test(raw.fill.trim())
    ? raw.fill.trim()
    : FALLBACK_PALETTE[idx % FALLBACK_PALETTE.length];
  const points = typeof raw?.points === 'string' && POLYGON_POINTS_RE.test(raw.points.trim())
    ? raw.points.trim()
    : `${x},${y - 15} ${x - 15},${y + 10} ${x + 15},${y + 10}`;
  return {
    type: ['rect', 'circle', 'ellipse', 'line', 'arrow', 'polygon'].includes(raw?.type) ? raw.type : 'rect',
    x,
    y,
    width: num(raw?.width, 40),
    height: num(raw?.height, 40),
    rx: num(raw?.rx, 20),
    ry: num(raw?.ry, 15),
    x2: num(raw?.x2, x + 30),
    y2: num(raw?.y2, y),
    points,
    fill,
    rotation: num(raw?.rotation, 0),
    label: typeof raw?.label === 'string' && raw.label ? raw.label : '',
  };
}

function rotatePoint(px: number, py: number, ox: number, oy: number, deg: number): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180;
  const dx = px - ox;
  const dy = py - oy;
  return { x: ox + dx * Math.cos(rad) - dy * Math.sin(rad), y: oy + dx * Math.sin(rad) + dy * Math.cos(rad) };
}

function shapeLabelPos(shape: NormalizedShape): { cx: number; cy: number } {
  let pos: { cx: number; cy: number };
  if (shape.type === 'line' || shape.type === 'arrow') {
    pos = { cx: shape.x2, cy: shape.y2 - 6 };
  } else if (shape.type === 'rect') {
    pos = { cx: shape.x + 10, cy: shape.y + 12 };
  } else if (shape.type === 'ellipse') {
    pos = { cx: shape.x, cy: shape.y - shape.ry + 9 };
  } else {
    pos = { cx: shape.x, cy: shape.y };
  }
  if (!shape.rotation) return pos;
  const rotated = rotatePoint(pos.cx, pos.cy, shape.x, shape.y, shape.rotation);
  return { cx: rotated.x, cy: rotated.y };
}

const clampPercent = (v: number) => Math.min(Math.max(v, 0), 100);

// Shows the real generated image WITHOUT pinpoint markers -- used whenever
// label positions haven't been vision-verified against the actual image.
// A plain numbered list next to the picture never claims a precise position,
// so unlike a pin it can't be wrong.
function ImageWithLegendPreview({ diagram, showLabels }: { diagram: DiagramSpec; showLabels: boolean }) {
  const points = Array.isArray(diagram.labelPoints) ? diagram.labelPoints : [];
  const renderHeight = IMAGE_RENDER_WIDTH * IMAGE_ASPECT;

  return (
    <div className="my-2 flex flex-col items-center">
      <div className="border border-slate-200 rounded-lg p-2 bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={diagram.imageUrl} alt="Diagram" style={{ width: IMAGE_RENDER_WIDTH, height: renderHeight }} className="object-cover rounded" />
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-1.5 text-[10px]">
        {points.map((pt, idx) => (
          <span key={idx} className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-full border border-slate-700 text-[8px] leading-none flex items-center justify-center shrink-0">{idx + 1}</span>
            <span>{showLabels ? pt?.label || '' : '_______________'}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// Real generated reference image (see apps/api's diagramImageService.ts) with
// numbered markers pinned at the AI's estimated label positions.
function ImageDiagramPreview({ diagram, showLabels }: { diagram: DiagramSpec; showLabels: boolean }) {
  const points = Array.isArray(diagram.labelPoints) ? diagram.labelPoints : [];
  const renderHeight = IMAGE_RENDER_WIDTH * IMAGE_ASPECT;

  return (
    <div className="my-2 flex flex-col items-center">
      <div className="border border-slate-200 rounded-lg p-2 bg-white">
        <div className="relative" style={{ width: IMAGE_RENDER_WIDTH, height: renderHeight }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={diagram.imageUrl} alt="Diagram" className="w-full h-full object-cover rounded" />
          {points.map((pt, idx) => {
            const px = clampPercent(typeof pt?.x === 'number' ? pt.x : 50);
            const py = clampPercent(typeof pt?.y === 'number' ? pt.y : 50);
            return (
              <span
                key={idx}
                className="absolute w-3.5 h-3.5 rounded-full bg-slate-800 text-white text-[8px] leading-none flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${px}%`, top: `${py}%` }}
              >
                {idx + 1}
              </span>
            );
          })}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-1.5 text-[10px]">
        {points.map((pt, idx) => (
          <span key={idx} className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-full border border-slate-700 text-[8px] leading-none flex items-center justify-center shrink-0">{idx + 1}</span>
            <span>{showLabels ? pt?.label || '' : '_______________'}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// Legacy fallback for diagrams saved before real image generation existed --
// the old shape-based vector wireframe.
function ShapeDiagramPreview({ diagram, showLabels }: { diagram: DiagramSpec; showLabels: boolean }) {
  const rawShapes = Array.isArray(diagram?.shapes) ? diagram!.shapes : [];
  if (rawShapes.length === 0) return null;
  const shapes = rawShapes.map((s, idx) => normalizeShape(s, idx));

  const viewBoxParts = (diagram?.viewBox || '0 0 300 180').split(' ').map(Number);
  const viewBox = viewBoxParts.length === 4 && viewBoxParts.every(Number.isFinite) ? diagram!.viewBox! : '0 0 300 180';

  return (
    <div className="my-2 flex flex-col items-center">
      <div className="border border-slate-200 rounded-lg p-2 bg-white">
        <svg width={220} viewBox={viewBox} className="block">
          {shapes.map((shape, idx) => {
            const stroke = '#1e293b';
            const marker = showLabels ? shape.label : String(idx + 1);
            const { cx, cy } = shapeLabelPos(shape);
            const transform = shape.rotation ? `rotate(${shape.rotation} ${shape.x} ${shape.y})` : undefined;
            return (
              <g key={idx}>
                {shape.type === 'rect' && (
                  <rect x={shape.x} y={shape.y} width={shape.width} height={shape.height} stroke={stroke} strokeWidth={1} fill={shape.fill} transform={transform} />
                )}
                {shape.type === 'circle' && (
                  <circle cx={shape.x} cy={shape.y} r={shape.rx} stroke={stroke} strokeWidth={1} fill={shape.fill} />
                )}
                {shape.type === 'ellipse' && (
                  <ellipse cx={shape.x} cy={shape.y} rx={shape.rx} ry={shape.ry} stroke={stroke} strokeWidth={1} fill={shape.fill} transform={transform} />
                )}
                {shape.type === 'polygon' && (
                  <polygon points={shape.points} stroke={stroke} strokeWidth={1} fill={shape.fill} transform={transform} />
                )}
                {(shape.type === 'line' || shape.type === 'arrow') && (
                  <line x1={shape.x} y1={shape.y} x2={shape.x2} y2={shape.y2} stroke={shape.fill} strokeWidth={2} />
                )}
                <text x={cx} y={cy} fontSize={7} fill="#1e293b">{marker}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-1.5 text-[10px]">
        {shapes.map((shape, idx) => (
          <span key={idx} className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-full border border-slate-700 text-[8px] leading-none flex items-center justify-center shrink-0">{idx + 1}</span>
            <span>{showLabels ? shape.label : '_______________'}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// Text-only fallback for when image generation failed/timed out but the AI's
// labels still exist, so the question isn't left with nothing below it.
function TextOnlyLegend({ labels, showLabels }: { labels: string[]; showLabels: boolean }) {
  if (labels.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center my-2 text-[10px]">
      {labels.map((label, idx) => (
        <span key={idx} className="flex items-center gap-1">
          <span className="w-3.5 h-3.5 rounded-full border border-slate-700 text-[8px] leading-none flex items-center justify-center shrink-0">{idx + 1}</span>
          <span>{showLabels ? label : '_______________'}</span>
        </span>
      ))}
    </div>
  );
}

// Prefers a real generated image (current schema) over the legacy vector
// shapes (only present on worksheets saved before real image generation was
// added) -- see apps/api's pdfService.tsx DiagramView, which mirrors this.
// Pinpoint markers only render when labelPointsVerified is true.
export function DiagramPreview({ diagram, showLabels }: { diagram?: DiagramSpec | null; showLabels: boolean }) {
  if (!diagram) return null;
  if (diagram.imageUrl) {
    return diagram.labelPointsVerified
      ? <ImageDiagramPreview diagram={diagram} showLabels={showLabels} />
      : <ImageWithLegendPreview diagram={diagram} showLabels={showLabels} />;
  }
  if (Array.isArray(diagram.shapes) && diagram.shapes.length > 0) {
    return <ShapeDiagramPreview diagram={diagram} showLabels={showLabels} />;
  }
  if (Array.isArray(diagram.labelPoints) && diagram.labelPoints.length > 0) {
    return <TextOnlyLegend labels={diagram.labelPoints.map((p) => p?.label || '')} showLabels={showLabels} />;
  }
  return null;
}

// Full-size real outline/line-art image for a child to print and color --
// no numbered markers, nothing to label, just the picture.
export function ColoringSheetPreview({ diagram }: { diagram?: DiagramSpec | null }) {
  if (!diagram?.imageUrl) return null;
  const width = 320;
  const height = width * IMAGE_ASPECT;
  return (
    <div className="my-2 flex justify-center">
      <div className="border-2 border-slate-200 rounded-lg p-2 bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={diagram.imageUrl} alt="Coloring sheet" style={{ width, height }} className="object-cover rounded" />
      </div>
    </div>
  );
}

// Repeats the trace content as large, light-gray bold text for a child to
// trace over, plus blank practice lines -- mirrors pdfService.tsx's
// TracingView (same validated technique: a solid light fill, not a dashed
// outline, which real PDF text rendering doesn't support well).
export function TracingPreview({ content }: { content?: string | null }) {
  if (!content) return null;
  const repeated = Array.from({ length: 6 }, () => content).join('   ');
  return (
    <div className="my-2">
      <p className="text-4xl font-bold text-slate-300 tracking-wide">{repeated}</p>
      <div className="border-b border-dashed border-slate-400 h-8 mt-2" />
      <div className="border-b border-dashed border-slate-400 h-8 mt-2" />
    </div>
  );
}

// "Match the following" with the actual Column A options printed (small real
// images next to each entry when matchImageUrls is present, for young
// learners who can't read well yet), plus blank lines to draw match-lines to
// on the worksheet, or the answer text in the answer key.
export function MatchPreview({
  options, answer, matchImageUrls, showLabels,
}: { options?: string[]; answer?: string; matchImageUrls?: (string | null)[]; showLabels: boolean }) {
  if (!options || options.length === 0) return null;
  return (
    <div className="my-2 grid grid-cols-2 gap-x-6 gap-y-2 pl-4">
      <div className="space-y-2">
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <span className="font-bold">{idx + 1}.</span>
            {matchImageUrls?.[idx] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={matchImageUrls[idx]!} alt={opt} className="w-7 h-7 rounded object-cover" />
            )}
            <span>{opt}</span>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {showLabels ? (
          <p className="text-xs text-red-600 font-medium">Ans: {answer}</p>
        ) : (
          options.map((_, idx) => <div key={idx} className="h-6 border-b border-dashed border-slate-300" />)
        )}
      </div>
    </div>
  );
}
