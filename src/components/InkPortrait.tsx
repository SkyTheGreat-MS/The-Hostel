import React from 'react';
import hmsPortrait from '@/assets/hms_1.png';
import mjPortrait from '@/assets/mj_1.png';
import mskPortrait from '@/assets/msk_1.png';
import mtPortrait from '@/assets/mt_1.png';
import ymhPortrait from '@/assets/ymh_1.png';
import yyhPortrait from '@/assets/yyh_1.png';

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

  // Per-character portrait mapping.
  // YE YINT HEIN -> yyh, MOE STHEINKHA -> msk, HSU MYAT SHEIN -> hms,
  // YIN MIN HTIKE -> ymh, MAY JEWEL -> mj, MONA -> mt.
  // Legacy aliases from gameData are grouped with their base character.
  const portraitByCharacter: Record<string, string> = {
    ye_yint_hein: yyhPortrait,
    kyaw_swar: yyhPortrait,
    moe_stheinkha: mskPortrait,
    thazin: mskPortrait,
    hsu_myat_shein: hmsPortrait,
    aye_aye: hmsPortrait,
    yin_min_htike: ymhPortrait,
    htet: ymhPortrait,
    may_jewel: mjPortrait,
    su_su: mjPortrait,
    mona: mtPortrait,
    min_khant: mtPortrait,
    mama_may: mjPortrait,
  };

  const isMamaMay = normalizedId.includes('mama');

  const portraitSrc = portraitByCharacter[normalizedId] || mjPortrait;

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
    </div>
  );
};
