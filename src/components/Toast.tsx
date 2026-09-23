import { useEffect } from "react";
import styles from "./Toast.module.css";

type ToastProps = {
  message: string;
  visible: boolean;
  onHide: () => void;
};

export function Toast({ message, visible, onHide }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const t = window.setTimeout(onHide, 2200);
    return () => window.clearTimeout(t);
  }, [visible, onHide]);

  return (
    <div
      className={`${styles.toast} ${visible ? styles.show : ""}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
