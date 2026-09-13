import React, { useEffect } from 'react';
import { InteractiveHotspot } from './InteractiveHotspot';
import { useGameStore } from '../store/useGameStore';
import { sound } from '../utils/audio';
import { Phase3Location } from '../types';

export interface HostelOuterGroundsViewProps {
  onNavigate?: (location: string) => void;
  setActiveMonologue: (text: string | null) => void;
  addDiscoveredClue?: (clueId: string) => void;
  setPhase3Location?: (loc: Phase3Location) => void;
  onReturn?: () => void;
}

export const HostelOuterGroundsView: React.FC<HostelOuterGroundsViewProps> = ({
  onNavigate,
  setActiveMonologue,
  addDiscoveredClue,
  setPhase3Location,
  onReturn,
}) => {
  const { chapter3IntroSeen, setChapter3IntroSeen } = useGameStore();

  useEffect(() => {
    try {
      sound.playRainOutdoor?.();
    } catch {}

    if (!chapter3IntroSeen) {
      setActiveMonologue(
        "The monsoon rain hits with a roar. The hostel stands locked and dark behind us... and the main perimeter gate is chained shut from the street. There must be another way out."
      );
      setChapter3IntroSeen(true);
    }
    addDiscoveredClue?.('clue_escaped_to_outer_grounds');
  }, [chapter3IntroSeen, setActiveMonologue, setChapter3IntroSeen, addDiscoveredClue]);

  const handleReturnToStairway = () => {
    try {
      sound.playDoorCreak?.();
    } catch {}
    if (onNavigate) {
      onNavigate('balcony_stairway_gate');
    } else if (setPhase3Location) {
      setPhase3Location('west_split_landing');
    } else if (onReturn) {
      onReturn();
    }
  };

  const handleInspectCompoundGate = () => {
    try {
      sound.playGateRattle?.();
    } catch {}
    if (onNavigate) {
      onNavigate('compound_iron_gate');
    } else if (setPhase3Location) {
      setPhase3Location('compound_iron_gate');
    }
    setActiveMonologue(
      "— The massive iron compound gate is bound in heavy padlocks and overgrown thorns. Beyond lies the unpaved mud road leading toward Mawlamyine. —"
    );
  };

  const handleEnterGarage = () => {
    try {
      sound.playFootstep?.();
    } catch {}
    if (onNavigate) {
      onNavigate('garage_subterranean');
    } else if (setPhase3Location) {
      setPhase3Location('garage_subterranean');
    }
    setActiveMonologue(
      "— A slick concrete ramp descends into the flooded bicycle garage below. The smell of oil and stagnant water wafts up from the dark. —"
    );
  };

  const handleInspectBanyanWell = () => {
    try {
      sound.playFootstep?.();
    } catch {}
    if (onNavigate) {
      onNavigate('banyan_wellhead');
    } else if (setPhase3Location) {
      setPhase3Location('banyan_wellhead');
    }
    setActiveMonologue(
      "— The twisted roots of the ancient banyan tree encircle the stone well. Deep whispers bubble up from the dark water below... —"
    );
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-black">
      {/* Background Graphic */}
      <img
        src="/assets/scenes/hostel_outer_grounds_rain.jpg"
        alt="Hostel Outer Grounds"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        onError={(e) => {
          e.currentTarget.src = 'assets/scenes/hostel_outer_grounds_rain.jpg';
        }}
      />

      {/* Atmospheric Weather Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/60 pointer-events-none" />

      {/* Interactive Hotspots Layer — pointer-events-auto guarantees hitboxes stay active after returning */}
      <div className="absolute inset-0 z-20 pointer-events-auto">
        {/* Hotspot 1: Return to Building / Stairway */}
        <InteractiveHotspot
          id="grounds_stairway_exit"
          name="Return to Stairway Entrance"
          cursorTooltip="Return to Stairway Entrance"
          polygonPoints="0,32 15,30 15,65 0,65"
          onClick={handleReturnToStairway}
        />

        {/* Hotspot 2: Main Compound Gate */}
        <InteractiveHotspot
          id="grounds_compound_gate"
          name="Perimeter Compound Gate"
          cursorTooltip="Examine Compound Gate"
          polygonPoints="34,22 57,22 57,65 34,65"
          onClick={handleInspectCompoundGate}
        />

        {/* Hotspot 3: Subterranean Bicycle Garage Ramp */}
        <InteractiveHotspot
          id="grounds_garage_ramp"
          name="Subterranean Garage Ramp"
          cursorTooltip="Descend into Garage"
          polygonPoints="1,66 28,66 43,80 32,99 0,99"
          onClick={handleEnterGarage}
        />

        {/* Hotspot 4: Ancient Banyan Tree & Well Curb */}
        <InteractiveHotspot
          id="grounds_banyan_well"
          name="Ancient Banyan Tree & Well"
          cursorTooltip="Approach Banyan Tree & Well"
          polygonPoints="58,0 100,0 100,92 58,92"
          onClick={handleInspectBanyanWell}
        />
      </div>
    </div>
  );
};

export const OuterGroundsView = HostelOuterGroundsView;
export type OuterGroundsViewProps = HostelOuterGroundsViewProps;
export default HostelOuterGroundsView;