import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { getPreset, fetchClerkUsersForPreset } from "../../../lib/clerk-presets";

export async function GET() {
  const db = getDb();
  const groups = db
    .prepare(
      `SELECT g.id, g.name, g.type, g.channel, g.preset, g.last_synced_at, g.created_at, COUNT(m.id) as member_count
       FROM groups g
       LEFT JOIN members m ON m.group_id = g.id
       GROUP BY g.id
       ORDER BY g.name`
    )
    .all();

  return NextResponse.json(groups);
}

export async function POST(req: Request) {
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
    const result = db
      .prepare(
        "INSERT INTO groups (name, type, channel, preset) VALUES (?, ?, ?, ?)"
      )
      .run(name.trim(), isDynamic ? "dynamic" : "static", channel, isDynamic ? preset : null);

    const groupId = result.lastInsertRowid as number;

    // If dynamic, sync immediately
    if (isDynamic) {
      const users = await fetchClerkUsersForPreset(preset);
      const insert = db.prepare(
        "INSERT OR IGNORE INTO members (group_id, email, name) VALUES (?, ?, ?)"
      );
      const tx = db.transaction(() => {
        for (const u of users) {
          insert.run(groupId, u.email, u.name);
        }
        db.prepare(
          "UPDATE groups SET last_synced_at = datetime('now') WHERE id = ?"
        ).run(groupId);
      });
      tx();
    }

    const group = db
      .prepare("SELECT * FROM groups WHERE id = ?")
      .get(groupId);

    return NextResponse.json(group);
  } catch (e: any) {
    if (e.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return NextResponse.json(
        { error: "Group name already exists" },
        { status: 409 }
      );
    }
    throw e;
  }
}
