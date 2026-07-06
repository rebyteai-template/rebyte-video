import { createHash } from "crypto";
import path from "path";

try {
  if (!process.env.POSTMARK_API_KEY) {
    process.loadEnvFile?.(path.resolve(process.cwd(), ".env.local"));
  }
} catch (error: any) {
  if (error?.code !== "ENOENT") throw error;
}

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

function fingerprint(token: string) {
  return createHash("sha256").update(token).digest("hex").slice(0, 12);
}

async function postmarkGet<T>(pathName: string, token: string): Promise<T> {
  const res = await fetch(`https://api.postmarkapp.com${pathName}`, {
    headers: {
      Accept: "application/json",
      "X-Postmark-Server-Token": token,
    },
  });
  const json = (await res.json()) as any;
  if (!res.ok || json.ErrorCode) {
    throw new Error(
      `Postmark API error ${res.status}: ${json.Message || JSON.stringify(json)}`
    );
  }
  return json as T;
}

async function main() {
  const args = parseArgs(process.argv);
  const token = process.env.POSTMARK_API_KEY;
  if (!token) {
    console.error("POSTMARK_API_KEY is required. Set it or create .env.local.");
    process.exit(1);
  }

  const server = await postmarkGet<any>("/server", token);
  console.log(
    JSON.stringify(
      {
        token: fingerprint(token),
        server: server.Name,
        serverId: server.ID,
        deliveryType: server.DeliveryType,
      },
      null,
      2
    )
  );

  const messageId = stringArg(args, "message-id");
  if (messageId) {
    const details = await postmarkGet<any>(
      `/messages/outbound/${encodeURIComponent(messageId)}/details`,
      token
    );
    console.log(
      JSON.stringify(
        {
          messageId: details.MessageID,
          stream: details.MessageStream,
          subject: details.Subject,
          status: details.Status,
          recipients: details.Recipients,
          receivedAt: details.ReceivedAt,
          events: (details.MessageEvents || []).map((event: any) => ({
            type: event.Type,
            receivedAt: event.ReceivedAt,
            destinationServer: event.Details?.DestinationServer,
            deliveryMessage: event.Details?.DeliveryMessage,
          })),
        },
        null,
        2
      )
    );
  }

  const recipient = stringArg(args, "recipient");
  if (recipient) {
    const messages = await postmarkGet<any>(
      `/messages/outbound?recipient=${encodeURIComponent(recipient)}&count=5&offset=0`,
      token
    );
    console.log(
      JSON.stringify(
        {
          recipient,
          totalCount: messages.TotalCount,
          messages: (messages.Messages || []).map((message: any) => ({
            messageId: message.MessageID,
            stream: message.MessageStream,
            subject: message.Subject,
            status: message.Status,
            receivedAt: message.ReceivedAt,
          })),
        },
        null,
        2
      )
    );
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
