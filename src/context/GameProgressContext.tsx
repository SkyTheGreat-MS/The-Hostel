import React, { createContext, useContext, useState, useEffect } from 'react';
import { MCId, Room4BSubScene, Phase3Location } from '../types';

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
  setDiscoveredClues: (val: string[] | ((prev: string[]) => string[])) => void;
  // Room 4B Point-and-Click & Inventory additions
  inventory: string[];
  addInventoryItem: (itemId: string) => void;
  hasInventoryItem: (itemId: string) => boolean;
  setInventory: (val: string[] | ((prev: string[]) => string[])) => void;
  activeInspectSubScene: Room4BSubScene;
  setActiveInspectSubScene: (scene: Room4BSubScene) => void;
  selectedInventoryItem: string | null;
  setSelectedInventoryItem: (item: string | null) => void;
  deskMugMoved: boolean;
  setDeskMugMoved: (val: boolean | ((prev: boolean) => boolean)) => void;
  hasMagneticCompass: boolean;
  setHasMagneticCompass: (val: boolean | ((prev: boolean) => boolean)) => void;
  doorSmashed: boolean;
  setDoorSmashed: (val: boolean | ((prev: boolean) => boolean)) => void;
  // Phase 3 additions
  phase3Location: Phase3Location;
  setPhase3Location: (val: Phase3Location | ((prev: Phase3Location) => Phase3Location)) => void;
  hasSmallBrassKey: boolean;
  setHasSmallBrassKey: (val: boolean | ((prev: boolean) => boolean)) => void;
  hasNylonRope: boolean;
  setHasNylonRope: (val: boolean | ((prev: boolean) => boolean)) => void;
  washroomStallChecked: boolean;
  setWashroomStallChecked: (val: boolean | ((prev: boolean) => boolean)) => void;
  washroomMirrorScratched: boolean;
  setWashroomMirrorScratched: (val: boolean | ((prev: boolean) => boolean)) => void;
  stairwellGateInspected: boolean;
  setStairwellGateInspected: (val: boolean | ((prev: boolean) => boolean)) => void;
  // Chapter 1 Specific Flags & Reset
  hasBobbyPin: boolean;
  setHasBobbyPin: (val: boolean | ((prev: boolean) => boolean)) => void;
  hasWoodenBat: boolean;
  setHasWoodenBat: (val: boolean | ((prev: boolean) => boolean)) => void;
  doorUnlocked: boolean;
  setDoorUnlocked: (val: boolean | ((prev: boolean) => boolean)) => void;
  resetChapterOneProgress: () => void;
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

  // Room 4B states
  const [inventory, setInventory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.inventory)) {
          return parsed.inventory;
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [activeInspectSubScene, setActiveInspectSubScene] = useState<Room4BSubScene>('main');
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<string | null>(null);

  const [deskMugMoved, setDeskMugMoved] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.deskMugMoved === 'boolean') {
          return parsed.deskMugMoved;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [hasMagneticCompass, setHasMagneticCompass] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.hasMagneticCompass === 'boolean') {
          return parsed.hasMagneticCompass;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [doorSmashed, setDoorSmashed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.doorSmashed === 'boolean') {
          return parsed.doorSmashed;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [phase3Location, setPhase3Location] = useState<Phase3Location>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.phase3Location === 'string') {
          return parsed.phase3Location as Phase3Location;
        }
      }
    } catch {
      // ignore
    }
    return 'hallway_threshold';
  });

  const [hasSmallBrassKey, setHasSmallBrassKey] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.hasSmallBrassKey === 'boolean') {
          return parsed.hasSmallBrassKey;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [hasNylonRope, setHasNylonRope] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.hasNylonRope === 'boolean') {
          return parsed.hasNylonRope;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [washroomStallChecked, setWashroomStallChecked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.washroomStallChecked === 'boolean') {
          return parsed.washroomStallChecked;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [washroomMirrorScratched, setWashroomMirrorScratched] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.washroomMirrorScratched === 'boolean') {
          return parsed.washroomMirrorScratched;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [stairwellGateInspected, setStairwellGateInspected] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.stairwellGateInspected === 'boolean') {
          return parsed.stairwellGateInspected;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [doorUnlocked, setDoorUnlocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.doorUnlocked === 'boolean') {
          return parsed.doorUnlocked;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const hasBobbyPin = inventory.includes('bobby_pin');
  const setHasBobbyPin = (val: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof val === 'function' ? val(inventory.includes('bobby_pin')) : val;
    setInventory((prev) =>
      nextVal
        ? prev.includes('bobby_pin')
          ? prev
          : [...prev, 'bobby_pin']
        : prev.filter((i) => i !== 'bobby_pin')
    );
  };

  const hasWoodenBat = inventory.includes('wooden_bat');
  const setHasWoodenBat = (val: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof val === 'function' ? val(inventory.includes('wooden_bat')) : val;
    setInventory((prev) =>
      nextVal
        ? prev.includes('wooden_bat')
          ? prev
          : [...prev, 'wooden_bat']
        : prev.filter((i) => i !== 'wooden_bat')
    );
  };

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          highestChapterCompleted,
          selectedMC,
          composure,
          discoveredClues,
          inventory,
          deskMugMoved,
          hasMagneticCompass,
          doorSmashed,
          doorUnlocked,
          phase3Location,
          hasSmallBrassKey,
          hasNylonRope,
          washroomStallChecked,
          washroomMirrorScratched,
          stairwellGateInspected,
        })
      );
    } catch {
      // ignore
    }
  }, [
    highestChapterCompleted,
    selectedMC,
    composure,
    discoveredClues,
    inventory,
    deskMugMoved,
    hasMagneticCompass,
    doorSmashed,
    doorUnlocked,
    phase3Location,
    hasSmallBrassKey,
    hasNylonRope,
    washroomStallChecked,
    washroomMirrorScratched,
    stairwellGateInspected,
  ]);

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
    setDiscoveredClues([]);
    setInventory([]);
    setActiveInspectSubScene('main');
    setSelectedInventoryItem(null);
    setDeskMugMoved(false);
    setHasMagneticCompass(false);
    setDoorSmashed(false);
    setDoorUnlocked(false);
    setPhase3Location('hallway_threshold');
    setHasSmallBrassKey(false);
    setHasNylonRope(false);
    setWashroomStallChecked(false);
    setWashroomMirrorScratched(false);
    setStairwellGateInspected(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const resetChapterOneProgress = () => {
    setHighestChapterCompleted(0);
    setJustUnlockedChapter(null);
    setComposure(100);
    setChapter1TimeSeconds(0);
    setDiscoveredClues([]);
    setInventory([]);
    setActiveInspectSubScene('main');
    setSelectedInventoryItem(null);
    setDeskMugMoved(false);
    setHasMagneticCompass(false);
    setDoorSmashed(false);
    setDoorUnlocked(false);
    setPhase3Location('hallway_threshold');
    setHasSmallBrassKey(false);
    setHasNylonRope(false);
    setWashroomStallChecked(false);
    setWashroomMirrorScratched(false);
    setStairwellGateInspected(false);
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

  const addInventoryItem = (itemId: string) => {
    setInventory((prev) => {
      if (!prev.includes(itemId)) {
        return [...prev, itemId];
      }
      return prev;
    });
  };

  const hasInventoryItem = (itemId: string): boolean => {
    return inventory.includes(itemId);
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
        resetChapterOneProgress,
        justUnlockedChapter,
        clearJustUnlocked,
        composure,
        setComposure,
        chapter1TimeSeconds,
        setChapter1TimeSeconds,
        discoveredClues,
        addDiscoveredClue,
        setDiscoveredClues,
        inventory,
        setInventory,
        addInventoryItem,
        hasInventoryItem,
        activeInspectSubScene,
        setActiveInspectSubScene,
        selectedInventoryItem,
        setSelectedInventoryItem,
        deskMugMoved,
        setDeskMugMoved,
        hasMagneticCompass,
        setHasMagneticCompass,
        doorSmashed,
        setDoorSmashed,
        doorUnlocked,
        setDoorUnlocked,
        hasBobbyPin,
        setHasBobbyPin,
        hasWoodenBat,
        setHasWoodenBat,
        phase3Location,
        setPhase3Location,
        hasSmallBrassKey,
        setHasSmallBrassKey,
        hasNylonRope,
        setHasNylonRope,
        washroomStallChecked,
        setWashroomStallChecked,
        washroomMirrorScratched,
        setWashroomMirrorScratched,
        stairwellGateInspected,
        setStairwellGateInspected,
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
