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
  const fallbackTimerRef = React.useRef<any>(null);
  const transitionTimerRef = React.useRef<any>(null);

  const hasMayTape = inventory.includes('cassette_tape_may');

  useEffect(() => {
    return () => {
      sound.stopMayCassetteSong();
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isPlayingAudio) return;
    if (!cassetteInserted) {
      setActiveMonologue(
        "ကျောက်ရေတွင်းဝခြေရင်းရှိ စိုစွတ်မှောင်မည်းနေသော ကြမ်းပြင်ပေါ်သို့ သင် ကြိုးလျှောဆင်းသက်လာသည်။ ခြောက်သွေ့နေသော ကျောက်ပြားပေါ်တွင် ၁၉၉၀ ပြည့်လွန်နှစ်များက မိုက်ခရို တိတ်ခွေဖွင့်စက်ဟောင်းတစ်ခု တိတ်ဆိတ်စွာ တည်ရှိနေသည်။"
      );
    } else if (!cassettePlayed) {
      setActiveMonologue(
        "မေ ၏ မိုက်ခရိုတိတ်ခွေကို စက်ထဲသို့ ထည့်သွင်းထားပြီးဖြစ်ကာ ဖွင့်ပြရန် စောင့်ဆိုင်းနေသည်။"
      );
    } else {
      setActiveMonologue(
        "တိတ်ခွေ၏ နောက်ဆုံးဝန်ခံချက်သည် အုတ်နံရံများတွင် ပဲ့တင်ထပ်သွားသည်။ သံချေးတက်နေသော လေးလံသည့် သံရေနုတ်မြောင်းတံခါးကြီး ပွင့်ထွက်သွားပြီး အပြင်သို့ ဦးတည်နေသည့် ဥမင်လှိုဏ်ခေါင်းနက်ကြီးတစ်ခု ပေါ်ထွက်လာသည်။"
      );
    }
  }, [cassetteInserted, cassettePlayed, isPlayingAudio, setActiveMonologue]);

  const triggerCassettePlayback = () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    try { (sound as any).playStatic?.(); } catch {}

    setActiveMonologue(
      "စပီကာငယ်လေးထဲမှ လေလှိုင်းဆူညံသံ ထွက်ပေါ်လာပြီးနောက် မေ ၏ တိတ်ခွေသီချင်းသံနှင့်အတူ ၁၉၉၈ သြဂုတ် ၁၂ တွင် အသံသွင်းထားသော တုန်လှုပ်နေသည့် မေ ၏ အသံ ထွက်ပေါ်လာသည် - 'အခန်း ၁၀၁ ထဲမှာ ငါတို့ ပြန်မပိတ်နိုင်တဲ့ အရာတစ်ခုကို ဖွင့်မိခဲ့တယ်... တစ်ယောက်ယောက် ဒါကို တွေ့ရင် စက်ဝိုင်းမပိတ်မီ ရေနုတ်မြောင်းကနေ အမြန်ထွက်ပြေးကြပါ...'"
    );

    let finished = false;
    const finishSongAndTransition = async () => {
      if (finished) return;
      finished = true;
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);

      try {
        await PrologBridge.playCassette();
      } catch {}

      setCassettePlayed(true);
      setConduitUnlocked(true);
      setIsPlayingAudio(false);
      setActiveMonologue(
        "တိတ်ခွေ အဆုံးသတ်သွားပြီး ကလစ်သံ ကျယ်ကျယ် မြည်သွားသည်နှင့် နံရံအောက်ခြေမှ သံမဏိသော့ဂျက်သံ ပဲ့တင်ထပ်လာသည် — ရေနုတ်မြောင်း သံဆန်ခါတံခါးကြီး ပွင့်ထွက်သွားပြီ!"
      );

      // Transition time adjusted to song finish: brief beat for the conduit unlock sound, then transition to seance end game
      transitionTimerRef.current = setTimeout(() => {
        try { sound.playFootstep?.(); } catch {}
        sound.stopMayCassetteSong();
        onNavigate('room_101_seance_flashback');
      }, 1500);
    };

    const audio = sound.playMayCassetteSong(() => {
      finishSongAndTransition();
    });

    // Fallback timer matching the song's duration (47.8s) + safety margin in case ended event is delayed
    fallbackTimerRef.current = setTimeout(() => {
      finishSongAndTransition();
    }, 49500);

    if (!audio) {
      // Audio element not supported or blocked, fallback
      fallbackTimerRef.current = setTimeout(() => {
        finishSongAndTransition();
      }, 4000);
    }
  };

  const handleCassettePlayer = async () => {
    if (isPlayingAudio) return;

    if (!cassetteInserted) {
      if (hasMayTape) {
        try { sound.playPaperRustle?.(); } catch {}
        await PrologBridge.insertCassette();
        removeInventoryItem('cassette_tape_may');
        setCassetteInserted(true);
        // Play the newly added song upon inserting May's tape
        triggerCassettePlayback();
      } else {
        setActiveMonologue("ဘက်ထရီသုံး မိုက်ခရိုတိတ်ခွေဖွင့်စက်ဟောင်းတစ်ခု။ တိတ်ခွေထည့်သည့်နေရာ လွတ်နေသည်။");
      }
      return;
    }

    if (!cassettePlayed) {
      triggerCassettePlayback();
      return;
    }

    setActiveMonologue("တိတ်ခွေ ဖွင့်ပြပြီးသွားပြီဖြစ်သည်။ မိုက်ခရိုတိတ်ခွေခွေများသည် တိတ်ခွေအဆုံးတွင် ညပ်နေသည်။");
  };

  const handleStormConduitGrating = () => {
    if (!conduitUnlocked) {
      setActiveMonologue("အုတ်နံရံအောက်ခြေရှိ မိုးရေနုတ်မြောင်း လှိုဏ်ခေါင်းဝကို လေးလံသော သံချေးတက် သော့ခလောက်နှင့် သံဆန်ခါဖြင့် ပိတ်ထားသည်။ လှုပ်၍မရပေ။");
      return;
    }

    // Trigger climax transition to Room 101 Seance Circle flashback
    try { sound.playFootstep?.(); } catch {}
    sound.stopMayCassetteSong();
    onNavigate('room_101_seance_flashback');
  };

  const handleShaftWalls = () => {
    try { sound.playDrip?.(); } catch {}
    setActiveMonologue("အထက်ဘက် မိုးရာသီကောင်းကင်မှ မီးခိုးရောင်အလင်းစက်ဝိုင်းငယ်လေးဆီသို့ အပေါ်ဘက်သို့ ကွေးတက်သွားသော စိုစွတ်သည့် ရှေးဟောင်းအုတ်နံရံများ။");
  };

  const getPlayerTooltip = (): string => {
    if (isPlayingAudio) {
      return "[မေ ၏ သီချင်းနှင့် တိတ်ခွေအသံကို နားထောင်နေသည်...]";
    }
    if (!cassetteInserted) {
      return hasMayTape ? "[မေ ၏ တိတ်ခွေကို ထည့်သွင်းမည်]" : "[တိတ်ခွေဖွင့်စက်ကို စစ်ဆေးမည်]";
    }
    if (!cassettePlayed) {
      return "[တိတ်ခွေဖွင့်ပြီး အသံကို နားထောင်မည်]";
    }
    return "[တိတ်ခွေဖွင့်စက်ကို ကြည့်မည်]";
  };

  const getConduitTooltip = (): string => {
    return conduitUnlocked ? "[ပွင့်နေသော ရေနုတ်မြောင်းထဲသို့ တွားသွားမည်]" : "[သံရေနုတ်ဆန်ခါကို စစ်ဆေးမည်]";
  };

  return (
    <div className={`relative w-full h-full select-none overflow-hidden bg-black ${isPlayingAudio ? 'animate-pulse' : ''}`}>
      {/* Background Graphic */}
      <img
        src="/assets/scenes/well_interior_deep.jpg"
        alt="ရေတွင်းနက် အတွင်းခွက်"
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
          name="မိုက်ခရို တိတ်ခွေဖွင့်စက်"
          cursorTooltip={getPlayerTooltip()}
          polygonPoints="41,81.8 50.8,74.1 59.7,80.3 48.4,90.7"
          onClick={handleCassettePlayer}
        />

        {/* Hotspot 2: Drainage Storm Culvert Gate */}
        <InteractiveHotspot
          id="well_storm_conduit"
          name="ရေနုတ်မြောင်း သံဆန်ခါတံခါး"
          cursorTooltip={getConduitTooltip()}
          polygonPoints="32,38 43,38 43,58 32,58"
          onClick={handleStormConduitGrating}
        />

        {/* Hotspot 3: Shaft Brick Walls */}
        <InteractiveHotspot
          id="well_shaft_walls"
          name="ရေတွင်း အုတ်နံရံများ"
          cursorTooltip="[ရေတွင်းအုတ်နံရံများကို စစ်ဆေးမည်]"
          polygonPoints="10,10 90,10 90,35 10,35"
          onClick={handleShaftWalls}
        />
      </div>
    </div>
  );
};

export default WellInteriorDeepView;