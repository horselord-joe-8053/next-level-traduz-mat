# Traduz Mat — TDD policy

## Loop

1. Map acceptance criteria to **vertical slices** (smallest user-visible behavior).
2. **Confirm test seams** with the human before writing tests.
3. **Red:** one failing test at one seam.
4. **Green:** minimal code; run the test, then `./scripts/verify.sh`.
5. Repeat; refactor during review/evaluate, not inside the red → green loop.

## Default seams

| Seam | Tool | Test behavior |
|------|------|----------------|
| HTTP API | pytest + `TestClient` | `GET /health`; `POST /translate` success, validation, length limit |
| LLM provider | Mock HTTP/client boundary | Fixed fake response; no live API in unit tests |
| React UI | Vitest + Testing Library | Submit shows translation or error |
| Browser persistence | Vitest (mock `localStorage`) or E2E | Only when spec requires history |

## Avoid

- Horizontal slicing (all tests, then all code).
- Testing private helpers instead of public behavior.
- Live LLM calls in CI.

## Matt `/tdd` skill

When using [mattpocock/skills `/tdd`](https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/SKILL.md), this file is the Traduz-specific seam reference; the skill is the procedure.
