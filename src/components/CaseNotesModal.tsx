import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Clock, Shield, Sparkles, X, AlertTriangle, Key, Search, Bookmark } from 'lucide-react';
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
    if (comp >= 75) return { text: 'STEELY (CALM)', color: 'text-emerald-400', bg: 'bg-emerald-950/80 border-emerald-700' };
    if (comp >= 50) return { text: 'UNSETTLED', color: 'text-amber-400', bg: 'bg-amber-950/80 border-amber-700' };
    if (comp >= 25) return { text: 'PANICKED', color: 'text-orange-400', bg: 'bg-orange-950/80 border-orange-700' };
    return { text: 'TERRIFIED (CRITICAL)', color: 'text-rose-500', bg: 'bg-rose-950/80 border-rose-700' };
  };

  const compStatus = getComposureStatus(composure);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none">
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.94, opacity: 0 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-[#121815]/95 border border-[#2c3d34] rounded-2xl shadow-[0_0_35px_rgba(46,66,56,0.3)] backdrop-blur-md flex flex-col overflow-hidden text-[#c2d6cc]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#2c3d34] bg-[#18221d]/90 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#18221d] border border-[#2c3d34] text-[#82a996] shadow-md">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#82a996] uppercase font-bold">
                  CASE FILE • AUGUST 1998 INCIDENT
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-black text-[#c2d6cc] tracking-wider uppercase"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                >
                  INVESTIGATION NOTEBOOK
                </h2>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playPaperRustle();
                onClose();
              }}
              className="p-2 rounded-lg bg-[#121815] border border-[#2c3d34] text-[#82a996] hover:text-[#c2d6cc] hover:border-[#4d6e5e] transition-all cursor-pointer"
              title="Close Notebook [ESC]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Vitals Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-4 bg-[#0b0f0d] border-b border-[#2c3d34]/80 text-xs font-mono">
            {/* Investigator */}
            <div className="p-2.5 rounded-xl bg-[#18221d] border border-[#2c3d34] flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-[#82a996] shrink-0" />
              <div>
                <div className="text-[10px] text-[#82a996]/70 uppercase">Investigator</div>
                <div className="font-bold text-[#c2d6cc] truncate">
                  {investigatorName} ({investigatorArchetype})
                </div>
              </div>
            </div>

            {/* Composure */}
            <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${compStatus.bg}`}>
              <AlertTriangle className={`w-4 h-4 ${compStatus.color} shrink-0`} />
              <div>
                <div className="text-[10px] text-stone-400 uppercase">Composure</div>
                <div className={`font-bold ${compStatus.color}`}>
                  {composure}% • {compStatus.text}
                </div>
              </div>
            </div>

            {/* Time Left */}
            <div className="p-2.5 rounded-xl bg-[#18221d] border border-[#2c3d34] flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#82a996] shrink-0" />
              <div>
                <div className="text-[10px] text-[#82a996]/70 uppercase">Remaining Time</div>
                <div className="font-bold text-[#c2d6cc]">
                  {timeFormatted} / 10:00
                </div>
              </div>
            </div>
          </div>

          {/* Body: Discovered Clues & Lore */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2c3d34] pb-2">
              <h3
                className="text-lg font-black text-[#c2d6cc] uppercase tracking-wider flex items-center gap-2"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
              >
                <Search className="w-4 h-4 text-[#82a996]" />
                <span>DISCOVERED CLUES & EVIDENCE ({discoveredClueIds.length})</span>
              </h3>
              <span className="text-[11px] font-mono text-[#82a996]/80">
                Uncover critical evidence to unlock Chapter 2
              </span>
            </div>

            {discoveredClueIds.length === 0 ? (
              <div className="p-6 text-center text-stone-500 font-mono text-xs">
                No clues discovered yet. Investigate the hostel corridors and archives!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {discoveredClueIds.map((id) => {
                  const clue = MASTER_CLUES[id];
                  if (!clue) return null;

                  return (
                    <div
                      key={id}
                      className="p-3.5 rounded-xl bg-[#18221d]/80 border border-[#2c3d34] hover:border-[#4d6e5e] hover:bg-[#18221d] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-bold text-[#82a996] uppercase tracking-wider">
                            {clue.location}
                          </span>
                          <span
                            className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                              clue.category === 'item'
                                ? 'bg-[#121815] text-[#82a996] border-[#2c3d34]'
                                : clue.category === 'primary'
                                ? 'bg-rose-950 text-rose-300 border-rose-700'
                                : 'bg-stone-800 text-stone-400 border-stone-700'
                            }`}
                          >
                            {clue.category}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#c2d6cc] mb-1">
                          {clue.title}
                        </h4>
                        <p className="text-xs text-[#c2d6cc]/80 font-mono leading-relaxed">
                          {clue.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Environmental Tip Strip */}
            <div className="mt-6 p-4 rounded-xl bg-[#18221d]/50 border border-[#2c3d34] flex items-start gap-3 text-xs font-mono text-[#c2d6cc] leading-relaxed">
              <Sparkles className="w-5 h-5 text-[#6ee7b7] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#82a996] uppercase block mb-1">
                  Detective Observation Rule:
                </span>
                Observe the draft currents and sounds on each location card. Dead-end rooms suffer from stagnant air, padlocks, and no airflow. Rooms leading toward the exterior courtyard always feature cold rain drafts flowing from beneath the doors.
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-[#18221d]/90 border-t border-[#2c3d34] flex justify-end">
            <button
              onClick={() => {
                sound.playPaperRustle();
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-[#18221d] hover:bg-[#283930] border border-[#2c3d34] hover:border-[#4d6e5e] text-[#c2d6cc] hover:text-[#6ee7b7] font-bold font-mono text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all"
            >
              RESUME INVESTIGATION
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
