import {
  MCCharacter,
  HostelLocation,
  Clue,
  GuardianPair,
  VictimRiddle,
  Item,
} from './types';

export const ROOM_4B_ASSETS = {
  main: '/assets/scenes/room_4b_main.jpg',
  seance2026: '/assets/scenes/seance_room_4b_2026.jpg',
  desk: '/assets/scenes/room_4b_desk_zoom.jpg',
  stool: '/assets/scenes/room_4b_stool_compass.jpg',
  wardrobe: '/assets/scenes/room_4b_wardrobe_bat.jpg',
  calendar: '/assets/scenes/room_4b_calendar_zoom.jpg',
  door: '/assets/scenes/room_4b_door_full.jpg',
  compassHud: '/assets/ui/magnetic_compass.jpg',
  compassZoom: '/assets/scenes/room_4b_compass_zoom.jpg',
} as const;

export const PHASE_3_ASSETS = {
  pathwayThreshold: '/assets/scenes/pathway_326_main.jpg',
  cardPathwayLeft: '/assets/ui/card_pathway_left.jpg',
  cardPathwayRight: '/assets/ui/card_pathway_right.jpg',
  westSplitLanding: '/assets/scenes/west_wing_landing.jpg',
  stairwellGateLocked: '/assets/scenes/stairwell_gate_locked.jpg',
  stairwayGateInspection: '/assets/scenes/stairway_gate_inspection.jpg',
  hostelOuterGrounds: '/assets/scenes/hostel_outer_grounds_rain.jpg',
  seanceClimaxFlashback: '/assets/scenes/seance_climax_flashback.jpg',
  washroomOverview: '/assets/scenes/washroom_overview.jpg',
  washroomBasinZoom: '/assets/scenes/washroom_basin_zoom.jpg',
  washroomStallZoom: '/assets/scenes/washroom_stall_zoom.jpg',
  washroomRopeZoom: '/assets/scenes/washroom_rope_zoom.jpg',
  washroomMirrorZoom: '/assets/scenes/washroom_mirror_zoom.jpg',
  // East Wing Assets
  eastWingFork: '/assets/scenes/east_wing_fork.jpg',
  cardEastLockers: '/assets/ui/card_east_lockers.jpg',
  cardEastPrayer: '/assets/ui/card_east_prayer.jpg',
  cardEastCaretaker: '/assets/ui/card_east_caretaker.jpg',
  lockersOverview: '/assets/scenes/lockers_overview.jpg',
  locker32Zoom: '/assets/scenes/locker_32_zoom.jpg',
  locker09Zoom: '/assets/scenes/locker_09_zoom.jpg',
  locker14Zoom: '/assets/scenes/locker_14_zoom.jpg',
  locker14Interior: '/assets/scenes/locker_14_interior.jpg',
  lockerSpiderZoom: '/assets/scenes/locker_spider_zoom.jpg',
  prayerRoomOverview: '/assets/scenes/prayer_room_overview.jpg',
  prayerAltarZoom: '/assets/scenes/prayer_altar_zoom.jpg',
  caretakerKeypadZoom: '/assets/scenes/caretaker_keypad_zoom.jpg',
  caretakerOfficeOverview: '/assets/scenes/caretaker_office_overview.jpg',
  caretakerSpectralClimax: '/assets/scenes/caretaker_spectral_climax.jpg',
  cardBalcony: '/assets/scenes/balcony_rain_night.jpg',
  balconyOverlook: '/assets/scenes/balcony_rain_night.jpg',
};

