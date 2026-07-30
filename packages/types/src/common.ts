export type FavoriteType = 'topic' | 'chapter' | 'worksheet';

export interface Favorite {
  id: string;
  user_id: string;
  entity_type: FavoriteType;
  entity_id: string;
  created_at: Date | string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link?: string;
  created_at: Date | string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  page: number;
  limit: number;
  total: number;
}

export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  page?: number;
  limit?: number;
}
