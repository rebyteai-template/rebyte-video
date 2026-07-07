import { DbClient } from "./db";
import { fetchClerkUsersForPreset, normalizeEmail } from "./clerk-presets";

export const ALL_USERS_GROUP_NAME = "All Users";
const ALL_CLERK_USERS_GROUP_NAME = "All Clerk Users";
const ALL_CLERK_USERS_PRESET = "all_users";
const EXISTING_USER_GROUP_GLOB = "existing user [0-9]*";

interface GroupRow {
  id: number;
  name: string;
  type: string;
  channel: string;
  preset: string | null;
}

export function isAllUsersGroup(group: { name?: string; channel?: string }) {
  return group.name === ALL_USERS_GROUP_NAME && group.channel === "email";
}

async function getLastSyncedAt(db: DbClient, groupId: number) {
  const syncedResult = await db.execute({
    sql: "SELECT last_synced_at FROM groups WHERE id = ?",
    args: [groupId],
  });
  return (syncedResult.rows[0] as any)?.last_synced_at ?? null;
}

export async function syncClerkGroup(db: DbClient, group: GroupRow) {
  if (!group.preset) throw new Error("Dynamic group has no preset");

  const users = await fetchClerkUsersForPreset(group.preset);
  const batch: any[] = [
    {
      sql: "DELETE FROM members WHERE group_id = ?",
      args: [group.id],
    },
    ...users.map((u) => ({
      sql: "INSERT OR IGNORE INTO members (group_id, email, name) VALUES (?, ?, ?)",
      args: [group.id, u.email, u.name],
    })),
    {
      sql: "UPDATE groups SET last_synced_at = datetime('now') WHERE id = ?",
      args: [group.id],
    },
  ];

  await db.batch(batch, "write");

  return {
    groupId: group.id,
    memberCount: users.length,
    lastSyncedAt: await getLastSyncedAt(db, group.id),
  };
}

async function ensureAllUsersGroup(db: DbClient): Promise<GroupRow> {
  await db.execute({
    sql: "INSERT OR IGNORE INTO groups (name, type, channel) VALUES (?, 'dynamic', 'email')",
    args: [ALL_USERS_GROUP_NAME],
  });
  await db.execute({
    sql: "UPDATE groups SET type = 'dynamic', channel = 'email' WHERE name = ?",
    args: [ALL_USERS_GROUP_NAME],
  });

  const result = await db.execute({
    sql: "SELECT id, name, type, channel, preset FROM groups WHERE name = ?",
    args: [ALL_USERS_GROUP_NAME],
  });

  return result.rows[0] as GroupRow;
}

async function getClerkAllUsersGroups(db: DbClient): Promise<GroupRow[]> {
  const result = await db.execute({
    sql: "SELECT id, name, type, channel, preset FROM groups WHERE channel = 'email' AND preset = ?",
    args: [ALL_CLERK_USERS_PRESET],
  });
  return result.rows as GroupRow[];
}

async function ensureClerkAllUsersGroup(db: DbClient) {
  await db.execute({
    sql: "INSERT OR IGNORE INTO groups (name, type, channel, preset) VALUES (?, 'dynamic', 'email', ?)",
    args: [ALL_CLERK_USERS_GROUP_NAME, ALL_CLERK_USERS_PRESET],
  });
  await db.execute({
    sql: "UPDATE groups SET type = 'dynamic', channel = 'email', preset = ? WHERE name = ?",
    args: [ALL_CLERK_USERS_PRESET, ALL_CLERK_USERS_GROUP_NAME],
  });
}

async function pruneToCoreGroups(db: DbClient, targetGroupId: number) {
  const clerkGroups = await getClerkAllUsersGroups(db);
  const keepIds = Array.from(
    new Set([targetGroupId, ...clerkGroups.map((g) => g.id)])
  );
  const placeholders = keepIds.map(() => "?").join(", ");

  await db.execute({
    sql: `DELETE FROM members WHERE group_id NOT IN (${placeholders})`,
    args: keepIds,
  });
  await db.execute({
    sql: `DELETE FROM groups WHERE id NOT IN (${placeholders})`,
    args: keepIds,
  });
}

async function getAllUsersSourceGroups(
  db: DbClient,
  targetGroupId: number
): Promise<GroupRow[]> {
  const result = await db.execute({
    sql: `SELECT id, name, type, channel, preset
          FROM groups
          WHERE channel = 'email'
            AND id != ?
            AND (preset = ? OR name GLOB ?)
          ORDER BY id`,
    args: [targetGroupId, ALL_CLERK_USERS_PRESET, EXISTING_USER_GROUP_GLOB],
  });
  return result.rows as GroupRow[];
}

export async function rebuildAllUsersGroup(
  db: DbClient,
  options: { refreshClerk?: boolean } = {}
) {
  const targetGroup = await ensureAllUsersGroup(db);

  if (options.refreshClerk) {
    await ensureClerkAllUsersGroup(db);
    const clerkGroups = await getClerkAllUsersGroups(db);
    for (const clerkGroup of clerkGroups) {
      if (clerkGroup.id !== targetGroup.id) {
        await syncClerkGroup(db, clerkGroup);
      }
    }
  }

  const sourceGroups = await getAllUsersSourceGroups(db, targetGroup.id);
  // Include the current materialized All Users members as the durable base.
  // This lets us hide/remove old shard groups after they have been folded in.
  const sourceIds = [targetGroup.id, ...sourceGroups.map((g) => g.id)];
  const merged = new Map<string, { email: string; name: string }>();

  if (sourceIds.length > 0) {
    const placeholders = sourceIds.map(() => "?").join(", ");
    const membersResult = await db.execute({
      sql: `SELECT email, name
            FROM members
            WHERE group_id IN (${placeholders})
              AND email IS NOT NULL
              AND email != ''`,
      args: sourceIds,
    });

    for (const row of membersResult.rows) {
      const email = normalizeEmail(String((row as any).email ?? ""));
      if (!email.includes("@")) continue;

      const name = String((row as any).name ?? "");
      const existing = merged.get(email);
      if (!existing || (!existing.name && name)) {
        merged.set(email, { email, name });
      }
    }
  }

  const entries = Array.from(merged.values()).sort((a, b) =>
    a.email.localeCompare(b.email)
  );

  const batch: any[] = [
    {
      sql: "DELETE FROM members WHERE group_id = ?",
      args: [targetGroup.id],
    },
    ...entries.map((u) => ({
      sql: "INSERT OR IGNORE INTO members (group_id, email, name) VALUES (?, ?, ?)",
      args: [targetGroup.id, u.email, u.name],
    })),
    {
      sql: "UPDATE groups SET last_synced_at = datetime('now') WHERE id = ?",
      args: [targetGroup.id],
    },
  ];

  await db.batch(batch, "write");
  await pruneToCoreGroups(db, targetGroup.id);

  return {
    groupId: targetGroup.id,
    memberCount: entries.length,
    sourceGroupIds: sourceIds,
    sourceGroupNames: [targetGroup.name, ...sourceGroups.map((g) => g.name)],
    lastSyncedAt: await getLastSyncedAt(db, targetGroup.id),
  };
}
