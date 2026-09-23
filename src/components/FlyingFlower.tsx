import { useEffect, useState } from "react";
import type { FlowerColor } from "../lib/flowers";
import { Flower } from "./Flower";
import styles from "./FlyingFlower.module.css";

export type Flight = {
  id: string;
  color: FlowerColor;
  from: DOMRect;
  to: { x: number; y: number };
};

type FlyingFlowerProps = {
  flight: Flight;
  onDone: (id: string) => void;
};

export function FlyingFlower({ flight, onDone }: FlyingFlowerProps) {
  const [phase, setPhase] = useState<"start" | "end">("start");

  useEffect(() => {
    const raf = requestAnimationFrame(() => setPhase("end"));
    const done = window.setTimeout(() => onDone(flight.id), 480);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(done);
    };
  }, [flight.id, onDone]);

  const x = phase === "start" ? flight.from.left + flight.from.width / 2 : flight.to.x;
  const y = phase === "start" ? flight.from.top + flight.from.height / 2 : flight.to.y;

  return (
    <div
      className={styles.flyer}
      style={{
        transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${phase === "end" ? 0.75 : 1})`,
        opacity: phase === "end" ? 0.35 : 1,
      }}
    >
      <Flower color={flight.color} size={52} />
    </div>
  );
}
