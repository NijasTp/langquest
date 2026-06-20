import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

export function PauseMenu() {
  const paused = useGameStore((state) => state.paused);
  const setPaused = useGameStore((state) => state.setPaused);
  const resetStore = useGameStore((state) => state.resetStore);

  const handleRestart = () => {
    resetStore();
  };

  return (
    <AnimatePresence>
      {paused && (
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="panel"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          >
            <h2>Paused</h2>
            <button
              className="btn green"
              onClick={() => setPaused(false)}
            >
              Resume
            </button>
            <button
              className="btn"
              style={{ background: '#9aa', boxShadow: '0 4px 0 #778' }}
              onClick={handleRestart}
            >
              Restart Level
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PauseMenu;
