/**
 * PrologBridge.ts
 *
 * Authoritative TypeScript bridge to the Prolog knowledge base (spirit_labyrinth.pl / game_kb).
 * Bridges UI interactions with authoritative Prolog predicates, state management,
 * and rule verification.
 */

import { queryProlog, assertPrologFact, retractAllProlog, PrologQueryResult } from '../logic/prologEngine';

export interface PrologBridgeState {
  currentLocation: string;
  inventory: string[];
  garageDrained: boolean;
  locker14Unlocked: boolean;
  locker14Looted: boolean;
  stairwayGateUnlocked: boolean;
  escapedInterior: boolean;
  wellRootsSevered: boolean;
  wellPulleyRigged: boolean;
  wellRopeRigged: boolean;
  cassetteInserted: boolean;
  cassettePlayed: boolean;
  conduitUnlocked: boolean;
}

/**
 * Splits compound Prolog expressions like:
 * "retractall(current_chapter(_)), assertz(current_chapter(3)), assertz(stairway_gate_unlocked)."
 * into individual executable clauses, respecting parentheses nesting.
 */
function splitPrologClauses(query: string): string[] {
  const clauses: string[] = [];
  let current = '';
  let depth = 0;
  for (let i = 0; i < query.length; i++) {
    const char = query[i];
    if (char === '(') depth++;
    else if (char === ')') depth--;

    if ((char === ',' || char === '.') && depth === 0) {
      const trimmed = current.trim();
      if (trimmed) clauses.push(trimmed);
      current = '';
    } else {
      current += char;
    }
  }
  const remaining = current.trim().replace(/\.$/, '');
  if (remaining) clauses.push(remaining);
  return clauses;
}

class PrologBridgeService {
  private inMemoryFacts: Set<string> = new Set([
    'chapter(1)',
    'chapter_phase(1, 1)',
    'current_chapter(1)',
    'current_location(room_4b_main)',
    'door_state(room_4b_door, locked)',
    'door_state(stairwell_exit_gate, locked)',
    'caretaker_door(locked)',
    'composure(100)',
    'time_remaining(600)',
    'player_composure(100)',
    'player_time_remaining(600)',
  ]);

  private state: PrologBridgeState = {
    currentLocation: 'room_4b_main',
    inventory: [],
    garageDrained: false,
    locker14Unlocked: false,
    locker14Looted: false,
    stairwayGateUnlocked: false,
    escapedInterior: false,
    wellRootsSevered: false,
    wellPulleyRigged: false,
    wellRopeRigged: false,
    cassetteInserted: false,
    cassettePlayed: false,
    conduitUnlocked: false,
  };

  constructor() {
    this.hydrateFromStorage();
  }

  public initGameState(): void {
    this.inMemoryFacts.clear();
    this.inMemoryFacts.add('chapter(1)');
    this.inMemoryFacts.add('chapter_phase(1, 1)');
    this.inMemoryFacts.add('current_chapter(1)');
    this.inMemoryFacts.add('current_location(room_4b_main)');
    this.inMemoryFacts.add('door_state(room_4b_door, locked)');
    this.inMemoryFacts.add('door_state(stairwell_exit_gate, locked)');
    this.inMemoryFacts.add('caretaker_door(locked)');
    this.inMemoryFacts.add('composure(100)');
    this.inMemoryFacts.add('time_remaining(600)');
    this.inMemoryFacts.add('player_composure(100)');
    this.inMemoryFacts.add('player_time_remaining(600)');

    this.state = {
      currentLocation: 'room_4b_main',
      inventory: [],
      garageDrained: false,
      locker14Unlocked: false,
      locker14Looted: false,
      stairwayGateUnlocked: false,
      escapedInterior: false,
      wellRootsSevered: false,
      wellPulleyRigged: false,
      wellRopeRigged: false,
      cassetteInserted: false,
      cassettePlayed: false,
      conduitUnlocked: false,
    };
  }

  public reset(): void {
    this.initGameState();
  }

