import React, { useEffect } from 'react';
import { InteractiveHotspot } from '../components/InteractiveHotspot';
import { useGameStore } from '../store/useGameStore';
import { PrologBridge } from '../services/PrologBridge';
import { sound } from '../utils/audio';

interface Locker14InteriorViewProps {
  onReturn: () => void;
  setActiveMonologue: (text: string | null) => void;
}

export const Locker14InteriorView: React.FC<Locker14InteriorViewProps> = ({
  onReturn,
  setActiveMonologue,
}) => {
  const { 
    inventory, 
    addToInventory, 
    locker14Looted, 
    setLocker14Looted, 
    setStairwayGateKeyTaken 
  } = useGameStore();

  const hasTape = inventory.includes('cassette_tape_may');
  const hasGateKey = inventory.includes('key_stairway_gate');

  useEffect(() => {
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
  }, [locker14Looted, hasTape, hasGateKey, setActiveMonologue]);

  const handleTakeTape = async () => {
    if (hasTape) {
      setActiveMonologue("The micro-cassette tape has already been taken.");
      return;
    }

    try {
      sound.playItemCollect?.();
    } catch {}

    try {
      await PrologBridge.queryOnce?.('take_locker_tape.');
    } catch {}

    addToInventory('cassette_tape_may');

    if (hasGateKey) {
      setLocker14Looted(true);
    }

    setActiveMonologue(
      "Acquired [UNLABELED MICRO-CASSETTE TAPE (1998.08.12)]. Dated right before the incident in Room 101."
    );
  };

  const handleTakeKey = async () => {
    if (hasGateKey) {
      setActiveMonologue("The stairway gate key has already been taken.");
      return;
    }

    try {
      sound.playItemCollect?.();
    } catch {}

    try {
      await PrologBridge.queryOnce?.('take_stairway_key.');
    } catch {}

    addToInventory('key_stairway_gate');
    setStairwayGateKeyTaken?.(true);

    if (hasTape) {
      setLocker14Looted(true);
    }

    setActiveMonologue(
      "Acquired [STAIRWAY GATE KEY]. A heavy iron key stamped with 'STAIRWAY EXTR' for the ground floor security gate."
    );
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-black">
      {/* Background Graphic */}
      <img
        src="/assets/scenes/locker_14_interior.jpg"
        alt="Locker 14 Interior"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Atmospheric Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50 pointer-events-none" />

      {/* Interactive Hotspots Layer */}
      <div className="absolute inset-0 z-20 pointer-events-auto">
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
      </div>
    </div>
  );
};

export default Locker14InteriorView;