export const ITEMS: Record<string, Item> = {
  bobby_pin: {
    id: 'bobby_pin',
    name: 'ဆံထိုး',
    shortLabel: 'ဆံ',
    description: 'စာကြည့်ခုံပေါ်ရှိ ကြွေလင်ပန်းထဲတွင် တွေ့ရသည့် ကွေးနေသော သံမဏိဆံညှပ်ကလစ်ငယ်။ (A bent steel bobby pin)',
    usageHint: 'ရိုးရှင်းသော သော့ခလောက်အတွင်းရှိ သော့ပင်များကို အသံမထွက်ဘဲ ထိုးဖွင့်နိုင်သည်။',
  },
  wooden_bat: {
    id: 'wooden_bat',
    name: 'ကျွန်းပျဉ်တုံးကြီး',
    shortLabel: 'ပျဉ်',
    type: 'tool',
    icon: '/assets/items/wooden_bat.png',
    description: 'ဗီရိုအောက်ခြေမှ ဖြုတ်ယူရရှိခဲ့သော မာကျောသည့် ကျွန်းပျဉ်ပြားတုံးကြီး။',
    usageHint: 'သစ်သားတံခါးဂျက် သို့မဟုတ် ပိတ်ဆို့နေသော အရာများကို အားဖြင့် ထုရိုက်ခွဲနိုင်သော်လည်း အသံကျယ်ကျယ် ထွက်ပေါ်စေသည်။',
  },
  magnetic_compass: {
    id: 'magnetic_compass',
    name: 'သံလိုက်အိမ်မြှောင်',
    shortLabel: 'မြှောင်',
    description:
      'အရှေ့၊ အနောက်၊ တောင်၊ မြောက် အမှတ်အသားများ ပါရှိသည့် ရှေးဟောင်းကြေးဝါ သံလိုက်အိမ်မြှောင်။ ၎င်း၏ သံလိုက်အပ်သည် သဘာဝလွန် ထူးဆန်းမှုများရှိရာသို့ တုန်ခါညွှန်ပြနေသည်။',
    isSpecial: true,
    usageHint: 'သဘာဝလွန် ထူးဆန်းမှုများနှင့် အတိုင်းအတာကွဲလွဲမှုများ ရှိရာဘက်သို့ တုန်ခါညွှန်ပြသည်။',
  },
  small_brass_key_32: {
    id: 'small_brass_key_32',
    name: 'ကြေးသော့ (၃၂)',
    shortLabel: 'သော့-၃၂',
    description: "ရေစိုနေသော ယူနီဖောင်းအိတ်ကပ်ထဲမှ တွေ့ရှိခဲ့သည့် '32' ဟု အမှတ်အသားပါသော ကြေးဝါသော့ငယ်။ (A small tarnished brass key marked 32)",
    usageHint: 'နံပါတ်ပါသော လော့ကာ သို့မဟုတ် ဗီရိုသော့ဖြစ်ပြီး စက်မှုလုပ်ငန်းသုံး သော့ခလောက်ကြီးများကို ဖွင့်နိုင်မည် မဟုတ်ပေ။',
  },
  coiled_nylon_rope: {
    id: 'coiled_nylon_rope',
    name: 'နိုင်လွန်ကြိုးခွေ',
    shortLabel: 'ကြိုး',
    description: 'အပေါ်ဘက် ရေဆင်းပိုက် (overhead drainage pipe) မှ ဖြုတ်ယူခဲ့သော ခိုင်ခံ့သည့် နိုင်လွန်ကြိုးခွေ။',
    usageHint: 'လူတစ်ကိုယ်စာ အလေးချိန်ကို ခံနိုင်ရည်ရှိပြီး ကျိုးပဲ့နေသော သော့ဂျက်များကို ချည်နှောင်ရန် လုံလောက်စွာ ခိုင်မာသည်။',
  },
  black_beeswax_candle: {
    id: 'black_beeswax_candle',
    name: 'ဖယောင်းတိုင်နက်',
    shortLabel: 'ဖယောင်း',
    description: 'ရိုးရာအစောင့်အရှောက်နတ် ပူဇော်ပသမှုများတွင် အသုံးပြုသည့် ထူထဲသော ဖယောင်းနက်တိုင်။',
    usageHint: 'အစောင့်နတ်စင်တွင် ပူဇော်တင်ဆက်ရန် မရှိမဖြစ် လိုအပ်သော ပစ္စည်းတစ်ခု။',
  },
  matchbox_three_stars: {
    id: 'matchbox_three_stars',
    name: 'မီးခြစ်ဆံဗူး (ကြယ် ၃ လုံး)',
    shortLabel: 'မီး',
    description: "မီးခြစ်ဆံ ၃ ဆံ ပါရှိသော ရှေးဟောင်း မြန်မာ့ 'ကြယ်တံခွန် ၃ လုံး' (Three-Shooting-Stars) အမှတ်တံဆိပ် မီးခြစ်ဆံဗူး။",
    usageHint: 'ယတြာဖယောင်းတိုင်များကို မီးညှိရန် အသုံးပြုသည်။ စိတ်မငြိမ်မသက်ဖြစ်ပါက လက်များ တုန်ယင်နေတတ်သည်။',
  },
  bronze_prayer_bell: {
    id: 'bronze_prayer_bell',
    name: 'ကြေးခေါင်းလောင်းငယ်',
    shortLabel: 'လောင်း',
    description: 'ရိုးရာနတ်မန္တန်အက္ခရာများ ထွင်းထုထားသည့် အခမ်းအနားသုံး ကြေးခေါင်းလောင်းငယ်။',
    usageHint: 'နတ်စင်တွင် အစောင့်နတ်ကို ဆင့်ခေါ်နိုးထစေရန် လှုပ်ခတ်ရသည်။',
  },
  battery_pair: {
    id: 'battery_pair',
    name: 'ဓာတ်ခဲ (၂)',
    shortLabel: 'ဓာတ်',
    description: 'လော့ကာ ၁၀ ထဲမှ ရရှိခဲ့သော ဓာတ်ခဲအကြီး ၂ လုံး။',
    usageHint: 'ဝရန်တာရှိ ထရန်စစ္စတာ ရေဒီယိုကို ဓာတ်အားပေးနိုင်သည်။',
  },
  letter_ko_zaw: {
    id: 'letter_ko_zaw',
    name: 'ကိုဇော်စာရွက်',
    shortLabel: 'စာ',
    description:
      'မေ ထံ လိပ်မူပြီး မြန်မာလက်ရေးလှဖြင့် အလျင်စလို ရေးသားထားသော ခေါက်ထားသည့် မျဉ်းသားစာရွက်။ သစ်သားမှင်အိုးခုံအောက်တွင် ဝှက်ထားသည်။',
    usageHint: 'မေ အတွက် သီးသန့်စာလွှာ။ ဝရန်တာတွင် ဝိညာဉ်မေ ထံ ပေးအပ်ရန် လိုအပ်သည်။',
  },
  key_14: {
    id: 'key_14',
    name: 'သော့ (၁၄)',
    shortLabel: 'သော့-၁၄',
    description: 'နံပါတ် ၁၄ ရိုက်နှိပ်ထားသော ကြေးဝါသော့ဟောင်း။ နိုင်လွန်ကြိုးစဖြင့် ချည်နှောင်ထားသည်။',
    usageHint: 'နံပါတ် ၁၄ ရိုက်နှိပ်ထားသည်။ အဆောင်ခန်းတွင်းရှိ လော့ကာ ၁၄ နှင့် ကိုက်ညီသည်။',
  },
  key_stairway_gate: {
    id: 'key_stairway_gate',
    name: 'လှေကားတံခါးသော့',
    shortLabel: 'တံခါးသော့',
    description: 'လော့ကာ ၁၄ ၏ အောက်ထပ်စင်ပေါ်တွင် ဝှက်ထားသည့် သံမည်းသော့ကြီးတစ်ချောင်း။',
    usageHint: 'ဝရန်တာသို့ တက်ရောက်နိုင်သည့် လှေကားကို ပိတ်ဆို့ထားသော ညမထွက်ရ သံတံခါးကို ဖွင့်ရန် အသုံးပြုသည်။',
  },
  iron_pulley: {
    id: 'iron_pulley',
    name: 'သံဘီးကြီး',
    shortLabel: 'ဘီး',
    description: 'ကြေးဝါချိတ်ပါရှိသော လေးလံသည့် သံသွန်းစက်သီးဘီး။ ချောဆီထည့်ထားသဖြင့် အလွယ်တကူ လည်ပတ်နိုင်သည်။',
    usageHint: 'အလေးအပင် ဆွဲတင်နိုင်ရန် အပေါ်ဘက် ခိုင်ခံ့သော အထိန်းတွင် ချိတ်ဆွဲအသုံးပြုနိုင်သည်။',
  },
  rusty_machete: {
    id: 'rusty_machete',
    name: 'ဓားမကြီး',
    shortLabel: 'ဓား',
    description: 'ရော်ဘာပတ်လက်ကိုင်ပါရှိသည့် သံမည်း ဓားမကြီး။ သစ်ပင်နွယ်များနှင့် ခြုံနွယ်များကို ခုတ်ထွင်ရှင်းလင်းရာမှ တုံးနေသည်။',
    usageHint: 'ထူထပ်သော အပူပိုင်း သစ်မြစ်များနှင့် သစ်ကိုင်းများကို ခုတ်ထွင်ရန် လုံလောက်စွာ လေးလံသည်။',
  },
  cassette_tape_may: {
    id: 'cassette_tape_may',
    name: 'တိတ်ခွေ (မေ ၁၉၉၈)',
    shortLabel: 'တိတ်',
    description: '၁၉၉၈.၀၈.၁၂ နေ့စွဲပါ တံဆိပ်မပါသော မိုက်ခရို တိတ်ခွေငယ်။ လော့ကာ ၁၄ တွင် ကိုဇော် ထားရစ်ခဲ့သည်။',
    usageHint: 'ကိုက်ညီသော မိုက်ခရို တိတ်ခွေဖွင့်စက်တွင် ထည့်သွင်းနားထောင်နိုင်သည်။',
  },
};

