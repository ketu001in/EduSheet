import { StudyMaterialPromptConfig } from '../providers/base';
import { getPedagogyRequestGuidance } from './pedagogy';

export function buildStudyMaterialPrompt(config: StudyMaterialPromptConfig): string {
  const { classLevel, subject, chapter, topics, language = 'English', board } = config;

  const languageInstruction = language.toLowerCase() === 'english'
    ? `Language: English`
    : `Language: ${language}
IMPORTANT: Write the ENTIRE study material -- every heading and every paragraph, both "teacher" and "student" sections -- in ${language}, using its native script. Do not write in English. Only proper nouns without a standard ${language} equivalent may stay in their original form.`;

  return `Create study material for Class ${classLevel}, Subject: ${subject}.
${languageInstruction}
${chapter ? `Chapter context: ${chapter}\n` : ''}Topic(s) to cover: ${topics.join(', ')}
${getPedagogyRequestGuidance(board)}
Requirements:
1. For EACH topic listed above, produce both a "teacher" section (the five-part Warm-up/Explain/Example/Activity/Wrap-up lesson plan) and a matching "student" section (revision notes) -- never only one of the two.
2. Every "teacher" section must give concrete, ready-to-use steps a parent or teacher can follow immediately -- specific questions to ask, a specific example, a specific activity -- not generic teaching advice.
3. Factually accurate and age-appropriate for a Class ${classLevel} student in the "student" sections.
4. No questions, quizzes, or answer keys -- this is study material, not a worksheet.
5. Output MUST be valid JSON.
`;
}
