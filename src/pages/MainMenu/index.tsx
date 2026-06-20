import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import logoImg from '../../assets/langquest-logo-one.png';



// Import background fallback assets
import {
  loadTextureSafely,
  drawSkyFallback,
  drawMountainsFallback,
  drawTreesFallback,
  drawBushesFallback,
} from '../../utils/assetLoader';
import { getGroundTexture } from '../../utils/textureGenerator';

// Module level texture caching for menu backgrounds
const menuSkyTex = loadTextureSafely('/src/assets/backgrounds/sky.png', drawSkyFallback, 64);
const menuMountainsTex = loadTextureSafely('/src/assets/backgrounds/mountains.png', drawMountainsFallback, 128);
const menuTreesTex = loadTextureSafely('/src/assets/backgrounds/trees.png', drawTreesFallback, 128);
const menuBushesTex = loadTextureSafely('/src/assets/backgrounds/bushes.png', drawBushesFallback, 128);

// =========================================================================
// AUDIO SYSTEM STRUCTURE & SOUND EFFECTS
// =========================================================================
// Future developers can instantiate standard HTML Audio elements here:
// const menuMusic = new Audio('/assets/audio/menu_music.mp3');
// const hoverSfx = new Audio('/assets/audio/hover.wav');
// const clickSfx = new Audio('/assets/audio/click.wav');

export const playMenuSound = (type: 'music_start' | 'music_stop' | 'hover' | 'click') => {
  console.log(`[Audio SFX] Triggered: ${type}`);
  // Implementation example:
  // if (type === 'hover') { hoverSfx.currentTime = 0; hoverSfx.play().catch(()=>{}); }
};

// =========================================================================
// MENU PARALLAX BACKGROUND
// =========================================================================
interface MenuParallaxProps {
  texture: THREE.Texture;
  speedFactor: number;
  yPosition: number;
  zPosition: number;
  planeWidth: number;
  planeHeight: number;
}

