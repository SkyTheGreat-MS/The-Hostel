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

  const hasCh2Save = hasActiveChapterTwoSave();

  // Strict Chapter Locking Rules
  const chapter1Completed = highestChapterCompleted >= 1 || hasCh2Save;
  const chapter2Completed = highestChapterCompleted >= 2;

  const isChapterUnlocked = (num: number): boolean => {
    if (num === 1) return true;
    if (num === 2) return chapter1Completed;
    if (num === 3) return chapter2Completed;
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
    } else if (highestChapterCompleted >= 1) {
      setSelectedChapter(2);
    } else {
      setSelectedChapter(1);
    }
  }, [highestChapterCompleted]);

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

  // Handle Chapter 1 explicit restart
  const handleRestartChapter1 = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearChapterOneProgress();
    resetChapterOneProgress();
    setCh1Save(null);
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
        handleSelectChapter(selectedChapter);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedChapter, highestChapterCompleted]);

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
            {CHAPTERS.map((chap) => {
              const unlocked = isChapterUnlocked(chap.number);
              const isCompleted = chap.number === 1 ? chapter1Completed : highestChapterCompleted >= chap.number;
              const isSelected = selectedChapter === chap.number;
              const hasCh1ActiveSave =
                chap.number === 1 &&
                Boolean(
                  ch1Save &&
                    (ch1Save.currentPhase > 1 ||
                      (ch1Save.inventory && ch1Save.inventory.length > 0) ||
                      (ch1Save.discoveredClues && ch1Save.discoveredClues.length > 0) ||
                      ch1Save.doorUnlocked)
                );

              // Palette Shift Card Frame Classes
              const cardClass = !unlocked
                ? 'bg-[#0b100e]/80 border border-[#1a261f] opacity-50 cursor-not-allowed text-stone-600 rounded-xl'
                : isSelected
                ? 'bg-[#141f19]/95 border-2 border-[#476756] shadow-[0_0_25px_rgba(71,103,86,0.35)] text-[#c2d6cc] backdrop-blur-md rounded-xl'
                : 'bg-[#101613]/90 border border-[#233329] text-stone-400 backdrop-blur-md rounded-xl';

              return (
                <motion.div
                  key={chap.number}
                  id={`chapter-card-${chap.number}`}
                  onClick={() => {
                    if (selectedChapter !== chap.number) {
                      sound.playMenuHover();
                      setSelectedChapter(chap.number);
                    } else if (unlocked) {
                      handleSelectChapter(chap.number);
                    } else {
                      sound.playError();
                      setLockedNotice(`Finish Chapter ${chap.number - 1} to unlock`);
                      setTimeout(() => setLockedNotice(null), 3000);
                    }
                  }}
                  whileHover={unlocked ? { y: -4 } : undefined}
                  className={`relative flex-1 max-w-[280px] sm:max-w-[250px] md:max-w-[280px] lg:max-w-[310px] h-[400px] sm:h-[430px] p-5 sm:p-7 flex flex-col justify-between transition-all duration-300 overflow-hidden ${
                    isSelected ? 'flex scale-105 z-20' : 'hidden sm:flex scale-95 hover:opacity-95'
                  } ${cardClass}`}
                >
                  {/* Subtle Background Watermark Roman Numeral */}
                  <div
                    className="absolute right-4 -bottom-6 text-9xl font-black text-stone-800/15 select-none pointer-events-none"
                    style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                  >
                    {chap.number === 1 ? 'I' : chap.number === 2 ? 'II' : 'III'}
                  </div>

                  {/* Top Status & Phase Number */}
                  <div className="flex items-center justify-between w-full z-10">
                    <span className="text-xs font-mono font-bold tracking-widest text-[#8fa89b] uppercase">
                      PHASE 0{chap.number}
                    </span>

                    {/* Status Pill */}
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 bg-[#1d2a23] border border-[#354c3f] text-[#8fa89b] text-[10px] font-mono tracking-wider px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-[#8fa89b]" />
                        COMPLETED
                      </span>
                    ) : unlocked ? (
                      <span className="inline-flex items-center gap-1 bg-[#1d2a23] border border-[#354c3f] text-[#8fa89b] text-[10px] font-mono tracking-wider px-2 py-0.5 rounded">
                        {chap.number === 2 ? 'AVAILABLE / ACTIVE' : 'AVAILABLE'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-[#121715] border border-[#1e2621] text-stone-500 text-[10px] font-mono tracking-wider px-2 py-0.5 rounded">
                        <Lock className="w-3 h-3 text-stone-500" />
                        LOCKED
                      </span>
                    )}
                  </div>

                  {/* Middle Chapter Content: Title */}
                  <div className="my-auto z-10 text-center">
                    <div className="text-[#8fa89b]/70 font-mono text-xs tracking-widest uppercase mb-1">
                      Chapter {chap.number}
                    </div>
                    <h3
                      className={`text-3xl sm:text-4xl font-black tracking-wider uppercase transition-colors ${
                        !unlocked
                          ? 'text-stone-600'
                          : isSelected
                          ? 'text-[#d1e3da]'
                          : 'text-stone-300'
                      }`}
                      style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                    >
                      {chap.title}
                    </h3>
                  </div>

                  {/* Bottom Action Area */}
                  <div className="z-10 w-full pt-4 border-t border-[#233329] text-center">
                    {!unlocked ? (
                      <div className="py-2 flex flex-col items-center justify-center text-stone-500 font-mono text-xs">
                        <Lock className="w-5 h-5 mb-1 text-stone-600" />
                        <span>Finish Chapter {chap.number - 1} to unlock</span>
                      </div>
                    ) : chap.number === 1 && isCompleted ? (
                      /* Completed Chapter 1: Restart Chapter 1 */
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowRestartCh1Confirm(true);
                        }}
                        className="w-full py-3 rounded-lg bg-[#22352b] hover:bg-[#2d4639] border border-[#3f5c4c] text-[#d1e3da] font-mono text-sm tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>RESTART CHAPTER 1</span>
                      </button>
                    ) : chap.number === 1 && hasCh1ActiveSave && ch1Save ? (
                      /* Dynamic Continue / Restart buttons for Chapter 1 */
                      <div className="flex flex-col gap-2 w-full">
                        <button
                          onClick={handleContinueChapter1}
                          className="w-full py-3 rounded-lg bg-[#22352b] hover:bg-[#2d4639] border border-[#3f5c4c] text-[#d1e3da] font-mono text-sm tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>CONTINUE (PHASE 0{ch1Save.currentPhase})</span>
                        </button>
                        <button
                          onClick={handleRestartChapter1}
                          className="w-full py-2 rounded-lg bg-[#16201b] hover:bg-[#1e2a24] border border-[#2a3c32] text-stone-400 hover:text-[#c2d6cc] font-mono text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>RESTART CHAPTER</span>
                        </button>
                      </div>
                    ) : (
                      /* Standard Action Button */
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectChapter(chap.number);
                        }}
                        className="w-full py-3 rounded-lg bg-[#22352b] hover:bg-[#2d4639] border border-[#3f5c4c] text-[#d1e3da] font-mono text-sm tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>
                          {chap.number === 2
                            ? 'CONTINUE'
                            : chap.number === 1 && !isCompleted
                            ? 'START INVESTIGATION'
                            : isCompleted
                            ? 'REVISIT'
                            : 'PLAY'}
                        </span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
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
                    onClick={() => {
                      restart_chapter_one();
                      clearChapterOneProgress();
                      resetChapterOneProgress();
                      setCh1Save(null);
                      setShowRestartCh1Confirm(false);
                      sound.playPaperRustle();
                      navigate('/chapters/1');
                    }}
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
