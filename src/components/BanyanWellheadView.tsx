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
        "ညောင်ပင်ကြီးမှ ရှေးဟောင်းလေရှူမြစ်များသည် ကျောက်ရေတွင်းဝကို သံတိုင်များသဖွယ် တင်းကျပ်စွာ ရစ်ပတ်ပိတ်ဆို့ထားကြသည်။"
      );
    } else if (!wellPulleyRigged || !wellRopeRigged) {
      setActiveMonologue(
        "ပိတ်ဆို့နေသော သစ်မြစ်များကို ခုတ်ထွင်ရှင်းလင်းလိုက်သဖြင့် ရေတွင်းဝ၏ အုတ်ကျောက်နံရံများ ပေါ်ထွက်လာသည်။ ရေတွင်းပေါက်ကြီးသည် မြေအောက်နက်နက်သို့ ထိုးဆင်းသွားသည်။"
      );
    } else {
      setActiveMonologue(
        "သံသွန်းစက်သီးနှင့် တောင်တက်ကြိုးကို ရေတွင်းဝအထက်တွင် ခိုင်ခံ့စွာ တပ်ဆင်ထားသည်။ ကြိုးသည် တွင်းနက်ကြီးထဲသို့ တင်းမာစွာ တွဲလောင်းကျနေပြီး ဆင်းသက်ရန် အသင့်ဖြစ်နေပြီ။"
      );
    }
  }, [setActiveMonologue, wellRootsSevered, wellPulleyRigged, wellRopeRigged]);

  const handleOverheadBranch = async () => {
    if (!wellRootsSevered) {
      try {
        (sound as any).playMetalCreak?.();
      } catch {}
      setActiveMonologue(
        "ရေတွင်းဝတည့်တည့်ရှိ လေးလံသော ညောင်ကိုင်းကြီး၏ အောက်ဘက်တွင် သံကွင်းခတ်ထားသော သံမျက်ကွင်းကျည်တစ်ခု တပ်ဆင်ထားသည်။ သို့သော် အောက်ဘက်တွင် ရစ်ပတ်ရှုပ်ထွေးနေသော လေရှူမြစ်များကြောင့် ဘေးကင်းစွာ လုပ်ဆောင်ရန် မဖြစ်နိုင်ပေ။ သစ်မြစ်များကို ဦးစွာ ရှင်းလင်းရမည်။"
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
          "— သင်သည် လေးလံသော သံသွန်းစက်သီးကြီးကို မကာ ရှေးဟောင်းသံကွင်းကြီးထဲသို့ ထည့်သွင်းချိတ်ဆွဲလိုက်သည်။ သတ္တုသံ ကျယ်ကျယ်မြည်ဟည်းလျက် တင်းကျပ်စွာ ချိတ်တွဲသွားသည်။ —"
        );
      } else {
        try {
          (sound as any).playMetalCreak?.();
        } catch {}
        setActiveMonologue(
          "— ရေတွင်းခေါင်းဝတည့်တည့်တွင် လေးလံသော သံမဏိမျက်ကွင်းကျည်တစ်ခု ချိတ်ဆွဲထားသည်။ ရေတွင်းနက်ထဲသို့ ဆင်းသက်နိုင်ရန် ဤနေရာ၌ စက်သီးတစ်ခု တပ်ဆင်နိုင်သည်။ —"
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
          "— သင်သည် ခိုင်ခံ့သော နိုင်လွန်တောင်တက်ကြိုးကို စက်သီးဘီးခွေကြားသို့ လျှိုသွင်းကာ လုံခြုံစွာ ချည်နှောင်လိုက်သည်။ အလေးချိန်ပါသော ကြိုးစသည် အောက်ဘက် ရေလွှမ်းနေသော အမှောင်တွင်းနက်ထဲသို့ တည့်တည့်ကျသွားသည်။ —"
        );
      } else {
        try {
          (sound as any).playMetalCreak?.();
        } catch {}
        setActiveMonologue(
          "— သံသွန်းစက်သီးသည် အပေါ်ဘက်သစ်ကိုင်းတွင် ခိုင်ခံ့စွာ ချိတ်ဆွဲထားပြီး ဖြစ်သည်။ ဘီးခွေကြား လျှိုသွင်းရန် ခိုင်မာသော တောင်တက်ကြိုး သို့မဟုတ် နိုင်လွန်ကြိုး လိုအပ်သည်။ —"
        );
      }
      return;
    }

    try {
      (sound as any).playInventoryAdd?.();
    } catch {}
    setActiveMonologue(
      "— စက်သီးနှင့် ကျစ်ထားသော နိုင်လွန်ကြိုးကို ခိုင်လုံစွာ တပ်ဆင်ချည်နှောင်ထားပြီး ဖြစ်သည်။ ကြိုးသည် တင်းမာနေပြီး ရေတွင်းထဲသို့ သင့်ကိုယ်အလေးချိန်ကို သယ်ဆောင်ဆင်းသက်ရန် အသင့်ဖြစ်နေပြီ။ —"
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
          "— သင်သည် လေးလံသော သံချေးတက်ဓားမကြီးဖြင့် ရစ်ပတ်ရှုပ်ထွေးနေသော ညောင်မြစ်များကို ခုတ်ပိုင်းလိုက်သည်။ ပြတ်တောက်သွားသော သစ်မြစ်စများ လွင့်စင်ကျသွားပြီး အောက်ဘက်ရှိ ကျောက်ရေတွင်းဝ ပွင့်ထွက်ပေါ်လာသည်! —"
        );
      } else {
        try {
          (sound as any).playDrip?.();
        } catch {}
        setActiveMonologue(
          "— ထူထပ်သော ညောင်ပင်သစ်မြစ်များသည် ရေတွင်းဝပေါ်တွင် သံတိုင်များသဖွယ် ဖြတ်သန်းပေါက်ရောက်နေသည်။ လေးလံသော ဓားဖြင့် မခုတ်ထွင်ဘဲ ရေတွင်းပေါက်သို့ လက်လှမ်းမမီနိုင်ပေ။ —"
        );
      }
      return;
    }

    if (!wellPulleyRigged || !wellRopeRigged) {
      try {
        (sound as any).playDrip?.();
      } catch {}
      setActiveMonologue(
        "— ပြတ်တောက်သွားသော သစ်မြစ်များသည် အက်ကွဲနေသော အုတ်နံရံများဘေးတွင် တွဲလောင်းကျနေသည်။ ရေတွင်းကြီးသည် အမှောင်ထုနှင့် အောက်ဘက် ရေစီးသံများဆီသို့ မတ်စောက်စွာ ထိုးဆင်းသွားသည်။ ကြိုးမပါဘဲ ခုန်ဆင်းပါက အသက်အန္တရာယ် ရှိနိုင်သည်။ —"
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
      "— နိုင်လွန်ကြိုးကို တင်းကျပ်စွာ ဆုပ်ကိုင်လျက် ရေညှိချောနေသော ကျောက်ရေတွင်းဘောင်ကို ကျော်ခွကာ ပဲ့တင်သံထွက်နေသော ရေတွင်းနက်ကြီးထဲသို့ ကြိုးလျှောဆင်းသက်သွားသည်... —"
    );
    if (onNavigate) {
      onNavigate('well_interior_deep');
    }
  };

  const getBranchTooltip = (): string => {
    if (!wellRootsSevered) {
      return "[အပေါ်ဘက် သံကွင်းကို စစ်ဆေးမည်]";
    }
    if (!wellPulleyRigged) {
      return hasPulley ? "[သံသွန်းစက်သီးကို တပ်ဆင်မည်]" : "[အပေါ်ဘက် သံကွင်းကို စစ်ဆေးမည်]";
    }
    if (!wellRopeRigged) {
      return hasRope ? "[တောင်တက်ကြိုးကို တပ်ဆင်ချည်နှောင်မည်]" : "[တပ်ဆင်ထားသော စက်သီးကို စစ်ဆေးမည်]";
    }
    return "[တပ်ဆင်ထားသော စက်သီးကြိုးကို စစ်ဆေးမည်]";
  };

  const getWellTooltip = (): string => {
    if (!wellRootsSevered) {
      return hasMachete ? "[ဓားမဖြင့် လေရှူမြစ်များကို ခုတ်ပိုင်းမည်]" : "[ပိတ်ဆို့နေသော ရေတွင်းဝကို စစ်ဆေးမည်]";
    }
    if (!wellPulleyRigged || !wellRopeRigged) {
      return "[မှောင်မည်းနေသော ရေတွင်းပေါက်ကို ကြည့်မည်]";
    }
    return "[ရေတွင်းထဲသို့ ကြိုးလျှောဆင်းမည်]";
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