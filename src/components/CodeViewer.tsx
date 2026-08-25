import React, { useState } from 'react';
import { Copy, Check, Download, FileCode } from 'lucide-react';

const PROLOG_CODE = `:- module(spirit_labyrinth, [
    play/0,
    reset_game/0,
    select_character/1,
    explore/1,
    guardian_session/0,
    riddle_session/0,
    accuse/3,
    perform_rite/1,
    resolve_ending/1,
    run_tests/0,
    consume_turn/1,
    apply_composure_damage/2,
    modify_grief/1,
    check_fail_conditions/0,
    deduce_guardian_pair/2,
    decode_riddle/2,
    pair_trusted_fact/2,
    trusted_fact/2,
    misread_fact/2,
    used_unverified_claim/2
]).

/** <module> Hostel 1998: Spirit Labyrinth
 *
 * A text-based Prolog prototype for a narrative horror game set in a
 * traditional Myanmar university hostel.
 *
 * PREMISE:
 * Six college friends perform a nat-calling ritual that summons Mama May,
 * a woman murdered in the hostel in 1998. When the ritual glass shatters,
 * the selected Main Character (MC) falls unconscious and is trapped ALONE
 * in the 1998 temporal echo of the hostel.
 */

:- use_module(library(plunit)).

/* ==========================================================================
   DYNAMIC STATE DECLARATIONS
   ========================================================================== */

:- dynamic time_remaining/1.          % Turns left before 2026 anchor fades (default: 20)
:- dynamic player_composure/1.        % Composure percentage (0-100, default: 100)
:- dynamic mama_may_grief/1.          % Grief level (0-100, default: 50)
:- dynamic selected_mc/1.             % Chosen character id
:- dynamic composure_state/1.         % normal, shaken (<=70), panicking (<=40), broken (<=0)
:- dynamic game_over/1.               % time_expired, composure_zero, grief_overflow, resolved(Ending)

% Clue & Investigation State
:- dynamic discovered_clue/1.         % clue id
:- dynamic decoded_cipher/1.          % cipher id
:- dynamic deduced_choice/2.          % deduced_choice(PairId, ChosenIndex)
:- dynamic used_unverified_claim/2.   % used_unverified_claim(PairId, Statement)
:- dynamic decode_choice/2.           % decode_choice(Topic, Meaning)
:- dynamic correct_decode/2.          % correct_decode(Topic, Meaning)
:- dynamic trusted_fact/2.            % trusted_fact(Topic, Meaning)
:- dynamic misread_fact/2.            % misread_fact(Topic, WrongMeaning)
:- dynamic rite_performed/1.          % yes / no
:- dynamic final_accusation/3.        % final_accusation(Killer, Cause, Location)
:- dynamic ending_reached/1.          % Final resolved ending symbol

/* ==========================================================================
   GROUND TRUTH FACTS & ENTITIES
   ========================================================================== */

spirit_fact(victim_name, mama_may).
spirit_fact(true_killer, sandar).              % Mama May's roommate
spirit_fact(true_cause, strangled).
spirit_fact(true_body_location, dried_well).
spirit_fact(red_herring_suspect, ko_zaw).      % Mama May's boyfriend — innocent
spirit_fact(secret_connection, aye_aye, sandar). % Aye Aye is Sandar's niece — twist

is_victim(mama_may).
is_other_nat(hostel_guardian).

/* ==========================================================================
   MC ARCHETYPES & FEAR MULTIPLIERS
   ========================================================================== */

mc(thazin,    'Thazin',    'Skeptic',    'Calculates probability, struggles when confronted by supernatural manifestations.').
mc(min_khant, 'Min Khant', 'Protector',  'Steadfast against physical danger, vulnerable to betrayal and moral dread.').
mc(htet,      'Htet',      'Archivist',  'Keen eye for documents and ciphers, physically frail in tense confrontations.').
mc(aye_aye,   'Aye Aye',   'Kin-Bound',  'Deeply attuned to emotional resonance, carrying unseen familial ties to 1998.').
mc(kyaw_swar, 'Kyaw Swar', 'Daredevil',  'Bold and impulsive, quick to act but easily unhinged by quiet psychological torment.').
mc(su_su,     'Su Su',     'Intuitive',  'Spiritually receptive, hears spirit whispers clearly but bears high mental fatigue.').

fear_multiplier(thazin,    supernatural_direct, 1.5).
fear_multiplier(thazin,    physical_threat,     0.8).
fear_multiplier(thazin,    betrayal,            1.0).

fear_multiplier(min_khant, supernatural_direct, 1.0).
fear_multiplier(min_khant, physical_threat,     0.6).
fear_multiplier(min_khant, betrayal,            1.5).

fear_multiplier(htet,      supernatural_direct, 0.9).
fear_multiplier(htet,      physical_threat,     1.4).
fear_multiplier(htet,      betrayal,            0.8).

fear_multiplier(aye_aye,   supernatural_direct, 1.4).
fear_multiplier(aye_aye,   physical_threat,     1.2).
fear_multiplier(aye_aye,   betrayal,            1.5).

fear_multiplier(kyaw_swar, supernatural_direct, 1.2).
fear_multiplier(kyaw_swar, physical_threat,     0.7).
fear_multiplier(kyaw_swar, betrayal,            1.1).

fear_multiplier(su_su,     supernatural_direct, 0.7).
fear_multiplier(su_su,     physical_threat,     1.4).
fear_multiplier(su_su,     betrayal,            1.2).

/* ==========================================================================
   DISCOVERABLE CLUES IN 1998 HOSTEL
   ========================================================================== */

hostel_location(dorm_room_4b,      'Dormitory Room 4B',         'Mama May and Sandar shared quarters in 1998.', 2).
hostel_location(hostel_laundry,    'Basement Laundry Basin',    'Smells of stale soap, lye, and stagnant puddle water.', 2).
hostel_location(caretaker_office,  'Caretaker Old Office',      'Dusty shelves, rusted keyrings, and locked wooden chests.', 2).
hostel_location(courtyard_shrine,  'Courtyard Nat Shrine',      'A weather-beaten wooden shrine facing an overgrown dried stone well.', 2).
hostel_location(common_hall,       'Hostel Common Hallway',     'Notice boards from 1998 with student logs and torn posters.', 1).

clue_data(diary_page, dorm_room_4b,
    'Torn Diary Page (Aug 1998)',
    'A handwritten entry by Mama May: "Ko Zaw yelled at the tea shop today when I wore magenta. He passionately detests the color pink—he says it makes him physically ill."').

clue_data(pink_shirt, hostel_laundry,
    'Stained Pink Silk Longyi & Blouse',
    'Found buried beneath lye powder in laundry vat #3. Faint blood traces linger on the cuffs. The size tag matches a woman of Sandar\\'s build.').

clue_data(caesar_chest, caretaker_office,
    'Iron-Banded Box with Caesar Cipher',
    'A locked lockbox inscribed with shifted Burmese script: "VHFUHW: 5000 NBDWV SDLG WR VHDO WKH GULHG ZHOO DQG EXUB WKH ERGB (Shift 3)". Decoded receipt: 5,000 kyats paid by Room 4B tenant (Sandar) to caretaker to seal dried well.').

clue_data(broken_rosary, courtyard_shrine,
    'Shattered Bodhi Prayer Beads',
    'Scattered wooden beads coated in red wax. A devotional item left by frightened students in 1998. (Pure red herring with no investigative payoff).').

clue_data(room_4b_log, common_hall,
    '1998 Residence Roster Log',
    'Official hostel ledger recording that Mama May and Sandar were close friends and roommates. Notations describe Sandar frequently braiding Mama May\\'s hair before night assemblies.').

clue_data(antique_locket, dorm_room_4b,
    'Silver Filigree Locket',
    'Concealed behind loose teak baseboard. Contains a photo of Sandar holding an infant: "For Aunt Sandar, from Aye Aye\\'s mother, July 1998." (Secret connection to 2026 friend Aye Aye).').

clue_points_to(diary_page, ko_zaw_hates_pink).
clue_points_to(pink_shirt, killer_wore_pink).
clue_points_to(caesar_chest, sandar_bribed_to_seal_well).
clue_points_to(broken_rosary, red_herring_no_payoff).
clue_points_to(room_4b_log, sandar_braided_hair).
clue_points_to(antique_locket, aye_aye_kin_of_killer).

/* ==========================================================================
   THE GUARDIAN\\'S PAIRED HINTS (IDENTIFY + DECODE SYSTEM, PART 1)
   ========================================================================== */

hint_pair(1,
    'Ko Zaw killed her in a fit of jealous fury.',
    'The pink shirt found in the laundry belongs to the killer.').
true_index(1, 2).

hint_pair(2,
    'Her body was dropped down into the old dried courtyard well.',
    'Her body rests beneath the roots of the ancient mango tree.').
true_index(2, 1).

hint_pair(3,
    'She met her end by a silver hairpin driven into her temple.',
    'Hands that once touched her with sisterly warmth choked her breath away.').
true_index(3, 2).

/* ==========================================================================
   MAMA MAY\\'S RIDDLES (IDENTIFY + DECODE SYSTEM, PART 2)
   ========================================================================== */

victim_utterance(cause_of_death,
    'Hands that once gently braided my long hair closed around my throat instead.',
    strangled).

victim_utterance(killer_identity,
    'She wore my favorite rose-silk shawl while scrubbing crimson from her sleeves in the dead of night.',
    sandar).

victim_utterance(body_location,
    'Where the stone mouth swallowed monsoon rains and now lies dry in the shadow of the shrine, I sleep in cold stone.',
    dried_well).

decode_options(cause_of_death, [
    option(strangled, 'She was manually strangled by someone who used to braid her hair.'),
    option(poisoned,  'She was poisoned by a cup of jasmine tea laced with datura.'),
    option(drowned,   'She was drowned in the monsoon rainwater reservoir.')
]).

decode_options(killer_identity, [
    option(sandar,           'Her roommate Sandar, who wore her rose shawl and shared her room.'),
    option(ko_zaw,           'Her boyfriend Ko Zaw, trying to hide a violent confrontation.'),
    option(hostel_caretaker, 'The old hostel caretaker, acting on orders from university elders.')
]).

decode_options(body_location, [
    option(dried_well,      'The old dried well in the overgrown courtyard behind the shrine.'),
    option(mango_tree,      'Deep underground beneath the roots of the ancient courtyard mango tree.'),
    option(dorm_floorboard, 'Concealed within the double ceiling cavity above Room 4B.')
]).

/* ==========================================================================
   TURN, COMPOSURE, AND GRIEF ENGINE
   ========================================================================== */

reset_game :-
    retractall(time_remaining(_)),
    retractall(player_composure(_)),
    retractall(mama_may_grief(_)),
    retractall(selected_mc(_)),
    retractall(composure_state(_)),
    retractall(game_over(_)),
    retractall(discovered_clue(_)),
    retractall(decoded_cipher(_)),
    retractall(deduced_choice(_, _)),
    retractall(used_unverified_claim(_, _)),
    retractall(decode_choice(_, _)),
    retractall(correct_decode(_, _)),
    retractall(trusted_fact(_, _)),
    retractall(misread_fact(_, _)),
    retractall(rite_performed(_)),
    retractall(final_accusation(_, _, _)),
    retractall(ending_reached(_)),
    assertz(time_remaining(20)),
    assertz(player_composure(100)),
    assertz(mama_may_grief(50)),
    assertz(selected_mc(thazin)),
    assertz(composure_state(normal)).

select_character(MC_Id) :-
    mc(MC_Id, _, _, _),
    retractall(selected_mc(_)),
    assertz(selected_mc(MC_Id)).

consume_turn(Amount) :-
    time_remaining(T),
    NewT is max(0, T - Amount),
    retractall(time_remaining(_)),
    assertz(time_remaining(NewT)),
    check_fail_conditions.

apply_composure_damage(BaseDamage, TriggerType) :-
    ( selected_mc(MC) -> true ; MC = thazin ),
    ( fear_multiplier(MC, TriggerType, Mult) -> true ; Mult = 1.0 ),
    Damage is round(BaseDamage * Mult),
    player_composure(CurrentC),
    NewC is max(0, CurrentC - Damage),
    retractall(player_composure(_)),
    assertz(player_composure(NewC)),
    update_composure_tag(NewC),
    check_fail_conditions.

update_composure_tag(C) :-
    retractall(composure_state(_)),
    ( C =< 0  -> assertz(composure_state(broken))
    ; C =< 40 -> assertz(composure_state(panicking))
    ; C =< 70 -> assertz(composure_state(shaken))
    ; assertz(composure_state(normal))
    ).

modify_grief(Amount) :-
    mama_may_grief(CurrentG),
    NewG is max(0, min(100, CurrentG + Amount)),
    retractall(mama_may_grief(_)),
    assertz(mama_may_grief(NewG)),
    check_fail_conditions.

check_fail_conditions :-
    ( game_over(_) -> true
    ; time_remaining(0) ->
        assertz(game_over(time_expired))
    ; player_composure(0) ->
        assertz(game_over(composure_zero))
    ; mama_may_grief(100) ->
        assertz(game_over(grief_overflow))
    ; true
    ).

/* ==========================================================================
   GUARDIAN INTERACTION LOGIC
   ========================================================================== */

deduce_guardian_pair(PairId, ChosenIndex) :-
    retractall(deduced_choice(PairId, _)),
    assertz(deduced_choice(PairId, ChosenIndex)),
    true_index(PairId, TrueIdx),
    hint_pair(PairId, Stmt1, Stmt2),
    ( ChosenIndex =:= TrueIdx ->
        modify_grief(-5)
    ; ( ChosenIndex =:= 1 -> WrongStmt = Stmt1 ; WrongStmt = Stmt2 ),
      retractall(used_unverified_claim(PairId, _)),
      assertz(used_unverified_claim(PairId, WrongStmt)),
      modify_grief(10),
      apply_composure_damage(15, betrayal)
    ).

pair_trusted_fact(PairId, Statement) :-
    deduced_choice(PairId, ChosenIdx),
    true_index(PairId, ChosenIdx),
    hint_pair(PairId, Stmt1, Stmt2),
    ( ChosenIdx =:= 1 -> Statement = Stmt1 ; Statement = Stmt2 ).

/* ==========================================================================
   MAMA MAY RIDDLE INTERACTION LOGIC
   ========================================================================== */

decode_riddle(Topic, ChosenMeaning) :-
    retractall(decode_choice(Topic, _)),
    assertz(decode_choice(Topic, ChosenMeaning)),
    victim_utterance(Topic, _, TrueMeaning),
    ( ChosenMeaning == TrueMeaning ->
        retractall(trusted_fact(Topic, _)),
        retractall(correct_decode(Topic, _)),
        assertz(trusted_fact(Topic, TrueMeaning)),
        assertz(correct_decode(Topic, TrueMeaning)),
        modify_grief(-10)
    ; retractall(misread_fact(Topic, _)),
      assertz(misread_fact(Topic, ChosenMeaning)),
      modify_grief(15)
    ).

/* ==========================================================================
   ACCUSATION & ENDING RESOLUTION
   ========================================================================== */

accusation_valid(Killer, Cause, Location) :-
    spirit_fact(true_killer, TrueK),
    spirit_fact(true_cause, TrueC),
    spirit_fact(true_body_location, TrueL),
    Killer == TrueK,
    Cause == TrueC,
    Location == TrueL,
    ( trusted_fact(killer_identity, Killer) ; pair_trusted_fact(1, _) ; discovered_clue(caesar_chest) ),
    ( trusted_fact(cause_of_death, Cause)   ; pair_trusted_fact(3, _) ),
    ( trusted_fact(body_location, Location) ; pair_trusted_fact(2, _) ; discovered_clue(caesar_chest) ).

resolve_ending(Ending) :-
    ( game_over(Reason), Reason \\= resolved(_) ->
        Ending = Reason
    ; final_accusation(Killer, Cause, Loc),
      accusation_valid(Killer, Cause, Loc),
      rite_performed(yes) ->
        ( discovered_clue(antique_locket) ->
            Ending = twist_ending
        ; mama_may_grief(G), G =< 30 ->
            Ending = true_rest
        ; used_unverified_claim(_, _) ->
            Ending = deceived
        ; misread_fact(_, _) ->
            Ending = misunderstood
        ; Ending = true_rest
        )
    ; used_unverified_claim(_, _) ->
        Ending = deceived
    ; misread_fact(_, _) ->
        Ending = misunderstood
    ; Ending = deceived
    ),
    retractall(ending_reached(_)),
    assertz(ending_reached(Ending)).

/* ==========================================================================
   PLUNIT TEST SUITE
   ========================================================================== */

:- begin_tests(spirit_labyrinth).

test(composure_threshold_transitions) :-
    reset_game,
    select_character(thazin),
    player_composure(100),
    apply_composure_damage(35, physical_threat),
    player_composure(C1), assertion(C1 =:= 72),
    apply_composure_damage(5, physical_threat),
    player_composure(C2), assertion(C2 =:= 68),
    assertion(composure_state(shaken)),
    apply_composure_damage(40, physical_threat),
    player_composure(C3), assertion(C3 =:= 36),
    assertion(composure_state(panicking)),
    apply_composure_damage(50, physical_threat),
    player_composure(0),
    assertion(composure_state(broken)),
    assertion(game_over(composure_zero)).

test(turn_consumption_time_expired) :-
    reset_game,
    consume_turn(20),
    assertion(game_over(time_expired)).

test(grief_overflow_trigger) :-
    reset_game,
    modify_grief(50),
    assertion(game_over(grief_overflow)).

test(guardian_pair_vs_mama_may_misread_distinction) :-
    reset_game,
    deduce_guardian_pair(1, 1),
    assertion(used_unverified_claim(1, 'Ko Zaw killed her.')),
    decode_riddle(cause_of_death, poisoned),
    assertion(misread_fact(cause_of_death, poisoned)),
    \\+ used_unverified_claim(cause_of_death, _).

test(ending_true_rest) :-
    reset_game,
    assertz(trusted_fact(killer_identity, sandar)),
    assertz(trusted_fact(cause_of_death, strangled)),
    assertz(trusted_fact(body_location, dried_well)),
    assertz(final_accusation(sandar, strangled, dried_well)),
    assertz(rite_performed(yes)),
    retractall(mama_may_grief(_)),
    assertz(mama_may_grief(0)),
    resolve_ending(Ending),
    assertion(Ending == true_rest).

:- end_tests(spirit_labyrinth).

run_tests :-
    run_tests(spirit_labyrinth).
`;

