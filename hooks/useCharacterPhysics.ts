import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Mesh, Box3, Group, Quaternion, Euler } from 'three';
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
    // Note: inputX controls Left(-)/Right(+)
    // Note: inputZ controls Forward(-)/Backward(+)
    let dx = inputX * distance; 
    let dz = inputZ * distance; 

    // Idle Animation if no movement
    if (dx === 0 && dz === 0) {
        meshRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        // When idle, we stop updating rotation so it stays facing the last direction
        return;
    }

    const currentPos = meshRef.current.position;
    
    // Helper to check collision with both static walls and dynamic obstacles
    const checkCollision = (tempPos: Vector3) => {
        playerBox.setFromCenterAndSize(tempPos, new Vector3(PLAYER_SIZE, PLAYER_SIZE, PLAYER_SIZE));
        
        // 1. Static Walls
        for (const wall of walls) {
            wallBox.setFromCenterAndSize(new Vector3(...wall.position), new Vector3(...wall.size));
            if (playerBox.intersectsBox(wallBox)) return true;
        }
        
        // 2. Dynamic Obstacles (Other Players)
        for (const obstacle of dynamicObstacles) {
            if (obstacle.current && obstacle.current !== meshRef.current) {
                wallBox.setFromCenterAndSize(obstacle.current.position, new Vector3(PLAYER_SIZE, PLAYER_SIZE, PLAYER_SIZE));
                 if (playerBox.intersectsBox(wallBox)) return true;
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

    // Movement Animation (Bobbing)
    meshRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 15) * 0.05;
    
    // Smooth Rotation Logic
    // 1. Calculate the target angle based on movement vector (dx, dz)
    const angle = Math.atan2(dx, dz);
    
    // 2. Create a rotation quaternion from that angle (Around Y axis)
    rotationEuler.set(0, angle, 0);
    targetQuaternion.setFromEuler(rotationEuler);
    
    // 3. Smoothly interpolate (Slerp) current rotation to target rotation
    // 0.15 is the "smoothness" factor. Lower = slower turn, Higher = snappier.
    meshRef.current.quaternion.slerp(targetQuaternion, 0.15);
  });
};