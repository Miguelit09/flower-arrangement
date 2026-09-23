import {
  FLOWER_COLORS,
  type FlowerColor,
  type FlowerCounts,
  type PlacedFlower,
} from "./flowers";

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

/** Position inside an oval, values as percentages (0–100). */
export function placeInOval(rng: () => number): Omit<PlacedFlower, "id" | "color"> {
  const angle = rng() * Math.PI * 2;
  const r = Math.sqrt(rng()) * 0.88;
  return {
    x: 50 + r * 40 * Math.cos(angle),
    y: 52 + r * 32 * Math.sin(angle),
    rot: rng() * 360,
    scale: 0.72 + rng() * 0.4,
  };
}

export function placeFlower(
  color: FlowerColor,
  id: string,
  rng: () => number = Math.random,
): PlacedFlower {
  return { id, color, ...placeInOval(rng) };
}

export function arrangeFromCounts(counts: FlowerCounts, seed: number): PlacedFlower[] {
  const rng = mulberry32(seed);
  const flowers: PlacedFlower[] = [];
  let i = 0;
  for (const color of FLOWER_COLORS) {
    for (let n = 0; n < counts[color]; n++) {
      flowers.push(placeFlower(color, `seeded-${i++}`, rng));
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
