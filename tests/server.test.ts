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
});