  public getState(): PrologBridgeState {
    return { ...this.state, inventory: [...this.state.inventory] };
  }

  private hydrateFromStorage(): void {
    try {
      if (typeof localStorage === 'undefined') return;
      const saved = localStorage.getItem('spirits_labyrinth_progress_v1');
      const active = localStorage.getItem('spirits_labyrinth_active_save');
      const parsed = saved ? JSON.parse(saved) : {};
      const activeParsed = active ? JSON.parse(active) : {};
      const combined = { ...parsed, ...activeParsed };

      if (combined.garageDrained) {
        this.state.garageDrained = true;
        this.inMemoryFacts.add('garage_drained');
      }
      if (combined.stairwayGateUnlocked) {
        this.state.stairwayGateUnlocked = true;
        this.state.escapedInterior = true;
        this.inMemoryFacts.add('stairway_gate_unlocked');
        this.inMemoryFacts.add('escaped_interior');
      }
      if (combined.locker14Unlocked) {
        this.state.locker14Unlocked = true;
        this.inMemoryFacts.add('locker_unlocked(14)');
      }
      if (combined.locker14Looted) {
        this.state.locker14Looted = true;
        this.inMemoryFacts.add('locker_14_looted');
      }
      if (combined.wellRootsSevered) {
        this.state.wellRootsSevered = true;
        this.inMemoryFacts.add('well_roots_severed');
      }
      if (combined.wellPulleyRigged) {
        this.state.wellPulleyRigged = true;
        this.inMemoryFacts.add('well_pulley_rigged');
      }
      if (combined.wellRopeRigged) {
        this.state.wellRopeRigged = true;
        this.inMemoryFacts.add('well_rope_rigged');
      }
      if (combined.cassetteInserted) {
        this.state.cassetteInserted = true;
        this.inMemoryFacts.add('cassette_inserted');
      }
      if (combined.cassettePlayed) {
        this.state.cassettePlayed = true;
        this.inMemoryFacts.add('cassette_played');
      }
      if (combined.conduitUnlocked) {
        this.state.conduitUnlocked = true;
        this.inMemoryFacts.add('conduit_unlocked');
      }
      if (Array.isArray(combined.inventory)) {
        this.state.inventory = combined.inventory;
        combined.inventory.forEach((item: string) => {
          this.inMemoryFacts.add(`player_has(${item})`);
        });
      }
      if (combined.phase3Location) {
        this.state.currentLocation = combined.phase3Location;
        this.inMemoryFacts.add(`current_location(${combined.phase3Location})`);
      }
      const ch = combined.currentChapter || combined.chapter;
      if (ch) {
        this.inMemoryFacts.add(`current_chapter(${ch})`);
        this.inMemoryFacts.add(`chapter(${ch})`);
      }
    } catch {}
  }

