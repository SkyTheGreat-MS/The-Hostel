import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DraftingCompass, X } from 'lucide-react';
import { sound } from '../audioEngine';
import { FONTS } from '../styles/designSystem';

export interface GarageBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Fired once each time the blueprint is inspected, so the case note can be unlocked. */
  onInspect?: () => void;
}

type BlueprintRoomId = 'sector_a' | 'valve_sluice_04' | 'culvert_b7' | 'pump_room';

interface BlueprintRoom {
  id: BlueprintRoomId;
  code: string;
  titleBurmese: string;
  titleLatin: string;
  description: string;
}

const BLUEPRINT_ROOMS: BlueprintRoom[] = [
  {
    id: 'sector_a',
    code: 'SECTOR A',
    titleBurmese: 'မြေအောက် စက်ဘီးသိုလှောင်ခန်း',
    titleLatin: 'SUBTERRANEAN BICYCLE STORAGE',
    description:
      'လက်ရှိ ရေလျှံနေသော နေရာ။ ၁၉၉၀ ပြည့်လွန်နှစ်များက ကျောင်းသူများ၏ စက်ဘီးတန်းများ ရေအောက်တွင် ရစ်ပတ်လျက် ကျန်ရှိနေသည်။ ဂိုဒေါင်၏ အနောက်ဘက်နံရံတွင် အဆောင်မှူး၏ မှတ်တမ်းခုံ တည်ရှိသည်။',
  },
  {
    id: 'valve_sluice_04',
    code: 'VALVE SLUICE 04',
    titleBurmese: 'ပင်မ ရေနုတ်တံခါး',
    titleLatin: 'MAIN DRAINAGE SLUICE GATE',
    description:
      'အရှေ့ဘက် တိုင်ပေါ်တွင် တပ်ဆင်ထားသော သံအဆို့ရှင်ဘီးဖြင့် ထိန်းချုပ်သည်။ ဖွင့်လိုက်သောအခါ ဂိုဒေါင်အတွင်းရေသည် B-7 ရေပြွန်ထဲသို့ စီးဆင်းသွားမည်ဟု မှတ်တမ်းတင်ထားသည်။',
  },
  {
    id: 'culvert_b7',
    code: 'CULVERT B-7',
    titleBurmese: 'ညောင်ပင်ရေတွင်း ဆက်သွယ်ရာ ရေပြွန်',
    titleLatin: 'DEEP DRAINAGE CULVERT TO BANYAN WELLHEAD',
    description:
      'ဂိုဒေါင်အောက်မှ မြေအောက်ရေပြွန်သည် အဆောင်ဝင်းရှိ ညောင်ပင်ရေတွင်းဟောင်းသို့ တိုက်ရိုက်ဆက်သွယ်သည်။ ဂိုဒေါင်ရေကို ဖောက်ထုတ်ခြင်းက ဤရေပြွန်ကိုပါ ရှင်းလင်းပေးမည်ဖြစ်ကြောင်း အင်ဂျင်နီယာမှတ်ချက်တွင် ဖော်ပြထားသည်။',
  },
  {
    id: 'pump_room',
    code: 'PUMP ROOM',
    titleBurmese: 'သော့ခတ်ထားသော ပန့်ခန်း',
    titleLatin: 'LOCKED PUMP CHAMBER',
    description:
      'အဆောင်မှူး၏ အရေးပေါ် လမ်းကွေ့ခလုတ် (emergency bypass) ဤခန်းထဲတွင် ရှိသည်။ ပန့်ခန်းတံခါးကို ၁၉၇၄ ရေလျှံမှုနောက်ပိုင်း မည်သူမျှ ပြန်မဖွင့်ခဲ့ပေ။',
  },
];

const ROOM_SHAPES: Record<BlueprintRoomId, { points: string; labelX: number; labelY: number }> = {
  sector_a: { points: '150,140 430,140 430,370 150,370', labelX: 178, labelY: 174 },
  valve_sluice_04: { points: '500,160 620,160 620,290 500,290', labelX: 516, labelY: 312 },
  culvert_b7: { points: '560,290 590,290 590,410 330,410 330,470 300,470 300,380 560,380', labelX: 360, labelY: 400 },
  pump_room: { points: '690,110 840,110 840,260 690,260', labelX: 706, labelY: 284 },
};

/**
 * 1998 hand-drafted architectural blueprint of the subterranean garage.
 * Strict duo-tone obsidian/verdigris rendering, Aka08 Burmese annotations, no emoji glyphs.
 */
