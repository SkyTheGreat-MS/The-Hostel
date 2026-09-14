import React from 'react';
import { InteractiveHotspot } from './InteractiveHotspot';
import { sound } from '../audioEngine';

export interface Locker09ZoomViewProps {
  hasLocker09Candle: boolean;
  hasLocker09Matchbox: boolean;
  setHasLocker09Candle: (val: boolean | ((prev: boolean) => boolean)) => void;
  setHasLocker09Matchbox: (val: boolean | ((prev: boolean) => boolean)) => void;
  setHasBlackCandlesCount: (val: number | ((prev: number) => number)) => void;
  setHasMatchesCount: (val: number | ((prev: number) => number)) => void;
  setInventory: (val: string[] | ((prev: string[]) => string[])) => void;
  setActiveMonologue: (msg: string | null) => void;
}

export const Locker09ZoomView: React.FC<Locker09ZoomViewProps> = ({
  hasLocker09Candle,
  hasLocker09Matchbox,
  setHasLocker09Candle,
  setHasLocker09Matchbox,
  setHasBlackCandlesCount,
  setHasMatchesCount,
  setInventory,
  setActiveMonologue,
}) => {
  return (
    <>
      {/* 1. Black Beeswax Candle (Left Center) */}
      {!hasLocker09Candle && (
        <InteractiveHotspot
          id="locker-09-candle"
          name="Black Beeswax Candle"
          polygonPoints="48,39 55,39 55,75 48,75"
          cursorTooltip="အနက်ရောင် ဖယောင်းတိုင်ကို ယူမည်"
          onClick={() => {
            sound.playItemPickup();
            setHasLocker09Candle(true);
            setHasBlackCandlesCount((prev) => prev + 1);
            setInventory((prev) => [...prev, 'black_beeswax_candle']);
            setActiveMonologue(
              "ထူထဲသောအနက်ရောင် ပျားဖယောင်းတိုင်တစ်တိုင်။ လေးလံအေးစက်နေပြီး အမွှေးဆီနံ့ သင်းသင်းထွက်နေသည်။ ဘုရားစင်ယဇ်ပလ္လင်အတွက် သင့်တော်သည်။"
            );
          }}
        />
      )}

      {/* 2. Vintage Burmese Matchbox (Right Center) */}
      {!hasLocker09Matchbox && (
        <InteractiveHotspot
          id="locker-09-matchbox"
          name="Three-Shooting-Stars Matchbox"
          polygonPoints="60,37 74,42 74,75 60,70"
          cursorTooltip="မီးခြစ်ဆံဗူးကို ယူမည်"
          onClick={() => {
            sound.playPaperRustle();
            setHasLocker09Matchbox(true);
            setHasMatchesCount(3);
            setInventory((prev) => [...prev, 'matchbox_three_stars']);
            setActiveMonologue(
              "'ကြယ်သုံးပွင့်' ဘေးကင်းလုံခြုံရေး မီးခြစ်ဆံဗူးတစ်ခု။ အတွင်းတွင် မီးခြစ်ဆံ ခြောက်ခြောက် ၃ ချောင်းသာ ကျန်တော့သည်။"
            );
          }}
        />
      )}

      {/* Emptied Feedback Hotspot */}
      {hasLocker09Candle && hasLocker09Matchbox && (
        <InteractiveHotspot
          id="locker-09-empty"
          name="Locker 09 (Emptied)"
          polygonPoints="37,8 90,8 90,88 37,88"
          cursorTooltip="ဘီရို ၀၉ (ဗလာဖြစ်နေသည်)"
          onClick={() => {
            sound.playPaperRustle();
            setActiveMonologue(
              "— ဘီရို ၀၉ တွင် ဘာမှ မရှိတော့ပါ။ ကျန်ရှိသော စင်များပေါ်တွင် စိုစွတ်သော ပိုးမွှားမစင်များနှင့် သံချေးတက်နေသော စင်တင်သံမှိုများသာ ကျန်တော့သည်။ —"
            );
          }}
        />
      )}
    </>
  );
};

export default Locker09ZoomView;
