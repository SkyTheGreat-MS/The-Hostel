import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../audioEngine';
import { getAssetBackground, DEFAULT_BACKGROUND_JPG } from '../utils/assets';
import {
  Volume2,
  VolumeX,
  Settings as SettingsIcon,
  X,
  ChevronRight,
  FileText,
  AlertTriangle,
  Flame,
  Target,
  Brain,
  Skull,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

export interface MainMenuProps {
  /** The main game title displayed at top-left */
  title?: string;
  /** Subtitle or archival case file code */
  subtitle?: string;
  /** Pluggable background image URL or asset route */
  backgroundImage?: string;
  /** Flickering prompt at bottom center */
  footerPrompt?: string;
  /** Whether to render sparse diagonal monsoon rain overlay */
  showRain?: boolean;
  /** Callback when PLAY is chosen */
  onPlay?: () => void;
  /** Callback when HELP & GUIDE is chosen */
  onHelp?: () => void;
  /** Callback when SETTINGS is chosen */
  onSettings?: () => void;
  /** Callback when EXIT is chosen */
  onExit?: () => void;
  /** Custom menu items if overriding default */
  customMenuItems?: Array<{ id: string; label: string; action: () => void }>;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  title = "THE SPIRIT'S LABYRINTH",
  subtitle = 'A 1998 BURMESE FOLK-HORROR INVESTIGATION',
  backgroundImage = '/assets/main_menu.jpg',
  footerPrompt = 'Press Enter to Continue',
  showRain = true,
  onPlay,
  onHelp,
  onSettings,
  onExit,
  customMenuItems,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [activeModal, setActiveModal] = useState<'none' | 'help' | 'settings' | 'exit'>('none');
  const [rainEnabled, setRainEnabled] = useState<boolean>(showRain);
  const [grainEnabled, setGrainEnabled] = useState<boolean>(true);
  const [scanlinesEnabled, setScanlinesEnabled] = useState<boolean>(true);
  const [colorGrade, setColorGrade] = useState<'monsoon_green' | 'guttering_wax' | 'archive_1998'>('monsoon_green');

  // Menu items list - strictly standard layout starting with PLAY
  const menuItems = customMenuItems || [
    {
      id: 'play',
      label: 'PLAY',
      action: () => {
        sound.playMenuSelect();
        if (onPlay) onPlay();
      },
    },
    {
      id: 'help',
      label: 'HELP & GUIDE',
      action: () => {
        sound.playMenuSelect();
        setActiveModal('help');
        if (onHelp) onHelp();
      },
    },
    {
      id: 'settings',
      label: 'SETTINGS',
      action: () => {
        sound.playMenuSelect();
        setActiveModal('settings');
        if (onSettings) onSettings();
      },
    },
    {
      id: 'exit',
      label: 'EXIT',
      action: () => {
        sound.playMenuSelect();
        setActiveModal('exit');
        if (onExit) onExit();
      },
    },
  ];

  // Start atmospheric ambient tone on first user interaction
  useEffect(() => {
    const handleFirstTouch = () => {
      sound.startAmbient();
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('keydown', handleFirstTouch);
    };
    window.addEventListener('click', handleFirstTouch);
    window.addEventListener('keydown', handleFirstTouch);
    return () => {
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('keydown', handleFirstTouch);
    };
  }, []);

  // Keyboard navigation (Arrow keys, Enter, Esc, 1-4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModal !== 'none') {
        if (e.key === 'Escape') {
          setActiveModal('none');
          sound.playMenuHover();
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = (prev + 1) % menuItems.length;
          sound.playMenuHover();
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = (prev - 1 + menuItems.length) % menuItems.length;
          sound.playMenuHover();
          return next;
        });
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        menuItems[selectedIndex].action();
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < menuItems.length) {
          setSelectedIndex(idx);
          menuItems[idx].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, menuItems, activeModal]);

  const handleAudioToggle = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.startAmbient();
  };

  // Color grade filter class mapping
  const getColorGradeClass = () => {
    switch (colorGrade) {
      case 'monsoon_green':
        // Warm-damp sickly yellow-green candle/fluorescent glow
        return 'contrast-125 brightness-75 sepia-[0.22] hue-rotate-[70deg] saturate-75';
      case 'guttering_wax':
        // Warm flickering amber-wax palette
        return 'contrast-130 brightness-70 sepia-[0.45] hue-rotate-[15deg] saturate-110';
      case 'archive_1998':
        // Desaturated cold surveillance tape
        return 'contrast-140 brightness-65 grayscale-[0.35] sepia-[0.1] saturate-60';
      default:
        return 'contrast-125 brightness-75 sepia-[0.2] hue-rotate-[70deg] saturate-75';
    }
  };

  return (
    <div
      id="horror-main-menu-root"
      className="relative w-full h-screen min-h-[640px] bg-black text-[#E5E5E5] overflow-hidden select-none font-sans flex flex-col justify-between"
    >
      {/* 1. Base Layer: Simple JPG Background from Assets */}
      <div id="menu-background-container" className="absolute inset-0 z-0">
        <img
          src={getAssetBackground(backgroundImage)}
          alt="The Spirit's Labyrinth Background"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_BACKGROUND_JPG;
          }}
          className={`w-full h-full object-cover select-none pointer-events-none transition-all duration-700 ${getColorGradeClass()}`}
        />
      </div>

      {/* 2. Atmosphere: Slow-Pulsing Radial Glow centered near candle / hallway light source */}
      <div
        id="menu-light-flicker-glow"
        className="absolute inset-0 z-1 pointer-events-none transition-opacity duration-1000"
        style={{
          background:
            'radial-gradient(circle 520px at 28% 42%, rgba(245, 230, 160, 0.14) 0%, rgba(234, 88, 12, 0.06) 45%, rgba(0, 0, 0, 0) 75%)',
        }}
      />

      {/* 3. Atmosphere: Deep Black Vignette (Transparent center to opaque dark borders) */}
      <div
        id="menu-dark-vignette-overlay"
        className="absolute inset-0 z-2 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 35%, rgba(5, 5, 5, 0.55) 70%, rgba(3, 3, 3, 0.92) 100%)',
        }}
      />

      {/* 4. Atmosphere: Subtle Vintage Film Grain Texture Overlay */}
      {grainEnabled && (
        <div
          id="menu-film-grain"
          className="absolute inset-0 z-3 pointer-events-none opacity-25 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.7'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* 5. Atmosphere: Subtle CRT Scanlines Overlay */}
      {scanlinesEnabled && (
        <div
          id="menu-scanlines"
          className="absolute inset-0 z-4 pointer-events-none opacity-20"
          style={{
            background:
              'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.65) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
            backgroundSize: '100% 4px, 6px 100%',
          }}
        />
      )}

      {/* 6. Atmosphere: Optional Sparse Monsoon Rain Streaks Overlay */}
      {rainEnabled && (
        <div id="menu-monsoon-rain" className="absolute inset-0 z-5 pointer-events-none overflow-hidden opacity-25">
          <svg className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="rain-pattern" width="140" height="140" patternUnits="userSpaceOnUse">
                <line x1="10" y1="0" x2="0" y2="45" stroke="#bae6fd" strokeWidth="1" opacity="0.5" />
                <line x1="75" y1="20" x2="65" y2="70" stroke="#bae6fd" strokeWidth="1.2" opacity="0.7" />
                <line x1="130" y1="60" x2="120" y2="105" stroke="#bae6fd" strokeWidth="0.8" opacity="0.4" />
                <line x1="45" y1="90" x2="35" y2="135" stroke="#bae6fd" strokeWidth="1.1" opacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#rain-pattern)" />
          </svg>
        </div>
      )}

      {/* 7. Foreground Content & Interactive UI (Z-10) */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 sm:p-10 lg:p-14 max-w-7xl mx-auto">
        {/* Top Header Bar: Sound Controls & Archival Metadata */}
        <div className="flex items-center justify-between w-full">
          <div className="ml-auto flex items-center gap-2 bg-[#020504]/60 backdrop-blur-md px-3 py-1.5 rounded-none">
            <button
              id="menu-btn-audio-toggle"
              onClick={handleAudioToggle}
              className="text-stone-400 hover:text-amber-400 transition-colors p-1"
              title={isMuted ? 'Unmute Audio (Procedural 1998 Drone)' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>

        {/* Main Menu Stack: Title Anchor (Top-Left) + Left Navigation Stack */}
        <div className="flex-1 flex flex-col justify-center max-w-xl py-6">
          {/* TITLE ANCHOR (Top-Left) */}
          <div id="menu-title-anchor" className="mb-8 sm:mb-12">
            {/* Archival Case Stamp */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-mono tracking-widest bg-rose-950/80 text-rose-300 font-bold uppercase rounded-none">
                BURMESE FOLK-HORROR • 1998
              </span>
              <span className="text-xs text-stone-500 font-mono hidden sm:inline">
                FILE NO: MM-YAU-08-98
              </span>
            </div>

            {/* Game Title: Tall, heavy sans-serif in off-white (#E5E5E5) with distressed scored text-shadow */}
            <h1
              id="menu-game-title"
              className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-wider text-[#E5E5E5] leading-[0.9] uppercase select-none transition-all duration-300"
              style={{
                fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                textShadow:
                  '3px 3px 0px rgba(0,0,0,0.95), -1px -1px 2px rgba(220, 38, 38, 0.4), 0px 0px 20px rgba(0, 0, 0, 0.8)',
                letterSpacing: '0.04em',
              }}
            >
              {title}
            </h1>

            {/* Scratched Burmese Glyphs & Subtitle */}
            <div className="mt-2 flex items-center gap-3">
              <div className="h-[2px] w-12 bg-gradient-to-r from-red-600 to-amber-600 opacity-80" />
              <p className="text-xs sm:text-sm font-mono tracking-widest text-stone-400 font-medium uppercase">
                {subtitle}
              </p>
              <span className="text-xs text-amber-500/70 font-burmese leading-[1.75] hidden md:inline">
                (ဝိညာဉ်ဝင်္ကပါ)
              </span>
            </div>
          </div>

          {/* NAVIGATION MENU (Left Stack) */}
          <nav
            id="menu-navigation-stack"
            aria-label="Main Game Menu"
            className="flex flex-col items-start gap-3 sm:gap-4 pl-1"
          >
            {menuItems.map((item, idx) => {
              const isActive = selectedIndex === idx;

              if (isActive) {
                // ACTIVE ITEM: High-contrast white grunge/eroded background badge with dark text (#1A1A1A)
                return (
                  <motion.button
                    key={item.id}
                    id={`menu-item-${item.id}`}
                    layoutId="activeMenuItem"
                    onClick={item.action}
                    onMouseEnter={() => {
                      if (selectedIndex !== idx) {
                        setSelectedIndex(idx);
                        sound.playMenuHover();
                      }
                    }}
                    className="group relative text-left outline-none cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[#E5E5E5] text-[#1A1A1A] font-black tracking-widest uppercase flex items-center gap-3 shadow-2xl transition-transform"
                      style={{
                        transform: 'rotate(-0.6deg)',
                        boxShadow:
                          '4px 4px 0px rgba(0,0,0,0.9), 0 10px 25px -5px rgba(0,0,0,0.8)',
                        clipPath:
                          'polygon(0% 0%, 98.5% 1.5%, 100% 98%, 1.5% 100%)',
                      }}
                    >
                      {/* Active Indicator Shard */}
                      <svg
                        className="w-4 h-4 text-red-700 fill-current shrink-0"
                        viewBox="0 0 24 24"
                      >
                        <polygon points="2,12 22,2 14,22" />
                      </svg>

                      <span
                        className="text-lg sm:text-2xl font-black tracking-wider leading-none"
                        style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                      >
                        {item.label}
                      </span>

                      <ChevronRight className="w-4 h-4 text-[#1A1A1A] ml-2 opacity-80 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>
                );
              }

              // INACTIVE ITEM: Off-white text prefixed with cracked-glass-shard accent icon
              return (
                <button
                  key={item.id}
                  id={`menu-item-${item.id}`}
                  onClick={() => {
                    setSelectedIndex(idx);
                    item.action();
                  }}
                  onMouseEnter={() => {
                    setSelectedIndex(idx);
                    sound.playMenuHover();
                  }}
                  className="group flex items-center gap-3 text-left py-1.5 px-2 text-[#E5E5E5]/75 hover:text-red-600 hover:translate-x-1.5 transition-all duration-200 cursor-pointer outline-none select-none"
                >
                  {/* Cracked-Glass-Shard Accent Icon (Inline SVG Triangle Shard) */}
                  <svg
                    className="w-3.5 h-3.5 text-stone-500 fill-stone-500/40 stroke-stone-400 group-hover:text-red-500 group-hover:fill-red-600 group-hover:stroke-red-400 transition-colors shrink-0"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                  >
                    <polygon points="3,15 21,3 13,21" />
                    {/* Internal crack line */}
                    <line x1="12" y1="8" x2="8" y2="18" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
                  </svg>

                  <span
                    className="text-lg sm:text-xl font-bold tracking-wider uppercase transition-colors"
                    style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* FOOTER ACTION (Bottom-Center): Low-opacity flickering text prompt */}
        <div id="menu-footer-prompt" className="w-full flex flex-col items-center justify-center pb-2">
          <p
            className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-stone-400/80 animate-pulse transition-opacity select-none text-center"
            style={{
              textShadow: '0 0 10px rgba(0,0,0,0.9), 0 0 4px rgba(254, 240, 138, 0.3)',
            }}
          >
            {footerPrompt}
          </p>
          <span className="text-[10px] text-stone-600 font-mono mt-1 tracking-wider">
            [↑/↓] Navigate • [ENTER] Select • [ESC] Close
          </span>
        </div>
      </div>

      {/* MODAL: Help & Guide Dossier */}
      <AnimatePresence>
        {activeModal === 'help' && (
          <motion.div
            id="modal-help-guide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-[#060b08]/96 rounded-none max-w-2xl w-full p-6 sm:p-8 text-[#b1d4c2] relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-[#6ea889]" />
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-cinzel tracking-wider text-[#b1d4c2] uppercase">
                      Investigative Field Guide &amp; Spirit Rules
                    </h2>
                    <p className="text-xs text-[#447d60] font-mono">
                      Hostel 1998 • Nat-Calling Séance Manual
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal('none')}
                  className="p-1.5 rounded-none bg-[#0b140f] hover:bg-[#101c15] text-[#6ea889] hover:text-[#e0f0e7] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Guide Contents */}
              <div className="space-y-4 text-xs leading-relaxed max-h-[60vh] overflow-y-auto pr-2 text-[#b1d4c2]">
                {/* How to Play & Your Mission */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-[#0b140f] rounded-none">
                    <h3 className="font-bold text-[#b1d4c2] text-sm mb-1 flex items-center gap-1.5 uppercase font-cinzel">
                      <Flame className="w-4 h-4 text-[#6ea889]" />
                      How to Play
                    </h3>
                    <p className="text-[#6ea889] text-[11px] font-burmese leading-[1.75]">
                      အတိတ်ကို ဖော်ထုတ်ပြီး ၁၉၉၈ မှ လွတ်မြောက်အောင် ရှာဖွေပါ။
                    </p>
                  </div>

                  <div className="p-3 bg-[#0b140f] rounded-none">
                    <h3 className="font-bold text-[#b1d4c2] text-sm mb-1 flex items-center gap-1.5 uppercase font-cinzel">
                      <Target className="w-4 h-4 text-[#6ea889]" />
                      Your Mission
                    </h3>
                    <p className="text-[#6ea889] text-[11px] font-burmese leading-[1.75]">
                      &quot;မေ&quot; ဘာဖြစ်ခဲ့သည်ကို ဖော်ထုတ်ပြီး အချိန်မကုန်မီ နတ်ပူဇော်မှု အခမ်းအနားကို ပြီးမြောက်စေပါ။
                    </p>
                  </div>
                </div>

                {/* Game Flow */}
                <div className="p-3 bg-[#0b140f] rounded-none">
                  <h3 className="font-bold text-[#b1d4c2] text-sm mb-2 uppercase font-cinzel">
                    Investigation Flow
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-0 p-2.5 bg-[#060b08] rounded-none text-center">
                        <p className="font-bold text-[#b1d4c2] text-[11px] leading-tight font-mono tabular-nums">
                          <span className="text-[#6ea889]">[01]</span> CHOOSE
                        </p>
                        <p className="text-[#447d60] text-[10px] leading-tight mt-0.5 font-burmese leading-[1.75]">စုံစမ်းသူ ရွေးချယ်မှု</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#447d60] shrink-0" />
                      <div className="flex-1 min-w-0 p-2.5 bg-[#060b08] rounded-none text-center">
                        <p className="font-bold text-[#b1d4c2] text-[11px] leading-tight font-mono tabular-nums">
                          <span className="text-[#6ea889]">[02]</span> EXPLORE
                        </p>
                        <p className="text-[#447d60] text-[10px] leading-tight mt-0.5 font-burmese leading-[1.75]">အဆောင်ကို ရှာဖွေရန်</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#447d60] shrink-0" />
                      <div className="flex-1 min-w-0 p-2.5 bg-[#060b08] rounded-none text-center">
                        <p className="font-bold text-[#b1d4c2] text-[11px] leading-tight font-mono tabular-nums">
                          <span className="text-[#6ea889]">[03]</span> FIND CLUES
                        </p>
                        <p className="text-[#447d60] text-[10px] leading-tight mt-0.5 font-burmese leading-[1.75]">ပစ္စည်းများ စစ်ဆေးရန်</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-0 p-2.5 bg-[#060b08] rounded-none text-center">
                        <p className="font-bold text-[#b1d4c2] text-[11px] leading-tight font-mono tabular-nums">
                          <span className="text-[#6ea889]">[04]</span> DEDUCE
                        </p>
                        <p className="text-[#447d60] text-[10px] leading-tight mt-0.5 font-burmese leading-[1.75]">သဲလွန်စများ ချိတ်ဆက်ရန်</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#447d60] shrink-0" />
                      <div className="flex-1 min-w-0 p-2.5 bg-[#060b08] rounded-none text-center">
                        <p className="font-bold text-[#b1d4c2] text-[11px] leading-tight font-mono tabular-nums">
                          <span className="text-[#6ea889]">[05]</span> RITUAL
                        </p>
                        <p className="text-[#447d60] text-[10px] leading-tight mt-0.5 font-burmese leading-[1.75]">နတ်ပူဇော် တင်ဆက်ရန်</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#447d60] shrink-0" />
                      <div className="flex-1 min-w-0 p-2.5 bg-[#060b08] rounded-none text-center">
                        <p className="font-bold text-[#b1d4c2] text-[11px] leading-tight font-mono tabular-nums">
                          <span className="text-[#6ea889]">[06]</span> ESCAPE
                        </p>
                        <p className="text-[#447d60] text-[10px] leading-tight mt-0.5 font-burmese leading-[1.75]">ပဟေဠိ ဖြေရှင်းရန်</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Composure & Grief */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-[#0b140f] rounded-none">
                    <h4 className="font-bold text-[#b1d4c2] mb-1 flex items-center gap-1.5 uppercase font-cinzel">
                      <Brain className="w-3.5 h-3.5 text-[#6ea889]" />
                      Composure <span className="font-burmese font-normal normal-case leading-[1.75] text-[#8fa89b]">(တည်ငြိမ်မှု)</span>
                    </h4>
                    <p className="text-[#447d60] text-[11px] font-burmese leading-[1.75]">၀% မရောက်အောင် ထိန်းသိမ်းပါ</p>
                  </div>

                  <div className="p-3 bg-[#0b140f] rounded-none">
                    <h4 className="font-bold text-[#fca5a5] mb-1 flex items-center gap-1.5 uppercase font-cinzel">
                      <Skull className="w-3.5 h-3.5 text-[#ba2929]" />
                      Grief <span className="font-burmese font-normal normal-case leading-[1.75] text-[#fca5a5]/80">(ပူဆွေးမှု)</span>
                    </h4>
                    <p className="text-[#ba2929] text-[11px] font-burmese leading-[1.75]">၁၀၀% မရောက်အောင် ထိန်းသိမ်းပါ</p>
                  </div>
                </div>
              </div>

              {/* Tip Box & Close Button */}
              <div className="mt-6 pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-start gap-2 p-3 bg-[#0b140f] rounded-none text-[11px] text-[#6ea889] sm:flex-1">
                  <Lightbulb className="w-4 h-4 text-[#c7a458] shrink-0 mt-0.5" />
                  <p className="font-burmese leading-[1.75]">နေရာအနှံ့ ရှာဖွေပါ။ သေချာဖတ်ရှုပါ။ ထင်မြင်ချက်များထက် လက်ဆုပ်လက်ကိုင် အထောက်အထားများကိုသာ ယုံကြည်ပါ။</p>
                </div>
                <button
                  onClick={() => setActiveModal('none')}
                  className="px-5 py-2 bg-[#0b140f] hover:bg-[#101c15] text-[#b1d4c2] hover:text-[#e0f0e7] font-bold rounded-none text-xs transition-colors shrink-0 cursor-pointer"
                >
                  Return to Menu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: Settings */}
      <AnimatePresence>
        {activeModal === 'settings' && (
          <motion.div
            id="modal-settings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-[#080d0a]/98 rounded-none max-w-xl w-full p-6 sm:p-8 text-stone-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <SettingsIcon className="w-5 h-5 text-amber-400" />
                  <h2 className="text-2xl font-bold font-bebas tracking-wide text-amber-200">Atmospheric Settings</h2>
                </div>
                <button
                  onClick={() => setActiveModal('none')}
                  className="p-1.5 rounded-none hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Setting controls */}
              <div className="space-y-4 text-xs">
                {/* Audio Master Toggle */}
                <div className="flex items-center justify-between p-3 bg-stone-950/80 rounded-none">
                  <div>
                    <span className="font-semibold text-stone-200 block">Procedural Audio Engine</span>
                    <span className="text-stone-400 text-[11px]">1998 Drone Synthesizer &amp; Tactile Clinks</span>
                  </div>
                  <button
                    onClick={handleAudioToggle}
                    className={`px-3 py-1.5 rounded-none text-xs font-bold transition-colors cursor-pointer ${
                      !isMuted ? 'bg-amber-600 text-stone-950' : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {!isMuted ? 'ENABLED' : 'MUTED'}
                  </button>
                </div>

                {/* Color Grading Presets */}
                <div className="p-3 bg-stone-950/80 rounded-none">
                  <span className="font-semibold text-stone-200 block mb-2">Color Grading &amp; Humid Hue</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setColorGrade('monsoon_green')}
                      className={`p-2 rounded-none text-left text-[11px] transition-all cursor-pointer ${
                        colorGrade === 'monsoon_green'
                          ? 'bg-emerald-950/90 text-emerald-200 font-bold'
                          : 'bg-stone-900/60 hover:bg-stone-800 text-stone-400'
                      }`}
                    >
                      Sickly Monsoon Green (Default)
                    </button>
                    <button
                      onClick={() => setColorGrade('guttering_wax')}
                      className={`p-2 rounded-none text-left text-[11px] transition-all cursor-pointer ${
                        colorGrade === 'guttering_wax'
                          ? 'bg-amber-950/90 text-amber-200 font-bold'
                          : 'bg-stone-900/60 hover:bg-stone-800 text-stone-400'
                      }`}
                    >
                      Guttering Red Wax
                    </button>
                    <button
                      onClick={() => setColorGrade('archive_1998')}
                      className={`p-2 rounded-none text-left text-[11px] transition-all cursor-pointer ${
                        colorGrade === 'archive_1998'
                          ? 'bg-cyan-950/90 text-cyan-200 font-bold'
                          : 'bg-stone-900/60 hover:bg-stone-800 text-stone-400'
                      }`}
                    >
                      1998 Surveillance Tape
                    </button>
                  </div>
                </div>

                {/* Visual Overlays Toggles */}
                <div className="p-3 bg-stone-950/80 rounded-none space-y-2.5">
                  <span className="font-semibold text-stone-200 block mb-1">Atmospheric Shaders &amp; Overlays</span>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-300">Monsoon Rain Streaks</span>
                    <input
                      type="checkbox"
                      checked={rainEnabled}
                      onChange={(e) => setRainEnabled(e.target.checked)}
                      className="accent-amber-500 h-4 w-4 rounded-none cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-300">Aged Film Grain Noise</span>
                    <input
                      type="checkbox"
                      checked={grainEnabled}
                      onChange={(e) => setGrainEnabled(e.target.checked)}
                      className="accent-amber-500 h-4 w-4 rounded-none cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-300">CRT Scanlines</span>
                    <input
                      type="checkbox"
                      checked={scanlinesEnabled}
                      onChange={(e) => setScanlinesEnabled(e.target.checked)}
                      className="accent-amber-500 h-4 w-4 rounded-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6 pt-4 flex justify-end">
                <button
                  onClick={() => setActiveModal('none')}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-none text-xs transition-colors cursor-pointer"
                >
                  Save &amp; Apply
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: Exit Confirmation */}
      <AnimatePresence>
        {activeModal === 'exit' && (
          <motion.div
            id="modal-exit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-[#080d0a]/98 rounded-none max-w-md w-full p-6 text-stone-200 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-none bg-rose-950/80 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
              <h2 className="text-2xl font-bold font-bebas tracking-wide text-rose-200 mb-2">
                Sever Spirit Connection?
              </h2>
              <p className="text-xs text-stone-400 mb-6 leading-relaxed font-sans">
                Leaving now will dissolve your 2026 anchor link. Any unverified clues in the 1998 hostel labyrinth will be lost to the monsoon shadows.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setActiveModal('none')}
                  className="px-4 py-2 rounded-none bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Stay in 1998
                </button>
                <button
                  onClick={() => {
                    setActiveModal('none');
                    sound.playDramaticSting();
                  }}
                  className="px-4 py-2 rounded-none bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Sever Link &amp; Return
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
