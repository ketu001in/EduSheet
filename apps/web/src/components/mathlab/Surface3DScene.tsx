'use client';
import { useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';

// A real 3D surface z=f(x,y) -- the one place in Math Lab where 3D isn't
// optional polish, it's the only way to actually SEE a two-variable
// function at all (a 2D plot can only ever show y=f(x)). `heights` is a
// flat, already-computed, already-clamped grid (computed by the caller
// via exprParser.ts + real error handling, not inside this component) --
// this scene only ever turns real numbers into real geometry.
export default function Surface3DScene({
  heights, resolution, range, colorLow = '#2F5FE0', colorHigh = '#E8474C',
}: {
  heights: Float32Array; // resolution*resolution values, row-major
  resolution: number;
  range: number; // domain half-width in both x and y
  colorLow?: string;
  colorHigh?: string;
}) {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(range * 2 * 0.7, range * 2 * 0.7, resolution - 1, resolution - 1);
    geo.rotateX(-Math.PI / 2); // lie flat, y becomes "up"

    const positions = geo.attributes.position;
    let minH = Infinity, maxH = -Infinity;
    for (let i = 0; i < heights.length; i++) {
      if (heights[i] < minH) minH = heights[i];
      if (heights[i] > maxH) maxH = heights[i];
    }
    const span = maxH - minH || 1;
    const colors = new Float32Array(positions.count * 3);
    const cLow = new THREE.Color(colorLow);
    const cHigh = new THREE.Color(colorHigh);
    const heightScale = 1.4; // world units per domain unit of z

    for (let i = 0; i < positions.count; i++) {
      const h = heights[i] ?? 0;
      positions.setY(i, h * heightScale);
      const t = (h - minH) / span;
      const c = cLow.clone().lerp(cHigh, t);
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, [heights, resolution, range, colorLow, colorHigh]);

  return (
    <SafeR3FCanvas height={340} shadows camera={{ position: [4.2, 3.4, 4.6], fov: 42 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 3]} intensity={1.1} castShadow />
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.5} metalness={0.1} />
      </mesh>
      <axesHelper args={[range * 0.7 * 1.15]} />
      <OrbitControls enablePan={false} minDistance={2.5} maxDistance={12} makeDefault />
    </SafeR3FCanvas>
  );
}
