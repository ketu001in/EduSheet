import { api } from './api';

export type TechProjectCategory = 'robotics' | 'ai' | 'coding';

export interface TechProjectHardwareItem {
  name: string;
  purpose: string;
  approxCostINR?: string;
}

export interface TechProjectHardwareUpgrade {
  available: boolean;
  items: TechProjectHardwareItem[];
  note?: string;
}

export interface TechProjectStep {
  number: number;
  title: string;
  instruction: string;
  imagePrompt?: string;
  imageUrl?: string;
}

export interface TechProjectSimulationGuide {
  tool: string;
  toolUrl: string;
  instructions: string;
}

export interface TechProjectTroubleshootingItem {
  issue: string;
  fix: string;
}

export interface TechProjectSummary {
  id: string;
  title: string;
  category: TechProjectCategory;
  idea_prompt: string;
  created_at: string;
  classes?: { name: string } | null;
  boards?: { name: string } | null;
}

export interface TechProjectDetail extends TechProjectSummary {
  purpose: string;
  materials: string[];
  hardware_upgrade?: TechProjectHardwareUpgrade | null;
  steps: TechProjectStep[];
  simulation_guide?: TechProjectSimulationGuide | null;
  code_snippet?: string | null;
  code_language?: string | null;
  troubleshooting: TechProjectTroubleshootingItem[];
  safety_notes: string[];
  extensions: string[];
}

export interface GenerateTechProjectInput {
  title?: string;
  boardId?: string;
  board?: string;
  classId: string;
  className: string;
  category: TechProjectCategory;
  ideaPrompt: string;
  language?: string;
}

export interface GeneratedTechProjectResult {
  title: string;
  purpose: string;
  materials: string[];
  hardwareUpgrade?: TechProjectHardwareUpgrade;
  steps: TechProjectStep[];
  simulationGuide?: TechProjectSimulationGuide;
  codeSnippet?: string;
  codeLanguage?: string;
  troubleshooting: TechProjectTroubleshootingItem[];
  safetyNotes: string[];
  extensions: string[];
}

export const generateTechProject = (input: GenerateTechProjectInput) =>
  api.post<{ success: boolean; data: { project: { id: string; title: string; pdfStoragePath: string | null }; generated: GeneratedTechProjectResult } }>(
    '/api/tech-projects/generate',
    input
  );

export const fetchTechProjects = () => api.get<{ success: boolean; data: TechProjectSummary[] }>('/api/tech-projects');

export const fetchTechProject = (id: string) => api.get<{ success: boolean; data: TechProjectDetail }>(`/api/tech-projects/${id}`);

export const deleteTechProject = (id: string) => api.del<{ success: boolean }>(`/api/tech-projects/${id}`);

// Same "open tab synchronously" popup-blocker workaround as lib/activitySheet.ts's downloadActivitySheetPdf.
export async function downloadTechProjectPdf(id: string) {
  const tab = window.open('', '_blank', 'noopener,noreferrer');
  try {
    const res = await api.get<{ success: boolean; url: string }>(`/api/tech-projects/${id}/pdf`);
    if (tab) tab.location.href = res.url;
    else window.open(res.url, '_blank', 'noopener,noreferrer');
  } catch (err) {
    tab?.close();
    throw err;
  }
}

export const regenerateTechProjectPdf = (id: string) =>
  api.post<{ success: boolean; data: { pdfStoragePath: string } }>(`/api/tech-projects/${id}/regenerate-pdf`);

export const CATEGORY_LABEL: Record<TechProjectCategory, string> = {
  robotics: 'Robotics',
  ai: 'Artificial Intelligence',
  coding: 'Coding',
};

function isDetail(content: GeneratedTechProjectResult | TechProjectDetail): content is TechProjectDetail {
  return 'hardware_upgrade' in content || 'simulation_guide' in content || 'code_snippet' in content || 'safety_notes' in content;
}

export function techProjectToMarkdown(content: GeneratedTechProjectResult | TechProjectDetail): string {
  // Normalize both shapes (the freshly-generated camelCase result and the
  // saved snake_case DB row) to one common shape up front, rather than
  // branching field-by-field below -- keeps TS's control-flow narrowing simple.
  const normalized = isDetail(content)
    ? {
        hardwareUpgrade: content.hardware_upgrade ?? undefined,
        simulationGuide: content.simulation_guide ?? undefined,
        codeSnippet: content.code_snippet ?? undefined,
        codeLanguage: content.code_language ?? undefined,
        safetyNotes: content.safety_notes,
      }
    : {
        hardwareUpgrade: content.hardwareUpgrade,
        simulationGuide: content.simulationGuide,
        codeSnippet: content.codeSnippet,
        codeLanguage: content.codeLanguage,
        safetyNotes: content.safetyNotes,
      };

  const steps = content.steps;
  const lines = [`# ${content.title}`, '', '## Purpose & Core Idea', '', content.purpose, '', '## What You\'ll Need', ''];
  content.materials.forEach((m) => lines.push(`- [ ] ${m}`));

  const hw = normalized.hardwareUpgrade;
  if (hw?.available && hw.items.length > 0) {
    lines.push('', '## Optional Hardware Upgrade (not required)', '');
    hw.items.forEach((i) => lines.push(`- **${i.name}**${i.approxCostINR ? ` (~${i.approxCostINR})` : ''} — ${i.purpose}`));
    if (hw.note) lines.push('', hw.note);
  }

  lines.push('', '## Step-by-Step Build', '');
  steps.forEach((s) => lines.push(`${s.number}. **${s.title}** — ${s.instruction}`));

  const sim = normalized.simulationGuide;
  if (sim) {
    lines.push('', '## Try It in Simulation', '', `**${sim.tool}** — ${sim.toolUrl}`, '', sim.instructions);
  }

  const codeSnippet = normalized.codeSnippet;
  const codeLanguage = normalized.codeLanguage;
  if (codeSnippet) {
    lines.push('', '## Code', '', `\`\`\`${codeLanguage || ''}`, codeSnippet, '```');
  }

  if (content.troubleshooting.length > 0) {
    lines.push('', '## Troubleshooting', '');
    content.troubleshooting.forEach((t) => lines.push(`- **${t.issue}** — ${t.fix}`));
  }

  const safetyNotes = normalized.safetyNotes;
  if (safetyNotes?.length > 0) {
    lines.push('', '## Safety Notes', '');
    safetyNotes.forEach((n) => lines.push(`- ${n}`));
  }

  if (content.extensions.length > 0) {
    lines.push('', '## Go Further', '');
    content.extensions.forEach((e) => lines.push(`- ${e}`));
  }

  return lines.join('\n');
}
