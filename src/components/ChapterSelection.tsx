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
  status?: string;
  buttonText?: string;
  isLocked: boolean;
  isCompleted?: boolean;
  isActive?: boolean;
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
  isActive = false,
  isSelected = false,
  onAction,
  onSelect,
}) => {
  const cardClass = isLocked
    ? 'bg-[#0b100e]/50 opacity-40 cursor-not-allowed text-stone-600 rounded-none pointer-events-none'
    : isCompleted
    ? 'bg-[#0e1411]/70 text-stone-500 opacity-60 rounded-none pointer-events-none select-none'
    : isSelected || isActive
    ? 'bg-[#141f19]/95 text-[#c2d6cc] backdrop-blur-md rounded-none cursor-pointer'
    : 'bg-[#101613]/80 hover:bg-[#141f19] text-stone-400 backdrop-blur-md rounded-none cursor-pointer';

  return (
    <motion.div
      id={`chapter-card-${chapterNumber}`}
      onClick={() => {
        if (!isCompleted && !isLocked && onSelect) onSelect();
      }}
      whileHover={!isLocked && !isCompleted ? { y: -4 } : undefined}
      className={`relative flex-1 max-w-[280px] sm:max-w-[250px] md:max-w-[280px] lg:max-w-[310px] h-[400px] sm:h-[430px] p-5 sm:p-7 flex flex-col justify-between transition-all duration-300 overflow-hidden ${
        isSelected ? 'flex scale-105 z-20' : 'hidden sm:flex scale-95 hover:opacity-95'
      } ${cardClass}`}
    >
      {/* Subtle Background Watermark Roman Numeral */}
      <div
        className="absolute right-4 -bottom-6 text-9xl font-black text-stone-800/15 select-none pointer-events-none font-cinzel"
      >
        {chapterNumber === 1 ? 'I' : chapterNumber === 2 ? 'II' : 'III'}
      </div>

      {/* Top Status & Phase Number */}
      <div className="flex items-center justify-between w-full z-10">
        <span className="text-xs font-burmese font-bold tracking-widest text-[#8fa89b] uppercase">
          အဆင့် <span className="font-mono tabular-nums">0{chapterNumber}</span>
        </span>

        {/* Status Pill */}
        {isCompleted ? (
          <span className="inline-flex items-center gap-1 bg-[#131b16] text-[#718579] text-xs font-burmese tracking-normal px-2 py-0.5 rounded-none">
            <CheckCircle2 className="w-3 h-3 text-[#586c62]" />
            အခန်း {chapterNumber} ပြီးမြောက်ပါပြီ
          </span>
        ) : isActive ? (
          <span className="inline-flex items-center gap-1 bg-[#1d2a23] text-[#a4c2b2] text-xs font-burmese tracking-normal px-2 py-0.5 rounded-none">
            <span className="w-1.5 h-1.5 rounded-none bg-emerald-400 animate-pulse" />
            လက်ရှိ စုံစမ်းစစ်ဆေးမှု
          </span>
        ) : !isLocked ? (
          <span className="inline-flex items-center gap-1 bg-[#1d2a23] text-[#8fa89b] text-xs font-burmese tracking-normal px-2 py-0.5 rounded-none">
            {status || 'စုံစမ်းနိုင်ပြီ'}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 bg-[#121715] text-stone-500 text-xs font-burmese tracking-normal px-2 py-0.5 rounded-none">
            <Lock className="w-3 h-3 text-stone-500" />
            သော့ခတ်ထားသည်
          </span>
        )}
      </div>

      {/* Middle Chapter Content: Title */}
      <div className="my-auto z-10 text-center">
        <div className="text-[#8fa89b]/70 font-burmese text-xs tracking-wider uppercase mb-1">
          အခန်း {chapterNumber}
        </div>
        <h3
          className={`text-xl sm:text-2xl font-bold tracking-wide transition-colors font-burmese leading-[1.6] ${
            isLocked
              ? 'text-[#29543e]/40'
              : isCompleted
              ? 'text-[#447d60]'
              : isSelected
              ? 'text-[#b1d4c2]'
              : 'text-[#6ea889]'
          }`}
        >
          {title}
        </h3>
        {subtitle && (
          <p
            className={`mt-1 font-burmese text-xs tracking-normal leading-[1.6] ${
              isLocked || isCompleted ? 'text-stone-600' : 'text-[#8fa89b]'
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Bottom Action Area */}
      <div className="z-10 w-full pt-4 text-center">
        {isLocked ? (
          <div className="py-2 flex flex-col items-center justify-center text-stone-500 font-burmese text-xs leading-[1.6]">
            <Lock className="w-4 h-4 mb-1 text-stone-600" />
            <span>ဖွင့်လှစ်ရန် အခန်း {chapterNumber - 1} ကို အရင်ပြီးအောင် ကစားပါ</span>
          </div>
        ) : isCompleted ? (
          <div className="py-2.5 flex items-center justify-center gap-1.5 bg-[#121915]/60 rounded-none text-[#63776c] font-burmese text-xs tracking-wide">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4e6056]" />
            <span>အခန်း {chapterNumber} ပြီးမြောက်ပါပြီ</span>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction();
            }}
            className="w-full py-3 rounded-none bg-[#193828] hover:bg-[#29543e] text-[#d1e3da] font-burmese text-xs tracking-wider transition-colors shadow-none flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{buttonText || `အခန်း ${chapterNumber} ဆက်လက်စုံစမ်းမည်`}</span>
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
          className="bg-[#060b08]/96 rounded-none max-w-md w-full p-6 sm:p-8 text-[#d1e3da] text-center"
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-none bg-[#101c15] flex items-center justify-center text-[#c7a458]">
            <RotateCcw className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-burmese tracking-wide text-[#d1e3da] mb-2">
            စုံစမ်းစစ်ဆေးမှုကို အစမှ ပြန်လည်စတင်မည်လား (အခန်း ၁)?
          </h3>
          <p className="text-xs text-[#8fa89b] mb-6 leading-[1.75] font-burmese">
            စုံစမ်းစစ်ဆေးမှု အသစ်စတင်ပါက ဇာတ်လမ်းတိုးတက်မှုအားလုံး ပျက်ပြယ်သွားမည်ဖြစ်ပြီး သိမ်းဆည်းထားသော ပစ္စည်းများ ပျောက်ကွယ်ကာ အခန်း ၁ သို့ ပြန်လည်ရောက်ရှိပါမည်။ ဆက်လက်လုပ်ဆောင်မည်လား?
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onCancel}
              className="px-4 py-2.5 rounded-none bg-[#0b140f] hover:bg-[#101c15] text-[#8fa89b] text-xs font-burmese tracking-wider transition-colors cursor-pointer"
            >
              ပယ်ဖျက်မည်
            </button>
            <button
              onClick={onProceed}
              className="px-4 py-2.5 rounded-none bg-[#193828] hover:bg-[#29543e] text-[#e0ede6] text-xs font-burmese font-bold tracking-wider transition-colors cursor-pointer shadow-none"
            >
              [ အခန်း ၁ မှ ပြန်လည်စတင်မည် ]
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