export const ITEM_DATABASE = ITEMS;

export const CHARACTERS: MCCharacter[] = [
  {
    id: 'moe_stheinkha',
    name: 'မိုးစိတ်ခ',
    archetype: 'သံသယရှိသူ',
    description: 'ခွဲခြမ်းစိတ်ဖြာတတ်ပြီး ယုတ္တိကျသော စိတ်ပိုင်းဆိုင်ရာ ရှိသည်။ ကိုယ်ထိလက်ရောက် ခြိမ်းခြောက်မှုကို ခုခံနိုင်သော်လည်း ပုဂ္ဂိုလ်ထူးဆန်းမှုများအပေါ် အလွန်နားညံ့သည်။',
    tensionMultiplier: 1.2,
    resolveMultiplier: 0.9,
    multipliers: {
      supernatural_direct: 1.5,
      physical_threat: 0.8,
      betrayal: 1.0,
    },
  },
  {
    id: 'ye_yint_hein',
    name: 'ရဲရင့်ဟိန်း',
    archetype: 'ရဲရင့်သူ',
    description: 'ရဲတင်းပြီး လျင်မြန်စွာ လုပ်ဆောင်တတ်သည်။ ကိုယ်ထိလက်ရောက် ခြိမ်းခြောက်မှုကို ဂရုမစိုက်သော်လည်း အေးစိမ့်သော အထီးကျန်မှုတွင် လွယ်ကူစွာ စိတ်ပျက်တတ်သည်။',
    tensionMultiplier: 1.3,
    resolveMultiplier: 1.4,
    multipliers: {
      supernatural_direct: 1.2,
      physical_threat: 0.7,
      betrayal: 1.1,
    },
  },
  {
    id: 'may_jewel',
    name: 'မေဂျူး',
    archetype: 'အတွေ့အကြုံရှိသူ',
    description: 'ဝိညာဉ်နှင့် ဆက်စပ်နေသည့် မီဒီယမ်တစ်ဦးဖြစ်ပြီး ဝှက်ထားသည့် တုန်ခါမှုများနှင့် ညည်းညူသံများကို ရှာဖွေတွေ့ရှိနိုင်သည်။ ပြင်းထန်သည့် စိတ်ဖိစီးမှုကို ခံစားရသည်။',
    tensionMultiplier: 0.8,
    resolveMultiplier: 1.3,
    multipliers: {
      supernatural_direct: 0.7,
      physical_threat: 1.4,
      betrayal: 1.2,
    },
  },
  {
    id: 'yin_min_htike',
    name: 'ယင်မင်းထိပ်',
    archetype: 'မှတ်တမ်းပြ',
    description: 'ရှေးဟောင်းစာရင်းများ၊ ကုဒ်များနှင့် ကွဲလွဲမှုများအကြောင်း ကျွမ်းကျင်သည်။ ကိုယ်ထိလက်ရောက် ဖိအားအောက်တွင် ကိုယ်ခန္ဓာပိုင်းအားနည်းသည်။',
    tensionMultiplier: 0.8,
    resolveMultiplier: 0.8,
    multipliers: {
      supernatural_direct: 0.9,
      physical_threat: 1.4,
      betrayal: 0.8,
    },
  },
  {
    id: 'hsu_myat_shein',
    name: 'ဆွတ်မြတ်ရှိန်',
    archetype: 'သွေးဆက်သူ',
    description: 'နက်ရှိုင်းစွာ သက်ရောက်မှုရှိပြီး ၁၉၉၈ ခုနှစ် ဩဂုတ်လ ဖြစ်ရပ်များနှင့် မထင်မြင်ဘဲ သွေးဆက်နေသည်။',
    tensionMultiplier: 1.4,
    resolveMultiplier: 1.5,
    multipliers: {
      supernatural_direct: 1.4,
      physical_threat: 1.2,
      betrayal: 1.5,
    },
  },
  {
    id: 'mona',
    name: 'မိုနာ',
    archetype: 'ကာကွယ်သူ',
    description: 'အဖွဲ့၏ တည်ငြိမ်သော ကာကွယ်ရေးဖြစ်ပြီး ကိုယ်ထိလက်ရောက် အင်အားကို ခုခံနိုင်သည်။ သို့သော် သစာဖောက်မှုဖြင့် စိတ်ပိုင်းဆိုင်ရာ ပြိုကျသည်။',
    tensionMultiplier: 1.0,
    resolveMultiplier: 1.0,
    multipliers: {
      supernatural_direct: 1.0,
      physical_threat: 0.6,
      betrayal: 1.5,
    },
  },
  // Legacy aliases for backward compatibility with existing tests and Prolog mirrors
  {
    id: 'thazin',
    name: 'သဇင် (မိုးစိတ်ခ)',
    archetype: 'သံသယရှိသူ',
    description: 'ဖြစ်နိုင်ခြေကို တွက်ချက်သည်။ တိုက်ရိုက် သဘာဝလွန် ဖြစ်ရပ်များနှင့် ရင်ဆိုင်ရသောအခါ အခက်အခဲဖြစ်သည်။',
    tensionMultiplier: 1.2,
    resolveMultiplier: 0.9,
    multipliers: {
      supernatural_direct: 1.5,
      physical_threat: 0.8,
      betrayal: 1.0,
    },
  },
  {
    id: 'min_khant',
    name: 'မင်းခန့် (မိုနာ)',
    archetype: 'ကာကွယ်သူ',
    description: 'ကိုယ်ထိလက်ရောက် အန္တရာယ်ကို ခုခံနိုင်သည်။ သစာဖောက်မှုနှင့် ကျိုးပဲ့သည့် ကတိကဝတ်များဖြင့် နက်ရှိုင်းစွာ ထိခိုက်သည်။',
    tensionMultiplier: 1.0,
    resolveMultiplier: 1.0,
    multipliers: {
      supernatural_direct: 1.0,
      physical_threat: 0.6,
      betrayal: 1.5,
    },
  },
  {
    id: 'htet',
    name: 'ထက် (ယင်မင်းထိပ်)',
    archetype: 'မှတ်တမ်းပြ',
    description: 'စာရွက်စာတမ်းများ၊ စာရင်းများနှင့် ကုဒ်များအတွက် အမြင်ရှိသည်။ ဖိအားအောက်တွင် ကိုယ်ခန္ဓာပိုင်း အားနည်းသည်။',
    tensionMultiplier: 0.8,
    resolveMultiplier: 0.8,
    multipliers: {
      supernatural_direct: 0.9,
      physical_threat: 1.4,
      betrayal: 0.8,
    },
  },
  {
    id: 'aye_aye',
    name: 'အေးအေး (ဆွတ်မြတ်ရှိန်)',
    archetype: 'သွေးဆက်သူ',
    description: 'စိတ်ခံစားမှု တုံ့ပြန်မှုကို နက်ရှိုင်းစွာ ခံစားသည်။ ၁၉၉၈ ခုနှစ်နှင့် မိခင်ဆက်စပ်မှုကို ဝှက်ထားသည်။',
    tensionMultiplier: 1.4,
    resolveMultiplier: 1.5,
    multipliers: {
      supernatural_direct: 1.4,
      physical_threat: 1.2,
      betrayal: 1.5,
    },
  },
  {
    id: 'kyaw_swar',
    name: 'ကျော်စွာ (ရဲရင့်ဟိန်း)',
    archetype: 'ရဲရင့်သူ',
    description: 'ရဲတင်းပြီး အလျင်စလို လုပ်တတ်သည်။ ငြိမ်သက်သည့် အထီးကျန်မှုဖြင့် လွယ်ကူစွာ စိတ်ပျက်တတ်သည်။',
    tensionMultiplier: 1.3,
    resolveMultiplier: 1.4,
    multipliers: {
      supernatural_direct: 1.2,
      physical_threat: 0.7,
      betrayal: 1.1,
    },
  },
  {
    id: 'su_su',
    name: 'စုစု (မေဂျူး)',
    archetype: 'အတွေ့အကြုံရှိသူ',
    description: 'ဝိညာဉ်နှင့် ဆက်စပ်နေသည့် မီဒီယမ်ဖြစ်ပြီး ညည်းညူသံများကို ရှင်းရှင်းလင်းလင်း ကြားသည်။ စိတ်ပိုင်းဆိုင်ရာ ပင်ပန်းမှု ပြင်းထန်စွာ ခံစားရသည်။',
    tensionMultiplier: 0.8,
    resolveMultiplier: 1.3,
    multipliers: {
      supernatural_direct: 0.7,
      physical_threat: 1.4,
      betrayal: 1.2,
    },
  },
];

