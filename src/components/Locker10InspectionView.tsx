import React from 'react';
import { sound } from '../audioEngine';
import { InteractiveHotspot } from './InteractiveHotspot';

export interface Locker10InspectionViewProps {
  inventory: string[];
  setInventory: React.Dispatch<React.SetStateAction<string[]>>;
  discoveredClues: string[];
  addDiscoveredClue: (clueId: string) => void;
  setActiveMonologue: (msg: string | null) => void;
  onReturn: () => void;
}

export const Locker10InspectionView: React.FC<Locker10InspectionViewProps> = ({
  inventory,
  setInventory,
  discoveredClues,
  addDiscoveredClue,
  setActiveMonologue,
  onReturn,
}) => {
  const hasBatteries = inventory.includes('battery_pair');
  const batteriesTaken = discoveredClues.includes('battery_pair_acquired');
  const noteRead = discoveredClues.includes('clue_radio_freq_1042');

  const handleBatteriesClick = () => {
    if (batteriesTaken) {
      sound.playPaperRustle();
      setActiveMonologue(
        '— စင်ပေါ်တွင် စုတ်ပြတ်နေသော ဖယောင်းစက္ကူနှင့် ဖုန်မှုန့်များသာ ကျန်တော့သည်။ —'
      );
      return;
    }
    sound.playPaperRustle();
    sound.playItemLooted();
    setInventory((prev) => (prev.includes('battery_pair') ? prev : [...prev, 'battery_pair']));
    addDiscoveredClue('battery_pair_acquired');
    setActiveMonologue(
      '— ဖယောင်းစက္ကူဖြင့် ထုပ်ထားသော လေးလံသည့် D-cell ဓာတ်ခဲကြီး နှစ်လုံး။ ငုတ်တိုင်များ သန့်ရှင်းပြီး ဓာတ်အားပြည့်ဝနေဆဲ ဖြစ်သည်။ —'
    );
  };

  const handleNotebookClick = () => {
    sound.playPaperRustle();
    if (!noteRead) {
      addDiscoveredClue('clue_radio_freq_1042');
    }
    setActiveMonologue(
      '— စာအုပ်အဖုံးဘေးတွင် ခဲတံဖြင့် ခြစ်ရေးထားသည် - \'104.2 AM — သန်းခေါင်ကျော် ဂစ်တာသံစဉ် လွင့်ပျံ့ရာနေရာ\'။ —'
    );
  };

  const batteriesTooltip = batteriesTaken ? 'ဖယောင်းစက္ကူ ဗလာ' : 'D-cell ဓာတ်ခဲကြီးများကို ယူမည်';
  const notebookTooltip = 'ခြစ်ရာများပါသော ဗလာစာအုပ်ကို စစ်ဆေးမည်';

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black select-none">
      <img
        src="/assets/scenes/locker_10_interior.jpg"
        alt="Locker 10 interior"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/15 pointer-events-none" />

      <InteractiveHotspot
        id="locker10_batteries"
        name="Dry-Cell Batteries"
        polygonPoints="50,44 63,45 63,65 50,63"
        cursorTooltip={batteriesTooltip}
        onClick={handleBatteriesClick}
      />

      <InteractiveHotspot
        id="locker10_notebook"
        name="Chemistry Notebook"
        polygonPoints="48,24 55,24 61,42 53,42"
        cursorTooltip={notebookTooltip}
        onClick={handleNotebookClick}
      />
    </div>
  );
};

export default Locker10InspectionView;