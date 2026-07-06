import { render } from "@react-email/render";
import { parse } from "csv-parse/sync";
import * as postmark from "postmark";
import * as fs from "fs";
import * as path from "path";
import { createElement } from "react";
import { campaigns } from "./campaigns";
import { fetchClerkUsersForPreset } from "./lib/clerk-presets";

try {
  if (!process.env.POSTMARK_API_KEY || !process.env.CLERK_SECRET_KEY) {
    process.loadEnvFile?.(path.resolve(process.cwd(), ".env.local"));
  }
} catch (error: any) {
  if (error?.code !== "ENOENT") throw error;
}

// --- CLI argument parsing ---

function parseArgs(argv: string[]) {
  const args: Record<string, string | boolean> = {};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;

    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

const args = parseArgs(process.argv);

function stringArg(name: string) {
  const value = args[name];
  return typeof value === "string" ? value : undefined;
}

const campaignNameArg = stringArg("campaign") || stringArg("template");
const recipientsPath = stringArg("recipients");
const clerkPreset = stringArg("clerk-preset");
const singleEmail = stringArg("to") || stringArg("email");
const singleName = stringArg("name") || "";
const from = stringArg("from") || "Rebyte Team <founder@rebyte.ai>";
const subjectOverride = stringArg("subject");
const messageStream =
  stringArg("message-stream") || (singleEmail ? "outbound" : "broadcast");
const dryRun = Boolean(args["dry-run"]);
const concurrency = parseInt(stringArg("concurrency") || "5", 10);

if (!campaignNameArg) {
  console.error(
    "Usage: pnpm send --campaign <name> (--to <email> [--name <name>] | --recipients <file> | --clerk-preset <preset>) [--from <addr>] [--subject <line>] [--dry-run] [--concurrency <n>]"
  );
  process.exit(1);
}

const campaignName = campaignNameArg;

const recipientSourceCount = [recipientsPath, singleEmail, clerkPreset].filter(
  Boolean
).length;

if (recipientSourceCount === 0) {
  console.error(
    "Error: provide --to <email>, --recipients <file>, or --clerk-preset <preset>"
  );
  process.exit(1);
}

if (recipientSourceCount > 1) {
  console.error(
    "Error: use only one recipient source: --to, --recipients, or --clerk-preset"
  );
  process.exit(1);
}

// --- Load template ---

async function loadTemplate(name: string) {
  const templatePath = path.resolve(__dirname, "campaigns", name, "template.tsx");
  if (!fs.existsSync(templatePath)) {
    console.error(`Template not found: ${templatePath}`);
    process.exit(1);
  }
  const mod = await import(templatePath);
  return mod.default;
}

async function resolveCampaign(name: string) {
  const config = campaigns[name];
  if (config) {
    if (config.channel !== "email") {
      console.error(`Campaign is not an email campaign: ${name}`);
      process.exit(1);
    }

    return {
      component: config.component,
      subject: subjectOverride || config.subject,
    };
  }

  return {
    component: await loadTemplate(name),
    subject: subjectOverride || "Hello from Rebyte",
  };
}

// --- Load recipients ---

function loadRecipients(filePath: string): Record<string, string>[] {
  const absPath = path.resolve(filePath);
  const content = fs.readFileSync(absPath, "utf-8");

  if (filePath.endsWith(".json")) {
    return JSON.parse(content);
  }

  // CSV
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
}

async function getRecipients() {
  if (singleEmail) {
    return [{ email: singleEmail, name: singleName }];
  }

  if (clerkPreset) {
    console.log(`Loading Clerk preset: ${clerkPreset}`);
    return fetchClerkUsersForPreset(clerkPreset);
  }

  return loadRecipients(recipientsPath as string);
}

// --- Send emails ---

async function main() {
  const { component: Template, subject } = await resolveCampaign(campaignName);
  const recipients = await getRecipients();

  console.log(`Campaign: ${campaignName}`);
  console.log(`Recipients: ${recipients.length}`);
  console.log(`From: ${from}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message stream: ${messageStream}`);
  console.log(`Dry run: ${dryRun}`);
  console.log("---");

  // Filter to rows that have an email
  const validRecipients = recipients
    .map((r) => ({
      ...r,
      email: String(r.email || "").trim(),
      name: String(r.name || "").trim(),
    }))
    .filter((r) => r.email && r.email.includes("@"));
  console.log(`Valid recipients (with email): ${validRecipients.length}`);

  if (dryRun) {
    // In dry-run mode, render the first 3 and print
    const preview = validRecipients.slice(0, 3);
    for (const recipient of preview) {
      const html = await render(createElement(Template, recipient));
      console.log(`\n--- Preview for ${recipient.email} ---`);
      console.log(html.slice(0, 500) + (html.length > 500 ? "\n... (truncated)" : ""));
    }
    console.log(`\nDry run complete. ${validRecipients.length} emails would be sent.`);
    return;
  }

  // Actual send
  const apiKey = process.env.POSTMARK_API_KEY;
  if (!apiKey) {
    console.error("Error: POSTMARK_API_KEY environment variable is required");
    process.exit(1);
  }

  const client = new postmark.ServerClient(apiKey);

  let sent = 0;
  let failed = 0;

  // Process in batches for concurrency control
  for (let i = 0; i < validRecipients.length; i += concurrency) {
    const batch = validRecipients.slice(i, i + concurrency);
    const results = await Promise.allSettled(
      batch.map(async (recipient) => {
        const html = await render(createElement(Template, recipient));
        return client.sendEmail({
          From: from,
          To: recipient.email,
          Subject: subject,
          HtmlBody: html,
          MessageStream: messageStream,
          TrackOpens: true,
          // @ts-ignore
          TrackLinks: "HtmlAndText",
        });
      })
    );

    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      const recipient = batch[j];
      if (
        result.status === "fulfilled" &&
        Number((result.value as any).ErrorCode ?? 0) === 0
      ) {
        sent++;
        const response: any = result.value;
        console.log(
          `OK  ${recipient.email} ${response.MessageID ? `MessageID=${response.MessageID}` : ""}`.trim()
        );
      } else {
        failed++;
        const reason =
          result.status === "fulfilled"
            ? (result.value as any).Message || JSON.stringify(result.value)
            : result.reason;
        console.error(`FAIL ${recipient.email}: ${reason}`);
      }
    }
  }

  console.log(`\nDone. Sent: ${sent}, Failed: ${failed}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
