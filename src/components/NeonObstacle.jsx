import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * NeonObstacle
 * A glowing obstacle placed inside the tunnel.
 * type: 'bar' | 'ring' | 'cross'
 * Props: z, color, type, rotSpeed
 */
export default function NeonObstacle({ z, color, type = 'bar', rotSpeed = 0 }) {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current && rotSpeed !== 0) {
      groupRef.current.rotation.z += rotSpeed * delta;
    }
  });

  const mat = (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={2.5}
      toneMapped={false}
    />
  );

  return (
    <group ref={groupRef} position={[0, 0, z]}>
      {type === 'bar' && (
        // Horizontal bar crossing the tunnel
        <mesh>
          <boxGeometry args={[7, 0.12, 0.12]} />
          {mat}
        </mesh>
      )}

      {type === 'ring' && (
        // A smaller inner ring
        <mesh>
          <torusGeometry args={[1.8, 0.06, 8, 32]} />
          {mat}
        </mesh>
      )}

      {type === 'cross' && (
        // Two bars forming a cross
        <>
          <mesh>
            <boxGeometry args={[7, 0.10, 0.10]} />
            {mat}
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[7, 0.10, 0.10]} />
            {mat}
          </mesh>
        </>
      )}
    </group>
  );
}
