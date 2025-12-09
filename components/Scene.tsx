import React, { useRef } from 'react';
import { Group } from 'three';
import { MeshReflectorMaterial, Edges } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';
import { HumanPlayer } from './HumanPlayer';
import { AIPlayer } from './AIPlayer';
import { walls } from './LevelData';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

export const Scene: React.FC = () => {
  // We need a reference to the human player to pass to the AI
  const humanPlayerRef = useRef<Group>(null);

  return (
    <>
      <color attach="background" args={['#111']} />
      
      <ambientLight intensity={0.5} />
      
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      >
        <orthographicCamera attach="shadow-camera" args={[-25, 25, 25, -25]} />
      </directionalLight>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#151515"
          metalness={0.5}
          mirror={0.5} 
        />
      </mesh>

      <gridHelper args={[100, 100, 0x333333, 0x111111]} position={[0, 0.01, 0]} />

      {/* Walls */}
      {walls.map((wall, index) => (
        <mesh 
          key={index} 
          position={wall.position} 
          castShadow 
          receiveShadow
        >
          <boxGeometry args={wall.size} />
          <meshStandardMaterial color={wall.color} roughness={0.2} metalness={0.1} />
          <Edges 
            color="white" 
            threshold={15} 
            scale={1.01} 
          />
        </mesh>
      ))}

      {/* Human Player (WASD) */}
      <HumanPlayer 
        walls={walls} 
        position={[-6, 1, 6]} 
        color="#00e5ff" 
        forwardRef={humanPlayerRef}
      />

      {/* AI Player (Chaser) */}
      <AIPlayer 
        walls={walls} 
        position={[6, 1, -6]} 
        color="#ff3366" 
        targetRef={humanPlayerRef}
      />
      
      <fog attach="fog" args={['#111', 10, 50]} />
    </>
  );
};