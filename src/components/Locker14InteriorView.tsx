import React from 'react';
import { sound } from '../audioEngine';
import { SceneNavBar } from './SceneNavBar';
import { InteractiveHotspot } from './InteractiveHotspot';
import { useGameStore } from '../context/GameProgressContext';
import { MONOLOGUE_LINES } from '../data/dialogues';

export interface Locker14InteriorViewProps {
  inventory?: string[];
  addItem?: (itemId: string) => void;
  addInventoryItem?: (itemId: string) => void;
  stairwayGateKeyTaken?: boolean;
  setStairwayGateKeyTaken?: (val: boolean | ((prev: boolean) => boolean)) => void;
  setActiveMonologue?: (msg: string | null) => void;
  addDiscoveredClue?: (clueId: string) => void;
  onReturn: () => void;
}

/**
 * Locker14InteriorView — Locker 14 Unlocked Interior Scene
 *
 * Displays May's personal locker contents (botany textbooks, folded uniform,
 * and personal keepsakes). Accessible after opening the padlock with Key 14.
 */
export const Locker14InteriorView: React.FC<Locker14InteriorViewProps> = ({
  inventory: propInventory,
  addItem: propAddItem,
  addInventoryItem: propAddInventoryItem,
  stairwayGateKeyTaken: propStairwayGateKeyTaken,
  setStairwayGateKeyTaken: propSetStairwayGateKeyTaken,
  setActiveMonologue,
  addDiscoveredClue,
  onReturn,
}) => {
  const store = useGameStore();

  const currentInventory = propInventory ?? store.inventory ?? [];
  const hasKey = currentInventory.includes('key_stairway_gate');
  const isTaken = Boolean(propStairwayGateKeyTaken ?? store.stairwayGateKeyTaken ?? hasKey);

  const handleGateKeyClick = () => {
    // Guard against duplicate looting if already taken or key is held
    if (isTaken || hasKey) {
      try {
        sound.playPaperRustle();
      } catch {}
      setActiveMonologue?.(
        MONOLOGUE_LINES.STAIRWAY_GATE_KEY_ALREADY_TAKEN ??
          '— The iron key has already been taken. Only rust rings remain on the shelf. —'
      );
      return;
    }

    // Play item looted audio cue with fallback to paper rustle
    try {
      sound.playItemLooted();
    } catch {
      try {
        sound.playPaperRustle();
      } catch {}
    }

    // Dispatch item addition to store and/or props
    store.addItem?.('key_stairway_gate');
    propAddItem?.('key_stairway_gate');
    propAddInventoryItem?.('key_stairway_gate');

    // Set persistent flag in store and/or props
    store.setStairwayGateKeyTaken?.(true);
    propSetStairwayGateKeyTaken?.(true);

    // Append discovered clue
    addDiscoveredClue?.('clue_stairway_key_found');
    store.addDiscoveredClue?.('clue_stairway_key_found');

    // Display feedback thought
    setActiveMonologue?.(
      MONOLOGUE_LINES.STAIRWAY_GATE_KEY_ACQUIRED ??
        '— [ITEM ACQUIRED: Stairway Gate Key] — A heavy, blackened iron key. Ko Zaw must have hidden this here so May could bypass the curfew gate to reach the terrace. —'
    );
  };

  const handleReturn = () => {
    try {
      sound.playDoorCreak();
    } catch {
      try {
        sound.playPaperRustle();
      } catch {}
    }
    onReturn();
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-black pointer-events-auto">
      {/* 1. Full-viewport fixed background using Locker 14 Interior Artwork */}
      <img
        src="/assets/scenes/locker_14_interior.jpg"
        onError={(e) => {
          e.currentTarget.src = 'assets/scenes/locker_14_interior.jpg';
        }}
        alt="Locker 14 Interior (Mama May)"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50 pointer-events-none" />

      {/* 2. Standardized Scene Navigation Bar */}
      <SceneNavBar
        onReturn={handleReturn}
        returnDestination="LOCKERS"
        areaZone="EAST WING"
        areaName="STUDENT LOCKER BAY"
      />

      {/* 3. Interactive Hotspot: May's Folded Uniform & Jasmine Keepsake (Upper Shelf) */}
      <InteractiveHotspot
        id="locker14-uniform"
        name="Folded Cotton Uniform"
        polygonPoints="30,20 68,20 68,52 30,52"
        cursorTooltip="Examine May's Folded Uniform"
        onClick={() => {
          sound.playPaperRustle();
          setActiveMonologue?.(
            "— May's neatly folded floral cotton blouses and hostel uniform. Faint scent of dried jasmine flowers lingers on the fabric. —"
          );
        }}
      />

      {/* 4. Interactive Hotspot: Biology Course Notebooks (Middle Tier) */}
      <InteractiveHotspot
        id="locker14-notebooks"
        name="Biology Notebooks (Roll 14)"
        polygonPoints="32,56 70,56 70,82 32,82"
        cursorTooltip="Inspect University Notebooks"
        onClick={() => {
          sound.playPaperRustle();
          setActiveMonologue?.(
            "— A handwritten syllabus notebook: 'May — Biology III, Roll 14'. The ink is unfaded. Her handwriting is steady and meticulous. —"
          );
          addDiscoveredClue?.('clue_locker_14_found');
        }}
      />

      {/* 5. Interactive Hotspot: Stairway Gate Key (Lower Shelf) */}
      <InteractiveHotspot
        id="locker14-gate-key"
        name={isTaken ? 'Empty Lower Shelf' : 'Take Stairway Gate Key'}
        polygonPoints="34,76 66,76 66,94 34,94"
        cursorTooltip={isTaken ? 'Empty Lower Shelf' : 'Take Stairway Gate Key'}
        onClick={handleGateKeyClick}
      />
    </div>
  );
};

export default Locker14InteriorView;
