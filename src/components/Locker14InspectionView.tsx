import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key } from 'lucide-react';
import { sound } from '../audioEngine';
import { SceneNavBar } from './SceneNavBar';
import { Locker14InteriorView } from './Locker14InteriorView';
import { Phase3Location } from '../types';
import { MONOLOGUE_LINES } from '../data/dialogues';

export interface Locker14InspectionViewProps {
  inventory?: string[];
  setInventory?: React.Dispatch<React.SetStateAction<string[]>>;
  addInventoryItem?: (itemId: string) => void;
  removeInventoryItem?: (itemId: string) => void;
  locker14Unlocked?: boolean;
  setLocker14Unlocked?: (val: boolean | ((prev: boolean) => boolean)) => void;
  stairwayGateKeyTaken?: boolean;
  setStairwayGateKeyTaken?: (val: boolean | ((prev: boolean) => boolean)) => void;
  setActiveMonologue?: (msg: string | null) => void;
  addDiscoveredClue?: (clueId: string) => void;
  onReturn: () => void;
  setPhase3Location?: (loc: Phase3Location) => void;
}

/**
 * Locker14InspectionView — Padlock Inspection & Unlock Sequence for Locker 14
 *
 * Implements the 3 states:
 * - State A: Unlocked -> Directly shows Locker14InteriorView
 * - State B: Locked without Key 14 -> Standard thought line and clue logging
 * - State C: Locked with Key 14 -> Action prompt pill [ Unlock with Key 14 ]
 *   running the unlatching sequence (SFX, inventory removal, Prolog sync, and transition).
 */
