import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Mesh } from 'three';
import useKeyboard from '../hooks/useKeyboard';
import { RoundedBox } from '@react-three/drei';

const SPEED = 5;
const SPRINT_MULTIPLIER = 2;

export const Player: React.FC = () => {
  const meshRef = useRef<Mesh>(null);
  const { moveForward, moveBackward, moveLeft, moveRight, sprint } = useKeyboard();
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const currentSpeed = sprint ? SPEED * SPRINT_MULTIPLIER : SPEED;
    const distance = currentSpeed * delta;

    const moveVector = new Vector3(0, 0, 0);

    if (moveForward) moveVector.z -= distance;
    if (moveBackward) moveVector.z += distance;
    if (moveLeft) moveVector.x -= distance;
    if (moveRight) moveVector.x += distance;

    // Normalize diagonal movement so it's not faster
    if (moveVector.length() > 0) {
      // If we are moving diagonally, the components are already set, 
      // but we need to ensure we don't exceed 'distance' length per frame logic strictly, 
      // although simpler arithmetic is often preferred for simple games.
      // Here we just add the vector. For stricter controls, we would normalize direction and multiply by scalar speed.
    }

    meshRef.current.position.add(moveVector);
    
    // Simple boundary to keep player on the main floor area
    meshRef.current.position.x = Math.max(-24, Math.min(24, meshRef.current.position.x));
    meshRef.current.position.z = Math.max(-24, Math.min(24, meshRef.current.position.z));

    // Subtle bobbing animation
    meshRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.1;
    
    // Rotate slightly based on movement for visual flair
    meshRef.current.rotation.z = -moveVector.x * 0.5;
    meshRef.current.rotation.x = moveVector.z * 0.5;
  });

  return (
    <RoundedBox 
      args={[1, 1, 1]} // Width, Height, Depth
      radius={0.15} // Radius of the rounded corners
      smoothness={4} // Number of subdivisions
      ref={meshRef} 
      position={[0, 1, 0]} 
      castShadow 
      receiveShadow
    >
      <meshStandardMaterial 
        color={sprint ? "#ff4081" : "#00e5ff"} 
        emissive={sprint ? "#ff4081" : "#00e5ff"}
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.8}
      />
    </RoundedBox>
  );
};