  /**
   * Evaluates a single Prolog clause or action against knowledge base rules and state.
   */
  async queryOnce(query: string): Promise<boolean> {
    const trimmed = query.trim().replace(/\.$/, '');
    if (!trimmed) return true;

    // Reset / Initialization routines
    if (trimmed === 'init_game_state' || trimmed === 'restart_chapter_one') {
      this.initGameState();
      return true;
    }

    // Dynamic Retract Handlers
    const retractMatch = trimmed.match(/^retractall\((.+)\)$/);
    if (retractMatch) {
      const pred = retractMatch[1].trim();
      if (pred.startsWith('current_chapter(') || pred === 'current_chapter(_)') {
        for (const fact of Array.from(this.inMemoryFacts)) {
          if (fact.startsWith('current_chapter(') || fact.startsWith('chapter(')) {
            this.inMemoryFacts.delete(fact);
          }
        }
      } else if (pred === 'stairway_gate_unlocked') {
        this.state.stairwayGateUnlocked = false;
        this.inMemoryFacts.delete('stairway_gate_unlocked');
      } else if (pred === 'escaped_interior') {
        this.state.escapedInterior = false;
        this.inMemoryFacts.delete('escaped_interior');
      } else if (pred === 'chapter2_completed' || pred === 'chapter1_completed') {
        this.inMemoryFacts.delete(pred);
      } else if (pred.startsWith('player_has(')) {
        const itemMatch = pred.match(/^player_has\((\w+)\)$/);
        if (itemMatch) {
          const item = itemMatch[1];
          this.inMemoryFacts.delete(`player_has(${item})`);
          this.state.inventory = this.state.inventory.filter((i) => i !== item);
        } else if (pred === 'player_has(_)') {
          for (const fact of Array.from(this.inMemoryFacts)) {
            if (fact.startsWith('player_has(')) this.inMemoryFacts.delete(fact);
          }
          this.state.inventory = [];
        }
      } else if (pred.startsWith('locker_unlocked')) {
        this.state.locker14Unlocked = false;
        for (const fact of Array.from(this.inMemoryFacts)) {
          if (fact.startsWith('locker_unlocked(')) this.inMemoryFacts.delete(fact);
        }
      } else if (pred === 'garage_drained') {
        this.state.garageDrained = false;
        this.inMemoryFacts.delete('garage_drained');
      } else if (pred === 'conduit_unlocked') {
        this.state.conduitUnlocked = false;
        this.inMemoryFacts.delete('conduit_unlocked');
      } else {
        this.inMemoryFacts.delete(pred);
      }
      try {
        await retractAllProlog(pred);
      } catch {}
      return true;
    }

    // Dynamic Assert Handlers
    const assertMatch = trimmed.match(/^(?:assertz|assert)\((.+)\)$/);
    if (assertMatch) {
      const pred = assertMatch[1].trim();
      this.inMemoryFacts.add(pred);

      const chMatch = pred.match(/^current_chapter\((\d+)\)$/);
      if (chMatch) {
        this.inMemoryFacts.add(`chapter(${chMatch[1]})`);
      }
      if (pred === 'stairway_gate_unlocked') {
        this.state.stairwayGateUnlocked = true;
        this.state.escapedInterior = true;
        this.inMemoryFacts.add('escaped_interior');
      }
      if (pred === 'escaped_interior') {
        this.state.escapedInterior = true;
      }
      if (pred === 'locker_unlocked(14)') {
        this.state.locker14Unlocked = true;
      }
      if (pred === 'garage_drained') {
        this.state.garageDrained = true;
      }
      if (pred === 'conduit_unlocked') {
        this.state.conduitUnlocked = true;
      }
      const itemMatch = pred.match(/^player_has\((\w+)\)$/);
      if (itemMatch) {
        const item = itemMatch[1];
        if (!this.state.inventory.includes(item)) {
          this.state.inventory.push(item);
        }
      }
      try {
        await assertPrologFact(pred);
      } catch {}
      return true;
    }

    // 1. garage_drained
    if (trimmed === 'garage_drained') {
      return this.state.garageDrained || this.inMemoryFacts.has('garage_drained');
    }

    // 2. drain_garage
    if (trimmed === 'drain_garage') {
      this.state.garageDrained = true;
      this.inMemoryFacts.add('garage_drained');
      try {
        await assertPrologFact('garage_drained');
      } catch {}
      return true;
    }

    // 3. can_take_garage_item(Item)
    const canTakeMatch = trimmed.match(/^can_take_garage_item\((\w+)\)$/);
    if (canTakeMatch) {
      const item = canTakeMatch[1];
      const validItems = ['iron_pulley', 'rusty_machete'];
      if (!validItems.includes(item)) return false;
      if (!this.state.garageDrained && !this.inMemoryFacts.has('garage_drained')) return false;
      if (this.state.inventory.includes(item) || this.inMemoryFacts.has(`player_has(${item})`)) return false;
      return true;
    }

    // 4. take_garage_item(Item)
    const takeMatch = trimmed.match(/^take_garage_item\((\w+)\)$/);
    if (takeMatch) {
      const item = takeMatch[1];
      const canTake = await this.queryOnce(`can_take_garage_item(${item})`);
      if (!canTake) return false;

      this.inMemoryFacts.add(`player_has(${item})`);
      if (!this.state.inventory.includes(item)) {
        this.state.inventory.push(item);
      }
      try {
        await assertPrologFact(`player_has(${item})`);
      } catch {}
      return true;
    }

    // 5. take_locker_tape
    if (trimmed === 'take_locker_tape') {
      if (this.state.locker14Looted || this.inMemoryFacts.has('locker_14_looted')) return false;
      this.state.locker14Looted = true;
      this.inMemoryFacts.add('locker_14_looted');
      this.inMemoryFacts.add('player_has(cassette_tape_may)');
      if (!this.state.inventory.includes('cassette_tape_may')) {
        this.state.inventory.push('cassette_tape_may');
      }
      try {
        await assertPrologFact('player_has(cassette_tape_may)');
        await assertPrologFact('locker_14_looted');
      } catch {}
      return true;
    }

    // take_stairway_key
    if (trimmed === 'take_stairway_key') {
      this.inMemoryFacts.add('player_has(key_stairway_gate)');
      if (!this.state.inventory.includes('key_stairway_gate')) {
        this.state.inventory.push('key_stairway_gate');
      }
      try {
        await assertPrologFact('player_has(key_stairway_gate)');
      } catch {}
      return true;
    }

    // can_take_locker_item(key_stairway_gate)
    if (trimmed === 'can_take_locker_item(key_stairway_gate)') {
      return !this.state.inventory.includes('key_stairway_gate') && !this.inMemoryFacts.has('player_has(key_stairway_gate)');
    }

    // 6. unlock_stairway_gate / stairway_gate_unlocked
    if (trimmed === 'unlock_stairway_gate') {
      this.state.stairwayGateUnlocked = true;
      this.state.escapedInterior = true;
      this.inMemoryFacts.add('stairway_gate_unlocked');
      this.inMemoryFacts.add('escaped_interior');
      return true;
    }
    if (trimmed === 'stairway_gate_unlocked') {
      return this.state.stairwayGateUnlocked || this.inMemoryFacts.has('stairway_gate_unlocked');
    }
    if (trimmed === 'escaped_interior') {
      return this.state.escapedInterior || this.inMemoryFacts.has('escaped_interior');
    }
    if (trimmed === 'door_state(stairwell_exit_gate, unlocked)') {
      return this.state.stairwayGateUnlocked || this.inMemoryFacts.has('stairway_gate_unlocked');
    }

    // 7. unlock_locker_14 / locker_unlocked(14)
    if (trimmed === 'unlock_locker_14') {
      this.state.locker14Unlocked = true;
      this.inMemoryFacts.add('locker_unlocked(14)');
      return true;
    }
    if (trimmed === 'locker_unlocked(14)') {
      return this.state.locker14Unlocked || this.inMemoryFacts.has('locker_unlocked(14)');
    }

    // 8. cut_banyan_roots / well_roots_severed
    if (trimmed === 'cut_banyan_roots') {
      this.state.wellRootsSevered = true;
      this.inMemoryFacts.add('well_roots_severed');
      try {
        await assertPrologFact('well_roots_severed');
      } catch {}
      return true;
    }
    if (trimmed === 'well_roots_severed') {
      return this.state.wellRootsSevered || this.inMemoryFacts.has('well_roots_severed');
    }

    // 9. mount_well_pulley / well_pulley_rigged
    if (trimmed === 'mount_well_pulley') {
      this.state.wellPulleyRigged = true;
      this.inMemoryFacts.add('well_pulley_rigged');
      this.state.inventory = this.state.inventory.filter((i) => i !== 'iron_pulley');
      this.inMemoryFacts.delete('player_has(iron_pulley)');
      try {
        await assertPrologFact('well_pulley_rigged');
      } catch {}
      return true;
    }
    if (trimmed === 'well_pulley_rigged') {
      return this.state.wellPulleyRigged || this.inMemoryFacts.has('well_pulley_rigged');
    }

    // 10. rig_well_rope / well_rope_rigged
    if (trimmed === 'rig_well_rope') {
      this.state.wellRopeRigged = true;
      this.inMemoryFacts.add('well_rope_rigged');
      this.state.inventory = this.state.inventory.filter(
        (i) => i !== 'coiled_nylon_rope' && i !== 'nylon_rope'
      );
      this.inMemoryFacts.delete('player_has(coiled_nylon_rope)');
      this.inMemoryFacts.delete('player_has(nylon_rope)');
      try {
        await assertPrologFact('well_rope_rigged');
      } catch {}
      return true;
    }
    if (trimmed === 'well_rope_rigged') {
      return this.state.wellRopeRigged || this.inMemoryFacts.has('well_rope_rigged');
    }

    // 11. well_descent_ready
    if (trimmed === 'well_descent_ready') {
      return Boolean(
        (this.state.wellRootsSevered || this.inMemoryFacts.has('well_roots_severed')) &&
        (this.state.wellPulleyRigged || this.inMemoryFacts.has('well_pulley_rigged')) &&
        (this.state.wellRopeRigged || this.inMemoryFacts.has('well_rope_rigged'))
      );
    }

    // 12. descend_into_well
    if (trimmed === 'descend_into_well') {
      const ready = await this.queryOnce('well_descent_ready');
      if (!ready) return false;
      this.state.currentLocation = 'well_interior_deep';
      this.inMemoryFacts.add('current_location(well_interior_deep)');
      try {
        await assertPrologFact('current_location(well_interior_deep)');
      } catch {}
      return true;
    }

    // 13. insert_cassette_tape
    if (trimmed === 'insert_cassette_tape') {
      const hasTape =
        this.state.inventory.includes('cassette_tape_may') ||
        this.inMemoryFacts.has('player_has(cassette_tape_may)');
      if (!hasTape) return false;
      this.state.cassetteInserted = true;
      this.inMemoryFacts.add('cassette_inserted');
      this.state.inventory = this.state.inventory.filter((i) => i !== 'cassette_tape_may');
      this.inMemoryFacts.delete('player_has(cassette_tape_may)');
      try {
        await assertPrologFact('cassette_inserted');
      } catch {}
      return true;
    }

    // 14. play_cassette_tape
    if (trimmed === 'play_cassette_tape') {
      this.state.cassettePlayed = true;
      this.state.conduitUnlocked = true;
      this.inMemoryFacts.add('cassette_played');
      this.inMemoryFacts.add('conduit_unlocked');
      try {
        await assertPrologFact('cassette_played');
        await assertPrologFact('conduit_unlocked');
      } catch {}
      return true;
    }

    // 15. unlock_storm_conduit
    if (trimmed === 'unlock_storm_conduit') {
      this.state.conduitUnlocked = true;
      this.inMemoryFacts.add('conduit_unlocked');
      try {
        await assertPrologFact('conduit_unlocked');
      } catch {}
      return true;
    }

    // 16. conduit_unlocked
    if (trimmed === 'conduit_unlocked') {
      return Boolean(this.state.conduitUnlocked || this.inMemoryFacts.has('conduit_unlocked'));
    }

    // 17. player_has(Item) / has_item(Item)
    const playerHasMatch = trimmed.match(/^(?:player_has|has_item)\((.+)\)$/);
    if (playerHasMatch) {
      const item = playerHasMatch[1];
      return this.state.inventory.includes(item) || this.inMemoryFacts.has(`player_has(${item})`);
    }

    // 18. current_location(Location)
    const curLocMatch = trimmed.match(/^current_location\((\w+)\)$/);
    if (curLocMatch) {
      const loc = curLocMatch[1];
      return this.state.currentLocation === loc || this.inMemoryFacts.has(`current_location(${loc})`);
    }

    // 19. current_chapter(N) / chapter(N)
    const curChMatch = trimmed.match(/^(?:current_chapter|chapter)\((\d+)\)$/);
    if (curChMatch) {
      const ch = curChMatch[1];
      return this.inMemoryFacts.has(`current_chapter(${ch})`) || this.inMemoryFacts.has(`chapter(${ch})`);
    }

    // 20. can_traverse
    const traverseMatch = trimmed.match(/^can_traverse\((\w+),\s*(\w+)\)$/);
    if (traverseMatch) {
      const [, from, to] = traverseMatch;
      if (from === 'well_interior_deep' && to === 'room_101_seance_flashback') {
        return Boolean(this.state.conduitUnlocked || this.inMemoryFacts.has('conduit_unlocked'));
      }
      if (from === 'room_101_seance_flashback' && to === 'well_interior_deep') {
        return true;
      }
      if (from === 'stairwell_gate' && to === 'hostel_outer_grounds') {
        return Boolean(this.state.stairwayGateUnlocked || this.inMemoryFacts.has('stairway_gate_unlocked'));
      }
    }

    // 21. Check in-memory facts set
    if (this.inMemoryFacts.has(trimmed)) {
      return true;
    }

    // Fallback to logic engine query
    try {
      const res: PrologQueryResult = await queryProlog(query);
      return res.success;
    } catch {
      return false;
    }
  }

