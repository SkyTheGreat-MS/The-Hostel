import {
  MCCharacter,
  HostelLocation,
  Clue,
  GuardianPair,
  VictimRiddle,
  Item,
} from './types';

export const ROOM_4B_ASSETS = {
  main: '/assets/scenes/room_4b_main.jpg',
  seance2026: '/assets/scenes/seance_room_4b_2026.jpg',
  desk: '/assets/scenes/room_4b_desk_zoom.jpg',
  stool: '/assets/scenes/room_4b_stool_compass.jpg',
  wardrobe: '/assets/scenes/room_4b_wardrobe_bat.jpg',
  calendar: '/assets/scenes/room_4b_calendar_zoom.jpg',
  door: '/assets/scenes/room_4b_door_full.jpg',
  compassHud: '/assets/ui/magnetic_compass.jpg',
  compassZoom: '/assets/scenes/room_4b_compass_zoom.jpg',
} as const;

export const PHASE_3_ASSETS = {
  pathwayThreshold: '/assets/scenes/pathway_326_main.jpg',
  cardPathwayLeft: '/assets/ui/card_pathway_left.jpg',
  cardPathwayRight: '/assets/ui/card_pathway_right.jpg',
  westSplitLanding: '/assets/scenes/west_wing_landing.jpg',
  stairwellGateLocked: '/assets/scenes/stairwell_gate_locked.jpg',
  washroomOverview: '/assets/scenes/washroom_overview.jpg',
  washroomBasinZoom: '/assets/scenes/washroom_basin_zoom.jpg',
  washroomStallZoom: '/assets/scenes/washroom_stall_zoom.jpg',
  washroomRopeZoom: '/assets/scenes/washroom_rope_zoom.jpg',
  washroomMirrorZoom: '/assets/scenes/washroom_mirror_zoom.jpg',
  // East Wing Assets
  eastWingFork: '/assets/scenes/east_wing_fork.jpg',
  cardEastLockers: '/assets/ui/card_east_lockers.jpg',
  cardEastPrayer: '/assets/ui/card_east_prayer.jpg',
  cardEastCaretaker: '/assets/ui/card_east_caretaker.jpg',
  lockersOverview: '/assets/scenes/lockers_overview.jpg',
  locker32Zoom: '/assets/scenes/locker_32_zoom.jpg',
  locker09Zoom: '/assets/scenes/locker_09_zoom.jpg',
  locker14Zoom: '/assets/scenes/locker_14_zoom.jpg',
  lockerSpiderZoom: '/assets/scenes/locker_spider_zoom.jpg',
  prayerRoomOverview: '/assets/scenes/prayer_room_overview.jpg',
  prayerAltarZoom: '/assets/scenes/prayer_altar_zoom.jpg',
  caretakerKeypadZoom: '/assets/scenes/caretaker_keypad_zoom.jpg',
  caretakerOfficeOverview: '/assets/scenes/caretaker_office_overview.jpg',
  caretakerSpectralClimax: '/assets/scenes/caretaker_spectral_climax.jpg',
} as const;

export const ITEMS: Record<string, Item> = {
  bobby_pin: {
    id: 'bobby_pin',
    name: 'Bobby Pin',
    shortLabel: 'Pin 4B',
    description: 'A bent steel bobby pin found in a ceramic tray on the study desk.',
    usageHint: 'Can rake small cylinder pins in simple locks silently.',
  },
  wooden_bat: {
    id: 'wooden_bat',
    name: 'Heavy Teak Timber',
    shortLabel: 'Wood',
    type: 'tool',
    icon: '/assets/items/wooden_bat.png',
    description: 'A weathered piece of solid teak planking salvaged from the wardrobe base.',
    usageHint: 'Can break wooden latches or jammed mechanisms with blunt force, but creates heavy noise.',
  },
  magnetic_compass: {
    id: 'magnetic_compass',
    name: 'Magnetic Compass',
    shortLabel: 'Compass',
    description:
      'An antique brass directional compass with N, E, S, W markings. Its magnetic needle twitches toward paranormal anomalies.',
    isSpecial: true,
    usageHint: 'Twitches and points toward supernatural anomalies and dimensional rifts.',
  },
  small_brass_key_32: {
    id: 'small_brass_key_32',
    name: 'Small Brass Key (32)',
    shortLabel: 'Key 32',
    description: "A small tarnished brass key bearing a round metallic tag marked '32', recovered from a soaked uniform pocket.",
    usageHint: 'A numbered locker or cabinet key; unlikely to turn industrial padlocks.',
  },
  coiled_nylon_rope: {
    id: 'coiled_nylon_rope',
    name: 'Coiled Nylon Rope',
    shortLabel: 'Rope',
    description: 'A length of sturdy weathered nylon rope taken from the overhead drainage pipe.',
    usageHint: 'Tough enough to bear body weight or secure broken latches.',
  },
  black_beeswax_candle: {
    id: 'black_beeswax_candle',
    name: 'Black Beeswax Candle',
    shortLabel: 'Candle',
    description: 'Thick black beeswax candle used in traditional guardian rites.',
    usageHint: 'An essential offering element on the Guardian Nat prayer altar.',
  },
  matchbox_three_stars: {
    id: 'matchbox_three_stars',
    name: 'Matchbox (Three Stars)',
    shortLabel: 'Match',
    description: "A vintage Burmese 'Three-Shooting-Stars' safety matchbox containing 3 matches.",
    usageHint: 'Used to strike a flame on ritual candles. High dread causes trembling hands.',
  },
  bronze_prayer_bell: {
    id: 'bronze_prayer_bell',
    name: 'Bronze Prayer Bell',
    shortLabel: 'Bell',
    description: 'A ceremonial hand bell cast with traditional spirit runes.',
    usageHint: 'Rung to summon and awaken the Guardian Nat at the altar.',
  },
};

