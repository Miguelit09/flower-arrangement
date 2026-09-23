import {
  FLOWER_COLORS,
  type FlowerColor,
  type FlowerCounts,
  type PlacedFlower,
} from "./flowers";

const CANDIDATES = 40;
const MIN_SEPARATION = 16;

export function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Point = { x: number; y: number };

function sampleOvalPoint(rng: () => number): Omit<PlacedFlower, "id" | "color"> {
  const angle = rng() * Math.PI * 2;
  const r = Math.sqrt(rng()) * 0.88;
  return {
    x: 50 + r * 40 * Math.cos(angle),
    y: 52 + r * 32 * Math.sin(angle),
    rot: rng() * 360,
    scale: 0.72 + rng() * 0.4,
  };
}

function minDistanceToExisting(point: Point, existing: Point[]): number {
  if (existing.length === 0) return Infinity;
  let min = Infinity;
  for (const other of existing) {
    const dx = point.x - other.x;
    const dy = point.y - other.y;
    const d = Math.hypot(dx, dy);
    if (d < min) min = d;
  }
  return min;
}

/** Position inside an oval, values as percentages (0–100). */
export function placeInOval(
  rng: () => number,
  existing: Point[] = [],
): Omit<PlacedFlower, "id" | "color"> {
  const candidates = Array.from({ length: CANDIDATES }, () => sampleOvalPoint(rng));

  let best = candidates[0];
  let bestDist = minDistanceToExisting(best, existing);
  let bestValid: Omit<PlacedFlower, "id" | "color"> | null = null;
  let bestValidDist = -1;

  for (const candidate of candidates) {
    const dist = minDistanceToExisting(candidate, existing);
    if (dist > bestDist) {
      best = candidate;
      bestDist = dist;
    }
    if (dist >= MIN_SEPARATION && dist > bestValidDist) {
      bestValid = candidate;
      bestValidDist = dist;
    }
  }

  return bestValid ?? best;
}

export function placeFlower(
  color: FlowerColor,
  id: string,
  rng: () => number = Math.random,
  existing: Point[] = [],
): PlacedFlower {
  return { id, color, ...placeInOval(rng, existing) };
}

export function arrangeFromCounts(counts: FlowerCounts, seed: number): PlacedFlower[] {
  const rng = mulberry32(seed);
  const flowers: PlacedFlower[] = [];
  let i = 0;
  for (const color of FLOWER_COLORS) {
    for (let n = 0; n < counts[color]; n++) {
      flowers.push(placeFlower(color, `seeded-${i++}`, rng, flowers));
    }
  }
  return flowers;
}

export function seedFromGiftParams(
  counts: FlowerCounts,
  de: string,
  para: string,
  nota: string,
): number {
  const key = [
    counts.rosa,
    counts.amarillo,
    counts.blanco,
    counts.lavanda,
    de,
    para,
    nota,
  ].join("|");
  return hashSeed(key);
}
