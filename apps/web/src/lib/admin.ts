import { api } from './api';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  role: 'student' | 'parent' | 'teacher' | 'admin';
  created_at: string;
}

export interface AdminAnalytics {
  total_users: number;
  total_worksheets: number;
  total_projects: number;
}

export const fetchAdminUsers = () => api.get<{ success: boolean; data: AdminUser[] }>('/api/admin/users');
export const updateUserRole = (id: string, role: AdminUser['role']) =>
  api.patch<{ success: boolean; data: AdminUser }>(`/api/admin/users/${id}/role`, { role });
export const fetchAdminAnalytics = () => api.get<{ success: boolean; data: AdminAnalytics }>('/api/admin/analytics');
