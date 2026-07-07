export const HOURLY_SIGNUP_EMAIL_WORKFLOW_TYPE = "hourlySignupEmailWorkflow";
export const SIGNUP_EMAIL_SCHEDULE_ID = "rebyte-crm-hourly-signup-email";
export const DEFAULT_SIGNUP_EMAIL_TASK_QUEUE =
  "rebyte-crm-hourly-signup-email-dev";

export interface HourlySignupEmailInput {
  /**
   * Optional override for manual runs. Scheduled executions use the workflow
   * start time, which is the hourly schedule tick time.
   */
  endTimeMs?: number;
  dryRun?: boolean;
  concurrency?: number;
}

export interface SignupEmailRecipientResult {
  email: string;
  name: string;
  clerkUserId?: string;
  createdAt?: number;
  messageId?: string;
  status: "dry_run" | "sent" | "failed";
  error?: string;
}

export interface SignupEmailWindowResult {
  campaign: "recent-signup-feedback";
  windowStartMs: number;
  windowEndMs: number;
  recipients: number;
  sent: number;
  failed: number;
  dryRun: boolean;
  messageIds: string[];
  failures: SignupEmailRecipientResult[];
  sampleRecipients: SignupEmailRecipientResult[];
}

export interface SendSignupEmailsForWindowInput {
  windowStartMs: number;
  windowEndMs: number;
  workflowId: string;
  dryRun?: boolean;
  concurrency?: number;
}
