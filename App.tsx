import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Loader } from '@react-three/drei';
import { Scene } from './components/Scene';

const App: React.FC = () => {
  const [aiActive, setAiActive] = useState(true);

  return (
    <div className="relative w-full h-screen bg-neutral-900 overflow-hidden">
      
      {/* UI Overlay */}
      <div className="absolute top-0 left-0 p-6 z-10 pointer-events-none text-white w-full flex justify-between items-start select-none">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            AI CHASE
          </h1>
          <p className="text-gray-400 text-sm max-w-md">
            Outrun the AI Agent. It learns from collision context.
          </p>
        </div>
        
        <div className="flex gap-4">
            {/* Player 1 Controls */}
            <div className="bg-cyan-900/30 backdrop-blur-md border border-cyan-500/30 p-4 rounded-xl flex flex-col gap-2 shadow-2xl">
                <div className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1">Human (You)</div>
                <div className="flex items-center gap-3">
                    <span className="flex gap-1">
                        <Kbd>W</Kbd><Kbd>A</Kbd><Kbd>S</Kbd><Kbd>D</Kbd>
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

            {/* AI Info */}
            <div className="bg-red-900/30 backdrop-blur-md border border-red-500/30 p-4 rounded-xl flex flex-col gap-2 shadow-2xl pointer-events-auto">
                <div className="flex justify-between items-center mb-1">
                    <div className="text-red-400 text-xs font-bold uppercase tracking-widest">AI Agent</div>
                    <button 
                      onClick={() => setAiActive(!aiActive)}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                        aiActive 
                          ? 'bg-red-500/20 border-red-500 text-red-200 hover:bg-red-500/40' 
                          : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {aiActive ? 'STOP' : 'START'}
                    </button>
                </div>
                
                <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${aiActive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></span>
                    <span className="text-xs font-mono uppercase text-gray-300">
                      {aiActive ? 'Autonomous' : 'Paused'}
                    </span>
                </div>
                <div className="text-[10px] text-gray-500 leading-tight max-w-[120px]">
                    State Machine:
                    <br/>
                    • Chase Target
                    <br/>
                    • Wall Unstuck
                </div>
            </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Suspense fallback={null}>
        <Canvas shadows camera={{ position: [0, 25, 25], fov: 35 }}>
          <Scene aiActive={aiActive} />
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