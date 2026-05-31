# Net Worth AI Demo

An API-first prototype for an AI-assisted net worth tracker.

This side project explores a product idea:

> Existing net worth tools are good at connected accounts, but weak at messy assets: private investments, gold, property documents, informal loans, insurance cash value, screenshots, PDFs, and incomplete user explanations.

Net Worth AI is a controlled demo of an assistant layer that turns messy financial context into reviewable net worth records.

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

## Next Milestones

1. Replace rule-based classification with real structured AI extraction.
2. Add PDF/image upload and OCR.
3. Add auth and user-scoped data.
4. Move storage to Postgres.
5. Add audit logs for every AI draft and user confirmation.
6. Add API keys and tenant isolation for B2B customers.
7. Add tests for net worth calculations and goal projections.

