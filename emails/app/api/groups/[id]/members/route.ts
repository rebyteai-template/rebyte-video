import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { getDb, ensureTables } from "../../../../../lib/db";

async function getGroup(groupId: string) {
  const result = await getDb().execute({
    sql: "SELECT * FROM groups WHERE id = ?",
    args: [groupId]
  });
  return result.rows[0] as unknown as { id: number; channel: string } | undefined;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await ensureTables();
  const members = await getDb().execute({
    sql: `SELECT id, email, phone, name FROM members WHERE group_id = ? ORDER BY id`,
    args: [id]
  });

  return NextResponse.json(members.rows);
}

export async function POST(req: Request) {
  await ensureTables();
  const url = new URL(req.url);
  const groupId = url.pathname.split("/").at(-2)!;
  const group = await getGroup(groupId);
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
      const batch = valid.map(m => ({
        sql: "INSERT OR IGNORE INTO members (group_id, phone, name) VALUES (?, ?, ?)",
        args: [groupId, m.phone.trim(), m.name || ""]
      }));
      
      const result = await db.batch(batch, "write");
      const added = result.reduce((acc, r) => acc + (r.rowsAffected > 0 ? 1 : 0), 0);

      return NextResponse.json({
        total: rows.length,
        added,
        skipped: rows.length - added,
      });
    }

    // Email group CSV import
    const valid = rows.filter((r) => r.email && r.email.includes("@"));
    const batch = valid.map(m => ({
      sql: "INSERT OR IGNORE INTO members (group_id, email, name) VALUES (?, ?, ?)",
      args: [groupId, m.email, m.name || ""]
    }));

    const result = await db.batch(batch, "write");
    const added = result.reduce((acc, r) => acc + (r.rowsAffected > 0 ? 1 : 0), 0);

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
      await getDb().execute({
        sql: "INSERT INTO members (group_id, phone, name) VALUES (?, ?, ?)",
        args: [groupId, p, name || ""]
      });
      return NextResponse.json({ ok: true });
    } catch (e: any) {
      if (e.message && e.message.includes("UNIQUE constraint failed")) {
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
    await getDb().execute({
      sql: "INSERT INTO members (group_id, email, name) VALUES (?, ?, ?)",
      args: [groupId, email, name || ""]
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e.message && e.message.includes("UNIQUE constraint failed")) {
      return NextResponse.json(
        { error: "Email already in group" },
        { status: 409 }
      );
    }
    throw e;
  }
}

export async function DELETE(req: Request) {
  await ensureTables();
  const url = new URL(req.url);
  const groupId = url.pathname.split("/").at(-2)!;
  const group = await getGroup(groupId);
  const isSms = group?.channel === "sms";
  const body = await req.json();

  let result;
  if (isSms) {
    result = await getDb().execute({
      sql: "DELETE FROM members WHERE group_id = ? AND phone = ?",
      args: [groupId, body.phone]
    });
  } else {
    result = await getDb().execute({
      sql: "DELETE FROM members WHERE group_id = ? AND email = ?",
      args: [groupId, body.email]
    });
  }

  if (result.rowsAffected === 0) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
