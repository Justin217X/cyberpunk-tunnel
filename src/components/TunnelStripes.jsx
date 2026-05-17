import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TUNNEL_CONFIG } from '../utils/constants';

export default function TunnelStripes({ totalLength = 300, themeRef }) {
  const groupRef = useRef();
  const sides    = TUNNEL_CONFIG.RING_SIDES;
  const r        = TUNNEL_CONFIG.TUNNEL_RADIUS;

  const lines = useMemo(() => {
    return Array.from({ length: sides }, (_, i) => {
      const angle = (i / sides) * Math.PI * 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      const pts = new Float32Array([x, y, 0, x, y, -totalLength]);
      return { pts, colorIndex: i % 5 };
    });
  }, [totalLength]);

  // Update stripe colors each frame to track theme
  useFrame(() => {
    if (!groupRef.current || !themeRef) return;
    const palette = themeRef.current.colors;
    groupRef.current.children.forEach((line, i) => {
      const hex = palette[lines[i].colorIndex % palette.length];
      line.material.color.set(hex);
    });
  });

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[line.pts, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#ff00ff" toneMapped={false} />
        </line>
      ))}
    </group>
  );
}
