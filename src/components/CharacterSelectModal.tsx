import React, { useState, useEffect } from 'react';
import { MCId, MCCharacter } from '../types';
import { CHARACTERS } from '../gameData';
import { InkPortrait } from './InkPortrait';
import { sound } from '../audioEngine';
import { ChevronRight, Check } from 'lucide-react';

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
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#16221c] border border-[#2c3d34] rounded-full text-xs text-[#82a996] uppercase tracking-widest font-mono shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#6ee7b7] animate-ping" />
          <span>TEMPORAL DISPLACEMENT • AUGUST 1998</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black text-[#b2c7bd] tracking-widest uppercase drop-shadow-md">
          ANCHOR CONSCIOUSNESS
        </h1>
        <p className="text-xs sm:text-sm text-[#7d998b] max-w-2xl mx-auto font-mono">
          Choose which student&apos;s perspective anchors the investigation. Use arrow keys{' '}
          <span className="text-[#a7c4b5] font-bold">[← / → / ↑ / ↓]</span>, keys{' '}
          <span className="text-[#a7c4b5] font-bold">[1-6]</span>, or click a card. Press{' '}
          <span className="text-[#a7c4b5] font-bold">[Enter]</span> or{' '}
          <span className="text-[#a7c4b5] font-bold">[Space]</span> to awaken.
        </p>
      </div>

      {/* 6 Character Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-6xl mx-auto w-full mb-4 sm:mb-6">
        {characters.map((char, index) => {
          const isSelected = index === selectedIdx;
          return (
            <div
              key={char.id}
              onClick={() => handleCardClick(index)}
              className={`group relative flex flex-col rounded-xl p-2.5 sm:p-3 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-[#16221c] border-2 border-[#4d6e5e] shadow-[0_0_20px_rgba(77,110,94,0.3)] text-[#c2d6cc] scale-[1.03] z-10'
                  : 'bg-[#111714]/90 border border-[#223028] text-stone-400 hover:border-[#384f42] hover:bg-[#151f1a]'
              }`}
            >
              {/* Number Badge */}
              <div
                className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono z-20 ${
                  isSelected
                    ? 'bg-[#385244] text-[#d1e3da] font-black shadow-md border border-[#4d6e5e]'
                    : 'bg-[#1a2420] text-[#7d998b] border border-[#26362e] group-hover:text-[#a7c4b5]'
                }`}
              >
                {index + 1}
              </div>

              {/* Selected Check Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#385244] text-[#a7c4b5] flex items-center justify-center z-20 shadow-md border border-[#4d6e5e]">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Character Portrait Frame */}
              <div className="h-40 sm:h-44 w-full mb-2 overflow-hidden rounded-lg bg-[#0a0f0d] border border-[#223028]">
                <InkPortrait
                  characterId={char.id}
                  speakerName={char.name}
                  isSpeaking={isSelected}
                  size="full"
                />
              </div>

              {/* Archetype & Name */}
              <div className="text-center mt-1">
                <div className="text-[10px] uppercase font-mono tracking-widest text-[#82a996] font-bold">
                  {char.archetype}
                </div>
                <div
                  className={`font-black text-base sm:text-lg tracking-wider truncate ${
                    isSelected ? 'text-[#d1e3da]' : 'text-stone-300'
                  }`}
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                >
                  {char.name}
                </div>
              </div>

              {/* Multiplier Badges */}
              <div className="mt-2 pt-2 border-t border-[#223028] grid grid-cols-3 gap-1 text-[9px] font-mono text-center">
                <div
                  title="Supernatural Vulnerability"
                  className="bg-[#1a2420] text-[#7d998b] border border-[#26362e] rounded px-1 py-0.5"
                >
                  ⚡{char.multipliers.supernatural_direct}x
                </div>
                <div
                  title="Physical Threat Resistance"
                  className="bg-[#1a2420] text-[#7d998b] border border-[#26362e] rounded px-1 py-0.5"
                >
                  🛡️{char.multipliers.physical_threat}x
                </div>
                <div
                  title="Betrayal Vulnerability"
                  className="bg-[#1a2420] text-[#7d998b] border border-[#26362e] rounded px-1 py-0.5"
                >
                  🗡️{char.multipliers.betrayal}x
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Character Deep-Dive Panel & Confirmation */}
      <div className="max-w-4xl mx-auto w-full bg-[#121815]/95 border border-[#2c3d34] rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 backdrop-blur-md">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-16 h-20 bg-[#0a0f0d] rounded-xl border border-[#384f42] overflow-hidden shrink-0 shadow-md">
            <InkPortrait characterId={activeChar.id} isSpeaking={true} size="full" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase font-mono font-bold px-2 py-0.5 bg-[#1a2420] text-[#82a996] border border-[#26362e] rounded">
                {activeChar.archetype}
              </span>
              <h2
                className="text-2xl sm:text-3xl font-black text-[#d1e3da] tracking-wider truncate"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
              >
                {activeChar.name}
              </h2>
            </div>
            <p className="text-xs text-[#a7c4b5]/80 mt-1 max-w-xl font-mono leading-relaxed line-clamp-2 sm:line-clamp-none">
              {activeChar.description}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => handleConfirmSelection(characters[selectedIdx])}
          className="w-full md:w-auto px-6 py-3 rounded-lg bg-[#22352b] hover:bg-[#2d4639] border border-[#3f5c4c] text-[#d1e3da] font-mono tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-3 shrink-0 cursor-pointer hover:border-[#4d6e5e]"
        >
          <span>BEGIN INVESTIGATION [1998]</span>
          <ChevronRight className="w-4 h-4 text-[#a7c4b5]" />
        </button>
      </div>
    </div>
  );
};

export default CharacterSelectModal;
