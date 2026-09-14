import React, { useState, useEffect } from 'react';
import { InteractiveHotspot } from './InteractiveHotspot';
import { sound } from '../audioEngine';
import { PHASE_3_ASSETS } from '../gameData';
import { SceneNavBar } from './SceneNavBar';

export interface CaretakerOfficeViewProps {
  currentChapter?: number;
  chapter1Completed?: boolean;
  setPhase3Location?: (location: any) => void;
  hasCaretakerCandles?: boolean;
  setHasCaretakerCandles?: React.Dispatch<React.SetStateAction<boolean>>;
  setHasBlackCandlesCount?: React.Dispatch<React.SetStateAction<number>>;
  setInventory?: React.Dispatch<React.SetStateAction<string[]>>;
  hasBronzeBell?: boolean;
  setHasBronzeBell?: React.Dispatch<React.SetStateAction<boolean>>;
  addInventoryItem?: (item: string) => void;
  natSummoned?: boolean;
  hasBlackCandlesCount?: number;
  altarCandlesPlaced?: number;
  handleCaretakerClimax?: () => void;
  activeMonologue?: string | null;
  setActiveMonologue?: (msg: string | null) => void;
  caretakerSpectralClimax?: boolean;
  onStepBack?: () => void;
}

export type CaretakerViewProps = CaretakerOfficeViewProps;

