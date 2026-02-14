import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { getDb } from "../../../../../lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const members = getDb()
    .prepare("SELECT id, email, name FROM members WHERE group_id = ? ORDER BY id")
    .all(id);

  return NextResponse.json(members);
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const groupId = url.pathname.split("/").at(-2);

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    const text = await file.text();
    let rows: Record<string, string>[];

    if (file.name.endsWith(".json")) {
      rows = JSON.parse(text);
    } else {
      rows = parse(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
    }

    const valid = rows.filter((r) => r.email && r.email.includes("@"));
    const db = getDb();
    const insert = db.prepare(
      "INSERT OR IGNORE INTO members (group_id, email, name) VALUES (?, ?, ?)"
    );

    const insertAll = db.transaction((members: Record<string, string>[]) => {
      let added = 0;
      for (const m of members) {
        const result = insert.run(groupId, m.email, m.name || "");
        if (result.changes > 0) added++;
      }
      return added;
    });

    const added = insertAll(valid);
    return NextResponse.json({
      total: rows.length,
      added,
      skipped: rows.length - added,
    });
  }

  // Single member add
  const { email, name } = await req.json();
  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Valid email is required" },
      { status: 400 }
    );
  }

  try {
    getDb()
      .prepare("INSERT INTO members (group_id, email, name) VALUES (?, ?, ?)")
      .run(groupId, email, name || "");
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return NextResponse.json(
        { error: "Email already in group" },
        { status: 409 }
      );
    }
    throw e;
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const groupId = url.pathname.split("/").at(-2);
  const { email } = await req.json();

  const result = getDb()
    .prepare("DELETE FROM members WHERE group_id = ? AND email = ?")
    .run(groupId, email);

  if (result.changes === 0) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
