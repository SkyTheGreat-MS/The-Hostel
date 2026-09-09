import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../audioEngine';
import { StatementVeracity, NatInquiryOption } from '../types';
import { Sparkles, AlertTriangle, ShieldAlert } from 'lucide-react';

export interface NatDialogueViewProps {
  composure: number;
  setComposure: React.Dispatch<React.SetStateAction<number>>;
  onConcludeAudience: () => void;
  characterName?: string;
  addDiscoveredClue?: (clueId: string) => void;
  discoveredClues?: string[];
  initialOpeningComplete?: boolean;
}

export interface NatInquiryWithClue extends NatInquiryOption {
  clueId: string;
}

export const NAT_INQUIRIES: NatInquiryWithClue[] = [
  {
    id: 'inquiry_who_haunts',
    label: 'Who is the woman haunting this wing?',
    playerLine: 'Who is the woman haunting this wing?',
    clueId: 'nat_testimony_may_murder',
    natResponses: [
      {
        text: "Her name was May. A warden's favorite, choke-strangled in the quiet dark of monsoon week. Her grievance anchors this entire floor.",
        veracity: 'truth',
        caseNoteSnippet: '[NOTE: May was strangled inside the hostel during monsoon term 1998.]',
        spritePose: 'neutral',
      },
    ],
  },
  {
    id: 'inquiry_locker_14_key',
    label: 'Where can I find the key to Locker 14?',
    playerLine: 'Where can I find the key to Locker 14?',
    clueId: 'nat_testimony_locker_key',
    natResponses: [
      {
        text: 'The key was thrown into the incinerator behind the mess hall. You will never open it.',
        veracity: 'deceit',
        caseNoteSnippet:
          '[NOTE: Nat claimed the key was incinerated behind the mess hall. DEDUCTION: Contradicts Locker 32 notes confirming May carries the key around her neck—a deliberate deceit.]',
        spritePose: 'pensive',
      },
    ],
  },
  {
    id: 'inquiry_caretaker_attack',
    label: "Why did she attack me in the Caretaker's office?",
    playerLine: "Why did she attack me in the Caretaker's office?",
    clueId: 'nat_testimony_office_attack',
    natResponses: [
      {
        text: 'She guards what was taken from her. The one who silenced her fled toward the courtyard. Until her neck is freed of shame, every living soul looks like her murderer.',
        veracity: 'truth',
        caseNoteSnippet: '[NOTE: May mistakes anyone in the office for her killer until calmed.]',
        spritePose: 'warning',
      },
    ],
  },
  {
    id: 'inquiry_dried_well',
    label: 'How do I reach the dried well outside?',
    playerLine: 'How do I reach the dried well outside?',
    clueId: 'nat_testimony_banyan_well',
    natResponses: [
      {
        text: '...The dry mouth beneath the banyan tree cannot be spoken of. To name the pit is to drown within it.',
        veracity: 'forbidden_silence',
        caseNoteSnippet:
          '[NOTE: The dry mouth beneath the banyan tree cannot be spoken of. To name the pit is to drown within it.]',
        spritePose: 'warning',
      },
    ],
  },
];

export interface OpeningSequenceItem {
  speaker: string;
  text: string;
  pose: 'neutral' | 'pensive' | 'warning';
}

export const OPENING_SEQUENCE: OpeningSequenceItem[] = [
  {
    speaker: 'Hostel Guardian Nat',
    text: 'You are not of 1998. Your soul smells of cold glass and synthetic lights... You do not belong in this corridor. Why have you awakened me?',
    pose: 'neutral',
  },
  {
    speaker: 'Moe',
    text: "I didn't choose to be here. We held a ritual in Room 4B in the future... something dragged me back into this maze.",
    pose: 'neutral',
  },
  {
    speaker: 'Hostel Guardian Nat',
    text: 'The wheel turns backward... I understand now. You seek an exit. But the spirit who wanders this wing will tear your flesh before you ever touch the outer gate.',
    pose: 'pensive',
  },
  {
    speaker: 'Hostel Guardian Nat',
    text: 'Ask what you will. Yet know this: the laws of this threshold bind my tongue. For every truth I bestow upon you, the shadows weave a falsehood. Believe blindly, and you will share her grave.',
    pose: 'warning',
  },
];

