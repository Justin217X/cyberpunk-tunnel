import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { TUNNEL_CONFIG } from '../utils/constants';

/**
 * CameraRig
 * Drives the camera forward along -Z and adds subtle
 * sinusoidal drift for an organic cinematic feel.
 */
export default function CameraRig() {
  const elapsed = useRef(0);

  useFrame((state, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;

    // Move forward
    state.camera.position.z -= TUNNEL_CONFIG.CAMERA_SPEED * delta;

    // Subtle XY drift — feels alive without being nauseating
    state.camera.position.x = Math.sin(t * 0.3) * 0.25;
    state.camera.position.y = Math.cos(t * 0.2) * 0.15;

    // Slight roll for cinematic energy
    state.camera.rotation.z = Math.sin(t * 0.25) * 0.03;

    state.camera.lookAt(
      state.camera.position.x,
      state.camera.position.y,
      state.camera.position.z - 10
    );
  });

  return null; // No visual output - just drives the camera
}
