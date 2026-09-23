import {
  clampCount,
  emptyCounts,
  FLOWER_COLORS,
  type FlowerCounts,
  totalFlowers,
} from "./flowers";

export type GiftPayload = {
  counts: FlowerCounts;
  de: string;
  para: string;
  nota: string;
};

const MAX_DE = 10;
const MAX_PARA = 10;
const MAX_NOTA = 30;

export function truncate(value: string, max: number): string {
  return value.slice(0, max);
}

export function parseGiftParams(search: string): GiftPayload {
  const params = new URLSearchParams(search);
  const counts = emptyCounts();
  for (const color of FLOWER_COLORS) {
    counts[color] = clampCount(Number(params.get(color)));
  }
  return {
    counts,
    de: truncate(params.get("de") ?? "", MAX_DE),
    para: truncate(params.get("para") ?? "", MAX_PARA),
    nota: truncate(params.get("nota") ?? "", MAX_NOTA),
  };
}

export function buildGiftUrl(
  baseUrl: string,
  payload: GiftPayload,
): string {
  const params = new URLSearchParams();
  for (const color of FLOWER_COLORS) {
    params.set(color, String(payload.counts[color]));
  }
  params.set("de", truncate(payload.de, MAX_DE));
  params.set("para", truncate(payload.para, MAX_PARA));
  params.set("nota", truncate(payload.nota, MAX_NOTA));
  const root = baseUrl.replace(/\/$/, "");
  return `${root}/arreglo?${params.toString()}`;
}

export function isValidSendPayload(payload: GiftPayload): string | null {
  if (totalFlowers(payload.counts) < 1) {
    return "Recolecta al menos una flor.";
  }
  if (!payload.de.trim()) {
    return "Escribe quién envía el arreglo.";
  }
  if (!payload.para.trim()) {
    return "Escribe para quién es el arreglo.";
  }
  return null;
}

export { MAX_DE, MAX_PARA, MAX_NOTA, totalFlowers };
