import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = getDb().prepare("DELETE FROM groups WHERE id = ?").run(id);

  if (result.changes === 0) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
