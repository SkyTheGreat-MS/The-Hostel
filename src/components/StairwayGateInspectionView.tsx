import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key } from 'lucide-react';
import { sound } from '../audioEngine';
import { SceneNavBar } from './SceneNavBar';
import { OuterGroundsView } from './OuterGroundsView';
import { ChapterTransitionModal } from './ChapterTransitionModal';
import { Phase3Location } from '../types';
import { MONOLOGUE_LINES } from '../data/dialogues';
import { useGameStore } from '../context/GameProgressContext';

export interface StairwayGateInspectionViewProps {
  inventory?: string[];
  setInventory?: React.Dispatch<React.SetStateAction<string[]>>;
  removeInventoryItem?: (itemId: string) => void;
  removeItem?: (itemId: string) => void;
  stairwayGateUnlocked?: boolean;
  setStairwayGateUnlocked?: (val: boolean | ((prev: boolean) => boolean)) => void;
  chapter3Unlocked?: boolean;
  setChapter3Unlocked?: (val: boolean | ((prev: boolean) => boolean)) => void;
  advanceToChapter?: (chapterNumber: number) => void;
  setActiveMonologue?: (msg: string | null) => void;
  addDiscoveredClue?: (clueId: string) => void;
  onReturn: () => void;
  setPhase3Location?: (loc: Phase3Location) => void;
  onSaveAndExit?: () => void;
  isChapterTransitionOpen?: boolean;
  setIsChapterTransitionOpen?: (val: boolean | ((prev: boolean) => boolean)) => void;
}

/**
 * StairwayGateInspectionView — Exit Accordion Gate Inspection & Chapter 3 Unlock Sequence
 *
 * Direct integration with ChapterTransitionModal (single source of truth).
 * On gate unlock, plays SFX, consumes the key, marks stairwayGateUnlocked, shows the completion
 * thought line, and mounts ChapterTransitionModal after 1.2s without changing background scenes.
 */
