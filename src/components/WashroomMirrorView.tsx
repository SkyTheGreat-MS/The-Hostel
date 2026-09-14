import React, { useState } from 'react';
import { sound } from '../audioEngine';
import { InteractiveHotspot } from './InteractiveHotspot';
import { ThoughtLine } from './common/ThoughtLine';
import { SceneNavBar } from './SceneNavBar';

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

    const text = "— မှန်ဘောင်ပေါ်တွင် 'Locker 14 - 1998' ဟု ခြစ်ရေးထားသည်။ မှန်များ မကွဲအက်မီ တစ်စုံတစ်ယောက်က ဤမှတ်စုကို ချန်ထားခဲ့ခြင်း ဖြစ်သည်။ —";
    setActiveThought(text);
    setActiveMonologue?.(text);
  };

  const handleInspectGlass = () => {
    try {
      sound.playPaperRustle();
    } catch {}
    const text = "— အဆင်းမလှတော့သော မှန်ပြင်ပေါ်တွင် ပင့်ကူအိမ်သဖွယ် ကွဲအက်ရာများ ဖြာထွက်နေသည်။ ငါ့ရဲ့ ပုံရိပ်သည် ပုံပျက်နေသော အရိပ်ဒါဇင်ပေါင်းများစွာအဖြစ် အစိတ်စိတ်အမွှာမွှာ ကွဲကြေနေသည်။ —";
    setActiveThought(text);
    setActiveMonologue?.(text);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-black pointer-events-auto">
      {/* Navigation Bar */}
      <SceneNavBar
        onReturn={handleReturn}
        returnDestination="COMMUNAL WASHROOM"
        areaZone="WEST WING"
        areaName="CRACKED MIRROR"
      />
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
          polygonPoints="16.5,6 86.5,6 86.5,68 17.5,68"
          cursorTooltip="[ကွဲအက်နေသော မှန်ပြင်ကို စစ်ဆေးမည်]"
          onClick={handleInspectGlass}
        />

        {/* Bottom Mirror Frame Scrawl Inscription */}
        <InteractiveHotspot
          id="washroom_mirror_etching"
          name="Bottom Mirror Frame"
          polygonPoints="30,71 70,71 70,79 30,79"
          cursorTooltip={
            !isScratched
              ? '[အောက်ဘက် မှန်ဘောင်ကို သုတ်မည်]'
              : '[ခြစ်ရေးထားသော စာကို ဖတ်မည် - Locker 14 - 1998]'
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
