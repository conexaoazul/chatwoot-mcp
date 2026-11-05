import { z } from "zod";
import type { RegisterFn } from "@/types.ts";

/**
 * StackLab / Conexão Azul Kanban (fork Chatwoot): Funnels + Kanban Items.
 * Contrato: conexaoazul/kanban docs/openapi.yml (rotas /funnels e /kanban_items).
 * Prefixo `stacklab_` para não colidir com as tools fazer.ai (/kanban/boards).
 */
const accountId = z.number().describe("The account ID");
const id = z.number().describe("Resource ID");
const body = z
  .record(z.string(), z.unknown())
  .optional()
  .describe("JSON body / filtros conforme docs/openapi.yml do kanban");

type Verb = "get" | "post" | "put" | "delete";
interface Spec {
  name: string;
  title: string;
  verb: Verb;
  path: string; // relativo a /api/v1/accounts/{account_id}; {id} / {funnel_id} substituídos
  desc: string;
  hasId?: boolean;
  hasFunnelId?: boolean;
}

const SPECS: Spec[] = [
  {
    name: "funnels_list",
    title: "List Funnels",
    verb: "get",
    path: "/funnels",
    desc: "Lista funis de vendas",
  },
  {
    name: "funnels_create",
    title: "Create Funnel",
    verb: "post",
    path: "/funnels",
    desc: "Cria funil",
  },
  {
    name: "funnels_get",
    title: "Get Funnel",
    verb: "get",
    path: "/funnels/{id}",
    desc: "Detalha funil",
    hasId: true,
  },
  {
    name: "funnels_update",
    title: "Update Funnel",
    verb: "put",
    path: "/funnels/{id}",
    desc: "Atualiza funil",
    hasId: true,
  },
  {
    name: "funnels_delete",
    title: "Delete Funnel",
    verb: "delete",
    path: "/funnels/{id}",
    desc: "Remove funil",
    hasId: true,
  },
  {
    name: "funnels_stage_stats",
    title: "Funnel Stage Stats",
    verb: "get",
    path: "/funnels/{id}/stage_stats",
    desc: "Estatísticas por estágio",
    hasId: true,
  },
  {
    name: "funnel_items_list",
    title: "List Funnel Kanban Items",
    verb: "get",
    path: "/funnels/{funnel_id}/kanban_items",
    desc: "Itens de um funil",
    hasFunnelId: true,
  },
  {
    name: "items_list",
    title: "List Kanban Items",
    verb: "get",
    path: "/kanban_items",
    desc: "Lista itens (filtros: funnel_id, stage, conversation, etc.)",
  },
  {
    name: "items_create",
    title: "Create Kanban Item",
    verb: "post",
    path: "/kanban_items",
    desc: "Cria item",
  },
  {
    name: "items_reorder",
    title: "Reorder Kanban Items",
    verb: "post",
    path: "/kanban_items/reorder",
    desc: "Reordena itens",
  },
  {
    name: "items_debug",
    title: "Debug Kanban Items",
    verb: "get",
    path: "/kanban_items/debug",
    desc: "Diagnóstico de itens",
  },
  {
    name: "items_search",
    title: "Search Kanban Items",
    verb: "get",
    path: "/kanban_items/search",
    desc: "Busca itens",
  },
  {
    name: "items_filter",
    title: "Filter Kanban Items",
    verb: "get",
    path: "/kanban_items/filter",
    desc: "Filtra itens",
  },
  {
    name: "items_reports",
    title: "Kanban Item Reports",
    verb: "get",
    path: "/kanban_items/reports",
    desc: "Relatórios",
  },
  {
    name: "items_get",
    title: "Get Kanban Item",
    verb: "get",
    path: "/kanban_items/{id}",
    desc: "Detalha item",
    hasId: true,
  },
  {
    name: "items_update",
    title: "Update Kanban Item",
    verb: "put",
    path: "/kanban_items/{id}",
    desc: "Atualiza item",
    hasId: true,
  },
  {
    name: "items_delete",
    title: "Delete Kanban Item",
    verb: "delete",
    path: "/kanban_items/{id}",
    desc: "Remove item",
    hasId: true,
  },
  {
    name: "items_move_to_stage",
    title: "Move Item To Stage",
    verb: "post",
    path: "/kanban_items/{id}/move_to_stage",
    desc: "Move item para estágio",
    hasId: true,
  },
  {
    name: "items_move",
    title: "Move Item",
    verb: "post",
    path: "/kanban_items/{id}/move",
    desc: "Move item (posição/funil)",
    hasId: true,
  },
  {
    name: "items_create_checklist_item",
    title: "Create Checklist Item",
    verb: "post",
    path: "/kanban_items/{id}/create_checklist_item",
    desc: "Cria item de checklist",
    hasId: true,
  },
  {
    name: "items_create_note",
    title: "Create Note",
    verb: "post",
    path: "/kanban_items/{id}/create_note",
    desc: "Cria nota",
    hasId: true,
  },
  {
    name: "items_assign_agent",
    title: "Assign Agent",
    verb: "post",
    path: "/kanban_items/{id}/assign_agent",
    desc: "Atribui agente",
    hasId: true,
  },
  {
    name: "items_remove_agent",
    title: "Remove Agent",
    verb: "post",
    path: "/kanban_items/{id}/remove_agent",
    desc: "Remove agente",
    hasId: true,
  },
  {
    name: "items_assigned_agents",
    title: "Assigned Agents",
    verb: "get",
    path: "/kanban_items/{id}/assigned_agents",
    desc: "Agentes atribuídos",
    hasId: true,
  },
  {
    name: "items_change_status",
    title: "Change Item Status",
    verb: "post",
    path: "/kanban_items/{id}/change_status",
    desc: "Altera status",
    hasId: true,
  },
  {
    name: "items_assign_agent_to_checklist_item",
    title: "Assign Agent To Checklist Item",
    verb: "post",
    path: "/kanban_items/{id}/assign_agent_to_checklist_item",
    desc: "Atribui agente a item de checklist",
    hasId: true,
  },
  {
    name: "items_remove_agent_from_checklist_item",
    title: "Remove Agent From Checklist Item",
    verb: "post",
    path: "/kanban_items/{id}/remove_agent_from_checklist_item",
    desc: "Remove agente de item de checklist",
    hasId: true,
  },
];

