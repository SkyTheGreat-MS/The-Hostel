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
};

export default ITEM_DATABASE;
