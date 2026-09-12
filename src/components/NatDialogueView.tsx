import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../audioEngine';
import {
  StatementVeracity,
  NatInquiryOption,
  NatKnowledgeTier,
  NatTopicDef,
  NAT_TOPIC_REGISTRY,
  NatKnowledgeEntry,
  NAT_KNOWLEDGE_BASE,
  getNatKnowledge,
} from '../types';
import { ITEM_DATABASE } from '../gameData';
import { MASTER_CLUES } from './CaseNotesModal';
import { AlertTriangle } from 'lucide-react';

export {
  type NatKnowledgeTier,
  type NatTopicDef,
  NAT_TOPIC_REGISTRY,
  type NatKnowledgeEntry,
  NAT_KNOWLEDGE_BASE,
  getNatKnowledge,
};

export interface CaseNoteItem {
  id: string;
  title: string;
  category?: string;
  snippet?: string;
  location?: string;
  description?: string;
}

export interface NatDialogueViewProps {
  composure: number;
  setComposure: React.Dispatch<React.SetStateAction<number>>;
  onConcludeAudience: () => void;
  characterName?: string;
  characterPortrait?: string;
  addDiscoveredClue?: (clueId: string) => void;
  discoveredClues?: string[];
  unlockedClues?: string[];
  initialOpeningComplete?: boolean;
  askedTopics?: string[];
  setAskedTopics?: React.Dispatch<React.SetStateAction<string[]>>;
  applyComposureShock?: (amount: number) => void;
  // Item / Clue Presentation Cross-Examination props
  inventory?: string[];
  caseNotes?: CaseNoteItem[];
  onSelectTarget?: (targetId: string, type: 'item' | 'clue') => void;
  activeResponse?: string;
}

export type NatDialogueProps = NatDialogueViewProps;

export interface NatInquiryWithClue extends NatInquiryOption {
  clueId: string;
}