export const CodeViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PROLOG_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([PROLOG_CODE], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'spirit_labyrinth.pl';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lines = PROLOG_CODE.trim().split('\n');

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xl flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-stone-100">spirit_labyrinth.pl</h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Single loadable SWI-Prolog module containing facts, predicates, turn engine, and plunit test suite.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold border border-stone-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-lg text-xs font-bold transition-colors shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .pl</span>
          </button>
        </div>
      </div>

      {/* Code container */}
      <div className="bg-stone-950 rounded-lg border border-stone-800 overflow-hidden font-mono text-xs max-h-[560px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-stone-900/50">
                <td className="w-12 text-right pr-4 pl-2 py-0.5 text-stone-600 select-none border-r border-stone-800/60 bg-stone-950/80">
                  {i + 1}
                </td>
                <td className="py-0.5 px-4 text-stone-300 whitespace-pre">
                  {line.startsWith('%') || line.startsWith('/*') || line.startsWith(' *') || line.startsWith(' */') ? (
                    <span className="text-stone-500 italic">{line}</span>
                  ) : line.startsWith(':-') ? (
                    <span className="text-amber-400 font-semibold">{line}</span>
                  ) : line.includes(':-') ? (
                    <span>
                      <span className="text-amber-300 font-medium">{line.split(':-')[0]}</span>
                      <span className="text-amber-500"> :-</span>
                      <span className="text-stone-300">{line.split(':-').slice(1).join(':-')}</span>
                    </span>
                  ) : (
                    line
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
