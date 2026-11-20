# Phase 4: Cinematic Animations & Micro-Interactions

**Target Branch**: `feature/cinematic-animations`  
**Related Documents**: [docs/DESIGN_SYSTEM.md](file:///D:/The-Hostel/docs/DESIGN_SYSTEM.md)  
**Status**: Ready for Implementation  

---

## 1. Vision & Animation Philosophy

Point-and-click horror games succeed through tension, pacing, and visual atmosphere. Jarring instant cuts, abrupt modal popups, and stiff button states shatter immersion and feel cheap.

This phase introduces **Fluid 1998 Analog Horror Kinematics**:
1. **Camera Transitions & Scene Cross-Dissolves**: Every room navigation or sub-scene zoom transitions with ease-out atmospheric dissolves accompanied by ambient audio shifts.
2. **Tactile Micro-Interactions**: Interactive hotspots, buttons, and modals react with weighted, analogue physical feedback.
3. **Screen Shakes & Trauma Aberrations**: Jump scares, door smashes, and taboo shocks leverage calibrated spring physics rather than chaotic CSS flashes.

All animations strictly adhere to the **Duo-Tone Color System** and maintain 60 FPS performance on standard laptop hardware.

---

## 2. Animation Standards & Curves

All Motion (`motion/react`) components must use the tokens defined in `src/styles/designSystem.ts`:

| Curve Name | Bezier Definition | Duration | Recommended Use Cases |
| :--- | :--- | :---: | :--- |
| `easeOutCubic` | `[0.215, 0.61, 0.355, 1]` | `300ms - 500ms` | Modal entries, thought subtitle fades, HUD slider reveals |
| `easeInCubic` | `[0.55, 0.055, 0.675, 0.19]` | `200ms - 300ms` | Modal exits, dismissed prompts |
| `traumaSnap` | `[0.36, 0.07, 0.19, 0.97]` | `150ms` | Door impacts, screen shudder, taboo shock |
| `creepyBreathing` | Continuous keyframes | `4000ms` | Hotspot stroke glows, Nat mist pulsing, vignette breathing |

---

## 3. Core Interaction Upgrades

### 3.1 Scene Cross-Fade Transitions (`AtmosphericLayout.tsx` / `VisualNovelEngine.tsx`)
- When transitioning between rooms (e.g. `corridor_326` -> `room_4b` -> `balcony` -> `garage_subterranean`):
  - Do NOT unmount and mount abruptly.
  - Wrap the active scene in an `<AnimatePresence mode="wait">` block with:
    ```typescript
    initial={{ opacity: 0, filter: 'brightness(0.3) blur(4px)' }}
    animate={{ opacity: 1, filter: 'brightness(1) blur(0px)' }}
    exit={{ opacity: 0, filter: 'brightness(0.2) blur(6px)' }}
    transition={{ duration: 0.45, ease: [0.215, 0.61, 0.355, 1] }}
    ```
  - Cross-fade ambient audio: duck current background track slightly during scene load and restore full volume over 600ms.

---

### 3.2 Hotspot Hover & Focus Kinematics (`InteractiveHotspot.tsx`)
- Currently, hotspots switch abruptly between transparent and green fill.
- Upgrade to an organic, breathing focus effect:
  - Default: `stroke-[#4a7a60]/20` with `0.2` stroke-width.
  - On Hover: Animate stroke color to `#6ea889`, expand stroke-width to `0.4`, and apply a soft verdigris fill `rgba(110, 168, 137, 0.12)` with transition duration `200ms`.
  - Tooltip: Floating badge glides up `4px` with `opacity: 0 -> 1` and `scale: 0.96 -> 1.0` in 120ms.

---

### 3.3 Tactile Button Interactions (`HorrorButton.tsx`)
- Standardize all action triggers (doors, valves, clues, dialog choices):
  - Hover: Background darkens into `#193828`, border illuminates to `#6ea889`, subtle scale `1.01`.
  - Active Press: Scale compresses to `0.98`, playing tactile audio click with zero lag.
  - Disabled: Lower opacity to `0.35`, cursor `not-allowed`, no scale transform.

---

### 3.4 Camera Shake & Trauma Glitches
- Consolidate screen shake into a reusable hook `useTraumaShake`:
  - **Minor Jiggle (Lock rattling, light push)**: `x: [-2, 2, -1, 1, 0]`, duration `180ms`.
  - **Medium Trauma (Door bash, spider bite)**: `x: [-6, 6, -4, 4, -2, 0], y: [-3, 3, -1, 1, 0]`, duration `320ms`.
  - **Critical Shock (Taboo violation, jump scare)**: Full viewport chromatic aberration split + Arterial Crimson flash overlay for 500ms with ease-out falloff.

---

## 4. Files to Modify

1. `src/components/AtmosphericLayout.tsx` — Implement smooth scene transition wrapper.
2. `src/components/InteractiveHotspot.tsx` — Add organic hover easing and tooltip glide.
3. `src/components/common/ThoughtLine.tsx` — Refine feather opacity timing (3.0s linger + 400ms fade).
4. `src/hooks/useTraumaShake.ts` *(New File)* — Reusable calibrated screen-shake hook.
5. `src/components/design-system/HorrorButton.tsx` — Polish tactile button physics.

---

## 5. Verification & Acceptance Criteria

- [ ] Navigating between rooms feels like a cinematic cross-dissolve with no white screen flashes or sudden geometry snaps.
- [ ] Hotspot hover outlines smoothly breathe rather than blinking instantly.
- [ ] Screen shakes feel heavy and visceral without causing layout recalculations or canvas overflow.
- [ ] Frame rate remains rock-solid at 60 FPS during scene transitions.
- [ ] Both `npm run lint` and `npm run build` pass with 0 errors.
