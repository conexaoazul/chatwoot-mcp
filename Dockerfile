# Chatwoot MCP Bridge — expõe o MCP stdio @fazer-ai/mcp-chatwoot como streamableHttp
# Uso: docker build -t ca/chatwoot-mcp-bridge:1.0 .
# Padrão da org: replica ca/portainer-mcp-bridge (supergateway + auth header)

FROM node:22-alpine

# supergateway (proxy streamableHttp) + o MCP chatwoot publicado (dist bundle Node, sem Bun)
RUN npm install -g --silent supergateway@3 @fazer-ai/mcp-chatwoot@1.1.0 \
    && npm cache clean --force

ENV BRIDGE_PORT=8102 \
    BRIDGE_PREFIX=/chatwoot \
    BRIDGE_TOKEN="" \
    CHATWOOT_BASE_URL="" \
    CHATWOOT_API_TOKEN="" \
    CHATWOOT_ACCOUNT_ID="64"

EXPOSE 8102

# O supergateway injeta o header Authorization no stream e expõe /<prefix>/mcp + /<prefix>/health
CMD ["sh", "-c", "supergateway --stdio \"mcp-chatwoot\" \
  --outputTransport streamableHttp \
  --port ${BRIDGE_PORT} \
  --streamableHttpPath ${BRIDGE_PREFIX}/mcp \
  --healthEndpoint ${BRIDGE_PREFIX}/health \
  --header \"Authorization: Bearer ${BRIDGE_TOKEN}\""]
