import { NextResponse } from "next/server";
import { getDb, ensureTables } from "../../../lib/db";
import { getPreset, fetchClerkUsersForPreset } from "../../../lib/clerk-presets";

export async function GET() {
  await ensureTables();
  const db = getDb();
  const result = await db.execute(
    `SELECT g.id, g.name, g.type, g.channel, g.preset, g.last_synced_at, g.created_at, COUNT(m.id) as member_count
     FROM groups g
     LEFT JOIN members m ON m.group_id = g.id
     GROUP BY g.id
     ORDER BY g.name`
  );

  return NextResponse.json(result.rows);
}

export async function POST(req: Request) {
  await ensureTables();
  const { name, preset, channel = "email" } = await req.json();

  if (!name || !name.trim()) {
    return NextResponse.json(
      { error: "Group name is required" },
      { status: 400 }
    );
  }

  if (channel !== "email" && channel !== "sms") {
    return NextResponse.json(
      { error: "channel must be 'email' or 'sms'" },
      { status: 400 }
    );
  }

  const isDynamic = !!preset;
  if (isDynamic && !getPreset(preset)) {
    return NextResponse.json(
      { error: `Unknown preset: ${preset}` },
      { status: 400 }
    );
  }

  try {
    const db = getDb();
    const result = await db.execute({
      sql: "INSERT INTO groups (name, type, channel, preset) VALUES (?, ?, ?, ?)",
      args: [name.trim(), isDynamic ? "dynamic" : "static", channel, isDynamic ? preset : null]
    });

    const groupId = Number(result.lastInsertRowid);

    // If dynamic, sync immediately
    if (isDynamic) {
      const users = await fetchClerkUsersForPreset(preset);
      
      const batch: any[] = users.map(u => ({
        sql: "INSERT OR IGNORE INTO members (group_id, email, name) VALUES (?, ?, ?)",
        args: [groupId, u.email, u.name]
      }));

      batch.push({
        sql: "UPDATE groups SET last_synced_at = datetime('now') WHERE id = ?",
        args: [groupId]
      });

      await db.batch(batch, "write");
    }

    const selectResult = await db.execute({
      sql: "SELECT * FROM groups WHERE id = ?",
      args: [groupId]
    });

    return NextResponse.json(selectResult.rows[0]);
  } catch (e: any) {
    if (e.message && e.message.includes("UNIQUE constraint failed")) {
      return NextResponse.json(
        { error: "Group name already exists" },
        { status: 409 }
      );
    }
    throw e;
  }
}
