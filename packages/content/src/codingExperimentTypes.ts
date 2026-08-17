// Shared types for Coding Lab's "Hands-On Experiments Laboratory" tab --
// same move as Robotics Lab and AI Lab: the existing Knowledge Base
// content, however real, is still a knowledgebase with one search-race
// widget in it. This is the actual lab -- a real drag-and-drop
// programming environment (Google Blockly, generating and running real
// JavaScript/Python), a real sorting-algorithm race, a real recursion
// visualizer, and a real data-structure playground. gradeBands is the
// primary filter here (rather than a single beginner/intermediate/
// advanced difficulty) because the explicit goal of this pass was
// covering every school stage, not just ramping difficulty within one
// audience.
export type CodingExperimentCategory = 'visual-programming' | 'algorithms' | 'data-structures';
export type GradeBand = 'junior' | 'middle' | 'senior' | 'plusTwo';
export type CodingExperimentPlaygroundType =
  | 'block-coding-studio'
  | 'sorting-race'
  | 'recursion-visualizer'
  | 'data-structure-playground';

export interface CodingExperiment {
  id: string;
  category: CodingExperimentCategory;
  name: string;
  tagline: string;
  overview: string;
  whatYoullDo: string[];
  realWorldTieIn: string;
  gradeBands: GradeBand[];
  playgroundType: CodingExperimentPlaygroundType;
}
