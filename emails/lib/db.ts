import Database, { type Database as DatabaseType } from "better-sqlite3";
import path from "path";

let _db: DatabaseType | null = null;

export function getDb(): DatabaseType {
  if (!_db) {
    const dbPath = path.join(process.cwd(), "data.db");
    _db = new Database(dbPath);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
    _db.exec(`
      CREATE TABLE IF NOT EXISTS groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL DEFAULT 'static',
        channel TEXT NOT NULL DEFAULT 'email',
        preset TEXT,
        last_synced_at TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
        email TEXT NOT NULL DEFAULT '',
        phone TEXT NOT NULL DEFAULT '',
        name TEXT DEFAULT '',
        UNIQUE(group_id, email)
      );
    `);

    // Migration: add columns if they don't exist (for existing DBs)
    const cols = _db
      .prepare("PRAGMA table_info(groups)")
      .all()
      .map((c: any) => c.name);
    if (!cols.includes("type")) {
      _db.exec(
        `ALTER TABLE groups ADD COLUMN type TEXT NOT NULL DEFAULT 'static'`
      );
    }
    if (!cols.includes("preset")) {
      _db.exec(`ALTER TABLE groups ADD COLUMN preset TEXT`);
    }
    if (!cols.includes("last_synced_at")) {
      _db.exec(`ALTER TABLE groups ADD COLUMN last_synced_at TEXT`);
    }
    if (!cols.includes("channel")) {
      _db.exec(
        `ALTER TABLE groups ADD COLUMN channel TEXT NOT NULL DEFAULT 'email'`
      );
    }

    // Migration: add phone column to members if missing
    const memberCols = _db
      .prepare("PRAGMA table_info(members)")
      .all()
      .map((c: any) => c.name);
    if (!memberCols.includes("phone")) {
      _db.exec(
        `ALTER TABLE members ADD COLUMN phone TEXT NOT NULL DEFAULT ''`
      );
    }
  }
  return _db;
}
