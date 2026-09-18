import { TechProjectPromptConfig } from '../providers/base';

const CATEGORY_LABEL: Record<string, string> = {
  robotics: 'Robotics',
  ai: 'Artificial Intelligence',
  coding: 'Coding',
};

export function buildTechProjectPrompt(config: TechProjectPromptConfig): string {
  const { classLevel, board, category, ideaPrompt, language = 'English' } = config;

  const languageInstruction = language.toLowerCase() === 'english'
    ? `Language: English`
    : `Language: ${language}
IMPORTANT: Write the ENTIRE project -- title, purpose, every step, every note -- in ${language}, using its native script. Code and tool names stay as-is (code syntax and real tool/product names are never translated). Only proper nouns without a standard ${language} equivalent may stay in their original form.`;

  return `Design a ${CATEGORY_LABEL[category] || category} "Tech Lab" project for Class ${classLevel}${board ? ` (${board})` : ''}.
${languageInstruction}

Project idea/theme: ${ideaPrompt}

Requirements:
1. The project must genuinely build/explore the idea above -- not a generic unrelated project with the idea's name pasted on.
2. Age-appropriate for a Class ${classLevel} student -- both the concept and the language used to explain it.
3. The free software/simulation path in "materials" must be a complete, real way to finish the whole project at zero cost.
4. Output MUST be valid JSON.
`;
}
