import React from 'react';
import { sound } from '../audioEngine';
import { SceneNavBar } from './SceneNavBar';
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
        '— Only torn greasy wax paper and dust remain on the shelf. —'
      );
      return;
    }
    sound.playPaperRustle();
    sound.playItemLooted();
    setInventory((prev) => (prev.includes('battery_pair') ? prev : [...prev, 'battery_pair']));
    addDiscoveredClue('battery_pair_acquired');
    setActiveMonologue(
      '— A wax-paper bundle of two heavy D-cell batteries. The terminals are clean and the charge holds. —'
    );
  };

  const handleNotebookClick = () => {
    sound.playPaperRustle();
    if (!noteRead) {
      addDiscoveredClue('clue_radio_freq_1042');
    }
    setActiveMonologue(
      '— Scratched into the cover margin in pencil: \'104.2 AM — where the acoustic session plays past midnight\'. —'
    );
  };

  const batteriesTooltip = batteriesTaken ? 'Empty Wax Paper Wrapper' : 'Take Heavy Dry-Cell Batteries';
  const notebookTooltip = 'Inspect Scratched Exercise Book';

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black select-none">
      <img
        src="/assets/scenes/locker_10_interior.jpg"
        alt="Locker 10 interior"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/15 pointer-events-none" />
      <SceneNavBar
        onReturn={onReturn}
        returnDestination="LOCKERS"
        areaZone="EAST WING"
        areaName="STUDENT LOCKER BAY"
      />

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