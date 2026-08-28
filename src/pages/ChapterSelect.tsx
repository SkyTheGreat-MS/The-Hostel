import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AtmosphericLayout } from '../components/AtmosphericLayout';
import { useGameProgress } from '../context/GameProgressContext';
import { sound } from '../audioEngine';
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
    isChapterUnlocked,
    justUnlockedChapter,
    clearJustUnlocked,
    resetProgress,
  } = useGameProgress();

  const navigate = useNavigate();
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Scroll to selected chapter card in container
  useEffect(() => {
    if (scrollContainerRef.current) {
      const card = scrollContainerRef.current.querySelector(`#chapter-card-${selectedChapter}`) as HTMLElement | null;
      if (card && typeof card.scrollIntoView === 'function') {
        card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [selectedChapter]);

  // Handle entering chapter
  const handleSelectChapter = (chapterNum: number) => {
    const unlocked = isChapterUnlocked(chapterNum);
    setSelectedChapter(chapterNum);

    if (!unlocked) {
      sound.playDamage();
      setLockedNotice(`Chapter ${chapterNum} is locked. Complete Chapter ${chapterNum - 1} first.`);
      setTimeout(() => setLockedNotice(null), 3000);
      return;
    }

    sound.playMenuSelect();
    const chap = CHAPTERS.find((c) => c.number === chapterNum);
    if (chap) {
      navigate(chap.route);
    }
  };

  // Keyboard navigation: Left/Right to scroll & select, Enter to play
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
          <span className="text-[11px] font-mono tracking-widest text-amber-500 uppercase font-semibold">
            Select Investigation Phase
          </span>
          <h2
            className="text-4xl sm:text-6xl font-black text-[#E5E5E5] tracking-wider uppercase drop-shadow-lg"
            style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
          >
            CHAPTER SELECTION
          </h2>
          <p className="text-xs font-mono text-stone-400 mt-1 tracking-wider">
            [←/→] Scroll &bull; [ENTER] Play
          </p>
        </div>

        {/* Just Unlocked Celebration Pill */}
        <AnimatePresence>
          {justUnlockedChapter && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 px-4 py-2 bg-amber-950/90 border border-amber-500/80 rounded-full flex items-center gap-2.5 text-amber-200 text-xs font-mono shadow-xl"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Chapter {justUnlockedChapter} is now unlocked!</span>
              <button
                onClick={clearJustUnlocked}
                className="ml-2 text-stone-400 hover:text-white"
              >
                &times;
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Scrollable Chapter Carousel */}
        <div className="relative w-full max-w-5xl flex items-center justify-center px-4 sm:px-12">
          {/* Scroll Left Button */}
          <button
            onClick={() => {
              sound.playMenuHover();
              setSelectedChapter((prev) => Math.max(1, prev - 1));
            }}
            disabled={selectedChapter === 1}
            className={`hidden sm:flex absolute left-0 z-20 w-11 h-11 items-center justify-center rounded-full bg-stone-950/80 border border-stone-800 transition-all ${
              selectedChapter === 1
                ? 'opacity-30 cursor-not-allowed text-stone-600'
                : 'hover:bg-amber-950/60 hover:border-amber-600/80 text-stone-300 hover:text-amber-300 shadow-xl cursor-pointer'
            }`}
            aria-label="Previous Chapter"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Cards Container with Scroll Snapping in Center */}
          <div
            ref={scrollContainerRef}
            className="w-full flex items-center justify-center gap-4 sm:gap-8 overflow-x-auto py-6 px-2 scroll-smooth no-scrollbar"
          >
            {CHAPTERS.map((chap) => {
              const unlocked = isChapterUnlocked(chap.number);
              const isCompleted = highestChapterCompleted >= chap.number;
              const isSelected = selectedChapter === chap.number;

              return (
                <motion.div
                  key={chap.number}
                  id={`chapter-card-${chap.number}`}
                  onClick={() => {
                    if (selectedChapter !== chap.number) {
                      sound.playMenuHover();
                      setSelectedChapter(chap.number);
                    } else {
                      handleSelectChapter(chap.number);
                    }
                  }}
                  whileHover={{ y: -4 }}
                  className={`relative flex-shrink-0 w-64 sm:w-80 h-96 sm:h-[420px] rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 cursor-pointer overflow-hidden border ${
                    isSelected
                      ? unlocked
                        ? 'bg-gradient-to-b from-stone-900/95 via-stone-950/95 to-black/95 border-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.3)] scale-105 z-10'
                        : 'bg-gradient-to-b from-stone-950/95 to-black/95 border-stone-700 shadow-2xl scale-105 z-10'
                      : 'bg-stone-950/80 border-stone-800/80 opacity-70 hover:opacity-90 hover:border-stone-700 scale-95'
                  }`}
                >
                  {/* Subtle Background Watermark Roman Numeral */}
                  <div className="absolute right-4 -bottom-6 text-9xl font-black text-stone-800/20 select-none pointer-events-none"
                       style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>
                    {chap.number === 1 ? 'I' : chap.number === 2 ? 'II' : 'III'}
                  </div>

                  {/* Top Status & Phase Number */}
                  <div className="flex items-center justify-between w-full z-10">
                    <span className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase">
                      PHASE 0{chap.number}
                    </span>

                    {/* Status Pill */}
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-950/80 border border-emerald-700 text-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        COMPLETED
                      </span>
                    ) : unlocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-950/80 border border-amber-600 text-amber-300">
                        AVAILABLE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-stone-900 border border-stone-800 text-stone-500">
                        <Lock className="w-3 h-3 text-stone-600" />
                        LOCKED
                      </span>
                    )}
                  </div>

                  {/* Middle Chapter Content: Simplified Title */}
                  <div className="my-auto z-10 text-center">
                    <div className="text-stone-400 font-mono text-xs tracking-widest uppercase mb-1">
                      Chapter {chap.number}
                    </div>
                    <h3
                      className={`text-3xl sm:text-4xl font-black tracking-wider uppercase transition-colors ${
                        isSelected && unlocked ? 'text-amber-200' : 'text-stone-200'
                      }`}
                      style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                    >
                      {chap.title}
                    </h3>
                  </div>

                  {/* Bottom Action Area */}
                  <div className="z-10 w-full pt-4 border-t border-stone-800/80 text-center">
                    {unlocked ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectChapter(chap.number);
                        }}
                        className={`w-full py-3 rounded-xl font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                            : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700'
                        }`}
                        style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", fontSize: '1.15rem' }}
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>{isCompleted ? 'REVISIT' : 'PLAY'}</span>
                      </button>
                    ) : (
                      <div className="py-2 flex flex-col items-center justify-center text-stone-500 font-mono text-xs">
                        <Lock className="w-5 h-5 mb-1 text-stone-600" />
                        <span>Finish Chapter {chap.number - 1} to unlock</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => {
              sound.playMenuHover();
              setSelectedChapter((prev) => Math.min(3, prev + 1));
            }}
            disabled={selectedChapter === 3}
            className={`hidden sm:flex absolute right-0 z-20 w-11 h-11 items-center justify-center rounded-full bg-stone-950/80 border border-stone-800 transition-all ${
              selectedChapter === 3
                ? 'opacity-30 cursor-not-allowed text-stone-600'
                : 'hover:bg-amber-950/60 hover:border-amber-600/80 text-stone-300 hover:text-amber-300 shadow-xl cursor-pointer'
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
              className="mt-6 px-4 py-2 rounded-lg bg-rose-950/90 border border-rose-800 text-rose-300 text-xs font-mono flex items-center gap-2 shadow-lg"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{lockedNotice}</span>
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
                    ? 'w-8 bg-amber-500'
                    : 'w-2 bg-stone-700 hover:bg-stone-500'
                }`}
                aria-label={`Select Chapter ${num}`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (confirm('Reset chapter progress back to Chapter 1?')) {
                resetProgress();
                setSelectedChapter(1);
                sound.playDamage();
              }
            }}
            title="Reset Chapter Progress"
            className="p-1.5 rounded text-stone-600 hover:text-rose-400 hover:bg-stone-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </AtmosphericLayout>
  );
};
