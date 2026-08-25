# Hostel 1998: Spirit Labyrinth (Prolog Prototype)

A text-based Prolog logic & content prototype for a narrative horror game set in a traditional Myanmar university hostel.

## Premise

In 2026, six university friends perform a traditional *nat-calling* ritual that summons **Mama May**, a young woman murdered in the hostel in 1998. When the offering glass shatters, the player-chosen Main Character (MC) falls unconscious and awakens alone in a 1998 temporal echo of the hostel.

The five friends in 2026 attempt to revive the MC (acting as the environmental turn countdown). There is no cross-time communication: the MC must unravel the mystery alone before time, composure, or grief limits expire.

---

## Two Entities in 1998

1. **Mama May (Victim)**:
   - **CANNOT lie**, but never speaks plain facts due to the trauma of her demise.
   - Her words are symbolic and poetic riddles that must be decoded against discovered physical clues.
   - Misreading her raises her grief (+15). Correctly decoding her soothes her spirit (-10).

2. **The Hostel Guardian Nat**:
   - Offers information in **PAIRS of statements** where **EXACTLY ONE is true** and one is false.
   - He is not evil, but tests the mortal's discernment against physical evidence.
   - Trusting the wrong half of a pair asserts `used_unverified_claim/2`, causing a betrayal composure hit and flagging the player as `deceived` in the ending resolution.

---

## Ground Truth (`spirit_fact/2`)

```prolog
spirit_fact(victim_name, mama_may).
spirit_fact(true_killer, sandar).               % Mama May's roommate
spirit_fact(true_cause, strangled).
spirit_fact(true_body_location, dried_well).
spirit_fact(red_herring_suspect, ko_zaw).       % Boyfriend (innocent, hates pink)
spirit_fact(secret_connection, aye_aye, sandar).% Aye Aye (2026 friend) is Sandar's niece
```

---

## How to Run the Prolog Prototype

### Prerequisites
- [SWI-Prolog](https://www.swi-prolog.org/) (version 8.x or 9.x)

### Running the Interactive Game
```bash
swipl -s spirit_labyrinth.pl -g play
```

### Running the PLUnit Test Suite
```bash
swipl -s spirit_labyrinth.pl -g "run_tests, halt."
```

---

## Endings Matrix

| Ending | Trigger Conditions |
|---|---|
| `true_rest` | Valid accusation (`sandar`, `strangled`, `dried_well`), rite performed, low grief, no unverified claims. |
| `twist_ending` | Correct accusation & rite + discovered the `antique_locket` connecting Aye Aye to Sandar. |
| `deceived` | Player trusted false Guardian pair (`used_unverified_claim/2`) or falsely accused Ko Zaw. |
| `misunderstood` | Player misread Mama May's symbolic riddles (`misread_fact/2`). |
| `time_expired` | `time_remaining/1` reached 0 (the 2026 anchor dissolved). |
| `composure_zero` | `player_composure/1` reached 0 (psychological collapse). |
| `grief_overflow` | `mama_may_grief/1` reached 100 (spirit turned into a vengeful poltergeist). |

---

## Out-of-Scope Elements (Documented MVP Boundaries)

As specified in the prototype design:
1. **Multi-character real-time fear coordination**: Archetypes define static fear multipliers; full dynamic party fear management is reserved for the full engine.
2. **2026 Friend-trust / lie system**: Friends remain outside the 1998 temporal bubble, serving strictly as the countdown mechanism rather than interactive agents.
3. **Identity-confusion puzzle**: Cut to focus on paired truth logic and symbolic riddle decoding.
4. **Full graphical hostel navigation & sound engine**: Terminal I/O logic prototype only.
