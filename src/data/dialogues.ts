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
