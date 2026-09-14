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
    response: '...အမြင်မရတဲ့ အရာတွေရှေ့မှာ အေးစက်တဲ့ သံလိုက်လက်တံ လည်နေရုံနဲ့ ဘာမှမထူးဘူး။ အဲဒီကစားစရာကို သိမ်းလိုက်စမ်း။',
    spritePose: 'neutral',
    shockDamage: 2,
  },
  magnetic_compass: {
    targetId: 'magnetic_compass',
    tier: 'unknown',
    response: '...အမြင်မရတဲ့ အရာတွေရှေ့မှာ အေးစက်တဲ့ သံလိုက်လက်တံ လည်နေရုံနဲ့ ဘာမှမထူးဘူး။ အဲဒီကစားစရာကို သိမ်းလိုက်စမ်း။',
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
    response: 'အဲဒီ ကြေးဝါသွားက သေသွားတဲ့ကောင်မလေးရဲ့ လော့ကာသော့ပဲ၊ ဒါပေမဲ့ သူ့ရဲ့အဖော်သော့ကိုတော့ ထမင်းစားဆောင်နောက်က မီးရှို့ဖိုထဲမှာ ပြာဖြစ်အောင် ကျွမ်းပစ်လိုက်ပြီ။ မင်း အချည်းနှီး သတ္တုစကိုပဲ လိုက်ရှာနေတာ။',
    spritePose: 'warning',
    caseNoteUnlock: 'နတ်မင်းကြီးက အဖော်လော့ကာသော့ကို အမှိုက်မီးရှို့ဖိုထဲ မီးရှို့ဖျက်ဆီးပစ်ခဲ့တယ်လို့ ဆိုသည်။',
  },
  small_brass_key_32: {
    targetId: 'small_brass_key_32',
    tier: 'deceit',
    response: 'အဲဒီ ကြေးဝါသွားက သေသွားတဲ့ကောင်မလေးရဲ့ လော့ကာသော့ပဲ၊ ဒါပေမဲ့ သူ့ရဲ့အဖော်သော့ကိုတော့ ထမင်းစားဆောင်နောက်က မီးရှို့ဖိုထဲမှာ ပြာဖြစ်အောင် ကျွမ်းပစ်လိုက်ပြီ။ မင်း အချည်းနှီး သတ္တုစကိုပဲ လိုက်ရှာနေတာ။',
    spritePose: 'warning',
    caseNoteUnlock: 'နတ်မင်းကြီးက အဖော်လော့ကာသော့ကို အမှိုက်မီးရှို့ဖိုထဲ မီးရှို့ဖျက်ဆီးပစ်ခဲ့တယ်လို့ ဆိုသည်။',
  },

  // --- CASE NOTES / LORE CLUES ---
  clue_ko_zaw_letters: {
    targetId: 'clue_ko_zaw_letters',
    tier: 'truth',
    response: 'အလျင်စလို ရေးထားတဲ့ မင်ရည်စက်တွေ... မေ အနေနဲ့ မကြည့်သင့်တဲ့နေရာကို ကြည့်မိခဲ့တာပဲ။ အဲဒီစာတွေ ပေါ်သွားတဲ့ညမှာ အဆောင်နေ ညီအစ်မလို ခင်တဲ့သံယောဇဉ် ဖြတ်တောက်ခံလိုက်ရပြီ။',
    spritePose: 'pensive',
    caseNoteUnlock: 'မေ နှင့် ကိုဇော်တို့၏ လျှို့ဝှက်ဆက်နွှယ်မှုက အခန်းဖော်နှစ်ဦးကြား သွေးထွက်သံယို သဘောထားကွဲလွဲမှု ဖြစ်စေခဲ့ကြောင်း နတ်မင်းကြီးက အတည်ပြုသည်။',
  },
  sandar_kozaw_letters: {
    targetId: 'sandar_kozaw_letters',
    tier: 'truth',
    response: 'အလျင်စလို ရေးထားတဲ့ မင်ရည်စက်တွေ... မေ အနေနဲ့ မကြည့်သင့်တဲ့နေရာကို ကြည့်မိခဲ့တာပဲ။ အဲဒီစာတွေ ပေါ်သွားတဲ့ညမှာ အဆောင်နေ ညီအစ်မလို ခင်တဲ့သံယောဇဉ် ဖြတ်တောက်ခံလိုက်ရပြီ။',
    spritePose: 'pensive',
    caseNoteUnlock: 'မေ နှင့် ကိုဇော်တို့၏ လျှို့ဝှက်ဆက်နွှယ်မှုက အခန်းဖော်နှစ်ဦးကြား သွေးထွက်သံယို သဘောထားကွဲလွဲမှု ဖြစ်စေခဲ့ကြောင်း နတ်မင်းကြီးက အတည်ပြုသည်။',
  },
  clue_physics_chem_notes_1998: {
    targetId: 'clue_physics_chem_notes_1998',
    tier: 'truth',
    response: 'တုန်လှုပ်နေတဲ့ လက်တစ်စုံနဲ့ ရေးထားတဲ့ ဖော်မြူလာတွေ။ စင်္ကြံလမ်းကို ပိတ်ဆို့မခံရခင်... ညမထွက်ရအမိန့်ထုတ်ထားတဲ့ တံခါးအလွန်ကို ထွက်ပြေးဖို့ သူမ နောက်ဆုံးစာကျက်ချိန်တွေမှာ ကြံစည်ခဲ့တာ။',
    spritePose: 'pensive',
    caseNoteUnlock: 'မေ သည် အသတ်မခံရမီ ညမထွက်ရအမိန့်ထုတ်ချိန်အတွင်း အဆောင်မှ ထွက်ပြေးရန် ကြံစည်ခဲ့ကြောင်း သိရှိရသည်။',
  },
  clue_banyan_well: {
    targetId: 'clue_banyan_well',
    tier: 'forbidden_taboo',
    response: '...ရေတွင်းအကြောင်း လုံးဝမပြောနဲ့! ညောင်မြစ်တွေက အမှောင်ထုထဲကနေ သွေးစုပ်နေတာ။ နောက်တစ်ခါ ထပ်ခေါ်ရင် ဒီဖယောင်းတိုင်တွေကို ငါ့ဘာသာငါ မီးငြှိမ်းပစ်မယ်!',
    spritePose: 'warning',
    shockDamage: 5,
  },
  clue_well_rumor: {
    targetId: 'clue_well_rumor',
    tier: 'forbidden_taboo',
    response: '...ရေတွင်းအကြောင်း လုံးဝမပြောနဲ့! ညောင်မြစ်တွေက အမှောင်ထုထဲကနေ သွေးစုပ်နေတာ။ နောက်တစ်ခါ ထပ်ခေါ်ရင် ဒီဖယောင်းတိုင်တွေကို ငါ့ဘာသာငါ မီးငြှိမ်းပစ်မယ်!',
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
