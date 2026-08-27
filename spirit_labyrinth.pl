:- module(spirit_labyrinth, [
    % Game State & Lifecycle Predicates
    reset_game/0,
    select_character/1,
    explore/1,
    accuse/3,
    perform_rite/1,
    resolve_ending/1,
    get_game_state/1,
    run_tests/0,

    % Core Mechanic Predicates
    consume_turn/1,
    apply_composure_damage/2,
    modify_grief/1,
    check_fail_conditions/0,
    deduce_guardian_pair/2,
    decode_riddle/2,
    pair_trusted_fact/2,

    % State & Knowledge Facts (Inspectable over HTTP/JSON API)
    chapter/1,
    exploration_count/1,
    time_remaining/1,
    player_composure/1,
    mama_may_grief/1,
    selected_mc/1,
    composure_state/1,
    game_over/1,
    discovered_clue/1,
    decoded_cipher/1,
    deduced_choice/2,
    used_unverified_claim/2,
    decode_choice/2,
    correct_decode/2,
    trusted_fact/2,
    misread_fact/2,
    rite_performed/1,
    final_accusation/3,
    ending_reached/1,

    % Static Entities & Rules
    mc/4,
    fear_multiplier/3,
    hostel_location/4,
    clue_data/4,
    hint_pair/3,
    true_index/2,
    victim_utterance/3,
    decode_options/2,
    spirit_fact/2
]).

/** <module> Hostel 1998: Spirit Labyrinth - Core Prolog Logic Engine
 *
 * Backend Prolog knowledge base and rule evaluation engine for THE SPIRIT'S LABYRINTH.
 * 
 * Individual predicates are exposed for decoupled execution via local HTTP/JSON API
 * and TypeScript bindings. The monolithic terminal loop has been retired to dev_terminal_test.pl.
 *
 * PREMISE:
 * Six college friends perform a nat-calling ritual that summons Mama May,
 * a woman murdered in the hostel in 1998. When the ritual glass shatters,
 * the selected Main Character (MC) falls unconscious and is trapped ALONE
 * in the 1998 temporal echo of the hostel.
 *
 * Ground Truth:
 * - Victim: Mama May
 * - Killer: Sandar (Mama May's roommate)
 * - Cause: Strangled
 * - Location: Old Dried Well
 * - Red Herring Suspect: Ko Zaw (Boyfriend - innocent)
 * - Twist Connection: Aye Aye (2026 friend) is Sandar's niece.
 */

:- use_module(library(plunit)).

/* ==========================================================================
   DYNAMIC STATE DECLARATIONS
   ========================================================================== */

:- dynamic chapter/1.                % Active chapter number (default: 1)
:- dynamic exploration_count/1.      % Number of wander choices in Chapter 1 (default: 0)
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

% mc(Id, Name, ArchetypeTag, Description)
mc(thazin,    'Thazin',    'Skeptic',    'Calculates probability, struggles when confronted by supernatural manifestations.').
mc(min_khant, 'Min Khant', 'Protector',  'Steadfast against physical danger, vulnerable to betrayal and moral dread.').
mc(htet,      'Htet',      'Archivist',  'Keen eye for documents and ciphers, physically frail in tense confrontations.').
mc(aye_aye,   'Aye Aye',   'Kin-Bound',  'Deeply attuned to emotional resonance, carrying unseen familial ties to 1998.').
mc(kyaw_swar, 'Kyaw Swar', 'Daredevil',  'Bold and impulsive, quick to act but easily unhinged by quiet psychological torment.').
mc(su_su,     'Su Su',     'Intuitive',  'Spiritually receptive, hears spirit whispers clearly but bears high mental fatigue.').

% fear_multiplier(MC_Id, TriggerType, Multiplier)
% Triggers: supernatural_direct, physical_threat, betrayal
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

