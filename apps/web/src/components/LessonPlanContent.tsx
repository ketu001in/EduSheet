// "teacher" study-material sections are prompted to write each lesson-plan
// step as its own "**Label:** text" paragraph separated by blank lines (see
// packages/ai/src/prompts/systemPrompt.ts's buildStudyMaterialSystemPrompt).
// This renders that convention as a bold label + text per step instead of
// showing the raw markdown asterisks. Falls back to a plain paragraph if the
// AI didn't follow the convention exactly.
const LABEL_PATTERN = /^\*\*(.+?):\*\*\s*([\s\S]*)$/;

export function LessonPlanContent({ content }: { content: string }) {
  const blocks = content.split(/\n\s*\n/).filter((b) => b.trim());

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        const match = block.trim().match(LABEL_PATTERN);
        if (match) {
          return (
            <p key={i} className="text-justify leading-relaxed">
              <span className="font-bold">{match[1]}: </span>
              {match[2]}
            </p>
          );
        }
        return <p key={i} className="text-justify leading-relaxed">{block.trim()}</p>;
      })}
    </div>
  );
}
