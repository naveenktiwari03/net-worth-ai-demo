# Product Brief: Net Worth AI

## Problem

People rarely have a clean, complete picture of net worth. Bank and brokerage
integrations cover common accounts, but many meaningful assets and liabilities
remain messy:

- private investments
- startup equity
- real estate
- gold and jewelry
- insurance cash value
- money lent or borrowed
- tax liabilities
- business ownership
- screenshots, PDFs, and transaction records

Users may know enough to remember an investment, but not enough to model it
cleanly.

The emotional problem is confidence. Users want to know whether their financial
picture is complete, but the hardest items are often the ones most likely to be
ignored.

## Target User

Initial user:

- financially active individual
- has some non-standard assets or liabilities
- wants a more complete net worth picture
- is willing to review AI-assisted drafts

Possible B2B customer:

- personal finance app
- wealth dashboard
- family office tool
- financial planning platform
- lending or underwriting platform that needs structured asset/liability intake

## Product Thesis

The valuable wedge is not another dashboard. The valuable wedge is:

```text
messy financial input -> structured draft -> review -> net worth ledger
```

This keeps the MVP focused on the moment where existing tools are weakest:
turning incomplete user context into something structured enough to review.

## Safety Model

AI is treated as an assistant, not a source of truth.

- AI can draft.
- AI can classify.
- AI can identify missing fields.
- AI can assign confidence.
- AI can indicate scenario math.
- Users confirm before data affects the ledger.

## MVP Scope

The current prototype focuses on:

- messy text intake
- structured draft creation
- confidence scoring
- missing-field detection
- human confirmation before ledger updates
- net worth summary and uncertainty tracking
- API-first workflow that can be reused outside the UI

## Non-Goals For This Demo

- real bank sync
- real investment advice
- real document storage
- production-grade security
- tax optimization
- portfolio recommendations

## Success Criteria

The demo succeeds if a user can:

1. describe an unclear financial instrument
2. get a plausible structured draft
3. understand what is uncertain
4. confirm or edit the item
5. see net worth update
6. understand how goal projection assumptions work

## Metrics

Activation:

- percentage of users who create an AI-assisted draft
- percentage of drafts that reach the review queue
- percentage of drafts confirmed into the ledger

Quality:

- draft confirmation rate without edits
- fields most commonly edited
- missing fields resolved before confirmation
- low-confidence items remaining after review

Retention:

- repeat ledger updates
- return visits to review uncertain assets
- goal planner interactions after ledger updates

Trust:

- user-reported confidence in the net worth estimate
- number of cases where the user rejects an AI draft
- number of cases where the product blocks or flags insufficient information

## Prioritization Rationale

The prototype prioritizes intake, review, and ledger confirmation because those
steps validate the central product risk: whether AI can help users convert messy
financial memory and documents into trustworthy structured records.

Bank sync, production security, and real AI model integration are intentionally
deferred because they are expensive execution layers. They matter later, but
they do not prove the core wedge by themselves.

## Risk And Safety Considerations

- AI may infer values incorrectly, so drafts must show confidence and missing
  fields.
- Users may mistake scenario math for advice, so the product needs clear advice
  boundaries.
- Financial data is sensitive, so production would require encryption,
  authentication, audit logs, and data deletion controls.
- B2B customers would need accuracy reporting, API reliability, tenant
  isolation, and compliance review.

## Product Takeaways

This project shows how I would approach an AI product in a sensitive domain:

- choose a narrow workflow where AI reduces friction
- keep the human responsible for confirmation
- make uncertainty visible
- define success around trust and structured outcomes, not just automation