export const StairwayGateInspectionView: React.FC<StairwayGateInspectionViewProps> = ({
  inventory = [],
  setInventory,
  removeInventoryItem,
  removeItem,
  stairwayGateUnlocked = false,
  setStairwayGateUnlocked,
  chapter3Unlocked = false,
  setChapter3Unlocked,
  advanceToChapter,
  setActiveMonologue,
  addDiscoveredClue,
  onReturn,
  setPhase3Location,
  onSaveAndExit,
  isChapterTransitionOpen,
  setIsChapterTransitionOpen,
}) => {
  const [showUnlockPrompt, setShowUnlockPrompt] = useState<boolean>(false);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [localTransitionOpen, setLocalTransitionOpen] = useState<boolean>(false);

  const transitionOpen = isChapterTransitionOpen !== undefined ? isChapterTransitionOpen : localTransitionOpen;
  const setTransitionOpen = setIsChapterTransitionOpen || setLocalTransitionOpen;

  const hasGateKey = inventory.includes('key_stairway_gate');

  // State A: Unlocked bypass -> Directly render OuterGroundsView only if already unlocked and not in transition
  if (stairwayGateUnlocked && !transitionOpen && !isUnlocking) {
    return (
      <OuterGroundsView
        setActiveMonologue={setActiveMonologue}
        addDiscoveredClue={addDiscoveredClue}
        onReturn={onReturn}
        setPhase3Location={setPhase3Location}
      />
    );
  }

  // Padlock & chains hotspot click handler
  const handlePadlockClick = () => {
    if (isUnlocking || transitionOpen) return;

    if (!hasGateKey) {
      // State B: Locked without key
      setShowUnlockPrompt(false);
      try {
        sound.playLockJiggle();
      } catch {
        sound.playMetallicTumblerClick();
      }
      setActiveMonologue?.(
        MONOLOGUE_LINES.STAIRWAY_GATE_LOCKED_NO_KEY ||
          '— "A heavy brass padlock bound tight by rusted industrial chains. The gate seals the exterior stairwell leading down to the hostel courtyard and the main compound gate. It requires a heavy iron key." —'
      );
      addDiscoveredClue?.('clue_stairway_gate_locked');
    } else {
      // State C: Locked with key -> Toggle minimal action prompt pill
      try {
        sound.playMetallicTumblerClick();
      } catch {
        sound.playPaperRustle();
      }
      setShowUnlockPrompt((prev) => !prev);
      setActiveMonologue?.(null);
    }
  };

  // Unlock sequence resolution pipeline
  const handleUnlockSequence = () => {
    if (isUnlocking || transitionOpen) return;
    setIsUnlocking(true);
    setShowUnlockPrompt(false);

    // 1. Play key_turn.mp3, padlock_open.mp3, chain_drop.mp3, and metal_gate_slide.mp3
    sound.playKeyTurn();
    setTimeout(() => {
      sound.playPadlockOpen();
    }, 140);

    setTimeout(() => {
      sound.playChainDrop();
    }, 380);

    setTimeout(() => {
      sound.playMetalGateSlide();
    }, 680);

    // 2. Remove 'key_stairway_gate' from inventory
    if (removeInventoryItem) {
      removeInventoryItem('key_stairway_gate');
    } else if (removeItem) {
      removeItem('key_stairway_gate');
    } else if (setInventory) {
      setInventory((prev) => prev.filter((item) => item !== 'key_stairway_gate'));
    }

    // 3. Mark stairwayGateUnlocked: true and persist Chapter 3 unlock
    setStairwayGateUnlocked?.(true);
    setChapter3Unlocked?.(true);
    useGameStore.setState({
      stairwayGateUnlocked: true,
      chapter3Unlocked: true,
      chapter2Completed: true,
      maxUnlockedChapter: 3,
      highestChapterCompleted: 2,
    });
    try {
      localStorage.setItem('spirits_labyrinth_ch3_unlocked', 'true');
    } catch {}

    // 4. Display the completion thought line
    setActiveMonologue?.(
      '— The iron key turns with a sharp snap. The rusted chains fall away, and the accordion gate slides open to the cold night air. —'
    );

    // 5. After a 1.2-second delay, mount ChapterTransitionModal directly
    setTimeout(() => {
      sound.playPhaseComplete();
      setTransitionOpen(true);
      setIsUnlocking(false);
    }, 1200);
  };

  const handleReturn = () => {
    try {
      sound.playPaperRustle();
    } catch {}
    onReturn();
  };

  const handleContinueToChapterThree = () => {
    sound.playMenuSelect();
    setTransitionOpen(false);

    // 1. Authoritative chapter bump (preserving inventory)
    if (advanceToChapter) {
      advanceToChapter(3);
    } else {
      useGameStore.getState().advanceToChapter(3);
    }

    useGameStore.setState({
      stairwayGateUnlocked: true,
      chapter3Unlocked: true,
      chapter2Completed: true,
      maxUnlockedChapter: 3,
      highestChapterCompleted: 2,
      phase3Location: 'hostel_outer_grounds',
    });

    try {
      localStorage.setItem('spirits_labyrinth_ch3_unlocked', 'true');
    } catch {}

    // 2. Set authoritative scene & location
    setStairwayGateUnlocked?.(true);
    setChapter3Unlocked?.(true);
    if (setPhase3Location) {
      setPhase3Location('hostel_outer_grounds');
    }

    // 3. Sync Prolog engine
    try {
      if (typeof (window as any).prologEngine?.query === 'function') {
        (window as any).prologEngine.query(
          'retractall(player_has(key_stairway_gate)), assertz(stairway_gate_unlocked), assertz(escaped_interior).'
        );
      }
    } catch {}

    // 4. Trigger scene transition audio
    sound.playRainOutdoor();
  };

  const handleSaveAndExit = () => {
    sound.playPaperRustle();
    setTransitionOpen(false);
    setStairwayGateUnlocked?.(true);
    setChapter3Unlocked?.(true);

    if (advanceToChapter) {
      advanceToChapter(3);
    } else {
      useGameStore.getState().advanceToChapter(3);
    }

    useGameStore.setState({
      stairwayGateUnlocked: true,
      chapter3Unlocked: true,
      chapter2Completed: true,
      maxUnlockedChapter: 3,
      highestChapterCompleted: 2,
      phase3Location: 'hostel_outer_grounds',
    });

    try {
      localStorage.setItem('spirits_labyrinth_ch3_unlocked', 'true');
    } catch {}

    if (onSaveAndExit) {
      onSaveAndExit();
    } else {
      window.location.href = '/chapters';
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-black pointer-events-auto">
      {/* 1. Full-viewport fixed background using Gate Inspection Artwork */}
      <img
        src="/assets/scenes/stairway_gate_inspection.jpg"
        onError={(e) => {
          e.currentTarget.src = 'assets/scenes/stairway_gate_inspection.jpg';
        }}
        alt="Stairway Exit Accordion Gate Inspection"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50 pointer-events-none" />

      {/* 2. Standardized Scene Navigation Bar */}
      <SceneNavBar
        onReturn={handleReturn}
        returnDestination="LANDING"
        areaZone="GROUND FLOOR LANDING"
        areaName="STAIRWAY EXIT ACCORDION GATE"
      />

      {/* 3. Interactive Padlock & Chains Hotspot */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none group"
        data-hotspot-id="stairway-gate-padlock"
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <g
            className="group/poly pointer-events-auto cursor-pointer"
            onClick={handlePadlockClick}
            onMouseEnter={() => sound.playMenuHover()}
          >
            <polygon
              points="55,35 62,35 62,53 55,52"
              className={`fill-transparent stroke-transparent transition-all duration-300 ${
                hasGateKey
                  ? 'group-hover:stroke-emerald-400 group-hover:stroke-[0.6] group-hover:[stroke-dasharray:4,3] group-hover:fill-emerald-500/10 group-hover:filter group-hover:drop-shadow-[0_0_12px_rgba(110,231,183,0.4)]'
                  : 'group-hover:stroke-[#82a996]/60 group-hover:stroke-[0.5] group-hover:fill-[#82a996]/5 group-hover:filter group-hover:drop-shadow-[0_0_8px_rgba(130,169,150,0.3)]'
              }`}
            />
            <title>{hasGateKey ? 'Unlock Stairway Exit Gate' : '[Examine Heavy Padlock & Chains]'}</title>
          </g>
        </svg>

        {/* Hover label / tooltip anchored above padlock & chains */}
        <span
          className="absolute px-2.5 py-1 rounded bg-[#121815]/95 border border-[#2c3d34] text-[10px] font-mono text-[#82a996] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg -translate-x-1/2 -translate-y-full mb-2 z-30"
          style={{ left: '62%', top: '24%' }}
        >
          {hasGateKey ? 'Unlock Stairway Exit Gate' : '[Examine Heavy Padlock & Chains]'}
        </span>
      </div>

      {/* 4. Action Prompt Pill: [ Unlock Gate with Stairway Key ] */}
      <AnimatePresence>
        {showUnlockPrompt && hasGateKey && !isUnlocking && !transitionOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[72%] left-1/2 -translate-x-1/2 z-40 pointer-events-auto"
          >
            <button
              onClick={handleUnlockSequence}
              className="px-5 py-2.5 bg-[#0b1712]/95 hover:bg-[#12281e] text-emerald-300 hover:text-emerald-100 border border-emerald-500/60 hover:border-emerald-400 rounded-full font-mono text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.55)] transition-all flex items-center gap-2 cursor-pointer ring-1 ring-emerald-500/30"
            >
              <Key className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              [ Unlock Gate with Stairway Key ]
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Direct ChapterTransitionModal Reuse for Chapter 2 -> Chapter 3 */}
      <ChapterTransitionModal
        isOpen={transitionOpen}
        overTitle="INVESTIGATION PHASE COMPLETED"
        completedChapterTitle="CHAPTER 2: UNDERSTANDING"
        nextPhaseTag="ENTERING NEXT PHASE"
        nextChapterTitle="CHAPTER 3: ESCAPE / THE OUTSIDE GROUNDS"
        continueButtonText="CONTINUE INVESTIGATION →"
        saveButtonText="SAVE & EXIT TO CHAPTER SELECTION"
        onContinue={handleContinueToChapterThree}
        onSaveAndExit={handleSaveAndExit}
      />
    </div>
  );
};

// Also export as BalconyStairwayGateView for alias compatibility
export const BalconyStairwayGateView = StairwayGateInspectionView;

export default StairwayGateInspectionView;
