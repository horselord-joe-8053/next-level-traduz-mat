# implement-feature

Implement an approved spec with strict TDD per `docs/TRADUZ-TDD.md`.

1. Read the spec and list vertical slices.
2. Propose test seams; wait for human confirmation.
3. For each slice: failing test → minimal code → run test → `./scripts/verify.sh` when appropriate.
4. Mock the LLM at the HTTP/client boundary in backend tests.
5. Run `./scripts/verify.sh` before COMPLETE; use evaluator or `/code-review` when valuable.
