import React, { useRef, useEffect } from 'react';
import { Group, Mesh } from 'three';
import { ThreeElements } from '@react-three/fiber';
import { WallConfig } from './LevelData';
import useKeyboard from '../hooks/useKeyboard';
import { useCharacterPhysics, MoveInput } from '../hooks/useCharacterPhysics';
import { CharacterModel } from './CharacterModel';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

interface HumanPlayerProps {
  walls: WallConfig[];
  position: [number, number, number];
  color: string;
  // We expose the mesh ref so the AI can track this player
  forwardRef?: React.RefObject<Group | null>;
  otherPlayers?: React.RefObject<Group | Mesh | null>[];
}

export const HumanPlayer: React.FC<HumanPlayerProps> = ({ walls, position, color, forwardRef, otherPlayers = [] }) => {
  // Use the passed ref or create a new one if not provided
  const internalRef = useRef<Group>(null);
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
  useCharacterPhysics(meshRef, walls, inputRef, position, otherPlayers);

  return (
    <group ref={meshRef}>
        <CharacterModel color={color} inputRef={inputRef} />
        {/* Simple shadow/highlight to make it pop */}
        <pointLight position={[0, 2, 0]} intensity={2} distance={5} color={color} />
    </group>
  );
};