% location(Id, Name, Description, TurnCost)
hostel_location(dorm_room_4b,      'Dormitory Room 4B',         'Mama May and Sandar shared quarters in 1998.', 2).
hostel_location(hostel_laundry,    'Basement Laundry Basin',    'Smells of stale soap, lye, and stagnant puddle water.', 2).
hostel_location(caretaker_office,  'Caretaker Old Office',      'Dusty shelves, rusted keyrings, and locked wooden chests.', 2).
hostel_location(courtyard_shrine,  'Courtyard Nat Shrine',      'A weather-beaten wooden shrine facing an overgrown dried stone well.', 2).
hostel_location(common_hall,       'Hostel Common Hallway',     'Notice boards from 1998 with student logs and torn posters.', 1).

% clue_data(ClueId, LocationId, Title, Details)
clue_data(diary_page, dorm_room_4b,
    'Torn Diary Page (Aug 1998)',
    'A handwritten entry by Mama May: "Ko Zaw yelled at the tea shop today when I wore magenta. He passionately detests the color pink—he says it makes him physically ill."').

clue_data(pink_shirt, hostel_laundry,
    'Stained Pink Silk Longyi & Blouse',
    'Found buried beneath lye powder in laundry vat #3. Faint blood traces linger on the cuffs. The size tag matches a woman of Sandar\'s build.').

clue_data(caesar_chest, caretaker_office,
    'Iron-Banded Box with Caesar Cipher',
    'A locked lockbox inscribed with shifted Burmese script: "VHFUHW: 5000 NBDWV SDLG WR VHDO WKH GULHG ZHOO DQG EXUB WKH ERGB (Shift 3)". Decoded receipt: 5,000 kyats paid by Room 4B tenant (Sandar) to caretaker to seal dried well.').

clue_data(broken_rosary, courtyard_shrine,
    'Shattered Bodhi Prayer Beads',
    'Scattered wooden beads coated in red wax. A devotional item left by frightened students in 1998. (Pure red herring with no investigative payoff).').

clue_data(room_4b_log, common_hall,
    '1998 Residence Roster Log',
    'Official hostel ledger recording that Mama May and Sandar were close friends and roommates. Notations describe Sandar frequently braiding Mama May\'s hair before night assemblies.').

clue_data(antique_locket, dorm_room_4b,
    'Silver Filigree Locket',
    'Concealed behind loose teak baseboard. Contains a photo of Sandar holding an infant: "For Aunt Sandar, from Aye Aye\'s mother, July 1998." (Secret connection to 2026 friend Aye Aye).').

clue_data(glitch_body_glimpse, common_hall,
    'Glitching Spectral Silhouette',
    'A fleeting manifestation of Mama May\'s restless spirit glitching between 1998 and 2026 before dissolving into mist near the corridor.').

% Semantic relationships
clue_points_to(diary_page, ko_zaw_hates_pink).
clue_points_to(pink_shirt, killer_wore_pink).
clue_points_to(caesar_chest, sandar_bribed_to_seal_well).
clue_points_to(broken_rosary, red_herring_no_payoff).
clue_points_to(room_4b_log, sandar_braided_hair).
clue_points_to(antique_locket, aye_aye_kin_of_killer).
clue_points_to(glitch_body_glimpse, shadow_event_manifestation).

/* ==========================================================================
   THE GUARDIAN'S PAIRED HINTS (IDENTIFY + DECODE SYSTEM, PART 1)
   ========================================================================== */

/**
 * The Hostel Guardian Nat speaks in PAIRS where EXACTLY ONE is true.
 * Testing the MC's discernment against physical evidence.
 */
hint_pair(1,
    'Ko Zaw killed her in a fit of jealous fury.',
    'The pink shirt found in the laundry belongs to the killer.').
true_index(1, 2). % Pink shirt is true. Combined with diary (Ko Zaw hates pink), disproves Ko Zaw.

hint_pair(2,
    'Her body was dropped down into the old dried courtyard well.',
    'Her body rests beneath the roots of the ancient mango tree.').
