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
    title: 'ကြေးမုံ-ရေတွင်း ကတိစာချုပ် (၁၉၉၈ မှတ်စု)',
    location: '၂၀၂၆ ဝိညာဉ်ခေါ်ခန်း',
    category: 'primary',
    description:
      '၁၉၉၈ ခုနှစ် အဆောင်ဝိညာဉ်များကို ဆင့်ခေါ်သည့် နတ်တင်ပွဲမှတ်တမ်း ပါရှိသော ကျောင်းသားမှတ်စုဟောင်း။ ကန်တော့ပွဲ လက်ဖက်ရည်ခွက်နှင့် ဝိညာဉ်ခေါ် စာလုံးသင်ပုန်း အကြောင်း ရေးသားထားသည်။',
  },
  missing_notice: {
    id: 'missing_notice',
    title: 'ပျောက်ဆုံးကျောင်းသူ သတိပေးစာ - မမမေ',
    location: 'စင်္ကြံလမ်း ၃၂၆ (အခန်း ၃၀၄ တံခါး)',
    category: 'primary',
    description:
      '၁၉၉၈ ခုနှစ် သြဂုတ်လ တရားဝင် ပျောက်ဆုံးသူကြော်ငြာစာ။ ဘေးနားရှိ တံခါးဘောင်ပေါ်တွင် လက်သည်းဖြင့် ပြင်းထန်စွာ ကုတ်ခြစ်ထားသည့် ဒဏ်ရာများအရ သူမသည် ဤစင်္ကြံထဲ၌ ရက်စက်စွာ လိုက်လံတိုက်ခိုက်ခံခဲ့ရကြောင်း သိသာစေသည်။',
  },
  bribe_ledger: {
    id: 'bribe_ledger',
    title: 'အဆောင်မှူး၏ ၅၀၀၀ ကျပ် လာဘ်ငွေပြေစာ',
    location: 'အဆောင်မှူး မှတ်တမ်းဟောင်းခန်း',
    category: 'primary',
    description:
      '၁၉၉၈ ခုနှစ် သြဂုတ်လ ၁၄ ရက်စွဲပါ လက်ရေးဖြင့် ရေးထားသော ငွေလက်ခံပြေစာ။ အဆောင်ဝင်းထဲက ခန်းခြောက်နေသော ရေတွင်းကို ကွန်ကရစ်လောင်းပြီး သံကြိုးများဖြင့် တုပ်နှောင်ရန် အဆောင်မှူးသည် ကျပ်ငွေ ၅,၀၀၀ လာဘ်ငွေလက်ခံခဲ့သည်။',
  },
  well_key: {
    id: 'well_key',
    title: 'အဆောင်ဝင်း ရေတွင်းဟောင်း ကြေးဝါသော့',
    location: 'အဆောင်ဝင်း နတ်စင်',
    category: 'item',
    description:
      'ဂဏန်းဝှက်သင်္ကေတများ ထွင်းထုထားသော ရှေးဟောင်းသော့ကြီးတစ်ချောင်း။ အခန်း ၂ တွင် ခန်းခြောက်နေသော ရေတွင်းအခန်းကို ဖွင့်ရန် မမမေ၏ ဝိညာဉ်ရိပ်မှ ပေးအပ်ခဲ့ခြင်း ဖြစ်သည်။',
  },
  curfew_log: {
    id: 'curfew_log',
    title: 'သော့ခတ်ထားသော ညမထွက်ရ မှတ်တမ်းစာအုပ်',
    location: 'အရှေ့ဘက်လှေကားခွင်',
    category: 'side',
    description:
      'မမမေ ပျောက်ဆုံးသွားသည့်ညက အရှေ့ဘက်အရေးပေါ်ထွက်ပေါက်ကို ည ၁၁:၄၅ တွင် အပြင်ဘက်မှ သော့ခတ်ပိတ်ဆို့ထားခဲ့ပြီး အဆောင်တွင်းမှ ကျောင်းသူများ ထွက်ပြေးခွင့် မရအောင် ဖြတ်တောက်ခဲ့ကြောင်း ရေးသားထားသည်။',
  },
  jasmine_hairpin: {
    id: 'jasmine_hairpin',
    title: 'သွေးစွန်းနေသော စံပယ်ဆံထိုး',
    location: 'အများသုံး ရေချိုးခန်း',
    category: 'side',
    description:
      'အမည်းရောင်ခြောက်သွေ့နေသော သွေးများ စွန်းထင်းနေသည့် အရိုးဆံထိုး။ သူမအား ဆွဲခေါ်မသွားမီ အပြင်းအထန် ရုန်းကန်တိုက်ခိုက်စဉ် ကွဲကြေနေသော မှန်ရှေ့၌ ပြုတ်ကျကျန်ရစ်ခဲ့ခြင်း ဖြစ်သည်။',
  },
  study_notes: {
    id: 'study_notes',
    title: 'နတ်ချုပ် မန္တန်ကားချပ်',
    location: 'စွန့်ပစ်ထားသော စာကြည့်ဆောင်',
    category: 'side',
    description:
      'မကျွတ်မလွတ် မငြိမ်မသက်ဖြစ်နေသော ဝိညာဉ်တစ်ခုကို တစ်နေရာတည်းတွင် ချုပ်နှောင်ထားရန် မြန်မာ့အစောင့်အရှောက်နတ်များကို သွေးသစ္စာပြု ချည်နှောင်ပုံ ရှင်းပြထားသည့် မြေဖြူရေးဆွဲချက်များ။',
  },
  boiler_concrete: {
    id: 'boiler_concrete',
    title: 'ပန်းရံသုတ်သင်ပုန်းနှင့် အခြောက်မြန်ကွန်ကရစ်',
    location: 'မြေအောက် ရေနွေးငွေ့ခန်းပေါက်',
    category: 'side',
    description:
      'အဆောင်ဝင်း ရေတွင်းဟောင်းကို ပိတ်ဆို့ရာတွင် သုံးခဲ့သည့် အင်္ဂတေနမူနာနှင့် ထပ်တူကျနေသော ဘိလပ်မြေအကြွင်းအကျန်များ။ ဆောက်လုပ်ရေးပစ္စည်းများကို အဆောင်မြေအောက်ခန်းတွင် သိမ်းဆည်းခဲ့ကြောင်း သက်သေထူနေသည်။',
  },
  roster_slip_1998: {
    id: 'roster_slip_1998',
    title: 'သန့်ရှင်းရေး တာဝန်ကျစာရင်း (သြဂုတ် ၁၉၉၈)',
    location: 'အခန်း ၄-ဘီ (စာရေးခုံ)',
    category: 'primary',
    description:
      '၁၉၉၈ ခုနှစ် သြဂုတ်လ သန့်ရှင်းရေးတာဝန်ကျစာရင်းဖြစ်ပြီး အခန်း ၄-ဘီ အား ကျောင်းသူ မေ နှင့် စန္ဒာ တို့ထံ တာဝန်ပေးအပ်ထားသည်။',
  },
  clue_may_letter: {
    id: 'clue_may_letter',
    title: 'ကိုဇော် ၏ ခေါက်ထားသောစာလွှာ',
    location: 'အခန်း ၄-ဘီ (စာကြည့်ခုံ)',
    category: 'primary',
    description:
      'မေ ၏ လော့ကာသော့ကို စန္ဒာ့ထံ မပေးရန် သတိပေးထားပြီး အခန်း ၃၂၆ လေဝင်ပေါက်နောက်ကွယ်တွင် တိတ်ခွေတစ်ခု ဝှက်ထားကြောင်း ဖွင့်ဟထားသည့် ကိုဇော် ထံမှ လျှို့ဝှက်စာလွှာ။',
  },
  clue_key_14: {
    id: 'clue_key_14',
    title: 'သော့ ၁၄ (ကြေးဝါသော့ဟောင်း)',
    location: 'စင်္ကြံလမ်း ၃၂၆ (ဝရန်တာ)',
    category: 'primary',
    description:
      'ဝရန်တာမှ ကောက်ယူရရှိခဲ့သော သော့ ၁၄။ အဆောင်ခန်းတွင်းရှိ လော့ကာ ၁၄ နှင့် သက်ဆိုင်သည်။',
  },
  curfew_calendar_1998: {
    id: 'curfew_calendar_1998',
    title: '၁၉၉၈ သြဂုတ် နံရံကပ်ပြက္ခဒိန်',
    location: 'အခန်း ၄-ဘီ (နံရံ)',
    category: 'side',
    description:
      'ညမထွက်ရ အဆောင်ပိတ်သိမ်းခြင်း မှတ်စုများနှင့်အတူ သြဂုတ်လ ၁၄ ရက်နေ့ကို ဝိုင်းထားသော ၁၉၉၈ ခုနှစ် နံရံကပ်ပြက္ခဒိန်။',
  },
  washroom_stall_echo: {
    id: 'washroom_stall_echo',
    title: 'ရေချိုးခန်းအခန်းတွင်း သွေးစွန်းမှုနှင့် ပဲ့တင်သံ',
    location: 'အများသုံး ရေချိုးခန်း (အခန်း ၃)',
    category: 'primary',
    description:
      'တတိယမြောက် ရေချိုးခန်းတွင်း၌ သွေးစွန်းနေသော အစွန်းအထင်းများနှင့် သွေးရောင်ကျောင်းသူ ဆံစည်းကြိုးဘေးတွင် ကွဲကြေနေသော အိတ်ဆောင်မှန်ငယ်တစ်ခု တွေ့ရသည်။',
  },
  mirror_locker_scrawl: {
    id: 'mirror_locker_scrawl',
    title: 'ရေချိုးခန်းမှန်ပေါ် ထွင်းခြစ်ထားသော စာ',
    location: 'အများသုံး ရေချိုးခန်း (မှန်)',
    category: 'side',
    description:
      "ရေချိုးခန်းမှန်ဘောင်အောက်ခြေတွင် မြေဖြူဖြင့် ကုတ်ခြစ်ထားသော အမှတ်အသား - 'Locker 14 - 1998'။",
  },
  cipher_note_32: {
    id: 'cipher_note_32',
    title: 'အဆောင်မှူးရုံးခန်း လျှို့ဝှက်ကုဒ်မှတ်စု',
    location: 'လော့ကာ ၃၂ (စန္ဒာ)',
    category: 'primary',
    description:
      "တရားဝင် အဆောင်ထိန်းသိမ်းရေး စာရွက်ငယ် - 'အဆောင်မှူးရုံးခန်း အီလက်ထရွန်းနစ် သော့ခလောက် ကုဒ် - 8 1 4 0 9 2.' (Warden Office Electronic Push-Latch Overwrite: 8 1 4 0 9 2. Caretaker mirrors all sequence inputs for emergency security.) မှတ်ချက် - အရေးပေါ်လုံခြုံရေးအတွက် အဆောင်မှူးသည် ကုဒ်အားလုံးကို ပြောင်းပြန် (mirror) ရိုက်ထည့်ရန် စီစဉ်ထားသည်။",
  },
  sandar_kozaw_letters: {
    id: 'sandar_kozaw_letters',
    title: 'ခေါက်ထားသော အချစ်စာလွှာများ (K.Z.)',
    location: 'လော့ကာ ၃၂ (စန္ဒာ)',
    category: 'primary',
    description:
      "စန္ဒာ (Sandar) ထံ လိပ်မူပြီး 'K.Z.' ဟု လက်မှတ်ရေးထိုးထားသော ခေါက်ထားသည့် စာလွှာများ... 'Sandar, လက်ဖက်ရည်ဆိုင် (tea shop) သွားတဲ့ကိစ္စကို မေ ရိပ်မိနေပြီ။ ငါတို့အကြောင်း မေ သိသွားရင် ငါတို့နှစ်ယောက်စလုံး ဒီအဆောင်မှာ ဆက်နေလို့ မရတော့ဘူး။' မမမေ ၏ နောက်ကွယ်မှ သစ္စာဖောက်မှုကို ဖော်ထုတ်ပြသနေသည်။",
  },
  nat_testimony_may_murder: {
    id: 'nat_testimony_may_murder',
    title: "နတ်သက်သေထွက်ဆိုချက် - မေ ၏ လူသတ်မှု",
    location: 'အစောင့်နတ်စင်',
    category: 'primary',
    description:
      '[NOTE: May was strangled inside the hostel during monsoon term 1998.] အစောင့်နတ်က သူမနာမည် မေ ဖြစ်ကြောင်း၊ အဆောင်မှူး အချစ်တော်ဖြစ်ပြီး မိုးရာသီအမှောင်ထုထဲတွင် လည်ပင်းညှစ်သတ်ဖြတ်ခံခဲ့ရကြောင်း အတည်ပြုခဲ့သည်။',
  },
  nat_testimony_locker_key: {
    id: 'nat_testimony_locker_key',
    title: 'နတ်သက်သေထွက်ဆိုချက် - လော့ကာ ၁၄ သော့',
    location: 'အစောင့်နတ်စင်',
    category: 'side',
    description:
      '[NOTE: Nat claimed the key was incinerated behind the mess hall. DEDUCTION: Contradicts Locker 32 notes confirming May carries the key around her neck—a deliberate deceit.] နတ်က သော့ကို ထမင်းစားဆောင်နောက်တွင် မီးရှို့ဖျက်ဆီးခဲ့သည်ဟု ဆိုသော်လည်း လော့ကာ ၃၂ မှတ်စုအရ မေ သည် သော့ကို လည်ပင်းတွင် ဆွဲထားလေ့ရှိသည်ဟု ဆိုထားသဖြင့် တမင်လှည့်စားထားခြင်း ဖြစ်သည်။',
  },
  nat_testimony_office_attack: {
    id: 'nat_testimony_office_attack',
    title: 'နတ်သက်သေထွက်ဆိုချက် - အဆောင်မှူးရုံးခန်း တိုက်ခိုက်မှု',
    location: 'အစောင့်နတ်စင်',
    category: 'primary',
    description:
      '[NOTE: May mistakes anyone in the office for her killer until calmed.] စိတ်ငြိမ်မသွားမချင်း မေ သည် ရုံးခန်းထဲရှိ မည်သူ့ကိုမဆို သူမ၏ လူသတ်သမားဟု အထင်မှားနေသည်။ သူမ၏ လည်ပင်း၌ စွပ်စွဲခံရသော အရှက်တရားများ မလွတ်မြောက်သရွေ့ သက်ရှိလူသားတိုင်းကို သူမ၏ လူသတ်သမားဟု ထင်မှတ်နေမည်။',
  },
  nat_testimony_banyan_well: {
    id: 'nat_testimony_banyan_well',
    title: 'နတ်သက်သေထွက်ဆိုချက် - ညောင်ပင် ရေတွင်းဟောင်း',
    location: 'အစောင့်နတ်စင်',
    category: 'side',
    description:
      '[NOTE: The dry mouth beneath the banyan tree cannot be spoken of. To name the pit is to drown within it.] ညောင်ပင်အောက်ရှိ ခြောက်သွေ့သော တွင်းပေါက်အကြောင်း မပြောသင့်ပေ။ ထိုတွင်းနက်ကို အမည်တပ်မိပါက ထိုတွင်းထဲသို့ နစ်မြုပ်သွားလိမ့်မည်။',
  },
  clue_locker_14_found: {
    id: 'clue_locker_14_found',
    title: 'လော့ကာ ၁၄ စည်ပုံစံသော့ခလောက်',
    location: 'အဆောင် လော့ကာများ',
    category: 'side',
    description: 'မေ ၏ ကိုယ်ပိုင်လော့ကာ ၁၄ ကို သော့ခလောက်ဖြင့် ခတ်ထားသည်။ သော့ ပျောက်ဆုံးနေသည်။',
  },
  clue_broken_locket_found: {
    id: 'clue_broken_locket_found',
    title: 'ကျိုးပဲ့နေသော ကျောက်စိမ်း အပိုင်းအစ',
    location: 'အဆောင်ဝင်း မြေပြင်',
    category: 'item',
    description: 'ယတြာလော့ကတ်သီးတစ်ခုမှ ကျိုးပဲ့ထွက်ကျလာသော ကျောက်စိမ်း အပိုင်းအစ။',
  },
  clue_warden_notes_found: {
    id: 'clue_warden_notes_found',
    title: 'အဆောင်မှူး၏ လျှို့ဝှက်စာရင်းစာအုပ်',
    location: 'အဆောင်မှူး မှတ်တမ်းဟောင်းခန်း',
    category: 'side',
    description: 'အဆောင်မှူး သိမ်းဆည်းထားသော လာဘ်ငွေမှတ်စုများနှင့် ဝှက်ထားသော ပြေစာများ။',
  },
  clue_well_rumor: {
    id: 'clue_well_rumor',
    title: 'ညောင်ပင်ရေတွင်း သတင်းစကားများ',
    location: 'အဆောင်ဝင်း မြေပြင်',
    category: 'side',
    description: 'ညောင်ပင်မြစ်ဆုံအောက်ရှိ ခန်းခြောက်နေသော ရေတွင်းအကြောင်း ကျောင်းသူများကြား ပျံ့နှံ့နေသည့် အယူသည်းသော ကောလာဟလများ။',
  },
  clue_ko_zaw_letters: {
    id: 'clue_ko_zaw_letters',
    title: 'ခေါက်ထားသော အချစ်စာလွှာများ (ကိုဇော်)',
    location: 'လော့ကာ ၃၂ (စန္ဒာ)',
    category: 'primary',
    description: 'အဆောင်သူညီအစ်မနှစ်ဦးကြား သွေးထွက်သံယို အမုန်းတရားများ ဖြစ်ပေါ်စေခဲ့သည့် စန္ဒာ နှင့် ကိုဇော် တို့၏ လျှို့ဝှက်အချစ်ဇာတ်လမ်းကို ဖော်ထုတ်ထားသည့် စာလွှာများ။',
  },
  clue_stairway_key_found: {
    id: 'clue_stairway_key_found',
    title: 'လှေကားတံခါးသော့',
    location: 'လော့ကာ ၁၄ (မမမေ)',
    category: 'item',
    description:
      'မေ ၏ လော့ကာ အောက်ထပ်စင်ပေါ်တွင် တွေ့ရသည့် သံမည်းသော့ကြီးတစ်ချောင်း။ မေ အနေဖြင့် ညမထွက်ရတံခါးကို ကျော်ဖြတ်ပြီး ဝရန်တာသို့ ရောက်နိုင်ရန် ကိုဇော် က ဤနေရာ၌ ဝှက်ထားပေးခဲ့ခြင်း ဖြစ်သည်။',
  },
  clue_physics_chem_notes_1998: {
    id: 'clue_physics_chem_notes_1998',
    title: 'ရူပဗေဒနှင့် ဓာတုဗေဒ မှတ်စုများ (၁၉၉၈)',
    location: 'စာကြည့်ခုံ',
    category: 'side',
    description: 'တုန်လှုပ်နေသော လက်ဖြင့် ရေးသားထားသည့် ဖော်မြူလာများ။ စင်္ကြံလမ်းကို ပိတ်ဆို့မခံရမီ ညမထွက်ရတံခါးကို ကျော်ဖြတ်ပြီး ထွက်ပြေးရန် မေ သည် သူမ၏ နောက်ဆုံးစာကျက်ချိန်များ၌ ကြံစည်ရေးဆွဲခဲ့သည်။',
  },
  clue_banyan_well: {
    id: 'clue_banyan_well',
    title: 'ခန်းခြောက်နေသော ညောင်ပင်ရေတွင်း',
    location: 'အဆောင်ဝင်း မြေပြင်',
    category: 'primary',
    description: 'ညောင်ပင်ကြီးအောက်ရှိ တားမြစ်ထားသော ခန်းခြောက်ရေတွင်းဟောင်း။ သစ်မြစ်များသည် အမှောင်ထုထဲမှ အရာများကို စုပ်ယူထားသလို ရှိနေသည်။',
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
    if (comp >= 75) return { text: 'တည်ငြိမ်သည် (STEELY)', color: 'text-emerald-400', ring: '#10b981', pct: comp };
    if (comp >= 50) return { text: 'မငြိမ်မသက်ဖြစ် (UNSETTLED)', color: 'text-amber-400', ring: '#f59e0b', pct: comp };
    if (comp >= 25) return { text: 'ထိတ်လန့်တုန်လှုပ် (PANICKED)', color: 'text-orange-400', ring: '#f97316', pct: comp };
    return { text: 'ကြောက်ဒူးတုန် (TERRIFIED)', color: 'text-rose-500', ring: '#ef4444', pct: comp };
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
                  အမှုတွဲမှတ်တမ်း &bull; သြဂုတ် ၁၉၉၈ ဖြစ်ရပ် (CASE FILE)
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-black text-[#d4ede3] tracking-[0.15em] uppercase leading-none"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                >
                  စုံစမ်းစစ်ဆေးမှု မှတ်စုစာအုပ်
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
              title="မှတ်စုစာအုပ် ပိတ်ရန် [ESC]"
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
                    <div className="text-[9px] font-mono tracking-[0.15em] text-[#00ffb4]/40 uppercase">စုံစမ်းစစ်ဆေးသူ (Investigator)</div>
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
                  စစ်ဆေးအတည်ပြုပြီး &bull; လက်ရှိအမှုတွဲ
                </div>
              </div>

              {/* Composure Gauge — Circular Radial Ring */}
              <div className="rounded-xl border border-[#2a3a30]/80 p-4 flex flex-col items-center gap-3"
                style={{ background: 'linear-gradient(135deg, #162018 0%, #1a2520 100%)' }}>
                <div className="text-[9px] font-mono tracking-[0.15em] text-[#00ffb4]/40 uppercase">
                  စိတ်တည်ငြိမ်မှု (Composure)
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
                  ကျန်ရှိသော အချိန် (Remaining Time)
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
                      ရရှိထားသော သဲလွန်စများ (Clues)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#00ffb4]/30">
                    {filledSlots} / {totalSlots} ကွက်လပ် ဖြည့်ပြီး
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
                  အခန်း ၂ သို့ ကူးပြောင်းရန် အရေးကြီးသော သက်သေများကို ရှာဖွေပါ
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
                      သဲလွန်စများ မတွေ့ရှိသေးပါ။ အဆောင်စင်္ကြံများနှင့် မှတ်တမ်းဟောင်းခန်းများတွင် အထောက်အထားများ ရှာဖွေပါ။
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
              အမှုတွဲမှတ်စု &bull; လုံခြုံရေးချန်နယ် (Case Notebook)
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
              <span className="relative z-10">စုံစမ်းစစ်ဆေးမှု ဆက်လုပ်မည်</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
