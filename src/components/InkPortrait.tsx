import React from 'react';
import hsuPortrait from '@/assets/hsu_myat_shein_1.jpg';
import mjPortrait from '@/assets/mj_1.png';

interface InkPortraitProps {
  characterId?: string;
  speakerName?: string;
  isSpeaking?: boolean;
  position?: 'left' | 'right' | 'center';
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

export const InkPortrait: React.FC<InkPortraitProps> = ({
  characterId = 'may_jewel',
  speakerName,
  isSpeaking = false,
  position = 'left',
  size = 'lg',
  className = '',
}) => {
  const normalizedId = (characterId || '').toLowerCase();

  // Determine whether to use hsu_myat_shein_1 or mj_1 across all six characters
  // Toggle mapping:
  // May Jewel -> MJ
  // Hsu Myat Shein -> Hsu
  // Moe Stheinkha -> MJ
  // Ye Yint Hein -> Hsu
  // Yin Min Htike -> MJ
  // Mona -> Hsu
  const isHsuType =
    normalizedId.includes('hsu') ||
    normalizedId.includes('ye') ||
    normalizedId.includes('mona') ||
    normalizedId.includes('aye');

  const isMamaMay = normalizedId.includes('mama');

  const portraitSrc = isHsuType ? hsuPortrait : mjPortrait;

  // Sizing definitions
  const sizeClasses = {
    sm: 'w-24 h-32 sm:w-28 sm:h-36',
    md: 'w-36 h-48 sm:w-44 sm:h-56',
    lg: 'w-44 h-56 sm:w-56 sm:h-72 md:w-64 md:h-80',
    full: 'w-full h-full',
  }[size];

  return (
    <div
      className={`relative flex flex-col items-center justify-end transition-all duration-300 ${sizeClasses} ${
        isSpeaking
          ? 'scale-105 z-20 brightness-105'
          : 'scale-95 z-10 opacity-70 brightness-75 hover:opacity-90'
      } ${className}`}
    >
      {/* Character Sprite Wrapper: transparent, borderless, no rounded corners, no shadows */}
      <div className="relative w-full h-full bg-transparent flex items-end justify-center">
        {/* Actual Character Portrait Image */}
        <img
          src={portraitSrc}
          alt={speakerName || characterId}
          className={`w-full h-full object-contain object-bottom bg-transparent transition-transform duration-500 ${
            isSpeaking ? 'scale-105' : 'scale-100'
          } ${isMamaMay ? 'filter hue-rotate-180 invert brightness-90 contrast-125' : ''}`}
        />
      </div>

      {/* Speaker Tag Pill Beneath Portrait */}
      {speakerName && (
        <div
          className={`absolute -bottom-3 z-30 px-3 py-1 rounded-md text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-md whitespace-nowrap ${
            isSpeaking
              ? isMamaMay
                ? 'bg-red-950 border border-red-600 text-red-200'
                : 'bg-stone-900 border border-stone-700 text-amber-200'
              : 'bg-stone-950/90 border border-stone-800 text-stone-400'
          }`}
          style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", fontSize: '0.95rem' }}
        >
          {speakerName}
        </div>
      )}
    </div>
  );
};
