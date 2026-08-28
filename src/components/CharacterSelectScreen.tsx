import React, { useState, useEffect } from 'react';
import { MCId } from '../types';
import { CHARACTERS } from '../gameData';
import { InkPortrait } from './InkPortrait';
import { sound } from '../audioEngine';
import { Flame, ChevronRight, Sparkles, Check } from 'lucide-react';

interface CharacterSelectScreenProps {
  onSelectCharacter: (characterId: MCId) => void;
}

export const CharacterSelectScreen: React.FC<CharacterSelectScreenProps> = ({
  onSelectCharacter,
}) => {
  // 6 canonical students
  const mainSix = CHARACTERS.slice(0, 6);
  const [selectedId, setSelectedId] = useState<MCId>(mainSix[0].id);

  // Keyboard shortcut support (1-6 to select, Enter to confirm)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= 6) {
        const char = mainSix[keyNum - 1];
        if (char) {
          setSelectedId(char.id);
          sound.playPaperRustle();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleConfirm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

  const handleSelect = (id: MCId) => {
    setSelectedId(id);
    sound.playPaperRustle();
  };

  const handleConfirm = () => {
    sound.playDramaticSting();
    onSelectCharacter(selectedId);
  };

  const activeChar = mainSix.find((c) => c.id === selectedId) || mainSix[0];

  return (
    <div className="relative w-full h-full min-h-[620px] flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-stone-950/90 backdrop-blur-xl text-stone-100 overflow-y-auto select-none">
      {/* Top Header Banner */}
      <div className="text-center space-y-2 mb-4 sm:mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-stone-900/90 border border-amber-500/80 rounded-full text-xs text-amber-300 uppercase tracking-widest font-mono shadow-md">
          <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>TEMPORAL DISPLACEMENT • AUGUST 1998</span>
          <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
        </div>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-100 tracking-wider uppercase drop-shadow-md"
          style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
        >
          WHO AWAKENS IN 1998?
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 max-w-2xl mx-auto font-mono">
          The ritual vessel has shattered. Choose which student’s consciousness anchors this investigation. Press keys{' '}
          <span className="text-amber-400 font-bold">[1-6]</span> or click a card below.
        </p>
      </div>

      {/* 6 Character Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-6xl mx-auto w-full mb-4 sm:mb-6">
        {mainSix.map((char, index) => {
          const isSelected = char.id === selectedId;
          return (
            <div
              key={char.id}
              onClick={() => handleSelect(char.id)}
              className={`group relative flex flex-col rounded-xl p-2.5 sm:p-3 cursor-pointer border transition-all duration-200 ${
                isSelected
                  ? 'bg-stone-900/95 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.35)] scale-[1.03] ring-1 ring-amber-400/60 z-10'
                  : 'bg-stone-950/80 border-stone-800/90 hover:border-amber-700/60 hover:bg-stone-900/60 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Number Badge */}
              <div
                className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono z-20 ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 font-black shadow-md'
                    : 'bg-stone-800 text-stone-400 group-hover:bg-stone-700 group-hover:text-amber-200'
                }`}
              >
                {index + 1}
              </div>

              {/* Selected Check Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center z-20 shadow-md">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Character Portrait Frame */}
              <div className="h-40 sm:h-44 w-full mb-2 overflow-hidden rounded-lg bg-stone-950">
                <InkPortrait
                  characterId={char.id}
                  speakerName={char.name}
                  isSpeaking={isSelected}
                  size="full"
                />
              </div>

              {/* Archetype & Name */}
              <div className="text-center mt-1">
                <div className="text-[10px] uppercase font-mono tracking-widest text-amber-500 font-bold">
                  {char.archetype}
                </div>
                <div
                  className="font-black text-base sm:text-lg text-stone-100 tracking-wider truncate"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                >
                  {char.name}
                </div>
              </div>

              {/* Multiplier Badges */}
              <div className="mt-2 pt-2 border-t border-stone-800/80 grid grid-cols-3 gap-1 text-[9px] font-mono text-center">
                <div title="Supernatural Vulnerability" className="bg-stone-950/80 rounded px-1 py-0.5 text-rose-400">
                  ⚡{char.multipliers.supernatural_direct}x
                </div>
                <div title="Physical Threat Resistance" className="bg-stone-950/80 rounded px-1 py-0.5 text-amber-400">
                  🛡️{char.multipliers.physical_threat}x
                </div>
                <div title="Betrayal Vulnerability" className="bg-stone-950/80 rounded px-1 py-0.5 text-purple-400">
                  🗡️{char.multipliers.betrayal}x
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Character Deep-Dive Panel & Confirmation */}
      <div className="max-w-4xl mx-auto w-full bg-stone-900/90 border border-amber-600/80 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-16 h-20 bg-stone-950 rounded-xl border border-amber-500/60 overflow-hidden shrink-0 shadow-md">
            <InkPortrait characterId={activeChar.id} isSpeaking={true} size="full" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase font-mono font-bold px-2 py-0.5 bg-amber-950/80 text-amber-300 border border-amber-700/80 rounded">
                {activeChar.archetype}
              </span>
              <h2
                className="text-2xl sm:text-3xl font-black text-amber-100 tracking-wider truncate"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
              >
                {activeChar.name}
              </h2>
            </div>
            <p className="text-xs text-stone-300 mt-1 max-w-xl font-mono leading-relaxed line-clamp-2 sm:line-clamp-none">
              {activeChar.description}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleConfirm}
          className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black tracking-wider text-lg rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-3 shrink-0 cursor-pointer"
          style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", fontSize: '1.25rem' }}
        >
          <span>AWAKEN AS {activeChar.name.toUpperCase()} (1998)</span>
          <ChevronRight className="w-5 h-5 text-stone-950 fill-current" />
        </button>
      </div>
    </div>
  );
};
