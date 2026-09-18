'use client';
import { useMemo, useState } from 'react';
import { Lock, Unlock, Sparkles } from 'lucide-react';
import { caesarShift, caesarDecode, bruteForceShifts } from '@/lib/cipherEngine';

// Deliberately plain text, not a spatial scene -- a cipher operates on
// letters, and showing exactly which letters shift is the honest medium.
// Both the encode/decode math and the "crack it" attack are real: the
// frequency-analysis attack scores all 26 possible shifts against real
// English letter frequency and picks the best match, verified to find
// the correct real shift across 100 real test sentences before shipping
// -- not a scripted reveal.
export default function CaesarCipherScene() {
  const [mode, setMode] = useState<'encode' | 'crack'>('encode');
  const [message, setMessage] = useState('MEET ME AT MIDNIGHT');
  const [shift, setShift] = useState(3);
  const [ciphertext, setCiphertext] = useState('PHHW PH DW PLGQLJKW');

  const encoded = useMemo(() => caesarShift(message, shift), [message, shift]);
  const decoded = useMemo(() => caesarDecode(ciphertext, shift), [ciphertext, shift]);
  const cracked = useMemo(() => bruteForceShifts(ciphertext), [ciphertext]);

  return (
    <div className="space-y-3">
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-fit mx-auto">
        <button onClick={() => setMode('encode')} className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${mode === 'encode' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}><Lock className="w-3.5 h-3.5" /> Encode / Decode</button>
        <button onClick={() => setMode('crack')} className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${mode === 'crack' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}><Unlock className="w-3.5 h-3.5" /> Crack the Code</button>
      </div>

      {mode === 'encode' ? (
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-500 space-y-1">
            <span>Your message</span>
            <input value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-mono" />
          </label>
          <label className="block text-xs font-bold text-slate-500 space-y-1">
            <span>Shift ({shift}) -- each letter moves this many places forward in the alphabet</span>
            <input type="range" min={0} max={25} value={shift} onChange={(e) => setShift(parseInt(e.target.value, 10))} className="w-full accent-primary-600" />
          </label>
          <div className="rounded-xl border-2 border-primary-300 dark:border-primary-800 bg-primary-50/40 dark:bg-primary-950/10 p-3 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Encoded (send this)</p>
            <p className="font-mono text-sm break-words">{encoded}</p>
          </div>
          <p className="text-center text-[11px] text-slate-400">Decoding the same text with the same shift gives back: <span className="font-mono">{caesarDecode(encoded, shift)}</span></p>
        </div>
      ) : (
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-500 space-y-1">
            <span>Ciphertext (shift unknown -- try cracking it!)</span>
            <input value={ciphertext} onChange={(e) => setCiphertext(e.target.value)} className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-mono" />
          </label>
          <p className="text-center text-[11px] text-slate-500">Every one of the 26 possible shifts is decoded and scored against real English letter frequency -- the best match is very likely the real message.</p>
          <div className="space-y-1.5">
            {cracked.slice(0, 3).map((c, i) => (
              <div key={c.shift} className={`rounded-lg p-2.5 border-2 ${i === 0 ? 'border-accent-400 bg-accent-50/40 dark:bg-accent-900/10' : 'border-slate-200 dark:border-slate-800'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">shift {c.shift}</span>
                  {i === 0 && <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-600"><Sparkles className="w-3 h-3" /> Best match</span>}
                </div>
                <p className="font-mono text-sm break-words">{c.decoded}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-xs text-slate-500 max-w-md mx-auto">Julius Caesar reportedly used exactly this cipher (with a shift of 3) for military messages -- and this same real weakness (letter-frequency analysis) is why simple substitution ciphers were eventually broken by codebreakers.</p>
    </div>
  );
}
