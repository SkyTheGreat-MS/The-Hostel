# Phase 3: Guardian Nat Interrogation Sessions Overhaul

**Target Branch**: `feature/nat-interrogation-sessions`  
**Related Documents**: [docs/DESIGN_SYSTEM.md](file:///D:/The-Hostel/docs/DESIGN_SYSTEM.md), [docs/PHASE_1_VITALS_AND_CHARACTER_SYSTEM.md](file:///D:/The-Hostel/docs/PHASE_1_VITALS_AND_CHARACTER_SYSTEM.md)  
**Status**: Ready for Implementation  

---

## 1. Lore Context & Atmospheric Pillars

The Guardian Nat of the 1998 Hostel (အဆောင်စောင့်နတ်) is not a benevolent guide nor a mindless demon. She is a capricious boundary spirit bound to the tragedy of August 1998. When summoned at the Prayer Room Altar through the pacification rite (3 black beeswax candles lit with sulphur matches + striking the ceremonial bronze bell), she manifests in pale verdigris mist.

The interrogation must feel dangerous, sacred, and intellectually demanding. Careless speech or blasphemy invites immediate spiritual wrath.

---

## 2. Core Overhaul Systems

### 2.1 Dynamic Character Staging & Expression Busts
The current UI presents spoken dialogue in an isolated floating card with no visual presence of the investigating player. We introduce a **Cinematic Staging Canvas**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GUARDIAN NAT SEANCE CANVAS                      │
│                                                                        │
│   [Investigator Bust]                      [Guardian Nat Apparition]   │
│   (Ink Portrait with dynamic emotion)     (Ethereal Verdigris Glow)    │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Spoken Dialogue Subtitle (Aka08, Line-Height: 1.75)            │   │
│   └────────────────────────────────────────────────────────────────┘   │
│   [Item Evidence Tray]            [Topic Inquiries & Taboo Warning]    │
└────────────────────────────────────────────────────────────────────────┘
```

- **Dynamic Emotion States** (Using `InkPortrait.tsx` / `getCharacterFearBustSrc`):
  - **Composed (`Mind > 60%`)**: Attentive, focused portrait.
  - **Tense (`30% <= Mind <= 60%`)**: Subtle brow strain, shadowed eyes, slight breathing tremor.
  - **Horrified (`Mind < 30%` or post-Taboo shock)**: Wide pupils, cold sweat, monochrome dread wash with high-contrast shadows.

---

### 2.2 True vs. Deceit Statement Discernment

The Nat refuses to deliver unearned revelations. For each major investigation topic, she speaks two intertwined, conflicting statements:

#### Example: Topic — Sandar & Ko Zaw's Forbidden Rendezvous
- **Statement A (Divine Truth)**:  
  *“သံသယရှိသူသည် ညမထွက်ရအမိန့် ခေါင်းလောင်းထိုးပြီးနောက် ဝရန်တာသို့ ထွက်သွားခဲ့သည်။ သူမ၏ လက်ထဲတွင် အခန်း ၄B သော့ မရှိခဲ့ပေ။”*  
  *(The suspect slipped onto the balcony after curfew. Her hands held no key to Room 4B.)*
- **Statement B (Deceitful Illusion)**:  
  *“စန္ဒာသည် သော့ခလောက်ကို သံဆံထိုးဖြင့် ထိုးဖွင့်ပြီး မေ၏ အခန်းထဲသို့ ခိုးဝင်ခဲ့သည်။ သူမသည် အရာအားလုံးကို ခိုးယူသွားသူ ဖြစ်သည်။”*  
  *(Sandar picked the padlock with a bobby pin and stole everything from May's room.)*

#### Discernment Mechanism:
1. The player must inspect the two statements and select the true testimony.
2. The player must **corroborate** their selection by presenting an item or clue from their Case Dossier (e.g. presenting `letter_ko_zaw` which explicitly confirms Ko Zaw told May to meet on the balcony).
3. **Success**: The Nat nods with chilling approval, granting `clue_nat_truth_confirmed` and restoring `+6 Mind`.
4. **Failure (Wrong Evidence or Blind Guess)**: The Nat sneers, unleashing a cold spiritual wind that drains `-10 Mind`.

---

### 2.3 Arterial Crimson Taboo Shock (`အမျက်တော် ဒဏ်ခတ်မှု`)

Certain topics or premature demands violate spiritual boundaries:
- Asking the Nat how May died before lighting all 3 candles.
- Accusing the Nat of causing the tragedy.
- Repeatedly demanding answers without offering evidence.

#### Visual & Audio Execution:
- The screen flashes into an intense, eye-breaking **Arterial Crimson (`#ba2929`)** static wash.
- The Nat's eyes glow with harsh brass embers (`#c7a458`).
- Audio: Sharp spirit shriek followed by deep subterranean rumbling.
- Vital Penalty: Immediate `-20 Mind` deduction.
- The active investigator's portrait shifts directly into the **Horrified** bust state for 5 seconds.

---

### 2.4 Character-Specific Nat Resonances

Connecting with Phase 1's Character Specialization System:
- **Hsu Myat Shein (Spirit Medium)**: Receives a subtle visual chime (`Sparkles`) highlighting subtle grammatical contradictions in deceitful statements.
- **Moe Stheinkha (The Skeptic)**: Immune to panic shock on minor failed deductions (`-5 Mind` instead of `-10 Mind`).
- **Yin Min Htike (The Archivist)**: Can present written documents with 100% corroboration certainty.

---

## 3. UI Component Updates

### 3.1 `src/components/NatDialogueView.tsx`
- Replace emoji chevron buttons with clean Duo-Tone buttons (`#101c15`, `#193828`, `#6ea889`).
- Render all spoken text strictly in `font-burmese leading-[1.75]` with `Aka08`.
- Integrate investigator bust on the left screen rail using Framer Motion float animations.
- Implement the Taboo Shock overlay component (`TabooShockGlitch.tsx`).

---

## 4. Files to Modify

1. `src/components/NatDialogueView.tsx` — Implement two-shot staging, True/Deceit pair validation, and taboo reaction.
2. `src/components/PrayerAltarView.tsx` — Synchronize candle ignition states and Bell ringing triggers with Nat readiness.
3. `src/data/natDialogueTree.ts` *(New File)* — Define structured topics, truth/deceit pairs, required corroboration items, and taboo rules.
4. `src/components/TabooShockGlitch.tsx` *(New File)* — Fullscreen Arterial Crimson trauma flash overlay.

---

## 5. Verification & Acceptance Criteria

- [ ] Investigator bust visibly shifts expression as player Mind drops across 60% and 30% thresholds.
- [ ] Presenting Ko Zaw's letter successfully corroborates the truth regarding the balcony meeting and unlocks the case clue.
- [ ] Triggering a taboo inquiry fires the Arterial Crimson shock flash, plays audio, and applies `-20 Mind`.
- [ ] No emoji glyphs exist in inquiry menus, tab headers, or feedback toasts.
- [ ] All spoken Burmese text uses `Aka08` typography with no consonant clipping.
- [ ] Both `npm run lint` and `npm run build` pass with 0 errors.
