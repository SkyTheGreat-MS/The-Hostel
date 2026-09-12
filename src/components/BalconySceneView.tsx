import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../audioEngine';
import { Phase3Location } from '../types';
import { SceneNavBar } from './SceneNavBar';
import { InteractiveHotspot } from './InteractiveHotspot';
import { MONOLOGUE_LINES } from '../data/dialogues';
import { Key } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export interface BalconySceneViewProps {
  setPhase3Location?: (location: Phase3Location) => void;
  activeMonologue?: string | null;
  setActiveMonologue?: (msg: string | null) => void;
  currentChapter?: number;
  inventory?: string[];
  setInventory?: React.Dispatch<React.SetStateAction<string[]>>;
  composure?: number;
  setComposure?: React.Dispatch<React.SetStateAction<number>>;
  discoveredClues?: string[];
  onStepBack?: () => void;
  radioTuned?: boolean;
  mayResolved?: boolean;
  setMayResolved?: (val: boolean) => void;
  key14OnFloor?: boolean;
  setKey14OnFloor?: (val: boolean) => void;
  key14Collected?: boolean;
  setKey14Collected?: (val: boolean) => void;
  addInventoryItem?: (item: string) => void;
  removeInventoryItem?: (item: string) => void;
  addDiscoveredClue?: (clue: string) => void;
  setRoomBanner?: (banner: { text: string; type: 'success' | 'warning' | 'warn' | 'info' } | null) => void;
}

