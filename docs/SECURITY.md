# Traduz Mat — Security and privacy

## Secrets

- `LLM_API_KEY` and related `LLM_*` variables are **backend-only**.
- Never expose provider keys via frontend env vars (`VITE_*`) or API responses.
- Never commit `.env`; use `.env.example` as the contract.

## Data handling

- Translation requests pass through the backend to the LLM provider for the duration of the request.
- **History** (v1): stored only in the user’s browser (`localStorage`); never uploaded to the Traduz API.
- **Logging:** do not log full user source text in production. In **local development**, logging full text is allowed for debugging; avoid enabling that behavior in deployed environments.

## CORS

Restrict `allow_origins` to known dev and deployment frontends; do not use `*` with credentials.