true_index(2, 1). % Well is true.

hint_pair(3,
    'She met her end by a silver hairpin driven into her temple.',
    'Hands that once touched her with sisterly warmth choked her breath away.').
true_index(3, 2). % Strangled is true.

/* ==========================================================================
   MAMA MAY'S RIDDLES (IDENTIFY + DECODE SYSTEM, PART 2)
   ========================================================================== */

/**
 * Mama May CANNOT lie, but speaks in poetic/symbolic riddles.
 * Must be decoded against physical clues.
 */
victim_utterance(cause_of_death,
    'Hands that once gently braided my long hair closed around my throat instead.',
    strangled).

victim_utterance(killer_identity,
    'She wore my favorite rose-silk shawl while scrubbing crimson from her sleeves in the dead of night.',
    sandar).

victim_utterance(body_location,
    'Where the stone mouth swallowed monsoon rains and now lies dry in the shadow of the shrine, I sleep in cold stone.',
    dried_well).

% decode_options(Topic, [Option(MeaningKey, DisplayText)])
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

%% reset_game
%  Initializes all state variables for a clean playthrough.
reset_game :-
    retractall(chapter(_)),
    retractall(exploration_count(_)),
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
    assertz(chapter(1)),
    assertz(exploration_count(0)),
    assertz(time_remaining(20)),
    assertz(player_composure(100)),
    assertz(mama_may_grief(50)),
    assertz(selected_mc(thazin)),
    assertz(composure_state(normal)).

%% select_character(+MC_Id)
select_character(MC_Id) :-
    mc(MC_Id, _, _, _),
    retractall(selected_mc(_)),
    assertz(selected_mc(MC_Id)).

%% consume_turn(+Amount)
%  Decrements time remaining and triggers fail check.
consume_turn(Amount) :-
    time_remaining(T),
    NewT is max(0, T - Amount),
    retractall(time_remaining(_)),
    assertz(time_remaining(NewT)),
    check_fail_conditions.

%% apply_composure_damage(+BaseDamage, +TriggerType)
%  Applies archetype-specific fear multiplier, updates composure, updates state tags.
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

%% modify_grief(+Amount)
%  Updates Mama May's grief, clamped to [0, 100].
modify_grief(Amount) :-
    mama_may_grief(CurrentG),
    NewG is max(0, min(100, CurrentG + Amount)),
    retractall(mama_may_grief(_)),
    assertz(mama_may_grief(NewG)),
    check_fail_conditions.

%% check_fail_conditions
%  Asserts game_over state if threshold bounds are breached.
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

%% deduce_guardian_pair(+PairId, +ChosenIndex)
%  Evaluates player's chosen statement from the Guardian's pair.
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

%% pair_trusted_fact(+PairId, -Statement)
%  Succeeds only if player chose the true half of Guardian's pair.
pair_trusted_fact(PairId, Statement) :-
    deduced_choice(PairId, ChosenIdx),
    true_index(PairId, ChosenIdx),
    hint_pair(PairId, Stmt1, Stmt2),
    ( ChosenIdx =:= 1 -> Statement = Stmt1 ; Statement = Stmt2 ).

/* ==========================================================================
   MAMA MAY RIDDLE INTERACTION LOGIC
   ========================================================================== */

%% decode_riddle(+Topic, +ChosenMeaning)
%  Evaluates riddle interpretation.
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

%% accusation_valid(?Killer, ?Cause, ?Location)
%  Succeeds if all 3 elements are correctly deduced and grounded in evidence.
accusation_valid(Killer, Cause, Location) :-
    spirit_fact(true_killer, TrueK),
    spirit_fact(true_cause, TrueC),
    spirit_fact(true_body_location, TrueL),
    Killer == TrueK,
    Cause == TrueC,
    Location == TrueL,
    % Verify grounding in trusted facts, guardian pairs, or discovered clues
    ( trusted_fact(killer_identity, Killer) ; pair_trusted_fact(1, _) ; discovered_clue(caesar_chest) ),
    ( trusted_fact(cause_of_death, Cause)   ; pair_trusted_fact(3, _) ),
    ( trusted_fact(body_location, Location) ; pair_trusted_fact(2, _) ; discovered_clue(caesar_chest) ).

