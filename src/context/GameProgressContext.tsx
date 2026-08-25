import React, { createContext, useContext, useState, useEffect } from 'react';
import { MCId } from '../types';

export interface GameProgressContextType {
  /**
   * Highest chapter completed by the player (0: none, 1: Chapter 1 completed, 2: Chapter 2 completed).
   * 
   * =========================================================================================
   * [SWAP POINT NOTE]: Currently driven by local React state / localStorage.
   * In future backend integration passes, this will be swapped to read backend Prolog facts
   * (e.g. `chapter/1` completion status and persistent investigative milestones over the local API).
   * =========================================================================================
   */
  highestChapterCompleted: number;
  selectedMC: MCId;
  setSelectedMC: (mc: MCId) => void;
  isChapterUnlocked: (chapterNumber: number) => boolean;
  completeChapter: (chapterNumber: number) => void;
  resetProgress: () => void;
  justUnlockedChapter: number | null;
  clearJustUnlocked: () => void;
}

const STORAGE_KEY = 'spirits_labyrinth_progress_v1';

const GameProgressContext = createContext<GameProgressContextType | null>(null);

export const GameProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highestChapterCompleted, setHighestChapterCompleted] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.highestChapterCompleted === 'number') {
          return parsed.highestChapterCompleted;
        }
      }
    } catch {
      // ignore storage error
    }
    return 0;
  });

  const [selectedMC, setSelectedMC] = useState<MCId>('thazin');
  const [justUnlockedChapter, setJustUnlockedChapter] = useState<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ highestChapterCompleted, selectedMC })
      );
    } catch {
      // ignore
    }
  }, [highestChapterCompleted, selectedMC]);

  /**
   * A chapter is unlocked if chapterNumber <= highestChapterCompleted + 1.
   * e.g., progress 0 -> Chapter 1 unlocked.
   * e.g., progress 1 -> Chapter 1 & 2 unlocked.
   * e.g., progress 2 -> Chapter 1, 2 & 3 unlocked.
   */
  const isChapterUnlocked = (chapterNumber: number): boolean => {
    return chapterNumber <= highestChapterCompleted + 1;
  };

  const completeChapter = (chapterNumber: number) => {
    setHighestChapterCompleted((prev) => {
      if (chapterNumber > prev) {
        setJustUnlockedChapter(chapterNumber + 1);
        return chapterNumber;
      }
      return prev;
    });
  };

  const resetProgress = () => {
    setHighestChapterCompleted(0);
    setJustUnlockedChapter(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const clearJustUnlocked = () => {
    setJustUnlockedChapter(null);
  };

  return (
    <GameProgressContext.Provider
      value={{
        highestChapterCompleted,
        selectedMC,
        setSelectedMC,
        isChapterUnlocked,
        completeChapter,
        resetProgress,
        justUnlockedChapter,
        clearJustUnlocked,
      }}
    >
      {children}
    </GameProgressContext.Provider>
  );
};

export function useGameProgress(): GameProgressContextType {
  const context = useContext(GameProgressContext);
  if (!context) {
    throw new Error('useGameProgress must be used within a GameProgressProvider');
  }
  return context;
}
