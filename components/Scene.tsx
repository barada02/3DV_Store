/// <reference types="@react-three/fiber" />
import React, { useRef } from 'react';
import { Group } from 'three';
import { MeshReflectorMaterial, Edges } from '@react-three/drei';
import { HumanPlayer } from './HumanPlayer';
import { AIPlayer } from './AIPlayer';
import { walls } from './LevelData';

interface SceneProps {
  aiActive: boolean;
}

export const Scene: React.FC<SceneProps> = ({ aiActive }) => {
  const humanPlayerRef = useRef<Group>(null);
  const aiPlayerRef = useRef<Group>(null);

  return (
    <>
      <color attach="background" args={['#050505']} />
      
      {/* Indoor Lighting - Warmer and softer */}
      <ambientLight intensity={0.7} color="#fff1e0" />
      
      {/* Main Shadows */}
      <directionalLight 
        position={[15, 30, 10]} 
        intensity={1.0} 
        color="#ffffff"
        castShadow 
        shadow-mapSize={[2048, 2048]}
      >
        <orthographicCamera attach="shadow-camera" args={[-30, 30, 30, -30]} />
      </directionalLight>

      {/* Fill Light for store vibe */}
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#dbeafe" distance={30} />

      {/* Floor - Tiled Look */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={15} // Less reflective than the arena
          roughness={0.7} // More matte (tile/wood)
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#334155" // Slate floor
          metalness={0.2}
          mirror={0.2} 
        />
      </mesh>
      
      {/* Subtle Grid for scale reference */}
      <gridHelper args={[100, 50, 0x475569, 0x1e293b]} position={[0, 0.01, 0]} />

      {/* Render Level Data */}
      {walls.map((wall, index) => (
        <mesh 
          key={index} 
          position={wall.position} 
          castShadow 
          receiveShadow
        >
          <boxGeometry args={wall.size} />
          <meshStandardMaterial 
            color={wall.color} 
            roughness={wall.type === 'prop' ? 0.5 : 0.9} 
            metalness={wall.type === 'prop' ? 0.3 : 0.1} 
          />
          {/* Add edges to props to make them look distinct */}
          <Edges 
            color={wall.type === 'prop' ? '#9ca3af' : '#d1d5db'} 
            threshold={15} 
            scale={1.001} 
          />
        </mesh>
      ))}

      {/* Human Player (Customer) */}
      <HumanPlayer 
        walls={walls} 
        position={[0, 0, 12]} // Start near entrance
        color="#0ea5e9" 
        forwardRef={humanPlayerRef}
        otherPlayers={[aiPlayerRef]}
      />

      {/* AI Player (Security Bot / Store Clerk) */}
      <AIPlayer 
        walls={walls} 
        position={[10, 0, -10]} // Start in back corner
        color="#ef4444" 
        targetRef={humanPlayerRef}
        active={aiActive}
        forwardRef={aiPlayerRef}
        otherPlayers={[humanPlayerRef]}
      />
      
      {/* Distance Fog - darker to hide the void */}
      <fog attach="fog" args={['#050505', 15, 60]} />
    </>
  );
};