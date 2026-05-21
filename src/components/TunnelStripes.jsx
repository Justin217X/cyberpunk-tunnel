import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TUNNEL_CONFIG } from '../utils/constants';

export default function TunnelStripes({ totalLength = 720, themeRef }) {
  const groupRef = useRef();
  const sides    = TUNNEL_CONFIG.RING_SIDES;
  const r        = TUNNEL_CONFIG.TUNNEL_RADIUS;

  // Lines run from -totalLength/2 to +totalLength/2 in local Z
  // The group itself is repositioned to camera Z each frame,
  // so the stripes are always centered on the camera and never run out
  const lines = useMemo(() => {
    return Array.from({ length: sides }, (_, i) => {
      const angle = (i / sides) * Math.PI * 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      const half = totalLength / 2;
      const pts = new Float32Array([x, y, half, x, y, -half]);
      return { pts, colorIndex: i % 5 };
    });
  }, [totalLength]);

  useFrame(({ camera }) => {
    if (!groupRef.current) return;

    // Slide the group so stripes are always centered on the camera
    groupRef.current.position.z = camera.position.z;

    // Update colors from theme
    if (!themeRef?.current) return;
    const palette = themeRef.current.colors;
    groupRef.current.children.forEach((line, i) => {
      const hex = palette[lines[i].colorIndex % palette.length];
      line.material.color.set(hex);
    });
  });

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => (
        <line key={i} frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[line.pts, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#ff00ff" toneMapped={false} />
        </line>
      ))}
    </group>
  );
}