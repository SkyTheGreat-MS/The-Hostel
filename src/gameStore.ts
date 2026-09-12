// State Reducer & Store for Chapter 1 Flow & Reset Routine
import {
  MCId,
  Phase3Location,
  Room4BSubScene,
  ChapterProgressSave,
  ActiveSaveState,
  NatKnowledgeTier,
  NatTopicDef,
  NAT_TOPIC_REGISTRY,
  NatKnowledgeEntry,
  NAT_KNOWLEDGE_BASE,
  getNatKnowledge,
} from './types';
import { sound } from './audioEngine';
import { CHARACTER_ROSTER } from './characterData';

export {
  type NatKnowledgeTier,
  type NatTopicDef,
  NAT_TOPIC_REGISTRY,
  type NatKnowledgeEntry,
  NAT_KNOWLEDGE_BASE,
  getNatKnowledge,
};

// Helper to evaluate system pausing status: ONLY true pause freezes world clock and mental attrition
export const getIsSystemPaused = (isPaused: boolean, currentScreen: string = 'gameplay'): boolean => {
  return isPaused || currentScreen !== 'gameplay';
};

export interface ChapterOneState {
  // 1. Reset Core Flow & Phase
  phase: number;
  currentScene: string;
  currentSubScene: string | null;
  phase3Location: Phase3Location;
  isPaused: boolean;
  activeMonologue: string | null;
  activeItemModal: string | null;
  currentScreen?: string;
  isSystemPaused?: boolean;

  // 2. Reset Player Vitals & Timers
  timerSeconds: number;
  composure: number;

  // 3. Purge Inventory & Environmental Interaction Flags
  inventory: string[];
  discoveredClues: string[];
  hasBobbyPin: boolean;
  hasWoodenBat: boolean;
  hasMagneticCompass: boolean;
  hasSmallBrassKey: boolean;
  hasNylonRope: boolean;
  deskMugMoved: boolean;
  doorUnlocked: boolean;
  washroomStallChecked: boolean;
  washroomMirrorScratched: boolean;
  stairwellGateInspected: boolean;
  hasBlackCandlesCount: number;
  hasMatchesCount: number;
  hasBronzeBell: boolean;
  hasReadLocker32Note: boolean;
  hasReadSandarLetters: boolean;
  hasLocker09Candle: boolean;
  hasLocker09Matchbox: boolean;
  hasCaretakerCandles?: boolean;
  caretakerDoorUnlocked: boolean;
  altarCandlesPlaced: number;
  altarBellPlaced: boolean;
  natSummoned: boolean;
  hasConsultedNat: boolean;
  askedNatTopics?: string[];
  activeNatDialogue?: {
    speaker: string;
    text: string;
    pose: 'neutral' | 'pensive' | 'warning';
  } | null;
  selectedCharacterId?: string | null;
  corridorShadowScareTriggered: boolean;
  chapter1Completed: boolean;
  natAudienceConcluded?: boolean;
  currentChapter?: number;
}

export const initialChapterOneState: ChapterOneState = {
  phase: 1,
  currentScene: 'seance_room_4b_2026',
  currentSubScene: null,
  phase3Location: 'hallway_threshold',
  isPaused: false,
  activeMonologue: null,
  activeItemModal: null,
  currentScreen: 'gameplay',
  isSystemPaused: false,
  timerSeconds: 600,
  composure: 100,
  inventory: [],
  discoveredClues: [],
  hasBobbyPin: false,
  hasWoodenBat: false,
  hasMagneticCompass: false,
  hasSmallBrassKey: false,
  hasNylonRope: false,
  deskMugMoved: false,
  doorUnlocked: false,
  washroomStallChecked: false,
  washroomMirrorScratched: false,
  stairwellGateInspected: false,
  hasBlackCandlesCount: 0,
  hasMatchesCount: 0,
  hasBronzeBell: false,
  hasReadLocker32Note: false,
  hasReadSandarLetters: false,
  hasLocker09Candle: false,
  hasLocker09Matchbox: false,
  hasCaretakerCandles: false,
  caretakerDoorUnlocked: false,
  altarCandlesPlaced: 0,
  altarBellPlaced: false,
  natSummoned: false,
  hasConsultedNat: false,
  askedNatTopics: [],
  activeNatDialogue: null,
  selectedCharacterId: 'moe_stheinkha',
  corridorShadowScareTriggered: false,
  chapter1Completed: false,
  natAudienceConcluded: false,
  currentChapter: 1,
};

