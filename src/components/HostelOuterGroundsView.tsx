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
        "မုတ်သုံမိုးက တဝုန်းဝုန်း ရွာချနေသည်။ ငါတို့နောက်ဘက်ရှိ အဆောင်ကြီးမှာ အမှောင်ဖုံးကာ သော့ခတ်ထားဆဲဖြစ်ပြီး... လမ်းမဘက်သို့ ထွက်ရမည့် ပင်မခြံဝင်းတံခါးကြီးကိုလည်း သံကြိုးများဖြင့် ခတ်ထားသည်။ အခြားထွက်ပေါက်တစ်ခုခု ရှိရမည်။"
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
      "— ကြီးမားလှသော သံမဏိခြံစည်းရိုးတံခါးကြီးကို လေးလံသော သော့ခလောက်များနှင့် ချုံနွယ်ဆူးပင်များ ရစ်ပတ်ထားသည်။ တံခါးအလွန်တွင် မော်လမြိုင်ဘက်သို့ ဦးတည်သော ရွှံ့ဗွက်လမ်းမကြီး ရှိသည်။ —"
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
      "— ချောမွတ်နေသော ကွန်ကရစ်ဆင်ခြေလျှောသည် အောက်ဘက်ရှိ ရေလျှံနေသော စက်ဘီးဂိုဒေါင်ဆီသို့ ဦးတည်ဆင်းသွားသည်။ အမှောင်ထဲမှ စက်ဆီနံ့နှင့် ရေပုပ်နံ့များ ပျံ့လွင့်လာသည်။ —"
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
      "— ရှေးဟောင်းညောင်ပင်ကြီး၏ လိမ်ယှက်နေသော ညောင်မြစ်များက ကျောက်ရေတွင်းကို ရစ်ပတ်ထားသည်။ အောက်ဘက် အမှောင်ထုထဲရှိ ရေပြင်မှ တိုးတိတ်သော တီးတိုးသံများ ပွက်ပွက်ထွက်ပေါ်နေသည်... —"
    );
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-black">
      {/* Background Graphic */}
      <img
        src="/assets/scenes/hostel_outer_grounds_rain.jpg"
        alt="မြေညီထပ် အဆောင်ဝင်းနှင့် ခြံဝတံခါး"
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
          name="လှေကားအဝင်ဝသို့ ပြန်သွားရန်"
          cursorTooltip="လှေကားအဝင်ဝသို့ ပြန်သွားမည်"
          polygonPoints="5,38 12,38 12,62 5,62"
          onClick={handleReturnToStairway}
        />

        {/* Hotspot 2: Main Compound Gate */}
        <InteractiveHotspot
          id="grounds_compound_gate"
          name="နယ်နိမိတ် ခြံဝတံခါး"
          cursorTooltip="ခြံဝင်းတံခါးကြီးကို စစ်ဆေးမည်"
          polygonPoints="46,42 57,42 57,56 46,56"
          onClick={handleInspectCompoundGate}
        />

        {/* Hotspot 3: Subterranean Bicycle Garage Ramp */}
        <InteractiveHotspot
          id="grounds_garage_ramp"
          name="မြေအောက်ကားဂိုဒေါင် လျှောစောက်လမ်း"
          cursorTooltip="ဂိုဒေါင်ထဲသို့ ဆင်းသွားမည်"
          polygonPoints="28,64 40,64 33,80 28,80"
          onClick={handleEnterGarage}
        />

        {/* Hotspot 4: Ancient Banyan Tree & Well Curb */}
        <InteractiveHotspot
          id="grounds_banyan_well"
          name="ရှေးဟောင်း ညောင်ပင်နှင့် ရေတွင်း"
          cursorTooltip="ညောင်ပင်ကြီးနှင့် ရေတွင်းဆီသို့ ချဉ်းကပ်မည်"
          polygonPoints="61,10 90,10 90,80 61,80"
          onClick={handleInspectBanyanWell}
        />
      </div>
    </div>
  );
};

export const OuterGroundsView = HostelOuterGroundsView;
export type OuterGroundsViewProps = HostelOuterGroundsViewProps;
export default HostelOuterGroundsView;