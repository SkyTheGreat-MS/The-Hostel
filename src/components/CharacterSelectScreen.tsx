import React, { useState, useEffect } from 'react';
import { MCId } from '../types';
import { CHARACTERS } from '../gameData';
import { InkPortrait } from './InkPortrait';
import { sound } from '../audioEngine';
import { Shield, Sparkles, User, Flame, Skull, Zap, ChevronRight } from 'lucide-react';

interface CharacterSelectScreenProps {
  onSelectCharacter: (characterId: MCId) => void;
}

export const CharacterSelectScreen: React.FC<CharacterSelectScreenProps> = ({
  onSelectCharacter,
}) => {
  // Only display the 6 canonical characters
  const mainSix = CHARACTERS.slice(0, 6);
  const [selectedId, setSelectedId] = useState<MCId>(mainSix[0].id);

  // Keyboard shortcut support (1-6)
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
    <div className="relative w-full h-full min-h-[600px] flex flex-col justify-between p-4 md:p-8 bg-gradient-to-b from-neutral-950 via-red-950/40 to-neutral-950 text-neutral-100 overflow-y-auto">
      {/* Header Banner */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-900 rounded-full text-xs text-amber-300 uppercase tracking-widest font-mono">
          <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span>The Shattered 2026 Seance • Temporal Rupture</span>
          <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bebas font-black text-amber-100 tracking-wider">
          WHO AWAKENS IN 1998?
        </h1>
        <p className="text-xs md:text-sm text-neutral-400 max-w-2xl mx-auto font-sans">
          The ritual glass has shattered. Choose which student’s consciousness anchors this temporal investigation into Mama May’s death. Press keys <span className="text-amber-400 font-bold">[1-6]</span> or click below.
        </p>
      </div>

      {/* 6 Graphic Novel Character Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 max-w-6xl mx-auto w-full mb-6">
        {mainSix.map((char, index) => {
          const isSelected = char.id === selectedId;
          return (
            <div
              key={char.id}
              onClick={() => handleSelect(char.id)}
              className={`group relative flex flex-col rounded-lg p-2.5 cursor-pointer border transition-all duration-200 ${
                isSelected
                  ? 'bg-red-950/90 border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.25)] scale-[1.03] ring-1 ring-amber-400/50'
                  : 'bg-neutral-900/80 border-neutral-800 hover:border-red-800/80 hover:bg-neutral-800/60'
              }`}
            >
              {/* Number Badge */}
              <div
                className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono z-10 ${
                  isSelected
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-800 text-neutral-400 group-hover:bg-red-900 group-hover:text-amber-200'
                }`}
              >
                {index + 1}
              </div>

              {/* Ink-wash Portrait Preview */}
              <div className="h-44 w-full mb-2 overflow-hidden rounded bg-neutral-950">
                <InkPortrait
                  characterId={char.id}
                  speakerName={char.name}
                  isSpeaking={isSelected}
                  size="full"
                />
              </div>

              {/* Archetype & Name */}
              <div className="text-center">
                <div className="text-[10px] uppercase font-mono tracking-widest text-red-400">
                  {char.archetype}
                </div>
                <div className="font-bebas font-bold text-lg text-neutral-100 tracking-wider truncate">
                  {char.name}
                </div>
              </div>

              {/* Multiplier Badges */}
              <div className="mt-2 pt-2 border-t border-neutral-800/80 grid grid-cols-3 gap-1 text-[10px] font-mono text-center">
                <div title="Supernatural Damage Multiplier" className="bg-neutral-950/60 rounded px-1 py-0.5 text-red-400">
                  ⚡{char.multipliers.supernatural_direct}x
                </div>
                <div title="Physical Threat Damage Multiplier" className="bg-neutral-950/60 rounded px-1 py-0.5 text-amber-400">
                  🛡️{char.multipliers.physical_threat}x
                </div>
                <div title="Betrayal Damage Multiplier" className="bg-neutral-950/60 rounded px-1 py-0.5 text-purple-400">
                  🗡️{char.multipliers.betrayal}x
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Character Deep-Dive Panel & Confirmation */}
      <div className="max-w-4xl mx-auto w-full bg-red-950/70 border border-red-900/90 rounded-xl p-4 md:p-6 backdrop-blur-sm shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-20 bg-neutral-950 rounded border border-red-800/60 overflow-hidden shrink-0">
            <InkPortrait characterId={activeChar.id} isSpeaking={true} size="full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono px-2 py-0.5 bg-red-900/80 text-amber-300 rounded">
                {activeChar.archetype}
              </span>
              <h2 className="text-2xl font-bebas font-bold text-amber-100 tracking-wider">
                {activeChar.name}
              </h2>
            </div>
            <p className="text-xs text-neutral-300 mt-1 max-w-xl font-sans">
              {activeChar.description}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleConfirm}
          className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-red-800 via-red-700 to-amber-700 hover:from-red-700 hover:to-amber-600 text-amber-100 font-bebas tracking-widest text-lg md:text-xl rounded-lg border border-amber-400/40 shadow-lg hover:shadow-red-700/50 transition-all flex items-center justify-center gap-3 shrink-0 cursor-pointer"
        >
          <span>BEGIN INVESTIGATION (1998)</span>
          <ChevronRight className="w-5 h-5 text-amber-300 animate-bounce-x" />
        </button>
      </div>
    </div>
  );
};
