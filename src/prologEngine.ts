import {
  GameState,
  MCId,
  TriggerType,
  EndingId,
  ComposureState,
} from './types';
import { CHARACTERS, GUARDIAN_PAIRS, VICTIM_RIDDLES, CLUES, LOCATIONS } from './gameData';

export function createInitialState(selectedMC: MCId = 'thazin'): GameState {
  return {
    chapter: 1,
    explorationCount: 0,
    shadowEventTriggered: false,
    timeRemaining: 20,
    playerComposure: 100,
    mamaMayGrief: 50,
    selectedMC,
    composureState: 'normal',
    gameOver: null,
    discoveredClues: [],
    decodedCiphers: [],
    deducedChoices: {},
    usedUnverifiedClaims: {},
    decodeChoices: {},
    trustedFacts: {},
    misreadFacts: {},
    ritePerformed: null,
    finalAccusation: null,
    historyLog: [
      'Ritual performed in 2026. The offering glass shattered.',
      'You awaken alone on the dusty floorboards of Room 4B in August 1998.',
    ],
  };
}

export function checkFailConditions(state: GameState): EndingId | null {
  if (state.gameOver) return state.gameOver;
  if (state.timeRemaining <= 0) return 'time_expired';
  if (state.playerComposure <= 0) return 'composure_zero';
  if (state.mamaMayGrief >= 100) return 'grief_overflow';
  return null;
}

export function updateComposureState(composure: number): ComposureState {
  if (composure <= 0) return 'broken';
  if (composure <= 40) return 'panicking';
  if (composure <= 70) return 'shaken';
  return 'normal';
}

export function consumeTurn(state: GameState, amount: number): GameState {
  const newTime = Math.max(0, state.timeRemaining - amount);
  const nextState: GameState = {
    ...state,
    timeRemaining: newTime,
  };
  const fail = checkFailConditions(nextState);
  if (fail) nextState.gameOver = fail;
  return nextState;
}

export function applyComposureDamage(
  state: GameState,
  baseDamage: number,
  triggerType: TriggerType
): GameState {
  const char = CHARACTERS.find((c) => c.id === state.selectedMC) || CHARACTERS[0];
  const multiplier = char.multipliers[triggerType] ?? 1.0;
  const actualDamage = Math.round(baseDamage * multiplier);
  const newComposure = Math.max(0, state.playerComposure - actualDamage);
  const newComposureState = updateComposureState(newComposure);

  const nextState: GameState = {
    ...state,
    playerComposure: newComposure,
    composureState: newComposureState,
  };

  const fail = checkFailConditions(nextState);
  if (fail) nextState.gameOver = fail;
  return nextState;
}

export function modifyGrief(state: GameState, amount: number): GameState {
  const newGrief = Math.max(0, Math.min(100, state.mamaMayGrief + amount));
  const nextState: GameState = {
    ...state,
    mamaMayGrief: newGrief,
  };
  const fail = checkFailConditions(nextState);
  if (fail) nextState.gameOver = fail;
  return nextState;
}

export function exploreLocation(state: GameState, locationId: string): GameState {
  const loc = LOCATIONS.find((l) => l.id === locationId);

  // Chapter 1: Fixed narrative exploration sequence
  if (state.chapter === 1) {
    let nextState = consumeTurn(state, 1);
    const newCount = (state.explorationCount || 0) + 1;
    const isShadowTrigger = newCount >= 3;

    if (isShadowTrigger) {
      nextState = {
        ...nextState,
        chapter: 2,
        explorationCount: newCount,
        shadowEventTriggered: true,
        discoveredClues: Array.from(new Set([...nextState.discoveredClues, 'glitch_body_glimpse'])),
        historyLog: [
          ...nextState.historyLog,
          `Exploring ${loc ? loc.name : locationId}... A horrifying distortion ripples across the corridor. A glitching spectral silhouette manifests and vanishes, leaving a temporal residue. (Chapter 1 Complete — Chapter 2 Unlocked!)`,
        ],
      };
      nextState = applyComposureDamage(nextState, 10, 'supernatural_direct');
    } else {
      nextState = {
        ...nextState,
        explorationCount: newCount,
        historyLog: [
          ...nextState.historyLog,
          `Wandered through ${loc ? loc.name : locationId}. The air is freezing and the silence is deafening (${newCount}/3 explorations).`,
        ],
      };
      nextState = applyComposureDamage(nextState, 4, 'supernatural_direct');
    }

    return nextState;
  }

  // Chapter 2+: Standard full investigation
  const cost = loc ? loc.turnCost : 2;
  let nextState = consumeTurn(state, cost);
  if (nextState.gameOver) return nextState;

  const roomClues = CLUES.filter((c) => c.locationId === locationId);
  const newlyFound: string[] = [];
  const newlyDecoded: string[] = [...nextState.decodedCiphers];

  roomClues.forEach((c) => {
    if (!nextState.discoveredClues.includes(c.id)) {
      newlyFound.push(c.id);
      if (c.isCipher) newlyDecoded.push(c.id);
    }
  });

  nextState = {
    ...nextState,
    discoveredClues: [...nextState.discoveredClues, ...newlyFound],
    decodedCiphers: newlyDecoded,
  };

  if (newlyFound.length > 0) {
    nextState = applyComposureDamage(nextState, 5, 'supernatural_direct');
  }

  return nextState;
}

