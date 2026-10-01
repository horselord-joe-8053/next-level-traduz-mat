# Traduz domain terms

Agreed during `/grill-with-docs` (Traduz Mat v1). Use in specs, tests, and UI copy.

| Term | Definition |
|------|------------|
| **Source text** | User-entered Brazilian Portuguese (PT-BR) submitted for translation. |
| **Translation** | English output returned for one successful `POST /translate`. |
| **Successful translation** | API returned 200 with a `translation` field; shown in the UI. |
| **Current translation** | The English result from the most recent successful submit still displayed in the main translation area. |
| **Translation history** | Browser-local list of past **successful** translations only; not sent to the backend. |
| **History entry** | Pair of source text + translation stored in history. |
| **Clear history** | User action that removes all history entries from browser storage. |
| **Copy translation** | User action that copies the **current translation** to the system clipboard. |
