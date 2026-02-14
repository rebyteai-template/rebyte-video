#!/usr/bin/env node

/**
 * Import phone users from users_dump.csv into SMS groups.
 *
 * Usage:
 *   node emails/scripts/import-phone-users.js
 *
 * Reads ../users_dump.csv (relative to project root), filters for provider=phone,
 * extracts phone from providerId, deduplicates, and creates SMS groups of 500.
 */

const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const PROJECT_ROOT = path.resolve(__dirname, "../..");
const CSV_PATH = path.join(PROJECT_ROOT, "users_dump.csv");
const DB_PATH = path.join(PROJECT_ROOT, "emails", "data.db");
const GROUP_SIZE = 500;

function parseCsvLine(line, headers) {
  const values = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  values.push(current);

  const row = {};
  headers.forEach((h, idx) => {
    row[h] = (values[idx] || "").trim();
  });
  return row;
}

function main() {
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`CSV not found: ${CSV_PATH}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(CSV_PATH, "utf-8");
  const lines = raw.split("\n").filter((l) => l.trim());
  const headers = lines[0].split(",").map((h) => h.trim());

  // Parse and filter phone users
  const phoneUsers = [];
  const seenPhones = new Set();

  for (let i = 1; i < lines.length; i++) {
    const row = parseCsvLine(lines[i], headers);
    if (row.provider !== "phone") continue;

    const phone = (row.providerId || "").trim();
    if (!phone) continue;
    if (seenPhones.has(phone)) continue;
    seenPhones.add(phone);

    const name = row.name || phone;
    phoneUsers.push({ phone, name });
  }

  console.log(`Found ${phoneUsers.length} unique phone users`);

  if (phoneUsers.length === 0) {
    console.log("Nothing to import.");
    return;
  }

  // Open DB (run migrations via the same schema as db.ts)
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  // Ensure tables exist
  db.exec(`
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

  // Migrations for existing DBs
  const groupCols = db.prepare("PRAGMA table_info(groups)").all().map((c) => c.name);
  if (!groupCols.includes("channel")) {
    db.exec("ALTER TABLE groups ADD COLUMN channel TEXT NOT NULL DEFAULT 'email'");
  }
  const memberCols = db.prepare("PRAGMA table_info(members)").all().map((c) => c.name);
  if (!memberCols.includes("phone")) {
    db.exec("ALTER TABLE members ADD COLUMN phone TEXT NOT NULL DEFAULT ''");
  }

  // Create groups of GROUP_SIZE
  const totalGroups = Math.ceil(phoneUsers.length / GROUP_SIZE);

  const insertGroup = db.prepare(
    "INSERT OR IGNORE INTO groups (name, type, channel) VALUES (?, 'static', 'sms')"
  );
  // Use phone as email too so UNIQUE(group_id, email) deduplicates correctly
  const insertMember = db.prepare(
    "INSERT OR IGNORE INTO members (group_id, email, phone, name) VALUES (?, ?, ?, ?)"
  );

  const tx = db.transaction(() => {
    let totalAdded = 0;

    for (let g = 0; g < totalGroups; g++) {
      const groupName = `existing user (phone) ${g + 1}`;
      const result = insertGroup.run(groupName);

      let groupId;
      if (result.changes > 0) {
        groupId = result.lastInsertRowid;
        console.log(`Created group: "${groupName}" (id=${groupId})`);
      } else {
        const existing = db
          .prepare("SELECT id FROM groups WHERE name = ?")
          .get(groupName);
        groupId = existing.id;
        console.log(`Group "${groupName}" already exists (id=${groupId}), adding members`);
      }

      const start = g * GROUP_SIZE;
      const end = Math.min(start + GROUP_SIZE, phoneUsers.length);
      for (let i = start; i < end; i++) {
        const u = phoneUsers[i];
        const r = insertMember.run(groupId, u.phone, u.phone, u.name);
        if (r.changes > 0) totalAdded++;
      }
    }

    console.log(`\nImported ${totalAdded} phone members into ${totalGroups} group(s)`);
  });

  tx();
  db.close();
}

main();
