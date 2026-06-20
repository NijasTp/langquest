import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGameStore } from './store/gameStore';
import { LevelOne } from './scenes/LevelOne';
import { HUD } from './components/HUD';
import { QuestTracker } from './components/QuestTracker';
import { Dialogue } from './components/Dialogue';
import { Quiz } from './components/Quiz';
import { Prompt } from './components/HUD/Prompt';
import { PauseMenu } from './components/PauseMenu';
import { LevelComplete } from './components/HUD/LevelComplete';
import { checkNpcProximity } from './systems/collision/useCollision';
import { MainMenu } from './pages/MainMenu';
import { MobileControls } from './components/MobileControls';
import { OrientationOverlay } from './components/OrientationOverlay';

export function App() {
  const [route, setRoute] = useState<'menu' | 'game'>('menu');

  // Key press listener for NPC interaction trigger ('E')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e') {
        const { stage, paused, playerPosition, setStage } = useGameStore.getState();
        if (!paused && stage === 'explore' && route === 'game') {
          const [px, py] = playerPosition;
          if (checkNpcProximity(px, py)) {
            setStage('dialogue');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [route]);

  if (route === 'menu') {
    return (
      <div id="app" style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
        <MainMenu
          onPlay={() => {
            useGameStore.getState().resetStore();
            setRoute('game');
          }}
        />
        <OrientationOverlay />
      </div>
    );
  }

  return (
    <div id="app" style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 3D Scene Viewport */}
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
        <LevelOne />
      </Canvas>

      {/* 2D HTML Dashboard Interfaces */}
      <HUD />
      <QuestTracker />
      <Dialogue />
      <Quiz />
      <Prompt />
      <PauseMenu />
      <LevelComplete />
      
      {/* Mobile control keys and overlays */}
      <MobileControls />
      <OrientationOverlay />
    </div>
  );
}

export default App;
