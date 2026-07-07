import { render } from "@react-email/render";
import * as postmark from "postmark";
import { createElement } from "react";
import { campaigns } from "../campaigns";
import {
  fetchClerkUsersCreatedBetween,
  type ClerkRecipient,
} from "../lib/clerk-presets";
import { loadCrmEnv } from "./env";
import type {
  SendSignupEmailsForWindowInput,
  SignupEmailRecipientResult,
  SignupEmailWindowResult,
} from "./shared";

const CAMPAIGN = "recent-signup-feedback" as const;
const DEFAULT_FROM = "Rebyte Team <founder@rebyte.ai>";
const DEFAULT_CONCURRENCY = 5;

function cleanRecipient(recipient: ClerkRecipient): ClerkRecipient | null {
  const email = String(recipient.email || "").trim();
  if (!email || !email.includes("@")) return null;

  return {
    ...recipient,
    email,
    name: String(recipient.name || "").trim(),
  };
}

function failureResult(
  recipient: ClerkRecipient,
  error: unknown
): SignupEmailRecipientResult {
  return {
    ...recipient,
    status: "failed",
    error: error instanceof Error ? error.message : String(error),
  };
}

export async function sendSignupEmailsForWindow(
  input: SendSignupEmailsForWindowInput
): Promise<SignupEmailWindowResult> {
  loadCrmEnv();

  const config = campaigns[CAMPAIGN];
  if (!config || config.channel !== "email") {
    throw new Error(`${CAMPAIGN} is not configured as an email campaign`);
  }

  const recipients = (
    await fetchClerkUsersCreatedBetween(input.windowStartMs, input.windowEndMs)
  )
    .map(cleanRecipient)
    .filter((recipient): recipient is ClerkRecipient => recipient !== null);

  const dryRun = Boolean(input.dryRun);
  const baseResult = {
    campaign: CAMPAIGN,
    windowStartMs: input.windowStartMs,
    windowEndMs: input.windowEndMs,
    recipients: recipients.length,
    dryRun,
  };

  if (dryRun) {
    const sampleRecipients: SignupEmailRecipientResult[] = recipients
      .slice(0, 10)
      .map((recipient) => ({ ...recipient, status: "dry_run" }));

    return {
      ...baseResult,
      sent: 0,
      failed: 0,
      messageIds: [],
      failures: [],
      sampleRecipients,
    };
  }

  const apiKey = process.env.POSTMARK_API_KEY;
  if (!apiKey) throw new Error("POSTMARK_API_KEY is required");

  const client = new postmark.ServerClient(apiKey);
  const concurrency = Math.max(
    1,
    Math.floor(input.concurrency || DEFAULT_CONCURRENCY)
  );
  const messageIds: string[] = [];
  const failures: SignupEmailRecipientResult[] = [];
  const sampleRecipients: SignupEmailRecipientResult[] = [];
  let sent = 0;

  for (let i = 0; i < recipients.length; i += concurrency) {
    const batch = recipients.slice(i, i + concurrency);
    const results = await Promise.allSettled(
      batch.map(async (recipient) => {
        const html = await render(createElement(config.component, recipient));
        return client.sendEmail({
          From: DEFAULT_FROM,
          To: recipient.email,
          Subject: config.subject,
          HtmlBody: html,
          MessageStream: "broadcast",
          Tag: CAMPAIGN,
          TrackOpens: true,
          TrackLinks: postmark.Models.LinkTrackingOptions.HtmlAndText,
          Metadata: {
            campaign: CAMPAIGN,
            workflow_id: input.workflowId,
            signup_window_start: new Date(input.windowStartMs).toISOString(),
            signup_window_end: new Date(input.windowEndMs).toISOString(),
            clerk_user_id: recipient.clerkUserId || "",
          },
        });
      })
    );

    results.forEach((result, index) => {
      const recipient = batch[index];
      if (
        result.status === "fulfilled" &&
        Number((result.value as any).ErrorCode ?? 0) === 0
      ) {
        const messageId = String((result.value as any).MessageID || "");
        if (messageId) messageIds.push(messageId);
        sent++;
        if (sampleRecipients.length < 10) {
          sampleRecipients.push({
            ...recipient,
            status: "sent",
            messageId,
          });
        }
        return;
      }

      const reason =
        result.status === "fulfilled"
          ? (result.value as any).Message || JSON.stringify(result.value)
          : result.reason;
      failures.push(failureResult(recipient, reason));
    });
  }

  return {
    ...baseResult,
    sent,
    failed: failures.length,
    messageIds,
    failures: failures.slice(0, 10),
    sampleRecipients,
  };
}