export const ITEM_DATABASE = ITEMS;

export const CHARACTERS: MCCharacter[] = [
  {
    id: 'moe_stheinkha',
    name: 'Moe Stheinkha',
    archetype: 'Skeptic',
    description: 'Analytical and rational mind; resists physical intimidation, but highly vulnerable to occult anomalies.',
    multipliers: {
      supernatural_direct: 1.5,
      physical_threat: 0.8,
      betrayal: 1.0,
    },
  },
  {
    id: 'ye_yint_hein',
    name: 'Ye Yint Hein',
    archetype: 'Daredevil',
    description: 'Audacious and quick to act; shrugs off physical threats but easily unhinged in eerie isolation.',
    multipliers: {
      supernatural_direct: 1.2,
      physical_threat: 0.7,
      betrayal: 1.1,
    },
  },
  {
    id: 'may_jewel',
    name: 'May Jewel',
    archetype: 'Intuitive',
    description: 'Spiritually attuned medium who detects hidden vibrations and whispers; suffers severe mental strain.',
    multipliers: {
      supernatural_direct: 0.7,
      physical_threat: 1.4,
      betrayal: 1.2,
    },
  },
  {
    id: 'yin_min_htike',
    name: 'Yin Min Htike',
    archetype: 'Archivist',
    description: 'Expert on historical ledgers, ciphers, and discrepancies; physically frail when under violent pressure.',
    multipliers: {
      supernatural_direct: 0.9,
      physical_threat: 1.4,
      betrayal: 0.8,
    },
  },
  {
    id: 'hsu_myat_shein',
    name: 'Hsu Myat Shein',
    archetype: 'Kin-Bound',
    description: 'Deeply empathetic; unknowingly linked by bloodline to the tragic events of August 1998.',
    multipliers: {
      supernatural_direct: 1.4,
      physical_threat: 1.2,
      betrayal: 1.5,
    },
  },
  {
    id: 'mona',
    name: 'Mona',
    archetype: 'Protector',
    description: 'Steadfast shield of the circle; resists brute force, but psychologically crushed by betrayal.',
    multipliers: {
      supernatural_direct: 1.0,
      physical_threat: 0.6,
      betrayal: 1.5,
    },
  },
  // Legacy aliases for backward compatibility with existing tests and Prolog mirrors
  {
    id: 'thazin',
    name: 'Thazin (Moe Stheinkha)',
    archetype: 'Skeptic',
    description: 'Calculates probability; struggles when confronted by direct supernatural phenomena.',
    multipliers: {
      supernatural_direct: 1.5,
      physical_threat: 0.8,
      betrayal: 1.0,
    },
  },
  {
    id: 'min_khant',
    name: 'Min Khant (Mona)',
    archetype: 'Protector',
    description: 'Steadfast against physical danger; deeply hurt by betrayal and broken oaths.',
    multipliers: {
      supernatural_direct: 1.0,
      physical_threat: 0.6,
      betrayal: 1.5,
    },
  },
  {
    id: 'htet',
    name: 'Htet (Yin Min Htike)',
    archetype: 'Archivist',
    description: 'Keen eye for documents, ledgers, and ciphers; physically frail under strain.',
    multipliers: {
      supernatural_direct: 0.9,
      physical_threat: 1.4,
      betrayal: 0.8,
    },
  },
  {
    id: 'aye_aye',
    name: 'Aye Aye (Hsu Myat Shein)',
    archetype: 'Kin-Bound',
    description: 'Deeply attuned to emotional resonance; secretly carries maternal ties to 1998.',
    multipliers: {
      supernatural_direct: 1.4,
      physical_threat: 1.2,
      betrayal: 1.5,
    },
  },
  {
    id: 'kyaw_swar',
    name: 'Kyaw Swar (Ye Yint Hein)',
    archetype: 'Daredevil',
    description: 'Bold and impulsive; quick to take action but easily unhinged by quiet isolation.',
    multipliers: {
      supernatural_direct: 1.2,
      physical_threat: 0.7,
      betrayal: 1.1,
    },
  },
  {
    id: 'su_su',
    name: 'Su Su (May Jewel)',
    archetype: 'Intuitive',
    description: 'Spiritually receptive medium; hears whispers clearly but suffers heavy mental fatigue.',
    multipliers: {
      supernatural_direct: 0.7,
      physical_threat: 1.4,
      betrayal: 1.2,
    },
  },
];

