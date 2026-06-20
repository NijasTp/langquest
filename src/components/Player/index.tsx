import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { useMovement } from '../../systems/movement/useMovement';
import { checkNpcProximity } from '../../systems/collision/useCollision';

import walkSheetUrl from '../../assets/sprites/player/pink_monster_walk.png';
import runSheetUrl from '../../assets/sprites/player/Pink_Monster_Run_6.png';
import idleSheetUrl from '../../assets/sprites/player/Pink_Monster_Idle_4.png';
import jumpSheetUrl from '../../assets/sprites/player/Pink_Monster_Jump_8.png';

export function Player() {
  const spriteRef = useRef<THREE.Sprite>(null);
  const keysRef = useMovement();
  const vyRef = useRef<number>(0);
  const animTimeRef = useRef<number>(0);

  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const setFacing = useGameStore((state) => state.setFacing);
  const setQuestDone = useGameStore((state) => state.setQuestDone);
  const setStage = useGameStore((state) => state.setStage);

  // Load player sprite sheet textures
  const walkTexture = useTexture(walkSheetUrl);
  const runTexture = useTexture(runSheetUrl);
  const idleTexture = useTexture(idleSheetUrl);
  const jumpTexture = useTexture(jumpSheetUrl);

  // Configure texture parameters for pixel art rendering
  useEffect(() => {
    const textures = [
      { tex: walkTexture, frames: 6 },
      { tex: runTexture, frames: 6 },
      { tex: idleTexture, frames: 4 },
      { tex: jumpTexture, frames: 8 },
    ];
    textures.forEach(({ tex, frames }) => {
      if (tex) {
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.repeat.set(1 / frames, 1);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
      }
    });
  }, [walkTexture, runTexture, idleTexture, jumpTexture]);

  useFrame((_, dt) => {
    const cappedDt = Math.min(0.05, dt);
    const { paused, stage, facing, playerPosition } = useGameStore.getState();

    // If game is paused or dialogue/quiz/complete is active, force idle
    if (paused || stage === 'dialogue' || stage === 'quiz' || stage === 'complete') {
      if (spriteRef.current && idleTexture) {
        animTimeRef.current += cappedDt * 6;
        const currentFrame = Math.floor(animTimeRef.current) % 4;
        idleTexture.offset.x = currentFrame / 4;
        idleTexture.needsUpdate = true;
        if (spriteRef.current.material.map !== idleTexture) {
          spriteRef.current.material.map = idleTexture;
          spriteRef.current.material.needsUpdate = true;
        }
      }
      return;
    }

    const keys = keysRef.current;
    let dx = 0;

    // Movement controls (A/D or Arrows)
    if (keys['a'] || keys['arrowleft']) dx -= 1;
    if (keys['d'] || keys['arrowright']) dx += 1;

    const moving = dx !== 0;
    const isRunning = moving && !!keys['shift'];

    let [px, py] = playerPosition;
    let nextFacing = facing;

    // Speeds and vertical baseline
    const WALK_SPEED = 5.5;
    const RUN_SPEED = 8.5;
    const SPEED = isRunning ? RUN_SPEED : WALK_SPEED;
    const bounds = { minX: -19, maxX: 36 };

    // Horizontal Movement updates
    if (moving) {
      px += dx * SPEED * cappedDt;
      px = Math.max(bounds.minX, Math.min(bounds.maxX, px));

      // Update direction and save in store
      nextFacing = dx < 0 ? -1 : 1;
      setFacing(nextFacing);
      setPlayerPosition(px, py);
    }

    // Jumping & Gravity Physics
    const GROUND_LEVEL = -4.2;
    const GRAVITY = 32.0;
    const JUMP_FORCE = 11.5;

    const isOnGround = py <= GROUND_LEVEL;
    if (isOnGround) {
      py = GROUND_LEVEL;
      vyRef.current = 0;
      if (keys[' '] || keys['spacebar']) {
        vyRef.current = JUMP_FORCE;
      }
    } else {
      vyRef.current -= GRAVITY * cappedDt;
    }

    py += vyRef.current * cappedDt;
    if (py < GROUND_LEVEL) {
      py = GROUND_LEVEL;
      vyRef.current = 0;
    }

    setPlayerPosition(px, py);

    // Collision Check: Proximity Prompt updates
    const isNearNpc = checkNpcProximity(px, py);
    const showPrompt = useGameStore.getState().showPrompt;
    if (stage === 'explore') {
      if (isNearNpc !== showPrompt) {
        useGameStore.getState().setShowPrompt(isNearNpc);
      }
    } else {
      if (showPrompt) {
        useGameStore.getState().setShowPrompt(false);
      }
    }

    // Exit gate collision trigger
    if (stage === 'gateOpen' && px >= 32) {
      setQuestDone(2, true);
      setStage('complete');
    }

    // Determine correct animation state
    let activeTex = idleTexture;
    let frames = 4;
    let animSpeed = 6;

    if (py > GROUND_LEVEL) {
      activeTex = jumpTexture;
      frames = 8;
      animSpeed = 10;
    } else if (moving) {
      if (isRunning) {
        activeTex = runTexture;
        frames = 6;
        animSpeed = 12;
      } else {
        activeTex = walkTexture;
        frames = 6;
        animSpeed = 10;
      }
    } else {
      activeTex = idleTexture;
      frames = 4;
      animSpeed = 6;
    }

    // Update texture frames and offset coordinates
    if (spriteRef.current && activeTex) {
      spriteRef.current.position.set(px, py + 0.8, 1);

      // Increment local animation accumulator
      animTimeRef.current += cappedDt * animSpeed;
      const currentFrame = Math.floor(animTimeRef.current) % frames;

      const isFacingLeft = (dx < 0 ? -1 : dx > 0 ? 1 : nextFacing) === -1;
      if (isFacingLeft) {
        activeTex.repeat.x = -1 / frames;
        activeTex.offset.x = (currentFrame + 1) / frames;
      } else {
        activeTex.repeat.x = 1 / frames;
        activeTex.offset.x = currentFrame / frames;
      }
      activeTex.needsUpdate = true;

      // Swap active material map
      if (spriteRef.current.material.map !== activeTex) {
        spriteRef.current.material.map = activeTex;
        spriteRef.current.material.needsUpdate = true;
      }

      // Keep physical scale positive since flipping is handled in UV repeats
      spriteRef.current.scale.set(1.6, 1.6, 1);
    }
  });

  return (
    <sprite
      ref={spriteRef}
      position={[-15, -4.2 + 0.8, 1]}
      scale={[1.6, 1.6, 1]}
    >
      <spriteMaterial attach="material" map={idleTexture} transparent />
    </sprite>
  );
}

export default Player;
