import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { sound } from '../audioEngine';

export interface ChapterTransitionModalProps {
  isOpen: boolean;
  overTitle?: string;
  completedChapterTitle?: string;
  nextPhaseTag?: string;
  nextChapterTitle?: string;
  continueButtonText?: string;
  saveButtonText?: string;
  isFinalChapter?: boolean;
  onContinueToChapterTwo?: () => void;
  onContinue?: () => void;
  onSaveAndExit?: () => void;
  onFinish?: () => void;
}

export const ChapterTransitionModal: React.FC<ChapterTransitionModalProps> = ({
  isOpen,
  overTitle = 'INVESTIGATION PHASE COMPLETED',
  completedChapterTitle = 'CHAPTER 1: BLIND START',
  nextPhaseTag = 'ENTERING NEXT PHASE',
  nextChapterTitle,
  continueButtonText = 'Continue Investigation →',
  saveButtonText = 'Save & Exit to Chapter Selection',
  isFinalChapter = false,
  onContinueToChapterTwo,
  onContinue,
  onSaveAndExit,
  onFinish,
}) => {
  const effectiveNextChapterTitle = isFinalChapter
    ? undefined
    : nextChapterTitle !== undefined
    ? nextChapterTitle
    : 'CHAPTER 2: UNDERSTANDING';

  useEffect(() => {
    if (isOpen) {
      sound.stopAllAmbience();
      sound.playSeanceRainLoop();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleContinue = () => {
    sound.playMenuSelect();
    if (onContinue) {
      onContinue();
    } else if (onContinueToChapterTwo) {
      onContinueToChapterTwo();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0e0c] text-stone-200 select-none px-6 py-12"
    >
      <div className="relative w-full max-w-2xl flex flex-col items-center justify-center text-center">
        {/* Step B: Chapter Resolution Banner (fades in 1.2s) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="text-center space-y-2"
        >
          <span className="text-xs font-mono tracking-[0.3em] text-[#6b8577] uppercase block">
            {overTitle}
          </span>
          <h1 className="text-3xl md:text-5xl font-mono font-bold tracking-wider text-[#d1e3da] drop-shadow-lg uppercase">
            {completedChapterTitle}
          </h1>
        </motion.div>

        {/* Step C: Next Chapter Title Fade-In (Only if not final chapter and next chapter exists) */}
        {!isFinalChapter && effectiveNextChapterTitle && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.8, ease: 'easeOut' }}
            className="mt-8 text-center space-y-1 animate-fade-in"
          >
            {nextPhaseTag && (
              <span className="text-[11px] font-mono tracking-[0.4em] text-red-400/80 uppercase block">
                {nextPhaseTag}
              </span>
            )}
            <h2 className="text-2xl md:text-4xl font-serif italic tracking-wide text-[#a3c2b2] drop-shadow-[0_0_20px_rgba(163,194,178,0.35)] uppercase">
              {effectiveNextChapterTitle}
            </h2>
          </motion.div>
        )}

        {/* Option Choices Styled in Moss & Oxidized Iron */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: isFinalChapter ? 1.6 : 2.4, ease: 'easeOut' }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md"
        >
          {/* Option 1: Continue directly into Next Chapter (Omitted on final chapter) */}
          {!isFinalChapter && (
            <button
              onClick={handleContinue}
              className="w-full sm:w-1/2 py-3 px-4 rounded-lg bg-[#22352b] hover:bg-[#2e473a] border border-[#40614f] text-[#d8eae0] font-mono text-xs tracking-wider uppercase transition-all shadow-lg cursor-pointer"
            >
              {continueButtonText}
            </button>
          )}

          {/* Option 2: Save / Finish Button */}
          <button
            onClick={() => {
              sound.playPaperRustle();
              if (onFinish) {
                onFinish();
              } else if (onSaveAndExit) {
                onSaveAndExit();
              }
            }}
            className={`${
              isFinalChapter
                ? 'w-full py-3.5 px-6 bg-[#22352b] hover:bg-[#2e473a] border border-[#40614f] text-[#d8eae0] text-sm shadow-xl'
                : 'w-full sm:w-1/2 py-3 px-4 bg-[#141b17] hover:bg-[#1a241f] border border-[#273830] text-[#8fa89b] hover:text-[#c2d6cc] text-xs'
            } rounded-lg font-mono tracking-wider uppercase transition-all cursor-pointer`}
          >
            {isFinalChapter ? (saveButtonText || 'FINISH / EXIT') : saveButtonText}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChapterTransitionModal;
