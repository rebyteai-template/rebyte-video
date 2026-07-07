import { Worker } from "@temporalio/worker";
import * as activities from "./activities";
import { getSignupEmailTaskQueue, getWorkerActivityConcurrency } from "./config";
import { getTemporalWorkerConnection } from "./connection";

async function main() {
  const taskQueue = getSignupEmailTaskQueue();
  const maxConcurrentActivityTaskExecutions = getWorkerActivityConcurrency();
  const { connection, namespace } = await getTemporalWorkerConnection();

  console.log("[SignupEmail Worker] namespace:", namespace);
  console.log("[SignupEmail Worker] taskQueue:", taskQueue);
  console.log(
    "[SignupEmail Worker] maxConcurrentActivityTaskExecutions:",
    maxConcurrentActivityTaskExecutions
  );

  const worker = await Worker.create({
    connection,
    namespace,
    taskQueue,
    workflowsPath: require.resolve("./workflows"),
    activities,
    maxConcurrentActivityTaskExecutions,
  });

  await worker.run();
}

main().catch((error) => {
  console.error("[SignupEmail Worker] failed:", error);
  process.exit(1);
});
