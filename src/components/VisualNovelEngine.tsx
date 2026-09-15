import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useGameProgress } from '../context/GameProgressContext';
import { sound } from '../audioEngine';
import { MCId, MCCharacter, Room4BSubScene, Phase3Location, ActiveSaveState, ChapterProgressSave } from '../types';
import { CHARACTERS, ROOM_4B_ASSETS, PHASE_3_ASSETS, ITEMS } from '../gameData';
import { InkPortrait, getCharacterPortraitSrc } from './InkPortrait';
import { CharacterSelectModal } from './CharacterSelectModal';
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
  useGameStore,
} from '../gameStore';
import { PrologBridge } from '../services/PrologBridge';
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
import { Locker10InspectionView } from './Locker10InspectionView';
import { Locker14InteriorView } from './Locker14InteriorView';
import { PrayerAltarView } from './PrayerAltarView';
import { CaretakerOfficeView } from './CaretakerOfficeView';
import { BalconySceneView } from './BalconySceneView';
import { RadioBenchInspectionView } from './RadioBenchInspectionView';
import { DeskInspectionView } from './DeskInspectionView';
import { StairwayGateInspectionView, BalconyStairwayGateView } from './StairwayGateInspectionView';
import { HostelOuterGroundsView, OuterGroundsView } from './HostelOuterGroundsView';
import { CompoundGateInspectionView } from './CompoundGateInspectionView';
import { GarageSubterraneanView } from './GarageSubterraneanView';
import { BanyanWellheadView } from './BanyanWellheadView';
import { WellInteriorDeepView } from './WellInteriorDeepView';
import { Room101SeanceClimaxView } from './Room101SeanceClimaxView';
import { WashroomMirrorView, CrackedMirrorInspectionView } from './WashroomMirrorView';
import { SceneNavBar } from './SceneNavBar';
import { TopInventoryBar } from './TopInventoryBar';
import { InventoryDrawerModal } from './InventoryDrawerModal';
import { CaretakerLockModal, CaretakerKeypadModal } from './CaretakerKeypadModal';
import { ThoughtLine } from './common/ThoughtLine';
import { RouteCard } from './common/RouteCard';
export { ThoughtLine } from './common/ThoughtLine';
export { RouteCard } from './common/RouteCard';

export const LockerBayView = LockersOverviewView;
export const CaretakerArchiveView = CaretakerOfficeView;

