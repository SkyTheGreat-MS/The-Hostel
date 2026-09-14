/**
 * Route Card Configuration Registry
 * Canonical navigation destinations for the east_fork TripleFork hub.
 */
import type { Phase3Location } from '../types';

export interface RouteCardDef {
  id: string;
  /** Display sector label e.g. 'SECTOR A - LOCKERS' */
  sectorLabel: string;
  /** Destination Phase3Location ID */
  destination: Phase3Location;
  title: string;
  description: string;
  imagePath: string;
  /** True = only visible when currentChapter >= 2 AND natAudienceConcluded */
  requiresNatAudience?: boolean;
  glowStyle?: 'default' | 'special';
}

export const ROUTE_CARDS: RouteCardDef[] = [
  {
    id: 'lockers',
    sectorLabel: 'SECTOR A - LOCKERS',
    destination: 'lockers_main',
    title: 'STUDENT LOCKER BAY',
    description: 'Metal lockers from 1998. Belongings of May, Sandar, and dorm residents.',
    imagePath: '/assets/scenes/locker_bay_corridor.jpg',
    glowStyle: 'default',
  },
  {
    id: 'prayer_room',
    sectorLabel: 'SECTOR B - SANCTUARY',
    destination: 'prayer_room_main',
    title: 'PRAYER ROOM AND ALTAR',
    description: 'Ancient Burmese Nat shrine with offering bowls and incense tiers.',
    imagePath: '/assets/scenes/prayer_altar_shrine.jpg',
    glowStyle: 'default',
  },
  {
    id: 'caretaker_archive',
    sectorLabel: 'SECTOR C - ARCHIVE',
    destination: 'caretaker_office_main',
    title: 'CARETAKER ARCHIVE',
    description: "Warden's locked records office secured by a heavy brass tumbler lock.",
    imagePath: '/assets/scenes/caretaker_archive_room.jpg',
    glowStyle: 'default',
  },
  {
    id: 'balcony_326',
    sectorLabel: 'PATHWAY 326',
    destination: 'balcony_326',
    title: 'THE OVERLOOK BALCONY',
    description: 'Padlocked fire door forced ajar. Monsoon rain lashing the eaves.',
    imagePath: '/assets/scenes/balcony_rain_night.jpg',
    requiresNatAudience: true,
    glowStyle: 'special',
  },
];

export default ROUTE_CARDS;
