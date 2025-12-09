import React, { useRef, useEffect } from 'react';
import { Mesh } from 'three';
import { RoundedBox } from '@react-three/drei';
import { WallConfig } from './LevelData';
import useKeyboard from '../hooks/useKeyboard';
import { useCharacterPhysics, MoveInput } from '../hooks/useCharacterPhysics';

interface HumanPlayerProps {
  walls: WallConfig[];
  position: [number, number, number];
  color: string;
  // We expose the mesh ref so the AI can track this player
  forwardRef?: React.RefObject<Mesh | null>;
}

export const HumanPlayer: React.FC<HumanPlayerProps> = ({ walls, position, color, forwardRef }) => {
  // Use the passed ref or create a new one if not provided
  const internalRef = useRef<Mesh>(null);
  const meshRef = forwardRef || internalRef;
  
  // Input Handling
  const { moveForward, moveBackward, moveLeft, moveRight, sprint } = useKeyboard('wasd');
  
  // We use a ref for input to communicate with the physics hook without re-rendering the physics loop
  const inputRef = useRef<MoveInput>({ x: 0, z: 0, sprint: false });

  useEffect(() => {
    // Map boolean keys to axis (-1, 0, 1)
    let x = 0;
    let z = 0;
    if (moveLeft) x -= 1;
    if (moveRight) x += 1;
    if (moveForward) z -= 1;
    if (moveBackward) z += 1;

    inputRef.current = { x, z, sprint };
  }, [moveForward, moveBackward, moveLeft, moveRight, sprint]);

  // Apply Physics
  useCharacterPhysics(meshRef, walls, inputRef, position);

  return (
    <RoundedBox 
      args={[1, 1, 1]} 
      radius={0.15} 
      smoothness={4} 
      ref={meshRef} 
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