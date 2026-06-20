import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { levelOneDialogue } from '../../systems/dialogue/dialogueData';

export function Dialogue() {
  const stage = useGameStore((state) => state.stage);
  const setStage = useGameStore((state) => state.setStage);
  const setQuestDone = useGameStore((state) => state.setQuestDone);

  const handleContinue = () => {
    // Complete first quest item: talk to villager
    setQuestDone(0, true);
    // Hide dialogue briefly, then show quiz (matching original 250ms transition)
    setStage('explore');
    setTimeout(() => {
      setStage('quiz');
    }, 250);
  };

  return (
    <AnimatePresence>
      {stage === 'dialogue' && (
        <motion.div
          className="dialogue"
          initial={{ opacity: 0, y: 40, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 40, x: '-50%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{ position: 'absolute', left: '50%', bottom: '24px' }}
        >
          <div className="dlg-name">
            <span className="dot" />
            {levelOneDialogue.character}
          </div>
          <div className="dlg-es">{levelOneDialogue.textEs}</div>
          <div className="dlg-en">{levelOneDialogue.textEn}</div>
          <div className="dlg-next">
            <button className="btn" onClick={handleContinue}>
              Continue
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Dialogue;
