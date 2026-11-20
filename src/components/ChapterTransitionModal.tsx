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
  overTitle = 'စုံစမ်းစစ်ဆေးမှု အဆင့် ပြီးမြောက်ပါပြီ',
  completedChapterTitle = 'အခန်း ၁: အမှောင်ထဲက အစ',
  nextPhaseTag = 'နောက်တစ်ဆင့်သို့ ဝင်ရောက်နေသည်',
  nextChapterTitle,
  continueButtonText = 'စုံစမ်းစစ်ဆေးမှု ဆက်လုပ်ရန် →',
  saveButtonText = 'အခန်းရွေးချယ်မှုသို့ သိမ်းဆည်းပြီး ထွက်ရန်',
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
    : 'အခန်း ၂: နားလည်သဘောပေါက်ခြင်း';

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
          <span className="text-xs font-burmese text-[#6ea889] block">
            {overTitle}
          </span>
          <h1 className="text-3xl md:text-5xl font-burmese font-bold text-[#e0f0e7] drop-shadow-[0_0_25px_rgba(110,168,137,0.25)]">
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
              <span className="text-[11px] font-burmese text-[#ba2929] block">
                {nextPhaseTag}
              </span>
            )}
            <h2 className="text-2xl md:text-4xl font-burmese font-semibold text-[#b1d4c2] drop-shadow-[0_0_20px_rgba(110,168,137,0.35)]">
              {effectiveNextChapterTitle}
            </h2>
          </motion.div>
        )}

        {/* Option Choices Styled in Duo-Tone Verdigris & Obsidian */}
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
              className="w-full sm:w-1/2 py-3 px-4 rounded-lg bg-[#193828] hover:bg-[#29543e] border border-[#6ea889] text-[#e0f0e7] font-burmese text-xs font-bold transition-all shadow-lg cursor-pointer active:scale-95 hover:scale-[1.01]"
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
                ? 'w-full py-3.5 px-6 bg-[#193828] hover:bg-[#29543e] border border-[#6ea889] text-[#e0f0e7] text-sm shadow-xl'
                : 'w-full sm:w-1/2 py-3 px-4 bg-[#101c15] hover:bg-[#193828] border border-[#193828] text-[#8fa89b] hover:text-[#e0f0e7] text-xs'
            } rounded-lg font-burmese transition-all cursor-pointer active:scale-95 hover:scale-[1.01]`}
          >
            {isFinalChapter ? (saveButtonText || 'ပြီးဆုံး / ထွက်ရန်') : saveButtonText}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChapterTransitionModal;
