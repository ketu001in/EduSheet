import { createClient } from './supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function getAuthHeader(): Promise<Record<string, string>> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
}

export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...authHeader, ...options?.headers },
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const parsed = JSON.parse(text);
      message = parsed?.error || text;
    } catch {
      // response wasn't JSON, use raw text
    }
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => apiClient<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, data?: any, options?: RequestInit) =>
    apiClient<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
  patch: <T>(endpoint: string, data?: any, options?: RequestInit) =>
    apiClient<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data?: any, options?: RequestInit) =>
    apiClient<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  del: <T>(endpoint: string, options?: RequestInit) => apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
};