export { CHARACTER_ROSTER, getCharacterProfile } from './characterData';

export const LOCATIONS: HostelLocation[] = [
  {
    id: 'dorm_room_4b',
    name: 'အဆောင်အခန်း ၄-ဘီ (Room 4B)',
    description: '၁၉၉၈ ခုနှစ် သြဂုတ်လအတွင်း မမမေ နှင့် စန္ဒာ တို့ အတူနေထိုင်ခဲ့သော ကျောင်းသူအိပ်ဆောင်။',
    turnCost: 2,
  },
  {
    id: 'hostel_laundry',
    name: 'မြေအောက် အဝတ်လျှော်ကန် (Laundry Basin)',
    description: 'ဆပ်ပြာနံ့၊ ပြာရည်မှုန့်နံ့ နှင့် ကန်ထဲမှ မသန့်ရှင်းသော ရေဆွေးနံ့များ နံစော်နေသည်။',
    turnCost: 2,
  },
  {
    id: 'caretaker_office',
    name: 'အဆောင်မှူးရုံးခန်းဟောင်း (Caretaker Office)',
    description: 'ဖုန်ထူနေသော စင်များ၊ သံချေးတက်နေသော သော့တွဲများနှင့် သံပတ်ထားသော သစ်သားသေတ္တာများ။',
    turnCost: 2,
  },
  {
    id: 'courtyard_shrine',
    name: 'အဆောင်ဝင်း နတ်စင်နှင့် ရေတွင်းဟောင်း (Courtyard Shrine & Well)',
    description: 'ခြုံနွယ်များ ဖုံးလွှမ်းနေသော ခန်းခြောက်ကျောက်ရေတွင်းဘေးရှိ ရာသီဥတုဒဏ်ခံ သစ်သားနတ်စင်ငယ်။',
    turnCost: 2,
  },
  {
    id: 'common_hall',
    name: 'အဆောင် အများသုံးစင်္ကြံ (Common Hallway)',
    description: 'ကျောင်းသူမှတ်တမ်းများ၊ ညမထွက်ရအမိန့်စာများနှင့် စုတ်ပြဲနေသော ပိုစတာများ ကပ်ထားသည့် ၁၉၉၈ ခုနှစ် ကြော်ငြာသင်ပုန်းများ။',
    turnCost: 1,
  },
];

