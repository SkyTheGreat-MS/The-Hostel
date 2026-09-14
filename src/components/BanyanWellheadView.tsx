import React, { useEffect } from 'react';
import { InteractiveHotspot } from './InteractiveHotspot';
import { sound } from '../utils/audio';
import { useGameStore } from '../context/GameProgressContext';
import { PrologBridge } from '../services/PrologBridge';

export interface BanyanWellheadViewProps {
  onReturn?: () => void;
  onNavigate?: (destination: string) => void;
  setActiveMonologue: (text: string | null) => void;
}

export const BanyanWellheadView: React.FC<BanyanWellheadViewProps> = ({
  onNavigate,
  setActiveMonologue,
}) => {
  const {
    inventory,
    removeFromInventory,
    wellRootsSevered,
    setWellRootsSevered,
    wellPulleyRigged,
    setWellPulleyRigged,
    wellRopeRigged,
    setWellRopeRigged,
  } = useGameStore();

  const hasMachete = inventory.includes('rusty_machete');
  const hasPulley = inventory.includes('iron_pulley');
  const hasRope = inventory.includes('coiled_nylon_rope') || inventory.includes('nylon_rope');

  useEffect(() => {
    try {
      (sound as any).playRainOutdoor?.();
    } catch {}

    if (!wellRootsSevered) {
      setActiveMonologue(
        "Ancient aerial roots from the sacred banyan tree twist tightly around the stone mouth of the well, choking off the entrance like iron bars."
      );
    } else if (!wellPulleyRigged || !wellRopeRigged) {
      setActiveMonologue(
        "The constricting roots have been cleared, exposing the dark masonry of the wellhead. The shaft plunges deep into the earth."
      );
    } else {
      setActiveMonologue(
        "The cast-iron pulley and climbing rope are rigged firmly over the wellhead. The line hangs taut into the abyss, ready for descent."
      );
    }
  }, [setActiveMonologue, wellRootsSevered, wellPulleyRigged, wellRopeRigged]);

  const handleOverheadBranch = async () => {
    if (!wellRootsSevered) {
      try {
        (sound as any).playMetalCreak?.();
      } catch {}
      setActiveMonologue(
        "A rusted iron eye-bolt is forged into the underside of the heavy banyan limb directly over the well shaft. But the dense mass of tangled aerial roots below makes it impossible to work safely. Clear the roots first."
      );
      return;
    }

    if (!wellPulleyRigged) {
      if (hasPulley) {
        try {
          (sound as any).playGateRattle?.();
        } catch {}
        try {
          await PrologBridge.mountWellPulley();
        } catch {}
        if (removeFromInventory) {
          removeFromInventory('iron_pulley');
        }
        setWellPulleyRigged(true);
        setActiveMonologue(
          "— You hoist the heavy cast-iron pulley and slip it onto the ancient forged eye-bolt. It seats firmly with a dull metallic clank. —"
        );
      } else {
        try {
          (sound as any).playMetalCreak?.();
        } catch {}
        setActiveMonologue(
          "— A heavy forged iron eye-bolt hangs directly over the center of the well shaft. A pulley could be mounted here to support descent into the depths. —"
        );
      }
      return;
    }

    if (!wellRopeRigged) {
      if (hasRope) {
        const ropeItem = inventory.find((i) => i === 'coiled_nylon_rope' || i === 'nylon_rope') || 'nylon_rope';
        try {
          (sound as any).playInventoryAdd?.();
        } catch {}
        try {
          await PrologBridge.rigWellRope();
        } catch {}
        if (removeFromInventory) {
          removeFromInventory(ropeItem);
        }
        setWellRopeRigged(true);
        setActiveMonologue(
          "— You thread the sturdy nylon climbing rope through the grooved pulley wheel and knot it securely. The weighted line drops straight down into the flooded depths below. —"
        );
      } else {
        try {
          (sound as any).playMetalCreak?.();
        } catch {}
        setActiveMonologue(
          "— The cast-iron pulley hangs securely from the overhead limb. You need a strong climbing line or nylon rope to thread through the wheel. —"
        );
      }
      return;
    }

    try {
      (sound as any).playInventoryAdd?.();
    } catch {}
    setActiveMonologue(
      "— The pulley and braided nylon line are rigged and anchored securely. The line is taut and ready to bear your weight down into the well. —"
    );
  };

  const handleWellCurb = async () => {
    if (!wellRootsSevered) {
      if (hasMachete) {
        try {
          (sound as any).playWoodChop?.();
        } catch {
          try {
            (sound as any).playPaperRustle?.();
          } catch {}
        }
        try {
          await PrologBridge.cutBanyanRoots();
        } catch {}
        setWellRootsSevered(true);
        setActiveMonologue(
          "— You swing the heavy rusted machete into the thick tangle of aerial banyan roots. Splintered tendrils snap away, revealing the open stone wellhead beneath! —"
        );
      } else {
        try {
          (sound as any).playDrip?.();
        } catch {}
        setActiveMonologue(
          "— Thick, woody banyan roots have grown across the stone mouth of the well like iron bars. You cannot reach the shaft without cutting them away with a heavy blade. —"
        );
      }
      return;
    }

    if (!wellPulleyRigged || !wellRopeRigged) {
      try {
        (sound as any).playDrip?.();
      } catch {}
      setActiveMonologue(
        "— The severed roots hang limp around the cracked masonry. The shaft drops vertically into pitch blackness and rushing subterranean water. Dropping down without a rigged line would be fatal. —"
      );
      return;
    }

    // Descent ready
    try {
      (sound as any).playDoorUnlock?.();
      (sound as any).playFootstep?.();
    } catch {}
    try {
      await PrologBridge.queryOnce('descend_into_well.');
    } catch {}
    setActiveMonologue(
      "— Gripping the nylon line firmly, you step over the moss-slick stone curb and rappel down into the echoing black depths of the well shaft... —"
    );
    if (onNavigate) {
      onNavigate('well_interior_deep');
    }
  };

  const getBranchTooltip = (): string => {
    if (!wellRootsSevered) {
      return "[Examine Overhead Eye-Bolt]";
    }
    if (!wellPulleyRigged) {
      return hasPulley ? "[Mount Cast-Iron Pulley]" : "[Examine Overhead Eye-Bolt]";
    }
    if (!wellRopeRigged) {
      return hasRope ? "[Rig Climbing Rope]" : "[Examine Rigged Pulley]";
    }
    return "[Examine Rigged Hoist]";
  };

  const getWellTooltip = (): string => {
    if (!wellRootsSevered) {
      return hasMachete ? "[Sever Aerial Roots with Machete]" : "[Examine Choked Wellhead]";
    }
    if (!wellPulleyRigged || !wellRopeRigged) {
      return "[Inspect Dark Well Shaft]";
    }
    return "[Descend into Well]";
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-black">
      {/* Background Graphic */}
      <img
        src="/assets/scenes/banyan_wellhead_exterior.jpg"
        alt="Banyan Wellhead & Ancient Tree"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        onError={(e) => {
          e.currentTarget.src = 'assets/scenes/banyan_wellhead_exterior.jpg';
        }}
      />

      {/* Background Vignette / Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none z-10" />

      {/* Interactive Hotspots Layer */}
      <div className="absolute inset-0 z-20 pointer-events-auto">
        {/* Hotspot 1: Overhanging Branch / Iron Eye-Bolt */}
        <InteractiveHotspot
          id="banyan_overhead_branch"
          name="Overhanging Branch & Iron Eye-Bolt"
          polygonPoints="68,14 78,14 78,64 68,64"
          cursorTooltip={getBranchTooltip()}
          onClick={handleOverheadBranch}
        />

        {/* Hotspot 2: Ancient Wellhead Curb & Unsealed Shaft */}
        <InteractiveHotspot
          id="banyan_well_curb"
          name="Ancient Wellhead Curb & Shaft"
          polygonPoints="60,68 95,68 95,95 60,95"
          cursorTooltip={getWellTooltip()}
          onClick={handleWellCurb}
        />
      </div>
    </div>
  );
};

export default BanyanWellheadView;