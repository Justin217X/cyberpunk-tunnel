import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import TunnelWorld from './components/TunnelWorld';
import CameraRig from './components/CameraRig';
import PostFX from './components/PostFX';
import HUD from './components/HUD';

export default function App() {
  // Shared ref — TunnelWorld writes it via useColorTheme, HUD reads it
  const themeRef = useRef(null);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', maxWidth: 'calc(100vh * 9 / 16)' }}>
        <Canvas
          style={{ width: '100%', height: '100%' }}
          camera={{ fov: 80, near: 0.1, far: 400, position: [0, 0, 0] }}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          <fog attach="fog" args={['#0a000f', 8, 70]} />
          <ambientLight intensity={0.05} />
          <Suspense fallback={null}>
            <TunnelWorld themeRef={themeRef} />
          </Suspense>
          <CameraRig />
          <PostFX />
        </Canvas>

        <HUD themeRef={themeRef} />
      </div>
    </div>
  );
}
