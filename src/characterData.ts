import { CharacterProfile } from './types';

export { type CharacterProfile };

export const CHARACTER_ROSTER: Record<string, CharacterProfile> = {
  moe_stheinkha: {
    id: 'moe_stheinkha',
    name: 'MOE STHEINKHA',
    archetype: 'SKEPTIC',
    tensionMultiplier: 1.2,
    resolveMultiplier: 0.9,
    avatar: '/assets/msk_1.png',
  },
  ye_yint_hein: {
    id: 'ye_yint_hein',
    name: 'YE YINT HEIN',
    archetype: 'DAREDEVIL',
    tensionMultiplier: 1.3,
    resolveMultiplier: 1.4,
    avatar: '/assets/yyh_1.png',
  },
  may_jewel: {
    id: 'may_jewel',
    name: 'MAY JEWEL',
    archetype: 'INTUITIVE',
    tensionMultiplier: 0.8,
    resolveMultiplier: 1.3,
    avatar: '/assets/mj_1.png',
  },
  yin_min_htike: {
    id: 'yin_min_htike',
    name: 'YIN MIN HTIKE',
    archetype: 'ARCHIVIST',
    tensionMultiplier: 0.8,
    resolveMultiplier: 0.8,
    avatar: '/assets/ymh_1.png',
  },
  hsu_myat_shein: {
    id: 'hsu_myat_shein',
    name: 'HSU MYAT SHEIN',
    archetype: 'KIN-BOUND',
    tensionMultiplier: 1.4,
    resolveMultiplier: 1.5,
    avatar: '/assets/hms_1.png',
  },
  mona: {
    id: 'mona',
    name: 'MONA',
    archetype: 'PROTECTOR',
    tensionMultiplier: 1.0,
    resolveMultiplier: 1.0,
    avatar: '/assets/mt_1.png',
  },
  // Legacy aliases
  thazin: {
    id: 'thazin',
    name: 'THAZIN',
    archetype: 'SKEPTIC',
    tensionMultiplier: 1.2,
    resolveMultiplier: 0.9,
    avatar: '/assets/msk_1.png',
  },
  kyaw_swar: {
    id: 'kyaw_swar',
    name: 'KYAW SWAR',
    archetype: 'DAREDEVIL',
    tensionMultiplier: 1.3,
    resolveMultiplier: 1.4,
    avatar: '/assets/yyh_1.png',
  },
  su_su: {
    id: 'su_su',
    name: 'SU SU',
    archetype: 'INTUITIVE',
    tensionMultiplier: 0.8,
    resolveMultiplier: 1.3,
    avatar: '/assets/mj_1.png',
  },
  htet: {
    id: 'htet',
    name: 'HTET',
    archetype: 'ARCHIVIST',
    tensionMultiplier: 0.8,
    resolveMultiplier: 0.8,
    avatar: '/assets/ymh_1.png',
  },
  aye_aye: {
    id: 'aye_aye',
    name: 'AYE AYE',
    archetype: 'KIN-BOUND',
    tensionMultiplier: 1.4,
    resolveMultiplier: 1.5,
    avatar: '/assets/hms_1.png',
  },
  min_khant: {
    id: 'min_khant',
    name: 'MIN KHANT',
    archetype: 'PROTECTOR',
    tensionMultiplier: 1.0,
    resolveMultiplier: 1.0,
    avatar: '/assets/mt_1.png',
  },
};

export const getCharacterProfile = (id: string): CharacterProfile => {
  return CHARACTER_ROSTER[id] || CHARACTER_ROSTER['moe_stheinkha'];
};

export default CHARACTER_ROSTER;
