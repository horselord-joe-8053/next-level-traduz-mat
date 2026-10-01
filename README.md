# Traduz Mat

Minimal Brazilian Portuguese → English translation web app (Matt Pocock skills + v5 harness practice).

**Remote:** [github.com/horselord-joe-8053/next-level-traduz-mat](https://github.com/horselord-joe-8053/next-level-traduz-mat)

## Layout

- `frontend/` — React, TypeScript, Vite
- `backend/` — FastAPI (Python)
- `docs/` — product, architecture, specs, templates
- `GLOSSARY.md` — domain terms for grill/spec alignment
- `scripts/dev.sh` — start API + UI (one terminal)
- `scripts/verify.sh` — canonical verification (CI uses the same)

## Local development

```bash
cp .env.example backend/.env    # once: set LLM_API_KEY
cp frontend/.env.example frontend/.env
./scripts/dev.sh
```

Default dev URLs: **http://localhost:5973** (UI), **http://127.0.0.1:8900** (API). Override with `TRADUZ_BACKEND_PORT`, `TRADUZ_FRONTEND_PORT`.

Never commit secrets.

## Verification

```bash
./scripts/verify.sh
```

## Engineering guidance

- Agent policy: `AGENTS.md`
- TDD: `docs/TRADUZ-TDD.md`
- Matt skills: `.agents/skills/` (install from **this directory** — see Matt guide §2)
- Matt track guide: `../../docs/traduz-cursor-practice-guide-mattpocock-skills.md`
