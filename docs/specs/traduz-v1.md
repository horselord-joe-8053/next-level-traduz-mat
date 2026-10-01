# Feature: Traduz Mat v1

## Goal

Ship a minimal PT-BR → English translator with bounded browser-local history and copy-to-clipboard for the current result, on the existing React + FastAPI stack.

## Constraints

- LLM calls **server-side only**; browser calls Traduz API only.
- Language pair: **PT-BR → English** only.
- Max source length: **10 000** characters (enforce on backend; UI shows API validation errors).
- History: **`localStorage` only**, key **`traduz.translationHistory.v1`**, max **20** **successful** entries, **newest first**; **never** store failed attempts; **Clear history** control.
- Copy: **current translation** only; control **disabled** when there is no successful current translation; use injectable clipboard seam for tests.
- Dev defaults: API **8900**, frontend **5973** (`TRADUZ_BACKEND_PORT`, `TRADUZ_FRONTEND_PORT`, `VITE_API_BASE_URL`, CORS aligned).
- Logging: no full source text in production logs; dev logging of full text permitted per `docs/SECURITY.md`.
- Non-goals: accounts, server-side history DB, other language pairs, mobile apps.

## Acceptance criteria

### Translate (baseline alignment)

1. **AC-T1:** `GET /health` returns `{ "status": "ok" }`.
2. **AC-T2:** `POST /translate` with valid PT-BR text returns `{ "translation": "<english>" }` when the LLM client succeeds (mocked in tests).
3. **AC-T3:** Empty or whitespace-only source returns **422** with a clear error.
4. **AC-T4:** Source longer than **10 000** characters returns **422** with a clear error.
5. **AC-T5:** UI: user submits text and sees English translation on success or an error message on failure (fetch to Traduz API only).
6. **AC-T6:** `./scripts/verify.sh` passes; CI runs the same script.

### Persistent history

7. **AC-H1:** After a successful translation, an entry (source + translation) appears in a **History** section.
8. **AC-H2:** Refreshing the page leaves history intact (same browser profile).
9. **AC-H3:** After **20** successful translations, adding another evicts the **oldest** entry (newest-first display).
10. **AC-H4:** Failed submits do **not** add or retain history entries for that attempt.
11. **AC-H5:** **Clear history** removes all entries and persists after refresh.
12. **AC-H6:** History is not sent to the backend (no new history API in v1).

### Copy translation

13. **AC-C1:** **Copy translation** control is **disabled** until a successful translation is shown.
14. **AC-C2:** On click, the **current** English translation is written to the clipboard (via clipboard seam in production).
15. **AC-C3:** User sees brief success feedback (e.g. “Copied!”) or an error if copy fails.

## Out of scope

- Copy from individual history rows
- Server-side history or analytics pipeline
- User authentication
- E2E Playwright suite (optional follow-up; unit/UI tests required at seams)

## Test seams (proposed)

| Area | Seam | Notes |
|------|------|--------|
| API | pytest + `TestClient` | health, translate success/validation/10k limit; mock translator |
| LLM | HTTP/client mock | No live LLM in CI |
| UI translate | Vitest + RTL | submit success/error |
| History | Vitest + mock `localStorage` | cap, refresh simulation, clear, no failures |
| Copy | Vitest + clipboard seam module | disabled state; spy seam in App tests |

Confirm seams with implementer before writing tests (`docs/TRADUZ-TDD.md`).
