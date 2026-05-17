import { useLayoutEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLOR_THEMES, COLOR_THEME_DURATION } from '../utils/constants';

/**
 * useColorTheme
 * Writes theme state directly into the ref passed from App.
 * The HUD reads the same ref — no copying, no lag, always in sync.
 */
export function useColorTheme(sharedRef) {
  // Initialise the ref object once so it's valid before first frame
  useLayoutEffect(() => {
    sharedRef.current = {
      colors:     [...COLOR_THEMES[0].colors],
      themeIndex: 0,
      nextIndex:  1,
      progress:   0,
    };
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const cycle   = elapsed / COLOR_THEME_DURATION;

    const themeIndex = Math.floor(cycle) % COLOR_THEMES.length;
    const nextIndex  = (themeIndex + 1) % COLOR_THEMES.length;
    const progress   = cycle % 1;
    const ease       = progress * progress * (3 - 2 * progress);

    const current = COLOR_THEMES[themeIndex];
    const next    = COLOR_THEMES[nextIndex];

    // Lerp fog directly on the scene
    if (state.scene.fog) {
      const fogA = new THREE.Color(current.fog);
      const fogB = new THREE.Color(next.fog);
      state.scene.fog.color.copy(fogA.lerp(fogB, ease));
    }

    // Lerp palette and write into the shared ref — one object, always current
    const colors = current.colors.map((hexA, i) => {
      const cA = new THREE.Color(hexA);
      const cB = new THREE.Color(next.colors[i % next.colors.length]);
      return '#' + cA.lerp(cB, ease).getHexString();
    });

    // Mutate in place so the HUD's ref pointer never goes stale
    sharedRef.current.colors     = colors;
    sharedRef.current.themeIndex = themeIndex;
    sharedRef.current.nextIndex  = nextIndex;
    sharedRef.current.progress   = progress;
  });
}
