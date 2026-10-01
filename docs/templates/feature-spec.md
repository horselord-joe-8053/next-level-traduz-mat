# Feature: [Name]

## Goal

## Constraints

## Acceptance criteria (behavior)

1.

## UI & layout

Use when the feature has a user-visible screen (or changes `frontend/src/**`).

- Layout / information hierarchy (where controls and feedback live)
- Responsive breakpoints if relevant (e.g. narrow vs wide)
- Design direction: cite `design-system/<project-slug>/MASTER.md` if it exists, or note that implement time uses **ui-ux-pro-max** (see `docs/specs/ui-factory-convention.md`)
- Explicit **out of scope** for UI: no marketing sections, extra routes, or restyling unrelated areas unless listed here

## Accessibility (a11y)

Required when the feature has a user-visible screen.

- Keyboard: focus order, visible `:focus-visible`, operable controls
- Names: labels / `aria-label` on inputs and icon-only buttons
- Feedback: errors (`role="alert"`), status (`role="status"`), live regions where appropriate
- Contrast and motion: meet stated targets; respect `prefers-reduced-motion` when adding animation

## Out of scope

## Test seams (proposed)

See `docs/TRADUZ-TDD.md`. UI changes still use Vitest + Testing Library at behavior seams; visual polish must not break existing roles, labels, or selectors tests rely on unless the spec updates them.
