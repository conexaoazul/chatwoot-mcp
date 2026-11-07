/**
 * Mask credential-bearing fields before serializing upstream Chatwoot responses
 * to MCP tool output. Never log the unredacted payload.
 */
const SECRET_KEYS = new Set([
  "accesstoken",
  "refreshtoken",
  "token",
  "secret",
  "clientsecret",
  "apikey",
  "authorization",
  "password",
  "credentials",
]);

export function redactSecrets<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((entry) => redactSecrets(entry)) as T;
  }
  if (value === null || typeof value !== "object") {
    return value;
  }
  const entries = Object.entries(value as Record<string, unknown>).map(
    ([key, entry]) => {
      const normalizedKey = key.replace(/[-_]/g, "").toLowerCase();
      return [
        key,
        SECRET_KEYS.has(normalizedKey)
          ? "[REDACTED]"
          : redactSecrets(entry),
      ] as const;
    },
  );
  return Object.fromEntries(entries) as T;
}
