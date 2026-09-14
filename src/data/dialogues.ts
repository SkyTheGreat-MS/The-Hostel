/**
 * Canonical Dialogue and Monologue Script Registry
 * Pure script strings for Nat, May, and inner thought monologues.
 * Components should import from here rather than hardcoding strings inline.
 */

/** Inner thought monologue lines triggered by specific game actions */
export const MONOLOGUE_LINES = {
  BALCONY_RETURN_FROM_BENCH:
    '--- မိုးပက်နေသော လသာဆောင်မှထွက်ကာ အရှေ့လမ်းခွဲ စင်္ကြံထဲသို့ ပြန်ရောက်လာသည်။ ---',
  BALCONY_RADIO_STATIC_DISSOLVE:
    '--- The harsh static dissolves into an acoustic melody... echoing out into the monsoon rain. ---',
  RADIO_NO_POWER:
    "--- No power. The frequency needle won't move until batteries are installed. ---",
  RADIO_BATTERY_COMPARTMENT_POWERED:
    '--- Two zinc-carbon batteries are fitted tightly into the coils. The power circuit is closed. ---',
  RADIO_BATTERY_COMPARTMENT_EMPTY:
    '--- The compartment is empty. The contact springs are dry. It takes two heavy D-cell batteries to operate. ---',
  RADIO_BATTERIES_INSERTED:
    '--- The springs bite into the terminals. Faint hum vibrates through the speaker grille. ---',
  LOCKER_32_LOCKED: 'လော့ကာ ၃၂ ကို သော့ခတ်ထားသည်။ သော့ပေါက်သည် သေးငယ်ပြီး ကြေးဝါရောင်ဖြစ်သည်။',
  CORRIDOR_SHADOW_SCARE:
    '--- စင်္ကြံမျက်နှာကြက်ပေါ်တွင် အရိပ်မည်းကြီးတစ်ခု ဖြတ်ပြေးသွားသည်! သံပိုက်ကြီးများ အသံမြည်သွားသည်... (စိတ်တည်ငြိမ်မှု -၅%) ---',
  LOCKER_09_EMPTIED:
    '--- Locker 09 is emptied. The remaining shelves hold only damp insect droppings and rusted shelf pins. ---',
  SPIDER_SCARE:
    '--- Gah! Scurrying cellar spiders spill from behind the rusted vent slats! (-2% Composure) ---',
  CARETAKER_RETURN_TO_FORK:
    '--- မွန်းကျပ်ဖွယ်ကောင်းသော ရုံးခန်းထဲမှထွက်ကာ စိုစွတ်နေသော စင်္ကြံလမ်းခွဲဆီသို့ ပြန်ရောက်လာသည်။ ---',
  LOCKER_10_BATTERY_FOUND:
    '--- Two heavy D-cell batteries, still sealed in their packaging. The exercise book beside them is water-stained. ---',
  // Room 4B Desk Letter Loot Chain
  DESK_MUG_MOVED:
    '--- စတီးကြွေခွက်ကို ဖယ်လိုက်သောအခါ သစ်သားဖြင့်ဖိထားသော ခေါက်ထားသည့် မျဉ်းကျားစာရွက်တစ်ရွက်ကို တွေ့ရသည်။ ---',
  DESK_LETTER_TEXT:
    'မေ — ကိုယ်တို့ပြောထားတဲ့ နေရာမှာ တိပ်ခွေထားခဲ့တယ်... — ကိုဇော်',
  DESK_LETTER_LOOTED:
    '— "စာကို ကျွန်တော့် အင်္ကျီအိတ်ကပ်ထဲ လုံခြုံစွာ ထည့်ထားလိုက်ပြီ..." —',
  DESK_SURFACE_EMPTY:
    '— "စာကို ကျွန်တော့် အင်္ကျီအိတ်ကပ်ထဲ လုံခြုံစွာ ထည့်ထားလိုက်ပြီ..." —',
  // Spectral May Balcony Handover & Key 14
  MAY_PANIC_MISSING_LETTER:
    '— "သူမ တက်လာနေပြီ... စိုနေတဲ့ကြမ်းပြင်ပေါ်က သူမရဲ့ ဖိနပ်သံကို ငါကြားနေရတယ်... စန္ဒာ သူ့လက်ရေးကို မြင်သွားလိမ့်မယ်... သူမ သိသွားလိမ့်မယ်။" —',
  MAY_HANDOVER_RELIEF:
    '— "သူ တကယ်ပဲ ငါ့အတွက် ထားခဲ့တာပဲ... ဒါဆို သူမ ဘယ်တော့မှ ဖတ်ဖြစ်မှာ မဟုတ်ဘူး။ သူမ သိစရာ အကြောင်းမရှိတော့ဘူး။" —',
  KEY_14_PICKUP:
    '— "\'၁၄\' လို့ တံဆိပ်ရိုက်နှိပ်ထားတယ်။ ဒါ အိပ်ဆောင်ဘေးက လော့ကာ ၁၄ ရဲ့ သော့ပဲ။" —',
  // Locker 14 Padlock Unlock & Interior
  LOCKER_14_LOCKED_NO_KEY:
    '— "Locked tight with a small barrel cylinder. May\'s personal locker... the key is nowhere here." —',
  LOCKER_14_UNLATCH_SUCCESS:
    '— "The shackle pops loose with a dull click. The door swings open." —',
  // Locker 14 Interior Gate Key Looting
  STAIRWAY_GATE_KEY_ACQUIRED:
    '— [ITEM ACQUIRED: Stairway Gate Key] — A heavy, blackened iron key. Ko Zaw must have hidden this here so May could bypass the curfew gate to reach the terrace. —',
  STAIRWAY_GATE_KEY_ALREADY_TAKEN:
    '— The iron key has already been taken. Only rust rings remain on the shelf. —',
  // Stairway Exit Accordion Gate & Chapter 3 Escape
  STAIRWAY_GATE_LOCKED_NO_KEY:
    '— "သံချေးတက်နေသော သံကြိုးတုတ်ကြီးများဖြင့် တင်းကျပ်စွာ ချည်နှောင်ထားသည့် လေးလံသော ကြေးဝါသော့ခလောက်ကြီး..." —',
  STAIRWAY_GATE_UNLOCKED_SUCCESS:
    '— "The iron key turns with a sharp snap. The rusted chains fall away, and the accordion gate slides open to the cold night air and the stairwell leading out into the rain." —',
  OUTER_GROUNDS_ENTRY:
    '— Stepped through the unlocked gate into the torrential monsoon downpour. The hostel walls tower behind... but the outer compound gate stands ahead. —',
} as const;

/** Nat guardian spirit canonical dialogue responses, keyed by topic ID */
export const NAT_DIALOGUE = {
  may_identity:
    "သူမရဲ့နာမည်က မေ...",
  locker_14_key:
    'သော့ကို မီးဖိုထဲ ပစ်ထည့်လိုက်တယ်...',
  broken_locket:
    'ဖြေလျော့စေတဲ့ ဆွဲသီး...',
  warden_ledger:
    '...သေတတ်သူ အရာရှိတွေရဲ့ မင်ရည်...',
  banyan_well:
    '...အမြစ်တွေအောက်က ခြောက်သွေ့နေတဲ့ ပါးစပ်ကို နာမည်ခေါ်လို့ မရဘူး!...',
} as const;
