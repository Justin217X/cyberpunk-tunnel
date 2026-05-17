import React from 'react';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

/**
 * PostFX
 * Post-processing stack for the cyberpunk tunnel:
 *   - Bloom: makes neon emissive materials glow
 *   - ChromaticAberration: subtle RGB split on edges
 *   - Vignette: darkens corners for cinematic framing
 *
 * All values are tuned for mobile performance while looking great.
 */
export default function PostFX() {
  return (
    <EffectComposer multisampling={0}>
      {/* Bloom — the #1 effect that makes neon feel real */}
      <Bloom
        intensity={1.8}
        luminanceThreshold={0.1}
        luminanceSmoothing={0.4}
        mipmapBlur
        radius={0.7}
      />

      {/* Chromatic aberration — subtle RGB fringe */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0015, 0.0015)}
      />

      {/* Vignette — pulls focus inward */}
      <Vignette
        eskil={false}
        offset={0.15}
        darkness={0.85}
      />
    </EffectComposer>
  );
}
