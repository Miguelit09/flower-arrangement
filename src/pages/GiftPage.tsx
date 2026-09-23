import { useMemo } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { arrangeFromCounts, seedFromGiftParams } from "../lib/arrange";
import { totalFlowers } from "../lib/flowers";
import { parseGiftParams } from "../lib/urlParams";
import { Basket } from "../components/Basket";
import styles from "./GiftPage.module.css";

export function GiftPage() {
  const location = useLocation();
  const payload = useMemo(
    () => parseGiftParams(location.search),
    [location.search],
  );

  const flowers = useMemo(() => {
    const seed = seedFromGiftParams(
      payload.counts,
      payload.de,
      payload.para,
      payload.nota,
    );
    return arrangeFromCounts(payload.counts, seed);
  }, [payload]);

  if (totalFlowers(payload.counts) < 1) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.arrangement}>
        <Basket flowers={flowers} size="lg" interactive={false} />
      </div>

      <div className={styles.message}>
        <p className={styles.fromTo}>
          De <strong>{payload.de || "alguien"}</strong> para{" "}
          <strong>{payload.para || "ti"}</strong>
        </p>
        {payload.nota ? <p className={styles.note}>{payload.nota}</p> : null}
      </div>

      <Link to="/" className={styles.cta}>
        Crea tu arreglo floral
      </Link>
    </div>
  );
}
