# PM Case Study: Net Worth AI

## One-Line Summary

Net Worth AI turns messy financial context into structured, reviewable net
worth records.

## Why This Problem

Many net worth products work well for bank accounts and public-market
investments, but they miss assets that are common in real life: property,
private investments, gold, insurance value, informal loans, and partially
documented financial events.

The result is a dashboard that looks polished but is incomplete. This project
focuses on the missing intake workflow.

## User Journey

1. User describes an unclear asset or liability.
2. The assistant drafts a structured item.
3. The product shows confidence, missing fields, and assumptions.
4. User reviews, edits, or rejects the draft.
5. Confirmed items update the ledger.
6. Goal projections update based on user-controlled assumptions.

## Product Decisions

- **Draft, do not decide:** AI reduces blank-page friction, but the user
  confirms what becomes financial truth.
- **Show uncertainty:** confidence and missing fields are part of the user
  experience because hidden uncertainty damages trust.
- **Start with intake:** the hardest product problem is not another dashboard;
  it is turning messy financial memory into structured data.
- **Keep an API path open:** the same workflow could become a consumer feature
  or a B2B API for fintech platforms.

## Prioritization

### Must Have

- messy text intake
- structured draft output
- confidence score
- missing-field detection
- human confirmation before ledger update
- summary dashboard

### Should Have

- document upload and OCR
- audit history for every draft and confirmation
- edit-before-confirm workflow
- validation rules for asset and liability types

### Later

- real AI model integration
- encrypted storage
- authentication
- API keys for B2B customers
- planner or advisor collaboration
- enterprise accuracy reporting

## Metrics Framework

Activation:

- draft creation rate
- review queue completion rate
- first confirmed ledger item

Quality:

- confirmation without edit
- edit rate by field
- rejected draft rate
- missing-field completion rate

Trust:

- low-confidence item resolution
- user confidence before and after intake
- number of AI assumptions shown and accepted

Business Direction:

- consumer willingness to maintain a complete ledger
- fintech interest in an intake/classification API
- planner interest in pre-structured client data

## Tradeoffs

- A rule-based demo proves workflow before model quality, but does not validate
  real extraction performance.
- Requiring user confirmation slows automation, but protects trust in a
  sensitive financial context.
- An API-first direction expands B2B potential, but adds requirements around
  reliability, tenant isolation, and developer experience.

## What I Would Test Next

1. Give users five messy financial examples and measure draft review success.
2. Compare confidence labels, missing-field prompts, and edit flows.
3. Interview fintech teams about the value of an asset/liability intake API.
4. Add real document extraction and measure accuracy against user corrections.
5. Test whether a complete ledger increases engagement with goal planning.

## What I Would Do Differently

- Add edit-before-confirm earlier so every extracted field can be corrected.
- Include an example of a rejected draft to show how the product handles
  uncertainty safely.
- Separate consumer and B2B roadmap assumptions more explicitly.

## PM Skills Demonstrated

- AI product strategy
- Human-in-the-loop workflow design
- Fintech risk and safety thinking
- API platform positioning
- Metrics design for trust and quality
- Clear MVP boundaries and non-goals
