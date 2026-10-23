'use client';
import { useRef } from 'react';
import { playHoverTick, playSelectChime } from '@/lib/uiSoundEngine';

// A modern, "3D-looking" replacement for a bare <input type="range"
// className="accent-primary-600"> -- the exact flat slider the user
// screenshotted and called out by name ("sliders for play it yourself
// section... is 2d and flat"). Keeps the real, accessible native range
// input underneath (so keyboard/touch/precision all still work exactly as
// before) but hides its default appearance and layers a glowing gradient
// fill track + a raised, bordered thumb that lifts on hover/drag, plus a
// live value pill and a soft tick sound while dragging. No WebGL cost --
// pure CSS -- so it's safe to drop into any slider anywhere in the app.
export default function ModernSlider({
  label, unit = '', value, min, max, step, onChange, sound = true, className = '',
}: {
  label: string;
  unit?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  sound?: boolean;
  className?: string;
}) {
  const lastTickRef = useRef(value);
  const pct = max > min ? Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)) : 0;
  const tickGap = Math.max(step, (max - min) / 12);

  const handleChange = (v: number) => {
    onChange(v);
    if (sound && Math.abs(v - lastTickRef.current) >= tickGap) {
      playHoverTick();
      lastTickRef.current = v;
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</span>
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 tabular-nums shadow-inner">
          {value}{unit}
        </span>
      </div>
      <div className="relative h-7 flex items-center">
        <div className="absolute inset-x-0 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 shadow-inner" />
        <div
          className="absolute h-2.5 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 shadow-[0_0_10px_rgba(47,95,224,0.45)] pointer-events-none"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => handleChange(parseFloat(e.target.value))}
          onPointerDown={() => sound && playSelectChime()}
          aria-label={label}
          className="relative z-10 w-full h-7 appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-runnable-track]:bg-transparent
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-primary-600
            [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.35)] [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:active:scale-110
            [&::-moz-range-track]:bg-transparent
            [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-primary-600
            [&::-moz-range-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.35)] [&::-moz-range-thumb]:transition-transform
            [&::-moz-range-thumb]:hover:scale-125"
        />
      </div>
    </div>
  );
}
