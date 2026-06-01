# API Notes

Net Worth AI is API-first because the assistant layer should be reusable beyond
the demo UI.

The product surface is intentionally simple:

```text
messy input -> draft -> review -> confirmed ledger item
```

This makes the same workflow useful for a consumer net worth app, a fintech
dashboard, or a B2B asset/liability intake service.

## Create Intake Draft

```http
POST /api/intake/draft
```

```json
{
  "name": "SAFE note in demo startup",
  "description": "I invested 3 lakh in a startup through a SAFE note in 2022.",
  "documentText": "Bank transfer INR 300000 to Nova AI Labs Pvt Ltd. Purpose: SAFE investment subscription.",
  "currency": "INR"
}
```

Returns a draft with:

- type
- category
- suggested value
- confidence
- missing fields
- review notes

Product intent: reduce blank-page friction without silently changing the
ledger.

## Confirm Draft

```http
POST /api/drafts/:id/confirm
```

```json
{
  "name": "SAFE note in demo startup",
  "currentValue": 300000
}
```

Moves a draft into confirmed ledger items.

Product intent: keep the human responsible for financial truth.

## Summary

```http
GET /api/summary
```

Returns:

- total assets
- total liabilities
- estimated net worth
- confirmed net worth
- low-confidence assets
- uncertain value
- pending draft count

Product intent: make uncertainty visible, not hidden inside a single net worth
number.

## Demo Helpers

```http
POST /api/demo/seed
POST /api/demo/reset
```

These are for local demonstration only.
