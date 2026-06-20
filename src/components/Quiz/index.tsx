import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { levelOneQuiz } from '../../systems/dialogue/dialogueData';
import { XP_CONFIG } from '../../systems/xp';

export function Quiz() {
  const stage = useGameStore((state) => state.stage);
  const setStage = useGameStore((state) => state.setStage);
  const setQuestDone = useGameStore((state) => state.setQuestDone);
  const awardXP = useGameStore((state) => state.awardXP);

  const [selectedCorrect, setSelectedCorrect] = useState<number | null>(null);
  const [selectedWrong, setSelectedWrong] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'good' | 'bad' } | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

  const handleOptionClick = (index: number, isCorrect: boolean) => {
    if (stage !== 'quiz' || selectedCorrect !== null || selectedWrong !== null) return;

    if (isCorrect) {
      setSelectedCorrect(index);
      setFeedback({ text: levelOneQuiz.feedbackCorrect, type: 'good' });
      setQuestDone(1, true);
      awardXP(XP_CONFIG.quizReward);

      setTimeout(() => {
        setSelectedCorrect(null);
        setSelectedWrong(null);
        setFeedback(null);
        setStage('gateOpen');
      }, 1400);
    } else {
      setSelectedWrong(index);
      setFeedback({ text: levelOneQuiz.feedbackWrong, type: 'bad' });

      setTimeout(() => {
        setSelectedWrong(null);
      }, 400);
    }
  };

  useEffect(() => {
    if (stage !== 'quiz') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // If currently processing wrong or correct selection, ignore inputs
      if (selectedCorrect !== null || selectedWrong !== null) return;

      const key = e.key.toLowerCase();
      if (key === 'a' || key === 'arrowleft') {
        setHighlightedIndex(0);
      } else if (key === 'd' || key === 'arrowright') {
        setHighlightedIndex(1);
      } else if (key === 'enter' || key === ' ' || key === 'spacebar' || key === 'e') {
        if (key === ' ' || key === 'spacebar') {
          e.preventDefault();
        }
        const opt = levelOneQuiz.options[highlightedIndex];
        if (opt) {
          handleOptionClick(highlightedIndex, opt.isCorrect);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, highlightedIndex, selectedCorrect, selectedWrong]);

  return (
    <AnimatePresence>
      {stage === 'quiz' && (
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
            * You
          </div>
          <div className="dlg-es">¿Cómo respondes?</div>
          <div className="dlg-en">"{levelOneQuiz.question}"</div>
          
          <div className="dlg-choices">
            {levelOneQuiz.options.map((opt, i) => {
              const isCorrectSelected = selectedCorrect === i;
              const isWrongSelected = selectedWrong === i;
              
              let btnClass = 'btn-inactive';
              if (isCorrectSelected) {
                btnClass = 'btn green';
              } else if (isWrongSelected) {
                btnClass = 'btn red';
              } else if (highlightedIndex === i) {
                btnClass = 'btn';
              }

              return (
                <button
                  key={i}
                  className={btnClass}
                  onMouseEnter={() => {
                    if (selectedCorrect === null && selectedWrong === null) {
                      setHighlightedIndex(i);
                    }
                  }}
                  onClick={() => handleOptionClick(i, opt.isCorrect)}
                  disabled={selectedCorrect !== null || selectedWrong !== null}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
          
          {feedback && (
            <div className={`quiz-feedback ${feedback.type === 'good' ? 'good' : 'bad'}`} style={{ marginTop: '16px', textAlign: 'center' }}>
              {feedback.text}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Quiz;
