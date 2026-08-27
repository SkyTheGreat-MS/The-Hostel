import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../audioEngine';
import {
  Volume2,
  VolumeX,
  Compass,
  Ghost,
  Sparkles,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export interface AtmosphericLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  showRain?: boolean;
  showBackNav?: boolean;
  backTo?: string;
  backLabel?: string;
  scene?: 'hallway' | 'seance' | 'chapter3';
  colorGrade?: 'monsoon_green' | 'guttering_wax' | 'archive_1998';
}

export const AtmosphericLayout: React.FC<AtmosphericLayoutProps> = ({
  children,
  headerTitle = "THE SPIRIT'S LABYRINTH",
  headerSubtitle = 'HOSTEL 1998 • TEMPORAL INVESTIGATION',
  showRain = true,
  showBackNav = true,
  backTo = '/chapters',
  backLabel = 'Back to Chapters',
  scene = 'hallway',
  colorGrade = 'monsoon_green',
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const navigate = useNavigate();

  const toggleSound = () => {
    const nextMuted = !isMuted;
    sound.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  const getColorGradeClass = () => {
    switch (colorGrade) {
      case 'guttering_wax':
        return 'sepia-[0.35] brightness-90 contrast-110 hue-rotate-[-10deg]';
      case 'archive_1998':
        return 'sepia-[0.55] brightness-[0.85] contrast-125 saturate-[0.8]';
      case 'monsoon_green':
      default:
        return 'hue-rotate-[18deg] saturate-[0.95] contrast-[1.08] brightness-[0.92]';
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#050b09] text-stone-200 overflow-x-hidden font-sans selection:bg-amber-900/60 selection:text-amber-100 flex flex-col">
      {/* 1. Background Atmosphere Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {scene === 'seance' ? (
          <div className={`w-full h-full bg-[#080705] relative overflow-hidden ${getColorGradeClass()}`}>
            <svg className="w-full h-full absolute inset-0" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="cand-bloom" cx="42%" cy="58%" r="45%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.35" />
                  <stop offset="25%" stopColor="#f97316" stopOpacity="0.18" />
                  <stop offset="60%" stopColor="#7c2d12" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="tbl-wood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#291a10" />
                  <stop offset="50%" stopColor="#190f09" />
                  <stop offset="100%" stopColor="#0c0704" />
                </linearGradient>
              </defs>
              <rect width="1920" height="1080" fill="#0a0806" />
              <circle cx="800" cy="620" r="600" fill="url(#cand-bloom)" />
              <polygon points="280,680 1640,680 1850,1080 70,1080" fill="url(#tbl-wood)" />
              <line x1="280" y1="680" x2="1640" y2="680" stroke="#78350f" strokeWidth="4" opacity="0.6" />
            </svg>
          </div>
        ) : (
          /* UIT Pathway 326 Corridor */
          <div className={`w-full h-full bg-[#050b09] relative overflow-hidden ${getColorGradeClass()}`}>
            <svg className="w-full h-full absolute inset-0 opacity-60" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="lay-floor-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0b1714" />
                  <stop offset="45%" stopColor="#122521" />
                  <stop offset="85%" stopColor="#0e1d1a" />
                  <stop offset="100%" stopColor="#050a08" />
                </linearGradient>
                <linearGradient id="lay-left-wall" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#162c26" />
                  <stop offset="70%" stopColor="#11221d" />
                  <stop offset="100%" stopColor="#091411" />
                </linearGradient>
                <linearGradient id="lay-right-wall" x1="1" y1="0" x2="0" y2="0">
                  <stop offset="0%" stopColor="#183029" />
                  <stop offset="70%" stopColor="#11221d" />
                  <stop offset="100%" stopColor="#091411" />
                </linearGradient>
                <radialGradient id="lay-lantern-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.45" />
                  <stop offset="30%" stopColor="#d97706" stopOpacity="0.25" />
                  <stop offset="70%" stopColor="#92400e" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* Floor */}
              <polygon points="0,1080 1920,1080 1020,490 900,490" fill="url(#lay-floor-grad)" />
              {/* Left & Right Walls */}
              <polygon points="0,0 0,1080 900,490 900,240" fill="url(#lay-left-wall)" />
              <polygon points="1920,0 1920,1080 1020,490 1020,240" fill="url(#lay-right-wall)" />
              {/* Roof Truss */}
              <polygon points="0,0 1920,0 1020,240 900,240" fill="#08100e" />
              {/* End Door Portal */}
              <polygon points="900,490 1020,490 1020,310 900,310" fill="#132a24" />
              {/* Mid-right room warm glow */}
              <circle cx="1220" cy="510" r="140" fill="url(#lay-lantern-glow)" />
            </svg>
          </div>
        )}
      </div>

      {/* 2. Monsoon Rain Effect */}
      {showRain && (
        <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden opacity-35">
          <svg className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="rain-pat" width="120" height="120" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
                <line x1="10" y1="5" x2="10" y2="35" stroke="#93c5fd" strokeWidth="1" strokeOpacity="0.4" />
                <line x1="45" y1="40" x2="45" y2="75" stroke="#93c5fd" strokeWidth="0.8" strokeOpacity="0.3" />
                <line x1="85" y1="15" x2="85" y2="50" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.5" />
                <line x1="110" y1="80" x2="110" y2="110" stroke="#93c5fd" strokeWidth="0.7" strokeOpacity="0.35" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#rain-pat)" />
          </svg>
        </div>
      )}

      {/* 3. CRT Scanlines & Grain */}
      <div
        className="fixed inset-0 pointer-events-none z-[2] opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #000 0px, #000 2px, transparent 2px, transparent 4px)`,
          backgroundSize: '100% 4px',
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-[3] opacity-[0.05] mix-blend-screen"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: '3px 3px',
        }}
      />

      {/* 4. Heavy Cinematic Vignette */}
      <div className="fixed inset-0 pointer-events-none z-[4] bg-[radial-gradient(circle_at_center,transparent_30%,rgba(3,6,4,0.7)_70%,rgba(1,3,2,0.94)_100%)]" />

      {/* 5. Top Bar Header */}
      <header className="relative z-20 w-full border-b border-stone-800/80 bg-stone-950/70 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3.5">
          <Link
            to="/"
            className="group flex items-center gap-2.5 text-stone-400 hover:text-amber-400 transition-colors"
            title="Return to Main Menu"
          >
            <div className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-700/70 flex items-center justify-center group-hover:border-amber-500/60 group-hover:bg-amber-950/40 transition-all shadow-md">
              <Ghost className="w-4 h-4 text-amber-500/80 group-hover:text-amber-400 transition-colors" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold tracking-widest font-bebas text-stone-200 group-hover:text-amber-200 transition-colors">
                  {headerTitle}
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-800/60 text-amber-300">
                  1998 ECHO
                </span>
              </div>
              <span className="text-[11px] text-stone-400 font-mono hidden sm:block">
                {headerSubtitle}
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {showBackNav && (
            <Link
              to={backTo}
              onClick={() => sound.playMenuSelect()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-900/90 border border-stone-700/80 text-xs font-mono text-stone-300 hover:text-amber-300 hover:border-amber-600/70 hover:bg-stone-800 transition-all shadow-sm"
            >
              <Compass className="w-3.5 h-3.5 text-amber-500" />
              <span>{backLabel}</span>
            </Link>
          )}

          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className={`p-2 rounded-lg border transition-all ${
              isMuted
                ? 'bg-stone-900/80 border-stone-800 text-stone-500 hover:text-stone-300'
                : 'bg-amber-950/40 border-amber-700/50 text-amber-400 hover:bg-amber-900/50'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 6. Main Content Area */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col">
        {children}
      </main>

      {/* 7. Footer Seal & Subtle Timestamp */}
      <footer className="relative z-20 w-full border-t border-stone-900/80 bg-black/60 backdrop-blur-sm px-6 py-2.5 flex items-center justify-between text-[11px] font-mono text-stone-400">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
          <span>NAT REALM STRAND: ACTIVE</span>
        </div>
        <div>
          <span>BURMESE FOLK-HORROR INVESTIGATION • 1998–2026</span>
        </div>
      </footer>
    </div>
  );
};