export const BalconySceneView: React.FC<BalconySceneViewProps> = ({
  setPhase3Location,
  activeMonologue,
  setActiveMonologue,
  currentChapter = 2,
  inventory = [],
  setInventory,
  composure = 100,
  setComposure,
  discoveredClues = [],
  onStepBack,
  radioTuned = false,
  mayResolved: mayResolvedProp,
  setMayResolved,
  key14OnFloor: key14OnFloorProp,
  setKey14OnFloor,
  key14Collected: key14CollectedProp,
  setKey14Collected,
  addInventoryItem,
  removeInventoryItem,
  addDiscoveredClue,
  setRoomBanner,
}) => {
  // Local state fallbacks for standalone usage / test harnesses
  const [localMayResolved, setLocalMayResolved] = useState<boolean>(Boolean(mayResolvedProp));
  const [localKey14OnFloor, setLocalKey14OnFloor] = useState<boolean>(Boolean(key14OnFloorProp));
  const [localKey14Collected, setLocalKey14Collected] = useState<boolean>(Boolean(key14CollectedProp));

  const [showHandoverPrompt, setShowHandoverPrompt] = useState<boolean>(false);
  const [isDissolving, setIsDissolving] = useState<boolean>(false);

  // Sync external props with local states
  useEffect(() => {
    if (typeof mayResolvedProp === 'boolean') setLocalMayResolved(mayResolvedProp);
  }, [mayResolvedProp]);

  useEffect(() => {
    if (typeof key14OnFloorProp === 'boolean') setLocalKey14OnFloor(key14OnFloorProp);
  }, [key14OnFloorProp]);

  useEffect(() => {
    if (typeof key14CollectedProp === 'boolean') setLocalKey14Collected(key14CollectedProp);
  }, [key14CollectedProp]);

  // Refresh Guard & Visibility Resolution
  const isMayResolved = typeof mayResolvedProp === 'boolean' ? mayResolvedProp : localMayResolved;
  const isKey14Collected = typeof key14CollectedProp === 'boolean' ? key14CollectedProp : localKey14Collected;
  const isKey14OnFloor =
    (typeof key14OnFloorProp === 'boolean' ? key14OnFloorProp : localKey14OnFloor) ||
    (isMayResolved && !isKey14Collected);

  // 1. May is visible only when radio is tuned, she hasn't resolved, and is not dissolved
  const isMayVisible = radioTuned && !isMayResolved;

  // 2. Key 14 is visible on floor when dropped/resolved and not yet collected
  const isKeyVisibleOnFloor = isKey14OnFloor && !isKey14Collected;

  const hasLetter = inventory.includes('letter_ko_zaw') || inventory.includes('clue_letter_4b');

  // Ambient: Start looping outdoor monsoon rain audio cue on mount, cleanup on unmount
  useEffect(() => {
    try {
      sound.startRainAmbient();
    } catch {}

    return () => {
      try {
        sound.stopRainAmbient();
      } catch {}
    };
  }, []);

  // Return Navigation Handler
  const handleReturnToEastFork = () => {
    try {
      sound.playDoorCreak();
    } catch {
      try {
        sound.playDoorPush();
      } catch {}
    }
    if (onStepBack) {
      onStepBack();
    } else if (setPhase3Location) {
      setPhase3Location('east_fork');
      setActiveMonologue?.(MONOLOGUE_LINES.BALCONY_RETURN_FROM_BENCH);
    }
  };

  // Click handler on May's sprite
  const handleMayClick = () => {
    if (isDissolving) return;

    if (!hasLetter) {
      // Condition A: Missing Letter -> Panic monologue loop
      setShowHandoverPrompt(false);
      try {
        sound.playGhostWhisper();
      } catch {}
      setActiveMonologue?.(MONOLOGUE_LINES.MAY_PANIC_MISSING_LETTER);
    } else {
      // Condition B: Holding letter_ko_zaw -> Toggle minimal action prompt pill
      sound.playPaperRustle();
      setShowHandoverPrompt((prev) => !prev);
      setActiveMonologue?.(null);
    }
  };

  // Handover Execution sequence
  const handleHandoverLetter = () => {
    setShowHandoverPrompt(false);

    // 1. Audio cues: paper rustle immediately followed by cord snap
    sound.playPaperRustle();
    setTimeout(() => {
      sound.playCordSnap();
    }, 120);

    // 2. Remove 'letter_ko_zaw' from inventory
    if (removeInventoryItem) {
      removeInventoryItem('letter_ko_zaw');
      removeInventoryItem('clue_letter_4b');
    } else if (setInventory) {
      setInventory((prev) => prev.filter((i) => i !== 'letter_ko_zaw' && i !== 'clue_letter_4b'));
    }

    // 3. Mark May as resolved in store
    setMayResolved?.(true);
    setLocalMayResolved(true);

    // 4. May's relief monologue line
    setActiveMonologue?.(MONOLOGUE_LINES.MAY_HANDOVER_RELIEF);

    // 5. Trigger dissolve animation
    setIsDissolving(true);

    // 6. Play ghost whisper sigh and key drop sound
    setTimeout(() => {
      sound.playGhostWhisper();
      sound.playKeyDrop();
    }, 450);

    // 7. After 1 second, enable floor key drop state
    setTimeout(() => {
      setIsDissolving(false);
      setKey14OnFloor?.(true);
      setLocalKey14OnFloor(true);
    }, 1000);
  };

  // Key 14 Floor Pickup Action
  const handlePickupKey14 = () => {
    // 1. Play item looted chime
    sound.playItemLooted();

    // 2. Add 'key_14' to inventory
    if (addInventoryItem) {
      addInventoryItem('key_14');
    } else if (setInventory) {
      setInventory((prev) => (prev.includes('key_14') ? prev : [...prev, 'key_14']));
    }

    // 3. Update state
    setKey14Collected?.(true);
    setLocalKey14Collected(true);
    setKey14OnFloor?.(false);
    setLocalKey14OnFloor(false);

    // 4. Display thought line
    setActiveMonologue?.(MONOLOGUE_LINES.KEY_14_PICKUP);

    // 5. Log clue to Case Notes
    addDiscoveredClue?.('clue_key_14');

    // 6. Notification banner
    setRoomBanner?.({
      text: "Retrieved Key 14 from the balcony terrace. Corresponds to Locker 14.",
      type: 'success',
    });
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-black pointer-events-auto">
      {/* 1. Full-viewport fixed background using matching artwork */}
      <img
        src="/assets/scenes/balcony_rain_night.jpg"
        onError={(e) => {
          e.currentTarget.src = 'assets/scenes/balcony_rain_night.jpg';
        }}
        alt="Pathway 326 The Overlook Balcony"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50 pointer-events-none" />

      {/* 2. Ambient Rain Effect Overlay (Monsoon Night Atmosphere) */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-black/60" />

      {/* 3. Standardized Scene Navigation Bar */}
      <SceneNavBar
        onReturn={handleReturnToEastFork}
        returnDestination="EAST FORK"
        areaZone="PATHWAY 326"
        areaName="THE OVERLOOK BALCONY"
      />

      {/* 4. Transistor Radio Hotspot on Bench */}
      <InteractiveHotspot
        id="balcony_transistor_radio"
        name="Transistor Radio"
        polygonPoints="60,55 73,57 73,74 60,69"
        cursorTooltip="[Inspect Transistor Radio]"
        onClick={() => {
          sound.playBenchInspect();
          setActiveMonologue?.(null);
          setPhase3Location?.('radio_bench_inspection');
        }}
      />

      {/* 5. Spectral May on Left Railing */}
      {(isMayVisible || isDissolving) && (
        <>
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: isDissolving ? 0 : 1 }}
            transition={{ duration: isDissolving ? 1 : 0.4 }}
            src="/assets/characters/may_spectral_balcony.png"
            alt="Spectral May"
            className={`absolute bottom-0 left-[7%] z-10 h-[68%] max-w-[38%] object-contain pointer-events-none drop-shadow-[0_0_24px_rgba(177,235,206,0.7)] ${
              isDissolving ? 'filter blur-sm brightness-125' : ''
            }`}
          />

          {!isDissolving && (
            <InteractiveHotspot
              id="balcony_spectral_may"
              name="Spectral May"
              polygonPoints="8,35 22,35 25,99 6,99"
              cursorTooltip="Speak to May"
              onClick={handleMayClick}
            />
          )}

          {/* Minimal Handover Action Prompt Pill centered above May */}
          <AnimatePresence>
            {showHandoverPrompt && !isDissolving && !isMayResolved && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.94 }}
                transition={{ duration: 0.2 }}
                className="absolute left-[6%] sm:left-[8%] top-[26%] sm:top-[28%] z-40"
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleHandoverLetter}
                    className="group flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-emerald-950/95 hover:bg-emerald-900 border border-emerald-400/80 hover:border-emerald-300 text-emerald-100 hover:text-white text-xs sm:text-sm font-mono font-bold tracking-wider uppercase shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_40px_rgba(16,185,129,0.7)] cursor-pointer transition-all active:scale-95"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>[ Hand over Ko Zaw's Folded Letter ]</span>
                  </button>
                  <button
                    onClick={() => setShowHandoverPrompt(false)}
                    className="p-2 rounded-xl bg-black/85 border border-[#2d4436] text-stone-400 hover:text-white text-xs font-mono cursor-pointer"
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* 6. Key 14 Floor Dropped Item Hotspot on Wet Terrace Tiles */}
      {isKeyVisibleOnFloor && (
        <>
          {/* Key Visual Overlay on Wet Floor Tiles */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute left-[46%] top-[70%] w-[10%] h-[12%] pointer-events-none flex items-center justify-center z-10"
          >
            {/* Ambient water reflection ripple / gleam */}
            <div className="absolute w-12 h-12 rounded-full bg-amber-400/25 blur-md animate-pulse" />
            <img
              src="/assets/items/key_14_drop.png"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              alt="Key 14"
              className="w-20 h-20 object-contain drop-shadow-[0_0_12px_rgba(251,191,36,0.85)] rotate-45 pointer-events-none"
            />
            
          </motion.div>

          {/* Interactive Key 14 Hotspot */}
          <InteractiveHotspot
            id="balcony_key_14_floor"
            name="Tarnished Key (14)"
            cursorTooltip="Take Tarnished Key (14)"
            polygonPoints="48,70 54,70 56,82 49,82"
            onClick={handlePickupKey14}
          />
        </>
      )}
    </div>
  );
};

export default BalconySceneView;
