import { WorksheetPromptConfig } from '../providers/base';
import { getQuestionTypeInstructions } from './questionTypes';
import { getPedagogyRequestGuidance } from './pedagogy';

export function buildWorksheetPrompt(config: WorksheetPromptConfig): string {
  const {
    classLevel,
    subject,
    chapter,
    topics,
    questionTypes,
    difficulty,
    language = 'English',
    customInstructions,
    board,
  } = config;

  const languageInstruction = language.toLowerCase() === 'english'
    ? `Language: English`
    : `Language: ${language}
IMPORTANT: Write the ENTIRE worksheet -- every question, every option, every answer, and every explanation -- in ${language}, using its native script. Do not write in English. Only proper nouns without a standard ${language} equivalent may stay in their original form.`;

  let prompt = `Create a worksheet for Class ${classLevel}, Subject: ${subject}.
${languageInstruction}
${chapter ? `Chapter context: ${chapter}\n` : ''}
Specific topics to cover: ${topics.join(', ')}
${customInstructions ? `\nAdditional requirements from the requester -- follow these closely, but never let them override factual accuracy or age-appropriateness: ${customInstructions}\n` : ''}
${getPedagogyRequestGuidance(board)}
Difficulty Level: ${difficulty.toUpperCase()}
- Easy: Focus on recall and understand (Bloom's Taxonomy).
- Medium: Focus on apply and analyze (Bloom's Taxonomy).
- Hard: Focus on evaluate and create (Bloom's Taxonomy).

Please generate the following number of questions per type:
`;

  for (const [type, count] of Object.entries(questionTypes)) {
    if (count > 0) {
      prompt += `- ${count} ${type} questions\n`;
    }
  }

  prompt += `\nGuidelines for specific question types:\n`;
  for (const [type, count] of Object.entries(questionTypes)) {
    if (count > 0) {
      prompt += getQuestionTypeInstructions(type);
    }
  }

  prompt += `
Requirements:
1. Ensure the language complexity is perfectly suited for Class ${classLevel}.
2. Include an answer key and explanations for every question.
3. Calculate the total marks based on the individual question marks.
4. Output MUST be valid JSON.
`;

  return prompt;
}
