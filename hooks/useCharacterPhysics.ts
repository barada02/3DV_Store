import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Mesh, Box3, Group } from 'three';
import { WallConfig } from '../components/LevelData';

const SPEED = 8;
const SPRINT_MULTIPLIER = 1.5;
const PLAYER_SIZE = 0.9;

export interface MoveInput {
  x: number; // -1 to 1 (Left/Right)
  z: number; // -1 to 1 (Forward/Backward)
  sprint: boolean;
}

export const useCharacterPhysics = (
  meshRef: React.RefObject<Group | Mesh | null>,
  walls: WallConfig[],
  inputRef: React.MutableRefObject<MoveInput>,
  initialPosition: [number, number, number]
) => {
  // Initialize reusable objects for GC performance
  const playerBox = useRef(new Box3()).current;
  const wallBox = useRef(new Box3()).current;
  const tempVector = useRef(new Vector3()).current;

  // Set initial position
  useMemo(() => {
    if (meshRef.current) {
        meshRef.current.position.set(...initialPosition);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const { x: inputX, z: inputZ, sprint } = inputRef.current;

    const currentSpeed = sprint ? SPEED * SPRINT_MULTIPLIER : SPEED;
    const distance = currentSpeed * delta;

    // Calculate intended movement
    // Note: inputX controls Left(-)/Right(+)
    // Note: inputZ controls Forward(-)/Backward(+)
    let dx = inputX * distance; 
    let dz = inputZ * distance; 

    // Idle Animation if no movement
    if (dx === 0 && dz === 0) {
        meshRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        meshRef.current.rotation.z *= 0.9;
        meshRef.current.rotation.x *= 0.9;
        return;
    }

    const currentPos = meshRef.current.position;

    // X Axis Collision (Slide Logic)
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

    // Z Axis Collision (Slide Logic)
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

    // Movement Animation (Bobbing and Tilting)
    meshRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 15) * 0.05;
    meshRef.current.rotation.z = -dx * 0.1;
    meshRef.current.rotation.x = dz * 0.1;
  });
};