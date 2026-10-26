# Kanban fork → Chatwoot MCP — plano de aceite F0/F1

Base de código analisada: `conexaoazul/kanban` branch `2.9.5.2`; MCP `conexaoazul/chatwoot-mcp` branch `feat/kanban-fork-api-f0-20261026`. Objetivo: liberar leitura e posteriormente gestão do Kanban na conta 64 preservando as 123 tools atuais e isolamento entre empresas.

## Evidência de infraestrutura histórica (não é prova de produção atual)
- `deploy-bridge/service.json`: base `https://magicachat.conexaoazul.com/`, conta 64, imagem `ca/chatwoot-mcp-bridge:1.0`, bridge em dev1, via `mcp-origin.conexaoazul.com/chatwoot/mcp`.
- Portal CF aparece configurado como `auth_type: unauthenticated` no manifesto; `deploy-bridge/README.md` descreve autenticação por Bearer injetado pelo tunnel/supergateway. **Validar proteção real nas bordas e no serviço, nunca inferir autorização segura a partir do manifesto.**
- A ligação primária do Chatwoot respondeu `conversations_meta(account_id=64)`, mas `kanban_boards_list` retornou 404 em dois vínculos, coerente com divergência de rotas legado `/kanban/boards` vs fork `/funnels`.
- `kanban_config` GET pode persistir uma configuração; omitido em F0. `demand_radar/analyze` dispara um job, igualmente não entra como leitura.

## Gates, em ordem

1. **Identidade do ambiente:** confirmar origem/URL conectada, tenant 64, tag e digest da imagem, código exato do fork implantado, versão MCP em runtime e mapeamento de rotas `GET /api/v1/accounts/64/funnels` e `GET /api/v1/accounts/64/kanban_items`. Nenhum endpoint a testar com parâmetros inventados. Comparar HEAD, deploy e serviço real.
2. **P0 autorização:** revisar e validar `conexaoazul/kanban#124` (read scope guard), precedência do `KanbanItemsSearchGuard`, `KanbanItemPolicy::Scope`; testar administrador, agente atribuído, agente não atribuído, supervisor e usuário de outro tenant (ausência de exposição, erros 403/404 e dados sensíveis); revisar especificamente `FunnelsController#index/stage_stats`, `KanbanItemsController#tme_audit` e agregações. A PR não afirma sanar todas essas rotas.
3. **Testes MCP:** `bun install --frozen-lockfile`, `bun run lint`, `bun run build-check`, `bun run test`; confirmar **140** nomes de ferramentas e compatibilidade das 123 anteriores. O teste mockado é unitário, não certifica a versão remota.
4. **Preflight segurança de borda:** validar resposta 401 para chamadas sem credencial ao MCP e ao Chatwoot; validar headers/tokens nunca aparecem em logs; não expor secrets, URL privada de credencial, token ou dados de contatos.
5. **Smoke read-only em QA:** contas de teste com dados controlados, listagem paginada, itens por funil, busca/filtro, detalhes, checklist/notas e relatórios; comparar autorização e campos com app; verificar limites, 404 esperado, cache por usuário e PII. Não acionar `test_webhook`, criar registros ou mover cartões.
6. **Liberação:** revisar PRs e proteções, merge apenas com gate de aprovação, build versionado/digest, implantação gradual da bridge, `tools/list` correto, observabilidade e rollback para imagem original `ca/chatwoot-mcp-bridge:1.0` apenas se digest original for verificado.
7. **Aceite operacional:** ChatGPT deve ver 140 tools; provar execução de `kanban_funnels_list` e `kanban_items_list` na conta 64; monitorar erros, latência, rejeições, isolamento e impacto no atendimento. CI verde não é deploy e resposta HTTP200 não comprova ACL.

## F1 — escrita controlada, ainda NÃO implementada

| Ação sugerida | Rota fork | Política/gate |
|---|---|---|
| Criar cartão | `POST /kanban_items` | Pedido explícito, localizar duplicados por conversa/contato, idempotência e readback |
| Atualizar cartão | `PATCH /kanban_items/:id` | Preflight de estado, whitelist de campos, confirm. de dono, readback e rollback |
| Mover cartão | `POST /kanban_items/:id/move_to_stage` | Validar `funnel_id/stage`, checklist obrigatório, evento de audit, rollback |
| Atribuir agente | `POST /kanban_items/:id/assign_agent` | Checar owner e atendimento humano, evitar atribuições duplicadas |
| Checklists | `POST /kanban_items/:id/create_checklist_item`, `POST /toggle_checklist_item` | Preservar responsável, due date e evidências |
| Notas | `POST /kanban_items/:id/create_note` | Nota interna somente, sem mensagem externa e sem segredos |
| Prioridade/status | `POST /kanban_items/:id/change_status` | Validar regras de negócio e não declarar venda sem conciliação |
| Funis | `POST /funnels`, `PATCH /funnels/:id` | Criar/alterar estrutura só com aprovação humana |
| Em massa/destrutivo | `POST /bulk_*`, `DELETE /*` | Gate explícito; preview, limites, impacto, backup/rollback |

**Responsabilidade:** CTO Control Tower consolida indicadores e handoff; Customer Revenue Guardian usa dados comerciais sem duplicar acionamentos; Natan/DevOps valida código/QA; Diego aprova mudanças com impacto comercial/produção. Não duplicar cron/n8n.

## Estado de 26/10/2026
- MCP PR #3: Draft, 17 GETs, sem CI concluída de forma comprovada, sem release/deploy.
- Kanban PR #124: Draft, política GET alvo, verificação local isolada PASS; testes integrados e regressões reais ainda pendentes.
- Somente leitura em produção até autorização e validação documentadas.
