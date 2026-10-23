'use client';
import { useEffect, useState } from 'react';
import { fetchContentOverrides } from './contentOverrides';

// CMS Phase 2's generic content hook: fetches any admin overrides for
// `contentType` and merges them over `staticItems` (the hand-authored,
// verified base data every lab already imports from @edusheets/content).
// An override with an item_key matching a static item's `id` replaces that
// item's fields; deleted=true hides it; an override whose item_key matches
// nothing static is a brand-new admin-created item, appended at the end.
// Falls back to the static array untouched on any fetch failure -- a CMS
// outage should never take down the actual learning content.
export function useContent<T extends { id: string }>(contentType: string, staticItems: T[]): T[] {
  const [merged, setMerged] = useState<T[]>(staticItems);

  useEffect(() => {
    let cancelled = false;
    fetchContentOverrides(contentType)
      .then((res) => {
        if (cancelled) return;
        const overrides = res.data;
        const deletedKeys = new Set(overrides.filter((o) => o.deleted).map((o) => o.item_key));
        const overrideMap = new Map(overrides.filter((o) => !o.deleted && o.data).map((o) => [o.item_key, o.data as Partial<T>]));

        const result: T[] = [];
        for (const item of staticItems) {
          if (deletedKeys.has(item.id)) continue;
          const override = overrideMap.get(item.id);
          result.push(override ? { ...item, ...override } : item);
          overrideMap.delete(item.id);
        }
        for (const data of overrideMap.values()) result.push(data as T);
        setMerged(result);
      })
      .catch(() => { /* keep the static items -- a CMS fetch failure shouldn't break the lab */ });
    return () => { cancelled = true; };
  }, [contentType, staticItems]);

  return merged;
}
