import type { PlacedFlower } from "../lib/flowers";
import { Flower } from "./Flower";
import flowerStyles from "./Flower.module.css";
import styles from "./Basket.module.css";

type BasketProps = {
  flowers: PlacedFlower[];
  onRemove?: (flower: PlacedFlower) => void;
  landingId?: string | null;
  size?: "md" | "lg";
  interactive?: boolean;
};

export function Basket({
  flowers,
  onRemove,
  landingId,
  size = "md",
  interactive = true,
}: BasketProps) {
  return (
    <div
      className={`${styles.wrap} ${size === "lg" ? styles.lg : ""}`}
      aria-label="Cesta de flores"
    >
      <div className={styles.handle} aria-hidden />
      <div className={styles.rim}>
        <div className={styles.interior}>
          {flowers.map((flower) => (
            <div
              key={flower.id}
              className={styles.placed}
              style={{
                left: `${flower.x}%`,
                top: `${flower.y}%`,
                transform: `translate(-50%, -50%) rotate(${flower.rot}deg) scale(${flower.scale})`,
                zIndex: Math.round(flower.y),
              }}
            >
              <Flower
                color={flower.color}
                size={size === "lg" ? 76 : 52}
                className={landingId === flower.id ? flowerStyles.land : undefined}
                title={
                  interactive && onRemove
                    ? `Quitar flor ${flower.color}`
                    : `Flor ${flower.color}`
                }
                onClick={
                  interactive && onRemove ? () => onRemove(flower) : undefined
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
