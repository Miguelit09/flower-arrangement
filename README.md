# Ramillete

Arreglos florales compartibles. Recolecta flores en el jardín, llénalas en la cesta y envía un link.

## Desarrollo

```bash
npm install
npm run dev
```

La app queda en `http://localhost:5173/flower-arrangement/` (mismo `base` que en GitHub Pages).

## Scripts

- `npm run dev` — servidor local
- `npm run build` — build de producción + preparación para Pages (`dist/`)
- `npm run preview` — previsualizar el build

## GitHub Pages

El workflow `.github/workflows/deploy-pages.yml` publica `dist/` en la rama `gh-pages` al hacer push a `main`.

En el repo: **Settings → Pages → Source: Deploy from a branch → `gh-pages` / root**.

URL: https://Miguelit09.github.io/flower-arrangement/