export type GameStoreAction =
  | { type: 'RESET_CHAPTER_ONE' }
  | { type: 'SET_SELECTED_CHARACTER_ID'; payload: string | null }
  | { type: 'SET_PHASE'; payload: number }
  | { type: 'SET_CURRENT_SCENE'; payload: string }
  | { type: 'SET_CURRENT_SUBSCENE'; payload: string | null }
  | { type: 'SET_PHASE3_LOCATION'; payload: Phase3Location }
  | { type: 'SET_IS_PAUSED'; payload: boolean }
  | { type: 'SET_ACTIVE_MONOLOGUE'; payload: string | null }
  | { type: 'SET_ACTIVE_ITEM_MODAL'; payload: string | null }
  | { type: 'SET_TIMER_SECONDS'; payload: number | ((prev: number) => number) }
  | { type: 'SET_COMPOSURE'; payload: number | ((prev: number) => number) }
  | { type: 'SET_INVENTORY'; payload: string[] | ((prev: string[]) => string[]) }
  | { type: 'ADD_INVENTORY_ITEM'; payload: string }
  | { type: 'SET_DISCOVERED_CLUES'; payload: string[] | ((prev: string[]) => string[]) }
  | { type: 'ADD_DISCOVERED_CLUE'; payload: string }
  | { type: 'SET_HAS_BOBBY_PIN'; payload: boolean }
  | { type: 'SET_HAS_WOODEN_BAT'; payload: boolean }
  | { type: 'SET_HAS_MAGNETIC_COMPASS'; payload: boolean }
  | { type: 'SET_HAS_SMALL_BRASS_KEY'; payload: boolean }
  | { type: 'SET_HAS_NYLON_ROPE'; payload: boolean }
  | { type: 'SET_DESK_MUG_MOVED'; payload: boolean }
  | { type: 'SET_DOOR_UNLOCKED'; payload: boolean }
  | { type: 'SET_WASHROOM_STALL_CHECKED'; payload: boolean }
  | { type: 'SET_WASHROOM_MIRROR_SCRATCHED'; payload: boolean }
  | { type: 'SET_STAIRWELL_GATE_INSPECTED'; payload: boolean }
  | { type: 'SET_HAS_READ_LOCKER_32_NOTE'; payload: boolean }
  | { type: 'SET_HAS_READ_SANDAR_LETTERS'; payload: boolean }
  | { type: 'SET_HAS_LOCKER_09_CANDLE'; payload: boolean }
  | { type: 'SET_HAS_LOCKER_09_MATCHBOX'; payload: boolean }
  | { type: 'SET_HAS_CONSULTED_NAT'; payload: boolean }
  | { type: 'SET_NAT_SUMMONED'; payload: boolean }
  | { type: 'SET_ASKED_NAT_TOPICS'; payload: string[] }
  | { type: 'ADD_ASKED_NAT_TOPIC'; payload: string }
  | { type: 'PRESENT_TARGET_TO_NAT'; payload: string }
  | {
      type: 'SET_ACTIVE_NAT_DIALOGUE';
      payload: {
        speaker: string;
        text: string;
        pose: 'neutral' | 'pensive' | 'warning';
      } | null;
    }
  | { type: 'TICK_TIMER' }
  | { type: 'APPLY_COMPOSURE_SHOCK'; payload: { baseDamage: number; tensionMultiplier?: number } }
  | { type: 'APPLY_RELIEF_SURGE'; payload: { baseRecovery: number; resolveMultiplier?: number } }
  | { type: 'ADVANCE_CHAPTER_WITH_ROLLOVER'; payload?: { resolveMultiplier?: number } }
  | { type: 'SET_NAT_AUDIENCE_CONCLUDED'; payload: boolean }
  | { type: 'SET_CURRENT_CHAPTER'; payload: number };

