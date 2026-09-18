'use client';
import { OrbitControls } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import ComponentModel from './ComponentModel3D';
import type { ComponentSpec } from '@edusheets/content';

// A close-up, single-part 3D preview -- shown inside the component detail
// modal, one canvas at a time (never alongside the drawer scene, so
// there's still only ever one WebGL context live). Real value baked
// directly into the geometry (a resistor really does show its real color
// bands here).
export default function ComponentPreview3DScene({ spec }: { spec: ComponentSpec }) {
  return (
    <SafeR3FCanvas height={200} camera={{ position: [1.4, 1.1, 1.6], fov: 38 }}>
      <ambientLight intensity={0.95} />
      <directionalLight position={[2, 3, 2]} intensity={1.1} />
      <ComponentModel spec={spec} />
      <OrbitControls enablePan={false} minDistance={0.8} maxDistance={3.5} target={[0, 0.25, 0]} makeDefault autoRotate autoRotateSpeed={1.4} />
    </SafeR3FCanvas>
  );
}
