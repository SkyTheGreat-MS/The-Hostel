import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { sound } from '../audioEngine';

export interface ChapterTransitionModalProps {
  isOpen: boolean;
  onContinueToChapterTwo: () => void;
  onSaveAndExit: () => void;
}

export const ChapterTransitionModal: React.FC<ChapterTransitionModalProps> = ({
  isOpen,
  onContinueToChapterTwo,
  onSaveAndExit,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.stopAllAmbience();
      sound.playSeanceRainLoop();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0e0c] text-stone-200 select-none px-6 py-12"
    >
      <div className="relative w-full max-w-2xl flex flex-col items-center justify-center text-center">
        {/* Step B: Chapter 1 Resolution Banner (fades in 1.2s) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="text-center space-y-2"
        >
          <span className="text-xs font-mono tracking-[0.3em] text-[#6b8577] uppercase block">
            Investigation Phase Completed
          </span>
          <h1 className="text-3xl md:text-5xl font-mono font-bold tracking-wider text-[#d1e3da] drop-shadow-lg">
            CHAPTER 1: BLIND START
          </h1>
        </motion.div>

        {/* Step C: Chapter 2 Title Fade-In (After 1.8s delay with subtle green glow) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.8, ease: 'easeOut' }}
          className="mt-8 text-center space-y-1 animate-fade-in"
        >
          <span className="text-[11px] font-mono tracking-[0.4em] text-red-400/80 uppercase block">
            Entering Next Phase
          </span>
          <h2 className="text-2xl md:text-4xl font-serif italic tracking-wide text-[#a3c2b2] drop-shadow-[0_0_20px_rgba(163,194,178,0.35)]">
            CHAPTER 2: UNDERSTANDING
          </h2>
        </motion.div>

        {/* Option Choices Styled in Moss & Oxidized Iron */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.4, ease: 'easeOut' }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md"
        >
          {/* Option 1: Continue directly into Chapter 2 */}
          <button
            onClick={() => {
              sound.playMenuSelect();
              onContinueToChapterTwo();
            }}
            className="w-full sm:w-1/2 py-3 px-4 rounded-lg bg-[#22352b] hover:bg-[#2e473a] border border-[#40614f] text-[#d8eae0] font-mono text-xs tracking-wider uppercase transition-all shadow-lg cursor-pointer"
          >
            Continue Investigation →
          </button>

          {/* Option 2: Save and Return to Title */}
          <button
            onClick={() => {
              sound.playPaperRustle();
              onSaveAndExit();
            }}
            className="w-full sm:w-1/2 py-3 px-4 rounded-lg bg-[#141b17] hover:bg-[#1a241f] border border-[#273830] text-[#8fa89b] hover:text-[#c2d6cc] font-mono text-xs tracking-wider uppercase transition-all cursor-pointer"
          >
            Save & Exit to Title
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChapterTransitionModal;