export function chapterOneReducer(
  state: ChapterOneState = initialChapterOneState,
  action: GameStoreAction
): ChapterOneState {
  switch (action.type) {
    case 'RESET_CHAPTER_ONE':
      return { ...initialChapterOneState };

    case 'SET_PHASE':
      return { ...state, phase: action.payload };

    case 'SET_CURRENT_SCENE':
      return { ...state, currentScene: action.payload };

    case 'SET_CURRENT_SUBSCENE':
      return { ...state, currentSubScene: action.payload };

    case 'SET_PHASE3_LOCATION':
      return { ...state, phase3Location: action.payload };

    case 'SET_IS_PAUSED':
      return { ...state, isPaused: action.payload };

    case 'SET_ACTIVE_MONOLOGUE':
      return { ...state, activeMonologue: action.payload };

    case 'SET_ACTIVE_ITEM_MODAL':
      return { ...state, activeItemModal: action.payload };

    case 'SET_TIMER_SECONDS':
      return {
        ...state,
        timerSeconds:
          typeof action.payload === 'function' ? action.payload(state.timerSeconds) : action.payload,
      };

    case 'SET_COMPOSURE':
      return {
        ...state,
        composure:
          typeof action.payload === 'function' ? action.payload(state.composure) : action.payload,
      };

    case 'SET_INVENTORY': {
      const nextInv =
        typeof action.payload === 'function' ? action.payload(state.inventory) : action.payload;
      return {
        ...state,
        inventory: nextInv,
        hasBobbyPin: nextInv.includes('bobby_pin'),
        hasWoodenBat: nextInv.includes('wooden_bat'),
        hasMagneticCompass: nextInv.includes('magnetic_compass') || state.hasMagneticCompass,
        hasSmallBrassKey: nextInv.includes('small_brass_key_32') || state.hasSmallBrassKey,
        hasNylonRope: nextInv.includes('coiled_nylon_rope') || state.hasNylonRope,
      };
    }

    case 'ADD_INVENTORY_ITEM': {
      if (state.inventory.includes(action.payload)) return state;
      const nextInv = [...state.inventory, action.payload];
      return {
        ...state,
        inventory: nextInv,
        hasBobbyPin: nextInv.includes('bobby_pin'),
        hasWoodenBat: nextInv.includes('wooden_bat'),
        hasMagneticCompass: nextInv.includes('magnetic_compass') || state.hasMagneticCompass,
        hasSmallBrassKey: nextInv.includes('small_brass_key_32') || state.hasSmallBrassKey,
        hasNylonRope: nextInv.includes('coiled_nylon_rope') || state.hasNylonRope,
      };
    }

    case 'SET_DISCOVERED_CLUES':
      return {
        ...state,
        discoveredClues:
          typeof action.payload === 'function' ? action.payload(state.discoveredClues) : action.payload,
      };

    case 'ADD_DISCOVERED_CLUE':
      if (state.discoveredClues.includes(action.payload)) return state;
      return { ...state, discoveredClues: [...state.discoveredClues, action.payload] };

    case 'SET_HAS_BOBBY_PIN':
      return {
        ...state,
        hasBobbyPin: action.payload,
        inventory: action.payload
          ? state.inventory.includes('bobby_pin')
            ? state.inventory
            : [...state.inventory, 'bobby_pin']
          : state.inventory.filter((i) => i !== 'bobby_pin'),
      };

    case 'SET_HAS_WOODEN_BAT':
      return {
        ...state,
        hasWoodenBat: action.payload,
        inventory: action.payload
          ? state.inventory.includes('wooden_bat')
            ? state.inventory
            : [...state.inventory, 'wooden_bat']
          : state.inventory.filter((i) => i !== 'wooden_bat'),
      };

    case 'SET_HAS_MAGNETIC_COMPASS':
      return { ...state, hasMagneticCompass: action.payload };

    case 'SET_HAS_SMALL_BRASS_KEY':
      return { ...state, hasSmallBrassKey: action.payload };

    case 'SET_HAS_NYLON_ROPE':
      return { ...state, hasNylonRope: action.payload };

    case 'SET_DESK_MUG_MOVED':
      return { ...state, deskMugMoved: action.payload };

    case 'SET_DOOR_UNLOCKED':
      return { ...state, doorUnlocked: action.payload };

    case 'SET_WASHROOM_STALL_CHECKED':
      return { ...state, washroomStallChecked: action.payload };

    case 'SET_WASHROOM_MIRROR_SCRATCHED':
      return { ...state, washroomMirrorScratched: action.payload };

    case 'SET_STAIRWELL_GATE_INSPECTED':
      return { ...state, stairwellGateInspected: action.payload };

    case 'SET_HAS_READ_LOCKER_32_NOTE':
      return { ...state, hasReadLocker32Note: action.payload };

    case 'SET_HAS_READ_SANDAR_LETTERS':
      return { ...state, hasReadSandarLetters: action.payload };

    case 'SET_HAS_LOCKER_09_CANDLE':
      return { ...state, hasLocker09Candle: action.payload };

    case 'SET_HAS_LOCKER_09_MATCHBOX':
      return { ...state, hasLocker09Matchbox: action.payload };

    case 'SET_HAS_CONSULTED_NAT':
      return { ...state, hasConsultedNat: action.payload };

    case 'SET_NAT_SUMMONED':
      return { ...state, natSummoned: action.payload };

    case 'SET_ASKED_NAT_TOPICS':
      return { ...state, askedNatTopics: action.payload };

    case 'ADD_ASKED_NAT_TOPIC': {
      const current = state.askedNatTopics || [];
      if (current.includes(action.payload)) return state;
      return { ...state, askedNatTopics: [...current, action.payload] };
    }

    case 'SET_SELECTED_CHARACTER_ID':
      return { ...state, selectedCharacterId: action.payload };

    case 'SET_ACTIVE_NAT_DIALOGUE':
      return { ...state, activeNatDialogue: action.payload };

    case 'PRESENT_TARGET_TO_NAT': {
      const targetId = action.payload;
      const knowledge = getNatKnowledge(targetId);
      const charId = state.selectedCharacterId || 'moe_stheinkha';
      const char = CHARACTER_ROSTER[charId] || CHARACTER_ROSTER.moe_stheinkha;
      const tensionMultiplier = char?.tensionMultiplier ?? 1.0;

      // 1. Calculate and deduct the 0.8% question strain
      const questionTax = 0.8 * tensionMultiplier;
      let additionalShock = 0;
      let text = knowledge.response;
      let pose = knowledge.spritePose;
      let addedClues = state.discoveredClues;

      if (!knowledge || knowledge.tier === 'unknown') {
        try {
          sound.playEerieHum();
        } catch {}
        text = knowledge?.response || '...';
        pose = 'neutral';
      } else if (knowledge.tier === 'forbidden_taboo') {
        try {
          sound.playGhostScreech();
        } catch {}
        additionalShock = (knowledge.shockDamage || 5) * tensionMultiplier;
        pose = 'warning';
      } else if (knowledge.caseNoteUnlock) {
        try {
          sound.playMenuSelect();
        } catch {}
        const clueKey = `nat_testimony_${targetId}`;
        if (!addedClues.includes(clueKey)) {
          addedClues = [...addedClues, clueKey];
        }
      } else {
        try {
          sound.playMenuSelect();
        } catch {}
      }

      const totalDrain = questionTax + additionalShock;
      const nextComp = Math.max(0, Number((state.composure - totalDrain).toFixed(1)));
      const asked = state.askedNatTopics || [];
      const nextAsked = [...asked, targetId]; // Track repeatable inquiries without locking

      return {
        ...state,
        composure: nextComp,
        discoveredClues: addedClues,
        askedNatTopics: nextAsked,
        activeNatDialogue: {
          speaker: 'Hostel Guardian Nat',
          text,
          pose,
        },
      };
    }

    case 'TICK_TIMER': {
      if (state.isPaused || state.timerSeconds <= 0) return state;
      return { ...state, timerSeconds: Math.max(0, state.timerSeconds - 1) };
    }

    case 'APPLY_COMPOSURE_SHOCK': {
      const tension = action.payload.tensionMultiplier ?? 1.0;
      const damage = Math.round(action.payload.baseDamage * tension);
      return { ...state, composure: Math.max(0, state.composure - damage) };
    }

    case 'APPLY_RELIEF_SURGE': {
      const resolve = action.payload.resolveMultiplier ?? 1.0;
      const recovery = Math.round(action.payload.baseRecovery * resolve);
      return { ...state, composure: Math.min(100, state.composure + recovery) };
    }

    case 'ADVANCE_CHAPTER_WITH_ROLLOVER': {
      const resolve = action.payload?.resolveMultiplier ?? 1.0;
      const nextTimer = calculateRolloverTime(state.timerSeconds);
      const nextComposure = calculateComposureRecovery(state.composure, resolve);
      return {
        ...state,
        timerSeconds: nextTimer,
        composure: nextComposure,
        chapter1Completed: true,
      };
    }

    case 'SET_NAT_AUDIENCE_CONCLUDED':
      return { ...state, natAudienceConcluded: action.payload };

    case 'SET_CURRENT_CHAPTER':
      return { ...state, currentChapter: action.payload };

    default:
      return state;
  }
}

