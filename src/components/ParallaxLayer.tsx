import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParallaxLayerProps {
  texture: THREE.Texture;
  speedFactor: number; // 0: moves with camera (infinitely far), 1: static in world coordinates
  yPosition: number;
  zPosition: number;
  planeWidth: number;
  planeHeight: number;
}

export function ParallaxLayer({
  texture,
  speedFactor,
  yPosition,
  zPosition,
  planeWidth,
  planeHeight,
}: ParallaxLayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      // Make it repeat based on dimension ratio to avoid visual distortion
      texture.repeat.set(planeWidth / planeHeight, 1);
      texture.needsUpdate = true;
    }
  }, [texture, planeWidth, planeHeight]);

  useFrame(({ camera }) => {
    if (meshRef.current && texture) {
      // Pin background plane to camera horizontal coordinate
      meshRef.current.position.x = camera.position.x;
      
      // Calculate dynamic scrolling offset for orthographic camera depth simulation
      const scrollScale = 0.035;
      texture.offset.x = -camera.position.x * speedFactor * scrollScale;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, yPosition, zPosition]}
    >
      <planeGeometry args={[planeWidth, planeHeight]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

export default ParallaxLayer;
