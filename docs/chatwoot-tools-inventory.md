# Inventário operacional — 123 Chatwoot/Magic Chat tools

Data de referência: 26/10/2026; fonte: conector Conexão Azul Ops conectado ao ChatGPT (nomes de tools observados). Escopo da operação: conta 64; demais contas são isoladas. Não comprova que todas as rotas respondam no ambiente conectado.

## Modelo de autonomia

- **R — leitura direta**: análise, auditoria, busca e relatórios, respeitando controle de acesso e minimização de dados.
- **C — mudança controlada/condicional**: potencialmente útil para gestão por IA, mas somente após validar rota, tenant, titularidade, ausência de humano ativo quando aplicável, permissão, idempotência e readback; quando afetar cliente ou workflow crítico, exigir aprovação.
- **G — gate explícito**: envios externos, mutações destrutivas ou em massa, IAM, bots, automações, webhooks, publicação, financeiros ou mudanças sistêmicas.

Mesmo operações classificadas R podem falhar (por exemplo, Kanban legado 404). A classificação é orientação de governança, não concessão automática de permissão.

| Área | Total |
|---|---:|
| Conta | 2 |
| Bots IA | 5 |
| Atendentes | 4 |
| Auditoria | 1 |
| Automações | 5 |
| Respostas prontas | 4 |
| Etiquetas de contato | 2 |
| Contatos | 11 |
| Conversas | 12 |
| Atribuição de conversas | 1 |
| Atributos customizados | 5 |
| Filtros customizados | 5 |
| Central de ajuda | 5 |
| Caixas de entrada | 10 |
| Integrações | 4 |
| Kanban legado | 19 |
| Mensagens | 3 |
| Perfil | 1 |
| Relatórios | 7 |
| Mensagens agendadas | 4 |
| Times | 9 |
| Webhooks | 4 |
| **Total** | **123** |

## Matriz completa

