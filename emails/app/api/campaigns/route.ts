import { NextResponse } from "next/server";
import { campaigns } from "../../../campaigns";

export async function GET() {
  const list = Object.entries(campaigns).map(([name, config]) => ({
    name,
    description: config.description,
    subject: config.subject,
  }));

  return NextResponse.json(list);
}
