import React from 'react';

export function MobileControls() {
  const triggerKeyEvent = (keyName: string, isDown: boolean) => {
    const event = new KeyboardEvent(isDown ? 'keydown' : 'keyup', {
      key: keyName,
      code: keyName === ' ' ? 'Space' : keyName,
      bubbles: true,
    });
    window.dispatchEvent(event);
  };

  const handlePressStart = (keyName: string, e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    triggerKeyEvent(keyName, true);
  };

  const handlePressEnd = (keyName: string, e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
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
