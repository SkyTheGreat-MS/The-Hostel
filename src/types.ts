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

export interface CharacterProfile {
  id: string;
  name: string;
  archetype: string;
  tensionMultiplier: number; // Drain speed & blunder shock (0.8x - 1.4x)
  resolveMultiplier: number; // Relief surges & chapter recovery (0.8x - 1.5x)
  avatar: string;
}

export interface MCCharacter {
  id: MCId;
  name: string;
  archetype: string;
  description: string;
  tensionMultiplier: number;
  resolveMultiplier: number;
  multipliers?: Record<TriggerType, number>;
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

export interface InventoryItemDef {
  id: string;
  shortLabel: string;
  icon: string;
}

export interface Item {
  id: string;
  name: string;
  shortLabel?: string;
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
  | 'locker_10'
  | 'locker_14'
  | 'locker_14_interior'
  | 'locker_spider'
  | 'prayer_room_main'
  | 'prayer_altar'
  | 'caretaker_door_keypad'
  | 'caretaker_office_main'
  | 'caretaker_office'
  | 'balcony_326'
  | 'balcony'
  | 'radio_bench_inspection'
  | 'stairway_gate_inspection'
  | 'stairway_exit_gate'
  | 'hostel_outer_grounds';

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
  hasCaretakerCandles?: boolean;
  caretakerDoorUnlocked: boolean;
  altarCandlesPlaced: number;   // 0 to 3
  altarBellPlaced: boolean;
  natSummoned: boolean;
  hasConsultedNat?: boolean;
  corridorShadowScareTriggered: boolean;
  chapter1Completed: boolean;
  askedNatTopics?: string[];
}

import {
  type NatKnowledgeTier,
  type NatKnowledgeEntry,
  NAT_KNOWLEDGE_BASE,
  getNatKnowledge,
} from './natKnowledge';

export {
  type NatKnowledgeTier,
  type NatKnowledgeEntry,
  NAT_KNOWLEDGE_BASE,
  getNatKnowledge,
};

export interface NatTopicDef {
  topicId: string;
  label: string; // Display text in the question menu
  requiredClueId?: string; // Must find this clue in hostel before question appears
  knowledgeTier: NatKnowledgeTier;
  responseLine: string;
  spritePose: 'neutral' | 'pensive' | 'warning';
  shockDamage?: number;
}

export const NAT_TOPIC_REGISTRY: Record<string, NatTopicDef> = {
  may_identity: {
    topicId: 'may_identity',
    label: 'Who is the woman haunting this wing?',
    knowledgeTier: 'truth',
    responseLine: 'Her name was May. A warden\'s favorite, choke-strangled in the quiet dark of monsoon week. Her grievance anchors this entire floor.',
    spritePose: 'neutral',
  },
  locker_14_key: {
    topicId: 'locker_14_key',
    label: 'Where is the key to Locker 14?',
    requiredClueId: 'clue_locker_14_found',
    knowledgeTier: 'deceit',
    responseLine: 'The key was cast into the incinerator behind the mess hall. You will never hold it.',
    spritePose: 'warning',
  },
  broken_locket: {
    topicId: 'broken_locket',
    label: 'Show the shattered jade fragment',
    requiredClueId: 'clue_broken_locket_found',
    knowledgeTier: 'truth',
    responseLine: 'The pendant of appeasement... He ripped it from her collar before the silence took her. Return it to her sight, and her fury will pause.',
    spritePose: 'pensive',
  },
  warden_ledger: {
    topicId: 'warden_ledger',
    label: 'Ask about the caretaker\'s hidden ledger',
    requiredClueId: 'clue_warden_notes_found',
    knowledgeTier: 'unknown',
    responseLine: '...The ink of mortal bureaucrats does not echo in the spirit veil. I know nothing of his papers.',
    spritePose: 'neutral',
    shockDamage: 2,
  },
  banyan_well: {
    topicId: 'banyan_well',
    label: 'Ask about the dried well outside',
    requiredClueId: 'clue_well_rumor',
    knowledgeTier: 'forbidden_taboo',
    responseLine: '...The dry mouth beneath the roots cannot be named! Utter it again and I shall leave you to her claws!',
    spritePose: 'warning',
    shockDamage: 5,
  },
};

export type StatementVeracity = 'truth' | 'deceit' | 'forbidden_silence';

export interface NatInquiryOption {
  id: string;
  label: string; // The question player asks
  playerLine: string;
  natResponses: {
    text: string;
    veracity: StatementVeracity;
    caseNoteSnippet?: string; // Auto-logs to Case Notes
    spritePose?: 'neutral' | 'pensive' | 'warning';
  }[];
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
  selectedCharacterId: string | null;
  inventory: string[];
  discoveredClues?: string[];
  hasMatchesCount: number;
  hasBlackCandlesCount?: number;
  hasBronzeBell?: boolean;
  caretakerDoorUnlocked: boolean;
  composure: number;
  timerSeconds?: number;
  hasBobbyPin?: boolean;
  hasWoodenBat?: boolean;
  hasSmallBrassKey?: boolean;
  hasNylonRope?: boolean;
  askedNatTopics?: string[];
  natAudienceConcluded?: boolean;
  radioHasBatteries?: boolean;
  radioTuned?: boolean;
  currentChapter?: number;
  hasReadLocker32Note?: boolean;
  hasReadSandarLetters?: boolean;
  hasCaretakerCandles?: boolean;
  hasLocker09Candle?: boolean;
  hasLocker09Matchbox?: boolean;
  altarCandlesPlaced?: number;
  desk4bLooted?: boolean;
  mayResolved?: boolean;
  key14OnFloor?: boolean;
  key14Collected?: boolean;
  locker14Unlocked?: boolean;
  stairwayGateKeyTaken?: boolean;
  stairwayGateUnlocked?: boolean;
  chapter2Completed?: boolean;
  chapter3Unlocked?: boolean;
  maxUnlockedChapter?: number;
  unlockedChapters?: number[];
  highestChapterCompleted?: number;
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
  desk4bLooted?: boolean;
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
  hasCaretakerCandles?: boolean;
  caretakerDoorUnlocked?: boolean;
  altarCandlesPlaced?: number;
  altarBellPlaced?: boolean;
  natSummoned?: boolean;
  hasConsultedNat?: boolean;
  askedNatTopics?: string[];
  corridorShadowScareTriggered?: boolean;
  chapter1Completed?: boolean;
  chapter2Completed?: boolean;
  chapter3Unlocked?: boolean;
  maxUnlockedChapter?: number;
  unlockedChapters?: number[];
  highestChapterCompleted?: number;
  natAudienceConcluded?: boolean;
  mayResolved?: boolean;
  key14OnFloor?: boolean;
  key14Collected?: boolean;
  locker14Unlocked?: boolean;
  stairwayGateKeyTaken?: boolean;
  stairwayGateUnlocked?: boolean;
}
