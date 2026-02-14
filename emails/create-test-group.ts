import { getDb, ensureTables } from "./lib/db";

async function main() {
  await ensureTables();
  const db = getDb();
  
  try {
    const result = await db.execute({
      sql: "INSERT INTO groups (name) VALUES (?)",
      args: ["Test Group"]
    });
    const groupId = Number(result.lastInsertRowid);
    console.log(`Created group with ID: ${groupId}`);

    await db.batch([
      {
        sql: "INSERT INTO members (group_id, email, name) VALUES (?, ?, ?)",
        args: [groupId, "test1@example.com", "Test User 1"]
      },
      {
        sql: "INSERT INTO members (group_id, email, name) VALUES (?, ?, ?)",
        args: [groupId, "test2@example.com", "Test User 2"]
      }
    ], "write");
    console.log("Added test members");
  } catch (e: any) {
    if (e.message && e.message.includes("UNIQUE constraint failed")) {
      console.log("Test group already exists");
    } else {
      throw e;
    }
  }
}

main().catch(console.error);