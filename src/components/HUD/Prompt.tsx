import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

export function Prompt() {
  const showPrompt = useGameStore((state) => state.showPrompt);

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          className="prompt"
          initial={{ opacity: 0, y: 10, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 10, x: '-50%' }}
          transition={{ duration: 0.2 }}
          style={{ position: 'absolute', left: '50%', bottom: '120px' }}
        >
          <kbd>E</kbd>Talk
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Prompt;
