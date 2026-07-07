import fs from "fs";
import path from "path";

function stripQuotes(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function loadEnvFileIfPresent(filePath: string) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separator = line.indexOf("=");
    if (separator <= 0) continue;

    const key = line.slice(0, separator).trim();
    const value = stripQuotes(line.slice(separator + 1));
    if (!key || process.env[key] !== undefined) continue;

    process.env[key] = value;
  }
}

export function loadCrmEnv() {
  const crmDir = path.resolve(__dirname, "..");
  loadEnvFileIfPresent(path.join(crmDir, ".env.local"));
  loadEnvFileIfPresent(path.join(crmDir, ".env"));
}

export function loadTemporalEnv() {
  loadCrmEnv();

  const crmDir = path.resolve(__dirname, "..");
  const cctoolsDir =
    process.env.CCTOOLS_DIR || path.resolve(crmDir, "..", "..", "cctools");

  loadEnvFileIfPresent(path.join(cctoolsDir, "relay", ".env.local"));
  loadEnvFileIfPresent(path.join(cctoolsDir, "relay", ".env.development"));
  loadEnvFileIfPresent(path.join(cctoolsDir, "relay", ".env"));
}
