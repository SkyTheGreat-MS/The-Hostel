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
    response: '...The spin of cold needles means nothing to the unseen. Take that toy away.',
    spritePose: 'neutral',
    shockDamage: 2,
  },
  magnetic_compass: {
    targetId: 'magnetic_compass',
    tier: 'unknown',
    response: '...The spin of cold needles means nothing to the unseen. Take that toy away.',
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
    response: 'That tooth of brass belongs to the dead girl’s locker, yet its sister key was melted to ash behind the mess hall. You chase hollow metal.',
    spritePose: 'warning',
    caseNoteUnlock: 'Nat claims the sister locker key was burned in the incinerator.',
  },
  small_brass_key_32: {
    targetId: 'small_brass_key_32',
    tier: 'deceit',
    response: 'That tooth of brass belongs to the dead girl’s locker, yet its sister key was melted to ash behind the mess hall. You chase hollow metal.',
    spritePose: 'warning',
    caseNoteUnlock: 'Nat claims the sister locker key was burned in the incinerator.',
  },

  // --- CASE NOTES / LORE CLUES ---
  clue_ko_zaw_letters: {
    targetId: 'clue_ko_zaw_letters',
    tier: 'truth',
    response: 'Stolen words written in hurried ink... May looked where her eyes should have turned away. The bond between dorm sisters withered the night those letters were uncovered.',
    spritePose: 'pensive',
    caseNoteUnlock: 'The Nat confirms May\'s secret connection with Ko Zaw drove a violent wedge between the roommates.',
  },
  sandar_kozaw_letters: {
    targetId: 'sandar_kozaw_letters',
    tier: 'truth',
    response: 'Stolen words written in hurried ink... May looked where her eyes should have turned away. The bond between dorm sisters withered the night those letters were uncovered.',
    spritePose: 'pensive',
    caseNoteUnlock: 'The Nat confirms May\'s secret connection with Ko Zaw drove a violent wedge between the roommates.',
  },
  clue_physics_chem_notes_1998: {
    targetId: 'clue_physics_chem_notes_1998',
    tier: 'truth',
    response: 'Formulas written by a trembling hand. She spent her final study hours plotting an escape beyond the curfew gate... before the corridor was barricaded.',
    spritePose: 'pensive',
    caseNoteUnlock: 'May had planned to flee the hostel during curfew before she was silenced.',
  },
  clue_banyan_well: {
    targetId: 'clue_banyan_well',
    tier: 'forbidden_taboo',
    response: '...DO NOT SPEAK OF THE WELL! The roots drink deep from the dark. Name it again and I will extinguish these candles myself!',
    spritePose: 'warning',
    shockDamage: 5,
  },
  clue_well_rumor: {
    targetId: 'clue_well_rumor',
    tier: 'forbidden_taboo',
    response: '...DO NOT SPEAK OF THE WELL! The roots drink deep from the dark. Name it again and I will extinguish these candles myself!',
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
