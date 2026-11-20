# Phase 1: Dual Vitals (HP & Mind) and Character Customization System

**Target Branch**: `feature/dual-vitals-character-system`  
**Related Documents**: [docs/DESIGN_SYSTEM.md](file:///D:/The-Hostel/docs/DESIGN_SYSTEM.md)  
**Status**: Ready for Implementation  

---

## 1. Executive Summary & Design Goals

Currently, the game tracks player condition using a single scalar variable `composure` (0–100%). This flattens character selection into cosmetic portraits without mechanical differentiation, making investigator choice feel trivial.

This phase splits player survivability into two distinct, interconnected vitals:
1. **Physical Vitality (`HP` / သွေးသားကြံ့ခိုင်မှု)**: Reflects bodily stamina, pain tolerance, and physical trauma. Drained by door smashing, machinery failure, insect bites, and physical exertion.
2. **Psychological Composure (`Mind` / စိတ်တည်ငြိမ်မှု)**: Reflects sanity, spiritual resolve, and cognitive composure. Drained by supernatural manifestations, gruesome crime scene clues, eerie audio shifts, and Guardian Nat taboo violations.

Each of the 6 playable investigators receives distinctive base stats, unique passive perks, and damage multipliers that radically alter how players navigate hazards in the hostel.

---

## 2. Character Specialization Matrix

All character descriptions, perks, and archetypes **must use `Aka08` typography** and follow the **Zero-Emoji Rule** (monochrome Lucide icons only).

| Investigator ID | Name (Burmese) | Archetype | Max HP | Max Mind | Physical Def | Mental Def | Unique Passive Perk | Perk Effect |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| `moe_stheinkha` | မိုးင်္သခ | သံသယရှိသူ (The Skeptic) | 90 | 110 | 1.0x | 0.70x (-30%) | **သံသယစိတ်ဖြင့် ခံယူခြင်း** (Rational Skepticism) | Takes 30% less Mind damage from ghost sightings; documents reveal rational hidden notes. |
| `ye_yint_hein` | ရဲရင့်ဟိန်း | ရဲရင့်သူ (The Athlete) | 125 | 80 | 0.75x (-25%) | 1.25x (+25%) | **သွေးကြွ ရဲရင့်မှု** (Iron Constitution) | Takes 25% less HP damage from door bashing and traps; valve mini-game momentum drains 40% slower; vulnerable to apparitions (+25% Mind loss). |
| `may_jewel` | မေရတနာ | အတွေ့အကြုံရှိသူ (The Detective) | 100 | 100 | 0.90x | 0.85x | **မှုခင်းစုံထောက် အာရုံ** (Investigative Insight) | Lock & cipher failure penalties reduced by 50%; key clue hotspots highlight from a larger distance. |
| `yin_min_htike` | ယဉ်မင်းထိုက် | မှတ်တမ်းပြ (The Archivist) | 85 | 115 | 1.15x (+15%) | 0.75x (-25%) | **မှတ်တမ်း အထောက်အထား လေ့လာသူ** (Historical Clarity) | Consuming letters and records restores +5 Mind; immune to confusion debuffs from Nat riddles. |
| `hsu_myat_shein` | ဆုမြတ်ရှိန် | သွေးဆက်သူ (The Medium) | 95 | 105 | 1.0x | 1.0x | **ဝိညာဉ် အကြားအမြင်** (Spiritual Resonance) | Discovers hidden spirit whispers around Room 101 and Prayer Altar; takes Arterial Crimson shock if ignoring Nat warnings. |
| `mona` | မိုနာ | ကာကွယ်သူ (The Protector) | 110 | 95 | 0.80x (-20%) | 0.95x | **တည်ငြိမ်သော ခေါင်းဆောင်မှု** (Steadfast Presence) | Slowly regenerates +1 Mind every 45 seconds while holding sacred items (e.g. bronze bell or candle). |

---

## 3. Damage Type Classification & Gameplay Hazards

### 3.1 Physical Hazards (`HP` Loss)
- **Room 326 Wooden Door Bashing**:
  - Baseline: `-15 HP`.
  - Ye Yint Hein: `-11 HP` (`0.75x`).
  - Yin Min Htike: `-17 HP` (`1.15x`).
- **Locker Spider Swarm Jump Scare**:
  - Baseline: `-8 HP` and screen shake.
- **Subterranean Garage Valve Over-Exertion**:
  - Slipping below 10% progress after starting costs `-5 HP` stamina strain.
- **Well Descent Physical Slip**:
  - Climbing without the nylon rope: `-25 HP` and immediate stun.

### 3.2 Psychological Hazards (`Mind` Loss)
- **Guardian Nat Taboo Inquiry**:
  - Directly insulting or questioning the Guardian Nat without proper offerings: `-20 Mind`.
  - Screen flashes Arterial Crimson (`#ba2929`), plays `sound.playGhostWhisper()`.
- **Spectral May Balcony Encounter**:
  - Approaching without Ko Zaw's letter: `-12 Mind`.
- **Caretaker Lockpad Repeated Failures**:
  - Entering invalid code 3 times: `-6 Mind` (paranoia and trembling hands).
- **Room 101 Seance Discovery**:
  - Examining the dry blood stains and ritual circle: `-15 Mind`.

### 3.3 Critical States & Defeat Triggers
- **Physical Collapse (`HP <= 0`)**:
  - Character collapses from exhaustion or physical injury.
  - Transition to `HospitalizedEnding` or chapter checkpoint restart.
- **Mental Breakdown (`Mind <= 0`)**:
  - Character experiences hysterical panic or supernatural possession.
  - Screen turns high-contrast static with blurred monochrome filters, controls reverse or lock up, leading to `LostInLabyrinthEnding`.

---

## 4. State Management Architecture

### 4.1 Interface Updates in `src/types.ts`
```typescript
export interface CharacterProfile {
  id: string;
  name: string;
  archetype: string;
  maxHp: number;
  maxMind: number;
  physicalDefense: number;  // Multiplier (0.75 = 25% defense)
  mentalDefense: number;    // Multiplier (0.70 = 30% defense)
  staminaRecoveryRate: number;
  perkId: string;
  perkTitleBurmese: string;
  perkDescBurmese: string;
  tensionMultiplier: number; // Retained for backwards compatibility
  resolveMultiplier: number; // Retained for backwards compatibility
  avatar: string;
}

export type DamageType = 'physical' | 'mental';

export interface DamageEvent {
  amount: number;
  type: DamageType;
  source: string;
  actualAmount: number;
  remainingHp: number;
  remainingMind: number;
}
```

### 4.2 State Store Updates in `src/store/useGameStore.ts` & `src/context/GameProgressContext.tsx`
```typescript
// Additive state properties
hp: number;
maxHp: number;
mind: number;
maxMind: number;

// Action dispatchers
applyDamage: (amount: number, type: DamageType, source?: string) => void;
healHp: (amount: number) => void;
restoreMind: (amount: number) => void;
resetVitalsForCharacter: (characterId: string) => void;

// Backwards-compatibility bridge:
// composure acts as a proxy for mind (0-100%)
composure: number; // getter returns Math.round((mind / maxMind) * 100)
setComposure: (val: number | ((prev: number) => number)) => void;
```

---

## 5. UI / HUD Implementation Specifications

### 5.1 Dual Vitals Bar in Top Navigation (`src/components/TopInventoryBar.tsx` & `AtmosphericLayout.tsx`)
Replace the single composure bar with a paired Duo-Tone gauge:

```
┌─────────────────────────────────────────────────────────────┐
│  [HP]  ████████████░░░░░  75/100   [MIND]  ██████████████ 95/100 │
└─────────────────────────────────────────────────────────────┘
```

- **HP Bar Styling**:
  - Normal: `#193828` base with `#6ea889` fill.
  - Damaged / Danger (`< 30%`): Flashing Arterial Crimson `#ba2929` with subtle pulse glow `shadow-[0_0_12px_rgba(186,41,41,0.5)]`.
  - Icon: `<Heart className="w-3.5 h-3.5 text-[#6ea889]" />` (transitions to crimson on damage).
- **Mind Bar Styling**:
  - Normal: `#101c15` base with `#38bdf8` / `#6ea889` gradient fill.
  - Panicked (`< 25%`): Static Glitch Cyan flicker, screen edge vignette distortion.
  - Icon: `<Brain className="w-3.5 h-3.5 text-[#38bdf8]" />`.
- **Damage Numbers (Floating Floaters)**:
  - When HP drops, render a floating `-X HP` in `#ba2929` floating upwards with ease-out opacity.
  - When Mind drops, render a floating `-X MIND` in `#38bdf8` floating upwards.

---

## 6. Files to Modify

1. `src/types.ts` — Add `maxHp`, `maxMind`, `physicalDefense`, `mentalDefense`, `perk*` fields to `CharacterProfile`.
2. `src/characterData.ts` — Populate all 6 characters with distinct stats, perks, and Burmese descriptions.
3. `src/store/useGameStore.ts` — Implement `hp`, `mind`, `applyDamage`, `healHp`, `restoreMind`.
4. `src/context/GameProgressContext.tsx` — Expose dual vitals to the React tree with composure fallback.
5. `src/components/CharacterSelectModal.tsx` — Display HP, Mind, defense badges, and Burmese perk cards.
6. `src/components/TopInventoryBar.tsx` — Integrate dual vitals HUD gauge.
7. `src/components/AtmosphericLayout.tsx` — Update header stats display.
8. `src/components/VisualNovelEngine.tsx` — Route door smashing to `applyDamage(15, 'physical')`.
9. `src/components/NatDialogueView.tsx` — Route taboo questioning to `applyDamage(20, 'mental')`.

---

## 7. Verification & Acceptance Criteria

- [ ] Selecting different characters initialises distinct starting `maxHp` and `maxMind` (e.g. Ye Yint Hein starts with 125 HP / 80 Mind; Yin Min Htike with 85 HP / 115 Mind).
- [ ] Bashing the door reduces HP and triggers an Arterial Crimson visual indicator; Ye Yint Hein takes strictly less damage than other characters.
- [ ] Nat taboo inquiry drains Mind and displays fear reaction without crashing or affecting physical HP.
- [ ] No emoji characters exist in character select cards, HUD bars, or damage notifications.
- [ ] All Burmese perk titles and descriptions render crisply in `Aka08` with `1.75` line-height.
- [ ] `npm run lint` (`tsc --noEmit`) and `npm run build` pass with 0 errors.
