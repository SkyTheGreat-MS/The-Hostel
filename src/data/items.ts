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
  bobby_pin: { id: 'bobby_pin', shortLabel: 'ဆံ', icon: 'key', displayName: 'ဆံထိုး (အခန်း ၄B)' },
  wooden_table_leg: { id: 'wooden_table_leg', shortLabel: 'ပျဉ်', icon: 'hammer', displayName: 'သစ်သားစားပွဲခြေတံ' },
  wooden_bat: { id: 'wooden_bat', shortLabel: 'ပျဉ်', icon: 'hammer', displayName: 'ထွင်းထားသည့် သစ်သားတုတ်' },
  brass_key: { id: 'brass_key', shortLabel: 'သော့-၃၂', icon: 'key', displayName: 'ကြေးသော့ငယ်' },
  small_brass_key_32: { id: 'small_brass_key_32', shortLabel: 'သော့-၃၂', icon: 'key', displayName: 'ကြေးသော့ (လော့ကာ ၃၂)' },
  nylon_rope: { id: 'nylon_rope', shortLabel: 'ကြိုး', icon: 'wind', displayName: 'နိုင်လွန်ကြိုးခွေ' },
  coiled_nylon_rope: { id: 'coiled_nylon_rope', shortLabel: 'ကြိုး', icon: 'wind', displayName: 'နိုင်လွန်ကြိုးခွေ (ရေချိုခန်းပိုက်)' },
  black_beeswax_candle: { id: 'black_beeswax_candle', shortLabel: 'ဖယောင်း', icon: 'flame', displayName: 'ဖယောင်းတိုင်နက်' },
  matchbox_three_stars: { id: 'matchbox_three_stars', shortLabel: 'မီး', icon: 'flame', displayName: 'ကြယ် ၃ လုံး မီးခြစ်ဆံဗူး' },
  bronze_prayer_bell: { id: 'bronze_prayer_bell', shortLabel: 'လောင်း', icon: 'bell', displayName: 'ကြေးခေါင်းလောင်းငယ်' },
  magnetic_compass: { id: 'magnetic_compass', shortLabel: 'မြှောင်', icon: 'compass', displayName: 'သံလိုက်အိမ်မြှောင်' },
  /**
   * battery_pair - Two zinc-carbon D-cell batteries from Locker 10.
   * Required to power the transistor radio on the Overlook Balcony.
   * Consumed on insertion (removed from inventory by RadioBenchInspectionView).
   */
  battery_pair: { id: 'battery_pair', shortLabel: 'ဓာတ်', icon: 'zap', displayName: 'ဓာတ်ခဲ (၂)' },
  /**
   * letter_ko_zaw - Ko Zaw's Folded Letter retrieved from the study desk in Room 4B.
   * Addressed to May in hasty, elegant Burmese script. Hidden beneath a wooden inkstand.
   * Required for the handover sequence with Spectral May on the Overlook Balcony.
   */
  letter_ko_zaw: {
    id: 'letter_ko_zaw',
    shortLabel: 'စာ',
    icon: 'mail',
    displayName: 'ကိုဇော်စာရွက်',
  },
  clue_letter_4b: {
    id: 'clue_letter_4b',
    shortLabel: 'စာ',
    icon: 'mail',
    displayName: 'ကိုဇော်စာရွက်',
  },
  /**
   * key_14 - Key 14 dropped by Spectral May on the wet balcony terrace.
   * A tarnished brass key stamped with the number 14. Tied with frayed nylon string.
   * Corresponds to Locker 14 in the student locker bay.
   */
  key_14: {
    id: 'key_14',
    shortLabel: 'သော့-၁၄',
    icon: 'key',
    displayName: 'သော့ (၁၄)',
  },
  /**
   * key_stairway_gate - Heavy, blackened iron key hidden on the lower shelf of Locker 14.
   * Ko Zaw hid this here so May could bypass the curfew gate to reach the terrace.
   */
  key_stairway_gate: {
    id: 'key_stairway_gate',
    shortLabel: 'တံခါးသော့',
    icon: 'key',
    displayName: 'လှေကားတံခါးသော့',
  },
  iron_pulley: {
    id: 'iron_pulley',
    shortLabel: 'ဘီး',
    icon: 'anchor',
    displayName: 'သံဘီးကြီး',
  },
  rusty_machete: {
    id: 'rusty_machete',
    shortLabel: 'ဓား',
    icon: 'sword',
    displayName: 'ဓားမကြီး',
  },
  cassette_tape_may: {
    id: 'cassette_tape_may',
    shortLabel: 'တိတ်',
    icon: 'disc',
    displayName: 'တိတ်ခွေ (မေ ၁၉၉၈)',
  },
};

export default ITEM_DATABASE;
