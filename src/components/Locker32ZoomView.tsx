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
        cursorTooltip="Examine Pinned Slip"
        onClick={() => {
          sound.playPaperRustle();
          setActiveMonologue(
            "An official hostel maintenance slip: 'Warden Office Electronic Push-Latch Overwrite: 8 1 4 0 9 2.' Below it in faint pencil: 'Note: Caretaker mirrors all sequence inputs for emergency security.'"
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
        cursorTooltip="Read Folded Letters"
        onClick={() => {
          sound.playPaperRustle();
          setActiveMonologue(
            "Folded letters addressed to Sandar, signed 'K.Z.'... 'Sandar, she is getting suspicious about the tea shop visits. If May finds out about us, neither of us can stay in this hostel.'"
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
        cursorTooltip="Inspect Books"
        onClick={() => {
          sound.playPaperRustle();
          setActiveMonologue(
            "Heavy textbooks belonging to Sandar. The covers are warped with moisture and smelling of damp mildew."
          );
        }}
      />
    </>
  );
};

export default Locker32ZoomView;