export const LOCATIONS: HostelLocation[] = [
  {
    id: 'dorm_room_4b',
    name: 'Dormitory Room 4B',
    description: "Mama May and Sandar's shared student quarters in August 1998.",
    turnCost: 2,
  },
  {
    id: 'hostel_laundry',
    name: 'Basement Laundry Basin',
    description: 'Smells of stale soap, lye powder, and stagnant wash basin water.',
    turnCost: 2,
  },
  {
    id: 'caretaker_office',
    name: 'Caretaker Old Office',
    description: 'Dusty shelves, rusted keyrings, and locked iron-banded wooden chests.',
    turnCost: 2,
  },
  {
    id: 'courtyard_shrine',
    name: 'Courtyard Nat Shrine & Dried Well',
    description: 'A weather-beaten wooden shrine facing an overgrown, dry stone well.',
    turnCost: 2,
  },
  {
    id: 'common_hall',
    name: 'Hostel Common Hallway',
    description: 'Notice boards from 1998 with student logs, curfew notices, and torn posters.',
    turnCost: 1,
  },
];

export const CLUES: Clue[] = [
  {
    id: 'diary_page',
    locationId: 'dorm_room_4b',
    title: 'Torn Diary Page (Aug 1998)',
    details:
      'A handwritten entry by Mama May: "Ko Zaw yelled at the tea shop today when I wore magenta. He passionately detests the color pink—he says it makes him physically ill."',
    pointsTo: 'ko_zaw_hates_pink',
  },
  {
    id: 'pink_shirt',
    locationId: 'hostel_laundry',
    title: 'Stained Pink Silk Longyi & Blouse',
    details:
      'Found buried beneath lye powder in laundry vat #3. Faint blood traces linger on the cuffs. The size tag matches a woman of Sandar\'s build.',
    pointsTo: 'killer_is_not_ko_zaw',
  },
  {
    id: 'caesar_chest',
    locationId: 'caretaker_office',
    title: 'Iron-Banded Box with Caesar Cipher',
    details:
      'A locked lockbox inscribed with shifted script: "VHFUHW: 5000 NBDWV SDLG WR VHDO WKH GULHG ZHOO DQG EXUB WKH ERGB (Shift 3)". Decoded receipt: 5,000 kyats paid by Room 4B tenant (Sandar) to caretaker to seal dried well.',
    pointsTo: 'sandar_bribed_caretaker',
    isCipher: true,
  },
  {
    id: 'broken_rosary',
    locationId: 'courtyard_shrine',
    title: 'Shattered Bodhi Prayer Beads',
    details:
      'Scattered wooden beads coated in dried red wax. A devotional item left by frightened students in 1998. (Pure red herring with no investigative payoff).',
    pointsTo: 'red_herring_no_payoff',
  },
  {
    id: 'room_4b_log',
    locationId: 'common_hall',
    title: '1998 Residence Roster Log',
    details:
      'Official hostel ledger recording that Mama May and Sandar were roommates and close companions. Notations describe Sandar frequently braiding Mama May\'s hair before night assemblies.',
    pointsTo: 'roommate_braided_hair',
  },
  {
    id: 'antique_locket',
    locationId: 'dorm_room_4b',
    title: 'Silver Filigree Locket',
    details:
      'Concealed behind loose teak baseboard in Room 4B. Contains a photograph of Sandar holding an infant: "For Aunt Sandar, from Aye Aye\'s mother, July 1998." (Secret connection to 2026 friend Aye Aye).',
    pointsTo: 'aye_aye_is_sandars_niece',
  },
  {
    id: 'glitch_body_glimpse',
    locationId: 'common_hall',
    title: 'Glitching Spectral Silhouette',
    details:
      "A fleeting manifestation of Mama May's restless spirit glitching between 1998 and 2026 before dissolving into mist near the corridor.",
    pointsTo: 'shadow_event_manifestation',
  },
  {
    id: 'roster_slip_1998',
    locationId: 'dorm_room_4b',
    title: 'Cleaning Duty Log (Aug 1998)',
    details:
      'Cleaning Duty Log (Aug 1998) assigning Room 4B to students May and Sandar.',
    pointsTo: 'room_4b_duty_log',
  },
  {
    id: 'curfew_calendar_1998',
    locationId: 'dorm_room_4b',
    title: 'August 1998 Wall Calendar',
    details:
      'August 1998 wall calendar with August 14th circled with curfew lockdown notes.',
    pointsTo: 'curfew_lockdown_aug14',
  },
  {
    id: 'washroom_stall_echo',
    locationId: 'hostel_laundry',
    title: 'Washroom Stall Blood & Echo',
    details:
      'The third washroom stall exhibits fresh blood smears and a shattered pocket mirror beside a crimson student hair ribbon.',
    pointsTo: 'washroom_third_stall',
  },
  {
    id: 'mirror_locker_scrawl',
    locationId: 'hostel_laundry',
    title: 'Mirror Frame Etched Scrawl',
    details:
      "Chalk-scratched notation etched into the base of the washroom mirror frame: 'Locker 14 - 1998'.",
    pointsTo: 'locker_14_1998',
  },
  {
    id: 'cipher_note_32',
    locationId: 'hostel_laundry',
    title: 'Warden Office Overwrite Note',
    details:
      "'Warden Office Electronic Push-Latch Overwrite: 8 1 4 0 9 2. Note: Caretaker mirrors all sequence inputs for emergency security.'",
    pointsTo: 'caretaker_door_reverse_code',
    isCipher: true,
  },
  {
    id: 'sandar_kozaw_letters',
    locationId: 'lockers_main',
    title: 'Folded Love Letters (K.Z.)',
    details:
      "Folded letters addressed to Sandar, signed 'K.Z.'... 'Sandar, she is getting suspicious about the tea shop visits. If May finds out about us, neither of us can stay in this hostel.' Reveals the hidden betrayal behind Mama May.",
    pointsTo: 'sandar_kozaw_betrayal',
  },
];

