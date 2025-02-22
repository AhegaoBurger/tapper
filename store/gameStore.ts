import { create } from "zustand";

interface GameState {
  score: number;
  setScore: (score: number) => void;
  incrementScore: (value: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  setScore: (score) => set({ score: score }),
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
}));