export function getAvailableNatTopics(unlockedClues: string[] = []): NatTopicDef[] {
  return Object.values(NAT_TOPIC_REGISTRY).filter((topic) => {
    if (!topic.requiredClueId) return true;
    return unlockedClues.includes(topic.requiredClueId);
  });
}

export interface NatDialogueOutput {
  speaker: string;
  text: string;
  pose: 'neutral' | 'pensive' | 'warning';
}

export interface NatCaseNoteUnlock {
  id: string;
  title: string;
  category: string;
  snippet: string;
  unlockedAt: string;
}

export interface PresentTargetResult {
  knowledge: NatKnowledgeEntry;
  dialogue: NatDialogueOutput;
  shockDamage: number;
  caseNoteUnlock?: NatCaseNoteUnlock;
}

export function presentTargetToNat(
  targetId: string,
  typeOrCallback?:
    | 'inventory'
    | 'clue'
    | {
        selectedCharacterId?: string | null;
        applyComposureShock?: (amount: number) => void;
        addCaseNote?: (note: NatCaseNoteUnlock) => void;
        addDiscoveredClue?: (clueId: string) => void;
        setActiveNatDialogue?: (dialogue: NatDialogueOutput) => void;
        setComposure?: ((val: number | ((prev: number) => number)) => void);
      },
  callbacksParam?: {
    selectedCharacterId?: string | null;
    applyComposureShock?: (amount: number) => void;
    addCaseNote?: (note: NatCaseNoteUnlock) => void;
    addDiscoveredClue?: (clueId: string) => void;
    setActiveNatDialogue?: (dialogue: NatDialogueOutput) => void;
    setComposure?: ((val: number | ((prev: number) => number)) => void);
  }
): PresentTargetResult {
  const callbacks = typeof typeOrCallback === 'object' ? typeOrCallback : callbacksParam;
  const charId = callbacks?.selectedCharacterId || 'moe_stheinkha';
  const char = CHARACTER_ROSTER[charId] || CHARACTER_ROSTER.moe_stheinkha;
  const tensionMultiplier = char?.tensionMultiplier ?? 1.0;

  // 1. Calculate and deduct the 0.8% question strain
  const questionTax = Number((0.8 * tensionMultiplier).toFixed(2));
  if (callbacks?.applyComposureShock) {
    callbacks.applyComposureShock(questionTax);
  } else if (callbacks?.setComposure) {
    callbacks.setComposure((prev) => Math.max(0, Number((prev - questionTax).toFixed(1))));
  }

  // 2. Fetch Nat response from knowledge base
  const knowledge = getNatKnowledge(targetId);

  if (!knowledge || knowledge.tier === 'unknown') {
    try {
      sound.playEerieHum();
    } catch {}
    const fallbackText = knowledge?.response || '...';
    const dialogue: NatDialogueOutput = {
      speaker: 'Hostel Guardian Nat',
      text: fallbackText,
      pose: 'neutral',
    };
    callbacks?.setActiveNatDialogue?.(dialogue);
    return {
      knowledge,
      dialogue,
      shockDamage: questionTax,
    };
  }

  if (knowledge.tier === 'forbidden_taboo') {
    try {
      sound.playGhostScreech();
    } catch {}
    // Additional shock penalty for breaking sacred taboo
    const tabooShock = Number(((knowledge.shockDamage || 5) * tensionMultiplier).toFixed(2));
    if (callbacks?.applyComposureShock) {
      callbacks.applyComposureShock(tabooShock);
    } else if (callbacks?.setComposure) {
      callbacks.setComposure((prev) => Math.max(0, Number((prev - tabooShock).toFixed(1))));
    }
    const dialogue: NatDialogueOutput = {
      speaker: 'Hostel Guardian Nat',
      text: knowledge.response,
      pose: 'warning',
    };
    callbacks?.setActiveNatDialogue?.(dialogue);
    return {
      knowledge,
      dialogue,
      shockDamage: Number((questionTax + tabooShock).toFixed(2)),
    };
  }

  // Handle Truth / Deceit
  let caseNoteUnlock: NatCaseNoteUnlock | undefined;
  if (knowledge.caseNoteUnlock) {
    caseNoteUnlock = {
      id: `nat_testimony_${targetId}`,
      title: `Nat's Account: ${targetId}`,
      category: 'Spiritual Testimony',
      snippet: knowledge.caseNoteUnlock,
      unlockedAt: new Date().toLocaleTimeString(),
    };
    callbacks?.addCaseNote?.(caseNoteUnlock);
    callbacks?.addDiscoveredClue?.(`nat_testimony_${targetId}`);
  }

  try {
    sound.playMenuSelect();
  } catch {}
  const dialogue: NatDialogueOutput = {
    speaker: 'Hostel Guardian Nat',
    text: knowledge.response,
    pose: knowledge.spritePose,
  };
  callbacks?.setActiveNatDialogue?.(dialogue);

  return {
    knowledge,
    dialogue,
    shockDamage: questionTax,
    caseNoteUnlock,
  };
}