export const Locker14InspectionView: React.FC<Locker14InspectionViewProps> = ({
  inventory = [],
  setInventory,
  addInventoryItem,
  removeInventoryItem,
  locker14Unlocked = false,
  setLocker14Unlocked,
  stairwayGateKeyTaken,
  setStairwayGateKeyTaken,
  setActiveMonologue,
  addDiscoveredClue,
  onReturn,
  setPhase3Location,
}) => {
  const [showUnlockPrompt, setShowUnlockPrompt] = useState<boolean>(false);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);

  const hasKey14 = inventory.includes('key_14');

  // State A: Unlocked bypass -> Directly render interior view
  if (locker14Unlocked) {
    return (
      <Locker14InteriorView
        inventory={inventory}
        addInventoryItem={addInventoryItem}
        stairwayGateKeyTaken={stairwayGateKeyTaken}
        setStairwayGateKeyTaken={setStairwayGateKeyTaken}
        setActiveMonologue={setActiveMonologue}
        addDiscoveredClue={addDiscoveredClue}
        onReturn={onReturn}
      />
    );
  }

  // Padlock hotspot click handler
  const handlePadlockClick = () => {
    if (isUnlocking) return;

    if (!hasKey14) {
      // State B: Locked without Key 14
      setShowUnlockPrompt(false);
      try {
        sound.playLockJiggle();
      } catch {
        sound.playMetallicTumblerClick();
      }
      setActiveMonologue?.(
        MONOLOGUE_LINES.LOCKER_14_LOCKED_NO_KEY ||
          '— "Locked tight with a small barrel cylinder. May\'s personal locker... the key is nowhere here." —'
      );
      addDiscoveredClue?.('clue_locker_14_found');
    } else {
      // State C: Locked with Key 14 -> Toggle minimal action prompt pill
      try {
        sound.playMetallicTumblerClick();
      } catch {
        sound.playPaperRustle();
      }
      setShowUnlockPrompt((prev) => !prev);
      setActiveMonologue?.(null);
    }
  };

  // Unlock sequence resolution pipeline
  const handleUnlockSequence = () => {
    if (isUnlocking) return;
    setIsUnlocking(true);
    setShowUnlockPrompt(false);

    // 1. Play key_turn.mp3 followed by padlock_open.mp3
    sound.playKeyTurn();
    setTimeout(() => {
      sound.playPadlockOpen();
    }, 140);

    // 2. Remove 'key_14' from inventory via removeItem('key_14')
    if (removeInventoryItem) {
      removeInventoryItem('key_14');
    } else if (setInventory) {
      setInventory((prev) => prev.filter((item) => item !== 'key_14'));
    }

    // 3. Update game store: set({ locker14Unlocked: true })
    setLocker14Unlocked?.(true);

    // Synchronize Prolog state if Prolog engine is active in window
    try {
      if (typeof (window as any).prologEngine?.query === 'function') {
        (window as any).prologEngine.query('retract(player_has(key_14)), assertz(locker_unlocked(14)).');
      }
    } catch {}

    // 4. Display brief completion thought line
    setActiveMonologue?.(
      MONOLOGUE_LINES.LOCKER_14_UNLATCH_SUCCESS ||
        '— "The shackle pops loose with a dull click. The door swings open." —'
    );

    // 5. Play locker_door_open.mp3 after a 0.8-second delay
    setTimeout(() => {
      sound.playLockerDoorOpen();
    }, 800);

    // 6. Transition view to Locker14InteriorView
    setTimeout(() => {
      setIsUnlocking(false);
      if (setPhase3Location) {
        setPhase3Location('locker_14_interior');
      }
    }, 1000);
  };

  const handleReturn = () => {
    try {
      sound.playPaperRustle();
    } catch {}
    onReturn();
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-black pointer-events-auto">
      {/* 1. Full-viewport fixed background using Padlock Inspection Artwork */}
      <img
        src="/assets/scenes/locker_14_zoom.jpg"
        onError={(e) => {
          e.currentTarget.src = 'assets/scenes/locker_14_zoom.jpg';
        }}
        alt="Locker 14 Padlock Zoom"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50 pointer-events-none" />

      {/* 2. Standardized Scene Navigation Bar */}
      <SceneNavBar
        onReturn={handleReturn}
        returnDestination="LOCKERS"
        areaZone="EAST WING"
        areaName="STUDENT LOCKER BAY"
      />

      {/* 3. Interactive Padlock Hotspot Stamped with '14' */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none group"
        data-hotspot-id="locker-14-padlock"
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <g
            className="group/poly pointer-events-auto cursor-pointer"
            onClick={handlePadlockClick}
            onMouseEnter={() => sound.playMenuHover()}
          >
            {/* Padlock Polygon: points="44,10 62,10 64,62 42,62" */}
            <polygon
              points="44,10 62,10 64,62 42,62"
              className={`fill-transparent stroke-transparent transition-all duration-300 ${
                hasKey14
                  ? 'group-hover:stroke-emerald-400 group-hover:stroke-[0.6] group-hover:[stroke-dasharray:4,3] group-hover:fill-emerald-500/10 group-hover:filter group-hover:drop-shadow-[0_0_12px_rgba(110,231,183,0.4)]'
                  : 'group-hover:stroke-[#82a996]/60 group-hover:stroke-[0.5] group-hover:fill-[#82a996]/5 group-hover:filter group-hover:drop-shadow-[0_0_8px_rgba(130,169,150,0.3)]'
              }`}
            />
            <title>{hasKey14 ? 'Unlock Locker 14' : "Inspect Barrel Lock"}</title>
          </g>
        </svg>

        {/* Hover label / tooltip anchored above padlock center (left: 53%, top: 9%) */}
        <span
          className="absolute px-2.5 py-1 rounded bg-[#121815]/95 border border-[#2c3d34] text-[10px] font-mono text-[#82a996] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg -translate-x-1/2 -translate-y-full mb-2 z-30"
          style={{ left: '53%', top: '9%' }}
        >
          {hasKey14 ? 'Unlock Locker 14' : "May's Locker 14 Padlock"}
        </span>
      </div>

      {/* 4. Action Prompt Pill: [ Unlock with Key 14 ] */}
      <AnimatePresence>
        {showUnlockPrompt && hasKey14 && !isUnlocking && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[68%] left-1/2 -translate-x-1/2 z-40 pointer-events-auto"
          >
            <button
              onClick={handleUnlockSequence}
              className="px-5 py-2.5 bg-[#0b1712]/95 hover:bg-[#12281e] text-emerald-300 hover:text-emerald-100 border border-emerald-500/60 hover:border-emerald-400 rounded-full font-mono text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.55)] transition-all flex items-center gap-2 cursor-pointer ring-1 ring-emerald-500/30"
            >
              <Key className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              [ Unlock with Key 14 ]
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Locker14InspectionView;
