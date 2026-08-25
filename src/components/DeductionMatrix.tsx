import React from 'react';
import { CHARACTERS, GUARDIAN_PAIRS, VICTIM_RIDDLES, CLUES, ENDINGS_INFO } from '../gameData';
import {
  ShieldAlert,
  HelpCircle,
  Sparkles,
  Users,
  Compass,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export const DeductionMatrix: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold mb-2">
            <Compass className="w-4 h-4" />
            <span>Ground Truth (spirit_fact/2)</span>
          </div>
          <ul className="text-xs space-y-1.5 text-stone-300 font-mono">
            <li><span className="text-stone-500">victim_name:</span> <strong className="text-amber-300">mama_may</strong></li>
            <li><span className="text-stone-500">true_killer:</span> <strong className="text-amber-300">sandar</strong> (roommate)</li>
            <li><span className="text-stone-500">true_cause:</span> <strong className="text-amber-300">strangled</strong></li>
            <li><span className="text-stone-500">true_body_location:</span> <strong className="text-amber-300">dried_well</strong></li>
            <li><span className="text-stone-500">red_herring:</span> <strong className="text-rose-400">ko_zaw</strong> (innocent)</li>
            <li><span className="text-stone-500">secret_connection:</span> <strong className="text-indigo-400">aye_aye &rarr; sandar</strong></li>
          </ul>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Hostel Guardian Logic</span>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            Speaks in <strong className="text-stone-200">PAIRS</strong> where <strong className="text-amber-300">EXACTLY ONE</strong> statement is true.
            Trusting the wrong statement asserts <code className="text-rose-400">used_unverified_claim/2</code>, inflicting betrayal damage (+10% Grief, composure loss) and leading to the <strong className="text-rose-400">deceived</strong> ending.
          </p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-2 text-rose-400 text-sm font-bold mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Mama May Whispers</span>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            <strong className="text-stone-200">CANNOT lie</strong>, but speaks strictly in poetic riddles due to trauma.
            Decoded against physical clues. Misreading her asserts <code className="text-rose-400">misread_fact/2</code> and adds +15% Grief. Correct decodes reduce Grief by 10%.
          </p>
        </div>
      </div>

      {/* Disproof Chain Section */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-stone-100 mb-3 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>The Red Herring Disproof Engine (Ko Zaw vs. Sandar)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-stone-950 rounded-lg border border-stone-800">
            <span className="text-rose-400 font-bold block mb-1">1. Circumstantial Suspicion</span>
            <p className="text-stone-400">
              Ko Zaw was Mama May's boyfriend and was seen arguing. Guardian statement 1A claims "Ko Zaw killed her".
            </p>
          </div>
          <div className="p-3 bg-stone-950 rounded-lg border border-stone-800">
            <span className="text-amber-400 font-bold block mb-1">2. Physical Clue Intersect</span>
            <p className="text-stone-400">
              Diary page confirms: <em>Ko Zaw passionately hates pink</em>. Pink stained shirt found in laundry belonged to killer. Therefore, killer cannot be Ko Zaw.
            </p>
          </div>
          <div className="p-3 bg-stone-950 rounded-lg border border-stone-800">
            <span className="text-emerald-400 font-bold block mb-1">3. Grounded Conclusion</span>
            <p className="text-stone-400">
              Guardian Statement 1B is the true half. Roommate Sandar wore pink, braided Mama May's hair, and bribed caretaker 5,000 kyats to seal the well.
            </p>
          </div>
        </div>
      </div>

      {/* Archetypes & Fear Multipliers Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-stone-100 mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-400" />
          <span>MC Archetypes & Fear Multipliers</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400">
                <th className="py-2 px-3">Character</th>
                <th className="py-2 px-3">Archetype</th>
                <th className="py-2 px-3">Supernatural Direct</th>
                <th className="py-2 px-3">Physical Threat</th>
                <th className="py-2 px-3">Betrayal / Oath</th>
                <th className="py-2 px-3 font-sans">Special Trait</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300">
              {CHARACTERS.map((c) => (
                <tr key={c.id} className="hover:bg-stone-800/40">
                  <td className="py-2.5 px-3 font-bold text-amber-300">{c.name}</td>
                  <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300">{c.archetype}</span></td>
                  <td className={`py-2.5 px-3 ${c.multipliers.supernatural_direct > 1.0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
                    x{c.multipliers.supernatural_direct}
                  </td>
                  <td className={`py-2.5 px-3 ${c.multipliers.physical_threat > 1.0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
                    x{c.multipliers.physical_threat}
                  </td>
                  <td className={`py-2.5 px-3 ${c.multipliers.betrayal > 1.0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
                    x{c.multipliers.betrayal}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-stone-400 text-[11px]">{c.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Endings Matrix */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-stone-100 mb-3">All 7 Narrative Endings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {Object.entries(ENDINGS_INFO).map(([id, info]) => (
            <div
              key={id}
              className={`p-3 rounded-lg border ${
                info.type === 'victory'
                  ? 'bg-emerald-950/30 border-emerald-800/50 text-stone-200'
                  : info.type === 'twist'
                  ? 'bg-indigo-950/30 border-indigo-800/50 text-stone-200'
                  : 'bg-stone-950 border-stone-800 text-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-amber-300">{info.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    info.type === 'victory'
                      ? 'bg-emerald-900 text-emerald-300'
                      : info.type === 'twist'
                      ? 'bg-indigo-900 text-indigo-300'
                      : 'bg-rose-950 text-rose-300'
                  }`}
                >
                  {id}
                </span>
              </div>
              <p className="text-stone-400 text-[11px] leading-relaxed">{info.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