export const BASE_CHAPTER_TIME_SECONDS = 600;

export function calculateRolloverTime(timeRemaining: number): number {
  return BASE_CHAPTER_TIME_SECONDS + Math.max(0, timeRemaining);
}

export function calculateComposureRecovery(
  currentComposure: number,
  resolveMultiplier: number = 1.0
): number {
  const recovery = Math.round(20 * resolveMultiplier);
  return Math.min(100, currentComposure + recovery);
}

export function calculateComposureShock(
  baseDamage: number,
  tensionMultiplier: number = 1.0
): number {
  return Math.round(baseDamage * tensionMultiplier);
}

export function calculateReliefSurge(
  baseRelief: number,
  resolveMultiplier: number = 1.0
): number {
  return Math.round(baseRelief * resolveMultiplier);
}

export function tickTimer(
  currentTimer: number,
  isPaused: boolean = false
): number {
  if (isPaused || currentTimer <= 0) return currentTimer;
  return Math.max(0, currentTimer - 1);
}

/**
 * Helper to obtain fresh pristine Chapter 1 state
 */
export function resetChapterOne(): ChapterOneState {
  return { ...initialChapterOneState };
}

export const CHAPTER_1_SAVE_KEY = 'spirits_labyrinth_save_ch1';

export function saveChapterOneProgress(save: ChapterProgressSave): void {
  try {
    localStorage.setItem(CHAPTER_1_SAVE_KEY, JSON.stringify(save));
  } catch {}
}

