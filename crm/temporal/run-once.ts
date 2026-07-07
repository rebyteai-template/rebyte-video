import { randomUUID } from "crypto";
import { getSignupEmailTaskQueue } from "./config";
import { getTemporalClient, getTemporalNamespace } from "./connection";
import { hourlySignupEmailWorkflow } from "./workflows";
import type { HourlySignupEmailInput } from "./shared";

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

function stringArg(args: Record<string, string | boolean>, name: string) {
  const value = args[name];
  return typeof value === "string" ? value : undefined;
}

async function main() {
  const args = parseArgs(process.argv);
  const taskQueue = stringArg(args, "task-queue") || getSignupEmailTaskQueue();
  const endArg = stringArg(args, "end");
  const workflowArgs: HourlySignupEmailInput = {
    dryRun: Boolean(args["dry-run"]),
  };

  if (endArg) {
    const endTime = new Date(endArg);
    if (Number.isNaN(endTime.getTime())) {
      throw new Error(`Invalid --end value: ${endArg}`);
    }
    workflowArgs.endTimeMs = endTime.getTime();
  }

  const client = await getTemporalClient();
  const namespace = getTemporalNamespace();
  const workflowId = `rebyte-crm-hourly-signup-email-manual-${Date.now()}-${randomUUID()}`;
  const handle = await client.workflow.start(hourlySignupEmailWorkflow, {
    taskQueue,
    workflowId,
    args: [workflowArgs],
  });

  console.log(`Started workflow: ${workflowId}`);
  console.log(`Namespace: ${namespace}`);
  console.log(`Task queue: ${taskQueue}`);
  console.log(`Dry run: ${Boolean(workflowArgs.dryRun)}`);

  const result = await handle.result();
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error("Failed to run signup email workflow:", error);
  process.exit(1);
});