export const GarageBlueprintModal: React.FC<GarageBlueprintModalProps> = ({ isOpen, onClose, onInspect }) => {
  const [selectedRoomId, setSelectedRoomId] = useState<BlueprintRoomId>('culvert_b7');
  const onInspectRef = useRef(onInspect);

  useEffect(() => {
    onInspectRef.current = onInspect;
  }, [onInspect]);

  useEffect(() => {
    if (!isOpen) return;
    try {
      sound.playPaperRustle?.();
    } catch {
      // audio is best-effort
    }
    onInspectRef.current?.();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isOpen, onClose]);

  const selectedRoom = BLUEPRINT_ROOMS.find((room) => room.id === selectedRoomId) ?? BLUEPRINT_ROOMS[2];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none" role="dialog" aria-modal="true">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#020504]/92 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col border border-[#193828] bg-[#060b08]/97 shadow-[0_0_60px_rgba(2,5,4,0.95)]"
          >
            {/* Header: monochrome drafting plate */}
            <div className="shrink-0 flex items-center justify-between gap-3 border-b border-[#193828] bg-[#020504]/70 px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <DraftingCompass className="w-5 h-5 shrink-0 text-[#6ea889]" />
                <div className="min-w-0">
                  <span className="block font-mono text-[9px] uppercase tracking-[0.28em] text-[#447d60]">
                    [02] BLUEPRINT · CIVIL WORKS DEPT. · 1998
                  </span>
                  <h2 className="font-burmese text-base sm:text-lg leading-[1.75] font-bold text-[#b1d4c2] truncate">
                    ဂိုဒေါင် မြေအောက် ရေဆင်းမြေပုံ
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 p-1.5 border border-[#112319] bg-[#0b140f] text-[#6ea889] hover:text-[#e0f0e7] hover:border-[#29543e] transition-colors cursor-pointer"
                title="မြေပုံ ပိတ်ရန် [ESC]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drafting sheet */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4">
              <svg viewBox="0 0 900 560" className="w-full h-auto border border-[#112319] bg-[#020504]" aria-label="1998 subterranean garage drainage blueprint">
                <defs>
                  <pattern id="bp-grid-fine" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#193828" strokeOpacity="0.4" strokeWidth="0.6" />
                  </pattern>
                  <pattern id="bp-grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#193828" strokeOpacity="0.55" strokeWidth="1" />
                  </pattern>
                </defs>

                <rect x="0" y="0" width="900" height="560" fill="url(#bp-grid-fine)" />
                <rect x="0" y="0" width="900" height="560" fill="url(#bp-grid-major)" />

                {/* Sheet border and registration marks */}
                <rect x="24" y="24" width="852" height="512" fill="none" stroke="#29543e" strokeWidth="1.2" />
                <rect x="32" y="32" width="836" height="496" fill="none" stroke="#112319" strokeWidth="1" />

                <text x="48" y="62" fill="#6ea889" fontSize="15" fontFamily={FONTS.mono} letterSpacing="3">
                  SUBTERRANEAN DRAINAGE / GARAGE LEVEL -4.20m
                </text>
                <text x="48" y="82" fill="#447d60" fontSize="11" fontFamily={FONTS.mono} letterSpacing="2">
                  DRAWING NO. 1998-CW-B7 / REV. 02 / SCALE 1:50
                </text>

                {/* Outer garage wall */}
                <rect x="120" y="100" width="730" height="320" fill="#060b08" fillOpacity="0.7" stroke="#6ea889" strokeWidth="2" />
                <rect x="128" y="108" width="714" height="304" fill="none" stroke="#29543e" strokeWidth="0.8" strokeDasharray="6 4" />

                {/* Bicycle rack hatching inside SECTOR A */}
                {[170, 200, 230, 260, 290, 320, 350].map((x) => (
                  <line key={x} x1={x} y1="210" x2={x + 60} y2="340" stroke="#193828" strokeWidth="1" strokeOpacity="0.85" />
                ))}

                {/* Valve wheel symbol on the right pillar */}
                <circle cx="560" cy="225" r="28" fill="none" stroke="#6ea889" strokeWidth="2" />
                <circle cx="560" cy="225" r="7" fill="#6ea889" />
                <line x1="532" y1="225" x2="588" y2="225" stroke="#6ea889" strokeWidth="1.5" />
                <line x1="560" y1="197" x2="560" y2="253" stroke="#6ea889" strokeWidth="1.5" />

                {/* Culvert run toward the wellhead */}
                <path d="M 560 290 L 560 410 L 315 410 L 315 482" fill="none" stroke="#29543e" strokeWidth="12" strokeOpacity="0.45" />
                <path d="M 560 290 L 560 410 L 315 410 L 315 482" fill="none" stroke="#6ea889" strokeWidth="1.6" />
                <polygon points="309,470 321,470 315,486" fill="#6ea889" />

                {/* Locked pump room hatch */}
                <rect x="690" y="110" width="150" height="150" fill="#020504" fillOpacity="0.85" stroke="#447d60" strokeWidth="1.5" />
                {[706, 726, 746, 766, 786, 806, 826].map((x) => (
                  <line key={x} x1={x} y1="110" x2={x - 60} y2="260" stroke="#112319" strokeWidth="1" />
                ))}

                {/* Wellhead at the hostel grounds */}
                <circle cx="315" cy="498" r="22" fill="none" stroke="#6ea889" strokeWidth="1.7" />
                <circle cx="315" cy="498" r="12" fill="none" stroke="#447d60" strokeWidth="1.2" />
                <text x="350" y="495" fill="#b1d4c2" fontSize="12" fontFamily={FONTS.burmese}>ညောင်ပင်ရေတွင်းဟောင်း</text>
                <text x="350" y="512" fill="#447d60" fontSize="10" fontFamily={FONTS.mono} letterSpacing="1.5">BANYAN WELLHEAD / CH.1</text>

                {/* Interactive room annotation groups */}
                {BLUEPRINT_ROOMS.map((room) => {
                  const shape = ROOM_SHAPES[room.id];
                  const isSelected = room.id === selectedRoomId;
                  return (
                    <g
                      key={room.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedRoomId(room.id)}
                      role="button"
                      aria-label={`${room.code} ${room.titleBurmese}`}
                    >
                      <polygon
                        points={shape.points}
                        fill={isSelected ? '#193828' : '#020504'}
                        fillOpacity={isSelected ? 0.55 : 0.2}
                        stroke={isSelected ? '#b1d4c2' : '#29543e'}
                        strokeWidth={isSelected ? 2 : 1.2}
                      />
                      <text
                        x={shape.labelX}
                        y={shape.labelY}
                        fill={isSelected ? '#e0f0e7' : '#6ea889'}
                        fontSize="11"
                        fontFamily={FONTS.mono}
                        letterSpacing="1.5"
                      >
                        {room.code}
                      </text>
                      <text x={shape.labelX} y={shape.labelY + 20} fill="#b1d4c2" fontSize="12" fontFamily={FONTS.burmese}>
                        {room.titleBurmese}
                      </text>
                    </g>
                  );
                })}

                {/* Orientation compass: North toward the main hostel compound */}
                <g transform="translate(802, 452)">
                  <circle r="38" fill="#020504" fillOpacity="0.9" stroke="#29543e" strokeWidth="1" />
                  <circle r="27" fill="none" stroke="#193828" strokeWidth="0.8" />
                  <polygon points="0,-30 7,0 0,-6 -7,0" fill="#b1d4c2" />
                  <polygon points="0,30 7,0 0,6 -7,0" fill="#29543e" />
                  <line x1="-30" y1="0" x2="30" y2="0" stroke="#29543e" strokeWidth="0.8" />
                  <text x="0" y="-42" textAnchor="middle" fill="#e0f0e7" fontSize="13" fontFamily={FONTS.mono}>N</text>
                  <text x="0" y="52" textAnchor="middle" fill="#6ea889" fontSize="10" fontFamily={FONTS.burmese}>အဆောင်ခံတိုက်သို့</text>
                </g>

                {/* Drafting title block */}
                <rect x="600" y="470" width="220" height="52" fill="#020504" fillOpacity="0.92" stroke="#193828" strokeWidth="1" />
                <line x1="600" y1="494" x2="820" y2="494" stroke="#193828" strokeWidth="0.8" />
                <text x="610" y="487" fill="#6ea889" fontSize="10" fontFamily={FONTS.mono} letterSpacing="1.5">
                  HOSTEL 1998 / DRAINAGE WORKS
                </text>
                <text x="610" y="511" fill="#447d60" fontSize="9" fontFamily={FONTS.mono} letterSpacing="1.5">
                  FILED AUG. 1998 / SHEET 02 OF 04
                </text>
              </svg>

              {/* Selected annotation detail, Aka08 with enforced Burmese line-height */}
              <div className="mt-3 border border-[#193828] bg-[#0b140f]/80 p-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#447d60]">{selectedRoom.code}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#447d60]">{selectedRoom.titleLatin}</span>
                </div>
                <h3 className="mt-1 font-burmese text-sm sm:text-base leading-[1.75] font-bold text-[#e0f0e7]">
                  {selectedRoom.titleBurmese}
                </h3>
                <p className="mt-1 font-burmese text-[13px] sm:text-sm leading-[1.75] text-[#b1d4c2]" style={{ wordBreak: 'break-word', hyphens: 'none' }}>
                  {selectedRoom.description}
                </p>
                {selectedRoom.id === 'culvert_b7' && (
                  <p className="mt-2 font-burmese text-[13px] sm:text-sm leading-[1.75] text-[#6ea889]" style={{ wordBreak: 'break-word', hyphens: 'none' }}>
                    ဂိုဒေါင်ရေ ဖောက်ထုတ်ခြင်းဖြင့် ဤရေပြွန်သည် ၁၉၉၈ ခုနှစ် အမှုတွဲ၏ ညောင်ပင်ရေတွင်းနှင့် တိုက်ရိုက် ဆက်သွယ်ကြောင်း အတည်ဖြစ်သည်။
                  </p>
                )}
              </div>

              <p className="mt-2 font-burmese text-[11px] leading-[1.75] text-[#447d60]">
                အခန်းအမှတ်အသားကို နှိပ်၍ မှတ်ချက်ဖတ်ရှုပါ။ [ESC] ဖြင့် ပြန်ထွက်နိုင်သည်။
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GarageBlueprintModal;
