import { CharacterProfile } from './types';

export { type CharacterProfile };

export const CHARACTER_ROSTER: Record<string, CharacterProfile> = {
  moe_stheinkha: {
    id: 'moe_stheinkha',
    name: 'မိုးစိတ်ခ',
    archetype: 'သံသယရှိသူ',
    tensionMultiplier: 1.2,
    resolveMultiplier: 0.9,
    avatar: '/assets/msk_1.png',
  },
  ye_yint_hein: {
    id: 'ye_yint_hein',
    name: 'ရဲရင့်ဟိန်း',
    archetype: 'ရဲရင့်သူ',
    tensionMultiplier: 1.3,
    resolveMultiplier: 1.4,
    avatar: '/assets/yyh_1.png',
  },
  may_jewel: {
    id: 'may_jewel',
    name: 'မေဂျူး',
    archetype: 'အတွေ့အကြုံရှိသူ',
    tensionMultiplier: 0.8,
    resolveMultiplier: 1.3,
    avatar: '/assets/mj_1.png',
  },
  yin_min_htike: {
    id: 'yin_min_htike',
    name: 'ယင်မင်းထိပ်',
    archetype: 'မှတ်တမ်းပြ',
    tensionMultiplier: 0.8,
    resolveMultiplier: 0.8,
    avatar: '/assets/ymh_1.png',
  },
  hsu_myat_shein: {
    id: 'hsu_myat_shein',
    name: 'ဆွတ်မြတ်ရှိန်',
    archetype: 'သွေးဆက်သူ',
    tensionMultiplier: 1.4,
    resolveMultiplier: 1.5,
    avatar: '/assets/hms_1.png',
  },
  mona: {
    id: 'mona',
    name: 'မိုနာ',
    archetype: 'ကာကွယ်သူ',
    tensionMultiplier: 1.0,
    resolveMultiplier: 1.0,
    avatar: '/assets/mt_1.png',
  },
  // Legacy aliases
  thazin: {
    id: 'thazin',
    name: 'သဇင်',
    archetype: 'သံသယရှိသူ',
    tensionMultiplier: 1.2,
    resolveMultiplier: 0.9,
    avatar: '/assets/msk_1.png',
  },
  kyaw_swar: {
    id: 'kyaw_swar',
    name: 'ကျော်စွာ',
    archetype: 'ရဲရင့်သူ',
    tensionMultiplier: 1.3,
    resolveMultiplier: 1.4,
    avatar: '/assets/yyh_1.png',
  },
  su_su: {
    id: 'su_su',
    name: 'စုစု',
    archetype: 'အတွေ့အကြုံရှိသူ',
    tensionMultiplier: 0.8,
    resolveMultiplier: 1.3,
    avatar: '/assets/mj_1.png',
  },
  htet: {
    id: 'htet',
    name: 'ထက်',
    archetype: 'မှတ်တမ်းပြ',
    tensionMultiplier: 0.8,
    resolveMultiplier: 0.8,
    avatar: '/assets/ymh_1.png',
  },
  aye_aye: {
    id: 'aye_aye',
    name: 'အေးအေး',
    archetype: 'သွေးဆက်သူ',
    tensionMultiplier: 1.4,
    resolveMultiplier: 1.5,
    avatar: '/assets/hms_1.png',
  },
  min_khant: {
    id: 'min_khant',
    name: 'မင်းခန့်',
    archetype: 'ကာကွယ်သူ',
    tensionMultiplier: 1.0,
    resolveMultiplier: 1.0,
    avatar: '/assets/mt_1.png',
  },
};

export const getCharacterProfile = (id: string): CharacterProfile => {
  return CHARACTER_ROSTER[id] || CHARACTER_ROSTER['moe_stheinkha'];
};

export default CHARACTER_ROSTER;
