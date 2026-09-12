export interface InventoryItemDef {
  id: string;
  shortLabel: string; // Punchy, scannable name
  icon: string;
}

export const ITEM_DATABASE: Record<string, InventoryItemDef> = {
  bobby_pin: {
    id: 'bobby_pin',
    shortLabel: 'Pin 4B',
    icon: 'key',
  },
  wooden_table_leg: {
    id: 'wooden_table_leg',
    shortLabel: 'Wood',
    icon: 'hammer',
  },
  wooden_bat: {
    id: 'wooden_bat',
    shortLabel: 'Wood',
    icon: 'hammer',
  },
  brass_key: {
    id: 'brass_key',
    shortLabel: 'Key 32',
    icon: 'key',
  },
  small_brass_key_32: {
    id: 'small_brass_key_32',
    shortLabel: 'Key 32',
    icon: 'key',
  },
  nylon_rope: {
    id: 'nylon_rope',
    shortLabel: 'Rope',
    icon: 'wind',
  },
  coiled_nylon_rope: {
    id: 'coiled_nylon_rope',
    shortLabel: 'Rope',
    icon: 'wind',
  },
  black_beeswax_candle: {
    id: 'black_beeswax_candle',
    shortLabel: 'Candle',
    icon: 'flame',
  },
  matchbox_three_stars: {
    id: 'matchbox_three_stars',
    shortLabel: 'Match',
    icon: 'flame',
  },
  bronze_prayer_bell: {
    id: 'bronze_prayer_bell',
    shortLabel: 'Bell',
    icon: 'bell',
  },
  magnetic_compass: {
    id: 'magnetic_compass',
    shortLabel: 'Compass',
    icon: 'compass',
  },
  /**
   * battery_pair — Two zinc-carbon D-cell batteries acquired from Locker 10.
   * Required to power the transistor radio on the Overlook Balcony.
   * Consumed on insertion (removed from inventory by RadioBenchInspectionView).
   */
  battery_pair: {
    id: 'battery_pair',
    shortLabel: 'Batts',
    icon: 'zap',
  },
  /**
   * letter_ko_zaw — Ko Zaw's Folded Letter retrieved from the study desk in Room 4B.
   */
  letter_ko_zaw: {
    id: 'letter_ko_zaw',
    shortLabel: 'Letter',
    icon: 'mail',
  },
  clue_letter_4b: {
    id: 'clue_letter_4b',
    shortLabel: 'Letter',
    icon: 'mail',
  },
  key_14: {
    id: 'key_14',
    shortLabel: 'Key 14',
    icon: 'key',
  },
  key_stairway_gate: {
    id: 'key_stairway_gate',
    shortLabel: 'Gate Key',
    icon: 'key',
  },
  iron_pulley: {
    id: 'iron_pulley',
    shortLabel: 'Pulley',
    icon: 'anchor',
  },
  rusty_machete: {
    id: 'rusty_machete',
    shortLabel: 'Blade',
    icon: 'sword',
  },
  cassette_tape_may: {
    id: 'cassette_tape_may',
    shortLabel: 'Tape 1998',
    icon: 'disc',
  },
};

export default ITEM_DATABASE;
