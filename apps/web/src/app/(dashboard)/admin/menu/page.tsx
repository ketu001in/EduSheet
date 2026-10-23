'use client';
import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Trash2, Plus, Loader2, Eye, EyeOff, FolderPlus, Link2 } from 'lucide-react';
import {
  fetchRawNavItems, createNavItem, updateNavItem, deleteNavItem, reorderNavItems, RawNavItem,
} from '@/lib/navConfig';
import { ICON_NAMES, resolveIcon } from '@/lib/iconRegistry';

const ALL_ROLES = ['student', 'parent', 'teacher', 'admin'] as const;

// Full CRUD + reorder for the live nav_items table -- this IS the site's
// actual menu structure now (see navItems.ts's useNavItems() hook, CMS
// Phase 1), not a preview of one. Every save here changes what every user
// sees in the sidebar/drawer immediately.
export default function MenuManagerPage() {
  const [items, setItems] = useState<RawNavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetchRawNavItems()
      .then((res) => setItems(res.data.sort((a, b) => a.order_index - b.order_index)))
      .catch((err) => { console.error(err); setError('Could not load the menu.'); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const topLevel = items.filter((i) => !i.parent_group_id);
  const childrenOf = (groupId: string) => items.filter((i) => i.parent_group_id === groupId);

  const patch = async (id: string, changes: Partial<RawNavItem>) => {
    setSavingId(id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...changes } : i))); // optimistic
    try {
      await updateNavItem(id, {
        label: changes.label,
        href: changes.href,
        iconName: changes.icon_name,
        visible: changes.visible,
        roleVisibility: changes.role_visibility,
      });
    } catch (err) {
      console.error(err);
      load(); // revert to server truth on failure
    } finally {
      setSavingId(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this menu item? Any items inside it will be deleted too.')) return;
    try {
      await deleteNavItem(id);
      load();
    } catch (err) {
      console.error(err);
      alert('Could not delete.');
    }
  };

  const move = async (siblingGroup: RawNavItem[], id: string, direction: -1 | 1) => {
    const sorted = [...siblingGroup].sort((a, b) => a.order_index - b.order_index);
    const idx = sorted.findIndex((i) => i.id === id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx], b = sorted[swapIdx];
    const updates = [{ id: a.id, orderIndex: b.order_index }, { id: b.id, orderIndex: a.order_index }];
    setItems((prev) => prev.map((i) => {
      const u = updates.find((x) => x.id === i.id);
      return u ? { ...i, order_index: u.orderIndex } : i;
    }));
    try {
      await reorderNavItems(updates);
    } catch (err) {
      console.error(err);
      load();
    }
  };

  const addTopLevelLink = async () => {
    await createNavItem({ label: 'New Link', href: '/dashboard', iconName: 'Star', orderIndex: topLevel.length, roleVisibility: [...ALL_ROLES] });
    load();
  };
  const addGroup = async () => {
    await createNavItem({ label: 'New Group', iconName: 'Star', isGroup: true, orderIndex: topLevel.length, roleVisibility: [...ALL_ROLES] });
    load();
  };
  const addChildLink = async (parentId: string) => {
    await createNavItem({ label: 'New Item', href: '/dashboard', iconName: 'Star', parentGroupId: parentId, orderIndex: childrenOf(parentId).length, roleVisibility: [...ALL_ROLES] });
    load();
  };

  if (loading) return <div className="glass-card p-12 rounded-3xl text-center flex items-center justify-center gap-2 text-slate-400"><Loader2 className="w-5 h-5 animate-spin" /> Loading menu...</div>;
  if (error) return <div className="glass-card p-8 rounded-3xl text-center text-red-500 text-sm">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={addTopLevelLink} className="btn-brutal px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl text-sm flex items-center gap-2">
          <Link2 className="w-4 h-4" /> Add Link
        </button>
        <button onClick={addGroup} className="btn-brutal px-4 py-2.5 border-2 border-slate-200 dark:border-slate-800 font-bold rounded-xl text-sm flex items-center gap-2">
          <FolderPlus className="w-4 h-4" /> Add Group
        </button>
      </div>

      <div className="space-y-3">
        {topLevel.sort((a, b) => a.order_index - b.order_index).map((item) => (
          <div key={item.id} className="glass-card rounded-2xl p-4 space-y-3">
            <MenuRow
              item={item}
              saving={savingId === item.id}
              onPatch={(c) => patch(item.id, c)}
              onDelete={() => remove(item.id)}
              onMoveUp={() => move(topLevel, item.id, -1)}
              onMoveDown={() => move(topLevel, item.id, 1)}
            />
            {item.is_group && (
              <div className="ml-6 pl-4 border-l-2 border-slate-200 dark:border-slate-800 space-y-2">
                {childrenOf(item.id).sort((a, b) => a.order_index - b.order_index).map((child) => (
                  <MenuRow
                    key={child.id}
                    item={child}
                    saving={savingId === child.id}
                    onPatch={(c) => patch(child.id, c)}
                    onDelete={() => remove(child.id)}
                    onMoveUp={() => move(childrenOf(item.id), child.id, -1)}
                    onMoveDown={() => move(childrenOf(item.id), child.id, 1)}
                  />
                ))}
                <button onClick={() => addChildLink(item.id)} className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add item to this group
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuRow({ item, saving, onPatch, onDelete, onMoveUp, onMoveDown }: {
  item: RawNavItem;
  saving: boolean;
  onPatch: (changes: Partial<RawNavItem>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const Icon = resolveIcon(item.icon_name);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-col">
        <button onClick={onMoveUp} className="p-0.5 text-slate-400 hover:text-primary-600"><ArrowUp className="w-3.5 h-3.5" /></button>
        <button onClick={onMoveDown} className="p-0.5 text-slate-400 hover:text-primary-600"><ArrowDown className="w-3.5 h-3.5" /></button>
      </div>
      <select
        value={item.icon_name}
        onChange={(e) => onPatch({ icon_name: e.target.value })}
        className="rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-transparent p-1.5 text-xs w-9 shrink-0"
        title={item.icon_name}
      >
        {ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
      <Icon className="w-4 h-4 text-primary-600 shrink-0" />
      <input
        defaultValue={item.label}
        onBlur={(e) => e.target.value !== item.label && onPatch({ label: e.target.value })}
        className="rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-transparent px-2.5 py-1.5 text-sm font-bold flex-1 min-w-[120px]"
      />
      {!item.is_group && (
        <input
          defaultValue={item.href || ''}
          onBlur={(e) => e.target.value !== item.href && onPatch({ href: e.target.value })}
          placeholder="/path"
          className="rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-transparent px-2.5 py-1.5 text-xs font-mono flex-1 min-w-[100px]"
        />
      )}
      <div className="flex items-center gap-1 flex-wrap">
        {ALL_ROLES.map((r) => (
          <button
            key={r}
            onClick={() => onPatch({ role_visibility: item.role_visibility.includes(r) ? item.role_visibility.filter((x) => x !== r) : [...item.role_visibility, r] })}
            className={`px-1.5 py-1 rounded text-[9px] font-bold uppercase border ${item.role_visibility.includes(r) ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-400 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-800 text-slate-400'}`}
          >
            {r.slice(0, 3)}
          </button>
        ))}
      </div>
      <button onClick={() => onPatch({ visible: !item.visible })} className="p-1.5 text-slate-400 hover:text-primary-600" title={item.visible ? 'Visible -- click to hide' : 'Hidden -- click to show'}>
        {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>
      <button onClick={onDelete} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
      {saving && <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-500" />}
    </div>
  );
}
