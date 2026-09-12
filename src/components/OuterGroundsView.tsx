import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { sound } from '../audioEngine';
import { SceneNavBar } from './SceneNavBar';
import { ThoughtLine } from './common/ThoughtLine';
import { MONOLOGUE_LINES } from '../data/dialogues';
import { Phase3Location } from '../types';

export interface OuterGroundsViewProps {
  setActiveMonologue?: (msg: string | null) => void;
  addDiscoveredClue?: (clueId: string) => void;
  onReturn?: () => void;
  setPhase3Location?: (loc: Phase3Location) => void;
}

const ARRIVAL_THOUGHT =
  '— "The monsoon rain hits hard outside the shelter of the corridor. The hostel stands dark and shuttered behind... and the main iron compound gate is chained ahead." —';

/**
 * OuterGroundsView (HostelOuterGroundsView) — Chapter 3 Exterior / Hostel Outer Grounds
 *
 * Rendered when the player unlocks the Stairway Exit Gate and escapes into
 * the stormy courtyard grounds.
 */
export const OuterGroundsView: React.FC<OuterGroundsViewProps> = ({
  setActiveMonologue,
  addDiscoveredClue,
  onReturn,
  setPhase3Location,
}) => {
  const [activeThought, setActiveThought] = useState<string | null>(ARRIVAL_THOUGHT);

  useEffect(() => {
    sound.stopAllAmbience();
    sound.playMonsoonOutdoorAmbience();
    setActiveThought(ARRIVAL_THOUGHT);
    if (setActiveMonologue) {
      setActiveMonologue(ARRIVAL_THOUGHT);
    }
    addDiscoveredClue?.('clue_escaped_to_outer_grounds');

    return () => {
      sound.stopAllAmbience();
    };
  }, [setActiveMonologue, addDiscoveredClue]);

  const handleReturn = () => {
    try {
      sound.playPaperRustle();
    } catch {}
    if (onReturn) {
      onReturn();
    } else if (setPhase3Location) {
      setPhase3Location('stairway_gate_inspection');
    }
  };

  const handleDismissThought = () => {
    setActiveThought(null);
    setActiveMonologue?.(null);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-black pointer-events-auto">
      {/* Background Image: Chapter 3 Exterior / Grounds */}
      <img
        src="/assets/scenes/hostel_outer_grounds_rain.jpg"
        onError={(e) => {
          e.currentTarget.src = 'assets/scenes/hostel_outer_grounds_rain.jpg';
        }}
        alt="Hostel Outer Grounds Rain"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50 pointer-events-none" />

      {/* Atmospheric rain overlay effect */}
      <div className="absolute inset-0 bg-blue-950/10 pointer-events-none backdrop-brightness-95" />

      {/* Standardized Scene Navigation Bar */}
      <SceneNavBar
        onReturn={handleReturn}
        returnDestination="STAIRWAY GATE"
        areaZone="GROUND FLOOR EXTERIOR"
        areaName="HOSTEL COURTYARD & COMPOUND GATE"
      />

      {/* Interactive Hotspots */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* 0. Return to Stairway Gate (Exterior Stairs Threshold) */}
          <g
            className="group/stairs pointer-events-auto cursor-pointer"
            onClick={handleReturn}
            onMouseEnter={() => sound.playMenuHover()}
          >
            <polygon
              points="0,15 18,15 24,70 0,70"
              className="fill-transparent stroke-transparent transition-all duration-300 group-hover/stairs:stroke-emerald-400/80 group-hover/stairs:stroke-[0.6] group-hover/stairs:fill-emerald-500/10 group-hover/stairs:filter group-hover/stairs:drop-shadow-[0_0_12px_rgba(110,231,183,0.4)]"
            />
            <title>[Return to Stairway Gate]</title>
          </g>

          {/* 1. Main Iron Compound Gate */}
          <g
            className="group/gate pointer-events-auto cursor-pointer"
            onClick={() => {
              sound.playLockJiggle();
              const msg =
                '— "The massive iron compound gate. Bound in heavy padlocks and overgrown thorns. Beyond lies the unpaved mud road leading toward Mawlamyine." —';
              setActiveThought(msg);
              setActiveMonologue?.(msg);
              addDiscoveredClue?.('clue_compound_gate_inspected');
            }}
            onMouseEnter={() => sound.playMenuHover()}
          >
            <polygon
              points="62,35 88,32 86,72 63,68"
              className="fill-transparent stroke-transparent transition-all duration-300 group-hover/gate:stroke-emerald-400/80 group-hover/gate:stroke-[0.6] group-hover/gate:fill-emerald-500/10 group-hover/gate:filter group-hover/gate:drop-shadow-[0_0_12px_rgba(110,231,183,0.4)]"
            />
            <title>[Examine Chained Compound Gate]</title>
          </g>

          {/* 2. Ancient Banyan & Dry Well */}
          <g
            className="group/well pointer-events-auto cursor-pointer"
            onClick={() => {
              sound.playGhostWhisper();
              const msg =
                '— "The twisted roots of the old banyan tree encircle the stone well. Deep whispers bubble up from the dark water below..." —';
              setActiveThought(msg);
              setActiveMonologue?.(msg);
              addDiscoveredClue?.('clue_banyan_well_inspected');
            }}
            onMouseEnter={() => sound.playMenuHover()}
          >
            <polygon
              points="10,48 38,45 42,75 8,78"
              className="fill-transparent stroke-transparent transition-all duration-300 group-hover/well:stroke-amber-400/80 group-hover/well:stroke-[0.6] group-hover/well:fill-amber-500/10 group-hover/well:filter group-hover/well:drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]"
            />
            <title>[Examine Ancient Banyan & Well]</title>
          </g>

          {/* 3. Flooded Courtyard Grounds */}
          <g
            className="group/courtyard pointer-events-auto cursor-pointer"
            onClick={() => {
              sound.playWaterDrop();
              const msg =
                '— "Rain collects in reddish puddles across the gravel. Mud and crushed leaves plaster the soles of your shoes." —';
              setActiveThought(msg);
              setActiveMonologue?.(msg);
            }}
            onMouseEnter={() => sound.playMenuHover()}
          >
            <polygon
              points="35,68 65,68 75,95 20,95"
              className="fill-transparent stroke-transparent transition-all duration-300 group-hover/courtyard:stroke-blue-400/60 group-hover/courtyard:stroke-[0.5] group-hover/courtyard:fill-blue-500/10"
            />
            <title>[Inspect Rain-Swept Courtyard]</title>
          </g>
        </svg>

        {/* Floating chapter tag badge */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none select-none text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="px-4 py-1.5 rounded-full bg-[#0b1410]/80 border border-emerald-500/40 backdrop-blur-sm"
          >
            <span className="font-mono text-[10px] tracking-[0.25em] text-emerald-300 uppercase">
              CHAPTER 3 • THE OUTSIDE GROUNDS
            </span>
          </motion.div>
        </div>
      </div>

      {/* Arrival / Exploration Thought Monologue */}
      <ThoughtLine message={activeThought} onDismiss={handleDismissThought} />
    </div>
  );
};

export const HostelOuterGroundsView = OuterGroundsView;
export type HostelOuterGroundsViewProps = OuterGroundsViewProps;
export default OuterGroundsView;
