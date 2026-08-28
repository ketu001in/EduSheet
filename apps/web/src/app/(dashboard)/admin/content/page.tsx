'use client';
import { useEffect, useMemo, useState } from 'react';
import { Loader2, Save, RotateCcw, EyeOff, Eye, Plus, PencilLine, Sparkles } from 'lucide-react';
import { CONTENT_TYPE_REGISTRY } from '@/lib/contentTypeRegistry';
import { fetchContentOverrides, upsertContentOverride, hideContentItem, revertContentOverride, ContentOverrideRow } from '@/lib/contentOverrides';

// The generic Content Manager -- CMS Phase 2. Works for ANY content type
// registered in contentTypeRegistry.ts without a bespoke form: static item
// or existing override loads into a raw JSON editor, saved back as an
// override row. This trades a nicer per-field form (which would mean
// building and maintaining a separate UI for every content shape in the
// app -- dozens of them) for genuine "edit anything" coverage today. A
// friendlier structured form for the highest-traffic types is a reasonable
// later refinement once this proves out, not a blocker to shipping it.
export default function ContentManagerPage() {
  const [typeId, setTypeId] = useState(CONTENT_TYPE_REGISTRY[0].id);
  const typeDef = CONTENT_TYPE_REGISTRY.find((t) => t.id === typeId) || CONTENT_TYPE_REGISTRY[0];

  const [overrides, setOverrides] = useState<ContentOverrideRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [draftJson, setDraftJson] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [addingNew, setAddingNew] = useState(false);
  const [newKey, setNewKey] = useState('');

  const load = (type: string) => {
    setLoading(true);
    setSelectedKey(null);
    fetchContentOverrides(type)
      .then((res) => setOverrides(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };
  useEffect(() => load(typeId), [typeId]);

  const overrideMap = useMemo(() => new Map(overrides.map((o) => [o.item_key, o])), [overrides]);

  const rows = useMemo(() => {
    const staticRows = typeDef.items.map((item) => {
      const ov = overrideMap.get(item.id);
      return {
        key: item.id,
        status: ov?.deleted ? 'hidden' as const : ov ? 'edited' as const : 'original' as const,
        preview: (ov?.deleted ? item : { ...item, ...(ov?.data || {}) }) as Record<string, unknown>,
      };
    });
    const newRows = overrides
      .filter((o) => !o.deleted && o.data && !typeDef.items.some((i) => i.id === o.item_key))
      .map((o) => ({ key: o.item_key, status: 'new' as const, preview: o.data as Record<string, unknown> }));
    return [...staticRows, ...newRows];
  }, [typeDef, overrides, overrideMap]);

  const openItem = (key: string) => {
    setSelectedKey(key);
    setAddingNew(false);
    setJsonError(null);
    const row = rows.find((r) => r.key === key);
    setDraftJson(JSON.stringify(row?.preview ?? {}, null, 2));
  };

  const startAddNew = () => {
    setAddingNew(true);
    setSelectedKey(null);
    setNewKey('');
    setJsonError(null);
    setDraftJson(JSON.stringify({ id: 'new-item-id' }, null, 2));
  };

  const save = async (key: string) => {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(draftJson);
    } catch {
      setJsonError('That\'s not valid JSON -- check for a missing comma or quote.');
      return;
    }
    setJsonError(null);
    setSaving(true);
    try {
      await upsertContentOverride(typeId, key, parsed);
      load(typeId);
      setAddingNew(false);
      setSelectedKey(key);
    } catch (err: any) {
      setJsonError(err?.message || 'Could not save.');
    } finally {
      setSaving(false);
    }
  };

  const revert = async (key: string) => {
    if (!confirm('Revert this item back to its original, un-edited content?')) return;
    await revertContentOverride(typeId, key);
    load(typeId);
  };

  const toggleHide = async (key: string, currentlyHidden: boolean) => {
    if (currentlyHidden) {
      await revertContentOverride(typeId, key);
    } else {
      await hideContentItem(typeId, key);
    }
    load(typeId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4">
      <div className="space-y-3">
        <select
          value={typeId}
          onChange={(e) => setTypeId(e.target.value)}
          className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent p-2.5 text-sm font-bold"
        >
          {CONTENT_TYPE_REGISTRY.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
        <button onClick={startAddNew} className="w-full btn-brutal px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Add New Item
        </button>

        {loading ? (
          <div className="p-8 text-center text-slate-400"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
        ) : (
          <div className="glass-card rounded-2xl divide-y divide-slate-100 dark:divide-slate-800 max-h-[60vh] overflow-y-auto">
            {rows.map((row) => (
              <button
                key={row.key}
                onClick={() => openItem(row.key)}
                className={`w-full text-left p-3 flex items-center justify-between gap-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 ${selectedKey === row.key ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
              >
                <span className={`truncate ${row.status === 'hidden' ? 'line-through text-slate-400' : ''}`}>
                  {(row.preview.name || row.preview.title || row.preview.transliteration || row.key) as string}
                </span>
                {row.status === 'edited' && <PencilLine className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                {row.status === 'hidden' && <EyeOff className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                {row.status === 'new' && <Sparkles className="w-3.5 h-3.5 text-accent-500 shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="glass-card rounded-3xl p-5 space-y-4">
        {addingNew ? (
          <>
            <h3 className="font-bold text-sm">New Item</h3>
            <p className="text-xs text-slate-400">Give it a unique key (used as its <code>id</code> everywhere it's referenced) and fill in the full JSON object. Check an existing item of this type for which fields it needs.</p>
            <input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="unique-item-key"
              className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent p-2.5 text-sm font-mono"
            />
            <textarea
              value={draftJson}
              onChange={(e) => setDraftJson(e.target.value)}
              rows={16}
              className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-50 dark:bg-slate-950 p-3 text-xs font-mono"
              spellCheck={false}
            />
            {jsonError && <p className="text-xs text-red-500">{jsonError}</p>}
            <button
              onClick={() => newKey.trim() && save(newKey.trim())}
              disabled={saving || !newKey.trim()}
              className="btn-brutal px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Create
            </button>
          </>
        ) : selectedKey ? (
          <>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="font-bold text-sm font-mono">{selectedKey}</h3>
              <div className="flex items-center gap-2">
                {overrideMap.has(selectedKey) && (
                  <button onClick={() => revert(selectedKey)} className="text-xs font-bold text-slate-500 hover:text-primary-600 flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> Revert to Original</button>
                )}
                <button onClick={() => toggleHide(selectedKey, overrideMap.get(selectedKey)?.deleted || false)} className="text-xs font-bold text-slate-500 hover:text-primary-600 flex items-center gap-1">
                  {overrideMap.get(selectedKey)?.deleted ? <><Eye className="w-3.5 h-3.5" /> Unhide</> : <><EyeOff className="w-3.5 h-3.5" /> Hide</>}
                </button>
              </div>
            </div>
            <textarea
              value={draftJson}
              onChange={(e) => setDraftJson(e.target.value)}
              rows={20}
              className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-50 dark:bg-slate-950 p-3 text-xs font-mono"
              spellCheck={false}
            />
            {jsonError && <p className="text-xs text-red-500">{jsonError}</p>}
            <button
              onClick={() => save(selectedKey)}
              disabled={saving}
              className="btn-brutal px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
            </button>
          </>
        ) : (
          <p className="text-sm text-slate-400 text-center py-12">Pick an item from the list to edit it, or add a new one.</p>
        )}
      </div>
    </div>
  );
}
