/**
 * Chatwoot/Kanban fork-native endpoints, from conexaoazul/kanban 2.9.5.2.
 * Non-destructive F0 integration; legacy fazer.ai board/step/task routes are retained.
 * No calls to mutation endpoints or side-effecting GET /kanban_config (creates config).
 * Production availability and tenant permissions must be verified before enabling.
 */
import { z } from "zod";
import type { RegisterFn } from "@/types.ts";

const positiveId = z.number().int().positive();

export const register: RegisterFn = (server, client) => {
  server.registerTool(
    "kanban_funnels_list",
    {
      title: "List fork Kanban funnels",
      description: "Conexao Azul Chatwoot/Kanban fork API; account-scoped read-only endpoint.",
      inputSchema: {
    account_id: positiveId,
      },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id }) => {
      const result = await client.get(`/api/v1/accounts/${account_id}/funnels`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.registerTool(
    "kanban_funnels_get",
    {
      title: "Get fork Kanban funnel",
      description: "Conexao Azul Chatwoot/Kanban fork API; account-scoped read-only endpoint.",
      inputSchema: {
    account_id: positiveId,
    funnel_id: positiveId,
      },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id, funnel_id }) => {
      const result = await client.get(`/api/v1/accounts/${account_id}/funnels/${funnel_id}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.registerTool(
    "kanban_funnels_stage_stats",
    {
      title: "Get funnel stage statistics",
      description: "Conexao Azul Chatwoot/Kanban fork API; account-scoped read-only endpoint.",
      inputSchema: {
    account_id: positiveId,
    funnel_id: positiveId,
      },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id, funnel_id }) => {
      const result = await client.get(`/api/v1/accounts/${account_id}/funnels/${funnel_id}/stage_stats`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.registerTool(
    "kanban_items_list",
    {
      title: "List fork Kanban items",
      description: "Conexao Azul Chatwoot/Kanban fork API; account-scoped read-only endpoint.",
      inputSchema: {
    account_id: positiveId,
    funnel_id: positiveId.optional(),
    stage_id: z.string().trim().min(1).optional(),
    agent_id: positiveId.optional(),
    page: positiveId.optional(),
    has_conversation: z.boolean().optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id, funnel_id, stage_id, agent_id, page, has_conversation }) => {
      const result = await client.get(`/api/v1/accounts/${account_id}/kanban_items`, { funnel_id, stage_id, agent_id, page, has_conversation });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.registerTool(
    "kanban_items_get",
    {
      title: "Get fork Kanban item",
      description: "Conexao Azul Chatwoot/Kanban fork API; account-scoped read-only endpoint.",
      inputSchema: {
    account_id: positiveId,
    item_id: positiveId,
      },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id, item_id }) => {
      const result = await client.get(`/api/v1/accounts/${account_id}/kanban_items/${item_id}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.registerTool(
    "kanban_items_by_funnel",
    {
      title: "List items in a funnel",
      description: "Conexao Azul Chatwoot/Kanban fork API; account-scoped read-only endpoint.",
      inputSchema: {
    account_id: positiveId,
    funnel_id: positiveId,
    page: positiveId.optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id, funnel_id, page }) => {
      const result = await client.get(`/api/v1/accounts/${account_id}/funnels/${funnel_id}/kanban_items`, { page });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.registerTool(
    "kanban_items_reports",
    {
      title: "Get Kanban items metrics",
      description: "Conexao Azul Chatwoot/Kanban fork API; account-scoped read-only endpoint.",
      inputSchema: {
    account_id: positiveId,
    funnel_id: positiveId.optional(),
    inbox_id: positiveId.optional(),
    from: z.string().trim().min(1).optional(),
    to: z.string().trim().min(1).optional(),
    range: z.string().trim().min(1).optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id, funnel_id, inbox_id, from, to, range }) => {
      const result = await client.get(`/api/v1/accounts/${account_id}/kanban_items/reports`, { funnel_id, inbox_id, from, to, range });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.registerTool(
    "kanban_items_search",
    {
      title: "Search Kanban items",
      description: "Conexao Azul Chatwoot/Kanban fork API; account-scoped read-only endpoint.",
      inputSchema: {
    account_id: positiveId,
    query: z.string().trim().min(1),
    funnel_id: positiveId.optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id, query, funnel_id }) => {
      const result = await client.get(`/api/v1/accounts/${account_id}/kanban_items/search`, { query, funnel_id });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.registerTool(
    "kanban_items_filter",
    {
      title: "Filter Kanban items",
      description: "Conexao Azul Chatwoot/Kanban fork API; account-scoped read-only endpoint.",
      inputSchema: {
    account_id: positiveId,
    funnel_id: positiveId.optional(),
    stage_id: z.string().trim().min(1).optional(),
    agent_id: positiveId.optional(),
    page: positiveId.optional(),
    inbox_id: positiveId.optional(),
    range: z.string().trim().min(1).optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id, funnel_id, stage_id, agent_id, page, inbox_id, range }) => {
      const result = await client.get(`/api/v1/accounts/${account_id}/kanban_items/filter`, { funnel_id, stage_id, agent_id, page, inbox_id, range });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.registerTool(
    "kanban_items_assigned_agents",
    {
      title: "List agents assigned to item",
      description: "Conexao Azul Chatwoot/Kanban fork API; account-scoped read-only endpoint.",
      inputSchema: {
    account_id: positiveId,
    item_id: positiveId,
      },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id, item_id }) => {
      const result = await client.get(`/api/v1/accounts/${account_id}/kanban_items/${item_id}/assigned_agents`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.registerTool(
    "kanban_items_notes_list",
    {
      title: "Get Kanban item notes",
      description: "Conexao Azul Chatwoot/Kanban fork API; account-scoped read-only endpoint.",
      inputSchema: {
    account_id: positiveId,
    item_id: positiveId,
      },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id, item_id }) => {
      const result = await client.get(`/api/v1/accounts/${account_id}/kanban_items/${item_id}/get_notes`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.registerTool(
    "kanban_items_checklist_list",
    {
      title: "Get Kanban item checklist",
      description: "Conexao Azul Chatwoot/Kanban fork API; account-scoped read-only endpoint.",
      inputSchema: {
    account_id: positiveId,
    item_id: positiveId,
      },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id, item_id }) => {
      const result = await client.get(`/api/v1/accounts/${account_id}/kanban_items/${item_id}/get_checklist`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.registerTool(
    "kanban_items_time_report",
    {
      title: "Get Kanban item time report",
      description: "Conexao Azul Chatwoot/Kanban fork API; account-scoped read-only endpoint.",
      inputSchema: {
    account_id: positiveId,
    item_id: positiveId,
      },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id, item_id }) => {
      const result = await client.get(`/api/v1/accounts/${account_id}/kanban_items/${item_id}/time_report`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.registerTool(
    "kanban_items_stage_time_breakdown",
    {
      title: "Get stage time breakdown",
      description: "Conexao Azul Chatwoot/Kanban fork API; account-scoped read-only endpoint.",
      inputSchema: {
    account_id: positiveId,
    item_id: positiveId,
      },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id, item_id }) => {
      const result = await client.get(`/api/v1/accounts/${account_id}/kanban_items/${item_id}/stage_time_breakdown`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.registerTool(
    "kanban_items_checklist_search",
    {
      title: "Search item checklist",
      description: "Conexao Azul Chatwoot/Kanban fork API; account-scoped read-only endpoint.",
      inputSchema: {
    account_id: positiveId,
    item_id: positiveId,
    query: z.string().trim().min(1).optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id, item_id, query }) => {
      const result = await client.get(`/api/v1/accounts/${account_id}/kanban_items/${item_id}/search_checklist`, { query });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.registerTool(
    "kanban_items_checklist_progress_by_agent",
    {
      title: "Get checklist progress by agent",
      description: "Conexao Azul Chatwoot/Kanban fork API; account-scoped read-only endpoint.",
      inputSchema: {
    account_id: positiveId,
    item_id: positiveId,
      },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id, item_id }) => {
      const result = await client.get(`/api/v1/accounts/${account_id}/kanban_items/${item_id}/checklist_progress_by_agent`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.registerTool(
    "kanban_items_counts",
    {
      title: "Get Kanban item counts",
      description: "Conexao Azul Chatwoot/Kanban fork API; account-scoped read-only endpoint.",
      inputSchema: {
    account_id: positiveId,
    item_id: positiveId,
      },
      annotations: { readOnlyHint: true },
    },
    async ({ account_id, item_id }) => {
      const result = await client.get(`/api/v1/accounts/${account_id}/kanban_items/${item_id}/counts`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

};
