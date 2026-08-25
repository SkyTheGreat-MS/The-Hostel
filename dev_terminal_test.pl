/** <module> dev_terminal_test.pl
 *
 * Developer & Test Harness: Interactive terminal CLI loop for THE SPIRIT'S LABYRINTH.
 * 
 * NOTE: This CLI harness is preserved strictly for developer testing and headless verification.
 * The primary player-facing experience is the routed web application (MainMenu -> /chapters -> /chapters/1).
 */

:- use_module(spirit_labyrinth).

:- initialization(main, main).

main :-
    format('~n[DEV TEST HARNESS] Launching Terminal CLI Mode...~n', []),
    play,
    halt.

%% play/0
%  Interactive CLI loop for local developer terminal testing.
play :-
    reset_game,
    print_banner,
    character_selection_loop,
    game_main_loop.

print_banner :-
    format('~n======================================================================~n', []),
    format('   H O S T E L   1 9 9 8  :  S P I R I T   L A B Y R I N T H   ( D E V )~n', []),
    format('======================================================================~n', []),
    format('Premise: In 2026, six university friends attempt a nat-calling ritual.~n', []),
    format('The offering glass shatters with a deafening crack. You black out.~n', []),
    format('When you open your eyes, the modern hostel is empty, decaying, and lit~n', []),
    format('by flickering oil lamps. The calendar on the wall reads: AUGUST 1998.~n', []),
    format('Trapped in 1998 with Mama May\'s ghost.~n', []),
    format('======================================================================~n~n', []).

character_selection_loop :-
    format('SELECT YOUR MAIN CHARACTER (MC):~n', []),
    format('  1. Thazin    (Skeptic)   - Resists physical fear; vulnerable to supernatural dread~n', []),
    format('  2. Min Khant (Protector) - Resists physical harm; vulnerable to betrayal~n', []),
    format('  3. Htet      (Archivist) - Master of ciphers and notes; physically fragile~n', []),
    format('  4. Aye Aye   (Kin-Bound) - Highly intuitive; carries hidden ties to 1998~n', []),
    format('  5. Kyaw Swar (Daredevil) - Impulsive risk-taker; fragile composure under isolation~n', []),
    format('  6. Su Su     (Intuitive) - Spiritually attuned; easily fatigued by ghost whispers~n~n', []),
    prompt_number('Choose character (1-6): ', 1, 6, Choice),
    map_choice_to_mc(Choice, MC),
    select_character(MC),
    mc(MC, Name, Archetype, Desc),
    format('~n[SELECTED]: ~w the ~w. ~w~n~n', [Name, Archetype, Desc]).

map_choice_to_mc(1, thazin).
map_choice_to_mc(2, min_khant).
map_choice_to_mc(3, htet).
map_choice_to_mc(4, aye_aye).
map_choice_to_mc(5, kyaw_swar).
map_choice_to_mc(6, su_su).

game_main_loop :-
    ( game_over(_) ->
        ending_sequence
    ; print_status_hud,
      print_action_menu,
      prompt_number('Select action: ', 1, 6, Action),
      execute_action(Action),
      ( game_over(_) -> ending_sequence ; game_main_loop )
    ).

print_status_hud :-
    time_remaining(T),
    player_composure(C),
    mama_may_grief(G),
    composure_state(State),
    selected_mc(MC),
    mc(MC, MCName, Archetype, _),
    format('----------------------------------------------------------------------~n', []),
    format('MC: ~w (~w) | Time Left: ~w turns | Composure: ~w% [~w] | Grief: ~w%~n',
           [MCName, Archetype, T, C, State, G]),
    format('----------------------------------------------------------------------~n', []).

print_action_menu :-
    format('ACTIONS:~n', []),
    format('  1. Explore a Hostel Room (Costs 1-2 turns)~n', []),
    format('  2. Commune with the Hostel Guardian Nat (Paired Truth Test - 1 turn)~n', []),
    format('  3. Listen to Mama May\'s Whispers (Symbolic Riddle Decode - 1 turn)~n', []),
    format('  4. Review Case Notes & Discovered Clues (0 turns)~n', []),
    format('  5. Perform the Nat Pacification Rite & Accuse the Killer~n', []),
    format('  6. Give Up / Surrender to the Spirits~n', []).

