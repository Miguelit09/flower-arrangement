import { useState, type FormEvent } from "react";
import type { FlowerCounts } from "../lib/flowers";
import {
  buildGiftUrl,
  isValidSendPayload,
  MAX_DE,
  MAX_PARA,
  MAX_NOTA,
} from "../lib/urlParams";
import styles from "./SendForm.module.css";

type SendFormProps = {
  counts: FlowerCounts;
  onCopied: () => void;
};

export function SendForm({ counts, onCopied }: SendFormProps) {
  const [de, setDe] = useState("");
  const [para, setPara] = useState("");
  const [nota, setNota] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = { counts, de: de.trim(), para: para.trim(), nota: nota.trim() };
    const validationError = isValidSendPayload(payload);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setBusy(true);
    const baseUrl = `${window.location.origin}${import.meta.env.BASE_URL}`;
    const url = buildGiftUrl(baseUrl, payload);
    try {
      await navigator.clipboard.writeText(url);
      onCopied();
    } catch {
      setError("No se pudo copiar el link. Copia manualmente desde la barra.");
      try {
        window.prompt("Copia este link:", url);
      } catch {
        /* ignore */
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>De</span>
          <input
            type="text"
            value={de}
            maxLength={MAX_DE}
            onChange={(e) => setDe(e.target.value)}
            placeholder="Tu nombre"
            autoComplete="nickname"
            required
          />
        </label>
        <label className={styles.field}>
          <span>Para</span>
          <input
            type="text"
            value={para}
            maxLength={MAX_PARA}
            onChange={(e) => setPara(e.target.value)}
            placeholder="Destinatario"
            autoComplete="off"
            required
          />
        </label>
      </div>
      <label className={styles.field}>
        <span>Nota</span>
        <input
          type="text"
          value={nota}
          maxLength={MAX_NOTA}
          onChange={(e) => setNota(e.target.value)}
          placeholder="Un mensaje corto (opcional)"
        />
      </label>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <button type="submit" className={styles.submit} disabled={busy}>
        {busy ? "Copiando…" : "Enviar"}
      </button>
    </form>
  );
}
