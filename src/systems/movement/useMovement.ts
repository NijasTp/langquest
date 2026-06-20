import { useEffect, useRef } from 'react';

export function useMovement() {
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Initialize mobile keys structure
    if (!(window as any).mobileKeys) {
      (window as any).mobileKeys = {
        a: false,
        d: false,
        ' ': false,
        e: false,
        arrowleft: false,
        arrowright: false,
      };
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key) {
        keys.current[e.key.toLowerCase()] = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key) {
        keys.current[e.key.toLowerCase()] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Sync mobile keys state every frame
    const interval = setInterval(() => {
      const mobileKeys = (window as any).mobileKeys;
      if (mobileKeys) {
        Object.keys(mobileKeys).forEach((k) => {
          keys.current[k] = mobileKeys[k];
        });
      }
    }, 16);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(interval);
    };
  }, []);

  return keys;
}
