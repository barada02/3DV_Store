import React, { useRef } from 'react';
import { useFrame, ThreeElements } from '@react-three/fiber';
import { Group, MathUtils } from 'three';
import { MoveInput } from '../hooks/useCharacterPhysics';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

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

  useFrame((state) => {
    const { x, z, sprint } = inputRef.current;
    const isMoving = x !== 0 || z !== 0;
    const speed = sprint ? 20 : 10;
    const time = state.clock.elapsedTime;

    if (isMoving) {
        // Run Cycle
        const angle = Math.sin(time * speed);
        if(leftLeg.current) leftLeg.current.rotation.x = angle * 0.8;
        if(rightLeg.current) rightLeg.current.rotation.x = -angle * 0.8;
        if(leftArm.current) leftArm.current.rotation.x = -angle * 0.8;
        if(rightArm.current) rightArm.current.rotation.x = angle * 0.8;
    } else {
        // Idle Reset (Lerp back to zero)
        if(leftLeg.current) leftLeg.current.rotation.x = MathUtils.lerp(leftLeg.current.rotation.x, 0, 0.1);
        if(rightLeg.current) rightLeg.current.rotation.x = MathUtils.lerp(rightLeg.current.rotation.x, 0, 0.1);
        if(leftArm.current) leftArm.current.rotation.x = MathUtils.lerp(leftArm.current.rotation.x, 0, 0.1);
        if(rightArm.current) rightArm.current.rotation.x = MathUtils.lerp(rightArm.current.rotation.x, 0, 0.1);
    }
  });

  return (
    <group dispose={null} scale={0.4} position={[0, -0.4, 0]}>
        {/* Head */}
        <group position={[0, 2.8, 0]} ref={head}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[1.2, 1, 1]} />
                <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
            </mesh>
            {/* Visor/Eyes */}
            <mesh position={[0, 0, 0.45]} receiveShadow>
                <boxGeometry args={[0.8, 0.25, 0.2]} />
                <meshStandardMaterial color="black" roughness={0.2} />
            </mesh>
        </group>

        {/* Body */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[1, 1.5, 0.6]} />
            <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
        </mesh>

        {/* Arms */}
        <group position={[-0.6, 2.2, 0]} ref={leftArm}>
            <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.35, 1.2, 0.35]} />
                <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
            </mesh>
            {/* Hand */}
             <mesh position={[0, -1.3, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.3, 0.3, 0.3]} />
                <meshStandardMaterial color="#222" />
            </mesh>
        </group>
        <group position={[0.6, 2.2, 0]} ref={rightArm}>
            <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.35, 1.2, 0.35]} />
                <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
            </mesh>
             {/* Hand */}
             <mesh position={[0, -1.3, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.3, 0.3, 0.3]} />
                <meshStandardMaterial color="#222" />
            </mesh>
        </group>

        {/* Legs */}
        <group position={[-0.3, 0.8, 0]} ref={leftLeg}>
             <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.35, 1.2, 0.35]} />
                <meshStandardMaterial color="#333" />
            </mesh>
        </group>
        <group position={[0.3, 0.8, 0]} ref={rightLeg}>
             <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.35, 1.2, 0.35]} />
                <meshStandardMaterial color="#333" />
            </mesh>
        </group>
    </group>
  );
};