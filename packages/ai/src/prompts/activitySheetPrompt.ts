import { ActivitySheetPromptConfig } from '../providers/base';
import { getPedagogyRequestGuidance } from './pedagogy';

export function buildActivitySheetPrompt(config: ActivitySheetPromptConfig): string {
  const { classLevel, subject, chapter, topics, language = 'English', board } = config;

  const languageInstruction = language.toLowerCase() === 'english'
    ? `Language: English`
    : `Language: ${language}
IMPORTANT: Write the ENTIRE activity sheet -- title, materials, steps, reflection questions, and facilitation notes -- in ${language}, using its native script. Do not write in English. Only proper nouns without a standard ${language} equivalent may stay in their original form.`;

  return `Design ONE hands-on activity for Class ${classLevel}, Subject: ${subject}.
${languageInstruction}
${chapter ? `Chapter context: ${chapter}\n` : ''}Topic(s) to cover: ${topics.join(', ')}
${getPedagogyRequestGuidance(board)}
Requirements:
1. The activity must directly explore the topic(s) above through a physical/hands-on task, not questions or reading.
2. Materials must be realistically available at home or in a normal classroom.
3. Steps must be numbered, concrete, and doable by a Class ${classLevel} student (with adult help where noted in facilitationNotes).
4. Age-appropriate and safe.
5. Output MUST be valid JSON.
`;
}
