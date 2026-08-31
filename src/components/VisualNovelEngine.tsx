import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useGameProgress } from '../context/GameProgressContext';
import { sound } from '../audioEngine';
import { MCId, MCCharacter } from '../types';
import { CHARACTERS } from '../gameData';
import { InkPortrait } from './InkPortrait';
import { CharacterSelectScreen } from './CharacterSelectScreen';
import { PauseModal } from './PauseModal';
import { CaseNotesModal } from './CaseNotesModal';
import {
  Volume2,
  VolumeX,
  Pause,
  Sparkles,
  Play,
  Key,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  MapPin,
  Eye,
  RotateCcw,
  BookOpen,
  Clock,
  AlertTriangle,
  Wind,
  Compass,
} from 'lucide-react';

export type ChapterPhase = 1 | 2 | 3;

type EngineMode =
  | 'phase1_2'
  | 'shattering'
  | 'character_select'
  | 'awakening'
  | 'location_select'
  | 'investigating_location';

interface InitialDialogueStep {
  id: number;
  phase: 1 | 2;
  speaker: string;
  characterId: string;
  pos: 'left' | 'right';
  text: string;
  isClimax?: boolean;
  soundCue?: 'hover' | 'select' | 'paper' | 'damage' | 'drone' | 'break';
}

const PHASE1_2_SCRIPT: InitialDialogueStep[] = [
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
];

// Multi-tier Location Definitions
export interface ExplorationLocation {
  id: string;
  tier: 1 | 2 | 3;
  areaCode: string;
  roman: string;
  title: string;
  subtitle: string;
  desc: string;
  bgImage: string;
  clueId: string;
  clueTitle: string;
  isCorrectRoute: boolean;
  timePenaltySeconds: number;
  composureDrain: number;
  subtleClues: {
    airflow: string;
    acoustic: string;
    affinity: 'High (Exterior Escape Path)' | 'Low (Dead End / Interior Trap)' | 'Primary (Source of Supernatural Curse)';
  };
  lines: {
    speakerType: 'player' | 'mama_may' | 'environment';
    text: string;
    soundCue?: 'paper' | 'select' | 'hover' | 'drone' | 'break';
    isGlitch?: boolean;
  }[];
}

