import { useEffect, useId, useRef, useState } from "react";
import {
  MAX_GARDEN_FLOWERS,
  SPAWN_MAX_MS,
  SPAWN_MIN_MS,
  randomColor,
  type FlowerColor,
} from "../lib/flowers";
import { Flower } from "./Flower";
import flowerStyles from "./Flower.module.css";
import styles from "./Garden.module.css";

export type GardenFlower = {
  id: string;
  color: FlowerColor;
  x: number;
  y: number;
  rot: number;
  scale: number;
};

type GardenProps = {
  onPick: (flower: GardenFlower, rect: DOMRect) => void;
  disabledColors?: Partial<Record<FlowerColor, boolean>>;
};

function spawnOne(id: string): GardenFlower {
  return {
    id,
    color: randomColor(),
    x: 8 + Math.random() * 84,
    y: 12 + Math.random() * 76,
    rot: Math.random() * 40 - 20,
    scale: 0.85 + Math.random() * 0.35,
  };
}

function GardenFlowerItem({
  flower,
  disabled,
  onPick,
}: {
  flower: GardenFlower;
  disabled?: boolean;
  onPick: (flower: GardenFlower, rect: DOMRect) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={styles.slot}
      style={{
        left: `${flower.x}%`,
        top: `${flower.y}%`,
        transform: `translate(-50%, -50%) rotate(${flower.rot}deg) scale(${flower.scale})`,
        opacity: disabled ? 0.45 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      <Flower
        color={flower.color}
        size={66}
        className={`${flowerStyles.spawn} ${flowerStyles.sway}`}
        title={
          disabled
            ? `Ya tienes el máximo de flores ${flower.color}`
            : `Recoger flor ${flower.color}`
        }
        onClick={() => {
          if (disabled || !ref.current) return;
          onPick(flower, ref.current.getBoundingClientRect());
        }}
      />
    </div>
  );
}

export function Garden({ onPick, disabledColors }: GardenProps) {
  const [flowers, setFlowers] = useState<GardenFlower[]>([]);
  const seq = useRef(0);
  const reactId = useId();

  useEffect(() => {
    let cancelled = false;
    let timer: number;

    const schedule = () => {
      const delay = SPAWN_MIN_MS + Math.random() * (SPAWN_MAX_MS - SPAWN_MIN_MS);
      timer = window.setTimeout(() => {
        if (cancelled) return;
        setFlowers((prev) => {
          if (prev.length >= MAX_GARDEN_FLOWERS) return prev;
          seq.current += 1;
          return [...prev, spawnOne(`${reactId}-${seq.current}`)];
        });
        schedule();
      }, delay);
    };

    schedule();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [reactId]);

  const handlePick = (flower: GardenFlower, rect: DOMRect) => {
    if (disabledColors?.[flower.color]) return;
    setFlowers((prev) => prev.filter((f) => f.id !== flower.id));
    onPick(flower, rect);
  };

  return (
    <section className={styles.garden} aria-label="Jardín">
      <div className={styles.grass} />
      <div className={styles.haze} />
      {flowers.map((flower) => (
        <GardenFlowerItem
          key={flower.id}
          flower={flower}
          disabled={disabledColors?.[flower.color]}
          onPick={handlePick}
        />
      ))}
      <p className={styles.hint}>Toca las flores para recolectarlas</p>
    </section>
  );
}
