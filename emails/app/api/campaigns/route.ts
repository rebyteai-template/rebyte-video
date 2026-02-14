import { NextResponse } from "next/server";
import { campaigns } from "../../../campaigns";

export async function GET() {
  const list = Object.entries(campaigns).map(([name, config]) => ({
    name,
    channel: config.channel,
    description: config.description,
    ...(config.channel === "email"
      ? { subject: config.subject }
      : { message: config.message }),
  }));

  return NextResponse.json(list);
}
