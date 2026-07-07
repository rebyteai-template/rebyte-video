# Postmark Tokens

Last verified: 2026-07-06 Asia/Shanghai.

Do not commit new plaintext Postmark tokens. Copy `.env.example` to
`.env.local`, keep runnable local secrets there, and verify the active token
through the Postmark API before a real send.

## Token Inventory

| Fingerprint | Status | Source | Postmark server | Use |
| --- | --- | --- | --- | --- |
| `a7675cf0f2d6` | valid | `crm/.env.local` `POSTMARK_API_KEY` | `ReByte Dev` / `18535173` | CRM marketing email sends |
| `10cebf83adc8` | valid | `cctools/relay/.env.production` `POSTMARK_EMAIL_CHANNEL_API_KEY`; AWS Secrets Manager `rebyte/prod/relay-inline-env` | `rebyte.computer` / `18575218` | Relay email channel, not the CRM marketing default |
| `6b2274a06dcd` | invalid | historical `POSTMARK_API_KEY` value previously documented in `CLAUDE.md` and mirrored in relay production env | n/a | Do not use |

## CLI Send

Set up local env:

```bash
cp .env.example .env.local
# Fill POSTMARK_API_KEY and, when dynamic Clerk groups are needed, CLERK_SECRET_KEY.
```

Verify the active token:

```bash
pnpm postmark:check
```

Dry run:

```bash
pnpm send --campaign recent-signup-feedback --to cj@rebyte.ai --name CJ --dry-run
```

Real send:

```bash
pnpm send --campaign recent-signup-feedback --to cj@rebyte.ai --name CJ
```

Send to recent Clerk signups:

```bash
pnpm send --campaign recent-signup-feedback --clerk-preset registered_last_30_days --dry-run
pnpm send --campaign recent-signup-feedback --clerk-preset registered_last_30_days --concurrency 5
```

Daily routine for the previous local calendar day:

```bash
pnpm send --campaign recent-signup-feedback --clerk-preset registered_yesterday --dry-run
pnpm send --campaign recent-signup-feedback --clerk-preset registered_yesterday --concurrency 5
```

The CLI defaults to `Rebyte Team <founder@rebyte.ai>` as the `From` header.
Override it with `--from "Name <address>"` when reviewing a different sender
identity.

For single-recipient review sends, `send.ts` uses the `outbound` message stream.
For file-based or Clerk preset sends, it uses `broadcast`.

## Validation

Verify the local CRM token points at the expected Postmark server:

```bash
pnpm postmark:check
```

After sending, verify delivery by message id:

```bash
pnpm postmark:check --message-id <message-id>
```

To inspect recent sends for a recipient:

```bash
pnpm postmark:check --recipient cj@rebyte.ai
```

Expected result for a good test send:

- `Status: Sent`
- `MessageEvents` contains `Delivered`
- Gmail destination returns an SMTP `250 OK`

## Temporal Hourly Signup Email

The Temporal workflow and worker live in `crm/temporal`. They send the same
`recent-signup-feedback` campaign to Clerk users who registered in the previous
hour.

Temporal connection config is env-driven. Put `TEMPORAL_ADDRESS`,
`TEMPORAL_NAMESPACE`, and `TEMPORAL_API_KEY` in `crm/.env.local`, or leave them
unset and the scripts will load the dev values from
`../cctools/relay/.env.local`.

Run a local worker:

```bash
pnpm temporal:worker
```

Run one previous-hour workflow for verification:

```bash
pnpm temporal:run-once --dry-run
```

Create or update the hourly schedule in the dev namespace:

```bash
pnpm temporal:schedule
```

The schedule runs at the top of every UTC hour and uses
`overlap: ALLOW_ALL`, so every hourly tick creates its own workflow execution
even if the local worker is offline. Those executions wait on the task queue
until a worker is polling. The workflow computes the non-overlapping
`[previousHourStart, scheduledTick)` window from its Temporal start time.
