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
            Local multiplayer. Avoid the walls.
          </p>
        </div>
        
        <div className="flex gap-4">
            {/* Player 1 Controls */}
            <div className="bg-cyan-900/30 backdrop-blur-md border border-cyan-500/30 p-4 rounded-xl flex flex-col gap-2 shadow-2xl">
                <div className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1">Player 1</div>
                <div className="flex items-center gap-3">
                    <span className="flex gap-1">
                        <Kbd>W</Kbd><Kbd>A</Kbd><Kbd>S</Kbd><Kbd>D</Kbd>
                    </span>
                    <span className="text-xs font-mono uppercase text-gray-400">Move</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex">
                        <Kbd>L-Shift</Kbd>
                    </span>
                    <span className="text-xs font-mono uppercase text-gray-400">Sprint</span>
                </div>
            </div>

            {/* Player 2 Controls */}
            <div className="bg-orange-900/30 backdrop-blur-md border border-orange-500/30 p-4 rounded-xl flex flex-col gap-2 shadow-2xl">
                <div className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-1">Player 2</div>
                <div className="flex items-center gap-3">
                    <span className="flex gap-1">
                        <Kbd>↑</Kbd><Kbd>←</Kbd><Kbd>↓</Kbd><Kbd>→</Kbd>
                    </span>
                    <span className="text-xs font-mono uppercase text-gray-400">Move</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex">
                        <Kbd>R-Shift</Kbd>
                    </span>
                    <span className="text-xs font-mono uppercase text-gray-400">Sprint</span>
                </div>
            </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Suspense fallback={null}>
        <Canvas shadows camera={{ position: [0, 20, 25], fov: 40 }}>
          <Scene />
          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            minDistance={10}
            maxDistance={60}
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