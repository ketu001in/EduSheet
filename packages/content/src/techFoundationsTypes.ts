// Shared types for the AI Lab and Coding Lab sections of Tech Lab -- basic
// level for now (per explicit instruction: deep-dive Robotics first, keep
// AI/Coding foundational at this stage), but held to the same standard as
// everywhere else: real, verifiable content, not googleable trivia, and a
// genuine interactive tied to real logic where one exists.
export type TechFoundationLab = 'ai' | 'coding';
export type TechFoundationPlaygroundType = 'perceptron' | 'search-race' | 'none';

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