export const NAT_INQUIRIES: NatInquiryWithClue[] = [
  {
    id: 'inquiry_who_haunts',
    label: 'ဒီအဆောင်ကို ခြောက်လှန့်နေတာ ဘယ်သူလဲ?',
    playerLine: 'Who is the woman haunting this wing?',
    clueId: 'nat_testimony_may_murder',
    natResponses: [
      {
        text: "နာမည်ကမေ… မိုးရာသီတစ်ပတ်မှာ လည်ပင်းညှစ်သတ်ခံခဲ့ရတဲ့ အဆောင်မိန်းကလေးပဲ။",
        veracity: 'truth',
        caseNoteSnippet: '[NOTE: May was strangled inside the hostel during monsoon term 1998.]',
        spritePose: 'neutral',
      },
    ],
  },
  {
    id: 'inquiry_locker_14_key',
    label: 'Locker 14 သော့က ဘယ်မှာလဲ?',
    playerLine: 'Where can I find the key to Locker 14?',
    clueId: 'nat_testimony_locker_key',
    natResponses: [
      {
        text: 'မီးဖိုနောက်က မီးဖိုဖျက်စက်ထဲ ပစ်ချခဲ့တယ်။ မင်းဘယ်တော့မှ ဖွင့်လို့မရဘူး။',
        veracity: 'deceit',
        caseNoteSnippet:
          '[NOTE: Nat claimed the key was incinerated behind the mess hall. DEDUCTION: Contradicts Locker 32 notes confirming May carries the key around her neck—a deliberate deceit.]',
        spritePose: 'pensive',
      },
    ],
  },
  {
    id: 'inquiry_caretaker_attack',
    label: "အဆောင်မှူးရုံးမှာ ငါ့ကို ဘာလို့တိုက်ခိုက်တာလဲ?",
    playerLine: "Why did she attack me in the Caretaker's office?",
    clueId: 'nat_testimony_office_attack',
    natResponses: [
      {
        text: 'သူ့ဆီက ယူသွားတာကို သူကစောင့်ရှောက်နေတယ်။ သတ်ခဲ့တဲ့လူက ခြံဝင်းဘက် ထွက်ပြေးသွားတယ်။ အသက်ရှင်နေသူတိုင်းကို လူသတ်သမားလို့ပဲ မြင်နေမှာ…  ',
        veracity: 'truth',
        caseNoteSnippet: '[NOTE: May mistakes anyone in the office for her killer until calmed.]',
        spritePose: 'warning',
      },
    ],
  },
  {
    id: 'inquiry_dried_well',
    label: 'အပြင်က ရေတွင်းခြောက်ဆီ ဘယ်လိုသွားရမလဲ?',
    playerLine: 'How do I reach the dried well outside?',
    clueId: 'nat_testimony_banyan_well',
    natResponses: [
      {
        text: '...ညောင်ပင်အောက်က ရေတွင်းကို မမေးနဲ့… အဲဒီအကြောင်း ပြောလိုက်ရင် မင်းပါ အဲဒီထဲ နစ်သွားလိမ့်မယ်။',
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
    text: 'မင်းက ၁၉၉၈ ခုနှစ်ကလူမဟုတ်ဘူး: မင်းရဲ့ ဝိညာဉ်ထဲမှာ အေးစက်စက် ဖန်ခွက်တွေ၊ အတုအယောင် မီးရောင်တွေရဲ့ အနံ့အသက် ရနေတယ်... မင်းက ဒီစင်္ကြံလမ်းနဲ့ မထိုက်တန်တဲ့သူပဲ။ ဘာလို ငါ့ကို နှိးလိုက်ရတာလဲ',
    pose: 'neutral',
  },
  {
    speaker: 'Moe',
    text: "ငါ ဒီကိုလာချင်လို့ လာတာမဟုတ်ဘူး။ အနာဂတ်မှာ အခန်း 4B မှာ ကစားနေရင်း… တစ်ခုခုက ငါ့ကို ဒီဝင်္ကပါထဲ ပြန်ဆွဲခေါ်လာတာပဲ။",
    pose: 'neutral',
  },
  {
    speaker: 'Hostel Guardian Nat',
    text: 'သံသရာစက်ဘီးက နောက်ပြန်လည်နေပြီပေါ့... အေးလေ၊ ငါ သဘောပေါက်ပါပြီ။ မင်းထွက်ပေါက်ရှာနေတာပဲ: ဒါပေမဲ့ ဒီအဆောင်မှာ လှည့်ပတ်ကျက်စားနေတဲ့ ဝိညာဉ်ဟာ မင်း အပြင်တံခါးဝကို မရောက်ခင်မှာပဲ မင်းရဲ့ အသားစတွေကို ဆုတ်ဖြဲပစ်လိမ့်မယ်',
    pose: 'pensive',
  },
  {
    speaker: 'Hostel Guardian Nat',
    text: 'မင်းယူဆောင်လာတာ ဒါမှမဟုတ် တူးဖော်ရရှိထားတာတွေကို အရှေ့ထုတ်ပြစမ်း! ဒါပေမဲ့ ဒါကိုတော့ မှတ်ထားပါ... ဒီနယ်နိမိတ်ရဲ့ နိယာမတွေက ငါ့ပါးစပ်ကို ချည်နှောင်ထားတယ်။ ငါ မင်းကို အမှန်တရားတစ်ခု ပြောပြတိုင်း၊ အရိပ်မဲတွေက မုသားတစ်ခုကို လုပ်ကြလိမ့်မယ်။ ယုံကြည်မိရင်တော့ မင်းလည်း သူနဲ့အတူ ဂူတစ်ကျင်းတည်း ဝင်ရလိမ့်မယ်',
    pose: 'warning',
  },
];

export const NatDialogueView: React.FC<NatDialogueViewProps> = ({
  composure,
  setComposure,
  onConcludeAudience,
  characterName = 'Moe',
  characterPortrait = '/assets/characters/moe_fear_bust.png',
  addDiscoveredClue,
  discoveredClues = [],
  unlockedClues,
  initialOpeningComplete = false,
  askedTopics: externalAskedTopics,
  setAskedTopics: externalSetAskedTopics,
  applyComposureShock: propApplyComposureShock,
  inventory = [],
  caseNotes,
  onSelectTarget,
  activeResponse,
}) => {
  const [openingStep, setOpeningStep] = useState<number>(0);
  const [isOpeningComplete, setIsOpeningComplete] = useState<boolean>(initialOpeningComplete);
  const [currentPose, setCurrentPose] = useState<'neutral' | 'pensive' | 'warning'>(
    initialOpeningComplete ? 'warning' : OPENING_SEQUENCE[0].pose
  );
  const [activeTab, setActiveTab] = useState<'inventory' | 'clues'>('inventory');
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [activeResponseText, setActiveResponseText] = useState<string>(
    activeResponse || 'Mortals who tread the forgotten halls of 1998... What have you brought before this altar?'
  );
  const [isShuddering, setIsShuddering] = useState<boolean>(false);
  const [isScreenGlitching, setIsScreenGlitching] = useState<boolean>(false);
  const [localAskedTopics, setLocalAskedTopics] = useState<string[]>([]);

  const askedTopics = externalAskedTopics ?? localAskedTopics;
  const effectiveClues = unlockedClues ?? discoveredClues;

  // Build effective Case Notes list from props or discovered clues
  const effectiveCaseNotes: CaseNoteItem[] = React.useMemo(() => {
    if (caseNotes && caseNotes.length > 0) {
      return caseNotes;
    }
    // Deduplicate and map discovered clue IDs to CaseNote items
    const clueList: string[] = effectiveClues.filter((id, i, arr) => arr.indexOf(id) === i);
    return clueList.map((cId: string) => {
      const def = MASTER_CLUES[cId];
      return {
        id: cId,
        title: def ? def.title : cId.replace(/_/g, ' '),
        category: def ? def.category : 'primary',
        description: def ? def.description : '',
        location: def ? def.location : 'Hostel',
      };
    });
  }, [caseNotes, effectiveClues]);

  const [isDialogueActive, setIsDialogueActive] = useState<boolean>(initialOpeningComplete);

  // Sync external activeResponse if provided
  useEffect(() => {
    if (activeResponse) {
      setActiveResponseText(activeResponse);
    }
  }, [activeResponse]);

  // Shock damage application helper
  const applyComposureShock = (damage: number) => {
    if (propApplyComposureShock) {
      propApplyComposureShock(damage);
    }
    setComposure((prev) => Math.max(0, prev - damage));
  };

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

  // Advance scripted opening sequence
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

  // Active list computed for current tab
  const activeList = React.useMemo(() => {
    if (activeTab === 'inventory') {
      return inventory.map((itemId) => {
        const itemDef = (ITEM_DATABASE as Record<string, any>)[itemId];
        const label = itemDef?.shortLabel || itemDef?.name || itemId;
        return {
          id: itemId,
          shortLabel: label,
          title: itemDef?.name || label,
        };
      });
    }
    return effectiveCaseNotes.map((note) => ({
      id: note.id,
      shortLabel: note.title,
      title: note.title,
    }));
  }, [activeTab, inventory, effectiveCaseNotes]);

  // Repeatable cross-examination presentation evaluation with 0.8% question strain
  const handlePresentTarget = (targetId: string, type: 'inventory' | 'clues') => {
    setSelectedTargetId(targetId);
    onSelectTarget?.(targetId, type === 'inventory' ? 'item' : 'clue');

    // Track repeatable inquiries without locking
    const updated = [...askedTopics, targetId];
    if (externalSetAskedTopics) {
      externalSetAskedTopics(updated);
    }
    setLocalAskedTopics(updated);

    // 1. Calculate and deduct the 0.8% question strain
    const questionTax = 0.8;
    setComposure((prev) => Math.max(0, Number((prev - questionTax).toFixed(1))));
    if (propApplyComposureShock) {
      propApplyComposureShock(questionTax);
    }

    // 2. Fetch Nat response from knowledge base
    const knowledge = getNatKnowledge(targetId);

    if (!knowledge || knowledge.tier === 'unknown') {
      try {
        sound.playEerieHum();
      } catch {}
      setActiveResponseText(knowledge?.response || '...');
      setCurrentPose('neutral');
      return;
    }

    if (knowledge.tier === 'forbidden_taboo') {
      try {
        sound.playGhostScreech();
      } catch {}
      const tabooShock = knowledge.shockDamage || 5;
      setComposure((prev) => Math.max(0, Number((prev - tabooShock).toFixed(1))));
      if (propApplyComposureShock) {
        propApplyComposureShock(tabooShock);
      }
      setIsShuddering(true);
      setIsScreenGlitching(true);
      setActiveResponseText(knowledge.response);
      setCurrentPose('warning');
      setTimeout(() => {
        setIsShuddering(false);
        setIsScreenGlitching(false);
      }, 900);
      return;
    }

    // Handle Truth / Deceit
    try {
      sound.playMenuSelect();
    } catch {}
    setActiveResponseText(knowledge.response);
    setCurrentPose(knowledge.spritePose);

    if (knowledge.caseNoteUnlock && addDiscoveredClue) {
      const testimonyKey = `nat_testimony_${targetId}`;
      if (!effectiveClues.includes(testimonyKey)) {
        addDiscoveredClue(testimonyKey);
      }
    }
  };

  // Backward-compatibility wrapper for target selection
  const handleSelectTarget = (targetId: string, type: 'item' | 'clue') => {
    handlePresentTarget(targetId, type === 'item' ? 'inventory' : 'clues');
  };

  // Backward-compatibility wrapper for NatTopicDef
  const handleSelectTopic = (topic: NatTopicDef) => {
    handlePresentTarget(topic.topicId, 'clues');
  };

  // Global dialogue advance for Enter / Space keys
  const handleAdvanceDialogue = () => {
    if (!isOpeningComplete) {
      handleAdvanceOpening();
    } else {
      handleEndAudience();
    }
  };

  // Keyboard navigation: Enter / Space advances opening; keys 1-9 select active list items
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (!isOpeningComplete) {
          e.preventDefault();
          handleAdvanceOpening();
        }
      } else if (isOpeningComplete && e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key, 10) - 1;
        if (activeList[index]) {
          e.preventDefault();
          handlePresentTarget(activeList[index].id, activeTab);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpeningComplete, openingStep, activeTab, activeList, askedTopics]);

  // Conclude audience with the Nat
  const handleEndAudience = () => {
    try {
      sound.playMenuSelect();
    } catch {}
    onConcludeAudience();
  };

  const currentOpening = OPENING_SEQUENCE[openingStep] || OPENING_SEQUENCE[0];

  return (
    <div className="fixed inset-0 z-30 select-none animate-fade-in overflow-hidden pointer-events-none">
      {/* Ambient Dimming Overlay */}
      <div className="fixed inset-0 z-20 bg-black/20 backdrop-blur-[1px] pointer-events-none transition-opacity duration-700" />

      {/* Glitch & Static Overlay for Forbidden Silence / Taboo */}
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

      {/* Character Staging — Same Ground Plane, Leveled, Standing in Room */}
      <div className="fixed inset-x-0 bottom-0 top-14 z-30 pointer-events-none flex justify-between items-end px-8 md:px-16">
        {/* Left: Player Character (Selected Character) — No label box */}
        <div
          className={`relative mb-40 pointer-events-auto transition-all duration-700 ease-out ${
            isDialogueActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}
        >
          <img
            src={characterPortrait}
            onError={(e) => {
              e.currentTarget.src = '/assets/msk_2.png';
            }}
            alt={characterName || 'Moe'}
            className="h-[50vh] max-h-[520px] w-auto object-contain object-bottom -scale-x-100 drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] filter contrast-[1.05] brightness-75 saturate-[0.85]"
          />
        </div>

        {/* Right: Guardian Nat — Larger, Upper Body / Bust Crop */}
        <div
          className={`relative flex flex-col items-center pointer-events-auto transition-all duration-700 ease-out ${
            isDialogueActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          } ${isShuddering ? 'animate-shudder' : ''}`}
        >
          <div className="absolute top-1/3 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="h-[70vh] max-h-[680px] overflow-hidden flex items-start justify-center">
            <img
              src={`/assets/characters/guardian_nat_${currentPose || 'warning'}.png`}
              onError={(e) => {
                e.currentTarget.src = '/assets/characters/guardian_nat_neutral.png';
              }}
              alt="Hostel Guardian Nat"
              className="h-[95vh] max-h-[900px] w-auto object-cover object-top filter drop-shadow-[0_0_25px_rgba(74,122,96,0.45)] brightness-95"
            />
          </div>
          <div className="mt-2 px-3 py-1 rounded bg-[#0b120e]/85 border border-[#2d4538] text-center">
            <span className="font-serif italic text-xs text-[#78b394] tracking-widest block">
              Hostel Guardian Nat
            </span>
            <span className="font-mono text-[9px] text-[#4a6b58] uppercase">
              Territorial Spirit
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Zone: Interrogation Dialogue Box */}
      {!isOpeningComplete ? (
        /* Opening Scripted Exchange */
        <div className="fixed bottom-4 inset-x-0 z-40 px-4 flex justify-center pointer-events-none">
          <div
            onClick={handleAdvanceOpening}
            className="w-full max-w-4xl bg-[#0b120e]/92 border border-[#22352b] rounded-xl p-5 shadow-2xl backdrop-blur-md pointer-events-auto flex flex-col justify-between min-h-[140px] cursor-pointer group"
          >
            {/* Header: Speaker & Step */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1b2b22]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4a7a60] animate-pulse" />
                <span className="font-mono text-xs tracking-wider text-[#78b394] uppercase font-semibold">
                  {currentOpening.speaker === 'Moe' ? characterName : currentOpening.speaker}
                </span>
                <span className="font-mono text-[10px] text-[#4e6b5c]">
                  • Step {openingStep + 1} of {OPENING_SEQUENCE.length}
                </span>
              </div>
              <span className="font-mono text-[10px] tracking-widest text-[#4d6b5c] uppercase group-hover:text-[#78b394] transition-colors">
                [Press Enter ↵ or Space to advance]
              </span>
            </div>

            {/* Spoken Response Container */}
            <div className="py-2 px-1 my-auto">
              <p className="font-serif italic font-extralight text-base md:text-lg text-[#dceddf] tracking-wide leading-relaxed select-none">
                "{currentOpening.text}"
              </p>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-end pt-2 mt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdvanceOpening();
                }}
                className="px-4 py-1.5 rounded-lg bg-[#18261f] hover:bg-[#23382c] border border-[#2e4739] text-xs font-mono text-[#a3c2b2] hover:text-white uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95"
              >
                {openingStep === OPENING_SEQUENCE.length - 1 ? 'Begin Interrogation [Enter ↵]' : 'Continue [Enter ↵]'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Cross-Examination Presentation & Response Box */
        <div className="fixed bottom-4 inset-x-0 z-40 px-4 flex justify-center pointer-events-none">
          <div className="w-full max-w-4xl bg-[#0b120e]/95 border border-[#22352b] rounded-xl p-5 shadow-2xl backdrop-blur-md pointer-events-auto flex flex-col justify-between min-h-[220px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Column: Two-Tab Presentation Selector */}
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between pb-1 mb-2 border-b border-[#1b2b22]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4a7a60] animate-pulse" />
                    <span className="font-mono text-xs tracking-wider text-[#78b394] uppercase font-semibold">
                      Cross-Examination
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#4e6b5c]">
                    {askedTopics.length} Presented • Keys [1-9]
                  </span>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-2 border-b border-[#1b2b22] pb-2 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        sound.playMenuSelect();
                      } catch {}
                      setActiveTab('inventory');
                    }}
                    className={`px-3 py-1 rounded text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                      activeTab === 'inventory'
                        ? 'bg-[#18291f] text-emerald-300 border border-[#2b4737]'
                        : 'text-[#628070] hover:text-[#9bc2ad]'
                    }`}
                  >
                    Present Item ({inventory.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        sound.playMenuSelect();
                      } catch {}
                      setActiveTab('clues');
                    }}
                    className={`px-3 py-1 rounded text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                      activeTab === 'clues'
                        ? 'bg-[#18291f] text-emerald-300 border border-[#2b4737]'
                        : 'text-[#628070] hover:text-[#9bc2ad]'
                    }`}
                  >
                    Inquire on Clue ({effectiveCaseNotes.length})
                  </button>
                </div>

                {/* Dynamic Inquiry Buttons List */}
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {activeList.length === 0 ? (
                    <div className="p-3 text-center font-mono text-xs text-[#52705f] italic border border-dashed border-[#1f2d25] rounded-lg">
                      {activeTab === 'inventory'
                        ? '[No carried items in inventory to present]'
                        : '[No case notes or clues discovered yet to inquire about]'}
                    </div>
                  ) : (
                    activeList.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => handlePresentTarget(entry.id, activeTab)}
                        className="w-full text-left p-2.5 rounded-lg bg-[#121c16] hover:bg-[#1c2d23] border border-[#23382b] hover:border-[#3d5e48] text-xs font-mono text-[#d1e6dc] flex items-center justify-between transition-all cursor-pointer group active:scale-[0.99]"
                      >
                        <span className="group-hover:text-white transition-colors">
                          ❯ {activeTab === 'inventory' ? `Ask about item: ${entry.shortLabel}` : `Ask about note: ${entry.title}`}
                        </span>
                        <span className="text-[10px] font-mono text-red-400/60 group-hover:text-red-300 transition-colors">
                          -0.8%
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Active Spoken Response & Controls */}
              <div className="flex flex-col justify-between pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-[#1b2b22]">
                <div>
                  <div className="flex items-center justify-between pb-1 mb-2 border-b border-[#1b2b22]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#4a7a60]" />
                      <span className="font-mono text-xs tracking-wider text-[#78b394] uppercase font-semibold">
                        Hostel Guardian Nat
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#4e6b5c] uppercase">
                      Spoken Response
                    </span>
                  </div>

                  {/* Spoken Response Container */}
                  <div className="py-2 px-1">
                    <p className="font-serif italic font-extralight text-base md:text-lg text-[#dceddf] tracking-wide leading-relaxed select-none min-h-[64px]">
                      "{activeResponseText}"
                    </p>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#1b2b22]">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-red-400/80">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                    <span>Composure -1% / 8s</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleEndAudience}
                    className="px-4 py-1.5 rounded-lg bg-[#18261f] hover:bg-[#23382c] border border-[#2e4739] text-xs font-mono text-[#a3c2b2] hover:text-white uppercase tracking-wider transition-all cursor-pointer shadow-md hover:scale-[1.02] active:scale-95"
                  >
                    Conclude Audience [Enter ↵]
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
