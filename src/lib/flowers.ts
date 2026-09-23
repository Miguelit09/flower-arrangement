export const FLOWER_COLORS = ["rosa", "amarillo", "blanco", "lavanda"] as const;

export type FlowerColor = (typeof FLOWER_COLORS)[number];

export type FlowerCounts = Record<FlowerColor, number>;

export type PlacedFlower = {
  id: string;
  color: FlowerColor;
  x: number;
  y: number;
  rot: number;
  scale: number;
};

export const MAX_PER_COLOR = 25;
export const MAX_GARDEN_FLOWERS = 40;
export const SPAWN_MIN_MS = 600;
export const SPAWN_MAX_MS = 1400;

export const FLOWER_LABELS: Record<FlowerColor, string> = {
  rosa: "Rosa",
  amarillo: "Amarillo",
  blanco: "Blanco",
  lavanda: "Lavanda",
};

export const emptyCounts = (): FlowerCounts => ({
  rosa: 0,
  amarillo: 0,
  blanco: 0,
  lavanda: 0,
});

export const totalFlowers = (counts: FlowerCounts): number =>
  FLOWER_COLORS.reduce((sum, color) => sum + counts[color], 0);

export const randomColor = (): FlowerColor =>
  FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)]!;

export const clampCount = (n: number): number =>
  Math.max(0, Math.min(MAX_PER_COLOR, Math.floor(n) || 0));
