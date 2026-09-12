/**
 * Canonical Item Registry - Single Source of Truth
 * All item IDs used in inventory must be registered here.
 * Supplements and will eventually supersede src/items.ts.
 */
export interface InventoryItemDef {
  id: string;
  /** Punchy 2-5 char scannable label for the HUD inventory bar */
  shortLabel: string;
  /** Lucide icon name */
  icon: string;
  /** Longer descriptive name for modals and tooltips */
  displayName?: string;
}

export const ITEM_DATABASE: Record<string, InventoryItemDef> = {
  bobby_pin: { id: 'bobby_pin', shortLabel: 'Pin 4B', icon: 'key', displayName: 'Bobby Pin (Room 4B)' },
  wooden_table_leg: { id: 'wooden_table_leg', shortLabel: 'Wood', icon: 'hammer', displayName: 'Wooden Table Leg' },
  wooden_bat: { id: 'wooden_bat', shortLabel: 'Wood', icon: 'hammer', displayName: 'Carved Wooden Bat' },
  brass_key: { id: 'brass_key', shortLabel: 'Key 32', icon: 'key', displayName: 'Small Brass Key' },
  small_brass_key_32: { id: 'small_brass_key_32', shortLabel: 'Key 32', icon: 'key', displayName: 'Small Brass Key (Locker 32)' },
  nylon_rope: { id: 'nylon_rope', shortLabel: 'Rope', icon: 'wind', displayName: 'Coiled Nylon Rope' },
  coiled_nylon_rope: { id: 'coiled_nylon_rope', shortLabel: 'Rope', icon: 'wind', displayName: 'Coiled Nylon Rope (Washroom Pipe)' },
  black_beeswax_candle: { id: 'black_beeswax_candle', shortLabel: 'Candle', icon: 'flame', displayName: 'Black Beeswax Candle' },
  matchbox_three_stars: { id: 'matchbox_three_stars', shortLabel: 'Match', icon: 'flame', displayName: 'Three-Stars Matchbox' },
  bronze_prayer_bell: { id: 'bronze_prayer_bell', shortLabel: 'Bell', icon: 'bell', displayName: 'Bronze Prayer Bell' },
  magnetic_compass: { id: 'magnetic_compass', shortLabel: 'Compass', icon: 'compass', displayName: 'Magnetic Compass' },
  /**
   * battery_pair - Two zinc-carbon D-cell batteries from Locker 10.
   * Required to power the transistor radio on the Overlook Balcony.
   * Consumed on insertion (removed from inventory by RadioBenchInspectionView).
   */
  battery_pair: { id: 'battery_pair', shortLabel: 'Batts', icon: 'zap', displayName: '2x D-Cell Batteries' },
  /**
   * letter_ko_zaw - Ko Zaw's Folded Letter retrieved from the study desk in Room 4B.
   * Addressed to May in hasty, elegant Burmese script. Hidden beneath a wooden inkstand.
   * Required for the handover sequence with Spectral May on the Overlook Balcony.
   */
  letter_ko_zaw: {
    id: 'letter_ko_zaw',
    shortLabel: 'Letter',
    icon: 'mail',
    displayName: "Ko Zaw's Folded Letter",
  },
  clue_letter_4b: {
    id: 'clue_letter_4b',
    shortLabel: 'Letter',
    icon: 'mail',
    displayName: "Ko Zaw's Folded Letter",
  },
  /**
   * key_14 - Key 14 dropped by Spectral May on the wet balcony terrace.
   * A tarnished brass key stamped with the number 14. Tied with frayed nylon string.
   * Corresponds to Locker 14 in the student locker bay.
   */
  key_14: {
    id: 'key_14',
    shortLabel: 'Key 14',
    icon: 'key',
    displayName: 'Key 14',
  },
  /**
   * key_stairway_gate - Heavy, blackened iron key hidden on the lower shelf of Locker 14.
   * Ko Zaw hid this here so May could bypass the curfew gate to reach the terrace.
   */
  key_stairway_gate: {
    id: 'key_stairway_gate',
    shortLabel: 'Gate Key',
    icon: 'key',
    displayName: 'Stairway Gate Key',
  },
};

export default ITEM_DATABASE;
