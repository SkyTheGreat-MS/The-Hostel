/**
 * Canonical TypeScript Interface Re-Export Shim
 * Import game types from here in new code.
 * src/types.ts is preserved unchanged for backward compatibility.
 */
export type {
  MCId,
  TriggerType,
  ComposureState,
  EndingId,
  CharacterProfile,
  MCCharacter,
  Clue,
  HostelLocation,
  GuardianPair,
  RiddleOption,
  VictimRiddle,
  InventoryItemDef,
  Item,
  Room4BSubScene,
  Phase3Location,
  GameState,
  NatTopicDef,
  NatInquiryOption,
  PLUnitTest,
  ActiveSaveState,
  ChapterProgressSave,
  StatementVeracity,
} from '../types';

export {
  NAT_TOPIC_REGISTRY,
  NAT_KNOWLEDGE_BASE,
  getNatKnowledge,
} from '../types';

export type { NatKnowledgeTier, NatKnowledgeEntry } from '../types';
