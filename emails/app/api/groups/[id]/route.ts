import { NextResponse } from "next/server";
import { getDb, ensureTables } from "../../../../lib/db";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await ensureTables();
  const result = await getDb().execute({
    sql: "DELETE FROM groups WHERE id = ?",
    args: [id]
  });

  if (result.rowsAffected === 0) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
