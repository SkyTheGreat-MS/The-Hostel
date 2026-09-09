import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, X, Search, Bookmark, User } from 'lucide-react';
import { sound } from '../audioEngine';

interface CaseNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  investigatorName: string;
  investigatorArchetype: string;
  composure: number;
  timeLeftSeconds: number;
  discoveredClueIds: string[];
}

export interface ClueData {
  id: string;
  title: string;
  location: string;
  category: 'primary' | 'side' | 'item';
  description: string;
}

export const MASTER_CLUES: Record<string, ClueData> = {
  seance_notebook: {
    id: 'seance_notebook',
    title: 'The Mirror-Well Pact (1998 Notebook)',
    location: '2026 Seance Room',
    category: 'primary',
    description:
      'A yellowed student notebook recording the seance ritual to summon the 1998 hostel spirits. Outlines the offering tea glass and letter board.',
  },
  missing_notice: {
    id: 'missing_notice',
    title: 'Missing Student Notice: Mama May',
    location: 'Pathway 326 (Door 304)',
    category: 'primary',
    description:
      'An official August 1998 missing poster. Deep fingernail claw marks on the adjacent doorframe indicate she was violently hunted down in this corridor.',
  },
  bribe_ledger: {
    id: 'bribe_ledger',
    title: "Caretaker's 5,000 Kyats Bribe Receipt",
    location: "Caretaker's Archive",
    category: 'primary',
    description:
      'A handwritten cash receipt dated August 14, 1998. The caretaker received 5,000 Kyats to pour concrete and wrap iron chains over the dried courtyard well.',
  },
  well_key: {
    id: 'well_key',
    title: 'Courtyard Dried Well Brass Key',
    location: 'Courtyard Nat Shrine',
    category: 'item',
    description:
      'A heavy antique key inscribed with numerical cipher marks. Given by the spectral form of Mama May to unlock the dried well chamber in Chapter 2.',
  },
  curfew_log: {
    id: 'curfew_log',
    title: 'Padlocked Curfew Log',
    location: 'East Wing Stairwell',
    category: 'side',
    description:
      'Notes that the east fire exit was locked from the outside at 11:45 PM on the night Mama May vanished, cutting off all indoor student escape.',
  },
  jasmine_hairpin: {
    id: 'jasmine_hairpin',
    title: 'Bloodstained Jasmine Hairpin',
    location: 'Communal Washroom',
    category: 'side',
    description:
      'A carved bone hairpin soaked in dried dark rust. Dropped near the broken mirror during an intense struggle before she was dragged away.',
  },
  study_notes: {
    id: 'study_notes',
    title: 'Nat Binding Diagram',
    location: 'Disused Study Hall',
    category: 'side',
    description:
      'Chalk diagrams explaining how Burmese guardian spirits (Nats) can be tethered by a blood-sealed covenant to hold a restless soul in place.',
  },
  boiler_concrete: {
    id: 'boiler_concrete',
    title: 'Masonry Trowel & Quick-Dry Concrete',
    location: 'Basement Boiler Hatch',
    category: 'side',
    description:
      'Fresh cement residue matching the masonry seal on the courtyard well. Proves construction materials were stored in the hostel basement.',
  },
  roster_slip_1998: {
    id: 'roster_slip_1998',
    title: 'Cleaning Duty Log (Aug 1998)',
    location: 'Room 4B (Desk)',
    category: 'primary',
    description:
      'Cleaning Duty Log (Aug 1998) assigning Room 4B to students May and Sandar.',
  },
  curfew_calendar_1998: {
    id: 'curfew_calendar_1998',
    title: 'August 1998 Wall Calendar',
    location: 'Room 4B (Wall)',
    category: 'side',
    description:
      'August 1998 wall calendar with August 14th circled with curfew lockdown notes.',
  },
  washroom_stall_echo: {
    id: 'washroom_stall_echo',
    title: 'Washroom Stall Blood & Echo',
    location: 'Communal Washroom (Stall 3)',
    category: 'primary',
    description:
      'The third washroom stall exhibits fresh blood smears and a shattered pocket mirror beside a crimson student hair ribbon.',
  },
  mirror_locker_scrawl: {
    id: 'mirror_locker_scrawl',
    title: 'Washroom Mirror Etched Scrawl',
    location: 'Communal Washroom (Mirror)',
    category: 'side',
    description:
      "Chalk-scratched notation etched into the base of the washroom mirror frame: 'Locker 14 - 1998'.",
  },
  cipher_note_32: {
    id: 'cipher_note_32',
    title: 'Warden Office Overwrite Slip',
    location: 'Locker 32 (Sandar)',
    category: 'primary',
    description:
      "An official hostel maintenance slip: 'Warden Office Electronic Push-Latch Overwrite: 8 1 4 0 9 2.' Note: Caretaker mirrors all sequence inputs for emergency security.",
  },
  sandar_kozaw_letters: {
    id: 'sandar_kozaw_letters',
    title: 'Folded Love Letters (K.Z.)',
    location: 'Locker 32 (Sandar)',
    category: 'primary',
    description:
      "Folded letters addressed to Sandar, signed 'K.Z.'... 'Sandar, she is getting suspicious about the tea shop visits. If May finds out about us, neither of us can stay in this hostel.' Shows the hidden betrayal behind Mama May.",
  },
  nat_testimony_may_murder: {
    id: 'nat_testimony_may_murder',
    title: "Nat Testimony: May's Murder",
    location: 'Guardian Nat Altar',
    category: 'primary',
    description:
      '[NOTE: May was strangled inside the hostel during monsoon term 1998.] The Guardian Nat confirmed her name was May, a warden’s favorite, choke-strangled in the quiet dark of monsoon week.',
  },
  nat_testimony_locker_key: {
    id: 'nat_testimony_locker_key',
    title: 'Nat Testimony: Locker 14 Key',
    location: 'Guardian Nat Altar',
    category: 'side',
    description:
      '[NOTE: Nat claimed the key was incinerated behind the mess hall. DEDUCTION: Contradicts Locker 32 notes confirming May carries the key around her neck—a deliberate deceit.]',
  },
  nat_testimony_office_attack: {
    id: 'nat_testimony_office_attack',
    title: 'Nat Testimony: Caretaker Office Attack',
    location: 'Guardian Nat Altar',
    category: 'primary',
    description:
      '[NOTE: May mistakes anyone in the office for her killer until calmed.] Until her neck is freed of shame, every living soul looks like her murderer.',
  },
  nat_testimony_banyan_well: {
    id: 'nat_testimony_banyan_well',
    title: 'Nat Testimony: Banyan Tree Well',
    location: 'Guardian Nat Altar',
    category: 'side',
    description:
      '[NOTE: The dry mouth beneath the banyan tree cannot be spoken of. To name the pit is to drown within it.]',
  },
  clue_locker_14_found: {
    id: 'clue_locker_14_found',
    title: "Locker 14 Barrel Lock",
    location: 'Dorm Lockers',
    category: 'side',
    description: "May's personal locker 14 is sealed with a barrel lock. The key is missing.",
  },
  clue_broken_locket_found: {
    id: 'clue_broken_locket_found',
    title: 'Shattered Jade Fragment',
    location: 'Hostel Ground',
    category: 'item',
    description: 'A fragment of shattered jade from an appeasement pendant.',
  },
  clue_warden_notes_found: {
    id: 'clue_warden_notes_found',
    title: "Caretaker's Hidden Ledger",
    location: "Caretaker's Archive",
    category: 'side',
    description: 'Bribe notes and hidden receipts kept by the caretaker.',
  },
  clue_well_rumor: {
    id: 'clue_well_rumor',
    title: 'Whispers of the Banyan Well',
    location: 'Courtyard Grounds',
    category: 'side',
    description: 'Superstitious student rumors about the dried well under the roots of the banyan tree.',
  },
  clue_ko_zaw_letters: {
    id: 'clue_ko_zaw_letters',
    title: 'Folded Love Letters (Ko Zaw)',
    location: 'Locker 32 (Sandar)',
    category: 'primary',
    description: 'Stolen letters between Sandar and Ko Zaw exposing a secret affair that drove a violent wedge between dorm sisters.',
  },
  clue_physics_chem_notes_1998: {
    id: 'clue_physics_chem_notes_1998',
    title: 'Physics & Chemistry Notes (1998)',
    location: 'Study Desk',
    category: 'side',
    description: 'Formulas written by a trembling hand. May spent her final study hours plotting an escape beyond the curfew gate before the corridor was barricaded.',
  },
  clue_banyan_well: {
    id: 'clue_banyan_well',
    title: 'The Dried Banyan Well',
    location: 'Courtyard Grounds',
    category: 'primary',
    description: 'The forbidden dried well beneath the sacred banyan tree. The roots drink deep from the dark.',
  },
};

