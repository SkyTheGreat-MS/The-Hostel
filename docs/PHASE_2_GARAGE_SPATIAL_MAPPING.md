# Phase 2: Subterranean Garage Spatial Mapping & Mechanics

**Target Branch**: `feature/garage-spatial-mapping`  
**Related Documents**: [docs/DESIGN_SYSTEM.md](file:///D:/The-Hostel/docs/DESIGN_SYSTEM.md), [docs/PHASE_1_VITALS_AND_CHARACTER_SYSTEM.md](file:///D:/The-Hostel/docs/PHASE_1_VITALS_AND_CHARACTER_SYSTEM.md)  
**Status**: Ready for Implementation  

---

## 1. Problem Statement & Objectives

In the current implementation of `GarageSubterraneanView.tsx`, the interactive point-and-click mapping contains critical polygon overlaps:
1. **Log vs. Pulley Collision**: Hotspot 3 (`garage_caretaker_log`) and Hotspot 4 (`garage_tool_pulley`) share nearly identical polygon coordinates (overlap factor > 99%). Clicking on the Caretaker's log frequently misfires and triggers the submerged pulley logic, or blocks the log from being inspected before drainage.
2. **Valve vs. Bicycles Collision**: Hotspot 1 (`garage_drain_valve`) sits inside the bounding box of Hotspot 2 (`garage_bicycles`), causing erratic hover tooltips and misclicks.
3. **Lack of Spatial Context**: Players struggle to understand the garage's orientation relative to the hostel grounds and the underground Banyan Wellhead.
4. **Disconnected Mini-Game**: The `GarageValveMiniGame` operates as an isolated button-masher with no connection to the player character's physical stamina or fatigue.

This phase provides:
- Clean, non-overlapping SVG polygon coordinates calibrated to the background artwork.
- An interactive 1998 Architectural Blueprint modal showing the subterranean water sluice layout.
- Integration between character physical stats and the valve-turning mini-game.

---

## 2. Calibrated Spatial Coordinate Mapping

All coordinates are defined on a `0..100` percentage coordinate system matching the aspect-fill viewport of `garage_subterranean_rain.jpg` and `garage_subterranean_rain_submerged.jpg`.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GARAGE VIEWPORT (100 x 100)                     │
│                                                                        │
│   [Pulley Hoist Hook]                [Sluice Valve Wheel]              │
│   (X: 52-60, Y: 18-36)               (X: 68-82, Y: 38-58)              │
│                                                                        │
│   [Caretaker Desk & Log]                                               │
│   (X: 8-24, Y: 52-70)                [Flooded Bicycle Heap]            │
│                                      (X: 28-64, Y: 58-86)              │
│   [Rusty Machete Trough]                                               │
│   (X: 4-22, Y: 76-92)                                                  │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Detailed Hotspot Geometry Table

| Hotspot ID | In-Game Name (Burmese) | Visual Location on Scene | Calibrated Polygon Points | Cursor Tooltip | Action on Click |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `garage_drain_valve` | ရေနုတ်အဆို့ရှင်ဘီး | Heavy iron wheel on right pillar pipe | `68.5,42.0 78.5,39.0 82.0,48.0 77.0,58.0 68.0,56.0 65.5,48.0` | `[ရေနုတ်အဆို့ရှင်ကို လှည့်ဖွင့်မည်]` | Opens `GarageValveMiniGame` (or checks drained valve) |
| `garage_bicycles` | ၁၉၉၀ ကျောင်းသူစက်ဘီးဟောင်းများ | Submerged tangle of rusted bicycles across center-right ground | `28.0,62.0 54.0,58.0 64.0,66.0 60.0,86.0 26.0,84.0 22.0,72.0` | `[ရေမြုပ်စက်ဘီးများကို စစ်ဆေးမည်]` | Monologue on 1998 student relics & tangled hair |
| `garage_caretaker_log` | အဆောင်မှူး၏ ထိန်းသိမ်းရေးမှတ်တမ်း | Elevated wooden workbench table on left wall | `6.0,52.0 22.0,52.0 24.0,68.0 8.0,70.0` | `[အဆောင်မှူးမှတ်တမ်းကို ဖတ်ရှုမည်]` | Opens Caretaker Log reader (lore on 1974 drainage) |
| `garage_tool_pulley` | သံသွန်းစက်သီးကြီး | Cast-iron hoist wheel hanging from ceiling support beam | `51.5,18.0 60.0,18.0 61.5,32.0 55.0,36.0 49.5,30.0` | `[သံသွန်းစက်သီးကို ယူမည်]` (if drained) / `[ရေထဲက သံစက်သီးကို ကြည့်မည်]` | Adds `iron_pulley` to inventory when drained |
| `garage_tool_machete` | သံချေးတက် ဓားမကြီး | Submerged tool trough under bottom-left drainage grating | `4.0,78.0 18.0,76.0 22.0,88.0 8.0,92.0` | `[သံချေးတက်ဓားမကို ယူမည်]` (if drained) | Adds `rusty_machete` to inventory when drained |

---

## 3. Subterranean Blueprint Layout Modal

### 3.1 Design & Visual Presentation
Add a blueprint toggle button to `SceneNavBar` within the garage view:  
`[ ဂိုဒေါင် မြေအောက် ရေဆင်းမြေပုံ ]` (`[02] BLUEPRINT`).

When clicked, display an authentic 1998 hand-drafted engineering blueprint modal (`docs/DESIGN_SYSTEM.md` duo-tone obsidian + verdigris blueprint styling):
- **Blueprint Grid**: Monospace blueprint grid lines in `#193828/40`.
- **Architectural Markings**:
  - `SECTOR A`: Subterranean Bicycle Storage (လက်ရှိနေရာ).
  - `VALVE SLUICE 04`: Main Drainage Sluice Gate (ရေနုတ်တံခါး).
  - `CULVERT B-7`: Deep Drainage Culvert leading to the Banyan Tree Wellhead (ညောင်ပင်ရေတွင်း ဆက်သွယ်ရာ ရေပြွန်).
  - `PUMP ROOM`: Locked pump chamber with Caretaker's emergency bypass warning.
- **Orientation Compass**: Duo-tone compass rose showing North aligned toward the Main Hostel Compound.

### 3.2 Clue Unlocks & Deductions
Inspecting the blueprint unlocks clue entry: `clue_garage_blueprint` in the Case Notes Modal, confirming that draining the garage clears the culvert connecting directly to Chapter 1's wellhead.

---

## 4. Valve Mini-Game Balancing & Character Integration

In `src/components/GarageValveMiniGame.tsx`, replace hardcoded values with dynamic calculations derived from the active character:

```typescript
// Base mechanics
const baseIncrement = 4.5;
const baseDecayRate = 1.0;

// Character Stat Multipliers from Phase 1
const character = getCharacterProfile(activeCharacterId);
const staminaMult = character.physicalDefense <= 0.8 ? 1.3 : (character.physicalDefense >= 1.1 ? 0.8 : 1.0);

// Resulting dynamics
const incrementPerPress = baseIncrement * (character.id === 'ye_yint_hein' ? 1.25 : 1.0);
const decayIntervalMs = character.id === 'ye_yint_hein' ? 450 : (character.id === 'yin_min_htike' ? 240 : 300);
```

### Fatigue & HP Deduction
If the player drops to 0% progress after previously reaching 50%+, trigger a fatigue strain:
`-4 HP` ("လက်ဖဝါးများ သံချေးဖြင့် စုတ်ပြတ်ကာ မောပန်းနွမ်းနယ်သွားသည်") with Arterial Crimson border flash.

---

## 5. Files to Modify

1. `src/components/GarageSubterraneanView.tsx`:
   - Replace conflicting polygon coordinates with calibrated points from Section 2.
   - Add blueprint toggle button and state.
   - Add `GarageBlueprintModal.tsx` overlay.
2. `src/components/GarageBlueprintModal.tsx` *(New File)*:
   - Duo-tone SVG architectural drawing with interactive room annotations in `Aka08`.
3. `src/components/GarageValveMiniGame.tsx`:
   - Bind momentum increment and decay delay to active character profile.
   - Route fatigue penalty to `applyDamage(4, 'physical')`.
4. `src/data/clues.ts` / `src/components/CaseNotesModal.tsx`:
   - Register `clue_garage_blueprint`.

---

## 6. Verification & Acceptance Criteria

- [ ] Hovering over the Caretaker Desk only highlights the desk; hovering over the Pulley Hook only highlights the ceiling hook.
- [ ] Hovering over the Valve Wheel never triggers the Bicycles tooltip.
- [ ] Clicking the Blueprint button opens the 1998 architectural layout; all annotations render in `Aka08` with zero emoji glyphs.
- [ ] In the valve mini-game, playing as Ye Yint Hein requires noticeably fewer presses and stays stable longer compared to Yin Min Htike.
- [ ] Both `npm run lint` and `npm run build` pass with 0 errors.
