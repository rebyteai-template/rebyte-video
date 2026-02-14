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
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
        email TEXT NOT NULL,
        name TEXT DEFAULT '',
        UNIQUE(group_id, email)
      );
    `);
  }
  return _db;
}
