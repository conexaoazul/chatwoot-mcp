# deploy-bridge — Chatwoot MCP Bridge no Docker Swarm (dev1)

Expoe o MCP stdio `@fazer-ai/mcp-chatwoot` (123 tools) como `streamableHttp`
atras de `mcp-origin.conexaoazul.com`, seguindo o padrao da org
(ver `conexaoazul/portainer-mcp/deploy-bridge`).

## Roteiro

```bash
# 1. Build da imagem (na maquina com acesso ao Swarm / registry)
docker build -t ca/chatwoot-mcp-bridge:1.0 -f Dockerfile ..

# 2. Variaveis (fonte: /data/.openclaw/.env — nunca commitar valores)
BRIDGE_TOKEN=<bearer do tunnel cloudflared mcp-origin>
CHATWOOT_API_TOKEN=<token da API do Chatwoot magicachat>

# 3. Deploy do service (rede web, placement dev1, traefik strip /chatwoot)
docker service create \
  --name chatwoot-mcp \
  --network web \
  --constraint node.hostname==dev1 \
  --publish mode=host,target=8102,published=18102 \
  --restart-condition any --restart-delay 5s \
  --env BRIDGE_PORT=8102 \
  --env BRIDGE_PREFIX=/chatwoot \
  --env "BRIDGE_TOKEN=$BRIDGE_TOKEN" \
  --env CHATWOOT_BASE_URL=https://magicachat.conexaoazul.com/ \
  --env "CHATWOOT_API_TOKEN=$CHATWOOT_API_TOKEN" \
  --env CHATWOOT_ACCOUNT_ID=64 \
  --label traefik.enable=true \
  --label 'traefik.http.routers.chatwootmcp.rule=Host(`mcp-origin.conexaoazul.com`) && PathPrefix(`/chatwoot`)' \
  --label traefik.http.routers.chatwootmcp.entrypoints=websecure \
  --label traefik.http.routers.chatwootmcp.tls=true \
  --label traefik.http.routers.chatwootmcp.middlewares=chatwootmcp-strip \
  --label traefik.http.routers.chatwootmcp.priority=220 \
  --label 'traefik.http.middlewares.chatwootmcp-strip.stripprefix.prefixes=/chatwoot' \
  --label traefik.http.middlewares.chatwootmcp-strip.stripprefix.forceSlash=true \
  --label traefik.http.services.chatwootmcp.loadbalancer.server.port=8102 \
  --label traefik.http.services.chatwootmcp.loadbalancer.server.scheme=http \
  ca/chatwoot-mcp-bridge:1.0

# 4. Validação
curl -sS https://mcp-origin.conexaoazul.com/chatwoot/health
```

## Portal CF

Endpoint registrado no Cloudflare MCP Server Portals com:
`id: chatwoot`, `hostname: https://mcp-origin.conexaoazul.com/chatwoot/mcp`,
`auth_type: unauthenticated` (o tunnel mcp-origin ja injeta o Bearer).

## Notas

- O pacote `dist/index.js` e um bundle Node puro (buildado com Bun no upstream),
  entao roda com `node:22-alpine` sem Bun no runtime.
- Supergateway injeta `Authorization: Bearer ${BRIDGE_TOKEN}` no stream MCP.
- `BRIDGE_TOKEN` e o mesmo valor usado pelos outros bridges do mcp-origin.
