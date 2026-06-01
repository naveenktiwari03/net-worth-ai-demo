# Net Worth AI Demo

People rarely have a clean, complete picture of their net worth. Bank and
brokerage accounts are easy to connect, but meaningful assets often live outside
clean integrations: private investments, gold, property documents, insurance
cash value, informal loans, screenshots, PDFs, and incomplete explanations.

Net Worth AI is a prototype for AI-assisted financial intake: a way to turn
messy financial context into structured, reviewable net worth records.

## Product Thesis

Existing net worth tools are good at connected accounts. They are weaker at the
assets and liabilities users remember imperfectly, document inconsistently, or
cannot easily sync.

The product explores:

```text
messy financial context -> structured draft -> user review -> trusted ledger
```

The bet: AI can reduce blank-page friction and help users structure incomplete
financial information, but the user must remain in control of what enters the
ledger.

## Product Principle

```text
AI drafts. Users confirm. The ledger remains the source of truth.
```

The assistant can:

- classify assets and liabilities
- extract or infer likely values from text
- assign confidence
- flag missing fields
- suggest neutral net worth goal levers

It does not silently update net worth, and it does not provide financial advice.

## Target Users

- Financially active individuals with non-standard assets or liabilities
- Users tracking property, gold, private investments, loans, and documents
- Fintech teams that need structured intake for asset and liability data
- Financial planners who want cleaner client-provided context before review

## Current Demo Experience

- Dashboard with estimated net worth, liabilities, and uncertain value
- Intake flow for messy financial descriptions
- AI-assisted draft creation with confidence and missing fields
- Review queue where users confirm drafts before ledger updates
- Ledger view for confirmed assets and liabilities
- Goal planner using assumptions and scenario math, not advice
- API section showing the reusable intake and confirmation workflow

## Product Decisions

- **Human confirmation over automation:** AI creates drafts, but user approval
  is required before the ledger changes.
- **Uncertainty is visible:** confidence scores and missing fields are surfaced
  instead of hidden. Trust depends on showing what the system does not know.
- **API-first by design:** the same intake engine could support a consumer net
  worth app or a B2B enrichment API for fintech platforms.
- **Advice boundary:** the product can structure records and show scenario math,
  but it avoids recommendations that would become financial advice.

## Success Metrics

If validated with users, I would track:

- Intake completion rate for messy assets
- Percentage of AI drafts confirmed without edits
- Percentage of drafts edited before confirmation
- Missing-field resolution rate
- Reduction in time to add a non-standard asset
- Number of low-confidence items left unresolved
- Repeat use after the first ledger update

## API Surface

```text
GET  /api/summary
GET  /api/items
GET  /api/goal
POST /api/intake/draft
POST /api/drafts/:id/confirm
POST /api/items/manual
POST /api/settings
POST /api/demo/seed
POST /api/demo/reset
```

## Key Risks And Open Questions

- AI may infer values incorrectly, so confidence and missing fields must be
  obvious.
- Users may mistake scenario math for advice, so boundaries need to be explicit.
- Financial data is sensitive and would require authentication, encryption,
  audit logs, and deletion controls before production launch.
- B2B customers would need accuracy reporting, API reliability, tenant
  isolation, and compliance review.

## Roadmap

1. Replace rule-based classification with real structured AI extraction.
2. Add PDF/image upload and OCR.
3. Add edit-before-confirm flow for every extracted field.
4. Add auth, user-scoped data, and encrypted storage.
5. Add audit logs for every AI draft and user confirmation.
6. Add API keys and tenant isolation for B2B customers.
7. Add tests for net worth calculations, draft quality, and goal projections.

## Tech Stack

- Node.js
- Express-style HTTP server
- Vanilla JavaScript
- HTML/CSS
- Local JSON data store for demo state

## Run Locally

```bash
npm run dev
```

Then open:

```text
http://127.0.0.1:3000
```

## Status

Prototype only. Not a production financial product. Use fake or demo data only.
This does not provide financial advice.

## Further Reading

- [docs/PRODUCT_BRIEF.md](docs/PRODUCT_BRIEF.md): problem framing, user
  research assumptions, and product strategy
- [docs/PM_CASE_STUDY.md](docs/PM_CASE_STUDY.md): decision log, tradeoffs, and
  what I would do differently
- [docs/API.md](docs/API.md): API-first product surface and endpoint notes
