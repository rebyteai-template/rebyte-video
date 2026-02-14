import { render } from "@react-email/render";
import { parse } from "csv-parse/sync";
import * as postmark from "postmark";
import * as fs from "fs";
import * as path from "path";

// --- CLI argument parsing ---

function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--") && i + 1 < argv.length) {
      args[arg.slice(2)] = argv[++i];
    }
  }
  return args;
}

const args = parseArgs(process.argv);

const templateName = args["template"];
const recipientsPath = args["recipients"];
const from = args["from"] || "hello@rebyte.ai";
const subject = args["subject"] || "Hello from Rebyte";
const dryRun = process.argv.includes("--dry-run");
const concurrency = parseInt(args["concurrency"] || "5", 10);

if (!templateName) {
  console.error("Usage: npx tsx send.ts --template <name> --recipients <file> [--from <addr>] [--subject <line>] [--dry-run] [--concurrency <n>]");
  process.exit(1);
}

if (!recipientsPath) {
  console.error("Error: --recipients is required");
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

// --- Send emails ---

async function main() {
  const Template = await loadTemplate(templateName);
  const recipients = loadRecipients(recipientsPath);

  console.log(`Template: ${templateName}`);
  console.log(`Recipients: ${recipients.length}`);
  console.log(`From: ${from}`);
  console.log(`Subject: ${subject}`);
  console.log(`Dry run: ${dryRun}`);
  console.log("---");

  // Filter to rows that have an email
  const validRecipients = recipients.filter((r) => r.email && r.email.includes("@"));
  console.log(`Valid recipients (with email): ${validRecipients.length}`);

  if (dryRun) {
    // In dry-run mode, render the first 3 and print
    const preview = validRecipients.slice(0, 3);
    for (const recipient of preview) {
      const html = await render(Template(recipient));
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
        const html = await render(Template(recipient));
        return client.sendEmail({
          From: from,
          To: recipient.email,
          Subject: subject,
          HtmlBody: html,
          MessageStream: "broadcast",
          TrackOpens: true,
          // @ts-ignore
          TrackLinks: "HtmlAndText",
        });
      })
    );

    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      const recipient = batch[j];
      if (result.status === "fulfilled") {
        sent++;
        console.log(`OK  ${recipient.email}`);
      } else {
        failed++;
        console.error(`FAIL ${recipient.email}: ${result.reason}`);
      }
    }
  }

  console.log(`\nDone. Sent: ${sent}, Failed: ${failed}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
