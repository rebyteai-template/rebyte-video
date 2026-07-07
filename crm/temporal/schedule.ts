import {
  ScheduleAlreadyRunning,
  ScheduleNotFoundError,
  ScheduleOverlapPolicy,
} from "@temporalio/client";
import { getSignupEmailTaskQueue } from "./config";
import { getTemporalClient, getTemporalNamespace } from "./connection";
import {
  HOURLY_SIGNUP_EMAIL_WORKFLOW_TYPE,
  SIGNUP_EMAIL_SCHEDULE_ID,
  type HourlySignupEmailInput,
} from "./shared";

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

function buildScheduleSpec(input: {
  scheduleId: string;
  taskQueue: string;
  workflowArgs: HourlySignupEmailInput;
  paused: boolean;
}) {
  return {
    spec: {
      cronExpressions: ["CRON_TZ=UTC 0 * * * *"],
    },
    policies: {
      overlap: ScheduleOverlapPolicy.ALLOW_ALL,
      catchupWindow: "30 days",
    },
    state: {
      paused: input.paused,
      note: input.paused
        ? "Paused by crm/temporal/schedule.ts"
        : "Hourly recent-signup-feedback email for previous-hour Clerk signups",
    },
    action: {
      type: "startWorkflow" as const,
      workflowType: HOURLY_SIGNUP_EMAIL_WORKFLOW_TYPE,
      taskQueue: input.taskQueue,
      args: [input.workflowArgs],
    },
    memo: {
      campaign: "recent-signup-feedback",
      owner: "crm",
    },
  };
}

async function main() {
  const args = parseArgs(process.argv);
  const scheduleId =
    stringArg(args, "schedule-id") || SIGNUP_EMAIL_SCHEDULE_ID;
  const taskQueue = stringArg(args, "task-queue") || getSignupEmailTaskQueue();
  const paused = Boolean(args.paused);
  const workflowArgs: HourlySignupEmailInput = {
    dryRun: Boolean(args["dry-run"]),
  };

  const client = await getTemporalClient();
  const namespace = getTemporalNamespace();
  const schedule = buildScheduleSpec({
    scheduleId,
    taskQueue,
    workflowArgs,
    paused,
  });

  const handle = client.schedule.getHandle(scheduleId);
  let action: "created" | "updated" = "updated";

  try {
    await handle.describe();
    await handle.update(() => schedule);
  } catch (error) {
    if (!(error instanceof ScheduleNotFoundError)) throw error;

    action = "created";
    try {
      await client.schedule.create({
        scheduleId,
        ...schedule,
      });
    } catch (createError) {
      if (!(createError instanceof ScheduleAlreadyRunning)) throw createError;
      action = "updated";
      await handle.update(() => schedule);
    }
  }

  console.log(`Schedule ${action}: ${scheduleId}`);
  console.log(`Namespace: ${namespace}`);
  console.log(`Task queue: ${taskQueue}`);
  console.log("Spec: CRON_TZ=UTC 0 * * * *");
  console.log(`Overlap: ${ScheduleOverlapPolicy.ALLOW_ALL}`);
  console.log("Catchup window: 30 days");
  console.log(`Dry run workflow arg: ${Boolean(workflowArgs.dryRun)}`);
  console.log(`Paused: ${paused}`);
}

main().catch((error) => {
  console.error("Failed to upsert signup email schedule:", error);
  process.exit(1);
});