%% resolve_ending(-Ending)
%  Determines narrative outcome based on fail conditions and evidence state.
resolve_ending(Ending) :-
    % 1. Fail conditions take precedence
    ( game_over(Reason), Reason \= resolved(_) ->
        Ending = Reason
    % 2. Accusation and rite checks
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
    % 3. Contaminated by unverified claim from Guardian
    ; used_unverified_claim(_, _) ->
        Ending = deceived
    % 4. Contaminated by misread riddle
    ; misread_fact(_, _) ->
        Ending = misunderstood
    % 5. Default fallback
    ; Ending = deceived
    ),
    retractall(ending_reached(_)),
    assertz(ending_reached(Ending)).

/* ==========================================================================
   INVESTIGATION & GAME LOOP ACTIONS
   ========================================================================== */

%% explore(+LocationId)
%  In Chapter 1, exploring is a fixed narrative sequence.
%  After 3 exploration choices, triggers the shadow event and updates to Chapter 2.
explore(LocationId) :-
    chapter(1), !,
    hostel_location(LocationId, LocName, _, _),
    format('~n[CHAPTER 1 WANDER] Exploring ~w...~n', [LocName]),
    consume_turn(1),
    ( exploration_count(Count) -> true ; Count = 0 ),
    NewCount is Count + 1,
    retractall(exploration_count(_)),
    assertz(exploration_count(NewCount)),
    ( NewCount >= 3 ->
        format('~n*** SHADOW EVENT TRIGGERED ***~n', []),
        format('A distorted spectral silhouette flickers at the edge of the corridor!~n', []),
        ( discovered_clue(glitch_body_glimpse) -> true
        ; assertz(discovered_clue(glitch_body_glimpse)),
          format('  * DISCOVERED: Glitching Spectral Silhouette~n', [])
        ),
        retractall(chapter(_)),
        assertz(chapter(2)),
        format('State updated to Chapter 2: The Guardian Labyrinth Unlocked.~n', [])
    ; format('You wander the desolate corridors of August 1998 (~w/3 wander actions).~n', [NewCount])
    ).

%% explore(+LocationId)
%  In Chapter 2+, standard full investigation searches rooms and finds clues.
explore(LocationId) :-
    hostel_location(LocationId, LocName, _, TurnCost),
    format('~n[INVESTIGATION] Searching ~w (Cost: ~w turns)...~n', [LocName, TurnCost]),
    consume_turn(TurnCost),
    findall(ClueId, clue_data(ClueId, LocationId, _, _), Clues),
    discover_clues(Clues).

discover_clues([]).
discover_clues([ClueId|Rest]) :-
    clue_data(ClueId, _, Title, Details),
    ( discovered_clue(ClueId) ->
        format('  - (Already noted) ~w~n', [Title])
    ; assertz(discovered_clue(ClueId)),
      format('  * DISCOVERED: ~w~n    "~w"~n', [Title, Details]),
      ( ClueId == caesar_chest ->
          assertz(decoded_cipher(caesar_chest)),
          format('    >> Caesar cipher decoded (Shift 3): Confirms Sandar paid 5000 Kyats to caretaker.~n', [])
      ; true
      ),
      apply_composure_damage(5, supernatural_direct)
    ),
    discover_clues(Rest).

%% perform_rite(+Choice)
perform_rite(Choice) :-
    retractall(rite_performed(_)),
    assertz(rite_performed(Choice)),
    consume_turn(1).

