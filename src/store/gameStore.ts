import { create } from 'zustand';

export type GameStage = 'explore' | 'dialogue' | 'quiz' | 'learned' | 'gateOpen' | 'complete';

interface GameState {
  xp: number;
  xpMax: number;
  questDone: boolean[];
  stage: GameStage;
  paused: boolean;
  playerPosition: [number, number];
  facing: number;
  walkT: number;
  showPrompt: boolean;
  showXpToast: boolean;
  toastAmount: number;

  // Actions
  setPaused: (paused: boolean) => void;
  setStage: (stage: GameStage) => void;
  setPlayerPosition: (x: number, y: number) => void;
  setFacing: (facing: number) => void;
  setWalkT: (walkT: number | ((prev: number) => number)) => void;
  setQuestDone: (index: number, done: boolean) => void;
  awardXP: (amount: number) => void;
  setShowPrompt: (show: boolean) => void;
  hideXpToast: () => void;
  resetStore: () => void;
}

const initialPositions: [number, number] = [-12, 0];

export const useGameStore = create<GameState>((set) => ({
  xp: 0,
  xpMax: 10,
  questDone: [false, false, false],
  stage: 'explore',
  paused: false,
  playerPosition: [...initialPositions],
  facing: 1,
  walkT: 0,
  showPrompt: false,
  showXpToast: false,
  toastAmount: 0,

  setPaused: (paused) => set({ paused }),
  setStage: (stage) => set({ stage }),
  setPlayerPosition: (x, y) => set({ playerPosition: [x, y] }),
  setFacing: (facing) => set({ facing }),
  setWalkT: (walkT) => set((state) => ({
    walkT: typeof walkT === 'function' ? walkT(state.walkT) : walkT
  })),
  setQuestDone: (index, done) => set((state) => {
    const nextQuestDone = [...state.questDone];
    nextQuestDone[index] = done;
    return { questDone: nextQuestDone };
  }),
  awardXP: (amount) => set((state) => {
    const nextXp = Math.min(state.xpMax, state.xp + amount);
    return {
      xp: nextXp,
      toastAmount: amount,
      showXpToast: true,
    };
  }),
  setShowPrompt: (showPrompt) => set({ showPrompt }),
  hideXpToast: () => set({ showXpToast: false }),
  resetStore: () => set({
    xp: 0,
    questDone: [false, false, false],
    stage: 'explore',
    paused: false,
    playerPosition: [...initialPositions],
    facing: 1,
    walkT: 0,
    showPrompt: false,
    showXpToast: false,
    toastAmount: 0,
  }),
}));