| Família | Tool MCP (prefixo chatwoot_) | Autonomia | Critério |
|---|---|---|---|
| Conta | `account_get` | R | Consulta; leitura conforme ACL/tenant |
| Conta | `account_update` | G | Escrita sensível/exposição externa; aprovação específica |
| Bots IA | `agent_bots_list` | R | Consulta; leitura conforme ACL/tenant |
| Bots IA | `agent_bots_create` | G | Escrita sensível/exposição externa; aprovação específica |
| Bots IA | `agent_bots_get` | R | Consulta; leitura conforme ACL/tenant |
| Bots IA | `agent_bots_update` | G | Escrita sensível/exposição externa; aprovação específica |
| Bots IA | `agent_bots_delete` | G | Escrita sensível/exposição externa; aprovação específica |
| Atendentes | `agents_list` | R | Consulta; leitura conforme ACL/tenant |
| Atendentes | `agents_create` | G | Escrita sensível/exposição externa; aprovação específica |
| Atendentes | `agents_update` | G | Escrita sensível/exposição externa; aprovação específica |
| Atendentes | `agents_delete` | G | Escrita sensível/exposição externa; aprovação específica |
| Auditoria | `audit_logs_list` | R | Consulta; leitura conforme ACL/tenant |
| Automações | `automation_rules_list` | R | Consulta; leitura conforme ACL/tenant |
| Automações | `automation_rules_create` | G | Escrita sensível/exposição externa; aprovação específica |
| Automações | `automation_rules_get` | R | Consulta; leitura conforme ACL/tenant |
| Automações | `automation_rules_update` | G | Escrita sensível/exposição externa; aprovação específica |
| Automações | `automation_rules_delete` | G | Escrita sensível/exposição externa; aprovação específica |
| Respostas prontas | `canned_responses_list` | R | Consulta; leitura conforme ACL/tenant |
| Respostas prontas | `canned_responses_create` | C | Mudança delimitada; preflight, dedupe e readback |
| Respostas prontas | `canned_responses_update` | C | Mudança delimitada; preflight, dedupe e readback |
| Respostas prontas | `canned_responses_delete` | G | Escrita sensível/exposição externa; aprovação específica |
| Etiquetas de contato | `contact_labels_list` | R | Consulta; leitura conforme ACL/tenant |
| Etiquetas de contato | `contact_labels_set` | C | Mudança delimitada; preflight, dedupe e readback |
| Contatos | `contacts_list` | R | Consulta; leitura conforme ACL/tenant |
| Contatos | `contacts_create` | G | Escrita sensível/exposição externa; aprovação específica |
| Contatos | `contacts_get` | R | Consulta; leitura conforme ACL/tenant |
| Contatos | `contacts_update` | G | Escrita sensível/exposição externa; aprovação específica |
| Contatos | `contacts_delete` | G | Escrita sensível/exposição externa; aprovação específica |
| Contatos | `contacts_conversations` | R | Consulta; leitura conforme ACL/tenant |
| Contatos | `contacts_search` | R | Consulta; leitura conforme ACL/tenant |
| Contatos | `contacts_filter` | R | Consulta; leitura conforme ACL/tenant |
| Contatos | `contacts_create_contact_inbox` | G | Escrita sensível/exposição externa; aprovação específica |
| Contatos | `contacts_contactable_inboxes` | R | Consulta; leitura conforme ACL/tenant |
| Contatos | `contacts_merge` | G | Escrita sensível/exposição externa; aprovação específica |
| Conversas | `conversations_meta` | R | Consulta; leitura conforme ACL/tenant |
| Conversas | `conversations_list` | R | Consulta; leitura conforme ACL/tenant |
| Conversas | `conversations_create` | G | Escrita sensível/exposição externa; aprovação específica |
| Conversas | `conversations_filter` | R | Consulta; leitura conforme ACL/tenant |
| Conversas | `conversations_get` | R | Consulta; leitura conforme ACL/tenant |
| Conversas | `conversations_update` | G | Escrita sensível/exposição externa; aprovação específica |
| Conversas | `conversations_toggle_status` | C | Mudança delimitada; preflight, dedupe e readback |
| Conversas | `conversations_toggle_priority` | C | Mudança delimitada; preflight, dedupe e readback |
| Conversas | `conversations_set_custom_attributes` | G | Escrita sensível/exposição externa; aprovação específica |
| Conversas | `conversations_get_labels` | G | Escrita sensível/exposição externa; aprovação específica |
| Conversas | `conversations_set_labels` | C | Mudança delimitada; preflight, dedupe e readback |
| Conversas | `conversations_reporting_events` | R | Consulta; leitura conforme ACL/tenant |
| Atribuição de conversas | `conversation_assignments_assign` | C | Mudança delimitada; preflight, dedupe e readback |
| Atributos customizados | `custom_attributes_list` | R | Consulta; leitura conforme ACL/tenant |
| Atributos customizados | `custom_attributes_create` | G | Escrita sensível/exposição externa; aprovação específica |
| Atributos customizados | `custom_attributes_get` | R | Consulta; leitura conforme ACL/tenant |
| Atributos customizados | `custom_attributes_update` | G | Escrita sensível/exposição externa; aprovação específica |
| Atributos customizados | `custom_attributes_delete` | G | Escrita sensível/exposição externa; aprovação específica |
| Filtros customizados | `custom_filters_list` | R | Consulta; leitura conforme ACL/tenant |
| Filtros customizados | `custom_filters_create` | G | Escrita sensível/exposição externa; aprovação específica |
| Filtros customizados | `custom_filters_get` | R | Consulta; leitura conforme ACL/tenant |
| Filtros customizados | `custom_filters_update` | G | Escrita sensível/exposição externa; aprovação específica |
| Filtros customizados | `custom_filters_delete` | G | Escrita sensível/exposição externa; aprovação específica |
| Central de ajuda | `help_center_portals_list` | R | Consulta; leitura conforme ACL/tenant |
| Central de ajuda | `help_center_portals_create` | G | Escrita sensível/exposição externa; aprovação específica |
| Central de ajuda | `help_center_portals_update` | G | Escrita sensível/exposição externa; aprovação específica |
| Central de ajuda | `help_center_categories_create` | G | Escrita sensível/exposição externa; aprovação específica |
| Central de ajuda | `help_center_articles_create` | G | Escrita sensível/exposição externa; aprovação específica |
| Caixas de entrada | `inboxes_list` | R | Consulta; leitura conforme ACL/tenant |
| Caixas de entrada | `inboxes_get` | R | Consulta; leitura conforme ACL/tenant |
| Caixas de entrada | `inboxes_create` | G | Escrita sensível/exposição externa; aprovação específica |
| Caixas de entrada | `inboxes_update` | G | Escrita sensível/exposição externa; aprovação específica |
| Caixas de entrada | `inboxes_get_agent_bot` | G | Escrita sensível/exposição externa; aprovação específica |
| Caixas de entrada | `inboxes_set_agent_bot` | G | Escrita sensível/exposição externa; aprovação específica |
| Caixas de entrada | `inbox_members_list` | R | Consulta; leitura conforme ACL/tenant |
| Caixas de entrada | `inbox_members_create` | G | Escrita sensível/exposição externa; aprovação específica |
| Caixas de entrada | `inbox_members_update` | G | Escrita sensível/exposição externa; aprovação específica |
| Caixas de entrada | `inbox_members_delete` | G | Escrita sensível/exposição externa; aprovação específica |
| Integrações | `integrations_list_apps` | G | Escrita sensível/exposição externa; aprovação específica |
| Integrações | `integrations_create_hook` | G | Escrita sensível/exposição externa; aprovação específica |
| Integrações | `integrations_update_hook` | G | Escrita sensível/exposição externa; aprovação específica |
| Integrações | `integrations_delete_hook` | G | Escrita sensível/exposição externa; aprovação específica |
| Kanban legado | `kanban_audit_events_list` | R | Consulta; leitura conforme ACL/tenant |
| Kanban legado | `kanban_audit_events_get` | R | Consulta; leitura conforme ACL/tenant |
| Kanban legado | `kanban_boards_list` | R | Consulta; leitura conforme ACL/tenant |
| Kanban legado | `kanban_boards_create` | G | Escrita sensível/exposição externa; aprovação específica |
| Kanban legado | `kanban_boards_get` | R | Consulta; leitura conforme ACL/tenant |
| Kanban legado | `kanban_boards_update` | G | Escrita sensível/exposição externa; aprovação específica |
| Kanban legado | `kanban_boards_delete` | G | Escrita sensível/exposição externa; aprovação específica |
| Kanban legado | `kanban_boards_update_agents` | G | Escrita sensível/exposição externa; aprovação específica |
| Kanban legado | `kanban_steps_list` | R | Consulta; leitura conforme ACL/tenant |
| Kanban legado | `kanban_steps_create` | G | Escrita sensível/exposição externa; aprovação específica |
| Kanban legado | `kanban_steps_get` | R | Consulta; leitura conforme ACL/tenant |
| Kanban legado | `kanban_steps_update` | G | Escrita sensível/exposição externa; aprovação específica |
| Kanban legado | `kanban_steps_delete` | G | Escrita sensível/exposição externa; aprovação específica |
| Kanban legado | `kanban_tasks_list` | R | Consulta; leitura conforme ACL/tenant |
| Kanban legado | `kanban_tasks_create` | C | Mudança delimitada; preflight, dedupe e readback |
| Kanban legado | `kanban_tasks_get` | R | Consulta; leitura conforme ACL/tenant |
| Kanban legado | `kanban_tasks_update` | C | Mudança delimitada; preflight, dedupe e readback |
| Kanban legado | `kanban_tasks_delete` | G | Escrita sensível/exposição externa; aprovação específica |
| Kanban legado | `kanban_tasks_move` | C | Mudança delimitada; preflight, dedupe e readback |
| Mensagens | `messages_list` | R | Consulta; leitura conforme ACL/tenant |
| Mensagens | `messages_create` | G | Escrita sensível/exposição externa; aprovação específica |
| Mensagens | `messages_delete` | G | Escrita sensível/exposição externa; aprovação específica |
| Perfil | `profile_get` | R | Consulta; leitura conforme ACL/tenant |
| Relatórios | `reports_account_overview` | R | Consulta; leitura conforme ACL/tenant |
| Relatórios | `reports_account_summary` | R | Consulta; leitura conforme ACL/tenant |
| Relatórios | `reports_agent_summary` | R | Consulta; leitura conforme ACL/tenant |
| Relatórios | `reports_conversation_metrics` | R | Consulta; leitura conforme ACL/tenant |
| Relatórios | `reports_v2_agents` | R | Consulta; leitura conforme ACL/tenant |
| Relatórios | `reports_v2_inboxes` | R | Consulta; leitura conforme ACL/tenant |
| Relatórios | `reports_v2_teams` | R | Consulta; leitura conforme ACL/tenant |
| Mensagens agendadas | `scheduled_messages_list` | R | Consulta; leitura conforme ACL/tenant |
| Mensagens agendadas | `scheduled_messages_create` | G | Escrita sensível/exposição externa; aprovação específica |
| Mensagens agendadas | `scheduled_messages_update` | G | Escrita sensível/exposição externa; aprovação específica |
| Mensagens agendadas | `scheduled_messages_delete` | G | Escrita sensível/exposição externa; aprovação específica |
| Times | `teams_list` | R | Consulta; leitura conforme ACL/tenant |
| Times | `teams_create` | G | Escrita sensível/exposição externa; aprovação específica |
| Times | `teams_get` | R | Consulta; leitura conforme ACL/tenant |
| Times | `teams_update` | G | Escrita sensível/exposição externa; aprovação específica |
| Times | `teams_delete` | G | Escrita sensível/exposição externa; aprovação específica |
| Times | `team_members_list` | R | Consulta; leitura conforme ACL/tenant |
| Times | `team_members_add` | G | Escrita sensível/exposição externa; aprovação específica |
| Times | `team_members_update` | G | Escrita sensível/exposição externa; aprovação específica |
| Times | `team_members_delete` | G | Escrita sensível/exposição externa; aprovação específica |
| Webhooks | `webhooks_list` | R | Consulta; leitura conforme ACL/tenant |
| Webhooks | `webhooks_create` | G | Escrita sensível/exposição externa; aprovação específica |
| Webhooks | `webhooks_update` | G | Escrita sensível/exposição externa; aprovação específica |
| Webhooks | `webhooks_delete` | G | Escrita sensível/exposição externa; aprovação específica |

