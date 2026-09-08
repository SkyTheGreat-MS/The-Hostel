import React from 'react';
import { motion } from 'motion/react';
import { RotateCcw, ArrowRight } from 'lucide-react';

export interface DialogueOverlayProps {
  variant?: 'monologue' | 'dialogue';
  text: string;
  onDismiss?: () => void;
  // Monologue-specific
  hintText?: string;
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
}> = ({ text, onDismiss, hintText = '[click anywhere to continue]' }) => {
  // Strip leading/trailing dashes to prevent double-dash display
  const cleanText = text.replace(/^[—–-]\s*|\s*[—–-]$/g, '').trim();

  return (
    <>
      {/* Invisible full-screen tap/click interceptor */}
      {onDismiss && (
        <div
          onClick={onDismiss}
          className="fixed inset-0 z-35 cursor-pointer pointer-events-auto"
          title="Click anywhere to continue"
        />
      )}

      {/* Thought Monologue Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.2 }}
        onClick={onDismiss}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl px-6 z-40 cursor-pointer select-none animate-fade-in"
      >
        {/* Top Thin Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#4d6e5e]/60 to-transparent" />

        {/* Centered Thought Text */}
        <p className="py-2.5 px-4 text-center font-mono italic text-xs sm:text-sm tracking-wide text-[#a3c2b2] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] leading-relaxed">
          — {cleanText} —
        </p>

        {/* Bottom Thin Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#4d6e5e]/60 to-transparent" />

        <span className="block text-center text-[9px] font-mono text-[#4d6e5e]/60 mt-1 uppercase tracking-widest">
          {hintText}
        </span>
      </motion.div>
    </>
  );
};

export const DialogueOverlay: React.FC<DialogueOverlayProps> = ({
  variant = 'dialogue',
  text,
  onDismiss,
  hintText = '[click anywhere to dismiss]',
  speakerName,
  speakerAlign = 'left',
  locationTag,
  isTyping = false,
  onAdvance,
  onRewind,
  canRewind = false,
  advanceActionText = 'CONTINUE',
}) => {
  if (variant === 'monologue') {
    return (
      <ThoughtMonologueOverlay
        text={text}
        onDismiss={onDismiss || onAdvance}
        hintText={hintText}
      />
    );
  }

  return (
    <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 max-w-4xl mx-auto px-4 z-20">
      {/* Character Name Tab (attached to top edge, follows speaker position) */}
      {speakerName && (
        <div
          className="absolute top-0 z-30 px-4 py-1.5 rounded-t-md rounded-b-sm border border-b-0 border-[#283930] bg-[#121815]/95 shadow-md pointer-events-none select-none"
          style={{
            transform: 'translateY(-100%)',
            ...(speakerAlign === 'left' && { left: '2rem' }),
            ...(speakerAlign === 'center' && { left: '50%', transform: 'translate(-50%, -100%)' }),
            ...(speakerAlign === 'right' && { right: '2rem' }),
          }}
        >
          <span
            className="text-sm sm:text-base font-black tracking-wider uppercase text-[#82a996] whitespace-nowrap"
            style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
          >
            {speakerName}
          </span>
        </div>
      )}

      {/* Main Dialogue Box */}
      <div
        onClick={onAdvance}
        className="w-full relative rounded-xl bg-gradient-to-b from-[#18231e]/95 via-[#121815]/95 to-[#0b0f0d]/95 backdrop-blur-md border border-[#283930] p-4 sm:p-6 shadow-2xl transition-all duration-200 cursor-pointer hover:border-[#4d6e5e] group ring-1 ring-black/80"
      >
        {/* Speaker Name & Rewind Bar */}
        <div className="flex items-center justify-between mb-2 sm:mb-3 border-b border-[#2c3d34]/60 pb-2">
          <div className="flex items-center gap-2">
            {locationTag && (
              <span className="text-[10px] font-mono tracking-widest text-[#82a996]/80 uppercase hidden sm:inline">
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
                className="px-2.5 py-1 rounded bg-[#18221d] hover:bg-[#283930] border border-[#2c3d34] text-[#c2d6cc] hover:text-[#6ee7b7] text-xs font-mono flex items-center gap-1 cursor-pointer transition-all shadow"
                title="Rewind previous line [↑] or [Backspace]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Rewind</span>
              </button>
            )}

            <span className="text-[11px] font-mono text-[#82a996]/80">
              {isTyping ? 'Typing...' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Dialogue Text Body */}
        <p className="text-[#c2d6cc] font-sans text-sm sm:text-base md:text-lg leading-relaxed min-h-[56px] sm:min-h-[64px] tracking-wide select-text">
          {text}
          {isTyping && <span className="inline-block w-2 h-4 bg-[#6ee7b7] ml-1 animate-pulse" />}
        </p>

        {/* Advance Hint / Actions */}
        <div className="mt-4 flex items-center justify-between text-xs font-mono text-[#82a996]/80 border-t border-[#2c3d34]/60 pt-2">
          <span className="text-[11px] text-[#82a996]/70">
            Press <span className="text-[#6ee7b7] font-bold">[ENTER]</span> • Rewind{' '}
            <span className="text-[#c2d6cc] font-bold">[↑]</span>
          </span>

          <div className="flex items-center gap-1 text-[#82a996] group-hover:text-[#6ee7b7] group-hover:translate-x-1 transition-all">
            <span className="font-semibold">{advanceActionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogueOverlay;