const ALL_TIERED_LOCATIONS: Record<number, ExplorationLocation[]> = {
  // ==========================================
  // TIER 1: INITIAL CORRIDORS (LEAVING ROOM)
  // ==========================================
  1: [
    {
      id: 'pathway_326',
      tier: 1,
      areaCode: 'AREA 1-A',
      roman: 'I',
      title: 'Pathway 326',
      subtitle: 'The Sealed West Hallway',
      desc: 'Rotting wooden floorboards where rainwater trickles through cracked ceiling laths.',
      bgImage: '/assets/uni_room_chp1_bg1.jpg',
      clueId: 'missing_notice',
      clueTitle: 'Missing Student Notice (Mama May)',
      isCorrectRoute: true,
      timePenaltySeconds: 0,
      composureDrain: 0,
      subtleClues: {
        airflow: 'Strong cold draft circulating from under the distant fire door.',
        acoustic: 'Muffled sound of torrential rain and wind against exterior glass.',
        affinity: 'High (Exterior Escape Path)',
      },
      lines: [
        {
          speakerType: 'player',
          text: 'Pathway 326... The air in this corridor smells of stagnant water and old cedar. The lights are dead, replaced by flickering kerosene shadows.',
          soundCue: 'paper',
        },
        {
          speakerType: 'environment',
          text: 'A freezing gust rushes down the hall. A shadowy silhouette of a weeping student flickers erratically in and out of view, glitching like corrupted magnetic tape.',
          soundCue: 'drone',
          isGlitch: true,
        },
        {
          speakerType: 'player',
          text: 'Look at the doorframe to Room 304... There are deep, desperate fingernail claw marks gouged into the wood. Pinned beside it is an August 1998 Missing Notice for Mama May.',
          soundCue: 'select',
        },
        {
          speakerType: 'player',
          text: 'The draft is flowing toward the administrative wing downstairs... That is the only way down to ground level!',
        },
      ],
    },
    {
      id: 'east_stairwell',
      tier: 1,
      areaCode: 'AREA 1-B',
      roman: 'II',
      title: 'East Wing Stairwell',
      subtitle: 'Padlocked Fire Exit',
      desc: 'Heavy iron padlocks and rusted chains wrapping the crumbling emergency stairs.',
      bgImage: '/assets/uni_room_chp1_bg1.jpg',
      clueId: 'curfew_log',
      clueTitle: 'Caretaker’s Curfew Sheet',
      isCorrectRoute: false,
      timePenaltySeconds: 35,
      composureDrain: 8,
      subtleClues: {
        airflow: 'Dead, suffocating air; zero exterior draft or ventilation.',
        acoustic: 'Stifling, unbroken silence with occasional pipe creaks.',
        affinity: 'Low (Dead End / Interior Trap)',
      },
      lines: [
        {
          speakerType: 'player',
          text: 'The east stairs... I can barely breathe in here. The air is stagnant, thick with the smell of rusted iron and old kerosene.',
        },
        {
          speakerType: 'environment',
          text: 'Clank! A heavy padlock rattles against the security gate. A dark shadow stretches unnaturally across the concrete steps, sending a wave of dread down your spine.',
          soundCue: 'drone',
          isGlitch: true,
        },
        {
          speakerType: 'player',
          text: 'The gate is padlocked from the outside! Pinned to the wire is the caretaker’s August 1998 curfew log—he locked this wing before midnight! This way is impassable.',
          soundCue: 'paper',
        },
        {
          speakerType: 'player',
          text: 'I wasted precious time coming here... My pulse is racing. I must turn back and find an unblocked path!',
        },
      ],
    },
    {
      id: 'communal_washroom',
      tier: 1,
      areaCode: 'AREA 1-C',
      roman: 'III',
      title: 'Communal Washroom',
      subtitle: 'Shattered Mirror Sinks',
      desc: 'Fogged mirror shards and trickling rusted pipes reeking of stagnant well mildew.',
      bgImage: '/assets/main_menu.jpg',
      clueId: 'jasmine_hairpin',
      clueTitle: 'Bloodstained Jasmine Hairpin',
      isCorrectRoute: false,
      timePenaltySeconds: 45,
      composureDrain: 10,
      subtleClues: {
        airflow: 'Damp, cold moisture rising from floor drains; no wind current.',
        acoustic: 'Irregular rhythmic dripping of brown rusted tap water.',
        affinity: 'Low (Dead End / Interior Trap)',
      },
      lines: [
        {
          speakerType: 'player',
          text: 'The communal washroom... The mirrors over the porcelain basins are shattered into jagged cobwebs of silver.',
        },
        {
          speakerType: 'environment',
          text: 'In the cracked mirror shards, your reflection is not alone—a pale, weeping girl in a stained longyi stands right behind you, her throat marked by dark bruises!',
          soundCue: 'drone',
          isGlitch: true,
        },
        {
          speakerType: 'player',
          text: 'AHHH! S-she vanished! But look in the cracked drain... A bloodstained carved jasmine hairpin! It belonged to Mama May!',
          soundCue: 'select',
        },
        {
          speakerType: 'player',
          text: 'She struggled with someone right here before they dragged her away. There is no exterior exit here... I need to get out of this room now!',
        },
      ],
    },
  ],

  // ==========================================
  // TIER 2: GROUND LEVEL APPROACHES
  // ==========================================
  2: [
    {
      id: 'caretaker_office',
      tier: 2,
      areaCode: 'AREA 2-A',
      roman: 'I',
      title: "Caretaker's Archive",
      subtitle: 'The Administrative Quarters',
      desc: 'An overturned desk smelling of damp earth, tallow candles, and hidden ledgers.',
      bgImage: '/assets/main_menu.jpg',
      clueId: 'bribe_ledger',
      clueTitle: '5,000 Kyats Well Bribe Ledger',
      isCorrectRoute: true,
      timePenaltySeconds: 0,
      composureDrain: 0,
      subtleClues: {
        airflow: 'Rainwater and cold night draft seeping beneath the rear wooden exit door.',
        acoustic: 'Rattling iron keys and heavy wind howling in the outdoor courtyard.',
        affinity: 'High (Exterior Escape Path)',
      },
      lines: [
        {
          speakerType: 'player',
          text: 'The caretaker’s office... The room has been ransacked, with old student dossiers and rent sheets strewn across the floor.',
          soundCue: 'paper',
        },
        {
          speakerType: 'environment',
          text: 'Click-clack... Click-clack... In the pitch-black corner, an antique typewriter begins depressing keys on its own: "SEALED BENEATH THE WELL FOR 5,000 KYATS".',
          soundCue: 'hover',
          isGlitch: true,
        },
        {
          speakerType: 'player',
          text: 'Inside an overturned steel lockbox, there’s an official cash receipt dated August 14, 1998. It confirms a 5,000 Kyats bribe paid to seal off the courtyard well with concrete!',
          soundCue: 'select',
        },
        {
          speakerType: 'player',
          text: 'The back door leads straight into the courtyard where the well is located. The draft is blowing the door open!',
        },
      ],
    },
    {
      id: 'disused_study',
      tier: 2,
      areaCode: 'AREA 2-B',
      roman: 'II',
      title: 'Disused Study Hall',
      subtitle: 'Overturned Lecture Benches',
      desc: 'Chalk dust and rotting wooden benches under barred metal windows.',
      bgImage: '/assets/uni_room_chp1_bg1.jpg',
      clueId: 'study_notes',
      clueTitle: 'Nat Binding Diagram Notes',
      isCorrectRoute: false,
      timePenaltySeconds: 35,
      composureDrain: 7,
      subtleClues: {
        airflow: 'Stale, dry chalk dust; all windows are shuttered with corrugated zinc.',
        acoustic: 'Dead silence broken only by the faint whistle of wind against metal sheets.',
        affinity: 'Low (Dead End / Interior Trap)',
      },
      lines: [
        {
          speakerType: 'player',
          text: 'The old study hall... The benches are overturned and covered in thick mold. Every single window is reinforced with iron bars.',
        },
        {
          speakerType: 'environment',
          text: 'Screeech! A piece of chalk slides across the blackboard on its own, rapidly sketching an ancient Burmese nat offering shrine with blood-red symbols.',
          soundCue: 'drone',
          isGlitch: true,
        },
        {
          speakerType: 'player',
          text: 'These are Mama May’s occult notes on guardian spirits... The text reads: "The Nat does not protect the dead; it holds the curse bound inside the stones."',
          soundCue: 'paper',
        },
        {
          speakerType: 'player',
          text: 'All doors in this study hall are deadbolted. I cannot escape through here!',
        },
      ],
    },
    {
      id: 'boiler_hatch',
      tier: 2,
      areaCode: 'AREA 2-C',
      roman: 'III',
      title: 'Basement Boiler Hatch',
      subtitle: 'Flooded Sub-Level Chute',
      desc: 'A heavy iron trapdoor leaking black oily water and smelling of wet cement.',
      bgImage: '/assets/uni_room_chp1_bg1.jpg',
      clueId: 'boiler_concrete',
      clueTitle: 'Masonry Trowel & Quick-Dry Cement',
      isCorrectRoute: false,
      timePenaltySeconds: 40,
      composureDrain: 10,
      subtleClues: {
        airflow: 'Warm petroleum fumes and foul subterranean dampness.',
        acoustic: 'Gurgling water splashing against submerged pipes.',
        affinity: 'Low (Dead End / Interior Trap)',
      },
      lines: [
        {
          speakerType: 'player',
          text: 'A basement hatch... The trapdoor is partially lifted, leaking oily, black floodwater into the corridor.',
        },
        {
          speakerType: 'environment',
          text: 'Splaaash! From the black depths of the hatch, a pale, waterlogged hand thrusts upward, clawing at the wooden frame before sinking back into the murky deep!',
          soundCue: 'drone',
          isGlitch: true,
        },
        {
          speakerType: 'player',
          text: 'WHAT WAS THAT?! Beside the opening sits an empty sack of quick-dry cement and a rusted masonry trowel from August 1998.',
          soundCue: 'select',
        },
        {
          speakerType: 'player',
          text: 'This chute is completely flooded and dangerous. I must step back immediately!',
        },
      ],
    },
  ],

  // ==========================================
  // TIER 3: COURTYARD GROUNDS (THE FINAL CLIMAX)
  // ==========================================
  3: [
    {
      id: 'courtyard_well',
      tier: 3,
      areaCode: 'AREA 3-A',
      roman: 'I',
      title: 'Courtyard Nat Shrine',
      subtitle: 'The Chained Dried Well',
      desc: 'An ancient banyan tree towering over a chained brick well under the torrential monsoon rain.',
      bgImage: '/assets/uni_room_chp1_bg1.jpg',
      clueId: 'well_key',
      clueTitle: 'Courtyard Dried Well Brass Key',
      isCorrectRoute: true,
      timePenaltySeconds: 0,
      composureDrain: 0,
      subtleClues: {
        airflow: 'Violent monsoon storm winds blowing torrential rain across the open sky.',
        acoustic: 'Thunderous downpour and deep resonant metal vibrations from the well chains.',
        affinity: 'Primary (Source of Supernatural Curse)',
      },
      lines: [
        {
          speakerType: 'player',
          text: 'The courtyard... The torrential rain is pounding against the cracked flagstones. At the center stands an ancient brick well wrapped in rusted iron chains and barbed wire.',
          soundCue: 'drone',
        },
        {
          speakerType: 'environment',
          text: 'Beneath the sacred banyan tree, the stone Guardian Nat sits in rigid, cold meditation. Suddenly, above the well, the horrifying, glitching corpse of Mama May flickers violently into existence!',
          soundCue: 'drone',
          isGlitch: true,
        },
        {
          speakerType: 'mama_may',
          text: 'They threw me into this well alive in August 1998... and poured wet concrete over my cries. But the seal is cracking. The killer still walks freely in the city.',
          soundCue: 'drone',
        },
        {
          speakerType: 'player',
          text: 'Her corpse... it was sealed right here inside the dried well! And the Guardian Nat was placed here to bind her restless soul! The entire hostel is cursed!',
        },
        {
          speakerType: 'mama_may',
          text: 'If you want to survive and escape this hostel alive, take my brass key. In Chapter 2, you must decipher the nat’s four directions and open the well.',
          soundCue: 'select',
        },
        {
          speakerType: 'player',
          text: 'I understand now... I have to escape this 1998 temporal echo and uncover the full truth in Chapter 2 before the entity claims my soul!',
        },
      ],
    },
    {
      id: 'bicycle_shed',
      tier: 3,
      areaCode: 'AREA 3-B',
      roman: 'II',
      title: 'Overgrown Bicycle Shed',
      subtitle: 'Rusted Frames & Briars',
      desc: 'Corrugated zinc roofing rattling violently over dense thorny brambles.',
      bgImage: '/assets/main_menu.jpg',
      clueId: 'curfew_log',
      clueTitle: 'Broken 1998 Bicycle Lock',
      isCorrectRoute: false,
      timePenaltySeconds: 30,
      composureDrain: 6,
      subtleClues: {
        airflow: 'Rain blowing sideways under the rusted corrugated roof.',
        acoustic: 'Deafening drum of raindrops against corrugated tin sheets.',
        affinity: 'Low (Dead End / Interior Trap)',
      },
      lines: [
        {
          speakerType: 'player',
          text: 'The bicycle shed in the corner of the courtyard... A dozen rusted 1990s bicycles are tangled in thick, impenetrable bramble vines.',
        },
        {
          speakerType: 'environment',
          text: 'Creak... Squeak... The rusted pedal of a vintage bicycle begins spinning furiously on its own, throwing off flecks of mud and water!',
          soundCue: 'drone',
          isGlitch: true,
        },
        {
          speakerType: 'player',
          text: 'The back perimeter wall here has collapsed into jagged brick rubble and razor wire. There is no passage through this barrier!',
        },
        {
          speakerType: 'player',
          text: 'The dried well in the center of the courtyard is the only place radiating supernatural energy.',
        },
      ],
    },
    {
      id: 'front_gate',
      tier: 3,
      areaCode: 'AREA 3-C',
      roman: 'III',
      title: 'Hostel Perimeter Gate',
      subtitle: 'Spiked Municipal Grille',
      desc: 'Towering cast-iron gates wrapped in heavy chains and a lead municipal seal.',
      bgImage: '/assets/uni_room_chp1_bg1.jpg',
      clueId: 'missing_notice',
      clueTitle: '1998 Police Barricade Chain',
      isCorrectRoute: false,
      timePenaltySeconds: 35,
      composureDrain: 8,
      subtleClues: {
        airflow: 'Heavy wind pressing against the massive iron grille.',
        acoustic: 'Thunder cracks rattling the iron spikes.',
        affinity: 'Low (Dead End / Interior Trap)',
      },
      lines: [
        {
          speakerType: 'player',
          text: 'The front entrance gate of the hostel... Towering black iron spikes reach into the rainy night.',
        },
        {
          speakerType: 'environment',
          text: 'Through the iron bars, you see the dark streets of 1998... A shadowy figure holding a black umbrella stands motionless in the downpour, staring directly at you before vanishing into thin air!',
          soundCue: 'drone',
          isGlitch: true,
        },
        {
          speakerType: 'player',
          text: 'The gate is triple-chained with a heavy government padlock from the outside! Nobody can leave through the front gate!',
        },
        {
          speakerType: 'player',
          text: 'The supernatural rupture originates from the dried well near the banyan tree. That is my only path!',
        },
      ],
    },
  ],
};

