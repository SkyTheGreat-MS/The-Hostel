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
    restart_chapter_one/0
]).

:- dynamic current_location/1.
:- dynamic inventory/1.
:- dynamic clue_discovered/1.
:- dynamic door_state/2.
:- dynamic composure/1.
:- dynamic time_remaining/1.
:- dynamic subscene_state/2.

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
    
    assertz(current_location(room_4b_main)),
    assertz(inventory([])),
    assertz(door_state(room_4b_door, locked)),
    assertz(door_state(stairwell_exit_gate, locked)),
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
    composure(Current),
    NewVal is max(0, Current - Amount),
    retract(composure(Current)),
    assertz(composure(NewVal)).

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