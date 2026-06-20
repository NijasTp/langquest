import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

export function HUD() {
  const xp = useGameStore((state) => state.xp);
  const xpMax = useGameStore((state) => state.xpMax);
  const showXpToast = useGameStore((state) => state.showXpToast);
  const toastAmount = useGameStore((state) => state.toastAmount);
  const setPaused = useGameStore((state) => state.setPaused);
  const hideXpToast = useGameStore((state) => state.hideXpToast);

  useEffect(() => {
    if (showXpToast) {
      const timer = setTimeout(() => {
        hideXpToast();
      }, 1300);
      return () => clearTimeout(timer);
    }
  }, [showXpToast, hideXpToast]);

  const fillPercent = (xp / xpMax) * 100;

  return (
    <>
      <div className="hud">
        <div className="xp-wrap">
          <div className="xp-label">
            <span>LEVEL 1 · GREETINGS</span>
            <span>{xp} / {xpMax} XP</span>
          </div>
          <div className="xp-bar-bg">
            <div
              className="xp-bar-fill"
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>
        <button
          className="pause-btn"
          onClick={() => setPaused(true)}
          aria-label="Pause Game"
        >
          ⏸
        </button>
      </div>

      <AnimatePresence>
        {showXpToast && (
          <motion.div
            className="xp-toast"
            initial={{ opacity: 0, scale: 0.7, y: 0, x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.7, y: 0, x: '-50%' }}
            transition={{ type: 'spring', damping: 12, stiffness: 150 }}
          >
            +{toastAmount} XP
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default HUD;