export const NatDialogueView: React.FC<NatDialogueViewProps> = ({
  composure,
  setComposure,
  onConcludeAudience,
  characterName = 'Moe',
  addDiscoveredClue,
  discoveredClues = [],
  initialOpeningComplete = false,
}) => {
  const [openingStep, setOpeningStep] = useState<number>(0);
  const [isOpeningComplete, setIsOpeningComplete] = useState<boolean>(initialOpeningComplete);
  const [currentPose, setCurrentPose] = useState<'neutral' | 'pensive' | 'warning'>(
    initialOpeningComplete ? 'warning' : OPENING_SEQUENCE[0].pose
  );
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [activeResponseText, setActiveResponseText] = useState<string>(
    'Ask what you will. Yet know this: the laws of this threshold bind my tongue. For every truth I bestow upon you, the shadows weave a falsehood. Believe blindly, and you will share her grave.'
  );
  const [isShuddering, setIsShuddering] = useState<boolean>(false);
  const [isScreenGlitching, setIsScreenGlitching] = useState<boolean>(false);
  const [interrogatedInquiryIds, setInterrogatedInquiryIds] = useState<string[]>([]);

  const [isDialogueActive, setIsDialogueActive] = useState<boolean>(initialOpeningComplete);

  useEffect(() => {
    if (!isDialogueActive) {
      const timer = setTimeout(() => {
        setIsDialogueActive(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isDialogueActive]);

  // Accelerated Composure Decay: -1% every 8s while the inquiry screen is open
  useEffect(() => {
    if (!isOpeningComplete) return;

    const timer = setInterval(() => {
      setComposure((prev) => Math.max(5, prev - 1));
    }, 8000);

    return () => clearInterval(timer);
  }, [isOpeningComplete, setComposure]);

  // Handle advancing through the scripted opening sequence
  const handleAdvanceOpening = () => {
    sound.playMenuSelect();
    const nextStep = openingStep + 1;
    if (nextStep < OPENING_SEQUENCE.length) {
      setOpeningStep(nextStep);
      setCurrentPose(OPENING_SEQUENCE[nextStep].pose);
    } else {
      setIsOpeningComplete(true);
      setCurrentPose('warning');
    }
  };

  // Handle player selecting an inquiry
  const handleSelectInquiry = (inq: NatInquiryWithClue) => {
    sound.playMenuSelect();
    setSelectedInquiryId(inq.id);

    if (!interrogatedInquiryIds.includes(inq.id)) {
      setInterrogatedInquiryIds((prev) => [...prev, inq.id]);
    }

    const response = inq.natResponses[0];
    if (response) {
      setActiveResponseText(response.text);
      if (response.spritePose) {
        setCurrentPose(response.spritePose);
      }

      // Handle Question 4 Forbidden Silence penalty & visual shock
      if (response.veracity === 'forbidden_silence') {
        sound.playStaticGlitch();
        sound.playDamage();
        setIsShuddering(true);
        setIsScreenGlitching(true);

        // Immediate -5% Composure penalty clamped at 5%
        setComposure((prev) => Math.max(5, prev - 5));

        setTimeout(() => {
          setIsShuddering(false);
          setIsScreenGlitching(false);
        }, 750);
      }

      // Auto-log case note to discoveredClues
      if (inq.clueId && addDiscoveredClue && !discoveredClues.includes(inq.clueId)) {
        addDiscoveredClue(inq.clueId);
      }
    }
  };

  // Handle concluding audience with the Nat
  const handleEndAudience = () => {
    sound.playMenuSelect();
    // Ensure all revealed clues from questions asked are logged
    NAT_INQUIRIES.forEach((inq) => {
      if (inq.clueId && addDiscoveredClue) {
        addDiscoveredClue(inq.clueId);
      }
    });
    onConcludeAudience();
  };

  const currentOpening = OPENING_SEQUENCE[openingStep] || OPENING_SEQUENCE[0];

  return (
    <div className="fixed inset-0 z-30 select-none animate-fade-in overflow-hidden pointer-events-none">
      {/* Subtle Ambient Dimming Overlay (Full Viewport, 15% Darkness) */}
      <div className="fixed inset-0 z-20 bg-black/15 backdrop-blur-[1px] pointer-events-none transition-opacity duration-700" />

      {/* Glitch & Static Overlay for Forbidden Silence */}
      {isScreenGlitching && (
        <div className="fixed inset-0 z-50 pointer-events-none bg-rose-950/40 mix-blend-screen animate-pulse flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/20 via-black/60 to-transparent" />
          <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.25)_3px,transparent_4px)]" />
          <div className="font-mono text-rose-300 font-black tracking-widest text-sm uppercase px-4 py-2 bg-black/80 border border-rose-500/80 rounded-lg shadow-2xl">
            [LAW OF REALITY VIOLATION • TABOO UTTERANCE]
          </div>
        </div>
      )}

      {/* Shudder keyframes style */}
      <style>{`
        @keyframes natShudder {
          0% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-5px, 3px) rotate(-1.5deg); }
          40% { transform: translate(5px, -3px) rotate(1.5deg); }
          60% { transform: translate(-4px, -2px) rotate(-1deg); }
          80% { transform: translate(4px, 2px) rotate(1deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        .animate-shudder {
          animation: natShudder 0.15s ease-in-out infinite;
        }
      `}</style>

      {/* Character Baseline Staging (Aligned Eye-Levels & Imposing Nat) */}
      <div className="fixed inset-x-0 bottom-0 top-14 z-30 pointer-events-none flex justify-between items-end px-8 md:px-16 pb-28">
        {/* Left: Player Character (Moe) */}
        <div
          className={`relative flex flex-col items-center pointer-events-auto transition-all duration-700 ease-out ${
            isDialogueActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}
        >
          <img
            src="/assets/characters/moe_bust_thinking.png"
            onError={(e) => {
              e.currentTarget.src = '/assets/characters/moe_fear_bust.png';
            }}
            alt={characterName || 'Moe'}
            className="h-[52vh] max-h-[500px] w-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] filter contrast-[1.02] brightness-95"
          />
          <div className="mt-1 px-3 py-0.5 rounded bg-[#0b120e]/85 border border-[#22352b] text-center">
            <span className="font-mono text-xs text-[#a3c2b2] tracking-wider uppercase block">
              {characterName || 'Moe'}
            </span>
            <span className="font-mono text-[10px] text-[#5a7a69]">
              Composure: {composure}%
            </span>
          </div>
        </div>

        {/* Right: Imposing Guardian Nat (Zoomed In, Elevated) */}
        <div
          className={`relative flex flex-col items-center pointer-events-auto transition-all duration-700 ease-out ${
            isDialogueActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          } ${isShuddering ? 'animate-shudder' : ''}`}
        >
          <div className="absolute top-1/4 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="h-[62vh] max-h-[600px] overflow-hidden flex items-start justify-center">
            <img
              src={`/assets/characters/guardian_nat_${currentPose || 'warning'}.png`}
              onError={(e) => {
                e.currentTarget.src = '/assets/characters/guardian_nat_neutral.png';
              }}
              alt="Hostel Guardian Nat"
              className="h-[85vh] max-h-[780px] w-auto object-cover object-top filter drop-shadow-[0_0_25px_rgba(74,122,96,0.45)] brightness-95"
            />
          </div>
          <div className="mt-1 px-3 py-0.5 rounded bg-[#0b120e]/85 border border-[#2d4538] text-center">
            <span className="font-serif italic text-xs text-[#78b394] tracking-widest block">
              Hostel Guardian Nat
            </span>
            <span className="font-mono text-[9px] text-[#4a6b58] uppercase">
              Territorial Spirit
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Zone: Refined Dialogue Box Component */}
      {!isOpeningComplete ? (
        /* Opening Exchange Dialogue Box */
        <div className="fixed bottom-4 inset-x-0 z-40 px-4 flex justify-center pointer-events-none">
          <div
            onClick={handleAdvanceOpening}
            className="w-full max-w-4xl bg-[#0b120e]/92 border border-[#22352b] rounded-xl p-5 shadow-2xl backdrop-blur-md pointer-events-auto flex flex-col justify-between min-h-[140px] cursor-pointer group"
          >
            {/* Header: Speaker & Progress */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1b2b22]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4a7a60] animate-pulse" />
                <span className="font-mono text-xs tracking-wider text-[#78b394] uppercase font-semibold">
                  {currentOpening.speaker}
                </span>
                <span className="font-mono text-[10px] text-[#5a7a69]">
                  • Step {openingStep + 1} of {OPENING_SEQUENCE.length}
                </span>
              </div>
              <span className="font-mono text-[10px] tracking-widest text-[#4d6b5c] uppercase group-hover:text-[#78b394] transition-colors">
                [Click to advance]
              </span>
            </div>

            {/* Spoken Dialogue Line */}
            <div className="my-auto py-1">
              <p className="font-serif italic text-base md:text-lg text-[#d8eae0] font-normal leading-relaxed select-none">
                "{currentOpening.text}"
              </p>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-end pt-2 mt-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdvanceOpening();
                }}
                className="px-4 py-1.5 rounded-lg bg-[#18261f] hover:bg-[#23382c] border border-[#2e4739] text-xs font-mono text-[#a3c2b2] hover:text-white uppercase tracking-wider transition-all cursor-pointer"
              >
                {openingStep === OPENING_SEQUENCE.length - 1 ? 'Begin Interrogation ❯' : 'Continue ❯'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Split Inquiries & Response Log Box */
        <div className="fixed bottom-4 inset-x-0 z-40 px-4 flex justify-center pointer-events-none">
          <div className="w-full max-w-4xl bg-[#0b120e]/92 border border-[#22352b] rounded-xl p-5 shadow-2xl backdrop-blur-md pointer-events-auto flex flex-col justify-between min-h-[190px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left: Player Inquiry Choices */}
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1 mb-1 border-b border-[#1b2b22]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4a7a60] animate-pulse" />
                    <span className="font-mono text-xs tracking-wider text-[#78b394] uppercase font-semibold">
                      Select Inquiry
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#5a7a69]">
                    {interrogatedInquiryIds.length}/4 Explored
                  </span>
                </div>

                <div className="space-y-1.5">
                  {NAT_INQUIRIES.map((inq) => {
                    const isSelected = selectedInquiryId === inq.id;
                    const isAsked = interrogatedInquiryIds.includes(inq.id);
                    return (
                      <button
                        key={inq.id}
                        onClick={() => handleSelectInquiry(inq)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-[#1c2e24] border-[#4a7a60] text-emerald-300 shadow-md ring-1 ring-emerald-500/30'
                            : isAsked
                            ? 'bg-[#101914]/90 hover:bg-[#16241c] border-[#1e2e25] text-[#8fa89b]'
                            : 'bg-[#131f18]/90 hover:bg-[#1a2c22] border-[#273a2f] text-[#cce0d5]'
                        }`}
                      >
                        <span className="line-clamp-1">❯ {inq.label}</span>
                        {isAsked && (
                          <span className="text-[9px] font-mono text-[#5a7a69] uppercase shrink-0">
                            [Asked]
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Active Spoken Response */}
              <div className="flex flex-col justify-between pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-[#1b2b22]">
                <div>
                  <div className="flex items-center justify-between pb-1 mb-2 border-b border-[#1b2b22]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-mono text-xs tracking-wider text-[#78b394] uppercase font-semibold">
                        Hostel Guardian Nat
                      </span>
                    </div>
                    <span className="font-mono text-[10px] tracking-widest text-[#4d6b5c] uppercase">
                      Spoken Response
                    </span>
                  </div>
                  <div className="py-1">
                    <p className="font-serif italic text-base text-[#d8eae0] font-normal leading-relaxed select-none min-h-[64px]">
                      "{activeResponseText}"
                    </p>
                  </div>
                </div>

                {/* Footer info & exit */}
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#1b2b22]">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-red-400/80">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                    <span>Composure -1% / 8s</span>
                  </div>
                  <button
                    onClick={handleEndAudience}
                    className="px-4 py-1.5 rounded-lg bg-[#18261f] hover:bg-[#23382c] border border-[#2e4739] text-xs font-mono text-[#a3c2b2] hover:text-white uppercase tracking-wider transition-all cursor-pointer shadow-md hover:scale-[1.02] active:scale-95"
                  >
                    Conclude Audience ❯
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NatDialogueView;
