/**
 * 1998 Burmese Folk-Horror Design System
 * 
 * Rules:
 * 1. Duo-Tone Baseline: Stagnant Obsidian Void (#020504) + Sickly Spectral Verdigris (#193828 / #6ea889 / #e0f0e7).
 * 2. Eye-Breaking Event Accents: Arterial Crimson (Trauma/Damage), Cursed Brass (Altar/Relics), Static Cyan (Temporal Glitch).
 * 3. Typography: Aka08 for Burmese (line-height: 1.75), Cinzel for Occult Latin, Special Elite for 1998 Typewriter.
 * 4. Zero Emojis: All icons must be monochrome vector glyphs (lucide-react).
 */

export const DUO_TONE = {
  // Base Tone 1: Stagnant Obsidian Void
  obsidian: {
    abyss: '#020504',
    dark: '#060b08',
    surface: '#0b140f',
    elevated: '#101c15',
  },
  // Base Tone 2: Sickly Spectral Verdigris Rot
  verdigris: {
    deep: '#112319',
    moss: '#193828',
    mold: '#224a35',
    cold: '#29543e',
    phosphor: '#366b50',
    mist: '#447d60',
    jade: '#6ea889',
    corpsePale: '#b1d4c2',
    glow: '#e0f0e7',
  },
} as const;

export const EVENT_ACCENTS = {
  // Eye-Breaking Accent A: Violent Arterial Crimson (Trauma / Shock / Taboo)
  trauma: {
    clot: '#1a0404',
    arterial: '#330808',
    wound: '#591010',
    blood: '#8a1a1a',
    flash: '#ba2929',
    flesh: '#fca5a5',
  },
  // Eye-Breaking Accent B: Cursed Grave Brass (Altar / Relic Revelation)
  sanctum: {
    grave: '#171107',
    tarnished: '#241b0b',
    incense: '#4a3818',
    gold: '#755926',
    sulfur: '#a37f37',
    candleLight: '#c7a458',
    boneDust: '#f7eed8',
  },
  // Eye-Breaking Accent C: Static Glitch Cyan (Temporal Echo / 2026 Radio)
  temporal: {
    deepRadio: '#0369a1',
    signal: '#0284c7',
    staticGlow: '#38bdf8',
    whiteNoise: '#bae6fd',
  },
} as const;

export const FONTS = {
  burmese: "'Aka08', 'Myanmar Text', sans-serif",
  cinzel: "'Cinzel', serif",
  typewriter: "'Special Elite', cursive",
  bebas: "'Bebas Neue', 'Impact', sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
} as const;

export const Z_INDEX = {
  background: 0,
  hotspot: 10,
  sceneNav: 20,
  vitalsHud: 30,
  thought: 40,
  dialogue: 45,
  modal: 50,
  overlayAlert: 60,
} as const;

export const ANIMATIONS = {
  easeCinematic: [0.16, 1, 0.3, 1] as const,
  thoughtLingerMs: 3000,
  transitionFastMs: 200,
  transitionNormalMs: 350,
  transitionSlowMs: 600,
} as const;

/**
 * Anti-AI-Slop Geometry & Borderless Atmospheric Tokens
 * Strictly adheres to docs/ui_ux_design_rules.md:
 * - Rule 8: Group with spacing, no heavy card borderlines or boxed containers.
 * - Rule 13: Remove unnecessary borders, glowing outlines, and embellishments.
 * - Rule 18: Tabular numbers on dynamic indicators.
 * - Pure 1998 institutional horror: sharp edges (rounded-none), zero borderlines,
 *   natural dissolution into the dark environmental scene.
 */
export const GEOMETRY = {
  sharp: 'rounded-none',
  micro: 'rounded-[1px]',
  hudContainer: 'bg-[#020504]/60 backdrop-blur-sm rounded-none',
  hudItem: 'bg-[#020504]/60 backdrop-blur-sm rounded-none',
  hudButton: 'bg-[#020504]/60 hover:bg-[#060b08]/90 text-[#b1d4c2] hover:text-[#e0f0e7] rounded-none transition-colors',
  dialogueBox: 'dialogue-feather-wash backdrop-blur-sm rounded-none',
  modal: 'bg-[#060b08]/95 backdrop-blur-md rounded-none shadow-none',
} as const;

