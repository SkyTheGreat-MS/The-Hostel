import React, { useState, useEffect } from 'react';
import { GameState, MCId } from '../types';
import { createInitialState } from '../prologEngine';
import { sound } from '../audioEngine';
import { LilyBorder } from './LilyBorder';
import { InkPortrait } from './InkPortrait';
import { CharacterSelectScreen } from './CharacterSelectScreen';
import { ExplorationMenu } from './ExplorationMenu';
import { PauseModal } from './PauseModal';
import { ChevronRight, Volume2, VolumeX, Pause } from 'lucide-react';

interface DialogueLine {
  id: number;
  scene: 1 | 2;
  speaker: string;
  speakerId: MCId | 'mama_may' | 'guardian_nat';
  pos: 'left' | 'right';
  text: string;
  isBreak?: boolean;
}

const DIALOGUE_SCRIPT: DialogueLine[] = [
  // Scene 1: The 2026 Seance Room
  {
    id: 1,
    scene: 1,
    speaker: 'May Jewel',
    speakerId: 'may_jewel',
    pos: 'left',
    text: 'I found this old ritual recorded in a 1998 hostel notebook... They called it the Mirror-Well Pact.',
  },
  {
    id: 2,
    scene: 1,
    speaker: 'Ye Yint Hein',
    speakerId: 'ye_yint_hein',
    pos: 'right',
    text: "Who's going to scream first? It's just an old superstition from the previous generation.",
  },
  {
    id: 3,
    scene: 1,
    speaker: 'Moe Stheinkha',
    speakerId: 'moe_stheinkha',
    pos: 'left',
    text: 'Keep the candle centered. If the flame flickers toward the east, the guardian spirit is already in the room.',
  },
  {
    id: 4,
    scene: 1,
    speaker: 'Yin Min Htike',
    speakerId: 'yin_min_htike',
    pos: 'right',
    text: 'Look at this floor plan from August 1998... Pathway 326 was sealed off right after a girl named Mama May disappeared.',
  },
  {
    id: 5,
    scene: 1,
    speaker: 'Hsu Myat Shein',
    speakerId: 'hsu_myat_shein',
    pos: 'left',
    text: 'My grandmother told me never to speak that name inside this building. Something bad happened here.',
  },
  {
    id: 6,
    scene: 1,
    speaker: 'Mona',
    speakerId: 'mona',
    pos: 'right',
    text: "Enough ghost stories. If we're doing this, let's place our hands on the glass together.",
  },

  // Scene 2: The Chant & The Supernatural Shift
  {
    id: 7,
    scene: 2,
    speaker: 'May Jewel',
    speakerId: 'may_jewel',
    pos: 'left',
    text: 'Spirits of 1998... Guardian of the four directions... We seek the truth of the sealed corridor...',
  },
  {
    id: 8,
    scene: 2,
    speaker: 'Ye Yint Hein',
    speakerId: 'ye_yint_hein',
    pos: 'right',
    text: 'Wait... do you feel that? The temperature in this room just dropped like ice.',
  },
  {
    id: 9,
    scene: 2,
    speaker: 'Moe Stheinkha',
    speakerId: 'moe_stheinkha',
    pos: 'left',
    text: "The candle flame—it turned blue! Don't break the circle!",
  },
  {
    id: 10,
    scene: 2,
    speaker: 'Yin Min Htike',
    speakerId: 'yin_min_htike',
    pos: 'right',
    text: "The glass... it's moving on its own! It's spelling M - A - M - A...",
  },
  {
    id: 11,
    scene: 2,
    speaker: 'Hsu Myat Shein',
    speakerId: 'hsu_myat_shein',
    pos: 'left',
    text: "Someone is whispering behind my neck... 'Who took my breath away?'",
  },
  {
    id: 12,
    scene: 2,
    speaker: 'Mona',
    speakerId: 'mona',
    pos: 'right',
    text: 'The glass is vibrating violently! PULL YOUR HANDS BACK—',
    isBreak: true,
  },
];

type EngineState = 'dialogue' | 'breaking' | 'character_select' | 'exploration';