export const CLUES: Clue[] = [
  {
    id: 'diary_page',
    locationId: 'dorm_room_4b',
    title: 'စုတ်ပြဲနေသော နေ့စဉ်မှတ်တမ်းစာမျက်နှာ (သြဂုတ် ၁၉၉၈)',
    details:
      'မမမေ ၏ လက်ရေးမှတ်စု - "ဒီနေ့ လက်ဖက်ရည်ဆိုင်မှာ မိုးပြာရောင်သန်းတဲ့ ပန်းရောင်လုံချည် ဝတ်လာလို့ ကိုဇော် ဒေါသတကြီး အော်ဟစ်ခဲ့တယ်။ သူ ပန်းရောင်ကို အလွန်ရွံမုန်းတယ်... အဲ့ဒီအရောင်က သူ့ကို ပျို့အန်ချင်အောင် လုပ်တယ်တဲ့။"',
    pointsTo: 'ko_zaw_hates_pink',
  },
  {
    id: 'pink_shirt',
    locationId: 'hostel_laundry',
    title: 'သွေးစွန်းနေသော ပန်းရောင်ပိုးလုံချည် နှင့် အင်္ကျီ',
    details:
      'အဝတ်လျှော်ကန် နံပါတ် ၃ ထဲက ပြာရည်မှုန့်များအောက်တွင် မြှုပ်နှံထားသည်ကို တွေ့ရသည်။ လက်မောင်းစများတွင် သွေးစွန်းရာများ ကျန်ရှိနေသည်။ အင်္ကျီဆိုဒ်သည် စန္ဒာ၏ ကိုယ်လုံးကိုယ်ပေါက်နှင့် ကိုက်ညီသည်။',
    pointsTo: 'killer_is_not_ko_zaw',
  },
  {
    id: 'caesar_chest',
    locationId: 'caretaker_office',
    title: 'ဆီဆာဝှက်စာပါ သံပတ်သေတ္တာ',
    details:
      'ဝှက်စာထွင်းထားသော သော့ခတ်သေတ္တာ - "VHFUHW: 5000 NBDWV SDLG WR VHDO WKH GULHG ZHOO DQG EXUB WKH ERGB (Shift 3)"။ ဖော်ထုတ်ရရှိသော ပြေစာ - ခန်းခြောက်နေသော ရေတွင်းကို ပိတ်ဆို့ပြီး အလောင်းကို မြှုပ်နှံရန် အခန်း ၄-ဘီ နေထိုင်သူ (စန္ဒာ) က အဆောင်မှူးအား ကျပ် ၅,၀၀၀ ပေးချေခဲ့သည်။',
    pointsTo: 'sandar_bribed_caretaker',
    isCipher: true,
  },
  {
    id: 'broken_rosary',
    locationId: 'courtyard_shrine',
    title: 'ကျိုးပဲ့နေသော ဗောဓိစိပ်ပုတီး',
    details:
      'ဖယောင်းနီခြောက်များ ပေကျံနေသည့် ကြမ်းပြင်ပေါ် ပြန့်ကျဲနေသော သစ်သားပုတီးစေ့များ။ ၁၉၉၈ ခုနှစ်က ကြောက်လန့်နေသော ကျောင်းသူများ ထားရစ်ခဲ့သည့် အရာဖြစ်သည် (စုံစမ်းမှုအတွက် အသုံးမဝင်သော သဲလွန်စအမှားဖြစ်သည်)။',
    pointsTo: 'red_herring_no_payoff',
  },
  {
    id: 'room_4b_log',
    locationId: 'common_hall',
    title: '၁၉၉၈ ကျောင်းသူနေထိုင်မှု မှတ်တမ်းစာအုပ်',
    details:
      'မမမေ နှင့် စန္ဒာ တို့သည် အခန်းဖော်များနှင့် ရင်းနှီးသော သူငယ်ချင်းများဖြစ်ကြောင်း ဖော်ပြထားသည့် အဆောင်တရားဝင်မှတ်တမ်း။ ညပိုင်းအစည်းအဝေးများ မတိုင်မီ စန္ဒာ သည် မမမေ ၏ ဆံပင်ကို မကြာခဏ ကျစ်ဆံမြီးကျစ်ပေးလေ့ရှိကြောင်း မှတ်ချက်များတွင် ရေးသားထားသည်။',
    pointsTo: 'roommate_braided_hair',
  },
  {
    id: 'antique_locket',
    locationId: 'dorm_room_4b',
    title: 'ငွေရောင်ပန်းထွင်း လော့ကတ်သီး',
    details:
      'အခန်း ၄-ဘီ ရှိ ကျွန်းပျဉ်ပြား အောက်ခြေနောက်ကွယ်တွင် ဝှက်ထားသည်။ မွေးကင်းစကလေးငယ်ကို ပွေ့ချီထားသည့် စန္ဒာ၏ ဓာတ်ပုံပါရှိသည် - "အန်တီစန္ဒာအတွက်၊ အေးအေး ၏ မိခင်ထံမှ၊ ဇူလိုင် ၁၉၉၈။" (၂၀၂၆ ခုနှစ်မှ သူငယ်ချင်း အေးအေး နှင့် လျှို့ဝှက်ဆွေမျိုးတော်စပ်မှု ဖြစ်သည်)။',
    pointsTo: 'aye_aye_is_sandars_niece',
  },
  {
    id: 'glitch_body_glimpse',
    locationId: 'common_hall',
    title: 'တုန်ခါဝိုးတဝါး ဝိညာဉ်အရိပ်သဏ္ဌာန်',
    details:
      'စင်္ကြံလမ်းအနီး မြူခိုးများအဖြစ် မပျောက်ကွယ်မီ ၁၉၉၈ နှင့် ၂၀၂၆ အကြား ဝိုးတဝါးတုန်ခါပေါ်ပေါက်လာသည့် မမမေ ၏ မကျွတ်လွတ်သော ဝိညာဉ်အရိပ်။',
    pointsTo: 'shadow_event_manifestation',
  },
  {
    id: 'roster_slip_1998',
    locationId: 'dorm_room_4b',
    title: 'သန့်ရှင်းရေး တာဝန်ကျစာရင်း (သြဂုတ် ၁၉၉၈)',
    details:
      'သန့်ရှင်းရေး တာဝန်ကျစာရင်း (သြဂုတ် ၁၉၉၈) အရ အခန်း ၄-ဘီ အား ကျောင်းသူ မေ နှင့် စန္ဒာ တို့ထံ တာဝန်ပေးအပ်ထားသည်။',
    pointsTo: 'room_4b_duty_log',
  },
  {
    id: 'clue_may_letter',
    locationId: 'dorm_room_4b',
    title: 'ကိုဇော် ၏ ခေါက်ထားသောစာလွှာ',
    details:
      'မေ ၏ လော့ကာသော့ကို စန္ဒာ့ထံ မပေးရန် သတိပေးထားပြီး အခန်း ၃၂၆ လေဝင်ပေါက်နောက်ကွယ်တွင် တိတ်ခွေတစ်ခု ဝှက်ထားကြောင်း ဖွင့်ဟထားသည့် ကိုဇော် ထံမှ လျှို့ဝှက်စာလွှာ။',
    pointsTo: 'balcony_secret_meeting',
  },
  {
    id: 'clue_key_14',
    locationId: 'balcony_326',
    title: 'သော့ ၁၄ (လော့ကာသော့)',
    details:
      'မေ ပျောက်ဆုံးသွားပြီးနောက် စိုစွတ်နေသော ဝရန်တာကြမ်းခင်းပေါ်မှ ကောက်ယူရရှိခဲ့သည့် ကြေးဝါသော့ဟောင်း။ အဆောင်တွင်းရှိ လော့ကာ ၁၄ နှင့် သက်ဆိုင်သည်။',
    pointsTo: 'locker_14_unlocked',
  },
  {
    id: 'curfew_calendar_1998',
    locationId: 'dorm_room_4b',
    title: '၁၉၉၈ သြဂုတ် နံရံကပ်ပြက္ခဒိန်',
    details:
      'ညမထွက်ရ အဆောင်ပိတ်သိမ်းခြင်း မှတ်စုများနှင့်အတူ သြဂုတ်လ ၁၄ ရက်နေ့ကို ဝိုင်းထားသော ၁၉၉၈ ခုနှစ် နံရံကပ်ပြက္ခဒိန်။',
    pointsTo: 'curfew_lockdown_aug14',
  },
  {
    id: 'washroom_stall_echo',
    locationId: 'hostel_laundry',
    title: 'ရေချိုးခန်းအခန်းတွင်း သွေးစွန်းမှုနှင့် ပဲ့တင်သံ',
    details:
      'တတိယမြောက် ရေချိုးခန်းတွင်း၌ သွေးစွန်းနေသော အစွန်းအထင်းများနှင့် သွေးရောင်ကျောင်းသူ ဆံစည်းကြိုးဘေးတွင် ကွဲကြေနေသော အိတ်ဆောင်မှန်ငယ်တစ်ခု တွေ့ရသည်။',
    pointsTo: 'washroom_third_stall',
  },
  {
    id: 'mirror_locker_scrawl',
    locationId: 'hostel_laundry',
    title: 'ရေချိုးခန်းမှန်ဘောင်ပေါ် ထွင်းခြစ်ထားသော စာ',
    details:
      "ရေချိုးခန်းမှန်ဘောင်အောက်ခြေတွင် မြေဖြူဖြင့် ကုတ်ခြစ်ထားသော အမှတ်အသား - 'Locker 14 - 1998'။",
    pointsTo: 'locker_14_1998',
  },
  {
    id: 'cipher_note_32',
    locationId: 'hostel_laundry',
    title: 'အဆောင်မှူးရုံးခန်း ကုဒ်မှတ်စု',
    details:
      "'Warden Office Electronic Push-Latch Overwrite: 8 1 4 0 9 2. Note: Caretaker mirrors all sequence inputs for emergency security.' အဆောင်မှူးရုံးခန်း အီလက်ထရွန်းနစ် သော့ခလောက် ကုဒ် - 8 1 4 0 9 2 ဖြစ်ပြီး အရေးပေါ်လုံခြုံရေးအတွက် အဆောင်မှူးသည် ကုဒ်အားလုံးကို ပြောင်းပြန် (mirror) ရိုက်ထည့်ရန် စီစဉ်ထားသည်။",
    pointsTo: 'caretaker_door_reverse_code',
    isCipher: true,
  },
  {
    id: 'sandar_kozaw_letters',
    locationId: 'lockers_main',
    title: 'ခေါက်ထားသော အချစ်စာလွှာများ (K.Z.)',
    details:
      "Folded letters addressed to Sandar, signed 'K.Z.'... 'Sandar, she is getting suspicious about the tea shop visits. If May finds out about us, neither of us can stay in this hostel.' စန္ဒာ (Sandar) ထံ လိပ်မူပြီး 'K.Z.' ဟု လက်မှတ်ရေးထိုးထားသော စာလွှာများ... 'လက်ဖက်ရည်ဆိုင် သွားတာကို မေ ရိပ်မိနေပြီ။' မမမေ ၏ နောက်ကွယ်မှ သစ္စာဖောက်မှုကို ဖော်ပြနေသည်။",
    pointsTo: 'sandar_kozaw_betrayal',
  },
  {
    id: 'clue_stairway_key_found',
    locationId: 'lockers_main',
    title: 'လှေကားတံခါးသော့',
    details:
      'လော့ကာ ၁၄ ၏ အောက်ထပ်စင်ပေါ်တွင် ဝှက်ထားသော သံမည်းသော့ကြီး။ မေ အနေဖြင့် ညမထွက်ရတံခါးကို ကျော်ဖြတ်ပြီး ဝရန်တာသို့ သွားနိုင်ရန် ကိုဇော် က ဤနေရာ၌ ဝှက်ထားပေးခဲ့ခြင်း ဖြစ်သည်။',
    pointsTo: 'stairway_gate_unlocked',
  },
];

