import { createClient, type Client } from "@libsql/client/http";

let _db: Client | null = null;

export function getDb(): Client {
  if (!_db) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url) {
      throw new Error("TURSO_DATABASE_URL is not set");
    }

    _db = createClient({
      url,
      authToken,
    });
  }
  return _db;
}

let _initialized = false;

export async function ensureTables() {
  if (_initialized) return;
  const db = getDb();

  await db.batch([
    `CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL DEFAULT 'static',
      channel TEXT NOT NULL DEFAULT 'email',
      preset TEXT,
      last_synced_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
      email TEXT,
      phone TEXT,
      name TEXT DEFAULT '',
      UNIQUE(group_id, email),
      UNIQUE(group_id, phone)
    )`
  ], "write");

  _initialized = true;
}