import { DEFAULT_SIGNUP_EMAIL_TASK_QUEUE } from "./shared";

export function getSignupEmailTaskQueue() {
  return (
    process.env.TEMPORAL_SIGNUP_EMAIL_TASK_QUEUE ||
    DEFAULT_SIGNUP_EMAIL_TASK_QUEUE
  );
}

export function getWorkerActivityConcurrency() {
  const value = Number(process.env.TEMPORAL_SIGNUP_EMAIL_ACTIVITY_CONCURRENCY);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 1;
}
