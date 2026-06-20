import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { checkNpcProximity } from '../../systems/collision/useCollision';

export function MobileControls() {
  const triggerKeyEvent = (keyName: string, isDown: boolean) => {
    try {
      // Setup correct event type and properties for broad compatibility
      const event = new KeyboardEvent(isDown ? 'keydown' : 'keyup', {
        key: keyName,
        code: keyName === ' ' ? 'Space' : keyName === 'shift' ? 'ShiftLeft' : keyName,
        keyCode: keyName === ' ' ? 32 : keyName === 'shift' ? 16 : keyName.toUpperCase().charCodeAt(0),
        which: keyName === ' ' ? 32 : keyName === 'shift' ? 16 : keyName.toUpperCase().charCodeAt(0),
        bubbles: true,
        cancelable: true,
      });
      window.dispatchEvent(event);
    } catch (err) {
      console.log('Failed to dispatch KeyboardEvent:', err);
    }
  };

  const handlePressStart = (keyName: string, e: React.TouchEvent | React.MouseEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    triggerKeyEvent(keyName, true);

    // Direct store action for NPC interaction button E
    if (keyName === 'e') {
      const { stage, paused, playerPosition, setStage } = useGameStore.getState();
      if (!paused && stage === 'explore') {
        const [px, py] = playerPosition;
        if (checkNpcProximity(px, py)) {
          setStage('dialogue');
        }
      }
    }
  };

  const handlePressEnd = (keyName: string, e: React.TouchEvent | React.MouseEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    triggerKeyEvent(keyName, false);
  };

  return (
    <div className="mobile-controls">
      {/* Left side directional controls */}
      <div className="mobile-dir-keys">
        <button
          className="mobile-btn-glass"
          onTouchStart={(e) => handlePressStart('a', e)}
          onTouchEnd={(e) => handlePressEnd('a', e)}
          onMouseDown={(e) => handlePressStart('a', e)}
          onMouseUp={(e) => handlePressEnd('a', e)}
          onMouseLeave={(e) => handlePressEnd('a', e)}
        >
          ◀
        </button>
        <button
          className="mobile-btn-glass"
          onTouchStart={(e) => handlePressStart('d', e)}
          onTouchEnd={(e) => handlePressEnd('d', e)}
          onMouseDown={(e) => handlePressStart('d', e)}
          onMouseUp={(e) => handlePressEnd('d', e)}
          onMouseLeave={(e) => handlePressEnd('d', e)}
        >
          ▶
        </button>
      </div>

      {/* Right side action controls */}
      <div className="mobile-action-keys">
        <button
          className="mobile-btn-glass interact-btn"
          onTouchStart={(e) => handlePressStart('e', e)}
          onTouchEnd={(e) => handlePressEnd('e', e)}
          onMouseDown={(e) => handlePressStart('e', e)}
          onMouseUp={(e) => handlePressEnd('e', e)}
          onMouseLeave={(e) => handlePressEnd('e', e)}
        >
          E
        </button>
        <button
          className="mobile-btn-glass run-btn"
          onTouchStart={(e) => handlePressStart('shift', e)}
          onTouchEnd={(e) => handlePressEnd('shift', e)}
          onMouseDown={(e) => handlePressStart('shift', e)}
          onMouseUp={(e) => handlePressEnd('shift', e)}
          onMouseLeave={(e) => handlePressEnd('shift', e)}
        >
          🏃
        </button>
        <button
          className="mobile-btn-glass jump-btn"
          onTouchStart={(e) => handlePressStart(' ', e)}
          onTouchEnd={(e) => handlePressEnd(' ', e)}
          onMouseDown={(e) => handlePressStart(' ', e)}
          onMouseUp={(e) => handlePressEnd(' ', e)}
          onMouseLeave={(e) => handlePressEnd(' ', e)}
        >
          ▲
        </button>
      </div>
    </div>
  );
}

export default MobileControls;
