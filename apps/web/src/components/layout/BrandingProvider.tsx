'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { fetchSiteSettings, BrandingSettings } from '@/lib/siteSettings';
import { applyBrandColor } from '@/lib/applyBranding';
import { setPreferredVoiceHint } from '@/lib/speech';

const DEFAULT_BRANDING: BrandingSettings = { siteName: "Bosket's EDStudio", tagline: 'AI Study Companion', primaryColor: '', logoUrl: '' };

const BrandingContext = createContext<BrandingSettings>(DEFAULT_BRANDING);

// CMS Phase 1: fetches site_settings ONCE per authenticated session and
// (a) provides {siteName, tagline, logoUrl} to any component that wants to
// stop hardcoding those strings (Sidebar, MobileMenu today), and
// (b) applies the two side effects that aren't really "React state" at all
// -- the brand color CSS variables (see lib/applyBranding.ts) and the
// preferred-voice hint (see lib/speech.ts) -- as soon as the settings
// arrive. Scoped to the authenticated (dashboard) layout only for this
// pass; the public marketing pages (landing/privacy/contact) keep their
// static branding for now.
export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [branding, setBranding] = useState<BrandingSettings>(DEFAULT_BRANDING);

  useEffect(() => {
    fetchSiteSettings()
      .then((res) => {
        const b = { ...DEFAULT_BRANDING, ...(res.data.branding || {}) };
        setBranding(b);
        if (b.primaryColor) applyBrandColor(b.primaryColor);
        const voiceHint = res.data.voice?.preferredVoiceNameHint;
        if (voiceHint) setPreferredVoiceHint(voiceHint);
      })
      .catch(() => { /* keep built-in defaults -- a settings-fetch failure shouldn't break the app shell */ });
  }, []);

  return <BrandingContext.Provider value={branding}>{children}</BrandingContext.Provider>;
}

export function useBranding(): BrandingSettings {
  return useContext(BrandingContext);
}
