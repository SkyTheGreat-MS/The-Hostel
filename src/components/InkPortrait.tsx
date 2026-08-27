import React from 'react';
import { MCId } from '../types';

interface InkPortraitProps {
  characterId?: MCId | 'mama_may' | 'guardian_nat' | 'narrator' | string;
  speakerName?: string;
  isSpeaking?: boolean;
  position?: 'left' | 'right' | 'center';
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

export const InkPortrait: React.FC<InkPortraitProps> = ({
  characterId = 'moe_stheinkha',
  speakerName,
  isSpeaking = false,
  position = 'left',
  size = 'lg',
  className = '',
}) => {
  // Normalize IDs
  let normalizedId = characterId.toLowerCase();
  if (normalizedId.includes('moe') || normalizedId.includes('thazin')) normalizedId = 'moe_stheinkha';
  else if (normalizedId.includes('ye') || normalizedId.includes('kyaw')) normalizedId = 'ye_yint_hein';
  else if (normalizedId.includes('may') || normalizedId.includes('su_su')) normalizedId = 'may_jewel';
  else if (normalizedId.includes('yin') || normalizedId.includes('htet')) normalizedId = 'yin_min_htike';
  else if (normalizedId.includes('hsu') || normalizedId.includes('aye')) normalizedId = 'hsu_myat_shein';
  else if (normalizedId.includes('mona') || normalizedId.includes('min_khant')) normalizedId = 'mona';
  else if (normalizedId.includes('mama')) normalizedId = 'mama_may';
  else if (normalizedId.includes('nat') || normalizedId.includes('guardian')) normalizedId = 'guardian_nat';

  // Sizing definitions
  const sizeClasses = {
    sm: 'w-24 h-28',
    md: 'w-40 h-48',
    lg: 'w-56 h-72 md:w-64 md:h-84',
    full: 'w-full h-full min-h-[260px]',
  }[size];

  // Specific visual traits for each character archetype (Burmese graphic novel style)
  const getPortraitContent = () => {
    switch (normalizedId) {
      case 'moe_stheinkha':
        // Skeptic / Leader - Sharp defined eyes, calm focused gaze, neat parted hair, dark collared shirt
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full">
            <defs>
              <radialGradient id="inkWashMoe" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#e5dfd3" />
                <stop offset="60%" stopColor="#9c9082" />
                <stop offset="100%" stopColor="#4a423b" />
              </radialGradient>
            </defs>
            <rect width="200" height="240" fill="url(#inkWashMoe)" opacity="0.35" />
            {/* Ink Wash Shading */}
            <path d="M40 240 C 45 180, 60 160, 80 150 C 90 145, 110 145, 120 150 C 140 160, 155 180, 160 240 Z" fill="#2d2824" opacity="0.85" />
            {/* Neck & Face */}
            <path d="M85 130 L 85 165 C 95 170, 105 170, 115 165 L 115 130 Z" fill="#d9cfc1" stroke="#1f1b18" strokeWidth="2.5" />
            <path d="M70 85 C 65 125, 80 145, 100 145 C 120 145, 135 125, 130 85 C 128 55, 72 55, 70 85 Z" fill="#eedfc8" stroke="#1f1b18" strokeWidth="2.5" />
            {/* Hair - Sharp ink strokes */}
            <path d="M60 75 C 60 40, 85 30, 100 30 C 125 30, 142 42, 142 75 C 138 60, 120 48, 100 48 C 80 48, 65 60, 60 75 Z" fill="#14110f" />
            <path d="M60 75 C 55 90, 65 105, 68 105 C 70 85, 75 65, 85 55" stroke="#14110f" strokeWidth="3" fill="none" />
            <path d="M142 75 C 146 90, 135 105, 132 105 C 130 85, 125 65, 115 55" stroke="#14110f" strokeWidth="3" fill="none" />
            {/* Eyes - Rational, steady */}
            <path d="M78 92 C 84 89, 90 90, 93 93" stroke="#14110f" strokeWidth="2.5" fill="none" />
            <circle cx="85" cy="95" r="2.5" fill="#14110f" />
            <path d="M107 93 C 110 90, 116 89, 122 92" stroke="#14110f" strokeWidth="2.5" fill="none" />
            <circle cx="115" cy="95" r="2.5" fill="#14110f" />
            {/* Eyebrows */}
            <path d="M75 84 Q 85 82 94 86" stroke="#14110f" strokeWidth="2" />
            <path d="M106 86 Q 115 82 125 84" stroke="#14110f" strokeWidth="2" />
            {/* Nose & Mouth */}
            <path d="M100 95 L 98 112 L 104 113" stroke="#14110f" strokeWidth="2" fill="none" />
            <path d="M90 125 Q 100 128 110 125" stroke="#14110f" strokeWidth="2.5" fill="none" />
            {/* Collar & Tie/Lapel */}
            <path d="M85 160 L 100 185 L 115 160" stroke="#14110f" strokeWidth="2" fill="none" />
          </svg>
        );

      case 'ye_yint_hein':
        // Daredevil / Provocateur - Casual smirk, undercut/messy 90s fringe, jacket collar
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full">
            <defs>
              <radialGradient id="inkWashYe" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#ded5c4" />
                <stop offset="60%" stopColor="#8a7e70" />
                <stop offset="100%" stopColor="#3d352c" />
              </radialGradient>
            </defs>
            <rect width="200" height="240" fill="url(#inkWashYe)" opacity="0.35" />
            {/* Shoulders - Denim / Leather jacket */}
            <path d="M35 240 C 40 175, 55 155, 75 145 C 88 140, 112 140, 125 145 C 145 155, 160 175, 165 240 Z" fill="#1e2229" opacity="0.9" />
            {/* Neck */}
            <path d="M85 125 L 85 160 C 95 165, 105 165, 115 160 L 115 125 Z" fill="#d4c7b4" stroke="#1f1b18" strokeWidth="2.5" />
            {/* Face shape */}
            <path d="M68 80 C 65 120, 80 142, 100 142 C 120 142, 135 120, 132 80 C 130 50, 70 50, 68 80 Z" fill="#e8d8be" stroke="#1f1b18" strokeWidth="2.5" />
            {/* Messy rebellious fringe */}
            <path d="M55 70 C 58 35, 88 25, 105 25 C 128 25, 148 38, 145 70 C 140 50, 120 40, 100 45 C 80 40, 65 52, 55 70 Z" fill="#111112" />
            <path d="M80 45 L 88 78 L 98 48 L 108 72 L 120 48" stroke="#111112" strokeWidth="3" fill="#111112" />
            {/* Smirk & eyes */}
            <path d="M78 88 C 84 86, 92 88, 94 91" stroke="#111112" strokeWidth="2.5" fill="none" />
            <circle cx="86" cy="92" r="2.5" fill="#111112" />
            <path d="M106 91 C 108 88, 116 86, 122 88" stroke="#111112" strokeWidth="2.5" fill="none" />
            <circle cx="114" cy="92" r="2.5" fill="#111112" />
            <path d="M98 94 L 96 110 L 102 111" stroke="#111112" strokeWidth="2" fill="none" />
            {/* Smirking mouth */}
            <path d="M90 124 Q 102 122 114 120" stroke="#111112" strokeWidth="3" fill="none" />
          </svg>
        );

      case 'may_jewel':
        // Intuitive / Medium - Delicate hair with hairpin/orchid, wide perceptive eyes, traditional scarf
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full">
            <defs>
              <radialGradient id="inkWashMay" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#ede6db" />
                <stop offset="60%" stopColor="#aa9a8b" />
                <stop offset="100%" stopColor="#54483e" />
              </radialGradient>
            </defs>
            <rect width="200" height="240" fill="url(#inkWashMay)" opacity="0.35" />
            {/* Torso - Traditional blouse */}
            <path d="M45 240 C 50 180, 65 160, 80 150 C 90 145, 110 145, 120 150 C 135 160, 150 180, 155 240 Z" fill="#42222b" opacity="0.85" />
            {/* Face */}
            <path d="M72 85 C 70 125, 82 140, 100 140 C 118 140, 130 125, 128 85 C 125 55, 75 55, 72 85 Z" fill="#f4e7d5" stroke="#1f1b18" strokeWidth="2" />
            {/* Long flowing black hair */}
            <path d="M55 70 C 55 35, 80 25, 100 25 C 120 25, 145 35, 145 70 C 148 110, 145 180, 140 220 C 135 160, 135 110, 130 85 C 125 50, 75 50, 70 85 C 65 110, 65 160, 60 220 C 55 180, 52 110, 55 70 Z" fill="#140f12" />
            {/* White jasmine/orchid blossom hairpin */}
            <circle cx="138" cy="62" r="6" fill="#fdfbf7" stroke="#1f1b18" strokeWidth="1.5" />
            <circle cx="144" cy="66" r="4" fill="#fdfbf7" stroke="#1f1b18" strokeWidth="1.5" />
            {/* Wide, perceptive spiritual eyes */}
            <ellipse cx="86" cy="92" rx="6" ry="4" fill="#fdfbf7" stroke="#140f12" strokeWidth="2" />
            <circle cx="86" cy="92" r="3" fill="#140f12" />
            <ellipse cx="114" cy="92" rx="6" ry="4" fill="#fdfbf7" stroke="#140f12" strokeWidth="2" />
            <circle cx="114" cy="92" r="3" fill="#140f12" />
            {/* Soft lips */}
            <path d="M94 122 Q 100 125 106 122" stroke="#140f12" strokeWidth="2" fill="none" />
          </svg>
        );