## Diferença entre o MCP legado e o fork

O conector atual possui **19** ferramentas Kanban em caminhos do estilo `/kanban/boards`, `/kanban/boards/:board_id/steps`, `/kanban/tasks` e `/kanban/tasks/:id/audit_events`. Essas rotas não estão definidas assim no arquivo `config/routes.rb` do fork `conexaoazul/kanban` (branch `2.9.5.2`). Nos dois vínculos de Chatwoot a consulta a `kanban_boards_list` para a conta 64 retornou HTTP 404; não significa que não há Kanban: pode indicar incompatibilidade entre forks/ambientes.

A PR F0 acrescenta **17 ferramentas GET**, total previsto **140**, preservando as 123 ferramentas existentes. Famílias corretas: `/api/v1/accounts/:account_id/funnels`, `/api/v1/accounts/:account_id/kanban_items`. Ações de escrita serão uma etapa separada (F1) com controles de autorização, dedupe, ACL e readback.

**Avisos de API**: a busca de Kanban deve passar pelo `KanbanItemsSearchGuard` e `KanbanItemPolicy::Scope`, com validação real do código implantado; `GET /kanban_config` pode criar registro e por isso foi excluído da F0. A PR em branch não configura/recarrega o servidor MCP em produção nem publica as ferramentas no ChatGPT.

## Critérios de aceite

1. Tipo de conta correto e tenancy isolada; cotejar URL/conector e SHA da imagem do Chatwoot.
2. Smoke read-only com usuário administrador e agente sem privilégios; verificar 200/401/403/404 conforme ACL e licenciamento.
3. CI (lint, typecheck, testes), versões do MCP, health e observabilidade.
4. Atribuições e movimentações futuras só com verificação de owner/estado, idempotência, registro e rollback; nunca invadir atendimento humano ativo.
5. Bulk updates, deletes, merge de contato, mensagens públicas, disparos, webhooks e IAM apenas com autorização específica.

Contagens por classe: 50 R, 10 C, 63 G, total 123.
