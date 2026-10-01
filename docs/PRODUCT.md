# Traduz Mat — Product

## Goal

A minimal web translator: user enters Brazilian Portuguese text and receives English translation, with optional local history and copy.

## Language pair

- Source: Brazilian Portuguese (PT-BR)
- Target: English

## v1 features (grilled)

| Feature | Decision |
|---------|----------|
| Translate | Max **10 000** characters (API validation + user-visible errors) |
| History | **localStorage** only; **20** successful translations, newest first; **no failures**; **Clear history** |
| Copy | Copy **current** English translation; button **disabled** until a success; brief **“Copied!”** (or error) feedback |
| Accounts / other pairs / mobile | Out of scope |

## Local development

- Default ports: API **8900**, Vite **5973** (overridable via env; see README / `scripts/dev.sh`).

## Logging (privacy)

- Do **not** log full user source text in production.
- Local **dev** may log full text for debugging (document in `docs/SECURITY.md`).

## Non-goals (v1)

- User accounts and server-side history
- Additional language pairs
- Native mobile apps
- Sending stored history to the backend

## Success

User can translate PT-BR to English, see errors clearly, optionally keep a bounded local history across refresh, and copy the current result—without exposing LLM credentials to the browser.
