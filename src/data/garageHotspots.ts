/**
 * Phase 2 - Subterranean Garage spatial mapping.
 *
 * Calibrated against `garage_subterranean_rain_submerged.jpg`.
 * Coordinates are percentages on the 0..100 aspect-fill viewport.
 *
 * This supersedes the original table in docs/PHASE_2_GARAGE_SPATIAL_MAPPING.md
 * Section 2.1. The polygon strings below are exact — do not re-round or shift
 * vertices here; the PLUnit spatial-separation test locks them verbatim.
 */

export type GarageHotspotId =
  | 'garage_drain_valve'
  | 'garage_bicycles'
  | 'garage_caretaker_log'
  | 'garage_tool_pulley'
  | 'garage_tool_machete';

export interface GarageHotspotGeometry {
  id: GarageHotspotId;
  inGameName: string;
  polygonPoints: string;
  tooltipFlooded: string;
  tooltipDrained: string;
}

export const GARAGE_HOTSPOT_REVISION = 'phase2-calibrated-submerged-v3';

export const GARAGE_HOTSPOTS: GarageHotspotGeometry[] = [
  {
    id: 'garage_drain_valve',
    inGameName: 'ရေနုတ်အဆိုရှင်ဘီး',
    polygonPoints: '27.5,13.0 29.9,14.7 30.9,19.0 29.9,23.3 27.5,25.1 25.1,23.3 24.1,19.0 25.1,14.7',
    tooltipFlooded: '[ရေနုတ်အဆို့ရှင်ကို လှည့်ဖွင့်မည်]',
    tooltipDrained: '[ပွင့်နေသော အဆို့ရှင်ကို စစ်ဆေးမည်]',
  },
  {
    id: 'garage_bicycles',
    inGameName: '၁၉၉၀ ကျောင်းသူစက်ဘီးဟောင်းများ',
    polygonPoints: '17.0,99.7 42.9,54.7 57.9,65.4 51.1,98.9',
    tooltipFlooded: '[ရေမြုပ်စက်ဘီးများကို စစ်ဆေးမည်]',
    tooltipDrained: '[ရေမြုပ်စက်ဘီးများကို စစ်ဆေးမည်]',
  },
  {
    id: 'garage_caretaker_log',
    inGameName: 'အဆောင်မှူး၏ ထိန်းသိမ်းရေးမှတ်တမ်း',
    polygonPoints: '13.3,42.6 28.4,42.6 28.4,51.3 13.3,51.3',
    tooltipFlooded: '[အဆောင်မှူးမှတ်တမ်းကို ဖတ်ရှုမည်]',
    tooltipDrained: '[အဆောင်မှူးမှတ်တမ်းကို ဖတ်ရှုမည်]',
  },
  {
    id: 'garage_tool_pulley',
    inGameName: 'သံသွန်းစက်သီးကြီး',
    polygonPoints: '10.3,57.9 14.0,60.6 15.6,67.3 14.0,74.0 10.3,76.8 6.6,74.0 5.1,67.3 6.6,60.6',
    tooltipFlooded: '[ရေထဲက သံစက်သီးကို ကြည့်မည်]',
    tooltipDrained: '[သံစက်သီးကို ယူမည်]',
  },
  {
    id: 'garage_tool_machete',
    inGameName: 'သံချေးတက် ဓားမကြီး',
    polygonPoints: '3.7,82.1 30.2,67.6 32.3,72.0 9.2,86.8 2.9,85.2',
    tooltipFlooded: '[ရေထဲက ဓားကို ကြည့်မည်]',
    tooltipDrained: '[သံချေးတက်ဓားမကို ယူမည်]',
  },
];

export const GARAGE_HOTSPOT_BY_ID: Record<GarageHotspotId, GarageHotspotGeometry> =
  GARAGE_HOTSPOTS.reduce((acc, hotspot) => {
    acc[hotspot.id] = hotspot;
    return acc;
  }, {} as Record<GarageHotspotId, GarageHotspotGeometry>);

export type GaragePolygon = Array<readonly [number, number]>;

export const parseGaragePolygon = (points: string): GaragePolygon =>
  points
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const [x, y] = pair.split(',').map(Number);
      return [x, y] as const;
    });

export const pointInGaragePolygon = (x: number, y: number, polygon: GaragePolygon): boolean => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
};

export interface GarageHotspotOverlap {
  a: GarageHotspotId;
  b: GarageHotspotId;
  x: number;
  y: number;
}

/**
 * Samples the full 0..100 viewport and returns every point covered by more
 * than one hotspot. Used by the PLUnit dev suite to prove hover isolation.
 */
export const findOverlappingGarageHotspotSamples = (step = 0.1): GarageHotspotOverlap[] => {
  const polygons = GARAGE_HOTSPOTS.map((hotspot) => ({
    id: hotspot.id,
    polygon: parseGaragePolygon(hotspot.polygonPoints),
  }));
  const overlaps: GarageHotspotOverlap[] = [];

  for (let y = 0; y <= 100; y += step) {
    for (let x = 0; x <= 100; x += step) {
      const active = polygons.filter((entry) => pointInGaragePolygon(x, y, entry.polygon));
      if (active.length > 1) {
        overlaps.push({ a: active[0].id, b: active[1].id, x, y });
      }
    }
  }
  return overlaps;
};
