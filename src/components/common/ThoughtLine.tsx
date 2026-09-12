import React from 'react';
import { AnimatePresence, motion } from 'motion/react';

export interface ThoughtLineProps {
  /** The active monologue text. null = hidden. */
  message: string | null;
  /** Handler to dismiss the thought line (set message to null). */
  onDismiss?: () => void;
  /** Position variant. Default: 'bottom'. */
  position?: 'bottom' | 'center-bottom';
  /** Additional className overrides for the outer wrapper. */
  className?: string;
}

/**
 * ThoughtLine - Unified monologue/inner-thought renderer.
 *
 * Mount once per scene at the scene level. Bind message to the scene's
 * activeMonologue state. Never nest multiple ThoughtLines simultaneously
 * as this causes text collision bugs.
 *
 * @example
 * ```tsx
 * <ThoughtLine message={activeMonologue} onDismiss={() => setActiveMonologue(null)} />
 * ```
 */
export const ThoughtLine: React.FC<ThoughtLineProps> = ({
  message,
  onDismiss,
  position = 'bottom',
  className = '',
}) => {
  const positionClass =
    position === 'center-bottom'
      ? 'bottom-[18%] left-1/2 -translate-x-1/2 w-[72%] max-w-2xl'
      : 'bottom-6 left-1/2 -translate-x-1/2 w-[88%] max-w-3xl';

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`absolute z-50 pointer-events-auto ${positionClass} ${className}`}
          onClick={onDismiss}
          role="status"
          aria-live="polite"
        >
          <div className="relative bg-[#09130f]/92 border border-[#2d4436] rounded-xl px-5 py-3.5 shadow-2xl backdrop-blur-sm cursor-pointer group">
            {/* Decorative left accent bar */}
            <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-emerald-500/50" />
            <p className="pl-3 font-mono text-[12px] sm:text-[13px] leading-relaxed text-[#c8ddd5] tracking-wide">
              {message}
            </p>
            {onDismiss && (
              <p className="pl-3 mt-1.5 font-mono text-[10px] text-[#5a7a69] tracking-widest uppercase group-hover:text-[#82a996] transition-colors">
                [ CLICK TO DISMISS ]
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThoughtLine;
