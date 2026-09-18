import { ProjectPromptConfig } from '../providers/base';
import { getPedagogyRequestGuidance, isAlternativePedagogy } from './pedagogy';

const LENGTH_GUIDANCE: Record<string, string> = {
  short: '4-5 sections, roughly 500-700 words total -- suitable for a quick assignment.',
  medium: '6-8 sections, roughly 1000-1400 words total -- suitable for a standard school project.',
  long: '8-10 sections, roughly 1800-2500 words total -- suitable for an in-depth term project.',
};

export function buildProjectPrompt(config: ProjectPromptConfig): string {
  const { classLevel, subject, chapter, topics, length, language = 'English', customInstructions, board } = config;

  const languageInstruction = language.toLowerCase() === 'english'
    ? `Language: English`
    : `Language: ${language}
IMPORTANT: Write the ENTIRE project report -- every heading and every paragraph -- in ${language}, using its native script. Do not write in English. Only proper nouns without a standard ${language} equivalent may stay in their original form.`;

  // A rigid "Objective -> Conclusion" report shape and an NCERT-style
  // bibliography make sense for a standard exam board, but actively
  // contradict how a Reggio Emilia/Montessori/Waldorf "project" actually
  // looks (a documented exploration, a hands-on activity, a main-lesson
  // theme) -- see getPedagogySystemGuidance for the fuller framing.
  const structureInstruction = isAlternativePedagogy(board)
    ? `Structure the report the way this pedagogy actually frames a project (see the guidance above) -- do not force a generic "Objective/Introduction...Conclusion" exam-report shape onto it. Include a short list of real-world materials, references, or sources that inspired the project where relevant.`
    : `Structure the report as a sequence of sections, always starting with an "Objective" or "Introduction" section and ending with a "Conclusion" section. Include a bibliography of plausible, appropriate reference sources for a school project at this level (e.g. "NCERT Textbook, Class ${classLevel} ${subject}", named government/educational bodies) -- do not invent specific URLs you are not confident are real.`;

  return `Create a school project/assignment report for Class ${classLevel}, Subject: ${subject}.
${languageInstruction}
${chapter ? `Chapter context: ${chapter}\n` : ''}Topic(s) to cover: ${topics.join(', ')}

Length: ${length.toUpperCase()} -- ${LENGTH_GUIDANCE[length] || LENGTH_GUIDANCE.medium}
${customInstructions ? `\nAdditional requirements from the requester -- follow these closely, but never let them override factual accuracy or age-appropriateness: ${customInstructions}\n` : ''}
${getPedagogyRequestGuidance(board)}
${structureInstruction}

Requirements:
1. Written entirely in prose paragraphs (no questions, no answer keys) -- this is a report, not a worksheet.
2. Language complexity perfectly suited for a Class ${classLevel} student to write in their own project notebook.
3. Factually accurate and age-appropriate.
4. Output MUST be valid JSON.
`;
}
