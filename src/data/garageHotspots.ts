/**
 * Phase 2 - Subterranean Garage spatial mapping.
 *
 * Authoritative source: docs/PHASE_2_GARAGE_SPATIAL_MAPPING.md
 * Section 2 (calibrated spatial coordinate mapping) and Section 2.1
 * (detailed hotspot geometry table).
 *
 * Coordinates are percentages on the 0..100 aspect-fill viewport used by
 * garage_subterranean_rain.jpg / garage_subterranean_rain_submerged.jpg.
 *
 * These polygons are transcribed VERBATIM from Section 2.1. Do not "tighten"
 * or shift vertices here — the acceptance criteria are written against these
 * exact coordinates.
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

export const GARAGE_HOTSPOT_REVISION = 'phase2-calibrated-spec-2.1';

export const GARAGE_HOTSPOTS: GarageHotspotGeometry[] = [
  {
    id: 'garage_drain_valve',
    inGameName: 'ရေနုတ်အဆို့ရှင်ဘီး',
    polygonPoints: '68.5,42.0 78.5,39.0 82.0,48.0 77.0,58.0 68.0,56.0 65.5,48.0',
    tooltipFlooded: '[ရေနုတ်အဆို့ရှင်ကို လှည့်ဖွင့်မည်]',
    tooltipDrained: '[ပွင့်နေသော အဆို့ရှင်ကို စစ်ဆေးမည်]',
  },
  {
    id: 'garage_bicycles',
    inGameName: '၁၉၉၀ ကျောင်းသူစက်ဘီးဟောင်းများ',
    polygonPoints: '28.0,62.0 54.0,58.0 64.0,66.0 60.0,86.0 26.0,84.0 22.0,72.0',
    tooltipFlooded: '[ရေမြုပ်စက်ဘီးများကို စစ်ဆေးမည်]',
    tooltipDrained: '[ရေမြုပ်စက်ဘီးများကို စစ်ဆေးမည်]',
  },
  {
    id: 'garage_caretaker_log',
    inGameName: 'အဆောင်မှူး၏ ထိန်းသိမ်းရေးမှတ်တမ်း',
    polygonPoints: '6.0,52.0 22.0,52.0 24.0,68.0 8.0,70.0',
    tooltipFlooded: '[အဆောင်မှူးမှတ်တမ်းကို ဖတ်ရှုမည်]',
    tooltipDrained: '[အဆောင်မှူးမှတ်တမ်းကို ဖတ်ရှုမည်]',
  },
  {
    id: 'garage_tool_pulley',
    inGameName: 'သံသွန်းစက်သီးကြီး',
    polygonPoints: '51.5,18.0 60.0,18.0 61.5,32.0 55.0,36.0 49.5,30.0',
    tooltipFlooded: '[ရေထဲက သံစက်သီးကို ကြည့်မည်]',
    tooltipDrained: '[သံစက်သီးကို ယူမည်]',
  },
  {
    id: 'garage_tool_machete',
    inGameName: 'သံချေးတက် ဓားမကြီး',
    polygonPoints: '4.0,78.0 18.0,76.0 22.0,88.0 8.0,92.0',
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
