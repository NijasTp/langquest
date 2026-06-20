import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';

export function CameraController() {
  useFrame(({ camera }) => {
    const { playerPosition, facing } = useGameStore.getState();
    const [px] = playerPosition;

    // Dynamic horizontal look-ahead based on facing direction
    const targetX = px + facing * 2.5;
    
    // Stable vertical view baseline centered slightly above ground level
    const targetY = -2.0;

    // Smooth horizontal lerping
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
  });

  return null;
}
export default CameraController;
