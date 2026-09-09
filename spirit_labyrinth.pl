:- module(game_kb, [
    init_game_state/0,
    current_location/1,
    inventory/1,
    has_item/1,
    clue_discovered/1,
    door_state/2,
    composure/1,
    time_remaining/1,
    move_to/1,
    pickup_item/1,
    inspect_target/2,
    unlock_exit_door/0,
    deduct_composure/1,
    restart_chapter_one/0,
    unlock_caretaker_office/1,
    perform_nat_awakening/0,
    caretaker_door/1,
    altar_candle_count/1,
    altar_bell_placed/1,
    nat_summoned/1,
    chapter/1,
    % Chapter 2 Phase 1 Interrogation & Law of Reality exports
    topic_unlocked/1,
    topic_exhausted/1,
    nat_persistent_state/1,
    unlock_topic_by_clue/2,
    evaluate_nat_query/3,
    nat_topic_meta/3,
    nat_knows/3,
    query_nat_about/3,
    query_nat/3,
    inquiry_count/1,
    apply_inquiry_strain/0,
    increment_inquiry_counter/0,
    nat_summoned/0,
    nat_consulted/0,
    nat_inquiry_made/1,
    learned_clue/1,
    taboo_triggered/1,
    deduction_unlocked/1,
    nat_statement/4,
    ask_nat/3,
    conclude_nat_audience/0,
    check_deductions/0,
    detect_key_deceit/0,
    detect_pacification_method/0,
    apply_composure_damage/2,
    advance_chapter_phase/2,
    chapter_phase/2,
    % Chapter 2 Caretaker Room Blackout & Quickslot Inventory exports
    caretaker_power_killed/0,
    caretaker_spectral_climax/0,
    trigger_caretaker_climax/0,
    can_perform_altar_rite/0,
    room_state/2,
    inspect_location/2,
    get_quickslot_inventory/1,
    player_has/1,
    prefix_up_to/3,
    item_display_meta/3,
    get_player_inventory_labels/1,
    scene_background/2,
    % Section 8: Investigator Tension/Resolve & Time Bank Rollover exports
    selected_investigator/1,
    investigator_stat/3,
    current_chapter/1,
    player_time_remaining/1,
    player_composure/1,
    init_investigation/1,
    advance_chapter_with_rollover/1,
    apply_fear_shock/1,
    apply_relief_recovery/1,
    % Section 9: Caretaker Mechanical Padlock & Nat Dialogue Step exports
    caretaker_latch_unlocked/0,
    nat_dialogue_step/1,
    attempt_caretaker_combination/1,
    advance_nat_dialogue/0,
    % Section 10: Chapter 2 Caretaker Return & Movement exports
    path/2,
    leave_caretaker_office/0
]).

:- dynamic current_location/1.
:- dynamic inventory/1.
:- dynamic clue_discovered/1.
:- dynamic door_state/2.
:- dynamic composure/1.
:- dynamic time_remaining/1.
:- dynamic subscene_state/2.
:- dynamic caretaker_door/1.
:- dynamic altar_candle_count/1.
:- dynamic altar_bell_placed/1.
:- dynamic nat_summoned/1.
:- dynamic chapter/1.
:- dynamic chapter_phase/2.

% Chapter 2 Guardian Nat Interrogation & Law of Reality Dynamic State
:- dynamic topic_unlocked/1.
:- dynamic topic_exhausted/1.
:- dynamic nat_persistent_state/1.
:- dynamic nat_knows/3.
:- dynamic nat_summoned/0.
:- dynamic nat_consulted/0.
:- dynamic nat_inquiry_made/1.
:- dynamic learned_clue/1.
:- dynamic taboo_triggered/1.
:- dynamic deduction_unlocked/1.
:- dynamic inquiry_count/1.

% Chapter 2 Caretaker Blackout & Inventory Dynamic State
:- dynamic caretaker_power_killed/0.
:- dynamic caretaker_spectral_climax/0.
:- dynamic room_state/2.
:- dynamic player_has/1.

% Investigator Tension & Resolve, Time Bank, and Dynamic Vitals
:- dynamic selected_investigator/1.
:- dynamic investigator_stat/3.
:- dynamic current_chapter/1.
:- dynamic player_time_remaining/1.
:- dynamic player_composure/1.

