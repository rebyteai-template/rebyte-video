import { getDb, ensureTables } from "./lib/db";
import * as fs from "fs";

async function main() {
  await ensureTables();
  const db = getDb();
  const result = await db.execute("SELECT email, name FROM members LIMIT 10");
  const recipients = result.rows;
  fs.writeFileSync("test-recipients.json", JSON.stringify(recipients, null, 2));
  console.log(`Exported ${recipients.length} recipients to test-recipients.json`);
}

main().catch(console.error);