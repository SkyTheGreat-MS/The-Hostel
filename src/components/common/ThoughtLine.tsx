import React, { useEffect, useRef } from 'react';
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
 * - Auto-fades after exactly 3.0 seconds (durationMs).
 * - Click anywhere (on the subtitle or elsewhere on the screen) to dismiss immediately.
 */
export const ThoughtLine: React.FC<ThoughtLineProps> = ({
  message,
  onDismiss,
  position = 'bottom',
  durationMs = ANIMATIONS.thoughtLingerMs,
  className = '',
}) => {
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  // 1. 3-Second Auto-Fade Timer: decoupled from onDismiss function identity so
  // parent component re-renders (e.g. 1-second game timer / vitals updates)
  // do not cancel or reset the 3-second countdown.
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onDismissRef.current?.();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [message, durationMs]);

  // 2. Click anywhere / clicked elsewhere listener to dismiss immediately
  useEffect(() => {
    if (!message) return;

    const handleDismissElsewhere = () => {
      onDismissRef.current?.();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        onDismissRef.current?.();
      }
    };

    // Small delay (50ms) so the click event that triggered this thought
    // does not immediately dismiss it in the same event loop tick.
    const registerTimer = setTimeout(() => {
      window.addEventListener('pointerdown', handleDismissElsewhere);
      window.addEventListener('keydown', handleKeyDown);
    }, 50);

    return () => {
      clearTimeout(registerTimer);
      window.removeEventListener('pointerdown', handleDismissElsewhere);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [message]);

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
          onClick={(e) => {
            e.stopPropagation();
            onDismissRef.current?.();
          }}
          role="status"
          aria-live="polite"
        >
          {/* Borderless Organic Feathered Ambient Wash */}
          <div className="relative thought-feather-wash py-3 px-6 rounded-none flex items-center justify-center">
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
