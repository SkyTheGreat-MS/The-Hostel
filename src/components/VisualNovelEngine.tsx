import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useGameProgress } from '../context/GameProgressContext';
import { sound } from '../audioEngine';
import { MCId, MCCharacter } from '../types';
import { CHARACTERS } from '../gameData';
import { InkPortrait } from './InkPortrait';
import { CharacterSelectScreen } from './CharacterSelectScreen';
import { PauseModal } from './PauseModal';
import {
  Volume2,
  VolumeX,
  Pause,
  Sparkles,
  Play,
  Key,
  ArrowRight,
} from 'lucide-react';

export type ChapterPhase = 1 | 2 | 3;

interface DialogueStep {
  id: number;
  phase: ChapterPhase;
  speaker: string;
  characterId: string;
  pos: 'left' | 'right';
  text: string;
  isClimax?: boolean;
  isPlayerLine?: boolean;
  soundCue?: 'hover' | 'select' | 'paper' | 'damage' | 'drone' | 'break';
}

const CHAPTER_1_SCRIPT: DialogueStep[] = [
  // ==========================================
  // PHASE 1: THE DISCUSSION ABOUT THE GAME
  // ==========================================
  {
    id: 1,
    phase: 1,
    speaker: 'May Jewel',
    characterId: 'may_jewel',
    pos: 'left',
    text: 'Look at what I found tucked behind the dormitory archive shelf... A 1998 student notebook detailing an occult seance: The Mirror-Well Pact.',
    soundCue: 'paper',
  },
  {
    id: 2,
    phase: 1,
    speaker: 'Ye Yint Hein',
    characterId: 'ye_yint_hein',
    pos: 'right',
    text: "A 90s ghost game? Who's going to scream first? It's just an old superstition the seniors invented to frighten freshmen.",
    soundCue: 'hover',
  },
  {
    id: 3,
    phase: 1,
    speaker: 'Moe Stheinkha',
    characterId: 'moe_stheinkha',
    pos: 'left',
    text: 'Keep your voice down, Ye Yint. The caretaker specifically warned everyone never to trespass into this abandoned wing after midnight.',
  },
  {
    id: 4,
    phase: 1,
    speaker: 'Hsu Myat Shein',
    characterId: 'hsu_myat_shein',
    pos: 'right',
    text: 'My grandmother warned me about this building... She said a senior named Mama May vanished here in August 1998, and her spirit never left.',
  },
  {
    id: 5,
    phase: 1,
    speaker: 'Yin Min Htike',
    characterId: 'yin_min_htike',
    pos: 'left',
    text: 'Look at this floorplan from the university registrar. Pathway 326 was walled off immediately after her disappearance. They claimed it was structural instability.',
    soundCue: 'paper',
  },
  {
    id: 6,
    phase: 1,
    speaker: 'Mona',
    characterId: 'mona',
    pos: 'right',
    text: "If you're all terrified, we can pack up our bags right now. But if we want the truth of what happened in 1998, we follow the ritual rules.",
  },
  {
    id: 7,
    phase: 1,
    speaker: 'May Jewel',
    characterId: 'may_jewel',
    pos: 'left',
    text: 'Gather close around the table. Here is the letter board and the tea glass. Everyone place the tip of your index finger on the rim of the glass.',
  },
  {
    id: 8,
    phase: 1,
    speaker: 'Ye Yint Hein',
    characterId: 'ye_yint_hein',
    pos: 'right',
    text: "Done. My finger is on it. Let's see if this 'guardian spirit' really exists.",
  },
  {
    id: 9,
    phase: 1,
    speaker: 'Moe Stheinkha',
    characterId: 'moe_stheinkha',
    pos: 'left',
    text: 'Remember the cardinal rule: whatever happens, do NOT break the circle or lift your finger until the spirit dismisses us.',
    soundCue: 'select',
  },

  // ==========================================
  // PHASE 2: PLAYING THE GAME & THINGS GO WRONG
  // ==========================================
  {
    id: 10,
    phase: 2,
    speaker: 'May Jewel',
    characterId: 'may_jewel',
    pos: 'left',
    text: 'Spirits of August 1998... Restless soul of the hostel corridor... If you dwell within these walls, answer our call and make your presence known.',
    soundCue: 'drone',
  },
  {
    id: 11,
    phase: 2,
    speaker: 'Hsu Myat Shein',
    characterId: 'hsu_myat_shein',
    pos: 'right',
    text: 'Wait... did someone open the window? My breath is turning to mist... The air in this room suddenly dropped like ice.',
  },
  {
    id: 12,
    phase: 2,
    speaker: 'Moe Stheinkha',
    characterId: 'moe_stheinkha',
    pos: 'left',
    text: "Look at the red candle! The flame is trembling violently... and it's turning deep indigo blue! Don't move!",
  },
  {
    id: 13,
    phase: 2,
    speaker: 'Ye Yint Hein',
    characterId: 'ye_yint_hein',
    pos: 'right',
    text: "Hey, cut it out! Which one of you is pushing the glass? Don't mess around, stop pulling it!",
  },
  {
    id: 14,
    phase: 2,
    speaker: 'Yin Min Htike',
    characterId: 'yin_min_htike',
    pos: 'left',
    text: "Nobody is pushing it! Look at our knuckles, we're barely touching the rim! The glass is gliding across the paper on its own!",
  },
  {
    id: 15,
    phase: 2,
    speaker: 'Mona',
    characterId: 'mona',
    pos: 'right',
    text: 'It is spelling out letters... M... A... M... A... It is spelling Mama May!',
  },
  {
    id: 16,
    phase: 2,
    speaker: 'Hsu Myat Shein',
    characterId: 'hsu_myat_shein',
    pos: 'right',
    text: "A cold breath just whispered across the back of my neck... 'Why did you leave me in the dark?'",
  },
  {
    id: 17,
    phase: 2,
    speaker: 'Moe Stheinkha',
    characterId: 'moe_stheinkha',
    pos: 'left',
    text: 'Listen! Outside the wooden door... Heavy, wet barefoot steps dragging across the corridor floorboards!',
  },
  {
    id: 18,
    phase: 2,
    speaker: 'Ye Yint Hein',
    characterId: 'ye_yint_hein',
    pos: 'right',
    text: 'The glass is vibrating violently! It is spinning in circles! PULL YOUR HANDS AWAY!',
  },
  {
    id: 19,
    phase: 2,
    speaker: 'May Jewel',
    characterId: 'may_jewel',
    pos: 'left',
    text: 'NO! KEEP YOUR HANDS ON THE GLASS—IF THE VESSEL SHATTERS THE VEIL OPENS—',
    isClimax: true,
    soundCue: 'break',
  },

  // ==========================================
  // PHASE 3: WANDERING 1998 & THE ENCOUNTER
  // ==========================================
  {
    id: 20,
    phase: 3,
    speaker: 'Player',
    characterId: 'player',
    pos: 'left',
    isPlayerLine: true,
    text: 'Ugh... My head is throbbing... What happened? Where did everyone go?!',
    soundCue: 'paper',
  },
  {
    id: 21,
    phase: 3,
    speaker: 'Player',
    characterId: 'player',
    pos: 'left',
    isPlayerLine: true,
    text: 'The room looks different... The modern fluorescent bulbs are gone, replaced by a flickering kerosene lantern. On the wall, the calendar reads: AUGUST 1998.',
  },
  {
    id: 22,
    phase: 3,
    speaker: 'Player',
    characterId: 'player',
    pos: 'left',
    isPlayerLine: true,
    text: 'The glass shattered on the table, but the door is swinging wide open into the hallway. Pathway 326 is not walled off... I am truly back in 1998.',
  },
  {
    id: 23,
    phase: 3,
    speaker: 'Mama May (1998)',
    characterId: 'mama_may',
    pos: 'right',
    text: 'You heard my cry through the shattered vessel... After twenty-eight years, someone finally stepped into my memory.',
    soundCue: 'drone',
  },
  {
    id: 24,
    phase: 3,
    speaker: 'Player',
    characterId: 'player',
    pos: 'left',
    isPlayerLine: true,
    text: 'Mama May?! You are the student from the missing archives! What happened to you in this hostel?',
  },
  {
    id: 25,
    phase: 3,
    speaker: 'Mama May (1998)',
    characterId: 'mama_may',
    pos: 'right',
    text: 'They told the school I fled the city... But the caretaker was paid five thousand kyats to seal me beneath the dried courtyard well. Look beneath the floorboard.',
  },
  {
    id: 26,
    phase: 3,
    speaker: 'Player',
    characterId: 'player',
    pos: 'left',
    isPlayerLine: true,
    text: 'An iron box! Inside is the caretaker’s private ledger and a heavy brass well key labeled: CHAPTER 2.',
    soundCue: 'select',
  },
  {
    id: 27,
    phase: 3,
    speaker: 'Mama May (1998)',
    characterId: 'mama_may',
    pos: 'right',
    text: 'Take the key and the ledger. The truth of the ritual begins in the courtyard. Go... and find who took my breath away.',
    soundCue: 'drone',
  },
];

