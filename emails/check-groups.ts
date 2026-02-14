import { getDb, ensureTables } from "./lib/db";

async function main() {
  await ensureTables();
  const db = getDb();
  const result = await db.execute(
    `SELECT g.id, g.name, g.type, COUNT(m.id) as members
     FROM groups g
     LEFT JOIN members m ON m.group_id = g.id
     GROUP BY g.id`
  );
  console.table(result.rows);
}

main().catch(console.error);