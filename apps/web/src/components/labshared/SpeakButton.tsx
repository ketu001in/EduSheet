'use client';
import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speak, stopSpeaking, isSpeechSupported } from '@/lib/speech';

// A small, reusable "Listen" toggle -- speaks the given text aloud via the
// Web Speech API and turns into a "Stop" button while speaking. Renders
// nothing if the browser has no speech synthesis support at all. Used
// throughout Biology Lab (hub, guided flow, playground, Anatomy Explorer,
// equipment popups) so every block of explanatory text gets a one-click
// narration option, not just the hotspot/equipment-click narration that
// existed before. Generic enough to reuse in any other lab too.
export default function SpeakButton({ text, label = 'Listen', className = '' }: { text: string; label?: string; className?: string }) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(isSpeechSupported());
    return () => { stopSpeaking(); };
  }, []);

  if (!supported || !text.trim()) return null;

  const toggle = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    speak(text, { onStart: () => setSpeaking(true), onEnd: () => setSpeaking(false) });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 shrink-0 text-xs font-bold rounded-full px-3 py-1.5 border-2 transition-all ${
        speaking
          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
          : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary-400 hover:text-primary-600'
      } ${className}`}
    >
      {speaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      {speaking ? 'Stop' : label}
    </button>
  );
}
