'use client';
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

// SafeR3FCanvas runs frameloop="demand" (renders only when explicitly
// invalidated -- a real, deliberate perf choice shared by every 3D scene
// in this app, most of which are static until hovered/clicked). Any
// scene with a genuine ongoing animation -- a blinking LED, a spinning
// motor, a drawer sliding open, a hover-triggered scale lerp -- needs a
// REAL continuous tick, which useFrame alone won't provide in demand
// mode (nothing schedules a next frame on its own). This drives that
// continuous tick from outside R3F's own loop via a genuine
// requestAnimationFrame, calling the real invalidate() R3F exposes for
// exactly this -- and stops it the instant nothing needs to animate, so
// an idle scene stays cheap. Shared between Breadboard3DScene and
// ElectronicsCupboard3DScene rather than duplicated in each.
export default function ContinuousInvalidate({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const tick = () => { invalidate(); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, invalidate]);
  return null;
}
