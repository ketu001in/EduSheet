import { GeneratedWorksheet, GeneratedProject } from '../providers/base';

// Extracts the JSON object/array substring from a raw model response,
// stripping markdown code fences if present.
function extractJsonString(responseText: string): string {
  let jsonStr = responseText.trim();

  if (jsonStr.startsWith('```')) {
    const startIdx = jsonStr.indexOf('{');
    const startBracketIdx = jsonStr.indexOf('[');

    let firstCharIdx = startIdx;
    if (startIdx === -1 && startBracketIdx !== -1) firstCharIdx = startBracketIdx;
    if (startIdx !== -1 && startBracketIdx !== -1) firstCharIdx = Math.min(startIdx, startBracketIdx);

    if (firstCharIdx !== -1) {
      const lastBraceIdx = jsonStr.lastIndexOf('}');
      const lastBracketIdx = jsonStr.lastIndexOf(']');

      let lastCharIdx = lastBraceIdx;
      if (lastBraceIdx === -1 && lastBracketIdx !== -1) lastCharIdx = lastBracketIdx;
      if (lastBraceIdx !== -1 && lastBracketIdx !== -1) lastCharIdx = Math.max(lastBraceIdx, lastBracketIdx);

      if (lastCharIdx !== -1) {
        jsonStr = jsonStr.substring(firstCharIdx, lastCharIdx + 1);
      }
    }
  }

  return jsonStr;
}

/**
 * Parses the AI response and ensures it is valid JSON matching the GeneratedWorksheet schema.
 * @param responseText The raw response text from the AI
 * @returns Parsed GeneratedWorksheet object
 */
export function parseAIResponse(responseText: string, finishReason?: string): GeneratedWorksheet {
  if (finishReason === 'length') {
    throw new Error(
      'The AI response was cut off before it finished (the worksheet content was too long for the configured limit). ' +
      'Try requesting fewer questions, a shorter answer format, or splitting the worksheet into two smaller ones.'
    );
  }

  try {
    const parsed = JSON.parse(extractJsonString(responseText));

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Parsed response is not an object');
    }

    if (!Array.isArray(parsed.questions)) {
      throw new Error('Parsed response missing questions array');
    }

    return parsed as GeneratedWorksheet;
  } catch (error) {
    console.error('Failed to parse AI response:', error, 'Raw response:', responseText);
    throw new Error('Failed to parse the AI generated worksheet. The response may be malformed.');
  }
}

/**
 * Parses the AI response and ensures it is valid JSON matching the GeneratedProject schema.
 * @param responseText The raw response text from the AI
 * @returns Parsed GeneratedProject object
 */
export function parseProjectAIResponse(responseText: string, finishReason?: string): GeneratedProject {
  if (finishReason === 'length') {
    throw new Error(
      'The AI response was cut off before it finished (the project content was too long for the configured limit). ' +
      'Try requesting a shorter project length.'
    );
  }

  try {
    const parsed = JSON.parse(extractJsonString(responseText));

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Parsed response is not an object');
    }

    if (!Array.isArray(parsed.sections)) {
      throw new Error('Parsed response missing sections array');
    }

    return {
      title: parsed.title,
      sections: parsed.sections,
      bibliography: Array.isArray(parsed.bibliography) ? parsed.bibliography : [],
    };
  } catch (error) {
    console.error('Failed to parse AI project response:', error, 'Raw response:', responseText);
    throw new Error('Failed to parse the AI generated project. The response may be malformed.');
  }
}
