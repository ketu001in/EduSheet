// Shared types for Coding Lab (AI Lab was promoted to its own dedicated
// system -- see aiTypes.ts -- once it needed real sections, history, and
// an applications gallery). Still held to the same standard as
// everywhere else: real, verifiable content, not googleable trivia, and a
// genuine interactive tied to real logic where one exists.
export type TechFoundationLab = 'coding';
export type TechFoundationPlaygroundType = 'search-race' | 'none';

export interface TechFoundationConcept {
  id: string;
  lab: TechFoundationLab;
  name: string;
  tagline: string;
  overview: string;
  howItWorks: string[];
  keyFacts: string[];
  realExamples: string[];
  playgroundType: TechFoundationPlaygroundType;
}
