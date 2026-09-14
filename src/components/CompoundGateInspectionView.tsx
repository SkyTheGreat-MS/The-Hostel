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
      "သံတံခါးကြီးများကို သံချေးတက်နေသော သံကြိုးများဖြင့် တင်းကျပ်စွာ ပတ်ထားပြီး လမ်းဘက်မှ သော့ခတ်ထားသည်။ အရှေ့ဘက်မှ ထွက်ပြေးရန် မဖြစ်နိုင်ပေ။"
    );
  }, [setActiveMonologue]);

  const handleInspectChains = () => {
    try {
      sound.playGateRattle?.();
    } catch {}
    setActiveMonologue(
      "လေးလံသော စက်မှုသုံးသံကြိုးများသည် တံခါးတိုင်တစ်ခုချင်းစီကို ရစ်ပတ်ထားသည်။ ကြေးဝါသော့ခလောက်သည် အပြင်ဘက်ခြမ်းတွင် တွဲလောင်းကျနေသည် — ၎င်းကို အပြင်ဘက်မှ သော့ခတ်ထားခဲ့ခြင်း ဖြစ်သည်။"
    );
  };

  const handleInspectSign = () => {
    try {
      sound.playPaperRustle?.();
    } catch {}
    setActiveMonologue(
      "ရာသီဥတုဒဏ်ခံ သံကြွေဆိုင်းဘုတ် - 'ကျောင်းဝင်းအတွင်း ခွင့်ပြုချက်မရှိဘဲ မဝင်ရ'။"
    );
  };

  const handleInspectStreet = () => {
    try {
      sound.playFootstep?.();
    } catch {}
    setActiveMonologue(
      "သံတိုင်များအလွန်တွင် မိုးရေထဲ၌ အရောင်လက်နေသော ကတ္တရာပတ်လမ်းမကြီး တိတ်ဆိတ်စွာ ရှိနေသည်။ အလွန်နီးကပ်နေသော်လည်း လုံးဝ လက်လှမ်းမမီနိုင်ပေ။"
    );
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-black">
      {/* Background Graphic */}
      <img
        src="/assets/scenes/compound_iron_gate_inspection.jpg"
        alt="အဆောင် နယ်နိမိတ် ခြံဝတံခါး"
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
          name="သော့ခတ်ထားသော သံကြိုးကြီးများ"
          cursorTooltip="သော့ခတ်ထားသော သံကြိုးများကို စစ်ဆေးမည်"
          polygonPoints="38,30 62,30 65,72 35,72"
          onClick={handleInspectChains}
        />

        {/* Hotspot 2: Vintage Burmese Warning Sign */}
        <InteractiveHotspot
          id="gate_warning_sign"
          name="သံကြွေသတိပေးဆိုင်းဘုတ်"
          cursorTooltip="သတိပေးဆိုင်းဘုတ်ကို ဖတ်ရှုမည်"
          polygonPoints="18,36 32,36 32,54 18,54"
          onClick={handleInspectSign}
        />

        {/* Hotspot 3: Street Beyond the Bars */}
        <InteractiveHotspot
          id="gate_outside_view"
          name="အပြင်ဘက် လမ်းမကြီး"
          cursorTooltip="တံခါးအပြင်ဘက်ကို ကြည့်ရှုမည်"
          polygonPoints="42,8 58,8 58,28 42,28"
          onClick={handleInspectStreet}
        />
      </div>
    </div>
  );
};

export default CompoundGateInspectionView;
