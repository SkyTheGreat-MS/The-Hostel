import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../audioEngine';
import { InteractiveHotspot } from './common/InteractiveHotspot';
import { SceneNavBar } from './common/SceneNavBar';
import { MONOLOGUE_LINES } from '../data/dialogues';
import { FileText, X } from 'lucide-react';

export interface DeskInspectionViewProps {
  deskMugMoved: boolean;
  setDeskMugMoved: (moved: boolean) => void;
  desk4bLooted: boolean;
  setDesk4bLooted: (looted: boolean) => void;
  inventory: string[];
  addInventoryItem: (item: string) => void;
  addDiscoveredClue: (clue: string) => void;
  setActiveMonologue: (text: string | null) => void;
  setRoomBanner?: (banner: { text: string; type: 'success' | 'warning' | 'info' } | null) => void;
  onStepBack: () => void;
  hasBobbyPin?: boolean;
}

/**
 * DeskInspectionView - Room 4B Study Desk Zoom View
 *
 * Implements the Room 4B Desk Loot Chain:
 * Replaces the generic cleaning duty roster with Ko Zaw's secret folded letter
 * ('letter_ko_zaw'). Allows reading the note and collecting it into the inventory
 * for the handover sequence with Spectral May on the Overlook Balcony.
 */
export const DeskInspectionView: React.FC<DeskInspectionViewProps> = ({
  deskMugMoved,
  setDeskMugMoved,
  desk4bLooted,
  setDesk4bLooted,
  inventory,
  addInventoryItem,
  addDiscoveredClue,
  setActiveMonologue,
  setRoomBanner,
  onStepBack,
  hasBobbyPin = false,
}) => {
  const [isLetterModalOpen, setIsLetterModalOpen] = useState<boolean>(false);

  const isLetterInInventory = desk4bLooted || inventory.includes('letter_ko_zaw') || inventory.includes('clue_letter_4b');

  // Handle clicking the folded letter on the desk
  const handleLetterClick = () => {
    if (!isLetterInInventory) {
      sound.playPaperRustle();
      if (!deskMugMoved) {
        setDeskMugMoved(true);
      }
      setIsLetterModalOpen(true);
      setActiveMonologue(null);
    } else {
      sound.playPaperRustle();
      setActiveMonologue(MONOLOGUE_LINES.DESK_SURFACE_EMPTY);
    }
  };

  // Handle looting Ko Zaw's letter into inventory
  const handleTakeLetter = () => {
    // 1. Audio cues: paper rustle followed by acquisition chime
    sound.playPaperRustle();
    setTimeout(() => {
      sound.playItemLooted();
    }, 150);

    // 2. Dispatch item addition to inventory
    addInventoryItem('letter_ko_zaw');

    // 3. Mark desk as looted in persistent store
    setDesk4bLooted(true);

    // 4. Log clue to Case Notes
    addDiscoveredClue('clue_may_letter');

    // 5. Close letter modal
    setIsLetterModalOpen(false);

    // 6. Set thought monologue line
    setActiveMonologue(MONOLOGUE_LINES.DESK_LETTER_LOOTED);

    // 7. Optional success notification banner
    setRoomBanner?.({
      text: "Retrieved Ko Zaw's Folded Letter. Added to inventory.",
      type: 'success',
    });
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none bg-black pointer-events-auto">
      {/* Background Image */}
      <img
        src="/assets/scenes/room_4b_desk_zoom.jpg"
        onError={(e) => {
          e.currentTarget.src = 'assets/scenes/room_4b_desk_zoom.jpg';
        }}
        alt="Room 4B Study Desk Zoom"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50 pointer-events-none" />

      {/* Standardized Scene Navigation Bar */}
      <SceneNavBar
        onReturn={onStepBack}
        returnDestination="ROOM 4B"
        areaZone="ROOM 4B"
        areaName="STUDY DESK"
      />

      {/* 1. Chipped Enamel Mug Hotspot */}
      <InteractiveHotspot
        id="desk_enamel_mug"
        name="Chipped Enamel Mug"
        cursorTooltip={deskMugMoved ? 'Shifted Enamel Mug' : 'Chipped Enamel Mug (Move Aside)'}
        polygonPoints="14.5,23.5 25.5,22 28.5,31 31.5,41 29,52 24.5,56.5 15.5,55 14,35"
        onClick={() => {
          if (!deskMugMoved) {
            setDeskMugMoved(true);
            sound.playPaperRustle();
            setActiveMonologue(MONOLOGUE_LINES.DESK_MUG_MOVED);
          } else {
            sound.playMenuSelect();
            setActiveMonologue(
              '— The chipped enamel mug has already been shifted aside. Nothing else underneath. —'
            );
          }
        }}
      />

      {/* 2. Ko Zaw's Folded Letter Hotspot (Replaces Generic Cleaning Log) */}
      <InteractiveHotspot
        id="desk_roster_slip"
        name={isLetterInInventory ? 'Empty Desk Surface' : "Ko Zaw's Folded Letter"}
        cursorTooltip={isLetterInInventory ? 'Empty Desk Surface' : 'Read Folded Letter'}
        polygonPoints="15,42.5 3.5,57.5 22.5,93 39.5,70 33,52 27,56"
        onClick={handleLetterClick}
      />

      {/* 3. Bent Steel Bobby Pin in Ceramic Tray */}
      {!hasBobbyPin && !inventory.includes('bobby_pin') && (
        <InteractiveHotspot
          id="desk_ceramic_tray"
          name="Bent Steel Bobby Pin"
          cursorTooltip="Inspect Ceramic Tray (Bent Steel Pin)"
          polygonPoints="48.5,28 56.5,28 52,36.5 48.5,36.5"
          onClick={() => {
            addInventoryItem('bobby_pin');
            sound.playPaperRustle();
            setRoomBanner?.({
              text: 'Searching through dried ink nibs in the ceramic tray, you retrieve a sturdy bent steel bobby pin! Added to inventory.',
              type: 'success',
            });
          }}
        />
      )}

      {/* 4. Physics & Chemistry Lecture Notes */}
      <InteractiveHotspot
        id="desk_lecture_books"
        name="Lecture Notebooks"
        cursorTooltip="Physics & Chemistry Lecture Notes (1998)"
        polygonPoints="35,83 72,69 79,96 35,96"
        onClick={() => {
          sound.playPaperRustle();
          setActiveMonologue(
            "— Physics and chemistry lecture notes from 1998... Someone scribbled: 'Strange voltage drops and vibrations in the hallway past 11 PM...' —"
          );
        }}
      />

      {/* Ko Zaw's Folded Letter Inspection Reader Modal */}
      <AnimatePresence>
        {isLetterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-lg rounded-2xl bg-[#0e1612]/98 border border-[#2d4436] p-6 sm:p-7 shadow-[0_0_50px_rgba(16,185,129,0.2)] text-[#c2d6cc]"
            >
              {/* Top Accent & Close */}
              <div className="flex items-center justify-between border-b border-[#22352b] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#18261f] border border-[#2d4436] flex items-center justify-center text-emerald-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3
                      className="font-mono text-sm sm:text-base font-bold tracking-widest text-[#d8eae1] uppercase"
                      style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                    >
                      KO ZAW'S FOLDED LETTER
                    </h3>
                    <p className="text-[10px] font-mono text-[#6c8f7d] uppercase tracking-wider">
                      Room 4B • August 1998
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsLetterModalOpen(false)}
                  className="p-1.5 rounded-lg bg-[#14201a] border border-[#22352b] text-[#6c8f7d] hover:text-[#c2d6cc] hover:border-[#3d5e48] transition-all cursor-pointer"
                  title="Close Letter"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Letter Parchment Reader Content */}
              <div className="relative rounded-xl bg-[#080d0a]/90 border border-[#1e2f25] p-5 sm:p-6 mb-5 font-mono text-xs sm:text-sm leading-relaxed text-[#bad3c7] shadow-inner space-y-3">
                <div className="text-[11px] text-[#5e8270] tracking-wider uppercase border-b border-[#18261e] pb-1">
                  [ Creased lined notebook page — Hasty Burmese script ]
                </div>
                <p className="italic text-[#d8eae1] tracking-wide pt-1">
                  “May — I left the tape where we said, behind the vent in 326. Don't let Sandar take the room key from your locker. Meet me on the terrace when the curfew bell rings. — Ko Zaw”
                </p>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsLetterModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#121c17] hover:bg-[#1a2821] border border-[#22352b] text-stone-400 hover:text-stone-200 text-xs font-mono tracking-wider uppercase transition-all cursor-pointer"
                >
                  [ Put Back ]
                </button>
                <button
                  onClick={handleTakeLetter}
                  className="group flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-500/60 hover:border-emerald-400 text-emerald-200 hover:text-white text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all cursor-pointer active:scale-95"
                >
                  <span>[ Take Letter ]</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeskInspectionView;
