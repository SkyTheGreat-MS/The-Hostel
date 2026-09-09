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
    room_state/2,
    inspect_location/2,
    get_quickslot_inventory/1,
    player_has/1,
    prefix_up_to/3,
    item_display_meta/3,
    get_player_inventory_labels/1
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
:- dynamic nat_summoned/0.
:- dynamic nat_consulted/0.
:- dynamic nat_inquiry_made/1.
:- dynamic learned_clue/1.
:- dynamic taboo_triggered/1.
:- dynamic deduction_unlocked/1.

% Chapter 2 Caretaker Blackout & Inventory Dynamic State
:- dynamic caretaker_power_killed/0.
:- dynamic room_state/2.
:- dynamic player_has/1.

% Top-level defaults for interactive evaluation & bridge queries
:- assertz(nat_summoned).
:- assertz(composure(100)).
:- assertz(current_location(prayer_altar)).
:- assertz(chapter(2)).
:- assertz(chapter_phase(2, 1)).

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

can_traverse(east_fork, prayer_room_main).
can_traverse(prayer_room_main, east_fork).

can_traverse(prayer_room_main, prayer_altar).
can_traverse(prayer_altar, prayer_room_main).

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
    
    assertz(current_location(room_4b_main)),
    assertz(inventory([])),
    assertz(door_state(room_4b_door, locked)),
    assertz(door_state(stairwell_exit_gate, locked)),
    assertz(caretaker_door(locked)),
    assertz(altar_candle_count(0)),
    assertz(altar_bell_placed(false)),
    assertz(nat_summoned(false)),
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

% "Law of Reality" Knowledge Base
% nat_statement(TopicId, Veracity, ClueAtom, SpokenText)
nat_statement(
    may_identity,
    truth,
    clue_may_strangled_1998,
    'Her name was May. A warden\'s favorite, choke-strangled in the quiet dark of monsoon week. Her grievance anchors this entire floor.'
).

nat_statement(
    locker_14_key,
    deceit,
    clue_key_incinerator_lie,
    'The key was thrown into the incinerator behind the mess hall. You will never open it.'
).

nat_statement(
    caretaker_attack,
    truth,
    clue_may_mistaken_identity,
    'She guards what was taken from her. The one who silenced her fled toward the courtyard. Until her neck is freed of shame, every living soul looks like her murderer.'
).

nat_statement(
    banyan_well,
    forbidden_silence,
    taboo_banyan_well_invoked,
    '...The dry mouth beneath the banyan tree cannot be spoken of. To name the pit is to drown within it.'
).

% ask_nat(+TopicId, -Veracity, -ResponseText)
ask_nat(TopicId, Veracity, ResponseText) :-
    nat_summoned,
    nat_statement(TopicId, Veracity, ClueAtom, ResponseText),
    assertz(nat_inquiry_made(TopicId)),
    (   Veracity == forbidden_silence
    ->  assertz(taboo_triggered(ClueAtom)),
        apply_composure_damage(5, supernatural_shock)
    ;   assertz(learned_clue(ClueAtom))
    ),
    % Evaluate if this new information yields immediate deductions
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

% Room inspection in Chapter 2
inspect_location(caretaker_office, Outcome) :-
    chapter(CurrentChapter),
    CurrentChapter >= 2,
    Outcome = state_abandoned_blackout,
    assertz(caretaker_power_killed).

inspect_location(caretaker_office, Outcome) :-
    chapter(1),
    Outcome = state_chapter_1_active.

inspect_location(caretaker_office_main, Outcome) :-
    inspect_location(caretaker_office, Outcome).

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