export function loadChapterOneProgress(): ChapterProgressSave | null {
  try {
    const data = localStorage.getItem(CHAPTER_1_SAVE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && parsed.chapter === 1) {
        return parsed as ChapterProgressSave;
      }
    }
  } catch {}
  return null;
}

export function clearChapterOneProgress(): void {
  try {
    localStorage.removeItem(CHAPTER_1_SAVE_KEY);
  } catch {}
}

export function hasActiveChapterOneSave(): boolean {
  const save = loadChapterOneProgress();
  if (save) {
    return Boolean(
      save.currentPhase > 1 ||
      (save.inventory && save.inventory.length > 0) ||
      (save.discoveredClues && save.discoveredClues.length > 0) ||
      save.doorUnlocked ||
      save.deskMugMoved
    );
  }
  const active = loadActiveGameProgress();
  if (active && active.chapter === 1 && !active.chapter1Completed) {
    return Boolean(
      active.currentPhase > 1 ||
      (active.inventory && active.inventory.length > 0) ||
      (active.discoveredClues && active.discoveredClues.length > 0) ||
      active.caretakerDoorUnlocked
    );
  }
  return false;
}

export const ACTIVE_SAVE_KEY = 'spirits_labyrinth_active_save';

export function lockChapterOneAndSave(
  selectedCharacterId: string = 'thazin',
  currentComposure: number = 100,
  customInventory?: string[],
  timeRemaining: number = 0,
  resolveMultiplier: number = 1.0,
  extraFlags?: {
    natAudienceConcluded?: boolean;
    radioHasBatteries?: boolean;
    radioTuned?: boolean;
    discoveredClues?: string[];
    askedNatTopics?: string[];
    hasReadLocker32Note?: boolean;
    hasReadSandarLetters?: boolean;
    hasCaretakerCandles?: boolean;
    altarCandlesPlaced?: number;
    /** Actual match count from gameplay (0-3). Defaults to 0 if omitted. */
    hasMatchesCount?: number;
    /** Actual black candle count from gameplay (0-3). Defaults to 0 if omitted. */
    hasBlackCandlesCount?: number;
    /** Whether the bronze prayer bell was acquired. Defaults to false if omitted. */
    hasBronzeBell?: boolean;
  }
): ActiveSaveState {
  // Only fallback to test seed if customInventory was not passed at all (e.g. in unit tests).
  // During gameplay, customInventory is always provided and preserved verbatim.
  const defaultInventory = [
    'bobby_pin',
    'wooden_bat',
    'small_brass_key_32',
    'coiled_nylon_rope',
    'black_beeswax_candle',
    'black_beeswax_candle',
    'black_beeswax_candle',
    'matchbox_three_stars',
    'bronze_prayer_bell',
  ];

  const resolvedInventory = customInventory !== undefined ? customInventory : defaultInventory;
  const candleCount = extraFlags?.hasBlackCandlesCount ?? (customInventory !== undefined ? customInventory.filter(i => i === 'black_beeswax_candle').length : 3);
  const matchCount = extraFlags?.hasMatchesCount ?? (customInventory !== undefined ? (customInventory.includes('matchbox_three_stars') ? 3 : 0) : 3);
  const hasBell = extraFlags?.hasBronzeBell ?? (customInventory !== undefined ? customInventory.includes('bronze_prayer_bell') : true);

  const rolloverTime = calculateRolloverTime(timeRemaining);
  const recoveredComposure = calculateComposureRecovery(currentComposure, resolveMultiplier);

  const chapterTwoSaveState: ActiveSaveState = {
    chapter: 2,
    currentPhase: 1, // Chapter 2, Phase 1 (The Prayer Room Rite)
    phase3Location: 'east_fork',
    chapter1Completed: true,
    selectedCharacterId,
    // CRITICAL FIX: Player's earned inventory is never overwritten with defaults.
    inventory: resolvedInventory,
    discoveredClues: extraFlags?.discoveredClues,
    hasMatchesCount: matchCount,
    hasBlackCandlesCount: candleCount,
    hasBronzeBell: hasBell,
    caretakerDoorUnlocked: true,
    composure: recoveredComposure,
    timerSeconds: rolloverTime,
    natAudienceConcluded: extraFlags?.natAudienceConcluded,
    radioHasBatteries: extraFlags?.radioHasBatteries,
    radioTuned: extraFlags?.radioTuned,
    askedNatTopics: extraFlags?.askedNatTopics,
    hasReadLocker32Note: extraFlags?.hasReadLocker32Note,
    hasReadSandarLetters: extraFlags?.hasReadSandarLetters,
    hasCaretakerCandles: extraFlags?.hasCaretakerCandles,
    altarCandlesPlaced: extraFlags?.altarCandlesPlaced,
    currentChapter: 2,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(ACTIVE_SAVE_KEY, JSON.stringify(chapterTwoSaveState));
    localStorage.setItem('spirits_labyrinth_ch2_unlocked', 'true');
  } catch {}

  return chapterTwoSaveState;
}

