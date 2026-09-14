import React, { useEffect, useState } from 'react';
import { InteractiveHotspot } from './InteractiveHotspot';
import { SceneNavBar } from './SceneNavBar';
import { GarageValveMiniGame } from './GarageValveMiniGame';
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
  const [isValveGameOpen, setIsValveGameOpen] = useState(false);

  const hasPulley = inventory.includes('iron_pulley');
  const hasMachete = inventory.includes('rusty_machete');

  useEffect(() => {
    try {
      sound.playDrip?.();
    } catch {}

    if (!garageDrained) {
      setActiveMonologue(
        "ရေလျှံနေသော မြေအောက်စက်ဘီးဂိုဒေါင်ထဲတွင် သံချေးနံ့နှင့် မိုးရေပုပ်နံ့များ လှိုက်တက်နေသည်။ မှောင်မည်းသော ရေမျက်နှာပြင်အောက်တွင် ၁၉၉၀ ပြည့်လွန်နှစ်များက စက်ဘီးတန်းကြီး ရေနစ်မြှုပ်နေသည်။"
      );
    } else {
      setActiveMonologue(
        "မြေအောက်ခန်းရှိ ရေများသည် ရေဆင်းသံဆန်ခါပေါက်များထဲသို့ စီးဆင်းခန်းခြောက်သွားပြီး ရွှံ့ညွန်နုန်းများနှင့် စိုစွတ်နေသော ကြမ်းခင်းကြွေပြားများ ပေါ်ထွက်လာသည်။"
      );
    }
  }, [setActiveMonologue, garageDrained]);

  const handleDrainValve = () => {
    if (garageDrained) {
      try {
        sound.playMetalCreak?.();
      } catch {}
      setActiveMonologue(
        "လေးလံသော သံအဆို့ရှင်ကို လှည့်ဖွင့်ထားပြီးဖြစ်သည်။ နောက်ကျိနေသော ရေဆိုးများသည် ရေဆင်းပေါက်များမှတစ်ဆင့် အကုန်အစင် စီးဆင်းသွားခဲ့ပြီ။"
      );
      return;
    }

    if (isDraining) return;

    // Launch focused valve-turning mini-game
    setIsValveGameOpen(true);
  };

  const handleValveGameComplete = () => {
    setIsDraining(true);

    if (drainGarage) {
      void drainGarage();
    } else {
      setGarageDrained(true);
    }
    useGameStore.setState({ garageDrained: true });

    setActiveMonologue(
      "သံချေးတက်နေသော သံမဏိသံကြီး အကျယ်ကြီး မြည်ဟည်းလျက် အဆို့ရှင်သည် အဆုံးထိ ပွင့်ထွက်သွားသည်! ရေလျှံမှုများသည် အောက်ဘက်ပိုက်လိုင်းများထဲသို့ လုံးဝ စီးဆင်းသွားပြီး စိုစွတ်နေသော ကြမ်းပြင်နှင့် အဆောင်မှူး၏ ကိရိယာလှောင်အိမ် ပေါ်ထွက်လာသည်!"
    );

    setTimeout(() => {
      setIsDraining(false);
    }, 1500);
  };

  const handleInspectBicycles = () => {
    if (isDraining) return;
    try {
      sound.playDrip?.();
    } catch {}
    setActiveMonologue(
      "ဆယ်စုနှစ်များစွာက ကျောင်းသူများ ထားရစ်ခဲ့သော သံချေးတက်နေသည့် ဖီးနစ် (Phoenix) နှင့် စာကလေး (Flying Pigeon) တံဆိပ် စက်ဘီးတန်းများ။ စက်ဘီးဒေါက်များတွင် ဆံပင်နက်များနှင့် ရွှံ့ညွန်များ ရစ်ပတ်နေသည်။"
    );
  };

  const handleInspectLog = () => {
    if (isDraining) return;
    try {
      sound.playPaperRustle?.();
    } catch {}
    setActiveMonologue(
      "ရေစိုနေသော စားပွဲပေါ်ရှိ မှိုတက်နေသော မှတ်တမ်းစာအုပ် - '၁၉၇၄ ရေလျှံမှု။ ညောင်ပင်ရေတွင်းဟောင်းအောက်ရှိ မြေအောက်ရေပြွန်ပေါက်ကို အသေပိတ်ဆို့ထားခဲ့သည်။ စက်သီးကြိုးတပ်ဆင်ပြီး ပိတ်ဆို့နေသော နွယ်ပင်များကို ခုတ်ထွင်ရှင်းလင်းမှသာ ရေနုတ်မြောင်းဆီသို့ လမ်းပွင့်မည်။'"
    );
  };

  const handleTakePulley = () => {
    if (isDraining) return;
    if (!garageDrained) {
      try {
        sound.playDrip?.();
      } catch {}
      setActiveMonologue(
        "နောက်ကျိနေသော ရေထဲတွင် သံစက်သီးတစ်လုံး နစ်မြုပ်ချိတ်ဆွဲနေသည်။ ရေမဖောက်မချင်း ဘေးကင်းစွာ လက်လှမ်းယူ၍ မရနိုင်ပေ။"
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
      "[သံသွန်းစက်သီးကြီး] ကို ရရှိခဲ့သည်။ ခိုင်မာသော သံမဏိချိတ်ပါသည့် သံသွန်းဘီးဖြစ်ပြီး နက်ရှိုင်းသော တွင်းပေါက်များထဲသို့ အလေးအပင်များ ချရန် အလွန်သင့်တော်သည်။"
    );
  };

  const handleTakeMachete = () => {
    if (isDraining) return;
    if (!garageDrained) {
      try {
        sound.playDrip?.();
      } catch {}
      setActiveMonologue(
        "ရေမြုပ်နေသော အလုပ်ခုံအောက်တွင် ဓားမကြီးတစ်လက် ညပ်နေသည်။ ရေနက်ထဲတွင် နစ်မြုပ်နေသဖြင့် လက်လှမ်းယူရန် မဖြစ်နိုင်သေးပေ။"
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
      "[သံချေးတက် ဓားမကြီး] ကို ရရှိခဲ့သည်။ ကာဗွန်သံမဏိသွား ပဲ့ရွဲ့သံချေးတက်နေသော်လည်း ထူထပ်သော ညောင်ပင်နွယ်များကို ခုတ်ထွင်ရန် လုံလောက်စွာ လေးလံလှသည်။"
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
        alt="မြေအောက်ကားဂိုဒေါင်"
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
      <div className={`absolute inset-0 z-20 ${isDraining ? 'opacity-50 pointer-events-none' : 'pointer-events-auto'}`}>
        {/* Hotspot 1: Drainage Valve Wheel */}
        <InteractiveHotspot
          id="garage_drain_valve"
          name="ရေနုတ်အဆို့ရှင်ဘီး"
          cursorTooltip={garageDrained ? "ပွင့်နေသော အဆို့ရှင်ကို စစ်ဆေးမည်" : "ရေနုတ်အဆို့ရှင်ကို လှည့်ဖွင့်မည်"}
          polygonPoints="12,45 22,45 22,62 12,62"
          onClick={handleDrainValve}
        />

        {/* Hotspot 2: Vintage 1990s Bicycles */}
        <InteractiveHotspot
          id="garage_bicycles"
          name="၁၉၉၀ ကျောင်းသူစက်ဘီးဟောင်းများ"
          cursorTooltip="ရေမြုပ်စက်ဘီးများကို စစ်ဆေးမည်"
          polygonPoints="25,55 58,55 60,88 23,88"
          onClick={handleInspectBicycles}
        />

        {/* Hotspot 3: Caretaker's Work Table & Log */}
        <InteractiveHotspot
          id="garage_caretaker_log"
          name="အဆောင်မှူး၏ ထိန်းသိမ်းရေးမှတ်တမ်း"
          cursorTooltip="အဆောင်မှူးမှတ်တမ်းကို ဖတ်ရှုမည်"
          polygonPoints="68,48 76,48 76,58 68,58"
          onClick={handleInspectLog}
        />

        {/* Hotspot 4: Heavy Iron Pulley (hidden if collected) */}
        {!hasPulley && (
          <InteractiveHotspot
            id="garage_tool_pulley"
            name="သံသွန်းစက်သီးကြီး"
            cursorTooltip={garageDrained ? "သံစက်သီးကို ယူမည်" : "ရေမြုပ်နေသော အရာကို ကြည့်မည်"}
            polygonPoints="77,52 84,52 84,65 77,65"
            onClick={handleTakePulley}
          />
        )}

        {/* Hotspot 5: Rusty Machete (hidden if collected) */}
        {!hasMachete && (
          <InteractiveHotspot
            id="garage_tool_machete"
            name="သံချေးတက် ဓားမကြီး"
            cursorTooltip={garageDrained ? "သံချေးတက်ဓားမကို ယူမည်" : "ရေမြုပ်နေသော ဓားကို ကြည့်မည်"}
            polygonPoints="85,42 93,42 93,68 85,68"
            onClick={handleTakeMachete}
          />
        )}
      </div>

      {/* Top Scene Navigation Bar */}
      <SceneNavBar
        onReturn={onReturn}
        returnDestination="အဆောင်ဝင်း (ဝင်း)"
        areaZone="မြေပြင် အပြင်ဘက်ဝင်း"
        areaName="မြေအောက် စက်ဘီးဂိုဒေါင်"
      />

      {/* Interactive Water Valve Turning Mini-Game Modal */}
      <GarageValveMiniGame
        isOpen={isValveGameOpen}
        onClose={() => setIsValveGameOpen(false)}
        onComplete={handleValveGameComplete}
      />
    </div>
  );
};

export default GarageSubterraneanView;