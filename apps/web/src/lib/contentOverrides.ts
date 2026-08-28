import { api } from './api';

export interface ContentOverrideRow {
  id: string;
  content_type: string;
  item_key: string;
  data: Record<string, unknown> | null;
  deleted: boolean;
  updated_at: string;
}

export const fetchContentOverrides = (contentType: string) =>
  api.get<{ success: boolean; data: ContentOverrideRow[] }>(`/api/content/${contentType}`);

export const upsertContentOverride = (contentType: string, itemKey: string, data: Record<string, unknown>) =>
  api.put<{ success: boolean; data: ContentOverrideRow }>(`/api/content/${contentType}/${encodeURIComponent(itemKey)}`, { data });

export const hideContentItem = (contentType: string, itemKey: string) =>
  api.post<{ success: boolean; data: ContentOverrideRow }>(`/api/content/${contentType}/${encodeURIComponent(itemKey)}/hide`);

export const revertContentOverride = (contentType: string, itemKey: string) =>
  api.del<{ success: boolean }>(`/api/content/${contentType}/${encodeURIComponent(itemKey)}`);
