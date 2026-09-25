import { describe, expect, test } from "bun:test";
import { ChatwootClient } from "@/client.ts";
import { createServer } from "@/server.ts";

describe("Server", () => {
  test("creates server with all tools registered", () => {
    const client = new ChatwootClient(
      "https://chatwoot.example.com",
      "test-token",
    );
    const server = createServer(client);

    // The server should have been created successfully
    expect(server).toBeDefined();
  });

  test("registers all 134 tools", () => {
    const client = new ChatwootClient(
      "https://chatwoot.example.com",
      "test-token",
    );
    const server = createServer(client);

    // biome-ignore lint/suspicious/noExplicitAny: accessing internal properties for testing
    const tools = (server as any)._registeredTools;
    expect(Object.keys(tools).length).toBe(134);
  });

  test("has fazer.ai exclusive tools", () => {
    const client = new ChatwootClient(
      "https://chatwoot.example.com",
      "test-token",
    );
    const server = createServer(client);

    // biome-ignore lint/suspicious/noExplicitAny: accessing internal properties for testing
    const tools = (server as any)._registeredTools;

    // Kanban tools
    expect(tools.kanban_boards_list).toBeDefined();
    expect(tools.kanban_steps_list).toBeDefined();
    expect(tools.kanban_tasks_list).toBeDefined();
    expect(tools.kanban_audit_events_list).toBeDefined();

    // Scheduled messages
    expect(tools.scheduled_messages_list).toBeDefined();

    // Captain / Copilot
    expect(tools.captain_preferences_get).toBeDefined();
    expect(tools.captain_assistants_list).toBeDefined();
    expect(tools.captain_assistants_update_behavior).toBeDefined();
    expect(tools.captain_scenarios_list).toBeDefined();
    expect(tools.captain_scenarios_update).toBeDefined();
    expect(tools.captain_copilot_threads_list).toBeDefined();
  });

  test("Captain behavior updates merge existing config", async () => {
    const calls: Array<{ path: string; body: Record<string, unknown> }> = [];
    const client = {
      get: async () => ({
        config: {
          feature_faq: true,
          feature_memory: true,
          product_name: "Odoo CRM | Chatwoot",
          instructions: "old",
        },
      }),
      patch: async (path: string, body: Record<string, unknown>) => {
        calls.push({ path, body });
        return body;
      },
    } as unknown as ChatwootClient;

    const server = createServer(client);

    // biome-ignore lint/suspicious/noExplicitAny: accessing internal properties for testing
    const tool = (server as any)._registeredTools
      .captain_assistants_update_behavior;
    await tool.handler({
      account_id: 64,
      id: 1,
      instructions: "new",
    });

    expect(calls).toHaveLength(1);
    expect(calls[0]?.path).toBe("/api/v1/accounts/64/captain/assistants/1");
    expect(calls[0]?.body).toEqual({
      assistant: {
        config: {
          feature_faq: true,
          feature_memory: true,
          product_name: "Odoo CRM | Chatwoot",
          instructions: "new",
        },
      },
    });
  });
});
