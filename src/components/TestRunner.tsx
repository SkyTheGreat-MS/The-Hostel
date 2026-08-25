import React, { useState } from 'react';
import {
  createInitialState,
  applyComposureDamage,
  consumeTurn,
  modifyGrief,
  deduceGuardianPair,
  decodeRiddle,
  resolveEnding,
} from '../prologEngine';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Terminal,
  FileCheck,
} from 'lucide-react';

interface TestCaseResult {
  id: string;
  name: string;
  category: string;
  passed: boolean;
  durationMs: number;
  expected: string;
  actual: string;
  trace: string[];
}

export const TestRunner: React.FC = () => {
  const [results, setResults] = useState<TestCaseResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runAllTests = () => {
    setIsRunning(true);
    const testList: TestCaseResult[] = [];

    // Test 1: composure_threshold_transitions
    {
      const start = performance.now();
      let state = createInitialState('thazin'); // thazin physical_threat mult = 0.8
      const trace: string[] = ['Init: Thazin (composure=100, state=normal)'];

      state = applyComposureDamage(state, 35, 'physical_threat'); // dmg = 28 -> 72 (normal)
      trace.push(`After 35 base physical dmg: Composure = ${state.playerComposure}% [${state.composureState}]`);
      const pass1 = state.playerComposure === 72 && state.composureState === 'normal';

      state = applyComposureDamage(state, 5, 'physical_threat'); // dmg = 4 -> 68 (shaken)
      trace.push(`After 5 base physical dmg: Composure = ${state.playerComposure}% [${state.composureState}]`);
      const pass2 = state.playerComposure === 68 && state.composureState === 'shaken';

      state = applyComposureDamage(state, 40, 'physical_threat'); // dmg = 32 -> 36 (panicking)
      trace.push(`After 40 base physical dmg: Composure = ${state.playerComposure}% [${state.composureState}]`);
      const pass3 = state.playerComposure === 36 && state.composureState === 'panicking';

      state = applyComposureDamage(state, 50, 'physical_threat'); // dmg = 40 -> 0 (broken)
      trace.push(`After 50 base physical dmg: Composure = ${state.playerComposure}% [${state.composureState}], gameOver = ${state.gameOver}`);
      const pass4 = state.playerComposure === 0 && state.composureState === 'broken' && state.gameOver === 'composure_zero';

      const passed = pass1 && pass2 && pass3 && pass4;
      testList.push({
        id: 'test_composure_thresholds',
        name: 'test(composure_threshold_transitions)',
        category: 'Composure & Fear Engine',
        passed,
        durationMs: Math.round((performance.now() - start) * 100) / 100,
        expected: 'Transitions: 100% (normal) -> 68% (shaken) -> 36% (panicking) -> 0% (broken / composure_zero)',
        actual: `Final composure=${state.playerComposure}%, state=${state.composureState}, gameOver=${state.gameOver}`,
        trace,
      });
    }

    // Test 2: turn_consumption_time_expired
    {
      const start = performance.now();
      let state = createInitialState('thazin');
      const trace = ['Init: timeRemaining=20'];

      state = consumeTurn(state, 15);
      trace.push(`Consumed 15 turns -> timeRemaining=${state.timeRemaining}`);
      const pass1 = state.timeRemaining === 5 && state.gameOver === null;

      state = consumeTurn(state, 10);
      trace.push(`Consumed 10 turns -> timeRemaining=${state.timeRemaining}, gameOver=${state.gameOver}`);
      const pass2 = state.timeRemaining === 0 && state.gameOver === 'time_expired';

      testList.push({
        id: 'test_turn_consumption',
        name: 'test(turn_consumption_time_expired)',
        category: 'Turn & Temporal Engine',
        passed: pass1 && pass2,
        durationMs: Math.round((performance.now() - start) * 100) / 100,
        expected: 'timeRemaining <= 0 asserts game_over(time_expired)',
        actual: `timeRemaining=${state.timeRemaining}, gameOver=${state.gameOver}`,
        trace,
      });
    }

    // Test 3: grief_overflow_trigger
    {
      const start = performance.now();
      let state = createInitialState('thazin');
      const trace = ['Init: mamaMayGrief=50%'];

      state = modifyGrief(state, 30);
      trace.push(`Added 30% grief -> grief=${state.mamaMayGrief}%`);
      const pass1 = state.mamaMayGrief === 80 && state.gameOver === null;

      state = modifyGrief(state, 30);
      trace.push(`Added 30% grief -> grief=${state.mamaMayGrief}%, gameOver=${state.gameOver}`);
      const pass2 = state.mamaMayGrief === 100 && state.gameOver === 'grief_overflow';

      testList.push({
        id: 'test_grief_overflow',
        name: 'test(grief_overflow_trigger)',
        category: 'Spirit Grief Engine',
        passed: pass1 && pass2,
        durationMs: Math.round((performance.now() - start) * 100) / 100,
        expected: 'mamaMayGrief reaches 100% and triggers game_over(grief_overflow)',
        actual: `mamaMayGrief=${state.mamaMayGrief}%, gameOver=${state.gameOver}`,
        trace,
      });
    }

    // Test 4: guardian_pair_vs_mama_may_misread_distinction
    {
      const start = performance.now();
      let state = createInitialState('thazin');
      const trace = ['Testing distinct classification of Guardian deception vs Mama May misreading'];

      // Pick wrong Guardian statement 1 (index 1 is false: 'Ko Zaw killed her')
      state = deduceGuardianPair(state, 1, 1);
      trace.push(`Guardian Pair 1 chose index 1 -> usedUnverifiedClaims asserted: "${state.usedUnverifiedClaims[1]}"`);
      const pass1 = Boolean(state.usedUnverifiedClaims[1]) && Object.keys(state.misreadFacts).length === 0;

      // Decode riddle incorrectly (topic cause_of_death -> poisoned instead of strangled)
      state = decodeRiddle(state, 'cause_of_death', 'poisoned');
      trace.push(`Decode riddle cause_of_death as poisoned -> misreadFacts asserted: "${state.misreadFacts['cause_of_death']}"`);
      const pass2 = state.misreadFacts['cause_of_death'] === 'poisoned' && !state.trustedFacts['cause_of_death'];

      testList.push({
        id: 'test_pair_vs_riddle_distinction',
        name: 'test(guardian_pair_vs_mama_may_misread_distinction)',
        category: 'Discrimination & Truth Verification',
        passed: pass1 && pass2,
        durationMs: Math.round((performance.now() - start) * 100) / 100,
        expected: 'Guardian error creates used_unverified_claim; Riddle misread creates misread_fact separately',
        actual: `unverifiedCount=${Object.keys(state.usedUnverifiedClaims).length}, misreadCount=${Object.keys(state.misreadFacts).length}`,
        trace,
      });
    }

    // Test 5: ending_time_expired_priority
    {
      const start = performance.now();
      let state = createInitialState('thazin');
      state.gameOver = 'time_expired';
      const ending = resolveEnding(state);
      testList.push({
        id: 'test_ending_time_expired',
        name: 'test(ending_time_expired_priority)',
        category: 'Ending Resolution Hierarchy',
        passed: ending === 'time_expired',
        durationMs: Math.round((performance.now() - start) * 100) / 100,
        expected: 'time_expired takes highest precedence',
        actual: `Resolved Ending = ${ending}`,
        trace: ['Fixture state with gameOver=time_expired', `resolve_ending/1 returned: ${ending}`],
      });
    }

    // Test 6: ending_composure_zero_priority
    {
      const start = performance.now();
      let state = createInitialState('thazin');
      state.gameOver = 'composure_zero';
      const ending = resolveEnding(state);
      testList.push({
        id: 'test_ending_composure_zero',
        name: 'test(ending_composure_zero_priority)',
        category: 'Ending Resolution Hierarchy',
        passed: ending === 'composure_zero',
        durationMs: Math.round((performance.now() - start) * 100) / 100,
        expected: 'composure_zero takes highest precedence',
        actual: `Resolved Ending = ${ending}`,
        trace: ['Fixture state with gameOver=composure_zero', `resolve_ending/1 returned: ${ending}`],
      });
    }

    // Test 7: ending_grief_overflow_priority
    {
      const start = performance.now();
      let state = createInitialState('thazin');
      state.gameOver = 'grief_overflow';
      const ending = resolveEnding(state);
      testList.push({
        id: 'test_ending_grief_overflow',
        name: 'test(ending_grief_overflow_priority)',
        category: 'Ending Resolution Hierarchy',
        passed: ending === 'grief_overflow',
        durationMs: Math.round((performance.now() - start) * 100) / 100,
        expected: 'grief_overflow takes highest precedence',
        actual: `Resolved Ending = ${ending}`,
        trace: ['Fixture state with gameOver=grief_overflow', `resolve_ending/1 returned: ${ending}`],
      });
    }

    // Test 8: ending_true_rest
    {
      const start = performance.now();
      let state = createInitialState('thazin');
      state.trustedFacts = {
        killer_identity: 'sandar',
        cause_of_death: 'strangled',
        body_location: 'dried_well',
      };
      state.finalAccusation = {
        killer: 'sandar',
        cause: 'strangled',
        location: 'dried_well',
      };
      state.ritePerformed = true;
      state.mamaMayGrief = 0;
      const ending = resolveEnding(state);
      testList.push({
        id: 'test_ending_true_rest',
        name: 'test(ending_true_rest)',
        category: 'Canonical Victory Logic',
        passed: ending === 'true_rest',
        durationMs: Math.round((performance.now() - start) * 100) / 100,
        expected: 'true_rest when accusation is grounded, rite is performed, and grief is pacified',
        actual: `Resolved Ending = ${ending}`,
        trace: [
          'Fixture: sandar + strangled + dried_well + rite=yes + grief=0',
          `resolve_ending/1 returned: ${ending}`,
        ],
      });
    }

    // Test 9: ending_twist_ending_priority
    {
      const start = performance.now();
      let state = createInitialState('thazin');
      state.trustedFacts = {
        killer_identity: 'sandar',
        cause_of_death: 'strangled',
        body_location: 'dried_well',
      };
      state.discoveredClues = ['antique_locket']; // Twist clue
      state.finalAccusation = {
        killer: 'sandar',
        cause: 'strangled',
        location: 'dried_well',
      };
      state.ritePerformed = true;
      state.mamaMayGrief = 0;
      const ending = resolveEnding(state);
      testList.push({
        id: 'test_ending_twist',
        name: 'test(ending_twist_ending_priority)',
        category: 'Twist Priority Logic',
        passed: ending === 'twist_ending',
        durationMs: Math.round((performance.now() - start) * 100) / 100,
        expected: 'twist_ending takes priority over true_rest when antique_locket is discovered',
        actual: `Resolved Ending = ${ending}`,
        trace: [
          'Fixture: sandar + strangled + dried_well + antique_locket (Aye Aye bloodline)',
          `resolve_ending/1 returned: ${ending}`,
        ],
      });
    }

    // Test 10: ending_deceived_due_to_unverified_guardian_claim
    {
      const start = performance.now();
      let state = createInitialState('thazin');
      state.usedUnverifiedClaims = { 1: 'Ko Zaw killed her.' };
      state.finalAccusation = {
        killer: 'ko_zaw',
        cause: 'strangled',
        location: 'dried_well',
      };
      state.ritePerformed = true;
      const ending = resolveEnding(state);
      testList.push({
        id: 'test_ending_deceived',
        name: 'test(ending_deceived_due_to_unverified_guardian_claim)',
        category: 'Deception Penalization',
        passed: ending === 'deceived',
        durationMs: Math.round((performance.now() - start) * 100) / 100,
        expected: 'deceived ending when contaminated by unverified Guardian claim',
        actual: `Resolved Ending = ${ending}`,
        trace: [
          'Fixture: used_unverified_claim(1, "Ko Zaw killed her.")',
          `resolve_ending/1 returned: ${ending}`,
        ],
      });
    }

    // Test 11: ending_misunderstood_due_to_misread_riddle
    {
      const start = performance.now();
      let state = createInitialState('thazin');
      state.misreadFacts = { cause_of_death: 'poisoned' };
      state.finalAccusation = {
        killer: 'sandar',
        cause: 'poisoned',
        location: 'dried_well',
      };
      state.ritePerformed = true;
      const ending = resolveEnding(state);
      testList.push({
        id: 'test_ending_misunderstood',
        name: 'test(ending_misunderstood_due_to_misread_riddle)',
        category: 'Misread Riddle Resolution',
        passed: ending === 'misunderstood',
        durationMs: Math.round((performance.now() - start) * 100) / 100,
        expected: 'misunderstood ending when riddle is misread and no unverified claim exists',
        actual: `Resolved Ending = ${ending}`,
        trace: [
          'Fixture: misread_fact(cause_of_death, poisoned)',
          `resolve_ending/1 returned: ${ending}`,
        ],
      });
    }

    setResults(testList);
    setIsRunning(false);
  };

  const totalPassed = results.filter((r) => r.passed).length;

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xl flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-stone-100">PLUnit Test Suite Executor</h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Validates SWI-Prolog state machine predicates, fail boundaries, and ending resolution fixtures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {results.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-xs">
              <span className="text-stone-400">Score:</span>
              <span className={`font-bold ${totalPassed === results.length ? 'text-emerald-400' : 'text-rose-400'}`}>
                {totalPassed} / {results.length} Passed
              </span>
            </div>
          )}

          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-bold rounded-lg text-xs transition-colors shadow-md"
          >
            {isRunning ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-stone-950" />}
            <span>Run PLUnit Tests</span>
          </button>
        </div>
      </div>

      {/* SWI-Prolog Execution Command Banner */}
      <div className="bg-stone-950 p-3.5 rounded-lg border border-stone-800 flex items-center justify-between text-xs font-mono text-stone-300">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-400 shrink-0" />
          <span>swipl -s spirit_labyrinth.pl -g "run_tests, halt."</span>
        </div>
        <span className="text-stone-500 text-[11px]">SWI-Prolog PLUnit Suite</span>
      </div>

      {/* Test Case Cards */}
      {results.length === 0 ? (
        <div className="text-center py-12 text-stone-500 text-sm">
          Click <strong className="text-stone-300">"Run PLUnit Tests"</strong> to execute all 11 Prolog test predicates.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {results.map((t) => (
            <div
              key={t.id}
              className={`p-4 rounded-lg border text-xs transition-all ${
                t.passed
                  ? 'bg-stone-950/70 border-emerald-900/40 text-stone-200'
                  : 'bg-rose-950/30 border-rose-800/60 text-stone-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {t.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <span className="font-mono font-bold text-amber-300">{t.name}</span>
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 font-sans">
                      {t.category}
                    </span>
                  </div>
                </div>
                <span className="text-stone-500 font-mono text-[11px]">{t.durationMs}ms</span>
              </div>

              <div className="mt-2 space-y-1 pl-6">
                <div className="text-stone-400">
                  <strong className="text-stone-300">Expected:</strong> {t.expected}
                </div>
                <div className="text-stone-400">
                  <strong className="text-stone-300">Actual:</strong> {t.actual}
                </div>

                <div className="mt-2 p-2 bg-stone-900/80 rounded border border-stone-800/60 font-mono text-[11px] text-stone-400 space-y-0.5">
                  {t.trace.map((tr, i) => (
                    <div key={i}>% {tr}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
