import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Mesh, Box3 } from 'three';
import useKeyboard from '../hooks/useKeyboard';
import { RoundedBox } from '@react-three/drei';
import { WallConfig } from './LevelData';

const SPEED = 8;
const SPRINT_MULTIPLIER = 1.5;
const PLAYER_SIZE = 0.9;

interface PlayerProps {
  walls: WallConfig[];
  position: [number, number, number];
  color: string;
  controlScheme: 'wasd' | 'arrows';
}

export const Player: React.FC<PlayerProps> = ({ walls, position, color, controlScheme }) => {
  const meshRef = useRef<Mesh>(null);
  
  // Pass the specific control scheme to the hook
  const { moveForward, moveBackward, moveLeft, moveRight, sprint } = useKeyboard(controlScheme);
  
  // Initialize reusable objects
  const playerBox = useRef(new Box3()).current;
  const wallBox = useRef(new Box3()).current;
  const tempVector = useRef(new Vector3()).current;

  // Set initial position only once on mount
  useMemo(() => {
    if (meshRef.current) {
        meshRef.current.position.set(...position);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const currentSpeed = sprint ? SPEED * SPRINT_MULTIPLIER : SPEED;
    const distance = currentSpeed * delta;

    let dx = 0;
    let dz = 0;

    if (moveForward) dz -= distance;
    if (moveBackward) dz += distance;
    if (moveLeft) dx -= distance;
    if (moveRight) dx += distance;

    if (dx === 0 && dz === 0) {
        meshRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 3 + (controlScheme === 'arrows' ? 2 : 0)) * 0.05;
        meshRef.current.rotation.z *= 0.9;
        meshRef.current.rotation.x *= 0.9;
        return;
    }

    const currentPos = meshRef.current.position;

    // X Axis Collision
    if (dx !== 0) {
      tempVector.set(currentPos.x + dx, currentPos.y, currentPos.z);
      playerBox.setFromCenterAndSize(tempVector, new Vector3(PLAYER_SIZE, PLAYER_SIZE, PLAYER_SIZE));
      
      let collisionX = false;
      for (const wall of walls) {
        wallBox.setFromCenterAndSize(new Vector3(...wall.position), new Vector3(...wall.size));
        if (playerBox.intersectsBox(wallBox)) {
          collisionX = true;
          break;
        }
      }
      
      if (!collisionX) meshRef.current.position.x += dx;
    }

    // Z Axis Collision
    if (dz !== 0) {
      tempVector.set(meshRef.current.position.x, currentPos.y, currentPos.z + dz);
      playerBox.setFromCenterAndSize(tempVector, new Vector3(PLAYER_SIZE, PLAYER_SIZE, PLAYER_SIZE));
      
      let collisionZ = false;
      for (const wall of walls) {
        wallBox.setFromCenterAndSize(new Vector3(...wall.position), new Vector3(...wall.size));
        if (playerBox.intersectsBox(wallBox)) {
          collisionZ = true;
          break;
        }
      }
      
      if (!collisionZ) meshRef.current.position.z += dz;
    }

    // Animation
    meshRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 15) * 0.05;
    meshRef.current.rotation.z = -dx * 0.1;
    meshRef.current.rotation.x = dz * 0.1;
  });

  return (
    <RoundedBox 
      args={[1, 1, 1]} 
      radius={0.15} 
      smoothness={4} 
      ref={meshRef} 
      position={position} 
      castShadow 
      receiveShadow
    >
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={sprint ? 0.8 : 0.4}
        roughness={0.2}
        metalness={0.8}
      />
    </RoundedBox>
  );
};