export type MCId =
  | 'moe_stheinkha'
  | 'ye_yint_hein'
  | 'may_jewel'
  | 'yin_min_htike'
  | 'hsu_myat_shein'
  | 'mona'
  | 'thazin'
  | 'min_khant'
  | 'htet'
  | 'aye_aye'
  | 'kyaw_swar'
  | 'su_su';

export type TriggerType = 'supernatural_direct' | 'physical_threat' | 'betrayal';

export type ComposureState = 'normal' | 'shaken' | 'panicking' | 'broken';

export type EndingId =
  | 'time_expired'
  | 'composure_zero'
  | 'grief_overflow'
  | 'true_rest'
  | 'twist_ending'
  | 'deceived'
  | 'misunderstood';

export interface MCCharacter {
  id: MCId;
  name: string;
  archetype: string;
  description: string;
  multipliers: Record<TriggerType, number>;
}

export interface Clue {
  id: string;
  locationId: string;
  title: string;
  details: string;
  pointsTo: string;
  isCipher?: boolean;
}

export interface HostelLocation {
  id: string;
  name: string;
  description: string;
  turnCost: number;
}

export interface GuardianPair {
  id: number;
  statementA: string;
  statementB: string;
  trueIndex: 1 | 2;
}

export interface RiddleOption {
  id: string;
  meaningKey: string;
  label: string;
}

export interface VictimRiddle {
  topic: 'cause_of_death' | 'killer_identity' | 'body_location';
  title: string;
  symbolicText: string;
  trueMeaning: string;
  options: RiddleOption[];
}

export interface Item {
  id: string;
  name: string;
  type?: string;
  icon?: string;
  description: string;
  isSpecial?: boolean;
  usageHint?: string;
}

export type Room4BSubScene = 'main' | 'desk' | 'stool' | 'wardrobe' | 'calendar' | 'door';

export type Phase3Location =
  | 'hallway_threshold'
  | 'west_split_landing'
  | 'stairwell_gate'
  | 'washroom_main'
  | 'washroom_basin'
  | 'washroom_stall'
  | 'washroom_rope'
  | 'washroom_mirror'
  | 'east_corridor'
  | 'east_fork'
  | 'lockers_main'
  | 'locker_32'
  | 'locker_09'
  | 'locker_14'
  | 'locker_spider'
  | 'prayer_room_main'
  | 'prayer_altar'
  | 'caretaker_door_keypad'
  | 'caretaker_office_main';

export interface GameState {
  chapter: number;
  explorationCount: number;
  shadowEventTriggered?: boolean;
  timeRemaining: number;
  playerComposure: number;
  mamaMayGrief: number;
  selectedMC: MCId;
  composureState: ComposureState;
  gameOver: EndingId | null;
  discoveredClues: string[];
  decodedCiphers: string[];
  deducedChoices: Record<number, number>;
  usedUnverifiedClaims: Record<number, string>;
  decodeChoices: Record<string, string>;
  trustedFacts: Record<string, string>;
  misreadFacts: Record<string, string>;
  ritePerformed: boolean | null;
  finalAccusation: {
    killer: string;
    cause: string;
    location: string;
  } | null;
  historyLog: string[];
  inventory: string[];
  activeInspectSubScene: 'main' | 'desk' | 'stool' | 'wardrobe' | 'calendar' | 'door';
  selectedInventoryItem: string | null;
  deskMugMoved: boolean;
  hasMagneticCompass: boolean;
  doorSmashed: boolean;
  phase3Location: Phase3Location;
  hasSmallBrassKey: boolean; // Tag "32" from soaked shirt pocket
  hasNylonRope: boolean;      // Retrieved from washroom overhead pipe
  washroomStallChecked: boolean;
  washroomMirrorScratched: boolean;
  stairwellGateInspected: boolean;
  hasBlackCandlesCount: number; // 0 to 3
  hasMatchesCount: number;      // starts at 3 once matchbox picked
  hasBronzeBell: boolean;
  hasReadLocker32Note: boolean;
  hasReadSandarLetters: boolean;
  hasLocker09Candle: boolean;
  hasLocker09Matchbox: boolean;
  caretakerDoorUnlocked: boolean;
  altarCandlesPlaced: number;   // 0 to 3
  altarBellPlaced: boolean;
  natSummoned: boolean;
  corridorShadowScareTriggered: boolean;
  chapter1Completed: boolean;
}

export interface PLUnitTest {
  name: string;
  description: string;
  run: () => { passed: boolean; message: string; details?: string[] };
}

export interface ActiveSaveState {
  chapter: number;
  currentPhase: number;
  phase3Location: Phase3Location;
  chapter1Completed: boolean;
  selectedCharacterId: string;
  inventory: string[];
  hasMatchesCount: number;
  hasBlackCandlesCount?: number;
  hasBronzeBell?: boolean;
  caretakerDoorUnlocked: boolean;
  composure: number;
  timestamp: number;
}

export interface ChapterProgressSave {
  chapter: number;
  currentPhase: 1 | 2 | 3;
  phase3Location?: Phase3Location;
  selectedCharacterId: string | null;
  inventory: string[];
  discoveredClues: string[];
  hasBobbyPin: boolean;
  hasWoodenBat: boolean;
  hasMagneticCompass: boolean;
  hasSmallBrassKey: boolean;
  hasNylonRope: boolean;
  deskMugMoved: boolean;
  doorUnlocked: boolean;
  composure: number;
  timerSeconds: number;
  timestamp: number;
  hasBlackCandlesCount?: number;
  hasMatchesCount?: number;
  hasBronzeBell?: boolean;
  hasReadLocker32Note?: boolean;
  hasReadSandarLetters?: boolean;
  hasLocker09Candle?: boolean;
  hasLocker09Matchbox?: boolean;
  caretakerDoorUnlocked?: boolean;
  altarCandlesPlaced?: number;
  altarBellPlaced?: boolean;
  natSummoned?: boolean;
  corridorShadowScareTriggered?: boolean;
  chapter1Completed?: boolean;
}
