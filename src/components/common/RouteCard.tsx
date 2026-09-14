import React from 'react';
import { motion } from 'motion/react';
import { Lock, Unlock } from 'lucide-react';

export interface RouteCardProps {
  sectorLabel: string;
  title: string;
  description: string;
  imagePath: string;
  onClick: () => void;
  /** Whether to show an unlock/lock badge. undefined = no badge. */
  lockState?: 'locked' | 'unlocked' | 'abandoned';
  /** Whether to use the emerald glow (special reveal style). */
  isSpecial?: boolean;
  /** Optional initial animation delay in seconds. */
  animDelay?: number;
  /** Whether the card should be rendered at all. Default true. */
  visible?: boolean;
}

/**
 * RouteCard - Standardized navigation card for TripleFork (east_fork).
 *
 * All route destination cards in the game exploration hub should use
 * this component for consistent typography, hover states, and border glow.
 */
export const RouteCard: React.FC<RouteCardProps> = ({
  sectorLabel, title, description, imagePath, onClick,
  lockState, isSpecial = false, animDelay = 0, visible = true,
}) => {
  if (!visible) return null;

  const borderClass = isSpecial
    ? 'border-emerald-500/60 hover:border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] ring-1 ring-emerald-500/40'
    : 'border-[#2e4238] hover:border-[#4d6e5e] shadow-[0_0_15px_rgba(46,66,56,0.5)] hover:shadow-[0_0_25px_rgba(46,66,56,0.7)]';
  const sectorClass = isSpecial ? 'text-emerald-400' : 'text-[#82a996]';
  const titleHover = isSpecial ? 'group-hover:text-emerald-300' : 'group-hover:text-[#6ee7b7]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: animDelay }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative w-full h-80 sm:h-88 md:h-92 rounded-2xl overflow-hidden border bg-[#121815]/95 cursor-pointer hover:bg-[#18221d]/50 transition-all duration-300 flex flex-col justify-end p-3.5 sm:p-4 ${borderClass}`}
    >
      <img
        src={imagePath}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-105"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0d] via-[#121815]/50 to-transparent" />
      <div className="relative z-10 space-y-1 text-left">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[9px] sm:text-[10px] font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 ${sectorClass}`}>
            {isSpecial && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />}
            {sectorLabel}
          </span>
          {lockState === 'locked' && (
            <span className="text-stone-400 flex items-center gap-1 text-[9px] font-mono shrink-0">
              <Lock className="w-3 h-3" /> LOCKED
            </span>
          )}
          {lockState === 'unlocked' && (
            <span className="text-[#6ee7b7] flex items-center gap-1 text-[9px] font-mono shrink-0">
              <Unlock className="w-3 h-3" /> UNLOCKED
            </span>
          )}
          {lockState === 'abandoned' && (
            <span className="text-[#8fa89b] flex items-center gap-1 text-[9px] font-mono shrink-0">
              <Lock className="w-3 h-3 text-[#5a7a69]" /> ABANDONED
            </span>
          )}
        </div>
        <h3
          className={`text-lg sm:text-xl font-black text-[#c2d6cc] tracking-wider uppercase transition-colors ${titleHover}`}
          style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
        >
          {title}
        </h3>
        <p className="text-[10px] sm:text-[11px] font-mono text-stone-400 line-clamp-2 leading-tight">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default RouteCard;
