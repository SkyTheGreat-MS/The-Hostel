import React, { createContext, useContext, useState, useEffect } from 'react';
import { MCId, Room4BSubScene, Phase3Location } from '../types';
import { PrologBridge } from '../services/PrologBridge';

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
  desk4bLooted: boolean;
  setDesk4bLooted: (val: boolean | ((prev: boolean) => boolean)) => void;
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
  // Spectral May Balcony Handover & Key 14
  mayResolved: boolean;
  setMayResolved: (val: boolean | ((prev: boolean) => boolean)) => void;
  key14OnFloor: boolean;
  setKey14OnFloor: (val: boolean | ((prev: boolean) => boolean)) => void;
  key14Collected: boolean;
  setKey14Collected: (val: boolean | ((prev: boolean) => boolean)) => void;
  locker14Unlocked: boolean;
  setLocker14Unlocked: (val: boolean | ((prev: boolean) => boolean)) => void;
  locker14Looted: boolean;
  setLocker14Looted: (val: boolean | ((prev: boolean) => boolean)) => void;
  stairwayGateKeyTaken: boolean;
  setStairwayGateKeyTaken: (val: boolean | ((prev: boolean) => boolean)) => void;
  stairwayGateUnlocked: boolean;
  setStairwayGateUnlocked: (val: boolean | ((prev: boolean) => boolean)) => void;
  chapter3Unlocked: boolean;
  setChapter3Unlocked: (val: boolean | ((prev: boolean) => boolean)) => void;
  chapter2Completed: boolean;
  setChapter2Completed: (val: boolean | ((prev: boolean) => boolean)) => void;
  chapter3Completed: boolean;
  setChapter3Completed: (val: boolean | ((prev: boolean) => boolean)) => void;
  chapter3IntroSeen: boolean;
  setChapter3IntroSeen: (val: boolean | ((prev: boolean) => boolean)) => void;
  garageDrained: boolean;
  setGarageDrained: (val: boolean | ((prev: boolean) => boolean)) => void;
  wellRootsSevered: boolean;
  setWellRootsSevered: (val: boolean | ((prev: boolean) => boolean)) => void;
  wellPulleyRigged: boolean;
  setWellPulleyRigged: (val: boolean | ((prev: boolean) => boolean)) => void;
  wellRopeRigged: boolean;
  setWellRopeRigged: (val: boolean | ((prev: boolean) => boolean)) => void;
  cassetteInserted: boolean;
  setCassetteInserted: (val: boolean | ((prev: boolean) => boolean)) => void;
  cassettePlayed: boolean;
  setCassettePlayed: (val: boolean | ((prev: boolean) => boolean)) => void;
  conduitUnlocked: boolean;
  setConduitUnlocked: (val: boolean | ((prev: boolean) => boolean)) => void;
  maxUnlockedChapter: number;
  setMaxUnlockedChapter: (val: number | ((prev: number) => number)) => void;
  unlockedChapters: number[];
  addItem: (itemId: string) => void;
  addToInventory: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  removeInventoryItem: (itemId: string) => void;
  removeFromInventory: (itemId: string) => void;
  advanceToChapter: (chapterNumber: number) => void;
  resetChapterOneProgress: () => void;
  drainGarage: () => Promise<void>;
  pickupGarageItem: (itemId: string) => Promise<void>;
  pickupLockerTape: () => Promise<void>;
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

  const [desk4bLooted, setDesk4bLooted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.desk4bLooted === 'boolean') {
          return parsed.desk4bLooted;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [mayResolved, setMayResolved] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.mayResolved === 'boolean') {
          return parsed.mayResolved;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [key14OnFloor, setKey14OnFloor] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.key14OnFloor === 'boolean') {
          return parsed.key14OnFloor;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [key14Collected, setKey14Collected] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.key14Collected === 'boolean') {
          return parsed.key14Collected;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [locker14Unlocked, setLocker14Unlocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.locker14Unlocked === 'boolean') {
          return parsed.locker14Unlocked;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [locker14Looted, setLocker14Looted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.locker14Looted === 'boolean') {
          return parsed.locker14Looted;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [stairwayGateKeyTaken, setStairwayGateKeyTaken] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.stairwayGateKeyTaken === 'boolean') {
          return parsed.stairwayGateKeyTaken;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [stairwayGateUnlocked, setStairwayGateUnlocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.stairwayGateUnlocked === 'boolean') {
          return parsed.stairwayGateUnlocked;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [chapter3Unlocked, setChapter3Unlocked] = useState<boolean>(() => {
    try {
      if (localStorage.getItem('spirits_labyrinth_ch3_unlocked') === 'true') return true;
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.chapter3Unlocked === 'boolean') {
          return parsed.chapter3Unlocked;
        }
      }
      const active = localStorage.getItem('spirits_labyrinth_active_save');
      if (active) {
        const parsedAct = JSON.parse(active);
        if (parsedAct.chapter3Unlocked || parsedAct.chapter === 3) return true;
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [chapter2Completed, setChapter2Completed] = useState<boolean>(() => {
    try {
      if (localStorage.getItem('spirits_labyrinth_ch3_unlocked') === 'true') return true;
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.chapter2Completed === 'boolean') return parsed.chapter2Completed;
        if (parsed.highestChapterCompleted >= 2 || parsed.chapter3Unlocked) return true;
      }
      const active = localStorage.getItem('spirits_labyrinth_active_save');
      if (active) {
        const parsedAct = JSON.parse(active);
        if (typeof parsedAct.chapter2Completed === 'boolean') return parsedAct.chapter2Completed;
        if (parsedAct.chapter === 3 || parsedAct.chapter3Unlocked) return true;
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [chapter3Completed, setChapter3Completed] = useState<boolean>(() => {
    try {
      if (localStorage.getItem('spirits_labyrinth_ch3_completed') === 'true') return true;
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.chapter3Completed === 'boolean') return parsed.chapter3Completed;
        if (parsed.highestChapterCompleted >= 3) return true;
      }
      const active = localStorage.getItem('spirits_labyrinth_active_save');
      if (active) {
        const parsedAct = JSON.parse(active);
        if (typeof parsedAct.chapter3Completed === 'boolean') return parsedAct.chapter3Completed;
        if (parsedAct.highestChapterCompleted >= 3) return true;
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [chapter3IntroSeen, setChapter3IntroSeen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.chapter3IntroSeen === 'boolean') {
          return parsed.chapter3IntroSeen;
        }
      }
      const active = localStorage.getItem('spirits_labyrinth_active_save');
      if (active) {
        const parsedAct = JSON.parse(active);
        if (typeof parsedAct.chapter3IntroSeen === 'boolean') {
          return parsedAct.chapter3IntroSeen;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [garageDrained, setGarageDrained] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.garageDrained === 'boolean') {
          return parsed.garageDrained;
        }
      }
      const active = localStorage.getItem('spirits_labyrinth_active_save');
      if (active) {
        const parsedAct = JSON.parse(active);
        if (typeof parsedAct.garageDrained === 'boolean') {
          return parsedAct.garageDrained;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [wellRootsSevered, setWellRootsSevered] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.wellRootsSevered === 'boolean') {
          return parsed.wellRootsSevered;
        }
      }
      const active = localStorage.getItem('spirits_labyrinth_active_save');
      if (active) {
        const parsedAct = JSON.parse(active);
        if (typeof parsedAct.wellRootsSevered === 'boolean') {
          return parsedAct.wellRootsSevered;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [wellPulleyRigged, setWellPulleyRigged] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.wellPulleyRigged === 'boolean') {
          return parsed.wellPulleyRigged;
        }
      }
      const active = localStorage.getItem('spirits_labyrinth_active_save');
      if (active) {
        const parsedAct = JSON.parse(active);
        if (typeof parsedAct.wellPulleyRigged === 'boolean') {
          return parsedAct.wellPulleyRigged;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [wellRopeRigged, setWellRopeRigged] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.wellRopeRigged === 'boolean') {
          return parsed.wellRopeRigged;
        }
      }
      const active = localStorage.getItem('spirits_labyrinth_active_save');
      if (active) {
        const parsedAct = JSON.parse(active);
        if (typeof parsedAct.wellRopeRigged === 'boolean') {
          return parsedAct.wellRopeRigged;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [cassetteInserted, setCassetteInserted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.cassetteInserted === 'boolean') {
          return parsed.cassetteInserted;
        }
      }
      const active = localStorage.getItem('spirits_labyrinth_active_save');
      if (active) {
        const parsedAct = JSON.parse(active);
        if (typeof parsedAct.cassetteInserted === 'boolean') {
          return parsedAct.cassetteInserted;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [cassettePlayed, setCassettePlayed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.cassettePlayed === 'boolean') {
          return parsed.cassettePlayed;
        }
      }
      const active = localStorage.getItem('spirits_labyrinth_active_save');
      if (active) {
        const parsedAct = JSON.parse(active);
        if (typeof parsedAct.cassettePlayed === 'boolean') {
          return parsedAct.cassettePlayed;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [conduitUnlocked, setConduitUnlocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.conduitUnlocked === 'boolean') {
          return parsed.conduitUnlocked;
        }
      }
      const active = localStorage.getItem('spirits_labyrinth_active_save');
      if (active) {
        const parsedAct = JSON.parse(active);
        if (typeof parsedAct.conduitUnlocked === 'boolean') {
          return parsedAct.conduitUnlocked;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [maxUnlockedChapter, setMaxUnlockedChapter] = useState<number>(() => {
    try {
      if (localStorage.getItem('spirits_labyrinth_ch3_unlocked') === 'true') return 3;
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.maxUnlockedChapter === 'number') return parsed.maxUnlockedChapter;
        if (parsed.chapter3Unlocked || parsed.chapter2Completed || (parsed.highestChapterCompleted && parsed.highestChapterCompleted >= 2)) return 3;
        if (parsed.highestChapterCompleted && parsed.highestChapterCompleted >= 1) return 2;
      }
      const active = localStorage.getItem('spirits_labyrinth_active_save');
      if (active) {
        const parsedAct = JSON.parse(active);
        if (typeof parsedAct.maxUnlockedChapter === 'number') return parsedAct.maxUnlockedChapter;
        if (parsedAct.chapter3Unlocked || parsedAct.chapter2Completed || parsedAct.chapter === 3) return 3;
        if (parsedAct.chapter === 2 || parsedAct.chapter1Completed) return 2;
      }
    } catch {
      // ignore
    }
    return 1;
  });

  const unlockedChapters = Array.from(
    new Set([
      1,
      ...(highestChapterCompleted >= 1 || maxUnlockedChapter >= 2 ? [2] : []),
      ...(highestChapterCompleted >= 2 || maxUnlockedChapter >= 3 || chapter2Completed || chapter3Unlocked ? [3] : []),
    ])
  );

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
          desk4bLooted,
          mayResolved,
          key14OnFloor,
          key14Collected,
          locker14Unlocked,
          locker14Looted,
          stairwayGateKeyTaken,
          stairwayGateUnlocked,
          chapter3Unlocked,
          chapter2Completed,
          chapter3Completed,
          chapter3IntroSeen,
          maxUnlockedChapter,
          unlockedChapters,
          hasMagneticCompass,
          doorSmashed,
          doorUnlocked,
          phase3Location,
          hasSmallBrassKey,
          hasNylonRope,
          washroomStallChecked,
          washroomMirrorScratched,
          stairwellGateInspected,
          garageDrained,
          wellRootsSevered,
          wellPulleyRigged,
          wellRopeRigged,
          cassetteInserted,
          cassettePlayed,
          conduitUnlocked,
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
    desk4bLooted,
    mayResolved,
    key14OnFloor,
    key14Collected,
    locker14Unlocked,
    locker14Looted,
    stairwayGateKeyTaken,
    stairwayGateUnlocked,
    chapter3Unlocked,
    chapter2Completed,
    chapter3Completed,
    chapter3IntroSeen,
    garageDrained,
    wellRootsSevered,
    wellPulleyRigged,
    wellRopeRigged,
    cassetteInserted,
    cassettePlayed,
    conduitUnlocked,
    maxUnlockedChapter,
    unlockedChapters,
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
      if (chapterNumber >= prev) {
        setJustUnlockedChapter(chapterNumber + 1);
        return Math.max(prev, chapterNumber);
      }
      return prev;
    });
  };

  const resetProgress = () => {
    setHighestChapterCompleted(0);
    setMaxUnlockedChapter(1);
    setChapter2Completed(false);
    setChapter3Completed(false);
    setJustUnlockedChapter(null);
    setComposure(100);
    setChapter1TimeSeconds(0);
    setDiscoveredClues([]);
    setInventory([]);
    setActiveInspectSubScene('main');
    setSelectedInventoryItem(null);
    setDeskMugMoved(false);
    setDesk4bLooted(false);
    setMayResolved(false);
    setKey14OnFloor(false);
    setKey14Collected(false);
    setLocker14Unlocked(false);
    setLocker14Looted(false);
    setStairwayGateKeyTaken(false);
    setStairwayGateUnlocked(false);
    setChapter3Unlocked(false);
    setHasMagneticCompass(false);
    setDoorSmashed(false);
    setDoorUnlocked(false);
    setPhase3Location('hallway_threshold');
    setHasSmallBrassKey(false);
    setHasNylonRope(false);
    setWashroomStallChecked(false);
    setWashroomMirrorScratched(false);
    setStairwellGateInspected(false);
    setGarageDrained(false);
    setWellRootsSevered(false);
    setWellPulleyRigged(false);
    setWellRopeRigged(false);
    setCassetteInserted(false);
    setCassettePlayed(false);
    setConduitUnlocked(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('spirits_labyrinth_ch3_unlocked');
      localStorage.removeItem('spirits_labyrinth_ch3_completed');
      localStorage.removeItem('spirits_labyrinth_ch2_unlocked');
      localStorage.removeItem('spirits_labyrinth_active_save');
      localStorage.removeItem('spirits_labyrinth_chapter_1_save');
      PrologBridge.initGameState();
    } catch {
      // ignore
    }
  };

  const resetChapterOneProgress = () => {
    setHighestChapterCompleted(0);
    setMaxUnlockedChapter(1);
    setChapter2Completed(false);
    setChapter3Completed(false);
    setJustUnlockedChapter(null);
    setComposure(100);
    setChapter1TimeSeconds(0);
    setDiscoveredClues([]);
    setInventory([]);
    setActiveInspectSubScene('main');
    setSelectedInventoryItem(null);
    setDeskMugMoved(false);
    setDesk4bLooted(false);
    setMayResolved(false);
    setKey14OnFloor(false);
    setKey14Collected(false);
    setLocker14Unlocked(false);
    setLocker14Looted(false);
    setStairwayGateKeyTaken(false);
    setStairwayGateUnlocked(false);
    setChapter3Unlocked(false);
    setHasMagneticCompass(false);
    setDoorSmashed(false);
    setDoorUnlocked(false);
    setPhase3Location('hallway_threshold');
    setHasSmallBrassKey(false);
    setHasNylonRope(false);
    setWashroomStallChecked(false);
    setWashroomMirrorScratched(false);
    setStairwellGateInspected(false);
    setGarageDrained(false);
    setWellRootsSevered(false);
    setWellPulleyRigged(false);
    setWellRopeRigged(false);
    setCassetteInserted(false);
    setCassettePlayed(false);
    setConduitUnlocked(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('spirits_labyrinth_ch3_unlocked');
      localStorage.removeItem('spirits_labyrinth_ch3_completed');
      localStorage.removeItem('spirits_labyrinth_ch2_unlocked');
      localStorage.removeItem('spirits_labyrinth_active_save');
      localStorage.removeItem('spirits_labyrinth_chapter_1_save');
      PrologBridge.initGameState();
    } catch {
      // ignore
    }
  };

  const advanceToChapter = (chapterNumber: number) => {
    if (chapterNumber >= 3) {
      setHighestChapterCompleted((prev) => Math.max(prev, 2));
      setMaxUnlockedChapter((prev) => Math.max(prev, 3));
      setChapter2Completed(true);
      setChapter3Unlocked(true);
      setStairwayGateUnlocked(true);
      setPhase3Location('hostel_outer_grounds');
      try {
        localStorage.setItem('spirits_labyrinth_ch3_unlocked', 'true');
        const activeSave = JSON.parse(localStorage.getItem('spirits_labyrinth_active_save') || '{}');
        activeSave.chapter2Completed = true;
        activeSave.chapter3Unlocked = true;
        activeSave.chapter = 3;
        activeSave.currentChapter = 3;
        activeSave.maxUnlockedChapter = Math.max(activeSave.maxUnlockedChapter || 0, 3);
        activeSave.highestChapterCompleted = Math.max(activeSave.highestChapterCompleted || 0, 2);
        activeSave.unlockedChapters = [1, 2, 3];
        activeSave.stairwayGateUnlocked = true;
        activeSave.phase3Location = 'hostel_outer_grounds';
        localStorage.setItem('spirits_labyrinth_active_save', JSON.stringify(activeSave));
      } catch {
        // ignore
      }
    } else if (chapterNumber === 2) {
      setHighestChapterCompleted((prev) => Math.max(prev, 1));
      setMaxUnlockedChapter((prev) => Math.max(prev, 2));
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
        try {
          PrologBridge.queryOnce(`assertz(player_has(${itemId}))`);
        } catch {}
        return [...prev, itemId];
      }
      return prev;
    });
  };

  const removeInventoryItem = (itemId: string) => {
    try {
      PrologBridge.queryOnce(`retractall(player_has(${itemId}))`);
    } catch {}
    setInventory((prev) => prev.filter((i) => i !== itemId));
  };

  const hasInventoryItem = (itemId: string): boolean => {
    return inventory.includes(itemId);
  };

  const drainGarage = async () => {
    try {
      await PrologBridge.drainGarage();
    } catch {}
    setGarageDrained(true);
  };

  const pickupGarageItem = async (itemId: string) => {
    try {
      await PrologBridge.takeGarageItem(itemId as any);
    } catch {}
    addInventoryItem(itemId);
  };

  const pickupLockerTape = async () => {
    try {
      await PrologBridge.takeLockerTape();
    } catch {}
    setLocker14Looted(true);
    addInventoryItem('cassette_tape_may');
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
        removeInventoryItem,
        hasInventoryItem,
        activeInspectSubScene,
        setActiveInspectSubScene,
        selectedInventoryItem,
        setSelectedInventoryItem,
        deskMugMoved,
        setDeskMugMoved,
        desk4bLooted,
        setDesk4bLooted,
        mayResolved,
        setMayResolved,
        key14OnFloor,
        setKey14OnFloor,
        key14Collected,
        setKey14Collected,
        locker14Unlocked,
        setLocker14Unlocked,
        locker14Looted,
        setLocker14Looted,
        stairwayGateKeyTaken,
        setStairwayGateKeyTaken,
        stairwayGateUnlocked,
        setStairwayGateUnlocked,
        chapter3Unlocked,
        setChapter3Unlocked,
        chapter2Completed,
        setChapter2Completed,
        chapter3Completed,
        setChapter3Completed,
        chapter3IntroSeen,
        setChapter3IntroSeen,
        garageDrained,
        setGarageDrained,
        wellRootsSevered,
        setWellRootsSevered,
        wellPulleyRigged,
        setWellPulleyRigged,
        wellRopeRigged,
        setWellRopeRigged,
        cassetteInserted,
        setCassetteInserted,
        cassettePlayed,
        setCassettePlayed,
        conduitUnlocked,
        setConduitUnlocked,
        addToInventory: addInventoryItem,
        drainGarage,
        pickupGarageItem,
        pickupLockerTape,
        maxUnlockedChapter,
        setMaxUnlockedChapter,
        unlockedChapters,
        addItem: addInventoryItem,
        removeItem: removeInventoryItem,
        removeFromInventory: removeInventoryItem,
        advanceToChapter,
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

export function useGameStore() {
  const context = useContext(GameProgressContext);
  if (!context) {
    return {
      inventory: [] as string[],
      addItem: (_itemId: string) => {},
      addInventoryItem: (_itemId: string) => {},
      addToInventory: (_itemId: string) => {},
      removeItem: (_itemId: string) => {},
      removeInventoryItem: (_itemId: string) => {},
      removeFromInventory: (_itemId: string) => {},
      hasInventoryItem: (_itemId: string) => false,
      locker14Unlocked: false,
      setLocker14Unlocked: (_val: boolean | ((prev: boolean) => boolean)) => {},
      locker14Looted: false,
      setLocker14Looted: (_val: boolean | ((prev: boolean) => boolean)) => {},
      stairwayGateKeyTaken: false,
      setStairwayGateKeyTaken: (_val: boolean | ((prev: boolean) => boolean)) => {},
      stairwayGateUnlocked: false,
      setStairwayGateUnlocked: (_val: boolean | ((prev: boolean) => boolean)) => {},
      chapter3Unlocked: false,
      setChapter3Unlocked: (_val: boolean | ((prev: boolean) => boolean)) => {},
      chapter2Completed: false,
      setChapter2Completed: (_val: boolean | ((prev: boolean) => boolean)) => {},
      chapter3Completed: false,
      setChapter3Completed: (_val: boolean | ((prev: boolean) => boolean)) => {},
      chapter3IntroSeen: false,
      setChapter3IntroSeen: (_val: boolean | ((prev: boolean) => boolean)) => {},
      garageDrained: false,
      setGarageDrained: (_val: boolean | ((prev: boolean) => boolean)) => {},
      wellRootsSevered: false,
      setWellRootsSevered: (_val: boolean | ((prev: boolean) => boolean)) => {},
      wellPulleyRigged: false,
      setWellPulleyRigged: (_val: boolean | ((prev: boolean) => boolean)) => {},
      wellRopeRigged: false,
      setWellRopeRigged: (_val: boolean | ((prev: boolean) => boolean)) => {},
      cassetteInserted: false,
      setCassetteInserted: (_val: boolean | ((prev: boolean) => boolean)) => {},
      cassettePlayed: false,
      setCassettePlayed: (_val: boolean | ((prev: boolean) => boolean)) => {},
      conduitUnlocked: false,
      setConduitUnlocked: (_val: boolean | ((prev: boolean) => boolean)) => {},
      drainGarage: async () => {
        try {
          await PrologBridge.drainGarage();
        } catch {}
      },
      pickupGarageItem: async (itemId: string) => {
        try {
          await PrologBridge.takeGarageItem(itemId as any);
        } catch {}
      },
      pickupLockerTape: async () => {
        try {
          await PrologBridge.takeLockerTape();
        } catch {}
      },
      maxUnlockedChapter: 1,
      setMaxUnlockedChapter: (_val: number | ((prev: number) => number)) => {},
      unlockedChapters: [1],
      advanceToChapter: (_chapterNumber: number) => {},
      discoveredClues: [] as string[],
      addDiscoveredClue: (_clueId: string) => {},
      composure: 100,
      setComposure: (_val: number | ((prev: number) => number)) => {},
    };
  }
  return {
    ...context,
    addItem: context.addInventoryItem,
    addToInventory: context.addInventoryItem,
    removeItem: context.removeInventoryItem,
    removeFromInventory: context.removeInventoryItem,
  };
}

useGameStore.getState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : {};
    const active = JSON.parse(localStorage.getItem('spirits_labyrinth_active_save') || '{}');
    const ch3Unlocked = localStorage.getItem('spirits_labyrinth_ch3_unlocked') === 'true' && parsed.chapter3Unlocked !== false;
    const isCh2Done = Boolean(parsed.chapter2Completed || active.chapter2Completed || (parsed.highestChapterCompleted >= 2) || (ch3Unlocked && parsed.chapter3Unlocked !== false));
    const maxUnlocked = Math.max(parsed.maxUnlockedChapter || 1, active.maxUnlockedChapter || 1, (ch3Unlocked || isCh2Done) && parsed.maxUnlockedChapter !== 1 ? 3 : (parsed.highestChapterCompleted >= 1 || active.chapter1Completed ? 2 : 1));
    const unlocked = Array.from(new Set([1, ...(maxUnlocked >= 2 ? [2] : []), ...(maxUnlocked >= 3 ? [3] : [])]));

    return {
      ...parsed,
      inventory: parsed.inventory || active.inventory || [],
      locker14Unlocked: Boolean(parsed.locker14Unlocked || active.locker14Unlocked),
      setLocker14Unlocked: (val: boolean) => {
        useGameStore.setState({ locker14Unlocked: val });
      },
      locker14Looted: Boolean(parsed.locker14Looted || active.locker14Looted),
      setLocker14Looted: (val: boolean) => {
        useGameStore.setState({ locker14Looted: val });
      },
      garageDrained: Boolean(parsed.garageDrained || active.garageDrained),
      setGarageDrained: (drained: boolean) => {
        useGameStore.setState({ garageDrained: drained });
      },
      wellRootsSevered: Boolean(parsed.wellRootsSevered || active.wellRootsSevered),
      setWellRootsSevered: (severed: boolean) => {
        useGameStore.setState({ wellRootsSevered: severed });
      },
      wellPulleyRigged: Boolean(parsed.wellPulleyRigged || active.wellPulleyRigged),
      setWellPulleyRigged: (rigged: boolean) => {
        useGameStore.setState({ wellPulleyRigged: rigged });
      },
      wellRopeRigged: Boolean(parsed.wellRopeRigged || active.wellRopeRigged),
      setWellRopeRigged: (rigged: boolean) => {
        useGameStore.setState({ wellRopeRigged: rigged });
      },
      cassetteInserted: Boolean(parsed.cassetteInserted || active.cassetteInserted),
      setCassetteInserted: (val: boolean) => {
        useGameStore.setState({ cassetteInserted: val });
      },
      cassettePlayed: Boolean(parsed.cassettePlayed || active.cassettePlayed),
      setCassettePlayed: (val: boolean) => {
        useGameStore.setState({ cassettePlayed: val });
      },
      conduitUnlocked: Boolean(parsed.conduitUnlocked || active.conduitUnlocked),
      setConduitUnlocked: (val: boolean) => {
        useGameStore.setState({ conduitUnlocked: val });
      },
      removeFromInventory: (itemId: string) => {
        const inv = (parsed.inventory || active.inventory || []).filter((i: string) => i !== itemId);
        useGameStore.setState({ inventory: inv });
      },
      addToInventory: (itemId: string) => {
        const inv = parsed.inventory || active.inventory || [];
        if (!inv.includes(itemId)) {
          useGameStore.setState({ inventory: [...inv, itemId] });
        }
      },
      drainGarage: async () => {
        await PrologBridge.drainGarage();
        useGameStore.setState({ garageDrained: true });
      },
      pickupGarageItem: async (itemId: string) => {
        await PrologBridge.takeGarageItem(itemId as any);
        const inv = parsed.inventory || active.inventory || [];
        if (!inv.includes(itemId)) {
          useGameStore.setState({ inventory: [...inv, itemId] });
        }
      },
      pickupLockerTape: async () => {
        await PrologBridge.takeLockerTape();
        const inv = parsed.inventory || active.inventory || [];
        if (!inv.includes('cassette_tape_may')) {
          useGameStore.setState({ inventory: [...inv, 'cassette_tape_may'] });
        }
      },
      chapter2Completed: isCh2Done,
      chapter3Completed: Boolean(parsed.chapter3Completed || active.chapter3Completed || localStorage.getItem('spirits_labyrinth_ch3_completed') === 'true'),
      setChapter3Completed: (val: boolean) => {
        useGameStore.setState({ chapter3Completed: val });
      },
      chapter3IntroSeen: Boolean(parsed.chapter3IntroSeen || active.chapter3IntroSeen),
      setChapter3IntroSeen: (seen: boolean) => {
        useGameStore.setState({ chapter3IntroSeen: seen });
      },
      maxUnlockedChapter: maxUnlocked,
      unlockedChapters: unlocked,
      advanceToChapter: (chapterNumber: number) => {
        try {
          const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
          current.highestChapterCompleted = Math.max(current.highestChapterCompleted || 0, chapterNumber - 1);
          current.maxUnlockedChapter = Math.max(current.maxUnlockedChapter || 0, chapterNumber);
          if (chapterNumber >= 3) {
            current.chapter2Completed = true;
            current.chapter3Unlocked = true;
            current.stairwayGateUnlocked = true;
            current.phase3Location = 'hostel_outer_grounds';
            localStorage.setItem('spirits_labyrinth_ch3_unlocked', 'true');
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(current));

          const activeSave = JSON.parse(localStorage.getItem('spirits_labyrinth_active_save') || '{}');
          activeSave.currentChapter = chapterNumber;
          activeSave.maxUnlockedChapter = Math.max(activeSave.maxUnlockedChapter || 0, chapterNumber);
          activeSave.highestChapterCompleted = Math.max(activeSave.highestChapterCompleted || 0, chapterNumber - 1);
          if (chapterNumber >= 3) {
            activeSave.chapter = 3;
            activeSave.chapter2Completed = true;
            activeSave.chapter3Unlocked = true;
            activeSave.stairwayGateUnlocked = true;
            activeSave.phase3Location = 'hostel_outer_grounds';
          }
          localStorage.setItem('spirits_labyrinth_active_save', JSON.stringify(activeSave));
        } catch {}
      },
    };
  } catch {
    return {
      advanceToChapter: (_chapterNumber: number) => {},
    };
  }
};

useGameStore.setState = (updates: any) => {
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const merged = { ...current, ...updates };
    if (updates.maxUnlockedChapter !== undefined) {
      merged.maxUnlockedChapter = updates.maxUnlockedChapter;
    }
    if (updates.chapter3Unlocked === true || updates.chapter2Completed === true || updates.maxUnlockedChapter >= 3) {
      merged.chapter3Unlocked = true;
      merged.chapter2Completed = true;
      merged.maxUnlockedChapter = Math.max(merged.maxUnlockedChapter || 0, 3);
      localStorage.setItem('spirits_labyrinth_ch3_unlocked', 'true');
    } else if (updates.chapter3Unlocked === false || updates.chapter === 1 || updates.maxUnlockedChapter === 1) {
      merged.chapter3Unlocked = false;
      merged.chapter2Completed = false;
      localStorage.removeItem('spirits_labyrinth_ch3_unlocked');
    }

    if (updates.chapter3Completed === true) {
      merged.chapter3Completed = true;
      merged.highestChapterCompleted = Math.max(merged.highestChapterCompleted || 0, 3);
      localStorage.setItem('spirits_labyrinth_ch3_completed', 'true');
    } else if (updates.chapter3Completed === false) {
      merged.chapter3Completed = false;
      localStorage.removeItem('spirits_labyrinth_ch3_completed');
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));

    const activeSave = JSON.parse(localStorage.getItem('spirits_labyrinth_active_save') || '{}');
    const mergedActive = { ...activeSave, ...updates };
    if (updates.chapter3Unlocked === true || updates.chapter2Completed === true || updates.maxUnlockedChapter >= 3) {
      mergedActive.chapter3Unlocked = true;
      mergedActive.chapter2Completed = true;
      mergedActive.maxUnlockedChapter = Math.max(mergedActive.maxUnlockedChapter || 0, 3);
    } else if (updates.chapter3Unlocked === false || updates.chapter === 1) {
      mergedActive.chapter3Unlocked = false;
      mergedActive.chapter2Completed = false;
      mergedActive.stairwayGateUnlocked = false;
    }

    if (updates.chapter3Completed === true) {
      mergedActive.chapter3Completed = true;
      mergedActive.highestChapterCompleted = Math.max(mergedActive.highestChapterCompleted || 0, 3);
    } else if (updates.chapter3Completed === false) {
      mergedActive.chapter3Completed = false;
    }

    localStorage.setItem('spirits_labyrinth_active_save', JSON.stringify(mergedActive));

    if (Array.isArray(updates.inventory)) {
      updates.inventory.forEach((item: string) => {
        PrologBridge.queryOnce(`assertz(player_has(${item}))`);
      });
    }
  } catch {}
};