% Caretaker Mechanical Latch & Nat Dialogue Step Tracking
:- dynamic caretaker_latch_unlocked/0.
:- dynamic nat_dialogue_step/1.

% Top-level defaults for interactive evaluation & bridge queries
:- assertz(nat_summoned).
:- assertz(nat_persistent_state(summoned)).
:- assertz(composure(100)).
:- assertz(current_location(prayer_altar)).
:- assertz(chapter(2)).
:- assertz(chapter_phase(2, 1)).
:- assertz(nat_dialogue_step(1)).
:- assertz(inquiry_count(0)).

% ==============================================================================
% 1. WORLD TOPOLOGY (Phase 1, 2, and 3 Navigation Graph)
% ==============================================================================

% Room 4B Interior Locations
location(room_4b_main).
location(room_4b_desk).
location(room_4b_wardrobe_footing).
location(room_4b_door).

% Pathway 326 & West Wing Locations
location(pathway_326_threshold).
location(west_split_landing).
location(stairwell_gate).
location(washroom_main).
location(washroom_basin).
location(washroom_stall).
location(washroom_rope).
location(washroom_mirror).

% East Wing Locations
location(east_fork).
location(lockers_main).
location(locker_32).
location(locker_09).
location(locker_14).
location(locker_spider).
location(caretaker_door_keypad).
location(caretaker_office_main).
location(prayer_room_main).
location(prayer_altar).

% Bidirectional and Directional Passages
connected(room_4b_main, room_4b_desk).
connected(room_4b_desk, room_4b_main).

connected(room_4b_main, room_4b_wardrobe_footing).
connected(room_4b_wardrobe_footing, room_4b_main).

connected(room_4b_main, room_4b_door).
connected(room_4b_door, room_4b_main).

% Exiting Room 4B into Pathway 326 (Requires unlocked door)
can_traverse(room_4b_main, pathway_326_threshold) :-
    door_state(room_4b_door, unlocked).

% Re-entering Room 4B from Hallway Threshold
can_traverse(pathway_326_threshold, room_4b_main) :-
    door_state(room_4b_door, unlocked).

% Pathway 326 Split Navigation
can_traverse(pathway_326_threshold, west_split_landing).
can_traverse(west_split_landing, pathway_326_threshold).

% Split Landing Branches (Left = Washroom, Right = Stairs Down)
can_traverse(west_split_landing, washroom_main).
can_traverse(washroom_main, west_split_landing).

can_traverse(west_split_landing, stairwell_gate).
can_traverse(stairwell_gate, west_split_landing).

% Washroom Sub-Scene Navigation
can_traverse(washroom_main, washroom_basin).
can_traverse(washroom_basin, washroom_main).

can_traverse(washroom_main, washroom_stall).
can_traverse(washroom_stall, washroom_main).

can_traverse(washroom_main, washroom_rope).
can_traverse(washroom_rope, washroom_main).

can_traverse(washroom_main, washroom_mirror).
can_traverse(washroom_mirror, washroom_main).

% East Wing Fork Navigation
can_traverse(pathway_326_threshold, east_fork).
can_traverse(east_fork, pathway_326_threshold).

% East Wing Branches
can_traverse(east_fork, lockers_main).
can_traverse(lockers_main, east_fork).

can_traverse(lockers_main, locker_32) :- has_item(small_brass_key_32).
can_traverse(locker_32, lockers_main).

can_traverse(lockers_main, locker_09).
can_traverse(locker_09, lockers_main).

can_traverse(lockers_main, locker_14).
can_traverse(locker_14, lockers_main).

can_traverse(lockers_main, locker_spider).
can_traverse(locker_spider, lockers_main).

can_traverse(east_fork, caretaker_door_keypad).
can_traverse(caretaker_door_keypad, east_fork).

can_traverse(caretaker_door_keypad, caretaker_office_main) :-
    caretaker_door(unlocked).
can_traverse(caretaker_office_main, east_fork).
can_traverse(caretaker_office, east_fork).

can_traverse(east_fork, prayer_room_main).
can_traverse(prayer_room_main, east_fork).

can_traverse(prayer_room_main, prayer_altar).
can_traverse(prayer_altar, prayer_room_main).

% Path-based traversal for chapter movements
can_traverse(From, To) :-
    path(From, To).

% Fallback traversal for standard connections
can_traverse(From, To) :-
    connected(From, To).