execute_action(1) :- exploration_menu.
execute_action(2) :- guardian_session.
execute_action(3) :- riddle_session.
execute_action(4) :- review_clues_menu.
execute_action(5) :- final_deduction_menu.
execute_action(6) :-
    format('~nYou collapse onto the cold teak floorboards, overcome by dread.~n', []),
    apply_composure_damage(100, supernatural_direct).

exploration_menu :-
    format('~nWHERE DO YOU WISH TO SEARCH?~n', []),
    format('  1. Dormitory Room 4B (Mama May & Sandar\'s room - 2 turns)~n', []),
    format('  2. Basement Laundry Basin (Washing area - 2 turns)~n', []),
    format('  3. Caretaker Old Office (Records & locked chests - 2 turns)~n', []),
    format('  4. Courtyard Nat Shrine & Dried Well (Courtyard - 2 turns)~n', []),
    format('  5. Common Hallway Bulletin Board (1 turn)~n', []),
    format('  6. Return to main menu (0 turns)~n', []),
    prompt_number('Choose location (1-6): ', 1, 6, LocChoice),
    ( LocChoice =:= 1 -> explore(dorm_room_4b)
    ; LocChoice =:= 2 -> explore(hostel_laundry)
    ; LocChoice =:= 3 -> explore(caretaker_office)
    ; LocChoice =:= 4 -> explore(courtyard_shrine)
    ; LocChoice =:= 5 -> explore(common_hall)
    ; true
    ).

guardian_session :-
    format('~n======================================================================~n', []),
    format('       COMMUNING WITH THE HOSTEL GUARDIAN NAT~n', []),
    format('======================================================================~n', []),
    format('The air chills. A majestic yet mocking spirit appears before you.~n', []),
    format('"I offer you two statements, mortal. EXACTLY ONE is true; ONE is a lie.~n', []),
    format(' Discern wisely against your physical evidence."~n~n', []),
    consume_turn(1),
    guardian_pair_prompt(1),
    guardian_pair_prompt(2),
    guardian_pair_prompt(3).

guardian_pair_prompt(PairId) :-
    hint_pair(PairId, StmtA, StmtB),
    format('--- GUARDIAN PAIR #~w ---~n', [PairId]),
    format('  [1] "~w"~n', [StmtA]),
    format('  [2] "~w"~n', [StmtB]),
    format('Which statement do you trust as truth? (1 or 2): ', []),
    prompt_number('', 1, 2, Choice),
    deduce_guardian_pair(PairId, Choice),
    true_index(PairId, TrueIdx),
    ( Choice =:= TrueIdx ->
        format('>> You sense a subtle warmth in the air. The truth resonates.~n~n', [])
    ; format('>> A sudden sharp chill stabs your spine! Mama May\'s spirit groans in distress.~n~n', [])
    ).

riddle_session :-
    format('~n======================================================================~n', []),
    format('             MAMA MAY\'S SPIRIT WHISPERS (SYMBOLIC RIDDLES)~n', []),
    format('======================================================================~n', []),
    format('Mama May materializes in a haze of incense smoke. She CANNOT lie,~n', []),
    format('but the trauma of her death forces her words into riddles.~n~n', []),
    consume_turn(1),
    riddle_topic_prompt(cause_of_death),
    riddle_topic_prompt(killer_identity),
    riddle_topic_prompt(body_location).

riddle_topic_prompt(Topic) :-
    victim_utterance(Topic, RiddleText, _),
    decode_options(Topic, Options),
    format('--- TOPIC: ~w ---~n', [Topic]),
    format('Mama May whispers: "~w"~n~n', [RiddleText]),
    format('How do you decode this against your physical clues?~n', []),
    print_options(Options, 1),
    length(Options, NumOpts),
    prompt_number('Choose interpretation: ', 1, NumOpts, OptIndex),
    nth1(OptIndex, Options, option(Meaning, _)),
    decode_riddle(Topic, Meaning),
    victim_utterance(Topic, _, TrueMeaning),
    ( Meaning == TrueMeaning ->
        format('>> The spirit softens. Her sorrow diminishes.~n~n', [])
    ; format('>> Her eyes turn pitch black. Misunderstanding her agonizes her soul!~n~n', [])
    ).

