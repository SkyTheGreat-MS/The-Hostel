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
    <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-sm flex flex-col justify-between p-6 select-none animate-fade-in overflow-hidden">
      {/* Glitch & Static Overlay for Forbidden Silence */}
      {isScreenGlitching && (
        <div className="absolute inset-0 z-50 pointer-events-none bg-rose-950/40 mix-blend-screen animate-pulse flex items-center justify-center overflow-hidden">
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

      {/* Top Zone: Portraits & Presence */}
      <div className="flex-1 relative flex items-center justify-between px-8">
        {/* Left: Player Profile / Composure Aura */}
        <div className="flex flex-col items-center space-y-3 opacity-90">
          <div className="w-24 h-24 rounded-full border-2 border-[#3f5e4d] overflow-hidden bg-[#121c16] shadow-xl relative">
            <img
              src="/assets/characters/player_moe_portrait.png"
              onError={(e) => {
                e.currentTarget.src = '/assets/msk_1.png';
              }}
              alt={characterName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-emerald-500/20 rounded-full pointer-events-none" />
          </div>
          <div className="flex flex-col items-center">
            <span className="font-mono text-xs text-[#8fa89b] tracking-wider uppercase">
              {characterName} (Lost)
            </span>
            <span className="font-mono text-[10px] text-amber-300/80 mt-0.5">
              Composure: {composure}%
            </span>
          </div>
        </div>

        {/* Right: Guardian Nat Sprite */}
        <div className="relative flex flex-col items-center">
          <div
            className={`w-64 h-80 relative flex items-center justify-center transition-transform ${
              isShuddering ? 'animate-shudder' : ''
            }`}
          >
            <img
              src={`/assets/characters/guardian_nat_${currentPose}.png`}
              onError={(e) => {
                e.currentTarget.src = '/assets/characters/guardian_nat_neutral.png';
              }}
              alt="Guardian Nat"
              className="h-full object-contain filter drop-shadow-[0_0_20px_rgba(74,122,96,0.6)] contrast-95 brightness-90"
            />
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span className="font-serif italic text-sm text-emerald-300 tracking-widest">
              Hostel Guardian Nat
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Zone: Scripted Opening vs. Split Inquiries & Response Log */}
      {!isOpeningComplete ? (
        /* Opening Exchange Card */
        <div
          onClick={handleAdvanceOpening}
          className="w-full max-w-4xl mx-auto bg-[#0a100d]/95 border border-[#273830] hover:border-[#3f5c4c] rounded-xl p-5 shadow-2xl space-y-3 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between border-b border-[#1f2d26] pb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                {currentOpening.speaker}
              </span>
              <span className="text-[10px] font-mono text-stone-400">
                [Audience Rite • Step {openingStep + 1} of {OPENING_SEQUENCE.length}]
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#8fa89b] group-hover:text-emerald-300 transition-colors">
              Click anywhere to advance →
            </span>
          </div>

          <p className="font-serif italic text-sm md:text-base text-[#e2f0e8] leading-relaxed min-h-[48px]">
            "{currentOpening.text}"
          </p>

          <div className="flex justify-end pt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAdvanceOpening();
              }}
              className="px-4 py-1.5 rounded bg-[#1c2c23] hover:bg-[#283e32] border border-[#3b5445] text-xs font-mono tracking-wider text-emerald-200 uppercase cursor-pointer transition-colors"
            >
              {openingStep === OPENING_SEQUENCE.length - 1 ? 'Begin Interrogation' : 'Continue ❯'}
            </button>
          </div>
        </div>
      ) : (
        /* Split Inquiries & Response Log */
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0a100d]/95 border border-[#273830] rounded-xl p-4 shadow-2xl">
          {/* Left: Player Inquiry Buttons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono tracking-widest text-[#5a7a69] uppercase block">
                Inquiries (Accelerated Decay Active):
              </span>
              <span className="text-[9px] font-mono text-emerald-400/80">
                {interrogatedInquiryIds.length}/4 Explored
              </span>
            </div>
            {NAT_INQUIRIES.map((inq) => {
              const isSelected = selectedInquiryId === inq.id;
              const isAsked = interrogatedInquiryIds.includes(inq.id);
              return (
                <button
                  key={inq.id}
                  onClick={() => handleSelectInquiry(inq)}
                  className={`w-full text-left p-2.5 rounded border text-xs font-mono transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-[#1f3027] border-[#4a7a60] text-emerald-300 shadow-md ring-1 ring-emerald-500/30'
                      : isAsked
                      ? 'bg-[#101914] hover:bg-[#192720] border-[#223329] text-[#9bb3a6]'
                      : 'bg-[#131f18] hover:bg-[#1f3027] border-[#2a3f33] text-[#cce0d5]'
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

          {/* Right: Active Spoken Response */}
          <div className="flex flex-col justify-between p-2 border-l border-[#1d2b23]">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#8fa89b] uppercase tracking-wider border-b border-[#17241d] pb-1">
                <span>Guardian Nat's Spoken Utterance</span>
              </div>
              <p className="font-serif italic text-xs md:text-sm text-[#e2f0e8] leading-relaxed min-h-[64px]">
                "{activeResponseText}"
              </p>
            </div>

            <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#17241d]">
              <div className="flex items-center gap-1 text-[9px] font-mono text-red-400/80">
                <AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" />
                <span>Composure -1% / 8s</span>
              </div>
              <button
                onClick={handleEndAudience}
                className="px-3 py-1.5 rounded bg-[#1c2c23] hover:bg-[#283e32] border border-[#3b5445] text-[10px] font-mono tracking-wider text-emerald-200 uppercase cursor-pointer transition-colors shadow-md hover:scale-[1.02] active:scale-95"
              >
                Conclude Audience [Leave Altar]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NatDialogueView;