% ==============================================================================
% 2. ITEMS & TOOLS REGISTRATION
% ==============================================================================

item(bobby_pin, room_4b_desk, 'A bent steel hairpin; ideal for pin-tumbler lock picking.').
item(wooden_bat, room_4b_wardrobe_footing, 'A solid teak timber baseboard; blunt force tool.').
item(small_brass_key_32, washroom_basin, 'A small brass key stamped with 32, taken from a soaked uniform.').
item(coiled_nylon_rope, washroom_rope, 'Weathered nylon-jute packing rope looped over the drainage pipe.').
item(black_beeswax_candle, locker_09, 'A heavy taper molded from dark beeswax.').
item(matchbox_three_stars, locker_09, 'A damp wooden matchbox with red phosphorus striking strip.').
item(bronze_prayer_bell, caretaker_office_main, 'A ceremonial temple bell made of cast bronze.').

% ==============================================================================
% 3. INITIALIZATION & RESTART ROUTINES
% ==============================================================================

init_game_state :-
    retractall(current_location(_)),
    retractall(inventory(_)),
    retractall(clue_discovered(_)),
    retractall(door_state(_, _)),
    retractall(composure(_)),
    retractall(time_remaining(_)),
    retractall(subscene_state(_, _)),
    retractall(caretaker_door(_)),
    retractall(altar_candle_count(_)),
    retractall(altar_bell_placed(_)),
    retractall(nat_summoned),
    retractall(nat_summoned(_)),
    retractall(nat_consulted),
    retractall(nat_inquiry_made(_)),
    retractall(learned_clue(_)),
    retractall(taboo_triggered(_)),
    retractall(deduction_unlocked(_)),
    retractall(chapter(_)),
    retractall(chapter_phase(_, _)),
    retractall(caretaker_power_killed),
    retractall(room_state(_, _)),
    retractall(player_has(_)),
    retractall(caretaker_latch_unlocked),
    retractall(nat_dialogue_step(_)),
    retractall(topic_unlocked(_)),
    retractall(topic_exhausted(_)),
    retractall(nat_persistent_state(_)),
    retractall(inquiry_count(_)),
    
    assertz(current_location(room_4b_main)),
    assertz(inventory([])),
    assertz(door_state(room_4b_door, locked)),
    assertz(door_state(stairwell_exit_gate, locked)),
    assertz(caretaker_door(locked)),
    assertz(altar_candle_count(0)),
    assertz(altar_bell_placed(false)),
    assertz(nat_persistent_state(summoned)),
    assertz(nat_summoned(false)),
    assertz(nat_dialogue_step(1)),
    assertz(inquiry_count(0)),
    assertz(chapter(1)),
    assertz(chapter_phase(1, 1)),
    assertz(composure(100)),
    assertz(time_remaining(600)), % 10:00 Countdown
    assertz(subscene_state(desk_mug_moved, false)),
    assertz(subscene_state(stall_horror_triggered, false)).

restart_chapter_one :-
    init_game_state.

% ==============================================================================
% 4. ACTIONS: MOVEMENT & INVENTORY
% ==============================================================================

has_item(Item) :-
    inventory(Inv),
    member(Item, Inv).

move_to(Destination) :-
    current_location(Current),
    can_traverse(Current, Destination),
    retract(current_location(Current)),
    assertz(current_location(Destination)).

pickup_item(Item) :-
    current_location(Loc),
    item(Item, Loc, _),
    \+ has_item(Item),
    inventory(Inv),
    retract(inventory(Inv)),
    assertz(inventory([Item | Inv])).

% ==============================================================================
% 5. ACTIONS: INSPECTIONS, CLUES, & COMPOSURE DAMAGE
% ==============================================================================

% Moving the tea mug on the desk reveals the hairpin
inspect_target(ceramic_mug, desk_mug_moved) :-
    current_location(room_4b_desk),
    subscene_state(desk_mug_moved, false),
    retract(subscene_state(desk_mug_moved, false)),
    assertz(subscene_state(desk_mug_moved, true)),
    assertz(clue_discovered(hairpin_revealed)).

% Inspecting the bloodstained third stall door
inspect_target(bloodstained_stall, stall_checked) :-
    current_location(washroom_stall),
    (   subscene_state(stall_horror_triggered, false)
    ->  retract(subscene_state(stall_horror_triggered, false)),
        assertz(subscene_state(stall_horror_triggered, true)),
        deduct_composure(5),
        assertz(clue_discovered(washroom_stall_echo))
    ;   true
    ).