function MenuParallaxLayer({
  texture,
  speedFactor,
  yPosition,
  zPosition,
  planeWidth,
  planeHeight,
}: MenuParallaxProps) {
  const offsetRef = useRef<number>(0);

  useEffect(() => {
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.repeat.set((planeWidth / planeHeight) * 1.5, 1);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    }
  }, [texture, planeWidth, planeHeight]);

  useFrame((_, dt) => {
    if (texture) {
      const cappedDt = Math.min(0.05, dt);
      const scrollSpeed = 0.04; // Slow cinematic pan speed
      offsetRef.current -= cappedDt * speedFactor * scrollSpeed;
      texture.offset.x = offsetRef.current;
    }
  });

  return (
    <mesh position={[0, yPosition, zPosition]}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

// =========================================================================
// FIREFLIES & LIGHT PARTICLES
// =========================================================================
function MenuParticles() {
  const pCount = 30;
  const geoRef = useRef<THREE.BufferGeometry>(null);

  const initialPositions = useRef<Float32Array | null>(null);
  if (!initialPositions.current) {
    const pos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = -5 + Math.random() * 8;
      pos[i * 3 + 2] = 0.5;
    }
    initialPositions.current = pos;
  }

  useFrame((_, dt) => {
    if (!geoRef.current) return;
    const cappedDt = Math.min(0.05, dt);
    const attr = geoRef.current.getAttribute('position') as THREE.BufferAttribute;
    const array = attr.array as Float32Array;
    for (let i = 0; i < pCount; i++) {
      array[i * 3 + 1] += cappedDt * 0.35; // Rise gently
      array[i * 3] += Math.sin(array[i * 3 + 1] + i) * cappedDt * 0.2; // Sideways sway

      if (array[i * 3 + 1] > 3) {
        array[i * 3 + 1] = -5;
        array[i * 3] = (Math.random() - 0.5) * 20;
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
        color={0xffd700} // Golden fireflies
        size={0.12}
        transparent
        opacity={0.6}
      />
    </points>
  );
}



// =========================================================================
// MAIN MENU COMPONENT MAIN
// =========================================================================
interface MainMenuProps {
  onPlay: () => void;
}

export function MainMenu({ onPlay }: MainMenuProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [musicVol, setMusicVol] = useState(80);
  const [sfxVol, setSfxVol] = useState(90);
  const [lang, setLang] = useState('es');

  // Trigger main menu background music start (structural setup)
  useEffect(() => {
    playMenuSound('music_start');
    return () => {
      playMenuSound('music_stop');
    };
  }, []);

  const handlePlayClick = () => {
    playMenuSound('click');
    onPlay();
  };

  const handleOpenSettings = () => {
    playMenuSound('click');
    setShowSettings(true);
  };

  const handleOpenCredits = () => {
    playMenuSound('click');
    setShowCredits(true);
  };

  const groundTex = getGroundTexture();

  return (
    <div id="app" style={{ backgroundColor: '#0F0B1A' }}>
      {/* 3D Background Canvas */}
      <Canvas
        gl={{ antialias: false }}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <ambientLight color={0xffffff} intensity={0.8} />
        <directionalLight color={0xfff2cc} intensity={0.5} position={[5, 8, 6]} />

        {/* Orthographic Camera fixed on center */}
        <OrthographicCamera
          makeDefault
          left={-8}
          right={8}
          top={4.5}
          bottom={-4.5}
          near={-50}
          far={50}
          position={[0, -2, 10]}
        />

        {/* Autoscrolling Parallax layers */}
        <MenuParallaxLayer
          texture={menuSkyTex}
          speedFactor={0.05}
          yPosition={3.0}
          zPosition={-15}
          planeWidth={24}
          planeHeight={12}
        />
        <MenuParallaxLayer
          texture={menuMountainsTex}
          speedFactor={0.2}
          yPosition={0.5}
          zPosition={-12}
          planeWidth={24}
          planeHeight={9}
        />
        <MenuParallaxLayer
          texture={menuTreesTex}
          speedFactor={0.4}
          yPosition={-0.8}
          zPosition={-9}
          planeWidth={24}
          planeHeight={7}
        />
        <MenuParallaxLayer
          texture={menuBushesTex}
          speedFactor={0.65}
          yPosition={-1.8}
          zPosition={-6}
          planeWidth={24}
          planeHeight={5.5}
        />

        {/* Ground strip */}
        <mesh position={[0, -6.2, 0.5]}>
          <planeGeometry args={[24, 4]} />
          <meshBasicMaterial map={groundTex} transparent />
        </mesh>

        {/* Floating particles */}
        <MenuParticles />
      </Canvas>

      {/* 2D HTML Title Interface overlays */}
      <motion.div
        className="menu-overlay-ui"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Floating game title logo */}
        <motion.div
          className="menu-logo-wrapper"
          animate={{ y: [0, -10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: 'easeInOut',
          }}
        >
          <img
            src={logoImg}
            className="menu-logo-img"
            alt="LangQuest Logo"
          />
        </motion.div>

        {/* Buttons List */}
        <div className="menu-btn-list">
          <motion.button
            className="menu-rpg-btn primary"
            whileHover={{ scale: 1.05, filter: 'drop-shadow(0 0 16px rgba(244, 197, 66, 0.6))' }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => playMenuSound('hover')}
            onClick={handlePlayClick}
          >
            Play
          </motion.button>

          <motion.button
            className="menu-rpg-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => playMenuSound('hover')}
            onClick={handleOpenSettings}
          >
            Settings
          </motion.button>

          <motion.button
            className="menu-rpg-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => playMenuSound('hover')}
            onClick={handleOpenCredits}
          >
            Credits
          </motion.button>
        </div>
      </motion.div>

      {/* Modals Container */}
      <AnimatePresence>
        {/* Settings Modal */}
        {showSettings && (
          <motion.div
            className="menu-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="menu-modal-card"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            >
              <h2>Settings</h2>
              
              <div className="menu-modal-content">
                <div className="settings-row">
                  <label>Music Volume ({musicVol}%)</label>
                  <input
                    type="range"
                    className="settings-slider"
                    min="0"
                    max="100"
                    value={musicVol}
                    onChange={(e) => setMusicVol(Number(e.target.value))}
                  />
                </div>

                <div className="settings-row">
                  <label>Sound Effects ({sfxVol}%)</label>
                  <input
                    type="range"
                    className="settings-slider"
                    min="0"
                    max="100"
                    value={sfxVol}
                    onChange={(e) => setSfxVol(Number(e.target.value))}
                  />
                </div>

                <div className="settings-row">
                  <label>Target Language</label>
                  <select
                    className="settings-select"
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                  >
                    <option value="es">Spanish (Español)</option>
                    <option value="fr">French (Français)</option>
                    <option value="de">German (Deutsch)</option>
                    <option value="it">Italian (Italiano)</option>
                  </select>
                </div>
              </div>

              <button
                className="menu-rpg-btn"
                style={{ padding: '10px 20px', fontSize: '12px' }}
                onClick={() => {
                  playMenuSound('click');
                  setShowSettings(false);
                }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Credits Modal */}
        {showCredits && (
          <motion.div
            className="menu-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="menu-modal-card"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            >
              <h2>Credits</h2>
              
              <div className="menu-modal-content">
                <p className="credits-title">LangQuest</p>
                <p className="credits-creator">Created by Nijas TP</p>
                <p className="credits-tagline">Language Learning Through Adventure</p>
                <p style={{ fontSize: '9px', lineHeight: '1.6', color: 'var(--ink)' }}>
                  A side-scrolling RPG prototype refactored into React Three Fiber, Zustand, and Framer Motion. 
                  Journey through levels, interact with NPCs, complete grammatical quests, and learn vocabulary!
                </p>
              </div>

              <button
                className="menu-rpg-btn"
                style={{ padding: '10px 20px', fontSize: '12px' }}
                onClick={() => {
                  playMenuSound('click');
                  setShowCredits(false);
                }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MainMenu;