export function createFreshChapterOneSave(): ActiveSaveState {
  return {
    chapter: 1,
    currentPhase: 1,
    chapter1Completed: false, // CRITICAL: Lock Chapter 2 again
    phase3Location: 'hallway_threshold',
    selectedCharacterId: null,
    inventory: [],
    discoveredClues: [],
    hasBobbyPin: false,
    hasWoodenBat: false,
    hasSmallBrassKey: false,
    hasNylonRope: false,
    hasBlackCandlesCount: 0,
    hasMatchesCount: 0,
    hasBronzeBell: false,
    caretakerDoorUnlocked: false,
    composure: 100,
    timerSeconds: 600,
    natAudienceConcluded: false,
    timestamp: Date.now(),
  };
}

export function restart_chapter_one(): void {
  try {
    localStorage.removeItem(ACTIVE_SAVE_KEY);
    localStorage.removeItem('spirits_labyrinth_ch2_unlocked');
    localStorage.removeItem(CHAPTER_1_SAVE_KEY);
  } catch {}
}

export const restartChapterOne = restart_chapter_one;

export function resetChapterState(): ChapterOneState {
  restart_chapter_one();
  return resetChapterOne();
}

export function loadActiveGameProgress(): ActiveSaveState | null {
  try {
    const data = localStorage.getItem(ACTIVE_SAVE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed.chapter === 'number') {
        return parsed as ActiveSaveState;
      }
    }
  } catch {}
  return null;
}

export function hasActiveChapterTwoSave(): boolean {
  try {
    const rawCh2 = localStorage.getItem('spirits_labyrinth_ch2_unlocked');
    if (rawCh2 === 'false') return false;
  } catch {}
  const save = loadActiveGameProgress();
  return Boolean(save && (save.chapter === 2 || save.chapter1Completed));
}

export default chapterOneReducer;