% Inspecting the cracked mirror reveals the locker scribble
inspect_target(cracked_mirror, mirror_cleaned) :-
    current_location(washroom_mirror),
    assertz(clue_discovered(locker_14_1998)).

% Inspecting the ground floor stairwell gate
inspect_target(accordion_gate, gate_padlock_inspected) :-
    current_location(stairwell_gate),
    assertz(clue_discovered(gate_padlocked_from_outside)).

% Composure deduction logic
deduct_composure(Amount) :-
    (   composure(Current)
    ->  NewVal is max(0, Current - Amount),
        retract(composure(Current)),
        assertz(composure(NewVal))
    ;   NewVal is max(0, 100 - Amount),
        assertz(composure(NewVal))
    ).

% ==============================================================================
% 6. PUZZLE SOLVING: UNLOCKING ROOM 4B DOOR
% ==============================================================================

% Stealth pin-tumbler unlock method
unlock_exit_door :-
    current_location(room_4b_door),
    has_item(bobby_pin),
    door_state(room_4b_door, locked),
    retract(door_state(room_4b_door, locked)),
    assertz(door_state(room_4b_door, unlocked)),
    assertz(clue_discovered(picked_lock_silently)).

% Forced timber unlock method
unlock_exit_door :-
    current_location(room_4b_door),
    has_item(wooden_bat),
    door_state(room_4b_door, locked),
    retract(door_state(room_4b_door, locked)),
    assertz(door_state(room_4b_door, unlocked)),
    deduct_composure(10), % Penalty for loud blunt-force entry
    assertz(clue_discovered(forced_lock_with_timber)).

% ==============================================================================
% 7. PHASE 3: CARETAKER KEYPAD & NAT AWAKENING
% ==============================================================================

% Password verification rule
unlock_caretaker_office(InputCode) :-
    InputCode == '290418',
    retractall(caretaker_door(_)),
    assertz(caretaker_door(unlocked)).

% Altar lighting and item consumption rule
perform_nat_awakening :-
    has_item(black_beeswax_candle),
    has_item(matchbox_three_stars),
    has_item(bronze_prayer_bell),
    % Purge ritual items from inventory
    inventory(Inv),
    delete(Inv, black_beeswax_candle, Inv1),
    delete(Inv1, matchbox_three_stars, Inv2),
    delete(Inv2, bronze_prayer_bell, FinalInv),
    retract(inventory(Inv)),
    assertz(inventory(FinalInv)),
    assertz(nat_summoned),
    retractall(nat_summoned(_)),
    assertz(nat_summoned(true)),
    retractall(chapter(_)),
    assertz(chapter(2)),
    retractall(chapter_phase(_, _)),
    assertz(chapter_phase(2, 1)).

% ==============================================================================
% 8. CHAPTER 2: GUARDIAN NAT INTERROGATION & LAW OF REALITY
% ==============================================================================

% Initial knowledge base
nat_persistent_state(summoned).

% Clue discovery unlocks topics
unlock_topic_by_clue(clue_locker_14_found, locker_14_key).
unlock_topic_by_clue(clue_broken_locket_found, broken_locket).
unlock_topic_by_clue(clue_warden_notes_found, warden_ledger).
unlock_topic_by_clue(clue_well_rumor, banyan_well).

% Topic availability rules
topic_unlocked(may_identity).
topic_unlocked(TopicId) :-
    unlock_topic_by_clue(ClueId, TopicId),
    (clue_discovered(ClueId) ; learned_clue(ClueId)).

% Question evaluation rules
evaluate_nat_query(TopicId, Tier, ResponseText) :-
    nat_persistent_state(summoned),
    nat_topic_meta(TopicId, Tier, ResponseText),
    assertz(topic_exhausted(TopicId)),
    (   Tier == unknown
    ->  apply_fear_shock(2)
    ;   Tier == forbidden_taboo
    ->  apply_fear_shock(5)
    ;   true
    ),
    (   TopicId == locker_14_key
    ->  assertz(learned_clue(clue_key_incinerator_lie))
    ;   TopicId == broken_locket
    ->  assertz(learned_clue(clue_shame_of_the_neck))
    ;   TopicId == may_identity
    ->  assertz(learned_clue(clue_may_strangled_1998))
    ;   TopicId == banyan_well
    ->  assertz(taboo_triggered(taboo_banyan_well_invoked))
    ;   true
    ),
    check_deductions.