  /**
   * Full query with bindings from Prolog engine, supporting compound clauses.
   */
  async query(query: string): Promise<PrologQueryResult> {
    try {
      const clauses = splitPrologClauses(query);
      let allSuccess = true;
      for (const clause of clauses) {
        const success = await this.queryOnce(clause);
        if (!success) {
          allSuccess = false;
        }
      }
      return { success: allSuccess };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Query execution failed' };
    }
  }

  // --- Chapter 3 Garage & Locker 14 Operations ---

  async drainGarage(): Promise<boolean> {
    return this.queryOnce('drain_garage.');
  }

  async isGarageDrained(): Promise<boolean> {
    return this.queryOnce('garage_drained.');
  }

  async canTakeGarageItem(itemId: 'iron_pulley' | 'rusty_machete'): Promise<boolean> {
    return this.queryOnce(`can_take_garage_item(${itemId}).`);
  }

  async takeGarageItem(itemId: 'iron_pulley' | 'rusty_machete'): Promise<boolean> {
    return this.queryOnce(`take_garage_item(${itemId}).`);
  }

  async takeLockerTape(): Promise<boolean> {
    return this.queryOnce('take_locker_tape.');
  }

  async takeStairwayKey(): Promise<boolean> {
    return this.queryOnce('take_stairway_key.');
  }

