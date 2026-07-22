# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single client-side SPA (the **L403A1 Field Strip Trainer**): React 19 + TypeScript, built/served by Vite 7. There is no backend, database, auth, or external service — the only optional network dependency is Google Fonts (cosmetic; app works offline).

Standard commands live in `package.json` scripts:
- `npm run dev` — Vite dev server with HMR at `http://localhost:5173`. This is the only service needed to run/test the product end to end.
- `npm run build` — `tsc --noEmit && vite build`. This doubles as the type-check/validation gate (there is no separate lint or test setup).
- `npm run preview` — serve the production build from `dist/`.

Notes:
- No lint config (ESLint/Prettier) and no automated test framework are configured. `npm run build` (type-check) is the closest validation gate.
- Node 20+ is required by Vite 7 (the VM ships Node 22, which works).