% Prolog Knowledge Meta
nat_topic_meta(may_identity, truth, 'Her name was May. A warden\'s favorite, choke-strangled in the quiet dark of monsoon week. Her grievance anchors this entire floor.').
nat_topic_meta(locker_14_key, deceit, 'The key was cast into the incinerator behind the mess hall. You will never hold it.').
nat_topic_meta(broken_locket, truth, 'The pendant of appeasement... He ripped it from her collar before the silence took her. Return it to her sight, and her fury will pause.').
nat_topic_meta(warden_ledger, unknown, '...The ink of mortal bureaucrats does not echo in the spirit veil. I know nothing of his papers.').
nat_topic_meta(banyan_well, forbidden_taboo, '...The dry mouth beneath the roots cannot be named! Utter it again and I shall leave you to her claws!').

% ==============================================================================
% GUARDIAN NAT CROSS-EXAMINATION & EPISTEMIC KNOWLEDGE BASE
% ==============================================================================

% nat_knows(TargetId, Tier, ResponseText)
nat_knows(compass, unknown, '...The spin of cold needles means nothing to the unseen. Take that toy away.').
nat_knows(magnetic_compass, unknown, '...The spin of cold needles means nothing to the unseen. Take that toy away.').
nat_knows(bobby_pin, unknown, '...').
nat_knows(brass_key, deceit, 'That tooth of brass belongs to the dead girl’s locker, yet its sister key was melted to ash behind the mess hall. You chase hollow metal.').
nat_knows(small_brass_key_32, deceit, 'That tooth of brass belongs to the dead girl’s locker, yet its sister key was melted to ash behind the mess hall. You chase hollow metal.').
nat_knows(clue_ko_zaw_letters, truth, 'Stolen words written in hurried ink... May looked where her eyes should have turned away. The bond between dorm sisters withered the night those letters were uncovered.').
nat_knows(sandar_kozaw_letters, truth, 'Stolen words written in hurried ink... May looked where her eyes should have turned away. The bond between dorm sisters withered the night those letters were uncovered.').
nat_knows(clue_physics_chem_notes_1998, truth, 'Formulas written by a trembling hand. She spent her final study hours plotting an escape beyond the curfew gate... before the corridor was barricaded.').
nat_knows(clue_banyan_well, forbidden_taboo, '...DO NOT SPEAK OF THE WELL! The roots drink deep from the dark. Name it again and I will extinguish these candles myself!').
nat_knows(clue_well_rumor, forbidden_taboo, '...DO NOT SPEAK OF THE WELL! The roots drink deep from the dark. Name it again and I will extinguish these candles myself!').

% Interrogate Nat (repeatable)
query_nat(TargetId, Tier, ResponseText) :-
    nat_knows(TargetId, Tier, ResponseText), !,
    apply_inquiry_strain,
    (   Tier == forbidden_taboo
    ->  apply_fear_shock(5)
    ;   Tier == unknown
    ->  apply_fear_shock(2)
    ;   assertz(learned_clue(TargetId))
    ),
    increment_inquiry_counter,
    check_deductions.

% Fallback when target is not in the Nat's knowledge base at all
query_nat(_UnknownTarget, unknown, '...') :-
    apply_inquiry_strain,
    apply_fear_shock(2),
    increment_inquiry_counter.

% Deduct 0.8% base composure per question (scaled by Tension)
apply_inquiry_strain :-
    (
        selected_investigator(CharId),
        investigator_stat(CharId, Tension, _)
    ->
        Strain is 0.8 * Tension
    ;
        Strain is 0.8
    ),
    (player_composure(Current) -> true ; (composure(C) -> Current = C ; Current = 100)),
    NewComp is max(0, Current - Strain),
    retractall(player_composure(_)),
    assertz(player_composure(NewComp)),
    retractall(composure(_)),
    assertz(composure(NewComp)).

increment_inquiry_counter :-
    (   inquiry_count(C)
    ->  Next is C + 1,
        retractall(inquiry_count(_)),
        assertz(inquiry_count(Next))
    ;   assertz(inquiry_count(1))
    ).