%% accuse(+Killer, +Cause, +Location)
accuse(Killer, Cause, Location) :-
    retractall(final_accusation(_, _, _)),
    assertz(final_accusation(Killer, Cause, Location)),
    consume_turn(1).

/* ==========================================================================
   STATE INSPECTION & JSON SERIALIZATION HELPER
   ========================================================================== */

%% get_game_state(-StateDict)
%  Serializes the current in-memory Prolog state into a structured key-value dict
%  for consumption by local HTTP/JSON APIs and TypeScript bindings.
get_game_state(State) :-
    ( chapter(Chap)         -> true ; Chap = 1 ),
    ( exploration_count(EC) -> true ; EC = 0 ),
    ( time_remaining(T)     -> true ; T = 20 ),
    ( player_composure(C)   -> true ; C = 100 ),
    ( mama_may_grief(G)     -> true ; G = 50 ),
    ( selected_mc(MC)       -> true ; MC = thazin ),
    ( composure_state(CS)   -> true ; CS = normal ),
    ( game_over(GO)         -> true ; GO = null ),
    ( ending_reached(End)   -> true ; End = null ),
    ( rite_performed(Rite)  -> true ; Rite = null ),
    findall(Clue, discovered_clue(Clue), Clues),
    findall(Ciph, decoded_cipher(Ciph), Ciphers),
    findall(P-Choice, deduced_choice(P, Choice), DChoices),
    findall(P-Stmt, used_unverified_claim(P, Stmt), UVClaims),
    findall(Top-Mean, decode_choice(Top, Mean), DDecodes),
    findall(Top-Mean, trusted_fact(Top, Mean), TFacts),
    findall(Top-Mean, misread_fact(Top, Mean), MFacts),
    State = state{
        chapter: Chap,
        exploration_count: EC,
        time_remaining: T,
        player_composure: C,
        mama_may_grief: G,
        selected_mc: MC,
        composure_state: CS,
        game_over: GO,
        ending_reached: End,
        rite_performed: Rite,
        discovered_clues: Clues,
        decoded_ciphers: Ciphers,
        deduced_choices: DChoices,
        unverified_claims: UVClaims,
        decode_choices: DDecodes,
        trusted_facts: TFacts,
        misread_facts: MFacts
    }.

/* ==========================================================================
   NOTE: Interactive Terminal CLI Loop Retired
   The CLI terminal test harness is located in dev_terminal_test.pl.
   The primary player experience is driven by the routed web application.
   ========================================================================== */

/* ==========================================================================
   PLUNIT TEST SUITE
   ========================================================================== */

:- begin_tests(spirit_labyrinth).

test(composure_threshold_transitions) :-
    reset_game,
    select_character(thazin),
    player_composure(100),
    composure_state(normal),
    % Damage 35 -> Composure 100 - (35 * 0.8) = 72 -> normal
    apply_composure_damage(35, physical_threat),
    player_composure(C1),
    assertion(C1 =:= 72),
    assertion(composure_state(normal)),
    % Damage to drop <= 70 -> shaken
    apply_composure_damage(5, physical_threat),
    player_composure(C2),
    assertion(C2 =:= 68),
    assertion(composure_state(shaken)),
    % Damage to drop <= 40 -> panicking
    apply_composure_damage(40, physical_threat),
    player_composure(C3),
    assertion(C3 =:= 36),
    assertion(composure_state(panicking)),
    % Damage to drop <= 0 -> broken & game_over(composure_zero)
    apply_composure_damage(50, physical_threat),
    player_composure(0),
    assertion(composure_state(broken)),
    assertion(game_over(composure_zero)).

test(turn_consumption_time_expired) :-
    reset_game,
    time_remaining(20),
    consume_turn(15),
    time_remaining(5),
    \+ game_over(_),
    consume_turn(10),
    time_remaining(0),
    assertion(game_over(time_expired)).

