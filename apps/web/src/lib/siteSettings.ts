import { api } from './api';

export interface BrandingSettings {
  siteName: string;
  tagline: string;
  primaryColor: string; // empty string = use the built-in default
  logoUrl: string; // empty string = use the built-in Logo component
}

export interface VoiceSettings {
  preferredVoiceNameHint: string; // empty string = use speech.ts's own heuristic
}

export interface SiteSettingsMap {
  branding?: BrandingSettings;
  voice?: VoiceSettings;
}

export const fetchSiteSettings = () => api.get<{ success: boolean; data: SiteSettingsMap }>('/api/site-settings');

export const updateSiteSetting = (key: string, value: Record<string, unknown>) =>
  api.put<{ success: boolean; data: { key: string; value: unknown } }>(`/api/site-settings/${key}`, { value });
