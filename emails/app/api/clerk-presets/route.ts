import { NextResponse } from "next/server";
import { clerkPresets } from "../../../lib/clerk-presets";

export async function GET() {
  return NextResponse.json(clerkPresets);
}
