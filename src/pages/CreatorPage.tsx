import { useCallback, useMemo, useRef, useState } from "react";
import { placeFlower } from "../lib/arrange";
import {
  emptyCounts,
  MAX_PER_COLOR,
  type FlowerColor,
  type FlowerCounts,
  type PlacedFlower,
} from "../lib/flowers";
import { Basket } from "../components/Basket";
import { Counters } from "../components/Counters";
import { FlyingFlower, type Flight } from "../components/FlyingFlower";
import { Garden, type GardenFlower } from "../components/Garden";
import { SendForm } from "../components/SendForm";
import { Toast } from "../components/Toast";
import styles from "./CreatorPage.module.css";

export function CreatorPage() {
  const [counts, setCounts] = useState<FlowerCounts>(emptyCounts);
  const [basket, setBasket] = useState<PlacedFlower[]>([]);
  const [landingId, setLandingId] = useState<string | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const basketRef = useRef<HTMLDivElement>(null);
  const countsRef = useRef(counts);
  countsRef.current = counts;

  const disabledColors = useMemo(() => {
    const map: Partial<Record<FlowerColor, boolean>> = {};
    (Object.keys(counts) as FlowerColor[]).forEach((c) => {
      if (counts[c] >= MAX_PER_COLOR) map[c] = true;
    });
    return map;
  }, [counts]);

  const hideToast = useCallback(() => setToastVisible(false), []);

  const getBasketTarget = () => {
    const el = basketRef.current;
    if (!el) {
      return { x: window.innerWidth * 0.2, y: window.innerHeight * 0.4 };
    }
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height * 0.55 };
  };

  const handlePick = (gardenFlower: GardenFlower, rect: DOMRect) => {
    const color = gardenFlower.color;
    if (countsRef.current[color] >= MAX_PER_COLOR) return;

    const nextCounts = {
      ...countsRef.current,
      [color]: countsRef.current[color] + 1,
    };
    countsRef.current = nextCounts;
    setCounts(nextCounts);

    const placed = placeFlower(color, `basket-${gardenFlower.id}-${Date.now()}`);
    setFlights((prev) => [
      ...prev,
      {
        id: `fly-${placed.id}`,
        color,
        from: rect,
        to: getBasketTarget(),
      },
    ]);

    window.setTimeout(() => {
      setBasket((prev) => [...prev, placed]);
      setLandingId(placed.id);
      window.setTimeout(
        () => setLandingId((id) => (id === placed.id ? null : id)),
        500,
      );
    }, 400);
  };

  const handleFlightDone = useCallback((id: string) => {
    setFlights((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleRemove = (flower: PlacedFlower) => {
    setBasket((prev) => prev.filter((f) => f.id !== flower.id));
    setCounts((prev) => ({
      ...prev,
      [flower.color]: Math.max(0, prev[flower.color] - 1),
    }));
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.brand}>Ramillete</h1>
        <p className={styles.tagline}>Recolecta flores y envía un arreglo hecho a mano.</p>
      </header>

      <div className={styles.stage}>
        <aside className={styles.left}>
          <div ref={basketRef} className={styles.basketArea}>
            <Basket
              flowers={basket}
              onRemove={handleRemove}
              landingId={landingId}
            />
          </div>
          <Counters counts={counts} />
          <SendForm counts={counts} onCopied={() => setToastVisible(true)} />
        </aside>

        <div className={styles.right}>
          <Garden onPick={handlePick} disabledColors={disabledColors} />
        </div>
      </div>

      {flights.map((flight) => (
        <FlyingFlower key={flight.id} flight={flight} onDone={handleFlightDone} />
      ))}

      <Toast message="Link copiado" visible={toastVisible} onHide={hideToast} />
    </div>
  );
}
