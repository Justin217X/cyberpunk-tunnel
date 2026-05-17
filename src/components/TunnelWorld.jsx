import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import TunnelStripes from './TunnelStripes';
import Particles from './Particles';
import { TUNNEL_CONFIG } from '../utils/constants';
import { randomObstacleType } from '../utils/helpers';
import { useColorTheme } from '../hooks/useColorTheme';

const RING_COUNT     = 40;
const OBSTACLE_COUNT = 8;
const SPACING        = TUNNEL_CONFIG.RING_SPACING;
const TUNNEL_DEPTH   = RING_COUNT * SPACING;

function makeRingGeometry() {
  const sides = TUNNEL_CONFIG.RING_SIDES;
  const r = TUNNEL_CONFIG.TUNNEL_RADIUS;
  const thickness = 0.08, depth = 0.18;
  const shape = new THREE.Shape();
  for (let i = 0; i <= sides; i++) {
    const a = (i / sides) * Math.PI * 2;
    i === 0 ? shape.moveTo(Math.cos(a)*(r+thickness), Math.sin(a)*(r+thickness))
            : shape.lineTo(Math.cos(a)*(r+thickness), Math.sin(a)*(r+thickness));
  }
  const hole = new THREE.Path();
  for (let i = 0; i <= sides; i++) {
    const a = (i / sides) * Math.PI * 2;
    i === 0 ? hole.moveTo(Math.cos(a)*(r-thickness), Math.sin(a)*(r-thickness))
            : hole.lineTo(Math.cos(a)*(r-thickness), Math.sin(a)*(r-thickness));
  }
  shape.holes.push(hole);
  return new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
}

function RecyclingRings({ themeRef }) {
  const groupRef = useRef();
  const ringGeo  = useMemo(() => makeRingGeometry(), []);
  const ringMeta = useMemo(() => Array.from({ length: RING_COUNT }, (_, i) => ({
    pulse: Math.random() < 0.3,
    initialZ: -i * SPACING,
    colorIndex: i % 5,
  })), []);

  useFrame(({ clock, camera }) => {
    if (!groupRef.current || !themeRef.current) return;
    const camZ    = camera.position.z;
    const t       = clock.getElapsedTime();
    const palette = themeRef.current.colors;

    groupRef.current.children.forEach((mesh, i) => {
      const meta = ringMeta[i];
      if (mesh.position.z > camZ + 5) {
        mesh.position.z -= TUNNEL_DEPTH;
        meta.pulse      = Math.random() < 0.3;
        meta.colorIndex = Math.floor(Math.random() * palette.length);
      }
      const col = new THREE.Color(palette[meta.colorIndex % palette.length]);
      mesh.material.color.copy(col);
      mesh.material.emissive.copy(col);
      mesh.material.emissiveIntensity = meta.pulse ? 1.2 + Math.sin(t * 4 + i) * 0.8 : 1.0;
    });
  });

  return (
    <group ref={groupRef}>
      {ringMeta.map((meta, i) => (
        <mesh key={i} geometry={ringGeo} position={[0, 0, meta.initialZ]}>
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={1.0} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function RecyclingObstacles({ themeRef }) {
  const groupRef     = useRef();
  const obstacleMeta = useMemo(() => Array.from({ length: OBSTACLE_COUNT }, (_, i) => ({
    type: randomObstacleType(),
    rotSpeed: (Math.random() - 0.5) * 1.5,
    initialZ: -i * (TUNNEL_DEPTH / OBSTACLE_COUNT) - SPACING * 2,
    colorIndex: i % 5,
  })), []);

  useFrame(({ camera }, delta) => {
    if (!groupRef.current || !themeRef.current) return;
    const camZ    = camera.position.z;
    const palette = themeRef.current.colors;

    groupRef.current.children.forEach((group, i) => {
      const meta = obstacleMeta[i];
      if (group.position.z > camZ + 5) {
        group.position.z -= TUNNEL_DEPTH;
        meta.colorIndex  = Math.floor(Math.random() * palette.length);
        meta.type        = randomObstacleType();
      }
      const col = new THREE.Color(palette[meta.colorIndex % palette.length]);
      group.children.forEach(mesh => {
        if (mesh.material) {
          mesh.material.color.copy(col);
          mesh.material.emissive.copy(col);
        }
      });
      group.rotation.z += meta.rotSpeed * delta;
    });
  });

  const makeMat = () => new THREE.MeshStandardMaterial({
    color: '#ff00ff', emissive: '#ff00ff', emissiveIntensity: 2.5, toneMapped: false,
  });

  return (
    <group ref={groupRef}>
      {obstacleMeta.map((meta, i) => (
        <group key={i} position={[0, 0, meta.initialZ]}>
          {meta.type === 'bar'   && <mesh material={makeMat()}><boxGeometry args={[7, 0.12, 0.12]} /></mesh>}
          {meta.type === 'ring'  && <mesh material={makeMat()}><torusGeometry args={[1.8, 0.06, 8, 32]} /></mesh>}
          {meta.type === 'cross' && <>
            <mesh material={makeMat()}><boxGeometry args={[7, 0.10, 0.10]} /></mesh>
            <mesh material={makeMat()} rotation={[0, 0, Math.PI / 2]}><boxGeometry args={[7, 0.10, 0.10]} /></mesh>
          </>}
        </group>
      ))}
    </group>
  );
}

// themeRef comes from App — useColorTheme writes into it directly
export default function TunnelWorld({ themeRef }) {
  useColorTheme(themeRef);

  return (
    <group>
      <RecyclingRings     themeRef={themeRef} />
      <RecyclingObstacles themeRef={themeRef} />
      <TunnelStripes totalLength={TUNNEL_DEPTH * 3} themeRef={themeRef} />
      <Particles themeRef={themeRef} />
    </group>
  );
}