% Bridge for query_nat_about/3 compatibility
query_nat_about(TargetId, Tier, ResponseText) :-
    query_nat(TargetId, Tier, ResponseText).


% Legacy nat_statement/4 mapping for backward compatibility
nat_statement(may_identity, truth, clue_may_strangled_1998, 'Her name was May. A warden\'s favorite, choke-strangled in the quiet dark of monsoon week. Her grievance anchors this entire floor.').
nat_statement(locker_14_key, deceit, clue_key_incinerator_lie, 'The key was thrown into the incinerator behind the mess hall. You will never open it.').
nat_statement(caretaker_attack, truth, clue_may_mistaken_identity, 'She guards what was taken from her. The one who silenced her fled toward the courtyard. Until her neck is freed of shame, every living soul looks like her murderer.').
nat_statement(broken_locket, truth, clue_shame_of_the_neck, 'The pendant of appeasement... He ripped it from her collar before the silence took her. Return it to her sight, and her fury will pause.').
nat_statement(warden_ledger, unknown, clue_warden_notes_found, '...The ink of mortal bureaucrats does not echo in the spirit veil. I know nothing of his papers.').
nat_statement(banyan_well, forbidden_silence, taboo_banyan_well_invoked, '...The dry mouth beneath the banyan tree cannot be spoken of. To name the pit is to drown within it.').

% ask_nat(+TopicId, -Veracity, -ResponseText) - backward compatible bridge
ask_nat(TopicId, Veracity, ResponseText) :-
    nat_summoned,
    nat_statement(TopicId, Veracity, ClueAtom, ResponseText),
    assertz(nat_inquiry_made(TopicId)),
    assertz(topic_exhausted(TopicId)),
    (   (Veracity == forbidden_silence ; Veracity == forbidden_taboo)
    ->  assertz(taboo_triggered(ClueAtom)),
        apply_composure_damage(5, supernatural_shock)
    ;   Veracity == unknown
    ->  apply_composure_damage(2, supernatural_shock),
        assertz(learned_clue(ClueAtom))
    ;   assertz(learned_clue(ClueAtom))
    ),
    check_deductions.

% Audience Conclusion: locks chapter phase and routes player to East Fork
conclude_nat_audience :-
    nat_summoned,
    assertz(nat_consulted),
    retractall(current_location(_)),
    assertz(current_location(east_fork)),
    advance_chapter_phase(2, 2).

% Composure Damage Bridge
apply_composure_damage(Amount, _Reason) :-
    deduct_composure(Amount).

% Chapter Phase Progression Bridge
advance_chapter_phase(Chapter, Phase) :-
    retractall(chapter(_)),
    assertz(chapter(Chapter)),
    retractall(chapter_phase(_, _)),
    assertz(chapter_phase(Chapter, Phase)).

% Cross-Reference Deduction Engine
% Check for unlocked deductions
check_deductions :-
    detect_key_deceit,
    detect_pacification_method, !.
check_deductions :-
    ( detect_key_deceit -> true ; true ),
    ( detect_pacification_method -> true ; true ).

% Detecting the Nat's lie about Locker 14 key:
% Requires: player knows the incinerator claim AND found Sandar's note in Locker 32
detect_key_deceit :-
    learned_clue(clue_key_incinerator_lie),
    learned_clue(clue_sandar_notes_read),
    \+ deduction_unlocked(nat_lied_about_key),
    assertz(deduction_unlocked(nat_lied_about_key)).

% Deducing how to safely bypass May in Caretaker's office:
% Requires: knowing May mistakes people for her killer + finding the broken jade pendant context
detect_pacification_method :-
    learned_clue(clue_may_mistaken_identity),
    learned_clue(clue_shame_of_the_neck),
    \+ deduction_unlocked(pacify_may_requirement),
    assertz(deduction_unlocked(pacify_may_requirement)).

% ==============================================================================
% 6. CHAPTER 2 CARETAKER ROOM BLACKOUT & EXPANDED INVENTORY RULES
% ==============================================================================

% Climax trigger in Caretaker's Office
trigger_caretaker_climax :-
    assertz(caretaker_spectral_climax),
    assertz(caretaker_power_killed),
    retractall(current_location(_)),
    assertz(current_location(east_fork)).

