# Product Brief: Net Worth AI

## Problem

Most personal finance tools are built for clean, connected data. They handle
bank accounts and brokerage portfolios well. They struggle with the rest:

- private investments
- startup equity
- real estate and property documents
- gold and jewelry
- insurance cash value
- informal loans
- business ownership
- PDFs, screenshots, and incomplete user explanations

The result is that users may have a polished dashboard but an incomplete view of
their wealth.

The emotional problem is confidence. Users want to know whether their financial
picture is complete, but the hardest items are often the ones most likely to be
ignored.

## Target Users

Initial user:

- financially active individual with non-standard assets or liabilities
- currently tracks some wealth across spreadsheets, documents, and memory
- wants a more complete net worth picture
- is willing to review AI-assisted drafts before anything affects the ledger

Possible B2B customer:

- personal finance app
- wealth dashboard
- family office tool
- financial planning platform
- lending or underwriting platform that needs structured asset/liability intake

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

- classify assets and liabilities
- extract or infer likely values from text
- assign confidence scores
- flag missing fields
- suggest neutral net worth goal levers

It does not silently update net worth, and it does not provide financial advice.

## MVP Scope

The current prototype focuses on:

- free-text intake for messy financial context
- structured draft creation
- asset and liability classification
- confidence scoring
- missing-field detection
- human confirmation before ledger updates
- net worth summary and uncertainty tracking
- API-first endpoints that can support a future B2B extraction service

## Non-Goals For This Demo

- real bank sync
- real investment advice
- real document storage
- production-grade security
- tax optimization
- portfolio recommendations
- automated ledger updates without user review

## Success Criteria

The demo succeeds if a user can:

1. describe an unclear financial instrument
2. get a plausible structured draft
3. understand what is uncertain or missing
4. confirm or edit the item
5. see net worth and uncertain value update
6. understand that goal projection is scenario math, not advice

## Metrics

Activation:

- intake completion rate for messy assets
- percentage of drafts that reach the review queue
- first confirmed ledger item

Quality:

- percentage of AI drafts confirmed without edits
- percentage of drafts edited before confirmation
- fields most commonly edited
- missing-field resolution rate

Trust:

- number of low-confidence items left unresolved
- number of rejected drafts
- user-reported confidence before and after intake
- number of cases where the product blocks or flags insufficient information

Retention:

- repeat use after first ledger update
- return visits to review uncertain assets
- goal planner interactions after ledger updates

## API-First Rationale

The intake workflow is valuable beyond a single consumer app. The same core
engine could power:

- a net worth tracker for individuals
- a structured intake API for fintech platforms
- a pre-review workflow for financial planners
- an enrichment layer for lending or underwriting tools

The demo focuses on the harder problem first: turning incomplete context into
structured, reviewable records.

## Risk And Safety Considerations

- AI may infer values incorrectly, so drafts must show confidence and missing
  fields.
- Users may mistake scenario math for advice, so the product needs a hard advice
  boundary.
- Financial data is sensitive, so production would require encryption,
  authentication, audit logs, deletion controls, and compliance review.
- B2B customers would need accuracy reporting, API reliability, tenant
  isolation, and model monitoring.

## Product Takeaways

This project approaches AI in a sensitive domain by:

- choosing a narrow workflow where AI reduces friction
- keeping the human responsible for confirmation
- making uncertainty visible
- defining success around trust and structured outcomes, not just automation