      case 'yin_min_htike':
        // Archivist / Historian - Round spectacles, layered knit vest, inquisitive look
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full">
            <defs>
              <radialGradient id="inkWashYin" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#e3ded6" />
                <stop offset="60%" stopColor="#968e82" />
                <stop offset="100%" stopColor="#474037" />
              </radialGradient>
            </defs>
            <rect width="200" height="240" fill="url(#inkWashYin)" opacity="0.35" />
            <path d="M40 240 C 45 180, 60 160, 80 150 C 90 145, 110 145, 120 150 C 140 160, 155 180, 160 240 Z" fill="#303b38" opacity="0.85" />
            {/* Face */}
            <path d="M72 85 C 68 125, 80 142, 100 142 C 120 142, 132 125, 128 85 C 125 55, 75 55, 72 85 Z" fill="#eddccb" stroke="#1f1b18" strokeWidth="2.5" />
            {/* Hair - Side parted student look */}
            <path d="M62 75 C 62 42, 85 30, 100 30 C 122 30, 138 42, 138 75 C 132 58, 115 45, 95 45 C 75 45, 65 58, 62 75 Z" fill="#17191d" />
            {/* Round 90s Spectacles */}
            <circle cx="85" cy="94" r="10" fill="none" stroke="#17191d" strokeWidth="2.5" />
            <circle cx="115" cy="94" r="10" fill="none" stroke="#17191d" strokeWidth="2.5" />
            <path d="M95 94 L 105 94" stroke="#17191d" strokeWidth="2.5" />
            <circle cx="85" cy="94" r="2.5" fill="#17191d" />
            <circle cx="115" cy="94" r="2.5" fill="#17191d" />
            {/* Thoughtful expression */}
            <path d="M92 124 L 108 124" stroke="#17191d" strokeWidth="2.5" />
          </svg>
        );

      case 'hsu_myat_shein':
        // Kin-Bound / Empath - Burmese braided hair, traditional silk collar, empathetic sorrowful eyes
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full">
            <defs>
              <radialGradient id="inkWashHsu" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#ede1d8" />
                <stop offset="60%" stopColor="#a39084" />
                <stop offset="100%" stopColor="#4f3f35" />
              </radialGradient>
            </defs>
            <rect width="200" height="240" fill="url(#inkWashHsu)" opacity="0.35" />
            {/* Traditional Burmese Longyi/Blouse with neckline */}
            <path d="M45 240 C 50 180, 65 160, 80 150 C 90 145, 110 145, 120 150 C 135 160, 150 180, 155 240 Z" fill="#592b34" opacity="0.9" />
            <path d="M80 150 L 100 170 L 120 150" stroke="#f1d69d" strokeWidth="2" fill="none" />
            {/* Face */}
            <path d="M72 85 C 70 125, 82 142, 100 142 C 118 142, 130 125, 128 85 C 125 55, 75 55, 72 85 Z" fill="#f5e6d6" stroke="#1f1b18" strokeWidth="2" />
            {/* Elegant Braided crown & hair */}
            <path d="M58 75 C 58 35, 80 25, 100 25 C 120 25, 142 35, 142 75 C 145 110, 142 160, 138 200 C 132 150, 132 100, 128 80 C 122 50, 78 50, 72 80 C 68 100, 68 150, 62 200 C 58 160, 55 110, 58 75 Z" fill="#181315" />
            {/* Eyes - Deep emotional resonance */}
            <path d="M78 92 Q 86 88 94 92" stroke="#181315" strokeWidth="2.5" fill="none" />
            <circle cx="86" cy="93" r="2.5" fill="#181315" />
            <path d="M106 92 Q 114 88 122 92" stroke="#181315" strokeWidth="2.5" fill="none" />
            <circle cx="114" cy="93" r="2.5" fill="#181315" />
            <path d="M94 123 Q 100 126 106 123" stroke="#181315" strokeWidth="2" fill="none" />
          </svg>
        );

      case 'mona':
        // Protector - Athletic jacket, strong jaw, resolute protective stance
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full">
            <defs>
              <radialGradient id="inkWashMona" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#ded9d0" />
                <stop offset="60%" stopColor="#8d8479" />
                <stop offset="100%" stopColor="#3d3730" />
              </radialGradient>
            </defs>
            <rect width="200" height="240" fill="url(#inkWashMona)" opacity="0.35" />
            <path d="M32 240 C 38 175, 52 155, 75 145 C 88 140, 112 140, 125 145 C 148 155, 162 175, 168 240 Z" fill="#242830" opacity="0.9" />
            {/* Face */}
            <path d="M70 85 C 68 125, 80 144, 100 144 C 120 144, 132 125, 130 85 C 128 55, 72 55, 70 85 Z" fill="#ebd9c3" stroke="#1f1b18" strokeWidth="2.5" />
            {/* Ponytail & dynamic hair */}
            <path d="M60 70 C 60 35, 85 25, 100 25 C 120 25, 140 35, 140 70 C 135 55, 118 45, 100 45 C 82 45, 65 55, 60 70 Z" fill="#131416" />
            <path d="M135 60 C 155 70, 165 95, 160 120" stroke="#131416" strokeWidth="6" strokeLinecap="round" fill="none" />
            {/* Resolute eyes */}
            <path d="M78 92 L 94 92" stroke="#131416" strokeWidth="2.5" />
            <circle cx="86" cy="94" r="2.5" fill="#131416" />
            <path d="M106 92 L 122 92" stroke="#131416" strokeWidth="2.5" />
            <circle cx="114" cy="94" r="2.5" fill="#131416" />
            <path d="M92 124 L 108 124" stroke="#131416" strokeWidth="2.5" />
          </svg>
        );

      case 'mama_may':
        // 1998 Victim Spirit - Ethereal ink lines, weeping silhouette, glowing eyes
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full">
            <defs>
              <radialGradient id="spiritGlow" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#991b1b" stopOpacity="0.4" />
                <stop offset="60%" stopColor="#450a0a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#000000" />
              </radialGradient>
            </defs>
            <rect width="200" height="240" fill="url(#spiritGlow)" />
            {/* Spectral silhouette */}
            <path d="M45 240 C 40 180, 60 160, 80 150 C 90 145, 110 145, 120 150 C 140 160, 160 180, 155 240 Z" fill="#7f1d1d" opacity="0.6" />
            <path d="M72 85 C 70 125, 82 142, 100 142 C 118 142, 130 125, 128 85 C 125 55, 75 55, 72 85 Z" fill="#1c1917" stroke="#dc2626" strokeWidth="1.5" />
            {/* Long wild hair */}
            <path d="M50 70 C 45 35, 75 20, 100 20 C 125 20, 155 35, 150 70 C 160 120, 150 190, 135 230 C 130 160, 130 110, 125 80 C 120 50, 80 50, 75 80 C 70 110, 70 160, 65 230 C 50 190, 40 120, 50 70 Z" fill="#0c0a09" opacity="0.95" />
            {/* Glowing red spirit eyes */}
            <circle cx="86" cy="93" r="3.5" fill="#ef4444" />
            <circle cx="114" cy="93" r="3.5" fill="#ef4444" />
            {/* Blood tear streaks */}
            <path d="M86 96 L 85 120" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="2,2" />
            <path d="M114 96 L 115 120" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="2,2" />
          </svg>
        );

      case 'guardian_nat':
        // Guardian Nat Shrine Spirit - Golden and crimson divine visage
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full">
            <defs>
              <radialGradient id="natGlow" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#78350f" stopOpacity="0.5" />
                <stop offset="70%" stopColor="#451a03" />
                <stop offset="100%" stopColor="#180c05" />
              </radialGradient>
            </defs>
            <rect width="200" height="240" fill="url(#natGlow)" />
            {/* Traditional Headdress / Gaung Baung Crown */}
            <path d="M60 50 L 100 15 L 140 50 L 120 65 L 80 65 Z" fill="#b45309" stroke="#fef08a" strokeWidth="1.5" />
            {/* Face mask */}
            <path d="M70 80 C 68 120, 80 140, 100 140 C 120 140, 132 120, 130 80 C 128 50, 72 50, 70 80 Z" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
            <ellipse cx="85" cy="90" rx="6" ry="3" fill="#fef08a" stroke="#78350f" strokeWidth="1" />
            <ellipse cx="115" cy="90" rx="6" ry="3" fill="#fef08a" stroke="#78350f" strokeWidth="1" />
            <path d="M92 120 Q 100 126 108 120" stroke="#f59e0b" strokeWidth="2" fill="none" />
          </svg>
        );

      default:
        // Generic Silhouette for other speakers
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full">
            <rect width="200" height="240" fill="#292524" />
            <circle cx="100" cy="90" r="40" fill="#44403c" stroke="#1c1917" strokeWidth="2" />
            <path d="M40 240 C 45 170, 70 150, 100 150 C 130 150, 155 170, 160 240 Z" fill="#1c1917" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-end transition-all duration-300 ${sizeClasses} ${
        isSpeaking
          ? 'scale-105 brightness-110 drop-shadow-[0_0_15px_rgba(185,28,28,0.4)]'
          : 'opacity-85 brightness-90'
      } ${className}`}
    >
      {/* Graphic Novel Linework & Watercolor Filter Wrapper */}
      <div className="relative w-full h-full overflow-hidden rounded-t-xl border border-red-950/60 bg-gradient-to-t from-red-950/80 via-neutral-900/60 to-transparent">
        {/* Retro 90s Halftone / Grain Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#b91c1c_0.75px,transparent_0.75px)] [background-size:6px_6px] opacity-20 pointer-events-none mix-blend-overlay" />

        {/* Ink Linework SVG with Burmese Graphic Novel Wash Filter */}
        <div className="w-full h-full filter grayscale contrast-125 sepia-[.45] mix-blend-multiply transition-transform duration-300">
          {getPortraitContent()}
        </div>

        {/* Subtle red vignette highlight around border */}
        <div className="absolute inset-0 border-b-2 border-red-900/80 pointer-events-none" />
      </div>

      {/* Speaker Tag on Portrait if speaking */}
      {speakerName && (
        <div className="absolute -bottom-2 px-2.5 py-0.5 rounded bg-red-950/90 border border-red-800 text-xs font-bebas tracking-wider text-amber-200 shadow-md">
          {speakerName}
        </div>
      )}
    </div>
  );
};
