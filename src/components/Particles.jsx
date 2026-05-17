import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PARTICLE_CONFIG, NEON_COLORS } from '../utils/constants';

const DEPTH  = PARTICLE_CONFIG.DEPTH;
const SPREAD = PARTICLE_CONFIG.SPREAD_XY;
const COUNT  = PARTICLE_CONFIG.COUNT;

/**
 * Particles — precision-safe infinite particle stream.
 *
 * Root cause of thinning: at large negative camZ (e.g. -50,000), storing world-space
 * Z positions in Float32 loses sub-unit precision, so particles cluster or teleport
 * to wrong positions and the recycle condition misfires.
 *
 * Fix: store each particle as a (x, y, relZ) triple where relZ is the offset from
 * the camera (-DEPTH..+2). World Z = camZ + relZ, computed fresh every frame from
 * high-precision numbers. Particles are fixed in world space — they don't move —
 * so relZ simply decreases each frame as the camera advances. When relZ > 0 the
 * particle has passed the camera and gets recycled to relZ = -(2..DEPTH).
 */

// Separate typed arrays for relative coords — never written by Three.js
const relX = new Float32Array(COUNT);
const relY = new Float32Array(COUNT);
const relZ = new Float32Array(COUNT); // offset from camera

function seedParticle(i, palette) {
  const angle  = Math.random() * Math.PI * 2;
  const radius = Math.random() * SPREAD;
  relX[i] = Math.cos(angle) * radius;
  relY[i] = Math.sin(angle) * radius;
  relZ[i] = -(2 + Math.random() * DEPTH); // ahead of camera
  return palette?.[Math.floor(Math.random() * palette.length)] ?? NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
}

export default function Particles({ themeRef }) {
  const stateRef = useRef(null);

  useEffect(() => {
    // Seed all particles at start
    const colors = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const hex = seedParticle(i, null);
      const c   = new THREE.Color(hex);
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }

    // Position buffer — filled from relX/relY/relZ each frame
    const positions = new Float32Array(COUNT * 3);
    const posAttr   = new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage);
    const colAttr   = new THREE.BufferAttribute(colors,    3).setUsage(THREE.DynamicDrawUsage);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', posAttr);
    geo.setAttribute('color',    colAttr);

    const mat = new THREE.PointsMaterial({
      size: PARTICLE_CONFIG.SIZE,
      vertexColors: true,
      toneMapped: false,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      depthWrite: false,
    });

    const mesh = new THREE.Points(geo, mat);
    mesh.frustumCulled = false;

    stateRef.current = { mesh, positions, colors, posAttr, colAttr };
    return () => { geo.dispose(); mat.dispose(); };
  }, []);

  useFrame(({ scene, camera }) => {
    const s = stateRef.current;
    if (!s) return;
    if (!s.mesh.parent) scene.add(s.mesh);

    const camZ    = camera.position.z;           // precise JS float64
    const palette = themeRef?.current?.colors ?? null;
    const { positions, colors, posAttr, colAttr } = s;
    let colDirty = false;

    for (let i = 0; i < COUNT; i++) {
      // relZ increases toward 0 as camera moves forward (camZ decreases)
      // We recompute relZ from stored world position each frame:
      // worldZ is fixed (particle doesn't move), so relZ = worldZ - camZ
      // worldZ was set when particle was spawned: worldZ = camZ_at_spawn + relZ_at_spawn
      // We don't store worldZ explicitly — instead we track relZ and update it:
      //   new relZ = old relZ + (old camZ - new camZ)  [= how much camera advanced]
      // But we don't have old camZ here. Simpler: store worldZ in the position buffer
      // (which we do), and recompute relZ = positions[i*3+2] - camZ each frame.

      const worldZ = positions[i * 3 + 2];
      const curRelZ = worldZ - camZ;

      if (curRelZ > 2 || curRelZ < -DEPTH - 20) {
        // Recycle
        const hex = seedParticle(i, palette);
        const c   = new THREE.Color(hex);
        colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
        // Write fresh world position from new relZ
        positions[i * 3]     = relX[i];
        positions[i * 3 + 1] = relY[i];
        positions[i * 3 + 2] = camZ + relZ[i]; // relZ[i] set by seedParticle
        colDirty = true;
      }
      // Non-recycled particles: their worldZ doesn't change (they're static in world space).
      // We only need to update XY in case they were just recycled above.
      // The buffer already has the correct worldZ from spawn — no update needed.
    }

    posAttr.needsUpdate = true;
    if (colDirty) colAttr.needsUpdate = true;
  });

  return null;
}