export const CaseNotesModal: React.FC<CaseNotesModalProps> = ({
  isOpen,
  onClose,
  investigatorName,
  investigatorArchetype,
  composure,
  timeLeftSeconds,
  discoveredClueIds,
}) => {
  if (!isOpen) return null;

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const getComposureStatus = (comp: number) => {
    if (comp >= 75) return { text: 'STEELY (CALM)', color: 'text-emerald-400', ring: '#10b981', pct: comp };
    if (comp >= 50) return { text: 'UNSETTLED', color: 'text-amber-400', ring: '#f59e0b', pct: comp };
    if (comp >= 25) return { text: 'PANICKED', color: 'text-orange-400', ring: '#f97316', pct: comp };
    return { text: 'TERRIFIED', color: 'text-rose-500', ring: '#ef4444', pct: comp };
  };

  const compStatus = getComposureStatus(composure);
  const totalSlots = 8;
  const filledSlots = discoveredClueIds.length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none">
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          className="relative w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-[#2a3a30]/80 shadow-[0_0_60px_rgba(0,255,180,0.06)]"
          style={{ background: 'linear-gradient(170deg, #1a221e 0%, #0e1511 50%, #121916 100%)' }}
        >
          {/* ═══════════ HEADER RIBBON ═══════════ */}
          <div className="relative px-5 py-4 flex items-center justify-between border-b border-[#2a3a30]/60"
            style={{ background: 'linear-gradient(90deg, #162018 0%, #1e2d24 50%, #162018 100%)' }}>
            {/* Left cluster */}
            <div className="flex items-center gap-3">
              {/* Bookmark ribbon */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-3 bg-[#00ffb4]/30 rounded-full" />
                <div className="w-8 h-10 bg-[#00ffb4]/10 border border-[#00ffb4]/25 rounded-sm flex items-center justify-center relative">
                  <Bookmark className="w-4 h-4 text-[#00ffb4]/70" />
                  {/* Ribbon point */}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#00ffb4]/25" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-mono tracking-[0.2em] text-[#00ffb4]/50 uppercase font-semibold block">
                  CASE FILE &bull; AUGUST 1998 INCIDENT
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-black text-[#d4ede3] tracking-[0.15em] uppercase leading-none"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                >
                  INVESTIGATION NOTEBOOK
                </h2>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => {
                sound.playPaperRustle();
                onClose();
              }}
              className="w-9 h-9 rounded-lg bg-[#0e1511] border border-[#2a3a30] text-[#00ffb4]/50 hover:text-[#00ffb4] hover:border-[#00ffb4]/40 hover:bg-[#1a221e] transition-all cursor-pointer flex items-center justify-center"
              title="Close Notebook [ESC]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ═══════════ 2-COLUMN BODY ═══════════ */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

            {/* ── LEFT SIDEBAR: Investigator HUD ── */}
            <div className="w-full md:w-64 lg:w-72 shrink-0 border-b md:border-b-0 md:border-r border-[#2a3a30]/60 flex flex-col p-4 gap-4 overflow-y-auto"
              style={{ background: 'linear-gradient(180deg, #0f1a14 0%, #0e1511 100%)' }}>

              {/* ID Card */}
              <div className="rounded-xl border border-[#2a3a30]/80 p-4 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #162018 0%, #1a2520 100%)' }}>
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#00ffb4]/20 rounded-tl-xl" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#00ffb4]/20 rounded-br-xl" />

                <div className="flex items-center gap-3 mb-3">
                  {/* Avatar silhouette */}
                  <div className="w-14 h-14 rounded-full bg-[#0e1511] border-2 border-[#00ffb4]/20 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#00ffb4]/5 to-transparent" />
                    <User className="w-7 h-7 text-[#00ffb4]/30" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] font-mono tracking-[0.15em] text-[#00ffb4]/40 uppercase">Investigator</div>
                    <div className="text-sm font-bold text-[#d4ede3] truncate" style={{ fontFamily: "'Cinzel', serif" }}>
                      {investigatorName}
                    </div>
                    <div className="text-[10px] font-mono text-[#00ffb4]/60 uppercase tracking-wider">
                      ({investigatorArchetype})
                    </div>
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-[#00ffb4]/15 to-transparent" />
                <div className="mt-2 text-[9px] font-mono text-[#00ffb4]/30 text-center uppercase tracking-widest">
                  Authenticated &bull; Active Case
                </div>
              </div>

              {/* Composure Gauge — Circular Radial Ring */}
              <div className="rounded-xl border border-[#2a3a30]/80 p-4 flex flex-col items-center gap-3"
                style={{ background: 'linear-gradient(135deg, #162018 0%, #1a2520 100%)' }}>
                <div className="text-[9px] font-mono tracking-[0.15em] text-[#00ffb4]/40 uppercase">
                  Composure
                </div>
                <div className="relative w-24 h-24">
                  {/* Background ring */}
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#1a2520" strokeWidth="6" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke={compStatus.ring}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - compStatus.pct / 100)}`}
                      style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s ease', filter: `drop-shadow(0 0 6px ${compStatus.ring}40)` }}
                    />
                  </svg>
                  {/* Center value */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-xl font-black ${compStatus.color}`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      {composure}%
                    </span>
                  </div>
                </div>
                <div className={`text-[10px] font-mono font-bold uppercase tracking-wider ${compStatus.color}`}>
                  {compStatus.text}
                </div>
              </div>

              {/* Timer Module */}
              <div className="rounded-xl border border-[#2a3a30]/80 p-4"
                style={{ background: 'linear-gradient(135deg, #162018 0%, #1a2520 100%)' }}>
                <div className="text-[9px] font-mono tracking-[0.15em] text-[#00ffb4]/40 uppercase text-center mb-2">
                  Remaining Time
                </div>
                <div className="text-center">
                  <span className="text-3xl font-black text-[#00ffb4] tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif", textShadow: '0 0 20px rgba(0,255,180,0.3)' }}>
                    {timeFormatted}
                  </span>
                  <span className="text-xs font-mono text-[#00ffb4]/30 block">/ 10:00</span>
                </div>
                {/* Segmented progress bar */}
                <div className="flex gap-1 mt-3">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const filled = timeLeftSeconds / 60 > i;
                    return (
                      <div
                        key={i}
                        className="flex-1 h-1.5 rounded-full transition-colors duration-500"
                        style={{
                          background: filled
                            ? timeLeftSeconds < 120
                              ? '#ef4444'
                              : timeLeftSeconds < 300
                              ? '#f59e0b'
                              : '#00ffb4'
                            : '#1a2520',
                          boxShadow: filled ? `0 0 4px ${timeLeftSeconds < 120 ? '#ef4444' : timeLeftSeconds < 300 ? '#f59e0b' : '#00ffb4'}40` : 'none',
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── RIGHT PANEL: Evidence & Hints ── */}
            <div className="flex-1 flex flex-col overflow-hidden">

              {/* Clue Inventory Slots */}
              <div className="px-5 py-4 border-b border-[#2a3a30]/60">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-[#00ffb4]/50" />
                    <span className="text-[10px] font-mono tracking-[0.15em] text-[#00ffb4]/50 uppercase font-semibold">
                      Clue Inventory
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#00ffb4]/30">
                    {filledSlots} / {totalSlots} Slots Filled
                  </span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {Array.from({ length: totalSlots }).map((_, i) => {
                    const clueId = discoveredClueIds[i];
                    const clue = clueId ? MASTER_CLUES[clueId] : null;
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-lg border flex flex-col items-center justify-center relative transition-all duration-300 ${
                          clue
                            ? 'border-[#00ffb4]/30 bg-[#00ffb4]/5'
                            : 'border-[#2a3a30]/60 bg-[#0e1511]/60'
                        }`}
                        title={clue ? `${clue.title}\n${clue.location}` : 'Empty slot'}
                      >
                        {/* Corner brackets */}
                        <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l border-[#00ffb4]/20" />
                        <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 border-t border-r border-[#00ffb4]/20" />
                        <div className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 border-b border-l border-[#00ffb4]/20" />
                        <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r border-[#00ffb4]/20" />

                        {clue ? (
                          <>
                            <FileText className="w-4 h-4 text-[#00ffb4]/60 mb-0.5" />
                            <span className="text-[7px] font-mono text-[#00ffb4]/40 text-center leading-tight px-0.5 line-clamp-2">
                              {clue.title.length > 16 ? clue.title.slice(0, 14) + '...' : clue.title}
                            </span>
                          </>
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-[#2a3a30]/40" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 text-center text-[9px] font-mono text-[#00ffb4]/25 tracking-wider">
                  Uncover critical evidence to unlock Chapter 2
                </div>
              </div>

              {/* Scrollable Evidence List */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {discoveredClueIds.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full border border-[#2a3a30] flex items-center justify-center mb-4">
                      <Search className="w-7 h-7 text-[#00ffb4]/15" />
                    </div>
                    <p className="text-sm font-mono text-[#d4ede3]/30 max-w-xs leading-relaxed">
                      No clues discovered yet. Search the hostel corridors and archives to uncover evidence.
                    </p>
                  </div>
                ) : (
                  discoveredClueIds.map((id) => {
                    const clue = MASTER_CLUES[id];
                    if (!clue) return null;
                    return (
                      <div
                        key={id}
                        className="rounded-xl border border-[#2a3a30]/60 hover:border-[#00ffb4]/20 transition-all p-4 relative overflow-hidden group"
                        style={{ background: 'linear-gradient(135deg, #141e19 0%, #18221d 100%)' }}
                      >
                        {/* Left accent line */}
                        <div className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-full ${
                          clue.category === 'primary' ? 'bg-rose-500/60' :
                          clue.category === 'item' ? 'bg-[#00ffb4]/50' :
                          'bg-[#2a3a30]'
                        }`} />

                        <div className="flex items-start justify-between gap-2 mb-1.5 pl-2">
                          <span className="text-[9px] font-mono font-semibold text-[#00ffb4]/40 uppercase tracking-wider">
                            {clue.location}
                          </span>
                          <span className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded-md border shrink-0 ${
                            clue.category === 'item'
                              ? 'bg-[#00ffb4]/10 text-[#00ffb4]/80 border-[#00ffb4]/20'
                              : clue.category === 'primary'
                              ? 'bg-rose-950/60 text-rose-300/80 border-rose-800/40'
                              : 'bg-[#1a2520]/80 text-[#d4ede3]/50 border-[#2a3a30]'
                          }`}>
                            {clue.category}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#d4ede3] pl-2 mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
                          {clue.title}
                        </h4>
                        <p className="text-[11px] text-[#d4ede3]/60 font-mono leading-relaxed pl-2">
                          {clue.description}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>


            </div>
          </div>

          {/* ═══════════ FOOTER ═══════════ */}
          <div className="px-5 py-3.5 border-t border-[#2a3a30]/60 flex items-center justify-between"
            style={{ background: 'linear-gradient(90deg, #121916 0%, #162018 50%, #121916 100%)' }}>
            <div className="text-[9px] font-mono text-[#00ffb4]/20 tracking-widest uppercase">
              Case Notebook &bull; Secure Channel
            </div>
            <button
              onClick={() => {
                sound.playPaperRustle();
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider cursor-pointer transition-all relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #1a2a22 0%, #223830 100%)',
                border: '1px solid rgba(0,255,180,0.2)',
                color: '#d4ede3',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,255,180,0.5)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,180,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,255,180,0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span className="relative z-10">RESUME INVESTIGATION</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
