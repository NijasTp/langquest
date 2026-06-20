import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Player } from '../../components/Player';
import { NPC } from '../../components/NPC';
import { Gate } from '../../components/Gate';
import { CameraController } from '../../systems/camera/CameraController';
import { ParallaxLayer } from '../../components/ParallaxLayer';
import {
  loadTextureSafely,
  drawSkyFallback,
  drawMountainsFallback,
  drawTreesFallback,
  drawBushesFallback,
} from '../../utils/assetLoader';
import {
  getGroundTexture,
  getTreeTexture,
  getRockTexture,
  getFlowerTexture,
} from '../../utils/textureGenerator';

// Module-level safe texture loading to prevent multiple loads and memory leaks
const skyTex = loadTextureSafely('/src/assets/backgrounds/sky.png', drawSkyFallback, 64);
const mountainsTex = loadTextureSafely('/src/assets/backgrounds/mountains.png', drawMountainsFallback, 128);
const treesTex = loadTextureSafely('/src/assets/backgrounds/trees.png', drawTreesFallback, 128);
const bushesTex = loadTextureSafely('/src/assets/backgrounds/bushes.png', drawBushesFallback, 128);

function ResponsiveCamera() {
  const { size } = useThree();
  const aspect = size.width / size.height;
  const VIEW = 8.5; // Slightly zoom in for a more cozy, cozy indie feel

  return (
    <OrthographicCamera
      key={`${size.width}-${size.height}`}
      makeDefault
      manual
      left={-VIEW * aspect}
      right={VIEW * aspect}
      top={VIEW}
      bottom={-VIEW}
      near={-50}
      far={50}
      position={[0, -2, 10]}
    />
  );
}

function AmbientParticles() {
  const pCount = 50;
  const geoRef = useRef<THREE.BufferGeometry>(null);

  const initialPositions = useRef<Float32Array | null>(null);
  if (!initialPositions.current) {
    const pos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      // Spread horizontally along the level track
      pos[i * 3] = -20 + Math.random() * 60;
      pos[i * 3 + 1] = -4 + Math.random() * 10;
      pos[i * 3 + 2] = 0.5; // Render in front of backgrounds
    }
    initialPositions.current = pos;
  }

  useFrame((_, dt) => {
    if (!geoRef.current) return;
    const cappedDt = Math.min(0.05, dt);
    const attr = geoRef.current.getAttribute('position') as THREE.BufferAttribute;
    const array = attr.array as Float32Array;
    for (let i = 0; i < pCount; i++) {
      // Gentle rising and floating leftwards
      array[i * 3 + 1] += cappedDt * 0.4;
      array[i * 3] -= cappedDt * 0.15;

      if (array[i * 3 + 1] > 6) {
        array[i * 3 + 1] = -4;
        array[i * 3] = -20 + Math.random() * 60;
      }
    }
    attr.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[initialPositions.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={0xffffff}
        size={0.1}
        transparent
        opacity={0.55}
      />
    </points>
  );
}

function Decorations() {
  // Horizontally spread trees along the platform baseline
  const treePositions = [-14, -8, -2, 10, 16, 21, 30];

  const flowerColors = ['#ff6f91', '#ffd166', '#ef476f', '#f78fb3'];
  const flowers = useRef<{ color: string; pos: [number, number, number] }[]>([]);
  if (flowers.current.length === 0) {
    for (let i = 0; i < 36; i++) {
      flowers.current.push({
        color: flowerColors[i % flowerColors.length],
        pos: [
          -18 + Math.random() * 54, // Cover walking span
          -4.2 + 0.35, // Adjust vertical height to rest on ground
          0.9,
        ],
      });
    }
  }

  const rocks = useRef<[number, number, number][]>([]);
  if (rocks.current.length === 0) {
    for (let i = 0; i < 10; i++) {
      rocks.current.push([
        -17 + Math.random() * 50,
        -4.2 + 0.5,
        0.8,
      ]);
    }
  }

  const treeTex = getTreeTexture();
  const rockTex = getRockTexture();

  return (
    <group>
      {/* Trees */}
      {treePositions.map((x, i) => (
        <sprite key={`tree-${i}`} scale={[3, 3, 1]} position={[x, -4.2 + 1.5, 0.7]}>
          <spriteMaterial attach="material" map={treeTex} transparent />
        </sprite>
      ))}
      {/* Flowers */}
      {flowers.current.map((f, i) => (
        <sprite key={`flower-${i}`} scale={[0.7, 0.7, 1]} position={f.pos}>
          <spriteMaterial attach="material" map={getFlowerTexture(f.color)} transparent />
        </sprite>
      ))}
      {/* Rocks */}
      {rocks.current.map((pos, i) => (
        <sprite key={`rock-${i}`} scale={[1, 1, 1]} position={pos}>
          <spriteMaterial attach="material" map={rockTex} transparent />
        </sprite>
      ))}
    </group>
  );
}

export function LevelOne() {
  const groundTex = getGroundTexture();

  return (
    <group>
      {/* Lights */}
      <ambientLight color={0xffffff} intensity={0.9} />
      <directionalLight color={0xfff2cc} intensity={0.65} position={[5, 8, 6]} />

      {/* Camera elements */}
      <ResponsiveCamera />
      <CameraController />

      {/* Parallax Background Layers */}
      <ParallaxLayer
        texture={skyTex}
        speedFactor={0.01}
        yPosition={3.0}
        zPosition={-15}
        planeWidth={54}
        planeHeight={27}
      />
      <ParallaxLayer
        texture={mountainsTex}
        speedFactor={0.12}
        yPosition={0.5}
        zPosition={-12}
        planeWidth={54}
        planeHeight={18}
      />
      <ParallaxLayer
        texture={treesTex}
        speedFactor={0.32}
        yPosition={-0.8}
        zPosition={-9}
        planeWidth={54}
        planeHeight={12}
      />
      <ParallaxLayer
        texture={bushesTex}
        speedFactor={0.55}
        yPosition={-1.8}
        zPosition={-6}
        planeWidth={54}
        planeHeight={9}
      />

      {/* Ground platform strip (baseline top at y = -4.2) */}
      <mesh position={[10, -6.2, 0.5]}>
        <planeGeometry args={[75, 4]} />
        <meshBasicMaterial map={groundTex} transparent />
      </mesh>

      {/* Environment props & decorations */}
      <Decorations />

      {/* Floating particles */}
      <AmbientParticles />

      {/* Interactive Entities */}
      <Player />
      <NPC />
      <Gate />
    </group>
  );
}

export default LevelOne;