export function deduceGuardianPair(
  state: GameState,
  pairId: number,
  chosenIndex: 1 | 2
): GameState {
  const pair = GUARDIAN_PAIRS.find((p) => p.id === pairId);
  if (!pair) return state;

  const isCorrect = chosenIndex === pair.trueIndex;
  const newDeduced = { ...state.deducedChoices, [pairId]: chosenIndex };
  const newUnverified = { ...state.usedUnverifiedClaims };

  let nextState = {
    ...state,
    deducedChoices: newDeduced,
  };

  if (isCorrect) {
    nextState = modifyGrief(nextState, -5);
  } else {
    const wrongStatement = chosenIndex === 1 ? pair.statementA : pair.statementB;
    newUnverified[pairId] = wrongStatement;
    nextState = {
      ...nextState,
      usedUnverifiedClaims: newUnverified,
    };
    nextState = modifyGrief(nextState, 10);
    nextState = applyComposureDamage(nextState, 15, 'betrayal');
  }

  return nextState;
}

export function decodeRiddle(
  state: GameState,
  topic: 'cause_of_death' | 'killer_identity' | 'body_location',
  chosenMeaning: string
): GameState {
  const riddle = VICTIM_RIDDLES.find((r) => r.topic === topic);
  if (!riddle) return state;

  const isCorrect = chosenMeaning === riddle.trueMeaning;
  const newDecodeChoices = { ...state.decodeChoices, [topic]: chosenMeaning };
  const newTrusted = { ...state.trustedFacts };
  const newMisread = { ...state.misreadFacts };

  let nextState = {
    ...state,
    decodeChoices: newDecodeChoices,
  };

  if (isCorrect) {
    newTrusted[topic] = chosenMeaning;
    nextState = {
      ...nextState,
      trustedFacts: newTrusted,
    };
    nextState = modifyGrief(nextState, -10);
  } else {
    newMisread[topic] = chosenMeaning;
    nextState = {
      ...nextState,
      misreadFacts: newMisread,
    };
    nextState = modifyGrief(nextState, 15);
  }

  return nextState;
}

export function accusationValid(state: GameState, killer: string, cause: string, location: string): boolean {
  if (killer !== 'sandar' || cause !== 'strangled' || location !== 'dried_well') {
    return false;
  }

  const killerGrounded =
    state.trustedFacts['killer_identity'] === 'sandar' ||
    state.deducedChoices[1] === 2 ||
    state.discoveredClues.includes('caesar_chest');

  const causeGrounded =
    state.trustedFacts['cause_of_death'] === 'strangled' ||
    state.deducedChoices[3] === 2;

  const locationGrounded =
    state.trustedFacts['body_location'] === 'dried_well' ||
    state.deducedChoices[2] === 1 ||
    state.discoveredClues.includes('caesar_chest');

  return killerGrounded && causeGrounded && locationGrounded;
}

export function resolveEnding(state: GameState): EndingId {
  // 1. Fail conditions take absolute precedence
  if (state.gameOver && state.gameOver !== ('resolved' as any)) {
    return state.gameOver;
  }
  if (state.timeRemaining <= 0) return 'time_expired';
  if (state.playerComposure <= 0) return 'composure_zero';
  if (state.mamaMayGrief >= 100) return 'grief_overflow';

  // 2. Accusation & Rite checks
  if (state.finalAccusation && state.ritePerformed === true) {
    const { killer, cause, location } = state.finalAccusation;
    const valid = accusationValid(state, killer, cause, location);

    if (valid) {
      if (state.discoveredClues.includes('antique_locket')) {
        return 'twist_ending';
      }
      if (state.mamaMayGrief <= 30) {
        return 'true_rest';
      }
      if (Object.keys(state.usedUnverifiedClaims).length > 0) {
        return 'deceived';
      }
      if (Object.keys(state.misreadFacts).length > 0) {
        return 'misunderstood';
      }
      return 'true_rest';
    }
  }

  // 3. Contaminated by unverified claim
  if (Object.keys(state.usedUnverifiedClaims).length > 0) {
    return 'deceived';
  }

  // 4. Contaminated by misread riddle
  if (Object.keys(state.misreadFacts).length > 0) {
    return 'misunderstood';
  }

  return 'deceived';
}