export const VisualNovelEngine: React.FC = () => {
  const navigate = useNavigate();
  const {
    completeChapter,
    composure,
    setComposure,
    discoveredClues,
    addDiscoveredClue,
    setChapter1TimeSeconds,
  } = useGameProgress();

  const [mode, setMode] = useState<EngineMode>('phase1_2');
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());
  const [isPauseOpen, setIsPauseOpen] = useState<boolean>(false);
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);
  const [selectedCharacter, setSelectedCharacter] = useState<MCCharacter>(CHARACTERS[0]);
  const [isChapterFinished, setIsChapterFinished] = useState<boolean>(false);

  // 10-Minute Timer & Composure State
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes = 600s
  const [currentTier, setCurrentTier] = useState<1 | 2 | 3>(1);
  const [selectedLocationIdx, setSelectedLocationIdx] = useState<number>(0);
  const [investigatedLocIds, setInvestigatedLocIds] = useState<string[]>([]);
  const [activeInvestigatingLoc, setActiveInvestigatingLoc] = useState<ExplorationLocation | null>(null);
  const [locLineIndex, setLocLineIndex] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // Reference for timer tracking
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 10-Minute Countdown Clock
  useEffect(() => {
    if (mode === 'shattering' || mode === 'character_select' || isChapterFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          // Panic threshold!
          setComposure((c) => Math.max(5, c - 2));
          return 0;
        }

        // Natural slow decay of composure over time
        if (prev % 15 === 0) {
          setComposure((c) => Math.max(10, c - 1));
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, isChapterFinished]);

  // Current active dialogue line for Phase 1 & 2
  const currentP12Line = PHASE1_2_SCRIPT[currentLineIndex] || PHASE1_2_SCRIPT[0];

  // Awakening lines for Phase 3
  const AWAKENING_LINES = [
    {
      speaker: selectedCharacter.name,
      text: 'Ugh... My head is throbbing violently... What happened? Where did everyone go?!',
      soundCue: 'paper' as const,
    },
    {
      speaker: selectedCharacter.name,
      text: 'The ritual tea glass shattered into pieces on the table... The room is cold as death, and the electric lights are dead. That calendar on the wall... it reads: AUGUST 1998.',
      soundCue: 'drone' as const,
    },
    {
      speaker: selectedCharacter.name,
      text: 'I have been displaced into 1998! The door to the corridor is swinging wide open into the dark. I need to observe the air drafts and find my escape path...',
      soundCue: 'select' as const,
    },
  ];

  // Locations currently available in the active tier
  const activeTierLocations = ALL_TIERED_LOCATIONS[currentTier] || ALL_TIERED_LOCATIONS[1];

  // Current text payload
  const getCurrentTextPayload = (): {
    text: string;
    soundCue?: string;
    isGlitch?: boolean;
    speakerName: string;
    characterId: string;
    isPlayer: boolean;
  } => {
    if (mode === 'phase1_2') {
      return {
        text: currentP12Line.text,
        soundCue: currentP12Line.soundCue,
        speakerName: currentP12Line.speaker,
        characterId: currentP12Line.characterId,
        isPlayer: false,
      };
    }
    if (mode === 'awakening') {
      const step = AWAKENING_LINES[currentLineIndex] || AWAKENING_LINES[0];
      return {
        text: step.text,
        soundCue: step.soundCue,
        speakerName: selectedCharacter.name,
        characterId: selectedCharacter.id,
        isPlayer: true,
      };
    }
    if (mode === 'investigating_location' && activeInvestigatingLoc) {
      const step = activeInvestigatingLoc.lines[locLineIndex] || activeInvestigatingLoc.lines[0];
      return {
        text: step.text,
        soundCue: step.soundCue,
        isGlitch: step.isGlitch,
        speakerName:
          step.speakerType === 'player'
            ? selectedCharacter.name
            : step.speakerType === 'mama_may'
            ? 'Mama May (1998)'
            : 'Hostel Environment',
        characterId:
          step.speakerType === 'player'
            ? selectedCharacter.id
            : step.speakerType === 'mama_may'
            ? 'mama_may'
            : 'environment',
        isPlayer: step.speakerType === 'player',
      };
    }
    return {
      text: '',
      speakerName: selectedCharacter.name,
      characterId: selectedCharacter.id,
      isPlayer: true,
    };
  };

  const currentStep = getCurrentTextPayload();

  // Typewriter effect
  useEffect(() => {
    if (
      mode === 'shattering' ||
      mode === 'character_select' ||
      mode === 'location_select' ||
      isChapterFinished
    ) {
      return;
    }

    let charIndex = 0;
    setIsTyping(true);
    setDisplayedText('');

    const fullText = currentStep.text;
    const interval = setInterval(() => {
      charIndex++;
      setDisplayedText(fullText.slice(0, charIndex));
      if (charIndex >= fullText.length) {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 20);

    if (currentStep.soundCue) {
      if (currentStep.soundCue === 'paper') sound.playPaperRustle();
      else if (currentStep.soundCue === 'select') sound.playMenuSelect();
      else if (currentStep.soundCue === 'hover') sound.playMenuHover();
      else if (currentStep.soundCue === 'drone') sound.playDramaticSting();
      else if (currentStep.soundCue === 'break') sound.playGlassBreak();
    }

    return () => clearInterval(interval);
  }, [currentLineIndex, locLineIndex, mode, isChapterFinished]);

  // Keyboard navigation: Enter/Space to advance, ArrowUp/Backspace to REWIND, Esc to pause, N for Notebook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isNotesOpen) {
          setIsNotesOpen(false);
          sound.playPaperRustle();
          return;
        }
        setIsPauseOpen((prev) => !prev);
        sound.playPaperRustle();
        return;
      }

      if (e.key === 'n' || e.key === 'N') {
        if (!isPauseOpen && mode !== 'character_select' && mode !== 'shattering') {
          sound.playPaperRustle();
          setIsNotesOpen((prev) => !prev);
          return;
        }
      }

      if (isPauseOpen || isNotesOpen || isChapterFinished) return;

      if (mode === 'phase1_2' || mode === 'awakening' || mode === 'investigating_location') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          advanceDialogue();
        } else if (e.key === 'ArrowUp' || e.key === 'Backspace' || e.key === 'ArrowLeft') {
          e.preventDefault();
          rewindDialogue();
        }
      } else if (mode === 'location_select') {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          sound.playMenuHover();
          setSelectedLocationIdx((prev) => Math.max(0, prev - 1));
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          sound.playMenuHover();
          setSelectedLocationIdx((prev) => Math.min(activeTierLocations.length - 1, prev + 1));
        } else if (['1', '2', '3'].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          if (idx >= 0 && idx < activeTierLocations.length) {
            sound.playMenuHover();
            setSelectedLocationIdx(idx);
          }
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleEnterLocation(selectedLocationIdx);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    mode,
    currentLineIndex,
    locLineIndex,
    selectedLocationIdx,
    isTyping,
    isPauseOpen,
    isNotesOpen,
    isChapterFinished,
    activeInvestigatingLoc,
    activeTierLocations,
  ]);

  // REWIND / GO BACK ONE DIALOGUE STEP
  const rewindDialogue = () => {
    sound.playPaperRustle();
    if (mode === 'phase1_2') {
      setCurrentLineIndex((prev) => Math.max(0, prev - 1));
    } else if (mode === 'awakening') {
      setCurrentLineIndex((prev) => Math.max(0, prev - 1));
    } else if (mode === 'investigating_location' && activeInvestigatingLoc) {
      setLocLineIndex((prev) => Math.max(0, prev - 1));
    }
  };

  // ADVANCE DIALOGUE STEP
  const advanceDialogue = () => {
    if (isTyping) {
      setDisplayedText(currentStep.text);
      setIsTyping(false);
      return;
    }

    if (mode === 'phase1_2') {
      if (currentP12Line.isClimax) {
        triggerShatterTransition();
        return;
      }
      setCurrentLineIndex((prev) => prev + 1);
    } else if (mode === 'awakening') {
      if (currentLineIndex >= AWAKENING_LINES.length - 1) {
        setMode('location_select');
        setIsZoomed(false);
        sound.playMenuSelect();
      } else {
        setCurrentLineIndex((prev) => prev + 1);
      }
    } else if (mode === 'investigating_location' && activeInvestigatingLoc) {
      if (locLineIndex >= activeInvestigatingLoc.lines.length - 1) {
        // Conclude location investigation!
        const loc = activeInvestigatingLoc;
        if (!investigatedLocIds.includes(loc.id)) {
          setInvestigatedLocIds((prev) => [...prev, loc.id]);
        }

        // Add discovered clue to notebook!
        addDiscoveredClue(loc.clueId);

        // Deduct time / composure penalties for wrong routes
        if (!loc.isCorrectRoute) {
          setTimeLeft((t) => Math.max(10, t - loc.timePenaltySeconds));
          setComposure((c) => Math.max(10, c - loc.composureDrain));
          sound.playDamage();
        }

        // Check if this was the decisive climax route (Courtyard Well in Tier 3)
        if (loc.tier === 3 && loc.isCorrectRoute) {
          finishChapter();
          return;
        }

        // If this was the correct route in Tier 1 or Tier 2, branch to the next tier!
        if (loc.tier === 1 && loc.isCorrectRoute) {
          setCurrentTier(2);
          setSelectedLocationIdx(0);
        } else if (loc.tier === 2 && loc.isCorrectRoute) {
          setCurrentTier(3);
          setSelectedLocationIdx(0);
        }

        // Return to 3 location cards view
        sound.playPaperRustle();
        setIsZoomed(false);
        setMode('location_select');
      } else {
        setLocLineIndex((prev) => prev + 1);
      }
    }
  };

  // Climax shatter shockwave transition -> Character Select
  const triggerShatterTransition = () => {
    setMode('shattering');
    sound.playGlassBreak();

    setTimeout(() => {
      setMode('character_select');
    }, 1400);
  };

  // Called when investigator is chosen
  const handleCharacterSelected = (characterId: MCId) => {
    const chosen = CHARACTERS.find((c) => c.id === characterId) || CHARACTERS[0];
    setSelectedCharacter(chosen);
    setCurrentLineIndex(0);
    setMode('awakening');
  };

  // Enter a location from the 3 cards
  const handleEnterLocation = (index: number) => {
    const loc = activeTierLocations[index];
    if (!loc) return;

    sound.playDramaticSting();
    setActiveInvestigatingLoc(loc);
    setLocLineIndex(0);
    setIsZoomed(true); // Smooth cinematic background zoom-in!
    setMode('investigating_location');
  };

  // Finish Chapter 1 & Unlock Chapter 2
  const finishChapter = () => {
    const timeTaken = 600 - timeLeft;
    setChapter1TimeSeconds(timeTaken);
    completeChapter(1);
    sound.playSuccessTune();
    setIsChapterFinished(true);
  };

  // Restart Chapter 1
  const handleRestartChapter = () => {
    setMode('phase1_2');
    setCurrentLineIndex(0);
    setCurrentTier(1);
    setTimeLeft(600);
    setComposure(100);
    setInvestigatedLocIds([]);
    setActiveInvestigatingLoc(null);
    setLocLineIndex(0);
    setIsZoomed(false);
    setIsChapterFinished(false);
    setIsPauseOpen(false);
    setIsNotesOpen(false);
    sound.playPaperRustle();
  };

  const toggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  // Resolve active background image
  const getActiveBackground = (): string => {
    if (mode === 'location_select') {
      return activeTierLocations[selectedLocationIdx]?.bgImage || '/assets/uni_room_chp1_bg1.jpg';
    }
    if (mode === 'investigating_location' && activeInvestigatingLoc) {
      return activeInvestigatingLoc.bgImage;
    }
    return '/assets/uni_room_chp1_bg1.jpg';
  };

  // Time & Composure formatted display
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const getComposureColor = (c: number) => {
    if (c >= 75) return 'text-emerald-400 border-emerald-700 bg-emerald-950/70';
    if (c >= 50) return 'text-amber-400 border-amber-700 bg-amber-950/70';
    if (c >= 25) return 'text-orange-400 border-orange-700 bg-orange-950/70';
    return 'text-rose-500 border-rose-700 bg-rose-950/80 animate-pulse';
  };

  return (
    <div className="relative w-full h-full min-h-[620px] flex flex-col justify-between overflow-hidden select-none bg-transparent">
      {/* Dynamic Background is unified on the outermost AtmosphericLayout wrapper */}

      {/* 2. Supernatural Glitch Flicker Effect */}
      {currentStep.isGlitch && (
        <div className="absolute inset-0 z-10 pointer-events-none bg-red-950/25 mix-blend-color-dodge animate-pulse">
          <div className="w-full h-full opacity-35 bg-[repeating-linear-gradient(0deg,#000_0px,#000_2px,transparent_2px,transparent_4px)]" />
        </div>
      )}

      {/* 3. Glass Shatter & Blackout Shockwave */}
      {mode === 'shattering' && (
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

      {/* 4. Character Selection Screen (Appears After Blackout) */}
      <AnimatePresence>
        {mode === 'character_select' && (
          <div className="absolute inset-0 z-40 bg-stone-950/95 flex flex-col">
            <CharacterSelectScreen onSelectCharacter={handleCharacterSelected} />
          </div>
        )}
      </AnimatePresence>

      {/* 5. Top Header Status Bar */}
      <div className="relative w-full p-3 sm:p-5 flex items-center justify-between z-20 bg-gradient-to-b from-stone-950/90 via-stone-950/60 to-transparent">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Phase Badge */}
          <div className="px-3 py-1 bg-stone-950/90 border border-amber-500/80 rounded-lg text-xs font-mono font-bold tracking-wider text-amber-300 shadow-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span className="uppercase">
              {mode === 'phase1_2'
                ? currentP12Line.phase === 1
                  ? 'Phase 1 : The Discussion'
                  : 'Phase 2 : The Seance'
                : `Phase 3 • Sector 0${currentTier} / 03`}
            </span>
          </div>

          {/* 10-Minute Timer Badge */}
          {mode !== 'phase1_2' && mode !== 'shattering' && mode !== 'character_select' && (
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 bg-stone-900/90 border border-stone-700 rounded-lg text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5 shadow-md">
                <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{timeFormatted}</span>
              </div>

              {/* Composure Badge */}
              <div
                className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 shadow-md ${getComposureColor(
                  composure
                )}`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Composure: {composure}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls: Notebook, Audio & Pause */}
        <div className="flex items-center gap-2">
          {/* Case Notes / Notebook Button */}
          {mode !== 'phase1_2' && mode !== 'shattering' && mode !== 'character_select' && (
            <button
              onClick={() => {
                sound.playPaperRustle();
                setIsNotesOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-600/80 text-amber-200 hover:bg-amber-900 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              title="Open Case File [N]"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Case Notes</span>
              <span className="bg-amber-600 text-stone-950 px-1 rounded text-[10px]">
                {discoveredClues.length}
              </span>
            </button>
          )}

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

      {/* ======================================================== */}
      {/* 6. MODE A: 3 LOCATION SELECTION CARDS (Multi-tier Branching) */}
      {/* ======================================================== */}
      {mode === 'location_select' && (
        <div className="relative flex-1 flex flex-col justify-center items-center px-4 py-2 z-20">
          <div className="text-center mb-3 sm:mb-6">
            <span className="text-[11px] font-mono tracking-widest text-amber-500 uppercase font-semibold">
              SECTOR 0{currentTier} • CHOOSE FORWARD PATHWAY
            </span>
            <h2
              className="text-3xl sm:text-5xl font-black text-stone-100 tracking-wider uppercase drop-shadow-lg"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
            >
              {currentTier === 1
                ? 'CHOOSE CORRIDOR WING'
                : currentTier === 2
                ? 'CHOOSE GROUND APPROACH'
                : 'COURTYARD PERIMETER • FINAL PATH'}
            </h2>
            <p className="text-xs font-mono text-stone-400 mt-1 tracking-wider">
              [←/→] Select • [ENTER] Investigate • Observe air currents & drafts to find the escape route
            </p>
          </div>

          {/* 3 Location Cards Showcase (Centered side-by-side) */}
          <div className="relative w-full max-w-5xl flex items-center justify-center px-2 sm:px-6">
            {/* Left Chevron */}
            <button
              onClick={() => {
                sound.playMenuHover();
                setSelectedLocationIdx((prev) => Math.max(0, prev - 1));
              }}
              disabled={selectedLocationIdx === 0}
              className={`flex absolute left-0 sm:-left-3 lg:-left-5 z-30 w-10 h-10 sm:w-11 sm:h-11 items-center justify-center rounded-full bg-stone-950/85 border border-stone-800 transition-all ${
                selectedLocationIdx === 0
                  ? 'opacity-20 cursor-not-allowed text-stone-600'
                  : 'hover:bg-amber-950/60 hover:border-amber-600/80 text-stone-300 hover:text-amber-300 shadow-xl cursor-pointer'
              }`}
              aria-label="Previous Location"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Cards Grid */}
            <div className="w-full flex items-center justify-center gap-3 sm:gap-4 md:gap-6 py-2">
              {activeTierLocations.map((loc, idx) => {
                const isSelected = selectedLocationIdx === idx;
                const isInvestigated = investigatedLocIds.includes(loc.id);

                return (
                  <motion.div
                    key={loc.id}
                    onClick={() => {
                      if (selectedLocationIdx !== idx) {
                        sound.playMenuHover();
                        setSelectedLocationIdx(idx);
                      } else {
                        handleEnterLocation(idx);
                      }
                    }}
                    whileHover={{ y: -4 }}
                    className={`relative flex-1 max-w-[280px] sm:max-w-[250px] md:max-w-[280px] lg:max-w-[310px] min-h-[420px] rounded-2xl p-4 sm:p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer overflow-hidden border ${
                      isSelected
                        ? 'flex bg-gradient-to-b from-stone-900/95 via-stone-950/95 to-black/95 border-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.35)] scale-105 z-20 ring-1 ring-amber-500/50'
                        : 'hidden sm:flex bg-stone-950/85 border-stone-800/80 opacity-75 hover:opacity-95 hover:border-stone-700 scale-95'
                    }`}
                  >
                    {/* Background Roman Watermark */}
                    <div
                      className="absolute right-4 -bottom-6 text-9xl font-black text-stone-800/20 select-none pointer-events-none"
                      style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                    >
                      {loc.roman}
                    </div>

                    {/* Top Status & Area Code */}
                    <div className="flex items-center justify-between w-full z-10">
                      <span className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase">
                        {loc.areaCode}
                      </span>

                      {isInvestigated ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-950/80 border border-emerald-700 text-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          SEARCHED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-950/80 border border-amber-600 text-amber-300">
                          <Eye className="w-3 h-3 text-amber-400" />
                          UNEXPLORED
                        </span>
                      )}
                    </div>

                    {/* Middle Title & Environmental Clues */}
                    <div className="my-auto z-10 text-center space-y-2">
                      <div>
                        <div className="text-stone-400 font-mono text-xs tracking-widest uppercase mb-1">
                          {loc.subtitle}
                        </div>
                        <h3
                          className={`text-2xl sm:text-3xl font-black tracking-wider uppercase transition-colors ${
                            isSelected ? 'text-amber-200' : 'text-stone-200'
                          }`}
                          style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                        >
                          {loc.title}
                        </h3>
                      </div>

                      <p className="text-xs text-stone-400 font-mono leading-relaxed line-clamp-2">
                        {loc.desc}
                      </p>

                      {/* Subtle Environmental Observations */}
                      <div className="pt-2 border-t border-stone-800/80 text-left space-y-1.5 text-[11px] font-mono">
                        <div className="flex items-start gap-1.5 text-stone-300">
                          <Wind className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                          <span className="text-[10px] leading-tight">
                            <strong className="text-amber-400">Airflow:</strong> {loc.subtleClues.airflow}
                          </span>
                        </div>

                        <div className="flex items-start gap-1.5 text-stone-400">
                          <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-[10px] leading-tight">
                            <strong className="text-stone-300">Affinity:</strong>{' '}
                            <span
                              className={
                                loc.subtleClues.affinity.includes('High') ||
                                loc.subtleClues.affinity.includes('Primary')
                                  ? 'text-emerald-400 font-bold'
                                  : 'text-rose-400'
                              }
                            >
                              {loc.subtleClues.affinity}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Area */}
                    <div className="z-10 w-full pt-3 border-t border-stone-800/80 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnterLocation(idx);
                        }}
                        className={`w-full py-2.5 rounded-xl font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                            : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700'
                        }`}
                        style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", fontSize: '1.15rem' }}
                      >
                        <MapPin className="w-4 h-4" />
                        <span>{isInvestigated ? 'RE-EXAMINE' : 'INVESTIGATE'}</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Chevron */}
            <button
              onClick={() => {
                sound.playMenuHover();
                setSelectedLocationIdx((prev) => Math.min(activeTierLocations.length - 1, prev + 1));
              }}
              disabled={selectedLocationIdx === activeTierLocations.length - 1}
              className={`flex absolute right-0 sm:-right-3 lg:-right-5 z-30 w-10 h-10 sm:w-11 sm:h-11 items-center justify-center rounded-full bg-stone-950/85 border border-stone-800 transition-all ${
                selectedLocationIdx === activeTierLocations.length - 1
                  ? 'opacity-20 cursor-not-allowed text-stone-600'
                  : 'hover:bg-amber-950/60 hover:border-amber-600/80 text-stone-300 hover:text-amber-300 shadow-xl cursor-pointer'
              }`}
              aria-label="Next Location"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. MODE B: DIALOGUE & INVESTIGATION VIEW */}
      {/* ======================================================== */}
      {mode !== 'location_select' && mode !== 'character_select' && mode !== 'shattering' && (
        <>
          {/* Character Portraits Container */}
          <div className="relative w-full max-w-5xl mx-auto flex items-end justify-between px-4 sm:px-12 h-60 sm:h-72 md:h-80 pointer-events-none z-10">
            {/* Left Slot Character */}
            <div className="relative h-full flex items-end">
              <InkPortrait
                characterId={
                  mode === 'phase1_2'
                    ? currentP12Line.characterId
                    : selectedCharacter.id
                }
                speakerName={
                  mode === 'phase1_2'
                    ? currentP12Line.pos === 'left' ? currentP12Line.speaker : undefined
                    : selectedCharacter.name
                }
                isSpeaking={
                  mode === 'phase1_2'
                    ? currentP12Line.pos === 'left'
                    : mode === 'investigating_location' && activeInvestigatingLoc
                    ? activeInvestigatingLoc.lines[locLineIndex]?.speakerType === 'player'
                    : true
                }
                position="left"
                size="lg"
              />
            </div>

            {/* Right Slot Character */}
            <div className="relative h-full flex items-end">
              <InkPortrait
                characterId={
                  mode === 'phase1_2'
                    ? currentP12Line.characterId
                    : mode === 'investigating_location' &&
                      activeInvestigatingLoc?.lines[locLineIndex]?.speakerType === 'mama_may'
                    ? 'mama_may'
                    : 'hsu_myat_shein'
                }
                speakerName={
                  mode === 'phase1_2'
                    ? currentP12Line.pos === 'right' ? currentP12Line.speaker : undefined
                    : mode === 'investigating_location' &&
                      activeInvestigatingLoc?.lines[locLineIndex]?.speakerType === 'mama_may'
                    ? 'Mama May (1998)'
                    : undefined
                }
                isSpeaking={
                  mode === 'phase1_2'
                    ? currentP12Line.pos === 'right'
                    : mode === 'investigating_location' && activeInvestigatingLoc
                    ? activeInvestigatingLoc.lines[locLineIndex]?.speakerType !== 'player'
                    : false
                }
                position="right"
                size="lg"
              />
            </div>
          </div>

          {/* Thematic Dialogue Box Area with REWIND & ADVANCE Features */}
          <div className="relative w-full max-w-4xl mx-auto px-4 pb-4 sm:pb-8 z-20">
            <div
              onClick={advanceDialogue}
              className="w-full relative rounded-2xl bg-stone-950/90 backdrop-blur-xl border-2 border-amber-900/60 p-5 sm:p-7 shadow-2xl transition-all duration-200 cursor-pointer hover:border-amber-600/80 group ring-1 ring-black/80"
            >
              {/* Corner Accents */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-500/60 pointer-events-none" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-500/60 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-500/60 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-500/60 pointer-events-none" />

              {/* Speaker Name & Rewind Bar */}
              <div className="flex items-center justify-between mb-3 border-b border-stone-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xl sm:text-2xl font-black tracking-wider uppercase text-amber-400 drop-shadow"
                    style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                  >
                    {currentStep.speakerName}
                  </span>

                  <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase hidden sm:inline">
                    {mode === 'investigating_location' && activeInvestigatingLoc
                      ? `[${activeInvestigatingLoc.title.toUpperCase()}]`
                      : mode === 'awakening'
                      ? '[1998 TEMPORAL DISPLACEMENT]'
                      : '[1998 HOSTEL SEANCE]'}
                  </span>
                </div>

                {/* Rewind Button */}
                <div className="flex items-center gap-2">
                  {((mode === 'phase1_2' && currentLineIndex > 0) ||
                    (mode === 'awakening' && currentLineIndex > 0) ||
                    (mode === 'investigating_location' && locLineIndex > 0)) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        rewindDialogue();
                      }}
                      className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-amber-300 text-xs font-mono flex items-center gap-1 cursor-pointer transition-all shadow"
                      title="Rewind previous line [↑] or [Backspace]"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Rewind</span>
                    </button>
                  )}

                  <span className="text-[11px] font-mono text-amber-500/80">
                    {isTyping ? 'Typing...' : 'Ready'}
                  </span>
                </div>
              </div>

              {/* Dialogue Text Body with Typewriter Animation */}
              <p className="text-stone-100 font-sans text-sm sm:text-base md:text-lg leading-relaxed min-h-[56px] sm:min-h-[64px] tracking-wide select-text">
                {displayedText}
                {isTyping && <span className="inline-block w-2 h-4 bg-amber-400 ml-1 animate-pulse" />}
              </p>

              {/* Advance Hint / Actions */}
              <div className="mt-4 flex items-center justify-between text-xs font-mono text-stone-400 border-t border-stone-800/60 pt-2">
                <span className="text-[11px] text-stone-400">
                  Press <span className="text-amber-400 font-bold">[ENTER]</span> • Rewind{' '}
                  <span className="text-stone-300 font-bold">[↑]</span>
                </span>

                <div className="flex items-center gap-1 text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span className="font-semibold">
                    {mode === 'phase1_2' && currentP12Line.isClimax
                      ? 'TRIGGER CLIMAX'
                      : mode === 'investigating_location' &&
                        activeInvestigatingLoc &&
                        locLineIndex >= activeInvestigatingLoc.lines.length - 1
                      ? activeInvestigatingLoc.tier === 3 && activeInvestigatingLoc.isCorrectRoute
                        ? 'UNCOVER TRUTH'
                        : 'RETURN TO PATHS'
                      : 'CONTINUE'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* 8. CHAPTER 1 COMPLETED CELEBRATION MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isChapterFinished && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl bg-stone-950 border-2 border-amber-500 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.4)] text-center"
            >
              <div className="w-16 h-16 rounded-full bg-amber-950/80 border-2 border-amber-500 mx-auto flex items-center justify-center mb-4 text-amber-400 shadow-xl">
                <Key className="w-8 h-8" />
              </div>

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

              <div className="grid grid-cols-2 gap-2 my-4 text-xs font-mono text-stone-300">
                <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                  <div className="text-[10px] text-stone-500">STARTING COMPOSURE</div>
                  <div className="text-amber-400 font-bold text-sm">{composure}%</div>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                  <div className="text-[10px] text-stone-500">TIME ELAPSED</div>
                  <div className="text-amber-400 font-bold text-sm">
                    {Math.floor((600 - timeLeft) / 60)}m {(600 - timeLeft) % 60}s
                  </div>
                </div>
              </div>

              <p className="text-stone-300 text-xs sm:text-sm font-mono mb-6 leading-relaxed">
                You navigated the multi-tier 1998 hostel corridors, recovered the Caretaker's Bribe Ledger, encountered Mama May's corpse at the chained dried well, and retrieved the Courtyard Key. Your composure will determine your mental fortitude in Chapter 2!
              </p>

              <div className="p-3.5 rounded-xl bg-amber-950/50 border border-amber-600/80 flex items-center justify-center gap-3 text-amber-200 text-sm font-mono mb-6">
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                <span className="font-bold">CHAPTER 2: UNDERSTANDING IS NOW UNLOCKED!</span>
              </div>

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

      {/* 9. Case Notes Modal (Accessible Anytime in Phase 3) */}
      <CaseNotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        investigatorName={selectedCharacter.name}
        investigatorArchetype={selectedCharacter.archetype}
        composure={composure}
        timeLeftSeconds={timeLeft}
        discoveredClueIds={discoveredClues}
      />

      {/* 10. Pause Modal */}
      <PauseModal
        isOpen={isPauseOpen}
        onClose={() => setIsPauseOpen(false)}
        onRestart={handleRestartChapter}
        onQuit={() => navigate('/chapters')}
      />
    </div>
  );
};