export const GUARDIAN_PAIRS: GuardianPair[] = [
  {
    id: 1,
    statementA: 'Ko Zaw killed her in a fit of jealous fury.',
    statementB: 'The pink shirt found in the laundry belongs to the killer.',
    trueIndex: 2, // B is true; combined with diary, disproves Ko Zaw
  },
  {
    id: 2,
    statementA: 'Her body was dropped down into the old dried courtyard well.',
    statementB: 'Her body rests beneath the roots of the ancient mango tree.',
    trueIndex: 1, // A is true
  },
  {
    id: 3,
    statementA: 'She met her end by a silver hairpin driven into her temple.',
    statementB: 'Hands that once touched her with sisterly warmth choked her breath away.',
    trueIndex: 2, // B is true (strangled)
  },
];

export const VICTIM_RIDDLES: VictimRiddle[] = [
  {
    topic: 'cause_of_death',
    title: 'Cause of Death',
    symbolicText: 'Hands that once gently braided my long hair closed around my throat instead.',
    trueMeaning: 'strangled',
    options: [
      {
        id: 'opt_strangled',
        meaningKey: 'strangled',
        label: 'She was manually strangled by someone who used to braid her hair.',
      },
      {
        id: 'opt_poisoned',
        meaningKey: 'poisoned',
        label: 'She was poisoned by a cup of jasmine tea laced with datura.',
      },
      {
        id: 'opt_drowned',
        meaningKey: 'drowned',
        label: 'She was held underwater in the monsoon rainwater reservoir.',
      },
    ],
  },
  {
    topic: 'killer_identity',
    title: 'Killer Identity',
    symbolicText:
      'The one who shared my mirror and whispered promises wore my favorite rose-silk shawl while scrubbing crimson from her sleeves.',
    trueMeaning: 'sandar',
    options: [
      {
        id: 'opt_sandar',
        meaningKey: 'sandar',
        label: 'Her roommate Sandar, who wore her rose shawl and shared her room.',
      },
      {
        id: 'opt_ko_zaw',
        meaningKey: 'ko_zaw',
        label: 'Her boyfriend Ko Zaw, trying to hide a violent confrontation.',
      },
      {
        id: 'opt_caretaker',
        meaningKey: 'caretaker',
        label: 'The old hostel caretaker, acting on orders from university elders.',
      },
    ],
  },
  {
    topic: 'body_location',
    title: 'Body Concealment Location',
    symbolicText:
      'Where the stone mouth swallowed monsoon rains and now lies dry in the shadow of the shrine, I sleep in cold stone.',
    trueMeaning: 'dried_well',
    options: [
      {
        id: 'opt_dried_well',
        meaningKey: 'dried_well',
        label: 'The old dried well in the overgrown courtyard behind the shrine.',
      },
      {
        id: 'opt_mango_tree',
        meaningKey: 'mango_tree',
        label: 'Deep underground beneath the roots of the ancient courtyard mango tree.',
      },
      {
        id: 'opt_dorm_floor',
        meaningKey: 'dorm_floor',
        label: 'Concealed within the double ceiling cavity above Room 4B.',
      },
    ],
  },
];

