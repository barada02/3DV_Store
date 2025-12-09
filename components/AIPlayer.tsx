import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3, Group } from 'three';
import { Text } from '@react-three/drei';
import { WallConfig } from './LevelData';
import { useCharacterPhysics, MoveInput } from '../hooks/useCharacterPhysics';
import { CharacterModel } from './CharacterModel';

interface AIPlayerProps {
  walls: WallConfig[];
  position: [number, number, number];
  color: string;
  targetRef: React.RefObject<Group | Mesh | null>;
}

type AIState = 'CHASE' | 'UNSTICK';

export const AIPlayer: React.FC<AIPlayerProps> = ({ walls, position, color, targetRef }) => {
  const meshRef = useRef<Group>(null);
  const inputRef = useRef<MoveInput>({ x: 0, z: 0, sprint: false });
  
  // State Machine logic vars
  const [aiState, setAiState] = useState<AIState>('CHASE');
  
  // Refs for logic that doesn't need to trigger re-renders
  const stateTimer = useRef(0);
  const lastPosition = useRef(new Vector3(position[0], position[1], position[2]));
  const stuckTimer = useRef(0);
  const unstickDirection = useRef({ x: 0, z: 0 });

  useFrame((state, delta) => {
    if (!meshRef.current || !targetRef.current) return;

    // 1. Stuck Detection
    // Check if we haven't moved much in the last 0.5 seconds while trying to move
    const currentPos = meshRef.current.position;
    const distMoved = currentPos.distanceTo(lastPosition.current);
    lastPosition.current.copy(currentPos);

    // If we are chasing but barely moving, we are stuck
    if (aiState === 'CHASE' && distMoved < 0.01) {
        stuckTimer.current += delta;
        if (stuckTimer.current > 0.5) {
            // Switch to UNSTICK mode
            setAiState('UNSTICK');
            stuckTimer.current = 0;
            stateTimer.current = 1.0; // Unstick for 1 second
            
            // Pick a random direction
            unstickDirection.current = {
                x: (Math.random() - 0.5) * 2,
                z: (Math.random() - 0.5) * 2
            };
        }
    } else {
        stuckTimer.current = 0;
    }

    // 2. State Execution
    if (aiState === 'UNSTICK') {
        stateTimer.current -= delta;
        if (stateTimer.current <= 0) {
            setAiState('CHASE');
        }
        // Move in random direction
        inputRef.current = { 
            x: unstickDirection.current.x, 
            z: unstickDirection.current.z, 
            sprint: true 
        };
    } 
    else if (aiState === 'CHASE') {
        // Calculate vector to target
        const targetPos = targetRef.current.position;
        const dx = targetPos.x - currentPos.x;
        const dz = targetPos.z - currentPos.z;
        
        // Normalize vector
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        // Stop if very close
        if (distance < 1.5) {
            inputRef.current = { x: 0, z: 0, sprint: false };
        } else {
            inputRef.current = { 
                x: dx / distance, 
                z: dz / distance, 
                sprint: distance > 10 // Sprint if far away
            };
        }
    }
  });

  // Apply Physics
  useCharacterPhysics(meshRef, walls, inputRef, position);

  return (
    <group ref={meshRef}>
        <CharacterModel color={color} inputRef={inputRef} />
        
        {/* State Label */}
        <Text
            position={[0, 2, 0]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
        >
            {aiState}
        </Text>
    </group>
  );
};