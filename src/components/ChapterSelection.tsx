import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Play, RotateCcw, CheckCircle2 } from 'lucide-react';
import { ChapterSelect } from '../pages/ChapterSelect';
export { ChapterPreviewModal } from './ChapterPreviewModal';
export type { ChapterPreviewModalProps } from './ChapterPreviewModal';

export interface ChapterCardProps {
  title: string;
  subtitle?: string;
  chapterNumber: number;
  status: string;
  buttonText: string;
  isLocked: boolean;
  isCompleted?: boolean;
  isSelected?: boolean;
  onAction: () => void;
  onSelect?: () => void;
  hasActiveSave?: boolean;
  activeSavePhase?: number;
  onRestart?: (e: React.MouseEvent) => void;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({
  title,
  subtitle,
  chapterNumber,
  status,
  buttonText,
  isLocked,
  isCompleted = false,
  isSelected = false,
  onAction,
  onSelect,
  hasActiveSave = false,
  activeSavePhase = 1,
  onRestart,
}) => {
  const cardClass = isLocked
    ? 'bg-[#0b100e]/80 border border-[#1a261f] opacity-50 cursor-not-allowed text-stone-600 rounded-xl'
    : isSelected
    ? 'bg-[#141f19]/95 border-2 border-[#476756] shadow-[0_0_25px_rgba(71,103,86,0.35)] text-[#c2d6cc] backdrop-blur-md rounded-xl'
    : 'bg-[#101613]/90 border border-[#2b4235] hover:border-[#40614f] shadow-[0_0_15px_rgba(43,66,53,0.3)] hover:shadow-[0_0_22px_rgba(64,97,79,0.45)] text-stone-400 backdrop-blur-md rounded-xl cursor-pointer';

  return (
    <motion.div
      id={`chapter-card-${chapterNumber}`}
      onClick={() => {
        if (onSelect) onSelect();
      }}
      whileHover={!isLocked ? { y: -4 } : undefined}
      className={`relative flex-1 max-w-[280px] sm:max-w-[250px] md:max-w-[280px] lg:max-w-[310px] h-[400px] sm:h-[430px] p-5 sm:p-7 flex flex-col justify-between transition-all duration-300 overflow-hidden ${
        isSelected ? 'flex scale-105 z-20' : 'hidden sm:flex scale-95 hover:opacity-95'
      } ${cardClass}`}
    >
      {/* Subtle Background Watermark Roman Numeral */}
      <div
        className="absolute right-4 -bottom-6 text-9xl font-black text-stone-800/15 select-none pointer-events-none"
        style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
      >
        {chapterNumber === 1 ? 'I' : chapterNumber === 2 ? 'II' : 'III'}
      </div>

      {/* Top Status & Phase Number */}
      <div className="flex items-center justify-between w-full z-10">
        <span className="text-xs font-mono font-bold tracking-widest text-[#8fa89b] uppercase">
          PHASE 0{chapterNumber}
        </span>

        {/* Status Pill */}
        {isCompleted ? (
          <span className="inline-flex items-center gap-1 bg-[#1d2a23] border border-[#354c3f] text-[#8fa89b] text-[10px] font-mono tracking-wider px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3 text-[#8fa89b]" />
            COMPLETED
          </span>
        ) : !isLocked ? (
          <span className="inline-flex items-center gap-1 bg-[#1d2a23] border border-[#354c3f] text-[#8fa89b] text-[10px] font-mono tracking-wider px-2 py-0.5 rounded">
            {status || (chapterNumber === 2 ? 'AVAILABLE / ACTIVE' : 'AVAILABLE')}
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
          Chapter {chapterNumber}
        </div>
        <h3
          className={`text-3xl sm:text-4xl font-black tracking-wider uppercase transition-colors ${
            isLocked
              ? 'text-stone-600'
              : isSelected
              ? 'text-[#d1e3da]'
              : 'text-stone-300'
          }`}
          style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
        >
          {title}
        </h3>
        {subtitle && (
          <p
            className={`mt-1 font-mono text-[10px] sm:text-xs tracking-widest uppercase ${
              isLocked ? 'text-stone-600' : 'text-[#8fa89b]'
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Bottom Action Area */}
      <div className="z-10 w-full pt-4 border-t border-[#233329] text-center">
        {isLocked ? (
          <div className="py-2 flex flex-col items-center justify-center text-stone-500 font-mono text-xs">
            <Lock className="w-5 h-5 mb-1 text-stone-600" />
            <span>Finish Chapter {chapterNumber - 1} to unlock</span>
          </div>
        ) : chapterNumber === 1 && isCompleted ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onRestart) onRestart(e);
            }}
            className="w-full py-3 rounded-lg bg-[#22352b] hover:bg-[#2d4639] border border-[#3f5c4c] text-[#d1e3da] font-mono text-sm tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART CHAPTER 1</span>
          </button>
        ) : chapterNumber === 1 && hasActiveSave ? (
          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction();
              }}
              className="w-full py-3 rounded-lg bg-[#22352b] hover:bg-[#2d4639] border border-[#3f5c4c] text-[#d1e3da] font-mono text-sm tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>CONTINUE (PHASE 0{activeSavePhase})</span>
            </button>
            {onRestart && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRestart(e);
                }}
                className="w-full py-2 rounded-lg bg-[#16201b] hover:bg-[#1e2a24] border border-[#2a3c32] text-stone-400 hover:text-[#c2d6cc] font-mono text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESTART CHAPTER</span>
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction();
            }}
            className="w-full py-3 rounded-lg bg-[#22352b] hover:bg-[#2d4639] border border-[#3f5c4c] text-[#d1e3da] font-mono text-sm tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{buttonText}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export interface RestartConfirmationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onProceed: () => void;
}

export const RestartConfirmationModal: React.FC<RestartConfirmationModalProps> = ({
  isOpen,
  onCancel,
  onProceed,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
              onClick={onCancel}
              className="px-4 py-2.5 rounded-lg bg-[#18221c] hover:bg-[#202c25] border border-[#2b3d32] text-[#8fa89b] text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onProceed}
              className="px-4 py-2.5 rounded-lg bg-[#24382c] hover:bg-[#2f493a] border border-[#446652] text-[#e0ede6] text-xs font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer shadow-lg"
            >
              Proceed
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const ChapterSelection: React.FC = () => {
  return <ChapterSelect />;
};

export { ChapterSelect as ChapterSelectModal };
export { ChapterSelect as ChapterSelectionView };

export default ChapterSelection;
