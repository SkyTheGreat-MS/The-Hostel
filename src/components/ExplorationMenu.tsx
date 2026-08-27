import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameState } from '../types';
import { useGameProgress } from '../context/GameProgressContext';
import {
  LOCATIONS,
  GUARDIAN_PAIRS,
  VICTIM_RIDDLES,
  CLUES,
  CHARACTERS,
} from '../gameData';
import {
  exploreLocation,
  deduceGuardianPair,
  decodeRiddle,
  resolveEnding,
} from '../prologEngine';
import { InkPortrait } from './InkPortrait';
import { sound } from '../audioEngine';
import { LilyBorder } from './LilyBorder';
import {
  Compass,
  Scroll,
  HelpCircle,
  Flame,
  Skull,
  Shield,
  Clock,
  ChevronRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Unlock,
  Ghost,
  Footprints,
} from 'lucide-react';

interface ExplorationMenuProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onRestart: () => void;
  onOpenPause?: () => void;
}

type SubView =
  | 'overview'
  | 'search_locations'
  | 'examine_clues'
  | 'guardian_nat'
  | 'symbolic_riddles'
  | 'accusation_rite';

export const ExplorationMenu: React.FC<ExplorationMenuProps> = ({
  gameState,
  setGameState,
  onRestart,
}) => {
  const navigate = useNavigate();
  const { completeChapter } = useGameProgress();
  const [subView, setSubView] = useState<SubView>('overview');
  const [showShadowSequence, setShowShadowSequence] = useState<boolean>(false);
  const [showChapter2Card, setShowChapter2Card] = useState<boolean>(false);
  
  // Accusation selection state (Chapter 2)
  const [accusedKiller, setAccusedKiller] = useState<string>('sandar');
  const [accusedCause, setAccusedCause] = useState<string>('strangled');
  const [accusedLocation, setAccusedLocation] = useState<string>('dried_well');
  const [performRite, setPerformRite] = useState<boolean>(true);

  const activeChar = CHARACTERS.find((c) => c.id === gameState.selectedMC) || CHARACTERS[0];
  const isChapter1 = gameState.chapter === 1;

  // When chapter 2 transition happens from exploreLocation
  useEffect(() => {
    if (gameState.chapter === 2 && gameState.shadowEventTriggered && !showChapter2Card) {
      setShowShadowSequence(true);
      sound.playGhostWhisper();
      const timer1 = setTimeout(() => {
        sound.playDramaticSting();
      }, 1200);
      const timer2 = setTimeout(() => {
        setShowShadowSequence(false);
        setShowChapter2Card(true);
        completeChapter(1);
      }, 3200);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [gameState.chapter, gameState.shadowEventTriggered, showChapter2Card, completeChapter]);

  // Hotkey listener for menu choices
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameOver || showShadowSequence || showChapter2Card) return;

      if (subView === 'overview') {
        if (e.key === '1') {
          setSubView('search_locations');
          sound.playPaperRustle();
        } else if (e.key === '2') {
          setSubView('examine_clues');
          sound.playPaperRustle();
        } else if (!isChapter1 && e.key === '3') {
          setSubView('guardian_nat');
          sound.playGhostWhisper();
        } else if (!isChapter1 && e.key === '4') {
          setSubView('symbolic_riddles');
          sound.playGhostWhisper();
        } else if (!isChapter1 && e.key === '5') {
          setSubView('accusation_rite');
          sound.playDramaticSting();
        }
      } else if (e.key === 'Escape') {
        setSubView('overview');
        sound.playPaperRustle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [subView, gameState.gameOver, isChapter1, showShadowSequence, showChapter2Card]);

  // Handler for Location Exploration
  const handleExplore = (locId: string) => {
    sound.playPaperRustle();
    const next = exploreLocation(gameState, locId);
    setGameState(next);
  };

  // Handler for Guardian Nat Deduction (Chapter 2)
  const handleGuardianChoice = (pairId: number, chosenOption: 1 | 2) => {
    sound.playGhostWhisper();
    const next = deduceGuardianPair(gameState, pairId, chosenOption);
    setGameState(next);
  };

  // Handler for Riddle Decoding (Chapter 2)
  const handleRiddleChoice = (topic: 'cause_of_death' | 'killer_identity' | 'body_location', meaningKey: string) => {
    sound.playGhostWhisper();
    const next = decodeRiddle(gameState, topic, meaningKey);
    setGameState(next);
  };

  // Handler for Final Accusation (Chapter 2)
  const handleFinalAccusation = () => {
    sound.playDramaticSting();
    const preparedState: GameState = {
      ...gameState,
      finalAccusation: {
        killer: accusedKiller,
        cause: accusedCause,
        location: accusedLocation,
      },
      ritePerformed: performRite,
    };
    const ending = resolveEnding(preparedState);
    if (ending === 'true_rest') {
      completeChapter(1);
    }
    setGameState({
      ...preparedState,
      gameOver: ending,
    });
  };

  // Shadow Event Dramatic Cutscene
  if (showShadowSequence) {
    return (
      <div className="w-full h-full min-h-[520px] flex items-center justify-center p-6 bg-black relative overflow-hidden select-none animate-fade-in">
        <div className="absolute inset-0 bg-red-950/40 animate-pulse pointer-events-none" />
        <div className="relative z-10 max-w-xl text-center space-y-6">
          <div className="w-28 h-28 mx-auto relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-red-600/30 animate-ping" />
            <Ghost className="w-16 h-16 text-red-500 animate-bounce" />
          </div>
          <div className="space-y-2">
            <div className="inline-block px-3 py-1 bg-red-950 border border-red-700 rounded-full text-xs font-mono text-amber-300 tracking-widest uppercase">
              TEMPORAL RIFT • AUGUST 1998
            </div>
            <h2 className="text-3xl md:text-5xl font-bebas font-black text-amber-100 tracking-wider">
              SHADOW EVENT TRIGGERED
            </h2>
          </div>
          <p className="text-neutral-300 text-sm md:text-base font-sans leading-relaxed italic">
            &ldquo;The air drops below freezing. A glitching silhouette of Mama May flickers violently at the end of the dormitory hallway... She points trembling fingers toward the sealed courtyard before dissolving into cold mist.&rdquo;
          </p>
          <div className="p-3 bg-red-950/80 border border-red-800 rounded-lg text-xs font-mono text-amber-300">
            [CLUE LOGGED: Glitching Spectral Silhouette (glitch_body_glimpse)]
          </div>
        </div>
      </div>
    );
  }

  // Chapter 2 Transition Card
  if (showChapter2Card) {
    return (
      <div className="w-full h-full min-h-[520px] flex items-center justify-center p-6 bg-neutral-950/95 relative overflow-hidden select-none animate-fade-in">
        <LilyBorder className="w-full max-w-2xl bg-red-950/95 border-2 border-red-900 rounded-2xl p-8 shadow-2xl backdrop-blur-md text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-900/60 border border-amber-400 flex items-center justify-center">
            <Unlock className="w-8 h-8 text-amber-300" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/60 border border-red-800 rounded-full text-xs font-mono text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>CHAPTER 1 : BLIND START COMPLETE</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bebas font-black text-amber-100 tracking-wider">
              CHAPTER 2 : THE GUARDIAN&apos;S LABYRINTH
            </h2>
          </div>

          <p className="text-neutral-200 text-xs sm:text-sm font-sans leading-relaxed max-w-lg mx-auto">
            You have survived the initial blind entry into the 1998 hostel and witnessed Mama May&apos;s spectral echo. The shrine guardian nat has awakened, unlocking symbolic riddles, paired truth-deception tests, and the deep investigation mechanics.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              id="continue-to-menu-btn"
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bebas tracking-wider text-lg rounded-xl border border-amber-300 shadow-xl flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              <span>CONTINUE TO MAIN MENU</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              id="showcase-btn"
              onClick={() => navigate('/chapters')}
              className="px-6 py-3 bg-red-900/80 hover:bg-red-800 text-amber-100 font-bebas tracking-wider text-lg rounded-xl border border-red-700 shadow-xl flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              <span>CHAPTER SELECT</span>
            </button>
          </div>
        </LilyBorder>
      </div>
    );
  }

  // Ending Screen Rendering (Chapter 2 Game Over / Win)
  if (gameState.gameOver) {
    const isVictorious = gameState.gameOver === 'true_rest';
    return (
      <div className="w-full h-full min-h-[500px] flex items-center justify-center p-6 bg-neutral-950/90">
        <div className="max-w-2xl w-full bg-red-950/90 border-2 border-red-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-900/60 border border-amber-400 flex items-center justify-center">
            {isVictorious ? (
              <Sparkles className="w-10 h-10 text-amber-300 animate-spin-slow" />
            ) : (
              <Skull className="w-10 h-10 text-red-400 animate-pulse" />
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl font-bebas font-bold text-amber-100 uppercase tracking-widest">
            {isVictorious ? 'True Pacification Achieved' : 'Temporal Labyrinth Collapsed'}
          </h2>

          <p className="text-neutral-200 text-sm md:text-base font-sans leading-relaxed">
            {isVictorious
              ? 'By correctly identifying Sandar as the killer, the manual strangulation cause of death, the dried well burial site, and executing the true Nat pacification rite, Mama May’s sorrow is released. The monsoon rain softens into silence as the 1998 echo fades back to 2026.'
              : `Ending: ${gameState.gameOver}. The temporal anchor failed to withstand the psychological and spiritual dissonance of August 1998.`}
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            {isVictorious && (
              <button
                onClick={() => navigate('/chapters')}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bebas tracking-wider text-base rounded-lg border border-amber-300 shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>RETURN TO CHAPTER SHOWCASE</span>
              </button>
            )}
            <button
              onClick={onRestart}
              className="px-6 py-3 bg-red-800 hover:bg-red-700 text-amber-100 font-bebas tracking-wider text-base rounded-lg border border-amber-400/40 shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isVictorious ? 'REPLAY CHAPTER 1' : 'RETRY INVESTIGATION'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 md:p-6 overflow-hidden">
      {/* Top HUD: Composure, Turns Anchor, Spirit Grief */}
      <div className="w-full bg-red-950/80 border border-red-900/80 rounded-xl p-3 md:p-4 backdrop-blur-md shadow-xl flex flex-wrap items-center justify-between gap-4 z-10">
        {/* Active Investigator Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-12 rounded bg-neutral-900 border border-red-800 overflow-hidden shrink-0">
            <InkPortrait characterId={activeChar.id} size="full" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-red-400">
              Investigator ({activeChar.archetype})
            </div>
            <div className="font-bebas font-bold text-lg text-amber-100 tracking-wider">
              {activeChar.name}
            </div>
          </div>
        </div>

        {/* Meters */}
        <div className="flex items-center gap-4 md:gap-8 text-xs font-mono">
          {/* Turns / Time */}
          <div className="flex items-center gap-2 bg-neutral-900/60 px-3 py-1.5 rounded-lg border border-neutral-800">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <div>
              <span className="text-neutral-400 text-[10px] block">TEMPORAL ANCHOR</span>
              <span className="font-bold text-amber-200">{gameState.timeRemaining} Turns</span>
            </div>
          </div>

          {/* Composure */}
          <div className="flex items-center gap-2 bg-neutral-900/60 px-3 py-1.5 rounded-lg border border-neutral-800">
            <Shield className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-neutral-400 text-[10px] block">COMPOSURE</span>
              <span className="font-bold text-cyan-200">{gameState.playerComposure}% ({gameState.composureState})</span>
            </div>
          </div>

          {/* Chapter Status */}
          <div className="flex items-center gap-2 bg-neutral-900/60 px-3 py-1.5 rounded-lg border border-neutral-800">
            {isChapter1 ? (
              <Footprints className="w-4 h-4 text-amber-400" />
            ) : (
              <Flame className="w-4 h-4 text-red-400 animate-pulse" />
            )}
            <div>
              <span className="text-neutral-400 text-[10px] block">
                {isChapter1 ? 'CH 1 WANDER' : 'SPIRIT GRIEF'}
              </span>
              <span className="font-bold text-amber-300">
                {isChapter1
                  ? `Step ${gameState.explorationCount || 0} / 3`
                  : `${gameState.mamaMayGrief} / 100`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Stage: Graphic Novel Visuals + Active SubView Window */}
      <div className="relative flex-1 my-4 flex items-center justify-center min-h-[300px]">
        {/* Left Spirit Shadow / Character Silhouette */}
        <div className="absolute left-4 bottom-0 hidden lg:block pointer-events-none opacity-80">
          <InkPortrait characterId={activeChar.id} isSpeaking={true} size="lg" />
        </div>

        {/* Right Mama May Spectral Presence */}
        <div className="absolute right-4 bottom-0 hidden lg:block pointer-events-none opacity-80">
          <InkPortrait characterId="mama_may" isSpeaking={true} size="lg" />
        </div>

        {/* SubView Interactive Window */}
        <div className="relative z-10 w-full max-w-3xl bg-neutral-950/90 border border-red-900/90 rounded-2xl p-5 shadow-2xl backdrop-blur-md max-h-[360px] overflow-y-auto">
          {subView === 'overview' && (
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/70 border border-red-900 rounded-full text-xs text-amber-300 uppercase tracking-widest font-mono">
                <span>
                  {isChapter1
                    ? 'CHAPTER 1: BLIND START • AUGUST 1998'
                    : 'CHAPTER 2: THE GUARDIAN’S LABYRINTH • AUGUST 1998'}
                </span>
              </div>
              <h3 className="text-2xl font-bebas font-bold text-amber-100 tracking-wider">
                {isChapter1
                  ? `Explore the 1998 Hostel, ${activeChar.name}`
                  : `What is your next move, ${activeChar.name}?`}
              </h3>
              <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans max-w-xl mx-auto">
                {isChapter1
                  ? `You have awakened in the sealed 1998 dormitory. Wander through the quiet rooms to survey the environment (${gameState.explorationCount || 0}/3 wander actions completed). Something lurks in the peripheral mist.`
                  : 'Mama May’s spirit wanders the corridors of Hostel Pathway 326. Search the rooms, cross-reference documents, commune with the Guardian Nat, and decipher the locked ciphers before the temporal anchor dissolves.'}
              </p>
              <div className="pt-2 text-xs text-neutral-400 font-mono">
                {isChapter1 ? (
                  <span>
                    Press <span className="text-amber-400">[1]</span> to Wander Rooms or <span className="text-amber-400">[2]</span> for Notes.
                  </span>
                ) : (
                  <span>
                    Press numbers <span className="text-amber-400">[1 - 5]</span> or click any action below.
                  </span>
                )}
              </div>
            </div>
          )}

          {/* SubView: Search / Wander Locations */}
          {subView === 'search_locations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-red-900/60 pb-2">
                <h4 className="font-bebas font-bold text-amber-200 flex items-center gap-2 text-lg tracking-wider">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>
                    {isChapter1
                      ? 'Wander Hostel Pathway 326 (Chapter 1 Exploration)'
                      : 'Search Hostel Pathway 326 (1998 Investigation)'}
                  </span>
                </h4>
                <button
                  onClick={() => setSubView('overview')}
                  className="text-xs text-neutral-400 hover:text-amber-200 px-2 py-1 bg-neutral-900 rounded font-mono"
                >
                  Back [ESC]
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {LOCATIONS.map((loc) => {
                  const isExplored = CLUES.some(
                    (c) => c.locationId === loc.id && gameState.discoveredClues.includes(c.id)
                  );
                  return (
                    <div
                      key={loc.id}
                      onClick={() => handleExplore(loc.id)}
                      className="p-3 bg-neutral-900/80 hover:bg-red-950/70 border border-neutral-800 hover:border-red-800 rounded-lg cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-amber-100">
                          <span className="font-bebas tracking-wide text-sm">{loc.name}</span>
                          <span className="text-[10px] text-amber-400 font-mono">
                            {isChapter1 ? '-1 Turn' : `-${loc.turnCost} Turns`}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1 font-sans">{loc.description}</p>
                      </div>
                      <div className="mt-2 text-[10px] font-mono text-right">
                        {isChapter1 ? (
                          <span className="text-amber-400 flex items-center justify-end gap-1">
                            <Footprints className="w-3 h-3" /> Wander Room
                          </span>
                        ) : isExplored ? (
                          <span className="text-emerald-400 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Explored
                          </span>
                        ) : (
                          <span className="text-red-400">Unsearched</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SubView: Examine Clues & Ciphers */}
          {subView === 'examine_clues' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-red-900/60 pb-2">
                <h4 className="font-bebas font-bold text-amber-200 flex items-center gap-2 text-lg tracking-wider">
                  <Scroll className="w-4 h-4 text-amber-400" />
                  <span>
                    {isChapter1
                      ? `Investigator Journal & Clues (${gameState.discoveredClues.length} noted)`
                      : `Discovered Clues & Ciphers (${gameState.discoveredClues.length}/${CLUES.length})`}
                  </span>
                </h4>
                <button
                  onClick={() => setSubView('overview')}
                  className="text-xs text-neutral-400 hover:text-amber-200 px-2 py-1 bg-neutral-900 rounded font-mono"
                >
                  Back [ESC]
                </button>
              </div>

              {gameState.discoveredClues.length === 0 ? (
                <div className="text-center py-6 space-y-2">
                  <p className="text-xs text-neutral-400 italic font-sans">
                    {isChapter1
                      ? 'No supernatural clues logged yet. Wander the dormitory corridors to observe the environment.'
                      : 'No clues discovered yet. Search the dormitory rooms and courtyard to uncover evidence.'}
                  </p>
                  {gameState.historyLog.length > 0 && (
                    <div className="text-left bg-neutral-900/80 border border-neutral-800 rounded p-3 text-[11px] font-mono text-neutral-300 space-y-1">
                      <div className="text-amber-400 font-bold mb-1 font-mono">Observation Log:</div>
                      {gameState.historyLog.slice(-3).map((log, idx) => (
                        <div key={idx} className="text-neutral-400">• {log}</div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {CLUES.filter((c) => gameState.discoveredClues.includes(c.id)).map((clue) => (
                    <div key={clue.id} className="p-3 bg-neutral-900/80 border border-red-950 rounded-lg">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-200">
                        <span className="font-bebas tracking-wide text-sm">{clue.title}</span>
                        {clue.isCipher && (
                          <span className="px-2 py-0.5 bg-amber-950 border border-amber-800 text-[10px] text-amber-300 rounded font-mono">
                            Caesar Cipher
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-300 mt-1 font-sans">{clue.details}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SubViews 3, 4, 5: Chapter 2 ONLY */}
          {!isChapter1 && subView === 'guardian_nat' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-red-900/60 pb-2">
                <h4 className="font-bebas font-bold text-amber-200 flex items-center gap-2 text-lg tracking-wider">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Guardian Nat: Paired Whispers</span>
                </h4>
                <button
                  onClick={() => setSubView('overview')}
                  className="text-xs text-neutral-400 hover:text-amber-200 px-2 py-1 bg-neutral-900 rounded font-mono"
                >
                  Back [ESC]
                </button>
              </div>

              {GUARDIAN_PAIRS.map((pair) => (
                <div key={pair.id} className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-lg space-y-2">
                  <div className="text-xs font-bold text-amber-300 font-mono">
                    Communion #{pair.id}: Discern Truth from Deception
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <button
                      onClick={() => handleGuardianChoice(pair.id, 1)}
                      className={`p-2 rounded text-left text-xs font-sans border transition-all cursor-pointer ${
                        gameState.deducedChoices[pair.id] === 1
                          ? 'bg-red-950 border-amber-400 text-amber-100'
                          : 'bg-neutral-950/80 border-neutral-800 hover:border-red-800 text-neutral-300'
                      }`}
                    >
                      <span className="font-bold text-amber-400 block mb-1 font-mono">Statement A:</span>
                      {pair.statementA}
                    </button>
                    <button
                      onClick={() => handleGuardianChoice(pair.id, 2)}
                      className={`p-2 rounded text-left text-xs font-sans border transition-all cursor-pointer ${
                        gameState.deducedChoices[pair.id] === 2
                          ? 'bg-red-950 border-amber-400 text-amber-100'
                          : 'bg-neutral-950/80 border-neutral-800 hover:border-red-800 text-neutral-300'
                      }`}
                    >
                      <span className="font-bold text-amber-400 block mb-1 font-mono">Statement B:</span>
                      {pair.statementB}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isChapter1 && subView === 'symbolic_riddles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-red-900/60 pb-2">
                <h4 className="font-bebas font-bold text-amber-200 flex items-center gap-2 text-lg tracking-wider">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Mama May&apos;s Symbolic Riddles</span>
                </h4>
                <button
                  onClick={() => setSubView('overview')}
                  className="text-xs text-neutral-400 hover:text-amber-200 px-2 py-1 bg-neutral-900 rounded font-mono"
                >
                  Back [ESC]
                </button>
              </div>

              {VICTIM_RIDDLES.map((riddle) => (
                <div key={riddle.topic} className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-lg space-y-2">
                  <div className="text-xs font-bold text-amber-300 font-mono">{riddle.title}</div>
                  <p className="text-xs italic text-red-300 font-sans">&ldquo;{riddle.symbolicText}&rdquo;</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {riddle.options.map((opt) => (
                      <button
                        key={opt.meaningKey}
                        onClick={() => handleRiddleChoice(riddle.topic, opt.meaningKey)}
                        className={`px-3 py-1.5 rounded text-xs font-sans border transition-all cursor-pointer ${
                          gameState.decodeChoices[riddle.topic] === opt.meaningKey
                            ? 'bg-red-950 border-amber-400 text-amber-100'
                            : 'bg-neutral-950 border-neutral-800 hover:border-red-800 text-neutral-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isChapter1 && subView === 'accusation_rite' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-red-900/60 pb-2">
                <h4 className="font-bebas font-bold text-red-300 flex items-center gap-2 text-lg tracking-wider">
                  <Skull className="w-4 h-4 text-red-500" />
                  <span>Final Accusation &amp; Nat Pacification Rite</span>
                </h4>
                <button
                  onClick={() => setSubView('overview')}
                  className="text-xs text-neutral-400 hover:text-amber-200 px-2 py-1 bg-neutral-900 rounded font-mono"
                >
                  Back [ESC]
                </button>
              </div>

              <div className="space-y-3 font-sans text-xs">
                {/* Killer */}
                <div>
                  <label className="block text-amber-300 font-bold mb-1 font-mono">Accuse the Killer:</label>
                  <select
                    value={accusedKiller}
                    onChange={(e) => setAccusedKiller(e.target.value)}
                    className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded text-neutral-200 font-sans"
                  >
                    <option value="sandar">Sandar (Roommate &amp; Confidante)</option>
                    <option value="ko_zaw">Ko Zaw (Boyfriend)</option>
                    <option value="caretaker">Hostel Caretaker</option>
                  </select>
                </div>

                {/* Cause of Death */}
                <div>
                  <label className="block text-amber-300 font-bold mb-1 font-mono">Cause of Death:</label>
                  <select
                    value={accusedCause}
                    onChange={(e) => setAccusedCause(e.target.value)}
                    className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded text-neutral-200 font-sans"
                  >
                    <option value="strangled">Manual Strangulation</option>
                    <option value="poisoned">Jasmine Tea Datura Poisoning</option>
                    <option value="drowned">Monsoon Reservoir Drowning</option>
                  </select>
                </div>

                {/* Body Location */}
                <div>
                  <label className="block text-amber-300 font-bold mb-1 font-mono">Body Concealment Location:</label>
                  <select
                    value={accusedLocation}
                    onChange={(e) => setAccusedLocation(e.target.value)}
                    className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded text-neutral-200 font-sans"
                  >
                    <option value="dried_well">Old Dried Courtyard Well</option>
                    <option value="mango_tree">Roots of Ancient Courtyard Mango Tree</option>
                    <option value="dorm_floorboard">Ceiling Cavity above Room 4B</option>
                  </select>
                </div>

                {/* Pacification Rite */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="riteCheck"
                    checked={performRite}
                    onChange={(e) => setPerformRite(e.target.checked)}
                    className="w-4 h-4 accent-red-600 rounded"
                  />
                  <label htmlFor="riteCheck" className="text-amber-200 font-sans">
                    Perform True Nat Offering &amp; Pacification Chant (Releases Mama May&apos;s Soul)
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleFinalAccusation}
                  className="w-full py-3 bg-red-800 hover:bg-red-700 border border-red-600 rounded-lg text-amber-100 font-bold font-bebas text-lg tracking-wider cursor-pointer shadow-lg mt-3"
                >
                  SEAL ACCUSATION &amp; CONFRONT SPIRIT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Choice Navigation Controls */}
      <LilyBorder className="w-full bg-red-950/90 border border-red-900/90 rounded-xl p-2.5 backdrop-blur-md shadow-2xl z-10">
        {isChapter1 ? (
          /* Chapter 1 Restricted Navigation: Only Wander & Notes */
          <div className="grid grid-cols-2 gap-3 max-w-xl mx-auto">
            {/* Choice 1: Wander */}
            <button
              id="wander-rooms-btn"
              onClick={() => {
                setSubView('search_locations');
                sound.playPaperRustle();
              }}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                subView === 'search_locations'
                  ? 'bg-red-900 border-amber-400 text-amber-100 shadow-md'
                  : 'bg-neutral-950/80 border-red-900/60 hover:bg-red-950 hover:border-amber-500/60 text-neutral-300'
              }`}
            >
              <div className="text-[10px] font-mono font-bold text-amber-400">[1] WANDER HOSTEL</div>
              <div className="text-base font-bebas font-bold tracking-wider">Search 1998 Corridors</div>
            </button>

            {/* Choice 2: Notes */}
            <button
              id="examine-notes-btn"
              onClick={() => {
                setSubView('examine_clues');
                sound.playPaperRustle();
              }}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                subView === 'examine_clues'
                  ? 'bg-red-900 border-amber-400 text-amber-100 shadow-md'
                  : 'bg-neutral-950/80 border-red-900/60 hover:bg-red-950 hover:border-amber-500/60 text-neutral-300'
              }`}
            >
              <div className="text-[10px] font-mono font-bold text-amber-400">[2] JOURNAL &amp; NOTES</div>
              <div className="text-base font-bebas font-bold tracking-wider">Investigation History</div>
            </button>
          </div>
        ) : (
          /* Chapter 2 Full 5-Choice Navigation */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {/* Choice 1 */}
            <button
              onClick={() => {
                setSubView('search_locations');
                sound.playPaperRustle();
              }}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                subView === 'search_locations'
                  ? 'bg-red-900 border-amber-400 text-amber-100 shadow-md'
                  : 'bg-neutral-950/80 border-red-900/60 hover:bg-red-950 hover:border-amber-500/60 text-neutral-300'
              }`}
            >
              <div className="text-[10px] font-mono font-bold text-amber-400">[1] SEARCH</div>
              <div className="text-sm font-bebas font-bold tracking-wider truncate">Hostel Locations</div>
            </button>

            {/* Choice 2 */}
            <button
              onClick={() => {
                setSubView('examine_clues');
                sound.playPaperRustle();
              }}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                subView === 'examine_clues'
                  ? 'bg-red-900 border-amber-400 text-amber-100 shadow-md'
                  : 'bg-neutral-950/80 border-red-900/60 hover:bg-red-950 hover:border-amber-500/60 text-neutral-300'
              }`}
            >
              <div className="text-[10px] font-mono font-bold text-amber-400">[2] CLUES</div>
              <div className="text-sm font-bebas font-bold tracking-wider truncate">Ciphers &amp; Notes</div>
            </button>

            {/* Choice 3 */}
            <button
              onClick={() => {
                setSubView('guardian_nat');
                sound.playGhostWhisper();
              }}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                subView === 'guardian_nat'
                  ? 'bg-red-900 border-amber-400 text-amber-100 shadow-md'
                  : 'bg-neutral-950/80 border-red-900/60 hover:bg-red-950 hover:border-amber-500/60 text-neutral-300'
              }`}
            >
              <div className="text-[10px] font-mono font-bold text-amber-400">[3] GUARDIAN</div>
              <div className="text-sm font-bebas font-bold tracking-wider truncate">Paired Whispers</div>
            </button>

            {/* Choice 4 */}
            <button
              onClick={() => {
                setSubView('symbolic_riddles');
                sound.playGhostWhisper();
              }}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                subView === 'symbolic_riddles'
                  ? 'bg-red-900 border-amber-400 text-amber-100 shadow-md'
                  : 'bg-neutral-950/80 border-red-900/60 hover:bg-red-950 hover:border-amber-500/60 text-neutral-300'
              }`}
            >
              <div className="text-[10px] font-mono font-bold text-amber-400">[4] RIDDLES</div>
              <div className="text-sm font-bebas font-bold tracking-wider truncate">Spirit Metaphors</div>
            </button>

            {/* Choice 5 */}
            <button
              onClick={() => {
                setSubView('accusation_rite');
                sound.playDramaticSting();
              }}
              className={`col-span-2 sm:col-span-1 p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                subView === 'accusation_rite'
                  ? 'bg-red-900 border-amber-400 text-amber-100 shadow-md'
                  : 'bg-red-950/60 border-red-800 hover:bg-red-900 hover:border-amber-400 text-amber-200'
              }`}
            >
              <div className="text-[10px] font-mono font-bold text-red-400">[5] ACCUSE</div>
              <div className="text-sm font-bebas font-bold tracking-wider truncate">Pacification Rite</div>
            </button>
          </div>
        )}
      </LilyBorder>
    </div>
  );
};
