import { create } from 'zustand';

export interface WorksheetSettings {
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questionTypes: string[];
  includeHints: boolean;
  includeExplanations: boolean;
}

interface WizardState {
  currentStep: number;

  selectedBoardId: string | null;
  selectedBoard: string | null;

  selectedClassId: string | null;
  selectedClass: string | null;

  selectedSubjectId: string | null;
  selectedSubject: string | null;

  selectedChapterId: string | null;
  selectedChapter: string | null;

  selectedTopicIds: string[];
  selectedTopics: string[];

  worksheetSettings: WorksheetSettings;

  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setField: (field: string, value: any) => void;
  setSettings: (settings: Partial<WorksheetSettings>) => void;
}

const defaultSettings: WorksheetSettings = {
  questionCount: 10,
  difficulty: 'medium',
  questionTypes: ['mcq'],
  includeHints: false,
  includeExplanations: true,
};

const initialSelection = {
  selectedBoardId: null,
  selectedBoard: null,
  selectedClassId: null,
  selectedClass: null,
  selectedSubjectId: null,
  selectedSubject: null,
  selectedChapterId: null,
  selectedChapter: null,
  selectedTopicIds: [],
  selectedTopics: [],
};

export const useWizardStore = create<WizardState>((set) => ({
  currentStep: 1,
  ...initialSelection,
  worksheetSettings: defaultSettings,
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  reset: () =>
    set({
      currentStep: 1,
      ...initialSelection,
      worksheetSettings: defaultSettings,
    }),
  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  setSettings: (settings) =>
    set((state) => ({
      worksheetSettings: { ...state.worksheetSettings, ...settings },
    })),
}));
