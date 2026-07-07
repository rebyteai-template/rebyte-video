import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { campaigns } from "../../../campaigns";
import * as postmark from "postmark";
import { createElement } from "react";
import { getDb, ensureTables } from "../../../lib/db";
import { isAllUsersGroup, rebuildAllUsersGroup } from "../../../lib/all-users";

const EMAIL_BATCH_SIZE = 100;

function summarizeError(error: unknown) {
  if (!error || typeof error !== "object") return String(error);
  const e = error as any;
  return {
    name: e.name,
    message: e.message,
    code: e.code,
    statusCode: e.statusCode,
    errorCode: e.ErrorCode,
    responseBody: e.response?.body,
  };
}

export async function POST(req: Request) {
  await ensureTables();
  const { campaign, from, subject, dryRun = true, email, phone, groupId } =
    await req.json();
  const requestId = `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  const config = campaigns[campaign];
  if (!config) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const isSms = config.channel === "sms";
  const db = getDb();
  let groupName = "";

  console.info("[send]", requestId, "start", {
    campaign,
    channel: config.channel,
    dryRun,
    groupId,
    singleRecipient: Boolean(email || phone),
  });

  // Build recipients list
  if (isSms) {
    let recipients: { phone: string; name: string }[];
    if (phone) {
      recipients = [{ phone, name: "" }];
    } else if (groupId) {
      const result = await db.execute({
        sql: "SELECT phone, name FROM members WHERE group_id = ?",
        args: [groupId]
      });
      recipients = result.rows as unknown as { phone: string; name: string }[];
      if (recipients.length === 0) {
        return NextResponse.json(
          { error: "Group has no members" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Provide phone or groupId" },
        { status: 400 }
      );
    }

    if (dryRun) {
      const previews = recipients.slice(0, 3).map((r) => ({
        phone: r.phone,
        name: r.name || "",
        message: config.message.replace("{name}", r.name || "there"),
      }));
      return NextResponse.json({
        dryRun: true,
        total: recipients.length,
        previews,
      });
    }

    // Real SMS send — stubbed
    return NextResponse.json(
      { error: "SMS sending not yet configured" },
      { status: 501 }
    );
  }

  // Email campaign path
  let recipients: { email: string; name: string }[];
  if (email) {
    recipients = [{ email, name: "" }];
  } else if (groupId) {
    const groupResult = await db.execute({
      sql: "SELECT id, name, channel FROM groups WHERE id = ?",
      args: [groupId],
    });
    const group = groupResult.rows[0] as any;
    groupName = group?.name ?? "";
    if (group && isAllUsersGroup(group)) {
      console.info("[send]", requestId, "rebuild all-users before send");
      await rebuildAllUsersGroup(db, { refreshClerk: true });
    }

    const result = await db.execute({
      sql: "SELECT email, name FROM members WHERE group_id = ?",
      args: [groupId]
    });
    recipients = result.rows as unknown as { email: string; name: string }[];
    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "Group has no members" },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json(
      { error: "Provide email or groupId" },
      { status: 400 }
    );
  }

  if (dryRun) {
    console.info("[send]", requestId, "dry-run recipients", {
      groupId,
      groupName,
      total: recipients.length,
    });
    const previews = recipients.slice(0, 3).map((r) => ({
      email: r.email,
      name: r.name || "",
    }));
    return NextResponse.json({
      dryRun: true,
      total: recipients.length,
      previews,
    });
  }

  // Real send
  const apiKey = process.env.POSTMARK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "POSTMARK_API_KEY not configured" },
      { status: 500 }
    );
  }

  const client = new postmark.ServerClient(apiKey);
  let sent = 0;
  let failed = 0;
  const failureSamples: unknown[] = [];

  console.info("[send]", requestId, "real-send recipients", {
    groupId,
    groupName,
    total: recipients.length,
    batchSize: EMAIL_BATCH_SIZE,
  });

  for (let i = 0; i < recipients.length; i += EMAIL_BATCH_SIZE) {
    const batchNumber = Math.floor(i / EMAIL_BATCH_SIZE) + 1;
    const batch = recipients.slice(i, i + EMAIL_BATCH_SIZE);
    const batchStart = Date.now();
    console.info("[send]", requestId, "batch start", {
      batch: batchNumber,
      offset: i,
      size: batch.length,
      first: batch[0]?.email,
      last: batch[batch.length - 1]?.email,
    });

    try {
      const messages = await Promise.all(
        batch.map(async (recipient) => {
          const html = await render(createElement(config.component, recipient));
          return {
            From: from || "founder@rebyte.ai",
            To: recipient.email,
            Subject: subject || "Hello from Rebyte",
            HtmlBody: html,
            MessageStream: "broadcast",
            TrackOpens: true,
            TrackLinks: "HtmlAndText" as any,
          };
        })
      );

      const responses = await client.sendEmailBatch(messages);
      const failures = responses.filter((r: any) => r.ErrorCode !== 0);
      const successes = responses.length - failures.length;
      sent += successes;
      failed += failures.length;
      failureSamples.push(
        ...failures.slice(0, Math.max(0, 20 - failureSamples.length)).map((r: any) => ({
          to: r.To,
          errorCode: r.ErrorCode,
          message: r.Message,
        }))
      );

      console.info("[send]", requestId, "batch done", {
        batch: batchNumber,
        successes,
        failures: failures.length,
        sent,
        failed,
        ms: Date.now() - batchStart,
        failureSamples: failures.slice(0, 5).map((r: any) => ({
          to: r.To,
          errorCode: r.ErrorCode,
          message: r.Message,
        })),
      });
    } catch (error) {
      failed += batch.length;
      if (failureSamples.length < 20) {
        failureSamples.push({
          batch: batchNumber,
          error: summarizeError(error),
        });
      }
      console.error("[send]", requestId, "batch failed", {
        batch: batchNumber,
        size: batch.length,
        sent,
        failed,
        ms: Date.now() - batchStart,
        error: summarizeError(error),
      });
    }
  }

  console.info("[send]", requestId, "complete", {
    total: recipients.length,
    sent,
    failed,
  });

  return NextResponse.json({
    sent,
    failed,
    total: recipients.length,
    failureSamples,
  });
}
