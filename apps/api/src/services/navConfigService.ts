import { supabaseAdmin } from '../lib/supabase';

// CMS Phase 1: the live, admin-editable main navigation. Replaces the
// previously hardcoded apps/web/src/components/layout/navItems.ts list --
// that file's shape (NavLink | NavGroup) is still what the web app
// ultimately renders; this service just assembles the same shape from the
// nav_items table instead of a static array.
export interface NavConfigItem {
  id: string;
  label: string;
  href: string | null;
  icon_name: string;
  is_group: boolean;
  parent_group_id: string | null;
  order_index: number;
  visible: boolean;
  role_visibility: string[];
}

// Flat rows -> nested groups, filtered to only what a given role can see,
// sorted by order_index at every level. Hidden (visible=false) items are
// dropped entirely rather than sent to the client and hidden client-side --
// no reason to leak a disabled nav item's existence over the wire.
export const buildNavTree = (rows: NavConfigItem[], role: string) => {
  const visible = rows.filter((r) => r.visible && r.role_visibility.includes(role));
  const topLevel = visible.filter((r) => !r.parent_group_id).sort((a, b) => a.order_index - b.order_index);
  return topLevel.map((item) => {
    if (!item.is_group) {
      return { type: 'link' as const, id: item.id, label: item.label, href: item.href, iconName: item.icon_name };
    }
    const children = visible
      .filter((c) => c.parent_group_id === item.id)
      .sort((a, b) => a.order_index - b.order_index)
      .map((c) => ({ type: 'link' as const, id: c.id, label: c.label, href: c.href, iconName: c.icon_name }));
    return { type: 'group' as const, id: item.id, label: item.label, iconName: item.icon_name, items: children };
  });
};

export const fetchNavConfigForRole = async (role: string) => {
  const { data, error } = await supabaseAdmin.from('nav_items').select('*').order('order_index');
  if (error) throw new Error(`Failed to load nav config: ${error.message}`);
  return buildNavTree((data || []) as NavConfigItem[], role);
};

export const fetchAllNavItemsRaw = async () => {
  const { data, error } = await supabaseAdmin.from('nav_items').select('*').order('order_index');
  if (error) throw new Error(`Failed to load nav items: ${error.message}`);
  return data;
};
