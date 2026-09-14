import React from 'react';
import { InteractiveHotspot } from './InteractiveHotspot';
import { sound } from '../audioEngine';

export interface Locker32ZoomViewProps {
  setActiveMonologue: (msg: string | null) => void;
  setHasReadLocker32Note: (val: boolean | ((prev: boolean) => boolean)) => void;
  setHasReadSandarLetters: (val: boolean | ((prev: boolean) => boolean)) => void;
  addDiscoveredClue?: (clueId: string) => void;
}

export const Locker32ZoomView: React.FC<Locker32ZoomViewProps> = ({
  setActiveMonologue,
  setHasReadLocker32Note,
  setHasReadSandarLetters,
  addDiscoveredClue,
}) => {
  return (
    <>
      {/* 1. Hotspot: Pinned Pink Hostel Slip (Top-Right) */}
      <InteractiveHotspot
        id="locker-32-pink-slip"
        name="Pink Hostel Overwrite Slip"
        polygonPoints="60,10 77,12 76,48 59,42"
        cursorTooltip="တွဲထားသော စလစ်စက္ကူကို စစ်ဆေးမည်"
        onClick={() => {
          sound.playPaperRustle();
          setActiveMonologue(
            "အဆောင်ပြင်ဆင်ရေး တရားဝင်စလစ်အပိုင်းအစတစ်ခု - 'Warden Office Electronic Push-Latch Overwrite: 8 1 4 0 9 2။' အောက်တွင် ခဲတံဖြင့် ရေးထားသည် - 'Note: Caretaker mirrors all sequence inputs for emergency security (အရေးပေါ် လုံခြုံရေးအတွက် အဆောင်မှူးသည် ဂဏန်းအစဉ်အားလုံးကို ပြောင်းပြန်လှန် မှတ်သားထားသည်)။'"
          );
          setHasReadLocker32Note(true);
          if (addDiscoveredClue) {
            addDiscoveredClue('cipher_note_32');
          }
        }}
      />

      {/* 2. Hotspot: Bundle of Folded Letters marked K.Z. (Bottom-Right) */}
      <InteractiveHotspot
        id="locker-32-letters"
        name="Folded Love Letters"
        polygonPoints="60,50 83,52 84,77 60,75"
        cursorTooltip="ခေါက်ထားသော စာလွှာများကို ဖတ်မည်"
        onClick={() => {
          sound.playPaperRustle();
          setActiveMonologue(
            "Sandar ထံသို့ လိပ်မူထားပြီး 'K.Z.' ဟု လက်မှတ်ရေးထိုးထားသော ခေါက်ထားသည့် စာလွှာများ... 'Sandar၊ လက်ဖက်ရည်ဆိုင် (tea shop) သွားတာတွေကို သူမ သံသယဝင်နေပြီ။ အကယ်၍ May သာ ငါတို့အကြောင်း သိသွားရင် ငါတို့နှစ်ယောက်စလုံး ဒီအဆောင်မှာ ဆက်နေလို့မရတော့ဘူး။'"
          );
          setHasReadSandarLetters(true);
          if (addDiscoveredClue) {
            addDiscoveredClue('sandar_kozaw_letters');
          }
        }}
      />

      {/* 3. Optional Hotspot: Stacked Course Books (Bottom-Left) */}
      <InteractiveHotspot
        id="locker-32-books"
        name="Old Engineering Textbooks"
        polygonPoints="38,40 61,42 62,74 38,72"
        cursorTooltip="စာအုပ်များကို စစ်ဆေးမည်"
        onClick={() => {
          sound.playPaperRustle();
          setActiveMonologue(
            "Sandar ပိုင်ဆိုင်သော လေးလံသည့် ကျောင်းသုံးစာအုပ်ဟောင်းများ။ စာအုပ်အဖုံးများသည် စိုထိုင်းဆကြောင့် တွန့်လိမ်နေပြီး မှိုနံ့ရနေသည်။"
          );
        }}
      />
    </>
  );
};

export default Locker32ZoomView;
