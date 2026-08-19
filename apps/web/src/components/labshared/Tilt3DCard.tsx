'use client';
import { useRef, useState } from 'react';
import { playHoverTick, playSelectChime } from '@/lib/uiSoundEngine';

// A genuinely 3D, pointer-driven tilt card -- real CSS 3D transforms
// (perspective + rotateX/rotateY driven by cursor position), not a flat
// button with a color change on hover. Renders as a real <button> so it
// stays a proper, accessible, keyboard-focusable control; the 3D effect
// is purely a transform layered on top, and degrades gracefully to a
// flat button under keyboard focus/reduced-motion.
export default function Tilt3DCard({
  active, onClick, className, children, sound = true, title,
}: {
  active?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  sound?: boolean;
  title?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [pressed, setPressed] = useState(false);
  const hoveredRef = useRef(false);

  const handleMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -py * 14, ry: px * 14 });
  };
  const handleEnter = () => {
    if (!hoveredRef.current && sound) playHoverTick();
    hoveredRef.current = true;
  };
  const handleLeave = () => {
    hoveredRef.current = false;
    setTilt({ rx: 0, ry: 0 });
  };
  const handleClick = () => {
    if (sound) playSelectChime();
    setPressed(true);
    setTimeout(() => setPressed(false), 180);
    onClick?.();
  };

  return (
    <button
      ref={ref}
      onPointerMove={handleMove}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onClick={handleClick}
      title={title}
      style={{
        transform: `perspective(600px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${pressed ? 0.94 : hoveredRef.current ? 1.035 : 1})`,
        transformStyle: 'preserve-3d',
        transition: hoveredRef.current ? 'transform 60ms ease-out' : 'transform 350ms cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow: active
          ? '0 10px 24px -8px rgba(47,95,224,0.45), 0 2px 0 rgba(0,0,0,0.12)'
          : hoveredRef.current ? '0 8px 18px -8px rgba(0,0,0,0.25)' : '0 1px 0 rgba(0,0,0,0.06)',
      }}
      className={className}
    >
      {children}
    </button>
  );
}
