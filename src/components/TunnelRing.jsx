import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TUNNEL_CONFIG } from '../utils/constants';

/**
 * TunnelRing
 * Renders a single octagonal glowing ring at position z.
 * Props:
 *   z        – world Z position
 *   color    – neon hex color string
 *   pulse    – boolean, should the ring pulse in brightness?
 */
export default function TunnelRing({ z, color, pulse = false }) {
  const meshRef = useRef();

  // Build the ring geometry once
  const geometry = useMemo(() => {
    const sides = TUNNEL_CONFIG.RING_SIDES;
    const r = TUNNEL_CONFIG.TUNNEL_RADIUS;
    const thickness = 0.08;
    const depth = 0.18;

    // Create an octagonal ring shape
    const shape = new THREE.Shape();
    const outerR = r + thickness;
    const innerR = r - thickness;

    for (let i = 0; i <= sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      const x = Math.cos(angle) * outerR;
      const y = Math.sin(angle) * outerR;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }

    const hole = new THREE.Path();
    for (let i = 0; i <= sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      const x = Math.cos(angle) * innerR;
      const y = Math.sin(angle) * innerR;
      if (i === 0) hole.moveTo(x, y);
      else hole.lineTo(x, y);
    }
    shape.holes.push(hole);

    return new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: false,
    });
  }, []);

  // Animate emissive intensity for pulse rings
  useFrame(({ clock }) => {
    if (meshRef.current && pulse) {
      const t = clock.getElapsedTime();
      meshRef.current.material.emissiveIntensity = 1.2 + Math.sin(t * 4) * 0.8;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0, z]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={pulse ? 1.5 : 1.0}
        toneMapped={false}
      />
    </mesh>
  );
}
