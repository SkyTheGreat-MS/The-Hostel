import React, { useEffect } from 'react';
import { InteractiveHotspot } from './InteractiveHotspot';
import { sound } from '../utils/audio';

export interface CompoundGateInspectionViewProps {
  onReturn?: () => void;
  setActiveMonologue: (text: string | null) => void;
}

export const CompoundGateInspectionView: React.FC<CompoundGateInspectionViewProps> = ({
  onReturn,
  setActiveMonologue,
}) => {
  useEffect(() => {
    try {
      sound.playRainOutdoor?.();
    } catch {}

    setActiveMonologue(
      "The iron gates are wrapped tight in oxidized chains and padlocked from the street side. Escape through the front is impossible."
    );
  }, [setActiveMonologue]);

  const handleInspectChains = () => {
    try {
      sound.playGateRattle?.();
    } catch {}
    setActiveMonologue(
      "Heavy industrial chains loop through every bar. The brass padlock hangs on the exterior side—it was locked from the outside."
    );
  };

  const handleInspectSign = () => {
    try {
      sound.playPaperRustle?.();
    } catch {}
    setActiveMonologue(
      "A weathered enameled sign: 'ကျောင်းဝင်းအတွင်း ခွင့်ပြုချက်မရှိဘဲ မဝင်ရ' (No unauthorized entry into university grounds)."
    );
  };

  const handleInspectStreet = () => {
    try {
      sound.playFootstep?.();
    } catch {}
    setActiveMonologue(
      "Beyond the bars lies the empty asphalt perimeter road, glistening under the dark rain. So close, yet completely out of reach."
    );
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-black">
      {/* Background Graphic */}
      <img
        src="/assets/scenes/compound_iron_gate_inspection.jpg"
        alt="Perimeter Compound Gate Close-up"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        onError={(e) => {
          e.currentTarget.src = 'assets/scenes/compound_iron_gate_inspection.jpg';
        }}
      />

      {/* Atmospheric Weather Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />

      {/* Interactive Hotspots Layer */}
      <div className="absolute inset-0 z-20 pointer-events-auto">
        {/* Hotspot 1: Center Chains & Exterior Padlock */}
        <InteractiveHotspot
          id="gate_chains_padlock"
          name="Padlocked Industrial Chains"
          cursorTooltip="Examine Locked Chains"
          polygonPoints="38,30 62,30 65,72 35,72"
          onClick={handleInspectChains}
        />

        {/* Hotspot 2: Vintage Burmese Warning Sign */}
        <InteractiveHotspot
          id="gate_warning_sign"
          name="Enameled Metal Sign"
          cursorTooltip="Read Metal Sign"
          polygonPoints="18,36 32,36 32,54 18,54"
          onClick={handleInspectSign}
        />

        {/* Hotspot 3: Street Beyond the Bars */}
        <InteractiveHotspot
          id="gate_outside_view"
          name="Perimeter Street"
          cursorTooltip="Look Past the Gate"
          polygonPoints="42,8 58,8 58,28 42,28"
          onClick={handleInspectStreet}
        />
      </div>
    </div>
  );
};

export default CompoundGateInspectionView;
