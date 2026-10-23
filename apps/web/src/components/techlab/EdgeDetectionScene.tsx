'use client';
import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { edgeMagnitude, convolveAt, SOBEL_X, SOBEL_Y } from '@/lib/aiExperimentsEngine';

// Deliberately 2D, not 3D -- a pixel grid IS the honest medium here. This
// is the actual real algorithm (Sobel & Feldman, 1968) running on an
// editable image, computed live at every pixel, not a decorative
// approximation. Forcing this into a 3D scene would add a fake extra axis
// that teaches nothing a flat grid doesn't already show more clearly.
const SIZE = 8;
const LEVELS = [0, 128, 255];

function defaultImage(): number[][] {
  return Array.from({ length: SIZE }, (_, r) => Array.from({ length: SIZE }, (_, c) => (c < SIZE / 2 ? 0 : 255)));
}

export default function EdgeDetectionScene() {
  const [image, setImage] = useState<number[][]>(defaultImage);
  const [picked, setPicked] = useState<{ r: number; c: number } | null>(null);

  const cyclePixel = (r: number, c: number) => {
    setImage((prev) => {
      const next = prev.map((row) => [...row]);
      const idx = LEVELS.indexOf(next[r][c]);
      next[r][c] = LEVELS[(idx + 1) % LEVELS.length];
      return next;
    });
  };

  const reset = () => { setImage(defaultImage()); setPicked(null); };

  const picked_ = picked
    ? { gx: convolveAt(image, picked.c, picked.r, SOBEL_X), gy: convolveAt(image, picked.c, picked.r, SOBEL_Y), mag: edgeMagnitude(image, picked.c, picked.r) }
    : null;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-center text-[10px] font-bold text-slate-400 mb-1">Image (click a pixel to cycle brightness)</p>
          <div className="grid gap-0.5 mx-auto w-fit" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
            {image.map((row, r) => row.map((v, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => cyclePixel(r, c)}
                className="w-7 h-7 border border-slate-300 dark:border-slate-700"
                style={{ backgroundColor: `rgb(${v},${v},${v})` }}
                aria-label={`pixel ${r},${c} value ${v}`}
              />
            )))}
          </div>
        </div>
        <div>
          <p className="text-center text-[10px] font-bold text-slate-400 mb-1">Edge Map (click a pixel for its Gx/Gy)</p>
          <div className="grid gap-0.5 mx-auto w-fit" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
            {image.map((row, r) => row.map((_, c) => {
              const mag = edgeMagnitude(image, c, r);
              const intensity = Math.min(255, Math.round(mag / 4));
              const isPicked = picked?.r === r && picked?.c === c;
              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => setPicked({ r, c })}
                  className={`w-7 h-7 border ${isPicked ? 'border-primary-600 border-2' : 'border-slate-300 dark:border-slate-700'}`}
                  style={{ backgroundColor: `rgb(${intensity},${Math.round(intensity * 0.4)},${255 - intensity})` }}
                  aria-label={`edge ${r},${c} magnitude ${mag.toFixed(0)}`}
                />
              );
            }))}
          </div>
        </div>
      </div>

      {picked_ && (
        <div className="grid grid-cols-3 gap-1.5 text-center text-xs max-w-sm mx-auto">
          <div className="rounded-lg p-1.5 bg-slate-50 dark:bg-slate-800/50"><p className="text-[10px] font-bold text-slate-400">Gx (horizontal)</p><p className="font-black">{picked_.gx}</p></div>
          <div className="rounded-lg p-1.5 bg-slate-50 dark:bg-slate-800/50"><p className="text-[10px] font-bold text-slate-400">Gy (vertical)</p><p className="font-black">{picked_.gy}</p></div>
          <div className="rounded-lg p-1.5 bg-primary-50 dark:bg-primary-900/20"><p className="text-[10px] font-bold text-slate-400">Magnitude</p><p className="font-black text-primary-700 dark:text-primary-300">{picked_.mag.toFixed(0)}</p></div>
        </div>
      )}

      <div className="flex justify-center">
        <button onClick={reset} className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"><RotateCcw className="w-4 h-4" /> Reset to Vertical Edge</button>
      </div>
      <p className="text-center text-xs text-slate-500 max-w-md mx-auto">Paint your own shape on the left and watch the real Sobel kernel highlight exactly where brightness changes sharply -- that's an edge.</p>
    </div>
  );
}
