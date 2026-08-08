import React from 'react';
import path from 'path';
import { Document, Page, Text, View, StyleSheet, renderToStream, Svg, Rect, Line, Circle, Ellipse, Path, Polygon, Defs, LinearGradient, Stop, Font, Image } from '@react-pdf/renderer';
import type { DiagramSpec, DiagramShape, DiagramLabelPoint } from '@edusheets/ai';
import type { ChemistryExperiment } from '@edusheets/content';
import { CHEM_REAGENTS, CHEM_EQUIPMENT } from '@edusheets/content';

// Helvetica (react-pdf's default) is a base-14 PDF font with Latin glyphs
// only -- Hindi/Sanskrit worksheets are generated in Devanagari script, and
// rendering that through Helvetica produces garbage glyphs (mojibake), not
// missing/blank text. Register a Devanagari-capable font and switch to it
// for any worksheet/project generated in Hindi or Sanskrit.
const DEVANAGARI_FONT = 'NotoSansDevanagari';
Font.register({
  family: DEVANAGARI_FONT,
  src: path.resolve(__dirname, '../assets/fonts/NotoSansDevanagari-Variable.ttf'),
});
// The default hyphenation engine assumes Latin word-breaking rules, which
// can mis-break Devanagari conjuncts -- disable hyphenation entirely.
Font.registerHyphenationCallback((word) => [word]);

function isDevanagariLanguage(language?: string): boolean {
  if (!language) return false;
  const l = language.toLowerCase();
  return l === 'hindi' || l === 'sanskrit';
}

const styles = StyleSheet.create({
  page: { padding: 40, paddingTop: 56, fontFamily: 'Helvetica', fontSize: 11, lineHeight: 1.5 },
  // Formal worksheet frame -- a bordered rule inset from the page edge,
  // repeated on every page via `fixed`.
  pageBorder: { position: 'absolute', top: 10, left: 10, right: 10, bottom: 10, border: '1.5pt solid #1B2A6B', borderRadius: 3 },
  brandMark: { position: 'absolute', top: 18, right: 24, flexDirection: 'row', alignItems: 'center', gap: 5 },
  brandName: { fontSize: 8, fontWeight: 'bold', color: '#1B2A6B' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1pt solid #e2e8f0', paddingBottom: 10 },
  headerCol: { flexDirection: 'column' },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  instructions: { fontStyle: 'italic', marginBottom: 15, color: '#475569' },
  section: { marginBottom: 15 },
  questionRow: { flexDirection: 'row', marginBottom: 8 },
  questionNum: { width: 25, fontWeight: 'bold' },
  questionText: { flex: 1 },
  options: { marginLeft: 25, marginTop: 5 },
  option: { marginBottom: 3 },
  blankLine: { borderBottom: '1pt solid #94a3b8', height: 15, marginTop: 5, width: '100%' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 9, color: '#94a3b8', borderTop: '1pt solid #e2e8f0', paddingTop: 10 },
});

// These match the AI package's own type keys (packages/ai's questionTypes.ts /
// systemPrompt.ts), e.g. "fill_in_the_blank" not "fill_blank" -- NOT the DB's
// question_type enum values, which differ (see worksheetService's
// AI_TYPE_TO_DB_TYPE / regenerateWorksheetPdf's inverse mapping).
type QuestionType =
  | 'mcq' | 'fill_in_the_blank' | 'true_false' | 'match' | 'short_answer'
  | 'long_answer' | 'word_problem' | 'diagram' | 'logical_reasoning'
  | 'coloring' | 'tracing';

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  answer?: string;
  marks?: number;
  diagram?: DiagramSpec;
}

interface Worksheet {
  title: string;
  instructions?: string;
  school_name?: string;
  student_name_placeholder?: boolean;
  class?: string;
  subject?: string;
  date_placeholder?: boolean;
  language?: string;
}

// Same geometry as apps/web/src/components/Logo.tsx: a graduation cap over a
// checked worksheet page. react-pdf can't render arbitrary DOM/JSX, so the
// two can't literally share code -- keep them visually in sync by hand.
const PdfLogo = () => (
  <Svg width={16} height={16} viewBox="0 0 32 32">
    <Defs>
      <LinearGradient id="logoTile" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#2F4CC7" />
        <Stop offset="1" stopColor="#1B2A6B" />
      </LinearGradient>
    </Defs>
    <Rect width="32" height="32" rx="8" fill="url(#logoTile)" />
    <Rect x="9" y="12.5" width="14" height="13.5" rx="1.6" fill="#FFFFFF" fillOpacity={0.96} />
    <Line x1="11.6" y1="17" x2="18.5" y2="17" stroke="#1B2A6B" strokeWidth={1.4} strokeOpacity={0.55} />
    <Line x1="11.6" y1="20" x2="20.4" y2="20" stroke="#1B2A6B" strokeWidth={1.4} strokeOpacity={0.55} />
    <Polygon points="16,4.2 27,9 16,13.8 5,9" fill="#E2963A" />
    <Path d="M11 10.6V15C11 16.4 13.2 17.5 16 17.5C18.8 17.5 21 16.4 21 15V10.6" stroke="#E2963A" strokeWidth={1.3} fill="none" />
    <Line x1="27" y1="9" x2="27" y2="14.5" stroke="#E2963A" strokeWidth={1.3} />
    <Circle cx="27" cy="15.6" r="1.1" fill="#E2963A" />
    <Circle cx="23.5" cy="23.5" r="5.4" fill="#2F8F6F" stroke="#FFFFFF" strokeWidth={1.3} />
    <Path d="M21 23.6L22.8 25.4L26.2 21.7" stroke="#FFFFFF" strokeWidth={1.5} fill="none" />
  </Svg>
);

const diagramStyles = StyleSheet.create({
  wrapper: { marginTop: 8, marginBottom: 4, alignItems: 'center' },
  frame: { border: '1pt solid #cbd5e1', borderRadius: 4, padding: 6 },
  legend: { marginTop: 6, flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  legendMarker: { width: 12, height: 12, borderRadius: 6, border: '1pt solid #1B2A6B', textAlign: 'center', fontSize: 7 },
  imageMarker: { position: 'absolute', width: 14, height: 14, borderRadius: 7, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center' },
  imageMarkerText: { fontSize: 7, color: '#FFFFFF' },
});

const num = (v: any, fallback: number) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback);
const clampPercent = (v: number) => Math.min(Math.max(v, 0), 100);

// Matches the fixed 500x350 size requested from the image-generation service
// (diagramImageService.ts) -- used to keep the label markers' aspect ratio
// consistent with the actual image.
const DIAGRAM_IMAGE_RENDER_WIDTH = 220;
const DIAGRAM_IMAGE_ASPECT = 350 / 500;

// The AI doesn't always follow the exact field names from the prompt schema
// verbatim -- it commonly substitutes the more familiar raw-SVG convention
// (x1/y1/x2/y2) for a line's start point instead of x/y. Coerce known aliases
// and fall back to safe numeric defaults for anything missing/non-numeric,
// so a single malformed shape can never throw and take down the whole PDF
// (that failure is silent to the caller -- worksheetService's PDF step is
// best-effort -- so it must not fail at all here).
// Unlike DiagramShape (whose numeric fields are optional, since the AI's raw
// output may omit any of them), a normalized shape always has every field
// coerced to a concrete number -- react-pdf's SVG primitives reject `undefined`.
type NormalizedShape = Required<Pick<DiagramShape, 'type' | 'x' | 'y' | 'width' | 'height' | 'rx' | 'ry' | 'x2' | 'y2' | 'points' | 'fill' | 'rotation' | 'label'>>;

// A pleasant, print-safe palette used whenever the AI omits (or supplies an
// invalid) "fill" -- diagrams should never fall back to plain monochrome.
const FALLBACK_PALETTE = ['#FDE68A', '#F9A8D4', '#86EFAC', '#93C5FD', '#FCA5A5', '#D8B4FE', '#FDBA74', '#67E8F9'];
const HEX_COLOR_RE = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
// Loosely validates a "x,y x,y x,y ..." SVG points string (at least 3 pairs).
const POLYGON_POINTS_RE = /^(-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?\s+){2,}-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/;

function normalizeShape(raw: any, idx: number): NormalizedShape {
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

// Rotates point (px,py) around (ox,oy) by `deg` degrees, matching the SVG
// rotate(deg, ox, oy) transform's matrix exactly.
function rotatePoint(px: number, py: number, ox: number, oy: number, deg: number): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180;
  const dx = px - ox;
  const dy = py - oy;
  return {
    x: ox + dx * Math.cos(rad) - dy * Math.sin(rad),
    y: oy + dx * Math.sin(rad) + dy * Math.cos(rad),
  };
}

// Places each shape's number/label near an edge rather than dead-center --
// diagrams commonly nest shapes with shared centers (e.g. a cell membrane
// ellipse around a nucleus circle, or petals rotated around a flower center),
// and center-placed labels would stack exactly on top of each other, hiding
// all but the last-drawn one. When the shape itself is rotated (e.g. a petal
// arranged radially), the label position must rotate with it too.
function shapeLabelPos(shape: NormalizedShape): { cx: number; cy: number } {
  let pos: { cx: number; cy: number };
  if (shape.type === 'line' || shape.type === 'arrow') {
    pos = { cx: shape.x2, cy: shape.y2 - 6 };
  } else if (shape.type === 'rect') {
    pos = { cx: shape.x + 10, cy: shape.y + 12 };
  } else if (shape.type === 'ellipse') {
    pos = { cx: shape.x, cy: shape.y - shape.ry + 9 };
  } else {
    // circle and polygon -- x,y is already the AI-supplied center/anchor point.
    pos = { cx: shape.x, cy: shape.y };
  }
  if (!shape.rotation) return pos;
  const rotated = rotatePoint(pos.cx, pos.cy, shape.x, shape.y, shape.rotation);
  return { cx: rotated.x, cy: rotated.y };
}

// Renders a real generated reference image (see diagramImageService.ts) with
// numbered markers pinned at the AI's estimated label positions, plus a
// legend below (blank lines on the worksheet, real labels in the answer key).
const ImageDiagramView = ({ diagram, showLabels }: { diagram: DiagramSpec; showLabels: boolean }) => {
  const points: DiagramLabelPoint[] = Array.isArray(diagram.labelPoints) ? diagram.labelPoints : [];
  const renderHeight = DIAGRAM_IMAGE_RENDER_WIDTH * DIAGRAM_IMAGE_ASPECT;

  return (
    <View style={diagramStyles.wrapper} wrap={false}>
      <View style={diagramStyles.frame}>
        <View style={{ width: DIAGRAM_IMAGE_RENDER_WIDTH, height: renderHeight, position: 'relative' }}>
          <Image src={diagram.imageUrl!} style={{ width: DIAGRAM_IMAGE_RENDER_WIDTH, height: renderHeight }} />
          {points.map((pt, idx) => {
            const px = clampPercent(num(pt?.x, 50));
            const py = clampPercent(num(pt?.y, 50));
            const left = (px / 100) * DIAGRAM_IMAGE_RENDER_WIDTH - 7;
            const top = (py / 100) * renderHeight - 7;
            return (
              <View key={idx} style={[diagramStyles.imageMarker, { left, top }]}>
                <Text style={diagramStyles.imageMarkerText}>{idx + 1}</Text>
              </View>
            );
          })}
        </View>
      </View>
      <View style={diagramStyles.legend}>
        {points.map((pt, idx) => (
          <View key={idx} style={diagramStyles.legendItem}>
            <Text style={diagramStyles.legendMarker}>{idx + 1}</Text>
            <Text style={{ fontSize: 8 }}>{showLabels ? (typeof pt?.label === 'string' ? pt.label : '') : '_______________'}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Shows the real generated image WITHOUT pinpoint markers -- used whenever
// label positions haven't been verified against the actual image (see
// worksheetService.ts's attachGeneratedImages / AIProvider.verifyImageLabels).
// The AI's pre-generation label guesses were confirmed wrong often enough in
// practice that pinning them on the image would just be confidently
// mislabeling it; a plain numbered list next to the picture never claims a
// precise position, so it can't be wrong the same way.
const ImageWithLegendView = ({ diagram, showLabels }: { diagram: DiagramSpec; showLabels: boolean }) => {
  const points: DiagramLabelPoint[] = Array.isArray(diagram.labelPoints) ? diagram.labelPoints : [];
  const renderHeight = DIAGRAM_IMAGE_RENDER_WIDTH * DIAGRAM_IMAGE_ASPECT;

  return (
    <View style={diagramStyles.wrapper} wrap={false}>
      <View style={diagramStyles.frame}>
        <Image src={diagram.imageUrl!} style={{ width: DIAGRAM_IMAGE_RENDER_WIDTH, height: renderHeight }} />
      </View>
      <View style={diagramStyles.legend}>
        {points.map((pt, idx) => (
          <View key={idx} style={diagramStyles.legendItem}>
            <Text style={diagramStyles.legendMarker}>{idx + 1}</Text>
            <Text style={{ fontSize: 8 }}>{showLabels ? (typeof pt?.label === 'string' ? pt.label : '') : '_______________'}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Legacy fallback for worksheets saved before real image generation existed
// -- renders the old shape-based vector wireframe from `diagram.shapes`.
const ShapeDiagramView = ({ diagram, showLabels }: { diagram: DiagramSpec; showLabels: boolean }) => {
  const rawShapes = Array.isArray(diagram?.shapes) ? diagram.shapes : [];
  if (rawShapes.length === 0) return null;
  const shapes = rawShapes.map((s, idx) => normalizeShape(s, idx));

  const viewBoxParts = (diagram.viewBox || '0 0 300 180').split(' ').map(Number);
  const viewBox = viewBoxParts.length === 4 && viewBoxParts.every(Number.isFinite) ? diagram.viewBox! : '0 0 300 180';
  const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);
  const renderWidth = Math.min(vbWidth || 300, 260);
  const renderHeight = ((vbHeight || 180) / (vbWidth || 300)) * renderWidth;

  // The colored illustration itself is identical on both the worksheet and
  // the answer key -- only the marker/legend text (numbers vs real labels)
  // differs -- so a student sees the real, accurate picture either way.
  // wrap={false} keeps the whole diagram (frame + legend) from being split
  // across a page boundary. Without it, react-pdf can lay out this <Svg> with
  // a truncated (sometimes zero) box height when it straddles a page break,
  // which crashes deep in the PDF layout engine ("unsupported number:
  // Infinity") instead of failing gracefully -- moving the whole block to the
  // next page avoids ever slicing an <Svg> node.
  return (
    <View style={diagramStyles.wrapper} wrap={false}>
      <View style={diagramStyles.frame}>
        <Svg width={renderWidth} height={renderHeight} viewBox={viewBox}>
          {shapes.map((shape, idx) => {
            const stroke = '#1e293b';
            const marker = showLabels ? shape.label : String(idx + 1);
            const { cx, cy } = shapeLabelPos(shape);
            const transform = shape.rotation ? `rotate(${shape.rotation} ${shape.x} ${shape.y})` : undefined;
            return (
              <React.Fragment key={idx}>
                {shape.type === 'rect' && (
                  <Rect x={shape.x} y={shape.y} width={shape.width} height={shape.height} stroke={stroke} strokeWidth={1} fill={shape.fill} transform={transform} />
                )}
                {shape.type === 'circle' && (
                  <Circle cx={shape.x} cy={shape.y} r={shape.rx} stroke={stroke} strokeWidth={1} fill={shape.fill} />
                )}
                {shape.type === 'ellipse' && (
                  <Ellipse cx={shape.x} cy={shape.y} rx={shape.rx} ry={shape.ry} stroke={stroke} strokeWidth={1} fill={shape.fill} transform={transform} />
                )}
                {shape.type === 'polygon' && (
                  <Polygon points={shape.points} stroke={stroke} strokeWidth={1} fill={shape.fill} transform={transform} />
                )}
                {(shape.type === 'line' || shape.type === 'arrow') && (
                  <Line x1={shape.x} y1={shape.y} x2={shape.x2} y2={shape.y2} stroke={shape.fill} strokeWidth={2} />
                )}
                <Text x={cx} y={cy} style={{ fontSize: 7 }}>{marker}</Text>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
      <View style={diagramStyles.legend}>
        {shapes.map((shape, idx) => (
          <View key={idx} style={diagramStyles.legendItem}>
            <Text style={diagramStyles.legendMarker}>{idx + 1}</Text>
            <Text style={{ fontSize: 8 }}>{showLabels ? shape.label : '_______________'}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Text-only fallback for when image generation failed/timed out (best-effort
// -- see diagramImageService.ts) but the AI's labelPoints/labels still exist,
// so the question isn't left with nothing at all below it.
const TextOnlyLegend = ({ labels, showLabels }: { labels: string[]; showLabels: boolean }) => {
  if (labels.length === 0) return null;
  return (
    <View style={diagramStyles.legend}>
      {labels.map((label, idx) => (
        <View key={idx} style={diagramStyles.legendItem}>
          <Text style={diagramStyles.legendMarker}>{idx + 1}</Text>
          <Text style={{ fontSize: 8 }}>{showLabels ? label : '_______________'}</Text>
        </View>
      ))}
    </View>
  );
};

// Prefers a real generated image (current schema) over the legacy vector
// shapes (only present on worksheets saved before real image generation was
// added) -- see DiagramSpec's comment in packages/ai for why both exist.
// Pinpoint markers are only trusted when labelPointsVerified is true (a
// vision model actually confirmed them against the real image) -- otherwise
// the image is shown with a plain, unpinned legend instead.
const DiagramView = ({ diagram, showLabels }: { diagram: DiagramSpec; showLabels: boolean }) => {
  if (!diagram) return null;
  if (diagram.imageUrl) {
    return diagram.labelPointsVerified
      ? <ImageDiagramView diagram={diagram} showLabels={showLabels} />
      : <ImageWithLegendView diagram={diagram} showLabels={showLabels} />;
  }
  if (Array.isArray(diagram.shapes) && diagram.shapes.length > 0) {
    return <ShapeDiagramView diagram={diagram} showLabels={showLabels} />;
  }
  if (Array.isArray(diagram.labelPoints) && diagram.labelPoints.length > 0) {
    return <TextOnlyLegend labels={diagram.labelPoints.map((p) => p?.label || '')} showLabels={showLabels} />;
  }
  return null;
};

const coloringStyles = StyleSheet.create({
  wrapper: { marginTop: 8, marginBottom: 4, alignItems: 'center' },
  frame: { border: '1.5pt solid #cbd5e1', borderRadius: 6, padding: 8 },
});

// Full-size real outline/line-art image for a child to print and color --
// deliberately no numbered markers or legend (there's nothing to label, just
// color), unlike the labeled ImageDiagramView.
const ColoringSheetView = ({ diagram }: { diagram?: DiagramSpec | null }) => {
  if (!diagram?.imageUrl) return null;
  const width = 380;
  const height = width * DIAGRAM_IMAGE_ASPECT;
  return (
    <View style={coloringStyles.wrapper} wrap={false}>
      <View style={coloringStyles.frame}>
        <Image src={diagram.imageUrl} style={{ width, height }} />
      </View>
    </View>
  );
};

const tracingStyles = StyleSheet.create({
  wrapper: { marginTop: 10, marginBottom: 4 },
  guideRow: { flexDirection: 'row', flexWrap: 'wrap' },
  guideGlyph: { fontSize: 40, fontWeight: 'bold', color: '#cbd5e1', marginRight: 14 },
  practiceLine: { borderBottom: '1pt dashed #94a3b8', height: 30, marginTop: 8, width: '100%' },
});

// Repeats the trace content (a letter/number/short word) as large, light-gray
// bold text for a child to trace over with a pencil, followed by blank
// practice lines. A validated technique -- react-pdf's PDF text engine always
// fills glyphs solid regardless of stroke/fill/strokeDasharray props, so a
// dashed/dotted OUTLINE glyph (the more common tracing-worksheet look) isn't
// achievable here; a light solid fill is the reliable, still-legitimate
// real-world alternative used by many printable tracing worksheets.
const TracingView = ({ content }: { content?: string }) => {
  if (!content) return null;
  const repeated = Array.from({ length: 6 }, () => content).join('   ');
  return (
    <View style={tracingStyles.wrapper} wrap={false}>
      <View style={tracingStyles.guideRow}>
        <Text style={tracingStyles.guideGlyph}>{repeated}</Text>
      </View>
      <View style={tracingStyles.practiceLine} />
      <View style={tracingStyles.practiceLine} />
    </View>
  );
};

const matchStyles = StyleSheet.create({
  row: { flexDirection: 'row', marginLeft: 25, marginTop: 6, gap: 20 },
  columnA: { flex: 1, gap: 8 },
  columnB: { flex: 1, gap: 8 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  itemImage: { width: 28, height: 28, borderRadius: 3 },
  itemText: { fontSize: 10 },
});

// Renders "match the following" with the actual Column A options printed
// (previously "match" questions only showed blank lines with no options ever
// printed). When matchImageUrls is present (young-learner picture matching),
// a small real image is shown next to each Column A entry instead of just
// text. Column B answers arrive as one already-joined string (see
// worksheetService.ts, which flattens the AI's answer array before storage),
// so the answer key shows them as a single reference line rather than a fake
// second column.
const MatchView = ({ q, isAnswerKey }: { q: Question; isAnswerKey?: boolean }) => {
  const options = q.options || [];
  if (options.length === 0) return null;
  const imageUrls = q.diagram?.matchImageUrls;

  return (
    <View style={matchStyles.row}>
      <View style={matchStyles.columnA}>
        {options.map((opt, idx) => (
          <View key={idx} style={matchStyles.itemRow}>
            <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{idx + 1}.</Text>
            {imageUrls?.[idx] && <Image src={imageUrls[idx]!} style={matchStyles.itemImage} />}
            <Text style={matchStyles.itemText}>{opt}</Text>
          </View>
        ))}
      </View>
      <View style={matchStyles.columnB}>
        {isAnswerKey ? (
          <Text style={{ fontSize: 10, color: '#ef4444', fontWeight: 'bold' }}>Ans: {q.answer}</Text>
        ) : (
          options.map((_, idx) => <View key={idx} style={styles.blankLine} />)
        )}
      </View>
    </View>
  );
};

const WorksheetDocument = ({ worksheet, questions, isAnswerKey }: { worksheet: Worksheet, questions: Question[], isAnswerKey?: boolean }) => (
  <Document>
    <Page size="A4" style={isDevanagariLanguage(worksheet.language) ? [styles.page, { fontFamily: DEVANAGARI_FONT }] : styles.page}>
      <View style={styles.pageBorder} fixed />
      {/* Letterhead mark -- fixed so it repeats on every page, top right */}
      <View style={styles.brandMark} fixed>
        <PdfLogo />
        <Text style={styles.brandName}>Bosket&apos;s EduSheet</Text>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerCol}>
          {worksheet.school_name && <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>{worksheet.school_name}</Text>}
          <Text>Student Name: _________________</Text>
          <Text>Class: {worksheet.class || '___'}</Text>
        </View>
        <View style={styles.headerCol}>
          <Text>Date: _________________</Text>
          <Text>Subject: {worksheet.subject || '___'}</Text>
          {isAnswerKey && <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>ANSWER KEY</Text>}
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>{worksheet.title}</Text>
      {worksheet.instructions && <Text style={styles.instructions}>{worksheet.instructions}</Text>}

      {/* Questions */}
      {questions.map((q, i) => (
        <View key={q.id || i} style={styles.section}>
          <View style={styles.questionRow}>
            <Text style={styles.questionNum}>{i + 1}.</Text>
            <View style={styles.questionText}>
              <Text>{q.text} {q.marks ? `[${q.marks} marks]` : ''}</Text>

              {q.type === 'diagram' && q.diagram ? (
                <>
                  <DiagramView diagram={q.diagram} showLabels={!!isAnswerKey} />
                  {isAnswerKey && q.answer && (
                    <Text style={{ color: '#ef4444', marginTop: 5, fontWeight: 'bold' }}>Ans: {q.answer}</Text>
                  )}
                </>
              ) : q.type === 'coloring' ? (
                <>
                  <ColoringSheetView diagram={q.diagram} />
                  {isAnswerKey && q.answer && (
                    <Text style={{ color: '#ef4444', marginTop: 5, fontWeight: 'bold' }}>Ans: {q.answer}</Text>
                  )}
                </>
              ) : q.type === 'tracing' ? (
                <TracingView content={q.diagram?.traceContent} />
              ) : q.type === 'match' ? (
                <MatchView q={q} isAnswerKey={isAnswerKey} />
              ) : isAnswerKey ? (
                <Text style={{ color: '#ef4444', marginTop: 5, fontWeight: 'bold' }}>Ans: {q.answer}</Text>
              ) : (
                <>
                  {q.type === 'mcq' && q.options && (
                    <View style={styles.options}>
                      {q.options.map((opt, oIdx) => (
                        <Text key={oIdx} style={styles.option}>{String.fromCharCode(97 + oIdx)}) {opt}</Text>
                      ))}
                    </View>
                  )}
                  {q.type === 'fill_in_the_blank' && <View style={styles.blankLine} />}
                  {q.type === 'true_false' && <Text style={{ marginTop: 5 }}>( True / False )</Text>}
                  {q.type === 'short_answer' && <><View style={styles.blankLine}/><View style={styles.blankLine}/></>}
                  {(q.type === 'long_answer' || q.type === 'word_problem' || q.type === 'logical_reasoning') && <><View style={styles.blankLine}/><View style={styles.blankLine}/><View style={styles.blankLine}/><View style={styles.blankLine}/></>}
                </>
              )}
            </View>
          </View>
        </View>
      ))}

      {/* Footer */}
      <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
        `Bosket's EduSheet • Developed by Bosket's Tech Ventures • Page ${pageNumber} of ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);

const renderToBuffer = async (element: React.ReactElement<any>): Promise<Buffer> => {
  const stream = await renderToStream(element);
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
};

export const generateWorksheetPDF = async (worksheet: Worksheet, questions: Question[]): Promise<Buffer> => {
  return renderToBuffer(<WorksheetDocument worksheet={worksheet} questions={questions} />);
};

export const generateAnswerKeyPDF = async (worksheet: Worksheet, questions: Question[]): Promise<Buffer> => {
  return renderToBuffer(<WorksheetDocument worksheet={worksheet} questions={questions} isAnswerKey={true} />);
};

interface ProjectSection {
  heading: string;
  content: string;
}

interface ProjectMeta {
  title: string;
  school_name?: string;
  class?: string;
  subject?: string;
  language?: string;
}

const projectStyles = StyleSheet.create({
  sectionHeading: { fontSize: 13, fontWeight: 'bold', marginBottom: 6, color: '#1B2A6B' },
  sectionContent: { textAlign: 'justify' },
  bibliographyItem: { marginBottom: 4 },
});

const ProjectDocument = ({ project, sections, bibliography }: { project: ProjectMeta; sections: ProjectSection[]; bibliography?: string[] }) => (
  <Document>
    <Page size="A4" style={isDevanagariLanguage(project.language) ? [styles.page, { fontFamily: DEVANAGARI_FONT }] : styles.page}>
      <View style={styles.pageBorder} fixed />
      <View style={styles.brandMark} fixed>
        <PdfLogo />
        <Text style={styles.brandName}>Bosket&apos;s EduSheet</Text>
      </View>

      <View style={styles.header}>
        <View style={styles.headerCol}>
          {project.school_name && <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>{project.school_name}</Text>}
          <Text>Student Name: _________________</Text>
          <Text>Class: {project.class || '___'}</Text>
        </View>
        <View style={styles.headerCol}>
          <Text>Date: _________________</Text>
          <Text>Subject: {project.subject || '___'}</Text>
        </View>
      </View>

      <Text style={styles.title}>{project.title}</Text>

      {sections.map((s, i) => (
        <View key={i} style={styles.section}>
          <Text style={projectStyles.sectionHeading}>{s.heading}</Text>
          <Text style={projectStyles.sectionContent}>{s.content}</Text>
        </View>
      ))}

      {bibliography && bibliography.length > 0 && (
        <View style={styles.section}>
          <Text style={projectStyles.sectionHeading}>Bibliography</Text>
          {bibliography.map((b, i) => (
            <Text key={i} style={projectStyles.bibliographyItem}>{i + 1}. {b}</Text>
          ))}
        </View>
      )}

      <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
        `Bosket's EduSheet • Developed by Bosket's Tech Ventures • Page ${pageNumber} of ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);

export const generateProjectPDF = async (project: ProjectMeta, sections: ProjectSection[], bibliography?: string[]): Promise<Buffer> => {
  return renderToBuffer(<ProjectDocument project={project} sections={sections} bibliography={bibliography} />);
};

interface StudyMaterialSection {
  heading: string;
  content: string;
  audience: 'teacher' | 'student';
}

const studyMaterialStyles = StyleSheet.create({
  audienceTag: { fontSize: 9, fontWeight: 'bold', marginBottom: 2, letterSpacing: 0.5 },
  teacherTag: { color: '#8A5A00' },
  studentTag: { color: '#1B6B3A' },
  sectionHeading: { fontSize: 13, fontWeight: 'bold', marginBottom: 6, color: '#1B2A6B' },
  sectionContent: { textAlign: 'justify' },
  lessonStepLabel: { fontWeight: 'bold', color: '#1B2A6B' },
  lessonStepBlock: { marginBottom: 6 },
});

// "teacher" sections are prompted to write each lesson-plan step as its own
// "**Label:** text" paragraph separated by blank lines (see
// buildStudyMaterialSystemPrompt) -- react-pdf has no markdown support, so
// this splits that convention into a bold label + plain text per step. Falls
// back to one plain block if the AI didn't follow the convention exactly.
function renderLessonPlanContent(content: string) {
  const blocks = content.split(/\n\s*\n/).filter((b) => b.trim());
  const labelPattern = /^\*\*(.+?):\*\*\s*([\s\S]*)$/;

  return blocks.map((block, i) => {
    const match = block.trim().match(labelPattern);
    if (match) {
      return (
        <Text key={i} style={studyMaterialStyles.lessonStepBlock}>
          <Text style={studyMaterialStyles.lessonStepLabel}>{match[1]}: </Text>
          {match[2]}
        </Text>
      );
    }
    return <Text key={i} style={studyMaterialStyles.lessonStepBlock}>{block.trim()}</Text>;
  });
}

// Renders teacher and student sections in one document but visually
// distinguishes them (a small colored "FOR TEACHERS"/"FOR STUDENTS" tag above
// each heading) since they're written for different readers even though this
// tool deliberately generates them as a single combined PDF.
const StudyMaterialDocument = ({ material, sections }: { material: ProjectMeta; sections: StudyMaterialSection[] }) => (
  <Document>
    <Page size="A4" style={isDevanagariLanguage(material.language) ? [styles.page, { fontFamily: DEVANAGARI_FONT }] : styles.page}>
      <View style={styles.pageBorder} fixed />
      <View style={styles.brandMark} fixed>
        <PdfLogo />
        <Text style={styles.brandName}>Bosket&apos;s EduSheet</Text>
      </View>

      <View style={styles.header}>
        <View style={styles.headerCol}>
          <Text>Class: {material.class || '___'}</Text>
        </View>
        <View style={styles.headerCol}>
          <Text>Subject: {material.subject || '___'}</Text>
        </View>
      </View>

      <Text style={styles.title}>{material.title}</Text>

      {sections.map((s, i) => (
        <View key={i} style={styles.section}>
          <Text style={[studyMaterialStyles.audienceTag, s.audience === 'teacher' ? studyMaterialStyles.teacherTag : studyMaterialStyles.studentTag]}>
            {s.audience === 'teacher' ? 'FOR TEACHERS / PARENTS' : 'FOR STUDENTS'}
          </Text>
          <Text style={studyMaterialStyles.sectionHeading}>{s.heading}</Text>
          {s.audience === 'teacher'
            ? renderLessonPlanContent(s.content)
            : <Text style={studyMaterialStyles.sectionContent}>{s.content}</Text>}
        </View>
      ))}

      <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
        `Bosket's EduSheet • Developed by Bosket's Tech Ventures • Page ${pageNumber} of ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);

export const generateStudyMaterialPDF = async (material: ProjectMeta, sections: StudyMaterialSection[]): Promise<Buffer> => {
  return renderToBuffer(<StudyMaterialDocument material={material} sections={sections} />);
};

interface ActivitySheetContent {
  title: string;
  materials: string[];
  steps: string[];
  reflectionQuestions: string[];
  facilitationNotes: string;
}

const activitySheetStyles = StyleSheet.create({
  sectionHeading: { fontSize: 13, fontWeight: 'bold', marginBottom: 8, color: '#1B2A6B' },
  materialRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  checkbox: { width: 10, height: 10, border: '1pt solid #1B2A6B', marginRight: 8 },
  stepRow: { flexDirection: 'row', marginBottom: 10 },
  stepNum: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#1B2A6B', color: 'white', fontSize: 10, fontWeight: 'bold', textAlign: 'center', paddingTop: 5, marginRight: 10 },
  stepText: { flex: 1, paddingTop: 3 },
  reflectionQuestion: { marginBottom: 4, fontWeight: 'bold' },
  facilitationBox: { marginTop: 10, padding: 12, backgroundColor: '#FFF7E6', border: '1pt solid #F0C36D', borderRadius: 4 },
  facilitationLabel: { fontSize: 9, fontWeight: 'bold', color: '#8A5A00', marginBottom: 4, letterSpacing: 0.5 },
});

const ActivitySheetDocument = ({ meta, activity }: { meta: ProjectMeta; activity: ActivitySheetContent }) => (
  <Document>
    <Page size="A4" style={isDevanagariLanguage(meta.language) ? [styles.page, { fontFamily: DEVANAGARI_FONT }] : styles.page}>
      <View style={styles.pageBorder} fixed />
      <View style={styles.brandMark} fixed>
        <PdfLogo />
        <Text style={styles.brandName}>Bosket&apos;s EduSheet</Text>
      </View>

      <View style={styles.header}>
        <View style={styles.headerCol}>
          <Text>Student Name: _________________</Text>
          <Text>Class: {meta.class || '___'}</Text>
        </View>
        <View style={styles.headerCol}>
          <Text>Date: _________________</Text>
          <Text>Subject: {meta.subject || '___'}</Text>
        </View>
      </View>

      <Text style={styles.title}>{activity.title}</Text>

      <View style={styles.section}>
        <Text style={activitySheetStyles.sectionHeading}>What You&apos;ll Need</Text>
        {activity.materials.map((m, i) => (
          <View key={i} style={activitySheetStyles.materialRow}>
            <View style={activitySheetStyles.checkbox} />
            <Text>{m}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={activitySheetStyles.sectionHeading}>What To Do</Text>
        {activity.steps.map((s, i) => (
          <View key={i} style={activitySheetStyles.stepRow}>
            <Text style={activitySheetStyles.stepNum}>{i + 1}</Text>
            <Text style={activitySheetStyles.stepText}>{s}</Text>
          </View>
        ))}
      </View>

      {activity.reflectionQuestions.length > 0 && (
        <View style={styles.section}>
          <Text style={activitySheetStyles.sectionHeading}>Think About It</Text>
          {activity.reflectionQuestions.map((q, i) => (
            <View key={i} style={{ marginBottom: 12 }}>
              <Text style={activitySheetStyles.reflectionQuestion}>{q}</Text>
              <View style={styles.blankLine} />
              <View style={[styles.blankLine, { marginTop: 10 }]} />
            </View>
          ))}
        </View>
      )}

      {activity.facilitationNotes && (
        <View style={activitySheetStyles.facilitationBox}>
          <Text style={activitySheetStyles.facilitationLabel}>FOR THE GROWN-UP RUNNING THIS ACTIVITY</Text>
          <Text>{activity.facilitationNotes}</Text>
        </View>
      )}

      <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
        `Bosket's EduSheet • Developed by Bosket's Tech Ventures • Page ${pageNumber} of ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);

export const generateActivitySheetPDF = async (meta: ProjectMeta, activity: ActivitySheetContent): Promise<Buffer> => {
  return renderToBuffer(<ActivitySheetDocument meta={meta} activity={activity} />);
};

// Tech Lab (Robotics/AI/Coding). Deliberately NOT curriculum-linked -- see
// tech_projects table comment in schema.sql -- so this meta has a `category`
// in place of the other documents' `subject`, rather than reusing ProjectMeta
// as-is.
interface TechProjectMeta {
  title: string;
  class?: string;
  category?: 'robotics' | 'ai' | 'coding';
  language?: string;
}

interface TechProjectStepContent {
  number: number;
  title: string;
  instruction: string;
  imagePrompt?: string;
  imageUrl?: string;
}

interface TechProjectHardwareItemContent {
  name: string;
  purpose: string;
  approxCostINR?: string;
}

interface TechProjectHardwareUpgradeContent {
  available: boolean;
  items: TechProjectHardwareItemContent[];
  note?: string;
}

interface TechProjectSimulationGuideContent {
  tool: string;
  toolUrl: string;
  instructions: string;
}

interface TechProjectTroubleshootingItemContent {
  issue: string;
  fix: string;
}

interface TechProjectContent {
  title: string;
  purpose: string;
  materials: string[];
  hardwareUpgrade?: TechProjectHardwareUpgradeContent;
  steps: TechProjectStepContent[];
  simulationGuide?: TechProjectSimulationGuideContent;
  codeSnippet?: string;
  codeLanguage?: string;
  troubleshooting: TechProjectTroubleshootingItemContent[];
  safetyNotes: string[];
  extensions: string[];
}

const CATEGORY_LABEL: Record<string, string> = { robotics: 'Robotics', ai: 'Artificial Intelligence', coding: 'Coding' };

const techProjectStyles = StyleSheet.create({
  sectionHeading: { fontSize: 13, fontWeight: 'bold', marginBottom: 8, color: '#1B2A6B' },
  materialRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  checkbox: { width: 10, height: 10, border: '1pt solid #1B2A6B', marginRight: 8 },
  hardwareBox: { padding: 12, backgroundColor: '#F0F5FF', border: '1pt solid #B3C7F0', borderRadius: 4 },
  hardwareLabel: { fontSize: 9, fontWeight: 'bold', color: '#1B2A6B', marginBottom: 6, letterSpacing: 0.5 },
  hardwareItemRow: { marginBottom: 5 },
  hardwareItemName: { fontWeight: 'bold' },
  hardwareItemMeta: { fontSize: 9, color: '#475569' },
  stepBlock: { marginBottom: 14 },
  stepHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  stepNum: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#1B2A6B', color: 'white', fontSize: 10, fontWeight: 'bold', textAlign: 'center', paddingTop: 5, marginRight: 10 },
  stepTitle: { fontWeight: 'bold', flex: 1 },
  stepInstruction: { marginLeft: 32, textAlign: 'justify' },
  stepImageWrap: { marginLeft: 32, marginTop: 6, alignItems: 'flex-start' },
  stepImageFrame: { border: '1pt solid #cbd5e1', borderRadius: 4, padding: 4 },
  stepImageDisclaimer: { fontSize: 8, color: '#8A5A00', marginTop: 3, maxWidth: DIAGRAM_IMAGE_RENDER_WIDTH, fontStyle: 'italic' },
  simulationBox: { padding: 12, backgroundColor: '#EAFBF3', border: '1pt solid #9EDFC2', borderRadius: 4 },
  simulationLabel: { fontSize: 9, fontWeight: 'bold', color: '#1B6B3A', marginBottom: 4, letterSpacing: 0.5 },
  simulationLink: { color: '#1B6B3A', textDecoration: 'underline', marginTop: 2 },
  codeBlock: { padding: 10, backgroundColor: '#1e293b', borderRadius: 4 },
  codeText: { fontFamily: 'Courier', fontSize: 9, color: '#e2e8f0', lineHeight: 1.4 },
  codeLangTag: { fontSize: 8, color: '#94a3b8', marginBottom: 4, letterSpacing: 0.5 },
  troubleRow: { marginBottom: 6 },
  troubleIssue: { fontWeight: 'bold' },
  troubleFix: { color: '#475569' },
  safetyBox: { padding: 12, backgroundColor: '#FDECEC', border: '1pt solid #F0A3A3', borderRadius: 4 },
  safetyLabel: { fontSize: 9, fontWeight: 'bold', color: '#B91C1C', marginBottom: 4, letterSpacing: 0.5 },
  safetyItem: { marginBottom: 3 },
  extensionItem: { marginBottom: 3 },
});

// Per the plan's Q3 answer, step diagrams are generated the same
// free/best-effort way as worksheet diagrams -- so they carry the same
// accuracy risk. Unlike a worksheet diagram (illustrative only), a Tech Lab
// step image can depict wiring/connections, so every image gets an explicit
// "verify before use" disclaimer rather than being trusted at face value.
const TechProjectStepImage = ({ imageUrl }: { imageUrl: string }) => {
  const renderHeight = DIAGRAM_IMAGE_RENDER_WIDTH * DIAGRAM_IMAGE_ASPECT;
  return (
    <View style={techProjectStyles.stepImageWrap} wrap={false}>
      <View style={techProjectStyles.stepImageFrame}>
        <Image src={imageUrl} style={{ width: DIAGRAM_IMAGE_RENDER_WIDTH, height: renderHeight }} />
      </View>
      <Text style={techProjectStyles.stepImageDisclaimer}>
        AI-generated illustration -- verify against the written steps before wiring or connecting anything.
      </Text>
    </View>
  );
};

const TechProjectDocument = ({ meta, content }: { meta: TechProjectMeta; content: TechProjectContent }) => (
  <Document>
    <Page size="A4" style={isDevanagariLanguage(meta.language) ? [styles.page, { fontFamily: DEVANAGARI_FONT }] : styles.page}>
      <View style={styles.pageBorder} fixed />
      <View style={styles.brandMark} fixed>
        <PdfLogo />
        <Text style={styles.brandName}>Bosket&apos;s EduSheet</Text>
      </View>

      <View style={styles.header}>
        <View style={styles.headerCol}>
          <Text>Student Name: _________________</Text>
          <Text>Class: {meta.class || '___'}</Text>
        </View>
        <View style={styles.headerCol}>
          <Text>Date: _________________</Text>
          <Text>Category: {meta.category ? CATEGORY_LABEL[meta.category] || meta.category : '___'}</Text>
        </View>
      </View>

      <Text style={styles.title}>{content.title}</Text>

      <View style={styles.section}>
        <Text style={techProjectStyles.sectionHeading}>Purpose &amp; Core Idea</Text>
        <Text style={{ textAlign: 'justify' }}>{content.purpose}</Text>
      </View>

      <View style={styles.section}>
        <Text style={techProjectStyles.sectionHeading}>What You&apos;ll Need</Text>
        {content.materials.map((m, i) => (
          <View key={i} style={techProjectStyles.materialRow}>
            <View style={techProjectStyles.checkbox} />
            <Text>{m}</Text>
          </View>
        ))}
      </View>

      {content.hardwareUpgrade?.available && content.hardwareUpgrade.items.length > 0 && (
        <View style={styles.section}>
          <Text style={techProjectStyles.sectionHeading}>Optional Hardware Upgrade</Text>
          <View style={techProjectStyles.hardwareBox}>
            <Text style={techProjectStyles.hardwareLabel}>OPTIONAL -- THE PROJECT WORKS FULLY WITHOUT THIS</Text>
            {content.hardwareUpgrade.items.map((item, i) => (
              <View key={i} style={techProjectStyles.hardwareItemRow}>
                <Text style={techProjectStyles.hardwareItemName}>{item.name}{item.approxCostINR ? ` (~${item.approxCostINR})` : ''}</Text>
                <Text style={techProjectStyles.hardwareItemMeta}>{item.purpose}</Text>
              </View>
            ))}
            {content.hardwareUpgrade.note && <Text style={{ fontSize: 9, marginTop: 4, color: '#475569' }}>{content.hardwareUpgrade.note}</Text>}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={techProjectStyles.sectionHeading}>Step-by-Step Build</Text>
        {content.steps.map((s) => (
          <View key={s.number} style={techProjectStyles.stepBlock} wrap={false}>
            <View style={techProjectStyles.stepHeaderRow}>
              <Text style={techProjectStyles.stepNum}>{s.number}</Text>
              <Text style={techProjectStyles.stepTitle}>{s.title}</Text>
            </View>
            <Text style={techProjectStyles.stepInstruction}>{s.instruction}</Text>
            {s.imageUrl && <TechProjectStepImage imageUrl={s.imageUrl} />}
          </View>
        ))}
      </View>

      {content.simulationGuide && (
        <View style={styles.section}>
          <Text style={techProjectStyles.sectionHeading}>Try It in Simulation</Text>
          <View style={techProjectStyles.simulationBox}>
            <Text style={techProjectStyles.simulationLabel}>{content.simulationGuide.tool.toUpperCase()}</Text>
            <Text style={techProjectStyles.simulationLink}>{content.simulationGuide.toolUrl}</Text>
            <Text style={{ marginTop: 6 }}>{content.simulationGuide.instructions}</Text>
          </View>
        </View>
      )}

      {content.codeSnippet && (
        <View style={styles.section}>
          <Text style={techProjectStyles.sectionHeading}>Code</Text>
          <View style={techProjectStyles.codeBlock}>
            {content.codeLanguage && <Text style={techProjectStyles.codeLangTag}>{content.codeLanguage.toUpperCase()}</Text>}
            <Text style={techProjectStyles.codeText}>{content.codeSnippet}</Text>
          </View>
        </View>
      )}

      {content.troubleshooting.length > 0 && (
        <View style={styles.section}>
          <Text style={techProjectStyles.sectionHeading}>Troubleshooting</Text>
          {content.troubleshooting.map((t, i) => (
            <View key={i} style={techProjectStyles.troubleRow}>
              <Text style={techProjectStyles.troubleIssue}>{t.issue}</Text>
              <Text style={techProjectStyles.troubleFix}>{t.fix}</Text>
            </View>
          ))}
        </View>
      )}

      {content.safetyNotes.length > 0 && (
        <View style={styles.section}>
          <View style={techProjectStyles.safetyBox}>
            <Text style={techProjectStyles.safetyLabel}>SAFETY NOTES</Text>
            {content.safetyNotes.map((n, i) => (
              <Text key={i} style={techProjectStyles.safetyItem}>• {n}</Text>
            ))}
          </View>
        </View>
      )}

      {content.extensions.length > 0 && (
        <View style={styles.section}>
          <Text style={techProjectStyles.sectionHeading}>Go Further</Text>
          {content.extensions.map((e, i) => (
            <Text key={i} style={techProjectStyles.extensionItem}>• {e}</Text>
          ))}
        </View>
      )}

      <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
        `Bosket's EduSheet • Developed by Bosket's Tech Ventures • Page ${pageNumber} of ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);

export const generateTechProjectPDF = async (meta: TechProjectMeta, content: TechProjectContent): Promise<Buffer> => {
  return renderToBuffer(<TechProjectDocument meta={meta} content={content} />);
};

// Chem Lab lab report. The experiment SCRIPT (steps, equation, safety notes)
// comes straight from packages/content's curated, hand-authored data -- see
// that package's header comment for why this is never AI-generated. Only
// the student's own predict-answer and typed observations are per-user data.
interface ChemLabReportMeta {
  class?: string;
  language?: string;
}

const chemLabStyles = StyleSheet.create({
  sectionHeading: { fontSize: 13, fontWeight: 'bold', marginBottom: 8, color: '#1B2A6B' },
  predictBox: { padding: 12, borderRadius: 4, marginBottom: 4 },
  predictCorrect: { backgroundColor: '#EAFBF3', border: '1pt solid #9EDFC2' },
  predictIncorrect: { backgroundColor: '#FFF7E6', border: '1pt solid #F0C36D' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  chip: { fontSize: 9, backgroundColor: '#F1F5F9', color: '#334155', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 10 },
  observationBox: { marginBottom: 8 },
  observationPrompt: { fontWeight: 'bold', fontSize: 10, marginBottom: 2 },
  observationAnswer: { color: '#334155' },
  safetyBox: { padding: 12, backgroundColor: '#FDECEC', border: '1pt solid #F0A3A3', borderRadius: 4 },
  safetyLabel: { fontSize: 9, fontWeight: 'bold', color: '#B91C1C', marginBottom: 4, letterSpacing: 0.5 },
  noteBox: { padding: 10, backgroundColor: '#FFF7E6', border: '1pt solid #F0C36D', borderRadius: 4 },
});

const ChemLabReportDocument = ({
  meta, experiment, observations, predictAnswerIndex, predictCorrect,
}: {
  meta: ChemLabReportMeta;
  experiment: ChemistryExperiment;
  observations: Record<string, string>;
  predictAnswerIndex: number;
  predictCorrect: boolean;
}) => {
  const apparatusNames = experiment.apparatusIds.map((id) => CHEM_EQUIPMENT.find((a) => a.id === id)?.name || id);
  const reagentNames = experiment.reagentIds.map((id) => CHEM_REAGENTS.find((r) => r.id === id)?.name || id);

  return (
    <Document>
      <Page size="A4" style={isDevanagariLanguage(meta.language) ? [styles.page, { fontFamily: DEVANAGARI_FONT }] : styles.page}>
        <View style={styles.pageBorder} fixed />
        <View style={styles.brandMark} fixed>
          <PdfLogo />
          <Text style={styles.brandName}>Bosket&apos;s EduSheet</Text>
        </View>

        <View style={styles.header}>
          <View style={styles.headerCol}>
            <Text>Student Name: _________________</Text>
            <Text>Class: {meta.class || '___'}</Text>
          </View>
          <View style={styles.headerCol}>
            <Text>Date: _________________</Text>
            <Text>Chem Lab Report</Text>
          </View>
        </View>

        <Text style={styles.title}>{experiment.title}</Text>

        <View style={styles.section}>
          <Text style={chemLabStyles.sectionHeading}>Purpose</Text>
          <Text style={{ textAlign: 'justify' }}>{experiment.purpose}</Text>
        </View>

        <View style={styles.section}>
          <Text style={chemLabStyles.sectionHeading}>Prediction</Text>
          <View style={[chemLabStyles.predictBox, predictCorrect ? chemLabStyles.predictCorrect : chemLabStyles.predictIncorrect]}>
            <Text style={{ marginBottom: 4 }}>{experiment.predictPrompt}</Text>
            <Text style={{ fontWeight: 'bold' }}>Student answered: {experiment.predictOptions[predictAnswerIndex] || '-'}</Text>
            <Text>Correct answer: {experiment.predictOptions[experiment.correctPredictIndex]}</Text>
            <Text style={{ marginTop: 2, fontWeight: 'bold' }}>{predictCorrect ? 'Correct prediction!' : 'Prediction did not match -- a normal part of learning through experiment.'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={chemLabStyles.sectionHeading}>Apparatus &amp; Reagents Used</Text>
          <View style={chemLabStyles.chipRow}>
            {apparatusNames.map((n, i) => <Text key={`a-${i}`} style={chemLabStyles.chip}>{n}</Text>)}
          </View>
          <View style={chemLabStyles.chipRow}>
            {reagentNames.map((n, i) => <Text key={`r-${i}`} style={chemLabStyles.chip}>{n}</Text>)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={chemLabStyles.sectionHeading}>Steps Followed</Text>
          {experiment.steps.map((s) => (
            <Text key={s.number} style={{ marginBottom: 4 }}>{s.number}. {s.instruction}</Text>
          ))}
        </View>

        {experiment.balancedEquation && (
          <View style={styles.section}>
            <Text style={chemLabStyles.sectionHeading}>Balanced Equation</Text>
            <Text style={{ fontFamily: 'Courier' }}>{experiment.balancedEquation}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={chemLabStyles.sectionHeading}>Explanation</Text>
          <Text style={{ textAlign: 'justify' }}>{experiment.explanation}</Text>
        </View>

        <View style={styles.section}>
          <Text style={chemLabStyles.sectionHeading}>Student Observations</Text>
          {experiment.observationPrompts.map((prompt, i) => (
            <View key={i} style={chemLabStyles.observationBox}>
              <Text style={chemLabStyles.observationPrompt}>{prompt}</Text>
              <Text style={chemLabStyles.observationAnswer}>{observations[String(i)] || observations[i as unknown as string] || '(not answered)'}</Text>
            </View>
          ))}
        </View>

        {experiment.realWorldApplications.length > 0 && (
          <View style={styles.section}>
            <Text style={chemLabStyles.sectionHeading}>Real-World Applications</Text>
            {experiment.realWorldApplications.map((a, i) => <Text key={i} style={{ marginBottom: 2 }}>• {a}</Text>)}
          </View>
        )}

        {experiment.safetyNotes.length > 0 && (
          <View style={styles.section}>
            <View style={chemLabStyles.safetyBox}>
              <Text style={chemLabStyles.safetyLabel}>SAFETY NOTES</Text>
              {experiment.safetyNotes.map((n, i) => <Text key={i} style={{ marginBottom: 2 }}>• {n}</Text>)}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={chemLabStyles.noteBox}>
            <Text>{experiment.realLifeNote}</Text>
          </View>
        </View>

        {experiment.extensions.length > 0 && (
          <View style={styles.section}>
            <Text style={chemLabStyles.sectionHeading}>Go Further</Text>
            {experiment.extensions.map((e, i) => <Text key={i} style={{ marginBottom: 2 }}>• {e}</Text>)}
          </View>
        )}

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `Bosket's EduSheet • Developed by Bosket's Tech Ventures • Page ${pageNumber} of ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};

export const generateLabReportPDF = async (
  meta: ChemLabReportMeta,
  experiment: ChemistryExperiment,
  observations: Record<string, string>,
  predictAnswerIndex: number,
  predictCorrect: boolean
): Promise<Buffer> => {
  return renderToBuffer(
    <ChemLabReportDocument meta={meta} experiment={experiment} observations={observations} predictAnswerIndex={predictAnswerIndex} predictCorrect={predictCorrect} />
  );
};
