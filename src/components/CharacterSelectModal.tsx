import React, { useState, useEffect } from 'react';
import { MCId, MCCharacter } from '../types';
import { CHARACTERS } from '../gameData';
import { getCharacterProfile } from '../characterData';
import { InkPortrait } from './InkPortrait';
import { sound } from '../audioEngine';
import { ChevronRight, Check, Heart, Brain, Award } from 'lucide-react';

export interface CharacterSelectModalProps {
  onSelectCharacter?: (characterId: MCId) => void;
  onConfirmSelection?: (character: MCCharacter) => void;
  characters?: MCCharacter[];
  initialSelectedId?: MCId;
}

export const CharacterSelectModal: React.FC<CharacterSelectModalProps> = ({
  onSelectCharacter,
  onConfirmSelection,
  characters = CHARACTERS.slice(0, 6),
  initialSelectedId,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(() => {
    if (initialSelectedId) {
      const idx = characters.findIndex((c) => c.id === initialSelectedId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const handleConfirmSelection = (char?: MCCharacter) => {
    const chosen = char || characters[selectedIdx] || characters[0];
    if (!chosen) return;
    sound.playDramaticSting();
    if (onSelectCharacter) {
      onSelectCharacter(chosen.id);
    }
    if (onConfirmSelection) {
      onConfirmSelection(chosen);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const total = characters.length; // 6 characters
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((prev) => (prev + 1) % total);
        sound.playMenuHover();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx((prev) => (prev - 1 + total) % total);
        sound.playMenuHover();
      } else if (e.key >= '1' && e.key <= String(total)) {
        e.preventDefault();
        setSelectedIdx(Number(e.key) - 1);
        sound.playMenuHover();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleConfirmSelection(characters[selectedIdx]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx, characters]);

  const handleCardClick = (idx: number) => {
    setSelectedIdx(idx);
    sound.playMenuHover();
  };

  const activeChar = characters[selectedIdx] || characters[0];

  return (
    <div className="relative w-full h-full min-h-[620px] flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-[#0a0f0d]/95 backdrop-blur-xl text-[#c2d6cc] overflow-y-auto select-none">
      {/* Top Header Banner */}
      <div className="text-center space-y-2 mb-4 sm:mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#060b08]/85 rounded-none text-xs text-[#82a996] font-burmese leading-[1.75]">
          <span className="w-1.5 h-1.5 rounded-none bg-[#6ee7b7] animate-pulse" />
          <span>အချိန်ကာလ ရွှေ့ပြောင်းမှု • ၁၉၉၈ ဩဂုတ်</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-burmese font-bold text-[#b2c7bd] drop-shadow-md leading-[1.75]">
          ကျောက်ဆူးသတိ
        </h1>
        <p className="text-xs sm:text-sm text-[#7d998b] max-w-2xl mx-auto font-burmese leading-[1.75]">
          စုံစမ်းမှုကို ကျောက်ဆူးချမည့် ကျောင်းသား၏ ရှုထောင့်ကို ရွေးချယ်ပါ။ မြှားခလုတ်များ{' '}
          <span className="text-[#a7c4b5] font-bold font-mono">[← / → / ↑ / ↓]</span>၊ နံပါတ်ခလုတ်{' '}
          <span className="text-[#a7c4b5] font-bold font-burmese">[၁-၆]</span> သို့မဟုတ် ကတ်ကိုနှိပ်ပါ။ နိုးထရန်{' '}
          <span className="text-[#a7c4b5] font-bold font-mono">[Enter]</span> သို့မဟုတ်{' '}
          <span className="text-[#a7c4b5] font-bold font-mono">[Space]</span> ကိုနှိပ်ပါ။
        </p>
      </div>

      {/* 6 Character Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-6xl mx-auto w-full mb-4 sm:mb-6">
        {characters.map((char, index) => {
          const isSelected = index === selectedIdx;
          const profile = getCharacterProfile(char.id);
          return (
            <div
              key={char.id}
              onClick={() => handleCardClick(index)}
              className={`group relative flex flex-col rounded-none p-2.5 sm:p-3 cursor-pointer transition-colors duration-150 ${
                isSelected
                  ? 'bg-[#101c15] text-[#e0f0e7] z-10'
                  : 'bg-[#060b08]/90 text-stone-400 hover:bg-[#101c15]'
              }`}
            >
              {/* Number Badge */}
              <div
                className={`absolute top-2 left-2 w-5 h-5 rounded-none flex items-center justify-center text-xs font-bold font-mono z-20 ${
                  isSelected
                    ? 'bg-[#193828] text-[#e0f0e7] font-black'
                    : 'bg-[#060b08] text-[#6ea889] group-hover:text-[#b1d4c2]'
                }`}
              >
                {index + 1}
              </div>

              {/* Selected Check Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-none bg-[#193828] text-[#6ea889] flex items-center justify-center z-20">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Character Portrait Frame */}
              <div className="h-40 sm:h-44 w-full mb-2 overflow-hidden rounded-none bg-[#020504]">
                <InkPortrait
                  characterId={char.id}
                  speakerName={char.name}
                  isSpeaking={isSelected}
                  size="full"
                />
              </div>

              {/* Archetype & Name */}
              <div className="text-center mt-1">
                <div className="text-[10px] uppercase font-mono tracking-widest text-[#6ea889] font-bold">
                  {char.archetype}
                </div>
                <div
                  className={`font-burmese font-bold text-base sm:text-lg tracking-wide truncate ${
                    isSelected ? 'text-[#e0f0e7]' : 'text-[#b1d4c2]'
                  }`}
                >
                  {char.name}
                </div>
              </div>

              {/* Dual Vitals Badges: HP (Green Heart) & Mind (Cyan Brain) */}
              <div className="mt-2 pt-2 grid grid-cols-2 gap-1.5 text-[10px] font-mono tabular-nums text-center">
                <div
                  title="သွေးသားကြံ့ခိုင်မှု (ရုပ်ပိုင်းဆိုင်ရာ အသက်)"
                  className="bg-[#0b140f] text-[#6ea889] rounded-none px-1.5 py-1 flex items-center justify-center gap-1 font-bold"
                >
                  <Heart className="w-3 h-3 text-[#6ea889] shrink-0" />
                  <span>{profile.maxHp} HP</span>
                </div>
                <div
                  title="စိတ်တည်ငြိမ်မှု (စိတ်ပိုင်းဆိုင်ရာ ကြံ့ခိုင်မှု)"
                  className="bg-[#0b140f] text-[#38bdf8] rounded-none px-1.5 py-1 flex items-center justify-center gap-1 font-bold"
                >
                  <Brain className="w-3 h-3 text-[#38bdf8] shrink-0" />
                  <span>{profile.maxMind} M</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Character Deep-Dive Panel & Confirmation */}
      {(() => {
        const activeProfile = getCharacterProfile(activeChar.id);
        return (
          <div className="max-w-5xl mx-auto w-full bg-[#060b08]/96 rounded-none p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 backdrop-blur-md">
            <div className="flex items-start gap-4 w-full md:w-auto">
              <div className="w-16 h-20 bg-[#020504] rounded-none overflow-hidden shrink-0 shadow-none">
                <InkPortrait characterId={activeChar.id} isSpeaking={true} size="full" />
              </div>
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] uppercase font-mono font-bold px-2 py-0.5 bg-[#101c15] text-[#6ea889] rounded-none">
                    {activeChar.archetype}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-burmese font-bold text-[#e0f0e7] tracking-wide truncate leading-[1.75]">
                    {activeChar.name}
                  </h2>
                </div>

                {/* Vitals & Defenses Readout */}
                <div className="flex flex-wrap items-center gap-2 font-burmese text-xs">
                  <span className="flex items-center gap-1 text-[#6ea889] font-bold bg-[#0b140f] px-2 py-0.5 rounded-none leading-[1.75]">
                    <Heart className="w-3.5 h-3.5 text-[#6ea889]" />
                    <span>သွေးသား <span className="font-mono tabular-nums">{activeProfile.maxHp} HP</span></span>
                  </span>
                  <span className="flex items-center gap-1 text-[#38bdf8] font-bold bg-[#0b140f] px-2 py-0.5 rounded-none leading-[1.75]">
                    <Brain className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>စိတ်တည်ငြိမ်မှု <span className="font-mono tabular-nums">{activeProfile.maxMind} MIND</span></span>
                  </span>
                  {activeProfile.physicalDefense !== 1.0 && (
                    <span className="text-[11px] font-burmese px-2 py-0.5 rounded-none bg-[#0b140f] text-[#b1d4c2] leading-[1.75]">
                      ရုပ်ပိုင်း: {activeProfile.physicalDefense < 1 ? `+${Math.round((1 - activeProfile.physicalDefense) * 100)}% ခံနိုင်ရည်` : `-${Math.round((activeProfile.physicalDefense - 1) * 100)}% ထိခိုက်လွယ်`}
                    </span>
                  )}
                  {activeProfile.mentalDefense !== 1.0 && (
                    <span className="text-[11px] font-burmese px-2 py-0.5 rounded-none bg-[#0b140f] text-[#b1d4c2] leading-[1.75]">
                      စိတ်ပိုင်း: {activeProfile.mentalDefense < 1 ? `+${Math.round((1 - activeProfile.mentalDefense) * 100)}% ခံနိုင်ရည်` : `-${Math.round((activeProfile.mentalDefense - 1) * 100)}% ထိခိုက်လွယ်`}
                    </span>
                  )}
                </div>

                {/* Unique Passive Perk Card */}
                <div className="mt-2 p-2 rounded-none bg-[#0b140f] flex items-start gap-2">
                  <Award className="w-4 h-4 text-[#c7a458] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-burmese font-bold text-xs text-[#c7a458] block leading-[1.75]">
                      သီးသန့်စွမ်းရည်: {activeProfile.perkTitleBurmese}
                    </span>
                    <span className="font-burmese text-xs text-[#b1d4c2] leading-[1.75] block">
                      {activeProfile.perkDescBurmese}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleConfirmSelection(characters[selectedIdx])}
              className="w-full md:w-auto px-6 py-3 rounded-none bg-[#193828] hover:bg-[#29543e] text-[#e0f0e7] font-burmese font-bold text-sm tracking-wider transition-colors duration-150 flex items-center justify-center gap-3 shrink-0 cursor-pointer active:scale-[0.99] leading-[1.75]"
            >
              <span>စုံစမ်းစစ်ဆေးမှု စတင်မည် [၁၉၉၈]</span>
              <ChevronRight className="w-4 h-4 text-[#6ea889]" />
            </button>
          </div>
        );
      })()}
    </div>
  );
};

export default CharacterSelectModal;
