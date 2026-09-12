import React, { useState } from 'react';
import { sound } from '../audioEngine';
import { InteractiveHotspot } from './InteractiveHotspot';
import { ThoughtLine } from './common/ThoughtLine';

export interface WashroomMirrorViewProps {
  onReturn: () => void;
  setActiveMonologue?: (msg: string | null) => void;
  addDiscoveredClue?: (clueId: string) => void;
  washroomMirrorScratched?: boolean;
  setWashroomMirrorScratched?: (val: boolean | ((prev: boolean) => boolean)) => void;
}

/**
 * WashroomMirrorView (CrackedMirrorInspectionView) — Communal Washroom Cracked Mirror Zoom
 *
 * Displays the shattered wall mirror with the hidden etched inscription:
 * "Locker 14 - 1998".
 */
export const WashroomMirrorView: React.FC<WashroomMirrorViewProps> = ({
  onReturn,
  setActiveMonologue,
  addDiscoveredClue,
  washroomMirrorScratched: propScratched,
  setWashroomMirrorScratched: propSetScratched,
}) => {
  const [isScratched, setIsScratched] = useState<boolean>(Boolean(propScratched));
  const [activeThought, setActiveThought] = useState<string | null>(null);

  const handleReturn = () => {
    try {
      sound.playDoorCreak();
    } catch {
      try {
        sound.playPaperRustle();
      } catch {}
    }
    onReturn();
  };

  const handleInspectEtching = () => {
    setIsScratched(true);
    propSetScratched?.(true);
    addDiscoveredClue?.('mirror_locker_scrawl');
    try {
      sound.playPaperRustle();
    } catch {}

    const text = "— 'Locker 14 - 1998' scratched into the frame. Someone left this note before the mirrors shattered. —";
    setActiveThought(text);
    setActiveMonologue?.(text);
  };

  const handleInspectGlass = () => {
    try {
      sound.playPaperRustle();
    } catch {}
    const text = "— Spiderweb fractures branch across the tarnished glass. My reflection is fractured into dozens of distorted shadows. —";
    setActiveThought(text);
    setActiveMonologue?.(text);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-black pointer-events-auto">
      {/* 1. Background Artwork with pointer-events-none */}
      <img
        src="/assets/scenes/washroom_cracked_mirror.jpg"
        onError={(e) => {
          e.currentTarget.src = '/assets/scenes/washroom_mirror_zoom.jpg';
        }}
        alt="Cracked Mirror"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50 pointer-events-none" />

      {/* 2. Interactive Hotspots Layer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none">
        {/* Mirror Shattered Glass Surface */}
        <InteractiveHotspot
          id="washroom_mirror_glass"
          name="Shattered Wall Mirror"
          polygonPoints="22,12 78,12 82,68 18,68"
          cursorTooltip="[Inspect Shattered Glass]"
          onClick={handleInspectGlass}
        />

        {/* Bottom Mirror Frame Scrawl Inscription */}
        <InteractiveHotspot
          id="washroom_mirror_etching"
          name="Bottom Mirror Frame"
          polygonPoints="15,71 85,71 88,79 12,79"
          cursorTooltip={
            !isScratched
              ? '[Wipe Bottom Mirror Frame]'
              : '[Read Etched Scrawl: Locker 14 - 1998]'
          }
          onClick={handleInspectEtching}
        />
      </div>

      {/* 4. Thought Line Monologue */}
      <ThoughtLine
        message={activeThought}
        onDismiss={() => {
          setActiveThought(null);
          setActiveMonologue?.(null);
        }}
      />
    </div>
  );
};

export const CrackedMirrorInspectionView = WashroomMirrorView;
export type CrackedMirrorInspectionViewProps = WashroomMirrorViewProps;
export default WashroomMirrorView;
