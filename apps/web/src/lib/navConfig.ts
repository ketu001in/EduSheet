import { api } from './api';

// Client wrapper for the live, admin-editable nav config (CMS Phase 1).
// The shape returned by GET /api/nav-config already matches useNavItems()'s
// NavEntry union (see components/layout/navItems.ts) -- id is included so
// admin/menu can reference specific rows, but the rendering components
// ignore it.
export interface NavConfigLink {
  type: 'link';
  id: string;
  label: string;
  href: string | null;
  iconName: string;
}
export interface NavConfigGroup {
  type: 'group';
  id: string;
  label: string;
  iconName: string;
  items: NavConfigLink[];
}
export type NavConfigEntry = NavConfigLink | NavConfigGroup;

export const fetchNavConfig = () => api.get<{ success: boolean; data: NavConfigEntry[] }>('/api/nav-config');

export interface RawNavItem {
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

export const fetchRawNavItems = () => api.get<{ success: boolean; data: RawNavItem[] }>('/api/nav-config/raw');

export interface NavItemInput {
  label?: string;
  href?: string | null;
  iconName?: string;
  isGroup?: boolean;
  parentGroupId?: string | null;
  orderIndex?: number;
  visible?: boolean;
  roleVisibility?: string[];
}

export const createNavItem = (input: NavItemInput) => api.post<{ success: boolean; data: RawNavItem }>('/api/nav-config', input);
export const updateNavItem = (id: string, input: NavItemInput) => api.put<{ success: boolean; data: RawNavItem }>(`/api/nav-config/${id}`, input);
export const deleteNavItem = (id: string) => api.del<{ success: boolean }>(`/api/nav-config/${id}`);
export const reorderNavItems = (items: { id: string; orderIndex: number }[]) =>
  api.put<{ success: boolean }>('/api/nav-config/reorder', { items });
