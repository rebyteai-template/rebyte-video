export interface ClerkPreset {
  id: string;
  label: string;
  description: string;
}

export const clerkPresets: ClerkPreset[] = [
  {
    id: "all_users",
    label: "All Users",
    description: "All users registered in Clerk",
  },
  {
    id: "active_users",
    label: "Active Users",
    description: "Users active in the last 30 days",
  },
];

export function getPreset(id: string) {
  return clerkPresets.find((p) => p.id === id);
}

export async function fetchClerkUsersForPreset(id: string): Promise<{ email: string; name: string }[]> {
  // Stub: return empty for now
  return [];
}