export const GUARDIAN_PAIRS: GuardianPair[] = [
  {
    id: 1,
    statementA: 'ကိုဇော်က မနာလိုဒေါသထွက်ပြီး သူမကို သတ်ပစ်ခဲ့ခြင်း ဖြစ်သည်။',
    statementB: 'အဝတ်လျှော်ကန်ထဲတွင် တွေ့ရှိခဲ့သည့် ပန်းရောင်အင်္ကျီသည် လူသတ်သမား၏ ပစ္စည်းဖြစ်သည်။',
    trueIndex: 2, // B is true; combined with diary, disproves Ko Zaw
  },
  {
    id: 2,
    statementA: 'သူမ၏အလောင်းကို အဆောင်ဝင်းထဲက ခန်းခြောက်ကျောက်ရေတွင်းဟောင်းထဲသို့ ချပစ်ခဲ့သည်။',
    statementB: 'သူမ၏အလောင်းသည် ရှေးဟောင်းသရက်ပင်ကြီး၏ သစ်မြစ်များအောက်တွင် လဲလျောင်းနေသည်။',
    trueIndex: 1, // A is true
  },
  {
    id: 3,
    statementA: 'သူမ၏ နားထင်ကို ငွေဆံထိုးဖြင့် ထိုးစိုက်ခံရကာ အသက်ဆုံးရှုံးခဲ့ခြင်း ဖြစ်သည်။',
    statementB: 'တစ်ချိန်က ညီအစ်မအရင်းလို နွေးထွေးစွာ ထိတွေ့ခဲ့သော လက်များက သူမ၏ အသက်ရှူလမ်းကြောင်းကို ပိတ်ဆို့ညှစ်သတ်ခဲ့သည်။',
    trueIndex: 2, // B is true (strangled)
  },
];

