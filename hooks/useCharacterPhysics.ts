
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Mesh, Box3, Group, Quaternion, Euler } from 'three';
import { WallConfig } from '../components/LevelData';

const SPEED = 8;
const SPRINT_MULTIPLIER = 1.5;
// Increased collision box size to match the visual scale (0.6) better and prevent clipping
const PLAYER_SIZE = 0.8; 

export interface MoveInput {
  x: number; // -1 to 1 (Left/Right)
  z: number; // -1 to 1 (Forward/Backward)
  sprint: boolean;
}

export const useCharacterPhysics = (
  meshRef: React.RefObject<Group | Mesh | null>,
  walls: WallConfig[],
  inputRef: React.MutableRefObject<MoveInput>,
  initialPosition: [number, number, number],
  dynamicObstacles: React.RefObject<Group | Mesh | null>[] = []
) => {
  // Initialize reusable objects for GC performance
  const playerBox = useRef(new Box3()).current;
  const wallBox = useRef(new Box3()).current;
  const tempVector = useRef(new Vector3()).current;
  
  // Rotation Maths
  const targetQuaternion = useRef(new Quaternion()).current;
  const rotationEuler = useRef(new Euler(0, 0, 0)).current;

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
    let dx = inputX * distance; 
    let dz = inputZ * distance; 

    // Idle Animation if no movement
    if (dx === 0 && dz === 0) {
        // Subtle breathing animation
        meshRef.current.position.y = Math.max(0, Math.sin(state.clock.elapsedTime * 2) * 0.02);
        return;
    }

    const currentPos = meshRef.current.position;
    
    // Helper to check collision
    const checkCollision = (tempPos: Vector3) => {
        // Create player bounding box at temporary position
        // We lift the box slightly (y+1) so it catches walls but doesn't drag on floor
        const center = tempPos.clone().add(new Vector3(0, 1, 0));
        playerBox.setFromCenterAndSize(center, new Vector3(PLAYER_SIZE, 2, PLAYER_SIZE));
        
        // 1. Static Walls & Props
        for (const wall of walls) {
            wallBox.setFromCenterAndSize(new Vector3(...wall.position), new Vector3(...wall.size));
            if (playerBox.intersectsBox(wallBox)) return true;
        }
        
        // 2. Dynamic Obstacles (Other Players)
        for (const obstacle of dynamicObstacles) {
            if (obstacle.current && obstacle.current !== meshRef.current) {
                const obsPos = obstacle.current.position;
                // Assume obstacles are roughly same size
                const obsCenter = obsPos.clone().add(new Vector3(0, 1, 0));
                
                wallBox.setFromCenterAndSize(obsCenter, new Vector3(PLAYER_SIZE, 2, PLAYER_SIZE));
                
                if (playerBox.intersectsBox(wallBox)) {
                    // STUCK FIX: 
                    // If we are intersecting, standard logic would just return 'true' and block ALL movement.
                    // This causes players to stick together if they accidentally overlap.
                    // FIX: We calculate if the intended move increases the distance between players.
                    // If moving AWAY, we allow it.
                    
                    const dx = tempPos.x - obsPos.x;
                    const dz = tempPos.z - obsPos.z;
                    const newDistSq = dx * dx + dz * dz;

                    const oldDx = currentPos.x - obsPos.x;
                    const oldDz = currentPos.z - obsPos.z;
                    const oldDistSq = oldDx * oldDx + oldDz * oldDz;

                    // If new distance is greater than old distance, we are separating.
                    // Add a tiny epsilon to handle floating point precision
                    if (newDistSq > oldDistSq + 0.0001) {
                        continue; // Ignore this collision, allow movement
                    }

                    return true; // Moving closer or staying put? Block it.
                }
            }
        }
        
        return false;
    };

    // X Axis Collision (Slide Logic)
    if (dx !== 0) {
      tempVector.set(currentPos.x + dx, currentPos.y, currentPos.z);
      if (!checkCollision(tempVector)) {
          meshRef.current.position.x += dx;
      }
    }

    // Z Axis Collision (Slide Logic)
    if (dz !== 0) {
      tempVector.set(meshRef.current.position.x, currentPos.y, currentPos.z + dz);
      if (!checkCollision(tempVector)) {
          meshRef.current.position.z += dz;
      }
    }

    // Walking Bobbing Animation
    meshRef.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 15) * 0.08);
    
    // Smooth Rotation Logic
    const angle = Math.atan2(dx, dz);
    rotationEuler.set(0, angle, 0);
    targetQuaternion.setFromEuler(rotationEuler);
    meshRef.current.quaternion.slerp(targetQuaternion, 0.15);
  });
};