export const ENDINGS_INFO: Record<
  string,
  { title: string; subtitle: string; description: string; type: 'victory' | 'defeat' | 'twist' }
> = {
  true_rest: {
    title: 'True Rest: The Spirit Laid to Peace',
    subtitle: 'Canonical Victory & Escape to 2026',
    description:
      'You correctly identified Sandar as the killer, specified manual strangulation, guided the pacification rite to the dried well, and maintained Mama May\'s trust. She sheds a tear of warm light and dissolves into peace. A temporal surge pulls you back to 2026 into the arms of your waking friends.',
    type: 'victory',
  },
  twist_ending: {
    title: 'Twist Ending: The Bloodline Revelation',
    subtitle: 'Kinship Unmasked Across Time',
    description:
      'You proved Sandar\'s guilt and recovered the antique locket from Room 4B, proving that your 2026 friend Aye Aye is Sandar\'s direct niece. When you open your eyes in 2026, Aye Aye is kneeling beside you—wearing the exact antique rose hairpin described in the 1998 murder notes.',
    type: 'twist',
  },
  deceived: {
    title: 'Deceived: The Guardian\'s Trap',
    subtitle: 'Corrupted Judgment & False Accusation',
    description:
      'You trusted the Guardian Nat\'s false whispers or falsely condemned innocent Ko Zaw. The rite is corrupted with false testimonies. Sandar\'s true crime remains concealed, and Mama May\'s ghost remains bound to the hostel halls for another generation.',
    type: 'defeat',
  },
  misunderstood: {
    title: 'Misunderstood: Unresolved Grief',
    subtitle: 'Incomplete Truth & Lingering Sorrow',
    description:
      'Though you escaped the Guardian\'s trap, you misinterpreted Mama May\'s symbolic riddles. Her true suffering was never comprehended. Her sorrowful spirit remains as an inconsolable ghost weeping under the monsoon eaves.',
    type: 'defeat',
  },
  time_expired: {
    title: 'Time Expired: Temporal Strand Dissolution',
    subtitle: 'Countdown Reached Zero',
    description:
      'The 2026 ritual anchor severed. Your friends\' calling voices faded away into dead silence. The 1998 hostel echoes into permanent stagnation, trapping you forever as a shadow of Room 4B.',
    type: 'defeat',
  },
  composure_zero: {
    title: 'Composure Zero: Psychological Shattering',
    subtitle: 'Mind Broken by Dread',
    description:
      'Terror shattered your composure to 0%. Hallucinations and sensory overload consumed your reason. You were found catatonic on the cold floorboards as the spirits dragged your mind into the well.',
    type: 'defeat',
  },
  grief_overflow: {
    title: 'Grief Overflow: Vengeful Poltergeist',
    subtitle: 'Mama May Transformed into a Thaye',
    description:
      'Mama May\'s grief reached 100%. Agonized by distortion and misrepresentation, her sorrow turned into unbridled fury. The hostel collapsed in an eruption of violent psychokinetic forces.',
    type: 'defeat',
  },
};