test(grief_overflow_trigger) :-
    reset_game,
    mama_may_grief(50),
    modify_grief(30),
    mama_may_grief(80),
    \+ game_over(_),
    modify_grief(30),
    mama_may_grief(100),
    assertion(game_over(grief_overflow)).

test(guardian_pair_vs_mama_may_misread_distinction) :-
    reset_game,
    % Guardian pair 1: index 2 is true, index 1 is false ('Ko Zaw killed her')
    deduce_guardian_pair(1, 1),
    assertion(used_unverified_claim(1, 'Ko Zaw killed her.')),
    \+ pair_trusted_fact(1, _),
    \+ misread_fact(_, _),
    % Decode riddle incorrectly
    decode_riddle(cause_of_death, poisoned),
    assertion(misread_fact(cause_of_death, poisoned)),
    \+ trusted_fact(cause_of_death, _),
    % Ensure used_unverified_claim did NOT get asserted by riddle decode
    \+ used_unverified_claim(cause_of_death, _).

test(ending_time_expired_priority) :-
    reset_game,
    assertz(game_over(time_expired)),
    resolve_ending(Ending),
    assertion(Ending == time_expired).

test(ending_composure_zero_priority) :-
    reset_game,
    assertz(game_over(composure_zero)),
    resolve_ending(Ending),
    assertion(Ending == composure_zero).

test(ending_grief_overflow_priority) :-
    reset_game,
    assertz(game_over(grief_overflow)),
    resolve_ending(Ending),
    assertion(Ending == grief_overflow).

test(ending_true_rest) :-
    reset_game,
    % Setup valid accusation facts
    assertz(trusted_fact(killer_identity, sandar)),
    assertz(trusted_fact(cause_of_death, strangled)),
    assertz(trusted_fact(body_location, dried_well)),
    assertz(final_accusation(sandar, strangled, dried_well)),
    assertz(rite_performed(yes)),
    retractall(mama_may_grief(_)),
    assertz(mama_may_grief(0)),
    resolve_ending(Ending),
    assertion(Ending == true_rest).

test(ending_twist_ending_priority) :-
    reset_game,
    assertz(trusted_fact(killer_identity, sandar)),
    assertz(trusted_fact(cause_of_death, strangled)),
    assertz(trusted_fact(body_location, dried_well)),
    assertz(discovered_clue(antique_locket)), % Twist clue!
    assertz(final_accusation(sandar, strangled, dried_well)),
    assertz(rite_performed(yes)),
    retractall(mama_may_grief(_)),
    assertz(mama_may_grief(0)),
    resolve_ending(Ending),
    assertion(Ending == twist_ending).

test(ending_deceived_due_to_unverified_guardian_claim) :-
    reset_game,
    assertz(used_unverified_claim(1, 'Ko Zaw killed her.')),
    assertz(final_accusation(ko_zaw, strangled, dried_well)),
    assertz(rite_performed(yes)),
    resolve_ending(Ending),
    assertion(Ending == deceived).

test(ending_misunderstood_due_to_misread_riddle) :-
    reset_game,
    assertz(misread_fact(cause_of_death, poisoned)),
    assertz(final_accusation(sandar, poisoned, dried_well)),
    assertz(rite_performed(yes)),
    resolve_ending(Ending),
    assertion(Ending == misunderstood).

test(chapter_1_exploration_shadow_event_transition) :-
    reset_game,
    assertion(chapter(1)),
    assertion(exploration_count(0)),
    explore(dorm_room_4b),
    assertion(chapter(1)),
    assertion(exploration_count(1)),
    explore(common_hall),
    assertion(chapter(1)),
    assertion(exploration_count(2)),
    explore(courtyard_shrine),
    assertion(chapter(2)),
    assertion(discovered_clue(glitch_body_glimpse)).

:- end_tests(spirit_labyrinth).

%% run_tests
%  Runs all plunit tests defined in the module.
run_tests :-
    run_tests(spirit_labyrinth).
