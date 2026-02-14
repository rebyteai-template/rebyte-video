import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

export async function GET() {
  const db = getDb();
  const groups = db
    .prepare(
      `SELECT g.id, g.name, g.created_at, COUNT(m.id) as member_count
       FROM groups g
       LEFT JOIN members m ON m.group_id = g.id
       GROUP BY g.id
       ORDER BY g.name`
    )
    .all();

  return NextResponse.json(groups);
}

export async function POST(req: Request) {
  const { name } = await req.json();

  if (!name || !name.trim()) {
    return NextResponse.json(
      { error: "Group name is required" },
      { status: 400 }
    );
  }

  try {
    const db = getDb();
    const result = db
      .prepare("INSERT INTO groups (name) VALUES (?)")
      .run(name.trim());
    return NextResponse.json({ id: result.lastInsertRowid, name: name.trim() });
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
