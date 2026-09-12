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
};

export default ITEM_DATABASE;
