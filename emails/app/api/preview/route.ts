import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { campaigns } from "../../../campaigns";
import { createElement } from "react";

export async function POST(req: Request) {
  const { campaign } = await req.json();

  const config = campaigns[campaign];
  if (!config) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const html = await render(
    createElement(config.component, config.sampleProps)
  );

  return NextResponse.json({ html });
}
