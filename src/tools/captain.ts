import { z } from "zod";
import type { RegisterFn } from "@/types.ts";

const accountId = z.number().describe("The Chatwoot account ID");
const assistantId = z.number().describe("Captain assistant ID");
const scenarioId = z.number().describe("Captain scenario ID");
const threadId = z.number().describe("Captain copilot thread ID");

const stringArray = z.array(z.string());

export const register: RegisterFn = (server, client) => {
  const base = (id: number) => `/api/v1/accounts/${id}/captain`;

  server.registerTool(
    "captain_preferences_get",
    {
      title: "Get Captain Preferences",
      description:
        "Read Captain/Copilot feature flags, model selections and provider preferences for an account",
      inputSchema: { account_id: accountId },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id }) => {
      const result = await client.get(`${base(account_id)}/preferences`);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "captain_assistants_list",
    {
      title: "List Captain Assistants",
      description:
        "List Captain assistants, including config, response guidelines and guardrails",
      inputSchema: { account_id: accountId },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id }) => {
      const result = await client.get(`${base(account_id)}/assistants`);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "captain_assistants_get",
    {
      title: "Get Captain Assistant",
      description:
        "Get one Captain assistant and its persisted behavior configuration",
      inputSchema: { account_id: accountId, id: assistantId },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id, id }) => {
      const result = await client.get(`${base(account_id)}/assistants/${id}`);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "captain_assistants_update_behavior",
    {
      title: "Update Captain Assistant Behavior",
      description:
        "Update Captain assistant identity and behavior fields without enabling features or attaching inboxes. Supports instructions used by legacy Captain, plus response guidelines and guardrails used by Captain v2.",
      inputSchema: {
        account_id: accountId,
        id: assistantId,
        name: z.string().optional().describe("Assistant display/name"),
        description: z
          .string()
          .optional()
          .describe("Assistant role description"),
        product_name: z
          .string()
          .optional()
          .describe("Product scope used by Captain prompts"),
        instructions: z
          .string()
          .optional()
          .describe("Legacy/custom Captain instructions"),
        temperature: z.number().min(0).max(2).optional(),
        welcome_message: z.string().optional(),
        handoff_message: z.string().optional(),
        resolution_message: z.string().optional(),
        response_guidelines: stringArray.optional(),
        guardrails: stringArray.optional(),
      },
      annotations: { idempotentHint: true },
    },
    async ({
      account_id,
      id,
      name,
      description,
      product_name,
      instructions,
      temperature,
      welcome_message,
      handoff_message,
      resolution_message,
      response_guidelines,
      guardrails,
    }) => {
      const assistant: Record<string, unknown> = {};
      const config: Record<string, unknown> = {};

      if (name !== undefined) assistant.name = name;
      if (description !== undefined) assistant.description = description;
      if (product_name !== undefined) config.product_name = product_name;
      if (instructions !== undefined) config.instructions = instructions;
      if (temperature !== undefined) config.temperature = temperature;
      if (welcome_message !== undefined)
        config.welcome_message = welcome_message;
      if (handoff_message !== undefined)
        config.handoff_message = handoff_message;
      if (resolution_message !== undefined)
        config.resolution_message = resolution_message;
      if (Object.keys(config).length > 0) assistant.config = config;
      if (response_guidelines !== undefined) {
        assistant.response_guidelines = response_guidelines;
      }
      if (guardrails !== undefined) assistant.guardrails = guardrails;

      const result = await client.patch(
        `${base(account_id)}/assistants/${id}`,
        { assistant },
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "captain_assistant_inboxes_list",
    {
      title: "List Captain Assistant Inboxes",
      description:
        "List inboxes currently attached to a Captain assistant. This tool is read-only and does not change routing.",
      inputSchema: { account_id: accountId, assistant_id: assistantId },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id, assistant_id }) => {
      const result = await client.get(
        `${base(account_id)}/assistants/${assistant_id}/inboxes`,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "captain_assistant_tools_list",
    {
      title: "List Captain Assistant Tools",
      description:
        "List built-in and custom tools available to Captain assistants",
      inputSchema: { account_id: accountId },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id }) => {
      const result = await client.get(`${base(account_id)}/assistants/tools`);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "captain_scenarios_list",
    {
      title: "List Captain Scenarios",
      description:
        "List enabled scenarios for a Captain assistant, including scenario instructions and tool references",
      inputSchema: { account_id: accountId, assistant_id: assistantId },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id, assistant_id }) => {
      const result = await client.get(
        `${base(account_id)}/assistants/${assistant_id}/scenarios`,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "captain_scenarios_get",
    {
      title: "Get Captain Scenario",
      description: "Get one Captain scenario and its instruction",
      inputSchema: {
        account_id: accountId,
        assistant_id: assistantId,
        id: scenarioId,
      },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id, assistant_id, id }) => {
      const result = await client.get(
        `${base(account_id)}/assistants/${assistant_id}/scenarios/${id}`,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "captain_scenarios_update",
    {
      title: "Update Captain Scenario",
      description:
        "Update the title, description, instruction, enabled flag or tool references for an existing Captain scenario",
      inputSchema: {
        account_id: accountId,
        assistant_id: assistantId,
        id: scenarioId,
        title: z.string().optional(),
        description: z.string().optional(),
        instruction: z.string().optional(),
        enabled: z.boolean().optional(),
        tools: stringArray.optional(),
      },
      annotations: { idempotentHint: true },
    },
    async ({ account_id, assistant_id, id, ...scenario }) => {
      const result = await client.patch(
        `${base(account_id)}/assistants/${assistant_id}/scenarios/${id}`,
        { scenario },
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "captain_copilot_threads_list",
    {
      title: "List Captain Copilot Threads",
      description:
        "List persisted Captain Copilot threads for the account. Copilot prompt instructions are not stored on the thread; they come from Captain system prompt code and assistant context.",
      inputSchema: { account_id: accountId },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id }) => {
      const result = await client.get(`${base(account_id)}/copilot_threads`);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "captain_copilot_messages_list",
    {
      title: "List Captain Copilot Messages",
      description: "List messages in a persisted Captain Copilot thread",
      inputSchema: {
        account_id: accountId,
        copilot_thread_id: threadId,
      },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id, copilot_thread_id }) => {
      const result = await client.get(
        `${base(account_id)}/copilot_threads/${copilot_thread_id}/copilot_messages`,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  );
};

[executed on device: azul2 (76f18829-c903-4d56-b926-2edc669717f9)]