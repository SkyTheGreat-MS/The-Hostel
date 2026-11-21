# The Hostel (Hostel 1998) — Engineering & Feature Roadmap

Welcome to the development documentation for **The Hostel (Hostel 1998)**. This guide outlines the project's multi-phase architecture so team members can independently branch, build, and verify their respective features.

---

## 1. Core Development Rules for All Branches

Every team member contributing to any branch **must strictly follow these 4 non-negotiable standards**:

1. **Authoritative Burmese Typography (`Aka08`)**:
   - Never use Noto Sans Myanmar.
   - Always use `font-burmese` (`'Aka08', 'Myanmar Text', sans-serif`).
   - Burmese text must have at least `line-height: 1.75` (e.g. `leading-[1.75]`) to prevent stacking consonant and tone mark clipping.
   - Never choke Burmese strings inside Latin `font-mono`, `font-serif`, or `font-bebas`.

2. **Strict Duo-Tone Color Palette**:
   - **Baseline**: Stagnant Obsidian Void (`#020504` – `#101c15`) and Spectral Verdigris Rot (`#193828` – `#6ea889` / `#e0f0e7`).
   - **Tertiary Event Accents Only**:
     - **Arterial Crimson (`#ba2929`)**: Exclusively for trauma, HP loss, taboo shocks, or critical danger.
     - **Cursed Grave Brass (`#c7a458`)**: Exclusively for sacred relics, altar rites, and unlocked revelations.
     - **Static Glitch Cyan (`#38bdf8`)**: Exclusively for 2026 radio frequencies and modern time echoes.
   - No rainbow colors, random blues, or bright consumer UI tones.

3. **Zero AI-Slop & Zero Emojis**:
   - Strictly no emoji glyphs (e.g. ⚠️, ❯, ✕, 🔒, 🚪) in code, buttons, dialogs, reviews, or help menus.
   - Use monochrome vector icons from `lucide-react` exclusively.
   - Use bracketed numbers (`[01]`, `[02]`) instead of circled unicode numbers (`①`, `②`).

4. **Thought Engine Standards**:
   - Inner thoughts must use the borderless floating subtitle presentation (`ThoughtLine.tsx`), lasting 3.0 seconds with smooth ease-out-cubic fade away. No clunky card borders or green accent lines.

---

## 2. Feature Phases & Target Branches

Each feature module is completely specified in its dedicated document below. Team members should branch off `main` using the assigned branch name:

| Phase | Module Name | Target Branch | Specification Document | Key Deliverables |
| :---: | :--- | :--- | :--- | :--- |
| **0** | **Design System & Typography** | `main` (Merged) | [docs/DESIGN_SYSTEM.md](file:///D:/The-Hostel/docs/DESIGN_SYSTEM.md) | Aka08 font, Duo-Tone tokens, borderless thoughts, zero emojis. |
| **1** | **Dual Vitals & Character System** | `feature/dual-vitals-character-system` | [docs/PHASE_1_VITALS_AND_CHARACTER_SYSTEM.md](file:///D:/The-Hostel/docs/PHASE_1_VITALS_AND_CHARACTER_SYSTEM.md) | Split HP & Mind, character perks & multipliers, dual-vital HUD bar. |
| **2** | **Subterranean Garage Spatial Mapping** | `feature/garage-spatial-mapping` | [docs/PHASE_2_GARAGE_SPATIAL_MAPPING.md](file:///D:/The-Hostel/docs/PHASE_2_GARAGE_SPATIAL_MAPPING.md) | Fix overlapping polygons (log vs pulley, valve vs bikes), blueprint modal, stamina scaling. |
| **3** | **Guardian Nat Sessions Overhaul** | `feature/nat-interrogation-sessions` | [docs/PHASE_3_NAT_INTERROGATION_SESSIONS.md](file:///D:/The-Hostel/docs/PHASE_3_NAT_INTERROGATION_SESSIONS.md) | Dynamic character fear busts, True/Deceit discernment pairs, Arterial Crimson taboo shock. |
| **4** | **Cinematic Animations & Polish** | `feature/cinematic-animations` | [docs/PHASE_4_ANIMATIONS_AND_INTERACTIONS.md](file:///D:/The-Hostel/docs/PHASE_4_ANIMATIONS_AND_INTERACTIONS.md) | Smooth room cross-dissolves, organic hotspot hover easing, calibrated trauma screen shake. |

---

## 3. Pull Request Checklist

Before submitting a branch pull request into `main`, verify:
- [ ] `npm run lint` (`tsc --noEmit`) passes with 0 TypeScript errors.
- [ ] `npm run build` succeeds cleanly.
- [ ] Zero emoji characters in newly authored code or strings (`git grep` check).
- [ ] All Burmese strings render with `Aka08` typography.
- [ ] Existing puzzle combinations (e.g. padlock `290418`), inventory IDs, and Prolog rules remain intact.
