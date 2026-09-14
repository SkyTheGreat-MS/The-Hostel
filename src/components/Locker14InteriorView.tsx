import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { InteractiveHotspot } from './InteractiveHotspot';
import { useGameStore } from '../store/useGameStore';
import { PrologBridge } from '../services/PrologBridge';
import { sound } from '../audioEngine';
import { MONOLOGUE_LINES } from '../data/dialogues';

export interface Locker14InteriorViewProps {
  onReturn?: () => void;
  setActiveMonologue: (text: string | null) => void;
  locker14Unlocked?: boolean;
  setLocker14Unlocked?: (val: boolean | ((prev: boolean) => boolean)) => void;
  inventory?: string[];
  setInventory?: React.Dispatch<React.SetStateAction<string[]>>;
  removeInventoryItem?: (itemId: string) => void;
  setPhase3Location?: (loc: any) => void;
  setRoomBanner?: (banner: { text: string; type: 'success' | 'warning' | 'warn' | 'info' } | null) => void;
  addDiscoveredClue?: (clueId: string) => void;
}

export const Locker14InteriorView: React.FC<Locker14InteriorViewProps> = ({
  onReturn,
  setActiveMonologue,
  locker14Unlocked: propLocker14Unlocked,
  setLocker14Unlocked: propSetLocker14Unlocked,
  inventory: propInventory,
  setInventory,
  removeInventoryItem,
  setPhase3Location,
  setRoomBanner,
  addDiscoveredClue,
}) => {
  const { 
    inventory: storeInventory, 
    addToInventory, 
    locker14Looted, 
    setLocker14Looted, 
    setStairwayGateKeyTaken,
    locker14Unlocked: storeLocker14Unlocked,
  } = useGameStore();

  const [localLocker14Unlocked, setLocalLocker14Unlocked] = useState<boolean>(() => {
    if (typeof propLocker14Unlocked === 'boolean') return propLocker14Unlocked;
    if (typeof storeLocker14Unlocked === 'boolean') return storeLocker14Unlocked;
    try {
      const stored = localStorage.getItem('spirits_labyrinth_progress_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed.locker14Unlocked === 'boolean') return parsed.locker14Unlocked;
      }
    } catch {}
    return false;
  });

  useEffect(() => {
    if (typeof propLocker14Unlocked === 'boolean') {
      setLocalLocker14Unlocked(propLocker14Unlocked);
    }
  }, [propLocker14Unlocked]);

  const isUnlocked =
    typeof propLocker14Unlocked === 'boolean'
      ? propLocker14Unlocked
      : localLocker14Unlocked;

  const currentInventory = propInventory || storeInventory || [];
  const hasKey14 =
    Array.isArray(currentInventory) &&
    currentInventory.some(
      (item) => typeof item === 'string' && (item === 'key_14' || item.toLowerCase().includes('key_14'))
    );

  const hasTape = currentInventory.includes('cassette_tape_may');
  const hasGateKey = currentInventory.includes('key_stairway_gate');

  useEffect(() => {
    if (!isUnlocked) {
      PrologBridge.setLocation?.('locker_14');
      if (hasKey14) {
        setActiveMonologue(
          "Locker 14 is secured with a heavy tarnished padlock stamped '14'. Key 14 fits the keyway."
        );
      } else {
        setActiveMonologue(MONOLOGUE_LINES.LOCKER_14_LOCKED_NO_KEY);
      }
      return;
    }

    PrologBridge.setLocation?.('locker_14_interior');
    if (!hasTape && !hasGateKey && !locker14Looted) {
      setActiveMonologue(
        "Locker 14's heavy steel door swings open. Inside, resting among moldy student records, is an unlabeled micro-cassette tape."
      );
    } else if (!hasTape && !locker14Looted) {
      setActiveMonologue(
        "Locker 14 interior. An unlabeled micro-cassette tape rests among moldy student records."
      );
    } else if (!hasGateKey && !locker14Looted) {
      setActiveMonologue(
        "Locker 14 interior. The stairway gate key rests on the lower shelf."
      );
    } else {
      setActiveMonologue(
        "Locker 14 interior. The shelf is now empty."
      );
    }
  }, [isUnlocked, hasKey14, locker14Looted, hasTape, hasGateKey, setActiveMonologue]);

  const handleUnlockPadlock = async () => {
    if (!hasKey14) {
      try {
        sound.playLockJiggle?.();
      } catch {}
      setActiveMonologue(MONOLOGUE_LINES.LOCKER_14_LOCKED_NO_KEY);
      return;
    }

    // Has Key 14 -> Key unlock sequence
    try {
      sound.playKeyUnlock?.();
    } catch {}

    // Consume Key 14 from inventory
    if (removeInventoryItem) {
      removeInventoryItem('key_14');
    }
    if (setInventory) {
      setInventory((prev) => prev.filter((item) => item !== 'key_14'));
    }
    useGameStore.setState((prev) => ({
      inventory: (prev.inventory || []).filter((item) => item !== 'key_14'),
      locker14Unlocked: true,
    }));

    // Update state flags
    propSetLocker14Unlocked?.(true);
    setLocalLocker14Unlocked(true);

    try {
      await PrologBridge.queryOnce?.('unlock_locker_14.');
    } catch {}
    try {
      await PrologBridge.queryOnce?.('assertz(locker_unlocked(14)).');
    } catch {}

    addDiscoveredClue?.('clue_locker_14_found');

    setActiveMonologue(MONOLOGUE_LINES.LOCKER_14_UNLATCH_SUCCESS);
    setRoomBanner?.({
      text: "Used Key 14 to unlock Locker 14. The heavy steel door swings open.",
      type: 'success',
    });

    setPhase3Location?.('locker_14_interior');
  };

  const handleTakeTape = async () => {
    if (hasTape) {
      setActiveMonologue("The micro-cassette tape has already been taken.");
      return;
    }

    try {
      sound.playItemCollect?.();
    } catch {
      try {
        sound.playItemLooted?.();
      } catch {}
    }

    try {
      await PrologBridge.queryOnce?.('take_locker_tape.');
    } catch {}

    if (addToInventory) {
      addToInventory('cassette_tape_may');
    }
    if (setInventory) {
      setInventory((prev) => (prev.includes('cassette_tape_may') ? prev : [...prev, 'cassette_tape_may']));
    }

    if (hasGateKey) {
      setLocker14Looted(true);
    }

    setActiveMonologue(
      "Acquired [UNLABELED MICRO-CASSETTE TAPE (1998.08.12)]. Dated right before the incident in Room 101."
    );
    setRoomBanner?.({
      text: "Acquired Unlabeled Micro-Cassette Tape (1998.08.12).",
      type: 'success',
    });
  };

  const handleTakeKey = async () => {
    if (hasGateKey) {
      setActiveMonologue("The stairway gate key has already been taken.");
      return;
    }

    try {
      sound.playItemCollect?.();
    } catch {
      try {
        sound.playItemLooted?.();
      } catch {}
    }

    try {
      await PrologBridge.queryOnce?.('take_stairway_key.');
    } catch {}

    if (addToInventory) {
      addToInventory('key_stairway_gate');
    }
    if (setInventory) {
      setInventory((prev) => (prev.includes('key_stairway_gate') ? prev : [...prev, 'key_stairway_gate']));
    }
    setStairwayGateKeyTaken?.(true);

    if (hasTape) {
      setLocker14Looted(true);
    }

    setActiveMonologue(
      "Acquired [STAIRWAY GATE KEY]. A heavy iron key stamped with 'STAIRWAY EXTR' for the ground floor security gate."
    );
    setRoomBanner?.({
      text: "Acquired Stairway Gate Key stamped 'STAIRWAY EXTR'.",
      type: 'success',
    });
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-black">
      {/* Background Graphic: locked zoom vs unlocked interior */}
      <img
        src={isUnlocked ? "/assets/scenes/locker_14_interior.jpg" : "/assets/scenes/locker_14_zoom.jpg"}
        alt={isUnlocked ? "Locker 14 Interior" : "Locker 14 Padlock"}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300"
      />

      {/* Atmospheric Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50 pointer-events-none" />

      {/* Interactive Hotspots Layer */}
      <div className="absolute inset-0 z-20 pointer-events-auto">
        {!isUnlocked && (
          <>
            {/* Padlock Hotspot */}
            <InteractiveHotspot
              id="locker_14_padlock"
              name="Tarnished Brass Padlock (14)"
              cursorTooltip={
                hasKey14
                  ? "[ Unlock Padlock with Key 14 ]"
                  : "[ Heavy Brass Padlock (14) - Locked ]"
              }
              onClick={handleUnlockPadlock}
              polygonPoints="42,24 58,24 59,66 41,66"
            />

            {/* Action Prompt Pill when player has Key 14 */}
            <AnimatePresence>
              {hasKey14 && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.94 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 top-[16%] z-40"
                >
                  <button
                    onClick={handleUnlockPadlock}
                    className="group flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-amber-950/95 hover:bg-amber-900 border border-amber-400/80 hover:border-amber-300 text-amber-100 hover:text-white text-xs sm:text-sm font-mono font-bold tracking-wider uppercase shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:shadow-[0_0_40px_rgba(245,158,11,0.7)] cursor-pointer transition-all active:scale-95"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>[ Use Key 14 to Unlock Locker 14 ]</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {isUnlocked && (
          <>
            {/* Micro-Cassette Tape Hotspot */}
            {!hasTape && !locker14Looted && (
              <InteractiveHotspot
                id="locker_14_cassette_tape"
                name="Unlabeled Micro-Cassette"
                cursorTooltip="Take Micro-Cassette Tape"
                onClick={handleTakeTape}
                polygonPoints="35,45 65,45 65,75 35,75"
              />
            )}

            {/* Stairway Gate Key Hotspot */}
            {!hasGateKey && !locker14Looted && (
              <InteractiveHotspot
                id="key_stairway_gate"
                name="Stairway Gate Key"
                cursorTooltip="Take Stairway Gate Key"
                onClick={handleTakeKey}
                polygonPoints="34,76 66,76 66,94 34,94"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Locker14InteriorView;
