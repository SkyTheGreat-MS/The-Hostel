# 1998 Burmese Folk-Horror Design System
**Project: The Hostel (Hostel 1998: Spirit Labyrinth)**  
**Version: 1.0.0**

---

## 1. Design Philosophy

The aesthetic of *The Hostel* is rooted in the oppressive, decaying atmosphere of an abandoned 1998 university dormitory trapped in a supernatural temporal echo.

The interface adheres to four core design rules:
1. **Duo-Tone Baseline**: Normal gameplay interfaces are strictly duo-tone (Obsidian Void and Sickly Spectral Verdigris).
2. **Eye-Breaking Event Accents**: High-contrast tertiary colors breach the shroud only during high-stakes narrative triggers (trauma, altar sanctum, temporal static).
3. **Period Authenticity & No AI Slop**: Zero consumer emoji glyphs, zero bubbly rounded cards or pill buttons, and authentic period typography.
4. **Brutalist 1998 Geometry & Borderless Atmospheric Blending**: Razor-sharp corners (`rounded-none`), zero boxy borderlines or card outlines (Rules 8 & 13). Elements dissolve organically into the background scene via translucent obsidian washes (`bg-[#020504]/60`) rather than floating as toy-like bordered cards.

---

## 2. Color Palette & Hierarchy

### 2.1 Duo-Tone Baseline (Standard States)
Normal screens, navigation bars, inventory trays, dialog boxes, and thought subtitles exist exclusively within this two-tone palette:

| Token Name | Hex Code | Role |
|---|---|---|
| `obsidian-abyss` | `#020504` | Pitch black background, deepest shadow |
| `obsidian-dark` | `#060b08` | Primary surface backdrop, modal body |
| `obsidian-surface` | `#0b140f` | Card fills, active panel containers |
| `obsidian-elevated`| `#101c15` | Hover states, raised buttons |
| `verdigris-deep` | `#112319` | Subtle dividers, inactive borders |
| `verdigris-moss` | `#193828` | Standard 1px container borders |
| `verdigris-cold` | `#29543e` | Hover borders, active selection outlines |
| `verdigris-mist` | `#447d60` | Secondary metadata labels, mute icons |
| `verdigris-jade` | `#6ea889` | Standard icons, secondary body text |
| `verdigris-corpse`| `#b1d4c2` | Primary header text, active icons |
| `verdigris-glow` | `#e0f0e7` | Selected items, highlighted values |

### 2.2 Eye-Breaking 3rd Tones (Triggered Events Only)
A single high-contrast tertiary color breaks into the duo-tone world during specific dramatic events:

#### A. Violent Arterial Crimson (Trauma, Danger, Taboo)
Triggered when the protagonist sustains physical damage, suffers sanity shock, breaches sacred taboos, or encounters hostile entities.
- Clotted Base: `#330808`
- Wound Tone: `#591010`
- Active Arterial Blood: `#8a1a1a`
- Flash Accent: `#ba2929`
- Pale Flesh Highlight: `#fca5a5`

#### B. Cursed Grave Brass (Altar Sanctum, Sacred Relics)
Triggered when igniting black beeswax candles at the Nat shrine, ringing the prayer bell, or discovering vital physical evidence.
- Tarnished Base: `#241b0b`
- Incense Ochre: `#4a3818`
- Altar Gold: `#755926`
- Sulfur Accent: `#a37f37`
- Candlelight Glow: `#c7a458`
- Bone Dust Highlight: `#f7eed8`

#### C. Static Glitch Cyan (Temporal Echo, 2026 Radio)
Triggered when the 2026 university seance group sends radio signals or temporal frequency wavers occur.
- Signal Deep: `#0369a1`
- Radio Carrier: `#0284c7`
- Static Glow: `#38bdf8`
- Phosphor Noise: `#bae6fd`

---

## 3. Typography Suite & Hierarchy

### 3.1 Typefaces

| Script / Usage | Family | Source | Fallbacks |
|---|---|---|---|
| **Burmese Script (All)** | `Aka08` | Local (`/fonts/Aka08-Regular.ttf`) | `Myanmar Text`, `sans-serif` |
| **Occult Latin Display** | `Cinzel` | Google Fonts | `serif` |
| **1998 Vintage Documents** | `Special Elite` | Google Fonts | `cursive` |
| **Timers & Numerics** | `Bebas Neue` | Google Fonts | `Impact`, `sans-serif` |
| **Technical Telemetry / HUD**| `JetBrains Mono` | Google Fonts | `ui-monospace`, `monospace` |

### 3.2 Burmese Typography Rules
- **Font Stack**: Always apply `--font-burmese: 'Aka08', 'Myanmar Text', sans-serif;`.
- **Line-Height Enforcement**: Burmese text requires a strict minimum line-height ratio of `1.7` to `1.75` (`leading-[1.75]`). This prevents stacked consonants (`င်္သ`, `န္တာ`), subscripts (`ျ`, `ြ`, `ွ`, `ှ`), and tone marks (`့`, `း`, `်`) from clipping.
- **No Faux Styles**: Never apply synthetic CSS italics or condensed sans-serif fonts (e.g. `Bebas Neue`) to Burmese text.
- **Word Break**: Apply `word-break: break-word` and `hyphens: none` for natural Burmese syllable wrapping.

### 3.3 Text Scale Hierarchy

