# Net Worth AI

Most personal finance tools are built for clean, connected data. They handle
bank accounts and brokerage portfolios well. They struggle with the rest:
private investments, gold, property documents, informal loans, insurance cash
value, PDFs, and incomplete user explanations.

Net Worth AI is a prototype for an AI-assisted intake layer that turns messy
financial context into reviewable, structured net worth records without making
financial decisions on the user's behalf.

## Product Thesis

Personal wealth increasingly lives outside connected accounts. Yet most tools
assume structured inputs.

The gap is the intake layer:

```text
messy financial context -> structured draft -> user review -> trusted ledger
```

The bet: AI is most useful when it reduces blank-page friction for hard-to-track
assets. But users should stay in control of financial truth.

## Core Product Principle

```text
AI drafts. Users confirm. The ledger remains the source of truth.
```

The assistant can:

- Classify assets and liabilities
- Extract or infer likely values from text
- Assign confidence scores
- Flag missing fields
- Suggest neutral net worth goal levers

It does not silently update net worth, and it does not provide financial advice.

## Target Users

- Financially active individuals with non-standard assets: property, gold,
  private investments, informal loans
- Users who currently track wealth across spreadsheets, documents, and memory
- Fintech teams that need structured intake for hard-to-sync asset data
- Financial planners who want cleaner client-provided context before review

## Demo Flow

1. Load the demo portfolio
2. Review the pending startup investment draft
3. Confirm the draft into the ledger
4. Watch estimated net worth and uncertain value update
5. Try the sample intake flow with another unclear investment
6. Adjust goal planner assumptions

## Run Locally

```bash
node server.js
```

Then open: `http://127.0.0.1:3000`

Or with npm:

```bash
npm run dev
```

## What Works

- Local web app with dashboard, intake queue, review flow, ledger, goal planner,
  and API section
- Demo data seeding and reset
- AI-assisted draft creation from free-text financial context
- Asset and liability classification
- Confidence scoring and missing-field detection
- User confirmation required before any ledger change
- Estimated net worth, liabilities, low-confidence assets, and uncertainty
  tracking
- Goal projection with scenario indicators, not opinions
- API-first endpoints designed to also support a B2B extraction service

## Product Decisions

**Human confirmation over automation** - AI creates structured drafts, but user
approval is required before the ledger updates. This is intentional: financial
tools fail when users do not trust what changed and why.

**Confidence is part of the UX** - uncertain values are surfaced, not hidden.
This makes the product safer and the ledger more trustworthy over time.

**API-first architecture** - the same core workflow can power a consumer app and
a B2B enrichment service. The demo focuses on the harder problem first: turning
incomplete context into structured, reviewable records.

**Hard advice boundary** - the product helps structure records and show scenario
math. It avoids any framing that crosses into financial advice.

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

## Success Metrics

If tested with users, I would track:

- Intake completion rate for messy assets
- Percentage of AI drafts confirmed without edits
- Percentage of drafts edited before confirmation
- Missing-field resolution rate
- Reduction in time to add a non-standard asset
- Number of low-confidence items left unresolved
- Repeat use after first ledger update

## Current Limitations

This is an intentionally controlled demo, not a production financial app.

- No authentication or multi-user isolation
- No real AI model connected (rule-based classification)
- No document upload storage
- No database beyond local `data.json`
- No encryption or compliance review

Use fake/demo data only.

## Roadmap

1. Replace rule-based classification with real structured AI extraction
2. Add PDF/image upload and OCR
3. Add authentication and user-scoped data
4. Move storage to Postgres
5. Add audit logs for every AI draft and user confirmation
6. Add API keys and tenant isolation for B2B customers
7. Add tests for net worth calculations and goal projections

## Further Reading

- [docs/PRODUCT_BRIEF.md](docs/PRODUCT_BRIEF.md): problem framing, user research
  assumptions, and product strategy
- [docs/PM_CASE_STUDY.md](docs/PM_CASE_STUDY.md): decision log, tradeoffs, and
  what I would do differently
