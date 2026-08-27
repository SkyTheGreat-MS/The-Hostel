import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../audioEngine';
import { HostelRitualScene } from './HostelRitualScene';
import {
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  Settings as SettingsIcon,
  Play,
  RotateCcw,
  X,
  Layers,
  ChevronRight,
  Droplets,
  Radio,
  FileText,
  AlertTriangle,
  Flame,
  Clock,
  Shield,
  Eye,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';

export interface MainMenuProps {
  /** The main game title displayed at top-left */
  title?: string;
  /** Subtitle or archival case file code */
  subtitle?: string;
  /** Pluggable background image URL or preset key ('hallway' | 'seance' | 'chapter3' | custom url) */
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
  backgroundImage,
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
  const [activeModal, setActiveModal] = useState<'none' | 'help' | 'settings' | 'exit' | 'scene_picker'>('none');
  const [customBgUrl, setCustomBgUrl] = useState<string>(() => {
    return localStorage.getItem('sl_custom_bg') || '';
  });
  const [selectedScene, setSelectedScene] = useState<'circle_ritual' | 'hallway' | 'seance' | 'chapter3' | 'custom'>(() => {
    const saved = localStorage.getItem('sl_custom_bg');
    return saved ? 'custom' : 'circle_ritual';
  });
  const [rainEnabled, setRainEnabled] = useState<boolean>(showRain);
  const [grainEnabled, setGrainEnabled] = useState<boolean>(true);
  const [scanlinesEnabled, setScanlinesEnabled] = useState<boolean>(true);
  const [colorGrade, setColorGrade] = useState<'monsoon_green' | 'guttering_wax' | 'archive_1998'>('monsoon_green');

  // Menu items list
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

  // Background visual layer resolution
  const renderBackgroundArt = () => {
    // If a custom image prop is provided
    if (backgroundImage) {
      return (
        <img
          src={backgroundImage}
          alt="Hostel Atmosphere"
          className={`w-full h-full object-cover select-none pointer-events-none transition-all duration-700 ${getColorGradeClass()}`}
        />
      );
    }

    if (selectedScene === 'circle_ritual') {
      return <HostelRitualScene colorGradeClass={getColorGradeClass()} />;
    }

    if (selectedScene === 'custom' && customBgUrl) {
      return (
        <img
          src={customBgUrl}
          alt="Custom Atmosphere"
          className={`w-full h-full object-cover select-none pointer-events-none transition-all duration-700 ${getColorGradeClass()}`}
        />
      );
    }

    if (selectedScene === 'chapter3') {
      // Courtyard Dried Well Chapter 3 Title Card backdrop
      return (
        <div className={`w-full h-full bg-[#0a0d0a] relative overflow-hidden ${getColorGradeClass()}`}>
          {/* Stylized Dried Well & Banyan/Mango Tree Vector Art */}
          <svg className="w-full h-full absolute inset-0 opacity-80" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="chap3-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#040806" />
                <stop offset="60%" stopColor="#0a1a12" />
                <stop offset="100%" stopColor="#020503" />
              </linearGradient>
              <radialGradient id="moon-glow" cx="75%" cy="25%" r="40%">
                <stop offset="0%" stopColor="#a3cfa4" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="1920" height="1080" fill="url(#chap3-sky)" />
            <circle cx="1400" cy="250" r="300" fill="url(#moon-glow)" />

            {/* Distant Hostel Building Silhouette */}
            <path d="M 600,300 L 1200,280 L 1250,650 L 550,660 Z" fill="#030805" opacity="0.9" />
            {/* Windows glowing dimly */}
            <rect x="680" y="360" width="40" height="60" fill="#fef08a" opacity="0.15" />
            <rect x="760" y="360" width="40" height="60" fill="#fef08a" opacity="0.05" />
            <rect x="940" y="450" width="40" height="60" fill="#f43f5e" opacity="0.2" />

            {/* Ancient Courtyard Mango Tree */}
            <path
              d="M 1300,1080 C 1280,850 1200,680 1350,480 C 1450,350 1650,280 1850,320 L 1920,340 L 1920,1080 Z"
              fill="#020403"
            />
            <path
              d="M 1250,700 C 1100,650 980,580 920,480 C 950,560 1080,680 1220,740 Z"
              fill="#010302"
            />

            {/* The Sealed Dried Well (Mama May's Resting Site) */}
            <ellipse cx="980" cy="820" rx="260" ry="110" fill="#050a07" stroke="#1c2f22" strokeWidth="6" />
            <ellipse cx="980" cy="820" rx="210" ry="85" fill="#000000" />
            {/* Wooden Planks & Rusty Iron Seal Chains */}
            <rect x="800" y="805" width="360" height="18" fill="#1b281f" rx="3" transform="rotate(-6 980 820)" />
            <rect x="820" y="815" width="320" height="16" fill="#141f17" rx="3" transform="rotate(12 980 820)" />
            <circle cx="980" cy="820" r="28" fill="#b91c1c" opacity="0.6" />
          </svg>
        </div>
      );
    }

    if (selectedScene === 'seance') {
      // Dim Séance Room (Low Teak Table, Ouija-style Burmese alphabet board, Single Guttering Candle)
      return (
        <div className={`w-full h-full bg-[#080705] relative overflow-hidden ${getColorGradeClass()}`}>
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="candle-bloom" cx="42%" cy="58%" r="45%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.45" />
                <stop offset="25%" stopColor="#f97316" stopOpacity="0.25" />
                <stop offset="60%" stopColor="#7c2d12" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="table-wood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#291a10" />
                <stop offset="50%" stopColor="#190f09" />
                <stop offset="100%" stopColor="#0c0704" />
              </linearGradient>
              <linearGradient id="board-mat" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#451a03" />
                <stop offset="100%" stopColor="#1c0a00" />
              </linearGradient>
            </defs>

            {/* Séance Room Wall Shadows */}
            <rect width="1920" height="1080" fill="#0a0806" />

            {/* Candle Light Bloom */}
            <circle cx="800" cy="620" r="600" fill="url(#candle-bloom)" />

            {/* Low Teak Altar / Séance Table */}
            <polygon points="280,680 1640,680 1850,1080 70,1080" fill="url(#table-wood)" />
            {/* Table Edge Highlights */}
            <line x1="280" y1="680" x2="1640" y2="680" stroke="#78350f" strokeWidth="4" opacity="0.6" />

            {/* Warped Ouija-style Burmese Nat Board */}
            <polygon points="560,720 1360,720 1480,980 440,980" fill="url(#board-mat)" stroke="#78350f" strokeWidth="2" opacity="0.85" />

            {/* Nat Circle Symbols & Inscriptions */}
            <ellipse cx="960" cy="850" rx="280" ry="110" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="8 6" opacity="0.4" />
            <ellipse cx="960" cy="850" rx="180" ry="70" fill="none" stroke="#b45309" strokeWidth="1.5" opacity="0.5" />

            {/* Scattered Burmese Zodiac / Spirit Characters on Board */}
            <text x="740" y="820" fill="#d97706" fontSize="24" fontFamily="serif" opacity="0.5">က</text>
            <text x="820" y="800" fill="#d97706" fontSize="24" fontFamily="serif" opacity="0.5">ခ</text>
            <text x="900" y="790" fill="#d97706" fontSize="24" fontFamily="serif" opacity="0.5">ဂ</text>
            <text x="980" y="790" fill="#d97706" fontSize="24" fontFamily="serif" opacity="0.5">ဃ</text>
            <text x="1060" y="800" fill="#d97706" fontSize="24" fontFamily="serif" opacity="0.5">င</text>
            <text x="1140" y="820" fill="#d97706" fontSize="24" fontFamily="serif" opacity="0.5">စ</text>
            <text x="960" y="900" fill="#f43f5e" fontSize="28" fontWeight="bold" textAnchor="middle" opacity="0.6">
              မမမေ (1998)
            </text>

            {/* Broken Glass Shards (The Séance Glass) */}
            <polygon points="940,840 985,825 965,860" fill="#e2e8f0" opacity="0.7" stroke="#94a3b8" strokeWidth="1" />
            <polygon points="990,835 1025,845 1005,865" fill="#cbd5e1" opacity="0.55" stroke="#94a3b8" strokeWidth="1" />
            <polygon points="930,855 955,875 925,880" fill="#94a3b8" opacity="0.6" />

            {/* Single Guttering Candle on Brass Saucer */}
            <ellipse cx="800" cy="650" rx="35" ry="12" fill="#78350f" stroke="#d97706" strokeWidth="1.5" />
            <rect x="792" y="580" width="16" height="70" fill="#fef3c7" rx="2" />
            {/* Dripping wax */}
            <path d="M 792,600 C 788,610 788,625 792,630 Z" fill="#fef3c7" />
            <path d="M 808,615 C 812,625 812,635 808,640 Z" fill="#fef3c7" />
            {/* Wick & Flame */}
            <line x1="800" y1="580" x2="800" y2="568" stroke="#1f2937" strokeWidth="2" />
            <path d="M 800,535 C 788,555 792,570 800,570 C 808,570 812,555 800,535 Z" fill="#fbbf24" opacity="0.9" />
            <path d="M 800,545 C 794,555 796,568 800,568 C 804,568 806,555 800,545 Z" fill="#ef4444" opacity="0.85" />
            <circle cx="800" cy="560" r="4" fill="#ffffff" />
          </svg>
        </div>
      );
    }

    // Default: Burmese University "UIT Pathway 326" Corridor (Uploaded Art)
    return (
      <div className={`w-full h-full bg-[#050b09] relative overflow-hidden ${getColorGradeClass()}`}>
        <svg
          className="w-full h-full absolute inset-0"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="uit-floor-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0b1714" />
              <stop offset="45%" stopColor="#122521" />
              <stop offset="85%" stopColor="#0e1d1a" />
              <stop offset="100%" stopColor="#050a08" />
            </linearGradient>

            <linearGradient id="uit-left-wall" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#142c27" />
              <stop offset="60%" stopColor="#254a43" />
              <stop offset="100%" stopColor="#10211d" />
            </linearGradient>

            <linearGradient id="uit-right-wall" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#18322c" />
              <stop offset="50%" stopColor="#2b524a" />
              <stop offset="100%" stopColor="#10211d" />
            </linearGradient>

            <linearGradient id="uit-roof-vault" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#040907" />
              <stop offset="60%" stopColor="#0a1613" />
              <stop offset="100%" stopColor="#060d0b" />
            </linearGradient>

            <radialGradient id="uit-portal-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d1fae5" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#a7f3d0" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="uit-room-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fde68a" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.35" />
              <stop offset="80%" stopColor="#b45309" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="uit-floor-light-beam" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#059669" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Wire Mesh Pattern for Windows and Partitions */}
            <pattern id="uit-wire-mesh" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 0 0 L 8 8 M 8 0 L 0 8" stroke="#06120e" strokeWidth="0.75" />
            </pattern>

            {/* Halftone Comic Stipple Effect */}
            <pattern id="uit-halftone" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.4" fill="#000000" opacity="0.35" />
              <circle cx="9" cy="9" r="1.4" fill="#000000" opacity="0.35" />
            </pattern>

            {/* Exposed Red Brick Pattern */}
            <pattern id="uit-brickwork" width="24" height="14" patternUnits="userSpaceOnUse">
              <rect width="24" height="14" fill="#6c2e28" />
              <rect x="1" y="1" width="22" height="5.5" fill="#883b34" />
              <rect x="1" y="7.5" width="10" height="5.5" fill="#7a342e" />
              <rect x="12" y="7.5" width="11" height="5.5" fill="#883b34" />
            </pattern>
          </defs>

          {/* 1. Base Canvas */}
          <rect width="1920" height="1080" fill="#030706" />

          {/* 2. Vanishing Point Floor (Damp Concrete Pathway) */}
          <polygon points="0,1080 750,550 1170,550 1920,1080" fill="url(#uit-floor-grad)" />
          {/* Halftone Shading on floor */}
          <polygon points="0,1080 750,550 1170,550 1920,1080" fill="url(#uit-halftone)" opacity="0.6" />

          {/* Floor Wet Specular Reflections */}
          <polygon points="680,680 1240,680 1480,950 440,950" fill="url(#uit-floor-light-beam)" />
          <ellipse cx="960" cy="740" rx="260" ry="70" fill="#2dd4bf" opacity="0.12" />
          <ellipse cx="960" cy="880" rx="380" ry="90" fill="#14b8a6" opacity="0.08" />
          {/* Amber reflection from right lit room */}
          <ellipse cx="1220" cy="780" rx="140" ry="40" fill="#d97706" opacity="0.18" />

          {/* 3. Central Vanishing Point Outside Portal (Overgrown Bamboo / Jungle Path) */}
          <g id="uit-portal-exterior">
            {/* Door Frame */}
            <rect x="785" y="430" width="350" height="122" fill="#040b08" stroke="#1f3830" strokeWidth="4" />
            {/* Sky / Misty Exterior */}
            <rect x="790" y="435" width="340" height="112" fill="#86a397" />
            {/* Distant Forest Trees and Moonlight */}
            <path d="M 790,435 Q 860,490 920,440 Q 980,480 1040,435 Q 1100,470 1130,435 L 1130,547 L 790,547 Z" fill="#2d483e" />
            <path d="M 820,460 Q 880,510 940,470 Q 1000,500 1080,465 Q 1110,490 1130,480 L 1130,547 L 820,547 Z" fill="#1a332a" />
            {/* Outdoor Dirt Path into the Fog */}
            <polygon points="930,547 960,490 1000,547" fill="#b7c9bf" opacity="0.8" />
            <path d="M 945,547 Q 955,510 965,490 Q 975,510 985,547" stroke="#4b6358" strokeWidth="2" fill="none" />
            {/* Tree trunks silhouette */}
            <line x1="840" y1="440" x2="845" y2="547" stroke="#12241d" strokeWidth="4" />
            <line x1="875" y1="445" x2="870" y2="547" stroke="#0e1c17" strokeWidth="5" />
            <line x1="1050" y1="440" x2="1045" y2="547" stroke="#12241d" strokeWidth="4" />
            <line x1="1085" y1="445" x2="1090" y2="547" stroke="#0e1c17" strokeWidth="6" />
            {/* Overhanging Branches */}
            <path d="M 790,435 Q 880,460 920,445" stroke="#12241d" strokeWidth="3" fill="none" />
            <path d="M 1130,435 Q 1040,460 1000,440" stroke="#12241d" strokeWidth="3" fill="none" />
            {/* Atmospheric Portal Glow */}
            <circle cx="960" cy="490" r="160" fill="url(#uit-portal-glow)" />
          </g>

          {/* 4. Left Wall Bay Structure (1-Point Perspective) */}
          <polygon points="0,0 750,430 750,550 0,1080" fill="url(#uit-left-wall)" />
          <polygon points="0,0 750,430 750,550 0,1080" fill="url(#uit-halftone)" opacity="0.45" />

          {/* Left Wall Corridor Bays & Wire Mesh Partitions */}
          {/* Bay 1 (Foreground Left) */}
          <polygon points="40,320 220,350 220,950 40,1050" fill="#0c1a16" stroke="#060e0c" strokeWidth="3" />
          <polygon points="45,330 215,358 215,940 45,1035" fill="url(#uit-wire-mesh)" />
          <line x1="130" y1="335" x2="130" y2="990" stroke="#060e0c" strokeWidth="3" />

          {/* Bay 2 (Mid-Left) */}
          <polygon points="240,352 390,375 390,830 240,935" fill="#0d1c18" stroke="#060e0c" strokeWidth="3" />
          <polygon points="245,360 385,380 385,820 245,920" fill="url(#uit-wire-mesh)" />
          <line x1="315" y1="365" x2="315" y2="875" stroke="#060e0c" strokeWidth="2.5" />

          {/* Bay 3 (Mid-Deep Left) */}
          <polygon points="410,380 520,396 520,730 410,815" fill="#0c1a16" stroke="#060e0c" strokeWidth="2" />
          <polygon points="415,385 515,400 515,720 415,805" fill="url(#uit-wire-mesh)" />
          <line x1="465" y1="390" x2="465" y2="765" stroke="#060e0c" strokeWidth="2" />

          {/* Bay 4 (Deep Left) */}
          <polygon points="535,400 620,412 620,650 535,715" fill="#0e1d19" stroke="#060e0c" strokeWidth="2" />
          <polygon points="540,404 615,415 615,640 540,705" fill="url(#uit-wire-mesh)" />

          {/* Bay 5 (End Left) */}
          <polygon points="630,414 700,422 700,590 630,640" fill="#0c1a16" stroke="#060e0c" strokeWidth="1.5" />
          <polygon points="708,424 745,428 745,560 708,580" fill="#0d1b17" stroke="#060e0c" strokeWidth="1" />

          {/* Left Clerestory Transom Windows (Near Roofline) */}
          <polygon points="140,85 170,105 170,165 140,145" fill="#d1fae5" stroke="#060e0c" strokeWidth="2" opacity="0.65" />
          <polygon points="230,145 255,160 255,215 230,195" fill="#d1fae5" stroke="#060e0c" strokeWidth="2" opacity="0.65" />
          <polygon points="310,195 330,210 330,255 310,240" fill="#d1fae5" stroke="#060e0c" strokeWidth="1.5" opacity="0.65" />
          <polygon points="380,240 398,252 398,290 380,278" fill="#d1fae5" stroke="#060e0c" strokeWidth="1.5" opacity="0.6" />
          <polygon points="440,278 455,288 455,320 440,310" fill="#d1fae5" stroke="#060e0c" strokeWidth="1" opacity="0.55" />
          <polygon points="495,310 508,318 508,345 495,335" fill="#d1fae5" stroke="#060e0c" strokeWidth="1" opacity="0.5" />
          <polygon points="545,335 556,342 556,365 545,358" fill="#d1fae5" stroke="#060e0c" strokeWidth="1" opacity="0.45" />

          {/* Monsoon Water Streaks on Left Wall */}
          <path d="M 80,180 Q 75,360 90,520 Q 95,700 80,880" stroke="#081410" strokeWidth="20" opacity="0.6" fill="none" />
          <path d="M 270,220 Q 265,380 280,500 Q 285,620 270,740" stroke="#06100d" strokeWidth="14" opacity="0.5" fill="none" />
          <path d="M 480,310 Q 475,420 490,510" stroke="#07120e" strokeWidth="10" opacity="0.55" fill="none" />

          {/* 5. Right Wall Bay Structure (1-Point Perspective) */}
          <polygon points="1920,0 1170,430 1170,550 1920,1080" fill="url(#uit-right-wall)" />
          <polygon points="1920,0 1170,430 1170,550 1920,1080" fill="url(#uit-halftone)" opacity="0.45" />

          {/* Upper Right Wall: Peeling Plaster & Exposed Red Brick Patch */}
          <g id="uit-exposed-brickwork">
            {/* Irregular Plaster Hole Polygon */}
            <polygon
              points="1420,140 1520,120 1660,180 1650,320 1510,360 1440,310 1410,220"
              fill="url(#uit-brickwork)"
              stroke="#2e1411"
              strokeWidth="4"
            />
            {/* Ragged Torn Plaster Edges & Blood/Water Stain */}
            <path
              d="M 1410,220 Q 1420,140 1520,120 Q 1660,180 1650,320 Q 1510,360 1440,310 Z"
              stroke="#581c17"
              strokeWidth="6"
              fill="none"
              opacity="0.8"
            />
            <path d="M 1440,310 Q 1460,420 1430,520" stroke="#450a0a" strokeWidth="8" opacity="0.5" fill="none" />
          </g>

          {/* Right Wall Bays & Partitions */}
          {/* Bay 1 (Foreground Right) */}
          <polygon points="1880,320 1700,350 1700,950 1880,1050" fill="#0d1b17" stroke="#060e0c" strokeWidth="3" />
          <polygon points="1875,330 1705,358 1705,940 1875,1035" fill="url(#uit-wire-mesh)" />
          <line x1="1790" y1="335" x2="1790" y2="990" stroke="#060e0c" strokeWidth="3" />

          {/* Bay 2 (Mid-Right) */}
          <polygon points="1680,352 1530,375 1530,830 1680,935" fill="#0d1b17" stroke="#060e0c" strokeWidth="3" />
          <polygon points="1675,360 1535,380 1535,820 1675,920" fill="url(#uit-wire-mesh)" />
          <line x1="1605" y1="365" x2="1605" y2="875" stroke="#060e0c" strokeWidth="2.5" />

          {/* Bay 3 (Mid-Deep Right - Glowing Room Window!) */}
          <polygon points="1510,380 1400,396 1400,730 1510,815" fill="#131e1a" stroke="#060e0c" strokeWidth="2" />
          <polygon points="1505,385 1405,400 1405,720 1505,805" fill="url(#uit-wire-mesh)" />
          <line x1="1455" y1="390" x2="1455" y2="765" stroke="#060e0c" strokeWidth="2" />

          {/* Bay 4 (Glowing Room 326: Eerie Warm Amber Lamp Glowing inside!) */}
          <polygon points="1385,400 1300,412 1300,650 1385,715" fill="#451a03" stroke="#060e0c" strokeWidth="2" />
          {/* Lit Window Panes */}
          <polygon points="1380,404 1305,415 1305,640 1380,705" fill="#f59e0b" opacity="0.85" />
          <polygon points="1380,404 1305,415 1305,640 1380,705" fill="url(#uit-room-glow)" />
          {/* Room Window Muntins */}
          <line x1="1342" y1="410" x2="1342" y2="675" stroke="#78350f" strokeWidth="3" />
          <line x1="1305" y1="480" x2="1380" y2="470" stroke="#78350f" strokeWidth="2" />
          <line x1="1305" y1="560" x2="1380" y2="550" stroke="#78350f" strokeWidth="2" />

          {/* Bay 5 (Deep Right) */}
          <polygon points="1290,414 1220,422 1220,590 1290,640" fill="#0d1b17" stroke="#060e0c" strokeWidth="1.5" />
          <polygon points="1212,424 1175,428 1175,560 1212,580" fill="#0e1d19" stroke="#060e0c" strokeWidth="1" />

          {/* Right Clerestory Transom Windows (Near Roofline) */}
          <polygon points="1780,85 1750,105 1750,165 1780,145" fill="#fef3c7" stroke="#060e0c" strokeWidth="2" opacity="0.65" />
          <polygon points="1690,145 1665,160 1665,215 1690,195" fill="#fef3c7" stroke="#060e0c" strokeWidth="2" opacity="0.65" />
          <polygon points="1610,195 1590,210 1590,255 1610,240" fill="#fef3c7" stroke="#060e0c" strokeWidth="1.5" opacity="0.6" />
          <polygon points="1540,240 1522,252 1522,290 1540,278" fill="#fef3c7" stroke="#060e0c" strokeWidth="1.5" opacity="0.55" />
          <polygon points="1480,278 1465,288 1465,320 1480,310" fill="#fef3c7" stroke="#060e0c" strokeWidth="1" opacity="0.5" />
          <polygon points="1425,310 1412,318 1412,345 1425,335" fill="#fef3c7" stroke="#060e0c" strokeWidth="1" opacity="0.45" />
          <polygon points="1375,335 1364,342 1364,365 1375,358" fill="#fef3c7" stroke="#060e0c" strokeWidth="1" opacity="0.4" />

          {/* 6. Vaulted Timber Truss Roof Structure (Gable Roof Architecture) */}
          <polygon points="0,0 1920,0 1170,430 750,430" fill="url(#uit-roof-vault)" />
          <polygon points="0,0 1920,0 1170,430 750,430" fill="url(#uit-halftone)" opacity="0.5" />

          {/* Central Ridge Beam */}
          <line x1="960" y1="0" x2="960" y2="430" stroke="#020504" strokeWidth="14" />

          {/* Triangular Timber Truss Web Structure */}
          {/* Truss 1 (Foreground) */}
          <g stroke="#040806" strokeWidth="8" fill="none">
            <line x1="100" y1="20" x2="960" y2="0" />
            <line x1="1820" y1="20" x2="960" y2="0" />
            <line x1="100" y1="20" x2="1820" y2="20" strokeWidth="10" />
            <line x1="960" y1="0" x2="960" y2="20" strokeWidth="10" />
            <line x1="530" y1="10" x2="530" y2="20" />
            <line x1="1390" y1="10" x2="1390" y2="20" />
          </g>

          {/* Truss 2 (Mid-Fore) */}
          <g stroke="#060d0a" strokeWidth="6" fill="none">
            <line x1="260" y1="110" x2="960" y2="60" />
            <line x1="1660" y1="110" x2="960" y2="60" />
            <line x1="260" y1="110" x2="1660" y2="110" strokeWidth="7" />
            <line x1="960" y1="60" x2="960" y2="110" />
            <line x1="610" y1="85" x2="610" y2="110" />
            <line x1="1310" y1="85" x2="1310" y2="110" />
            <line x1="260" y1="110" x2="610" y2="85" />
            <line x1="1660" y1="110" x2="1310" y2="85" />
          </g>

          {/* Truss 3 (Mid) */}
          <g stroke="#07100d" strokeWidth="5" fill="none">
            <line x1="420" y1="200" x2="960" y2="150" />
            <line x1="1500" y1="200" x2="960" y2="150" />
            <line x1="420" y1="200" x2="1500" y2="200" strokeWidth="6" />
            <line x1="960" y1="150" x2="960" y2="200" />
            <line x1="690" y1="175" x2="690" y2="200" />
            <line x1="1230" y1="175" x2="1230" y2="200" />
          </g>

          {/* Truss 4 (Mid-Deep) */}
          <g stroke="#091410" strokeWidth="4" fill="none">
            <line x1="560" y1="280" x2="960" y2="240" />
            <line x1="1360" y1="280" x2="960" y2="240" />
            <line x1="560" y1="280" x2="1360" y2="280" strokeWidth="5" />
            <line x1="960" y1="240" x2="960" y2="280" />
            <line x1="760" y1="260" x2="760" y2="280" />
            <line x1="1160" y1="260" x2="1160" y2="280" />
          </g>

          {/* Truss 5 & 6 (Deep Rafters) */}
          <g stroke="#0a1813" strokeWidth="3" fill="none">
            <line x1="660" y1="350" x2="960" y2="320" />
            <line x1="1260" y1="350" x2="960" y2="320" />
            <line x1="660" y1="350" x2="1260" y2="350" strokeWidth="4" />
            <line x1="960" y1="320" x2="960" y2="350" />

            <line x1="730" y1="400" x2="960" y2="380" />
            <line x1="1190" y1="400" x2="960" y2="380" />
            <line x1="730" y1="400" x2="1190" y2="400" strokeWidth="3" />
            <line x1="960" y1="380" x2="960" y2="400" />
          </g>

          {/* Hanging Electrical Cables Swooping Across Ceiling */}
          <path d="M 120,40 Q 600,280 960,180 Q 1400,60 1840,160" stroke="#020403" strokeWidth="3.5" fill="none" />
          <path d="M 280,120 Q 700,340 1020,240 Q 1300,160 1680,240" stroke="#020403" strokeWidth="2.5" fill="none" />
          <path d="M 460,210 Q 820,380 960,330 Q 1180,260 1480,310" stroke="#020403" strokeWidth="2" fill="none" />
          <line x1="960" y1="180" x2="960" y2="220" stroke="#020403" strokeWidth="2" />
          <circle cx="960" cy="223" r="4" fill="#020403" />

          {/* 7. Tangled Weeds & Overgrown Grass (Bottom Corners & Base of Walls) */}
          {/* Bottom Left Corner Weeds */}
          <g fill="#142c23" stroke="#060e0a" strokeWidth="2">
            <path d="M 0,1080 Q 80,920 120,820 Q 90,950 40,1080 Z" />
            <path d="M 40,1080 Q 140,860 180,780 Q 120,930 70,1080 Z" />
            <path d="M 90,1080 Q 200,900 240,840 Q 180,970 120,1080 Z" />
            <path d="M 0,1000 Q 110,880 160,830 Q 100,940 0,1040 Z" />
            <path d="M 130,1080 Q 240,940 300,890 Q 230,1000 170,1080 Z" />
            <path d="M 220,1080 Q 320,980 380,940 Q 300,1030 250,1080 Z" />
            {/* Fine Grass Blades */}
            <path d="M 60,1080 C 120,960 90,870 150,760" stroke="#1c3b2f" strokeWidth="3" fill="none" />
            <path d="M 110,1080 C 180,940 160,840 210,750" stroke="#1c3b2f" strokeWidth="3" fill="none" />
            <path d="M 180,1080 C 260,980 230,890 280,820" stroke="#1c3b2f" strokeWidth="2.5" fill="none" />
          </g>

          {/* Mid-Ground Left Weeds (Base of Bay 4/5) */}
          <g fill="#142921" stroke="#060e0a" strokeWidth="1.5">
            <path d="M 640,650 Q 690,560 720,510 Q 680,590 650,650 Z" />
            <path d="M 660,650 Q 730,570 760,530 Q 710,600 680,650 Z" />
            <path d="M 630,650 Q 680,580 700,540 Q 660,610 640,650 Z" />
          </g>

          {/* Bottom Right Corner Weeds & Brambles (Thick Overgrowth from Image) */}
          <g fill="#162e25" stroke="#060e0a" strokeWidth="2">
            <path d="M 1920,1080 Q 1840,900 1790,800 Q 1820,940 1880,1080 Z" />
            <path d="M 1870,1080 Q 1770,840 1710,740 Q 1780,920 1830,1080 Z" />
            <path d="M 1820,1080 Q 1710,880 1650,810 Q 1720,960 1770,1080 Z" />
            <path d="M 1920,980 Q 1800,860 1730,790 Q 1820,930 1920,1020 Z" />
            <path d="M 1760,1080 Q 1660,930 1580,870 Q 1670,990 1720,1080 Z" />
            <path d="M 1680,1080 Q 1580,970 1520,920 Q 1610,1020 1650,1080 Z" />
            {/* Spiky thorny branches */}
            <path d="M 1860,1080 C 1780,940 1810,850 1740,730" stroke="#1f4235" strokeWidth="3" fill="none" />
            <path d="M 1790,1080 C 1710,920 1730,820 1660,710" stroke="#1f4235" strokeWidth="3.5" fill="none" />
            <path d="M 1720,1080 C 1630,950 1660,860 1590,780" stroke="#1f4235" strokeWidth="2.5" fill="none" />
            <path d="M 1640,1080 C 1560,980 1580,910 1520,840" stroke="#1f4235" strokeWidth="2.5" fill="none" />
            {/* Discarded matchbox / cassette tape on the ground */}
            <rect x="1590" y="890" width="48" height="24" rx="2" fill="#334155" stroke="#0f172a" strokeWidth="2" transform="rotate(8 1590 890)" />
            <circle cx="1605" cy="902" r="4" fill="#0f172a" />
            <circle cx="1625" cy="905" r="4" fill="#0f172a" />
          </g>

          {/* Mid-Ground Right Weeds (Base of Bay 4/5) */}
          <g fill="#142921" stroke="#060e0a" strokeWidth="1.5">
            <path d="M 1280,650 Q 1230,560 1200,510 Q 1240,590 1270,650 Z" />
            <path d="M 1260,650 Q 1190,570 1160,530 Q 1210,600 1240,650 Z" />
            <path d="M 1290,650 Q 1240,580 1220,540 Q 1260,610 1280,650 Z" />
          </g>

          {/* 8. Swirling Floor Fog / Mist Drifting Down the Hallway */}
          <ellipse cx="960" cy="620" rx="340" ry="40" fill="#a7f3d0" opacity="0.08" />
          <ellipse cx="960" cy="740" rx="460" ry="60" fill="#6ee7b7" opacity="0.07" />
          <ellipse cx="880" cy="880" rx="520" ry="80" fill="#a7f3d0" opacity="0.09" />
          <ellipse cx="1060" cy="980" rx="600" ry="100" fill="#34d399" opacity="0.06" />
        </svg>
      </div>
    );
  };

  return (
    <div
      id="horror-main-menu-root"
      className="relative w-full h-screen min-h-[640px] bg-black text-[#E5E5E5] overflow-hidden select-none font-sans flex flex-col justify-between"
    >
      {/* 1. Base Layer: Pluggable Background Image Container with Sickly Color Grading */}
      <div id="menu-background-container" className="absolute inset-0 z-0">
        {renderBackgroundArt()}
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
          {/* Top-Right Ambient & Scene Tools */}
          <div className="ml-auto flex items-center gap-3 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded border border-stone-800/80 shadow-lg">
            <button
              id="menu-btn-quick-scene"
              onClick={() => setActiveModal('scene_picker')}
              className="text-[11px] font-mono text-stone-400 hover:text-amber-300 transition-colors flex items-center gap-1.5"
              title="Switch Background Scene Preset"
            >
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Scene:</span>
              <span className="text-stone-200 uppercase font-semibold">
                {selectedScene === 'circle_ritual'
                  ? 'Séance Circle (Art)'
                  : selectedScene === 'hallway'
                  ? 'UIT Pathway 326'
                  : selectedScene === 'seance'
                  ? 'Séance Table'
                  : selectedScene === 'chapter3'
                  ? 'Chapter 3 Well'
                  : 'Custom JPG'}
              </span>
            </button>

            <span className="w-px h-3.5 bg-stone-700" />

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
              <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-mono tracking-widest bg-rose-950/80 border border-rose-800/80 text-rose-300 font-bold uppercase rounded shadow-sm">
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
              <span className="text-xs text-amber-500/70 font-sans hidden md:inline">
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
              className="bg-stone-900 border border-stone-700 rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-stone-200 relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <div>
                    <h2 className="text-2xl font-bold font-bebas tracking-wide text-amber-200">
                      Investigative Field Guide & Spirit Rules
                    </h2>
                    <p className="text-xs text-stone-400 font-mono">
                      Hostel 1998 • Nat-Calling Séance Manual
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal('none')}
                  className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Guide Contents */}
              <div className="space-y-4 text-xs leading-relaxed max-h-[60vh] overflow-y-auto pr-2 text-stone-300">
                <div className="p-3 bg-stone-950/80 rounded-lg border border-amber-900/40">
                  <h3 className="font-bold text-amber-300 text-sm mb-1 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400" />
                    1. The Premise: Echoes of August 1998
                  </h3>
                  <p className="text-stone-300">
                    Six college friends performed a Burmese nat-calling ritual that went wrong.
                    When the séance glass shattered, you fell into a 1998 spectral memory of the hostel.
                    Your five friends in 2026 are desperately attempting to wake you up before your 20-turn anchor dissolves forever.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-stone-950/80 rounded-lg border border-rose-900/40">
                    <h4 className="font-bold text-rose-300 mb-1 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-rose-400" />
                      Mama May (Victim Spirit)
                    </h4>
                    <p className="text-stone-400 text-[11px]">
                      <strong>CANNOT lie</strong>, but never speaks plain facts. Every utterance is a symbolic riddle.
                      Misinterpreting her utterances elevates her <em>Grief</em> (+15%), accelerating poltergeist destabilization.
                    </p>
                  </div>

                  <div className="p-3 bg-stone-950/80 rounded-lg border border-amber-900/40">
                    <h4 className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      Guardian Nat (Hostel Spirit)
                    </h4>
                    <p className="text-stone-400 text-[11px]">
                      Presents statements in <strong>paired half-truths</strong>. Exactly ONE statement in each pair is true;
                      the other is a deliberate deception. Choosing false statements inflicts Betrayal Composure damage.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-stone-950/80 rounded-lg border border-sky-900/40">
                  <h4 className="font-bold text-sky-300 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    Turn & Composure Engine
                  </h4>
                  <p className="text-stone-400 text-[11px]">
                    Exploration costs 1–2 turns per room. Communing with spirits costs 1 turn.
                    Maintain player composure (100% → 0%) through disciplined deduction to avoid ending in psychosis or permanent entrapment.
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6 pt-4 border-t border-stone-800 flex justify-end">
                <button
                  onClick={() => setActiveModal('none')}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs transition-colors"
                >
                  Return to Menu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: Settings & Visual Atmosphere */}
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
              className="bg-stone-900 border border-stone-700 rounded-xl max-w-xl w-full p-6 sm:p-8 shadow-2xl text-stone-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <SettingsIcon className="w-5 h-5 text-amber-400" />
                  <h2 className="text-2xl font-bold font-bebas tracking-wide text-amber-200">Atmospheric Settings</h2>
                </div>
                <button
                  onClick={() => setActiveModal('none')}
                  className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Setting controls */}
              <div className="space-y-4 text-xs">
                {/* Audio Master Toggle */}
                <div className="flex items-center justify-between p-3 bg-stone-950/80 rounded-lg border border-stone-800">
                  <div>
                    <span className="font-semibold text-stone-200 block">Procedural Audio Engine</span>
                    <span className="text-stone-400 text-[11px]">1998 Drone Synthesizer & Tactile Clinks</span>
                  </div>
                  <button
                    onClick={handleAudioToggle}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                      !isMuted ? 'bg-amber-600 text-stone-950' : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {!isMuted ? 'ENABLED' : 'MUTED'}
                  </button>
                </div>

                {/* Color Grading Presets */}
                <div className="p-3 bg-stone-950/80 rounded-lg border border-stone-800">
                  <span className="font-semibold text-stone-200 block mb-2">Color Grading & Humid Hue</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setColorGrade('monsoon_green')}
                      className={`p-2 rounded text-left border text-[11px] transition-all ${
                        colorGrade === 'monsoon_green'
                          ? 'border-emerald-500 bg-emerald-950/50 text-emerald-200 font-bold'
                          : 'border-stone-800 hover:border-stone-700 text-stone-400'
                      }`}
                    >
                      Sickly Monsoon Green (Default)
                    </button>
                    <button
                      onClick={() => setColorGrade('guttering_wax')}
                      className={`p-2 rounded text-left border text-[11px] transition-all ${
                        colorGrade === 'guttering_wax'
                          ? 'border-amber-500 bg-amber-950/50 text-amber-200 font-bold'
                          : 'border-stone-800 hover:border-stone-700 text-stone-400'
                      }`}
                    >
                      Guttering Red Wax
                    </button>
                    <button
                      onClick={() => setColorGrade('archive_1998')}
                      className={`p-2 rounded text-left border text-[11px] transition-all ${
                        colorGrade === 'archive_1998'
                          ? 'border-cyan-500 bg-cyan-950/50 text-cyan-200 font-bold'
                          : 'border-stone-800 hover:border-stone-700 text-stone-400'
                      }`}
                    >
                      1998 Surveillance Tape
                    </button>
                  </div>
                </div>

                {/* Visual Overlays Toggles */}
                <div className="p-3 bg-stone-950/80 rounded-lg border border-stone-800 space-y-2.5">
                  <span className="font-semibold text-stone-200 block mb-1">Atmospheric Shaders & Overlays</span>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-300">Monsoon Rain Streaks</span>
                    <input
                      type="checkbox"
                      checked={rainEnabled}
                      onChange={(e) => setRainEnabled(e.target.checked)}
                      className="accent-amber-500 h-4 w-4 rounded cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-300">Aged Film Grain Noise</span>
                    <input
                      type="checkbox"
                      checked={grainEnabled}
                      onChange={(e) => setGrainEnabled(e.target.checked)}
                      className="accent-amber-500 h-4 w-4 rounded cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-300">CRT Scanlines</span>
                    <input
                      type="checkbox"
                      checked={scanlinesEnabled}
                      onChange={(e) => setScanlinesEnabled(e.target.checked)}
                      className="accent-amber-500 h-4 w-4 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6 pt-4 border-t border-stone-800 flex justify-end">
                <button
                  onClick={() => setActiveModal('none')}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs transition-colors"
                >
                  Save & Apply
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: Scene & Background Switcher (Demonstrating Modular Props) */}
      <AnimatePresence>
        {activeModal === 'scene_picker' && (
          <motion.div
            id="modal-scene-picker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-stone-900 border border-stone-700 rounded-xl max-w-xl w-full p-6 sm:p-8 shadow-2xl text-stone-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-5 h-5 text-amber-400" />
                  <div>
                    <h2 className="text-2xl font-bold font-bebas tracking-wide text-amber-200">Pluggable Scene Backgrounds</h2>
                    <p className="text-xs text-stone-400 font-mono">
                      Switch backdrop scenes to test modularity
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal('none')}
                  className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scene presets */}
              <div className="space-y-3 text-xs mb-4">
                <button
                  onClick={() => {
                    setSelectedScene('circle_ritual');
                    setActiveModal('none');
                    sound.playChime(true);
                  }}
                  className={`w-full p-3 rounded-lg border text-left flex items-start justify-between transition-all ${
                    selectedScene === 'circle_ritual'
                      ? 'border-amber-500 bg-amber-950/40 text-amber-200'
                      : 'border-stone-800 bg-stone-950/60 hover:border-stone-700 text-stone-300'
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm block">1. 1998 Abandoned Hostel Séance Circle (Uploaded Art)</span>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      6 Burmese students joined in a circle, hands touching, glowing purple occult runes &amp; talismanic energy.
                    </p>
                  </div>
                  {selectedScene === 'circle_ritual' && <span className="text-amber-400 font-bold">Active</span>}
                </button>

                <button
                  onClick={() => {
                    setSelectedScene('hallway');
                    setActiveModal('none');
                    sound.playChime(true);
                  }}
                  className={`w-full p-3 rounded-lg border text-left flex items-start justify-between transition-all ${
                    selectedScene === 'hallway'
                      ? 'border-amber-500 bg-amber-950/40 text-amber-200'
                      : 'border-stone-800 bg-stone-950/60 hover:border-stone-700 text-stone-300'
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm block">2. UIT Pathway 326</span>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Symmetrical timber truss roof, clerestory windows, exposed brick, Room 326 warm lamp, weeds, jungle portal.
                    </p>
                  </div>
                  {selectedScene === 'hallway' && <span className="text-amber-400 font-bold">Active</span>}
                </button>

                <button
                  onClick={() => {
                    setSelectedScene('seance');
                    setActiveModal('none');
                    sound.playChime(true);
                  }}
                  className={`w-full p-3 rounded-lg border text-left flex items-start justify-between transition-all ${
                    selectedScene === 'seance'
                      ? 'border-amber-500 bg-amber-950/40 text-amber-200'
                      : 'border-stone-800 bg-stone-950/60 hover:border-stone-700 text-stone-300'
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm block">3. Dim Séance Room (Table &amp; Ouija Board)</span>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Low teak altar table, warped Burmese alphabet board, shattered glass shards, single guttering candle.
                    </p>
                  </div>
                  {selectedScene === 'seance' && <span className="text-amber-400 font-bold">Active</span>}
                </button>

                <button
                  onClick={() => {
                    setSelectedScene('chapter3');
                    setActiveModal('none');
                    sound.playChime(true);
                  }}
                  className={`w-full p-3 rounded-lg border text-left flex items-start justify-between transition-all ${
                    selectedScene === 'chapter3'
                      ? 'border-amber-500 bg-amber-950/40 text-amber-200'
                      : 'border-stone-800 bg-stone-950/60 hover:border-stone-700 text-stone-300'
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm block">4. Chapter 3 Title Card ("The Sealed Dried Well")</span>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Courtyard Nat Shrine, moonlight over old mango tree, iron-sealed well.
                    </p>
                  </div>
                  {selectedScene === 'chapter3' && <span className="text-amber-400 font-bold">Active</span>}
                </button>

                {/* Custom Image Upload & URL Option */}
                <div className="p-3 bg-stone-950/60 rounded-lg border border-stone-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-200 block text-xs">5. Custom JPG / Image File</span>
                    {selectedScene === 'custom' && customBgUrl && (
                      <span className="text-amber-400 font-bold text-xs">Active Custom JPG</span>
                    )}
                  </div>

                  {/* Direct File Picker (JPG/PNG/WebP) */}
                  <div className="flex items-center gap-2">
                    <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-amber-900/40 hover:bg-amber-800/50 border border-amber-600/60 text-amber-200 rounded text-xs font-semibold cursor-pointer transition-all">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>Upload Local JPG / Image File</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const result = event.target?.result as string;
                              if (result) {
                                setCustomBgUrl(result);
                                setSelectedScene('custom');
                                try {
                                  localStorage.setItem('sl_custom_bg', result);
                                } catch {
                                  // In case localStorage quota exceeded
                                }
                                setActiveModal('none');
                                sound.playChime(true);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    {customBgUrl && (
                      <button
                        onClick={() => {
                          setCustomBgUrl('');
                          localStorage.removeItem('sl_custom_bg');
                          setSelectedScene('circle_ritual');
                          sound.playMenuSelect();
                        }}
                        className="px-2.5 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-400 hover:text-stone-200 rounded text-xs transition-colors"
                        title="Clear custom image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* URL Input Alternative */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Or paste JPG image URL..."
                      value={customBgUrl.startsWith('data:') ? '(Local file loaded)' : customBgUrl}
                      onChange={(e) => setCustomBgUrl(e.target.value)}
                      className="flex-1 bg-stone-900 border border-stone-700 rounded px-2.5 py-1.5 text-xs text-stone-200 outline-none font-mono"
                    />
                    <button
                      onClick={() => {
                        if (customBgUrl && !customBgUrl.startsWith('data:')) {
                          setSelectedScene('custom');
                          localStorage.setItem('sl_custom_bg', customBgUrl);
                          setActiveModal('none');
                          sound.playChime(true);
                        }
                      }}
                      className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded text-xs transition-colors"
                    >
                      Load
                    </button>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-2 border-t border-stone-800 flex justify-end">
                <button
                  onClick={() => setActiveModal('none')}
                  className="px-5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold rounded-lg text-xs transition-colors"
                >
                  Cancel
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
              className="bg-stone-900 border border-rose-900/60 rounded-xl max-w-md w-full p-6 shadow-2xl text-stone-200 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-rose-950/80 border border-rose-800 flex items-center justify-center">
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
                  className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors"
                >
                  Stay in 1998
                </button>
                <button
                  onClick={() => {
                    setActiveModal('none');
                    sound.playDramaticSting();
                  }}
                  className="px-4 py-2 rounded-lg bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold transition-colors"
                >
                  Sever Link & Return
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
