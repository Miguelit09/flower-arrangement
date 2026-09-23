import type { CSSProperties } from "react";
import type { FlowerColor } from "../lib/flowers";
import styles from "./Flower.module.css";

type FlowerProps = {
  color: FlowerColor;
  size?: number;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  title?: string;
};

const PETAL_FILLS: Record<FlowerColor, string> = {
  rosa: "var(--flower-rosa-petal)",
  amarillo: "var(--flower-amarillo-petal)",
  blanco: "var(--flower-blanco-petal)",
  lavanda: "var(--flower-lavanda-petal)",
};

const CORE_FILLS: Record<FlowerColor, string> = {
  rosa: "var(--flower-rosa)",
  amarillo: "var(--flower-amarillo)",
  blanco: "#e8e4d8",
  lavanda: "var(--flower-lavanda)",
};

function FlowerSvg({ color }: { color: FlowerColor }) {
  const petal = PETAL_FILLS[color];
  const core = CORE_FILLS[color];
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden>
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i * 60 * Math.PI) / 180;
        const cx = 32 + Math.cos(angle) * 14;
        const cy = 32 + Math.sin(angle) * 14;
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx="10"
            ry="14"
            fill={petal}
            transform={`rotate(${i * 60} ${cx} ${cy})`}
            opacity={0.95}
          />
        );
      })}
      <circle cx="32" cy="32" r="10" fill={core} />
      <circle cx="32" cy="32" r="5" fill="var(--flower-center)" opacity={0.85} />
    </svg>
  );
}

export function Flower({
  color,
  size = 48,
  className,
  style,
  onClick,
  title,
}: FlowerProps) {
  const cls = [styles.flower, className].filter(Boolean).join(" ");
  const mergedStyle: CSSProperties = { width: size, height: size, ...style };

  if (onClick) {
    return (
      <button
        type="button"
        className={cls}
        style={mergedStyle}
        onClick={onClick}
        title={title}
        aria-label={title}
      >
        <FlowerSvg color={color} />
      </button>
    );
  }

  return (
    <div className={cls} style={mergedStyle} title={title} role="img" aria-label={title}>
      <FlowerSvg color={color} />
    </div>
  );
}
