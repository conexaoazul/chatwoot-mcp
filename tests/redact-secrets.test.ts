import { describe, expect, test } from "bun:test";
import { redactSecrets } from "@/tools/redact-secrets.ts";

describe("Chatwoot MCP secret redaction", () => {
  test("redacts nested bot credentials without losing operational fields", () => {
    const input = {
      agent_bot: {
        id: 14,
        name: "BlueConnect",
        outgoing_url: "https://example.test/webhook/sdr",
        access_token: { id: 360, token: "dummy-credential" },
        secret: "dummy-signature",
      },
      results: [{ api_key: "dummy-api-key", status: "healthy" }],
    };

    expect(redactSecrets(input)).toEqual({
      agent_bot: {
        id: 14,
        name: "BlueConnect",
        outgoing_url: "https://example.test/webhook/sdr",
        access_token: "[REDACTED]",
        secret: "[REDACTED]",
      },
      results: [{ api_key: "[REDACTED]", status: "healthy" }],
    });

    expect(input.agent_bot.secret).toBe("dummy-signature");
  });

  test("handles arrays, nulls and case variants", () => {
    const input = [
      null,
      { Authorization: "Bearer dummy", client_secret: "dummy", ok: true },
      { nested: { refreshToken: "dummy" } },
    ];

    expect(redactSecrets(input)).toEqual([
      null,
      { Authorization: "[REDACTED]", client_secret: "[REDACTED]", ok: true },
      { nested: { refreshToken: "[REDACTED]" } },
    ]);
  });
});
