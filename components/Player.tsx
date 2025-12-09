
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Mesh, Box3 } from 'three';
import useKeyboard from '../hooks/useKeyboard';
import { RoundedBox } from '@react-three/drei';
import { WallConfig } from './LevelData';

const SPEED = 8;
const SPRINT_MULTIPLIER = 1.5;
const PLAYER_SIZE = 0.9; // Slightly smaller than visual size (1.0) to avoid getting stuck

interface PlayerProps {
  walls: WallConfig[];
}

export const Player: React.FC<PlayerProps> = ({ walls }) => {
  const meshRef = useRef<Mesh>(null);
  const { moveForward, moveBackward, moveLeft, moveRight, sprint } = useKeyboard();
  
  // Reuse Box3 objects to prevent garbage collection every frame
  const playerBox = useRef(new Box3()).current;
  const wallBox = useRef(new Box3()).current;
  const tempVector = useRef(new Vector3()).current;

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const currentSpeed = sprint ? SPEED * SPRINT_MULTIPLIER : SPEED;
    const distance = currentSpeed * delta;

    // 1. Calculate desired movement for this frame
    let dx = 0;
    let dz = 0;

    if (moveForward) dz -= distance;
    if (moveBackward) dz += distance;
    if (moveLeft) dx -= distance;
    if (moveRight) dx += distance;

    // If no movement, just animate and return
    if (dx === 0 && dz === 0) {
        meshRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
        // Reset rotation slowly
        meshRef.current.rotation.z *= 0.9;
        meshRef.current.rotation.x *= 0.9;
        return;
    }

    const currentPos = meshRef.current.position;

    // 2. Collision Detection - Axis Independent (X Axis)
    // We check X and Z separately to allow "sliding" along walls
    if (dx !== 0) {
      tempVector.set(currentPos.x + dx, currentPos.y, currentPos.z);
      // Create a bounding box for where the player WOULD be
      playerBox.setFromCenterAndSize(tempVector, new Vector3(PLAYER_SIZE, PLAYER_SIZE, PLAYER_SIZE));
      
      let collisionX = false;
      for (const wall of walls) {
        // Construct wall box (could be cached, but cheap enough here)
        wallBox.setFromCenterAndSize(
            new Vector3(...wall.position), 
            new Vector3(...wall.size)
        );
        
        if (playerBox.intersectsBox(wallBox)) {
          collisionX = true;
          break;
        }
      }
      
      if (!collisionX) {
        meshRef.current.position.x += dx;
      }
    }

    // 3. Collision Detection - Axis Independent (Z Axis)
    if (dz !== 0) {
      // Note: We use the POTENTIALLY UPDATED x position here
      tempVector.set(meshRef.current.position.x, currentPos.y, currentPos.z + dz);
      playerBox.setFromCenterAndSize(tempVector, new Vector3(PLAYER_SIZE, PLAYER_SIZE, PLAYER_SIZE));
      
      let collisionZ = false;
      for (const wall of walls) {
        wallBox.setFromCenterAndSize(
            new Vector3(...wall.position), 
            new Vector3(...wall.size)
        );
        
        if (playerBox.intersectsBox(wallBox)) {
          collisionZ = true;
          break;
        }
      }
      
      if (!collisionZ) {
        meshRef.current.position.z += dz;
      }
    }

    // Animation: Bobbing
    meshRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 15) * 0.05;
    
    // Animation: Tilt based on movement
    meshRef.current.rotation.z = -dx * 0.1;
    meshRef.current.rotation.x = dz * 0.1;
  });

  return (
    <RoundedBox 
      args={[1, 1, 1]} 
      radius={0.15} 
      smoothness={4} 
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
