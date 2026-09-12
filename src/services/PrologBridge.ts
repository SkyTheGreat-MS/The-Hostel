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

class PrologBridgeService {
  private inMemoryFacts: Set<string> = new Set([
    'nat_summoned',
    'chapter(2)',
    'chapter_phase(2, 1)',
    'current_location(garage_subterranean)',
    'locker_unlocked(14)',
  ]);

  private state: PrologBridgeState = {
    currentLocation: 'garage_subterranean',
    inventory: [],
    garageDrained: false,
    locker14Unlocked: true,
    locker14Looted: false,
    stairwayGateUnlocked: true,
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

  private hydrateFromStorage(): void {
    try {
      if (typeof localStorage === 'undefined') return;
      const saved = localStorage.getItem('spirits_labyrinth_progress_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.garageDrained) {
          this.state.garageDrained = true;
          this.inMemoryFacts.add('garage_drained');
        }
        if (parsed.wellRootsSevered) {
          this.state.wellRootsSevered = true;
          this.inMemoryFacts.add('well_roots_severed');
        }
        if (parsed.wellPulleyRigged) {
          this.state.wellPulleyRigged = true;
          this.inMemoryFacts.add('well_pulley_rigged');
        }
        if (parsed.wellRopeRigged) {
          this.state.wellRopeRigged = true;
          this.inMemoryFacts.add('well_rope_rigged');
        }
        if (parsed.cassetteInserted) {
          this.state.cassetteInserted = true;
          this.inMemoryFacts.add('cassette_inserted');
        }
        if (parsed.cassettePlayed) {
          this.state.cassettePlayed = true;
          this.inMemoryFacts.add('cassette_played');
        }
        if (parsed.conduitUnlocked) {
          this.state.conduitUnlocked = true;
          this.inMemoryFacts.add('conduit_unlocked');
        }
        if (Array.isArray(parsed.inventory)) {
          this.state.inventory = parsed.inventory;
          parsed.inventory.forEach((item: string) => {
            this.inMemoryFacts.add(`player_has(${item})`);
          });
        }
        if (parsed.phase3Location) {
          this.state.currentLocation = parsed.phase3Location;
          this.inMemoryFacts.add(`current_location(${parsed.phase3Location})`);
        }
      }
    } catch {}
  }

  /**
   * Evaluates a single Prolog query against the knowledge base rules and state.
   */
  async queryOnce(query: string): Promise<boolean> {
    const trimmed = query.trim().replace(/\.$/, '');

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

    // 6. unlock_stairway_gate
    if (trimmed === 'unlock_stairway_gate') {
      this.state.stairwayGateUnlocked = true;
      this.state.escapedInterior = true;
      this.inMemoryFacts.add('stairway_gate_unlocked');
      this.inMemoryFacts.add('escaped_interior');
      return true;
    }

    // 7. unlock_locker_14
    if (trimmed === 'unlock_locker_14') {
      this.state.locker14Unlocked = true;
      this.inMemoryFacts.add('locker_unlocked(14)');
      return true;
    }

    // 8. cut_banyan_roots
    if (trimmed === 'cut_banyan_roots') {
      this.state.wellRootsSevered = true;
      this.inMemoryFacts.add('well_roots_severed');
      try {
        await assertPrologFact('well_roots_severed');
      } catch {}
      return true;
    }

    // 9. mount_well_pulley
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

    // 10. rig_well_rope
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

    // 17. can_traverse
    const traverseMatch = trimmed.match(/^can_traverse\((\w+),\s*(\w+)\)$/);
    if (traverseMatch) {
      const [, from, to] = traverseMatch;
      if (from === 'well_interior_deep' && to === 'room_101_seance_flashback') {
        return Boolean(this.state.conduitUnlocked || this.inMemoryFacts.has('conduit_unlocked'));
      }
      if (from === 'room_101_seance_flashback' && to === 'well_interior_deep') {
        return true;
      }
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
   * Full query with bindings from Prolog engine
   */
  async query(query: string): Promise<PrologQueryResult> {
    try {
      const success = await this.queryOnce(query);
      return { success };
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
export default PrologBridge;