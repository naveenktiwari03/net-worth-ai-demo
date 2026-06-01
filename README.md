# Net Worth AI Demo

An API-first product prototype for an AI-assisted net worth tracker.

This repo is positioned as a product management portfolio project. It shows how
I would frame a messy user problem, identify a focused wedge, define a safe MVP,
and think through metrics, risks, and product strategy for an AI-enabled
financial workflow.

The product idea:

> Existing net worth tools are good at connected accounts, but weak at messy assets: private investments, gold, property documents, informal loans, insurance cash value, screenshots, PDFs, and incomplete user explanations.

Net Worth AI is a controlled demo of an assistant layer that turns messy
financial context into reviewable net worth records.

## Product Thesis

Personal finance tools usually optimize for connected accounts. That leaves a
gap for users whose wealth includes assets that are hard to sync, hard to value,
or poorly documented.

Net Worth AI focuses on the intake layer:

```text
messy financial context -> structured draft -> user review -> trusted ledger
```

The product bet is that AI is most useful when it reduces blank-page friction,
but the user remains in control of financial truth.

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
- Users who track wealth across property, gold, private investments, loans, and
  documents
- Fintech teams that need structured intake for asset and liability data
- Financial planners who want cleaner client-provided context before review

## Demo Flow

1. Load the demo portfolio.
2. Review the pending startup investment draft.
3. Confirm the draft into the ledger.
4. Watch estimated net worth and uncertain value change.
5. Try the sample intake flow with another unclear investment.
6. Adjust the goal planner assumptions.

## Run Locally

```bash
node server.js
```

Then open:

```text
http://127.0.0.1:3000
```

If your machine has `npm` installed, this also works:

```bash
npm run dev
```

## What Works

- Local web app with dashboard, intake, review queue, ledger, goal planner, and API section
- Demo data seeding and reset
- AI-assisted draft creation from messy text
- Asset/liability classification
- Confidence scoring and missing-field detection
- User confirmation before net worth updates
- Estimated net worth, liabilities, low-confidence assets, and uncertainty tracking
- Goal projection with indications, not opinions
- API-first endpoints that could become a B2B extraction/classification service

## Product Decisions Shown

- **Human confirmation over automation:** AI creates drafts, but user approval
  is required before the ledger changes.
- **Confidence is part of the UX:** uncertain values are visible instead of
  hidden, which makes the product safer and more trustworthy.
- **API-first architecture:** the core workflow can support both a consumer app
  and a B2B enrichment service.
- **Advice boundary:** the product can help structure records and show scenario
  math, but avoids recommendations that would become financial advice.

## MVP Success Metrics

If this were tested with users, I would track:

- intake completion rate for messy assets
- percentage of AI drafts confirmed without edits
- percentage of drafts edited before confirmation
- missing-field resolution rate
- reduction in time to add a non-standard asset
- number of low-confidence items left unresolved
- repeat use after the first ledger update

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

Example intake payload:

```json
{
  "name": "Friend startup investment",
  "description": "I invested 2 lakh in my friend's startup in 2021. I do not know the current valuation.",
  "documentText": "NEFT transfer INR 200000 to ABC Ventures LLP",
  "currency": "INR"
}
```

## Current Limitations

This is intentionally a controlled demo, not a production financial app.

- No authentication
- No real AI model connected yet
- No document upload storage
- No database beyond local `data.json`
- No encryption
- No multi-user isolation
- No compliance review
- No real financial advice

Use fake/demo data only.

## Why This Is API-First

The same engine could power two product paths:

- A consumer net worth app for people tracking complete personal wealth
- A B2B API for existing fintech apps that need AI-assisted intake for hard-to-track assets and liabilities

The demo focuses on the hard part first: converting incomplete financial context into structured, reviewable records.

## Portfolio Notes

This project demonstrates:

- AI product thinking with explicit human-in-the-loop safeguards
- Problem selection around an underserved financial workflow
- API-first platform thinking
- MVP scoping and non-goal definition
- Metrics design for trust, quality, and user activation

See [docs/PRODUCT_BRIEF.md](docs/PRODUCT_BRIEF.md) and
[docs/PM_CASE_STUDY.md](docs/PM_CASE_STUDY.md) for the fuller product framing.

## Next Milestones

1. Replace rule-based classification with real structured AI extraction.
2. Add PDF/image upload and OCR.
3. Add auth and user-scoped data.
4. Move storage to Postgres.
5. Add audit logs for every AI draft and user confirmation.
6. Add API keys and tenant isolation for B2B customers.
7. Add tests for net worth calculations and goal projections.
