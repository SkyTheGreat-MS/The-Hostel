import React from 'react';
import hsuPortrait from '@/assets/hsu_myat_shein_1.jpg';
import mjPortrait from '@/assets/mj_1.jpg';

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
          ? 'scale-105 z-20 brightness-105 drop-shadow-[0_0_25px_rgba(245,158,11,0.45)]'
          : 'scale-95 z-10 opacity-70 brightness-75 hover:opacity-90'
      } ${className}`}
    >
      {/* Portrait Frame with Graphic Novel Lacquer Styling */}
      <div
        className={`relative w-full h-full overflow-hidden rounded-2xl border-2 transition-all duration-300 bg-stone-950 shadow-2xl ${
          isSpeaking
            ? isMamaMay
              ? 'border-red-600 ring-2 ring-red-500/80 shadow-[0_0_30px_rgba(220,38,38,0.6)]'
              : 'border-amber-500 ring-2 ring-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.4)]'
            : 'border-stone-800/80'
        }`}
      >
        {/* Actual Character Portrait Image */}
        <img
          src={portraitSrc}
          alt={speakerName || characterId}
          className={`w-full h-full object-cover object-top transition-transform duration-500 ${
            isSpeaking ? 'scale-105' : 'scale-100'
          } ${isMamaMay ? 'filter hue-rotate-180 invert brightness-90 contrast-125' : ''}`}
        />

        {/* Cinematic Mood Gradients */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity ${
            isSpeaking
              ? 'bg-gradient-to-t from-stone-950/85 via-transparent to-black/20'
              : 'bg-black/40 bg-gradient-to-t from-black/90 via-black/40 to-transparent'
          }`}
        />

        {/* Vintage Film Grain & Color Cast */}
        <div
          className={`absolute inset-0 pointer-events-none mix-blend-color ${
            isMamaMay
              ? 'bg-red-950/50'
              : 'bg-amber-950/20'
          }`}
        />
      </div>

      {/* Speaker Tag Pill Beneath Portrait */}
      {speakerName && (
        <div
          className={`absolute -bottom-3 z-30 px-3 py-1 rounded-md text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-xl whitespace-nowrap ${
            isSpeaking
              ? isMamaMay
                ? 'bg-red-950 border border-red-600 text-red-200'
                : 'bg-stone-900 border border-amber-500 text-amber-200 ring-1 ring-amber-400/40'
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