print_options([], _).
print_options([option(_, Label)|Rest], N) :-
    format('  ~w. ~w~n', [N, Label]),
    NextN is N + 1,
    print_options(Rest, NextN).

review_clues_menu :-
    format('~n======================================================================~n', []),
    format('                     INVESTIGATION CASE LOG (0 turns)~n', []),
    format('======================================================================~n', []),
    findall(ClueId, discovered_clue(ClueId), Clues),
    ( Clues == [] ->
        format('No physical clues discovered yet. Explore the hostel rooms!~n', [])
    ; list_discovered_clues(Clues)
    ),
    format('~n--- GUARDIAN CHOICES LOG ---~n', []),
    list_guardian_choices,
    format('~n--- RIDDLE DECODES LOG ---~n', []),
    list_riddle_choices,
    format('======================================================================~n~n', []).

list_discovered_clues([]).
list_discovered_clues([ClueId|Rest]) :-
    clue_data(ClueId, _, Title, Details),
    format('  * [~w] ~w~n', [Title, Details]),
    list_discovered_clues(Rest).

list_guardian_choices :-
    ( deduced_choice(_, _) ->
        forall(deduced_choice(PId, CIdx),
            ( hint_pair(PId, S1, S2),
              ( CIdx =:= 1 -> Stmt = S1 ; Stmt = S2 ),
              format('  Pair #~w: Trusted [~w] "~w"~n', [PId, CIdx, Stmt])
            ))
    ; format('  No Guardian pairs tested yet.~n', [])
    ).

list_riddle_choices :-
    ( decode_choice(_, _) ->
        forall(decode_choice(Topic, Meaning),
            format('  Topic ~w: Interpreted as "~w"~n', [Topic, Meaning]))
    ; format('  No riddles decoded yet.~n', [])
    ).

final_deduction_menu :-
    format('~n======================================================================~n', []),
    format('       FINAL ACCUSATION & NAT PACIFICATION RITE~n', []),
    format('======================================================================~n', []),
    format('Synthesize your findings. Choose the true killer, cause, and location:~n~n', []),
    format('1. WHO WAS THE KILLER?~n', []),
    format('  1. Sandar (Mama May\'s roommate)~n', []),
    format('  2. Ko Zaw (Mama May\'s boyfriend)~n', []),
    format('  3. Caretaker of 1998 Hostel~n', []),
    prompt_number('Select killer (1-3): ', 1, 3, KChoice),
    map_killer(KChoice, Killer),

    format('~n2. WHAT WAS THE TRUE CAUSE OF DEATH?~n', []),
    format('  1. Strangled by hands that braided her hair~n', []),
    format('  2. Poisoned by datura herbal tea~n', []),
    format('  3. Pushed from the 4th-floor balcony~n', []),
    prompt_number('Select cause (1-3): ', 1, 3, CChoice),
    map_cause(CChoice, Cause),

    format('~n3. WHERE DOES HER MORTAL BODY LIE CONCEALED?~n', []),
    format('  1. In the sealed dried well behind the shrine~n', []),
    format('  2. Beneath the roots of the ancient mango tree~n', []),
    format('  3. Behind the brickwork of Room 4B~n', []),
    prompt_number('Select body location (1-3): ', 1, 3, LChoice),
    map_location(LChoice, Location),

    format('~n4. DO YOU PERFORM THE PURIFYING NAT PACIFICATION RITE?~n', []),
    format('  1. Yes, light the sacred candles and pour the jasmine water~n', []),
    format('  2. No, attempt to flee the 1998 echo immediately~n', []),
    prompt_number('Perform rite? (1-2): ', 1, 2, RChoice),
    ( RChoice =:= 1 -> Rite = yes ; Rite = no ),

    accuse(Killer, Cause, Location),
    perform_rite(Rite),
    ending_sequence.

