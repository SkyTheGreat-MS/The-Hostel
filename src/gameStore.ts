// State Reducer & Store for Chapter 1 Flow & Reset Routine
import { MCId, Phase3Location, Room4BSubScene, ChapterProgressSave, ActiveSaveState } from './types';

export interface ChapterOneState {
  // 1. Reset Core Flow & Phase
  phase: number;
  currentScene: string;
  currentSubScene: string | null;
  phase3Location: Phase3Location;
  isPaused: boolean;
  activeMonologue: string | null;
  activeItemModal: string | null;

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
  caretakerDoorUnlocked: boolean;
  altarCandlesPlaced: number;
  altarBellPlaced: boolean;
  natSummoned: boolean;
  corridorShadowScareTriggered: boolean;
  chapter1Completed: boolean;
}

export const initialChapterOneState: ChapterOneState = {
  phase: 1,
  currentScene: 'seance_room_4b_2026',
  currentSubScene: null,
  phase3Location: 'hallway_threshold',
  isPaused: false,
  activeMonologue: null,
  activeItemModal: null,
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
  caretakerDoorUnlocked: false,
  altarCandlesPlaced: 0,
  altarBellPlaced: false,
  natSummoned: false,
  corridorShadowScareTriggered: false,
  chapter1Completed: false,
};

export type GameStoreAction =
  | { type: 'RESET_CHAPTER_ONE' }
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
  | { type: 'SET_HAS_LOCKER_09_MATCHBOX'; payload: boolean };

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

    default:
      return state;
  }
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
  currentComposure: number = 100
): ActiveSaveState {
  const chapterTwoSaveState: ActiveSaveState = {
    chapter: 2,
    currentPhase: 1, // Chapter 2, Phase 1 (The Prayer Room Rite)
    phase3Location: 'east_fork',
    chapter1Completed: true,
    selectedCharacterId,
    inventory: [
      'bobby_pin',
      'wooden_bat',
      'small_brass_key_32',
      'coiled_nylon_rope',
      'black_beeswax_candle', // x3 acquired
      'matchbox_three_stars',
      'bronze_prayer_bell',
    ],
    hasMatchesCount: 3,
    hasBlackCandlesCount: 3,
    hasBronzeBell: true,
    caretakerDoorUnlocked: true,
    composure: currentComposure,
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
