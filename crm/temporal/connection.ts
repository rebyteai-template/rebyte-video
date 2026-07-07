import { Client, Connection, type ConnectionOptions } from "@temporalio/client";
import { NativeConnection } from "@temporalio/worker";
import { loadTemporalEnv } from "./env";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. Put it in crm/.env.local or cctools/relay/.env.local.`
    );
  }
  return value;
}

function getConnectionOptions(): {
  address: string;
  tls?: ConnectionOptions["tls"];
  apiKey?: string;
} {
  loadTemporalEnv();

  const address = requiredEnv("TEMPORAL_ADDRESS");
  const apiKey = process.env.TEMPORAL_API_KEY;
  if (apiKey) return { address, tls: true, apiKey };

  return { address };
}

export function getTemporalNamespace() {
  loadTemporalEnv();
  return requiredEnv("TEMPORAL_NAMESPACE");
}

export async function getTemporalClient() {
  const connection = await Connection.connect(getConnectionOptions());
  return new Client({
    connection,
    namespace: getTemporalNamespace(),
  });
}

export async function getTemporalWorkerConnection() {
  const connection = await NativeConnection.connect(getConnectionOptions());
  return {
    connection,
    namespace: getTemporalNamespace(),
  };
}
