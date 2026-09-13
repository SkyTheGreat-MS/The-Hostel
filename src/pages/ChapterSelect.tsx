import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AtmosphericLayout } from '../components/AtmosphericLayout';
import { useGameProgress } from '../context/GameProgressContext';
import { sound } from '../audioEngine';
import {
  loadChapterOneProgress,
  clearChapterOneProgress,
  restart_chapter_one,
  resetChapterState,
  useGameStore,
} from '../gameStore';
import { ChapterCard, RestartConfirmationModal } from '../components/ChapterSelection';
import { ChapterProgressSave } from '../types';
import {
  Lock,
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle2,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

interface ChapterItem {
  number: number;
  title: string;
  subtitle?: string;
  route: string;
}

const CHAPTERS: ChapterItem[] = [
  {
    number: 1,
    title: 'BLIND START',
    subtitle: '1998 SEANCE',
    route: '/chapters/1',
  },
  {
    number: 2,
    title: 'UNDERSTANDING',
    subtitle: 'EAST WING INVESTIGATION',
    route: '/chapters/2',
  },
  {
    number: 3,
    title: 'CHAPTER 03',
    subtitle: 'ESCAPE / THE OUTSIDE GROUNDS',
    route: '/game',
  },
];

export interface ChapterSelectProps {
  onClose?: () => void;
}

export const ChapterSelect: React.FC<ChapterSelectProps> = ({ onClose }) => {
  const {
    highestChapterCompleted,
    maxUnlockedChapter,
    chapter2Completed: contextChapter2Completed,
    chapter3Completed: contextChapter3Completed,
    justUnlockedChapter,
    clearJustUnlocked,
    resetProgress,
    resetChapterOneProgress,
  } = useGameProgress();

  const navigate = useNavigate();
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [chapter, setChapter] = useState<number>(1);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);
  const [ch1Save, setCh1Save] = useState<ChapterProgressSave | null>(() => loadChapterOneProgress());
  const [showRestartConfirm, setShowRestartConfirm] = useState<boolean>(false);

  // Dynamic check for Chapter 1 completion via persistent active save
  const getActiveSave = () => {
    try {
      return JSON.parse(localStorage.getItem('spirits_labyrinth_active_save') || '{}');
    } catch {
      return {};
    }
  };

  const [activeSave, setActiveSave] = useState<any>(() => getActiveSave());
  const [chapter1Completed, setChapter1Completed] = useState<boolean>(() => Boolean(getActiveSave()?.chapter1Completed));
  const [isChapter2Unlocked, setIsChapter2Unlocked] = useState<boolean>(() => Boolean(getActiveSave()?.chapter1Completed || highestChapterCompleted >= 1 || (maxUnlockedChapter && maxUnlockedChapter >= 2)));

  const isChapter3Unlocked = Boolean(
    (maxUnlockedChapter && maxUnlockedChapter >= 3) ||
    contextChapter2Completed ||
    Boolean(activeSave?.chapter2Completed) ||
    Boolean(activeSave?.chapter3Unlocked) ||
    (activeSave?.maxUnlockedChapter && activeSave.maxUnlockedChapter >= 3) ||
    highestChapterCompleted >= 2 ||
    localStorage.getItem('spirits_labyrinth_ch3_unlocked') === 'true'
  );

  const isChapter3Completed = Boolean(
    contextChapter3Completed ||
    Boolean(activeSave?.chapter3Completed) ||
    highestChapterCompleted >= 3 ||
    localStorage.getItem('spirits_labyrinth_ch3_completed') === 'true'
  );

  // Strict Chapter Locking Rules: Chapter 2 strictly requires Chapter 1 completed; Chapter 3 requires Chapter 2 completed
  const isChapterUnlocked = (num: number): boolean => {
    if (num === 1) return true;
    if (num === 2) return isChapter2Unlocked;
    if (num === 3) return isChapter3Unlocked;
    return false;
  };

  // Refresh active save on load
  useEffect(() => {
    const save = loadChapterOneProgress();
    setCh1Save(save);
    const act = getActiveSave();
    setActiveSave(act);
    const done = Boolean(act?.chapter1Completed);
    setChapter1Completed(done);
    setIsChapter2Unlocked(done || highestChapterCompleted >= 1 || (maxUnlockedChapter && maxUnlockedChapter >= 2));
  }, [highestChapterCompleted, maxUnlockedChapter]);

  const effectiveMaxChapter: number = isChapter3Unlocked
    ? 3
    : isChapter2Unlocked
    ? 2
    : 1;

  // Auto-focus on highest available active chapter on load
  useEffect(() => {
    setSelectedChapter(isChapter3Completed ? 3 : effectiveMaxChapter);
  }, [effectiveMaxChapter, isChapter3Completed]);

  // Audio cue when user newly unlocks a chapter
  useEffect(() => {
    if (justUnlockedChapter) {
      sound.playSuccessTune();
      const timer = setTimeout(() => {
        clearJustUnlocked();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [justUnlockedChapter, clearJustUnlocked]);

  const handleSelectChapterThree = () => {
    sound.playMenuSelect();

    // 1. Authoritative chapter & scene assignment
    try {
      const act = JSON.parse(localStorage.getItem('spirits_labyrinth_active_save') || '{}');
      act.currentChapter = 3;
      act.chapter = 3;
      act.currentLocation = 'hostel_outer_grounds';
      act.phase3Location = 'hostel_outer_grounds';
      act.chapter2Completed = true;
      act.chapter3Unlocked = true;
      act.stairwayGateUnlocked = true;
      act.stairwayGateKeyTaken = true;
      act.maxUnlockedChapter = Math.max(act.maxUnlockedChapter || 0, 3);
      act.highestChapterCompleted = Math.max(act.highestChapterCompleted || 0, 2);
      localStorage.setItem('spirits_labyrinth_active_save', JSON.stringify(act));
      localStorage.setItem('spirits_labyrinth_ch3_unlocked', 'true');

      const prog = JSON.parse(localStorage.getItem('spirits_labyrinth_progress_v1') || '{}');
      prog.chapter2Completed = true;
      prog.chapter3Unlocked = true;
      prog.maxUnlockedChapter = Math.max(prog.maxUnlockedChapter || 0, 3);
      prog.highestChapterCompleted = Math.max(prog.highestChapterCompleted || 0, 2);
      prog.stairwayGateUnlocked = true;
      prog.currentLocation = 'hostel_outer_grounds';
      prog.phase3Location = 'hostel_outer_grounds';
      localStorage.setItem('spirits_labyrinth_progress_v1', JSON.stringify(prog));
    } catch {}

    useGameStore.setState({
      currentChapter: 3,
      currentLocation: 'hostel_outer_grounds',
      phase3Location: 'hostel_outer_grounds',
      stairwayGateUnlocked: true,
      chapter3Unlocked: true,
      chapter2Completed: true,
      maxUnlockedChapter: 3,
      highestChapterCompleted: 2,
    });

    // 2. Synchronize Prolog state facts
    try {
      if (typeof window !== 'undefined' && (window as any).prologEngine) {
        (window as any).prologEngine.query?.(
          "retractall(current_chapter(_)), assertz(current_chapter(3)), assertz(stairway_gate_unlocked)."
        );
      }
    } catch {}

    // 3. Close modal and navigate directly to the game viewport
    if (onClose) {
      onClose();
    }

    navigate('/game');
  };

  const startLocations: Record<number, string> = {
    1: 'room_101',
    2: 'east_fork',
    3: 'hostel_outer_grounds',
  };

  const handleContinueActiveChapter = (chapterId: number) => {
    if (isChapter3Completed) return;
    if (chapterId < effectiveMaxChapter) return;
    if (chapterId > effectiveMaxChapter) {
      sound.playError();
      const requiredChapter = chapterId - 1;
      setLockedNotice(`Finish Chapter ${requiredChapter} to unlock.`);
      setTimeout(() => setLockedNotice(null), 3000);
      return;
    }

    sound.playMenuSelect();

    if (chapterId === 3) {
      handleSelectChapterThree();
      return;
    }

    if (chapterId === 1) {
      useGameStore.setState({
        currentChapter: 1,
        currentLocation: 'room_101',
      });
      if (onClose) {
        onClose();
      }
      navigate('/chapters/1');
      return;
    }

    if (chapterId === 2) {
      try {
        const act = JSON.parse(localStorage.getItem('spirits_labyrinth_active_save') || '{}');
        act.currentChapter = 2;
        act.chapter = 2;
        act.currentLocation = 'east_fork';
        act.phase3Location = 'east_fork';
        localStorage.setItem('spirits_labyrinth_active_save', JSON.stringify(act));
      } catch {}

      useGameStore.setState({
        currentChapter: 2,
        currentLocation: 'east_fork',
        phase3Location: 'east_fork',
      });

      if (onClose) {
        onClose();
      }
      navigate('/game');
      return;
    }
  };

  // Full Storage and State Wipe on Confirmation ("New Investigation")
  const handleExecuteChapterReset = () => {
    // 1. Clear all persistent save keys
    localStorage.removeItem('spirits_labyrinth_active_save');
    localStorage.removeItem('spirits_labyrinth_ch2_unlocked');
    localStorage.removeItem('spirits_labyrinth_ch3_unlocked');
    localStorage.removeItem('spirits_labyrinth_ch3_completed');
    localStorage.removeItem('spirits_labyrinth_save_ch1');
    localStorage.removeItem('spirits_labyrinth_progress_v1');

    // 2. Clear store / in-memory state
    resetChapterState();
    resetProgress();
    resetChapterOneProgress();
    clearChapterOneProgress();

    useGameStore.setState({
      currentChapter: 1,
      maxUnlockedChapter: 1,
      unlockedChapters: [1],
      highestChapterCompleted: 0,
      chapter1Completed: false,
      chapter2Completed: false,
      chapter3Completed: false,
      chapter3Unlocked: false,
      currentLocation: 'room_101',
      phase3Location: 'hallway_threshold',
      stairwayGateUnlocked: false,
      stairwayGateKeyTaken: false,
      locker14Unlocked: false,
      radioTuned: false,
      radioHasBatteries: false,
      mayResolved: false,
      key14OnFloor: false,
      key14Collected: false,
      inventory: [],
      discoveredClues: [],
      composure: 100,
    });

    try {
      if (typeof window !== 'undefined' && (window as any).prologEngine) {
        (window as any).prologEngine.query?.(
          "retractall(current_chapter(_)), assertz(current_chapter(1)), retractall(stairway_gate_unlocked), retractall(chapter3_completed), retractall(chapter2_completed), retractall(chapter1_completed)."
        );
      }
    } catch {}

    setChapter(1);
    setSelectedChapter(1);
    setChapter1Completed(false);
    setIsChapter2Unlocked(false);
    setActiveSave(null);
    setCh1Save(null);

    // 3. Close modal and route player directly into Chapter 1 starting scene
    setShowRestartConfirm(false);
    sound.playPaperRustle();
    if (onClose) {
      onClose();
    }
    navigate('/chapters/1');
  };

  // Keyboard navigation: Enter to continue active chapter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showRestartConfirm) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        sound.playMenuHover();
        setSelectedChapter((prev) => Math.max(1, prev - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        sound.playMenuHover();
        setSelectedChapter((prev) => Math.min(3, prev + 1));
      } else if (['1', '2', '3'].includes(e.key)) {
        const num = parseInt(e.key, 10);
        sound.playMenuHover();
        setSelectedChapter(num);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!isChapter3Completed) {
          handleContinueActiveChapter(effectiveMaxChapter);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [effectiveMaxChapter, isChapter3Completed, showRestartConfirm]);

  return (
    <AtmosphericLayout
      headerTitle="THE SPIRIT'S LABYRINTH"
      headerSubtitle="INVESTIGATION CHAPTERS"
      backgroundImage="/assets/chapter_select.jpg"
      backTo="/"
      backLabel="Main Menu"
    >
      <div className="flex-1 flex flex-col justify-center items-center relative w-full py-4 sm:py-8 select-none">
        {/* Title Header */}
        <div className="text-center mb-6 sm:mb-10">
          <span className="text-[11px] font-mono tracking-widest text-[#8fa89b] uppercase font-semibold">
            Select Investigation Phase
          </span>
          <h2
            className="text-4xl sm:text-6xl font-black text-[#d1e3da] tracking-wider uppercase drop-shadow-lg"
            style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
          >
            CHAPTER SELECTION
          </h2>
          <p className="text-xs font-mono text-[#8fa89b]/80 mt-1 tracking-wider">
            [←/→] Select &bull; [ENTER] Play
          </p>
        </div>

        {/* Just Unlocked Celebration Pill */}
        <AnimatePresence>
          {justUnlockedChapter && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 px-4 py-2 bg-[#141f19]/95 border border-[#354c3f] rounded-full flex items-center gap-2.5 text-[#a7c4b5] text-xs font-mono shadow-xl"
            >
              <Sparkles className="w-4 h-4 text-[#6ee7b7] animate-spin" />
              <span>Chapter {justUnlockedChapter} is now unlocked!</span>
              <button
                onClick={clearJustUnlocked}
                className="ml-2 text-stone-400 hover:text-white cursor-pointer"
              >
                &times;
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Chapter Cards Container */}
        <div className="relative w-full max-w-5xl flex items-center justify-center px-3 sm:px-10">
          {/* Previous Arrow Button */}
          <button
            onClick={() => {
              sound.playMenuHover();
              setSelectedChapter((prev) => Math.max(1, prev - 1));
            }}
            disabled={selectedChapter === 1}
            className={`flex absolute left-0 sm:-left-3 lg:-left-5 z-30 w-10 h-10 sm:w-11 sm:h-11 items-center justify-center rounded-full bg-[#101613]/90 border border-[#233329] transition-all ${
              selectedChapter === 1
                ? 'opacity-20 cursor-not-allowed text-stone-700'
                : 'hover:bg-[#16221c] hover:border-[#476756] text-stone-400 hover:text-[#c2d6cc] shadow-xl cursor-pointer'
            }`}
            aria-label="Previous Chapter"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Cards Showcase: All 3 visible side-by-side on sm+, 1 card on mobile */}
          <div className="w-full flex items-center justify-center gap-3 sm:gap-4 md:gap-6 py-6">
            {/* 1. Chapter 1 Card */}
            <ChapterCard
              title="BLIND START"
              subtitle="1998 SEANCE"
              chapterNumber={1}
              status={isChapter3Completed || 1 < effectiveMaxChapter ? 'CHAPTER 1 COMPLETED' : 'ACTIVE INVESTIGATION'}
              buttonText={
                !isChapter3Completed && 1 === effectiveMaxChapter
                  ? ch1Save &&
                    (ch1Save.currentPhase > 1 ||
                      (ch1Save.inventory && ch1Save.inventory.length > 0) ||
                      (ch1Save.discoveredClues && ch1Save.discoveredClues.length > 0) ||
                      ch1Save.doorUnlocked)
                    ? `CONTINUE (PHASE 0${ch1Save.currentPhase})`
                    : 'START CHAPTER 1'
                  : undefined
              }
              isLocked={!isChapter3Completed && 1 > effectiveMaxChapter}
              isCompleted={isChapter3Completed || 1 < effectiveMaxChapter}
              isActive={!isChapter3Completed && 1 === effectiveMaxChapter}
              isSelected={selectedChapter === 1}
              hasActiveSave={
                !isChapter3Completed &&
                1 === effectiveMaxChapter &&
                Boolean(
                  ch1Save &&
                    (ch1Save.currentPhase > 1 ||
                      (ch1Save.inventory && ch1Save.inventory.length > 0) ||
                      (ch1Save.discoveredClues && ch1Save.discoveredClues.length > 0) ||
                      ch1Save.doorUnlocked)
                )
              }
              activeSavePhase={ch1Save?.currentPhase || 1}
              onSelect={() => {
                sound.playMenuHover();
                setSelectedChapter(1);
              }}
              onAction={() => {
                if (!isChapter3Completed) {
                  handleContinueActiveChapter(1);
                }
              }}
              onRestart={() => {
                setShowRestartConfirm(true);
              }}
            />

            {/* 2. Chapter 2 Card */}
            <ChapterCard
              title="UNDERSTANDING"
              subtitle="EAST WING INVESTIGATION"
              chapterNumber={2}
              status={
                isChapter3Completed || 2 < effectiveMaxChapter
                  ? 'CHAPTER 2 COMPLETED'
                  : 2 === effectiveMaxChapter
                  ? 'ACTIVE INVESTIGATION'
                  : 'LOCKED'
              }
              buttonText={!isChapter3Completed && 2 === effectiveMaxChapter ? 'CONTINUE CHAPTER 2' : undefined}
              isLocked={!isChapter3Completed && 2 > effectiveMaxChapter}
              isCompleted={isChapter3Completed || 2 < effectiveMaxChapter}
              isActive={!isChapter3Completed && 2 === effectiveMaxChapter}
              isSelected={selectedChapter === 2}
              onSelect={() => {
                sound.playMenuHover();
                setSelectedChapter(2);
              }}
              onAction={() => {
                if (!isChapter3Completed) {
                  handleContinueActiveChapter(2);
                }
              }}
            />

            {/* 3. Chapter 3 Card */}
            <ChapterCard
              title="CHAPTER 03"
              subtitle="ESCAPE / THE OUTSIDE GROUNDS"
              chapterNumber={3}
              status={
                isChapter3Completed
                  ? 'CHAPTER 3 COMPLETED'
                  : 3 === effectiveMaxChapter
                  ? 'ACTIVE INVESTIGATION'
                  : 'LOCKED'
              }
              buttonText={!isChapter3Completed && 3 === effectiveMaxChapter ? 'CONTINUE CHAPTER 3' : undefined}
              isLocked={!isChapter3Completed && 3 > effectiveMaxChapter}
              isCompleted={isChapter3Completed}
              isActive={!isChapter3Completed && 3 === effectiveMaxChapter}
              isSelected={selectedChapter === 3}
              onSelect={() => {
                sound.playMenuHover();
                setSelectedChapter(3);
              }}
              onAction={() => {
                if (!isChapter3Completed) {
                  handleContinueActiveChapter(3);
                }
              }}
            />
          </div>

          {/* Next Arrow Button */}
          <button
            onClick={() => {
              sound.playMenuHover();
              setSelectedChapter((prev) => Math.min(3, prev + 1));
            }}
            disabled={selectedChapter === 3}
            className={`flex absolute right-0 sm:-right-3 lg:-right-5 z-30 w-10 h-10 sm:w-11 sm:h-11 items-center justify-center rounded-full bg-[#101613]/90 border border-[#233329] transition-all ${
              selectedChapter === 3
                ? 'opacity-20 cursor-not-allowed text-stone-700'
                : 'hover:bg-[#16221c] hover:border-[#476756] text-stone-400 hover:text-[#c2d6cc] shadow-xl cursor-pointer'
            }`}
            aria-label="Next Chapter"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Locked Warning Flash */}
        <AnimatePresence>
          {lockedNotice && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 px-4 py-2 rounded-lg bg-[#181111]/90 border border-red-900/60 text-red-300 text-xs font-mono flex items-center gap-2 shadow-lg"
            >
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span>{lockedNotice}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Restart Chapter 1 Confirmation Modal */}
        <RestartConfirmationModal
          isOpen={showRestartConfirm}
          onCancel={() => setShowRestartConfirm(false)}
          onProceed={handleExecuteChapterReset}
        />

        {/* Global Reset Action Button */}
        <div className="mt-8 flex justify-center z-30">
          <button
            onClick={() => {
              sound.playMenuHover();
              setShowRestartConfirm(true);
            }}
            className="px-6 py-2.5 rounded-lg bg-[#121915]/90 hover:bg-[#1a2620] border border-[#2b3e32] hover:border-[#40614f] text-[#8fa89b] hover:text-[#d1e3da] font-mono text-xs tracking-widest uppercase transition-all duration-200 shadow-xl flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#738f80]" />
            <span>[ RESTART INVESTIGATION (CHAPTER 1) ]</span>
          </button>
        </div>

        {/* Bottom Pagination / Indicator Row */}
        <div className="flex items-center justify-center gap-3 mt-4 z-30">
          <span
            onClick={() => {
              sound.playMenuHover();
              setSelectedChapter(1);
            }}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              selectedChapter === 1 ? 'w-6 bg-[#3d5749]' : 'w-1.5 bg-[#1b2620]'
            }`}
          />
          <span
            onClick={() => {
              sound.playMenuHover();
              setSelectedChapter(2);
            }}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              selectedChapter === 2 ? 'w-6 bg-[#3d5749]' : 'w-1.5 bg-[#1b2620]'
            }`}
          />
          <span
            onClick={() => {
              sound.playMenuHover();
              setSelectedChapter(3);
            }}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              selectedChapter === 3 ? 'w-6 bg-[#3d5749]' : 'w-1.5 bg-[#1b2620]'
            }`}
          />
        </div>
      </div>
    </AtmosphericLayout>
  );
};

export const ChapterSelectModal = ChapterSelect;
export const ChapterSelectionView = ChapterSelect;
export default ChapterSelect;
