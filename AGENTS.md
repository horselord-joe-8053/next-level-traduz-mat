# Traduz Mat Agent Guide

Traduz Mat is a small Brazilian Portuguese → English translation web app (`frontend/` React + TypeScript, `backend/` FastAPI). Domain vocabulary: `GLOSSARY.md`.

## Sources of truth

- Product: `docs/PRODUCT.md`
- Architecture: `docs/ARCHITECTURE.md`
- Security/privacy: `docs/SECURITY.md`
- TDD policy: `docs/TRADUZ-TDD.md`
- UI factory (when specs touch the web UI): `docs/specs/ui-factory-convention.md`
- Artifact templates: `docs/templates/`
- Approved feature specs: `docs/specs/`
- Durable plans: `docs/plans/`

## Feature-development lifecycle

For a non-trivial feature or behavior change:

**SPEC → PLAN → IMPLEMENT → VERIFY → EVALUATE → COMPLETE**

Proceed autonomously unless human judgment is required.

- **SPEC:** use the `specify-feature` skill (or Matt `/grill-with-docs` + `/to-spec` when configured). User-visible features include **UI & layout** and **a11y** sections per `docs/templates/feature-spec.md`.
- **PLAN:** inspect the repository; persist a plan under `docs/plans/` only when complexity warrants it.
- **TICKETS (Matt):** `/to-tickets` may add a **UI polish** slice blocked by functional UI tickets, or fold UI+a11y into each vertical slice that touches `frontend/src/**` (see `docs/specs/ui-factory-convention.md`).
- **IMPLEMENT:** use the `implement-feature` skill (strict TDD per `docs/TRADUZ-TDD.md`). If the change touches **`frontend/src/**`**, apply **ui-ux-pro-max** (`.agents/skills/ui-ux-pro-max/SKILL.md`) or read **`design-system/*/MASTER.md`** when it exists; do not change product behavior unless the approved spec says so.
- **VERIFY:** run `./scripts/verify.sh`; do not treat the change as ready while it fails. Do not require `./scripts/dev.sh` for VERIFY.
- **EVALUATE:** independently compare the result with the approved spec (evaluator subagent or `/code-review` when valuable).
- **COMPLETE:** only after required verification and evaluation pass.

If VERIFY fails, repair and rerun VERIFY.

## Human escalation

Ask before proceeding when there is a material unresolved product, architecture, security/privacy, destructive, or irreversible decision.

Confirm **test seams** with the human before writing tests when implementing (see `docs/TRADUZ-TDD.md`).

## Core invariants

- Browser never receives the LLM provider API key.
- Frontend never calls the LLM provider directly; only the Traduz API.
- Source language: Brazilian Portuguese. Target: English (unless product scope is intentionally changed).
- Server-side persistence of user translations requires an approved spec.

## Local development (humans)

- Interactive UI: `./scripts/dev.sh` (README). Repo plumbing, not a feature spec.
- Agents may start dev servers when the user asks to exercise the UI manually.

## Skills

Project skills live under `.agents/skills/`:

- **Harness (v5):** `specify-feature`, `implement-feature`, `debug`
- **Matt Pocock (Matt track):** `tdd`, `grill-with-docs`, `to-spec`, `to-tickets`, `implement`, `implement-spec`, `code-review`, `setup-matt-pocock-skills`, etc.

Install Matt skills **in this repo** (`cd projects/traduz_mat && npx skills add mattpocock/skills`). Run **`/setup-matt-pocock-skills`** once before relying on GitHub issue integration.

- **UI/UX Pro Max:** `ui-ux-pro-max` (+ related `ui-styling`, `design-system`) under `.agents/skills/`. Installed via `uipro init --ai universal`. Use for visual polish and a11y checklists; still run **`/tdd`** and **`./scripts/verify.sh`** for behavior.
