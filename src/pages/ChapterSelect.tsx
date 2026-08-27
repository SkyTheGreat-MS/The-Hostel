import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AtmosphericLayout } from '../components/AtmosphericLayout';
import { useGameProgress } from '../context/GameProgressContext';
import { sound } from '../audioEngine';
import {
  Lock,
  Unlock,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Compass,
  Scroll,
  Clock,
  Flame,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface ChapterConfig {
  number: number;
  title: string;
  subtitle: string;
  tagline: string;
  synopsis: string;
  location: string;
  evidenceFocus: string;
  route: string;
}

const CHAPTERS: ChapterConfig[] = [
  {
    number: 1,
    title: 'Blind Start',
    subtitle: 'Chapter 1 — Blind Start',
    tagline: 'THE SHATTERED OFFERING & THE 1998 AWAKENING',
    synopsis:
      'Awaken alone in the decaying 1998 echo of Pathway 326. Investigate the dormitory, commune with the Guardian Nat, decode Mama May’s first symbolic riddle, and expose the key physical proof behind her murder before your temporal anchor expires.',
    location: 'Hostel Pathway 326 & Dormitory Room 4B',
    evidenceFocus: 'Torn Diary Page • Stained Pink Silk Longyi • Residence Ledger',
    route: '/chapters/1',
  },
  {
    number: 2,
    title: 'Understanding',
    subtitle: 'Chapter 2 — Understanding',
    tagline: 'CORRESPONDENCE OF THE CARETAKER & CAESAR CIPHERS',
    synopsis:
      'Cross-reference the hostel ledger with the Caretaker’s sealed lockbox. Decipher the 3-shift Caesar cipher, navigate the Guardian Nat’s conflicting whispers, and uncover who paid 5,000 Kyats to seal the courtyard well.',
    location: 'Caretaker Old Office & Basement Laundry Basin',
    evidenceFocus: 'Iron-Banded Caesar Lockbox • Bribe Receipts • Bodhi Beads',
    route: '/chapters/2',
  },
  {
    number: 3,
    title: 'The Ritual',
    subtitle: 'Chapter 3 — The Ritual',
    tagline: 'THE DRIED WELL CONFRONTATION & TWIST OF KINSHIP',
    synopsis:
      'Descend to the overgrown courtyard Nat shrine. Execute the true pacification rite, face the killer’s direct bloodline tie to your 2026 friend Aye Aye, and release Mama May’s sorrow before the spirit becomes a vengeful Thaye.',
    location: 'Courtyard Nat Shrine & Sealed Dried Well',
    evidenceFocus: 'Silver Filigree Locket • Dried Well Planks • Offering Glass',
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
  const [hoveredChapter, setHoveredChapter] = useState<number | null>(null);
  const [focusedChapter, setFocusedChapter] = useState<number | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Play a resonant unlock sound if user just cleared a chapter and landed here
  useEffect(() => {
    if (justUnlockedChapter) {
      sound.playSuccessTune();
      const timer = setTimeout(() => {
        clearJustUnlocked();
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [justUnlockedChapter, clearJustUnlocked]);

  const handleCardClick = (chapter: ChapterConfig, unlocked: boolean) => {
    if (!unlocked) {
      sound.playDamage();
      return;
    }
    sound.playMenuSelect();
    navigate(chapter.route);
  };

  const handleKeyDown = (e: React.KeyboardEvent, chapter: ChapterConfig, unlocked: boolean) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(chapter, unlocked);
    }
  };

  return (
    <AtmosphericLayout
      headerTitle="THE SPIRIT'S LABYRINTH"
      headerSubtitle="CHAPTER SHOWCASE • CHRONICLES OF 1998"
      backTo="/"
      backLabel="Main Menu"
      scene="hallway"
      colorGrade="monsoon_green"
    >
      {/* Newly Unlocked Chapter Celebration Beat */}
      <AnimatePresence>
        {justUnlockedChapter && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mb-6 p-4 rounded-xl bg-amber-950/90 border-2 border-amber-500/80 shadow-[0_0_35px_rgba(245,158,11,0.35)] flex items-center justify-between text-amber-100"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-amber-600/30 border border-amber-400 flex items-center justify-center animate-pulse">
                <Unlock className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                    MORTAL VEIL BREACHED
                  </span>
                  <span className="text-[10px] bg-amber-500 text-stone-950 font-bold px-1.5 py-0.2 rounded font-mono">
                    NEW CHAPTER UNLOCKED
                  </span>
                </div>
                <p className="text-sm font-sans font-medium text-stone-200">
                  Chapter {justUnlockedChapter} is now unlocked! The spirit guides your steps deeper into 1998.
                </p>
              </div>
            </div>
            <button
              onClick={clearJustUnlocked}
              className="px-3 py-1 text-xs font-mono bg-stone-900/80 hover:bg-stone-800 border border-amber-600/50 rounded text-amber-200"
            >
              DISMISS
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Showcase Screen Header */}
      <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400/90 font-semibold">
              Hostel Archive • Select Investigation Phase
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bebas font-black tracking-wider text-stone-100 drop-shadow-md">
            CHAPTER SHOWCASE
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 font-sans mt-1 max-w-2xl">
            Trace the chronological timeline of August 1998. Each chapter represents a deeper descent into the hostel's temporal labyrinth and spiritual resonance.
          </p>
        </div>

        {/* Investigative Progress Status Pill */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-lg bg-stone-950/80 border border-stone-800 text-right">
            <div className="text-[10px] font-mono uppercase text-stone-400">Current Progress</div>
            <div className="text-sm font-mono font-bold text-amber-400">
              {highestChapterCompleted === 0
                ? 'Phase 1: In Progress'
                : `Chapter ${highestChapterCompleted} Cleared (${highestChapterCompleted}/3)`}
            </div>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800 text-stone-400 hover:text-rose-400 hover:border-rose-900/60 transition-colors"
            title="Reset Chapter Progress"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chapter Cards Stack */}
      <div className="grid grid-cols-1 gap-5 lg:gap-6 flex-1">
        {CHAPTERS.map((chap) => {
          const unlocked = isChapterUnlocked(chap.number);
          const isCompleted = highestChapterCompleted >= chap.number;
          const isHovered = hoveredChapter === chap.number;
          const isFocused = focusedChapter === chap.number;
          const isLocked = !unlocked;

          return (
            <motion.div
              key={chap.number}
              id={`chapter-card-${chap.number}`}
              role="button"
              tabIndex={0}
              aria-disabled={isLocked ? 'true' : 'false'}
              aria-label={`${chap.subtitle}. ${
                isLocked
                  ? `Locked. Complete Chapter ${chap.number - 1} to unlock.`
                  : isCompleted
                  ? 'Completed. Click to replay.'
                  : 'Available. Click to play.'
              }`}
              onMouseEnter={() => {
                setHoveredChapter(chap.number);
                if (unlocked) sound.playMenuHover();
              }}
              onMouseLeave={() => setHoveredChapter(null)}
              onFocus={() => {
                setFocusedChapter(chap.number);
                if (unlocked) sound.playMenuHover();
              }}
              onBlur={() => setFocusedChapter(null)}
              onClick={() => handleCardClick(chap, unlocked)}
              onKeyDown={(e) => handleKeyDown(e, chap, unlocked)}
              whileHover={unlocked ? { scale: 1.01 } : {}}
              className={`group relative overflow-hidden rounded-xl border transition-all duration-300 outline-none ${
                unlocked
                  ? isCompleted
                    ? 'bg-gradient-to-r from-stone-950/90 via-stone-900/85 to-stone-950/90 border-emerald-800/60 hover:border-amber-500/80 shadow-lg cursor-pointer'
                    : 'bg-gradient-to-r from-stone-950/90 via-[#0e1713]/90 to-stone-950/90 border-amber-700/60 hover:border-amber-400 shadow-[0_4px_20px_rgba(0,0,0,0.6)] cursor-pointer ring-1 ring-amber-500/20'
                  : 'bg-stone-950/80 border-stone-800/80 opacity-60 grayscale-[0.65] cursor-not-allowed select-none'
              } ${isFocused ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-stone-950' : ''}`}
            >
              {/* Background ambient gradient glow on unlocked card hover */}
              {unlocked && (
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-amber-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              )}

              {/* Watermark Roman numeral */}
              <div className="absolute right-6 -bottom-6 select-none pointer-events-none text-8xl font-bebas font-black text-stone-800/20 group-hover:text-amber-500/10 transition-colors">
                {chap.number === 1 ? 'I' : chap.number === 2 ? 'II' : 'III'}
              </div>

              <div className="relative z-10 p-5 sm:p-6 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Left Column: Number badge + Titles + Narrative Synopsis */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Status Badge */}
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-950/90 border border-emerald-600/70 text-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        COMPLETED
                      </span>
                    ) : unlocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-amber-950/90 border border-amber-600/70 text-amber-300 animate-pulse">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        AVAILABLE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-stone-900 border border-stone-700/80 text-stone-400">
                        <Lock className="w-3 h-3 text-stone-500" />
                        LOCKED
                      </span>
                    )}

                    <span className="text-xs font-mono uppercase tracking-wider text-amber-500/80 font-bold">
                      PHASE 0{chap.number}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bebas font-bold text-stone-100 group-hover:text-amber-200 transition-colors flex items-center gap-3 tracking-wider">
                      {chap.subtitle}
                    </h3>
                    <div className="text-[11px] font-mono uppercase tracking-widest text-amber-600/90 font-medium mt-0.5">
                      {chap.tagline}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-300/90 font-sans leading-relaxed max-w-3xl">
                    {chap.synopsis}
                  </p>

                  {/* Metadata Chips */}
                  <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-[11px] font-mono text-stone-400">
                    <div className="flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-stone-500" />
                      <span>{chap.location}</span>
                    </div>
                    <span className="text-stone-700">•</span>
                    <div className="flex items-center gap-1.5">
                      <Scroll className="w-3.5 h-3.5 text-stone-500" />
                      <span>{chap.evidenceFocus}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Interaction Action or Locked Padlock Overlay */}
                <div className="flex md:flex-col items-center justify-between md:justify-center md:items-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-800/80">
                  {unlocked ? (
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => handleCardClick(chap, unlocked)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-lg font-bebas text-base tracking-wider uppercase transition-all shadow-md ${
                        isCompleted
                          ? 'bg-stone-900 border border-stone-700 text-stone-200 group-hover:bg-amber-900/60 group-hover:border-amber-500 group-hover:text-amber-100'
                          : 'bg-amber-700 hover:bg-amber-600 text-stone-950 border border-amber-400 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                      }`}
                    >
                      <span>{isCompleted ? 'REVISIT CHAPTER' : 'ENTER LABYRINTH'}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    /* Locked State Overlay: Chained & Cracked Glass Shard Motif */
                    <div className="relative flex flex-col items-center md:items-end gap-2 p-3 rounded-lg bg-stone-950/90 border border-stone-800">
                      <div className="flex items-center gap-2 text-stone-400">
                        {/* Distressed Chained Glass Shard SVG Icon */}
                        <div className="relative w-8 h-8 flex items-center justify-center">
                          <svg className="w-full h-full" viewBox="0 0 40 40">
                            {/* Cracked Glass Shard polygon */}
                            <polygon
                              points="20,4 34,14 30,34 10,36 6,18"
                              fill="#1c1917"
                              stroke="#57534e"
                              strokeWidth="1.5"
                            />
                            {/* Fracture lines */}
                            <line x1="20" y1="4" x2="20" y2="24" stroke="#78716c" strokeWidth="1" />
                            <line x1="20" y1="24" x2="30" y2="34" stroke="#78716c" strokeWidth="1" />
                            <line x1="20" y1="24" x2="6" y2="18" stroke="#78716c" strokeWidth="1" />
                            {/* Binding Chains */}
                            <line x1="8" y1="12" x2="32" y2="28" stroke="#a8a29e" strokeWidth="2" strokeDasharray="3 2" />
                            <line x1="8" y1="28" x2="32" y2="12" stroke="#a8a29e" strokeWidth="2" strokeDasharray="3 2" />
                          </svg>
                          <Lock className="w-3.5 h-3.5 text-amber-500/80 absolute" />
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-stone-400">BOUND SHUT</div>
                          <div className="text-[10px] font-mono text-stone-400">
                            Complete Chapter {chap.number - 1} to unlock
                          </div>
                        </div>
                      </div>

                      {/* Tooltip on hover/focus */}
                      <span className="text-[10px] font-mono text-amber-500/70 italic text-center md:text-right">
                        Requires finding the decisive clue in Chapter {chap.number - 1}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Reset Progress Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-stone-950 border border-stone-800 rounded-xl p-6 shadow-2xl text-stone-200"
            >
              <div className="flex items-center gap-3 text-rose-400 mb-3">
                <AlertTriangle className="w-6 h-6" />
                <h4 className="text-xl font-bebas font-bold tracking-wider">Reset Chapter Progress?</h4>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed mb-6 font-sans">
                This will lock Chapter 2 and Chapter 3 again, requiring you to play through Chapter 1 to unlock them.
              </p>
              <div className="flex items-center justify-end gap-3 font-mono text-xs">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 rounded bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => {
                    resetProgress();
                    setShowResetConfirm(false);
                    sound.playDamage();
                  }}
                  className="px-4 py-2 rounded bg-rose-900/80 hover:bg-rose-800 border border-rose-600 text-rose-100 font-bold"
                >
                  CONFIRM RESET
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AtmosphericLayout>
  );
};
