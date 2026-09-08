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
  route: string;
}

const CHAPTERS: ChapterItem[] = [
  {
    number: 1,
    title: 'Blind Start',
    route: '/chapters/1',
  },
  {
    number: 2,
    title: 'Understanding',
    route: '/chapters/2',
  },
  {
    number: 3,
    title: 'The Ritual',
    route: '/chapters/3',
  },
];

export const ChapterSelect: React.FC = () => {
  const {
    highestChapterCompleted,
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
  const [isChapter2Unlocked, setIsChapter2Unlocked] = useState<boolean>(() => Boolean(getActiveSave()?.chapter1Completed));

  // Strict Chapter Locking Rules: Chapter 2 strictly requires Chapter 1 completed
  const isChapterUnlocked = (num: number): boolean => {
    if (num === 1) return true;
    if (num === 2) return isChapter2Unlocked;
    if (num === 3) return highestChapterCompleted >= 2;
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
    setIsChapter2Unlocked(done);
  }, []);

  // Auto-focus on highest available chapter on load
  useEffect(() => {
    if (highestChapterCompleted >= 2) {
      setSelectedChapter(3);
    } else if (isChapter2Unlocked) {
      setSelectedChapter(2);
    } else {
      setSelectedChapter(1);
    }
  }, [highestChapterCompleted, isChapter2Unlocked]);

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

  // Handle entering chapter
  const handleSelectChapter = (chapterNum: number) => {
    const unlocked = isChapterUnlocked(chapterNum);
    setSelectedChapter(chapterNum);

    if (!unlocked) {
      sound.playError();
      const requiredChapter = chapterNum - 1;
      setLockedNotice(`Finish Chapter ${requiredChapter} to unlock.`);
      setTimeout(() => setLockedNotice(null), 3000);
      return;
    }

    sound.playMenuSelect();
    const chap = CHAPTERS.find((c) => c.number === chapterNum);
    if (chap) {
      navigate(chap.route);
    }
  };

  // Handle starting Chapter 2
  const handleStartChapterTwo = () => {
    if (!isChapter2Unlocked) {
      sound.playError();
      setLockedNotice('Finish Chapter 1 to unlock.');
      setTimeout(() => setLockedNotice(null), 3000);
      return;
    }
    sound.playMenuSelect();
    navigate('/chapters/2');
  };

  // Full Storage and State Wipe on Confirmation (Execute Chapter Reset)
  const handleExecuteChapterReset = () => {
    // 1. Clear all persistent save keys
    localStorage.removeItem('spirits_labyrinth_active_save');
    localStorage.removeItem('spirits_labyrinth_ch2_unlocked');
    localStorage.removeItem('spirits_labyrinth_save_ch1');

    // 2. Clear store / in-memory state
    resetChapterState();
    resetProgress();
    resetChapterOneProgress();
    clearChapterOneProgress();
    setChapter(1);
    setSelectedChapter(1);
    setChapter1Completed(false);
    setIsChapter2Unlocked(false);
    setActiveSave(null);
    setCh1Save(null);

    // 3. Close modal and force immediate UI re-render
    setShowRestartConfirm(false);
    sound.playPaperRustle();
  };

  // Keyboard navigation: Left/Right to select, 1-3 to jump, Enter to play
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
        if (selectedChapter === 2) {
          if (!isChapter2Unlocked) {
            sound.playError();
            setLockedNotice('Finish Chapter 1 to unlock.');
            setTimeout(() => setLockedNotice(null), 3000);
            return;
          }
          handleStartChapterTwo();
        } else {
          handleSelectChapter(selectedChapter);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedChapter, isChapter2Unlocked, highestChapterCompleted, showRestartConfirm]);

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
              chapterNumber={1}
              status={chapter1Completed ? 'COMPLETED' : 'AVAILABLE / ACTIVE'}
              buttonText={
                chapter1Completed
                  ? 'REVISIT'
                  : ch1Save &&
                    (ch1Save.currentPhase > 1 ||
                      (ch1Save.inventory && ch1Save.inventory.length > 0) ||
                      (ch1Save.discoveredClues && ch1Save.discoveredClues.length > 0) ||
                      ch1Save.doorUnlocked)
                  ? `CONTINUE (PHASE 0${ch1Save.currentPhase})`
                  : 'START'
              }
              isLocked={false}
              isCompleted={chapter1Completed}
              isSelected={selectedChapter === 1}
              hasActiveSave={
                !chapter1Completed &&
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
                handleSelectChapter(1);
              }}
              onRestart={() => {
                setShowRestartConfirm(true);
              }}
            />

            {/* 2. Chapter 2 Card */}
            <ChapterCard
              title="UNDERSTANDING"
              chapterNumber={2}
              status={isChapter2Unlocked ? 'AVAILABLE / ACTIVE' : 'LOCKED'}
              buttonText={isChapter2Unlocked ? 'CONTINUE' : 'LOCKED'}
              isLocked={!isChapter2Unlocked}
              isCompleted={highestChapterCompleted >= 2}
              isSelected={selectedChapter === 2}
              onSelect={() => {
                sound.playMenuHover();
                setSelectedChapter(2);
              }}
              onAction={() => {
                if (!isChapter2Unlocked) {
                  sound.playError();
                  setLockedNotice('Finish Chapter 1 to unlock.');
                  setTimeout(() => setLockedNotice(null), 3000);
                  return;
                }
                handleStartChapterTwo();
              }}
            />

            {/* 3. Chapter 3 Card */}
            <ChapterCard
              title="THE RITUAL"
              chapterNumber={3}
              status={highestChapterCompleted >= 2 ? 'AVAILABLE' : 'LOCKED'}
              buttonText="PLAY"
              isLocked={highestChapterCompleted < 2}
              isCompleted={highestChapterCompleted >= 3}
              isSelected={selectedChapter === 3}
              onSelect={() => {
                sound.playMenuHover();
                setSelectedChapter(3);
              }}
              onAction={() => {
                handleSelectChapter(3);
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

        {/* Bottom Pagination / Indicator Row */}
        <div className="flex items-center justify-center gap-3 mt-6 z-30">
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

          {/* Global Reset Chapter Progress Button */}
          <button
            onClick={() => setShowRestartConfirm(true)}
            title="Reset Chapter Progress"
            className="p-1.5 rounded-full hover:bg-[#1d2b23] border border-transparent hover:border-[#385244] text-[#7d998b] hover:text-[#b8d4c6] transition-all duration-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </AtmosphericLayout>
  );
};

export default ChapterSelect;
