'use client';
import { useEffect, useState } from 'react';
import { Loader2, Save, Volume2 } from 'lucide-react';
import { fetchSiteSettings, updateSiteSetting, BrandingSettings, VoiceSettings } from '@/lib/siteSettings';
import { isSpeechSupported, speak } from '@/lib/speech';

const DEFAULT_BRANDING: BrandingSettings = { siteName: "Bosket's EDStudio", tagline: 'AI Study Companion', primaryColor: '', logoUrl: '' };
const DEFAULT_VOICE: VoiceSettings = { preferredVoiceNameHint: '' };

export default function SiteSettingsPage() {
  const [branding, setBranding] = useState<BrandingSettings>(DEFAULT_BRANDING);
  const [voice, setVoice] = useState<VoiceSettings>(DEFAULT_VOICE);
  const [loading, setLoading] = useState(true);
  const [savingBranding, setSavingBranding] = useState(false);
  const [savingVoice, setSavingVoice] = useState(false);
  const [saved, setSaved] = useState<'branding' | 'voice' | null>(null);
  const [availableVoices, setAvailableVoices] = useState<string[]>([]);

  useEffect(() => {
    fetchSiteSettings()
      .then((res) => {
        if (res.data.branding) setBranding({ ...DEFAULT_BRANDING, ...res.data.branding });
        if (res.data.voice) setVoice({ ...DEFAULT_VOICE, ...res.data.voice });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    if (isSpeechSupported()) {
      const load = () => setAvailableVoices(Array.from(new Set(window.speechSynthesis.getVoices().map((v) => v.name))).sort());
      load();
      window.speechSynthesis.addEventListener('voiceschanged', load);
      return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
    }
  }, []);

  const saveBranding = async () => {
    setSavingBranding(true);
    try {
      await updateSiteSetting('branding', branding as unknown as Record<string, unknown>);
      setSaved('branding');
      setTimeout(() => setSaved(null), 2000);
    } catch (err) {
      console.error(err);
      alert('Could not save branding.');
    } finally {
      setSavingBranding(false);
    }
  };

  const saveVoice = async () => {
    setSavingVoice(true);
    try {
      await updateSiteSetting('voice', voice as unknown as Record<string, unknown>);
      setSaved('voice');
      setTimeout(() => setSaved(null), 2000);
    } catch (err) {
      console.error(err);
      alert('Could not save voice preference.');
    } finally {
      setSavingVoice(false);
    }
  };

  if (loading) return <div className="glass-card p-12 rounded-3xl text-center flex items-center justify-center gap-2 text-slate-400"><Loader2 className="w-5 h-5 animate-spin" /> Loading settings...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <h2 className="font-bold text-lg">Branding</h2>
        <p className="text-xs text-slate-400">Changes apply site-wide, including the sidebar header and browser tab.</p>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Site Name</label>
            <input value={branding.siteName} onChange={(e) => setBranding((b) => ({ ...b, siteName: e.target.value }))} className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent p-2.5 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Tagline</label>
            <input value={branding.tagline} onChange={(e) => setBranding((b) => ({ ...b, tagline: e.target.value }))} className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent p-2.5 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Primary Color (hex, blank = default)</label>
            <div className="flex items-center gap-2">
              <input value={branding.primaryColor} onChange={(e) => setBranding((b) => ({ ...b, primaryColor: e.target.value }))} placeholder="#7c3aed" className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent p-2.5 text-sm font-mono" />
              {branding.primaryColor && <span className="w-8 h-8 rounded-lg border-2 border-slate-900 dark:border-slate-700 shrink-0" style={{ backgroundColor: branding.primaryColor }} />}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Logo URL (blank = default logo)</label>
            <input value={branding.logoUrl} onChange={(e) => setBranding((b) => ({ ...b, logoUrl: e.target.value }))} placeholder="https://..." className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent p-2.5 text-sm" />
          </div>
        </div>
        <button onClick={saveBranding} disabled={savingBranding} className="btn-brutal px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm flex items-center gap-2">
          {savingBranding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Branding {saved === 'branding' && '-- Saved!'}
        </button>
      </div>

      <div className="glass-card rounded-3xl p-6 space-y-4">
        <h2 className="font-bold text-lg flex items-center gap-2"><Volume2 className="w-5 h-5 text-primary-600" /> Voice Narration</h2>
        <p className="text-xs text-slate-400">Sets the preferred voice for every &ldquo;Listen&rdquo; button across the site. The exact voice list depends on YOUR browser/OS -- pick one available to you, and visitors will get the closest match their own browser offers, falling back to the site&apos;s normal auto-pick if that name isn&apos;t available for them.</p>
        {availableVoices.length === 0 ? (
          <p className="text-xs text-amber-600">No voices detected in this browser yet -- try again in a moment, or leave this blank to keep the site's automatic voice selection.</p>
        ) : (
          <select
            value={voice.preferredVoiceNameHint}
            onChange={(e) => setVoice({ preferredVoiceNameHint: e.target.value })}
            className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent p-2.5 text-sm"
          >
            <option value="">(Automatic -- let the site pick the best available voice)</option>
            {availableVoices.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        )}
        <div className="flex items-center gap-2">
          <button onClick={saveVoice} disabled={savingVoice} className="btn-brutal px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm flex items-center gap-2">
            {savingVoice ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Voice {saved === 'voice' && '-- Saved!'}
          </button>
          {voice.preferredVoiceNameHint && (
            <button
              onClick={() => speak('This is what the selected voice sounds like.')}
              className="px-4 py-2.5 border-2 border-slate-200 dark:border-slate-800 font-bold rounded-xl text-sm"
            >
              Preview
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
