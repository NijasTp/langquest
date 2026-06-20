export interface DialogueLine {
  character: string;
  textEs: string;
  textEn: string;
}

export interface QuizQuestion {
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
  feedbackCorrect: string;
  feedbackWrong: string;
}

export const levelOneDialogue: DialogueLine = {
  character: 'Villager',
  textEs: '¿Cómo estás?',
  textEn: '"How are you?"',
};

export const levelOneQuiz: QuizQuestion = {
  question: 'How do you respond?',
  options: [
    { text: 'Muy bien', isCorrect: true },
    { text: 'Buenas noches', isCorrect: false },
  ],
  feedbackCorrect: 'Correct! "Muy bien" means "Very good / I\'m fine."',
  feedbackWrong: 'Try again.',
};
