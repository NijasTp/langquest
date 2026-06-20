import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

export function LevelComplete() {
  const stage = useGameStore((state) => state.stage);
  const resetStore = useGameStore((state) => state.resetStore);

  return (
    <AnimatePresence>
      {stage === 'complete' && (
        <motion.div
          className="complete"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            initial={{ scale: 0.8, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', damping: 10, stiffness: 100 }}
          >
            Level 1 Completed
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.4 }}
          >
            Level 1 Complete — "First Conversation"
          </motion.p>
          
          <motion.div
            className="word-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="word-chip">
              Hola
              <small>Hello</small>
            </div>
            <div className="word-chip">
              ¿Cómo estás?
              <small>How are you?</small>
            </div>
            <div className="word-chip">
              Muy bien
              <small>Very good / I'm fine</small>
            </div>
          </motion.div>

          <motion.div
            style={{ fontWeight: 800, color: 'var(--gold)', fontSize: '18px', marginBottom: '20px' }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            XP Earned: +10
          </motion.div>

          <motion.button
            className="btn green"
            onClick={resetStore}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Play Again
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LevelComplete;