export const CaretakerOfficeView: React.FC<CaretakerOfficeViewProps> = ({
  currentChapter = 1,
  chapter1Completed = false,
  setPhase3Location,
  hasCaretakerCandles = false,
  setHasCaretakerCandles,
  setHasBlackCandlesCount,
  setInventory,
  hasBronzeBell = false,
  setHasBronzeBell,
  addInventoryItem,
  natSummoned = false,
  hasBlackCandlesCount = 0,
  altarCandlesPlaced = 0,
  handleCaretakerClimax,
  activeMonologue,
  setActiveMonologue,
  caretakerSpectralClimax,
  onStepBack,
}) => {
  const [isRoomBlackedOut, setIsRoomBlackedOut] = useState<boolean>(
    currentChapter >= 2 || chapter1Completed || Boolean(caretakerSpectralClimax)
  );
  const [deskInteractable, setDeskInteractable] = useState<boolean>(
    !(currentChapter >= 2 || chapter1Completed || Boolean(caretakerSpectralClimax))
  );

  useEffect(() => {
    // If already in Chapter 2 or post-climax, render the pitch-black abandoned state
    if (currentChapter >= 2 || chapter1Completed || caretakerSpectralClimax) {
      setIsRoomBlackedOut(true);
      setDeskInteractable(false);
    }
  }, [currentChapter, chapter1Completed, caretakerSpectralClimax]);

  const handleBack = () => {
    try {
      sound.playDoorCreak();
    } catch {
      sound.playPaperRustle();
    }
    if (onStepBack) {
      onStepBack();
    } else if (setPhase3Location) {
      setPhase3Location('east_fork');
      if (setActiveMonologue) {
        setActiveMonologue('— မွန်းကြပ်နေသော ရုံးခန်းထဲမှ စိုစွတ်သော စင်္ကြံလမ်းခွဲဆီသို့ ပြန်ထွက်လာခဲ့သည်။ —');
      }
    }
  };

  // In the render block for Chapter 2 / Post-Climax Abandoned Office:
  if (currentChapter >= 2 || chapter1Completed || isRoomBlackedOut) {
    return (
      <div className="relative w-full h-screen overflow-hidden select-none bg-black pointer-events-auto">
        {/* 1. Single Unified Background Image */}
        <img
          src="assets/scenes/caretaker_spectral_climax.jpg"
          onError={(e) => {
            e.currentTarget.src = '/assets/scenes/caretaker_spectral_climax.jpg';
          }}
          alt="အလုပ်သမား မှတ်တမ်းခန်း - သရဲဖြစ်စဉ် အထွတ်အထိပ်"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Ambient Click Guard for Post-Climax Office: Click empty space */}
        <div
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              try { sound.playPaperRustle(); } catch {}
              setActiveMonologue?.("— ရုံးခန်းထဲမှာ မီးမရှိတော့ဘူး။ မမမေရဲ့ အေးစက်စက်အငွေ့ပဲ ကျန်နေတယ်။ လမ်းခွဲဆီ ပြန်သွားရမယ်။—");
            }
          }}
        />

        {/* Standardized Scene Navigation Bar */}
        <SceneNavBar
          onReturn={() => {
            try { sound.playDoorCreak(); } catch {}
            if (onStepBack) {
              onStepBack();
            } else {
              setPhase3Location?.('east_fork');
              setActiveMonologue?.('— မွန်းကြပ်နေသော ရုံးခန်းထဲမှ စိုစွတ်သော စင်္ကြံလမ်းခွဲဆီသို့ ပြန်ထွက်လာခဲ့သည်။ —');
            }
          }}
          returnDestination="အရှေ့လမ်းခွဲ"
          areaZone="အခန်း ၁၀၁"
          areaName="အလုပ်သမား မှတ်တမ်းခန်း"
        />

        {/* Hotspot Inspection Guard: Dark Doorway on bottom-left edge */}
        <InteractiveHotspot
          id="caretaker_dark_doorway"
          name="မှောင်မည်းသော တံခါးပေါက်"
          x={3}
          y={55}
          width={22}
          height={42}
          shape="rect"
          cursorTooltip="[အမှောင်တံခါးပေါက် - အရှေ့လမ်းခွဲသို့ ပြန်သွားမည်]"
          onClick={() => {
            try { sound.playDoorCreak(); } catch {}
            if (onStepBack) {
              onStepBack();
            } else {
              setPhase3Location?.('east_fork');
              setActiveMonologue?.('— မွန်းကြပ်နေသော ရုံးခန်းထဲမှ စိုစွတ်သော စင်္ကြံလမ်းခွဲဆီသို့ ပြန်ထွက်လာခဲ့သည်။ —');
            }
          }}
        />

      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-black pointer-events-auto">
      {/* 1. Single Unified Background Image for Investigation */}
      <img
        src="assets/scenes/caretaker_office_normal.jpg"
        onError={(e) => {
          e.currentTarget.src = PHASE_3_ASSETS.caretakerOfficeOverview || '/assets/scenes/caretaker_office_overview.jpg';
        }}
        alt="အလုပ်သမား မှတ်တမ်းခန်း - စစ်ဆေးမှုမြင်ကွင်း"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />

      {/* Standardized Scene Navigation Bar */}
      <SceneNavBar
        onReturn={() => {
          try { sound.playDoorCreak(); } catch {}
          if (onStepBack) {
            onStepBack();
          } else {
            setPhase3Location?.('east_fork');
            setActiveMonologue?.('— ရုံးခန်းထဲမှ စင်္ကြံလမ်းခွဲဆီသို့ ပြန်ထွက်လာခဲ့သည်။ —');
          }
        }}
        returnDestination="အရှေ့လမ်းခွဲ"
        areaZone="အခန်း ၁၀၁"
        areaName="အလုပ်သမား မှတ်တမ်းခန်း"
      />

      {/* 1. Wooden Supply Shelf (2 candles) */}
      <InteractiveHotspot
        id="caretaker_supply_shelf"
        name="စင်ပေါ်က ဖယောင်းတိုင်နက် ၂ တိုင်"
        x={89}
        y={45}
        width={10}
        height={22}
        shape="rect"
        cursorTooltip={!hasCaretakerCandles ? '[ဖယောင်းတိုင်များကို ယူရန်]' : '[ပစ္စည်းတင်စင် (ဗလာ)]'}
        onClick={() => {
          if (!hasCaretakerCandles) {
            setHasCaretakerCandles && setHasCaretakerCandles(true);
            setHasBlackCandlesCount && setHasBlackCandlesCount((prev) => prev + 2);
            setInventory && setInventory((prev) => [...prev, 'black_beeswax_candle', 'black_beeswax_candle']);
            sound.playPaperRustle();
            setActiveMonologue &&
              setActiveMonologue(
                '— စင်မြင့်ပေါ်တွင် - Locker 09 က ဖယောင်းတိုင်နှင့် တစ်ပုံစံတည်း အနက်ရောင် ဖယောင်းတိုင် ၂ တိုင် ရှိသည်။ အခုဆို ၃ တိုင် ပြည့်သွားပြီ။ —'
              );
          } else {
            sound.playPaperRustle();
            setActiveMonologue && setActiveMonologue('— ပစ္စည်းတင်စင်ပေါ်တွင် ဘာမှ မရှိတော့ပါ။ ခြောက်သွေ့နေသော ပင့်ကူမျှင်များသာ ကျန်တော့သည်။ —');
          }
        }}
      />

      {/* 2. Glass Counter Cabinet (Bronze Prayer Bell) */}
      <InteractiveHotspot
        id="caretaker_glass_cabinet"
        name="မှန်ပြတင်းကြီး ခင်းကျင်းခန်း"
        x={5}
        y={56}
        width={18}
        height={30}
        shape="rect"
        cursorTooltip={!hasBronzeBell ? '[ခင်းကျင်းခန်းကို စစ်ဆေးရန်]' : '[မှန်ဘောင် (ဗလာဖြစ်နေသည်)]'}
        onClick={() => {
          if (!hasBronzeBell) {
            addInventoryItem && addInventoryItem('bronze_prayer_bell');
            setHasBronzeBell && setHasBronzeBell(true);
            sound.playPaperRustle();
            setActiveMonologue &&
              setActiveMonologue(
                '— မှန်ဘောင်ထဲတွင် - ကြေးဝါဖြင့် ပြုလုပ်ထားသော ခေါင်းလောင်းတစ်လုံး ရှိသည်။ ဘေးပတ်လည်တွင် ရိုးရာနတ်စာများ ထွင်းထုထားသည်။ ရရှိပစ္စည်း - ယဇ်ပူဇော်ရာ ကြေးဝါခေါင်းလောင်း (ကြေးခေါင်းလောင်းငယ်)။ —'
              );
          } else {
            sound.playPaperRustle();
            setActiveMonologue && setActiveMonologue('— မှန်ဘောင်ဗီရိုထဲတွင် ဘာမှမရှိတော့ပါ။ —');
          }
        }}
      />

      {/* 3. Center Desk Ledger (Chapter 1 Conclusion Trigger) */}
      <InteractiveHotspot
        id="caretaker_desk_ledger"
        name="အလုပ်သမား ၁၉၉၈ မှတ်တမ်းစာအုပ်"
        polygonPoints="50,54 80,60 83,85 39,65"
        cursorTooltip={
          hasCaretakerCandles && hasBronzeBell
            ? '[မှတ်တမ်းစာအုပ်ကို ဖတ်ရန်]'
            : '[အဆောင်မှူး စားပွဲကို စစ်ဆေးမည်]'
        }
        onClick={() => {
          if (!deskInteractable) return;
          if (hasCaretakerCandles && hasBronzeBell) {
            // Case B: Holding both ritual items — trigger Chapter 2 transition directly
            sound.playPaperRustle();
            setActiveMonologue &&
              setActiveMonologue(
                '— ဩဂုတ် ၁၉၉၈... မေပျောက်သွားတဲ့ညရောက်တော့ မှတ်တမ်းက ရုတ်တရက် ပြတ်သွားတယ်။ နတ်ကို နိုးဖို့ လိုတာအကုန် ရပြီ။—'
              );
            // Give the thought a beat, then begin the transition while still in this room.
            setTimeout(() => {
              handleCaretakerClimax && handleCaretakerClimax();
            }, 700);
          } else {
            // Case A: Missing ritual items — ambient thought line only
            sound.playPaperRustle();
            setActiveMonologue &&
              setActiveMonologue(
                "—အဆောင်မှူးရဲ့ မှတ်တမ်းထဲမှာ လျှို့ဝှက်နတ်စင်အကြောင်း အကုန်ရေးထားတယ်... ဒါပေမဲ့ နတ်နဲ့ မတွေ့ခင် ဒီအခန်းထဲက ခေါင်းလောင်းနဲ့ ပူဇော်ဖို့ ဖယောင်းတိုင်တွေကို အရင်ယူရဦးမယ်။—"
              );
          }
        }}
      />
    </div>
  );
};

export default CaretakerOfficeView;