% Room inspection in Caretaker's Office (supports dark_abandoned_office and state_abandoned_blackout)
inspect_location(caretaker_office, dark_abandoned_office) :-
    (caretaker_spectral_climax ; (chapter(CurrentChapter), CurrentChapter >= 2)),
    !,
    (caretaker_power_killed -> true ; assertz(caretaker_power_killed)).

inspect_location(caretaker_office, state_abandoned_blackout) :-
    (caretaker_spectral_climax ; (chapter(CurrentChapter), CurrentChapter >= 2)),
    !,
    (caretaker_power_killed -> true ; assertz(caretaker_power_killed)).

inspect_location(caretaker_office, active_investigation) :-
    \+ caretaker_spectral_climax.

inspect_location(caretaker_office, state_chapter_1_active) :-
    \+ caretaker_spectral_climax.

inspect_location(caretaker_office_main, Outcome) :-
    inspect_location(caretaker_office, Outcome).

% Verification of altar rite readiness (requires 3 candles, bronze bell, and matchbox)
can_perform_altar_rite :-
    (player_has(bronze_prayer_bell) ; has_item(bronze_prayer_bell)),
    (player_has(matchbox_three_stars) ; has_item(matchbox_three_stars)),
    (
        (findall(C, (player_has(black_beeswax_candle) ; has_item(black_beeswax_candle)), Candles), length(Candles, N), N >= 3)
    ;
        (altar_candle_count(Count), Count >= 3)
    ).

% Scene asset mapping for caretaker office post-climax
scene_background(caretaker_office, 'assets/scenes/caretaker_spectral_climax.jpg') :-
    caretaker_spectral_climax, !.

scene_background(caretaker_office, 'assets/scenes/caretaker_office_normal.jpg').

scene_background(caretaker_office_main, Asset) :-
    scene_background(caretaker_office, Asset).

% Permitted travel paths for Chapter 2
path(caretaker_office, east_fork) :-
    ( current_chapter(2) ; (chapter(C), C >= 2) ).
path(caretaker_office_main, east_fork) :-
    ( current_chapter(2) ; (chapter(C), C >= 2) ).

% Action to leave caretaker office
leave_caretaker_office :-
    current_location(caretaker_office),
    retractall(current_location(_)),
    assertz(current_location(east_fork)).
leave_caretaker_office :-
    current_location(caretaker_office_main),
    retractall(current_location(_)),
    assertz(current_location(east_fork)).

% Inventory quick-slot helper (first 3 items)
get_quickslot_inventory(QuickList) :-
    findall(Item, player_has(Item), FullList),
    prefix_up_to(3, FullList, QuickList).

player_has(Item) :-
    has_item(Item).

prefix_up_to(N, List, Prefix) :-
    length(Prefix, Len),
    Len =< N,
    append(Prefix, _, List),
    (Len =:= N ; length(List, Len)), !.

% ==============================================================================
% 7. SHORT DISPLAY METADATA & LABELED INVENTORY QUERIES
% ==============================================================================

% item_display_meta(ItemId, ShortLabel, IconType)
item_display_meta(bobby_pin, 'Pin 4B', pin).
item_display_meta(wooden_table_leg, 'Wood', club).
item_display_meta(wooden_bat, 'Wood', club).
item_display_meta(brass_key, 'Key 32', key).
item_display_meta(small_brass_key_32, 'Key 32', key).
item_display_meta(nylon_rope, 'Rope', rope).
item_display_meta(coiled_nylon_rope, 'Rope', rope).
item_display_meta(black_beeswax_candle, 'Candle', candle).
item_display_meta(matchbox_three_stars, 'Match', match).
item_display_meta(bronze_prayer_bell, 'Bell', bell).
item_display_meta(magnetic_compass, 'Compass', compass).

% Inventory query returning short labels directly
get_player_inventory_labels(LabeledItems) :-
    findall([Id, Label], (player_has(Id), item_display_meta(Id, Label, _)), LabeledItems).

% ==============================================================================
% 8. INVESTIGATOR TENSION/RESOLVE STATS & TIME BANK ROLLOVER SYSTEM
% ==============================================================================

% investigator_stat(CharId, TensionMultiplier, ResolveMultiplier)
investigator_stat(moe_stheinkha, 1.2, 0.9).
investigator_stat(ye_yint_hein, 1.3, 1.4).
investigator_stat(may_jewel, 0.8, 1.3).
investigator_stat(yin_min_htike, 0.8, 0.8).
investigator_stat(hsu_myat_shein, 1.4, 1.5).
investigator_stat(mona, 1.0, 1.0).