export const VisualNovelEngine: React.FC = () => {
  const navigate = useNavigate();
  const { completeChapter } = useGameProgress();

  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());
  const [isPauseOpen, setIsPauseOpen] = useState<boolean>(false);
  const [isShattering, setIsShattering] = useState<boolean>(false);
  const [showCharacterSelect, setShowCharacterSelect] = useState<boolean>(false);
  const [selectedCharacter, setSelectedCharacter] = useState<MCCharacter>(CHARACTERS[0]);
  const [isChapterFinished, setIsChapterFinished] = useState<boolean>(false);

  const currentLine = CHAPTER_1_SCRIPT[currentLineIndex] || CHAPTER_1_SCRIPT[0];
  const currentPhase = currentLine.phase;

  // Resolve dynamic speaker name & character ID for player lines
  const activeSpeakerName = currentLine.isPlayerLine
    ? selectedCharacter.name
    : currentLine.speaker;

  const activeCharacterId = currentLine.isPlayerLine
    ? selectedCharacter.id
    : currentLine.characterId;

  // Typewriter effect
  useEffect(() => {
    if (showCharacterSelect || isShattering || isChapterFinished) return;

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
    }, 20);

    // Audio cue trigger per step
    if (currentLine.soundCue) {
      if (currentLine.soundCue === 'paper') sound.playPaperRustle();
      else if (currentLine.soundCue === 'select') sound.playMenuSelect();
      else if (currentLine.soundCue === 'hover') sound.playMenuHover();
      else if (currentLine.soundCue === 'drone') sound.playDramaticSting();
      else if (currentLine.soundCue === 'break') sound.playGlassBreak();
    }

    return () => clearInterval(interval);
  }, [currentLineIndex, showCharacterSelect, isShattering, isChapterFinished]);

  // Keyboard navigation: Enter / Space to advance, Esc to pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPauseOpen((prev) => !prev);
        sound.playPaperRustle();
        return;
      }

      if (isPauseOpen || isShattering || showCharacterSelect || isChapterFinished) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        advanceDialogue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentLineIndex, isTyping, isPauseOpen, isShattering, showCharacterSelect, isChapterFinished]);

  // Advance dialogue or skip typewriter
  const advanceDialogue = () => {
    if (isTyping) {
      setDisplayedText(currentLine.text);
      setIsTyping(false);
      return;
    }

    // If at the climax of Phase 2 (Line 19), trigger shatter shockwave and transition to character selection
    if (currentLine.isClimax) {
      triggerShatterTransition();
      return;
    }

    // If reached end of script in Phase 3
    if (currentLineIndex >= CHAPTER_1_SCRIPT.length - 1) {
      finishChapter();
      return;
    }

    setCurrentLineIndex((prev) => prev + 1);
  };

  // Shatter shockwave & blackout transition -> Character Select
  const triggerShatterTransition = () => {
    setIsShattering(true);
    sound.playGlassBreak();

    setTimeout(() => {
      setIsShattering(false);
      setShowCharacterSelect(true);
    }, 1400);
  };

  // Called when the player selects their investigator
  const handleCharacterSelected = (characterId: MCId) => {
    const chosen = CHARACTERS.find((c) => c.id === characterId) || CHARACTERS[0];
    setSelectedCharacter(chosen);
    setShowCharacterSelect(false);
    // Proceed to Phase 3 (Line index 19 is Step 20)
    setCurrentLineIndex(19);
  };

  // Finish Chapter 1 & Unlock Chapter 2
  const finishChapter = () => {
    completeChapter(1);
    sound.playSuccessTune();
    setIsChapterFinished(true);
  };

  // Restart Chapter 1
  const handleRestartChapter = () => {
    setCurrentLineIndex(0);
    setShowCharacterSelect(false);
    setIsChapterFinished(false);
    setIsPauseOpen(false);
    sound.playPaperRustle();
  };

  const toggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  return (
    <div className="relative w-full h-full min-h-[620px] flex flex-col justify-between overflow-hidden select-none">
      {/* Dynamic Phase Ambient Tint Overlay over uni_room_chp1_bg1 */}
      <div
        className={`absolute inset-0 pointer-events-none transition-colors duration-1000 z-0 ${
          currentPhase === 1
            ? 'bg-stone-950/40 bg-gradient-to-t from-stone-950/90 via-transparent to-black/30'
            : currentPhase === 2
            ? 'bg-red-950/30 bg-gradient-to-t from-black via-red-950/30 to-black/40'
            : 'bg-black/50 bg-gradient-to-t from-black via-stone-950/70 to-black/50'
        }`}
      />

      {/* Glass Shatter & Blackout Shockwave Effect */}
      {isShattering && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center animate-pulse p-6 text-center">
          <div
            className="text-5xl md:text-7xl font-black text-rose-600 tracking-widest drop-shadow-[0_0_35px_rgba(225,29,72,0.8)]"
            style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
          >
            ⚡ THE VEIL SHATTERS ⚡
          </div>
          <p className="text-stone-300 font-mono text-xs md:text-sm mt-4 tracking-widest uppercase">
            The offering vessel fractures... Blackout into August 1998...
          </p>
        </div>
      )}

      {/* Character Selection Screen (Displayed After Shatter Blackout) */}
      <AnimatePresence>
        {showCharacterSelect && (
          <div className="absolute inset-0 z-40 bg-stone-950/95 flex flex-col">
            <CharacterSelectScreen onSelectCharacter={handleCharacterSelected} />
          </div>
        )}
      </AnimatePresence>

      {/* Top Header Status Bar */}
      <div className="relative w-full p-4 sm:p-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          {/* Phase Badge */}
          <div className="px-3.5 py-1.5 bg-stone-950/90 border border-amber-500/80 rounded-lg text-xs font-mono font-bold tracking-wider text-amber-300 shadow-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span className="uppercase">
              Phase {currentPhase} / 3 : {currentPhase === 1 ? 'The Discussion' : currentPhase === 2 ? 'The Seance' : '1998 Temporal Echo'}
            </span>
          </div>

          {currentPhase === 3 && (
            <span className="text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-700/60 px-2.5 py-1 rounded-md hidden sm:inline font-semibold">
              Playing as: {selectedCharacter.name}
            </span>
          )}

          <span className="text-xs font-mono text-stone-400 hidden md:inline">
            Step {currentLineIndex + 1} of {CHAPTER_1_SCRIPT.length}
          </span>
        </div>

        {/* Audio & Pause Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg bg-stone-950/80 border border-stone-800 text-stone-300 hover:text-amber-300 hover:border-amber-600 transition-all cursor-pointer shadow-md"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              setIsPauseOpen(true);
              sound.playPaperRustle();
            }}
            className="p-2 rounded-lg bg-stone-950/80 border border-stone-800 text-stone-300 hover:text-amber-300 hover:border-amber-600 transition-all cursor-pointer shadow-md"
            title="Pause Menu [ESC]"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Character Portraits Area (Left & Right Slots) */}
      <div className="relative w-full max-w-5xl mx-auto flex items-end justify-between px-4 sm:px-12 h-60 sm:h-72 md:h-80 pointer-events-none z-10">
        {/* Left Slot Character (Player in Phase 3) */}
        <div className="relative h-full flex items-end">
          <InkPortrait
            characterId={currentLine.pos === 'left' ? activeCharacterId : currentPhase === 3 ? selectedCharacter.id : 'may_jewel'}
            speakerName={currentLine.pos === 'left' ? activeSpeakerName : currentPhase === 3 ? selectedCharacter.name : undefined}
            isSpeaking={currentLine.pos === 'left'}
            position="left"
            size="lg"
          />
        </div>

        {/* Right Slot Character (Mama May in Phase 3) */}
        <div className="relative h-full flex items-end">
          <InkPortrait
            characterId={currentLine.pos === 'right' ? activeCharacterId : currentPhase === 3 ? 'mama_may' : 'hsu_myat_shein'}
            speakerName={currentLine.pos === 'right' ? activeSpeakerName : currentPhase === 3 ? 'Mama May (1998)' : undefined}
            isSpeaking={currentLine.pos === 'right'}
            position="right"
            size="lg"
          />
        </div>
      </div>

      {/* Thematic Dialogue Box Area */}
      <div className="relative w-full max-w-4xl mx-auto px-4 pb-4 sm:pb-8 z-20">
        <div
          onClick={advanceDialogue}
          className="w-full relative rounded-2xl bg-stone-950/90 backdrop-blur-xl border-2 border-amber-900/60 p-5 sm:p-7 shadow-2xl transition-all duration-200 cursor-pointer hover:border-amber-600/80 group ring-1 ring-black/80"
        >
          {/* Subtle Vintage Wood/Lacquer Corner Accents */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-500/60 pointer-events-none" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-500/60 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-500/60 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-500/60 pointer-events-none" />

          {/* Speaker Name Header */}
          <div className="flex items-center justify-between mb-3 border-b border-stone-800/80 pb-2">
            <div className="flex items-center gap-2">
              <span
                className="text-xl sm:text-2xl font-black tracking-wider uppercase text-amber-400 drop-shadow"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
              >
                {activeSpeakerName}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase hidden sm:inline">
                [{currentPhase === 3 ? '1998 TEMPORAL DISPLACEMENT' : '1998 HOSTEL INVESTIGATION'}]
              </span>
            </div>

            <span className="text-[11px] font-mono text-amber-500/80">
              {isTyping ? 'Typing...' : 'Ready'}
            </span>
          </div>

          {/* Dialogue Text Body with Smooth Typewriter Effect */}
          <p className="text-stone-100 font-sans text-sm sm:text-base md:text-lg leading-relaxed min-h-[56px] sm:min-h-[64px] tracking-wide select-text">
            {displayedText}
            {isTyping && <span className="inline-block w-2 h-4 bg-amber-400 ml-1 animate-pulse" />}
          </p>

          {/* Click to Advance Hint */}
          <div className="mt-4 flex items-center justify-between text-xs font-mono text-stone-400 border-t border-stone-800/60 pt-2">
            <span className="text-[11px] text-stone-400">
              Press <span className="text-amber-400 font-bold">[ENTER]</span> or <span className="text-amber-400 font-bold">[SPACE]</span>
            </span>

            <div className="flex items-center gap-1 text-amber-400 group-hover:translate-x-1 transition-transform">
              <span className="font-semibold">{currentLine.isClimax ? 'TRIGGER CLIMAX' : 'CONTINUE'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Chapter 1 Complete Modal with Chapter 2 Unlock Trigger */}
      <AnimatePresence>
        {isChapterFinished && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl bg-stone-950 border-2 border-amber-500 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.4)] text-center"
            >
              {/* Header Icon */}
              <div className="w-16 h-16 rounded-full bg-amber-950/80 border-2 border-amber-500 mx-auto flex items-center justify-center mb-4 text-amber-400 shadow-xl">
                <Key className="w-8 h-8" />
              </div>

              {/* Title & Archival Stamp */}
              <span className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase">
                INVESTIGATION MILESTONE
              </span>
              <h3
                className="text-3xl sm:text-4xl font-black text-stone-100 tracking-wider uppercase mt-1 mb-1"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
              >
                CHAPTER 1 COMPLETED
              </h3>
              <p className="text-amber-400 font-mono text-xs mb-2 font-bold">
                INVESTIGATOR: {selectedCharacter.name.toUpperCase()} ({selectedCharacter.archetype.toUpperCase()})
              </p>
              <p className="text-stone-300 text-xs sm:text-sm font-mono mb-6 leading-relaxed">
                You survived the temporal breach, uncovered the Caretaker’s 1998 Bribe Ledger, and retrieved the Courtyard Dried Well Key.
              </p>

              {/* Unlock Announcement Box */}
              <div className="p-4 rounded-xl bg-amber-950/50 border border-amber-600/80 flex items-center justify-center gap-3 text-amber-200 text-sm font-mono mb-6">
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                <span className="font-bold">CHAPTER 2: UNDERSTANDING IS NOW UNLOCKED!</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    sound.playMenuSelect();
                    navigate('/chapters/2');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", fontSize: '1.15rem' }}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>ENTER CHAPTER 2</span>
                </button>

                <button
                  onClick={() => {
                    sound.playMenuSelect();
                    navigate('/chapters');
                  }}
                  className="py-3 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 font-bold uppercase tracking-wider transition-all cursor-pointer"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", fontSize: '1.15rem' }}
                >
                  CHAPTER SELECT
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pause Modal */}
      <PauseModal
        isOpen={isPauseOpen}
        onClose={() => setIsPauseOpen(false)}
        onRestart={handleRestartChapter}
        onQuit={() => navigate('/chapters')}
      />
    </div>
  );
};
