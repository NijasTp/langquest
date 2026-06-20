import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { NPC_POSITION } from '../../systems/collision/useCollision';
import owletIdleUrl from '../../assets/sprites/player/Owlet_Monster_Idle_4.png';

export function NPC() {
  const spriteRef = useRef<THREE.Sprite>(null);
  const bobTRef = useRef<number>(0);

  // Load Owlet Monster Idle spritesheet
  const tex = useTexture(owletIdleUrl);

  useEffect(() => {
    if (tex) {
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.repeat.set(1 / 4, 1); // 4 idle frames horizontally
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
    }
  }, [tex]);

  useFrame((_, dt) => {
    const cappedDt = Math.min(0.05, dt);
    bobTRef.current += cappedDt;
    
    if (spriteRef.current && tex) {
      // NPC baseline is -4.2, offset y by +0.8 so feet align with ground, then add bobbing
      spriteRef.current.position.y = NPC_POSITION[1] + 0.8 + Math.sin(bobTRef.current * 2) * 0.06;

      // Animate frame offset
      const frameIndex = Math.floor(bobTRef.current * 6) % 4;

      // Flip texture repeat horizontally so he faces left (opposite direction)
      tex.repeat.x = -1 / 4;
      tex.offset.x = (frameIndex + 1) / 4;
      tex.needsUpdate = true;

      // Ensure material uses texture
      if (spriteRef.current.material.map !== tex) {
        spriteRef.current.material.map = tex;
        spriteRef.current.material.needsUpdate = true;
      }
    }
  });

  return (
    <sprite
      ref={spriteRef}
      position={[NPC_POSITION[0], NPC_POSITION[1] + 0.8, 1]}
      scale={[1.6, 1.6, 1]}
    >
      <spriteMaterial attach="material" map={tex} transparent />
    </sprite>
  );
}

export default NPC;
