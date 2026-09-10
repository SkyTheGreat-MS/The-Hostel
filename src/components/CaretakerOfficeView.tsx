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
        setActiveMonologue('— Stepped out of the suffocating office back into the damp corridor fork. —');
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
          alt="Caretaker's Archive - Spectral Climax"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Ambient Click Guard for Post-Climax Office: Click empty space */}
        <div
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              try { sound.playPaperRustle(); } catch {}
              setActiveMonologue?.("— The office power is dead. May's lingering chill is all that remains. I should return to the fork. —");
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
              setActiveMonologue?.('— Stepped out of the suffocating office back into the damp corridor fork. —');
            }
          }}
          returnDestination="EAST FORK"
          areaZone="ROOM 101"
          areaName="CARETAKER ARCHIVE"
        />

        {/* Hotspot Inspection Guard: Dark Doorway on bottom-left edge */}
        <InteractiveHotspot
          id="caretaker_dark_doorway"
          name="Dark Doorway"
          x={3}
          y={55}
          width={22}
          height={42}
          shape="rect"
          cursorTooltip="[Dark Doorway: Return to East Fork]"
          onClick={() => {
            try { sound.playDoorCreak(); } catch {}
            if (onStepBack) {
              onStepBack();
            } else {
              setPhase3Location?.('east_fork');
              setActiveMonologue?.('— Stepped out of the suffocating office back into the damp corridor fork. —');
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
        alt="Caretaker's Archive - Investigation"
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
            setActiveMonologue?.('— Stepped out of the office back into the corridor fork. —');
          }
        }}
        returnDestination="EAST FORK"
        areaZone="ROOM 101"
        areaName="CARETAKER ARCHIVE"
      />

      {/* 1. Wooden Supply Shelf (2 candles) */}
      <InteractiveHotspot
        id="caretaker_supply_shelf"
        name="2 Black Candles on the shelf"
        x={89}
        y={45}
        width={10}
        height={22}
        shape="rect"
        cursorTooltip={!hasCaretakerCandles ? '[Take 2 Black Beeswax Candles]' : '[Supply Shelf (Empty)]'}
        onClick={() => {
          if (!hasCaretakerCandles) {
            setHasCaretakerCandles && setHasCaretakerCandles(true);
            setHasBlackCandlesCount && setHasBlackCandlesCount((prev) => prev + 2);
            setInventory && setInventory((prev) => [...prev, 'black_beeswax_candle', 'black_beeswax_candle']);
            sound.playPaperRustle();
            setActiveMonologue &&
              setActiveMonologue(
                '— On the high shelf: two additional black beeswax candles matching the one from Locker 09. Now I have 3 candles. —'
              );
          } else {
            sound.playPaperRustle();
            setActiveMonologue && setActiveMonologue('— The supply shelf is bare now. Nothing remains except dried cobwebs. —');
          }
        }}
      />

      {/* 2. Glass Counter Cabinet (Bronze Prayer Bell) */}
      <InteractiveHotspot
        id="caretaker_glass_cabinet"
        name="Glass Display Cabinet"
        x={5}
        y={56}
        width={18}
        height={30}
        shape="rect"
        cursorTooltip={!hasBronzeBell ? '[Take Bronze Prayer Bell]' : '[Glass Cabinet (Empty)]'}
        onClick={() => {
          if (!hasBronzeBell) {
            addInventoryItem && addInventoryItem('bronze_prayer_bell');
            setHasBronzeBell && setHasBronzeBell(true);
            sound.playPaperRustle();
            setActiveMonologue &&
              setActiveMonologue(
                '— Inside the glass display: an ornate cast bronze hand bell with traditional spirit runes etched into the lip. Acquired: Bronze Prayer Bell. —'
              );
          } else {
            sound.playPaperRustle();
            setActiveMonologue && setActiveMonologue('— The glass display cabinet is empty. —');
          }
        }}
      />

      {/* 3. Center Desk Ledger (Chapter 1 Conclusion Trigger) */}
      <InteractiveHotspot
        id="caretaker_desk_ledger"
        name="Caretaker 1998 Ledger"
        polygonPoints="50,54 80,60 83,85 39,65"
        cursorTooltip={
          hasCaretakerCandles && hasBronzeBell
            ? '[Read the Open Ledger — Conclude Chapter 1]'
            : '[Examine Caretaker Desk]'
        }
        onClick={() => {
          if (!deskInteractable) return;
          if (hasCaretakerCandles && hasBronzeBell) {
            // Case B: Holding both ritual items — trigger Chapter 2 transition directly
            sound.playPaperRustle();
            setActiveMonologue &&
              setActiveMonologue(
                '— August 1998... The entries end abruptly on the night May disappeared. I have what I need to awaken the shrine. —'
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
                "— The warden's ledger details the secret shrine... but I still need the bell and the offering candles from this room before confronting the Nat. —"
              );
          }
        }}
      />
    </div>
  );
};

export default CaretakerOfficeView;
