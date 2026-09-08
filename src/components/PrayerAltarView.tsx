import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../audioEngine';
import { Phase3Location } from '../types';
import { lockChapterOneAndSave } from '../gameStore';
import { Flame, Bell, Sparkles } from 'lucide-react';

export interface PrayerAltarViewProps {
  composure: number;
  setComposure: React.Dispatch<React.SetStateAction<number>>;
  inventory: string[];
  setInventory: React.Dispatch<React.SetStateAction<string[]>>;
  hasBlackCandlesCount: number;
  setHasBlackCandlesCount: React.Dispatch<React.SetStateAction<number>>;
  hasMatchesCount: number;
  setHasMatchesCount: React.Dispatch<React.SetStateAction<number>>;
  hasBronzeBell: boolean;
  setHasBronzeBell: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCharacterId: string;
  setActiveMonologue: (msg: string | null) => void;
  setPhase3Location: (loc: Phase3Location) => void;
  setChapter1Completed: (val: boolean) => void;
  completeChapter: (chap: number) => void;
  setIsChapterTransitionOpen: (val: boolean) => void;
  altarCandlesPlaced?: number;
  setAltarCandlesPlaced?: React.Dispatch<React.SetStateAction<number>>;
  altarBellPlaced?: boolean;
  setAltarBellPlaced?: React.Dispatch<React.SetStateAction<boolean>>;
  natSummoned?: boolean;
  setNatSummoned?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PrayerAltarView: React.FC<PrayerAltarViewProps> = ({
  composure,
  setComposure,
  inventory,
  setInventory,
  hasBlackCandlesCount,
  setHasBlackCandlesCount,
  hasMatchesCount,
  setHasMatchesCount,
  hasBronzeBell,
  setHasBronzeBell,
  selectedCharacterId,
  setActiveMonologue,
  setPhase3Location,
  setChapter1Completed,
  completeChapter,
  setIsChapterTransitionOpen,
  altarCandlesPlaced = 0,
  setAltarCandlesPlaced,
  altarBellPlaced = false,
  setAltarBellPlaced,
  natSummoned = false,
  setNatSummoned,
}) => {
  // State Tracking as specified
  const [candlesPlaced, setCandlesPlaced] = useState<boolean[]>([
    altarCandlesPlaced >= 1,
    altarCandlesPlaced >= 2,
    altarCandlesPlaced >= 3,
  ]);
  const [candlesLit, setCandlesLit] = useState<boolean[]>([false, false, false]);
  const [hasPlacedBell, setHasPlacedBell] = useState<boolean>(Boolean(altarBellPlaced));
  const [failedMatchAttempts, setFailedMatchAttempts] = useState<number>(0);
  const [matchesRemaining, setMatchesRemaining] = useState<number>(
    hasMatchesCount > 0 ? hasMatchesCount : 3
  );
  const [hoveredSocket, setHoveredSocket] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  // Synchronize with parent state
  useEffect(() => {
    const placedCount = candlesPlaced.filter(Boolean).length;
    if (setAltarCandlesPlaced) {
      setAltarCandlesPlaced(placedCount);
    }
  }, [candlesPlaced, setAltarCandlesPlaced]);

  useEffect(() => {
    if (setAltarBellPlaced) {
      setAltarBellPlaced(hasPlacedBell);
    }
  }, [hasPlacedBell, setAltarBellPlaced]);

  // Handle Placing Candle on Spikes 1, 2, or 3
  const handlePlaceCandle = (slot: 1 | 2 | 3) => {
    const idx = slot - 1;
    if (candlesPlaced[idx]) {
      if (candlesLit[idx]) {
        setActiveMonologue("— The black beeswax candle burns steadily with a cold, pale-blue sulfur glow. —");
      } else {
        setActiveMonologue(`— Black candle #${slot} is firmly mounted onto the iron spike, ready to be lit. —`);
      }
      return;
    }

    // Check if player has ritual candle in inventory
    const hasCandle =
      hasBlackCandlesCount > 0 || inventory.includes('black_beeswax_candle');
    if (!hasCandle) {
      sound.playPaperRustle();
      setActiveMonologue("— An iron candle spike. It needs a thick ritual candle. —");
      return;
    }

    // Mount Candle
    sound.playPaperRustle();
    setCandlesPlaced((prev) => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
    setHasBlackCandlesCount((prev) => Math.max(0, prev - 1));
    setActiveMonologue(`— Mounted a thick black beeswax candle onto spike #${slot}. —`);
  };

  // Handle Placing Bell on Pedestal
  const handlePlaceBell = () => {
    if (hasPlacedBell) {
      // If all candles lit, ring the bell
      if (candlesLit.every(Boolean)) {
        handleRingBell();
      } else {
        sound.playPaperRustle();
        setActiveMonologue(
          "— The ceremonial bronze prayer bell rests on its carved pedestal. The candles must be lit before ringing. —"
        );
      }
      return;
    }

    const hasBellItem = hasBronzeBell || inventory.includes('bronze_prayer_bell');
    if (!hasBellItem) {
      sound.playPaperRustle();
      setActiveMonologue("— An empty wooden ring. It was crafted to hold a ceremonial bell. —");
      return;
    }

    sound.playPaperRustle();
    setHasPlacedBell(true);
    setActiveMonologue("— Positioned the ceremonial bronze prayer bell onto the circular wooden stand. —");
  };

  // Match Striking Logic & Composure-Penalty System
  const handleStrikeMatch = () => {
    if (!candlesPlaced.every(Boolean)) {
      setActiveMonologue("I need to mount all three black candles onto the spikes first.");
      return;
    }

    sound.playMatchStrike();
    const isFinalMatch = matchesRemaining === 1;
    const roll = Math.random();
    const failChance = Math.max(0.08, ((100 - composure) / 100) * 0.35);

    if (roll < failChance && !isFinalMatch) {
      // Failed strike (Snap / Fumble)
      const nextFails = failedMatchAttempts + 1;
      setFailedMatchAttempts(nextFails);
      setMatchesRemaining((prev) => Math.max(0, prev - 1));
      setHasMatchesCount((prev) => Math.max(0, prev - 1));

      // Incremental Composure loss per failed attempt
      const composureLoss = nextFails === 1 ? 4 : 8;
      setComposure((c) => Math.max(5, c - composureLoss));

      sound.playMatchSnap();
      setActiveMonologue(
        nextFails === 1
          ? "The match snapped in my trembling fingers! The cold dampness here is thick..."
          : "Another match sputtered out! My hands won't stay steady..."
      );
    } else {
      // Successful strike (or forced catch on match 3)
      if (isFinalMatch && roll < failChance) {
        // Final desperate catch: high mental toll
        setComposure((c) => Math.max(5, c - 14));
        setActiveMonologue("The final match nearly crumbled, but the sulfur finally caught! The flame bites cold...");
      } else {
        setActiveMonologue("The sulfur ignites with a hiss, casting pale blue light across the altar.");
      }

      setMatchesRemaining(0);
      setHasMatchesCount(0);
      setCandlesLit([true, true, true]);
      sound.playCandleIgnite();
    }
  };

  // Ring Bell & Complete Ritual
  const handleRingBell = () => {
    sound.playBellChimeReverb();
    sound.playChime(true);

    // Purge ritual items from inventory
    setInventory((prev) =>
      prev.filter(
        (id) =>
          id !== 'black_beeswax_candle' &&
          id !== 'matchbox_three_stars' &&
          id !== 'bronze_prayer_bell'
      )
    );

    setHasBlackCandlesCount(0);
    setHasMatchesCount(0);
    setHasBronzeBell(false);
    if (setNatSummoned) setNatSummoned(true);
    setChapter1Completed(true);
    completeChapter(1);
    lockChapterOneAndSave(selectedCharacterId, composure);

    setActiveMonologue(
      "— The resonant chime of the bronze bell shivers across the damp masonry... A cold wind sweeps through the hall. The Guardian Nat has awakened. —"
    );

    setTimeout(() => {
      setIsChapterTransitionOpen(true);
    }, 1200);
  };

  const allCandlesReady = candlesPlaced.every(Boolean);
  const allCandlesLit = candlesLit.every(Boolean);
  const ritualReadyToRing = allCandlesLit && hasPlacedBell;

  return (
    <div className="absolute inset-0 z-30 pointer-events-none select-none">
      {/* 1. Dedicated Interactive Sockets (3 Candle Spikes + 1 Bell Stand) */}
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Candle Prong 1 (Left Spike on Bronze Bowl) */}
        <polygon
          id="altar-socket-candle-1"
          points="51.2,46.0 53.8,46.0 54.0,54.0 51.0,54.0"
          className="pointer-events-auto cursor-pointer fill-transparent hover:fill-[#476756]/30 stroke-[#4a7a60]/50 hover:stroke-[#8fa89b] stroke-[0.2] transition-all"
          onMouseEnter={() => {
            sound.playMenuHover();
            setHoveredSocket({
              text: candlesPlaced[0]
                ? candlesLit[0]
                  ? 'Lit Candle #1'
                  : 'Unlit Candle #1'
                : 'Place Black Candle on Spike 1',
              x: 52.5,
              y: 45.0,
            });
          }}
          onMouseLeave={() => setHoveredSocket(null)}
          onClick={() => handlePlaceCandle(1)}
        >
          <title>
            {candlesPlaced[0]
              ? candlesLit[0]
                ? 'Lit Candle #1'
                : 'Unlit Candle #1'
              : 'Place Black Candle on Spike 1'}
          </title>
        </polygon>

        {/* Candle Prong 2 (Center Spike on Bronze Bowl) */}
        <polygon
          id="altar-socket-candle-2"
          points="56.2,46.0 58.8,46.0 59.0,54.0 56.0,54.0"
          className="pointer-events-auto cursor-pointer fill-transparent hover:fill-[#476756]/30 stroke-[#4a7a60]/50 hover:stroke-[#8fa89b] stroke-[0.2] transition-all"
          onMouseEnter={() => {
            sound.playMenuHover();
            setHoveredSocket({
              text: candlesPlaced[1]
                ? candlesLit[1]
                  ? 'Lit Candle #2'
                  : 'Unlit Candle #2'
                : 'Place Black Candle on Spike 2',
              x: 57.5,
              y: 45.0,
            });
          }}
          onMouseLeave={() => setHoveredSocket(null)}
          onClick={() => handlePlaceCandle(2)}
        >
          <title>
            {candlesPlaced[1]
              ? candlesLit[1]
                ? 'Lit Candle #2'
                : 'Unlit Candle #2'
              : 'Place Black Candle on Spike 2'}
          </title>
        </polygon>

        {/* Candle Prong 3 (Right Spike on Bronze Bowl) */}
        <polygon
          id="altar-socket-candle-3"
          points="61.2,46.0 63.8,46.0 64.0,54.0 61.0,54.0"
          className="pointer-events-auto cursor-pointer fill-transparent hover:fill-[#476756]/30 stroke-[#4a7a60]/50 hover:stroke-[#8fa89b] stroke-[0.2] transition-all"
          onMouseEnter={() => {
            sound.playMenuHover();
            setHoveredSocket({
              text: candlesPlaced[2]
                ? candlesLit[2]
                  ? 'Lit Candle #3'
                  : 'Unlit Candle #3'
                : 'Place Black Candle on Spike 3',
              x: 62.5,
              y: 45.0,
            });
          }}
          onMouseLeave={() => setHoveredSocket(null)}
          onClick={() => handlePlaceCandle(3)}
        >
          <title>
            {candlesPlaced[2]
              ? candlesLit[2]
                ? 'Lit Candle #3'
                : 'Unlit Candle #3'
              : 'Place Black Candle on Spike 3'}
          </title>
        </polygon>

        {/* Bell Pedestal (Circular Wooden Stand on Right) */}
        <polygon
          id="altar-socket-bell"
          points="68.0,41.0 80.0,41.0 80.5,65.0 68.0,65.0"
          className="pointer-events-auto cursor-pointer fill-transparent hover:fill-[#476756]/30 stroke-[#4a7a60]/50 hover:stroke-[#8fa89b] stroke-[0.2] transition-all"
          onMouseEnter={() => {
            sound.playMenuHover();
            setHoveredSocket({
              text: hasPlacedBell
                ? allCandlesLit
                  ? '[Ring Ceremonial Bell]'
                  : 'Ceremonial Bronze Bell (Placed)'
                : 'Place Ceremonial Bronze Bell',
              x: 74.0,
              y: 40.0,
            });
          }}
          onMouseLeave={() => setHoveredSocket(null)}
          onClick={handlePlaceBell}
        >
          <title>
            {hasPlacedBell
              ? allCandlesLit
                ? '[Ring Ceremonial Bell]'
                : 'Ceremonial Bronze Bell (Placed)'
              : 'Place Ceremonial Bronze Bell'}
          </title>
        </polygon>

        {/* Visual Representations for Placed Candles */}
        {candlesPlaced[0] && (
          <rect
            x="51.5"
            y="44.0"
            width="2.0"
            height="9.0"
            className="fill-[#1a201c] stroke-[#2c3d33] stroke-[0.2] pointer-events-none"
          />
        )}
        {candlesPlaced[1] && (
          <rect
            x="56.5"
            y="44.0"
            width="2.0"
            height="9.0"
            className="fill-[#1a201c] stroke-[#2c3d33] stroke-[0.2] pointer-events-none"
          />
        )}
        {candlesPlaced[2] && (
          <rect
            x="61.5"
            y="44.0"
            width="2.0"
            height="9.0"
            className="fill-[#1a201c] stroke-[#2c3d33] stroke-[0.2] pointer-events-none"
          />
        )}

        {/* Flickering Pale Blue Flames for Lit Candles */}
        {candlesLit[0] && (
          <circle
            cx="52.5"
            cy="42.5"
            r="1.4"
            className="fill-[#93c5fd] filter drop-shadow-[0_0_6px_rgba(147,197,253,0.9)] animate-pulse pointer-events-none"
          />
        )}
        {candlesLit[1] && (
          <circle
            cx="57.5"
            cy="42.5"
            r="1.4"
            className="fill-[#93c5fd] filter drop-shadow-[0_0_6px_rgba(147,197,253,0.9)] animate-pulse pointer-events-none"
          />
        )}
        {candlesLit[2] && (
          <circle
            cx="62.5"
            cy="42.5"
            r="1.4"
            className="fill-[#93c5fd] filter drop-shadow-[0_0_6px_rgba(147,197,253,0.9)] animate-pulse pointer-events-none"
          />
        )}

        {/* Visual Representation for Placed Bell */}
        {hasPlacedBell && (
          <path
            d="M 71 58 Q 74 46 77 58 Z"
            className="fill-[#453722] stroke-[#78613e] stroke-[0.3] pointer-events-none filter drop-shadow-[0_0_5px_rgba(120,97,62,0.4)]"
          />
        )}
      </svg>

      {/* Floating Dynamic Tooltip Badge */}
      {hoveredSocket && (
        <span
          className="absolute px-2.5 py-1 rounded bg-[#121815]/95 border border-[#2c3d34] text-[10px] font-mono text-[#82a996] whitespace-nowrap pointer-events-none shadow-lg -translate-x-1/2 -translate-y-full mb-2 z-40 transition-all duration-150"
          style={{
            left: `${hoveredSocket.x}%`,
            top: `${hoveredSocket.y}%`,
          }}
        >
          {hoveredSocket.text}
        </span>
      )}

      {/* 2. Interactive Match-Striking Panel (When all 3 candles placed but not yet lit) */}
      <AnimatePresence>
        {allCandlesReady && !allCandlesLit && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="absolute bottom-6 inset-x-0 flex items-center justify-center z-40 pointer-events-none"
          >
            <div className="bg-[#111714]/95 border border-[#2b4034] rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.85)] backdrop-blur-md p-4 flex flex-col sm:flex-row items-center gap-4 pointer-events-auto text-[#c2d6cc]">
              <div className="text-left font-mono">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="text-xs font-bold text-[#8fa89b] uppercase tracking-wider">
                    Ritual Candle Ignition
                  </span>
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5 space-x-3">
                  <span>
                    Matches: <strong className="text-[#6ee7b7]">{matchesRemaining}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Composure: <strong className="text-amber-300">{composure}%</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Fail Chance:{' '}
                    <strong className="text-stone-300">
                      {Math.round(Math.max(0.08, ((100 - composure) / 100) * 0.35) * 100)}%
                    </strong>
                  </span>
                </div>
              </div>

              <button
                onClick={handleStrikeMatch}
                className="px-5 py-2.5 rounded-xl bg-[#22352b] hover:bg-[#2d4639] border border-[#3f5c4c] text-[#d1e3da] font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Flame className="w-4 h-4 fill-amber-500 text-amber-400" />
                <span>Strike Match</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Ring Ceremonial Bell Banner (When all 3 candles lit and bell placed) */}
      <AnimatePresence>
        {ritualReadyToRing && !natSummoned && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="absolute bottom-6 inset-x-0 flex items-center justify-center z-40 pointer-events-none"
          >
            <div className="bg-[#111714]/95 border border-[#3f5c4c] rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.85)] backdrop-blur-md p-4 flex flex-col sm:flex-row items-center gap-4 pointer-events-auto text-[#c2d6cc]">
              <div className="text-left font-mono">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span className="text-xs font-bold text-[#8fa89b] uppercase tracking-wider">
                    Altar Prepared • Pacification Rite
                  </span>
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  The candles burn cold pale-blue. The Guardian Nat awaits the ceremonial chime.
                </div>
              </div>

              <button
                onClick={handleRingBell}
                className="px-5 py-2.5 rounded-xl bg-[#2a4536] hover:bg-[#365946] border border-[#4e7960] text-[#e0ede6] font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-lg flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Bell className="w-4 h-4 fill-current text-amber-300" />
                <span>Ring Ceremonial Bell</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrayerAltarView;