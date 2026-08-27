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
}

export interface PLUnitTest {
  name: string;
  description: string;
  run: () => { passed: boolean; message: string; details?: string[] };
}
