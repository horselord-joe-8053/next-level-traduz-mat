<h1 id="ui-factory-title" style="color:#0d47a1;font-size:1.5em;font-weight:700;border-bottom:2px solid #90caf9;padding-bottom:0.25em;margin-top:0">UI factory convention (Traduz Mat)</h1>

Short harness rule: **when a feature touches the web UI, polish and accessibility are part of the factory**, not an optional afterthought.

## Document outline

1. [When this applies](#when-applies) — trigger.
2. [Lifecycle hooks](#lifecycle) — SPEC → TICKET → IMPLEMENT → VERIFY → EVALUATE.
3. [Design system](#design-system) — MASTER vs ui-ux-pro-max.
4. [Tickets](#tickets) — dedicated slice vs folded into vertical slices.

---

<h2 id="when-applies" style="color:#1565c0;font-size:1.22em;font-weight:650;border-left:4px solid #42a5f5;padding-left:10px;margin-top:1.1em">1. When this applies</h2>

- Any approved spec that includes **UI & layout** and **Accessibility** sections (`docs/templates/feature-spec.md`).
- Any change under **`frontend/src/**`** even if the spec is silent — agents should still run the IMPLEMENT UI step in `AGENTS.md` and avoid behavior drift.

Backend-only work skips UI polish.

---

<h2 id="lifecycle" style="color:#1565c0;font-size:1.22em;font-weight:650;border-left:4px solid #42a5f5;padding-left:10px;margin-top:1.1em">2. Lifecycle hooks</h2>

| Phase | UI factory action |
|-------|-------------------|
| **SPEC** | Fill UI & a11y sections; behavior ACs stay separate. |
| **TICKET** | Either fold UI+a11y into each frontend vertical slice, or add a **UI polish** ticket blocked by functional UI tickets (`/to-tickets`). |
| **IMPLEMENT** | If `frontend/src/**` changes: apply **ui-ux-pro-max** (or read `design-system/*/MASTER.md`); do not change product behavior unless the spec says so. |
| **VERIFY** | `./scripts/verify.sh` (required). |
| **EVALUATE** | `/code-review` Spec axis checks UI/a11y bullets when present. |

---

<h2 id="design-system" style="color:#1565c0;font-size:1.22em;font-weight:650;border-left:4px solid #42a5f5;padding-left:10px;margin-top:1.1em">3. Design system</h2>

- **Persisted:** `design-system/<project-slug>/MASTER.md` from ui-ux-pro-max `--persist` is the preferred source of colors, type, and checklist across sessions.
- **Ad hoc:** Run ui-ux-pro-max search at implement time when no MASTER exists; optional persist after human approval.
- **Stack:** Plain CSS in `frontend/src/styles.css` is the default; do not add Tailwind/shadcn unless a spec or ADR says so.

---

<h2 id="tickets" style="color:#1565c0;font-size:1.22em;font-weight:650;border-left:4px solid #42a5f5;padding-left:10px;margin-top:1.1em">4. Tickets</h2>

**Option A (default for small features):** Each tracer-bullet that touches the UI includes UI layout + a11y in its “done when”.

**Option B:** Functional tickets land first; a final **UI polish + a11y** ticket is **blocked by** all UI behavior tickets. Use when behavior and visual work are easier to review separately.

Both options must end with green `verify.sh` and unchanged behavior unless the spec changed it.
