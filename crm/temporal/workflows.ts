import { proxyActivities, workflowInfo } from "@temporalio/workflow";
import type * as activities from "./activities";
import type {
  HourlySignupEmailInput,
  SignupEmailWindowResult,
} from "./shared";

const HOUR_MS = 60 * 60 * 1000;

const { sendSignupEmailsForWindow } = proxyActivities<typeof activities>({
  startToCloseTimeout: "15 minutes",
  retry: { maximumAttempts: 1 },
});

export async function hourlySignupEmailWorkflow(
  input: HourlySignupEmailInput = {}
): Promise<SignupEmailWindowResult> {
  const info = workflowInfo();
  const windowEndMs = input.endTimeMs ?? info.startTime.getTime();
  const windowStartMs = windowEndMs - HOUR_MS;

  return sendSignupEmailsForWindow({
    windowStartMs,
    windowEndMs,
    workflowId: info.workflowId,
    dryRun: input.dryRun,
    concurrency: input.concurrency,
  });
}
