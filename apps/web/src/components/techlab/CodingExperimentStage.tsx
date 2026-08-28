'use client';
import dynamic from 'next/dynamic';
import { CodingExperimentPlaygroundType } from '@edusheets/content';

// Coding Lab's Hands-On Experiments dispatcher -- mirrors
// RoboticsExperimentStage.tsx / AIExperimentStage.tsx. Every scene is
// dynamically imported (ssr:false) so Blockly (a genuinely large
// library) and the others only download when a visitor actually opens
// one of these experiments.
const dyn = (loader: () => Promise<{ default: React.ComponentType<any> }>) => dynamic(loader, {
  ssr: false,
  loading: () => <div className="w-full h-64 rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});

const BlockCodingStudioScene = dyn(() => import('@/components/techlab/BlockCodingStudio'));
const SortingRace = dyn(() => import('@/components/techlab/SortingRaceScene'));
const RecursionVisualizer = dyn(() => import('@/components/techlab/RecursionVisualizerScene'));
const DataStructurePlayground = dyn(() => import('@/components/techlab/DataStructurePlaygroundScene'));
const CaesarCipher = dyn(() => import('@/components/techlab/CaesarCipherScene'));
const NumberSystem = dyn(() => import('@/components/techlab/NumberSystemScene'));

export default function CodingExperimentStage({ type }: { type: CodingExperimentPlaygroundType }) {
  switch (type) {
    case 'block-coding-studio': return <BlockCodingStudioScene />;
    case 'sorting-race': return <SortingRace />;
    case 'recursion-visualizer': return <RecursionVisualizer />;
    case 'data-structure-playground': return <DataStructurePlayground />;
    case 'caesar-cipher': return <CaesarCipher />;
    case 'number-system-converter': return <NumberSystem />;
    default: return null;
  }
}
