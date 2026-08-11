'use client';
import { useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';

const ROTATE_X_LIMIT = 35; // up/down tilt stays modest -- keeps the object
// readable and avoids the distorted, page-curl look extreme angles cause.
const DRAG_SENSITIVITY = 0.5;

// Generalized out of Biology Lab's AnatomyExplorer -- the same "hold and
// drag to spin, let go and it eases back to flat" interaction, now usable
// by any lab for any single real object image (equipment, specimens,
// instruments), not just anatomical reference plates. Deliberately a
// single-image tilt illusion, not a true volumetric 3D model -- see the
// note this shares with AnatomyExplorer: a real "other side" view would
// need actual multi-angle photography or a 3D scan per object, which is a
// separate, much larger undertaking than sourcing one good reference photo.
export default function RotatableImageCard({
  imageSrc, imageAlt, caption, credit,
}: {
  imageSrc: string;
  imageAlt: string;
  caption?: string;
  credit?: { author: string; license: string; url: string };
}) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; rotX: number; rotY: number } | null>(null);
  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

  const onTiltStart = (e: React.PointerEvent) => {
    dragStart.current = { x: e.clientX, y: e.clientY, rotX: rotation.x, rotY: rotation.y };
    setDragging(true);
  };
  const onTiltMove = (e: React.PointerEvent) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setRotation({
      y: dragStart.current.rotY + dx * DRAG_SENSITIVITY, // unclamped -- a full, continuous 360° spin
      x: clamp(dragStart.current.rotX - dy * DRAG_SENSITIVITY, -ROTATE_X_LIMIT, ROTATE_X_LIMIT),
    });
  };
  const onTiltEnd = () => {
    dragStart.current = null;
    setDragging(false);
    setRotation({ x: 0, y: 0 }); // eases back to flat once you let go
  };

  return (
    <div className="space-y-2">
      <div className="relative w-full max-w-xs mx-auto" style={{ perspective: '1200px' }}>
        <div
          onPointerDown={onTiltStart}
          onPointerMove={onTiltMove}
          onPointerUp={onTiltEnd}
          onPointerCancel={onTiltEnd}
          onPointerLeave={dragging ? onTiltEnd : undefined}
          className={`relative touch-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transition: dragging ? 'none' : 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc} alt={imageAlt} className="w-full h-auto rounded-xl select-none" draggable={false} />
        </div>
      </div>
      <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
        <RotateCcw className="w-3 h-3" /> Hold and drag to spin &middot; let go and it settles back
      </p>
      {caption && <p className="text-center text-xs font-bold text-slate-500">{caption}</p>}
      {credit && (
        <p className="text-center text-[10px] text-slate-400">
          Image: {credit.author} &middot; {credit.license} &middot;{' '}
          <a href={credit.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-600">Source</a>
        </p>
      )}
    </div>
  );
}
