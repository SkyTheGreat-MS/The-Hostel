import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AtmosphericLayout } from '../components/AtmosphericLayout';
import { useGameProgress } from '../context/GameProgressContext';
import { sound } from '../audioEngine';
import {
  loadChapterOneProgress,
  clearChapterOneProgress,
  hasActiveChapterOneSave,
  hasActiveChapterTwoSave,
  restart_chapter_one,
} from '../gameStore';
import { ChapterCard } from '../components/ChapterSelection';
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
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);
  const [ch1Save, setCh1Save] = useState<ChapterProgressSave | null>(null);
  const [showRestartCh1Confirm, setShowRestartCh1Confirm] = useState<boolean>(false);

  // Dynamic check for Chapter 1 completion via persistent active save
  const getActiveSave = () => {
    try {
      return JSON.parse(localStorage.getItem('spirits_labyrinth_active_save') || '{}');
    } catch {
      return {};
    }
  };
  const activeSave = getActiveSave();
  const isChapter1Done = Boolean(activeSave.chapter1Completed);

  // Strict Chapter Locking Rules: Chapter 2 strictly requires Chapter 1 completed
  const isChapterUnlocked = (num: number): boolean => {
    if (num === 1) return true;
    if (num === 2) return isChapter1Done;
    if (num === 3) return highestChapterCompleted >= 2;
    return false;
  };

  // Refresh active save on load
  useEffect(() => {
    const save = loadChapterOneProgress();
    setCh1Save(save);
  }, []);

  // Auto-focus on highest available chapter on load
  useEffect(() => {
    if (highestChapterCompleted >= 2) {
      setSelectedChapter(3);
    } else if (isChapter1Done) {
      setSelectedChapter(2);
    } else {
      setSelectedChapter(1);
    }
  }, [highestChapterCompleted, isChapter1Done]);

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
    if (!isChapter1Done) {
      sound.playError();
      setLockedNotice('Finish Chapter 1 to unlock.');
      setTimeout(() => setLockedNotice(null), 3000);
      return;
    }
    sound.playMenuSelect();
    navigate('/chapters/2');
  };

  // Handle Full State & Storage Wipe on Chapter 1 Restart
  const handleConfirmRestartChapterOne = () => {
    // 1. Purge persistent storage
    localStorage.removeItem('spirits_labyrinth_active_save');
    localStorage.removeItem('spirits_labyrinth_ch2_unlocked');
    clearChapterOneProgress();

    // 2. Set fresh Chapter 1 state in store / localStorage
    const freshChapterOneSave = {
      chapter: 1,
      currentPhase: 1,
      chapter1Completed: false, // CRITICAL: Lock Chapter 2 again
      phase3Location: 'hallway_threshold',
      selectedCharacterId: null,
      inventory: [],
      discoveredClues: [],
      hasBobbyPin: false,
      hasWoodenBat: false,
      hasSmallBrassKey: false,
      hasNylonRope: false,
      hasBlackCandlesCount: 0,
      hasMatchesCount: 0,
      hasBronzeBell: false,
      caretakerDoorUnlocked: false,
      composure: 100,
      timerSeconds: 600,
      timestamp: Date.now(),
    };
    localStorage.setItem('spirits_labyrinth_active_save', JSON.stringify(freshChapterOneSave));

    // 3. Reset in-memory engine & context state
    resetProgress();
    resetChapterOneProgress();
    setCh1Save(null);
    setShowRestartCh1Confirm(false);

    // 4. Start Chapter 1 from the 2026 seance
    sound.playPaperRustle();
    navigate('/chapters/1');
  };

  // Handle Chapter 1 continue
  const handleContinueChapter1 = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playMenuSelect();
    navigate('/chapters/1');
  };

  // Keyboard navigation: Left/Right to select, 1-3 to jump, Enter to play
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showRestartCh1Confirm) return;

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
          if (!isChapter1Done) {
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
  }, [selectedChapter, isChapter1Done, highestChapterCompleted, showRestartCh1Confirm]);

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
              status={isChapter1Done ? 'COMPLETED' : 'AVAILABLE'}
              buttonText={
                isChapter1Done
                  ? 'REVISIT'
                  : ch1Save &&
                    (ch1Save.currentPhase > 1 ||
                      (ch1Save.inventory && ch1Save.inventory.length > 0) ||
                      (ch1Save.discoveredClues && ch1Save.discoveredClues.length > 0) ||
                      ch1Save.doorUnlocked)
                  ? `CONTINUE (PHASE 0${ch1Save.currentPhase})`
                  : 'START INVESTIGATION'
              }
              isLocked={false}
              isCompleted={isChapter1Done}
              isSelected={selectedChapter === 1}
              hasActiveSave={
                !isChapter1Done &&
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
                setShowRestartCh1Confirm(true);
              }}
            />

            {/* 2. Chapter 2 Card */}
            <ChapterCard
              title="UNDERSTANDING"
              chapterNumber={2}
              status={isChapter1Done ? 'AVAILABLE / ACTIVE' : 'LOCKED'}
              buttonText={isChapter1Done ? 'CONTINUE' : 'LOCKED'}
              isLocked={!isChapter1Done}
              isCompleted={highestChapterCompleted >= 2}
              isSelected={selectedChapter === 2}
              onSelect={() => {
                sound.playMenuHover();
                setSelectedChapter(2);
              }}
              onAction={() => {
                if (!isChapter1Done) {
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

        {/* Replay Chapter 1 Purge Confirmation Modal */}
        <AnimatePresence>
          {showRestartCh1Confirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none"
            >
              <motion.div
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                className="bg-[#121915] border border-[#2e4337] rounded-xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-[#d1e3da] text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#1b2b22] border border-[#375242] flex items-center justify-center text-amber-400">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-mono tracking-wider text-[#d1e3da] mb-2 uppercase">
                  Restart Chapter 1?
                </h3>
                <p className="text-xs text-[#8fa89b] mb-6 leading-relaxed font-mono">
                  Replaying Chapter 1 will purge your Chapter 2 investigation checkpoint. You will start completely from the 2026 seance. Proceed?
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowRestartCh1Confirm(false)}
                    className="px-4 py-2.5 rounded-lg bg-[#18221c] hover:bg-[#202c25] border border-[#2b3d32] text-[#8fa89b] text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmRestartChapterOne}
                    className="px-4 py-2.5 rounded-lg bg-[#24382c] hover:bg-[#2f493a] border border-[#446652] text-[#e0ede6] text-xs font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer shadow-lg"
                  >
                    Proceed
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimal Progress Indicator Dots & Reset Button */}
        <div className="mt-8 flex items-center gap-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => {
                  sound.playMenuHover();
                  setSelectedChapter(num);
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  selectedChapter === num
                    ? 'w-8 bg-[#476756]'
                    : 'w-2 bg-[#1c2821] hover:bg-[#2e4035]'
                }`}
                aria-label={`Select Chapter ${num}`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (confirm('Reset chapter progress back to Chapter 1?')) {
                clearChapterOneProgress();
                resetProgress();
                setCh1Save(null);
                setSelectedChapter(1);
                sound.playDamage();
              }
            }}
            title="Reset Chapter Progress"
            className="p-1.5 rounded text-stone-600 hover:text-rose-400 hover:bg-[#141f19] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </AtmosphericLayout>
  );
};

export default ChapterSelect;
