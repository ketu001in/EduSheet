import { GeneratedWorksheet, GeneratedProject, GeneratedStudyMaterial, GeneratedActivitySheet, GeneratedTechProject, DiagramLabelPoint } from '../providers/base';

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

/**
 * Parses the AI response and ensures it is valid JSON matching the GeneratedStudyMaterial schema.
 * @param responseText The raw response text from the AI
 * @returns Parsed GeneratedStudyMaterial object
 */
export function parseStudyMaterialAIResponse(responseText: string, finishReason?: string): GeneratedStudyMaterial {
  if (finishReason === 'length') {
    throw new Error(
      'The AI response was cut off before it finished (the study material was too long for the configured limit). ' +
      'Try requesting fewer topics.'
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
      sections: parsed.sections
        .filter((s: any) => s && typeof s.heading === 'string' && typeof s.content === 'string')
        .map((s: any) => ({
          heading: s.heading,
          content: s.content,
          audience: s.audience === 'teacher' ? 'teacher' : 'student',
        })),
    };
  } catch (error) {
    console.error('Failed to parse AI study material response:', error, 'Raw response:', responseText);
    throw new Error('Failed to parse the AI generated study material. The response may be malformed.');
  }
}

/**
 * Parses the AI response and ensures it is valid JSON matching the GeneratedActivitySheet schema.
 * @param responseText The raw response text from the AI
 * @returns Parsed GeneratedActivitySheet object
 */
export function parseActivitySheetAIResponse(responseText: string, finishReason?: string): GeneratedActivitySheet {
  if (finishReason === 'length') {
    throw new Error(
      'The AI response was cut off before it finished (the activity sheet was too long for the configured limit). ' +
      'Try requesting fewer topics.'
    );
  }

  try {
    const parsed = JSON.parse(extractJsonString(responseText));

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Parsed response is not an object');
    }

    if (!Array.isArray(parsed.materials) || !Array.isArray(parsed.steps)) {
      throw new Error('Parsed response missing materials/steps arrays');
    }

    return {
      title: parsed.title,
      materials: parsed.materials.filter((m: any) => typeof m === 'string'),
      steps: parsed.steps.filter((s: any) => typeof s === 'string'),
      reflectionQuestions: Array.isArray(parsed.reflectionQuestions)
        ? parsed.reflectionQuestions.filter((q: any) => typeof q === 'string')
        : [],
      facilitationNotes: typeof parsed.facilitationNotes === 'string' ? parsed.facilitationNotes : '',
    };
  } catch (error) {
    console.error('Failed to parse AI activity sheet response:', error, 'Raw response:', responseText);
    throw new Error('Failed to parse the AI generated activity sheet. The response may be malformed.');
  }
}

/**
 * Parses the AI response and ensures it is valid JSON matching the GeneratedTechProject schema.
 * @param responseText The raw response text from the AI
 * @returns Parsed GeneratedTechProject object
 */
export function parseTechProjectAIResponse(responseText: string, finishReason?: string): GeneratedTechProject {
  if (finishReason === 'length') {
    throw new Error(
      'The AI response was cut off before it finished (the project was too long for the configured limit). ' +
      'Try a shorter/simpler project idea.'
    );
  }

  try {
    const parsed = JSON.parse(extractJsonString(responseText));

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Parsed response is not an object');
    }

    if (!Array.isArray(parsed.materials) || !Array.isArray(parsed.steps)) {
      throw new Error('Parsed response missing materials/steps arrays');
    }

    const steps = parsed.steps
      .filter((s: any) => s && typeof s.instruction === 'string')
      .map((s: any, i: number) => ({
        number: typeof s.number === 'number' ? s.number : i + 1,
        title: typeof s.title === 'string' ? s.title : `Step ${i + 1}`,
        instruction: s.instruction,
        imagePrompt: typeof s.imagePrompt === 'string' ? s.imagePrompt : undefined,
      }));

    const hw = parsed.hardwareUpgrade;
    const hardwareUpgrade = hw && typeof hw === 'object'
      ? {
          available: !!hw.available,
          items: Array.isArray(hw.items)
            ? hw.items
                .filter((it: any) => it && typeof it.name === 'string')
                .map((it: any) => ({
                  name: it.name,
                  purpose: typeof it.purpose === 'string' ? it.purpose : '',
                  approxCostINR: typeof it.approxCostINR === 'string' ? it.approxCostINR : undefined,
                }))
            : [],
          note: typeof hw.note === 'string' ? hw.note : undefined,
        }
      : undefined;

    const sim = parsed.simulationGuide;
    const simulationGuide = sim && typeof sim === 'object' && typeof sim.tool === 'string'
      ? {
          tool: sim.tool,
          toolUrl: typeof sim.toolUrl === 'string' ? sim.toolUrl : '',
          instructions: typeof sim.instructions === 'string' ? sim.instructions : '',
        }
      : undefined;

    return {
      title: parsed.title,
      purpose: typeof parsed.purpose === 'string' ? parsed.purpose : '',
      materials: parsed.materials.filter((m: any) => typeof m === 'string'),
      hardwareUpgrade,
      steps,
      simulationGuide,
      codeSnippet: typeof parsed.codeSnippet === 'string' ? parsed.codeSnippet : undefined,
      codeLanguage: typeof parsed.codeLanguage === 'string' ? parsed.codeLanguage : undefined,
      troubleshooting: Array.isArray(parsed.troubleshooting)
        ? parsed.troubleshooting
            .filter((t: any) => t && typeof t.issue === 'string')
            .map((t: any) => ({ issue: t.issue, fix: typeof t.fix === 'string' ? t.fix : '' }))
        : [],
      safetyNotes: Array.isArray(parsed.safetyNotes) ? parsed.safetyNotes.filter((s: any) => typeof s === 'string') : [],
      extensions: Array.isArray(parsed.extensions) ? parsed.extensions.filter((e: any) => typeof e === 'string') : [],
    };
  } catch (error) {
    console.error('Failed to parse AI tech project response:', error, 'Raw response:', responseText);
    throw new Error('Failed to parse the AI generated tech project. The response may be malformed.');
  }
}

/**
 * Parses a vision model's label-position response. Returns null (never
 * throws) on any malformed/unexpected shape -- this is a best-effort
 * verification step, so a parse failure must fall back to "unverified"
 * rather than take down worksheet generation.
 */
export function parseLabelPointsResponse(responseText: string, expectedLabels: string[]): DiagramLabelPoint[] | null {
  try {
    const parsed = JSON.parse(extractJsonString(responseText));
    const points = parsed?.labelPoints;
    if (!Array.isArray(points) || points.length !== expectedLabels.length) return null;

    const result: DiagramLabelPoint[] = [];
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const x = typeof p?.x === 'number' && Number.isFinite(p.x) ? Math.min(Math.max(p.x, 0), 100) : null;
      const y = typeof p?.y === 'number' && Number.isFinite(p.y) ? Math.min(Math.max(p.y, 0), 100) : null;
      if (x === null || y === null) return null;
      result.push({ x, y, label: expectedLabels[i] });
    }
    return result;
  } catch (error) {
    console.error('Failed to parse vision label-position response:', error, 'Raw response:', responseText);
    return null;
  }
}
