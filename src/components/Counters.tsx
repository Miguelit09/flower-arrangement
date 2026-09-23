import {
  FLOWER_COLORS,
  FLOWER_LABELS,
  type FlowerCounts,
} from "../lib/flowers";
import { Flower } from "./Flower";
import styles from "./Counters.module.css";

type CountersProps = {
  counts: FlowerCounts;
};

export function Counters({ counts }: CountersProps) {
  return (
    <ul className={styles.list} aria-label="Contadores de flores">
      {FLOWER_COLORS.map((color) => (
        <li key={color} className={styles.item}>
          <Flower color={color} size={28} title={FLOWER_LABELS[color]} />
          <span className={styles.label}>{FLOWER_LABELS[color]}</span>
          <span className={styles.count}>{counts[color]}</span>
        </li>
      ))}
    </ul>
  );
}
