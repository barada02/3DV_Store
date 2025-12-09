
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Loader } from '@react-three/drei';
import { Scene } from './components/Scene';

const App: React.FC = () => {
  return (
    <div className="relative w-full h-screen bg-neutral-900 overflow-hidden">
      
      {/* UI Overlay */}
      <div className="absolute top-0 left-0 p-6 z-10 pointer-events-none text-white w-full flex justify-between items-start select-none">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            3D PLAYGROUND
          </h1>
          <p className="text-gray-400 text-sm max-w-md">
            Experiment with movement and collision.
          </p>
        </div>
        
        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-xl flex flex-col gap-2 shadow-2xl">
            <div className="flex items-center gap-3">
                <span className="flex gap-1">
                    <Kbd>W</Kbd>
                    <Kbd>A</Kbd>
                    <Kbd>S</Kbd>
                    <Kbd>D</Kbd>
                </span>
                <span className="text-xs font-mono uppercase text-gray-400">Move</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="flex">
                    <Kbd>Shift</Kbd>
                </span>
                <span className="text-xs font-mono uppercase text-gray-400">Sprint</span>
            </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Suspense fallback={null}>
        <Canvas shadows camera={{ position: [0, 20, 20], fov: 45 }}>
          <Scene />
          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            minDistance={10}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2 - 0.1}
            target={[0, 0, 0]}
          />
        </Canvas>
      </Suspense>
      
      <Loader containerStyles={{ background: '#050505' }} />
    </div>
  );
};

// Simple UI helper for Keyboard keys
const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-2 py-1 bg-neutral-800 border-b-2 border-neutral-600 rounded text-xs font-bold text-gray-200 min-w-[24px] text-center mx-0.5">
    {children}
  </div>
);

export default App;
