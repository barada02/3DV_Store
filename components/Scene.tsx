import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial, Stars, Float } from '@react-three/drei';
import { Color, Mesh } from 'three';
import { Player } from './Player';

const FloatingShape = ({ position, color, speed }: { position: [number, number, number], color: string, speed: number }) => {
  const mesh = useRef<Mesh>(null);
  useFrame((state) => {
    if(mesh.current) {
        mesh.current.rotation.x += 0.01 * speed;
        mesh.current.rotation.y += 0.02 * speed;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={1}>
        <mesh ref={mesh} position={position} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.5} />
        </mesh>
    </Float>
  );
};

export const Scene: React.FC = () => {
  return (
    <>
      <color attach="background" args={['#050505']} />
      
      {/* Ambient Light for base visibility */}
      <ambientLight intensity={0.2} />
      
      {/* Directional Light acting as a "Sun" or main spotlight */}
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      >
        <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
      </directionalLight>

      {/* Fancy Reflective Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
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
          mirror={1} 
        />
      </mesh>

      {/* Grid Helper for spatial reference */}
      <gridHelper args={[50, 50, 0x404040, 0x202020]} position={[0, 0.01, 0]} />

      {/* The Player Character */}
      <Player />

      {/* Decorative Floating Objects */}
      <FloatingShape position={[-5, 3, -5]} color="#ff0055" speed={2} />
      <FloatingShape position={[8, 4, -8]} color="#5500ff" speed={1.5} />
      <FloatingShape position={[-8, 2, 8]} color="#00ff55" speed={3} />
      <FloatingShape position={[5, 5, 5]} color="#ffff00" speed={1} />

      {/* Environmental Effects */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <fog attach="fog" args={['#050505', 10, 50]} />
    </>
  );
};