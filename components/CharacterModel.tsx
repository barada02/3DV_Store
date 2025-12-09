/// <reference types="@react-three/fiber" />
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils } from 'three';
import { MoveInput } from '../hooks/useCharacterPhysics';

interface CharacterModelProps {
  color: string;
  inputRef: React.MutableRefObject<MoveInput>;
}

export const CharacterModel: React.FC<CharacterModelProps> = ({ color, inputRef }) => {
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const head = useRef<Group>(null);

  // Geometry Constants to ensure feet at Y=0
  // Leg Height: 1.2
  // Hip Height (Pivot): 1.2
  // Torso Height: 1.5 (starts at 1.2, ends at 2.7)
  // Head Height: 1.0 (starts at 2.7, ends at 3.7)
  // Total Height: 3.7 units

  useFrame((state) => {
    const { x, z, sprint } = inputRef.current;
    const isMoving = x !== 0 || z !== 0;
    const speed = sprint ? 20 : 10;
    const time = state.clock.elapsedTime;

    if (isMoving) {
        // Run Cycle
        const angle = Math.sin(time * speed);
        // Arms
        if(leftArm.current) leftArm.current.rotation.x = -angle * 0.8;
        if(rightArm.current) rightArm.current.rotation.x = angle * 0.8;
        
        // Legs (Opposite to arms)
        if(leftLeg.current) leftLeg.current.rotation.x = angle * 0.8;
        if(rightLeg.current) rightLeg.current.rotation.x = -angle * 0.8;
    } else {
        // Idle Reset
        if(leftLeg.current) leftLeg.current.rotation.x = MathUtils.lerp(leftLeg.current.rotation.x, 0, 0.1);
        if(rightLeg.current) rightLeg.current.rotation.x = MathUtils.lerp(rightLeg.current.rotation.x, 0, 0.1);
        if(leftArm.current) leftArm.current.rotation.x = MathUtils.lerp(leftArm.current.rotation.x, 0, 0.1);
        if(rightArm.current) rightArm.current.rotation.x = MathUtils.lerp(rightArm.current.rotation.x, 0, 0.1);
    }
  });

  return (
    // Scale 0.6 -> approx 2.22 units tall (3.7 * 0.6)
    <group dispose={null} scale={0.6} position={[0, 0, 0]}> 
        
        {/* --- HEAD --- */}
        <group position={[0, 3.2, 0]} ref={head}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[1.2, 1, 1]} />
                <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
            </mesh>
            {/* Visor */}
            <mesh position={[0, 0, 0.45]} receiveShadow>
                <boxGeometry args={[0.8, 0.25, 0.2]} />
                <meshStandardMaterial color="black" roughness={0.2} />
            </mesh>
        </group>

        {/* --- TORSO --- */}
        {/* Center of 1.5h box resting on y=1.2 is 1.2 + 0.75 = 1.95 */}
        <mesh position={[0, 1.95, 0]} castShadow receiveShadow>
            <boxGeometry args={[1, 1.5, 0.6]} />
            <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
        </mesh>

        {/* --- ARMS --- */}
        {/* Pivot at Shoulder (approx y=2.5) */}
        <group position={[-0.65, 2.5, 0]} ref={leftArm}>
            <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.35, 1.2, 0.35]} />
                <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
            </mesh>
             <mesh position={[0, -1.3, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.3, 0.3, 0.3]} />
                <meshStandardMaterial color="#222" />
            </mesh>
        </group>
        <group position={[0.65, 2.5, 0]} ref={rightArm}>
            <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.35, 1.2, 0.35]} />
                <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
            </mesh>
             <mesh position={[0, -1.3, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.3, 0.3, 0.3]} />
                <meshStandardMaterial color="#222" />
            </mesh>
        </group>

        {/* --- LEGS --- */}
        {/* Pivot at Hip (y=1.2) */}
        <group position={[-0.3, 1.2, 0]} ref={leftLeg}>
             {/* Leg mesh center is -0.6 relative to hip, placing feet at -1.2 relative to hip (0 global) */}
             <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.35, 1.2, 0.35]} />
                <meshStandardMaterial color="#333" />
            </mesh>
        </group>
        <group position={[0.3, 1.2, 0]} ref={rightLeg}>
             <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.35, 1.2, 0.35]} />
                <meshStandardMaterial color="#333" />
            </mesh>
        </group>
    </group>
  );
};