import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { getDb } from "../../../../../lib/db";

function getGroup(groupId: string) {
  return getDb()
    .prepare("SELECT * FROM groups WHERE id = ?")
    .get(groupId) as { id: number; channel: string } | undefined;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const members = getDb()
    .prepare(
      `SELECT id, email, phone, name FROM members WHERE group_id = ? ORDER BY id`
    )
    .all(id);

  return NextResponse.json(members);
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const groupId = url.pathname.split("/").at(-2)!;
  const group = getGroup(groupId);
  const isSms = group?.channel === "sms";

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

    const db = getDb();

    if (isSms) {
      const valid = rows.filter((r) => r.phone && r.phone.trim());
      const insert = db.prepare(
        "INSERT OR IGNORE INTO members (group_id, email, phone, name) VALUES (?, ?, ?, ?)"
      );
      const insertAll = db.transaction(
        (members: Record<string, string>[]) => {
          let added = 0;
          for (const m of members) {
            const phone = m.phone.trim();
            const result = insert.run(groupId, phone, phone, m.name || "");
            if (result.changes > 0) added++;
          }
          return added;
        }
      );
      const added = insertAll(valid);
      return NextResponse.json({
        total: rows.length,
        added,
        skipped: rows.length - added,
      });
    }

    // Email group CSV import
    const valid = rows.filter((r) => r.email && r.email.includes("@"));
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
  if (isSms) {
    const { phone, name } = await req.json();
    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }
    try {
      const p = phone.trim();
      getDb()
        .prepare(
          "INSERT INTO members (group_id, email, phone, name) VALUES (?, ?, ?, ?)"
        )
        .run(groupId, p, p, name || "");
      return NextResponse.json({ ok: true });
    } catch (e: any) {
      if (e.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return NextResponse.json(
          { error: "Phone already in group" },
          { status: 409 }
        );
      }
      throw e;
    }
  }

  // Email member add
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
  const groupId = url.pathname.split("/").at(-2)!;
  const group = getGroup(groupId);
  const isSms = group?.channel === "sms";
  const body = await req.json();

  let result;
  if (isSms) {
    result = getDb()
      .prepare("DELETE FROM members WHERE group_id = ? AND phone = ?")
      .run(groupId, body.phone);
  } else {
    result = getDb()
      .prepare("DELETE FROM members WHERE group_id = ? AND email = ?")
      .run(groupId, body.email);
  }

  if (result.changes === 0) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
