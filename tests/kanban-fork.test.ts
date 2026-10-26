import { describe, expect, test } from "bun:test";
import type { McpServer } from "@modelcontextprotocol/server";
import type { ChatwootClient } from "@/client.ts";
import { register } from "@/tools/kanban-fork.ts";

type Handler = (args: Record<string, unknown>) => Promise<unknown>;
type CapturedTool = {
  inputSchema: Record<string, { parse: (value: unknown) => unknown }>;
  annotations: { readOnlyHint?: boolean };
  handler: Handler;
};

const makeHarness = () => {
  const tools = new Map<string, CapturedTool>();
  const calls: Array<{ path: string; params?: Record<string, unknown> }> = [];
  // This tests MCP registration without credentials, network or real Chatwoot.
  const server = {
    registerTool(
      name: string,
      options: Omit<CapturedTool, "handler">,
      handler: Handler,
    ) {
      tools.set(name, { ...options, handler });
    },
  } as unknown as McpServer;
  const client = {
    get(path: string, params?: Record<string, unknown>) {
      calls.push({ path, params });
      return Promise.resolve({ ok: true, path });
    },
  } as unknown as ChatwootClient;
  register(server, client);
  return { tools, calls };
};

describe("Kanban fork-native F0 MCP tools", () => {
  test("registers exactly 17 read-only tools", () => {
    const { tools } = makeHarness();
    expect(tools.size).toBe(17);
    for (const tool of tools.values()) {
      expect(tool.annotations.readOnlyHint).toBe(true);
      expect(tool.inputSchema.account_id).toBeDefined();
      expect(() => tool.inputSchema.account_id.parse(0)).toThrow();
      expect(tool.inputSchema.account_id.parse(64)).toBe(64);
    }
  });

  test("uses account-scoped native GET endpoints and preserves query filters", async () => {
    const { tools, calls } = makeHarness();
    await tools.get("kanban_funnels_list")!.handler({ account_id: 64 });
    await tools.get("kanban_items_list")!.handler({
      account_id: 64,
      funnel_id: 12,
      agent_id: 21,
      page: 2,
    });
    await tools.get("kanban_items_get")!.handler({
      account_id: 64,
      item_id: 551,
    });

    expect(calls[0]?.path).toBe("/api/v1/accounts/64/funnels");
    expect(calls[1]?.path).toBe("/api/v1/accounts/64/kanban_items");
    expect(calls[1]?.params).toMatchObject({
      funnel_id: 12,
      agent_id: 21,
      page: 2,
    });
    expect(calls[2]?.path).toBe("/api/v1/accounts/64/kanban_items/551");
    expect(calls.every((call) => !call.path.includes("/kanban/boards"))).toBe(true);
  });

  test("does not expose side-effecting kanban config reads or write tools", () => {
    const { tools } = makeHarness();
    const names = [...tools.keys()];
    expect(names.every((name) => /^kanban_(funnels|items)_/.test(name))).toBe(true);
    expect(names.some((name) => /create|delete|update|move|bulk|config/.test(name))).toBe(false);
  });
});
