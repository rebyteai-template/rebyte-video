import { getDb, ensureTables } from "./lib/db";

async function main() {
  await ensureTables();
  const db = getDb();
  const countResult = await db.execute("SELECT COUNT(*) as count FROM members");
  const count = countResult.rows[0] as unknown as { count: number };
  console.log(`Total members: ${count.count}`);

  const groupsResult = await db.execute("SELECT * FROM groups");
  const groups = groupsResult.rows;
  console.log("\nGroups:");
  console.table(groups);
}

main().catch(console.error);