export const VisualNovelEngine: React.FC = () => {
  const [engineState, setEngineState] = useState<EngineState>('dialogue');
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [gameState, setGameState] = useState<GameState>(() => createInitialState('moe_stheinkha'));
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());
  const [isPauseOpen, setIsPauseOpen] = useState<boolean>(false);

  const currentLine = DIALOGUE_SCRIPT[currentLineIndex] || DIALOGUE_SCRIPT[0];

  // Typewriter effect
  useEffect(() => {
    if (engineState !== 'dialogue') return;

    let charIndex = 0;
    setIsTyping(true);
    setDisplayedText('');

    const fullText = currentLine.text;
    const interval = setInterval(() => {
      charIndex++;
      setDisplayedText(fullText.slice(0, charIndex));
      if (charIndex >= fullText.length) {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 22);

    return () => clearInterval(interval);
  }, [currentLineIndex, engineState]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPauseOpen((prev) => !prev);
        sound.playPaperRustle();
        return;
      }

      if (isPauseOpen) return;

      if (engineState === 'dialogue') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          advanceDialogue();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentLineIndex, isTyping, engineState, isPauseOpen]);

  // Handle the climax break trigger
  const handleBreak = () => {
    setEngineState('breaking');
    sound.playGlassBreak();

    // After shatter shockwave, transition to character select
    setTimeout(() => {
      setEngineState('character_select');
    }, 850);
  };

  // Advance dialogue or skip typewriter
  const advanceDialogue = () => {
    if (isTyping) {
      // Instantly finish line
      setDisplayedText(currentLine.text);
      setIsTyping(false);
      return;
    }

    sound.playPaperRustle();

    if (currentLine.isBreak || currentLineIndex >= DIALOGUE_SCRIPT.length - 1) {
      handleBreak();
    } else {
      setCurrentLineIndex((prev) => prev + 1);
    }
  };

  // Handle investigator chosen
  const handleCharacterSelected = (characterId: MCId) => {
    const initial = createInitialState(characterId);
    setGameState(initial);
    setEngineState('exploration');
  };

  // Restart Chapter 1
  const handleRestartChapter = () => {
    setCurrentLineIndex(0);
    setGameState(createInitialState('moe_stheinkha'));
    setEngineState('dialogue');
  };

  // Toggle audio mute
  const toggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  return (
    <div className="relative w-full h-full min-h-[640px] flex flex-col justify-between overflow-hidden bg-neutral-950 select-none">
      {/* 1998 Monsoon & Burmese Graphic Novel Background Texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-neutral-950/90 to-neutral-950 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(#991b1b_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none z-0" />

      {/* Breaking / Glass Shatter Shockwave Effect */}
      {engineState === 'breaking' && (
        <div className="absolute inset-0 z-50 bg-black flex items-center justify-center animate-pulse">
          <div className="text-center space-y-4">
            <div className="text-4xl md:text-6xl font-bebas font-black text-red-600 tracking-widest animate-bounce">
              <span className="inline-block scale-125">⚡</span> CRACK! <span className="inline-block scale-125">⚡</span>
            </div>
            <p className="text-sm font-mono text-neutral-400 uppercase tracking-widest">
              The offering glass shatters into dark 1998 fragments...
            </p>
          </div>
        </div>
      )}

      {/* Top Navigation / Status Header with Fixed Pause Button */}
      <div className="relative w-full p-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-red-950/90 border border-red-900 rounded-md text-xs font-bebas tracking-wider text-amber-200 shadow-md">
            <span>CHAPTER 1 : BLIND START (1998)</span>
          </div>
          {engineState === 'dialogue' && (
            <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
              Scene {currentLine.scene} / 2 • Seance Ritual
            </span>
          )}
        </div>

        {/* Action Controls: Audio + Pause Button */}
        <div className="flex items-center gap-2">
          <button
            id="vn-mute-btn"
            onClick={toggleMute}
            className="p-2 rounded-lg bg-neutral-900/80 border border-red-950 text-neutral-300 hover:text-amber-200 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            id="vn-pause-btn"
            onClick={() => {
              sound.playPaperRustle();
              setIsPauseOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-950/90 hover:bg-red-900 border border-red-800 text-amber-200 font-bebas text-sm tracking-widest shadow-md transition-all active:scale-95 cursor-pointer"
            title="Pause Investigation (ESC)"
          >
            <Pause className="w-3.5 h-3.5 text-amber-300" />
            <span>PAUSE</span>
          </button>
        </div>
      </div>

      {/* Visual Novel Dialogue View */}
      {engineState === 'dialogue' && (
        <div className="relative flex-1 flex flex-col justify-end p-4 md:p-8 z-10">
          {/* Character Portraits Container (Left & Right Slots) */}
          <div className="relative w-full max-w-5xl mx-auto flex items-end justify-between px-4 md:px-12 h-64 md:h-80 pointer-events-none">
            {/* Left Slot */}
            <div className="relative h-full flex items-end">
              <InkPortrait
                characterId={currentLine.pos === 'left' ? currentLine.speakerId : 'moe_stheinkha'}
                speakerName={currentLine.pos === 'left' ? currentLine.speaker : undefined}
                isSpeaking={currentLine.pos === 'left'}
                position="left"
                size="lg"
              />
            </div>

            {/* Right Slot */}
            <div className="relative h-full flex items-end">
              <InkPortrait
                characterId={currentLine.pos === 'right' ? currentLine.speakerId : 'ye_yint_hein'}
                speakerName={currentLine.pos === 'right' ? currentLine.speaker : undefined}
                isSpeaking={currentLine.pos === 'right'}
                position="right"
                size="lg"
              />
            </div>
          </div>

          {/* Bottom-Anchored Dialogue Box with Lily of the Valley Border */}
          <div
            id="vn-dialogue-box"
            onClick={advanceDialogue}
            className="w-full max-w-4xl mx-auto cursor-pointer transition-transform active:scale-[0.99] group mt-2"
          >
            <LilyBorder className="w-full bg-red-950/95 border-2 border-red-900/90 rounded-2xl p-5 md:p-7 shadow-2xl backdrop-blur-md">
              {/* Speaker Name Tag */}
              <div className="inline-block px-3.5 py-1 bg-neutral-950 border border-red-800 rounded-md text-sm md:text-base font-bebas text-amber-300 tracking-widest mb-2 shadow">
                {currentLine.speaker}
              </div>

              {/* Dialogue Text */}
              <div className="min-h-[54px] md:min-h-[64px]">
                <p className="text-base md:text-lg font-sans text-neutral-100 leading-relaxed tracking-wide">
                  {displayedText}
                  {isTyping && <span className="inline-block w-2 h-4 ml-1 bg-amber-400 animate-pulse" />}
                </p>
              </div>

              {/* Footer Advance Prompt */}
              <div className="mt-3 pt-2 border-t border-red-900/60 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span className="text-red-400/90 font-sans">မြန်မာ လျှို့ဝှက်ဆန်းကြယ် • အခန်း ၁</span>
                <div className="flex items-center gap-1.5 text-amber-300/80 group-hover:text-amber-200">
                  <span className="font-bebas tracking-wider text-xs">[PRESS ENTER / CLICK TO ADVANCE]</span>
                  <ChevronRight className="w-3.5 h-3.5 animate-bounce-x" />
                </div>
              </div>
            </LilyBorder>
          </div>
        </div>
      )}

      {/* Character Selection View */}
      {engineState === 'character_select' && (
        <div className="relative flex-1 z-10">
          <CharacterSelectScreen onSelectCharacter={handleCharacterSelected} />
        </div>
      )}

      {/* Exploration Menu View (Restricted Chapter 1 Flow) */}
      {engineState === 'exploration' && (
        <div className="relative flex-1 z-10">
          <ExplorationMenu
            gameState={gameState}
            setGameState={setGameState}
            onRestart={() => setEngineState('character_select')}
            onOpenPause={() => setIsPauseOpen(true)}
          />
        </div>
      )}

      {/* Pause Modal Overlay */}
      <PauseModal
        isOpen={isPauseOpen}
        onClose={() => setIsPauseOpen(false)}
        onRestartChapter={handleRestartChapter}
        chapterNumber={1}
        chapterTitle="Blind Start"
      />
    </div>
  );
};
