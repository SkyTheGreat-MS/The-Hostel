/**
 * Canonical Dialogue and Monologue Script Registry
 * Pure script strings for Nat, May, and inner thought monologues.
 * Components should import from here rather than hardcoding strings inline.
 */

/** Inner thought monologue lines triggered by specific game actions */
export const MONOLOGUE_LINES = {
  BALCONY_RETURN_FROM_BENCH:
    '--- Stepped off the rain-swept balcony back into the East Fork corridor. ---',
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
  LOCKER_32_LOCKED: 'Locker 32 is locked shut. The keyhole is small and brass.',
  CORRIDOR_SHADOW_SCARE:
    '--- A heavy shadow darts across the corridor ceiling! The iron pipes groan... (-5% Composure) ---',
  LOCKER_09_EMPTIED:
    '--- Locker 09 is emptied. The remaining shelves hold only damp insect droppings and rusted shelf pins. ---',
  SPIDER_SCARE:
    '--- Gah! Scurrying cellar spiders spill from behind the rusted vent slats! (-2% Composure) ---',
  CARETAKER_RETURN_TO_FORK:
    '--- Stepped out of the suffocating office back into the damp corridor fork. ---',
  LOCKER_10_BATTERY_FOUND:
    '--- Two heavy D-cell batteries, still sealed in their packaging. The exercise book beside them is water-stained. ---',
  // Room 4B Desk Letter Loot Chain
  DESK_MUG_MOVED:
    '--- Moving the enamel mug reveals a folded sheet of lined paper tucked against the wood. ---',
  DESK_LETTER_TEXT:
    "May — I left the tape where we said, behind the vent in 326. Don't let Sandar take the room key from your locker. Meet me on the terrace when the curfew bell rings. — Ko Zaw",
  DESK_LETTER_LOOTED:
    '— "The letter is safely in my coat. Sandar won\'t find it here now." —',
  DESK_SURFACE_EMPTY:
    '— "The letter is safely in my coat. Sandar won\'t find it here now." —',
  // Spectral May Balcony Handover & Key 14
  MAY_PANIC_MISSING_LETTER:
    '— "She’s coming up... I heard her sandals on the wet floor. I left his letter on the study desk. Sandar will see his handwriting... she’ll know." —',
  MAY_HANDOVER_RELIEF:
    '— "He really did leave it for me... Then she never read it. She never had to know." —',
  KEY_14_PICKUP:
    '— "Stamped with \'14\'. This belongs to Locker 14 in the dorm bay." —',
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
    '— "A heavy brass padlock bound tight by rusted industrial chains. The gate seals the exterior stairwell leading down to the hostel courtyard and the main compound gate. It requires a heavy iron key." —',
  STAIRWAY_GATE_UNLOCKED_SUCCESS:
    '— "The iron key turns with a sharp snap. The rusted chains fall away, and the accordion gate slides open to the cold night air and the stairwell leading out into the rain." —',
  OUTER_GROUNDS_ENTRY:
    '— Stepped through the unlocked gate into the torrential monsoon downpour. The hostel walls tower behind... but the outer compound gate stands ahead. —',
} as const;

/** Nat guardian spirit canonical dialogue responses, keyed by topic ID */
export const NAT_DIALOGUE = {
  may_identity:
    "Her name was May. A warden's favorite, choke-strangled in the quiet dark of monsoon week. Her grievance anchors this entire floor.",
  locker_14_key:
    'The key was cast into the incinerator behind the mess hall. You will never hold it.',
  broken_locket:
    'The pendant of appeasement... He ripped it from her collar before the silence took her. Return it to her sight, and her fury will pause.',
  warden_ledger:
    '...The ink of mortal bureaucrats does not echo in the spirit veil. I know nothing of his papers.',
  banyan_well:
    '...The dry mouth beneath the roots cannot be named! Utter it again and I shall leave you to her claws!',
} as const;
