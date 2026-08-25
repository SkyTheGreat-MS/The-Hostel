import React, { useState, useEffect, useRef } from 'react';
import {
  GameState,
  MCId,
} from '../types';
import {
  CHARACTERS,
  LOCATIONS,
  GUARDIAN_PAIRS,
  VICTIM_RIDDLES,
  CLUES,
  ENDINGS_INFO,
} from '../gameData';
import {
  createInitialState,
  consumeTurn,
  applyComposureDamage,
  modifyGrief,
  exploreLocation,
  deduceGuardianPair,
  decodeRiddle,
  resolveEnding,
} from '../prologEngine';
import { sound } from '../audioEngine';
import {
  Terminal as TerminalIcon,
  Shield,
  Heart,
  Clock,
  User,
  Compass,
  Eye,
  Scroll,
  HelpCircle,
  Flame,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface TerminalGameProps {
  onStateChange?: (state: GameState) => void;
}

type ScreenMode =
  | 'character_select'
  | 'main_menu'
  | 'explore_menu'
  | 'guardian_session'
  | 'riddle_session'
  | 'clues_menu'
  | 'weigh_evidence'
  | 'accusation_menu'
  | 'ending_screen';

export const TerminalGame: React.FC<TerminalGameProps> = ({ onStateChange }) => {
  const [gameState, setGameState] = useState<GameState>(() => createInitialState('thazin'));
  const [screenMode, setScreenMode] = useState<ScreenMode>('character_select');
  const [commandInput, setCommandInput] = useState('');
  const [terminalLines, setTerminalLines] = useState<string[]>([
    '======================================================================',
    '       H O S T E L   1 9 9 8  :  S P I R I T   L A B Y R I N T H',
    '======================================================================',
    'Premise: In 2026, six university friends perform a nat-calling ritual.',
    'The offering glass shatters with a deafening crack. You black out.',
    'When you open your eyes, the modern hostel is empty, decaying, and lit',
    'by flickering oil lamps. The calendar on the wall reads: AUGUST 1998.',
    'No friends. No phones. You are trapped in 1998 with Mama May\'s ghost.',
    '======================================================================',
    '',
    'SELECT YOUR MAIN CHARACTER (MC):',
    '  1. Thazin    (Skeptic)   - Resists physical fear; vulnerable to supernatural dread',
    '  2. Min Khant (Protector) - Resists physical harm; vulnerable to betrayal',
    '  3. Htet      (Archivist) - Master of ciphers and notes; physically fragile',
    '  4. Aye Aye   (Kin-Bound) - Highly intuitive; carries hidden ties to 1998',
    '  5. Kyaw Swar (Daredevil) - Impulsive risk-taker; fragile composure under isolation',
    '  6. Su Su     (Intuitive) - Spiritually attuned; easily fatigued by ghost whispers',
    '',
    'Type 1-6 or click a character below to begin your descent into 1998.',
  ]);

  // Sub-session states
  const [guardianStep, setGuardianStep] = useState<number>(1);
  const [riddleStep, setRiddleStep] = useState<number>(0);
  const [accuseState, setAccuseState] = useState<{
    step: number;
    killer: string;
    cause: string;
    location: string;
    rite: boolean | null;
  }>({
    step: 1,
    killer: '',
    cause: '',
    location: '',
    rite: null,
  });

  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (onStateChange) onStateChange(gameState);
  }, [gameState, onStateChange]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines]);

  const addLines = (newLines: string[]) => {
    setTerminalLines((prev) => [...prev, ...newLines]);
    sound.playKeyClick();
  };

  const handleMuteToggle = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.startAmbient();
  };

  const handleReset = () => {
    const fresh = createInitialState('thazin');
    setGameState(fresh);
    setScreenMode('character_select');
    setGuardianStep(1);
    setRiddleStep(0);
    setAccuseState({ step: 1, killer: '', cause: '', location: '', rite: null });
    setTerminalLines([
      '======================================================================',
      '       H O S T E L   1 9 9 8  :  S P I R I T   L A B Y R I N T H',
      '======================================================================',
      'Restarted session. Memory resets. The year is August 1998.',
      '',
      'SELECT YOUR MAIN CHARACTER (MC):',
      '  1. Thazin    (Skeptic)   - Resists physical fear; vulnerable to supernatural dread',
      '  2. Min Khant (Protector) - Resists physical harm; vulnerable to betrayal',
      '  3. Htet      (Archivist) - Master of ciphers and notes; physically fragile',
      '  4. Aye Aye   (Kin-Bound) - Highly intuitive; carries hidden ties to 1998',
      '  5. Kyaw Swar (Daredevil) - Impulsive risk-taker; fragile composure under isolation',
      '  6. Su Su     (Intuitive) - Spiritually attuned; easily fatigued by ghost whispers',
      '',
    ]);
  };

  const handleCharacterSelect = (mcId: MCId) => {
    sound.startAmbient();
    sound.playChime(true);
    const char = CHARACTERS.find((c) => c.id === mcId)!;
    const nextState = { ...gameState, selectedMC: mcId };
    setGameState(nextState);
    setScreenMode('main_menu');

    addLines([
      `> Chosen MC: ${char.name} the ${char.archetype}`,
      `  "${char.description}"`,
      '',
      '----------------------------------------------------------------------',
      `STATUS: Time: 20 turns | Composure: 100% [normal] | Grief: 50%`,
      '----------------------------------------------------------------------',
      '',
      'MAIN ACTIONS:',
      '  1. Explore a Hostel Room (Costs 1-2 turns)',
      '  2. Commune with the Hostel Guardian Nat (Paired Truth Test - 1 turn)',
      '  3. Listen to Mama May\'s Whispers (Symbolic Riddle Decode - 1 turn)',
      '  4. Weigh Guardian Pairs against Mama May Riddles (0 turns)',
      '  5. Review Case Notes & Discovered Clues (0 turns)',
      '  6. Perform the Nat Pacification Rite & Accuse the Killer',
      '  7. Surrender / Give Up',
    ]);
  };

  const startGuardianSession = () => {
    const nextState = consumeTurn(gameState, 1);
    setGameState(nextState);
    if (nextState.gameOver) {
      triggerEnding(nextState);
      return;
    }
    setScreenMode('guardian_session');
    setGuardianStep(1);
    addLines([
      '======================================================================',
      '       COMMUNING WITH THE HOSTEL GUARDIAN NAT (Cost: 1 turn)',
      '======================================================================',
      '  ----------------------------------------------------------------------',
      `  [STATUS] Turns Left: ${nextState.timeRemaining} | Composure: ${nextState.playerComposure}% [${nextState.composureState}] | Grief: ${nextState.mamaMayGrief}%`,
      '  ----------------------------------------------------------------------',
      'The air freezes into bitter mist. A stern guardian spirit manifests.',
      '"One statement in each pair is pure truth; one is a false trap. Choose wisely."',
      '',
    ]);
  };

  const startRiddleSession = () => {
    const nextState = consumeTurn(gameState, 1);
    setGameState(nextState);
    if (nextState.gameOver) {
      triggerEnding(nextState);
      return;
    }
    setScreenMode('riddle_session');
    setRiddleStep(0);
    addLines([
      '======================================================================',
      '       MAMA MAY\'S SPIRIT WHISPERS (Cost: 1 turn)',
      '======================================================================',
      '  ----------------------------------------------------------------------',
      `  [STATUS] Turns Left: ${nextState.timeRemaining} | Composure: ${nextState.playerComposure}% [${nextState.composureState}] | Grief: ${nextState.mamaMayGrief}%`,
      '  ----------------------------------------------------------------------',
      'Incense smoke coils from the teak floorboards. Mama May speaks in riddles.',
      '',
    ]);
  };

  const handleExplore = (locationId: string) => {
    const loc = LOCATIONS.find((l) => l.id === locationId);
    if (!loc) return;

    sound.playKeyClick();
    const updated = exploreLocation(gameState, locationId);
    setGameState(updated);

    const roomClues = CLUES.filter((c) => c.locationId === locationId);
    const discoveredNow = roomClues.filter((c) => !gameState.discoveredClues.includes(c.id));

    const lines = [
      `> Searching ${loc.name} (Cost: ${loc.turnCost} turn${loc.turnCost === 1 ? '' : 's'})...`,
      '  ----------------------------------------------------------------------',
      `  [STATUS] Turns Left: ${updated.timeRemaining} | Composure: ${updated.playerComposure}% [${updated.composureState}] | Grief: ${updated.mamaMayGrief}%`,
      '  ----------------------------------------------------------------------',
    ];

    if (discoveredNow.length === 0) {
      lines.push('  No new clues found in this area.');
    } else {
      discoveredNow.forEach((clue) => {
        lines.push(`  * DISCOVERED: ${clue.title}`);
        lines.push(`    "${clue.details}"`);
        if (clue.isCipher) {
          lines.push('    >> [CIPHER SOLVED]: Caesar shift 3 decoded: Sandar paid 5,000 kyats to seal the well.');
        }
      });
      sound.playChime(true);
    }
    lines.push('');

    addLines(lines);

    if (updated.gameOver) {
      triggerEnding(updated);
    } else {
      setScreenMode('main_menu');
    }
  };

  const handleGuardianChoice = (pairId: number, chosenIndex: 1 | 2) => {
    const pair = GUARDIAN_PAIRS.find((p) => p.id === pairId)!;
    const isCorrect = chosenIndex === pair.trueIndex;
    const chosenStmt = chosenIndex === 1 ? pair.statementA : pair.statementB;

    const nextState = deduceGuardianPair(gameState, pairId, chosenIndex);
    setGameState(nextState);

    const lines = [
      `> Guardian Pair #${pairId}: You chose statement [${chosenIndex}]`,
      `  "${chosenStmt}"`,
    ];

    if (isCorrect) {
      sound.playChime(true);
      lines.push('  >> The Guardian smiles. The truth rings clear (-5% Grief).');
    } else {
      sound.playDramaticSting();
      lines.push('  >> A chilling shriek echoes! You fell for the falsehood.');
      lines.push('  >> (+10% Grief, Composure suffered a betrayal blow)');
    }
    lines.push('  ----------------------------------------------------------------------');
    lines.push(`  [STATUS] Turns Left: ${nextState.timeRemaining} | Composure: ${nextState.playerComposure}% [${nextState.composureState}] | Grief: ${nextState.mamaMayGrief}%`);
    lines.push('  ----------------------------------------------------------------------');
    lines.push('');

    addLines(lines);

    if (nextState.gameOver) {
      triggerEnding(nextState);
      return;
    }

    if (guardianStep < GUARDIAN_PAIRS.length) {
      setGuardianStep((prev) => prev + 1);
    } else {
      addLines([
        'All three Guardian pairs tested.',
        'Returning to main exploration loop.',
        '',
      ]);
      setScreenMode('main_menu');
      setGuardianStep(1);
    }
  };

  const handleRiddleChoice = (topic: 'cause_of_death' | 'killer_identity' | 'body_location', chosenMeaning: string) => {
    const riddle = VICTIM_RIDDLES.find((r) => r.topic === topic)!;
    const isCorrect = chosenMeaning === riddle.trueMeaning;
    const opt = riddle.options.find((o) => o.meaningKey === chosenMeaning);

    const nextState = decodeRiddle(gameState, topic, chosenMeaning);
    setGameState(nextState);

    const lines = [
      `> Topic: ${riddle.title}`,
      `  You decoded her riddle as: "${opt?.label}"`,
    ];

    if (isCorrect) {
      sound.playChime(true);
      lines.push('  >> Mama May\'s spirit softens. She feels understood (-10% Grief).');
    } else {
      sound.playDramaticSting();
      lines.push('  >> Mama May\'s eyes blacken with weeping shadows (+15% Grief).');
    }
    lines.push('  ----------------------------------------------------------------------');
    lines.push(`  [STATUS] Turns Left: ${nextState.timeRemaining} | Composure: ${nextState.playerComposure}% [${nextState.composureState}] | Grief: ${nextState.mamaMayGrief}%`);
    lines.push('  ----------------------------------------------------------------------');
    lines.push('');

    addLines(lines);

    if (nextState.gameOver) {
      triggerEnding(nextState);
      return;
    }

    if (riddleStep < VICTIM_RIDDLES.length - 1) {
      setRiddleStep((prev) => prev + 1);
    } else {
      addLines([
        'All three spirit whispers decoded.',
        'Returning to main exploration loop.',
        '',
      ]);
      setScreenMode('main_menu');
      setRiddleStep(0);
    }
  };

  const handleAccusationStep = (selection: string) => {
    sound.playKeyClick();
    if (accuseState.step === 1) {
      setAccuseState((prev) => ({ ...prev, killer: selection, step: 2 }));
      addLines([`> Accused Killer: ${selection}`, '']);
    } else if (accuseState.step === 2) {
      setAccuseState((prev) => ({ ...prev, cause: selection, step: 3 }));
      addLines([`> Accused Cause of Death: ${selection}`, '']);
    } else if (accuseState.step === 3) {
      setAccuseState((prev) => ({ ...prev, location: selection, step: 4 }));
      addLines([`> Accused Body Location: ${selection}`, '']);
    } else if (accuseState.step === 4) {
      const performRite = selection === 'yes';
      const finalState: GameState = {
        ...gameState,
        finalAccusation: {
          killer: accuseState.killer,
          cause: accuseState.cause,
          location: accuseState.location,
        },
        ritePerformed: performRite,
      };
      setGameState(finalState);
      triggerEnding(finalState);
    }
  };

  const triggerEnding = (state: GameState) => {
    sound.playDramaticSting();
    const endingId = resolveEnding(state);
    const updated = { ...state, gameOver: endingId };
    setGameState(updated);
    setScreenMode('ending_screen');

    const info = ENDINGS_INFO[endingId] || {
      title: 'Outcome Reached',
      subtitle: endingId,
      description: 'The story ends here.',
    };

    addLines([
      '======================================================================',
      '                    E N D I N G   R E P O R T',
      '======================================================================',
      `OUTCOME: [${info.title.toUpperCase()}]`,
      `SUBTITLE: ${info.subtitle}`,
      '',
      info.description,
      '======================================================================',
      '',
      'Click "Restart Prototype" below to test another character or investigative route.',
    ]);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim().toLowerCase();
    setCommandInput('');

    if (!cmd) return;

    // Direct numeric input routing based on screen mode
    if (screenMode === 'character_select') {
      const mcMap: Record<string, MCId> = {
        '1': 'thazin',
        '2': 'min_khant',
        '3': 'htet',
        '4': 'aye_aye',
        '5': 'kyaw_swar',
        '6': 'su_su',
        thazin: 'thazin',
        min_khant: 'min_khant',
        htet: 'htet',
        aye_aye: 'aye_aye',
        kyaw_swar: 'kyaw_swar',
        su_su: 'su_su',
      };
      if (mcMap[cmd]) {
        handleCharacterSelect(mcMap[cmd]);
      } else {
        addLines([`Invalid selection "${cmd}". Please enter 1-6.`]);
      }
    } else if (screenMode === 'main_menu') {
      if (cmd === '1') {
        setScreenMode('explore_menu');
        addLines([
          'WHERE DO YOU WISH TO SEARCH?',
          '  1. Dormitory Room 4B (Mama May & Sandar\'s room - 2 turns)',
          '  2. Basement Laundry Basin (Washing area - 2 turns)',
          '  3. Caretaker Old Office (Records & locked chests - 2 turns)',
          '  4. Courtyard Nat Shrine & Dried Well (Courtyard - 2 turns)',
          '  5. Common Hallway Bulletin Board (1 turn)',
          '  6. Return to main menu (0 turns)',
        ]);
      } else if (cmd === '2') {
        startGuardianSession();
      } else if (cmd === '3') {
        startRiddleSession();
      } else if (cmd === '4') {
        setScreenMode('weigh_evidence');
        addLines([
          '======================================================================',
          '    WEIGHING GUARDIAN PAIRS VS. MAMA MAY RIDDLES (0 turns)',
          '======================================================================',
          'Examining the tension between Guardian assertions and Mama May decodes...',
        ]);
      } else if (cmd === '5') {
        setScreenMode('clues_menu');
      } else if (cmd === '6') {
        setScreenMode('accusation_menu');
        setAccuseState({ step: 1, killer: '', cause: '', location: '', rite: null });
        addLines([
          '======================================================================',
          '       FINAL ACCUSATION & NAT PACIFICATION RITE',
          '======================================================================',
          'Step 1: Choose the true killer:',
          '  1. Sandar (Mama May\'s roommate)',
          '  2. Ko Zaw (Mama May\'s boyfriend)',
          '  3. Caretaker of 1998 Hostel',
        ]);
      } else if (cmd === '7' || cmd === 'surrender') {
        const broken = applyComposureDamage(gameState, 100, 'supernatural_direct');
        setGameState(broken);
        addLines([
          '> You collapse to your knees, surrendering your soul to the hostel shadows.',
          '  ----------------------------------------------------------------------',
          `  [STATUS] Turns Left: ${broken.timeRemaining} | Composure: 0% [broken] | Grief: ${broken.mamaMayGrief}%`,
          '  ----------------------------------------------------------------------',
        ]);
        triggerEnding(broken);
      }
    } else if (screenMode === 'explore_menu') {
      const locMap: Record<string, string> = {
        '1': 'dorm_room_4b',
        '2': 'hostel_laundry',
        '3': 'caretaker_office',
        '4': 'courtyard_shrine',
        '5': 'common_hall',
      };
      if (locMap[cmd]) {
        handleExplore(locMap[cmd]);
      } else if (cmd === '6') {
        setScreenMode('main_menu');
        addLines(['Returned to main menu.']);
      }
    } else if (screenMode === 'guardian_session') {
      if (cmd === '1' || cmd === '2') {
        handleGuardianChoice(guardianStep, parseInt(cmd, 10) as 1 | 2);
      }
    } else if (screenMode === 'riddle_session') {
      const topic = VICTIM_RIDDLES[riddleStep].topic;
      const opts = VICTIM_RIDDLES[riddleStep].options;
      const idx = parseInt(cmd, 10) - 1;
      if (idx >= 0 && idx < opts.length) {
        handleRiddleChoice(topic, opts[idx].meaningKey);
      }
    } else if (screenMode === 'accusation_menu') {
      if (accuseState.step === 1) {
        const kMap: Record<string, string> = { '1': 'sandar', '2': 'ko_zaw', '3': 'caretaker' };
        if (kMap[cmd]) handleAccusationStep(kMap[cmd]);
      } else if (accuseState.step === 2) {
        const cMap: Record<string, string> = { '1': 'strangled', '2': 'poisoned', '3': 'pushed' };
        if (cMap[cmd]) handleAccusationStep(cMap[cmd]);
      } else if (accuseState.step === 3) {
        const lMap: Record<string, string> = { '1': 'dried_well', '2': 'mango_tree', '3': 'room_4b_brick' };
        if (lMap[cmd]) handleAccusationStep(lMap[cmd]);
      } else if (accuseState.step === 4) {
        const rMap: Record<string, string> = { '1': 'yes', '2': 'no' };
        if (rMap[cmd]) handleAccusationStep(rMap[cmd]);
      }
    }
  };

  const selectedChar = CHARACTERS.find((c) => c.id === gameState.selectedMC) || CHARACTERS[0];

  return (
    <div id="prolog-terminal-container" className="flex flex-col h-full bg-stone-950 text-stone-200 rounded-xl border border-stone-800 shadow-2xl overflow-hidden font-mono">
      {/* Top Header & Real-time Status HUD */}
      <div id="terminal-status-header" className="bg-stone-900 border-b border-stone-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/60 border border-amber-800/60 rounded text-amber-300 font-semibold">
            <TerminalIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>SWI-Prolog Engine (1998 Temporal Echo)</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-800/80 border border-stone-700/60 rounded text-stone-300">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>MC: <strong>{selectedChar.name}</strong> ({selectedChar.archetype})</span>
          </div>
        </div>

        {/* Dynamic Status Gauges */}
        <div className="flex items-center gap-4">
          {/* Turn budget */}
          <div className="flex items-center gap-1.5" title="Turns remaining before 2026 anchor dissolves">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-stone-400">Turns:</span>
            <span className={`font-bold ${gameState.timeRemaining <= 5 ? 'text-rose-400 animate-pulse' : 'text-sky-300'}`}>
              {gameState.timeRemaining}
            </span>
          </div>

          {/* Composure */}
          <div className="flex items-center gap-1.5" title="Player Composure (Mental Stability)">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-stone-400">Composure:</span>
            <div className="w-16 h-2 bg-stone-800 rounded-full overflow-hidden border border-stone-700">
              <div
                className={`h-full transition-all duration-300 ${
                  gameState.playerComposure <= 40 ? 'bg-rose-500' : gameState.playerComposure <= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${gameState.playerComposure}%` }}
              />
            </div>
            <span className={`font-bold ${gameState.playerComposure <= 40 ? 'text-rose-400' : 'text-emerald-300'}`}>
              {gameState.playerComposure}% [{gameState.composureState}]
            </span>
          </div>

          {/* Mama May Grief */}
          <div className="flex items-center gap-1.5" title="Mama May's Grief (0 = Pacified, 100 = Poltergeist)">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-stone-400">Grief:</span>
            <div className="w-16 h-2 bg-stone-800 rounded-full overflow-hidden border border-stone-700">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-rose-600 transition-all duration-300"
                style={{ width: `${gameState.mamaMayGrief}%` }}
              />
            </div>
            <span className={`font-bold ${gameState.mamaMayGrief >= 80 ? 'text-rose-400 animate-pulse' : 'text-rose-300'}`}>
              {gameState.mamaMayGrief}%
            </span>
          </div>

          {/* Sound & Reset controls */}
          <div className="flex items-center gap-1 border-l border-stone-700 pl-3">
            <button
              id="terminal-audio-toggle"
              onClick={handleMuteToggle}
              className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
              title={isMuted ? 'Unmute atmospheric audio' : 'Mute audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
            </button>
            <button
              id="terminal-restart-button"
              onClick={handleReset}
              className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
              title="Reset Prolog session (reset_game/0)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Terminal Window with Scanlines & Retro Font */}
      <div id="terminal-crt-output" className="flex-1 p-4 overflow-y-auto bg-stone-950 text-amber-100/90 text-sm leading-relaxed select-text space-y-1 relative">
        {terminalLines.map((line, idx) => (
          <div
            key={idx}
            className={`whitespace-pre-wrap ${
              line.startsWith('>')
                ? 'text-amber-400 font-bold'
                : line.includes('[STATUS]')
                ? 'text-amber-300 font-semibold bg-amber-950/20 px-2 py-0.5 rounded border border-amber-900/30 my-0.5'
                : line.startsWith('  * DISCOVERED') || line.startsWith('  >>')
                ? 'text-emerald-300 font-medium'
                : line.startsWith('ENDING:')
                ? 'text-rose-400 font-bold bg-rose-950/40 p-2 rounded border border-rose-800/40'
                : line.includes('===') || line.includes('---')
                ? 'text-stone-500'
                : 'text-stone-300'
            }`}
          >
            {line}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Interactive Quick-Action Bar */}
      <div id="terminal-action-dock" className="bg-stone-900 border-t border-stone-800 p-3 flex flex-col gap-2.5">
        {screenMode === 'character_select' && (
          <div>
            <div className="text-xs text-amber-400 font-semibold mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Choose Main Character (determines psychological fear multipliers):</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CHARACTERS.map((c, i) => (
                <button
                  key={c.id}
                  id={`char-btn-${c.id}`}
                  onClick={() => handleCharacterSelect(c.id)}
                  className="flex flex-col text-left p-2.5 rounded-lg bg-stone-800/70 hover:bg-amber-950/50 border border-stone-700 hover:border-amber-700/80 transition-all text-xs group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-stone-200 group-hover:text-amber-300">{i + 1}. {c.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-900 text-stone-400">{c.archetype}</span>
                  </div>
                  <span className="text-[11px] text-stone-400 mt-1 line-clamp-2">{c.description}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {screenMode === 'main_menu' && (
          <div>
            <div className="text-xs text-stone-400 mb-2 flex items-center justify-between">
              <span>Select action or type 1-7 in terminal input:</span>
              <span className="text-[11px] text-amber-400/80">Clues Found: {gameState.discoveredClues.length} / {CLUES.length}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
              <button
                id="btn-action-explore"
                onClick={() => {
                  setScreenMode('explore_menu');
                  addLines(['WHERE DO YOU WISH TO SEARCH?']);
                }}
                className="p-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg flex items-center gap-1.5 font-medium text-stone-200 hover:text-white transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                <span>1. Explore (1-2t)</span>
              </button>

              <button
                id="btn-action-guardian"
                onClick={startGuardianSession}
                className="p-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg flex items-center gap-1.5 font-medium text-stone-200 hover:text-white transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>2. Guardian (1t)</span>
              </button>

              <button
                id="btn-action-riddles"
                onClick={startRiddleSession}
                className="p-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg flex items-center gap-1.5 font-medium text-stone-200 hover:text-white transition-colors"
              >
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>3. Riddles (1t)</span>
              </button>

              <button
                id="btn-action-weigh"
                onClick={() => setScreenMode('weigh_evidence')}
                className="p-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg flex items-center gap-1.5 font-medium text-stone-200 hover:text-white transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>4. Weigh Truth</span>
              </button>

              <button
                id="btn-action-clues"
                onClick={() => setScreenMode('clues_menu')}
                className="p-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg flex items-center gap-1.5 font-medium text-stone-200 hover:text-white transition-colors"
              >
                <Scroll className="w-3.5 h-3.5 text-emerald-400" />
                <span>5. Case Log</span>
              </button>

              <button
                id="btn-action-accuse"
                onClick={() => {
                  setScreenMode('accusation_menu');
                  setAccuseState({ step: 1, killer: '', cause: '', location: '', rite: null });
                }}
                className="p-2 bg-rose-950/70 hover:bg-rose-900/80 border border-rose-800/80 rounded-lg flex items-center gap-1.5 font-semibold text-rose-200 hover:text-white transition-colors"
              >
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>6. Accuse & Rite</span>
              </button>
            </div>
          </div>
        )}

        {screenMode === 'explore_menu' && (
          <div>
            <div className="text-xs text-stone-400 mb-2 flex items-center justify-between">
              <span>Choose a location in the 1998 hostel to investigate:</span>
              <button
                onClick={() => setScreenMode('main_menu')}
                className="text-[11px] text-amber-400 hover:underline"
              >
                Cancel / Return
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  id={`loc-btn-${loc.id}`}
                  onClick={() => handleExplore(loc.id)}
                  className="text-left p-2.5 bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 rounded-lg text-xs transition-colors"
                >
                  <div className="flex items-center justify-between font-semibold text-stone-200">
                    <span>{loc.name}</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-stone-900 text-sky-400">{loc.turnCost} turns</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">{loc.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {screenMode === 'guardian_session' && (
          <div>
            {(() => {
              const pair = GUARDIAN_PAIRS.find((p) => p.id === guardianStep) || GUARDIAN_PAIRS[0];
              return (
                <div>
                  <div className="text-xs text-amber-400 font-semibold mb-2">
                    Guardian Nat Test #{pair.id} of {GUARDIAN_PAIRS.length}: (EXACTLY ONE statement is true)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <button
                      id="guardian-stmt-1"
                      onClick={() => handleGuardianChoice(pair.id, 1)}
                      className="p-3 text-left rounded-lg bg-stone-800 hover:bg-amber-950/60 border border-stone-700 hover:border-amber-700 transition-all text-stone-200"
                    >
                      <span className="text-amber-400 font-bold block mb-1">[Statement 1]</span>
                      "{pair.statementA}"
                    </button>
                    <button
                      id="guardian-stmt-2"
                      onClick={() => handleGuardianChoice(pair.id, 2)}
                      className="p-3 text-left rounded-lg bg-stone-800 hover:bg-amber-950/60 border border-stone-700 hover:border-amber-700 transition-all text-stone-200"
                    >
                      <span className="text-amber-400 font-bold block mb-1">[Statement 2]</span>
                      "{pair.statementB}"
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {screenMode === 'riddle_session' && (
          <div>
            {(() => {
              const riddle = VICTIM_RIDDLES[riddleStep] || VICTIM_RIDDLES[0];
              return (
                <div>
                  <div className="text-xs text-rose-400 font-semibold mb-1">
                    Mama May's Riddle #{riddleStep + 1} ({riddle.title}):
                  </div>
                  <div className="text-xs italic text-amber-200/90 mb-2 p-2 bg-stone-950/80 rounded border border-rose-900/40">
                    "{riddle.symbolicText}"
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {riddle.options.map((opt, i) => (
                      <button
                        key={opt.id}
                        id={`riddle-opt-${opt.meaningKey}`}
                        onClick={() => handleRiddleChoice(riddle.topic, opt.meaningKey)}
                        className="p-2.5 text-left rounded-lg bg-stone-800 hover:bg-rose-950/60 border border-stone-700 hover:border-rose-700 transition-all text-stone-200"
                      >
                        <span className="text-rose-400 font-bold block mb-1">Reading {i + 1}</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {screenMode === 'weigh_evidence' && (
          <div className="text-xs space-y-2">
            <div className="flex items-center justify-between text-amber-400 font-semibold">
              <span>Tension Analysis: Guardian Paired Claims vs. Mama May Riddles</span>
              <button
                onClick={() => setScreenMode('main_menu')}
                className="text-[11px] text-stone-400 hover:text-stone-200"
              >
                Back to Menu
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-stone-950/60 rounded-lg border border-amber-800/40">
                <span className="font-bold text-amber-300 block mb-1">Guardian Claims (Paired Half-Truths):</span>
                <p className="text-stone-400 text-[11px]">
                  Guardian claimed either Ko Zaw was the killer OR the pink shirt in the laundry belonged to the killer.
                  The diary disproves Ko Zaw wearing pink. Hence, the pink shirt points to <strong>Sandar</strong>!
                </p>
              </div>
              <div className="p-3 bg-stone-950/60 rounded-lg border border-rose-800/40">
                <span className="font-bold text-rose-300 block mb-1">Mama May's Whispers (Symbolic Truths):</span>
                <p className="text-stone-400 text-[11px]">
                  Mama May whispers of "hands that braided my hair" and "rose-silk shawl".
                  The 1998 hostel log confirms <strong>Sandar</strong> braided Mama May's hair. Both lines converge on Sandar!
                </p>
              </div>
            </div>
          </div>
        )}

        {screenMode === 'clues_menu' && (
          <div className="text-xs space-y-2">
            <div className="flex items-center justify-between text-emerald-400 font-semibold">
              <span>Discovered Clues Log ({gameState.discoveredClues.length} / {CLUES.length})</span>
              <button
                onClick={() => setScreenMode('main_menu')}
                className="text-[11px] text-stone-400 hover:text-stone-200"
              >
                Back to Menu
              </button>
            </div>
            {gameState.discoveredClues.length === 0 ? (
              <p className="text-stone-400 italic">No clues discovered yet. Explore the hostel rooms!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {gameState.discoveredClues.map((id) => {
                  const clue = CLUES.find((c) => c.id === id);
                  if (!clue) return null;
                  return (
                    <div key={id} className="p-2 bg-stone-800 rounded border border-stone-700 text-[11px]">
                      <span className="font-bold text-amber-300 block">{clue.title}</span>
                      <p className="text-stone-300 mt-0.5">{clue.details}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {screenMode === 'accusation_menu' && (
          <div>
            {accuseState.step === 1 && (
              <div>
                <div className="text-xs text-rose-400 font-bold mb-2">Step 1: Who was the true murderer in August 1998?</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => handleAccusationStep('sandar')}
                    className="p-2.5 rounded bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 font-medium"
                  >
                    1. Sandar (Roommate)
                  </button>
                  <button
                    onClick={() => handleAccusationStep('ko_zaw')}
                    className="p-2.5 rounded bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 font-medium"
                  >
                    2. Ko Zaw (Boyfriend)
                  </button>
                  <button
                    onClick={() => handleAccusationStep('caretaker')}
                    className="p-2.5 rounded bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 font-medium"
                  >
                    3. Hostel Caretaker
                  </button>
                </div>
              </div>
            )}

            {accuseState.step === 2 && (
              <div>
                <div className="text-xs text-rose-400 font-bold mb-2">Step 2: What was the true cause of death?</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => handleAccusationStep('strangled')}
                    className="p-2.5 rounded bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 font-medium"
                  >
                    1. Manual Strangulation
                  </button>
                  <button
                    onClick={() => handleAccusationStep('poisoned')}
                    className="p-2.5 rounded bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 font-medium"
                  >
                    2. Datura Poisoning
                  </button>
                  <button
                    onClick={() => handleAccusationStep('pushed')}
                    className="p-2.5 rounded bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 font-medium"
                  >
                    3. Pushed from 4th Floor
                  </button>
                </div>
              </div>
            )}

            {accuseState.step === 3 && (
              <div>
                <div className="text-xs text-rose-400 font-bold mb-2">Step 3: Where does Mama May's mortal body lie concealed?</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => handleAccusationStep('dried_well')}
                    className="p-2.5 rounded bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 font-medium"
                  >
                    1. Sealed Dried Well
                  </button>
                  <button
                    onClick={() => handleAccusationStep('mango_tree')}
                    className="p-2.5 rounded bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 font-medium"
                  >
                    2. Under Mango Tree
                  </button>
                  <button
                    onClick={() => handleAccusationStep('room_4b_brick')}
                    className="p-2.5 rounded bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 font-medium"
                  >
                    3. Room 4B Cavity
                  </button>
                </div>
              </div>
            )}

            {accuseState.step === 4 && (
              <div>
                <div className="text-xs text-rose-400 font-bold mb-2">Step 4: Do you perform the purifying Nat Pacification Rite?</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleAccusationStep('yes')}
                    className="p-2.5 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-200 font-bold"
                  >
                    1. Yes, light sacred candles and pour jasmine water
                  </button>
                  <button
                    onClick={() => handleAccusationStep('no')}
                    className="p-2.5 rounded bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-200 font-bold"
                  >
                    2. No, attempt to flee the 1998 echo immediately
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {screenMode === 'ending_screen' && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-300 font-semibold">Narrative Resolution Complete</span>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play Again / Reset Prototype</span>
            </button>
          </div>
        )}

        {/* Command Line Input */}
        <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 pt-1">
          <span className="text-amber-400 font-bold text-sm">?-</span>
          <input
            ref={inputRef}
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="Type menu number (1-6) or command..."
            className="flex-1 bg-stone-950 border border-stone-800 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 rounded px-3 py-1.5 text-xs text-stone-200 outline-none font-mono placeholder:text-stone-600"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded text-xs text-stone-200 font-semibold transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