% Backward-compatibility aliases
investigator_stat(thazin, 1.2, 0.9).
investigator_stat(kyaw_swar, 1.3, 1.4).
investigator_stat(su_su, 0.8, 1.3).
investigator_stat(htet, 0.8, 0.8).
investigator_stat(aye_aye, 1.4, 1.5).
investigator_stat(min_khant, 1.0, 1.0).

% Initialize investigation for chosen character
init_investigation(CharId) :-
    retractall(selected_investigator(_)),
    assertz(selected_investigator(CharId)),
    retractall(current_chapter(_)),
    assertz(current_chapter(1)),
    retractall(chapter(_)),
    assertz(chapter(1)),
    retractall(player_time_remaining(_)),
    assertz(player_time_remaining(600)),
    retractall(time_remaining(_)),
    assertz(time_remaining(600)),
    retractall(player_composure(_)),
    assertz(player_composure(100)),
    retractall(composure(_)),
    assertz(composure(100)).

% Advance chapter with 10-minute rollover time bank and resolve composure recovery
advance_chapter_with_rollover(NextChapter) :-
    (player_time_remaining(RemainingTime) -> true ; (time_remaining(TR) -> RemainingTime = TR ; RemainingTime = 0)),
    BankedTime is max(0, RemainingTime),
    NewTime is 600 + BankedTime,
    retractall(player_time_remaining(_)),
    assertz(player_time_remaining(NewTime)),
    retractall(time_remaining(_)),
    assertz(time_remaining(NewTime)),
    % Apply chapter completion relief recovery (+20 scaled by resolve)
    (
        selected_investigator(CharId),
        investigator_stat(CharId, _, Resolve)
    ->
        RecoveryVal is round(20 * Resolve)
    ;
        RecoveryVal is 20
    ),
    (player_composure(CurrComp) -> true ; (composure(C) -> CurrComp = C ; CurrComp = 100)),
    NewComp is min(100, CurrComp + RecoveryVal),
    retractall(player_composure(_)),
    assertz(player_composure(NewComp)),
    retractall(composure(_)),
    assertz(composure(NewComp)),
    retractall(current_chapter(_)),
    assertz(current_chapter(NextChapter)),
    retractall(chapter(_)),
    assertz(chapter(NextChapter)).

% Apply fear shock scaled by investigator's tensionMultiplier
apply_fear_shock(BaseShock) :-
    (
        selected_investigator(CharId),
        investigator_stat(CharId, Tension, _)
    ->
        Damage is round(BaseShock * Tension)
    ;
        Damage is BaseShock
    ),
    (player_composure(CurrComp) -> true ; (composure(C) -> CurrComp = C ; CurrComp = 100)),
    NewComp is max(0, CurrComp - Damage),
    retractall(player_composure(_)),
    assertz(player_composure(NewComp)),
    retractall(composure(_)),
    assertz(composure(NewComp)).

% Apply relief recovery scaled by investigator's resolveMultiplier
apply_relief_recovery(BaseRecovery) :-
    (
        selected_investigator(CharId),
        investigator_stat(CharId, _, Resolve)
    ->
        Recovery is round(BaseRecovery * Resolve)
    ;
        Recovery is BaseRecovery
    ),
    (player_composure(CurrComp) -> true ; (composure(C) -> CurrComp = C ; CurrComp = 100)),
    NewComp is min(100, CurrComp + Recovery),
    retractall(player_composure(_)),
    assertz(player_composure(NewComp)),
    retractall(composure(_)),
    assertz(composure(NewComp)).

% ==============================================================================
% 9. CARETAKER MECHANICAL LATCH & NAT DIALOGUE STEP TRACKING
% ==============================================================================

% Validate 6-digit mechanical combination
attempt_caretaker_combination([2, 9, 0, 4, 1, 8]) :-
    \+ caretaker_latch_unlocked,
    assertz(caretaker_latch_unlocked),
    retractall(caretaker_door(_)),
    assertz(caretaker_door(unlocked)).

% Advance Nat dialogue step
advance_nat_dialogue :-
    (nat_dialogue_step(Current) -> true ; Current = 1),
    Next is Current + 1,
    retractall(nat_dialogue_step(_)),
    assertz(nat_dialogue_step(Next)).