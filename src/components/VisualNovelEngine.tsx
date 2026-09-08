import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useGameProgress } from '../context/GameProgressContext';
import { sound } from '../audioEngine';
import { MCId, MCCharacter, Room4BSubScene, Phase3Location } from '../types';
import { CHARACTERS, ROOM_4B_ASSETS, PHASE_3_ASSETS, ITEMS } from '../gameData';
import { InkPortrait, getCharacterPortraitSrc } from './InkPortrait';
import { CharacterSelectModal } from './CharacterSelectModal';
import { CharacterSelectScreen } from './CharacterSelectScreen';
import { PauseModal } from './PauseModal';
import { CaseNotesModal } from './CaseNotesModal';
import { DialogueOverlay, ThoughtMonologueOverlay } from './DialogueOverlay';
import { ChapterTransitionModal } from './ChapterTransitionModal';
import {
  saveChapterOneProgress,
  loadChapterOneProgress,
  clearChapterOneProgress,
  lockChapterOneAndSave,
  loadActiveGameProgress,
  ACTIVE_SAVE_KEY,
} from '../gameStore';
import { ChapterProgressSave } from '../types';
import {
  Volume2,
  VolumeX,
  Pause,
  Sparkles,
  Play,
  Key,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  MapPin,
  Eye,
  BookOpen,
  Clock,
  AlertTriangle,
  Wind,
  Compass,
  Hammer,
  Shield,
  Search,
  X,
  ArrowLeft,
  Lock,
  Unlock,
  AlertCircle,
  Radio,
  RotateCcw,
  Flame,
  Bell,
} from 'lucide-react';

export type ChapterPhase = 1 | 2 | 3;

type EngineMode =
  | 'phase1_2'
  | 'shattering'
  | 'character_select'
  | 'awakening'
  | 'room_escape'
  | 'phase3'
  | 'location_select'
  | 'investigating_location';

export { InteractiveHotspot, type InteractiveHotspotProps } from './InteractiveHotspot';
import { InteractiveHotspot } from './InteractiveHotspot';
import { Locker32ZoomView } from './Locker32ZoomView';
import { Locker09ZoomView } from './Locker09ZoomView';
import { LockersOverviewView } from './LockersOverviewView';
import { PrayerAltarView } from './PrayerAltarView';
export { Locker32ZoomView, Locker09ZoomView, LockersOverviewView, PrayerAltarView };