export const VICTIM_RIDDLES: VictimRiddle[] = [
  {
    topic: 'cause_of_death',
    title: 'သေဆုံးရသည့် အကြောင်းရင်း (Cause of Death)',
    symbolicText: 'တစ်ချိန်က ငါ့ဆံပင်ရှည်တွေကို ညင်သာစွာ ကျစ်ဆံမြီးကျစ်ပေးခဲ့တဲ့ လက်တွေဟာ အခုတော့ ငါ့လည်ချောင်းကို ညှစ်သတ်ပစ်ခဲ့တယ်။',
    trueMeaning: 'strangled',
    options: [
      {
        id: 'opt_strangled',
        meaningKey: 'strangled',
        label: 'သူမ၏ဆံပင်ကို ကျစ်ဆံမြီးကျစ်ပေးခဲ့ဖူးသူတစ်ဦးမှ လည်ပင်းညှစ်သတ်ဖြတ်ခဲ့ခြင်း ဖြစ်သည်။',
      },
      {
        id: 'opt_poisoned',
        meaningKey: 'poisoned',
        label: 'ပဒိုင်းသီးဆေးခတ်ထားသော စံပယ်လက်ဖက်ရည်တစ်ခွက်ဖြင့် အဆိပ်ခတ်ခံခဲ့ရခြင်း ဖြစ်သည်။',
      },
      {
        id: 'opt_drowned',
        meaningKey: 'drowned',
        label: 'မိုးရာသီ မိုးရေလှောင်ကန်ထဲတွင် ရေနစ်မြှုပ် အသတ်ခံခဲ့ရခြင်း ဖြစ်သည်။',
      },
    ],
  },
  {
    topic: 'killer_identity',
    title: 'လူသတ်သမား မည်သူနည်း (Killer Identity)',
    symbolicText:
      'ငါနဲ့အတူ မှန်တစ်ချပ်တည်း ကြည့်ပြီး ကတိတွေတီးတိုးပေးခဲ့သူဟာ ငါအကြိုက်ဆုံး နှင်းဆီရောင်ပိုးပုဝါကို လွှမ်းခြုံထားရင်း သူမလက်မောင်းစက သွေးတွေကို ဆေးကြောသုတ်သင်နေခဲ့တယ်။',
    trueMeaning: 'sandar',
    options: [
      {
        id: 'opt_sandar',
        meaningKey: 'sandar',
        label: 'သူမ၏ နှင်းဆီရောင်ပုဝါကို ဝတ်ဆင်ပြီး အခန်းဖော်အဖြစ် နေထိုင်ခဲ့သည့် စန္ဒာ ဖြစ်သည်။',
      },
      {
        id: 'opt_ko_zaw',
        meaningKey: 'ko_zaw',
        label: 'ပြင်းထန်သော ခိုက်ရန်ဖြစ်ပွားမှုကို ဖုံးကွယ်ရန် ကြိုးစားခဲ့သည့် သူမ၏ ချစ်သူ ကိုဇော် ဖြစ်သည်။',
      },
      {
        id: 'opt_caretaker',
        meaningKey: 'caretaker',
        label: 'တက္ကသိုလ်လူကြီးများ၏ အမိန့်အရ လုပ်ဆောင်ခဲ့သည့် အဆောင်မှူးအိုကြီး ဖြစ်သည်။',
      },
    ],
  },
  {
    topic: 'body_location',
    title: 'အလောင်း ဝှက်ထားသည့် နေရာ (Body Concealment)',
    symbolicText:
      'ကျောက်တွင်းဝဟာ မိုးရာသီမိုးရေတွေကို မျိုချပြီး အခုတော့ နတ်စင်ရဲ့ အရိပ်အောက်မှာ ခန်းခြောက်နေတဲ့ ကျောက်တုံးအေးစက်စက်ကြားမှာ ငါ အိပ်စက်နေရတယ်။',
    trueMeaning: 'dried_well',
    options: [
      {
        id: 'opt_dried_well',
        meaningKey: 'dried_well',
        label: 'နတ်စင်နောက်ကွယ် ခြုံနွယ်ဖုံးလွှမ်းနေသော အဆောင်ဝင်းထဲက ခန်းခြောက်ကျောက်ရေတွင်းဟောင်း ဖြစ်သည်။',
      },
      {
        id: 'opt_mango_tree',
        meaningKey: 'mango_tree',
        label: 'အဆောင်ဝင်းထဲက ရှေးဟောင်းသရက်ပင်ကြီး၏ သစ်မြစ်များအောက် မြေအောက်အနက်တွင် ဖြစ်သည်။',
      },
      {
        id: 'opt_dorm_floor',
        meaningKey: 'dorm_floor',
        label: 'အခန်း ၄-ဘီ အပေါ်ရှိ မျက်နှာကြက်အခေါင်းပေါက်အတွင်း ဝှက်ထားခြင်း ဖြစ်သည်။',
      },
    ],
  },
];

export const ENDINGS_INFO: Record<
  string,
  { title: string; subtitle: string; description: string; type: 'victory' | 'defeat' | 'twist' }