export {
  Locker32ZoomView,
  Locker09ZoomView,
  Locker10InspectionView,
  Locker14InteriorView,
  LockersOverviewView,
  PrayerAltarView,
  CaretakerOfficeView,
  BalconySceneView,
  RadioBenchInspectionView,
  DeskInspectionView,
  StairwayGateInspectionView,
  BalconyStairwayGateView,
  OuterGroundsView,
  HostelOuterGroundsView,
  WashroomMirrorView,
  CrackedMirrorInspectionView,
  SceneNavBar,
  TopInventoryBar,
  InventoryDrawerModal,
  CaretakerLockModal,
  CaretakerKeypadModal,
};

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
  // PHASE 1: သရဲခေါ်ခြင်း (The Discussion)
  // ==========================================
  {
    id: 1,
    phase: 1,
    speaker: 'မေရတနာ',
    characterId: 'may_jewel',
    pos: 'left',
    text: 'ဟိုဘက်အဆောင်ဟောင်းကနေ ၁၉၉၈ တုန်းက စာအုပ်ဟောင်းတစ်ခု တွေ့ထားတယ်တဲ့။ \'ကြေးမုံ-ရေတွင်း သစ္စာဆိုခြင်း\' တဲ့။ ကစားရအောင်။',
    soundCue: 'paper',
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 2,
    phase: 1,
    speaker: 'ရဲရင့်ဟိန်း',
    characterId: 'ye_yint_hein',
    pos: 'right',
    text: '၉၀ ခုနှစ်တွေက သရဲခေါ်တမ်း ကစားနည်းလား။ စီနီယာတွေ ခြောက်ထားတာ နေမှာပါ။',
    soundCue: 'hover',
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 3,
    phase: 1,
    speaker: 'ဆုမြတ်ရှိန်',
    characterId: 'hsu_myat_shein',
    pos: 'right',
    text: 'မလုပ်တာကောင်းမယ်။ ၁၉၉၈ ဩဂုတ်လတုန်းက မမမေ ဆိုတဲ့ စီနီယာအစ်မ ဒီအဆောင်မှာ ပျောက်သွားတယ်လို့ ကြားဖူးတယ်။',
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 4,
    phase: 1,
    speaker: 'ယဉ်မင်းထိုက်',
    characterId: 'yin_min_htike',
    pos: 'left',
    text: 'ဟုတ်တယ်။ သူပျောက်သွားပြီးကတည်းက စင်္ကြံလမ်း (၃၂၆) ကို အန္တရာယ်ရှိတယ်ဆိုပြီး ပိတ်ပစ်လိုက်ကြတာ။',
    soundCue: 'paper',
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 5,
    phase: 1,
    speaker: 'မိုနာ',
    characterId: 'mona',
    pos: 'right',
    text: 'ကြောက်နေရင် ပြန်လိုရတယ်။ အမှန်တရားသိချင်ရင်တော့ ကစားကြမယ်။',
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 6,
    phase: 1,
    speaker: 'မေရတနာ',
    characterId: 'may_jewel',
    pos: 'left',
    text: 'အားလုံး ဖန်ခွက်ပေါ် လက်တင်လိုက်။ ဒီအခန်းထဲမှာ ဝိညာဉ်များ... ရှိရင် ကိုယ်ထင်ပြပါ။',
    bgImage: ROOM_4B_ASSETS.seance2026,
  },

  // ==========================================
  // PHASE 2: သရဲခေါ်ခြင်း နှင့် အရာရာ ပြောင်းလဲသွားခြင်း (The Séance)
  // ==========================================
  {
    id: 7,
    phase: 2,
    speaker: 'မိုးင်္သခ',
    characterId: 'moe_stheinkha',
    pos: 'left',
    text: 'ဟေ့... ဖယောင်းတိုင်မီး အပြာရောင်ပြောင်းသွားပြီ! ဘယ်သူမှ လက်မခွာနဲ့နော်။',
    soundCue: 'drone',
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 8,
    phase: 2,
    speaker: 'မိုနာနှင့် ဆုမြတ်ရှိန်',
    characterId: 'mona',
    pos: 'right',
    text: 'ဖန်ခွက်က သူ့ဘာသာရွေ့ပြီး မ မ မေ လို စာလုံးဖော်နေတယ်။ ငါ့လည်ပင်းကို လေအေးအေးကြီး လာမှုတ်သွားသလိုပဲ အပြင်မှာလည်း ခြေသံတွေကြားနေရတယ်။',
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 9,
    phase: 2,
    speaker: 'ရဲရင့်ဟိန်း',
    characterId: 'ye_yint_hein',
    pos: 'right',
    text: 'ဖန်ခွက်ကြီး အရမ်းရမ်းနေပြီ လက်တွေခွာလိုက်တော့',
    bgImage: ROOM_4B_ASSETS.seance2026,
  },
  {
    id: 10,
    phase: 2,
    speaker: 'မေရတနာ',
    characterId: 'may_jewel',
    pos: 'left',
    text: 'မခွာနဲ့! ဖန်ခွက်ကွဲရင် တမလွန်တံခါး ပွင့်သွားလိမ့်မယ်',
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
    affinity: string;
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
      areaCode: 'ဒေသ ၁-A',
      roman: 'I',
      title: 'အဆောင်လမ်းသွယ် ၃၂၆',
      subtitle: 'တံဆိပ်ခတ်ထားသော အနောက်စင်္ကြံ',
      desc: 'မိုးရေများ အက်နေသော မျက်နှာကျက်ပျဉ်းများကြားမှ စီးကျနေသည့် ပုပ်သိုးနေသော သစ်သားကြမ်းပြင်များ။',
      bgImage: '/assets/uni_room_chp1_bg1.jpg',
      clueId: 'missing_notice',
      clueTitle: 'ပျောက်ဆုံးကျောင်းသူ ကြော်ငြာစာ (မမမေ)',
      isCorrectRoute: true,
      timePenaltySeconds: 0,
      composureDrain: 0,
      subtleClues: {
        airflow: 'အကွာအဝေးရှိ မီးဘေးတံခါးအောက်မှ တိုက်ခတ်နေသော ပြင်းထန်သည့် အေးမြသော လေစီးကြောင်း။',
        acoustic: 'ပြင်ပမှန်တံခါးကို တိုက်ခတ်နေသော မိုးသည်းထန်စွာရွာသွန်းမှုနှင့် လေတိုက်ခတ်သံ၏ မှုန်ဝါးသော အသံ။',
        affinity: 'မြင့်မား (အပြင်ဘက် ထွက်ပြေးရာလမ်း)',
      },
      lines: [
        {
          speakerType: 'player',
          text: 'စင်္ကြံလမ်း ၃၂၆... ဒီစစင်္ကြံလမ်းထဲမှာ ရေပုပ်နံ့နဲ့ သစ်သားဟောင်းနံ့တွေ ကြီးပဲ။ မီးတွေလည်းမရှိတော့ဘူး၊ ယိမ်းထိုးနေတဲ့ ရေနံဆီမီးအိမ် အရိပ်တွေပဲ ကျန်တော့တယ်။',
          soundCue: 'paper',
        },
        {
          speakerType: 'environment',
          text: 'စင်္ကြံလမ်းတစ်လျှောက် အေးစက်လှတဲ့ လေပြင်းတွေ တိုးဝှေ့တိုက်ခတ်လာတယ်။ ငိုကြွေးနေတဲ့ ကျောင်းသူမလေးတစ်ယောက်ရဲ့ မည်းနက်တဲ့ အရိပ်ဆိုးကြီးဟာ ရုပ်သံလိုင်းပျက်နေတဲ့ သံလိုက်တိပ်ခွေလို တဖျတ်ဖျတ်နဲ့ ထင်ရှားလိုက် ပျောက်ကွယ်လိုက် ဖြစ်နေတယ်...',
          soundCue: 'drone',
          isGlitch: true,
        },
        {
          speakerType: 'player',
          text: 'အခန်း ၃၀၄ ရဲ့ တံခါးဘောင်ကို ကြည့်လိုက်စမ်း... သစ်သားပေါ်မှာ လက်သည်းနဲ့ အသည်းအသန် ကုတ်ခြစ်ထားတဲ့ အရာတွေ ကြီးပဲ။ အဲဒီဘေးမှာ ဩဂုတ်လ ၁၉၉၈ ခုနှစ်က ပျောက်ဆုံးသွားတဲ့ မမမေ ရဲ့ အကြောင်း ကြော်ငြာစာရွက်ကို စိုက်ထားတယ်...။',
          soundCue: 'select',
        },
        {
          speakerType: 'player',
          text: 'လေတွေက အောက်ထပ် ရုံးခန်းဘက်ဆီကို တိုက်နေတာပဲ... အဲဒီလမ်းကပဲ မြေညီထပ်ကို ဆင်းလို့ရတဲ့ တစ်ခုတည်းသော လမ်းထင်တယ်!"',
        },
      ],
    },
    {
      id: 'east_stairwell',
      tier: 1,
      areaCode: 'ဒေသ ၁-B',
      roman: 'II',
      title: 'အရှေ့တောင်ပံ လှေကားခင်း',
      subtitle: 'သော့ခလောက်ကြီး ခတ်ထားသော မီးဘေးထွက်ပေါက်',
      desc: 'ပြိုကျနေသော အရေးပေါ် လှေကားများကို ရစ်ပတ်ထားသည့် လေးလံသော သံခလောက်ကြီးများနှင့် သံချေးတက်နေသော သံကြိုးများ။',
      bgImage: '/assets/uni_room_chp1_bg1.jpg',
      clueId: 'curfew_log',
      clueTitle: 'အလုပ်သမား၏ ညမထွက်ရ အမိန့်စာရွက်',
      isCorrectRoute: false,
      timePenaltySeconds: 35,
      composureDrain: 8,
      subtleClues: {
        airflow: 'ငြိမ်သက်ပြီး မွန်းကြပ်နေသော လေထု။ ပြင်ပလေစီးကြောင်းနှင့် လေဝင်လေထွက် လုံးဝမရှိ။',
        acoustic: 'ရံဖန်ရံခါ ပိုက်လုံးများ တကျွီကျွီမြည်သံမှလွဲ၍ ဖိနှိပ်ခံထားရသော တိတ်ဆိတ်မှု။',
        affinity: 'နိမ့် (သေဆုံးသော လမ်းဆုံး / အတွင်းထောင်ချောက်)',
      },
      lines: [
        {
          speakerType: 'player',
          text: 'အရှေ့ဘက်လှေကားပဲ ငါကောင်းကောင်းအသက်ရှုလို့ မရတော့ဘူး။ သံချေးနံ့နဲ့ ရေနံဆီဟောင်းနံ့တွေကြီးပဲ။',
        },
        {
          speakerType: 'environment',
          text: 'ဒေါင်! လုံခြုံရေးတံခါးမှာ ချည်ထားတဲ့ သော့ခလောက်ကြီး တုန်ခါမြည်ဟည်းသွားတယ်။ ကွန်ကရစ်လှေကားထစ်တွေပေါ်မှာ သဘာဝမကျတဲ့ အရိပ်မည်းကြီး ရှည်လျားစွာ ကျရောက်လာပြီး ကျောချမ်းဖွယ် ကြောက်ရွံ့မှုလှိုင်းကြီး တစ်ကိုယ်လုံးကို ဖြတ်စီးသွားတယ်...',
          soundCue: 'drone',
          isGlitch: true,
        },
        {
          speakerType: 'player',
          text: 'တံခါးအပြင်ကနေ သော့ခတ်ထားတယ်! ဇကာမှာ ၁၉၉၈ ဩဂုတ်လက ညမထွက်ရ လို့အစောင့်ရေးထားတယ်... သူ ညသန်းခေါင် မတိုင်ခင် ဒီဘက်အဆောင်ကို ခတ်သွားခဲ့တာပဲ! ဒီလမ်းတော့ သွားလို့မရတော့ဘူး။',
          soundCue: 'paper',
        },
        {
          speakerType: 'player',
          text: 'အချိန်တွေ အလကား ကုန်သွားပြီ... ရင်တွေလည်း တော်တော်ခုန်နေပြီ။ မြန်မြန်အနောက်ပြန်ပြီး သော့မခတ်ထားတဲ့ လမ်းကို မြန်မြန် ရှာရမယ်!"',
        },
      ],
    },
    {
      id: 'communal_washroom',
      tier: 1,
      areaCode: 'ဒေသ ၁-C',
      roman: 'III',
      title: 'ဘုံရေချိုးခန်း',
      subtitle: 'ကွဲအက်နေသော မှန်စင်များ',
      desc: 'မြူခိုးကပ်နေသော မှန်ကွဲစများနှင့် အိုးမဲရေနံ့နံနေသော သံချေးတက်ပိုက်များမှ စီးကျနေသည့် ရေများ။',
      bgImage: '/assets/main_menu.jpg',
      clueId: 'jasmine_hairpin',
      clueTitle: 'သွေးစွန်းနေသော စံပယ်ပန်းဆံထိုး',
      isCorrectRoute: false,
      timePenaltySeconds: 45,
      composureDrain: 10,
      subtleClues: {
        airflow: 'ကြမ်းပြင်ရေမြောင်းများမှ တက်လာသော စိုစွတ်အေးမြမှု။ လေစီးကြောင်း မရှိ။',
        acoustic: 'သံချေးရောင်ရေ ပုတ်ခုံမှ မမှန်မကန် ယိုစိမ့်ကျဆင်းသံ။',
        affinity: 'နိမ့် (သေဆုံးသော လမ်းဆုံး / အတွင်းထောင်ချောက်)',
      },
      lines: [
        {
          speakerType: 'player',
          text: 'အများသုံးရေချိုးခန်း… မှန်တွေက အစိတ်စိတ်အမြွှာမြွှာ ကွဲနေတာပဲ…',
        },
        {
          speakerType: 'environment',
          text: 'ကွဲအက်နေတဲ့ မှန်အပိုင်းအစတွေထဲမှာ မင်းရဲ့ပုံရိပ်တစ်ခုတည်း မဟုတ်တော့ဘူး— သွေးစွန်းနေတဲ့ လုံချည်ဝတ်ထားပြီး မျက်နှာဖျော့တော့ကာ ငိုကြွေးနေတဲ့ မိန်းကလေးတစ်ယောက် မင်းနောက်တည့်တည့်မှာ ရပ်နေတယ်၊ သူမရဲ့လည်ပင်းမှာလည်း မည်းနက်တဲ့ ညိုမည်းဒဏ်ရာကြီးတွေ ထင်းနေတယ်!',
          soundCue: 'drone',
          isGlitch: true,
        },
        {
          speakerType: 'player',
          text: 'အာ့! သူ… သူပျောက်သွားပြီ!ဟိုမှာ… ရေမြောင်းထဲက သွေးစွန်းနေတဲ့ စံပယ်ပန်းဆံထိုး! မမမေရဲ့ ပစ္စည်းပဲ။',
          soundCue: 'select',
        },
        {
          speakerType: 'player',
          text: 'ဒီမှာ တစ်ယောက်ယောက်နဲ့ ရုန်းရင်းဆန်ခတ်ဖြစ်ခဲ့တာပဲ။ထွက်ပေါက်လည်း မရှိဘူး… ဒီကနေ အမြန်ထွက်မှဖြစ်မယ်!',
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
      areaCode: 'ဒေသ ၂-A',
      roman: 'I',
      title: "အလုပ်သမား မှတ်တမ်းခန်း",
      subtitle: 'စီမံခန့်ခွဲရေး အခန်းများ',
      desc: 'စိုစွတ်သော မြေကြီးနံ့၊ ဖယောင်းတိုင်နံ့နှင့် ဝှက်ထားသော မှတ်တမ်းစာအုပ်များနံ့ ရှိနေပြီး မှောက်လှန်ထားသော စာကြည့်စားပွဲ။',
      bgImage: '/assets/main_menu.jpg',
      clueId: 'bribe_ledger',
      clueTitle: 'ကျပ် ၅၀၀၀ ရေတွင်း လာဘ်ငွေ မှတ်တမ်း',
      isCorrectRoute: true,
      timePenaltySeconds: 0,
      composureDrain: 0,
      subtleClues: {
        airflow: 'နောက်ဖေး သစ်သား ထွက်ပေါက်တံခါးအောက်မှ စိမ့်ဝင်နေသော မိုးရေနှင့် အေးမြသော ညလေစီးကြောင်း။',
        acoustic: 'ပြင်ပဝင်းတွင် တချွင်ချွင် မြည်နေသော သံသော့များနှင့် ပြင်းထန်စွာ လေတိုက်ခတ် တိုးသံများ။',
        affinity: 'မြင့်မား (အပြင်ဘက် ထွက်ပြေးရာလမ်း)',
      },
      lines: [
        {
          speakerType: 'player',
          text: 'အဆောင်မှူးရုံး…အခန်းထဲက ပစ္စည်းတွေ အကုန်ရှုပ်ပွနေတယ်… ကျောင်းသားမှတ်တမ်းတွေလည်း ကြမ်းပြင်ပေါ် ပြန့်ကျဲနေတယ်။',
          soundCue: 'paper',
        },
        {
          speakerType: 'environment',
          text: 'ဒေါက်... ဒေါက်... တိတ်ဆိတ်မှောင်မည်းနေတဲ့ ထောင့်စွန်းက လက်နှိပ်စက်အဟောင်းကြီးဟာ သူ့အလိုလို စာရိုက်လာတယ်: "ကျပ် ၅,၀၀၀ ဖြင့် ရေတွင်းအောက်တွင် အပြီးတိုင် ပိတ်လှောင်ခဲ့သည်"...',
          soundCue: 'hover',
          isGlitch: true,
        },
        {
          speakerType: 'player',
          text: 'ဟော… သံသေတ္တာထဲမှာ ၁၉၉၈၊ ဩဂုတ် ၁၄ ရက်နေ့က ငွေလက်ခံဖြတ်ပိုင်း!၅,၀၀၀ လာဘ်ပေးပြီး ခြံဝင်းထဲက ရေတွင်းကို ဘိလပ်မြေနဲ့ ပိတ်ခိုင်းထားတာပဲ…',
          soundCue: 'select',
        },
        {
          speakerType: 'player',
          text: 'နောက်တံခါးက ရေတွင်းရှိတဲ့ ခြံဝင်းကို တန်းရောက်တယ်။ဟာ… လေတိုက်ပြီး တံခါးပွင့်လာပြီ!',
        },
      ],
    },
    {
      id: 'disused_study',
      tier: 2,
      areaCode: 'ဒေသ ၂-B',
      roman: 'II',
      title: 'အသုံးမပြုတော့သော စာသင်ခန်းမ',
      subtitle: 'မှောက်လှန်ထားသော ကျောင်းသားခုံများ',
      desc: 'သံတန်းရိုက်ထားသော သတ္တုပြတင်းပေါက်များအောက်ရှိ မြေဖြူမှုန့်များနှင့် ပုပ်နေသော သစ်သားခုံများ။',
      bgImage: '/assets/uni_room_chp1_bg1.jpg',
      clueId: 'study_notes',
      clueTitle: 'နတ်ချည်နှောင်မှု ပုံပြမှတ်စုများ',
      isCorrectRoute: false,
      timePenaltySeconds: 35,
      composureDrain: 7,
      subtleClues: {
        airflow: 'အနံ့ဟောင်းသော ခြောက်သွေ့ မြေဖြူမှုန့်။ ပြတင်းပေါက်အားလုံးကို သွပ်ပြားတန်းများဖြင့် ပိတ်ထားသည်။',
        acoustic: 'သတ္တုပြားများကို တိုက်ခတ်သော လေတိုးသံ မှိန်မှိန်မှလွဲ၍ တိတ်ဆိတ်ငြိမ်သက်နေသည်။',
        affinity: 'နိမ့် (သေဆုံးသော လမ်းဆုံး / အတွင်းထောင်ချောက်)',
      },
      lines: [
        {
          speakerType: 'player',
          text: 'စာကြည့်ခန်းဟောင်း…ခုံတွေအကုန်လဲကျပြီး မှိုတွေနဲ့ ဖုံးနေတယ်။ ပြတင်းပေါက်တွေလည်း သံတိုင်တွေနဲ့ ပိတ်ထားတယ်…',
        },
        {
          speakerType: 'environment',
          text: 'ကျွီ! မြေဖြူခဲတစ်ချောင်းဟာ ကျောက်သင်ပုန်းပေါ်မှာ သူ့အလိုလို ရွေ့လျားသွားပြီး သွေးနီရောင် သင်္ကေတတွေနဲ့ ရှေးဟောင်း မြန်မာ့နတ်ပူဇော်ရာ စင်ပုံစံကို အလျင်အမြန် ဆွဲခြစ်ပြနေတယ်...',
          soundCue: 'drone',
          isGlitch: true,
        },
        {
          speakerType: 'player',
          text: 'ဒါ မမေ့ရဲ့ နတ်စောင့်တွေအကြောင်း မှတ်စုတွေပဲ…"နတ်က လူသေကို မကာကွယ်ဘူး… ကျိန်စာကို ကျောက်တုံးတွေထဲမှာ ချည်နှောင်ထားတာ…"',
          soundCue: 'paper',
        },
        {
          speakerType: 'player',
          text: 'တံခါးတွေအကုန် သော့ခတ်ထားတယ်။ ဒီကနေ ထွက်လို့မရဘူး!',
        },
      ],
    },
    {
      id: 'boiler_hatch',
      tier: 2,
      areaCode: 'ဒေသ ၂-C',
      roman: 'III',
      title: 'မြေအောက်ခန်း ရေနွေးကန် တံခါးခုံ',
      subtitle: 'ရေလွှမ်းနေသော အောက်ထပ် မြောင်း',
      desc: 'မည်းနက်သော ဆီနက်ရည်များ ယိုစိမ့်ပြီး စိုစွတ်သော ဘိလပ်မြေနံ့ ရှိနေသည့် လေးလံသော သံတံခါးခုံ။',
      bgImage: '/assets/uni_room_chp1_bg1.jpg',
      clueId: 'boiler_concrete',
      clueTitle: 'အုတ်စီခြစ်နှင့် အမြန်ခြောက် ဘိလပ်မြေ',
      isCorrectRoute: false,
      timePenaltySeconds: 40,
      composureDrain: 10,
      subtleClues: {
        airflow: 'နွေးထွေးသော ရေနံငွေ့များနှင့် အနံ့ဆိုးသော မြေအောက်စိုထိုင်းမှု။',
        acoustic: 'ရေအောက်နစ်မြုပ်နေသော ပိုက်များကို ရိုက်ခတ်နေသည့် ရေဆူပွက်သံ။',
        affinity: 'နိမ့် (သေဆုံးသော လမ်းဆုံး / အတွင်းထောင်ချောက်)',
      },
      lines: [
        {
          speakerType: 'player',
          text: 'မြေအောက်ခန်းဆင်းတဲ့ အပေါက်... တံခါးအဖုံးက နည်းနည်းဟနေပြီး ဆီညစ်နံ့ထွက်နေတဲ့ ရေမည်းတွေ စင်္ကြံလမ်းထဲ စီးဝင်နေတယ်။',
        },
        {
          speakerType: 'environment',
          text: 'ဂလွိုက်... ရေနွေးငွေ့ပိုက်တွေကြားကနေ ပွက်ပွက်ဆူနေတဲ့ အဆီပြန်ရေတွေ ပိုမိုစီးထွက်လာပြီး အမှောင်ထုထဲကနေ တစ္ဆေတစ်ကောင်ရဲ့ အသက်ရှူသံလို ညည်းညူသံကြီး ထွက်ပေါ်လာတယ်...',
          soundCue: 'drone',
          isGlitch: true,
        },
        {
          speakerType: 'player',
          text: 'ဟာ! ဘာကြီးလဲ?!ဘေးမှာ ဘိလပ်မြေအိတ်အဟောင်းနဲ့ သံချေးတက်နေတဲ့ ပန်းရန်သမားတံတောင်… ၁၉၉၈ ခုနှစ်ကပဲ!',
          soundCue: 'select',
        },
        {
          speakerType: 'player',
          text: 'အောက်က ရေပြည့်နေတာ… အန္တရာယ်များတယ်။ အမြန်နောက်ဆုတ်ရမယ်!',
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
      areaCode: 'ဒေသ ၃-A',
      roman: 'I',
      title: 'ဝင်းရှိ နတ်ကွန်း',
      subtitle: 'သံကြိုးချည်ထားသော ရေခန်းခြောက်အင်း',
      desc: 'မုတ်သုံမိုးကြီးထဲတွင် သံကြိုးချည်ထားသော အုတ်ရေတွင်းအပေါ်မှ ထီးထီးမြင့်နေသော ရှေးဟောင်း ညောင်ပင်ကြီး။',
      bgImage: '/assets/uni_room_chp1_bg1.jpg',
      clueId: 'well_key',
      clueTitle: 'ဝင်းရှိ ရေတွင်းဟောင်း ကြေးသော့',
      isCorrectRoute: true,
      timePenaltySeconds: 0,
      composureDrain: 0,
      subtleClues: {
        airflow: 'ကောင်းကင်တစ်ခွင်တွင် မိုးသည်းထန်စွာ ရွာသွန်းစေနေသော ပြင်းထန်သည့် မုတ်သုံလေမုန်တိုင်း။',
        acoustic: 'ပြင်းထန်သော မိုးသက်ရွာ၏ မိုးကြိုးသံနှင့် ရေတွင်းသံကြိုးများမှ နက်ရှိုင်းသော သတ္တုတုန်ခါသံများ။',
        affinity: 'အဓိက (သဘာဝလွန် ကျိန်စာ၏ အရင်းအမြစ်)',
      },
      lines: [
        {
          speakerType: 'player',
          text: 'ခြံဝင်း…မိုးတွေသည်းထန်နေတယ်… အလယ်မှာ သံချေးတက်သံကြိုးတွေနဲ့ ဆူးကြိုးတွေ ပတ်ထားတဲ့ ရေတွင်းဟောင်းကြီးရှိတယ်။',
          soundCue: 'drone',
        },
        {
          speakerType: 'environment',
          text: 'မြင့်မြတ်တဲ့ ညောင်ပင်ကြီးအောက်မှာ ကျောက်သားနတ်စောင့်ရုပ်တုဟာ အေးစက်တောင့်တင်းစွာ တရားထိုင်နေတယ်။ ရုတ်တရက် ရေတွင်းကြီးရဲ့ အထက်မှာ ထိတ်လန့်တုန်လှုပ်ဖွယ်ရာ ကောင်းလောက်အောင် တဆတ်ဆတ်တုန်ခါနေတဲ့ မမမေရဲ့ အလောင်းကောင်ကြီးဟာ ပြိုးပြိုးပြက်ပြက်နဲ့ ပေါ်ထွက်လာတယ်!',
          soundCue: 'drone',
          isGlitch: true,
        },
        {
          speakerType: 'mama_may',
          text: '၁၉၉၈ ဩဂုတ်မှာ သူတို့က ငါ့ကို အသက်ရှင်လျက် ဒီရေတွင်းထဲ ပစ်ချပြီး ဘိလပ်မြေနဲ့ ဖုံးပိတ်ခဲ့တာ…ဒါပေမဲ့ အခု အဖုံးက အက်လာပြီ… လူသတ်သမားကတော့ အပြင်မှာ လွတ်လွတ်လပ်လပ် ရှိနေတုန်းပဲ။',
          soundCue: 'drone',
        },
        {
          speakerType: 'player',
          text: 'မမမေအလောင်းကို ဒီရေတွင်းထဲမှာပဲ ပိတ်ထားတာ… သူ့ဝိညာဉ်ကို ချည်နှောင်ဖို့ နတ်စောင့်ကိုပါ ဒီမှာထားခဲ့တယ်။ဒီအဆောင်တစ်ခုလုံး ကျိန်စာသင့်နေပြီ!',
        },
        {
          speakerType: 'mama_may',
          text: 'အသက်ရှင်လွတ်မြောက်ချင်ရင် ဒီကြေးဝါသော့ကိုယူ။ အခန်း ၂ မှာ နတ်ရဲ့ အရပ်လေးမျက်နှာကို ဖော်ထုတ်ပြီး ရေတွင်းကို ဖွင့်ရမယ်။',
          soundCue: 'select',
        },
        {
          speakerType: 'player',
          text: 'နားလည်ပြီ… ဒီ ၁၉၉၈ ခုနှစ်ရဲ့ အချိန်ပဲ့တင်သံထဲက လွတ်ပြီး အမှန်တရားအကုန် ဖော်ထုတ်ရမယ်… မဟုတ်ရင် ဒီအရာက ငါ့ဝိညာဉ်ကို သိမ်းသွားလိမ့်မယ်!',
        },
      ],
    },
    {
      id: 'bicycle_shed',
      tier: 3,
      areaCode: 'ဒေသ ၃-B',
      roman: 'II',
      title: 'ချုံနွယ်ပိတ်ပေါက်နေသော စက်ဘီးတဲ',
      subtitle: 'သံချေးတက် ဘောင်များနှင့် ချုံဆူးများ',
      desc: 'ရှုပ်ထွေးသော ဆူးချုံများအပေါ်မှ ပြင်းထန်စွာ ခေါက်ခတ်မြည်နေသော သွပ်ပြားမိုး။',
      bgImage: '/assets/main_menu.jpg',
      clueId: 'curfew_log',
      clueTitle: 'ကျိုးနေသော ၁၉၉၈ စက်ဘီးသော့',
      isCorrectRoute: false,
      timePenaltySeconds: 30,
      composureDrain: 6,
      subtleClues: {
        airflow: 'သံချေးတက်နေသော သွပ်ပြားမိုးအောက်မှ ဘေးတိုက်တိုက်ခတ်နေသော မိုးရေ။',
        acoustic: 'သွပ်ပြားများကို ရိုက်ခတ်နေသော နားပင်းလောက်သည့် မိုးစက်သံ။',
        affinity: 'နိမ့် (သေဆုံးသော လမ်းဆုံး / အတွင်းထောင်ချောက်)',
      },
      lines: [
        {
          speakerType: 'player',
          text: 'ခြံထောင့်က စက်ဘီးရုံ…၉၀ ခုနှစ်က စက်ဘီးအဟောင်းတွေနဲ့ ဆူးတွေ ပိတ်နေတယ်။ ဒီဘက်ကလည်း လမ်းမရှိဘူး!',
        },
        {
          speakerType: 'environment',
          text: 'ကျွီ... ကျွီ... သံချေးတက်နေတဲ့ ရှေးဟောင်းစက်ဘီးရဲ့ နင်းတံဟာ သူ့အလိုလို အပြင်းအထန် စတင်လည်ပတ်လာပြီး ရွှံ့ညွန်နဲ့ ရေစက်တွေကို ပတ်ပတ်လည် လွင့်စင်သွားစေတယ်!',
          soundCue: 'drone',
          isGlitch: true,
        },
        {
          speakerType: 'player',
          text: 'စက်ဘီးအဟောင်းတွေနဲ့ ဆူးတွေ ပိတ်နေတယ်။ ဒီဘက်ကလည်း လမ်းမရှိဘူး!',
        },
        {
          speakerType: 'player',
          text: 'အလယ်က ရေတွင်းကပဲ ထူးဆန်းတဲ့စွမ်းအင် ထွက်နေတယ်… ဒါ ငါ့ရဲ့ တစ်ခုတည်းသောလမ်းပဲ။',
        },
      ],
    },
    {
      id: 'front_gate',
      tier: 3,
      areaCode: 'ဒေသ ၃-C',
      roman: 'III',
      title: 'အဆောင် နယ်နိမိတ် တံခါး',
      subtitle: 'သံဆူးပါသော မြို့နယ် တံခါးစင်',
      desc: 'သံကြိုးများနှင့် ခဲတံဆိပ်ထိုးထားသော မြို့နယ် တံဆိပ်ဖြင့် ရစ်ပတ်ထားသည့် မြင့်မားသော သွန်းသံတံခါးကြီးများ။',
      bgImage: '/assets/uni_room_chp1_bg1.jpg',
      clueId: 'missing_notice',
      clueTitle: '၁၉၉၈ ရဲ ကာရံထားသော သံကြိုး',
      isCorrectRoute: false,
      timePenaltySeconds: 35,
      composureDrain: 8,
      subtleClues: {
        airflow: 'ကြီးမားသော သံတံခါးစင်ကို ဖိညှစ်နေသည့် ပြင်းထန်သော လေ။',
        acoustic: 'သံဆူးများကို တုန်ခါစေနေသည့် မိုးကြိုးပစ်သံများ။',
        affinity: 'နိမ့် (သေဆုံးသော လမ်းဆုံး / အတွင်းထောင်ချောက်)',
      },
      lines: [
        {
          speakerType: 'player',
          text: 'အဆောင်ရှေ့တံခါး…မိုးရေထဲမှာ အမြင့်ကြီးတဲ့ သံချွန်တံခါးကြီးက ကြောက်စရာကောင်းအောင် ရှိနေတယ်…',
        },
        {
          speakerType: 'environment',
          text: 'သံတိုင်တွေရဲ့ ကြားကနေ ၁၉၉၈ ခုနှစ်ရဲ့ မှောင်မိုက်နေတဲ့ လမ်းမတွေကို မြင်နေရတယ်... ထီးနက်ကြီးဆောင်းထားတဲ့ မည်းနက်တဲ့ လူရိပ်ဆိုးတစ်ခုဟာ မိုးသည်းထန်စွာရွာနေတဲ့ကြားမှာ မလှုပ်မယှက် ရပ်နေရင်း မင်းကို စိုက်ကြည့်နေတယ်၊ ပြီးတော့မှ လေထဲမှာ တဖြည်းဖြည်း ပျောက်ကွယ်သွားတယ်!',
          soundCue: 'drone',
          isGlitch: true,
        },
        {
          speakerType: 'player',
          text: 'သံတံခါးကို သံကြိုးသုံးထပ်နဲ့ အပြင်က သော့ခတ်ထားတယ်။ ဒီကနေ ထွက်လို့မရဘူး!',
        },
        {
          speakerType: 'player',
          text: 'ထူးဆန်းတဲ့စွမ်းအင်က ညောင်ပင်နားက ရေတွင်းကနေ ထွက်နေတာ… ငါသွားရမယ့်နေရာက အဲဒီမှာပဲ!',
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
    desk4bLooted,
    setDesk4bLooted,
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
    mayResolved,
    setMayResolved,
    key14OnFloor,
    setKey14OnFloor,
    key14Collected,
    setKey14Collected,
    locker14Unlocked,
    setLocker14Unlocked,
    stairwayGateKeyTaken,
    setStairwayGateKeyTaken,
    stairwayGateUnlocked,
    setStairwayGateUnlocked,
    chapter2Completed,
    chapter3Unlocked,
    setChapter3Unlocked,
    chapter3Completed,
    setChapter3Completed,
    garageDrained,
    setGarageDrained,
    removeItem,
    advanceToChapter,
    removeInventoryItem,
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
  const [roomBanner, setRoomBanner] = useState<{ text: string; type: 'info' | 'success' | 'warn' | 'warning' } | null>(null);
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
  const [hasCaretakerCandles, setHasCaretakerCandles] = useState<boolean>(false);
  const [caretakerDoorUnlocked, setCaretakerDoorUnlocked] = useState<boolean>(false);
  const [altarCandlesPlaced, setAltarCandlesPlaced] = useState<number>(0);
  const [altarBellPlaced, setAltarBellPlaced] = useState<boolean>(false);
  const [natSummoned, setNatSummoned] = useState<boolean>(false);
  const [hasConsultedNat, setHasConsultedNat] = useState<boolean>(false);
  const [askedNatTopics, setAskedNatTopics] = useState<string[]>([]);
  const [corridorShadowScareTriggered, setCorridorShadowScareTriggered] = useState<boolean>(false);
  const [chapter1Completed, setChapter1Completed] = useState<boolean>(false);
  const [keypadInput, setKeypadInput] = useState<string>('');
  const [spectralClimaxActive, setSpectralClimaxActive] = useState<boolean>(false);
  const [altarCandlesLit, setAltarCandlesLit] = useState<boolean>(false);
  const [chapter1VictoryActive, setChapter1VictoryActive] = useState<boolean>(false);
  const [corridorShadowFlash, setCorridorShadowFlash] = useState<boolean>(false);
  const [currentChapter, setCurrentChapter] = useState<number>(initialChapter || 1);
  const [isChapterTransitionOpen, setIsChapterTransitionOpen] = useState<boolean>(false);
  const [isChapter3TransitionOpen, setIsChapter3TransitionOpen] = useState<boolean>(false);
  const [isInventoryDrawerOpen, setIsInventoryDrawerOpen] = useState<boolean>(false);
  const [isNatDialogueActive, setIsNatDialogueActive] = useState<boolean>(false);
  const [natAudienceConcluded, setNatAudienceConcluded] = useState<boolean>(false);
  const [radioHasBatteries, setRadioHasBatteries] = useState<boolean>(false);
  const [radioTuned, setRadioTuned] = useState<boolean>(false);
  const [caretakerLockFailCount, setCaretakerLockFailCount] = useState<number>(() => {
    try {
      const act = loadActiveGameProgress();
      if (typeof act?.caretakerLockFailCount === 'number') {
        return act.caretakerLockFailCount;
      }
    } catch {}
    return 0;
  });

  // 10-Minute Timer & Composure State
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    try {
      const act = loadActiveGameProgress();
      if (typeof act?.timerSeconds === 'number' && act.timerSeconds > 0) {
        return act.timerSeconds;
      }
      const prog = JSON.parse(localStorage.getItem('spirits_labyrinth_progress_v1') || '{}');
      if (typeof prog.timerSeconds === 'number' && prog.timerSeconds > 0) {
        return prog.timerSeconds;
      }
    } catch {}
    return 600;
  });
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

  useEffect(() => {
    if (phase3Location === 'seance_climax_flashback') {
      const timer = setTimeout(() => {
        try {
          sound.playPhaseComplete();
        } catch {}
        setIsChapter3TransitionOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [phase3Location]);

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
  // Ensure the timer only suspends when isPaused is true or outside gameplay:
  useEffect(() => {
    if (isPaused || currentScreen !== 'gameplay' || timerSeconds <= 0 || isChapterTransitionOpen || isChapter3TransitionOpen || isChapterFinished) return;

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
  }, [isPaused, currentScreen, timerSeconds, isChapterTransitionOpen, isChapter3TransitionOpen, isChapterFinished]);

  // Ambient Composure Attrition Hook
  // Base rate: 1% per 18s (accelerated to 8s during Nat dialogue), scaled by active investigator tensionMultiplier
  // Continues ticking while player checks case notes or inventory; halts when system is paused (isPaused)
  useEffect(() => {
    if (isPaused || currentScreen !== 'gameplay' || composure <= 0 || isChapterTransitionOpen || isChapter3TransitionOpen || isChapterFinished) return;

    const basePeriodMs = isNatDialogueActive ? 8000 : 18000;
    const tension = selectedCharacter.tensionMultiplier || 1.0;
    const decayIntervalMs = Math.max(500, Math.round(basePeriodMs / tension));

    const composureInterval = setInterval(() => {
      setComposure((prev) => Math.max(0, prev - 1));
    }, decayIntervalMs);

    return () => clearInterval(composureInterval);
  }, [isPaused, currentScreen, composure, isNatDialogueActive, selectedCharacter.tensionMultiplier, isChapterTransitionOpen, isChapter3TransitionOpen, isChapterFinished]);

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
    if (
      initialChapter === 2 ||
      initialChapter === 3 ||
      (!initialChapter && activeSave && (activeSave.chapter === 2 || activeSave.chapter === 3) && activeSave.chapter1Completed)
    ) {
      if (activeSave?.selectedCharacterId) {
        const char = CHARACTERS.find((c) => c.id === activeSave.selectedCharacterId);
        if (char) setSelectedCharacter(char);
      }
      if (typeof activeSave?.composure === 'number') {
        setComposure(activeSave.composure);
      } else {
        try {
          const prog = JSON.parse(localStorage.getItem('spirits_labyrinth_progress_v1') || '{}');
          if (typeof prog.composure === 'number') {
            setComposure(prog.composure);
          }
        } catch {}
      }
      if (typeof activeSave?.timerSeconds === 'number' && activeSave.timerSeconds > 0) {
        setTimeLeft(activeSave.timerSeconds);
      } else {
        try {
          const prog = JSON.parse(localStorage.getItem('spirits_labyrinth_progress_v1') || '{}');
          if (typeof prog.timerSeconds === 'number' && prog.timerSeconds > 0) {
            setTimeLeft(prog.timerSeconds);
          }
        } catch {}
      }
      const isCh3 = activeSave?.chapter === 3 || initialChapter === 3 || Boolean(activeSave?.chapter3Unlocked);
      setCurrentChapter(isCh3 ? 3 : 2);
      setPhase(isCh3 ? 3 : 2);
      const targetPhase3Loc = isCh3
        ? (activeSave?.chapter === 3 && activeSave?.phase3Location && activeSave.phase3Location !== 'east_fork'
            ? activeSave.phase3Location
            : 'hostel_outer_grounds')
        : (activeSave?.phase3Location || 'east_fork');
      setPhase3Location(targetPhase3Loc);
      setCurrentScene(isCh3 ? 'hostel_outer_grounds_main' : 'pathway_326_main');
      setCurrentSubScene(null);
      setMode('phase3');
      setChapter1Completed(true);
      setCaretakerDoorUnlocked(true);
      if (isCh3) {
        setChapter3Unlocked(true);
        setStairwayGateUnlocked(true);
        setStairwayGateKeyTaken(true);
        setLocker14Unlocked(true);
        setMayResolved(true);
      }
      // CRITICAL FIX: Trust activeSave fields — never force-set ritual item counts
      if (typeof activeSave?.hasBlackCandlesCount === 'number') setHasBlackCandlesCount(activeSave.hasBlackCandlesCount);
      if (typeof activeSave?.hasMatchesCount === 'number') setHasMatchesCount(activeSave.hasMatchesCount);
      setHasBronzeBell(Boolean(activeSave?.hasBronzeBell));
      setHasReadLocker32Note(Boolean(activeSave?.hasReadLocker32Note));
      setHasReadSandarLetters(Boolean(activeSave?.hasReadSandarLetters));
      setHasCaretakerCandles(Boolean(activeSave?.hasCaretakerCandles));
      if (typeof activeSave?.altarCandlesPlaced === 'number') setAltarCandlesPlaced(activeSave.altarCandlesPlaced);
      // Only restore radio state if batteries were actually inserted and not still in inventory
      const invHasBatteries = (activeSave?.inventory || []).includes('battery_pair');
      const hasBatteries = Boolean(activeSave?.radioHasBatteries) && !invHasBatteries;
      setRadioHasBatteries(hasBatteries);
      setRadioTuned(hasBatteries && Boolean(activeSave?.radioTuned));
      setMayResolved(isCh3 ? true : Boolean(activeSave?.mayResolved));
      setKey14OnFloor(isCh3 ? false : Boolean(activeSave?.key14OnFloor));
      setKey14Collected(isCh3 ? true : Boolean(activeSave?.key14Collected));
      setLocker14Unlocked(isCh3 ? true : Boolean(activeSave?.locker14Unlocked));
      setStairwayGateKeyTaken(isCh3 ? true : Boolean(activeSave?.stairwayGateKeyTaken));
      setDiscoveredClues(Array.isArray(activeSave?.discoveredClues) ? activeSave.discoveredClues : []);
      setAskedNatTopics(Array.isArray(activeSave?.askedNatTopics) ? activeSave.askedNatTopics : []);
      setDesk4bLooted(Boolean(activeSave?.desk4bLooted));
      if (typeof activeSave?.caretakerLockFailCount === 'number') setCaretakerLockFailCount(activeSave.caretakerLockFailCount);
      const isGarageDrained = Boolean(activeSave?.garageDrained);
      setGarageDrained(isGarageDrained);
      useGameStore.setState({ garageDrained: isGarageDrained });
      // CRITICAL FIX: Trust the saved inventory exactly — no phantom item fallback
      if (Array.isArray(activeSave?.inventory)) {
        setInventory(activeSave.inventory);
        PrologBridge.setInventory(activeSave.inventory);
      }
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
      setDesk4bLooted(Boolean(save.desk4bLooted));
      setDoorUnlocked(Boolean(save.doorUnlocked));
      if (typeof save.hasBlackCandlesCount === 'number') setHasBlackCandlesCount(save.hasBlackCandlesCount);
      if (typeof save.hasMatchesCount === 'number') setHasMatchesCount(save.hasMatchesCount);
      setHasBronzeBell(Boolean(save.hasBronzeBell));
      setHasReadLocker32Note(Boolean(save.hasReadLocker32Note));
      setHasReadSandarLetters(Boolean(save.hasReadSandarLetters));
      setHasLocker09Candle(Boolean(save.hasLocker09Candle || (typeof save.hasBlackCandlesCount === 'number' && save.hasBlackCandlesCount > 0)));
      setHasLocker09Matchbox(Boolean(save.hasLocker09Matchbox || (typeof save.hasMatchesCount === 'number' && save.hasMatchesCount > 0)));
      setHasCaretakerCandles(Boolean(save.hasCaretakerCandles));
      setCaretakerDoorUnlocked(Boolean(save.caretakerDoorUnlocked));
      if (typeof save.altarCandlesPlaced === 'number') setAltarCandlesPlaced(save.altarCandlesPlaced);
      setAltarBellPlaced(Boolean(save.altarBellPlaced));
      setNatSummoned(Boolean(save.natSummoned));
      setHasConsultedNat(Boolean(save.hasConsultedNat));
      if (Array.isArray(save.askedNatTopics)) setAskedNatTopics(save.askedNatTopics);
      setCorridorShadowScareTriggered(Boolean(save.corridorShadowScareTriggered));
      setChapter1Completed(Boolean(save.chapter1Completed));
      setNatAudienceConcluded(Boolean(save.natAudienceConcluded));
      setRadioHasBatteries(false);
      setRadioTuned(false);
      setMayResolved(Boolean(save.mayResolved));
      setKey14OnFloor(Boolean(save.key14OnFloor));
      setKey14Collected(Boolean(save.key14Collected));
      setLocker14Unlocked(Boolean(save.locker14Unlocked));
      setStairwayGateKeyTaken(Boolean(save.stairwayGateKeyTaken));
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
    if (isChapterFinished || isGameOver || isChapterTransitionOpen || isChapter3TransitionOpen) return;
    if (currentChapter === 2 || currentChapter === 3) {
      try {
        const activeSaveData: ActiveSaveState = {
          chapter: currentChapter,
          currentChapter,
          currentPhase: 1,
          phase3Location,
          chapter1Completed: true,
          chapter2Completed: currentChapter === 3 || Boolean(chapter2Completed),
          chapter3Unlocked: currentChapter === 3 || Boolean(chapter3Unlocked),
          selectedCharacterId: selectedCharacter.id,
          inventory,
          discoveredClues,
          hasMatchesCount,
          hasBlackCandlesCount,
          hasBronzeBell,
          caretakerDoorUnlocked: true,
          composure,
          timerSeconds: timeLeft,
          natAudienceConcluded,
          radioHasBatteries,
          radioTuned,
          askedNatTopics,
          hasReadLocker32Note,
          hasReadSandarLetters,
          hasCaretakerCandles,
          altarCandlesPlaced,
          desk4bLooted,
          mayResolved,
          key14OnFloor,
          key14Collected,
          locker14Unlocked,
          stairwayGateKeyTaken,
          stairwayGateUnlocked: currentChapter === 3 || Boolean(stairwayGateUnlocked),
          garageDrained: Boolean(garageDrained),
          caretakerLockFailCount,
          timestamp: Date.now(),
        };
        localStorage.setItem(ACTIVE_SAVE_KEY, JSON.stringify(activeSaveData));
        if (currentChapter === 2) {
          localStorage.setItem('spirits_labyrinth_ch2_unlocked', 'true');
        } else if (currentChapter === 3) {
          localStorage.setItem('spirits_labyrinth_ch2_unlocked', 'true');
          localStorage.setItem('spirits_labyrinth_ch3_unlocked', 'true');
        }
      } catch {}
      return;
    }
    if (
      mode === 'room_escape' ||
      mode === 'phase3' ||
      mode === 'location_select' ||
      mode === 'investigating_location'
    ) {
      const currentPhaseNum: 1 | 2 | 3 = mode === 'room_escape' || (mode as string) === 'awakening' ? 2 : 3;
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
        desk4bLooted,
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
        hasCaretakerCandles,
        caretakerDoorUnlocked,
        altarCandlesPlaced,
        altarBellPlaced,
        natSummoned,
        hasConsultedNat,
        askedNatTopics,
        corridorShadowScareTriggered,
        chapter1Completed: false,
        mayResolved,
        key14OnFloor,
        key14Collected,
        locker14Unlocked,
        stairwayGateKeyTaken,
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
          altarCandlesPlaced,
          altarBellPlaced,
          natSummoned,
          hasConsultedNat,
          askedNatTopics,
          natAudienceConcluded,
          radioHasBatteries,
          radioTuned,
          hasReadLocker32Note,
          hasReadSandarLetters,
          hasCaretakerCandles,
          desk4bLooted,
          mayResolved,
          key14OnFloor,
          key14Collected,
          locker14Unlocked,
          stairwayGateKeyTaken,
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
    desk4bLooted,
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
    hasConsultedNat,
    askedNatTopics,
    corridorShadowScareTriggered,
    chapter1Completed,
    natAudienceConcluded,
    radioHasBatteries,
    radioTuned,
    hasCaretakerCandles,
    mayResolved,
    key14OnFloor,
    key14Collected,
    locker14Unlocked,
    stairwayGateKeyTaken,
    garageDrained,
    caretakerLockFailCount,
  ]);

  // Current active dialogue line for Phase 1 & 2
  const currentP12Line = PHASE1_2_SCRIPT[currentLineIndex] || PHASE1_2_SCRIPT[0];

  // Awakening lines for Phase 3
  const AWAKENING_LINES = [
    {
      speaker: selectedCharacter.name,
      text: 'အား... ခေါင်းတွေအရမ်းကိုက်တယ်။ ကျန်တဲ့သူတွေ ဘယ်ရောက်သွားတာလဲ။ ဖန်ခွက်လည်း ကွဲနေတယ်။',
      soundCue: 'paper' as const,
    },
    {
      speaker: selectedCharacter.name,
      text: 'နံရံက ပြက္ခဒိန်က... ၁၉၉၈ ဩဂုတ်လတဲ့လား\n      ငါ အတိတ်ကို ရောက်သွားတာပဲ။',
      soundCue: 'drone' as const,
    },
    {
      speaker: selectedCharacter.name,
      text: 'ဒီကနေ ထွက်ပေါက်ရှာမှ ဖြစ်မယ်။',
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
          "— သော့ချိတ်ပေါ်မှာ ခြောက်သွေ့နေတဲ့ သွေးရာတွေ... လည်ပင်းပေါ်ကို အေးစက်တဲ့ ရေစက်တွေ စီးကျလာတယ်။ တစ်ယောက်ယောက်က အသည်းအသန် ကုတ်ခြစ်ပြီး ထွက်ပြေးဖို့ ကြိုးစားခဲ့တာပဲ။ —"
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
            ? 'မမမေ (၁၉၉၈)'
            : 'အဆောင် ပတ်ဝန်းကျင်',
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
          } else if (
            phase3Location === 'stairwell_gate' ||
            phase3Location === 'stairway_gate_inspection' ||
            phase3Location === 'washroom_main'
          ) {
            e.preventDefault();
            sound.playPaperRustle();
            setPhase3Location('west_split_landing');
          } else if (phase3Location === 'hostel_outer_grounds') {
            e.preventDefault();
            sound.playPaperRustle();
            setPhase3Location('stairway_gate_inspection');
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
        "လေးလံခိုင်ခံ့တဲ့ ကျွန်းသားတုံးကြီး။ ဂျမ်းဖြစ်နေတဲ့ သော့ဂျက်ကို ရိုက်ချိုးဖို့ လုံလောက်ပေမဲ့ အသံတော့ တော်တော်ကျယ်လိမ့်မယ်။"
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
      desk4bLooted,
      doorUnlocked: true,
      mayResolved,
      key14OnFloor,
      key14Collected,
      locker14Unlocked,
      composure: method === 'bobby_pin' ? composure : Math.max(0, composure - 15),
      timerSeconds: timeLeft,
      timestamp: Date.now(),
    });

    if (method === 'bobby_pin') {
      sound.playChime(true);
      setRoomBanner({
        text: `${selectedCharacter.name} က ကွေးနေသော သံမဏိဆံညှပ်ကို သော့ပေါက်အတွင်း ညင်သာစွာ ထည့်သွင်းလိုက်သည်။ သော့ပင်များ တိတ်ဆိတ်စွာ ညှိမိသွားသည်... ကလစ်သံ။ သော့သည် အသံမထွက်ဘဲ ပွင့်သွားသည်.`,
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
        text: 'ခေါက်ချုန်းကြီး! ကျွန်းပျဉ်တုံးကြီးက သော့တံကို ပြင်းထန်သော အားဖြင့် ရိုက်ခတ်လိုက်သည်! ကွဲအက်သွားသော သစ်သားများ အော်မြည်ရင်း တံခါးကြီး ဟဖောက်ပွင့်သွားပြီး အဆောင်လမ်းသွယ် ၃၂၆ တစ်လျှောက် ပဲ့တင်ထပ်သွားသည်...',
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
      desk4bLooted,
      doorUnlocked: false,
      mayResolved,
      key14OnFloor,
      key14Collected,
      locker14Unlocked,
      composure,
      timerSeconds: timeLeft,
      timestamp: Date.now(),
    });

    setTimeout(() => {
      setIsScreenShaking(false);
    }, 200);

    const fullText = '၁၉၉၈ ဩဂုတ် ၁၄ — အခန်း ၄B';
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
      desk4bLooted,
      doorUnlocked: false,
      mayResolved,
      key14OnFloor,
      key14Collected,
      locker14Unlocked,
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
      desk4bLooted: false,
      hasBlackCandlesCount: 0,
      hasMatchesCount: 0,
      hasBronzeBell: false,
      caretakerDoorUnlocked: false,
      altarCandlesPlaced: 0,
      altarBellPlaced: false,
      natSummoned: false,
      hasConsultedNat: false,
      mayResolved: false,
      key14OnFloor: false,
      key14Collected: false,
      locker14Unlocked: false,
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
    setNatAudienceConcluded(false);

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
    setDesk4bLooted(false);
    setDoorUnlocked(false);
    setWashroomStallChecked(false);
    setWashroomMirrorScratched(false);
    setStairwellGateInspected(false);
    setMayResolved(false);
    setKey14OnFloor(false);
    setKey14Collected(false);
    setLocker14Unlocked(false);
    setStairwayGateKeyTaken(false);
    setHasBlackCandlesCount(0);
    setHasMatchesCount(0);
    setHasBronzeBell(false);
    setHasReadLocker32Note(false);
    setHasReadSandarLetters(false);
    setHasLocker09Candle(false);
    setHasLocker09Matchbox(false);
    setHasCaretakerCandles(false);
    setCaretakerDoorUnlocked(false);
    setAltarCandlesPlaced(0);
    setAltarBellPlaced(false);
    setNatSummoned(false);
    setHasConsultedNat(false);
    setRadioHasBatteries(false);
    setRadioTuned(false);
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
    setRadioHasBatteries(false);
    setRadioTuned(false);
    setMayResolved(false);
    setKey14OnFloor(false);
    setKey14Collected(false);
    sound.startAmbient();
    setActiveMonologue(
      "— အခန်း ၂ - နားလည်သဘောပေါက်ခြင်း — အရှေ့ဘက်စင်္ကြံလမ်းဆုံမှာ ရပ်နေသည်။ အများသုံး ဘုရားဝတ်ပြုခန်း နတ်ပလ္လင် စောင့်ကြိုနေသည်။ —"
    );
    navigate('/chapters/2');
  };

  const handleSaveAndExit = () => {
    setIsChapterTransitionOpen(false);
    sound.stopAllAmbience();
    // Route directly to Chapter Selection page (progress was already saved in lockChapterOneAndSave or advanceToChapterThreeAndSave)
    navigate('/chapters');
  };

  const handleFinishChapterThree = () => {
    setIsChapter3TransitionOpen(false);
    sound.stopAllAmbience();
    sound.playMenuSelect();

    // 1. Mark Chapter 3 completed in Context & Store
    setChapter3Completed?.(true);
    completeChapter(3);

    try {
      localStorage.setItem('spirits_labyrinth_ch3_completed', 'true');
      const activeSave = JSON.parse(localStorage.getItem('spirits_labyrinth_active_save') || '{}');
      activeSave.chapter3Completed = true;
      activeSave.highestChapterCompleted = Math.max(activeSave.highestChapterCompleted || 0, 3);
      activeSave.currentChapter = 3;
      activeSave.chapter = 3;
      localStorage.setItem('spirits_labyrinth_active_save', JSON.stringify(activeSave));

      const prog = JSON.parse(localStorage.getItem('spirits_labyrinth_progress_v1') || '{}');
      prog.chapter3Completed = true;
      prog.highestChapterCompleted = Math.max(prog.highestChapterCompleted || 0, 3);
      localStorage.setItem('spirits_labyrinth_progress_v1', JSON.stringify(prog));

      useGameStore.setState({ chapter3Completed: true, highestChapterCompleted: 3 });

      PrologBridge.queryOnce('assertz(chapter3_completed)');
    } catch {}

    // 2. Navigate to Chapter Selection page
    navigate('/chapters');
  };

  const handleContinueToChapterThree = () => {
    sound.playMenuSelect();
    setIsChapterTransitionOpen(false);

    // 1. Authoritative chapter bump (preserving inventory)
    advanceToChapter(3);
    setCurrentChapter(3);

    // 2. Set authoritative scene & location
    setStairwayGateUnlocked(true);
    setChapter3Unlocked(true);
    setPhase3Location('hostel_outer_grounds');

    // 3. Sync Prolog engine
    try {
      if (typeof (window as any).prologEngine?.query === 'function') {
        (window as any).prologEngine.query(
          'retractall(player_has(key_stairway_gate)), assertz(stairway_gate_unlocked), assertz(escaped_interior).'
        );
      }
    } catch {}

    // 4. Trigger scene transition audio
    sound.playRainOutdoor();
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
      "— \"ကြိုးကို ဘယ်သူကိုင်ထားလဲ မင်းမသိသေးဘူး... မီးမရှို့ခင် နတ်မင်းကြီးကို မေးပါဦး...\" စာရင်းမှတ်တမ်းစာအုပ်ထဲကနေ အရိပ်မည်းတွေ အပြင်းအထန် ပေါက်ကွဲထွက်လာတယ်! —"
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

      // 3. Mark Chapter 1 finished and display the transition modal HERE ONLY with Time Bank rollover and Resolve recovery
      const resolve = selectedCharacter.resolveMultiplier ?? 1.0;
      const savedState = lockChapterOneAndSave(
        selectedCharacter.id,
        composure,
        inventory,
        timeLeft,
        resolve,
        {
          natAudienceConcluded,
          radioHasBatteries,
          radioTuned,
          discoveredClues,
          askedNatTopics,
          hasReadLocker32Note,
          hasReadSandarLetters,
          hasCaretakerCandles,
          altarCandlesPlaced,
          hasMatchesCount,
          hasBlackCandlesCount,
          hasBronzeBell,
          desk4bLooted,
        }
      );

      setComposure(savedState.composure);
      setTimeLeft(savedState.timerSeconds);
      // The cinematic thought is replaced by the transition card; never layer a
      // legacy dialogue/monologue panel over the Chapter 2 hand-off.
      setActiveMonologue(null);
      setChapter1Completed(true);
      completeChapter(1);
      setShowChapterTransitionModal(true);
    }, 900);
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
      if (phase3Location === 'stairwell_gate' || phase3Location === 'stairway_gate_inspection' || phase3Location === 'stairway_exit_gate' || phase3Location === 'balcony_stairway_gate') return PHASE_3_ASSETS.stairwayGateInspection || PHASE_3_ASSETS.stairwellGateLocked;
      if (phase3Location === 'compound_iron_gate') return '/assets/scenes/compound_iron_gate_inspection.jpg';
      if (phase3Location === 'garage_subterranean') return garageDrained ? '/assets/scenes/garage_subterranean_rain.jpg' : '/assets/scenes/garage_subterranean_rain_submerged.jpg';
      if (phase3Location === 'banyan_wellhead') return '/assets/scenes/banyan_wellhead_exterior.jpg';
      if (phase3Location === 'well_interior_deep' || phase3Location === 'room_101_seance_flashback') return '/assets/scenes/well_interior_deep.jpg';
      if (phase3Location === 'seance_climax_flashback') return PHASE_3_ASSETS.seanceClimaxFlashback || '/assets/scenes/seance_climax_flashback.jpg';
      if (phase3Location === 'hostel_outer_grounds') return PHASE_3_ASSETS.hostelOuterGrounds || '/assets/scenes/hostel_outer_grounds_rain.jpg';
      if (phase3Location === 'washroom_main') return PHASE_3_ASSETS.washroomOverview;
      if (phase3Location === 'washroom_basin') return PHASE_3_ASSETS.washroomBasinZoom;
      if (phase3Location === 'washroom_stall') return PHASE_3_ASSETS.washroomStallZoom;
      if (phase3Location === 'washroom_rope') return PHASE_3_ASSETS.washroomRopeZoom;
      if (phase3Location === 'washroom_mirror') return PHASE_3_ASSETS.washroomMirrorZoom;
      if (phase3Location === 'east_fork') return PHASE_3_ASSETS.eastWingFork;
      if (phase3Location === 'balcony_326' || phase3Location === 'balcony') return '/assets/scenes/balcony_rain_night.jpg';
      if (phase3Location === 'lockers_main') return PHASE_3_ASSETS.lockersOverview;
      if (phase3Location === 'locker_32') return PHASE_3_ASSETS.locker32Zoom;
      if (phase3Location === 'locker_09') return PHASE_3_ASSETS.locker09Zoom;
      if (phase3Location === 'locker_10') return '/assets/scenes/locker_10_interior.jpg';
      if (phase3Location === 'locker_14') return locker14Unlocked ? PHASE_3_ASSETS.locker14Interior : PHASE_3_ASSETS.locker14Zoom;
      if (phase3Location === 'locker_14_interior') return PHASE_3_ASSETS.locker14Interior;
      if (phase3Location === 'locker_spider') return PHASE_3_ASSETS.lockerSpiderZoom;
      if (phase3Location === 'prayer_room_main') return PHASE_3_ASSETS.prayerRoomOverview;
      if (phase3Location === 'prayer_altar') return PHASE_3_ASSETS.prayerAltarZoom;
      if (phase3Location === 'caretaker_door_keypad') return PHASE_3_ASSETS.caretakerKeypadZoom;
      if (phase3Location === 'caretaker_office_main' || phase3Location === 'caretaker_office') {
        if (spectralClimaxActive || currentChapter >= 2 || chapter1Completed) return PHASE_3_ASSETS.caretakerSpectralClimax;
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

  // Dynamic Global HUD Location Label
  const getGlobalHudLocationLabel = (): string => {
    const subSceneNames: Record<string, string> = {
      main: 'ခန်းမကျယ်',
      desk: 'စာကြည့်စားပွဲ',
      wardrobe: 'အဝတ်ဗီရို',
      calendar: 'ပြက္ခဒိန်',
      door: 'တံခါး',
      stool: 'ထိုင်ခုံငယ်',
    };
    if (mode === 'phase1_2') {
      return currentP12Line.phase === 1
        ? 'အဆင့် ၁ : ဆွေးနွေးပွဲ'
        : 'အဆင့် ၂ : နတ်ဝင်ပြောသည့်ပွဲ';
    }
    if (mode === 'awakening' || mode === 'room_escape') {
      return activeInspectSubScene === 'main'
        ? 'အဆင့် ၃ • အခန်း ၄B ထွက်ပြေးမှု'
        : `အခန်း ၄B : ${(subSceneNames[activeInspectSubScene] ?? activeInspectSubScene).toUpperCase()}`;
    }
    if (mode === 'phase3') {
      switch (phase3Location) {
        case 'hallway_threshold':
          return 'အဆောင်လမ်းသွယ် ၃၂၆ • တံခါးခုံ';
        case 'west_split_landing':
          return 'အနောက်တောင်ပံ • လှေကားကုန်းနားပြင်';
        case 'stairwell_gate':
        case 'stairway_gate_inspection':
        case 'stairway_exit_gate':
          return 'မြေညီထပ် • လှေကားထွက်ပေါက် တံခါး';
        case 'hostel_outer_grounds':
          return 'မြေညီထပ် • အဆောင်ဝင်းနှင့် ခြံဝတံခါး';
        case 'washroom_main':
          return 'အနောက်တောင်ပံ • ဘုံရေချိုးခန်း';
        case 'washroom_basin':
          return 'ရေချိုးခန်း • ဘိလပ်မြေလင်ပန်း';
        case 'washroom_stall':
          return 'ရေချိုးခန်း • တတိယအခန်း';
        case 'washroom_rope':
          return 'ရေချိုးခန်း • ရေမြောင်းပိုက်';
        case 'washroom_mirror':
          return 'ရေချိုးခန်း • အက်နေသည့်မှန်';
        case 'east_fork':
          return 'အရှေ့တောင်ပံ • လမ်းသုံးခွလမ်းဆုံ';
        case 'lockers_main':
          return 'အရှေ့တောင်ပံ • ကျောင်းသားလော့ကာခန်း';
        case 'locker_32':
          return 'လော့ကာခန်း • လော့ကာ ၃၂';
        case 'locker_09':
          return 'လော့ကာခန်း • လော့ကာ ၀၉';
        case 'locker_10':
          return 'လော့ကာခန်း • လော့ကာ ၁၀';
        case 'locker_14':
          return 'လော့ကာခန်း • လော့ကာ ၁၄';
        case 'locker_spider':
          return 'လော့ကာခန်း • သံချေးလေဝင်ပေါက်';
        case 'prayer_room_main':
          return 'အရှေ့တောင်ပံ • နတ်ကွန်းခန်း';
        case 'prayer_altar':
          return 'နတ်ကွန်းခန်း • အစောင့်နတ်စင်';
        case 'caretaker_door_keypad':
          return 'အရှေ့တောင်ပံ • အလုပ်သမားတံခါး';
        case 'caretaker_office_main':
        case 'caretaker_office':
          return 'အခန်း ၁၀၁ • အလုပ်သမားမှတ်တမ်းခန်း';
        case 'balcony_326':
        case 'balcony':
          return 'အဆောင်လမ်းသွယ် ၃၂၆ • ရှေ့မြင်ကွင်း ဝရန်တာ';
        default:
          return 'အဆင့် ၃ • အဆောင်လမ်းသွယ် ၃၂၆';
      }
    }
    return `အဆင့် ၃ • ကဏ္ဍ 0${currentTier} / 03`;
  };

  // Unified Phase 3 Return Navigation Handler
  const handlePhase3Return = () => {
    setPhase3Message(null);
    if (
      phase3Location === 'washroom_basin' ||
      phase3Location === 'washroom_stall' ||
      phase3Location === 'washroom_rope' ||
      phase3Location === 'washroom_mirror'
    ) {
      sound.playPaperRustle();
      setPhase3Location('washroom_main');
    } else if (
      phase3Location === 'stairwell_gate' ||
      phase3Location === 'stairway_gate_inspection' ||
      phase3Location === 'stairway_exit_gate' ||
      phase3Location === 'balcony_stairway_gate' ||
      phase3Location === 'washroom_main'
    ) {
      sound.playPaperRustle();
      setPhase3Location('west_split_landing');
    } else if (phase3Location === 'hostel_outer_grounds') {
      try {
        sound.playDoorCreak();
      } catch {
        sound.playPaperRustle();
      }
      setPhase3Location('stairway_gate_inspection');
    } else if (phase3Location === 'well_interior_deep') {
      sound.playPaperRustle();
      setPhase3Location('banyan_wellhead');
    } else if (
      phase3Location === 'compound_iron_gate' ||
      phase3Location === 'garage_subterranean' ||
      phase3Location === 'banyan_wellhead' ||
      phase3Location === 'seance_climax_flashback'
    ) {
      sound.playPaperRustle();
      setPhase3Location('hostel_outer_grounds');
    } else if (phase3Location === 'radio_bench_inspection') {
      sound.playPaperRustle();
      setPhase3Location('balcony_326');
    } else if (phase3Location === 'west_split_landing') {
      sound.playPaperRustle();
      setPhase3Location('hallway_threshold');
    } else if (
      phase3Location === 'locker_32' ||
      phase3Location === 'locker_09' ||
      phase3Location === 'locker_10' ||
      phase3Location === 'locker_14' ||
      phase3Location === 'locker_14_interior' ||
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
        setActiveMonologue("— စင်္ကြံမျက်နှာကျက်ပေါ်မှာ မည်းနက်တဲ့ အရိပ်တစ်ခု ဖြတ်ပြေးသွားတယ်! သံပိုက်လုံးကြီးတွေ တကျွီကျွီမြည်လာတယ်... (စိတ်တည်ငြိမ်မှု -၅%) —");
      } else {
        sound.playPaperRustle();
        setActiveMonologue(null);
      }
      setPhase3Location('east_fork');
    } else if (phase3Location === 'caretaker_door_keypad') {
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
    } else if (phase3Location === 'hallway_threshold') {
      sound.playPaperRustle();
      setCurrentScene('room_4b_main');
      setCurrentSubScene(null);
      setActiveInspectSubScene('main');
      setMode('room_escape');
    }
  };

  // Unified Return Destination Label
  const getPhase3ReturnDestination = (): string => {
    if (phase3Location === 'hostel_outer_grounds') {
      return 'လှေကားတံခါး';
    }
    if (
      phase3Location === 'garage_subterranean' ||
      phase3Location === 'compound_iron_gate' ||
      phase3Location === 'banyan_wellhead'
    ) {
      return 'ဝင်း';
    }
    if (phase3Location === 'well_interior_deep') {
      return 'ရေတွင်းခုံ';
    }
    if (phase3Location === 'room_101_seance_flashback' || phase3Location === 'seance_climax_flashback') {
      return '';
    }
    if (
      phase3Location === 'stairwell_gate' ||
      phase3Location === 'stairway_gate_inspection' ||
      phase3Location === 'stairway_exit_gate' ||
      phase3Location === 'balcony_stairway_gate' ||
      phase3Location === 'washroom_main'
    ) {
      return 'လှေကားကုန်းနားပြင်';
    }
    if (phase3Location === 'west_split_landing') {
      return 'စင်္ကြံ';
    }
    if (phase3Location.startsWith('washroom_')) {
      return 'ရေချိုးခန်း';
    }
    if (phase3Location === 'radio_bench_inspection') {
      return 'ဝရန်တာ';
    }
    if (phase3Location.startsWith('locker_')) {
      return 'လော့ကာခန်း';
    }
    if (
      phase3Location === 'lockers_main' ||
      phase3Location === 'caretaker_door_keypad' ||
      phase3Location === 'prayer_room_main'
    ) {
      return 'အရှေ့လမ်းခွဲ';
    }
    if (phase3Location === 'prayer_altar') {
      return 'နတ်ကွန်းခန်း';
    }
    if (phase3Location === 'east_fork') {
      return 'စင်္ကြံ';
    }
    if (phase3Location === 'hallway_threshold') {
      return 'အခန်း ၄B';
    }
    return 'အရှေ့လမ်းခွဲ';
  };

  // Unified Area Breadcrumb Resolver
  const getPhase3AreaBreadcrumb = (): { zone: string; name: string } => {
    switch (phase3Location) {
      case 'hallway_threshold':
        return { zone: 'အဆောင်လမ်းသွယ် ၃၂၆', name: 'တံခါးခုံ' };
      case 'west_split_landing':
        return { zone: 'အနောက်တောင်ပံ', name: 'လှေကားကုန်းနားပြင်' };
      case 'stairwell_gate':
      case 'stairway_gate_inspection':
      case 'stairway_exit_gate':
      case 'balcony_stairway_gate':
        return { zone: 'မြေညီထပ်', name: 'လှေကားထွက်ပေါက်တံခါး' };
      case 'hostel_outer_grounds':
        return { zone: 'မြေညီထပ် အပြင်ဘက်', name: 'အဆောင်ဝင်းနှင့် ခြံဝတံခါး' };
      case 'compound_iron_gate':
        return { zone: 'မြေညီထပ် အပြင်ဘက်', name: 'ခြံဝ သံတံခါး' };
      case 'garage_subterranean':
        return { zone: 'မြေညီထပ် အပြင်ဘက်', name: 'မြေအောက်ကားဂိုဒေါင်' };
      case 'banyan_wellhead':
        return { zone: 'မြေညီထပ် အပြင်ဘက်', name: 'ညောင်ပင်နှင့် ရေတွင်း' };
      case 'well_interior_deep':
        return { zone: 'မြေအောက်လမ်းသွယ်', name: 'ရေတွင်းနက် ချိုင့်' };
      case 'room_101_seance_flashback':
      case 'seance_climax_flashback':
        return { zone: 'လမ်းသွယ် အထွတ်အထိပ်', name: 'အခန်း ၁၀၁ နတ်ဝင်စက်ဝိုင်း' };
      case 'washroom_main':
        return { zone: 'အနောက်တောင်ပံ', name: 'ဘုံရေချိုးခန်း' };
      case 'washroom_basin':
        return { zone: 'ရေချိုးခန်း', name: 'ဘိလပ်မြေလင်ပန်း' };
      case 'washroom_stall':
        return { zone: 'ရေချိုးခန်း', name: 'တတိယအခန်း' };
      case 'washroom_rope':
        return { zone: 'ရေချိုးခန်း', name: 'ရေမြောင်းပိုက်' };
      case 'washroom_mirror':
        return { zone: 'ရေချိုးခန်း', name: 'အက်နေသည့်မှန်' };
      case 'east_fork':
        return { zone: 'အရှေ့တောင်ပံ', name: 'လမ်းသုံးခွလမ်းဆုံ' };
      case 'lockers_main':
        return { zone: 'အရှေ့တောင်ပံ', name: 'ကျောင်းသားလော့ကာခန်း' };
      case 'locker_32':
        return { zone: 'လော့ကာခန်း', name: 'လော့ကာ ၃၂' };
      case 'locker_09':
        return { zone: 'လော့ကာခန်း', name: 'လော့ကာ ၀၉' };
      case 'locker_10':
        return { zone: 'လော့ကာခန်း', name: 'လော့ကာ ၁၀' };
      case 'locker_14':
        return { zone: 'လော့ကာခန်း', name: 'လော့ကာ ၁၄' };
      case 'locker_14_interior':
        return { zone: 'လော့ကာခန်း', name: 'လော့ကာ ၁၄ အတွင်း' };
      case 'locker_spider':
        return { zone: 'လော့ကာခန်း', name: 'သံချေးလေဝင်ပေါက်' };
      case 'prayer_room_main':
        return { zone: 'အရှေ့တောင်ပံ', name: 'နတ်ကွန်းခန်း' };
      case 'prayer_altar':
        return { zone: 'နတ်ကွန်းခန်း', name: 'အစောင့်နတ်စင်' };
      case 'caretaker_door_keypad':
        return { zone: 'အရှေ့တောင်ပံ', name: 'အလုပ်သမားတံခါး' };
      case 'caretaker_office_main':
      case 'caretaker_office':
        return { zone: 'အခန်း ၁၀၁', name: 'အလုပ်သမားမှတ်တမ်းခန်း' };
      case 'balcony_326':
      case 'balcony':
        return { zone: 'အဆောင်လမ်းသွယ် ၃၂၆', name: 'ရှေ့မြင်ကွင်း ဝရန်တာ' };
      case 'radio_bench_inspection':
        return { zone: 'အဆောင်လမ်းသွယ် ၃၂၆', name: 'ရေဒီယိုခုံ' };
      default:
        return { zone: 'အဆောင်လမ်းသွယ် ၃၂၆', name: 'စင်္ကြံ' };
    }
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
          alt="နေရာလေထု"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out select-none pointer-events-none ${
            isZoomed
              ? 'scale-125 filter brightness-[0.75] contrast-125'
              : 'scale-100 filter brightness-90 contrast-105'
          }`}
        />
        {phase3Location !== 'caretaker_office_main' && phase3Location !== 'caretaker_office' && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/50 pointer-events-none" />
        )}

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
      <div className="fixed top-0 inset-x-0 p-3 sm:p-5 flex flex-wrap items-center justify-between gap-2 z-50 pointer-events-none bg-gradient-to-b from-stone-950/90 via-stone-950/60 to-transparent">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 pointer-events-none">
          {/* Phase Badge */}
          <div className="px-3 py-1 bg-[#121815]/95 border border-[#2c3d34] rounded-lg text-xs font-mono font-bold tracking-wider text-[#82a996] shadow-xl flex items-center gap-2 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-[#6ee7b7] animate-ping" />
            <span className="uppercase">
              {getGlobalHudLocationLabel()}
            </span>
          </div>

          {/* 10-Minute Timer Badge */}
          {mode !== 'phase1_2' && mode !== 'shattering' && mode !== 'character_select' && (
            <div className="flex items-center gap-2 pointer-events-none">
              <div className="px-2.5 py-1 bg-[#121815]/95 border border-[#2c3d34] rounded-lg text-xs font-mono font-bold text-[#c2d6cc] flex items-center gap-1.5 shadow-md pointer-events-none">
                <Clock className="w-3.5 h-3.5 text-[#82a996] animate-pulse" />
                <span>{timeFormatted}</span>
              </div>

              {/* Composure Badge */}
              <div
                className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 shadow-md pointer-events-none ${getComposureColor(
                  composure
                )}`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>စိတ်တည်ငြိမ်မှု: {composure}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls: Inventory Slots, Compass Dock, Notebook, Audio & Pause */}
        <div className="flex items-center gap-2 z-50 pointer-events-auto">
          {/* HUD Inventory Bar (Top 3 quick-slots with expandable drawer) */}
          {mode !== 'phase1_2' && mode !== 'shattering' && mode !== 'character_select' && (
            <TopInventoryBar
              inventory={inventory}
              setIsInventoryDrawerOpen={setIsInventoryDrawerOpen}
              onItemClick={(itemId) => {
                sound.playPaperRustle();
                if (itemId === 'matchbox_three_stars' && phase3Location === 'prayer_altar' && altarCandlesPlaced < 3) {
                  sound.playError();
                  setActiveMonologue("— ယဇ်ပူဇော်မှု မပြည့်စုံသေးပါ။ မီးမညှိမီ ဖယောင်းတိုင် ၃ တိုင်ကို အရင်စိုက်ထူထားရမည်။ —");
                }
              }}
            />
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
              title="သဘာဝလွန် သံလိုက်အိမ်မြှောင် (ချဲ့ကြည့်ရန် နှိပ်ပါ)"
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
                မြှောင်
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
              title="အမှုမှတ်တမ်းဖွင့်ရန် [N]"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#82a996]" />
              <span className="hidden sm:inline">အမှုမှတ်စု</span>
              <span className="bg-[#2c3d34] text-[#c2d6cc] px-1 rounded text-[10px]">
                {discoveredClues.length}
              </span>
            </button>
          )}

          <button
            onClick={toggleMute}
            className="p-2 rounded-lg bg-[#121815]/95 border border-[#2c3d34] text-[#82a996] hover:text-[#c2d6cc] hover:border-[#4d6e5e] transition-all cursor-pointer shadow-md pointer-events-auto"
            title={isMuted ? 'အသံဖွင့်ရန်' : 'အသံပိတ်ရန်'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              setIsPauseOpen(true);
              sound.playPaperRustle();
            }}
            className="p-2 rounded-lg bg-[#121815]/95 border border-[#2c3d34] text-[#82a996] hover:text-[#c2d6cc] hover:border-[#4d6e5e] transition-all cursor-pointer shadow-md pointer-events-auto z-50"
            title="ခေတ္တရပ်နားခန်း [ESC]"
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
              ကဏ္ဍ 0{currentTier} • ရှေ့ဆက်လမ်း ရွေးချယ်ပါ
            </span>
            <h2
              className="text-3xl sm:text-5xl font-black text-stone-100 tracking-wider uppercase drop-shadow-lg"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
            >
              {currentTier === 1
                ? 'စင်္ကြံတောင်ပံ ရွေးချယ်ပါ'
                : currentTier === 2
                ? 'မြေညီ လမ်းကြမ်း ရွေးချယ်ပါ'
                : 'ဝင်း ပတ်ပတ်လည် • နောက်ဆုံးလမ်း'}
            </h2>
            <p className="text-xs font-mono text-stone-400 mt-1 tracking-wider">
              [←/→] ရွေးရန် • [ENTER] စုံစမ်းရန် • ထွက်ပေါက်လမ်း ရှာဖွေရန် လေစီးကြောင်းများကို စောင့်ကြည့်ပါ
            </p>
            {doorSmashed && currentTier === 1 && (
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/85 border border-rose-600 text-rose-300 text-xs font-mono shadow-lg animate-pulse">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>⚠️ နားပင်းလောက်သော ခေါက်ချုန်းသံ ပဲ့တင်ထပ်: တံခါးကို ရိုက်ခွဲခြင်းသည် အဆောင်လမ်းသွယ် ၃၂၆ တစ်လျှောက် သရဲများကို နှိုးဆော်လိုက်သည်။ စင်္ကြံ အန္တရာယ်အဆင့် မြင့်တက်သွားပြီ!</span>
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
              aria-label="ယခင် နေရာ"
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
                          စစ်ဆေးပြီး
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-950/80 border border-amber-600 text-amber-300">
                          <Eye className="w-3 h-3 text-amber-400" />
                          မစစ်ဆေးရသေး
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
                            <strong className="text-amber-400">လေစီးကြောင်း:</strong> {loc.subtleClues.airflow}
                          </span>
                        </div>

                        <div className="flex items-start gap-1.5 text-stone-400">
                          <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-[10px] leading-tight">
                            <strong className="text-stone-300">ဆက်စပ်မှု:</strong>{' '}
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
                        <span>{isInvestigated ? 'ပြန်လည်စစ်ဆေးရန်' : 'စုံစမ်းရန်'}</span>
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
              aria-label="နောက်ထပ် နေရာ"
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
            {mode === 'room_escape' && activeInspectSubScene !== 'main' && activeInspectSubScene !== 'desk' ? (
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
                <span>နောက်ဆုတ်ရန် / ခန်းသို့ ပြန်သွားရန်</span>
              </button>
            ) : (
              <div />
            )}

            {activeInspectSubScene !== 'desk' && (
              <div className="px-3.5 py-1 rounded-lg bg-[#121815]/95 border border-[#2c3d34] text-xs font-mono font-bold text-[#82a996] uppercase tracking-widest shadow-md">
                {mode === 'awakening' || activeInspectSubScene === 'main'
                  ? 'အခန်း ၄B • အိပ်ဆောင်ခန်း'
                  : activeInspectSubScene === 'stool'
                  ? 'စစ်ဆေးနေသည် • ကုတင်ဘေးထိုင်ခုံ'
                  : activeInspectSubScene === 'wardrobe'
                  ? 'စစ်ဆေးနေသည် • အဝတ်ဗီရို ခြေရင်း'
                  : activeInspectSubScene === 'calendar'
                  ? 'စစ်ဆေးနေသည် • နံရံပြက္ခဒိန်'
                  : 'စစ်ဆေးနေသည် • ခန်းတံခါး'}
              </div>
            )}
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
                  name="ကျွန်းသစ် အဝတ်ဗီရို"
                  cursorTooltip="ကျွန်းသစ် အဝတ်ဗီရိုနှင့် ခြေရင်း"
                  polygonPoints="0,15 21,19 21,99 0,99"
                  onClick={() => {
                    sound.playMenuSelect();
                    setActiveInspectSubScene('wardrobe');
                  }}
                />

                {/* 2. Wall Calendar (Orange) */}
                <InteractiveHotspot
                  id="main_calendar"
                  name="နံရံပြက္ခဒိန်"
                  cursorTooltip="နံရံပြက္ခဒိန် (၁၉၉၈ ဩဂုတ်)"
                  polygonPoints="24.5,45 32,45 32,59 24.5,59"
                  onClick={() => {
                    sound.playMenuSelect();
                    setActiveInspectSubScene('calendar');
                  }}
                />

                {/* 3. Compass / Tin Box (Purple) */}
                <InteractiveHotspot
                  id="main_tin_compass"
                  name="အိမ်မြှောင် / သံသေတ္တာ"
                  cursorTooltip={
                    hasMagneticCompass
                      ? 'ရှေးဟောင်း သံလိုက်အိမ်မြှောင်ကို စစ်ဆေးရန်'
                      : 'နတ္တာစီထားသော သံသေတ္တာ (အိမ်မြှောင်)'
                  }
                  polygonPoints="27,80 36,75 36,85 28,90"
                  onClick={() => {
                    if (!hasMagneticCompass) {
                      setHasMagneticCompass(true);
                      addInventoryItem('magnetic_compass');
                      sound.playChime(true);
                      sound.playPaperRustle();
                      setRoomBanner({
                        text: 'သံလိုက်အိမ်မြှောင် တွေ့ရှိပြီ! — သံချေးတက်နေသော နတ္တာစီထားသည့် သံသေတ္တာငယ်အတွင်း အနားယူနေသော ရှေးဟောင်းကြေးဝါ သံလိုက်အိမ်မြှောင်။',
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
                  name="စာကြည့်စားပွဲနှင့် မှတ်စုများ"
                  cursorTooltip="စာကြည့်စားပွဲကို စစ်ဆေးရန်"
                  polygonPoints="46,61 67,70 75,63 52,59"
                  onClick={() => {
                    sound.playMenuSelect();
                    setActiveInspectSubScene('desk');
                  }}
                />

                {/* 5. Room Door 4B (Blue) */}
                <InteractiveHotspot
                  id="main_door"
                  name="အခန်း ၄B တံခါး"
                  cursorTooltip={doorUnlocked ? "အဆောင်လမ်းသွယ် ၃၂၆ သို့ ထွက်ရန်" : "အခန်း ၄B တံခါး"}
                  polygonPoints="80,8 99.5,5 99.5,98 79,93"
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
              <DeskInspectionView
                deskMugMoved={deskMugMoved}
                setDeskMugMoved={setDeskMugMoved}
                desk4bLooted={Boolean(desk4bLooted)}
                setDesk4bLooted={setDesk4bLooted}
                inventory={inventory}
                addInventoryItem={addInventoryItem}
                addDiscoveredClue={addDiscoveredClue}
                setActiveMonologue={setActiveMonologue}
                setRoomBanner={setRoomBanner}
                onStepBack={() => {
                  sound.playPaperRustle();
                  setActiveInspectSubScene('main');
                  setRoomBanner(null);
                }}
                hasBobbyPin={hasBobbyPin}
              />
            )}

            {/* SUB-SCENE 3: BEDSIDE STOOL & COMPASS */}
            {activeInspectSubScene === 'stool' && (
              <>
                <InteractiveHotspot
                  id="stool_tin_compass"
                  name="သံချေးတက် ဘီစကစ် သံသေတ္တာ"
                  cursorTooltip={
                    hasMagneticCompass
                      ? 'ရှေးဟောင်း သံလိုက်အိမ်မြှောင်ကို စစ်ဆေးရန်'
                      : 'သံချေးတက် သံသေတ္တာကို ဖွင့်ရန်'
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
                        text: 'သံလိုက်အိမ်မြှောင် တွေ့ရှိပြီ! — သံချေးတက်နေသော နတ္တာစီထားသည့် သံသေတ္တာငယ်အတွင်း အနားယူနေသော ရှေးဟောင်းကြေးဝါ သံလိုက်အိမ်မြှောင်။',
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
                    name="ကျွန်းပျဉ်တုံးကြီး"
                    cursorTooltip="ကျွန်းပျဉ်တုံးကြီး"
                    polygonPoints="35.5,19.5 40.5,20.5 41.5,23.5 32.5,81 29.5,82.5 25.5,80.5 34.5,21.5"
                    onClick={handlePickupWoodenBat}
                  />
                ) : (
                  /* Wardrobe Baseboard Lore Inspect (rendered only after bat is taken) */
                  <InteractiveHotspot
                    id="wardrobe_baseboard"
                    name="အဝတ်ဗီရို ခြေရင်းပျဉ်"
                    cursorTooltip="အဝတ်ဗီရို ခြေရင်းပျဉ်"
                    polygonPoints="35.5,19.5 40.5,20.5 41.5,23.5 32.5,81 29.5,82.5 25.5,80.5 34.5,21.5"
                    onClick={() => {
                      sound.playMenuSelect();
                      setActiveMonologue(
                        "— သစ်သားတုံးကို ယူပြီးပါပြီ။ ကြမ်းပြင်ထဲ နစ်ဝင်နေတဲ့ ကောက်ကွေးနေတဲ့ ကျွန်းသားအောက်ခြေပြားသာ ကျန်ရှိတော့သည်။ —"
                      );
                    }}
                  />
                )}
              </>
            )}

            {/* SUB-SCENE 5: WALL CALENDAR ZOOM */}
            {activeInspectSubScene === 'calendar' && (
              <>
                <InteractiveHotspot
                  id="calendar_aug14"
                  name="ပြက္ခဒိန် စာရွက်"
                  cursorTooltip="စက်ဝိုင်းခြယ်ထားသော နေ့ကို စစ်ဆေးရန် (၁၉၉၈ ဩဂုတ် ၁၄)"
                  polygonPoints="25,12 52.5,13.5 53,80.5 24.5,82.5"
                  onClick={() => {
                    sound.playPaperRustle();
                    addDiscoveredClue('curfew_calendar_1998');
                    setActiveMonologue(
                      "— ၁၉၉၈ ခုနှစ် ဩဂုတ် ၁၄ ရက်ကို မင်နီဖြင့် ဝိုင်းထားသည်... 'ည ၁၁:၃၀ ပြီးနောက် အဆောင်ထွက်ပေါက်အားလုံးကို သံကြိုးခတ်မည်။ ခွင့်ပြုချက်မရှိဘဲ မည်သူမျှ အပြင်မထွက်ရ။' —"
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
                  name={doorUnlocked ? "ဖွင့်ထားသော ကျွန်းသစ်တံခါး" : "သော့ခတ်ထားသော ကျွန်းသစ်တံခါး"}
                  cursorTooltip={doorUnlocked ? "အဆောင်လမ်းသွယ် ၃၂၆ သို့ ဖြတ်သွားရန်" : "သော့ခတ်ထားသော ကျွန်းသစ်တံခါး"}
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
                          အခန်း ၄B ကျွန်းသစ် ထွက်ပေါက်တံခါးကြီး
                        </span>
                      </div>
                      <button
                        onClick={() => setIsDoorInspectOpen(false)}
                        className="p-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white cursor-pointer transition-colors"
                        title="တံခါးစစ်ဆေးခြင်းကို ပိတ်ရန်"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {doorUnlocked ? (
                      <div className="space-y-3">
                        <div className="py-4 px-4 rounded-xl bg-[#151f1a]/80 border border-[#223229]">
                          <p className="text-[#b4c9bf] font-mono text-sm sm:text-base tracking-wide leading-relaxed">
                            သော့တံ ဖြုတ်ထားသည်။ တံခါး ၄B သည် အဆောင်လမ်းသွယ် ၃၂၆ သို့ အပြည့်အဝ ပွင့်နေသည်။
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
                          <span>အဆောင်လမ်းသွယ် ၃၂၆ သို့ ဖြတ်သွားရန်</span>
                          <span className="text-xs">→</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Empty-Handed Display: strictly raw text, NO hint or guidance */}
                        {!hasInventoryItem('bobby_pin') && !hasInventoryItem('wooden_bat') && (
                          <div className="py-4 px-4 rounded-xl bg-stone-900/90 border border-stone-800">
                            <p className="text-stone-200 font-mono text-sm sm:text-base tracking-wide leading-relaxed">
                              သော့တံကို အခြားဘက်မှ ခတ်ထားသည်။ သော့ခတ်ထားသည်။
                            </p>
                          </div>
                        )}

                        {/* Dynamic Unlocking Options */}
                        {(hasInventoryItem('bobby_pin') || hasInventoryItem('wooden_bat')) && (
                          <div className="space-y-3">
                            <p className="text-xs font-mono text-stone-400">
                              သော့တံကို ဖောက်ထွင်းရန် လုပ်ဆောင်ချက် ရွေးပါ:
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
                                      ဆံညှပ်ဖြင့် သော့ဖောက်ပါ
                                    </span>
                                  </div>
                                  <p className="text-[11px] font-mono text-stone-400 group-hover:text-stone-300">
                                    တိတ်ဆိတ်သော ဖောက်ထွင်းမှု • စိတ်တည်ငြိမ်မှု ဆုံးရှုံးမှု သုည။ မိုးင်္သခ သန့်ရှင်းစွာ သော့ဖွင့်ပေးသည်။
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
                                      ကျွန်းပျဉ်တုံးဖြင့် သော့ကို ရိုက်ခွဲဖွင့်ပါ
                                    </span>
                                  </div>
                                  <div className="text-[11px] font-mono text-rose-300/90 font-semibold mb-1">
                                    ⚠️ သတိပေးချက်: တံခါးကို ရိုက်ခွဲလျှင် နားပင်းလောက်သော အသံကျယ်ကြီး ထွက်ပေါ်လာမည်။
                                  </div>
                                  <p className="text-[10px] font-mono text-stone-400 group-hover:text-stone-300">
                                    -၁၅% စိတ်တည်ငြိမ်မှု ဆုံးရှုံးမှု • နောက်ဆက်တွဲ စင်္ကြံ အန္တရာယ် မြင့်တက်စေသည်။
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
      {mode === 'phase3' && (phase3Location === 'caretaker_office_main' || phase3Location === 'caretaker_office') && (
        <CaretakerOfficeView
          currentChapter={currentChapter}
          chapter1Completed={chapter1Completed}
          setPhase3Location={setPhase3Location}
          hasCaretakerCandles={hasCaretakerCandles}
          setHasCaretakerCandles={setHasCaretakerCandles}
          setHasBlackCandlesCount={setHasBlackCandlesCount}
          setInventory={setInventory}
          hasBronzeBell={hasBronzeBell}
          setHasBronzeBell={setHasBronzeBell}
          addInventoryItem={addInventoryItem}
          natSummoned={natSummoned}
          hasBlackCandlesCount={hasBlackCandlesCount}
          altarCandlesPlaced={altarCandlesPlaced}
          handleCaretakerClimax={handleCaretakerClimax}
          activeMonologue={activeMonologue}
          setActiveMonologue={setActiveMonologue}
          caretakerSpectralClimax={spectralClimaxActive}
          onStepBack={() => {
            try {
              sound.playDoorCreak();
            } catch {
              sound.playPaperRustle();
            }
            setPhase3Location('east_fork');
            setActiveMonologue('— အသက်ရှူကျပ်တဲ့ ရုံးခန်းထဲကနေ စိုစွတ်အေးစက်တဲ့ စင်္ကြံလမ်းဆုံဆီ ပြန်ထွက်လာခဲ့တယ်။ —');
          }}
        />
      )}

      {/* BALCONY SCENE VIEW (PATHWAY 326) */}
      {mode === 'phase3' && (phase3Location === 'balcony_326' || phase3Location === 'balcony') && (
        <BalconySceneView
          setPhase3Location={setPhase3Location}
          activeMonologue={activeMonologue}
          setActiveMonologue={setActiveMonologue}
          currentChapter={currentChapter}
          inventory={inventory}
          setInventory={setInventory}
          composure={composure}
          setComposure={setComposure}
          discoveredClues={discoveredClues}
          radioHasBatteries={radioHasBatteries}
          radioTuned={radioTuned}
          mayResolved={mayResolved}
          setMayResolved={setMayResolved}
          key14OnFloor={key14OnFloor}
          setKey14OnFloor={setKey14OnFloor}
          key14Collected={key14Collected}
          setKey14Collected={setKey14Collected}
          addInventoryItem={addInventoryItem}
          removeInventoryItem={removeInventoryItem}
          addDiscoveredClue={addDiscoveredClue}
          setRoomBanner={setRoomBanner}
          onStepBack={() => {
            try {
              sound.playDoorCreak();
            } catch {
              try {
                sound.playDoorPush();
              } catch {
                sound.playPaperRustle();
              }
            }
            setPhase3Location('east_fork');
            setActiveMonologue('— မိုးစိုနေတဲ့ ဝရံတာကနေ အရှေ့ဘက်စင်္ကြံလမ်းဆီ ပြန်ရောက်လာခဲ့တယ်။ —');
          }}
        />
      )}

      {mode === 'phase3' && phase3Location === 'radio_bench_inspection' && (
        <RadioBenchInspectionView
          inventory={inventory}
          setInventory={setInventory}
          radioHasBatteries={radioHasBatteries}
          setRadioHasBatteries={setRadioHasBatteries}
          setActiveMonologue={setActiveMonologue}
          onReturn={() => setPhase3Location('balcony_326')}
onTuned={() => {
            sound.playGhostWhisper();
            setRadioTuned(true);
            setPhase3Location('balcony_326');
          }}
        />
      )}

      {mode === 'phase3' &&
        phase3Location !== 'caretaker_office_main' &&
        phase3Location !== 'caretaker_office' &&
        phase3Location !== 'balcony_326' &&
        phase3Location !== 'balcony' && (
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between">
          {/* Standardized Scene Navigation Bar */}
          <SceneNavBar
            onReturn={handlePhase3Return}
            returnDestination={getPhase3ReturnDestination()}
            areaZone={getPhase3AreaBreadcrumb().zone}
            areaName={getPhase3AreaBreadcrumb().name}
          />

          {/* Sub-scene Interactive Area */}
          <div className="relative flex-1 w-full h-full pointer-events-auto">
            {/* SUB-SCENE 1: THRESHOLD - TWO CLEAN VISUAL CHOICE CARDS */}
            {phase3Location === 'hallway_threshold' && (
              <>
                {/* Doorway Hotspot Mapping on Corridor Scene (pathway_326_main.jpg) */}
                <InteractiveHotspot
                  id="return-room-4b"
                  name="အခန်း ၄B တံခါး"
                  cursorTooltip="အခန်း ၄B သို့ ပြန်ဝင်ရန်"
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
                      alt="အနောက်တောင်ပံ"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0d] via-[#121815]/50 to-transparent" />
                    <div className="relative z-10 space-y-1 text-left">
                      <span className="text-[11px] font-mono font-bold tracking-widest text-[#82a996] uppercase">
                        အနောက်တောင်ပံ
                      </span>
                      <h3
                        className="text-2xl sm:text-3xl font-black text-[#c2d6cc] tracking-wider uppercase group-hover:text-[#6ee7b7] transition-colors"
                        style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                      >
                        လှေကားခင်းနှင့် ရေချိုးခန်း
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
                      alt="အရှေ့တောင်ပံ"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0d] via-[#121815]/50 to-transparent" />
                    <div className="relative z-10 space-y-1 text-left">
                      <span className="text-[11px] font-mono font-bold tracking-widest text-[#82a996] uppercase">
                        အရှေ့တောင်ပံ
                      </span>
                      <h3
                        className="text-2xl sm:text-3xl font-black text-[#c2d6cc] tracking-wider uppercase group-hover:text-[#6ee7b7] transition-colors"
                        style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                      >
                        လော့ကာများနှင့် နတ်ကွန်း
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
                  name="ဘုံရေချိုးခန်း အဝင်ဝ"
                  polygonPoints="0,10 44,15 44,80 0,98"
                  cursorTooltip="[ဘုံရေချိုးခန်း အတွင်းဝင်ရန်]"
                  onClick={() => {
                    sound.playMenuSelect();
                    setActiveMonologue(null);
                    setPhase3Location('washroom_main');
                  }}
                />

                {/* Right Staircase (Stairwell Descent) */}
                <InteractiveHotspot
                  id="landing_downstairs_stairwell"
                  name="အောက်ထပ် ကွန်ကရစ်လှေကား"
                  polygonPoints="70,40 85,40 78,77 57,70"
                  cursorTooltip="[လှေကားဆင်း သွားရန်]"
                  onClick={() => {
                    sound.playMenuSelect();
                    setActiveMonologue(null);
                    setPhase3Location('stairwell_gate');
                  }}
                />
              </>
            )}

            {/* SUB-SCENE 3: STAIRWAY EXIT ACCORDION GATE & PADLOCK */}
            {(phase3Location === 'stairwell_gate' || phase3Location === 'stairway_gate_inspection' || phase3Location === 'stairway_exit_gate' || phase3Location === 'balcony_stairway_gate') && (
              <StairwayGateInspectionView
                inventory={inventory}
                setInventory={setInventory}
                removeInventoryItem={removeInventoryItem}
                removeItem={removeItem}
                stairwayGateUnlocked={stairwayGateUnlocked}
                setStairwayGateUnlocked={setStairwayGateUnlocked}
                chapter3Unlocked={chapter3Unlocked}
                setChapter3Unlocked={setChapter3Unlocked}
                advanceToChapter={advanceToChapter}
                setActiveMonologue={setActiveMonologue}
                addDiscoveredClue={addDiscoveredClue}
                setPhase3Location={setPhase3Location}
                onReturn={() => setPhase3Location('west_split_landing')}
                onSaveAndExit={handleSaveAndExit}
                timeLeft={timeLeft}
                setTimeLeft={setTimeLeft}
                composure={composure}
                setComposure={setComposure}
                selectedCharacter={selectedCharacter}
                setCurrentChapter={setCurrentChapter}
                setCurrentScene={setCurrentScene}
                isChapterTransitionOpen={isChapterTransitionOpen}
                setIsChapterTransitionOpen={setIsChapterTransitionOpen}
              />
            )}

            {/* SUB-SCENE: HOSTEL OUTER GROUNDS / COURTYARD (CHAPTER 3) */}
            {phase3Location === 'hostel_outer_grounds' && (
              <HostelOuterGroundsView
                onNavigate={(target) => {
                  if (target === 'balcony_stairway_gate' || target === 'stairway_exit_gate' || target === 'stairway_gate_inspection') {
                    setPhase3Location(stairwayGateUnlocked ? 'west_split_landing' : 'stairway_gate_inspection');
                  } else {
                    setPhase3Location(target as Phase3Location);
                    if (target === 'compound_iron_gate') {
                      setActiveMonologue(
                        "— ကြီးမားလှတဲ့ သံခြံဝင်းဂိတ်ကြီးကို သော့ခလောက်ကြီးတွေနဲ့ ဆူးပင်တွေ ပိတ်ဆို့ထားတယ်။ ဂိတ်အလွန်မှာတော့ မော်လမြိုင်ဘက်ဆီ ဦးတည်သွားတဲ့ မြေနီလမ်းမကြီး ရှိနေသည်။ —"
                      );
                    } else if (target === 'garage_subterranean') {
                      setActiveMonologue(
                        "— ချောမွတ်နေတဲ့ ကွန်ကရစ်ဆင်ခြေလျှောလမ်းက အောက်ထပ် ရေမြုပ်နေတဲ့ စက်ဘီးဂိုဒေါင်ဆီ ဆင်းသွားတယ်။ အမှောင်ထုထဲကနေ ဆီညှော်နံ့နဲ့ ရေပုပ်နံ့တွေ ထွက်ပေါ်နေတယ်။ —"
                      );
                    } else if (target === 'banyan_wellhead') {
                      setActiveMonologue(
                        "— ရှေးဟောင်းညောင်ပင်ကြီးရဲ့ ရစ်ခွေနေတဲ့ အမြစ်တွေက ကျောက်ရေတွင်းဝကို ဝန်းရံထားတယ်။ အောက်ဘက် ရေနက်မှောင်မှောင်ထဲကနေ တိုးညှင်းတဲ့ တီးတိုးသံတွေ ပွက်ပွက်ထွက်ပေါ်နေတယ်... —"
                      );
                    }
                  }
                }}
                setActiveMonologue={setActiveMonologue}
                addDiscoveredClue={addDiscoveredClue}
                setPhase3Location={setPhase3Location}
                onReturn={() => setPhase3Location(stairwayGateUnlocked ? 'west_split_landing' : 'stairway_gate_inspection')}
              />
            )}

            {/* SUB-SCENE: COMPOUND IRON GATE CLOSE-UP (CHAPTER 3) */}
            {phase3Location === 'compound_iron_gate' && (
              <CompoundGateInspectionView
                onReturn={() => setPhase3Location('hostel_outer_grounds')}
                setActiveMonologue={setActiveMonologue}
              />
            )}

            {/* SUB-SCENE: SUBTERRANEAN BICYCLE GARAGE (CHAPTER 3) */}
            {phase3Location === 'garage_subterranean' && (
              <GarageSubterraneanView
                onReturn={() => setPhase3Location('hostel_outer_grounds')}
                setActiveMonologue={setActiveMonologue}
              />
            )}

            {/* SUB-SCENE: BANYAN WELLHEAD & RIGGING (CHAPTER 3) */}
            {phase3Location === 'banyan_wellhead' && (
              <BanyanWellheadView
                onReturn={() => setPhase3Location('hostel_outer_grounds')}
                onNavigate={(destination) => setPhase3Location(destination as Phase3Location)}
                setActiveMonologue={setActiveMonologue}
              />
            )}

            {/* SUB-SCENE: DEEP WELL SHAFT & CASSETTE PUZZLE (CHAPTER 3) */}
            {phase3Location === 'well_interior_deep' && (
              <WellInteriorDeepView
                onReturn={() => setPhase3Location('banyan_wellhead')}
                onNavigate={(destination) => setPhase3Location(destination as Phase3Location)}
                setActiveMonologue={setActiveMonologue}
              />
            )}

            {/* SUB-SCENE: ROOM 101 SEANCE CLIMAX FLASHBACK (CHAPTER 3) */}
            {phase3Location === 'room_101_seance_flashback' && (
              <Room101SeanceClimaxView
                onComplete={() => {
                  setPhase3Location('seance_climax_flashback');
                  setActiveMonologue("— စိတ်ညှို့အိပ်မက်ထဲကနေ မိုးသည်းထန်နေတဲ့ ခြံဝင်းထဲ ပြန်လည်နိုးထလာခဲ့ပြီ၊ အခန်း ၁၀၁ ရဲ့ ကျိန်စာ ပျက်ပြယ်သွားခဲ့ပြီ။ —");
                  setTimeout(() => {
                    try {
                      sound.playPhaseComplete();
                    } catch {}
                    setIsChapter3TransitionOpen(true);
                  }, 1200);
                }}
                setActiveMonologue={setActiveMonologue}
              />
            )}

            {/* SCENE: SEANCE CLIMAX FLASHBACK / EPILOGUE */}
            {phase3Location === 'seance_climax_flashback' && (
              <InteractiveHotspot
                id="seance_climax_return_grounds"
                name="အပြင်ဘက် ခြံဝင်းသို့ ပြန်သွားရန်"
                x={0}
                y={0}
                width={100}
                height={100}
                shape="rect"
                cursorTooltip="[မိုးထဲစိုနေသော ခြံဝင်းသို့ ထွက်လာရန်]"
                onClick={() => {
                  sound.playPaperRustle();
                  try {
                    sound.playPhaseComplete();
                  } catch {}
                  setIsChapter3TransitionOpen(true);
                }}
              />
            )}

            {/* SUB-SCENE 4: COMMUNAL WASHROOM OVERVIEW */}
            {phase3Location === 'washroom_main' && (
              <>
                {/* 1. Cement Wash Basin & Soaked Uniforms (Left Side) */}
                <InteractiveHotspot
                  id="washroom_basin_trough"
                  name="ဘိလပ်မြေ လေလွှတ်စင်နှင့် စိုစွတ်နေသော ယူနီဖောင်းများ"
                  polygonPoints="12,55 18,55 34,73 9,80"
                  cursorTooltip="[လေလွှတ်စင်ကို စစ်ဆေးရန်]"
                  onClick={() => {
                    sound.playMenuSelect();
                    setPhase3Message(null);
                    setPhase3Location('washroom_basin');
                  }}
                />

                {/* 2. Third Cubicle Stall Door (Recessed Door Panel) */}
                <InteractiveHotspot
                  id="washroom_stall_cubicle"
                  name="တတိယအခန်း ဆိုးစင်တံခါး"
                  polygonPoints="48,30 57,26 56.5,77.5 48,74"
                  cursorTooltip="[သွေးစွန်းနေသော အခန်းကို စစ်ဆေးရန်]"
                  onClick={() => {
                    sound.playMenuSelect();
                    setPhase3Message(null);
                    setPhase3Location('washroom_stall');
                  }}
                />

                {/* 3. Ceiling Ropes & Drainage Pipe (Top Center) */}
                <InteractiveHotspot
                  id="washroom_overhead_pipe"
                  name="အပေါ်ပိုက်လုံးနှင့် ကြိုးခွေ"
                  x={60}
                  y={8}
                  width={8}
                  height={20}
                  shape="rect"
                  cursorTooltip="[အပေါ်ဘက်ကြိုးကို စစ်ဆေးရန်]"
                  onClick={() => {
                    sound.playMenuSelect();
                    setPhase3Message(null);
                    setPhase3Location('washroom_rope');
                  }}
                />

                {/* 4. Cracked Mirror & Sinks (Right Side) */}
                <InteractiveHotspot
                  id="washroom_cracked_mirror"
                  name="အက်နေသော နံရံမှန်နှင့် လေလွှတ်စင်များ"
                  polygonPoints="71,33 94,29 95,53 71,52"
                  cursorTooltip="[မှန်နှင့် လေလွှတ်စင်များကို စစ်ဆေးရန်]"
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
                  name="ရေပေါ်မျောနေသော ချည်အင်္ကျီအိတ်"
                  polygonPoints="60,50 66,50 68,66 57,66"
                  cursorTooltip={
                    !hasSmallBrassKey
                      ? '[စိုစွတ်နေသော အင်္ကျီအိတ်ကို ရှာဖွေရန်]'
                      : '[စိုစွတ်နေသော ယူနီဖောင်းအိတ် (ဗလာ)]'
                  }
                  onClick={() => {
                    if (!hasSmallBrassKey) {
                      addInventoryItem('small_brass_key_32');
                      setHasSmallBrassKey(true);
                      sound.playPaperRustle();
                      setActiveMonologue(
                        "— လွန်ခဲ့တဲ့ ၂၈ နှစ်ကတည်းက ရေစိုနေတဲ့ ရှပ်အင်္ကျီတွေ။နေပါဦး...ဒီအိတ်ကပ်ထဲမှာ မာတဲ့ပစ္စည်းတစ်ခုခု ထိုးထည့်ထားတာပဲ။—"
                      );
                    } else {
                      sound.playPaperRustle();
                      setActiveMonologue(
                        "— အိတ်ကပ်ထဲမှာ ဘာမှမရှိတော့ပါ။ ချုပ်ရိုးတွေကြားမှာ အေးစက်စိုစွတ်နေတဲ့ ရေညစ်တွေသာ ကျန်တော့သည်။ —"
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
                  name="သွေးစွန်းနေသော အခန်း သံယောင်"
                  polygonPoints="58,55 75,55 75,89 58,89"
                  cursorTooltip="[အခန်းသံယောင်နှင့် ဆံသိုင်းကြိုးကို စစ်ဆေးရန်]"
                  onClick={() => {
                    sound.playDramaticSting();
                    setActiveMonologue(
                      "—တံခါးဂျက်ပေါ်မှာ ခြောက်သွားတဲ့ သွေးကွက်တွေ ပြီးတော့ ငါ့လည်ပင်းပေါ်ကို အေးစက်စက်ကျလာတဲ့ ရေစက်တွေ။တစ်ယောက်ယောက်က အတင်းအပြင်ထွက်ဖို အသည်းအသန်ကြိုးစားခဲ့တာပဲ။—"
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
                  name="အပေါ်ဘက် ကြိုးခွေ"
                  polygonPoints="55,10 75,10 75,85 55,85"
                  cursorTooltip={
                    !hasNylonRope
                      ? '[နိုင်လွန်ကြိုးခွေကို ယူရန်]'
                      : '[ရေမြောင်းပိုက် (ကြိုးရယူပြီး)]'
                  }
                  onClick={() => {
                    if (!hasNylonRope) {
                      addInventoryItem('coiled_nylon_rope');
                      setHasNylonRope(true);
                      sound.playPaperRustle();
                      setActiveMonologue(
                        "—ခွေထားတဲ့ နိုင်လွန်ကြိုးခွေကြီး... ငါ့ကိုယ်အလေးချိန်လောက်တော့ ခံနိုင်လောက်တယ်—"
                      );
                    } else {
                      sound.playPaperRustle();
                      setActiveMonologue(
                        "— အပေါ်က ရေဆင်းပိုက်မှာ ဘာမှမရှိတော့ပါ။ မျက်နှာကျက်ကနေ တခြားဘာမှ တွဲလောင်းကျမနေတော့ပါ။ —"
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
                  name="မှန်အောက်ဘောင်"
                  polygonPoints="15,71 85,71 88,79 12,79"
                  cursorTooltip={
                    !washroomMirrorScratched
                      ? '[မှန်အောက်ဘောင်ကို သုတ်ရန်]'
                      : '[ခြစ်ရေးထားသော စာကို ဖတ်ရန်: လော့ကာ ၁၄ - ၁၉၉၈]'
                  }
                  onClick={() => {
                    setWashroomMirrorScratched(true);
                    addDiscoveredClue('mirror_locker_scrawl');
                    sound.playPaperRustle();
                    setActiveMonologue(
                      "—'လော့ကာ ၁၄ - ၁၉၉၈” လို့ ဘောင်ပေါ်မှာ ခြစ်ရေးထားတယ်။မှန်တွေ မကွဲခင် တစ်ယောက်ယောက်က ဒီစာကို ချန်ထားခဲ့တာပဲ။'—"
                    );
                  }}
                />
              </>
            )}

            {/* SUB-SCENE 5: EAST WING FORK - CHOICE CARDS */}
            {phase3Location === 'east_fork' && (
              <div className="absolute inset-0 flex items-center justify-center px-4 py-2 z-20 pointer-events-none">
                <div
                  className={`w-full grid gap-3 sm:gap-4 md:gap-5 pointer-events-auto items-center justify-center ${
                    currentChapter >= 2 && natAudienceConcluded
                      ? 'grid-cols-4 max-w-5xl lg:max-w-6xl'
                      : 'grid-cols-3 max-w-4xl lg:max-w-5xl'
                  }`}
                >
                  {/* Card A: Lockers */}
                  <RouteCard
                    sectorLabel="ကဏ္ဍ A • လော့ကာများ"
                    title="ကျောင်းသား လော့ကာခန်း"
                    description="၁၉၉၈ ခုနှစ်က သတ္တုလော့ကာများ။ မေ၊ စန္ဒာ နှင့် အိပ်ဆောင်နေသူများ၏ ပစ္စည်းများ။"
                    imagePath={PHASE_3_ASSETS.cardEastLockers}
                    onClick={() => {
                      sound.playMenuSelect();
                      setPhase3Message(null);
                      setPhase3Location('lockers_main');
                    }}
                  />

                  {/* Card B: Prayer Room */}
                  <RouteCard
                    sectorLabel="ကဏ္ဍ B • နတ်ကွန်း"
                    title="နတ်ကွန်းခန်းနှင့် စင်"
                    description="ပူဇော်ထည့်ခွက်များနှင့် နံ့သာပေါင်းတင်ရာစင်များရှိသော ရှေးဟောင်း မြန်မာ့နတ်ကွန်း။"
                    imagePath={PHASE_3_ASSETS.cardEastPrayer}
                    onClick={() => {
                      sound.playMenuSelect();
                      setPhase3Message(null);
                      setPhase3Location('prayer_room_main');
                    }}
                  />

                  {/* Card C: Caretaker Archive */}
                  <RouteCard
                    sectorLabel="ကဏ္ဍ C • မှတ်တမ်းခန်း"
                    title="အလုပ်သမား မှတ်တမ်းခန်း"
                    description="လေးလံသော ကြေးဝါ ဂဏန်း ၃ လုံးသော့ဖြင့် လုံခြုံထားသော အလုပ်သမား၏ သော့ခတ်ထားသည့် မှတ်တမ်းရုံးခန်း။"
                    imagePath={PHASE_3_ASSETS.cardEastCaretaker}
                    lockState={
                      currentChapter >= 2 || chapter1Completed
                        ? 'abandoned'
                        : caretakerDoorUnlocked
                        ? 'unlocked'
                        : 'locked'
                    }
                    onClick={() => {
                      sound.playMenuSelect();
                      setPhase3Message(null);
                      if (!caretakerDoorUnlocked && !(currentChapter >= 2 || chapter1Completed)) {
                        setPhase3Location('caretaker_door_keypad');
                      } else {
                        setPhase3Location('caretaker_office_main');
                      }
                    }}
                  />

                  {/* Card D: Pathway 326 (The Overlook Balcony) - Dynamically revealed when currentChapter >= 2 && natAudienceConcluded */}
                  <RouteCard
                    visible={currentChapter >= 2 && natAudienceConcluded}
                    sectorLabel="အဆောင်လမ်းသွယ် ၃၂၆"
                    title="ရှေ့မြင်ကွင်း ဝရန်တာ"
                    description="သော့ခလောက်ခတ်ထားသော မီးဘေးတံခါးကို အတင်းရဲရဲ ဖွင့်ထားသည်။ မုတ်သုံမိုးက အိမ်စွန်းများကို ပြင်းထန်စွာ ရိုက်ခတ်နေသည်။"
                    imagePath="/assets/scenes/balcony_rain_night.jpg"
                    isSpecial
                    onClick={() => {
                      try {
                        sound.playDoorPush();
                      } catch {
                        try {
                          sound.playDoorCreak();
                        } catch {
                          sound.playMenuSelect();
                        }
                      }
                      setPhase3Message(null);
                      setPhase3Location('balcony_326');
                    }}
                  />
                </div>
              </div>
            )}

            {/* SUB-SCENE 6: LOCKER BAY OVERVIEW */}
            {phase3Location === 'lockers_main' && (
              <LockersOverviewView
                hasSmallBrassKey={hasSmallBrassKey}
                hasKey14={inventory.includes('key_14')}
                inventory={inventory}
                locker14Unlocked={locker14Unlocked}
                setPhase3Location={setPhase3Location}
                setActiveMonologue={setActiveMonologue}
                setComposure={setComposure}
                setIsScreenShaking={setIsScreenShaking}
              />
            )}

            {/* ZOOM: LOCKER 32 INTERIOR */}
            {phase3Location === 'locker_32' && (
              <Locker32ZoomView
                setActiveMonologue={setActiveMonologue}
                setHasReadLocker32Note={setHasReadLocker32Note}
                setHasReadSandarLetters={setHasReadSandarLetters}
                addDiscoveredClue={addDiscoveredClue}
              />
            )}

            {/* ZOOM: LOCKER 09 INTERIOR */}
            {phase3Location === 'locker_09' && (
              <Locker09ZoomView
                hasLocker09Candle={hasLocker09Candle}
                hasLocker09Matchbox={hasLocker09Matchbox}
                setHasLocker09Candle={setHasLocker09Candle}
                setHasLocker09Matchbox={setHasLocker09Matchbox}
                setHasBlackCandlesCount={setHasBlackCandlesCount}
                setHasMatchesCount={setHasMatchesCount}
                setInventory={setInventory}
                setActiveMonologue={setActiveMonologue}
              />
            )}
            {phase3Location === 'locker_10' && (
              <Locker10InspectionView
                inventory={inventory}
                setInventory={setInventory}
                discoveredClues={discoveredClues}
                addDiscoveredClue={addDiscoveredClue}
                setActiveMonologue={setActiveMonologue}
                onReturn={() => setPhase3Location('lockers_main')}
              />
            )}

            {/* ZOOM: LOCKER 14 INTERIOR */}
            {(phase3Location === 'locker_14' || phase3Location === 'locker_14_interior') && (
              <Locker14InteriorView
                locker14Unlocked={locker14Unlocked}
                setLocker14Unlocked={setLocker14Unlocked}
                inventory={inventory}
                setInventory={setInventory}
                removeInventoryItem={removeInventoryItem}
                setPhase3Location={setPhase3Location}
                onReturn={() => setPhase3Location('lockers_main')}
                setActiveMonologue={setActiveMonologue}
                setRoomBanner={setRoomBanner}
                addDiscoveredClue={addDiscoveredClue}
              />
            )}

            {/* ZOOM: LOCKER SPIDERS */}
            {phase3Location === 'locker_spider' && (
              <>
                <InteractiveHotspot
                  id="locker_spider_retreat"
                  name="ခုတ်ပြေးနေသော မြေအောက်ခန်း ပင့်ကူများ"
                  x={0}
                  y={0}
                  width={100}
                  height={100}
                  shape="rect"
                  cursorTooltip="[အမြောက်အများ နှင့် ပြန်ဆုတ်ရန်]"
                  onClick={() => {
                    sound.playPaperRustle();
                    setPhase3Location('lockers_main');
                  }}
                />
              </>
            )}

            {/* SUB-SCENE 7: CARETAKER DOOR VINTAGE COMBINATION PADLOCK */}
            {phase3Location === 'caretaker_door_keypad' && (
              <CaretakerLockModal
                isOpen={true}
                composure={composure}
                setComposure={setComposure}
                setIsScreenShaking={setIsScreenShaking}
                failedAttempts={caretakerLockFailCount}
                setFailedAttempts={setCaretakerLockFailCount}
                onClose={() => {
                  sound.playPaperRustle();
                  setPhase3Location('east_fork');
                }}
                onUnlockSuccess={() => {
                  sound.playSuccessTune();
                  setCaretakerDoorUnlocked(true);
                  setActiveMonologue(
                    "— ဒေါင်! သတ္တုသံ ကျယ်လောင်စွာ မြည်ဟည်းသွားပြီး ဟောင်းနွမ်းနေတဲ့ ကြေးဝါသော့ခလောက် ပွင့်ကျသွားကာ အဆောင်မှူးရုံးခန်းတံခါး ပွင့်သွားသည်။ —"
                  );
                  setPhase3Location('caretaker_office_main');
                }}
                onCombinationAttemptFailed={(attemptCount = 1, penalty = 5) => {
                  if (attemptCount === 1) {
                    setActiveMonologue(
                      "— သော့ခလောက်က တကျွီကျွီမြည်ပြီး ဂျမ်းဖြစ်နေတယ်။ သတ္တုသားတွေ တင်းကျပ်စွာ စေ့နေသည်... ကျောချမ်းဖွယ် ကြောက်ရွံ့မှုလှိုင်းကြီး လွှမ်းမိုးသွားသည်။ (-၅% စိတ်တည်ငြိမ်မှု) —"
                    );
                  } else if (attemptCount === 2) {
                    setActiveMonologue(
                      "— ဒေါင်! သော့သွားတွေ တကျွီကျွီအော်မြည်ပြီး ခေါင်းမာစွာ တွန်းကန်နေသည်။ စင်္ကြံလမ်းတစ်လျှောက် အသံပဲ့တင်ထပ်သွားရာ ထိတ်လန့်တုန်လှုပ်မှုတွေ တိုးပွားလာသည်! (-၈% စိတ်တည်ငြိမ်မှု) —"
                    );
                  } else if (attemptCount === 3) {
                    setActiveMonologue(
                      "— တဆတ်ဆတ်တုန်ခါနေသော တွန်းကန်မှု! အေးစက်စိုစွတ်သော သံချေးပေါ် လက်ချောင်းများ ချော်ထွက်သွားသည်။ စိတ်ဓာတ်တွေ စတင်ပြိုလဲလာသည်! (-၁၁% စိတ်တည်ငြိမ်မှု) —"
                    );
                  } else {
                    setActiveMonologue(
                      `— လေးလံသော သော့ဂျက်ကြီး အပြင်းအထန် ဂျမ်းဖြစ်သွားသည်! အမှောင်ထုကြီးက ပိုမိုနီးကပ်လာသလို ခံစားရပြီး စိတ်ထဲတွင် ထိတ်လန့်ကြောက်ရွံ့မှု လွှမ်းမိုးသွားသည်... (-${penalty}% စိတ်တည်ငြိမ်မှု, အမှားအကြိမ် #${attemptCount}) —`
                    );
                  }
                }}
              />
            )}


            {/* SUB-SCENE 9: COMMUNAL PRAYER ROOM */}
            {phase3Location === 'prayer_room_main' && (
              <>
                <InteractiveHotspot
                  id="prayer_room_altar_approach"
                  name="အစောင့်နတ် စင်"
                  x={32}
                  y={10}
                  width={36}
                  height={66}
                  shape="rect"
                  cursorTooltip="[အစောင့်နတ်စင်သို့ ချဉ်းကပ်ရန်]"
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
                onNatDialogueActiveChange={setIsNatDialogueActive}
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
                hasConsultedNat={hasConsultedNat}
                setHasConsultedNat={setHasConsultedNat}
                addDiscoveredClue={addDiscoveredClue}
                discoveredClues={discoveredClues}
                setDiscoveredClues={setDiscoveredClues}
                askedTopics={askedNatTopics}
                setAskedTopics={setAskedNatTopics}
                natAudienceConcluded={natAudienceConcluded}
                setNatAudienceConcluded={setNatAudienceConcluded}
                currentChapter={currentChapter}
                setCurrentChapter={setCurrentChapter}
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
            hintText="[ဆက်လည်ရန် နေရာမရွေး နှိပ်ပါ]"
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
                    speakerName="မမမေ (၁၉၉၈)"
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
                  : '[၂၀၂၆ အဆောင် နတ်ဝင်ပွဲ — အခန်း ၄B]'
              }
              canRewind={
                (mode === 'phase1_2' && currentLineIndex > 0) ||
                (mode === 'investigating_location' && locLineIndex > 0)
              }
              onRewind={rewindDialogue}
              onAdvance={advanceDialogue}
              advanceActionText={
                mode === 'phase1_2' && currentP12Line.isClimax
                  ? 'အထွတ်အထိပ် စတင်ရန်'
                  : mode === 'investigating_location' &&
                    activeInvestigatingLoc &&
                    locLineIndex >= activeInvestigatingLoc.lines.length - 1
                  ? activeInvestigatingLoc.tier === 3 && activeInvestigatingLoc.isCorrectRoute
                    ? 'အမှန်တရား ဖော်ထုတ်ရန်'
                    : 'လမ်းများသို့ ပြန်သွားရန်'
                  : 'ဆက်လုပ်ရန်'
              }
            />
          </>
        )
      )}

      {/* Universal "ThoughtLine" Monologue Component for Object Examinations & Observations */}
      <ThoughtLine
        message={phase3Location !== 'prayer_altar' ? activeMonologue : null}
        onDismiss={() => setActiveMonologue(null)}
      />

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
                စုံစမ်းစစ်ဆေးမှု မှတ်တိုင်
              </span>
              <h3
                className="text-3xl sm:text-4xl font-black text-[#c2d6cc] tracking-wider uppercase mt-1 mb-1"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
              >
အခန်း ၁ ပြီးပြည့်စုံပြီ
              </h3>
              <p className="text-[#82a996] font-mono text-xs mb-2 font-bold">
                စုံစမ်းစစ်ဆေးသူ: {selectedCharacter.name.toUpperCase()} ({selectedCharacter.archetype.toUpperCase()})
              </p>

              <div className="grid grid-cols-2 gap-2 my-4 text-xs font-mono text-[#c2d6cc]">
                <div className="p-2.5 rounded-lg bg-[#18221d] border border-[#2c3d34]">
                  <div className="text-[10px] text-[#82a996]/70">စတင် စိတ်တည်ငြိမ်မှု</div>
                  <div className="text-[#c2d6cc] font-bold text-sm">{composure}%</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#18221d] border border-[#2c3d34]">
                  <div className="text-[10px] text-[#82a996]/70">အချိန် ကုန်ဆုံးသွားသည်</div>
                  <div className="text-[#c2d6cc] font-bold text-sm">
                    {Math.floor((600 - timeLeft) / 60)}m {(600 - timeLeft) % 60}s
                  </div>
                </div>
              </div>

              <p className="text-[#c2d6cc]/90 text-xs sm:text-sm font-mono mb-6 leading-relaxed">
                သင်သည် အစုအပုံလိုက် အဆင့်များရှိသည့် ၁၉၉၈ အဆောင်စင်္ကြံများကို ဖြတ်သန်းခဲ့ပြီး၊ အလုပ်သမား၏ လာဘ်ငွေမှတ်တမ်းကို ပြန်လည်ရယူကာ၊ သံကြိုးချည်ထားသော ရေခန်းခြောက်အင်းတွင် မမမေ၏ အလောင်းကို တွေ့ကြုံခဲ့ပြီး ဝင်းရှိ ရေတွင်းဟောင်း ကြေးသော့ကို ရယူခဲ့သည်။ သင့်စိတ်တည်ငြိမ်မှုသည် အခန်း ၂ တွင် သင့်စိတ်ဆန္ဒခွန်အားကို ဆုံးဖြတ်ပေးလိမ့်မည်!
              </p>

              <div className="p-3.5 rounded-xl bg-[#18221d]/70 border border-[#2c3d34] flex items-center justify-center gap-3 text-[#c2d6cc] text-sm font-mono mb-6">
                <Sparkles className="w-5 h-5 text-[#6ee7b7] animate-spin" />
                <span className="font-bold">အခန်း ၂: နားလည်မှု ယခု ဖွင့်လှစ်ပြီ!</span>
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
                  <span>အခန်း ၂ သို့ ဝင်ရန်</span>
                </button>

                <button
                  onClick={() => {
                    sound.playMenuSelect();
                    navigate('/chapters');
                  }}
                  className="py-3 px-5 rounded-xl bg-[#121815] hover:bg-[#18221d] text-[#82a996] hover:text-[#c2d6cc] border border-[#2c3d34] hover:border-[#4d6e5e] font-bold uppercase tracking-wider transition-all cursor-pointer"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", fontSize: '1.15rem' }}
                >
အခန်း ရွေးချယ်မှု
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8.4. Expandable Inventory Drawer Modal */}
      <InventoryDrawerModal
        isInventoryDrawerOpen={isInventoryDrawerOpen}
        setIsInventoryDrawerOpen={setIsInventoryDrawerOpen}
        inventory={inventory}
        onSelectItem={(itemId) => {
          sound.playPaperRustle();
          if (itemId === 'matchbox_three_stars' && phase3Location === 'prayer_altar' && altarCandlesPlaced < 3) {
            sound.playError();
            setActiveMonologue("— ယဇ်ပူဇော်မှု မပြည့်စုံသေးပါ။ မီးမညှိမီ ဖယောင်းတိုင် ၃ တိုင်ကို အရင်စိုက်ထူထားရမည်။ —");
          }
        }}
      />

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
                  alt="သံလိုက်အိမ်မြှောင်"
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
                    ရှေးဟောင်း သံလိုက်အိမ်မြှောင်
                  </h3>
                </div>

                <p className="text-xs sm:text-sm font-mono text-[#c2d6cc]/90 leading-relaxed">
                  N, E, S, W အမှတ်အသားများပါသော ရှေးဟောင်း ကြေးဝါ လမ်းညွှန်အိမ်မြှောင်။ ၎င်း၏ သံလိုက်အပ်သည် သဘာဝလွန် ထူးဆန်းမှုများဆီသို့ တုန်ခါညွှန်ပြနေသည်။
                </p>

                <div className="p-3.5 rounded-xl bg-[#18221d]/60 border border-[#2c3d34] text-xs font-mono text-[#c2d6cc] leading-relaxed space-y-1">
                  <div className="font-bold text-[#82a996] uppercase flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-[#6ee7b7] animate-pulse" />
                    <span>သဘာဝလွန် ဆွဲဆောင်မှု ဖော်ထုတ်တွေ့ရှိပြီ:</span>
                  </div>
                  <div className="text-[#c2d6cc]/90">
                    သံလိုက်အပ်သည် ကန္တာရ အကောင်းမွန် မဟုတ်ဘဲ တုန်ယင်နေပြီး၊ ကွေးနေသော မှန်ကို မှီတုန်ယင်ကာ သော့ခတ်ထားသော ခန်းတံခါးဆီသို့ မယုံနိုင်လောက်အောင် ဇွတ်ညွှန်ပြနေသည်။
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
                    အိမ်မြှောင်မြင်ကွင်းကို ပိတ်ရန်
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
                အချိန်ကာလ ရွှေ့ပြောင်းမှု ပြိုကျခဲ့သည်
              </span>
              <h3
                className="text-3xl sm:text-4xl font-black text-red-200 tracking-wider uppercase mt-1 mb-2"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
              >
                စုံစမ်းစစ်ဆေးမှု မအောင်မြင်ခဲ့ပါ
              </h3>

              <p className="text-[#c2a6a6] font-mono text-xs sm:text-sm mb-6 leading-relaxed">
                {timeLeft <= 0
                  ? '၁၀ မိနစ် အချိန်ကာလ ထပ်တူပြုခြင်း ကာလ ကုန်ဆုံးသွားသည်။ ၁၉၉၈ ဩဂုတ်လသို့ သင့်ကို ဆုံချည်ထားသော ကျောက်ဆူးသည် လေဟာနယ်ထဲတွင် ပျော်ဝင်သွားသည်။'
                  : 'သင်၏ စိတ်တည်ငြိမ်မှုသည် သဘာဝလွန် ကြောက်မက်ဖွယ်ရာများနှင့် အဆောင်၏ မွန်းကြပ်သော လေထုအောက်တွင် ပြိုကွဲသွားသည်။'}
              </p>

              <div className="w-full flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRestartChapterOne}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-900/80 hover:bg-red-800 text-red-100 border border-red-700 hover:border-red-500 font-mono font-bold tracking-wider text-xs uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>အခန်း ပြန်စရန်</span>
                </button>

                <button
                  onClick={() => navigate('/chapters')}
                  className="py-3 px-5 rounded-xl bg-[#161212] hover:bg-[#221a1a] text-stone-400 hover:text-stone-200 border border-stone-800 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  ခေါင်းစဉ်သို့ ပြန်သွားရန်
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
                တစ်ခုခု ငါ့နောက်က ရုတ်တရက် ဖြတ်ပြေးသွားတယ်...
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
                အခန်း ၀၁ ပြီးပြည့်စုံပြီ
              </div>

              <h2
                className="text-3xl sm:text-4xl font-black text-[#d1e3da] tracking-wider uppercase mb-2"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
              >
                မျက်စိမှိတ် အစမှတ် • ပြီးပြည့်စုံပြီ
              </h2>

              <p className="text-sm font-mono text-[#8fa89b] max-w-md mx-auto mb-6 leading-relaxed">
                "— မီးလျှံများ အေးစက်စက် အပြာရောင်ထွက်နေသည်... ကြေးခေါင်းလောင်းသံ ငါ့စိတ်ထဲ မြည်နေသည်။ အစောင့်နတ် နိုးထလာပြီ။ —"
              </p>

              <div className="p-4 rounded-xl bg-[#151f1a]/80 border border-[#223229] text-left text-xs font-mono text-[#b4c9bf] mb-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">အခြေအနေ:</span>
                  <span className="text-[#86af99] font-bold">အစောင့်နတ် နိုးထခဲ့သည်</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">စိတ်တည်ငြိမ်မှု ထိန်းသိမ်းနိုင်ခဲ့သည်:</span>
                  <span className="text-[#86af99] font-bold">{composure}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">လမ်းကြောင်း ဖွင့်လှစ်ပြီ:</span>
                  <span className="text-[#86af99] font-bold">အခန်း ၀၂ • ဝင်းထဲက တီးတိုးသံများ</span>
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
                  အခန်း ရွေးချယ်မှု →
                </button>
                <button
                  onClick={() => {
                    sound.playMenuSelect();
                    setChapter1VictoryActive(false);
                    handleRestartChapterOne();
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#151e19] hover:bg-[#1b2721] border border-[#283830] text-[#a1b8ac] text-xs font-mono tracking-wider uppercase transition-all cursor-pointer"
                >
                  အခန်း ၁ ပြန်ကစားရန်
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 14. Chapter Transition Modal (Chapter 1 -> Chapter 2 or Chapter 2 -> Chapter 3) */}
      <ChapterTransitionModal
        isOpen={isChapterTransitionOpen}
        overTitle="စုံစမ်းစစ်ဆေးမှု အဆင့် ပြီးစီးပြီ (အဆင့် ပြီးစီး)"
        completedChapterTitle={
          stairwayGateUnlocked || currentChapter === 2 || currentChapter === 3 || Boolean(chapter2Completed)
            ? 'အခန်း ၂ - အမှန်တရားကို နားလည်ခြင်း'
            : 'အခန်း ၁ - အစပြုစုံစမ်းခြင်း'
        }
        nextPhaseTag="နောက်တစ်ဆင့်သို့ ကူးပြောင်းနေသည်"
        nextChapterTitle={
          stairwayGateUnlocked || currentChapter === 2 || currentChapter === 3 || Boolean(chapter2Completed)
            ? 'အခန်း ၃ - လွတ်မြောက်ခြင်း / အဆောင်အပြင်ဘက်ဝင်း'
            : 'အခန်း ၂ - အမှန်တရားကို နားလည်ခြင်း'
        }
        continueButtonText="စုံစမ်းစစ်ဆေးမှု ဆက်လုပ်မည် →"
        saveButtonText="သိမ်းဆည်းပြီး အခန်းရွေးချယ်မှုသို့ ပြန်ထွက်မည်"
        onContinue={
          stairwayGateUnlocked || currentChapter === 2 || currentChapter === 3 || Boolean(chapter2Completed)
            ? handleContinueToChapterThree
            : handleContinueToChapterTwo
        }
        onContinueToChapterTwo={handleContinueToChapterTwo}
        onSaveAndExit={handleSaveAndExit}
      />

      {/* 15. Chapter 3 Completion Modal (Game Complete) */}
      <ChapterTransitionModal
        isOpen={isChapter3TransitionOpen}
        isFinalChapter={true}
        overTitle="စုံစမ်းစစ်ဆေးမှု အဆင့် ပြီးစီးပြီ (အဆင့် ပြီးစီး)"
        completedChapterTitle="အခန်း ၃ ပြီးစီးပြီ"
        saveButtonText="ပြီးဆုံးပြီ / ထွက်မည်"
        onFinish={handleFinishChapterThree}
        onSaveAndExit={handleFinishChapterThree}
      />
    </div>
  );
};
