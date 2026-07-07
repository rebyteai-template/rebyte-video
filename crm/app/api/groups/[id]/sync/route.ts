import { NextResponse } from "next/server";
import { getDb } from "../../../../../lib/db";
import {
  isAllUsersGroup,
  rebuildAllUsersGroup,
  syncClerkGroup,
} from "../../../../../lib/all-users";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const groupResult = await db.execute({
    sql: "SELECT * FROM groups WHERE id = ?",
    args: [id],
  });
  const group = groupResult.rows[0] as any;
  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  if (isAllUsersGroup(group)) {
    const result = await rebuildAllUsersGroup(db, { refreshClerk: true });
    return NextResponse.json({
      ok: true,
      member_count: result.memberCount,
      last_synced_at: result.lastSyncedAt,
      source_group_ids: result.sourceGroupIds,
    });
  }

  if (group.type !== "dynamic") {
    return NextResponse.json(
      { error: "Only dynamic groups can be synced" },
      { status: 400 }
    );
  }

  const result = await syncClerkGroup(db, group);
  const allUsersResult =
    group.preset === "all_users"
      ? await rebuildAllUsersGroup(db, { refreshClerk: false })
      : null;

  return NextResponse.json({
    ok: true,
    member_count: result.memberCount,
    last_synced_at: result.lastSyncedAt,
    all_users_member_count: allUsersResult?.memberCount,
    all_users_last_synced_at: allUsersResult?.lastSyncedAt,
  });
}