map_killer(1, sandar).
map_killer(2, ko_zaw).
map_killer(3, caretaker).

map_cause(1, strangled).
map_cause(2, poisoned).
map_cause(3, pushed).

map_location(1, dried_well).
map_location(2, mango_tree).
map_location(3, room_4b_brick).

ending_sequence :-
    resolve_ending(Ending),
    print_ending_report(Ending).

print_ending_report(Ending) :-
    format('~n======================================================================~n', []),
    format('                    E N D I N G   R E P O R T~n', []),
    format('======================================================================~n', []),
    print_ending_text(Ending),
    format('======================================================================~n~n', []).

print_ending_text(time_expired) :-
    format('ENDING: [TIME EXPIRED - TEMPORAL STRAND DISSOLUTION]~n', []),
    format('The countdown in 2026 reached zero. Your friends\' voices fade completely.~n', []),
    format('The 1998 hostel calcifies into eternal twilight. You are trapped forever~n', []),
    format('as another forgotten spirit wandering the corridors of room 4B.~n', []).

print_ending_text(composure_zero) :-
    format('ENDING: [COMPOSURE ZERO - PSYCHOLOGICAL SHATTERING]~n', []),
    format('Terror tears through your mind. As your composure breaks into madness,~n', []),
    format('you can no longer distinguish memory from illusion. The spirits drag your~n', []),
    format('fractured consciousness deep into the dry well.~n', []).

print_ending_text(grief_overflow) :-
    format('ENDING: [GRIEF OVERFLOW - VENGEFUL POLTERGEIST]~n', []),
    format('Mama May\'s grief hit 100%%. Mangled by false accusations and misunderstood~n', []),
    format('riddles, her spirit morphs into a raging Thaye (vengeful demon). The entire~n', []),
    format('hostel collapses in a vortex of flying teak and shattered glass.~n', []).

print_ending_text(true_rest) :-
    format('ENDING: [TRUE REST - THE SPIRIT LAID TO PEACE]~n', []),
    format('You named Sandar as the killer, identified the strangulation, and guided~n', []),
    format('the pacification rite to the old dried well. Mama May sheds a single tear~n', []),
    format('of pure light. Her spirit is freed from 28 years of cold darkness.~n', []),
    format('A bright pulse pulls you back to 2026. You wake up surrounded by your friends.~n', []).

print_ending_text(twist_ending) :-
    format('ENDING: [TWIST ENDING - THE BLOODLINE REVELATION]~n', []),
    format('You uncovered Sandar\'s guilt, recovered Mama May from the dried well, and~n', []),
    format('discovered the silver locket revealing that your 2026 friend Aye Aye is~n', []),
    format('Sandar\'s direct niece. When you awaken in 2026, you look into Aye Aye\'s~n', []),
    format('eyes—and she wears the exact same rose-patterned hairpin as the killer.~n', []).

print_ending_text(deceived) :-
    format('ENDING: [DECEIVED - THE GUARDIAN\'S TRAP]~n', []),
    format('You placed your faith in the Guardian Nat\'s false whispers or framed innocent~n', []),
    format('Ko Zaw. The rite is corrupted. The true murderer remains unpunished, and~n', []),
    format('Mama May\'s shadow remains bound to the hostel for eternity.~n', []).

print_ending_text(misunderstood) :-
    format('ENDING: [MISUNDERSTOOD - UNRESOLVED GRIEF]~n', []),
    format('Though you avoided the Guardian\'s trap, you misread Mama May\'s poetic words.~n', []),
    format('Her story is recorded with false details. The incomplete truth leaves her~n', []),
    format('wandering as a sorrowful remnant in the rain.~n', []).

print_ending_text(Other) :-
    format('ENDING: [UNKNOWN OUTCOME: ~w]~n', [Other]).

prompt_number(Prompt, Min, Max, Result) :-
    format('~w', [Prompt]),
    read_line_to_string(user_input, Str),
    ( number_string(Num, Str), integer(Num), Num >= Min, Num =< Max ->
        Result = Num
    ; format('Please enter a number between ~w and ~w.~n', [Min, Max]),
      prompt_number(Prompt, Min, Max, Result)
    ).