export const register: RegisterFn = (server, client) => {
  for (const s of SPECS) {
    const inputSchema: Record<string, z.ZodTypeAny> = { account_id: accountId };
    if (s.hasId) inputSchema.id = id;
    if (s.hasFunnelId) inputSchema.funnel_id = z.number().describe("Funnel ID");
    inputSchema.params = body;

    server.registerTool(
      `stacklab_kanban_${s.name}`,
      {
        title: s.title,
        description: `[StackLab Kanban] ${s.desc}`,
        inputSchema,
        annotations: {
          readOnlyHint: s.verb === "get",
          destructiveHint: s.verb === "delete",
          idempotentHint: s.verb === "get" || s.verb === "put",
        },
      },
      async (args: Record<string, unknown>) => {
        const path =
          `/api/v1/accounts/${args.account_id}` +
          s.path
            .replace("{id}", String(args.id))
            .replace("{funnel_id}", String(args.funnel_id));
        const params = (args.params ?? {}) as Record<string, unknown>;
        const result =
          s.verb === "get"
            ? await client.get(path, params as never)
            : s.verb === "delete"
              ? await client.delete(path)
              : s.verb === "put"
                ? await client.put(path, params)
                : await client.post(path, params);
        return {
          content: [
            { type: "text" as const, text: JSON.stringify(result, null, 2) },
          ],
        };
      },
    );
  }
};
