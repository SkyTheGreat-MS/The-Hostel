import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../audioEngine';
import { getAssetBackground, DEFAULT_BACKGROUND_JPG } from '../utils/assets';
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
  /** Simple JPG background path (e.g. '/assets/main_menu.jpg', '/assets/chapter_1.jpg') */
  backgroundImage?: string;
  /** Hide the page-level background when a child (e.g. the VN engine) owns the scene image. */
  hideBackground?: boolean;
  /** Deprecated legacy prop preserved for backward compatibility */
  scene?: 'hallway' | 'seance' | 'chapter3';
  chapterNumber?: number;
  colorGrade?: 'monsoon_green' | 'guttering_wax' | 'archive_1998';
  fullBleed?: boolean;
}

export const AtmosphericLayout: React.FC<AtmosphericLayoutProps> = ({
  children,
  headerTitle = "ဝိညာဉ်၏ ဝင်္ကပါ",
  headerSubtitle = 'ဟော်စတယ် ၁၉၉၈ • အချိန်ကာလ စုံစမ်းစစ်ဆေးမှု',
  showRain = true,
  showBackNav = true,
  backTo = '/chapters',
  backLabel = 'အခန်းများသို့ ပြန်သွားရန်',
  backgroundImage,
  hideBackground = false,
  scene,
  chapterNumber,
  colorGrade = 'monsoon_green',
  fullBleed = false,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const navigate = useNavigate();

  // Determine effective background path
  const effectiveBg = backgroundImage || (chapterNumber ? `/assets/chapter_${chapterNumber}.jpg` : '/assets/main_menu.jpg');

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
    <div
      className={`relative w-full ${
        fullBleed ? 'h-screen overflow-hidden' : 'min-h-screen overflow-x-hidden'
      } bg-[#020504] text-[#b1d4c2] font-burmese selection:bg-[#193828] selection:text-[#e0f0e7] flex flex-col`}
    >
      {/* 1. Background Atmosphere Image from Assets */}
      {!hideBackground && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src={getAssetBackground(effectiveBg)}
            alt="နောက်ခံ ရုပ်ပုံ"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_BACKGROUND_JPG;
            }}
            className={`w-full h-full object-cover select-none pointer-events-none transition-opacity duration-700 ${getColorGradeClass()}`}
          />
          {/* Cinematic vignette & shadow overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/75 pointer-events-none" />
        </div>
      )}

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
      {!fullBleed && (
        <header className="relative z-20 w-full bg-[#060b08]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <Link
              to="/"
              className="group flex items-center gap-2.5 text-[#6ea889] hover:text-[#b1d4c2] transition-colors"
              title="ပင်မမီနူးသို့ ပြန်သွားရန်"
            >
              <div className="w-8 h-8 rounded-none bg-[#060b08]/85 flex items-center justify-center group-hover:bg-[#0b140f] transition-colors">
                <Ghost className="w-4 h-4 text-[#6ea889] group-hover:text-[#b1d4c2] transition-colors" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold tracking-wider font-cinzel text-[#b1d4c2] group-hover:text-[#e0f0e7] transition-colors">
                    {headerTitle}
                  </span>
                </div>
                <span className="text-[11px] text-[#447d60] font-mono hidden sm:block">
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-[#020504]/60 backdrop-blur-sm text-xs font-burmese text-[#b1d4c2] hover:text-[#e0f0e7] hover:bg-[#060b08]/90 transition-colors leading-[1.75]"
              >
                <Compass className="w-3.5 h-3.5 text-[#6ea889]" />
                <span>{backLabel}</span>
              </Link>
            )}

            <button
              onClick={toggleSound}
              aria-label={isMuted ? 'အသံဖွင့်ရန်' : 'အသံပိတ်ရန်'}
              className="p-2 rounded-none bg-[#020504]/60 backdrop-blur-sm text-[#6ea889] hover:text-[#b1d4c2] hover:bg-[#060b08]/90 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-[#447d60]" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </header>
      )}

      {/* 6. Main Content Area */}
      <main
        className={`relative z-10 flex-1 w-full flex flex-col ${
          fullBleed
            ? 'h-full p-0 max-w-none overflow-hidden'
            : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'
        }`}
      >
        {children}
      </main>

      {/* 7. Footer Seal & Subtle Timestamp */}
      {!fullBleed && (
        <footer className="relative z-20 w-full bg-[#020504]/90 backdrop-blur-sm px-6 py-2.5 flex items-center justify-between text-[11px] font-mono text-[#447d60]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-none bg-[#6ea889]/80 animate-pulse" />
            <span>NAT REALM STRAND: ACTIVE</span>
          </div>
          <div>
            <span>BURMESE FOLK-HORROR INVESTIGATION • 1998–2026</span>
          </div>
        </footer>
      )}
    </div>
  );
};