  // --- Chapter 3 Banyan Wellhead Operations ---

  async cutBanyanRoots(): Promise<boolean> {
    return this.queryOnce('cut_banyan_roots.');
  }

  async mountWellPulley(): Promise<boolean> {
    return this.queryOnce('mount_well_pulley.');
  }

  async rigWellRope(): Promise<boolean> {
    return this.queryOnce('rig_well_rope.');
  }

  async canDescendWell(): Promise<boolean> {
    return this.queryOnce('well_descent_ready.');
  }

  // --- Chapter 3 Well Interior Deep Operations ---

  async insertCassette(): Promise<boolean> {
    return this.queryOnce('insert_cassette_tape.');
  }

  async playCassette(): Promise<boolean> {
    return this.queryOnce('play_cassette_tape.');
  }

  async isConduitUnlocked(): Promise<boolean> {
    return this.queryOnce('conduit_unlocked.');
  }

  async setLocation(location: string): Promise<void> {
    this.state.currentLocation = location;
    this.inMemoryFacts.add(`current_location(${location})`);
    try {
      await assertPrologFact(`current_location(${location})`);
    } catch {}
  }
}

export const PrologBridge = new PrologBridgeService();

// Global bridge attachment so that (window as any).prologEngine queries succeed seamlessly
if (typeof window !== 'undefined') {
  (window as any).prologEngine = PrologBridge;
}

export default PrologBridge;