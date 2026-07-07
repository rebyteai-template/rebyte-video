import { NextResponse } from "next/server";
import { getDb, ensureTables } from "../../../../lib/db";
import { isAllUsersGroup } from "../../../../lib/all-users";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await ensureTables();
  const db = getDb();
  const groupResult = await db.execute({
    sql: "SELECT name, channel FROM groups WHERE id = ?",
    args: [id],
  });
  const group = groupResult.rows[0] as any;
  if (group && isAllUsersGroup(group)) {
    return NextResponse.json(
      { error: "All Users is managed and cannot be deleted" },
      { status: 400 }
    );
  }

  const result = await db.execute({
    sql: "DELETE FROM groups WHERE id = ?",
    args: [id]
  });

  if (result.rowsAffected === 0) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
