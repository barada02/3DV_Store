import React from 'react';
import { MeshReflectorMaterial, Edges } from '@react-three/drei';
import { Player } from './Player';
import { walls } from './LevelData';

export const Scene: React.FC = () => {
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

      {/* Player 1 - Cyan (WASD) */}
      <Player 
        walls={walls} 
        position={[-3, 1, 0]} 
        color="#00e5ff" 
        controlScheme="wasd" 
      />

      {/* Player 2 - Orange (Arrows) */}
      <Player 
        walls={walls} 
        position={[3, 1, 0]} 
        color="#ff9100" 
        controlScheme="arrows" 
      />
      
      <fog attach="fog" args={['#111', 10, 50]} />
    </>
  );
};