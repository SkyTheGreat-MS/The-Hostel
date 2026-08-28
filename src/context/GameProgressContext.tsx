import React, { createContext, useContext, useState, useEffect } from 'react';
import { MCId } from '../types';

export interface GameProgressContextType {
  highestChapterCompleted: number;
  selectedMC: MCId;
  setSelectedMC: (mc: MCId) => void;
  isChapterUnlocked: (chapterNumber: number) => boolean;
  completeChapter: (chapterNumber: number) => void;
  resetProgress: () => void;
  justUnlockedChapter: number | null;
  clearJustUnlocked: () => void;
  composure: number;
  setComposure: (val: number | ((prev: number) => number)) => void;
  chapter1TimeSeconds: number;
  setChapter1TimeSeconds: (val: number) => void;
  discoveredClues: string[];
  addDiscoveredClue: (clueId: string) => void;
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
      // ignore
    }
    return 0;
  });

  const [selectedMC, setSelectedMC] = useState<MCId>('thazin');
  const [justUnlockedChapter, setJustUnlockedChapter] = useState<number | null>(null);
  const [composure, setComposure] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.composure === 'number') {
          return parsed.composure;
        }
      }
    } catch {
      // ignore
    }
    return 100;
  });
  const [chapter1TimeSeconds, setChapter1TimeSeconds] = useState<number>(0);
  const [discoveredClues, setDiscoveredClues] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.discoveredClues)) {
          return parsed.discoveredClues;
        }
      }
    } catch {
      // ignore
    }
    return ['seance_notebook'];
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          highestChapterCompleted,
          selectedMC,
          composure,
          discoveredClues,
        })
      );
    } catch {
      // ignore
    }
  }, [highestChapterCompleted, selectedMC, composure, discoveredClues]);

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
    setComposure(100);
    setChapter1TimeSeconds(0);
    setDiscoveredClues(['seance_notebook']);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const clearJustUnlocked = () => {
    setJustUnlockedChapter(null);
  };

  const addDiscoveredClue = (clueId: string) => {
    setDiscoveredClues((prev) => {
      if (!prev.includes(clueId)) {
        return [...prev, clueId];
      }
      return prev;
    });
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
        composure,
        setComposure,
        chapter1TimeSeconds,
        setChapter1TimeSeconds,
        discoveredClues,
        addDiscoveredClue,
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
