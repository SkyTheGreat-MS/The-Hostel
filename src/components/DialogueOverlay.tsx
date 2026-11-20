import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, ArrowRight } from 'lucide-react';
import { ANIMATIONS } from '../styles/designSystem';

export interface DialogueOverlayProps {
  variant?: 'monologue' | 'dialogue';
  text: string;
  onDismiss?: () => void;
  // Monologue-specific
  hintText?: string;
  durationMs?: number;
  // Dialogue-specific
  speakerName?: string;
  speakerAlign?: 'left' | 'center' | 'right';
  locationTag?: string;
  isTyping?: boolean;
  onAdvance?: () => void;
  onRewind?: () => void;
  canRewind?: boolean;
  advanceActionText?: string;
}

export const ThoughtMonologueOverlay: React.FC<{
  text: string;
  onDismiss?: () => void;
  hintText?: string;
  durationMs?: number;
}> = ({ text, onDismiss, durationMs = ANIMATIONS.thoughtLingerMs }) => {
  // Strip leading/trailing dashes to prevent double-dash display
  const cleanText = text.replace(/^[—–-]\s*|\s*[—–-]$/g, '').trim();

  // 3-Second Auto-Fade Timer
  useEffect(() => {
    if (!text) return;
    const timer = setTimeout(() => {
      onDismiss?.();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [text, durationMs, onDismiss]);

  return (
    <AnimatePresence mode="wait">
      {cleanText && (
        <>
          {/* Full-screen tap interceptor to dismiss early */}
          {onDismiss && (
            <div
              onClick={onDismiss}
              className="fixed inset-0 z-35 cursor-pointer pointer-events-auto"
              title="Click anywhere to dismiss"
            />
          )}

          {/* Borderless Floating Cinematic Thought Subtitle */}
          <motion.div
            key={cleanText}
            initial={{ opacity: 0, y: 8, filter: 'blur(2px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -4, filter: 'blur(2px)' }}
            transition={{ duration: 0.45, ease: ANIMATIONS.easeCinematic }}
            onClick={onDismiss}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-40 cursor-pointer select-none pointer-events-auto"
            role="status"
            aria-live="polite"
          >
            <div className="relative thought-feather-wash py-3 px-6 rounded-none flex items-center justify-center">
              <p className="font-burmese text-sm sm:text-base text-[#d8eae2] text-center thought-subtitle-shadow leading-[1.75] tracking-wide">
                {cleanText}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const DialogueOverlay: React.FC<DialogueOverlayProps> = ({
  variant = 'dialogue',
  text,
  onDismiss,
  durationMs = ANIMATIONS.thoughtLingerMs,
  speakerName,
  speakerAlign = 'left',
  locationTag,
  isTyping = false,
  onAdvance,
  onRewind,
  canRewind = false,
  advanceActionText = 'ရှေ့သို့',
}) => {
  if (variant === 'monologue') {
    return (
      <ThoughtMonologueOverlay
        text={text}
        onDismiss={onDismiss || onAdvance}
        durationMs={durationMs}
      />
    );
  }

  return (
    <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 max-w-4xl mx-auto px-4 z-20">
      {/* Character Name Tab (attached to top edge, follows speaker position) */}
      {speakerName && (
        <div
          className="absolute top-0 z-30 px-4 py-1.5 rounded-none bg-[#020504]/55 backdrop-blur-md pointer-events-none select-none"
          style={{
            transform: 'translateY(-100%)',
            ...(speakerAlign === 'left' && { left: '2rem' }),
            ...(speakerAlign === 'center' && { left: '50%', transform: 'translate(-50%, -100%)' }),
            ...(speakerAlign === 'right' && { right: '2rem' }),
          }}
        >
          <span className="font-burmese text-xs sm:text-sm font-bold tracking-wider text-[#b1d4c2] whitespace-nowrap leading-[1.75]">
            {speakerName}
          </span>
        </div>
      )}

      {/* Main Dialogue Box: Duo-Tone Stagnant Obsidian & Sickly Verdigris */}
      <div
        onClick={onAdvance}
        className="w-full relative rounded-none bg-[#020504]/55 backdrop-blur-md p-4 sm:p-6 transition-colors duration-150 cursor-pointer group"
      >
        {/* Location Tag & Rewind Bar */}
        <div className="flex items-center justify-between mb-2 sm:mb-3 pb-2">
          <div className="flex items-center gap-2">
            {locationTag && (
              <span className="text-[10px] font-mono tracking-widest text-[#447d60] uppercase hidden sm:inline">
                {locationTag}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {canRewind && onRewind && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRewind();
                }}
                className="px-2.5 py-1 rounded-none bg-[#0b140f] hover:bg-[#101c15] text-[#b1d4c2] hover:text-[#e0f0e7] text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors leading-[1.75]"
                title="ယခင်စာကြောင်းသို့ ပြန်သွားမည် [↑] သို့မဟုတ် [Backspace]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>နောက်သို့</span>
              </button>
            )}

            <span className="text-[11px] font-mono text-[#447d60]">
              {isTyping ? 'စာရိုက်နေသည်...' : 'အသင့်ရှိ'}
            </span>
          </div>
        </div>

        {/* Dialogue Text Body */}
        <p className="text-[#d8eae2] font-burmese text-sm sm:text-base md:text-lg leading-[1.75] min-h-[56px] sm:min-h-[64px] tracking-wide select-text">
          {text}
          {isTyping && <span className="inline-block w-2 h-4 bg-[#6ea889] ml-1 animate-pulse" />}
        </p>

        {/* Advance Hint / Actions */}
        <div className="mt-4 flex items-center justify-between text-xs font-mono text-[#447d60] pt-2">
          <span className="text-[11px] text-[#447d60]">
            ဆက်သွားရန် <span className="text-[#b1d4c2] font-bold">[ENTER]</span> • နောက်ပြန်ဆုတ်ရန်{' '}
            <span className="text-[#b1d4c2] font-bold">[↑]</span>
          </span>

          <div className="flex items-center gap-1 text-[#6ea889] group-hover:text-[#e0f0e7] group-hover:translate-x-1 transition-all">
            <span className="font-semibold">{advanceActionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogueOverlay;
