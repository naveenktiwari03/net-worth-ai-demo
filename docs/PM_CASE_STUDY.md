# PM Case Study: Net Worth AI

## One-Line Summary

Net Worth AI is an AI-assisted intake layer that turns messy financial context
into structured, reviewable net worth records without making financial decisions
on the user's behalf.

## Why This Problem

Many net worth products work well for clean, connected data: bank accounts,
brokerage portfolios, and other structured financial feeds.

They are weaker at the assets people often remember imperfectly or document
inconsistently: property, private investments, gold, insurance value, informal
loans, PDFs, screenshots, and partial explanations.

The result is a dashboard that can look complete while missing important parts
of the user's financial life. This project focuses on the missing intake layer.

## User Journey

1. User describes an unclear asset or liability.
2. The assistant creates a structured draft.
3. The product shows confidence, missing fields, and assumptions.
4. User reviews, edits, confirms, or rejects the draft.
5. Confirmed items update the trusted ledger.
6. Net worth, uncertainty, and goal projections update from confirmed data.

## Product Decisions

- **Human confirmation over automation:** AI creates structured drafts, but user
  approval is required before the ledger updates. Financial tools fail when
  users do not trust what changed and why.
- **Confidence is part of the UX:** uncertain values are surfaced, not hidden.
  This makes the product safer and the ledger more trustworthy over time.
- **API-first architecture:** the same core workflow can power a consumer app
  and a B2B enrichment service. The product surface is intake, draft, review,
  confirmation.
- **Hard advice boundary:** the product helps structure records and show
  scenario math. It avoids framing that crosses into financial advice.

## Prioritization

### Must Have

- free-text intake for messy financial context
- structured draft output
- asset and liability classification
- confidence score
- missing-field detection
- human confirmation before ledger update
- net worth summary with uncertainty tracking

### Should Have

- edit-before-confirm workflow for every extracted field
- document upload and OCR
- audit history for every draft and confirmation
- validation rules for asset and liability types
- clearer rejected-draft state

### Later

- real structured AI extraction
- encrypted storage
- authentication and user-scoped data
- API keys for B2B customers
- tenant isolation
- planner or advisor collaboration
- enterprise accuracy reporting and model monitoring

## Metrics Framework

Activation:

- intake completion rate for messy assets
- review queue completion rate
- first confirmed ledger item

Quality:

- percentage of AI drafts confirmed without edits
- percentage of drafts edited before confirmation
- edit rate by field
- rejected draft rate
- missing-field resolution rate

Trust:

- low-confidence item resolution rate
- user confidence before and after intake
- number of AI assumptions shown and accepted
- number of cases where the product flags insufficient information

Retention:

- repeat use after first ledger update
- return visits to review uncertain assets
- goal planner interactions after ledger updates

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
  reliability, tenant isolation, developer experience, and accuracy reporting.
- Goal projections can make the product more useful, but the language must stay
  clearly on the side of scenario math rather than financial advice.

## What I Would Test Next

1. Give users five messy financial examples and measure draft review success.
2. Compare confidence labels, missing-field prompts, and edit flows.
3. Interview fintech teams about the value of an asset/liability intake API.
4. Add real document extraction and measure accuracy against user corrections.
5. Test whether a complete ledger increases engagement with goal planning.
6. Measure whether users understand the difference between scenario math and
   advice.

## What I Would Do Differently

- Add edit-before-confirm earlier so every extracted field can be corrected.
- Include an example of a rejected draft to show how the product handles
  uncertainty safely.
- Separate consumer and B2B roadmap assumptions more explicitly.
- Add API success metrics earlier, including latency, extraction quality, and
  correction rate by asset type.

## PM Skills Demonstrated

- AI product strategy
- Human-in-the-loop workflow design
- Fintech risk and safety thinking
- API platform positioning
- Metrics design for trust and quality
- Clear MVP boundaries and non-goals
