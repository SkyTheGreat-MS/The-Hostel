import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../audioEngine';
import { Phase3Location } from '../types';
import { Flame, Bell, Sparkles } from 'lucide-react';
import { NatDialogueView } from './NatDialogueView';

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
  selectedCharacterId?: string;
  activeMonologue?: string | null;
  setActiveMonologue: (msg: string | null) => void;
  setPhase3Location: (loc: Phase3Location) => void;
  setChapter1Completed?: (val: boolean) => void;
  completeChapter?: (chap: number) => void;
  setIsChapterTransitionOpen?: (val: boolean) => void;
  setShowChapterTransitionModal?: (val: boolean) => void;
  altarCandlesPlaced?: number;
  setAltarCandlesPlaced?: React.Dispatch<React.SetStateAction<number>>;
  altarBellPlaced?: boolean;
  setAltarBellPlaced?: React.Dispatch<React.SetStateAction<boolean>>;
  natSummoned?: boolean;
  setNatSummoned?: React.Dispatch<React.SetStateAction<boolean>>;
  triggerNatManifestationSequence?: () => void;
  hasConsultedNat?: boolean;
  setHasConsultedNat?: React.Dispatch<React.SetStateAction<boolean>>;
  addDiscoveredClue?: (clueId: string) => void;
  discoveredClues?: string[];
  setDiscoveredClues?: React.Dispatch<React.SetStateAction<string[]>>;
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
  activeMonologue,
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
  hasConsultedNat = false,
  setHasConsultedNat,
  addDiscoveredClue,
  discoveredClues = [],
  setDiscoveredClues,
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

  // Guardian Nat Manifestation State
  const [isNatManifested, setIsNatManifested] = useState<boolean>(Boolean(natSummoned));
  const [natAppearing, setNatAppearing] = useState<boolean>(false);
  const [isRoomDimmed, setIsRoomDimmed] = useState<boolean>(false);
  const [isNatDialogueOpen, setIsNatDialogueOpen] = useState<boolean>(false);
  const [dialogueState, setDialogueState] = useState<{
    speaker: string;
    line: string;
    active: boolean;
  }>({
    speaker: 'Hostel Guardian Nat',
    line: 'Mortals who tread the forgotten halls of 1998... You have lit the sacred tallow and struck the bronze. Speak your truth, or be lost to her wrath.',
    active: false,
  });

  // Conclude Nat Audience and Return to East Fork
  const handleConcludeNatAudience = () => {
    setIsNatDialogueOpen(false);
    if (setHasConsultedNat) {
      setHasConsultedNat(true);
    }
    setPhase3Location('east_fork');
    setActiveMonologue(
      "— The Guardian Nat fades into the incense smoke. I hold her truths and deceit alike in mind. The East Fork corridor awaits. —"
    );
  };

  // Keep state synchronized with parent if natSummoned is true
  useEffect(() => {
    if (natSummoned) {
      setIsNatManifested(true);
      setCandlesPlaced([true, true, true]);
      setCandlesLit([true, true, true]);
      setHasPlacedBell(true);
    }
  }, [natSummoned]);

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
  const handlePlaceCandle = (spikeIndex: number) => {
    if (natSummoned || isNatManifested) {
      sound.playGhostWhisper();
      setActiveMonologue("— The black beeswax candles burn with steady pale-blue sulfur flames, sustaining the Guardian Nat's presence. —");
      return;
    }

    // spikeIndex: 0, 1, or 2 (for Left, Center, Right)
    if (candlesPlaced[spikeIndex]) {
      setActiveMonologue(
        candlesLit[spikeIndex]
          ? "The tallow flame burns cold and steady."
          : "A black beeswax candle is already mounted here."
      );
      return;
    }

    // Check how many candles are currently held in inventory
    const heldCandles = inventory.filter((id) => id === 'black_beeswax_candle').length;

    if (heldCandles <= 0) {
      sound.playError();
      setActiveMonologue(
        "— An iron candle spike. I have no more ritual candles to mount. The altar still needs more tallow. —"
      );
      return;
    }

    // 1. Mount candle on the targeted spike
    sound.playWoodTap();
    setCandlesPlaced((prev) => {
      const updated = [...prev];
      updated[spikeIndex] = true;
      return updated;
    });

    // 2. Consume EXACTLY ONE candle from inventory
    setInventory((prev) => {
      const firstIndex = prev.indexOf('black_beeswax_candle');
      if (firstIndex === -1) return prev;
      const nextInv = [...prev];
      nextInv.splice(firstIndex, 1);
      return nextInv;
    });

    // 3. Decrement available candle counter
    setHasBlackCandlesCount((prev) => Math.max(0, prev - 1));

    setActiveMonologue(`Mounted a thick black beeswax candle onto Spike #${spikeIndex + 1}.`);
  };

  // Handle Placing Bell on Pedestal
  const handlePlaceBell = () => {
    if (natSummoned || isNatManifested) {
      sound.playGhostWhisper();
      setDialogueState({
        speaker: 'Hostel Guardian Nat',
        line: 'Mortals who tread the forgotten halls of 1998... You have lit the sacred tallow and struck the bronze. Speak your truth, or be lost to her wrath.',
        active: true,
      });
      return;
    }

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
    if (candlesPlaced.filter(Boolean).length < 3) {
      sound.playError();
      setActiveMonologue("— The rite is incomplete. Three pillars of wax must stand before the fire can be struck. —");
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

  // Trigger Nat appearance sequence (DO NOT complete Chapter 1 here)
  const triggerNatManifestationSequence = () => {
    sound.playChime(true);
    sound.playGhostWhisper();
    setActiveMonologue(
      "— The resonant chime of the bronze bell shivers across the damp masonry... A cold wind sweeps through the hall. The Guardian Nat has awakened. —"
    );
  };

  // Ring Bell & Complete Ritual
  const handleRingBell = () => {
    if (!candlesLit.every(Boolean) || !hasPlacedBell) return;

    if (natSummoned || isNatManifested) {
      sound.playGhostWhisper();
      setDialogueState({
        speaker: 'Hostel Guardian Nat',
        line: 'Mortals who tread the forgotten halls of 1998... You have lit the sacred tallow and struck the bronze. Speak your truth, or be lost to her wrath.',
        active: true,
      });
      return;
    }

    // 1. Play deep ceremonial resonance sound
    sound.playBellChimeReverb();

    // 2. Consume ritual items from active inventory
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

    // 3. Dim the room lights momentarily
    setIsRoomDimmed(true);

    // 4. Staged appearance
    setTimeout(() => {
      setNatAppearing(true);
      setIsNatManifested(true);

      // Mark Nat summoned in parent state
      if (setNatSummoned) {
        setNatSummoned(true);
      }

      // Fade in completely over 1 second
      setTimeout(() => {
        setNatAppearing(false);
        setIsRoomDimmed(false);
        sound.playSpiritManifestHiss(); // Soft airy chime / spirit whisper

        // 5. Open Nat Interrogation Dialogue View
        setIsNatDialogueOpen(true);
      }, 400);
    }, 600);
  };

  const allCandlesReady = candlesPlaced.every(Boolean);
  const allCandlesLit = candlesLit.every(Boolean);
  const ritualReadyToRing = allCandlesLit && hasPlacedBell;
  const litCount = candlesLit.filter(Boolean).length;
  const failRate = Math.max(0.08, ((100 - composure) / 100) * 0.35);
  const failRateDisplay = Math.round(failRate * 100);

  return (
    <div className="absolute inset-0 z-30 pointer-events-none select-none">
      {/* Subtle Floating Bobbing Keyframes */}
      <style>{`
        @keyframes natHover {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(-8px);
          }
        }
      `}</style>

      {/* Room Dimming Transition Overlay */}
      <div
        className={`absolute inset-0 bg-black/75 pointer-events-none transition-opacity duration-700 z-10 ${
          isRoomDimmed ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Guardian Nat Manifestation Sprite & Ethereal Backlight Layer (Unmounts when NatDialogueView is open) */}
      {isNatManifested && !isNatDialogueOpen && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-all duration-1000 ease-out">
          {/* Ambient Spirit Backlight Glow */}
          <div className="absolute w-72 h-96 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />

          {/* Guardian Nat Sprite */}
          <img
            src="/assets/characters/guardian_nat_neutral.png"
            alt="Hostel Guardian Nat"
            className={`
              h-[75%] max-h-[580px] w-auto object-contain
              filter drop-shadow-[0_0_18px_rgba(74,122,96,0.45)]
              contrast-95 brightness-90
              transition-all duration-1000 ease-in-out
              ${natAppearing ? 'opacity-0 translate-y-4 scale-95 blur-sm' : 'opacity-90 translate-y-0 scale-100 blur-0'}
            `}
            style={{
              // Subtle floating bobbing animation
              animation: 'natHover 4s ease-in-out infinite alternate',
            }}
          />

          {/* Ground Swirling Mist Layer */}
          <div className="absolute bottom-10 w-full h-32 bg-gradient-to-t from-[#0e1612]/80 via-[#1b2b23]/30 to-transparent pointer-events-none" />
        </div>
      )}

      {/* 1. Dedicated Interactive Sockets (3 Candle Spikes + 1 Bell Stand) */}
      <svg className="w-full h-full relative z-30 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
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
          onClick={() => handlePlaceCandle(0)}
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
          onClick={() => handlePlaceCandle(1)}
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
          onClick={() => handlePlaceCandle(2)}
        >
          <title>
            {candlesPlaced[2]
              ? candlesLit[2]
                ? 'Lit Candle #3'
                : 'Unlit Candle #3'
              : 'Place Black Candle on Spike 3'}
          </title>
        </polygon>

        {/* Ceremonial Altar Offering Bowl */}
        <polygon
          id="altar-socket-bowl"
          points="50.0,54.0 65.0,54.0 63.5,63.0 51.5,63.0"
          className="pointer-events-auto cursor-pointer fill-transparent hover:fill-[#476756]/20 stroke-[#4a7a60]/30 hover:stroke-[#8fa89b] stroke-[0.2] transition-all"
          onMouseEnter={() => {
            sound.playMenuHover();
            setHoveredSocket({
              text: 'Guardian Nat Altar Bowl',
              x: 57.5,
              y: 53.5,
            });
          }}
          onMouseLeave={() => setHoveredSocket(null)}
          onClick={() => {
            if (candlesPlaced.filter(Boolean).length < 3) {
              sound.playError();
              setActiveMonologue("— The rite is incomplete. Three pillars of wax must stand before the fire can be struck. —");
            } else if (!candlesLit.every(Boolean)) {
              if (inventory.includes('matchbox_three_stars')) {
                setActiveMonologue("— Three black beeswax candles stand ready on the altar spikes. Use the safety matches to strike the fire. —");
              } else {
                setActiveMonologue("— Three black beeswax candles stand ready, but I need matches to strike the flame. —");
              }
            } else {
              setActiveMonologue("— The three candles burn cold and steady with pale blue sulfur light. —");
            }
          }}
        >
          <title>Guardian Nat Altar Bowl</title>
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
      </svg>

      {/* 3 Altar Candles with Animated Flames */}
      <div className="absolute inset-0 pointer-events-none z-25">
        {candlesPlaced.map((isPlaced, index) => {
          if (!isPlaced) return null;

          // Positioning offsets matching the 3 bowl prongs: Left (52.2%), Center (57.2%), Right (62.2%)
          const leftOffsets = ['52.2%', '57.2%', '62.2%'];
          const isLit = candlesLit[index];

          return (
            <div
              key={`candle-rendered-${index}`}
              className="absolute -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-500"
              style={{ left: leftOffsets[index], top: '44.5%' }}
            >
              {/* Animated Pale Blue/Gold Flame */}
              {isLit && (
                <div className="relative -mb-1 flex items-center justify-center animate-pulse">
                  {/* Outer flame glow */}
                  <div className="absolute w-6 h-6 rounded-full bg-cyan-400/20 blur-sm" />
                  {/* Inner flame teardrop */}
                  <div className="w-2 h-4 rounded-full bg-gradient-to-t from-amber-400 via-yellow-200 to-cyan-100 shadow-[0_0_8px_rgba(100,220,255,0.8)] animate-bounce" />
                </div>
              )}

              {/* Black Beeswax Candle Body */}
              <div className="w-2.5 h-11 bg-gradient-to-r from-[#1c1c1b] via-[#2c2e2c] to-[#141514] rounded-t-sm shadow-md border-t border-white/10 relative">
                {/* Wick */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-neutral-900" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Scaled Ceremonial Bronze Hand-Bell */}
      {hasPlacedBell && (
        <div
          className="absolute pointer-events-none z-25 -translate-x-1/2 transition-all duration-700 ease-out"
          style={{ left: '73.8%', top: '45.0%' }}
        >
          {/* Bell Silhouette / SVG Render */}
          <div className="relative flex flex-col items-center">
            {/* Top Ornamental Finial / Handle */}
            <div className="w-1.5 h-4 bg-gradient-to-r from-[#5a482b] via-[#8c7447] to-[#473921] rounded-t" />
            <div className="w-3 h-1 bg-[#8c7447] rounded-sm" />
            
            {/* Bell Body Flaring Downward */}
            <div
              className="w-8 h-10 bg-gradient-to-r from-[#3d311d] via-[#7d663d] to-[#302616] rounded-t-xl border-t border-amber-300/30 shadow-lg relative flex items-end justify-center"
              style={{
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 90%, 90% 100%, 10% 100%, 0% 90%)',
              }}
            >
              {/* Etched Spirit Runes / Highlight */}
              <div className="w-6 h-0.5 mb-2 bg-[#a38652]/60 rounded-full" />
              {/* Clapper tip slightly visible */}
              <div className="w-1.5 h-1.5 rounded-full bg-[#1c1409] -mb-1" />
            </div>

            {/* Bell Drop Shadow on Stand */}
            <div className="w-10 h-2 bg-black/50 blur-[2px] rounded-full mt-0.5" />
          </div>
        </div>
      )}

      {/* Interactive Ring Bell Trigger */}
      {hasPlacedBell && candlesLit.every(Boolean) && (
        <button
          onClick={handleRingBell}
          onMouseEnter={() => {
            sound.playMenuHover();
            setHoveredSocket({
              text: '[Ring Ceremonial Bell]',
              x: 74.0,
              y: 40.0,
            });
          }}
          onMouseLeave={() => setHoveredSocket(null)}
          title="Ring Ceremonial Bronze Bell"
          className="absolute z-30 cursor-pointer pointer-events-auto group"
          style={{ left: '68.0%', top: '42.0%', width: '12%', height: '24%' }}
        >
          <span className="sr-only">Ring Bronze Bell</span>
          {/* Subtle pulsing highlight around the bell */}
          <div className="w-full h-full rounded-full group-hover:bg-amber-400/10 border border-transparent group-hover:border-amber-300/30 transition-all duration-300" />
        </button>
      )}

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

      {/* 2. SPLIT BOTTOM HUD: Left Dock (Minigame / Ritual Actions), Right Dock (Inner Monologue) */}
      {!isNatDialogueOpen && !dialogueState.active && (
        <div className="absolute bottom-4 inset-x-4 z-40 flex items-end justify-between gap-6 pointer-events-none">
          {/* LEFT DOCK: Match-Striking Minigame Card / Ritual Action Banners */}
          <div className="w-full max-w-sm pointer-events-auto">
            <AnimatePresence mode="wait">
              {/* Only render ignition panel when all 3 spikes actually have candles mounted AND matches exist */}
              {candlesPlaced.filter(Boolean).length === 3 &&
                !candlesLit.every(Boolean) &&
                inventory.includes('matchbox_three_stars') && (
                <motion.div
                  key="match-striking-card"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className="p-3 rounded-xl bg-[#0f1713]/90 border border-[#273830] backdrop-blur-md shadow-2xl space-y-2 pointer-events-auto"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono tracking-wider text-[#8fa89b] uppercase">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      Ritual Ignition
                    </span>
                    <span className="text-[#6ee7b7] font-semibold">
                      {matchesRemaining} Matches Left
                    </span>
                  </div>

                  {/* Fail rate & composure stat bar */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 bg-black/40 px-2 py-1 rounded">
                    <span>
                      Composure: <strong className="text-amber-300">{composure}%</strong>
                    </span>
                    <span>
                      Fail Chance: <strong className="text-stone-300">{failRateDisplay}%</strong>
                    </span>
                  </div>

                  <button
                    onClick={handleStrikeMatch}
                    className="w-full py-2 px-3 rounded-lg bg-[#22352b] hover:bg-[#2d4639] border border-[#3f5c4c] text-[#d1e3da] font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 hover:scale-[1.02]"
                  >
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-400" />
                    <span>Strike Match ({litCount}/3 Lit)</span>
                  </button>
                </motion.div>
              )}

              {/* Altar Prepared • Pacification Rite (When ready to ring bell) */}
              {ritualReadyToRing && !natSummoned && !isNatManifested && (
                <motion.div
                  key="bell-ready-card"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className="p-3 rounded-xl bg-[#0f1713]/90 border border-[#3f5c4c] backdrop-blur-md shadow-2xl space-y-2 text-[#c2d6cc]"
                >
                  <div className="flex items-center gap-2 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                    <span className="text-[11px] font-bold text-[#8fa89b] uppercase tracking-wider">
                      Altar Prepared • Pacification Rite
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-400 leading-snug">
                    The candles burn cold pale-blue. Strike the bronze bell to invoke the Guardian Nat.
                  </div>
                  <button
                    onClick={handleRingBell}
                    className="w-full py-2 px-3 rounded-lg bg-[#2a4536] hover:bg-[#365946] border border-[#4e7960] text-[#e0ede6] font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 hover:scale-[1.02]"
                  >
                    <Bell className="w-3.5 h-3.5 fill-current text-amber-300" />
                    <span>Ring Ceremonial Bell</span>
                  </button>
                </motion.div>
              )}

              {/* Guardian Nat Awakened Banner (When Nat is awakened and dialogue is closed) */}
              {(natSummoned || isNatManifested) && !isNatDialogueOpen && (
                <motion.div
                  key="nat-awakened-card"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className="p-3 rounded-xl bg-[#0f1713]/90 border border-[#3f5c4c] backdrop-blur-md shadow-2xl space-y-2 text-[#c2d6cc]"
                >
                  <div className="flex items-center gap-2 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-[#6ee7b7] animate-spin" />
                    <span className="text-[11px] font-bold text-[#8fa89b] uppercase tracking-wider">
                      Guardian Nat Awakened
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-400 leading-snug">
                    The cold sulfur flames burn steadily. Guardian Nat is manifest. Return to corridor and inspect the Caretaker's office.
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        sound.playGhostWhisper();
                        setIsNatDialogueOpen(true);
                      }}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-[#1a2b22] hover:bg-[#253d30] border border-[#3f5c4c] text-[#a8cdb9] font-mono text-[11px] font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer hover:scale-[1.02] active:scale-95"
                    >
                      <span>Hear Nat</span>
                    </button>
                    <button
                      onClick={() => {
                        sound.playMenuSelect();
                        setPhase3Location('prayer_room_main');
                      }}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-[#22352b] hover:bg-[#2d4639] border border-[#3f5c4c] text-[#d1e3da] font-mono text-[11px] font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer hover:scale-[1.02] active:scale-95"
                    >
                      <span>Return</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT DOCK: Thought Box */}
          <div className="w-full max-w-md pointer-events-auto">
            <AnimatePresence>
              {activeMonologue && !isNatDialogueOpen && (
                <motion.div
                  key="altar-thought-monologue"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  onClick={() => setActiveMonologue(null)}
                  className="p-3.5 rounded-xl bg-[#0b0f0d]/90 border border-[#273830] backdrop-blur-md shadow-2xl space-y-1.5 cursor-pointer hover:border-[#3f5c4c] transition-all group"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#8fa89b]/80 uppercase tracking-wider border-b border-[#1f2d26] pb-1">
                    <span>Inner Monologue</span>
                    <span className="group-hover:text-[#6ee7b7] transition-colors">[Click to Dismiss]</span>
                  </div>
                  <p className="text-xs text-[#c2d6cc] italic font-serif leading-relaxed line-clamp-4 select-none">
                    "{activeMonologue}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* 5. Guardian Nat Interrogation Dialogue System */}
      <AnimatePresence>
        {isNatDialogueOpen && (
          <NatDialogueView
            composure={composure}
            setComposure={setComposure}
            characterName="Moe"
            onConcludeAudience={handleConcludeNatAudience}
            addDiscoveredClue={addDiscoveredClue}
            discoveredClues={discoveredClues}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrayerAltarView;