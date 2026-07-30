import React from 'react';
import path from 'path';
import { Document, Page, Text, View, StyleSheet, renderToStream, Svg, Rect, Line, Circle, Path, Polygon, Defs, LinearGradient, Stop, Font } from '@react-pdf/renderer';

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

interface Question {
  id: string;
  type: 'mcq' | 'fill_blank' | 'true_false' | 'short_answer' | 'long_answer';
  text: string;
  options?: string[];
  answer?: string;
  marks?: number;
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

const WorksheetDocument = ({ worksheet, questions, isAnswerKey }: { worksheet: Worksheet, questions: Question[], isAnswerKey?: boolean }) => (
  <Document>
    <Page size="A4" style={isDevanagariLanguage(worksheet.language) ? [styles.page, { fontFamily: DEVANAGARI_FONT }] : styles.page}>
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

              {isAnswerKey ? (
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
                  {q.type === 'fill_blank' && <View style={styles.blankLine} />}
                  {q.type === 'true_false' && <Text style={{ marginTop: 5 }}>( True / False )</Text>}
                  {q.type === 'short_answer' && <><View style={styles.blankLine}/><View style={styles.blankLine}/></>}
                  {q.type === 'long_answer' && <><View style={styles.blankLine}/><View style={styles.blankLine}/><View style={styles.blankLine}/><View style={styles.blankLine}/></>}
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
