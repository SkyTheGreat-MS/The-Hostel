import React, { useState, useEffect } from 'react';
import { InteractiveHotspot } from './InteractiveHotspot';
import { sound } from '../audioEngine';

export interface CaretakerOfficeViewProps {
  currentChapter: number;
  chapter1Completed: boolean;
  setPhase3Location: (location: any) => void;
  hasCaretakerCandles: boolean;
  setHasCaretakerCandles: React.Dispatch<React.SetStateAction<boolean>>;
  setHasBlackCandlesCount: React.Dispatch<React.SetStateAction<number>>;
  setInventory: React.Dispatch<React.SetStateAction<string[]>>;
  hasBronzeBell: boolean;
  setHasBronzeBell: React.Dispatch<React.SetStateAction<boolean>>;
  addInventoryItem: (item: string) => void;
  natSummoned: boolean;
  hasBlackCandlesCount: number;
  altarCandlesPlaced: number;
  handleCaretakerClimax: () => void;
  setActiveMonologue: (msg: string | null) => void;
}

export const CaretakerOfficeView: React.FC<CaretakerOfficeViewProps> = ({
  currentChapter,
  chapter1Completed,
  setPhase3Location,
  hasCaretakerCandles,
  setHasCaretakerCandles,
  setHasBlackCandlesCount,
  setInventory,
  hasBronzeBell,
  setHasBronzeBell,
  addInventoryItem,
  natSummoned,
  hasBlackCandlesCount,
  altarCandlesPlaced,
  handleCaretakerClimax,
  setActiveMonologue,
}) => {
  const [isRoomBlackedOut, setIsRoomBlackedOut] = useState<boolean>(
    currentChapter >= 2 || chapter1Completed
  );
  const [deskInteractable, setDeskInteractable] = useState<boolean>(
    !(currentChapter >= 2 || chapter1Completed)
  );

  useEffect(() => {
    // If already in Chapter 2, render the pitch-black abandoned state
    if (currentChapter >= 2 || chapter1Completed) {
      setIsRoomBlackedOut(true);
      setDeskInteractable(false);
    }
  }, [currentChapter, chapter1Completed]);

  // In the render block:
  if (currentChapter >= 2 || chapter1Completed || isRoomBlackedOut) {
    return (
      <div className="relative w-full h-full min-h-[70vh] bg-[#050806] flex flex-col items-center justify-center p-8 text-center pointer-events-auto">
        <div className="max-w-md space-y-4">
          <p className="font-serif italic text-base md:text-lg text-[#8fa89b] leading-relaxed select-none">
            "The caretaker's office is plunged into dead silence. The push-latch power is dead, and cold air seeps through the cracked window. Nothing more remains to be found here."
          </p>
          <button
            onClick={() => {
              sound.playPaperRustle();
              setPhase3Location('east_fork');
            }}
            className="px-4 py-2 rounded-lg bg-[#141f19] hover:bg-[#1f3027] border border-[#2e4739] text-xs font-mono tracking-wider text-[#a3c2b2] uppercase transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
          >
            ← Return to East Wing Fork
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 1. Wooden Supply Shelf (2 candles) */}
      <InteractiveHotspot
        id="caretaker_supply_shelf"
        name="Wooden Supply Shelf"
        x={8}
        y={18}
        width={22}
        height={45}
        shape="rect"
        cursorTooltip={!hasCaretakerCandles ? '[Take 2 Black Beeswax Candles]' : '[Supply Shelf (Empty)]'}
        onClick={() => {
          if (!hasCaretakerCandles) {
            setHasCaretakerCandles(true);
            setHasBlackCandlesCount((prev) => prev + 2);
            setInventory((prev) => [...prev, 'black_beeswax_candle', 'black_beeswax_candle']);
            sound.playPaperRustle();
            setActiveMonologue(
              '— On the high shelf: two additional black beeswax candles matching the one from Locker 09. Now I have 3 candles. —'
            );
          } else {
            sound.playPaperRustle();
            setActiveMonologue('— The supply shelf is bare now. Nothing remains except dried cobwebs. —');
          }
        }}
      />

      {/* 2. Glass Counter Cabinet (Bronze Prayer Bell) */}
      <InteractiveHotspot
        id="caretaker_glass_cabinet"
        name="Glass Display Cabinet"
        x={70}
        y={25}
        width={22}
        height={50}
        shape="rect"
        cursorTooltip={!hasBronzeBell ? '[Take Bronze Prayer Bell]' : '[Glass Cabinet (Empty)]'}
        onClick={() => {
          if (!hasBronzeBell) {
            addInventoryItem('bronze_prayer_bell');
            setHasBronzeBell(true);
            sound.playPaperRustle();
            setActiveMonologue(
              '— Inside the glass display: an ornate cast bronze hand bell with traditional spirit runes etched into the lip. Acquired: Bronze Prayer Bell. —'
            );
          } else {
            sound.playPaperRustle();
            setActiveMonologue('— The glass display cabinet is empty. —');
          }
        }}
      />

      {/* 3. Center Desk Ledger (Spectral Encounter) */}
      <InteractiveHotspot
        id="caretaker_desk_ledger"
        name="Caretaker 1998 Ledger"
        x={34}
        y={46}
        width={32}
        height={38}
        shape="rect"
        cursorTooltip={
          natSummoned || (hasBlackCandlesCount + altarCandlesPlaced >= 3 && hasBronzeBell)
            ? '[Examine Open Ledger on Desk]'
            : '[Examine Caretaker Desk]'
        }
        onClick={() => {
          if (!deskInteractable) return;
          if (natSummoned || (hasBlackCandlesCount + altarCandlesPlaced >= 3 && hasBronzeBell)) {
            handleCaretakerClimax();
          } else {
            sound.playPaperRustle();
            setActiveMonologue(
              '— The Caretaker\'s ledger lies open on the desk... dust covers yellowed entries from August 1998. I should search the room for supplies and awaken the Guardian Nat first. —'
            );
          }
        }}
      />
    </>
  );
};

export default CaretakerOfficeView;
