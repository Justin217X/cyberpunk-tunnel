import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { TUNNEL_CONFIG } from '../utils/constants';

/**
 * useTunnelCamera
 * Moves the camera forward along -Z each frame.
 * Returns a ref to the current Z offset so children can use it.
 */
export function useTunnelCamera() {
  const offsetRef = useRef(0);

  useFrame((state, delta) => {
    // Advance the offset
    offsetRef.current += TUNNEL_CONFIG.CAMERA_SPEED * delta;

    // Move camera forward — we shift the whole scene instead
    // so post-processing and fog stay stable
    state.camera.position.z = -offsetRef.current;
  });

  return offsetRef;
}
