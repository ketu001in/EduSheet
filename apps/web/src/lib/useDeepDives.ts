'use client';
import { ALL_DEEP_DIVES, DeepDiveContent } from '@edusheets/content';
import { useContent } from './useContent';

// One CMS-backed content type ('topic-deep-dive') shared by every lab's
// "Explore" trigger -- see deepDive.ts's header for why this is a single
// universal system rather than a per-lab one. Wrapping useContent() here
// means every DeepDiveTrigger/TopicDeepDive instance across the whole app
// shares the exact same fetch-and-merge behaviour (including picking up
// live admin edits from /admin/content) without each call site needing to
// know the underlying content type string or the full static array.
export function useDeepDives(): DeepDiveContent[] {
  return useContent('topic-deep-dive', ALL_DEEP_DIVES);
}

export function useDeepDive(id: string | undefined | null): DeepDiveContent | undefined {
  const all = useDeepDives();
  return id ? all.find((d) => d.id === id) : undefined;
}
