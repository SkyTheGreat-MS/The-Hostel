import React, { useEffect, useState } from 'react';
import { InteractiveHotspot } from './InteractiveHotspot';
import { sound } from '../utils/audio';
import { useGameStore } from '../context/GameProgressContext';

export interface GarageSubterraneanViewProps {
  onReturn?: () => void;
  setActiveMonologue: (text: string | null) => void;
}

export const GarageSubterraneanView: React.FC<GarageSubterraneanViewProps> = ({
  onReturn,
  setActiveMonologue,
}) => {
  const { inventory, addToInventory, garageDrained, setGarageDrained, drainGarage, pickupGarageItem } = useGameStore();

  const [isDraining, setIsDraining] = useState(false);

  const hasPulley = inventory.includes('iron_pulley');
  const hasMachete = inventory.includes('rusty_machete');

  useEffect(() => {
    try {
      sound.playDrip?.();
    } catch {}

    if (!garageDrained) {
      setActiveMonologue(
        "The flooded subterranean bicycle garage smells of rusted iron and stagnant rainwater. A row of waterlogged 1990s bicycles sits submerged under the dark surface."
      );
    } else {
      setActiveMonologue(
        "The basement floodwater has receded into the drainage floor grates, leaving muddy silt and damp floor tiles exposed."
      );
    }
  }, [setActiveMonologue, garageDrained]);

  const handleDrainValve = () => {
    if (garageDrained) {
      try {
        sound.playMetalCreak?.();
      } catch {}
      setActiveMonologue(
        "The heavy iron valve is wrenched open. Murky water has emptied through the floor grates."
      );
      return;
    }

    if (isDraining) return;

    // Start draining animation sequence
    setIsDraining(true);
    try {
      sound.playMetalCreak?.();
      setTimeout(() => {
        try {
          sound.playDrip?.();
        } catch {}
      }, 500);
    } catch {}

    setActiveMonologue(
      "With a violent groan of rusted iron, the valve turns! The dark floodwater swirls and gurgles down the basement sluices..."
    );

    setTimeout(() => {
      if (drainGarage) {
        void drainGarage();
      } else {
        setGarageDrained(true);
      }
      setIsDraining(false);
      setActiveMonologue(
        "The floodwater drains completely into the lower pipes, exposing the damp floor and the caretaker's tool cage!"
      );
    }, 1800);
  };

  const handleInspectBicycles = () => {
    if (isDraining) return;
    try {
      sound.playDrip?.();
    } catch {}
    setActiveMonologue(
      "Row upon row of rusted Phoenix and Flying Pigeon bicycles, left behind by students decades ago. Their spokes are tangled with black hair and silt."
    );
  };

  const handleInspectLog = () => {
    if (isDraining) return;
    try {
      sound.playPaperRustle?.();
    } catch {}
    setActiveMonologue(
      "A moldy logbook on a waterlogged desk: '1974 Sluice Overflow. The subterranean culvert below the old banyan well was sealed off. Only heavy rigging and clearing the choked vines will open passage to the drainage canal.'"
    );
  };

  const handleTakePulley = () => {
    if (isDraining) return;
    if (!garageDrained) {
      try {
        sound.playDrip?.();
      } catch {}
      setActiveMonologue(
        "An iron pulley hangs submerged in the murky floodwater. You can't reach it safely until the water is drained."
      );
      return;
    }

    try {
      sound.playItemCollect?.();
    } catch {
      try {
        sound.playInventoryAdd?.();
      } catch {}
    }

    if (pickupGarageItem) {
      void pickupGarageItem('iron_pulley');
    } else {
      addToInventory('iron_pulley');
    }
    setActiveMonologue(
      "Acquired [HEAVY IRON PULLEY]. A solid cast-iron wheel with a forged steel hook, perfect for lowering heavy loads into deep shafts."
    );
  };

  const handleTakeMachete = () => {
    if (isDraining) return;
    if (!garageDrained) {
      try {
        sound.playDrip?.();
      } catch {}
      setActiveMonologue(
        "A heavy blade is wedged under a submerged workbench. It is too deep in the stagnant water to grasp safely."
      );
      return;
    }

    try {
      (sound as any).playWoodChop?.();
      sound.playItemCollect?.();
    } catch {
      try {
        sound.playInventoryAdd?.();
      } catch {}
    }

    if (pickupGarageItem) {
      void pickupGarageItem('rusty_machete');
    } else {
      addToInventory('rusty_machete');
    }
    setActiveMonologue(
      "Acquired [RUSTY MACHETE]. The carbon steel blade is chipped and oxidized, but heavy enough to hack through thick banyan vines."
    );
  };

  return (
    <div className={`relative w-full h-full select-none overflow-hidden bg-black ${isDraining ? 'animate-pulse' : ''}`}>
      {/* Dynamic Background Image Switch */}
      <img
        src={
          garageDrained
            ? '/assets/scenes/garage_subterranean_rain.jpg'
            : '/assets/scenes/garage_subterranean_rain_submerged.jpg'
        }
        alt="Subterranean Bicycle Garage"
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 ${
          isDraining ? 'opacity-40 scale-[1.01]' : 'opacity-100 scale-100'
        }`}
        onError={(e) => {
          e.currentTarget.src = garageDrained
            ? 'assets/scenes/garage_subterranean_rain.jpg'
            : 'assets/scenes/garage_subterranean_rain_submerged.jpg';
        }}
      />

      {/* Atmospheric Vignette & Mood Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />

      {/* Submerged Water Surface Overlay */}
      {!garageDrained && (
        <div
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-950/50 via-cyan-950/30 to-transparent pointer-events-none transition-all duration-1000 ${
            isDraining ? 'h-0 opacity-0' : 'h-2/5 opacity-100 animate-pulse'
          }`}
        />
      )}

      {/* Draining Sluice Ripple / Shimmer Effect */}
      {isDraining && (
        <div className="absolute inset-0 bg-emerald-950/20 mix-blend-overlay pointer-events-none animate-pulse transition-opacity duration-500" />
      )}

      {/* Interactive Hotspots Layer (disabled during drainage animation) */}
      <div className={`absolute inset-0 z-20 pointer-events-none ${isDraining ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Hotspot 1: Drainage Valve Wheel */}
        <InteractiveHotspot
          id="garage_drain_valve"
          name="Drainage Valve Wheel"
          cursorTooltip={garageDrained ? "Examine Open Valve" : "Turn Drainage Valve"}
          polygonPoints="12,45 22,45 22,62 12,62"
          onClick={handleDrainValve}
        />

        {/* Hotspot 2: Vintage 1990s Bicycles */}
        <InteractiveHotspot
          id="garage_bicycles"
          name="Vintage 1990s Bicycles"
          cursorTooltip="Inspect Submerged Bicycles"
          polygonPoints="25,55 58,55 60,88 23,88"
          onClick={handleInspectBicycles}
        />

        {/* Hotspot 3: Caretaker's Work Table & Log */}
        <InteractiveHotspot
          id="garage_caretaker_log"
          name="Caretaker's Maintenance Log"
          cursorTooltip="Read Caretaker's Log"
          polygonPoints="68,48 76,48 76,58 68,58"
          onClick={handleInspectLog}
        />

        {/* Hotspot 4: Heavy Iron Pulley (hidden if collected) */}
        {!hasPulley && (
          <InteractiveHotspot
            id="garage_tool_pulley"
            name="Heavy Iron Pulley"
            cursorTooltip={garageDrained ? "Take Iron Pulley" : "Examine Submerged Object"}
            polygonPoints="77,52 84,52 84,65 77,65"
            onClick={handleTakePulley}
          />
        )}

        {/* Hotspot 5: Rusty Machete (hidden if collected) */}
        {!hasMachete && (
          <InteractiveHotspot
            id="garage_tool_machete"
            name="Rusty Machete"
            cursorTooltip={garageDrained ? "Take Rusty Machete" : "Examine Submerged Blade"}
            polygonPoints="85,42 93,42 93,68 85,68"
            onClick={handleTakeMachete}
          />
        )}
      </div>
    </div>
  );
};

export default GarageSubterraneanView;