> = {
  true_rest: {
    title: 'ငြိမ်းချမ်းစွာ အနားယူခြင်း - ဝိညာဉ် ငြိမ်းချမ်းမှု ရရှိခြင်း (True Rest)',
    subtitle: 'တရားဝင် အောင်ပွဲ နှင့် ၂၀၂၆ သို့ ပြန်လည်လွတ်မြောက်ခြင်း',
    description:
      'သင်သည် လူသတ်သမားအစစ်အမှန် စန္ဒာကို မှန်ကန်စွာ ဖော်ထုတ်နိုင်ခဲ့ပြီး၊ လည်ပင်းညှစ်သတ်ခဲ့သည့် အကြောင်းရင်းကို ရှင်းလင်းစွာ ဖော်ပြကာ ခန်းခြောက်ရေတွင်းဆီသို့ ဝိညာဉ်အေးချမ်းရေး ယတြာကို မှန်ကန်စွာ လမ်းညွှန်ခဲ့သဖြင့် မမမေ ၏ ယုံကြည်မှုကို ရရှိခဲ့သည်။ သူမသည် နွေးထွေးသော မျက်ရည်တစ်စက် ကျဆင်းလျက် ငြိမ်းချမ်းစွာ ပျောက်ကွယ်သွားခဲ့သည်။ အချိန်ကာလစွမ်းအင် လှိုင်းလုံးကြီးက သင့်အား ၂၀၂၆ ခုနှစ်သို့ ပြန်လည်ဆွဲခေါ်သွားပြီး နိုးထလာသော သူငယ်ချင်းများ၏ ရင်ခွင်ထဲသို့ ရောက်ရှိစေခဲ့သည်။',
    type: 'victory',
  },
  twist_ending: {
    title: 'အလှည့်အပြောင်း ဇာတ်သိမ်း - သွေးမျိုးနွယ် ဖွင့်ဟချက် (Twist Ending)',
    subtitle: 'အချိန်ကာလကို ကျော်လွန်သော ဆွေမျိုးတော်စပ်မှု',
    description:
      'သင်သည် စန္ဒာ ၏ အပြစ်ကို သက်သေထူနိုင်ခဲ့ပြီး အခန်း ၄-ဘီ မှ ရှေးဟောင်းလော့ကတ်သီးကို ရှာဖွေတွေ့ရှိကာ ၂၀၂၆ ခုနှစ်မှ သူငယ်ချင်း အေးအေး သည် စန္ဒာ ၏ တူမအရင်းဖြစ်ကြောင်း သက်သေပြနိုင်ခဲ့သည်။ ၂၀၂၆ ခုနှစ်တွင် သင် မျက်စိဖွင့်ကြည့်လိုက်သောအခါ အေးအေး သည် သင့်ဘေးတွင် ဒူးထောက်ထိုင်နေပြီး ၁၉၉၈ လူသတ်မှုမှတ်တမ်းတွင် ဖော်ပြထားသော ရှေးဟောင်းနှင်းဆီဆံထိုးကို ဆင်မြန်းထားသည်ကို ထိတ်လန့်ဖွယ် တွေ့မြင်လိုက်ရသည်။',
    type: 'twist',
  },
  deceived: {
    title: 'လှည့်စားခံရခြင်း - အစောင့်နတ်၏ ထောင်ချောက် (Deceived)',
    subtitle: 'မှားယွင်းသော စီရင်ချက် နှင့် မမှန်ကန်သော စွပ်စွဲမှု',
    description:
      'သင်သည် အစောင့်နတ်၏ မမှန်ကန်သော တီးတိုးလှည့်စားမှုများကို ယုံကြည်မိပြီး အပြစ်မဲ့သော ကိုဇော် ကို စွပ်စွဲပြစ်တင်ခဲ့သည်။ ယတြာအခမ်းအနားသည် မှားယွင်းသော သက်သေများဖြင့် ပျက်စီးသွားခဲ့သည်။ စန္ဒာ ၏ စစ်မှန်သော ရာဇဝတ်မှုသည် ဖုံးကွယ်ခံထားရဆဲဖြစ်ပြီး မမမေ ၏ ဝိညာဉ်သည် နောက်ထပ်မျိုးဆက်တစ်ခုအထိ အဆောင်စင်္ကြံများတွင် ချုပ်နှောင်ခံထားရတော့မည်။',
    type: 'defeat',
  },
  misunderstood: {
    title: 'နားလည်မှုလွဲမှားခြင်း - မဖြေရှင်းနိုင်သော သောက (Misunderstood)',
    subtitle: 'မပြည့်စုံသော အမှန်တရား နှင့် ကျန်ရစ်သော ဝမ်းနည်းကြေကွဲမှု',
    description:
      'အစောင့်နတ်၏ ထောင်ချောက်မှ လွတ်မြောက်ခဲ့သော်လည်း မမမေ ၏ သင်္ကေတပဟေဠိများကို သင် လွဲမှားစွာ အဓိပ္ပာယ်ကောက်ယူခဲ့သည်။ သူမ၏ စစ်မှန်သော ခံစားချက်နှင့် ဆင်းရဲဒုက္ခကို နားမလည်နိုင်ခဲ့ပေ။ သူမ၏ ဝမ်းနည်းကြေကွဲနေသော ဝိညာဉ်သည် မိုးစက်မိုးပေါက်များအောက်တွင် အဆုံးမရှိ ငိုကြွေးနေသော သရဲမအဖြစ် ကျန်ရစ်ခဲ့သည်။',
    type: 'defeat',
  },
  time_expired: {
    title: 'အချိန်ကုန်ဆုံးခြင်း - အချိန်ဆက်သွယ်မှု ပြတ်တောက်ခြင်း (Time Expired)',
    subtitle: 'အချိန်ရေတွက်မှု သုညသို့ ရောက်ရှိသွားသည်',
    description:
      '၂၀၂၆ ခုနှစ် ယတြာကျောက်ဆူး ပြတ်တောက်သွားခဲ့သည်။ သူငယ်ချင်းများ၏ ခေါ်သံများသည် တိတ်ဆိတ်အမှောင်ထုထဲသို့ တဖြည်းဖြည်း ပျောက်ကွယ်သွားခဲ့သည်။ ၁၉၉၈ ခုနှစ် အဆောင်သည် ထာဝရရပ်တန့်သွားကာ သင်သည် အခန်း ၄-ဘီ ၏ အရိပ်တစ်ခုအဖြစ် ထာဝရ ပိတ်မိကျန်ရစ်တော့သည်။',
    type: 'defeat',
  },
  composure_zero: {
    title: 'စိတ်တည်ငြိမ်မှု ပျက်ပြားခြင်း - စိတ်ပိုင်းဆိုင်ရာ ပြိုလဲမှု (Composure Zero)',
    subtitle: 'ကြောက်ရွံ့မှုကြောင့် စိတ်နှလုံး ပျက်စီးသွားခြင်း',
    description:
      'ထိတ်လန့်ကြောက်ရွံ့မှုကြောင့် သင့်စိတ်တည်ငြိမ်မှု ၀% သို့ ရောက်ရှိသွားခဲ့သည်။ ထင်ယောင်ထင်မှားများနှင့် သဘာဝလွန် အာရုံခံစားမှုများက သင့်အသိတရားကို ဝါးမျိုသွားသည်။ အေးစက်သော ကြမ်းပြင်ပေါ်တွင် အသိစိတ်မဲ့ လဲကျနေစဉ် ဝိညာဉ်များက သင့်စိတ်ကို ရေတွင်းနက်ထဲသို့ ဆွဲချသွားခဲ့သည်။',
    type: 'defeat',
  },
  grief_overflow: {
    title: 'သောကပြင်းထန်ခြင်း - အငြိုးကြီးသော သရဲသရက် (Grief Overflow)',
    subtitle: 'မမမေ သည် သရဲမကြီးအဖြစ်သို့ ကူးပြောင်းသွားသည်',
    description:
      'မမမေ ၏ ဝမ်းနည်းသောကသည် ၁၀၀% သို့ ရောက်ရှိသွားခဲ့သည်။ အမှန်တရားကို လွဲမှားဖော်ပြမှုများကြောင့် သူမ၏ ပူဆွေးသောကသည် ထိန်းမနိုင်သိမ်းမရ ဒေါသအဖြစ် ပြောင်းလဲသွားခဲ့သည်။ အဆောင်တစ်ခုလုံးသည် ပြင်းထန်သော သဘာဝလွန်စွမ်းအင်ပေါက်ကွဲမှုကြီးနှင့်အတူ ပြိုကျပျက်စီးသွားခဲ့သည်။',
    type: 'defeat',
  },
};
