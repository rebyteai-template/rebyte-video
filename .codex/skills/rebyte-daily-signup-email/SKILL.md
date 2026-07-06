---
name: rebyte-daily-signup-email
description: Use this skill for Rebyte CRM daily signup email routines, including sending the recent-signup-feedback campaign to yesterday's new Clerk signups, backfilling recent signup cohorts such as the last 30 days, verifying Postmark delivery, and reporting sent/failed counts.
---

# Rebyte Daily Signup Email

## Purpose

Send the `recent-signup-feedback` email from `crm/` to new Clerk signups without using the CRM UI.

Default daily routine: send to `registered_yesterday`, which means the previous local calendar day on the machine running the command.

## Workflow

1. Work from the repo root, then use `crm/` for commands.
2. Verify secrets and Postmark server:

```bash
cd crm
pnpm postmark:check
```

Expected token fingerprint: `a7675cf0f2d6`, server `ReByte Dev`, delivery type `Live`.

3. Dry-run the target cohort:

```bash
pnpm send --campaign recent-signup-feedback --clerk-preset registered_yesterday --dry-run
```

For backfills, replace the preset with `registered_last_30_days`.

4. If the dry-run count looks plausible, send:

```bash
pnpm send --campaign recent-signup-feedback --clerk-preset registered_yesterday --concurrency 5
```

For backfills:

```bash
pnpm send --campaign recent-signup-feedback --clerk-preset registered_last_30_days --concurrency 5
```

5. Save the command output in the conversation or a temp file while running so the final report can include `Sent`, `Failed`, and any failure samples.
6. If at least one message was sent, pick one returned `MessageID` and verify it:

```bash
pnpm postmark:check --message-id <message-id>
```

## Reporting

Report these fields to the user:

- Preset used
- Dry-run recipient count
- Sent count
- Failed count
- Delivery status for the sampled MessageID
- Any failures or skipped conditions

## Guardrails

- Do not use the CRM UI for this routine.
- Do not commit or print plaintext tokens.
- Do not send if `pnpm postmark:check` points to any token other than the valid CRM marketing token unless the user explicitly approves.
- Do not re-send the same preset after a successful send unless the user explicitly asks for a duplicate/backfill.
