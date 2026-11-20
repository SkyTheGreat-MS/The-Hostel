import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ANIMATIONS } from '../../styles/designSystem';

export interface ThoughtLineProps {
  /** The active monologue text. null = hidden. */
  message: string | null;
  /** Handler to dismiss the thought line (set message to null). */
  onDismiss?: () => void;
  /** Position variant. Default: 'bottom'. */
  position?: 'bottom' | 'center-bottom';
  /** Linger duration before auto-fading in milliseconds. Default: 3000ms. */
  durationMs?: number;
  /** Additional className overrides for the outer wrapper. */
  className?: string;
}

/**
 * ThoughtLine - 1998 Folk-Horror Cinematic Thought Engine
 *
 * Renders protagonist inner thoughts as floating subtitles.
 * - 100% Borderless: No AI-slop boxes, decorative bars, or dismiss prompts.
 * - Auto-fades after exactly 3.0 seconds with smooth deceleration.
 * - Click anywhere to dismiss immediately; seamlessly resets when new thoughts appear.
 */
export const ThoughtLine: React.FC<ThoughtLineProps> = ({
  message,
  onDismiss,
  position = 'bottom',
  durationMs = ANIMATIONS.thoughtLingerMs,
  className = '',
}) => {
  // 3-Second Auto-Fade Timer
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onDismiss?.();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [message, durationMs, onDismiss]);

  const positionClass =
    position === 'center-bottom'
      ? 'bottom-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl px-6'
      : 'bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6';

  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 8, filter: 'blur(2px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -4, filter: 'blur(2px)' }}
          transition={{
            duration: 0.45,
            ease: ANIMATIONS.easeCinematic,
          }}
          className={`absolute z-40 pointer-events-auto cursor-pointer select-none ${positionClass} ${className}`}
          onClick={onDismiss}
          role="status"
          aria-live="polite"
        >
          {/* Borderless Organic Feathered Ambient Wash */}
          <div className="relative thought-feather-wash py-3 px-6 rounded-2xl flex items-center justify-center">
            <p className="font-burmese text-sm sm:text-base text-[#d8eae2] text-center thought-subtitle-shadow leading-[1.75] tracking-wide">
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThoughtLine;
