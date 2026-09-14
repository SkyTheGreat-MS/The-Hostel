# The Hostel (Hostel 1998: Spirit Labyrinth)

> A 1998 Myanmar Hostel Supernatural Mystery Visual Novel & Point-and-Click Adventure built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS 4**, and an authoritative **Prolog** declarative logic engine.

---

## 📖 About The Project

### Narrative Premise
In **2026**, six university students gather in an abandoned dormitory to perform an ancient *nat-calling* ritual. Their goal: uncover the truth behind the unsolved **1998 murder of student Mama May**. When the ritual offering glass shatters, the chosen protagonist (MC) loses consciousness and awakens trapped inside an isolated **1998 temporal echo** of the hostel.

The five friends in 2026 attempt to maintain the metaphysical anchor and revive the MC, acting as the environmental countdown clock. The protagonist must navigate the haunted corridors, solve environmental puzzles, gather physical evidence, interrogate spiritual entities, and decode the murder mystery before composure collapses or the temporal anchor dissolves forever.

### Dual Spiritual Entities
1. **Mama May (The Victim)**:
   - Cannot lie, but due to the trauma of her death, speaks only in poetic, symbolic riddles.
   - Decoding her clues soothes her spirit; misinterpreting her increases her grief.
2. **The Hostel Guardian Nat (The Gatekeeper)**:
   - Speaks in **pairs of statements** where **exactly one is true** and one is false.
   - Tests mortal discernment against physical proof discovered in the rooms. Trusting an unverified claim causes psychological damage and flags the protagonist as deceived.

---

## 🎮 Game Structure & Chapters

- **Chapter 1: The Locked Room (Room 4B)**:
  Awaken in the decaying bedroom. Search desk drawers, find hairpins, keys, and examine the cracked wardrobe to unlock the heavy door into the corridor.
- **Chapter 2: Corridors of the Past (East & West Wings)**:
  Explore the communal washrooms, student locker bay, the sacred prayer shrine altar, and the locked Caretaker's office. Decipher the 6-digit padlock combination (`290418`), endure spectral encounters, and interrogate the Guardian Nat.
- **Chapter 3: The Depths & The Seance Climax**:
  Escape into the stormy courtyard. Pump out the flooded subterranean garage via the interactive valve mini-game, cut overgrown banyan roots, rig an iron pulley and rope into the dried well, insert May's lost cassette tape, and crawl through the opened storm conduit into the final Room 101 seance circle.

---

## 🛠️ Tech Stack

- **Frontend UI & Presentation**: React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4, Motion/React.
- **Authoritative Logic Core**: Prolog (`spirit_labyrinth.pl`) & TypeScript Bridge (`PrologBridge.ts`).
- **Audio Synthesizer**: Web Audio API procedural synthesizer (`audioEngine.ts`) generating dynamic rain, drones, footsteps, and hollow bells, combined with HTML5 audio streaming for story songs (`may_cassette_tape_song.mp3`).
- **Localization**: Full bilingual support in English and standard Myanmar Unicode 5.1+ (UTF-8).

---

## 🚀 How to Run the Project

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later
- *(Optional)* [SWI-Prolog](https://www.swi-prolog.org/) 8.x/9.x (if you wish to run the standalone terminal Prolog prototype or unit test suite).

---

### Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/SkyTheGreat-MS/The-Hostel.git
   cd The-Hostel
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The application will start with hot-module reloading at:
   ```
   http://localhost:3000
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```
   Compiles and minifies assets into the `dist/` directory.

5. **Preview Production Build**:
   ```bash
   npm run preview
   ```

6. **Type Check & Lint**:
   ```bash
   npm run lint
   # or: npx tsc --noEmit
   ```

---

### (Optional) Running Standalone Prolog Logic & Tests

To explore or verify the pure Prolog rules engine independently of the web browser:

- **Run Interactive Terminal Game**:
  ```bash
  swipl -s spirit_labyrinth.pl -g play
  ```

- **Run Prolog Unit Test Suite (PLUnit)**:
  ```bash
  swipl -s spirit_labyrinth.pl -g "run_tests, halt."
  ```

---

## 🕹️ Controls & Gameplay Mechanics

- **Mouse Navigation & Inspection**: Click highlighted hotspot areas to inspect objects, pick up clues, or move between rooms.
- **Inventory Bar**: Displays currently held items. Click items to inspect or combine with environment targets.
- **Garage Valve Mini-Game**: Rapidly press the **Spacebar** to turn the rusted drainage valve against water pressure until the meter reaches 100%.
- **Composure / Sanity Meter**: Frightening events, wrong combination attempts, and deception drain composure. Reaching 0% results in psychological collapse.
- **Temporal Countdown Clock**: Tracks remaining time before the 2026 psychic anchor breaks.
- **Audio & Pause Settings**: Click the speaker icon in the top HUD to toggle mute, or press Escape / Pause to access the options menu.

---

## 📚 Technical Documentation

For an in-depth explanation of how TypeScript, React, state persistence, and Prolog (facts, rules, predicates, and bridge queries) work together under the hood, refer to:

👉 **[Architecture & Prolog Logic Guide (`PROLOG_AND_ARCHITECTURE_GUIDE.md`)](./PROLOG_AND_ARCHITECTURE_GUIDE.md)**

---

## 👥 Authors & Acknowledgements

- Developed by the **The-Hostel Development Team**.
- Original concept inspired by traditional Myanmar folklore, nat rituals, and 1990s university dormitory mysteries.
