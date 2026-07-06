export interface ClerkPreset {
  id: string;
  label: string;
  description: string;
  filter: (user: ClerkUser) => boolean;
  /** Stop paginating once a full page has zero matches (time-based presets) */
  earlyTermination: boolean;
}

interface ClerkUser {
  id: string;
  email_addresses: { email_address: string }[];
  first_name: string | null;
  last_name: string | null;
  created_at: number; // epoch ms
}

const now = () => Date.now();
const DAY_MS = 24 * 60 * 60 * 1000;

function startOfLocalDay(timestamp = now()) {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function isInPreviousLocalDay(timestamp: number) {
  const end = startOfLocalDay();
  return timestamp >= end - DAY_MS && timestamp < end;
}

/** Normalize Gmail dot-aliases and +tags so duplicates are caught */
export function normalizeEmail(email: string): string {
  email = email.toLowerCase().trim();
  const [local, domain] = email.split("@");
  if (domain === "gmail.com" || domain === "googlemail.com") {
    const cleaned = local.split("+")[0].replace(/\./g, "");
    return `${cleaned}@gmail.com`;
  }
  return email;
}

export const PRESETS: ClerkPreset[] = [
  {
    id: "registered_yesterday",
    label: "Registered yesterday",
    description: "Users who signed up during the previous local calendar day",
    filter: (u) => isInPreviousLocalDay(u.created_at),
    earlyTermination: true,
  },
  {
    id: "registered_last_7_days",
    label: "Registered last 7 days",
    description: "Users who signed up within the past 7 days",
    filter: (u) => u.created_at >= now() - 7 * 24 * 60 * 60 * 1000,
    earlyTermination: true,
  },
  {
    id: "registered_last_30_days",
    label: "Registered last 30 days",
    description: "Users who signed up within the past 30 days",
    filter: (u) => u.created_at >= now() - 30 * 24 * 60 * 60 * 1000,
    earlyTermination: true,
  },
  {
    id: "all_users",
    label: "All users",
    description: "Every user in the Clerk directory",
    filter: () => true,
    earlyTermination: false,
  },
];

export function getPreset(id: string): ClerkPreset | undefined {
  return PRESETS.find((p) => p.id === id);
}

export async function fetchClerkUsersForPreset(
  presetId: string
): Promise<{ email: string; name: string }[]> {
  const preset = getPreset(presetId);
  if (!preset) throw new Error(`Unknown preset: ${presetId}`);

  const apiKey = process.env.CLERK_SECRET_KEY;
  if (!apiKey) throw new Error("CLERK_SECRET_KEY not set");

  const results: { email: string; name: string }[] = [];
  const seen = new Set<string>();
  let offset = 0;
  const limit = 100;

  while (true) {
    const url = `https://api.clerk.com/v1/users?order_by=-created_at&limit=${limit}&offset=${offset}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Clerk API error ${res.status}: ${text}`);
    }

    const users: ClerkUser[] = await res.json();
    if (users.length === 0) break;

    let matchesInPage = 0;
    for (const user of users) {
      if (preset.filter(user)) {
        const rawEmail = user.email_addresses?.[0]?.email_address;
        if (rawEmail) {
          const email = normalizeEmail(rawEmail);
          if (!seen.has(email)) {
            seen.add(email);
            const name = [user.first_name, user.last_name]
              .filter(Boolean)
              .join(" ");
            results.push({ email, name });
          }
          matchesInPage++;
        }
      }
    }

    // Early termination: if sorted newest-first and no matches in a full page,
    // all subsequent pages will also have no matches for time-based filters
    if (preset.earlyTermination && matchesInPage === 0) break;

    // If we got fewer than limit, we've exhausted all users
    if (users.length < limit) break;

    offset += limit;
  }

  return results;
}
