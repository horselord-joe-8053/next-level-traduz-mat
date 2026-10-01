# Traduz Mat Architecture

## Request path

Browser → Traduz FastAPI backend → OpenAI-compatible LLM API

## Repository layout

- `frontend/` — UI and client-side state only.
- `backend/` — HTTP API, LLM client, secret-bearing configuration.

## Boundaries

- Frontend calls **only** the Traduz API, never the LLM provider directly.
- LLM credentials and `LLM_*` env vars load only in the backend process.
- Provider responses are validated at the backend boundary before returning to the client.

## Persistence

No server-side persistence in the baseline skeleton. Browser-local or server persistence requires an approved spec in `docs/specs/`.

## Local development topology

Two processes for manual testing (`./scripts/dev.sh`):

| Process | Default | Role |
|---------|---------|------|
| Vite (frontend) | `http://localhost:5973` | SPA; `VITE_API_BASE_URL` points at API |
| Uvicorn (backend) | `http://127.0.0.1:8900` | `/health`, `POST /translate` |

`./scripts/verify.sh` does not start these servers.

## CORS

Backend allows configured local frontend origins (see `backend/app/config.py`).
