# API Notes

This demo is API-first to make the assistant layer reusable.

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

## Demo Helpers

```http
POST /api/demo/seed
POST /api/demo/reset
```

These are for local demonstration only.

