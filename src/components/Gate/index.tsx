import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { GATE_POSITION } from '../../systems/collision/useCollision';
import gateTextureUrl from '../../assets/sprites/backgrounds/gate.webp';

export function Gate() {
  const stage = useGameStore((state) => state.stage);
  const isOpen = stage === 'gateOpen' || stage === 'complete';
  const groupRef = useRef<THREE.Group>(null);

  // Load the webp gate texture
  const tex = useTexture(gateTextureUrl);

  useEffect(() => {
    if (tex) {
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      tex.needsUpdate = true;
    }
  }, [tex]);

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    const cappedDt = Math.min(0.05, dt);

    // Slide the gate upwards when opened (closed y = -1.7, open y = 3.8)
    const targetY = isOpen ? GATE_POSITION[1]+1.2 : GATE_POSITION[1]+1.2;
    
    // Smooth lerping physics
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      5 * cappedDt
    );
  });

  return (
    <group
      ref={groupRef}
      position={[GATE_POSITION[0], GATE_POSITION[1],1]}
    >
      <sprite scale={[4, 4, 1]}>
        <spriteMaterial attach="material" map={tex} transparent />
      </sprite>
      <pointLight
        color={0xffd700}
        intensity={isOpen ? 1.8 : 0}
        distance={10}
        position={[0, -1, 1]}
      />
    </group>
  );
}

export default Gate;