interface InitialDialogueStep {
  id: number;
  phase: 1 | 2;
  speaker: string;
  characterId: string;
  pos: 'left' | 'right';
  text: string;
  isClimax?: boolean;
  soundCue?: 'hover' | 'select' | 'paper' | 'damage' | 'drone' | 'break';
  bgImage?: string;
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
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 2,
    phase: 1,
    speaker: 'Ye Yint Hein',
    characterId: 'ye_yint_hein',
    pos: 'right',
    text: "A 90s ghost game? Who's going to scream first? It's just an old superstition the seniors invented to frighten freshmen.",
    soundCue: 'hover',
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 3,
    phase: 1,
    speaker: 'Moe Stheinkha',
    characterId: 'moe_stheinkha',
    pos: 'left',
    text: 'Keep your voice down, Ye Yint. The caretaker specifically warned everyone never to trespass into this abandoned wing after midnight.',
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 4,
    phase: 1,
    speaker: 'Hsu Myat Shein',
    characterId: 'hsu_myat_shein',
    pos: 'right',
    text: 'My grandmother warned me about this building... She said a senior named Mama May vanished here in August 1998, and her spirit never left.',
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 5,
    phase: 1,
    speaker: 'Yin Min Htike',
    characterId: 'yin_min_htike',
    pos: 'left',
    text: 'Look at this floorplan from the university registrar. Pathway 326 was walled off immediately after her disappearance. They claimed it was structural instability.',
    soundCue: 'paper',
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 6,
    phase: 1,
    speaker: 'Mona',
    characterId: 'mona',
    pos: 'right',
    text: "If you're all terrified, we can pack up our bags right now. But if we want the truth of what happened in 1998, we follow the ritual rules.",
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 7,
    phase: 1,
    speaker: 'May Jewel',
    characterId: 'may_jewel',
    pos: 'left',
    text: 'Gather close around the table. Here is the letter board and the tea glass. Everyone place the tip of your index finger on the rim of the glass.',
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 8,
    phase: 1,
    speaker: 'Ye Yint Hein',
    characterId: 'ye_yint_hein',
    pos: 'right',
    text: "Done. My finger is on it. Let's see if this 'guardian spirit' really exists.",
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 9,
    phase: 1,
    speaker: 'Moe Stheinkha',
    characterId: 'moe_stheinkha',
    pos: 'left',
    text: 'Remember the cardinal rule: whatever happens, do NOT break the circle or lift your finger until the spirit dismisses us.',
    soundCue: 'select',
    bgImage: ROOM_4B_ASSETS.seance2026,
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
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 11,
    phase: 2,
    speaker: 'Hsu Myat Shein',
    characterId: 'hsu_myat_shein',
    pos: 'right',
    text: 'Wait... did someone open the window? My breath is turning to mist... The air in this room suddenly dropped like ice.',
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 12,
    phase: 2,
    speaker: 'Moe Stheinkha',
    characterId: 'moe_stheinkha',
    pos: 'left',
    text: "Look at the red candle! The flame is trembling violently... and it's turning deep indigo blue! Don't move!",
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 13,
    phase: 2,
    speaker: 'Ye Yint Hein',
    characterId: 'ye_yint_hein',
    pos: 'right',
    text: "Hey, cut it out! Which one of you is pushing the glass? Don't mess around, stop pulling it!",
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 14,
    phase: 2,
    speaker: 'Yin Min Htike',
    characterId: 'yin_min_htike',
    pos: 'left',
    text: "Nobody is pushing it! Look at our knuckles, we're barely touching the rim! The glass is gliding across the paper on its own!",
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 15,
    phase: 2,
    speaker: 'Mona',
    characterId: 'mona',
    pos: 'right',
    text: 'It is spelling out letters... M... A... M... A... It is spelling Mama May!',
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 16,
    phase: 2,
    speaker: 'Hsu Myat Shein',
    characterId: 'hsu_myat_shein',
    pos: 'right',
    text: "A cold breath just whispered across the back of my neck... 'Why did you leave me in the dark?'",
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 17,
    phase: 2,
    speaker: 'Moe Stheinkha',
    characterId: 'moe_stheinkha',
    pos: 'left',
    text: 'Listen! Outside the wooden door... Heavy, wet barefoot steps dragging across the corridor floorboards!',
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 18,
    phase: 2,
    speaker: 'Ye Yint Hein',
    characterId: 'ye_yint_hein',
    pos: 'right',
    text: 'The glass is vibrating violently! It is spinning in circles! PULL YOUR HANDS AWAY!',
    bgImage: ROOM_4B_ASSETS.seance2026,
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
    bgImage: ROOM_4B_ASSETS.seance2026,
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

export interface VisualNovelEngineProps {
  initialChapter?: number;
}

export const VisualNovelEngine: React.FC<VisualNovelEngineProps> = ({ initialChapter }) => {
  const navigate = useNavigate();
  const {
    completeChapter,
    composure,
    setComposure,
    discoveredClues,
    addDiscoveredClue,
    setDiscoveredClues,
    setChapter1TimeSeconds,
    inventory,
    setInventory,
    addInventoryItem,
    hasInventoryItem,
    activeInspectSubScene,
    setActiveInspectSubScene,
    selectedInventoryItem,
    setSelectedInventoryItem,
    deskMugMoved,
    setDeskMugMoved,
    hasMagneticCompass,
    setHasMagneticCompass,
    doorSmashed,
    setDoorSmashed,
    doorUnlocked,
    setDoorUnlocked,
    hasBobbyPin,
    setHasBobbyPin,
    hasWoodenBat,
    setHasWoodenBat,
    phase3Location,
    setPhase3Location,
    hasSmallBrassKey,
    setHasSmallBrassKey,
    hasNylonRope,
    setHasNylonRope,
    washroomStallChecked,
    setWashroomStallChecked,
    washroomMirrorScratched,
    setWashroomMirrorScratched,
    stairwellGateInspected,
    setStairwellGateInspected,
    resetProgress,
    resetChapterOneProgress,
  } = useGameProgress();

  // Core Flow & Phase States
  const [phase, setPhase] = useState<number>(1);
  const [currentScene, setCurrentScene] = useState<string>('seance_room_4b_2026');
  const [currentSubScene, setCurrentSubScene] = useState<string | null>(null);
  const [mode, setMode] = useState<EngineMode>('phase1_2');
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());
  const [isPauseOpen, setIsPauseOpen] = useState<boolean>(false);
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);
  const [selectedCharacter, setSelectedCharacter] = useState<MCCharacter>(CHARACTERS[0]);
  const activeSpeakerSprite = getCharacterPortraitSrc(selectedCharacter.id);
  const [isChapterFinished, setIsChapterFinished] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Room 4B Point-and-Click States
  const [roomBanner, setRoomBanner] = useState<{ text: string; type: 'info' | 'success' | 'warn' } | null>(null);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);
  const [isCompassModalOpen, setIsCompassModalOpen] = useState<boolean>(false);
  const [inspectingItem, setInspectingItem] = useState<string | null>(null);
  const [doorRawTextShown, setDoorRawTextShown] = useState<boolean>(false);
  const [isDoorTransitioning, setIsDoorTransitioning] = useState<boolean>(false);
  const [isDoorInspectOpen, setIsDoorInspectOpen] = useState<boolean>(false);
  const [blackoutText, setBlackoutText] = useState<string>('');

  // Phase 3 States & Universal Thought Monologue
  const [activeMonologue, setActiveMonologue] = useState<string | null>(null);
  const setPhase3Message = setActiveMonologue;
  const phase3Message = activeMonologue;
  const [isCompassVibrating, setIsCompassVibrating] = useState<boolean>(false);

  // Phase 3 East Wing & Ritual States
  const [hasBlackCandlesCount, setHasBlackCandlesCount] = useState<number>(0);
  const [hasMatchesCount, setHasMatchesCount] = useState<number>(0);
  const [hasBronzeBell, setHasBronzeBell] = useState<boolean>(false);
  const [hasReadLocker32Note, setHasReadLocker32Note] = useState<boolean>(false);
  const [hasReadSandarLetters, setHasReadSandarLetters] = useState<boolean>(false);
  const [hasLocker09Candle, setHasLocker09Candle] = useState<boolean>(false);
  const [hasLocker09Matchbox, setHasLocker09Matchbox] = useState<boolean>(false);
  const [caretakerDoorUnlocked, setCaretakerDoorUnlocked] = useState<boolean>(false);
  const [altarCandlesPlaced, setAltarCandlesPlaced] = useState<number>(0);
  const [altarBellPlaced, setAltarBellPlaced] = useState<boolean>(false);
  const [natSummoned, setNatSummoned] = useState<boolean>(false);
  const [corridorShadowScareTriggered, setCorridorShadowScareTriggered] = useState<boolean>(false);
  const [chapter1Completed, setChapter1Completed] = useState<boolean>(false);
  const [keypadInput, setKeypadInput] = useState<string>('');
  const [spectralClimaxActive, setSpectralClimaxActive] = useState<boolean>(false);
  const [altarCandlesLit, setAltarCandlesLit] = useState<boolean>(false);
  const [chapter1VictoryActive, setChapter1VictoryActive] = useState<boolean>(false);
  const [corridorShadowFlash, setCorridorShadowFlash] = useState<boolean>(false);
  const [currentChapter, setCurrentChapter] = useState<number>(initialChapter || 1);
  const [isChapterTransitionOpen, setIsChapterTransitionOpen] = useState<boolean>(false);

  // 10-Minute Timer & Composure State
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes = 600s
  const [currentTier, setCurrentTier] = useState<1 | 2 | 3>(1);
  const [selectedLocationIdx, setSelectedLocationIdx] = useState<number>(0);
  const [investigatedLocIds, setInvestigatedLocIds] = useState<string[]>([]);
  const [activeInvestigatingLoc, setActiveInvestigatingLoc] = useState<ExplorationLocation | null>(null);
  const [locLineIndex, setLocLineIndex] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // Compatibility state aliases matching Chapter 1 reset spec
  const isPaused = isPauseOpen;
  const setIsPaused = setIsPauseOpen;
  const activeItemModal = inspectingItem;
  const setActiveItemModal = setInspectingItem;
  const timerSeconds = timeLeft;
  const setTimerSeconds = setTimeLeft;

  // Screen tracking for gameplay vs menu/modals
  const [currentScreen, setCurrentScreen] = useState<string>(
    mode === 'character_select' || mode === 'shattering' ? 'prologue' : 'gameplay'
  );

  useEffect(() => {
    if (isGameOver) {
      setCurrentScreen('game_over');
    } else if (isChapterFinished) {
      setCurrentScreen('victory');
    } else if (mode === 'character_select' || mode === 'shattering') {
      setCurrentScreen('prologue');
    } else {
      setCurrentScreen('gameplay');
    }
  }, [isGameOver, isChapterFinished, mode]);

  // ONLY true pause freezes the world clock and mental attrition:
  const isSystemPaused = isPaused || currentScreen !== 'gameplay';

  // Diegetic actions that MUST keep the clock running in real time:
  // - isInventoryOpen
  // - isCaseNotesOpen
  // - phase3Location === 'caretaker_door_keypad'
  // - dialogueState.active / activeMonologue

  const handleTimeoutGameOver = () => {
    setIsGameOver(true);
    setCurrentScreen('game_over');
    sound.stopAllAmbience();
    sound.playDamage();
  };

  // 10-Minute Countdown Clock Hook
  // Ensure the timer only suspends when isSystemPaused is true:
  useEffect(() => {
    if (isSystemPaused || timerSeconds <= 0) return;

    const timerInterval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          handleTimeoutGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isSystemPaused, timerSeconds]);

  // Ambient Composure Attrition Hook
  // Ensure mental drain continues ticking even while the player is reading notes, checking clues, or inspecting items:
  useEffect(() => {
    if (isSystemPaused || composure <= 5) return;

    // Passive ambient decay (e.g., 1% every 15s in haunted corridors)
    const composureInterval = setInterval(() => {
      setComposure((prev) => Math.max(5, prev - 1));
    }, 15000);

    return () => clearInterval(composureInterval);
  }, [isSystemPaused, composure]);

  // Monitor composure zero game over condition
  useEffect(() => {
    if (composure <= 0 && !isGameOver && !isChapterFinished && mode !== 'phase1_2') {
      setIsGameOver(true);
      setCurrentScreen('game_over');
      sound.stopAllAmbience();
      sound.playDamage();
    }
  }, [composure, isGameOver, isChapterFinished, mode]);

  // Load saved Chapter checkpoint on mount if present
  useEffect(() => {
    const activeSave = loadActiveGameProgress();
    if (initialChapter === 2 || (!initialChapter && activeSave && activeSave.chapter === 2 && activeSave.chapter1Completed)) {
      if (activeSave?.selectedCharacterId) {
        const char = CHARACTERS.find((c) => c.id === activeSave.selectedCharacterId);
        if (char) setSelectedCharacter(char);
      }
      if (typeof activeSave?.composure === 'number') {
        setComposure(activeSave.composure);
      }
      setCurrentChapter(2);
      setPhase(2);
      setPhase3Location(activeSave?.phase3Location || 'east_fork');
      setCurrentScene('pathway_326_main');
      setCurrentSubScene(null);
      setMode('phase3');
      setChapter1Completed(true);
      setCaretakerDoorUnlocked(true);
      setHasBlackCandlesCount(3);
      setHasMatchesCount(3);
      setHasBronzeBell(true);
      setHasBobbyPin(true);
      setHasWoodenBat(true);
      setHasSmallBrassKey(true);
      setHasNylonRope(true);
      setHasLocker09Candle(true);
      setHasLocker09Matchbox(true);
      setHasReadLocker32Note(true);
      setHasReadSandarLetters(true);
      setDoorUnlocked(true);
      setInventory([
        'bobby_pin',
        'wooden_bat',
        'small_brass_key_32',
        'coiled_nylon_rope',
        'black_beeswax_candle',
        'matchbox_three_stars',
        'bronze_prayer_bell',
      ]);
      sound.startAmbient();
      return;
    }

    const save = loadChapterOneProgress();
    if (
      save &&
      (save.currentPhase > 1 ||
        (save.inventory && save.inventory.length > 0) ||
        (save.discoveredClues && save.discoveredClues.length > 0) ||
        save.doorUnlocked)
    ) {
      setPhase(save.currentPhase);
      if (save.selectedCharacterId) {
        const char = CHARACTERS.find((c) => c.id === save.selectedCharacterId);
        if (char) setSelectedCharacter(char);
      }
      if (save.inventory) setInventory(save.inventory);
      if (save.discoveredClues) setDiscoveredClues(save.discoveredClues);
      setHasBobbyPin(Boolean(save.hasBobbyPin));
      setHasWoodenBat(Boolean(save.hasWoodenBat));
      setHasMagneticCompass(Boolean(save.hasMagneticCompass));
      setHasSmallBrassKey(Boolean(save.hasSmallBrassKey));
      setHasNylonRope(Boolean(save.hasNylonRope));
      setDeskMugMoved(Boolean(save.deskMugMoved));
      setDoorUnlocked(Boolean(save.doorUnlocked));
      if (typeof save.hasBlackCandlesCount === 'number') setHasBlackCandlesCount(save.hasBlackCandlesCount);
      if (typeof save.hasMatchesCount === 'number') setHasMatchesCount(save.hasMatchesCount);
      setHasBronzeBell(Boolean(save.hasBronzeBell));
      setHasReadLocker32Note(Boolean(save.hasReadLocker32Note));
      setHasReadSandarLetters(Boolean(save.hasReadSandarLetters));
      setHasLocker09Candle(Boolean(save.hasLocker09Candle || (typeof save.hasBlackCandlesCount === 'number' && save.hasBlackCandlesCount > 0)));
      setHasLocker09Matchbox(Boolean(save.hasLocker09Matchbox || (typeof save.hasMatchesCount === 'number' && save.hasMatchesCount > 0)));
      setCaretakerDoorUnlocked(Boolean(save.caretakerDoorUnlocked));
      if (typeof save.altarCandlesPlaced === 'number') setAltarCandlesPlaced(save.altarCandlesPlaced);
      setAltarBellPlaced(Boolean(save.altarBellPlaced));
      setNatSummoned(Boolean(save.natSummoned));
      setCorridorShadowScareTriggered(Boolean(save.corridorShadowScareTriggered));
      setChapter1Completed(Boolean(save.chapter1Completed));
      if (typeof save.composure === 'number') setComposure(save.composure);
      if (typeof save.timerSeconds === 'number') setTimeLeft(save.timerSeconds);

      if (save.currentPhase === 3) {
        const loc = save.phase3Location || 'hallway_threshold';
        setPhase3Location(loc);
        setCurrentScene('pathway_326_main');
        setCurrentSubScene(null);
        setMode('phase3');
        sound.startAmbient();
      } else if (save.currentPhase === 2) {
        setCurrentScene('room_4b_main');
        setCurrentSubScene(null);
        setMode('room_escape');
        setActiveInspectSubScene('main');
        sound.startAmbient();
      }
    }
  }, [initialChapter]);

  // Synchronize currentScene with engine mode
  useEffect(() => {
    if (currentScene === 'room_4b_main' && mode !== 'room_escape' && mode !== 'awakening') {
      setMode('room_escape');
      setActiveInspectSubScene('main');
    }
  }, [currentScene, mode]);

  // Auto-save progression changes across Phase 2 & Phase 3
  useEffect(() => {
    if (isChapterFinished || isGameOver) return;
    if (currentChapter === 2) {
      lockChapterOneAndSave(selectedCharacter.id, composure);
      return;
    }
    if (
      mode === 'room_escape' ||
      mode === 'phase3' ||
      mode === 'location_select' ||
      mode === 'investigating_location'
    ) {
      const currentPhaseNum: 1 | 2 | 3 = mode === 'room_escape' || mode === 'awakening' ? 2 : 3;
      saveChapterOneProgress({
        chapter: 1,
        currentPhase: currentPhaseNum,
        phase3Location: mode === 'room_escape' ? undefined : phase3Location,
        selectedCharacterId: selectedCharacter.id,
        inventory,
        discoveredClues,
        hasBobbyPin,
        hasWoodenBat,
        hasMagneticCompass,
        hasSmallBrassKey,
        hasNylonRope,
        deskMugMoved,
        doorUnlocked,
        composure,
        timerSeconds: timeLeft,
        timestamp: Date.now(),
        hasBlackCandlesCount,
        hasMatchesCount,
        hasBronzeBell,
        hasReadLocker32Note,
        hasReadSandarLetters,
        hasLocker09Candle,
        hasLocker09Matchbox,
        caretakerDoorUnlocked,
        altarCandlesPlaced,
        altarBellPlaced,
        natSummoned,
        corridorShadowScareTriggered,
        chapter1Completed: false,
      });

      // Synchronize active save state to maintain Chapter 2 lock while playing Chapter 1
      try {
        const activeSaveData = {
          chapter: 1,
          currentPhase: currentPhaseNum,
          chapter1Completed: false,
          phase3Location: mode === 'room_escape' ? 'hallway_threshold' : phase3Location,
          selectedCharacterId: selectedCharacter.id,
          inventory,
          discoveredClues,
          hasBobbyPin,
          hasWoodenBat,
          hasSmallBrassKey,
          hasNylonRope,
          hasBlackCandlesCount,
          hasMatchesCount,
          hasBronzeBell,
          caretakerDoorUnlocked,
          composure,
          timerSeconds: timeLeft,
          timestamp: Date.now(),
        };
        localStorage.setItem(ACTIVE_SAVE_KEY, JSON.stringify(activeSaveData));
        localStorage.removeItem('spirits_labyrinth_ch2_unlocked');
      } catch {}
    }
  }, [
    mode,
    phase3Location,
    inventory,
    discoveredClues,
    doorUnlocked,
    deskMugMoved,
    hasBobbyPin,
    hasWoodenBat,
    hasMagneticCompass,
    hasSmallBrassKey,
    hasNylonRope,
    isChapterFinished,
    isGameOver,
    composure,
    timeLeft,
    selectedCharacter.id,
    hasBlackCandlesCount,
    hasMatchesCount,
    hasBronzeBell,
    hasReadLocker32Note,
    hasReadSandarLetters,
    hasLocker09Candle,
    hasLocker09Matchbox,
    caretakerDoorUnlocked,
    altarCandlesPlaced,
    altarBellPlaced,
    natSummoned,
    corridorShadowScareTriggered,
    chapter1Completed,
  ]);

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
      text: 'I have been displaced into August 1998! The heavy room door is locked tight from the outside. I need to search Room 4B and find a way out into the corridor...',
      soundCue: 'select' as const,
    },
  ];

  // Auto-log curfew calendar when calendar sub-scene is inspected
  useEffect(() => {
    if (mode === 'room_escape' && activeInspectSubScene === 'calendar') {
      if (!discoveredClues.includes('curfew_calendar_1998')) {
        addDiscoveredClue('curfew_calendar_1998');
        sound.playPaperRustle();
      }
    }
  }, [mode, activeInspectSubScene, discoveredClues, addDiscoveredClue]);

  // Handle entering washroom stall in Phase 3
  useEffect(() => {
    if (mode === 'phase3' && phase3Location === 'washroom_stall') {
      if (!discoveredClues.includes('washroom_stall_echo')) {
        addDiscoveredClue('washroom_stall_echo');
      }
      if (!washroomStallChecked) {
        sound.playWaterDrop();
        setComposure((c) => Math.max(5, c - 5));
        setWashroomStallChecked(true);
        setIsCompassVibrating(true);
        setTimeout(() => setIsCompassVibrating(false), 3000);
        setActiveMonologue(
          "— Dried smear marks on the latch... and cold water dripping down my neck. Someone was trying to claw their way out. —"
        );
      }
    }
  }, [mode, phase3Location, washroomStallChecked, discoveredClues, addDiscoveredClue, setComposure, setWashroomStallChecked]);


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

  // Horizontal alignment of the current speaker relative to the dialogue box:
  // 'left' | 'center' | 'right'
  const speakerAlign: 'left' | 'center' | 'right' = ((): 'left' | 'center' | 'right' => {
    if (mode === 'phase1_2') return currentP12Line.pos as 'left' | 'right';
    if (mode === 'investigating_location' && activeInvestigatingLoc)
      return activeInvestigatingLoc.lines[locLineIndex]?.speakerType === 'player'
        ? 'left'
        : 'right';
    return 'left';
  })();

  // Typewriter effect
  useEffect(() => {
    if (
      mode === 'shattering' ||
      mode === 'character_select' ||
      mode === 'location_select' ||
      mode === 'phase3' ||
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

      // Global dismissal of active thought monologue
      if (activeMonologue) {
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
          e.preventDefault();
          setActiveMonologue(null);
          return;
        }
      }

      if (mode === 'phase1_2' || mode === 'awakening' || mode === 'investigating_location') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          advanceDialogue();
        } else if (e.key === 'ArrowUp' || e.key === 'Backspace' || e.key === 'ArrowLeft') {
          e.preventDefault();
          rewindDialogue();
        }
      } else if (mode === 'phase3') {
        if (e.key === 'Backspace' && !activeMonologue) {
          if (
            phase3Location === 'washroom_basin' ||
            phase3Location === 'washroom_stall' ||
            phase3Location === 'washroom_rope' ||
            phase3Location === 'washroom_mirror'
          ) {
            e.preventDefault();
            sound.playPaperRustle();
            setPhase3Location('washroom_main');
          } else if (phase3Location === 'stairwell_gate' || phase3Location === 'washroom_main') {
            e.preventDefault();
            sound.playPaperRustle();
            setPhase3Location('west_split_landing');
          } else if (phase3Location === 'west_split_landing') {
            e.preventDefault();
            sound.playPaperRustle();
            setPhase3Location('hallway_threshold');
          }
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
        setMode('room_escape');
        setActiveInspectSubScene('main');
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

  // Wooden plank/bat pickup handler under wardrobe footing inspection
  const handlePickupWoodenBat = () => {
    if (!hasWoodenBat) {
      // 1. Add item ID to inventory
      setInventory((prev) => (prev.includes('wooden_bat') ? prev : [...prev, 'wooden_bat']));
      setHasWoodenBat(true);

      // 2. Play item pickup sound
      sound.playPaperRustle(); // or sound.playItemPickup()

      // 3. Trigger pickup thought monologue
      setActiveMonologue(
        "A hefty piece of solid teak timber. Heavy enough to force open a jammed latch, but it will make serious noise."
      );
    }
  };

  // Door unlock execution (stealth vs brute force)
  const executeUnlockDoor = (method: 'bobby_pin' | 'wooden_bat') => {
    setIsDoorTransitioning(true);
    setDoorUnlocked(true);
    const nextInv =
      method === 'wooden_bat'
        ? inventory.includes('wooden_bat')
          ? inventory
          : [...inventory, 'wooden_bat']
        : inventory;

    // Milestone 3 Auto-Save: Unlocking Door 4B & entering Pathway 326
    saveChapterOneProgress({
      chapter: 1,
      currentPhase: 3,
      phase3Location: 'hallway_threshold',
      selectedCharacterId: selectedCharacter.id,
      inventory: nextInv,
      discoveredClues,
      hasBobbyPin,
      hasWoodenBat: method === 'wooden_bat' || hasWoodenBat,
      hasMagneticCompass,
      hasSmallBrassKey,
      hasNylonRope,
      deskMugMoved,
      doorUnlocked: true,
      composure: method === 'bobby_pin' ? composure : Math.max(0, composure - 15),
      timerSeconds: timeLeft,
      timestamp: Date.now(),
    });

    if (method === 'bobby_pin') {
      sound.playChime(true);
      setRoomBanner({
        text: `${selectedCharacter.name} gently guides the bent steel bobby pin into the keyway. The tumblers align silently... Click. The lock opens without a sound.`,
        type: 'success',
      });
      setTimeout(() => {
        setActiveInspectSubScene('main');
        setIsDoorTransitioning(false);
        setRoomBanner(null);
        setCurrentScene('pathway_326_main');
        setCurrentSubScene(null);
        setPhase3Location('hallway_threshold');
        setPhase3Message(null);
        setMode('phase3');
        sound.playMenuSelect();
      }, 1600);
    } else {
      sound.playDamage();
      setIsScreenShaking(true);
      setTimeout(() => setIsScreenShaking(false), 700);
      setComposure((c) => Math.max(0, c - 15));
      setDoorSmashed(true);
      setRoomBanner({
        text: 'CRASH! The heavy teak timber strikes the deadbolt with violent force! Splintered wood shrieks as the door bursts open, echoing down Pathway 326...',
        type: 'warn',
      });
      setTimeout(() => {
        setActiveInspectSubScene('main');
        setIsDoorTransitioning(false);
        setRoomBanner(null);
        setCurrentScene('pathway_326_main');
        setCurrentSubScene(null);
        setPhase3Location('hallway_threshold');
        setPhase3Message(null);
        setMode('phase3');
        sound.playDramaticSting();
      }, 1800);
    }
  };

  // Climax hard-cut blackout transition -> Character Select
  const triggerShatterTransition = () => {
    sound.stopAmbient();
    sound.playGlassBreak();
    sound.playDamage();
    setMode('shattering');
    setIsScreenShaking(true);
    setBlackoutText('');

    // Milestone 1 Auto-Save: Séance complete -> time slip
    saveChapterOneProgress({
      chapter: 1,
      currentPhase: 1,
      selectedCharacterId: null,
      inventory,
      discoveredClues,
      hasBobbyPin,
      hasWoodenBat,
      hasMagneticCompass,
      hasSmallBrassKey,
      hasNylonRope,
      deskMugMoved,
      doorUnlocked: false,
      composure,
      timerSeconds: timeLeft,
      timestamp: Date.now(),
    });

    setTimeout(() => {
      setIsScreenShaking(false);
    }, 200);

    const fullText = 'AUGUST 14, 1998 — ROOM 4B';
    let charIdx = 0;
    const typeInterval = setInterval(() => {
      charIdx++;
      setBlackoutText(fullText.slice(0, charIdx));
      sound.playKeyClick();
      if (charIdx >= fullText.length) {
        clearInterval(typeInterval);
        // Hold for 1.2 seconds, then fade smoothly into Character Selection view
        setTimeout(() => {
          setMode('character_select');
        }, 1200);
      }
    }, 35);
  };

  // Called when investigator is chosen
  const handleCharacterSelected = (characterId: MCId) => {
    const chosen = CHARACTERS.find((c) => c.id === characterId) || CHARACTERS[0];
    setSelectedCharacter(chosen);
    setCurrentLineIndex(0);
    setActiveInspectSubScene('main');
    setIsZoomed(false);
    setIsDoorInspectOpen(false);
    setDoorRawTextShown(false);
    setActiveMonologue(null);
    setMode('awakening');

    // Milestone 2 Auto-Save: Awakening in Room 4B
    saveChapterOneProgress({
      chapter: 1,
      currentPhase: 2,
      selectedCharacterId: chosen.id,
      inventory,
      discoveredClues,
      hasBobbyPin,
      hasWoodenBat,
      hasMagneticCompass,
      hasSmallBrassKey,
      hasNylonRope,
      deskMugMoved,
      doorUnlocked: false,
      composure,
      timerSeconds: timeLeft,
      timestamp: Date.now(),
    });
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
    clearChapterOneProgress();
    sound.playSuccessTune();
    setIsChapterFinished(true);
  };

  // Comprehensive Chapter 1 Reset Routine
  const handleRestartChapterOne = () => {
    // 1. Purge persistent storage
    localStorage.removeItem('spirits_labyrinth_active_save');
    localStorage.removeItem('spirits_labyrinth_ch2_unlocked');
    clearChapterOneProgress();

    // 2. Set fresh Chapter 1 state in store / localStorage
    const freshChapterOneSave = {
      chapter: 1,
      currentPhase: 1,
      chapter1Completed: false, // CRITICAL: Lock Chapter 2 again
      phase3Location: 'hallway_threshold' as Phase3Location,
      selectedCharacterId: null,
      inventory: [],
      discoveredClues: [],
      hasBobbyPin: false,
      hasWoodenBat: false,
      hasSmallBrassKey: false,
      hasNylonRope: false,
      hasBlackCandlesCount: 0,
      hasMatchesCount: 0,
      hasBronzeBell: false,
      caretakerDoorUnlocked: false,
      composure: 100,
      timerSeconds: 600,
      timestamp: Date.now(),
    };
    localStorage.setItem('spirits_labyrinth_active_save', JSON.stringify(freshChapterOneSave));

    resetProgress();
    resetChapterOneProgress();

    // 3. Reset in-memory engine state
    setCurrentChapter(1);
    setChapter1Completed(false);

    // Reset Core Flow & Phase
    setPhase(1);
    setCurrentScene('seance_room_4b_2026');
    setCurrentSubScene(null);
    setPhase3Location('hallway_threshold');
    setIsPaused(false);
    setActiveMonologue(null);
    setActiveItemModal(null);

    // Reset Player Vitals & Timers
    setTimerSeconds(600); // 10:00 countdown
    setComposure(100);

    // Purge Inventory & Environmental Interaction Flags
    setInventory([]);
    setDiscoveredClues([]);
    setHasBobbyPin(false);
    setHasWoodenBat(false);
    setHasMagneticCompass(false);
    setHasSmallBrassKey(false);
    setHasNylonRope(false);
    setDeskMugMoved(false);
    setDoorUnlocked(false);
    setWashroomStallChecked(false);
    setWashroomMirrorScratched(false);
    setStairwellGateInspected(false);
    setHasBlackCandlesCount(0);
    setHasMatchesCount(0);
    setHasBronzeBell(false);
    setHasReadLocker32Note(false);
    setHasReadSandarLetters(false);
    setHasLocker09Candle(false);
    setHasLocker09Matchbox(false);
    setCaretakerDoorUnlocked(false);
    setAltarCandlesPlaced(0);
    setAltarBellPlaced(false);
    setNatSummoned(false);
    setCorridorShadowScareTriggered(false);
    setKeypadInput('');
    setSpectralClimaxActive(false);
    setAltarCandlesLit(false);
    setChapter1VictoryActive(false);
    setCorridorShadowFlash(false);

    // Reset Audio Channels
    sound.stopAllAmbience();
    sound.playSeanceRainLoop();

    // Additional local UI & engine state resets
    setMode('phase1_2');
    setCurrentLineIndex(0);
    setDisplayedText('');
    setIsTyping(true);
    setCurrentTier(1);
    setSelectedLocationIdx(0);
    setInvestigatedLocIds([]);
    setActiveInvestigatingLoc(null);
    setLocLineIndex(0);
    setIsZoomed(false);
    setIsChapterFinished(false);
    setIsGameOver(false);
    setIsPauseOpen(false);
    setIsNotesOpen(false);
    setActiveInspectSubScene('main');
    setDoorSmashed(false);
    setPhase3Message(null);
    setIsCompassVibrating(false);
    setIsCompassModalOpen(false);
    setRoomBanner(null);
    setDoorRawTextShown(false);
    setIsDoorTransitioning(false);
    setIsDoorInspectOpen(false);
    setSelectedInventoryItem(null);
    setSelectedCharacter(CHARACTERS[0]);
  };

  const handleRestartChapter = handleRestartChapterOne;

  const handleContinueToChapterTwo = () => {
    setIsChapterTransitionOpen(false);
    setCurrentChapter(2);
    setPhase(2);
    setPhase3Location('east_fork');
    setCurrentScene('pathway_326_main');
    setCurrentSubScene(null);
    setMode('phase3');
    setChapter1Completed(true);
    setCaretakerDoorUnlocked(true);
    setHasBlackCandlesCount(3);
    setHasMatchesCount(3);
    setHasBronzeBell(true);
    setHasBobbyPin(true);
    setHasWoodenBat(true);
    setHasSmallBrassKey(true);
    setHasNylonRope(true);
    setHasLocker09Candle(true);
    setHasLocker09Matchbox(true);
    setHasReadLocker32Note(true);
    setHasReadSandarLetters(true);
    setInventory([
      'bobby_pin',
      'wooden_bat',
      'small_brass_key_32',
      'coiled_nylon_rope',
      'black_beeswax_candle',
      'matchbox_three_stars',
      'bronze_prayer_bell',
    ]);
    sound.startAmbient();
    setActiveMonologue(
      "— CHAPTER 2: UNDERSTANDING — Standing at the East Fork corridor. Seven ritual items are in hand. The communal prayer room altar awaits. —"
    );
    navigate('/chapters/2');
  };

  const handleSaveAndExit = () => {
    setIsChapterTransitionOpen(false);
    sound.stopAllAmbience();
    // 1. Persist Chapter 2 checkpoint
    lockChapterOneAndSave(selectedCharacter.id, composure);
    // 2. Route directly to Chapter Selection page
    navigate('/chapters');
  };

  // Caretaker Office Climax Handler
  const triggerSpectralBlackout = () => {
    setSpectralClimaxActive(true);
    setIsScreenShaking(true);
    sound.playScareSlam();
    sound.playGlassBreak();
    sound.playGhostWhisper();
    sound.playDramaticSting();
    setActiveMonologue(
      "— \"You do not know who holds the cord... Ask the Guardian before you burn...\" The shadows violently erupt from the desk ledger! —"
    );
  };

  const setCaretakerDoorLocked = (locked: boolean) => {
    setCaretakerDoorUnlocked(!locked);
  };

  const setShowChapterTransitionModal = (show: boolean) => {
    setIsChapterTransitionOpen(show);
  };

  const handleCaretakerClimax = () => {
    // 1. Screen blackout + screech + ghost jump-scare
    triggerSpectralBlackout();

    setTimeout(() => {
      setIsScreenShaking(false);
      setSpectralClimaxActive(false);

      // 2. Force expulsion to East Wing fork
      setPhase3Location('east_fork');
      setCaretakerDoorLocked(true);

      // 3. Mark Chapter 1 finished and display the transition modal HERE ONLY
      setChapter1Completed(true);
      completeChapter(1);
      lockChapterOneAndSave(selectedCharacter.id, composure);
      setShowChapterTransitionModal(true);
    }, 1800);
  };

  const toggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  // Resolve active background image
  const getActiveBackground = (): string => {
    if (mode === 'phase1_2') {
      return currentP12Line?.bgImage || ROOM_4B_ASSETS.seance2026;
    }
    if (mode === 'awakening') {
      return ROOM_4B_ASSETS.main;
    }
    if (mode === 'room_escape') {
      if (activeInspectSubScene === 'desk') return ROOM_4B_ASSETS.desk;
      if (activeInspectSubScene === 'stool') return ROOM_4B_ASSETS.stool;
      if (activeInspectSubScene === 'wardrobe') return ROOM_4B_ASSETS.wardrobe;
      if (activeInspectSubScene === 'calendar') return ROOM_4B_ASSETS.calendar;
      if (activeInspectSubScene === 'door') return ROOM_4B_ASSETS.door;
      return ROOM_4B_ASSETS.main;
    }
    if (mode === 'phase3') {
      if (phase3Location === 'hallway_threshold') return PHASE_3_ASSETS.pathwayThreshold;
      if (phase3Location === 'west_split_landing') return PHASE_3_ASSETS.westSplitLanding;
      if (phase3Location === 'stairwell_gate') return PHASE_3_ASSETS.stairwellGateLocked;
      if (phase3Location === 'washroom_main') return PHASE_3_ASSETS.washroomOverview;
      if (phase3Location === 'washroom_basin') return PHASE_3_ASSETS.washroomBasinZoom;
      if (phase3Location === 'washroom_stall') return PHASE_3_ASSETS.washroomStallZoom;
      if (phase3Location === 'washroom_rope') return PHASE_3_ASSETS.washroomRopeZoom;
      if (phase3Location === 'washroom_mirror') return PHASE_3_ASSETS.washroomMirrorZoom;
      if (phase3Location === 'east_fork') return PHASE_3_ASSETS.eastWingFork;
      if (phase3Location === 'lockers_main') return PHASE_3_ASSETS.lockersOverview;
      if (phase3Location === 'locker_32') return PHASE_3_ASSETS.locker32Zoom;
      if (phase3Location === 'locker_09') return PHASE_3_ASSETS.locker09Zoom;
      if (phase3Location === 'locker_14') return PHASE_3_ASSETS.locker14Zoom;
      if (phase3Location === 'locker_spider') return PHASE_3_ASSETS.lockerSpiderZoom;
      if (phase3Location === 'prayer_room_main') return PHASE_3_ASSETS.prayerRoomOverview;
      if (phase3Location === 'prayer_altar') return PHASE_3_ASSETS.prayerAltarZoom;
      if (phase3Location === 'caretaker_door_keypad') return PHASE_3_ASSETS.caretakerKeypadZoom;
      if (phase3Location === 'caretaker_office_main') {
        if (spectralClimaxActive) return PHASE_3_ASSETS.caretakerSpectralClimax;
        return PHASE_3_ASSETS.caretakerOfficeOverview;
      }
      return PHASE_3_ASSETS.pathwayThreshold;
    }
    if (mode === 'location_select') {
      return activeTierLocations[selectedLocationIdx]?.bgImage || '/assets/uni_room_chp1_bg1.jpg';
    }
    if (mode === 'investigating_location' && activeInvestigatingLoc) {
      return activeInvestigatingLoc.bgImage;
    }
    return ROOM_4B_ASSETS.main;
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
    <div
      className={`fixed inset-0 h-screen w-screen overflow-hidden select-none bg-black flex items-center justify-center z-30 ${
        isScreenShaking ? 'animate-screen-shake-fast' : ''
      }`}
    >
      {/* 16:9 Strict Aspect Ratio Letterbox Stage (Containment Wrapper) */}
      <div className="relative w-full h-full max-w-[177.78vh] max-h-[56.25vw] aspect-video overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* 1. Scene Background Image */}
        <img
          src={getActiveBackground()}
          alt="Scene Atmosphere"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out select-none pointer-events-none ${
            isZoomed
              ? 'scale-125 filter brightness-[0.75] contrast-125'
              : 'scale-100 filter brightness-90 contrast-105'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/50 pointer-events-none" />

      {/* 2. Supernatural Glitch Flicker Effect */}
      {currentStep.isGlitch && (
        <div className="absolute inset-0 z-10 pointer-events-none bg-red-950/25 mix-blend-color-dodge animate-pulse">
          <div className="w-full h-full opacity-35 bg-[repeating-linear-gradient(0deg,#000_0px,#000_2px,transparent_2px,transparent_4px)]" />
        </div>
      )}

      {/* 3. Blackout Sequence & Character Selection Screen */}
      <AnimatePresence mode="wait">
        {mode === 'shattering' && (
          <motion.div
            key="blackout"
            initial={{ opacity: 1 }}
            animate={
              isScreenShaking
                ? { x: [-12, 12, -9, 9, -5, 5, 0], y: [-8, 8, -6, 6, -3, 3, 0] }
                : { x: 0, y: 0 }
            }
            transition={{ duration: 0.2 }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
            className="absolute inset-0 z-50 bg-[#050706] flex flex-col items-center justify-center p-6 text-center select-none"
          >
            <p className="font-mono text-sm sm:text-base md:text-lg tracking-[0.25em] text-[#94a3b8] uppercase">
              {blackoutText}
              <span className="inline-block w-2 h-4 bg-[#94a3b8] ml-1.5 animate-pulse" />
            </p>
          </motion.div>
        )}

        {/* 4. Character Selection Screen (Appears After Blackout) */}
        {mode === 'character_select' && (
          <motion.div
            key="character_select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="absolute inset-0 z-40 bg-[#0a0f0d] flex flex-col"
          >
            <CharacterSelectModal onSelectCharacter={handleCharacterSelected} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Top Header Status Bar */}
      <div className="relative w-full p-3 sm:p-5 flex flex-wrap items-center justify-between gap-2 z-40 pointer-events-auto bg-gradient-to-b from-stone-950/90 via-stone-950/60 to-transparent">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Phase Badge */}
          <div className="px-3 py-1 bg-[#121815]/95 border border-[#2c3d34] rounded-lg text-xs font-mono font-bold tracking-wider text-[#82a996] shadow-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6ee7b7] animate-ping" />
            <span className="uppercase">
              {mode === 'phase1_2'
                ? currentP12Line.phase === 1
                  ? 'Phase 1 : The Discussion'
                  : 'Phase 2 : The Seance'
                : mode === 'awakening' || mode === 'room_escape'
                ? activeInspectSubScene === 'main'
                  ? 'Phase 3 • Room 4B Escape'
                  : `Room 4B : ${activeInspectSubScene.toUpperCase()}`
                : mode === 'phase3'
                ? 'Phase 3 • Pathway 326'
                : `Phase 3 • Sector 0${currentTier} / 03`}
            </span>
          </div>

          {/* 10-Minute Timer Badge */}
          {mode !== 'phase1_2' && mode !== 'shattering' && mode !== 'character_select' && (
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 bg-[#121815]/95 border border-[#2c3d34] rounded-lg text-xs font-mono font-bold text-[#c2d6cc] flex items-center gap-1.5 shadow-md">
                <Clock className="w-3.5 h-3.5 text-[#82a996] animate-pulse" />
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

        {/* Action Controls: Inventory Slots, Compass Dock, Notebook, Audio & Pause */}
        <div className="flex items-center gap-2 z-50 pointer-events-auto">
          {/* HUD Inventory Bar */}
          {mode !== 'phase1_2' && mode !== 'shattering' && mode !== 'character_select' && (
            <div className="flex items-center gap-1 bg-[#121815]/90 border border-[#2c3d34] p-1 rounded-xl shadow-inner">
              <span className="text-[9px] font-mono font-bold text-[#82a996]/60 uppercase px-1 hidden md:inline">INV</span>
              {Array.from({ length: Math.max(6, inventory.length) }).map((_, slotIdx) => {
                const itemId = inventory[slotIdx];
                const itemData = itemId ? ITEMS[itemId] : null;
                return (
                  <button
                    key={slotIdx}
                    disabled={!itemId}
                    onClick={() => {
                      if (itemId) {
                        sound.playPaperRustle();
                        setInspectingItem(itemId);
                      }
                    }}
                    title={itemData ? `${itemData.name} (Click to inspect)` : 'Empty Slot'}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all ${
                      itemId
                        ? 'bg-[#18221d] border border-[#2e4238] text-[#82a996] hover:border-[#4d6e5e] hover:shadow-[0_0_15px_rgba(46,66,56,0.5)] hover:bg-[#18221d]/80 hover:scale-105 cursor-pointer shadow-md'
                        : 'bg-[#0f1412]/60 border border-dashed border-[#2c3d34]/50 text-[#2c3d34] cursor-default'
                    }`}
                  >
                    {itemId === 'bobby_pin' ? (
                      <Key className="w-3.5 h-3.5 text-[#82a996]" />
                    ) : itemId === 'wooden_bat' ? (
                      <Hammer className="w-3.5 h-3.5 text-[#82a996]" />
                    ) : itemId === 'magnetic_compass' ? (
                      <Compass className="w-3.5 h-3.5 text-[#82a996]" />
                    ) : itemId === 'small_brass_key_32' ? (
                      <Key className="w-3.5 h-3.5 text-[#82a996]" />
                    ) : itemId === 'coiled_nylon_rope' ? (
                      <Wind className="w-3.5 h-3.5 text-[#82a996]" />
                    ) : itemId === 'black_beeswax_candle' ? (
                      <Flame className="w-3.5 h-3.5 text-stone-400" />
                    ) : itemId === 'matchbox_three_stars' ? (
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                    ) : itemId === 'bronze_prayer_bell' ? (
                      <Bell className="w-3.5 h-3.5 text-amber-300" />
                    ) : (
                      <span className="text-[9px] text-[#2c3d34]">•</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Paranormal Magnetic Compass Dock */}
          {hasMagneticCompass && (
            <button
              onClick={() => {
                sound.playPaperRustle();
                setIsCompassModalOpen(true);
              }}
              onMouseEnter={() => sound.playMenuHover()}
              className={`relative group p-1 sm:p-1.5 rounded-xl bg-[#121815]/95 border border-[#2c3d34] hover:border-[#4d6e5e] text-[#82a996] shadow-[0_0_15px_rgba(46,66,56,0.4)] flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 ${
                isCompassVibrating ? 'ring-2 ring-rose-500 animate-bounce' : ''
              }`}
              title="Paranormal Magnetic Compass (Click for close-up view)"
            >
              <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0b0f0d] border border-[#2c3d34] flex items-center justify-center overflow-hidden">
                <span className="absolute top-0.5 text-[6px] font-mono font-bold text-[#82a996]">N</span>
                <div
                  className={`w-0.5 h-4 bg-gradient-to-t from-transparent via-rose-500 to-rose-400 rounded-full origin-center ${
                    isCompassVibrating || activeInspectSubScene === 'door' || currentStep.isGlitch
                      ? 'animate-compass-jitter'
                      : 'animate-compass-twitch'
                  }`}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-[#82a996] uppercase tracking-wider hidden lg:inline">
                COMPASS
              </span>
            </button>
          )}

          {/* Case Notes / Notebook Button */}
          {mode !== 'phase1_2' && mode !== 'shattering' && mode !== 'character_select' && (
            <button
              onClick={() => {
                sound.playPaperRustle();
                setIsNotesOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#18221d] border border-[#2c3d34] text-[#c2d6cc] hover:border-[#4d6e5e] hover:bg-[#1f2d26] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              title="Open Case File [N]"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#82a996]" />
              <span className="hidden sm:inline">Case Notes</span>
              <span className="bg-[#2c3d34] text-[#c2d6cc] px-1 rounded text-[10px]">
                {discoveredClues.length}
              </span>
            </button>
          )}

          <button
            onClick={toggleMute}
            className="p-2 rounded-lg bg-[#121815]/95 border border-[#2c3d34] text-[#82a996] hover:text-[#c2d6cc] hover:border-[#4d6e5e] transition-all cursor-pointer shadow-md pointer-events-auto"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              setIsPauseOpen(true);
              sound.playPaperRustle();
            }}
            className="p-2 rounded-lg bg-[#121815]/95 border border-[#2c3d34] text-[#82a996] hover:text-[#c2d6cc] hover:border-[#4d6e5e] transition-all cursor-pointer shadow-md pointer-events-auto z-50"
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
            {doorSmashed && currentTier === 1 && (
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/85 border border-rose-600 text-rose-300 text-xs font-mono shadow-lg animate-pulse">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>⚠️ DEAFENING CRASH ECHO: Smashing the door alerted entities along Pathway 326. Hallway threat level accelerated!</span>
              </div>
            )}
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
      {/* 6.5. MODE: ROOM 4B 2D POINT-AND-CLICK INVESTIGATION & AWAKENING HEADER */}
      {/* ======================================================== */}
      {(mode === 'room_escape' || mode === 'awakening') && (
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between">
          {/* Sub-scene Header Bar */}
          <div className="w-full flex items-center justify-between px-4 sm:px-8 pt-16 sm:pt-20 pb-1 z-30 pointer-events-auto">
            {mode === 'room_escape' && activeInspectSubScene !== 'main' ? (
              <button
                onClick={() => {
                  sound.playPaperRustle();
                  setActiveInspectSubScene('main');
                  setRoomBanner(null);
                  setDoorRawTextShown(false);
                  setIsDoorInspectOpen(false);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#121815]/95 border border-[#2c3d34] hover:bg-[#18221d] hover:border-[#4d6e5e] text-[#c2d6cc] hover:text-[#6ee7b7] text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-[#82a996]" />
                <span>STEP BACK / RETURN TO ROOM</span>
              </button>
            ) : (
              <div />
            )}

            <div className="px-3.5 py-1 rounded-lg bg-[#121815]/95 border border-[#2c3d34] text-xs font-mono font-bold text-[#82a996] uppercase tracking-widest shadow-md">
              {mode === 'awakening' || activeInspectSubScene === 'main'
                ? 'ROOM 4B • DORMITORY ROOM'
                : activeInspectSubScene === 'desk'
                ? 'INSPECTING • STUDY DESK'
                : activeInspectSubScene === 'stool'
                ? 'INSPECTING • BEDSIDE STOOL'
                : activeInspectSubScene === 'wardrobe'
                ? 'INSPECTING • WARDROBE FOOTING'
                : activeInspectSubScene === 'calendar'
                ? 'INSPECTING • WALL CALENDAR'
                : 'INSPECTING • ROOM DOOR'}
            </div>
          </div>

          {/* Observation Feedback Toast */}
          <AnimatePresence>
            {roomBanner && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="absolute top-24 sm:top-28 left-1/2 -translate-x-1/2 z-40 max-w-xl w-full px-4 pointer-events-auto"
              >
                <div
                  className={`p-3.5 rounded-xl border shadow-2xl flex items-start justify-between gap-3 text-xs font-mono ${
                    roomBanner.type === 'warn'
                      ? 'bg-rose-950/95 border-rose-600 text-rose-200'
                      : roomBanner.type === 'success'
                      ? 'bg-emerald-950/95 border-emerald-600 text-emerald-200'
                      : 'bg-[#121815]/95 border-[#2c3d34] text-[#c2d6cc]'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#6ee7b7] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{roomBanner.text}</span>
                  </div>
                  <button
                    onClick={() => setRoomBanner(null)}
                    className="text-stone-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hotspot & Sub-scene Interaction Layer (Active only during room_escape) */}
          {mode === 'room_escape' && (
            <>
              <div className="absolute inset-0 z-20 pointer-events-auto">
            {/* SUB-SCENE 1: MAIN WIDE-ANGLE ROOM 4B (Exact Perspective Polygons) */}
            {activeInspectSubScene === 'main' && (
              <>
                {/* 1. Wardrobe (Yellow) */}
                <InteractiveHotspot
                  id="main_wardrobe"
                  name="Teak Wardrobe"
                  cursorTooltip="Teak Wardrobe & Footing"
                  polygonPoints="0,15 21,19 21,99 0,99"
                  onClick={() => {
                    sound.playMenuSelect();
                    setActiveInspectSubScene('wardrobe');
                  }}
                />

                {/* 2. Wall Calendar (Orange) */}
                <InteractiveHotspot
                  id="main_calendar"
                  name="Wall Calendar"
                  cursorTooltip="Wall Calendar (August 1998)"
                  polygonPoints="24.5,45 32,45 32,59 24.5,59"
                  onClick={() => {
                    sound.playMenuSelect();
                    setActiveInspectSubScene('calendar');
                  }}
                />

                {/* 3. Compass / Tin Box (Purple) */}
                <InteractiveHotspot
                  id="main_tin_compass"
                  name="Compass / Tin Box"
                  cursorTooltip={
                    hasMagneticCompass
                      ? 'Inspect Antique Magnetic Compass'
                      : 'Velvet-Lined Tin Box (Compass)'
                  }
                  polygonPoints="27,80 36,75 36,85 28,90"
                  onClick={() => {
                    if (!hasMagneticCompass) {
                      setHasMagneticCompass(true);
                      addInventoryItem('magnetic_compass');
                      sound.playChime(true);
                      sound.playPaperRustle();
                      setRoomBanner({
                        text: 'COMPASS FOUND! — An antique brass magnetic compass resting inside a rusted velvet-lined tin box.',
                        type: 'success',
                      });
                      setIsCompassModalOpen(true);
                    } else {
                      sound.playPaperRustle();
                      setIsCompassModalOpen(true);
                    }
                  }}
                />

                {/* 4. Study Desk (Green) */}
                <InteractiveHotspot
                  id="main_desk"
                  name="Study Desk & Notes"
                  cursorTooltip="Inspect Study Desk"
                  polygonPoints="46,61 67,70 75,63 52,59"
                  onClick={() => {
                    sound.playMenuSelect();
                    setActiveInspectSubScene('desk');
                  }}
                />

                {/* 5. Room Door 4B (Blue) */}
                <InteractiveHotspot
                  id="main_door"
                  name="Room Door 4B"
                  cursorTooltip={doorUnlocked ? "Exit to Pathway 326" : "Room Door 4B"}
                  polygonPoints="79,5 99.5,5 99.5,95 79,95"
                  onClick={() => {
                    if (doorUnlocked) {
                      sound.playPaperRustle();
                      setCurrentScene('pathway_326_main');
                      setCurrentSubScene(null);
                      setPhase3Location('hallway_threshold');
                      setPhase3Message(null);
                      setMode('phase3');
                    } else {
                      sound.playMenuSelect();
                      setActiveInspectSubScene('door');
                      setIsDoorInspectOpen(false);
                    }
                  }}
                />
              </>
            )}

            {/* SUB-SCENE 2: STUDY DESK ZOOM (Hover-Discovery Hotspots) */}
            {activeInspectSubScene === 'desk' && (
              <>
                {/* Enamel Mug: SVG perspective polygon outline */}
                <InteractiveHotspot
                  id="desk_enamel_mug"
                  name="Chipped Enamel Mug"
                  cursorTooltip={deskMugMoved ? 'Shifted Enamel Mug' : 'Chipped Enamel Mug (Move Aside)'}
                  polygonPoints="14.5,23.5 25.5,22 28.5,31 31.5,41 29,52 24.5,56.5 15.5,55 14,35"
                  onClick={() => {
                    if (!deskMugMoved) {
                      setDeskMugMoved(true);
                      addDiscoveredClue('roster_slip_1998');
                      sound.playPaperRustle();
                      setActiveMonologue(
                        "— A 1998 cleaning roster tucked under the mug. Room 4B was assigned to students May and Sandar. Clue logged to Case Notes. —"
                      );
                    } else {
                      sound.playMenuSelect();
                      setActiveMonologue(
                        "— The chipped enamel mug has already been shifted aside. Nothing else underneath. —"
                      );
                    }
                  }}
                />

                {/* Duty Roster Papers: SVG perspective polygon outline */}
                <InteractiveHotspot
                  id="desk_roster_slip"
                  name="1998 Cleaning Roster Slip"
                  cursorTooltip="Examine Cleaning Duty Roster (Aug 1998)"
                  polygonPoints="15,42.5 3.5,57.5 22.5,93 39.5,70 33,52 27,56"
                  onClick={() => {
                    if (!deskMugMoved) {
                      setDeskMugMoved(true);
                      addDiscoveredClue('roster_slip_1998');
                      sound.playPaperRustle();
                      setActiveMonologue(
                        "— A 1998 cleaning roster tucked under the mug. Room 4B was assigned to students May and Sandar. Clue logged to Case Notes. —"
                      );
                    } else {
                      sound.playPaperRustle();
                      setActiveMonologue(
                        "— 1998 Cleaning Duty Roster: Room 4B was assigned to May and Sandar for August 1998. —"
                      );
                    }
                  }}
                />

                {/* Bobby Pin / Clip in Ceramic Tray (hidden when already collected) */}
                {!hasInventoryItem('bobby_pin') && (
                  <InteractiveHotspot
                    id="desk_ceramic_tray"
                    name="Bent Steel Bobby Pin"
                    cursorTooltip="Inspect Ceramic Tray (Bent Steel Pin)"
                    polygonPoints="48.5,28 56.5,28 52,36.5 48.5,36.5"
                    onClick={() => {
                      addInventoryItem('bobby_pin');
                      sound.playPaperRustle();
                      setRoomBanner({
                        text: 'Searching through dried ink nibs in the ceramic tray, you retrieve a sturdy bent steel bobby pin! Added to inventory.',
                        type: 'success',
                      });
                    }}
                  />
                )}

                {/* Lecture Books & Notebook */}
                <InteractiveHotspot
                  id="desk_lecture_books"
                  name="Lecture Notebooks"
                  cursorTooltip="Physics & Chemistry Lecture Notes (1998)"
                 polygonPoints="35,83 72,69 79,96 35,96"
                  onClick={() => {
                    sound.playPaperRustle();
                    setActiveMonologue(
                      "— Physics and chemistry lecture notes from 1998... Someone scribbled: 'Strange voltage drops and vibrations in the hallway past 11 PM...' —"
                    );
                  }}
                />
              </>
            )}

            {/* SUB-SCENE 3: BEDSIDE STOOL & COMPASS */}
            {activeInspectSubScene === 'stool' && (
              <>
                <InteractiveHotspot
                  id="stool_tin_compass"
                  name="Rusted Metal Biscuit Tin"
                  cursorTooltip={
                    hasMagneticCompass
                      ? 'Inspect Antique Magnetic Compass'
                      : 'Open Rusted Metal Tin Box'
                  }
                  x={42}
                  y={40}
                  width={22}
                  height={26}
                  shape="rect"
                  onClick={() => {
                    if (!hasMagneticCompass) {
                      setHasMagneticCompass(true);
                      addInventoryItem('magnetic_compass');
                      sound.playChime(true);
                      sound.playPaperRustle();
                      setRoomBanner({
                        text: 'COMPASS FOUND! — An antique brass magnetic compass resting inside a rusted velvet-lined tin box.',
                        type: 'success',
                      });
                      setIsCompassModalOpen(true);
                    } else {
                      sound.playPaperRustle();
                      setIsCompassModalOpen(true);
                    }
                  }}
                />
              </>
            )}

            {/* SUB-SCENE 4: WARDROBE FOOTING */}
            {activeInspectSubScene === 'wardrobe' && (
              <>
                {/* Leaning Wooden Bat / Strut (Hides when already collected into inventory) */}
                {!hasWoodenBat && !inventory.includes('wooden_bat') ? (
                  <InteractiveHotspot
                    id="wardrobe_timber_bat"
                    name="Heavy Teak Timber"
                    cursorTooltip="Heavy Teak Timber"
                    polygonPoints="35.5,19.5 40.5,20.5 41.5,23.5 32.5,81 29.5,82.5 25.5,80.5 34.5,21.5"
                    onClick={handlePickupWoodenBat}
                  />
                ) : (
                  /* Once collected, keep spot inactive / pointer-events-none */
                  <div
                    className="absolute inset-0 pointer-events-none"
                    aria-hidden="true"
                  />
                )}

                {/* Wardrobe Baseboard Lore Inspect */}
                <InteractiveHotspot
                  id="wardrobe_baseboard"
                  name="Wardrobe Baseboard"
                  cursorTooltip="Wardrobe Baseboard"
                  x={10}
                  y={75}
                  width={80}
                  height={22}
                  shape="rect"
                  onClick={() => {
                    sound.playMenuSelect();
                    setActiveMonologue(
                      hasWoodenBat || inventory.includes('wooden_bat')
                        ? "— The wooden timber has been taken. Only the warped teak baseboard remains, settled deep into the floorboards. —"
                        : "— Solid teak baseboard from the nineties, warped by monsoon moisture. The heavy wardrobe footing has settled deep into the floorboards. —"
                    );
                  }}
                />
              </>
            )}

            {/* SUB-SCENE 5: WALL CALENDAR ZOOM */}
            {activeInspectSubScene === 'calendar' && (
              <>
                <InteractiveHotspot
                  id="calendar_aug14"
                  name="Wall Calendar Sheet"
                  cursorTooltip="Examine Circled Date (August 14, 1998)"
                  polygonPoints="25,12 52.5,13.5 53,80.5 24.5,82.5"
                  onClick={() => {
                    sound.playPaperRustle();
                    addDiscoveredClue('curfew_calendar_1998');
                    setActiveMonologue(
                      "— August 14, 1998 circled in red ink... 'All wing exits chained after 11:30 PM. No unauthorized departures.' —"
                    );
                  }}
                />
              </>
            )}

            {/* SUB-SCENE 6: FULL DOOR VIEW (Floor-to-Lintel) */}
            {activeInspectSubScene === 'door' && (
              <>
                {/* Interactive Hotspot over Deadbolt Mechanism / Center Door Area */}
                <InteractiveHotspot
                  id="door_deadbolt"
                  name={doorUnlocked ? "Unlocked Teak Door" : "Locked Teak Door"}
                  cursorTooltip={doorUnlocked ? "Step through to Pathway 326" : "Locked Teak Door"}
                  x={28}
                  y={5}
                  width={45}
                  height={100}
                  shape="rect"
                  onClick={() => {
                    if (doorUnlocked) {
                      sound.playPaperRustle();
                      setCurrentScene('pathway_326_main');
                      setCurrentSubScene(null);
                      setPhase3Location('hallway_threshold');
                      setPhase3Message(null);
                      setMode('phase3');
                    } else {
                      sound.playMenuSelect();
                      setIsDoorInspectOpen(true);
                    }
                  }}
                />
              </>
            )}
          </div>

          {/* Inspection / Breach Dialog (Only shown upon interacting with deadbolt) */}
          {activeInspectSubScene === 'door' && (
            <AnimatePresence>
              {isDoorInspectOpen && (
                <div className="absolute inset-x-0 bottom-6 sm:bottom-10 flex justify-center px-4 z-30 pointer-events-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="w-full max-w-xl bg-[#121815]/95 backdrop-blur-xl border border-[#2c3d34] rounded-2xl p-5 sm:p-6 shadow-2xl text-center space-y-4 relative"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#2c3d34]">
                      <div className="flex items-center gap-2 text-[#82a996]">
                        <Lock className="w-4 h-4 text-[#82a996]" />
                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#82a996]">
                          ROOM 4B HEAVY TEAK EXIT DOOR
                        </span>
                      </div>
                      <button
                        onClick={() => setIsDoorInspectOpen(false)}
                        className="p-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white cursor-pointer transition-colors"
                        title="Close door inspection"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {doorUnlocked ? (
                      <div className="space-y-3">
                        <div className="py-4 px-4 rounded-xl bg-[#151f1a]/80 border border-[#223229]">
                          <p className="text-[#b4c9bf] font-mono text-sm sm:text-base tracking-wide leading-relaxed">
                            The deadbolt is disengaged. Door 4B is wide open to Pathway 326.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            sound.playPaperRustle();
                            setIsDoorInspectOpen(false);
                            setActiveInspectSubScene('main');
                            setCurrentScene('pathway_326_main');
                            setCurrentSubScene(null);
                            setPhase3Location('hallway_threshold');
                            setPhase3Message(null);
                            setMode('phase3');
                          }}
                          className="w-full py-3 rounded-xl bg-[#22352b] hover:bg-[#2d4639] border border-[#3f5c4c] text-[#d1e3da] font-mono text-xs tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>STEP THROUGH TO PATHWAY 326</span>
                          <span className="text-xs">→</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Empty-Handed Display: strictly raw text, NO hint or guidance */}
                        {!hasInventoryItem('bobby_pin') && !hasInventoryItem('wooden_bat') && (
                          <div className="py-4 px-4 rounded-xl bg-stone-900/90 border border-stone-800">
                            <p className="text-stone-200 font-mono text-sm sm:text-base tracking-wide leading-relaxed">
                              The deadbolt is engaged from the other side. Locked.
                            </p>
                          </div>
                        )}

                        {/* Dynamic Unlocking Options */}
                        {(hasInventoryItem('bobby_pin') || hasInventoryItem('wooden_bat')) && (
                          <div className="space-y-3">
                            <p className="text-xs font-mono text-stone-400">
                              Choose an action to breach the deadbolt:
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {/* Option 1: Lockpick with Bobby Pin */}
                              {hasInventoryItem('bobby_pin') && (
                                <button
                                  disabled={isDoorTransitioning}
                                  onClick={() => executeUnlockDoor('bobby_pin')}
                                  className="p-3.5 rounded-xl bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-emerald-600/80 hover:border-emerald-400 hover:bg-emerald-950/40 text-left transition-all cursor-pointer shadow-lg group"
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <Unlock className="w-4 h-4 text-emerald-400" />
                                    <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                                      Pick the lock with bobby pin
                                    </span>
                                  </div>
                                  <p className="text-[11px] font-mono text-stone-400 group-hover:text-stone-300">
                                    Silent breach • Zero Composure loss. Moe Stheinkha unlocks it cleanly.
                                  </p>
                                </button>
                              )}

                              {/* Option 2: Smash with Wooden Bat */}
                              {hasInventoryItem('wooden_bat') && (
                                <button
                                  disabled={isDoorTransitioning}
                                  onClick={() => executeUnlockDoor('wooden_bat')}
                                  className="p-3.5 rounded-xl bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-rose-700/80 hover:border-rose-500 hover:bg-rose-950/40 text-left transition-all cursor-pointer shadow-lg group"
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                                    <span className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider">
                                      Smash open lock with wooden bat
                                    </span>
                                  </div>
                                  <div className="text-[11px] font-mono text-rose-300/90 font-semibold mb-1">
                                    ⚠️ Warning: Smashing the door will produce a deafening crash.
                                  </div>
                                  <p className="text-[10px] font-mono text-stone-400 group-hover:text-stone-300">
                                    -15% Composure loss • Elevates subsequent hallway threat.
                                  </p>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          )}
            </>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 6.8. MODE: PHASE 3 - PATHWAY 326 (WEST WING & COMMUNAL WASHROOM) */}
      {/* ======================================================== */}
      {mode === 'phase3' && (
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between">
          {/* Top-Left Return Button */}
          {(currentScene === 'pathway_326_main' || phase3Location === 'hallway_threshold') && (
            <button
              onClick={() => {
                sound.playPaperRustle();
                setCurrentScene('room_4b_main');
                setCurrentSubScene(null);
                setActiveInspectSubScene('main');
                setMode('room_escape');
              }}
              className="absolute top-4 left-4 z-40 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121815]/90 border border-[#273830] hover:border-[#425e50] text-[#9db5a8] hover:text-[#c2d6cc] font-mono text-xs tracking-wider transition-all duration-200 shadow-md pointer-events-auto"
            >
              <span className="text-[10px]">←</span> RE-ENTER ROOM 4B
            </button>
          )}

          {/* Sub-scene Header Bar & Navigation */}
          <div className="w-full flex items-center justify-between px-4 sm:px-8 pt-16 sm:pt-20 pb-1 z-30 pointer-events-auto">
            {phase3Location !== 'hallway_threshold' ? (
              <button
                onClick={() => {
                  setPhase3Message(null);
                  if (
                    phase3Location === 'washroom_basin' ||
                    phase3Location === 'washroom_stall' ||
                    phase3Location === 'washroom_rope' ||
                    phase3Location === 'washroom_mirror'
                  ) {
                    sound.playPaperRustle();
                    setPhase3Location('washroom_main');
                  } else if (phase3Location === 'stairwell_gate' || phase3Location === 'washroom_main') {
                    sound.playPaperRustle();
                    setPhase3Location('west_split_landing');
                  } else if (phase3Location === 'west_split_landing') {
                    sound.playPaperRustle();
                    setPhase3Location('hallway_threshold');
                  } else if (
                    phase3Location === 'locker_32' ||
                    phase3Location === 'locker_09' ||
                    phase3Location === 'locker_14' ||
                    phase3Location === 'locker_spider'
                  ) {
                    sound.playPaperRustle();
                    setPhase3Location('lockers_main');
                  } else if (phase3Location === 'lockers_main') {
                    if (hasReadLocker32Note && !corridorShadowScareTriggered) {
                      setIsScreenShaking(true);
                      setCorridorShadowFlash(true);
                      sound.playScareSlam();
                      setComposure((prev) => Math.max(0, prev - 5));
                      setCorridorShadowScareTriggered(true);
                      setTimeout(() => {
                        setIsScreenShaking(false);
                        setCorridorShadowFlash(false);
                      }, 900);
                      setActiveMonologue("— A heavy shadow darts across the corridor ceiling! The iron pipes groan... (-5% Composure) —");
                    } else {
                      sound.playPaperRustle();
                      setActiveMonologue(null);
                    }
                    setPhase3Location('east_fork');
                  } else if (phase3Location === 'caretaker_door_keypad') {
                    sound.playPaperRustle();
                    setPhase3Location('east_fork');
                  } else if (phase3Location === 'caretaker_office_main') {
                    sound.playPaperRustle();
                    setPhase3Location('east_fork');
                  } else if (phase3Location === 'prayer_altar') {
                    sound.playPaperRustle();
                    setPhase3Location('prayer_room_main');
                  } else if (phase3Location === 'prayer_room_main') {
                    sound.playPaperRustle();
                    setPhase3Location('east_fork');
                  } else if (phase3Location === 'east_fork') {
                    sound.playPaperRustle();
                    setPhase3Location('hallway_threshold');
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#121815]/95 border border-[#2c3d34] hover:bg-[#18221d] hover:border-[#4d6e5e] text-[#c2d6cc] hover:text-[#6ee7b7] text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-[#82a996]" />
                <span>
                  {phase3Location === 'stairwell_gate'
                    ? 'ASCEND BACK TO LANDING'
                    : phase3Location === 'washroom_main'
                    ? 'EXIT TO HALLWAY LANDING'
                    : phase3Location.startsWith('washroom_')
                    ? 'RETURN TO WASHROOM'
                    : phase3Location.startsWith('locker_')
                    ? 'STEP BACK TO LOCKER BAY'
                    : phase3Location === 'lockers_main'
                    ? 'EXIT TO EAST WING FORK'
                    : phase3Location === 'caretaker_door_keypad'
                    ? 'STEP BACK TO EAST WING FORK'
                    : phase3Location === 'caretaker_office_main'
                    ? 'EXIT CARETAKER OFFICE'
                    : phase3Location === 'prayer_altar'
                    ? 'STEP BACK TO PRAYER ROOM'
                    : phase3Location === 'prayer_room_main'
                    ? 'EXIT TO EAST WING FORK'
                    : 'STEP BACK TO THRESHOLD'}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#82a996]" />
                <span className="text-xs font-mono font-bold text-[#82a996] uppercase tracking-widest">
                  PATHWAY 326 • THRESHOLD
                </span>
              </div>
            )}

            {/* Current Area Subtitle Badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#121815]/95 border border-[#2c3d34] text-[11px] font-mono text-[#c2d6cc]">
              <span className="text-[#82a996] font-bold">AREA:</span>
              <span className="uppercase">
                {phase3Location === 'hallway_threshold'
                  ? 'Corridor Split'
                  : phase3Location === 'west_split_landing'
                  ? 'West Wing Split Landing'
                  : phase3Location === 'stairwell_gate'
                  ? 'Ground Floor Padlocked Gate'
                  : phase3Location === 'washroom_main'
                  ? 'Communal Washroom'
                  : phase3Location === 'washroom_basin'
                  ? 'Cement Wash Basin'
                  : phase3Location === 'washroom_stall'
                  ? 'Third Cubicle Stall'
                  : phase3Location === 'washroom_rope'
                  ? 'Overhead Drainage Pipe'
                  : phase3Location === 'washroom_mirror'
                  ? 'Cracked Wall Mirror & Sinks'
                  : phase3Location === 'east_fork'
                  ? 'East Wing Fork'
                  : phase3Location === 'lockers_main'
                  ? 'Student Locker Bay'
                  : phase3Location === 'locker_32'
                  ? "Locker 32 (Sandar's)"
                  : phase3Location === 'locker_09'
                  ? 'Locker 09 (Supplies)'
                  : phase3Location === 'locker_14'
                  ? "Locker 14 (Mama May's)"
                  : phase3Location === 'locker_spider'
                  ? 'Rusted Locker Vent'
                  : phase3Location === 'caretaker_door_keypad'
                  ? 'Caretaker Office Push-Latch Keypad'
                  : phase3Location === 'caretaker_office_main'
                  ? "Caretaker's Old Office"
                  : phase3Location === 'prayer_room_main'
                  ? 'Communal Prayer Sanctuary'
                  : 'Guardian Nat Prayer Altar'}
              </span>
            </div>
          </div>

          {/* Sub-scene Interactive Area */}
          <div className="relative flex-1 w-full h-full pointer-events-auto">
            {/* SUB-SCENE 1: THRESHOLD - TWO CLEAN VISUAL CHOICE CARDS */}
            {phase3Location === 'hallway_threshold' && (
              <>
                {/* Doorway Hotspot Mapping on Corridor Scene (pathway_326_main.jpg) */}
                <InteractiveHotspot
                  id="return-room-4b"
                  name="Door to Room 4B"
                  cursorTooltip="Step Back into Room 4B"
                  polygonPoints="0,15 16,18 16,92 0,98"
                  onClick={() => {
                    sound.playPaperRustle();
                    setCurrentScene('room_4b_main');
                    setCurrentSubScene(null);
                    setActiveInspectSubScene('main');
                    setMode('room_escape');
                  }}
                />

                <div className="absolute inset-0 flex items-center justify-center px-4 py-2 z-20 pointer-events-none">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 max-w-4xl w-full pointer-events-auto">
                  {/* Left Card: West Wing */}
                  <motion.div
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      sound.playMenuSelect();
                      setPhase3Message(null);
                      setPhase3Location('west_split_landing');
                    }}
                    className="group relative w-72 sm:w-80 h-96 rounded-2xl overflow-hidden border border-[#2e4238] hover:border-[#4d6e5e] bg-[#121815]/95 cursor-pointer shadow-[0_0_15px_rgba(46,66,56,0.5)] hover:shadow-[0_0_25px_rgba(46,66,56,0.7)] hover:bg-[#18221d]/50 transition-all duration-300 flex flex-col justify-end p-5"
                  >
                    <img
                      src={PHASE_3_ASSETS.cardPathwayLeft}
                      alt="West Wing"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0d] via-[#121815]/50 to-transparent" />
                    <div className="relative z-10 space-y-1 text-left">
                      <span className="text-[11px] font-mono font-bold tracking-widest text-[#82a996] uppercase">
                        WEST WING
                      </span>
                      <h3
                        className="text-2xl sm:text-3xl font-black text-[#c2d6cc] tracking-wider uppercase group-hover:text-[#6ee7b7] transition-colors"
                        style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                      >
                        STAIRWELL & WASHROOM
                      </h3>
                    </div>
                  </motion.div>

                  {/* Right Card: East Wing */}
                  <motion.div
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      sound.playMenuSelect();
                      setPhase3Message(null);
                      setPhase3Location('east_fork');
                    }}
                    className="group relative w-72 sm:w-80 h-96 rounded-2xl overflow-hidden border border-[#2e4238] hover:border-[#4d6e5e] bg-[#121815]/95 cursor-pointer shadow-[0_0_15px_rgba(46,66,56,0.5)] hover:shadow-[0_0_25px_rgba(46,66,56,0.7)] hover:bg-[#18221d]/50 transition-all duration-300 flex flex-col justify-end p-5"
                  >
                    <img
                      src={PHASE_3_ASSETS.cardPathwayRight}
                      alt="East Wing"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0d] via-[#121815]/50 to-transparent" />
                    <div className="relative z-10 space-y-1 text-left">
                      <span className="text-[11px] font-mono font-bold tracking-widest text-[#82a996] uppercase">
                        EAST WING
                      </span>
                      <h3
                        className="text-2xl sm:text-3xl font-black text-[#c2d6cc] tracking-wider uppercase group-hover:text-[#6ee7b7] transition-colors"
                        style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                      >
                        LOCKERS & SHRINE
                      </h3>
                    </div>
                  </motion.div>
                </div>
              </div>
              </>
            )}

            {/* SUB-SCENE 2: WEST WING SPLIT LANDING */}
            {phase3Location === 'west_split_landing' && (
              <>
                {/* Left Archway (Communal Washroom Entrance) */}
                <InteractiveHotspot
                  id="landing_communal_washroom"
                  name="Communal Washroom Entrance"
                  polygonPoints="0,0 44,0 44,73 0,98"
                  cursorTooltip="[Enter Communal Washroom]"
                  onClick={() => {
                    sound.playMenuSelect();
                    setActiveMonologue(null);
                    setPhase3Location('washroom_main');
                  }}
                />

                {/* Right Staircase (Stairwell Descent) */}
                <InteractiveHotspot
                  id="landing_downstairs_stairwell"
                  name="Downstairs Concrete Stairwell"
                  polygonPoints="70,35 85,35 78,67 57,60"
                  cursorTooltip="[Descend Stairwell]"
                  onClick={() => {
                    sound.playMenuSelect();
                    setActiveMonologue(null);
                    setPhase3Location('stairwell_gate');
                  }}
                />
              </>
            )}

            {/* SUB-SCENE 3: GROUND FLOOR STAIRWELL LANDING */}
            {phase3Location === 'stairwell_gate' && (
              <>
                <InteractiveHotspot
                  id="stairwell_gate_padlock"
                  name="Padlock & Scissor Gate"
                  polygonPoints="55,22 64,22 60,45 55,45"
                  cursorTooltip="[Examine Heavy Padlock & Chain]"
                  onClick={() => {
                    setStairwellGateInspected(true);
                    sound.playDramaticSting();
                    setActiveMonologue(
                      "— A heavy accordion gate... padlocked with clean chain links from the outside. No brute force will budge this. I need a key, or heavy bolt cutters. —"
                    );
                  }}
                />
              </>
            )}

            {/* SUB-SCENE 4: COMMUNAL WASHROOM OVERVIEW */}
            {phase3Location === 'washroom_main' && (
              <>
                {/* 1. Cement Wash Basin & Soaked Uniforms (Left Side) */}
                <InteractiveHotspot
                  id="washroom_basin_trough"
                  name="Cement Wash Basin & Soaked Uniforms"
                  polygonPoints="12,48 18,48 30,66 9,78"
                  cursorTooltip="[Inspect Wash Basin]"
                  onClick={() => {
                    sound.playMenuSelect();
                    setPhase3Message(null);
                    setPhase3Location('washroom_basin');
                  }}
                />

                {/* 2. Third Cubicle Stall Door (Recessed Door Panel) */}
                <InteractiveHotspot
                  id="washroom_stall_cubicle"
                  name="Third Cubicle Stall Door"
                  polygonPoints="48,18 56,13 56.5,73 48,66"
                  cursorTooltip="[Inspect Bloodstained Stall]"
                  onClick={() => {
                    sound.playMenuSelect();
                    setPhase3Message(null);
                    setPhase3Location('washroom_stall');
                  }}
                />

                {/* 3. Ceiling Ropes & Drainage Pipe (Top Center) */}
                <InteractiveHotspot
                  id="washroom_overhead_pipe"
                  name="Overhead Pipe & Coiled Rope"
                  x={60}
                  y={0}
                  width={8}
                  height={20}
                  shape="rect"
                  cursorTooltip="[Inspect Overhead Rope]"
                  onClick={() => {
                    sound.playMenuSelect();
                    setPhase3Message(null);
                    setPhase3Location('washroom_rope');
                  }}
                />

                {/* 4. Cracked Mirror & Sinks (Right Side) */}
                <InteractiveHotspot
                  id="washroom_cracked_mirror"
                  name="Cracked Wall Mirror & Sinks"
                  polygonPoints="70,20 94,19 95,50 70,49"
                  cursorTooltip="[Inspect Mirror & Sinks]"
                  onClick={() => {
                    sound.playMenuSelect();
                    setPhase3Message(null);
                    setPhase3Location('washroom_mirror');
                  }}
                />
              </>
            )}

            {/* ZOOM 1: CEMENT WASH BASIN */}
            {phase3Location === 'washroom_basin' && (
              <>
                <InteractiveHotspot
                  id="washroom_basin_pocket"
                  name="Floating Cotton Shirt Pocket"
                  polygonPoints="60,40 66,40 68,56 55,60"
                  cursorTooltip={
                    !hasSmallBrassKey
                      ? '[Search Soaked Shirt Pocket]'
                      : '[Soaked Uniform Pocket (Empty)]'
                  }
                  onClick={() => {
                    if (!hasSmallBrassKey) {
                      addInventoryItem('small_brass_key_32');
                      setHasSmallBrassKey(true);
                      sound.playPaperRustle();
                      setActiveMonologue(
                        "— Waterlogged student shirts from twenty-eight years ago. Wait... there's something hard tucked into the seam of this pocket. —"
                      );
                    } else {
                      sound.playPaperRustle();
                      setActiveMonologue(
                        "— The pocket is empty now. Just cold, murky water soaked into the seams. —"
                      );
                    }
                  }}
                />
              </>
            )}

            {/* ZOOM 2: THIRD CUBICLE STALL DOOR */}
            {phase3Location === 'washroom_stall' && (
              <>
                <InteractiveHotspot
                  id="washroom_stall_details"
                  name="Bloodstained Stall Echo"
                  polygonPoints="58,53 75,53 75,87 58,87"
                  cursorTooltip="[Examine Stall Echo & Hair Ribbon]"
                  onClick={() => {
                    sound.playDramaticSting();
                    setActiveMonologue(
                      "— Dried smear marks on the latch... and cold water dripping down my neck. Someone was trying to claw their way out. —"
                    );
                  }}
                />
              </>
            )}

            {/* ZOOM 3: OVERHEAD COILED ROPE */}
            {phase3Location === 'washroom_rope' && (
              <>
                <InteractiveHotspot
                  id="washroom_rope_drainage"
                  name="Overhead Coiled Rope"
                  polygonPoints="55,1 75,1 78,85 55,85"
                  cursorTooltip={
                    !hasNylonRope
                      ? '[Take Coiled Nylon Rope]'
                      : '[Drainage Pipe (Rope Retrieved)]'
                  }
                  onClick={() => {
                    if (!hasNylonRope) {
                      addInventoryItem('coiled_nylon_rope');
                      setHasNylonRope(true);
                      sound.playPaperRustle();
                      setActiveMonologue(
                        "— A coiled nylon rope dangling from the rusty drainage pipe... This might hold my weight. Acquired: Coiled Nylon Rope. —"
                      );
                    } else {
                      sound.playPaperRustle();
                      setActiveMonologue(
                        "— The overhead drainage pipe is now bare. Nothing else hangs from the ceiling. —"
                      );
                    }
                  }}
                />
              </>
            )}

            {/* ZOOM 4: CRACKED WALL MIRROR */}
            {phase3Location === 'washroom_mirror' && (
              <>
                <InteractiveHotspot
                  id="washroom_mirror_etching"
                  name="Bottom Mirror Frame"
                  polygonPoints="15,65 85,65 88,82 12,82"
                  cursorTooltip={
                    !washroomMirrorScratched
                      ? '[Wipe Bottom Mirror Frame]'
                      : '[Read Etched Scrawl: Locker 14 - 1998]'
                  }
                  onClick={() => {
                    setWashroomMirrorScratched(true);
                    addDiscoveredClue('mirror_locker_scrawl');
                    sound.playPaperRustle();
                    setActiveMonologue(
                      "— 'Locker 14 - 1998' scratched into the frame. Someone left this note before the mirrors shattered. —"
                    );
                  }}
                />
              </>
            )}

            {/* SUB-SCENE 5: EAST WING FORK - THREE CHOICE CARDS */}
            {phase3Location === 'east_fork' && (
              <div className="absolute inset-0 flex items-center justify-center px-4 py-2 z-20 pointer-events-none">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 max-w-5xl w-full pointer-events-auto">
                  {/* Card A: Lockers */}
                  <motion.div
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      sound.playMenuSelect();
                      setPhase3Message(null);
                      setPhase3Location('lockers_main');
                    }}
                    className="group relative w-64 sm:w-72 h-88 sm:h-96 rounded-2xl overflow-hidden border border-[#2e4238] hover:border-[#4d6e5e] bg-[#121815]/95 cursor-pointer shadow-[0_0_15px_rgba(46,66,56,0.5)] hover:shadow-[0_0_25px_rgba(46,66,56,0.7)] hover:bg-[#18221d]/50 transition-all duration-300 flex flex-col justify-end p-5"
                  >
                    <img
                      src={PHASE_3_ASSETS.cardEastLockers}
                      alt="Lockers Area"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0d] via-[#121815]/50 to-transparent" />
                    <div className="relative z-10 space-y-1 text-left">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-[#82a996] uppercase">
                        SECTOR A • LOCKERS
                      </span>
                      <h3
                        className="text-2xl font-black text-[#c2d6cc] tracking-wider uppercase group-hover:text-[#6ee7b7] transition-colors"
                        style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                      >
                        STUDENT LOCKER BAY
                      </h3>
                      <p className="text-[11px] font-mono text-stone-400 line-clamp-2">
                        Metal lockers from 1998. Belongings of May, Sandar, and dorm residents.
                      </p>
                    </div>
                  </motion.div>

                  {/* Card B: Prayer Room */}
                  <motion.div
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      sound.playMenuSelect();
                      setPhase3Message(null);
                      setPhase3Location('prayer_room_main');
                    }}
                    className="group relative w-64 sm:w-72 h-88 sm:h-96 rounded-2xl overflow-hidden border border-[#2e4238] hover:border-[#4d6e5e] bg-[#121815]/95 cursor-pointer shadow-[0_0_15px_rgba(46,66,56,0.5)] hover:shadow-[0_0_25px_rgba(46,66,56,0.7)] hover:bg-[#18221d]/50 transition-all duration-300 flex flex-col justify-end p-5"
                  >
                    <img
                      src={PHASE_3_ASSETS.cardEastPrayer}
                      alt="Prayer Room"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0d] via-[#121815]/50 to-transparent" />
                    <div className="relative z-10 space-y-1 text-left">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-[#82a996] uppercase">
                        SECTOR B • SANCTUARY
                      </span>
                      <h3
                        className="text-2xl font-black text-[#c2d6cc] tracking-wider uppercase group-hover:text-[#6ee7b7] transition-colors"
                        style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                      >
                        PRAYER ROOM & ALTAR
                      </h3>
                      <p className="text-[11px] font-mono text-stone-400 line-clamp-2">
                        Ancient Burmese Nat shrine with offering bowls and incense tiers.
                      </p>
                    </div>
                  </motion.div>

                  {/* Card C: Caretaker Archive */}
                  <motion.div
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      sound.playMenuSelect();
                      setPhase3Message(null);
                      if (!caretakerDoorUnlocked) {
                        setPhase3Location('caretaker_door_keypad');
                      } else {
                        setPhase3Location('caretaker_office_main');
                      }
                    }}
                    className="group relative w-64 sm:w-72 h-88 sm:h-96 rounded-2xl overflow-hidden border border-[#2e4238] hover:border-[#4d6e5e] bg-[#121815]/95 cursor-pointer shadow-[0_0_15px_rgba(46,66,56,0.5)] hover:shadow-[0_0_25px_rgba(46,66,56,0.7)] hover:bg-[#18221d]/50 transition-all duration-300 flex flex-col justify-end p-5"
                  >
                    <img
                      src={PHASE_3_ASSETS.cardEastCaretaker}
                      alt="Caretaker Office"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0d] via-[#121815]/50 to-transparent" />
                    <div className="relative z-10 space-y-1 text-left">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-widest uppercase">
                        {caretakerDoorUnlocked ? (
                          <span className="text-[#6ee7b7] flex items-center gap-1">
                            <Unlock className="w-3 h-3 text-[#6ee7b7]" /> UNLOCKED
                          </span>
                        ) : (
                          <span className="text-stone-400 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-stone-400" /> KEYPAD LOCKED
                          </span>
                        )}
                      </div>
                      <h3
                        className="text-2xl font-black text-[#c2d6cc] tracking-wider uppercase group-hover:text-[#6ee7b7] transition-colors"
                        style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                      >
                        CARETAKER ARCHIVE
                      </h3>
                      <p className="text-[11px] font-mono text-stone-400 line-clamp-2">
                        Warden's locked records office secured by a push-latch electronic keypad.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {/* SUB-SCENE 6: LOCKER BAY OVERVIEW */}
            {phase3Location === 'lockers_main' && (
              <LockersOverviewView
                hasSmallBrassKey={hasSmallBrassKey}
                setPhase3Location={setPhase3Location}
                setActiveMonologue={setActiveMonologue}
                setComposure={setComposure}
                setIsScreenShaking={setIsScreenShaking}
              />
            )}

            {/* ZOOM: LOCKER 32 INTERIOR */}
            {phase3Location === 'locker_32' && (
              <>
                {/* 1. Hotspot: Pinned Pink Hostel Slip (Top-Right) */}
                <InteractiveHotspot
                  id="locker-32-pink-slip"
                  name="Pink Hostel Overwrite Slip"
                  polygonPoints="60,10 77,12 76,48 59,42"
                  cursorTooltip="Examine Pinned Slip"
                  onClick={() => {
                    sound.playPaperRustle();
                    setActiveMonologue(
                      "An official hostel maintenance slip: 'Warden Office Electronic Push-Latch Overwrite: 8 1 4 0 9 2.' Below it in faint pencil: 'Note: Caretaker mirrors all sequence inputs for emergency security.'"
                    );
                    setHasReadLocker32Note(true);
                    addDiscoveredClue('cipher_note_32');
                  }}
                />

                {/* 2. Hotspot: Bundle of Folded Letters marked K.Z. (Bottom-Right) */}
                <InteractiveHotspot
                  id="locker-32-letters"
                  name="Folded Love Letters"
                  polygonPoints="60,50 83,52 84,77 60,75"
                  cursorTooltip="Read Folded Letters"
                  onClick={() => {
                    sound.playPaperRustle();
                    setActiveMonologue(
                      "Folded letters addressed to Sandar, signed 'K.Z.'... 'Sandar, she is getting suspicious about the tea shop visits. If May finds out about us, neither of us can stay in this hostel.'"
                    );
                    setHasReadSandarLetters(true);
                    addDiscoveredClue('sandar_kozaw_letters');
                  }}
                />

                {/* 3. Optional Hotspot: Stacked Course Books (Bottom-Left) */}
                <InteractiveHotspot
                  id="locker-32-books"
                  name="Old Engineering Textbooks"
                  polygonPoints="38,40 61,42 62,74 38,72"
                  cursorTooltip="Inspect Books"
                  onClick={() => {
                    sound.playPaperRustle();
                    setActiveMonologue(
                      "Heavy textbooks belonging to Sandar. The covers are warped with moisture and smelling of damp mildew."
                    );
                  }}
                />
              </>
            )}

            {/* ZOOM: LOCKER 09 INTERIOR */}
            {phase3Location === 'locker_09' && (
              <>
                {/* 1. Black Beeswax Candle (Left Center) */}
                {!hasLocker09Candle && (
                  <InteractiveHotspot
                    id="locker-09-candle"
                    name="Black Beeswax Candle"
                    polygonPoints="50,29 57,29 59,85 50,85"
                    cursorTooltip="Take Black Candle"
                    onClick={() => {
                      sound.playItemPickup();
                      setHasLocker09Candle(true);
                      setHasBlackCandlesCount((prev) => prev + 1);
                      setInventory((prev) => [...prev, 'black_beeswax_candle']);
                      setActiveMonologue(
                        "A thick black beeswax candle. Heavy, cold, and smells faintly of sweet oil. Ideal for the prayer altar."
                      );
                    }}
                  />
                )}

                {/* 2. Vintage Burmese Matchbox (Right Center) */}
                {!hasLocker09Matchbox && (
                  <InteractiveHotspot
                    id="locker-09-matchbox"
                    name="Three-Shooting-Stars Matchbox"
                    polygonPoints="65,27 87,32 87,85 65,80"
                    cursorTooltip="Take Matchbox"
                    onClick={() => {
                      sound.playPaperRustle();
                      setHasLocker09Matchbox(true);
                      setHasMatchesCount(3);
                      setInventory((prev) => [...prev, 'matchbox_three_stars']);
                      setActiveMonologue(
                        "A box of 'Three-Shooting-Stars' safety matches. There are only three dry matches left inside."
                      );
                    }}
                  />
                )}

                {/* Emptied Feedback Hotspot */}
                {hasLocker09Candle && hasLocker09Matchbox && (
                  <InteractiveHotspot
                    id="locker-09-empty"
                    name="Locker 09 (Emptied)"
                    polygonPoints="45,25 90,25 90,88 45,88"
                    cursorTooltip="Locker 09 (Emptied)"
                    onClick={() => {
                      sound.playPaperRustle();
                      setActiveMonologue(
                        "— Locker 09 is emptied. The remaining shelves hold only damp insect droppings and rusted shelf pins. —"
                      );
                    }}
                  />
                )}
              </>
            )}

            {/* ZOOM: LOCKER 14 PADLOCK */}
            {phase3Location === 'locker_14' && (
              <>
                <InteractiveHotspot
                  id="locker_14_cylinder"
                  name="Barrel Cylinder Lock"
                  x={32}
                  y={28}
                  width={36}
                  height={48}
                  shape="rect"
                  cursorTooltip="[Inspect Barrel Lock]"
                  onClick={() => {
                    sound.playDramaticSting();
                    setActiveMonologue(
                      "— Locked tight with a small barrel cylinder. May's personal locker... the key is nowhere here. —"
                    );
                  }}
                />
              </>
            )}

            {/* ZOOM: LOCKER SPIDERS */}
            {phase3Location === 'locker_spider' && (
              <>
                <InteractiveHotspot
                  id="locker_spider_retreat"
                  name="Scurrying Cellar Spiders"
                  x={25}
                  y={25}
                  width={50}
                  height={50}
                  shape="rect"
                  cursorTooltip="[Step Back from Infestation]"
                  onClick={() => {
                    sound.playPaperRustle();
                    setPhase3Location('lockers_main');
                  }}
                />
              </>
            )}

            {/* SUB-SCENE 7: CARETAKER DOOR KEYPAD */}
            {phase3Location === 'caretaker_door_keypad' && (
              <div className="absolute inset-0 flex items-center justify-center p-4 z-20 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-sm bg-[#111714]/95 border border-[#26382f] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-md p-6 pointer-events-auto text-[#c2d6cc]"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#26382f]">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#82a996]" />
                      <span className="text-xs font-mono font-bold tracking-wider text-[#82a996] uppercase">
                        PUSH-LATCH OVERWRITE
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-stone-500 uppercase">MODEL 1998-E</span>
                  </div>

                  {/* Screen Display */}
                  <div className="my-4 p-3 rounded-xl bg-[#0b100e] border border-[#202e26] text-center">
                    <span className="text-[10px] font-mono text-stone-500 block mb-1 uppercase tracking-widest">
                      SECURITY SEQUENCE INPUT
                    </span>
                    <div className="text-2xl font-mono font-black tracking-[0.35em] text-[#6ee7b7] min-h-[36px] flex items-center justify-center">
                      {keypadInput ? keypadInput : <span className="text-stone-700 animate-pulse">_ _ _ _ _ _</span>}
                    </div>
                  </div>

                  {/* 0-9 Keypad Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                      <button
                        key={digit}
                        onClick={() => {
                          sound.playKeyClick();
                          if (keypadInput.length < 8) {
                            setKeypadInput((prev) => prev + digit);
                          }
                        }}
                        className="h-12 rounded-xl bg-[#16241d] hover:bg-[#1f3328] active:scale-95 border border-[#2b4235] text-[#d1e3da] font-mono text-lg font-bold transition-all shadow cursor-pointer"
                      >
                        {digit}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        sound.playPaperRustle();
                        setKeypadInput('');
                      }}
                      className="h-12 rounded-xl bg-[#141b17] hover:bg-[#1a241e] border border-[#233329] text-stone-400 hover:text-stone-200 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      CLEAR
                    </button>
                    <button
                      onClick={() => {
                        sound.playKeyClick();
                        if (keypadInput.length < 8) {
                          setKeypadInput((prev) => prev + '0');
                        }
                      }}
                      className="h-12 rounded-xl bg-[#16241d] hover:bg-[#1f3328] active:scale-95 border border-[#2b4235] text-[#d1e3da] font-mono text-lg font-bold transition-all shadow cursor-pointer"
                    >
                      0
                    </button>
                    <button
                      onClick={() => {
                        if (keypadInput === '290418') {
                          sound.playSuccessTune();
                          setCaretakerDoorUnlocked(true);
                          setActiveMonologue(
                            "— Heavy metallic clunk! The internal solenoid retracts, unlocking the caretaker office door. —"
                          );
                          setPhase3Location('caretaker_office_main');
                        } else {
                          sound.playError();
                          setKeypadInput('');
                          setActiveMonologue("— The keypad emits a dull rejected buzz. Incorrect sequence. —");
                        }
                      }}
                      className="h-12 rounded-xl bg-[#22352b] hover:bg-[#2d4639] active:scale-95 border border-[#3f5c4c] text-[#6ee7b7] font-mono text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
                    >
                      ENTER
                    </button>
                  </div>
                </motion.div>
              </div>
            )}

            {/* SUB-SCENE 8: CARETAKER'S OFFICE ARCHIVE */}
            {phase3Location === 'caretaker_office_main' && (
              <>
                {/* 1. Wooden Supply Shelf (2 candles) */}
                <InteractiveHotspot
                  id="caretaker_supply_shelf"
                  name="Wooden Supply Shelf"
                  x={8}
                  y={18}
                  width={22}
                  height={45}
                  shape="rect"
                  cursorTooltip={hasBlackCandlesCount < 3 ? "[Take 2 Black Beeswax Candles]" : "[Supply Shelf (Empty)]"}
                  onClick={() => {
                    if (hasBlackCandlesCount < 3) {
                      setHasBlackCandlesCount((prev) => prev + 2);
                      if (!inventory.includes('black_beeswax_candle')) addInventoryItem('black_beeswax_candle');
                      sound.playPaperRustle();
                      setActiveMonologue(
                        "— On the high shelf: two additional black beeswax candles matching the one from Locker 09. Now I have 3 candles. —"
                      );
                    } else {
                      sound.playPaperRustle();
                      setActiveMonologue("— The supply shelf is bare now. Nothing remains except dried cobwebs. —");
                    }
                  }}
                />

                {/* 2. Glass Counter Cabinet (Bronze Prayer Bell) */}
                <InteractiveHotspot
                  id="caretaker_glass_cabinet"
                  name="Glass Display Cabinet"
                  x={70}
                  y={25}
                  width={22}
                  height={50}
                  shape="rect"
                  cursorTooltip={!hasBronzeBell ? "[Take Bronze Prayer Bell]" : "[Glass Cabinet (Empty)]"}
                  onClick={() => {
                    if (!hasBronzeBell) {
                      addInventoryItem('bronze_prayer_bell');
                      setHasBronzeBell(true);
                      sound.playPaperRustle();
                      setActiveMonologue(
                        "— Inside the glass display: an ornate cast bronze hand bell with traditional spirit runes etched into the lip. Acquired: Bronze Prayer Bell. —"
                      );
                    } else {
                      sound.playPaperRustle();
                      setActiveMonologue("— The glass display cabinet is empty. —");
                    }
                  }}
                />

                {/* 3. Center Desk Ledger (Spectral Encounter) */}
                <InteractiveHotspot
                  id="caretaker_desk_ledger"
                  name="Caretaker 1998 Ledger"
                  x={34}
                  y={46}
                  width={32}
                  height={38}
                  shape="rect"
                  cursorTooltip={
                    natSummoned || (hasBlackCandlesCount >= 3 && hasBronzeBell)
                      ? "[Examine Open Ledger on Desk]"
                      : "[Examine Caretaker Desk]"
                  }
                  onClick={() => {
                    if (natSummoned || (hasBlackCandlesCount >= 3 && hasBronzeBell)) {
                      handleCaretakerClimax();
                    } else {
                      sound.playPaperRustle();
                      setActiveMonologue(
                        "— The Caretaker's ledger lies open on the desk... dust covers yellowed entries from August 1998. I should search the room for supplies and awaken the Guardian Nat first. —"
                      );
                    }
                  }}
                />
              </>
            )}

            {/* SUB-SCENE 9: COMMUNAL PRAYER ROOM */}
            {phase3Location === 'prayer_room_main' && (
              <>
                <InteractiveHotspot
                  id="prayer_room_altar_approach"
                  name="Guardian Nat Altar"
                  x={32}
                  y={25}
                  width={36}
                  height={55}
                  shape="rect"
                  cursorTooltip="[Approach Guardian Nat Altar]"
                  onClick={() => {
                    sound.playMenuSelect();
                    setPhase3Message(null);
                    setPhase3Location('prayer_altar');
                  }}
                />
              </>
            )}

            {/* SUB-SCENE 10: PRAYER ALTAR & MATCH STRIKING MECHANIC */}
            {phase3Location === 'prayer_altar' && (
              <PrayerAltarView
                composure={composure}
                setComposure={setComposure}
                inventory={inventory}
                setInventory={setInventory}
                hasBlackCandlesCount={hasBlackCandlesCount}
                setHasBlackCandlesCount={setHasBlackCandlesCount}
                hasMatchesCount={hasMatchesCount}
                setHasMatchesCount={setHasMatchesCount}
                hasBronzeBell={hasBronzeBell}
                setHasBronzeBell={setHasBronzeBell}
                selectedCharacterId={selectedCharacter.id}
                activeMonologue={activeMonologue}
                setActiveMonologue={setActiveMonologue}
                setPhase3Location={setPhase3Location}
                altarCandlesPlaced={altarCandlesPlaced}
                setAltarCandlesPlaced={setAltarCandlesPlaced}
                altarBellPlaced={altarBellPlaced}
                setAltarBellPlaced={setAltarBellPlaced}
                natSummoned={natSummoned}
                setNatSummoned={setNatSummoned}
              />
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. MODE B: DIALOGUE & INVESTIGATION VIEW */}
      {/* ======================================================== */}
      {mode === 'awakening' ? (
        <>
          {/* Protagonist Bust Anchor */}
          {activeSpeakerSprite && (
            <div className="absolute left-1 md:left-3 bottom-0 z-30 pointer-events-none select-none flex items-end">
              <img
                src={activeSpeakerSprite}
                alt={selectedCharacter.name}
                className="h-64 sm:h-72 md:h-80 w-auto object-contain object-bottom opacity-75 brightness-90 contrast-95 transition-opacity duration-300 drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]"
              />
            </div>
          )}

          {/* Thought Monologue Overlay */}
          <ThoughtMonologueOverlay
            text={isTyping ? displayedText : (displayedText || currentStep.text)}
            onDismiss={advanceDialogue}
            hintText="[click anywhere to continue]"
          />
        </>
      ) : (
        mode !== 'location_select' && mode !== 'character_select' && mode !== 'shattering' && mode !== 'room_escape' && mode !== 'phase3' && (
          <>
            {/* Character Portraits Container: Positioned strictly above dialogue box (bottom-[14rem]) */}
            <div className="absolute bottom-[13.5rem] sm:bottom-[14rem] left-0 right-0 max-w-5xl mx-auto flex items-end justify-between px-4 sm:px-12 pointer-events-none z-10">
              {/* Left Slot Character (Flipped horizontally in Phase 1 to face inward toward séance circle) */}
              <div className="relative h-56 sm:h-64 md:h-72 flex items-end">
                {mode === 'phase1_2' ? (
                  currentP12Line.pos === 'left' && (
                    <div className="transform scale-x-[-1] flex items-end h-full">
                      <InkPortrait
                        characterId={currentP12Line.characterId}
                        speakerName={currentP12Line.speaker}
                        isSpeaking={true}
                        position="left"
                        size="lg"
                      />
                    </div>
                  )
                ) : (
                  <InkPortrait
                    characterId={selectedCharacter.id}
                    speakerName={selectedCharacter.name}
                    isSpeaking={
                      mode === 'investigating_location' && activeInvestigatingLoc
                        ? activeInvestigatingLoc.lines[locLineIndex]?.speakerType === 'player'
                        : true
                    }
                    position="left"
                    size="lg"
                  />
                )}
              </div>

              {/* Right Slot Character */}
              <div className="relative h-56 sm:h-64 md:h-72 flex items-end">
                {mode === 'phase1_2' ? (
                  currentP12Line.pos === 'right' && (
                    <InkPortrait
                      characterId={currentP12Line.characterId}
                      speakerName={currentP12Line.speaker}
                      isSpeaking={true}
                      position="right"
                      size="lg"
                    />
                  )
                ) : mode === 'investigating_location' &&
                  activeInvestigatingLoc?.lines[locLineIndex]?.speakerType === 'mama_may' ? (
                  <InkPortrait
                    characterId="mama_may"
                    speakerName="Mama May (1998)"
                    isSpeaking={true}
                    position="right"
                    size="lg"
                  />
                ) : null}
              </div>
            </div>

            {/* Standard Dialogue Box */}
            <DialogueOverlay
              variant="dialogue"
              text={displayedText}
              isTyping={isTyping}
              speakerName={currentStep.speakerName}
              speakerAlign={speakerAlign}
              locationTag={
                mode === 'investigating_location' && activeInvestigatingLoc
                  ? `[${activeInvestigatingLoc.title.toUpperCase()}]`
                  : '[2026 HOSTEL SEANCE — ROOM 4B]'
              }
              canRewind={
                (mode === 'phase1_2' && currentLineIndex > 0) ||
                (mode === 'investigating_location' && locLineIndex > 0)
              }
              onRewind={rewindDialogue}
              onAdvance={advanceDialogue}
              advanceActionText={
                mode === 'phase1_2' && currentP12Line.isClimax
                  ? 'TRIGGER CLIMAX'
                  : mode === 'investigating_location' &&
                    activeInvestigatingLoc &&
                    locLineIndex >= activeInvestigatingLoc.lines.length - 1
                  ? activeInvestigatingLoc.tier === 3 && activeInvestigatingLoc.isCorrectRoute
                    ? 'UNCOVER TRUTH'
                    : 'RETURN TO PATHS'
                  : 'CONTINUE'
              }
            />
          </>
        )
      )}

      {/* Universal "Thought Monologue" Component for Object Examinations & Observations */}
      <AnimatePresence>
        {activeMonologue && phase3Location !== 'prayer_altar' && (
          <ThoughtMonologueOverlay
            key="universal-thought-monologue"
            text={activeMonologue}
            onDismiss={() => setActiveMonologue(null)}
            hintText="[click to dismiss]"
          />
        )}
      </AnimatePresence>

      {/* Close 16:9 Strict Aspect Ratio Letterbox Stage */}
      </div>

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
              className="relative w-full max-w-lg rounded-2xl bg-[#121815]/95 border border-[#2c3d34] p-6 sm:p-8 shadow-[0_0_50px_rgba(46,66,56,0.3)] text-center text-[#c2d6cc]"
            >
              <div className="w-16 h-16 rounded-full bg-[#18221d] border border-[#2c3d34] mx-auto flex items-center justify-center mb-4 text-[#82a996] shadow-xl">
                <Key className="w-8 h-8" />
              </div>

              <span className="text-xs font-mono font-bold tracking-widest text-[#82a996] uppercase">
                INVESTIGATION MILESTONE
              </span>
              <h3
                className="text-3xl sm:text-4xl font-black text-[#c2d6cc] tracking-wider uppercase mt-1 mb-1"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
              >
                CHAPTER 1 COMPLETED
              </h3>
              <p className="text-[#82a996] font-mono text-xs mb-2 font-bold">
                INVESTIGATOR: {selectedCharacter.name.toUpperCase()} ({selectedCharacter.archetype.toUpperCase()})
              </p>

              <div className="grid grid-cols-2 gap-2 my-4 text-xs font-mono text-[#c2d6cc]">
                <div className="p-2.5 rounded-lg bg-[#18221d] border border-[#2c3d34]">
                  <div className="text-[10px] text-[#82a996]/70">STARTING COMPOSURE</div>
                  <div className="text-[#c2d6cc] font-bold text-sm">{composure}%</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#18221d] border border-[#2c3d34]">
                  <div className="text-[10px] text-[#82a996]/70">TIME ELAPSED</div>
                  <div className="text-[#c2d6cc] font-bold text-sm">
                    {Math.floor((600 - timeLeft) / 60)}m {(600 - timeLeft) % 60}s
                  </div>
                </div>
              </div>

              <p className="text-[#c2d6cc]/90 text-xs sm:text-sm font-mono mb-6 leading-relaxed">
                You navigated the multi-tier 1998 hostel corridors, recovered the Caretaker's Bribe Ledger, encountered Mama May's corpse at the chained dried well, and retrieved the Courtyard Key. Your composure will determine your mental fortitude in Chapter 2!
              </p>

              <div className="p-3.5 rounded-xl bg-[#18221d]/70 border border-[#2c3d34] flex items-center justify-center gap-3 text-[#c2d6cc] text-sm font-mono mb-6">
                <Sparkles className="w-5 h-5 text-[#6ee7b7] animate-spin" />
                <span className="font-bold">CHAPTER 2: UNDERSTANDING IS NOW UNLOCKED!</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    sound.playMenuSelect();
                    navigate('/chapters/2');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#18221d] hover:bg-[#283930] border border-[#2c3d34] hover:border-[#4d6e5e] text-[#c2d6cc] hover:text-[#6ee7b7] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
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
                  className="py-3 px-5 rounded-xl bg-[#121815] hover:bg-[#18221d] text-[#82a996] hover:text-[#c2d6cc] border border-[#2c3d34] hover:border-[#4d6e5e] font-bold uppercase tracking-wider transition-all cursor-pointer"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", fontSize: '1.15rem' }}
                >
                  CHAPTER SELECT
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8.5. Item Inspection Modal */}
      <AnimatePresence>
        {inspectingItem && ITEMS[inspectingItem] && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-[#121815]/95 border border-[#2c3d34] rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.9)] p-5 sm:p-6 text-[#c2d6cc] backdrop-blur-md"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#2c3d34]/80">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#18221d] border border-[#2c3d34] text-[#82a996]">
                    {inspectingItem === 'bobby_pin' || inspectingItem === 'small_brass_key_32' ? (
                      <Key className="w-5 h-5 text-[#82a996]" />
                    ) : inspectingItem === 'wooden_bat' ? (
                      <Hammer className="w-5 h-5 text-[#82a996]" />
                    ) : inspectingItem === 'coiled_nylon_rope' ? (
                      <Wind className="w-5 h-5 text-[#82a996]" />
                    ) : inspectingItem === 'black_beeswax_candle' || inspectingItem === 'matchbox_three_stars' ? (
                      <Flame className="w-5 h-5 text-[#82a996]" />
                    ) : inspectingItem === 'bronze_prayer_bell' ? (
                      <Bell className="w-5 h-5 text-[#82a996]" />
                    ) : (
                      <Compass className="w-5 h-5 text-[#82a996]" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#82a996] uppercase font-bold tracking-wider block">
                      INVENTORY ITEM
                    </span>
                    <h3
                      className="text-2xl font-black text-[#c2d6cc] uppercase tracking-wider"
                      style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                    >
                      {ITEMS[inspectingItem].name}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playPaperRustle();
                    setInspectingItem(null);
                  }}
                  className="p-1.5 rounded-lg bg-[#18221d] hover:bg-[#283930] border border-[#2c3d34]/60 text-[#82a996] hover:text-[#c2d6cc] cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-3">
                <div className="bg-[#18221d]/70 p-3.5 rounded-xl border border-[#2c3d34]/70">
                  <span className="text-[10px] font-mono text-[#82a996]/80 uppercase font-bold tracking-wider block mb-1">
                    ITEM DESCRIPTION
                  </span>
                  <p className="text-sm font-mono text-[#c2d6cc] leading-relaxed">
                    {ITEMS[inspectingItem].description}
                  </p>
                </div>

                {/* Utility & Practical Uses Section */}
                {ITEMS[inspectingItem].usageHint && (
                  <div className="p-3.5 rounded-xl bg-[#18221d]/50 border border-[#2c3d34]/70 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-[#82a996] uppercase">
                      <Sparkles className="w-3.5 h-3.5 text-[#6ee7b7]" />
                      <span>Utility & Practical Uses</span>
                    </div>
                    <ul className="text-xs font-mono text-[#c2d6cc] list-disc list-inside space-y-1 pl-1 leading-relaxed">
                      <li>{ITEMS[inspectingItem].usageHint}</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#2c3d34]/80 flex justify-end">
                <button
                  onClick={() => {
                    sound.playPaperRustle();
                    setInspectingItem(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#18221d] hover:bg-[#283930] border border-[#2c3d34] hover:border-[#4d6e5e] text-[#c2d6cc] hover:text-[#6ee7b7] font-bold font-mono text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all"
                >
                  CLOSE INSPECTION
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8.6. Paranormal Magnetic Compass Close-Up Modal */}
      <AnimatePresence>
        {isCompassModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#121815]/95 border border-[#2c3d34] rounded-2xl shadow-[0_0_35px_rgba(46,66,56,0.3)] overflow-hidden flex flex-col text-[#c2d6cc] backdrop-blur-md"
            >
              <div className="relative w-full h-56 bg-[#0b0f0d] overflow-hidden">
                <img
                  src={ROOM_4B_ASSETS.compassZoom}
                  alt="Magnetic Compass"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121815] via-transparent to-transparent" />
                <div className="absolute top-3 right-3 z-10">
                  <button
                    onClick={() => {
                      sound.playPaperRustle();
                      setIsCompassModalOpen(false);
                    }}
                    className="p-1.5 rounded-lg bg-[#121815]/80 border border-[#2c3d34] text-[#82a996] hover:text-[#c2d6cc] cursor-pointer shadow-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {/* Center needle indicator overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-28 h-28 rounded-full border border-[#82a996]/40 flex items-center justify-center shadow-[0_0_20px_rgba(130,169,150,0.2)]">
                    <div className="w-1 h-20 bg-gradient-to-t from-transparent via-rose-500 to-rose-400 rounded-full animate-compass-jitter shadow-[0_0_12px_rgba(244,63,94,0.9)]" />
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#82a996]" />
                  <h3
                    className="text-2xl sm:text-3xl font-black text-[#c2d6cc] uppercase tracking-wider"
                    style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                  >
                    ANTIQUE MAGNETIC COMPASS
                  </h3>
                </div>

                <p className="text-xs sm:text-sm font-mono text-[#c2d6cc]/90 leading-relaxed">
                  An antique brass directional compass with N, E, S, W markings. Its magnetic needle twitches toward paranormal anomalies.
                </p>

                <div className="p-3.5 rounded-xl bg-[#18221d]/60 border border-[#2c3d34] text-xs font-mono text-[#c2d6cc] leading-relaxed space-y-1">
                  <div className="font-bold text-[#82a996] uppercase flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-[#6ee7b7] animate-pulse" />
                    <span>PARANORMAL ATTRACTION DETECTED:</span>
                  </div>
                  <div className="text-[#c2d6cc]/90">
                    The magnetic needle twitches erratically, trembling against the curved glass and pointing with uncanny persistence directly toward the locked room door.
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      sound.playPaperRustle();
                      setIsCompassModalOpen(false);
                    }}
                    className="px-6 py-2 rounded-xl bg-[#18221d] hover:bg-[#283930] border border-[#2c3d34] hover:border-[#4d6e5e] text-[#c2d6cc] hover:text-[#6ee7b7] font-bold font-mono text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all"
                  >
                    CLOSE COMPASS VIEW
                  </button>
                </div>
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
        onRestart={handleRestartChapterOne}
        onRestartChapter={handleRestartChapterOne}
        onQuit={() => navigate('/chapters')}
      />

      {/* 11. Game Over / Temporal Displacement Collapse Modal */}
      <AnimatePresence>
        {isGameOver && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-[#140d0d] border-2 border-red-900/80 rounded-2xl shadow-[0_0_50px_rgba(185,28,28,0.4)] p-6 sm:p-8 text-center text-[#e8d5d5] flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-950/90 border border-red-800 mx-auto flex items-center justify-center mb-4 text-red-400 shadow-xl">
                <AlertTriangle className="w-8 h-8 animate-pulse" />
              </div>

              <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
                TEMPORAL DISPLACEMENT COLLAPSED
              </span>
              <h3
                className="text-3xl sm:text-4xl font-black text-red-200 tracking-wider uppercase mt-1 mb-2"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
              >
                INVESTIGATION FAILED
              </h3>

              <p className="text-[#c2a6a6] font-mono text-xs sm:text-sm mb-6 leading-relaxed">
                {timeLeft <= 0
                  ? 'The 10-minute temporal synchronization window expired. Your anchor to August 1998 dissolved into the void.'
                  : 'Your mental composure shattered under the supernatural horror and suffocating atmosphere of the hostel.'}
              </p>

              <div className="w-full flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRestartChapterOne}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-900/80 hover:bg-red-800 text-red-100 border border-red-700 hover:border-red-500 font-mono font-bold tracking-wider text-xs uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>RESTART CHAPTER</span>
                </button>

                <button
                  onClick={() => navigate('/chapters')}
                  className="py-3 px-5 rounded-xl bg-[#161212] hover:bg-[#221a1a] text-stone-400 hover:text-stone-200 border border-stone-800 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  RETURN TO TITLE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 12. Corridor Shadow Jump Scare Flash */}
      <AnimatePresence>
        {corridorShadowFlash && (
          <div className="fixed inset-0 z-50 bg-black/95 pointer-events-none flex items-center justify-center overflow-hidden">
            {/* High-contrast black shadow phantom silhouette sliding across with motion blur */}
            <motion.div
              initial={{ x: '-100%', opacity: 0, filter: 'blur(20px)' }}
              animate={{ x: '100%', opacity: 0.9, filter: 'blur(10px)' }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
              className="absolute inset-y-0 w-3/4 bg-gradient-to-r from-transparent via-black to-transparent pointer-events-none"
            />
            {/* Large distressing horror typography */}
            <div className="absolute inset-0 flex items-center justify-center text-center px-6 pointer-events-none z-40">
              <span className="font-serif tracking-widest text-red-600 font-extrabold text-xl md:text-3xl uppercase drop-shadow-[0_0_15px_rgba(255,0,0,0.8)] animate-pulse">
                SOMETHING JUST SLIPPED PAST BEHIND ME...
              </span>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 13. Chapter 1 Victory Screen */}
      <AnimatePresence>
        {chapter1VictoryActive && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-full max-w-xl bg-[#111714]/95 border border-[#26382f] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-md p-6 sm:p-8 text-center text-[#c2d6cc]"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16241d] border border-[#2b4235] text-[#86af99] text-[11px] font-mono tracking-widest uppercase mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#4d6e5e]" />
                CHAPTER 01 COMPLETED
              </div>

              <h2
                className="text-3xl sm:text-4xl font-black text-[#d1e3da] tracking-wider uppercase mb-2"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
              >
                BLIND START • COMPLETED
              </h2>

              <p className="text-sm font-mono text-[#8fa89b] max-w-md mx-auto mb-6 leading-relaxed">
                "— The flames burn cold blue... the bronze bell rings in my mind. The Guardian has awakened. —"
              </p>

              <div className="p-4 rounded-xl bg-[#151f1a]/80 border border-[#223229] text-left text-xs font-mono text-[#b4c9bf] mb-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">STATUS:</span>
                  <span className="text-[#86af99] font-bold">GUARDIAN NAT AWAKENED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">COMPOSURE MAINTAINED:</span>
                  <span className="text-[#86af99] font-bold">{composure}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">ROUTE UNLOCKED:</span>
                  <span className="text-[#86af99] font-bold">CHAPTER 02 • WHISPERS IN THE COURTYARD</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    sound.playMenuSelect();
                    navigate('/chapters');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#22352b] hover:bg-[#2d4639] border border-[#3f5c4c] text-[#d1e3da] text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-lg hover:scale-105 cursor-pointer"
                >
                  CHAPTER SELECTION →
                </button>
                <button
                  onClick={() => {
                    sound.playMenuSelect();
                    setChapter1VictoryActive(false);
                    handleRestartChapterOne();
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#151e19] hover:bg-[#1b2721] border border-[#283830] text-[#a1b8ac] text-xs font-mono tracking-wider uppercase transition-all cursor-pointer"
                >
                  REPLAY CHAPTER 1
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 14. Chapter Transition Modal (Chapter 1 -> Chapter 2) */}
      <ChapterTransitionModal
        isOpen={isChapterTransitionOpen}
        onContinueToChapterTwo={handleContinueToChapterTwo}
        onSaveAndExit={handleSaveAndExit}
      />
    </div>
  );
};
