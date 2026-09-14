// Nat Epistemic Knowledge Base & Cross-Examination Registry
// Defines what the Hostel Guardian Nat witnessed in the spirit realm vs. outside mortal objects

export type NatKnowledgeTier = 'truth' | 'deceit' | 'unknown' | 'forbidden_taboo';

export interface NatKnowledgeEntry {
  targetId: string; // matches inventory item ID or case note ID
  tier: NatKnowledgeTier;
  response: string;
  spritePose: 'neutral' | 'pensive' | 'warning';
  caseNoteUnlock?: string;
  shockDamage?: number;
}

export const NAT_KNOWLEDGE_BASE: Record<string, NatKnowledgeEntry> = {
  // --- INVENTORY ITEMS ---
  compass: {
    targetId: 'compass',
    tier: 'unknown',
    response: '...အေးစက်နေတဲ့ အပ်တွေ လည်ပတ်နေတာက မမြင်ရတဲ့အရာတွေအတွက် ဘာအဓိပ္ပာယ်မှ မရှိဘူး။ အဲဒီကစားစရာကို ယူသွားလိုက်ပါ။',
    spritePose: 'neutral',
    shockDamage: 2,
  },
  magnetic_compass: {
    targetId: 'magnetic_compass',
    tier: 'unknown',
    response: '...အေးစက်နေတဲ့ အပ်တွေ လည်ပတ်နေတာက မမြင်ရတဲ့အရာတွေအတွက် ဘာအဓိပ္ပာယ်မှ မရှိဘူး။ အဲဒီကစားစရာကို ယူသွားလိုက်ပါ။',
    spritePose: 'neutral',
    shockDamage: 2,
  },
  bobby_pin: {
    targetId: 'bobby_pin',
    tier: 'unknown',
    response: '...',
    spritePose: 'neutral',
    shockDamage: 2,
  },
  brass_key: {
    targetId: 'brass_key',
    tier: 'deceit',
    response: 'အဲဒီ ကြေးဝါသော့တံက သေဆုံးသွားတဲ့ မိန်းကလေးရဲ့ လော့ကာကပဲ၊ ဒါပေမဲ့ သူ့ရဲ့အဖော်သော့ကတော့ အရည်ပျော်ပြီး ပြာဖြစ်သွားပြီ...',
    spritePose: 'warning',
    caseNoteUnlock: 'Nat claims the sister locker key was burned in the incinerator.',
  },
  small_brass_key_32: {
    targetId: 'small_brass_key_32',
    tier: 'deceit',
    response: 'အဲဒီ ကြေးဝါသော့တံက သေဆုံးသွားတဲ့ မိန်းကလေးရဲ့ လော့ကာကပဲ၊ ဒါပေမဲ့ သူ့ရဲ့အဖော်သော့ကတော့ အရည်ပျော်ပြီး ပြာဖြစ်သွားပြီ...',
    spritePose: 'warning',
    caseNoteUnlock: 'Nat claims the sister locker key was burned in the incinerator.',
  },

  // --- CASE NOTES / LORE CLUES ---
  clue_ko_zaw_letters: {
    targetId: 'clue_ko_zaw_letters',
    tier: 'truth',
    response: 'အလောတကြီး ရေးသားထားတဲ့ ခိုးယူခံရသော စာသားများ...',
    spritePose: 'pensive',
    caseNoteUnlock: 'The Nat confirms May\'s secret connection with Ko Zaw drove a violent wedge between the roommates.',
  },
  sandar_kozaw_letters: {
    targetId: 'sandar_kozaw_letters',
    tier: 'truth',
    response: 'အလောတကြီး ရေးသားထားတဲ့ ခိုးယူခံရသော စာသားများ...',
    spritePose: 'pensive',
    caseNoteUnlock: 'The Nat confirms May\'s secret connection with Ko Zaw drove a violent wedge between the roommates.',
  },
  clue_physics_chem_notes_1998: {
    targetId: 'clue_physics_chem_notes_1998',
    tier: 'truth',
    response: 'တုန်ယင်နေတဲ့ လက်နဲ့ ရေးသားထားတဲ့ ဖော်မြူလာများ...',
    spritePose: 'pensive',
    caseNoteUnlock: 'May had planned to flee the hostel during curfew before she was silenced.',
  },
  clue_banyan_well: {
    targetId: 'clue_banyan_well',
    tier: 'forbidden_taboo',
    response: '...ရေတွင်းအကြောင်း မပြောနဲ့! အမြစ်တွေက အမှောင်ထုထဲကနေ နက်နက်ရှိုင်းရှိုင်း သောက်သုံးနေကြတယ်...',
    spritePose: 'warning',
    shockDamage: 5,
  },
  clue_well_rumor: {
    targetId: 'clue_well_rumor',
    tier: 'forbidden_taboo',
    response: '...ရေတွင်းအကြောင်း မပြောနဲ့! အမြစ်တွေက အမှောင်ထုထဲကနေ နက်နက်ရှိုင်းရှိုင်း သောက်သုံးနေကြတယ်...',
    spritePose: 'warning',
    shockDamage: 5,
  },
};

/**
 * Retrieves the epistemic evaluation for a presented item or clue ID.
 * Supports aliases and falls back gracefully to 'unknown' with '...' response.
 */
export function getNatKnowledge(targetId: string): NatKnowledgeEntry {
  if (NAT_KNOWLEDGE_BASE[targetId]) {
    return NAT_KNOWLEDGE_BASE[targetId];
  }

  // Alias checks
  if (targetId === 'compass' || targetId === 'magnetic_compass') {
    return NAT_KNOWLEDGE_BASE.compass;
  }
  if (targetId === 'brass_key' || targetId === 'small_brass_key_32') {
    return NAT_KNOWLEDGE_BASE.brass_key;
  }
  if (targetId === 'clue_ko_zaw_letters' || targetId === 'sandar_kozaw_letters') {
    return NAT_KNOWLEDGE_BASE.clue_ko_zaw_letters;
  }
  if (targetId === 'clue_banyan_well' || targetId === 'clue_well_rumor' || targetId === 'well_key') {
    return NAT_KNOWLEDGE_BASE.clue_banyan_well;
  }

  // Fallback for outside/mundane targets not directly mapped
  return {
    targetId,
    tier: 'unknown',
    response: '...',
    spritePose: 'neutral',
    shockDamage: 2,
  };
}
