import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { campaigns } from "../../../campaigns";
import * as postmark from "postmark";
import { createElement } from "react";
import { getDb } from "../../../lib/db";

export async function POST(req: Request) {
  const { campaign, from, subject, dryRun = true, email, groupId } =
    await req.json();

  const config = campaigns[campaign];
  if (!config) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  // Build recipients list
  let recipients: { email: string; name: string }[];
  if (email) {
    recipients = [{ email, name: "" }];
  } else if (groupId) {
    recipients = getDb()
      .prepare("SELECT email, name FROM members WHERE group_id = ?")
      .all(groupId) as { email: string; name: string }[];
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
  const concurrency = 5;
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i += concurrency) {
    const batch = recipients.slice(i, i + concurrency);
    const results = await Promise.allSettled(
      batch.map(async (recipient) => {
        const html = await render(
          createElement(config.component, recipient)
        );
        return client.sendEmail({
          From: from || "hello@rebyte.ai",
          To: recipient.email,
          Subject: subject || "Hello from Rebyte",
          HtmlBody: html,
          MessageStream: "broadcast",
        });
      })
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        sent++;
      } else {
        failed++;
      }
    }
  }

  return NextResponse.json({ sent, failed });
}