| Level | Typeface | Size | Line-Height | Styling |
|---|---|---|---|---|
| **Display H1** | `Cinzel` / `Aka08` | 32px – 44px | 1.3 – 1.4 | Bold, uppercase, tracking-wider |
| **Header H2** | `Cinzel` / `Aka08` | 20px – 24px | 1.5 | Semi-bold, tracking-wide |
| **Subhead H3** | `Aka08` / `Cinzel` | 16px – 18px | 1.6 | Bold, text-corpsePale |
| **Body Dialogue** | `Aka08` | 15px – 17px | 1.75 | Regular, text-[#d8eae2] |
| **Inner Thought** | `Aka08` | 14px – 16px | 1.75 | Subtitle shadow, text-[#d8eae2] |
| **Technical / HUD**| `JetBrains Mono` | 10px – 12px | 1.4 | Uppercase, tracking-widest |

---

## 4. Cinematic Thought Monologue Engine

Inner thoughts and object examination monologues use a borderless, organic subtitle presentation:

### Rules:
1. **Zero AI-Slop Borders**: No rectangular card frames, no green vertical stripes, no gradient horizontal dividers, and no `[ CLICK TO DISMISS ]` text.
2. **Floating Cinematic Placement**: Centered at `bottom-8` of the viewport with an ambient radial feather wash (`thought-feather-wash`) and deep drop-shadow (`thought-subtitle-shadow`).
3. **Strict 3.0-Second Auto-Fade**: The thought stays for exactly `3000ms`, then smoothly fades out with an easeOutCubic curve (`[0.16, 1, 0.3, 1]`).
4. **Immediate Dismissal**: Clicking anywhere dismisses the thought instantly.
5. **Seamless Reset**: Clicking a new hotspot while a thought is active transitions the text and resets the 3-second timer.

---

## 5. Strict Zero-Emoji Standard

Consumer emoji glyphs are strictly prohibited across all game interfaces:
- Never use emojis in button labels, dialogue headers, case notes, tooltips, modals, review prompts, or technical logs.
- All visual emblems must be crisp, monochrome vector icons from `lucide-react` rendered in verdigris (`#6ea889`), antique brass (`#c7a458`), or crimson (`#ba2929`).

---

## 6. Layout & Elevation Architecture

### 6.1 Z-Index Layers
- `z-0`: Background scene art
- `z-10`: Interactive hotspots and scene hitboxes
- `z-20`: Top scene navigation and area breadcrumb bar
- `z-30`: Persistent vitals HUD (HP, Mind, Countdown)
- `z-40`: Floating cinematic thought monologues
- `z-45`: NPC and character dialogue overlays
- `z-50`: Full modals (Case Notes, Keypads, Character Select, Pause)
- `z-60`: Screen trauma glitches, taboo shock overlays

### 6.2 Modal Dialog Standards
- Surface: Matte obsidian `#060b08/96` with backdrop blur (`backdrop-blur-md`), zero outline borders.
- Header: Minimalist title in `Cinzel`, subtitle in `JetBrains Mono`, and monochrome vector `X` close icon (borderless hover).
- Navigation: Standardized keyboard dismiss via `Escape`.

### 6.3 Anti-AI Slop Geometry & Borderless Atmospheric Standards
- **Zero Bubbly/Pill Corners**: Standard web template rounding (`rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, and pill buttons) is strictly banned for HUD badges, navigation controls, vitals bars, inventory slots, and modal frames.
- **Brutalist 1998 Sharp Edges**: All interactive buttons, status badges, and panels use razor-sharp corners (`rounded-none`), matching the cold institutional atmosphere of 1998 hostel metal, stamped badges, and weathered dorm equipment.
- **Elimination of Artificial Borderlines**:
  - In accordance with UI/UX rules (Rule 8: Group with spacing; Rule 13: Remove embellishments), UI elements must NEVER be boxed inside heavy outline borderlines (`border border-...`).
  - Related items are grouped strictly with spacing and proximity (Law of Proximity), not border outlines.
  - Interactive states trigger subtle background luminance transitions (`hover:bg-[#060b08]/90`, `hover:text-[#e0f0e7]`), never popping up bright neon outline borders.
- **Atmospheric Background Dissolution**:
  - UI containers must never float as disconnected bright plastic cards.
  - Surfaces use translucent obsidian washes (`bg-[#020504]/60`) with subtle backdrop blur (`backdrop-blur-sm`), allowing the environmental textures (decaying plaster, monsoon moisture, darkness) to bleed through naturally.
  - Dynamic numbers (HP, Mind, clock timer, counters) must use `tabular-nums font-mono` to prevent jitter (Rule 18).
  - Filler badges and decorative pills are strictly eliminated (Rule 1).

---

## 7. Reusable Primitives & Implementation Files

- **Design System Tokens**: [src/styles/designSystem.ts](file:///D:/The-Hostel/src/styles/designSystem.ts)
- **Global Styles & Font-Face**: [src/index.css](file:///D:/The-Hostel/src/index.css)
- **Custom Font Asset**: [public/fonts/Aka08-Regular.ttf](file:///D:/The-Hostel/public/fonts/Aka08-Regular.ttf)
- **Cinematic Thought Engine**: [src/components/common/ThoughtLine.tsx](file:///D:/The-Hostel/src/components/common/ThoughtLine.tsx)
- **Dialogue & Monologue Overlay**: [src/components/DialogueOverlay.tsx](file:///D:/The-Hostel/src/components/DialogueOverlay.tsx)
- **Tactile Button**: [src/components/design-system/HorrorButton.tsx](file:///D:/The-Hostel/src/components/design-system/HorrorButton.tsx)
- **Modal Container**: [src/components/design-system/HorrorModal.tsx](file:///D:/The-Hostel/src/components/design-system/HorrorModal.tsx)
- **Module Barrel**: [src/components/design-system/index.ts](file:///D:/The-Hostel/src/components/design-system/index.ts)
