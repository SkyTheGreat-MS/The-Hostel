import React, { useEffect, useState } from 'react';
import { InteractiveHotspot } from './InteractiveHotspot';
import { useGameStore } from '../store/useGameStore';
import { PrologBridge } from '../services/PrologBridge';
import { sound } from '../utils/audio';

export interface WellInteriorDeepViewProps {
  onNavigate: (location: string) => void;
  setActiveMonologue: (text: string | null) => void;
  onReturn?: () => void;
}

export const WellInteriorDeepView: React.FC<WellInteriorDeepViewProps> = ({
  onNavigate,
  setActiveMonologue,
}) => {
  const { 
    inventory, 
    cassetteInserted, 
    setCassetteInserted, 
    cassettePlayed, 
    setCassettePlayed,
    conduitUnlocked,
    setConduitUnlocked,
    removeInventoryItem,
  } = useGameStore();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const hasMayTape = inventory.includes('cassette_tape_may');

  useEffect(() => {
    if (!cassetteInserted) {
      setActiveMonologue(
        "You descend the rope into the damp, dark base of the stone well shaft. A weathered 1990s micro-cassette player rests silently on a dry stone slab."
      );
    } else if (!cassettePlayed) {
      setActiveMonologue(
        "May's micro-cassette is loaded into the player deck, awaiting playback."
      );
    } else {
      setActiveMonologue(
        "The tape's final confession echoes off the brickwork. The heavy rusted iron drainage conduit gate has sprung open, revealing a dark tunnel leading outward."
      );
    }
  }, [cassetteInserted, cassettePlayed, setActiveMonologue]);

  const handleCassettePlayer = async () => {
    if (!cassetteInserted) {
      if (hasMayTape) {
        try { sound.playPaperRustle?.(); } catch {}
        await PrologBridge.insertCassette();
        removeInventoryItem('cassette_tape_may');
        setCassetteInserted(true);
        setActiveMonologue("You insert May's micro-cassette tape into the portable player deck. The play button clicks down.");
      } else {
        setActiveMonologue("An old battery-powered micro-cassette player. The tape compartment is currently empty.");
      }
      return;
    }

    if (!cassettePlayed) {
      setIsPlayingAudio(true);
      try { (sound as any).playStatic?.() || (sound as any).playRainOutdoor?.(); } catch {}

      setActiveMonologue("Static hisses from the tiny speaker, followed by May's shaking voice recorded on August 12, 1998: 'We opened something we couldn't close in Room 101... if anyone finds this, follow the conduit out before the circle closes.'");

      setTimeout(async () => {
        await PrologBridge.playCassette();
        setCassettePlayed(true);
        setConduitUnlocked(true);
        setIsPlayingAudio(false);
        setActiveMonologue("As the tape ends with a sharp click, a heavy mechanical latch echoes from the lower wall—the drainage conduit grate has sprung open!");
      }, 4000);
      return;
    }

    setActiveMonologue("The cassette has finished playing. The micro-cassette reels are jammed at the end of the tape.");
  };

  const handleStormConduitGrating = () => {
    if (!conduitUnlocked) {
      setActiveMonologue("An arched storm culvert set into the lower brick wall, secured by a heavy rusted iron padlock and drainage grille. It won't budge.");
      return;
    }

    // Trigger climax transition to Room 101 Seance Circle flashback
    try { sound.playFootstep?.(); } catch {}
    onNavigate('room_101_seance_flashback');
  };

  const handleShaftWalls = () => {
    try { sound.playDrip?.(); } catch {}
    setActiveMonologue("Ancient damp brickwork curving upward into a tiny circle of gray monsoon light far above.");
  };

  const getPlayerTooltip = (): string => {
    if (!cassetteInserted) {
      return hasMayTape ? "[Insert May's Cassette Tape]" : "[Examine Cassette Player]";
    }
    if (!cassettePlayed) {
      return "[Play Cassette & Listen to Audio]";
    }
    return "[Examine Audio Player]";
  };

  const getConduitTooltip = (): string => {
    return conduitUnlocked ? "[Crawl Through Open Culvert]" : "[Inspect Iron Drainage Grate]";
  };

  return (
    <div className={`relative w-full h-full select-none overflow-hidden bg-black ${isPlayingAudio ? 'animate-pulse' : ''}`}>
      {/* Background Graphic */}
      <img
        src="/assets/scenes/well_interior_deep.jpg"
        alt="Deep Well Interior and Drainage Grate"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Atmospheric Vignette & Audio Static Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/70 pointer-events-none" />

      {isPlayingAudio && (
        <div className="absolute inset-0 bg-emerald-950/20 mix-blend-overlay pointer-events-none animate-ping" />
      )}

      {/* Interactive Hotspots Layer */}
      <div className="absolute inset-0 z-20 pointer-events-auto">
        {/* Hotspot 1: Portable Micro-Cassette Player */}
        <InteractiveHotspot
          id="well_cassette_player"
          name="Micro-Cassette Player"
          cursorTooltip={getPlayerTooltip()}
          polygonPoints="44,58 56,58 56,74 44,74"
          onClick={handleCassettePlayer}
        />

        {/* Hotspot 2: Drainage Storm Culvert Gate */}
        <InteractiveHotspot
          id="well_storm_conduit"
          name="Drainage Storm Conduit Grating"
          cursorTooltip={getConduitTooltip()}
          polygonPoints="32,38 43,38 43,58 32,58"
          onClick={handleStormConduitGrating}
        />

        {/* Hotspot 3: Shaft Brick Walls */}
        <InteractiveHotspot
          id="well_shaft_walls"
          name="Ancient Shaft Walls"
          cursorTooltip="[Inspect Well Brickwork]"
          polygonPoints="10,10 90,10 90,35 10,35"
          onClick={handleShaftWalls}
        />
      </div>
    </div>
  );
};

export default WellInteriorDeepView;