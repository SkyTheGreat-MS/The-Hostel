import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AtmosphericLayout } from '../components/AtmosphericLayout';
import { useGameProgress } from '../context/GameProgressContext';
import { GameState, MCId, EndingId } from '../types';
import {
  CHARACTERS,
  LOCATIONS,
  GUARDIAN_PAIRS,
  VICTIM_RIDDLES,
  CLUES,
  ENDINGS_INFO,
} from '../gameData';
import {
  createInitialState,
  consumeTurn,
  applyComposureDamage,
  modifyGrief,
  exploreLocation,
  deduceGuardianPair,
  decodeRiddle,
  resolveEnding,
} from '../prologEngine';
import { sound } from '../audioEngine';
import {
  Clock,
  Heart,
  Shield,
  Flame,
  Search,
  MessageSquare,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  RotateCcw,
  Unlock,
  Layers,
  HelpCircle,
  Eye,
  User,
  Key,
  Compass,
  Scroll,
} from 'lucide-react';

type ChapterTab = 'explore' | 'guardian' | 'riddles' | 'case_notes' | 'confront';

export const ChapterOne: React.FC = () => {
  const {
    highestChapterCompleted,
    completeChapter,
    selectedMC,
    setSelectedMC,
  } = useGameProgress();

  const navigate = useNavigate();

  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialState(selectedMC)
  );

  const [activeTab, setActiveTab] = useState<ChapterTab>('explore');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('dorm_room_4b');
  const [activeClueInspect, setActiveClueInspect] = useState<string | null>(null);
  const [caesarShift, setCaesarShift] = useState<number>(0);
  const [introDismissed, setIntroDismissed] = useState<boolean>(false);
  const [victoryModalOpen, setVictoryModalOpen] = useState<boolean>(false);
  const [lastActionFeedback, setLastActionFeedback] = useState<string | null>(null);

  // Accusation state
  const [accusationKiller, setAccusationKiller] = useState<string>('sandar');
  const [accusationCause, setAccusationCause] = useState<string>('strangled');
  const [accusationLocation, setAccusationLocation] = useState<string>('dried_well');
  const [accusationRite, setAccusationRite] = useState<boolean>(true);

  // Initialize character synchronization
  const currentChar = CHARACTERS.find((c) => c.id === gameState.selectedMC) || CHARACTERS[0];

  const handleCharacterChange = (mcId: MCId) => {
    setSelectedMC(mcId);
    setGameState((prev) => ({
      ...prev,
      selectedMC: mcId,
      historyLog: [
        ...prev.historyLog,
        `Switched perspective to ${CHARACTERS.find((c) => c.id === mcId)?.name}.`,
      ],
    }));
    sound.playMenuSelect();
  };

  const handleExplore = (locId: string) => {
    const loc = LOCATIONS.find((l) => l.id === locId);
    if (!loc) return;
    if (gameState.timeRemaining < loc.turnCost) {
      sound.playDamage();
      setLastActionFeedback('Not enough turns left to explore this location!');
      return;
    }

    sound.playMenuSelect();
    const nextState = exploreLocation(gameState, locId);
    setGameState(nextState);
    setSelectedLocationId(locId);

    const newlyDiscovered = CLUES.filter(
      (c) => c.locationId === locId && !gameState.discoveredClues.includes(c.id)
    );

    if (newlyDiscovered.length > 0) {
      sound.playSuccessTune();
      setLastActionFeedback(
        `Discovered ${newlyDiscovered.length} new clue(s) in ${loc.name}!`
      );
    } else {
      setLastActionFeedback(`Searched ${loc.name}. No new physical clues.`);
    }
  };

  const handleGuardianChoice = (pairId: number, chosenIndex: 1 | 2) => {
    if (gameState.timeRemaining < 1) {
      sound.playDamage();
      return;
    }
    const pair = GUARDIAN_PAIRS.find((p) => p.id === pairId);
    if (!pair) return;

    const isCorrect = pair.trueIndex === chosenIndex;
    if (isCorrect) {
      sound.playChime(true);
      setLastActionFeedback(`Guardian truth resonates. Mama May's grief decreased.`);
    } else {
      sound.playDamage();
      setLastActionFeedback(`False claim accepted! A violent supernatural chill strikes.`);
    }

    const nextState = deduceGuardianPair(gameState, pairId, chosenIndex);
    setGameState(nextState);
  };

  const handleRiddleDecode = (topic: 'cause_of_death' | 'killer_identity' | 'body_location', meaningKey: string) => {
    if (gameState.timeRemaining < 1) {
      sound.playDamage();
      return;
    }
    const riddle = VICTIM_RIDDLES.find((r) => r.topic === topic);
    if (!riddle) return;

    const isCorrect = riddle.trueMeaning === meaningKey;
    if (isCorrect) {
      sound.playChime(true);
      setLastActionFeedback(`Riddle decoded accurately! Mama May's sorrow softens.`);
    } else {
      sound.playDamage();
      setLastActionFeedback(`Misinterpreted the spirit's words! Grief rises.`);
    }

    const nextState = decodeRiddle(gameState, topic, meaningKey);
    setGameState(nextState);
  };

  const handleFinalAccusation = () => {
    if (gameState.timeRemaining < 1) {
      sound.playDamage();
      return;
    }

    sound.playDramaticSting();
    const preparedState: GameState = {
      ...gameState,
      finalAccusation: {
        killer: accusationKiller,
        cause: accusationCause,
        location: accusationLocation,
      },
      ritePerformed: accusationRite,
    };

    const ending = resolveEnding(preparedState);

    const nextState: GameState = {
      ...preparedState,
      gameOver: ending,
    };
    setGameState(nextState);

    // If victory achieved (true_rest or twist_ending), trigger Chapter 1 completion!
    if (ending === 'true_rest' || ending === 'twist_ending') {
      completeChapter(1);
      setVictoryModalOpen(true);
    }
  };

  const handleRestartChapter = () => {
    sound.playMenuSelect();
    setGameState(createInitialState(selectedMC));
    setVictoryModalOpen(false);
    setIntroDismissed(true);
    setLastActionFeedback(null);
  };

  // Helper for Caesar Cipher deciphering UI
  const getShiftedText = (str: string, shift: number) => {
    return str
      .split('')
      .map((char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
        }
        if (code >= 97 && code <= 122) {
          return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
        }
        return char;
      })
      .join('');
  };

  return (
    <AtmosphericLayout
      headerTitle="THE SPIRIT'S LABYRINTH"
      headerSubtitle="CHAPTER 1 — BLIND START • 1998 TEMPORAL ECHO"
      backTo="/chapters"
      backLabel="Chapter Showcase"
      scene="hallway"
      colorGrade="monsoon_green"
    >
      {/* 1. Opening Narrative Scene Modal (First-time or review) */}
      <AnimatePresence>
        {!introDismissed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-[#09120e] border border-amber-600/60 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] text-stone-200 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                  AUGUST 1998 • TEMPORAL MANIFESTATION
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-black text-stone-100 mb-4 border-b border-stone-800 pb-3">
                Chapter 1 — Blind Start
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                <p>
                  The Nat-calling ritual glass shattered with a sharp explosion of cold light in 2026. A suffocating pressure seized your chest, and darkness took you.
                </p>
                <p>
                  When you open your eyes, your modern university friends are gone. Your smartphone displays static. The corridor is decaying, damp with monsoon mist, lit only by dim kerosene lanterns. A wall calendar hanging on the peeling plaster reads: <strong className="text-amber-300 font-mono">AUGUST 1998</strong>.
                </p>
                <p className="text-amber-200/90 font-serif italic bg-amber-950/40 p-3 rounded-lg border border-amber-800/40">
                  "Mama May was murdered in this hostel 28 years ago. Her spirit cannot rest until the truth of her strangulation and hidden body is brought to light. You have 20 turns before your temporal anchor dissolves forever."
                </p>
              </div>

              {/* Character Selector Grid */}
              <div className="mt-6 pt-4 border-t border-stone-800">
                <div className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold mb-3 flex items-center justify-between">
                  <span>Select Main Character Perspective:</span>
                  <span className="text-amber-400 text-[11px]">
                    Current: {currentChar.name} ({currentChar.archetype})
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CHARACTERS.map((char) => {
                    const isSelected = char.id === gameState.selectedMC;
                    return (
                      <button
                        key={char.id}
                        type="button"
                        onClick={() => handleCharacterChange(char.id)}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-900/60 border-amber-400 text-stone-100 ring-1 ring-amber-400 shadow-md'
                            : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                        }`}
                      >
                        <div className="text-xs font-bold font-serif text-stone-100">
                          {char.name}
                        </div>
                        <div className="text-[10px] font-mono text-amber-500">
                          {char.archetype}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-7 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    sound.playMenuSelect();
                    setIntroDismissed(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 border border-amber-300 text-stone-950 font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-lg hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]"
                >
                  <span>BEGIN INVESTIGATION</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Top HUD Bar (Temporal Anchor, Composure, Mama May Grief, Active Character) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {/* Turns Remaining */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-stone-950/90 border border-stone-800 shadow-lg flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[10px] font-mono uppercase text-stone-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Anchor Timer</span>
            </div>
            <div
              className={`text-xl sm:text-2xl font-mono font-bold ${
                gameState.timeRemaining <= 5
                  ? 'text-rose-400 animate-pulse'
                  : gameState.timeRemaining <= 10
                  ? 'text-amber-400'
                  : 'text-stone-100'
              }`}
            >
              {gameState.timeRemaining}{' '}
              <span className="text-xs text-stone-400 font-normal">turns</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center">
            <span className="text-xs font-mono font-bold text-amber-400">
              {Math.round((gameState.timeRemaining / 20) * 100)}%
            </span>
          </div>
        </div>

        {/* Player Composure */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-stone-950/90 border border-stone-800 shadow-lg flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[10px] font-mono uppercase text-stone-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-sky-400" />
              <span>Composure</span>
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-sky-300">
              {gameState.playerComposure}%{' '}
              <span className="text-[11px] font-mono uppercase px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60 font-semibold">
                {gameState.composureState}
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-sky-950/50 border border-sky-800 flex items-center justify-center">
            <Heart className="w-4 h-4 text-sky-400" />
          </div>
        </div>

        {/* Mama May Grief */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-stone-950/90 border border-stone-800 shadow-lg flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[10px] font-mono uppercase text-stone-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Spirit Grief</span>
            </div>
            <div
              className={`text-xl sm:text-2xl font-mono font-bold ${
                gameState.mamaMayGrief >= 80
                  ? 'text-rose-500 animate-pulse'
                  : gameState.mamaMayGrief <= 30
                  ? 'text-emerald-400'
                  : 'text-amber-400'
              }`}
            >
              {gameState.mamaMayGrief}%{' '}
              <span className="text-[10px] text-stone-400 font-mono">
                {gameState.mamaMayGrief >= 80 ? 'CRITICAL' : gameState.mamaMayGrief <= 30 ? 'SERENE' : 'AGITATED'}
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-rose-950/50 border border-rose-800 flex items-center justify-center">
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
        </div>

        {/* Active Character */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-stone-950/90 border border-stone-800 shadow-lg flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[10px] font-mono uppercase text-stone-400 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Protagonist</span>
            </div>
            <div className="text-base sm:text-lg font-serif font-bold text-stone-100">
              {currentChar.name}{' '}
              <span className="text-xs font-mono text-amber-500 font-normal">
                ({currentChar.archetype})
              </span>
            </div>
          </div>
          <button
            onClick={() => setIntroDismissed(false)}
            className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs font-mono"
            title="Switch Character / View Intro"
          >
            INFO
          </button>
        </div>
      </div>

      {/* Action Feedback Banner */}
      {lastActionFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 px-4 py-2.5 rounded-lg bg-stone-900/90 border border-amber-600/50 text-xs font-mono text-amber-200 flex items-center justify-between shadow-md"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{lastActionFeedback}</span>
          </div>
          <button
            onClick={() => setLastActionFeedback(null)}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* 3. Investigation Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-stone-800/80 pb-3">
        <button
          onClick={() => {
            sound.playMenuHover();
            setActiveTab('explore');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeTab === 'explore'
              ? 'bg-amber-700 text-stone-950 shadow-md font-bold'
              : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>1. Search Rooms ({gameState.discoveredClues.length}/{CLUES.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playMenuHover();
            setActiveTab('guardian');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeTab === 'guardian'
              ? 'bg-amber-700 text-stone-950 shadow-md font-bold'
              : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>2. Guardian Paired Truths</span>
        </button>

        <button
          onClick={() => {
            sound.playMenuHover();
            setActiveTab('riddles');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeTab === 'riddles'
              ? 'bg-amber-700 text-stone-950 shadow-md font-bold'
              : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>3. Mama May Whispers</span>
        </button>

        <button
          onClick={() => {
            sound.playMenuHover();
            setActiveTab('case_notes');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeTab === 'case_notes'
              ? 'bg-amber-700 text-stone-950 shadow-md font-bold'
              : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>4. Case Evidence Matrix</span>
        </button>

        <button
          onClick={() => {
            sound.playMenuHover();
            setActiveTab('confront');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeTab === 'confront'
              ? 'bg-rose-700 text-stone-100 shadow-md font-bold ring-1 ring-rose-400'
              : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>5. Final Accusation &amp; Rite</span>
        </button>
      </div>

      {/* 4. Tab Content Panels */}
      <div className="flex-1">
        {/* TAB 1: EXPLORE ROOMS */}
        {activeTab === 'explore' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Location Selection List */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold mb-2">
                1998 Hostel Wing Locations:
              </div>
              {LOCATIONS.map((loc) => {
                const isSelected = selectedLocationId === loc.id;
                const cluesInRoom = CLUES.filter((c) => c.locationId === loc.id);
                const foundInRoom = cluesInRoom.filter((c) =>
                  gameState.discoveredClues.includes(c.id)
                );

                return (
                  <div
                    key={loc.id}
                    onClick={() => {
                      setSelectedLocationId(loc.id);
                      sound.playMenuHover();
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/50 border-amber-500 shadow-lg ring-1 ring-amber-500/50'
                        : 'bg-stone-950/80 border-stone-800/80 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-serif font-bold text-stone-100">
                        {loc.name}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-900 border border-stone-700 text-stone-400">
                        {loc.turnCost} turns
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 line-clamp-2 mb-2">
                      {loc.description}
                    </p>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-amber-500">
                        Clues: {foundInRoom.length}/{cluesInRoom.length} found
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExplore(loc.id);
                        }}
                        className="px-2.5 py-1 rounded bg-amber-700 hover:bg-amber-600 text-stone-950 font-bold text-[10px] uppercase font-mono"
                      >
                        SEARCH ROOM
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Selected Location Detail & Found Evidence */}
            <div className="lg:col-span-2 space-y-5">
              {(() => {
                const currentLoc =
                  LOCATIONS.find((l) => l.id === selectedLocationId) || LOCATIONS[0];
                const roomClues = CLUES.filter((c) => c.locationId === currentLoc.id);

                return (
                  <div className="bg-stone-950/90 border border-stone-800 rounded-xl p-6 shadow-xl space-y-6">
                    <div className="border-b border-stone-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] font-mono uppercase text-amber-500 font-semibold">
                          Active Investigation Sector
                        </div>
                        <h3 className="text-xl font-serif font-bold text-stone-100">
                          {currentLoc.name}
                        </h3>
                        <p className="text-xs text-stone-400 mt-1">
                          {currentLoc.description}
                        </p>
                      </div>

                      <button
                        onClick={() => handleExplore(currentLoc.id)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-stone-950 font-mono text-xs font-bold uppercase transition-all shadow-md shrink-0"
                      >
                        <Search className="w-4 h-4" />
                        <span>Search Sector ({currentLoc.turnCost} Turns)</span>
                      </button>
                    </div>

                    {/* Clues Discovered in this room */}
                    <div className="space-y-3">
                      <div className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold">
                        Recovered Clues &amp; Artifacts:
                      </div>

                      {roomClues.map((clue) => {
                        const isDiscovered = gameState.discoveredClues.includes(clue.id);

                        if (!isDiscovered) {
                          return (
                            <div
                              key={clue.id}
                              className="p-4 rounded-lg bg-stone-900/40 border border-dashed border-stone-800 text-stone-400 text-xs font-mono flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-stone-400" />
                                <span>Unsearched artifact / concealed physical evidence</span>
                              </div>
                              <span className="text-[10px] text-amber-500">Requires Search</span>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={clue.id}
                            className="p-4 rounded-lg bg-stone-900/80 border border-amber-700/60 shadow-md space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Scroll className="w-4 h-4 text-amber-400" />
                                <h5 className="text-sm font-serif font-bold text-amber-200">
                                  {clue.title}
                                </h5>
                              </div>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300">
                                EVIDENCE VERIFIED
                              </span>
                            </div>

                            <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed italic bg-black/40 p-3 rounded border border-stone-800">
                              "{clue.details}"
                            </p>

                            {/* Special Interactive Caesar Cipher for Caretaker lockbox */}
                            {clue.isCipher && (
                              <div className="mt-3 pt-3 border-t border-stone-800 space-y-2">
                                <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                                  <span className="font-bold flex items-center gap-1.5">
                                    <Key className="w-3.5 h-3.5" />
                                    Interactive Shift Cipher Tool:
                                  </span>
                                  <span>Shift: +{caesarShift}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="range"
                                    min="0"
                                    max="25"
                                    value={caesarShift}
                                    onChange={(e) => setCaesarShift(parseInt(e.target.value))}
                                    className="flex-1 accent-amber-500"
                                  />
                                  <button
                                    onClick={() => setCaesarShift(3)}
                                    className="text-[10px] font-mono px-2 py-1 bg-stone-800 hover:bg-stone-700 rounded text-amber-300"
                                  >
                                    Solve (Shift 3)
                                  </button>
                                </div>
                                <div className="p-2.5 rounded bg-black/60 font-mono text-xs text-amber-300 border border-amber-900/60">
                                  Decoded preview:{' '}
                                  {getShiftedText(
                                    'VHFUHW: 5000 NBDWV SDLG WR VHDO WKH GULHG ZHOO DQG EXUB WKH ERGB',
                                    caesarShift
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* TAB 2: GUARDIAN PAIRED TRUTHS */}
        {activeTab === 'guardian' && (
          <div className="bg-stone-950/90 border border-stone-800 rounded-xl p-6 shadow-xl space-y-6">
            <div className="border-b border-stone-800 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-500 font-semibold">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Hostel Guardian Nat • Paired Truth Discernment</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-100 mt-1">
                Commune with the Ancient Spirit
              </h3>
              <p className="text-xs text-stone-400 mt-1 max-w-2xl">
                The Guardian Nat speaks in pairs of statements. Exactly ONE is the truth; ONE is a deceitful trap. Compare his words against your discovered physical evidence to choose which statement to trust.
              </p>
            </div>

            <div className="space-y-5">
              {GUARDIAN_PAIRS.map((pair) => {
                const userChoice = gameState.deducedChoices[pair.id];
                const isTrusted = gameState.trustedFacts[pair.id];
                const isUnverified = gameState.usedUnverifiedClaims[pair.id];

                return (
                  <div
                    key={pair.id}
                    className="p-5 rounded-xl bg-stone-900/70 border border-stone-800 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        GUARDIAN TEST PAIR #{pair.id}
                      </span>
                      {userChoice && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            userChoice === pair.trueIndex
                              ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                              : 'bg-rose-950 border-rose-600 text-rose-300'
                          }`}
                        >
                          {userChoice === pair.trueIndex
                            ? 'TRUTH DISCERNING'
                            : 'DECEIVED BY FALSE CLAIM'}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Statement A */}
                      <button
                        onClick={() => handleGuardianChoice(pair.id, 1)}
                        className={`p-4 rounded-lg border text-left transition-all relative ${
                          userChoice === 1
                            ? userChoice === pair.trueIndex
                              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-100 shadow-md'
                              : 'bg-rose-950/60 border-rose-500 text-rose-100 shadow-md'
                            : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-amber-500/80 hover:bg-amber-950/30'
                        }`}
                      >
                        <div className="text-[10px] font-mono text-stone-400 mb-1">
                          STATEMENT A:
                        </div>
                        <p className="text-xs sm:text-sm font-serif italic">
                          "{pair.statementA}"
                        </p>
                      </button>

                      {/* Statement B */}
                      <button
                        onClick={() => handleGuardianChoice(pair.id, 2)}
                        className={`p-4 rounded-lg border text-left transition-all relative ${
                          userChoice === 2
                            ? userChoice === pair.trueIndex
                              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-100 shadow-md'
                              : 'bg-rose-950/60 border-rose-500 text-rose-100 shadow-md'
                            : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-amber-500/80 hover:bg-amber-950/30'
                        }`}
                      >
                        <div className="text-[10px] font-mono text-stone-400 mb-1">
                          STATEMENT B:
                        </div>
                        <p className="text-xs sm:text-sm font-serif italic">
                          "{pair.statementB}"
                        </p>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: MAMA MAY RIDDLES */}
        {activeTab === 'riddles' && (
          <div className="bg-stone-950/90 border border-stone-800 rounded-xl p-6 shadow-xl space-y-6">
            <div className="border-b border-stone-800 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-rose-400 font-semibold">
                <MessageSquare className="w-4 h-4 text-rose-400" />
                <span>Mama May's Spirit Whispers • Symbolic Riddle Decoding</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-100 mt-1">
                Listen to the Victim's Memory
              </h3>
              <p className="text-xs text-stone-400 mt-1 max-w-2xl">
                Mama May cannot lie, but her trauma forces her memories into symbolic riddles. Decode each memory into factual evidence.
              </p>
            </div>

            <div className="space-y-6">
              {VICTIM_RIDDLES.map((riddle) => {
                const userChoice = gameState.decodeChoices[riddle.topic];
                const isCorrect = userChoice === riddle.trueMeaning;

                return (
                  <div
                    key={riddle.topic}
                    className="p-5 rounded-xl bg-stone-900/70 border border-stone-800 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                        TOPIC: {riddle.title}
                      </span>
                      {userChoice && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            isCorrect
                              ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                              : 'bg-rose-950 border-rose-600 text-rose-300'
                          }`}
                        >
                          {isCorrect ? 'ACCURATELY DECODED' : 'MISREAD SPIRIT RIDDLE'}
                        </span>
                      )}
                    </div>

                    <div className="p-3.5 rounded-lg bg-black/60 border border-amber-900/40 text-amber-200/90 font-serif italic text-sm">
                      "{riddle.symbolicText}"
                    </div>

                    <div className="space-y-2">
                      <div className="text-[11px] font-mono text-stone-400">
                        Choose factual interpretation:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {riddle.options.map((opt) => {
                          const isSelected = userChoice === opt.meaningKey;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleRiddleDecode(riddle.topic, opt.meaningKey)}
                              className={`p-3 rounded-lg border text-left text-xs transition-all ${
                                isSelected
                                  ? opt.meaningKey === riddle.trueMeaning
                                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-100 font-semibold'
                                    : 'bg-rose-950/70 border-rose-500 text-rose-100 font-semibold'
                                  : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-amber-500/80'
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: CASE NOTES & EVIDENCE MATRIX */}
        {activeTab === 'case_notes' && (
          <div className="bg-stone-950/90 border border-stone-800 rounded-xl p-6 shadow-xl space-y-6">
            <div className="border-b border-stone-800 pb-4">
              <h3 className="text-xl font-serif font-bold text-stone-100">
                Hostel 1998 Investigation Case Log
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Cross-reference your discovered physical items with spiritual testimonies to deduce the truth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Discovered Physical Clues */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                  Physical Evidence ({gameState.discoveredClues.length}/{CLUES.length})
                </div>
                {gameState.discoveredClues.length === 0 ? (
                  <div className="p-4 rounded-lg bg-stone-900/50 border border-stone-800 text-stone-400 text-xs font-mono">
                    No physical clues discovered yet. Explore the hostel rooms!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {gameState.discoveredClues.map((clueId) => {
                      const clue = CLUES.find((c) => c.id === clueId);
                      if (!clue) return null;
                      return (
                        <div
                          key={clueId}
                          className="p-3.5 rounded-lg bg-stone-900/80 border border-stone-700/80 space-y-1"
                        >
                          <div className="text-xs font-serif font-bold text-amber-200">
                            {clue.title}
                          </div>
                          <p className="text-xs text-stone-300 italic">"{clue.details}"</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Decoded Facts and Guardian Testimonies */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                  Verified Deduction Facts
                </div>
                <div className="space-y-2">
                  <div className="p-3.5 rounded-lg bg-stone-900/80 border border-stone-700/80 text-xs font-mono space-y-1.5">
                    <div className="text-stone-400">Torn Diary + Pink Silk Longyi:</div>
                    <div className="text-emerald-300">
                      › Ko Zaw detests pink. The stained pink shirt belongs to Sandar, exonerating Ko Zaw.
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-stone-900/80 border border-stone-700/80 text-xs font-mono space-y-1.5">
                    <div className="text-stone-400">Roster Ledger + Hair Riddle:</div>
                    <div className="text-emerald-300">
                      › Sandar braided Mama May's hair. Mama May whispers her killer choked her with hands that braided her hair.
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-stone-900/80 border border-stone-700/80 text-xs font-mono space-y-1.5">
                    <div className="text-stone-400">Caesar Cipher Receipt:</div>
                    <div className="text-emerald-300">
                      › Confirms Sandar paid 5,000 kyats to caretaker to seal Mama May's body in the dried well.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: FINAL ACCUSATION & RITE */}
        {activeTab === 'confront' && (
          <div className="bg-stone-950/90 border border-stone-800 rounded-xl p-6 shadow-xl space-y-6">
            <div className="border-b border-stone-800 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-rose-400 font-semibold">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Nat Pacification Rite &amp; Final Deduction</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-100 mt-1">
                Confront the 1998 Tragedy
              </h3>
              <p className="text-xs text-stone-400 mt-1 max-w-2xl">
                Synthesize all evidence to declare the true murderer, the method of killing, the mortal remains' location, and perform the sacred pacification rite.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Killer Choice */}
              <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 space-y-2">
                <label className="text-xs font-mono uppercase text-amber-400 font-bold block">
                  1. Who was the Killer?
                </label>
                <select
                  value={accusationKiller}
                  onChange={(e) => setAccusationKiller(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs font-mono text-stone-200"
                >
                  <option value="sandar">Sandar (Mama May's Roommate)</option>
                  <option value="ko_zaw">Ko Zaw (Mama May's Boyfriend)</option>
                  <option value="caretaker">Caretaker of 1998 Hostel</option>
                </select>
              </div>

              {/* Cause of Death */}
              <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 space-y-2">
                <label className="text-xs font-mono uppercase text-amber-400 font-bold block">
                  2. True Cause of Death?
                </label>
                <select
                  value={accusationCause}
                  onChange={(e) => setAccusationCause(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs font-mono text-stone-200"
                >
                  <option value="strangled">Strangled by hands that braided her hair</option>
                  <option value="poisoned">Poisoned by datura herbal tea</option>
                  <option value="pushed">Pushed from 4th-floor dormitory balcony</option>
                </select>
              </div>

              {/* Body Location */}
              <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 space-y-2">
                <label className="text-xs font-mono uppercase text-amber-400 font-bold block">
                  3. Where is the Body Concealed?
                </label>
                <select
                  value={accusationLocation}
                  onChange={(e) => setAccusationLocation(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs font-mono text-stone-200"
                >
                  <option value="dried_well">Sealed in dried well behind courtyard shrine</option>
                  <option value="mango_tree">Under roots of ancient courtyard mango tree</option>
                  <option value="room_4b_brick">Behind brickwork of Dormitory Room 4B</option>
                </select>
              </div>
            </div>

            {/* Rite Option */}
            <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono uppercase text-amber-400 font-bold">
                  4. Perform the Nat Pacification Rite?
                </div>
                <div className="text-xs text-stone-400">
                  Light the sacred candles and offer pure jasmine water to pacify the spirit.
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAccusationRite(true)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                    accusationRite
                      ? 'bg-amber-600 text-stone-950 ring-1 ring-amber-400'
                      : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  YES, PERFORM RITE
                </button>
                <button
                  type="button"
                  onClick={() => setAccusationRite(false)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                    !accusationRite
                      ? 'bg-rose-900 text-rose-100 ring-1 ring-rose-400'
                      : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  NO, FLEE IMMEDIATELY
                </button>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="button"
                onClick={handleFinalAccusation}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-stone-950 font-mono text-sm font-bold tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(245,158,11,0.4)]"
              >
                <Flame className="w-5 h-5" />
                <span>SUBMIT ACCUSATION &amp; CONCLUDE PHASE</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Victory / Resolution Modal on Chapter 1 Completion */}
      <AnimatePresence>
        {(victoryModalOpen || (gameState.gameOver && gameState.gameOver !== 'true_rest' && gameState.gameOver !== 'twist_ending')) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="w-full max-w-2xl bg-[#0b1410] border-2 border-amber-500/80 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.4)] text-stone-200 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {gameState.gameOver === 'true_rest' || gameState.gameOver === 'twist_ending' ? (
                /* Chapter 1 Cleared Screen */
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                          CHAPTER 1 SOLVED • DECISIVE TRUTH REVEALED
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-serif font-black text-stone-100">
                          {gameState.gameOver === 'twist_ending'
                            ? 'Bloodline Revelation'
                            : 'Mama May Laid to Rest'}
                        </h3>
                      </div>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500 text-stone-950 font-bold">
                      PHASE 1 COMPLETE
                    </span>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                    <p>
                      You identified <strong>Sandar</strong> as the killer who wore the pink silk blouse, proved Mama May was strangled by her roommate, and pointed the ritual to the sealed dried well.
                    </p>
                    <p className="text-emerald-200/90 font-serif italic bg-emerald-950/40 p-4 rounded-xl border border-emerald-800/40">
                      Mama May's spectral figure sheds a single tear of pure white light. Her 28 years of unrest are severed. The heavy iron locks sealing Chapter 2 in the chronological archives shatter.
                    </p>
                    {gameState.gameOver === 'twist_ending' && (
                      <p className="text-amber-300 text-xs font-mono bg-amber-950/60 p-3 rounded-lg border border-amber-700/60">
                        ★ SECRET CLUE DISCOVERED: The silver locket reveals your 2026 college friend Aye Aye is Aunt Sandar's direct niece.
                      </p>
                    )}
                  </div>

                  {/* Navigation Back to Chapter Select to Witness Unlock */}
                  <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleRestartChapter}
                      className="px-4 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-xs font-mono text-stone-300 transition-colors"
                    >
                      REPLAY CHAPTER 1
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playMenuSelect();
                        navigate('/chapters');
                      }}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-600 border border-amber-400 text-stone-950 font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]"
                    >
                      <span>RETURN TO CHAPTER SHOWCASE</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Failure Screen */
                <div className="space-y-5">
                  <div className="flex items-center gap-3 text-rose-400 border-b border-stone-800 pb-4">
                    <AlertTriangle className="w-8 h-8" />
                    <div>
                      <div className="text-xs font-mono font-bold tracking-widest uppercase">
                        TEMPORAL STRAND DESTABILIZED
                      </div>
                      <h3 className="text-2xl font-serif font-black text-stone-100">
                        Investigation Failed
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {gameState.gameOver && ENDINGS_INFO[gameState.gameOver]?.description}
                  </p>

                  <div className="pt-4 border-t border-stone-800 flex justify-end">
                    <button
                      type="button"
                      onClick={handleRestartChapter}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-900/90 hover:bg-rose-800 border border-rose-600 text-rose-100 font-mono text-xs font-bold uppercase transition-all shadow-lg"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>TRY AGAIN (RESET CHAPTER 1)</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AtmosphericLayout>
  );
};
