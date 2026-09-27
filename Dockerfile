# Chatwoot MCP Bridge — expõe o MCP stdio @fazer-ai/mcp-chatwoot como streamableHttp
# Uso: docker build -t ca/chatwoot-mcp-bridge:1.1-proto2026 .
# Padrão da org: replica ca/portainer-mcp-bridge (supergateway + auth header)

FROM node:22-alpine

# supergateway 4 adds MCP 2026-07-28 while keeping legacy compatibility.
RUN npm install -g --silent supergateway@4.0.0 @fazer-ai/mcp-chatwoot@1.1.0 \
    && npm cache clean --force

ENV BRIDGE_PORT=8102 \
    BRIDGE_PREFIX=/chatwoot \
    BRIDGE_TOKEN_FILE="" \
    CHATWOOT_BASE_URL="" \
    CHATWOOT_API_TOKEN_FILE="" \
    CHATWOOT_ACCOUNT_ID="64"

EXPOSE 8102

# Tokens may be supplied via Docker Secrets using *_FILE. Values never need to live in the Swarm service spec.
CMD ["sh", "-c", "set -eu; BRIDGE_TOKEN=\"${BRIDGE_TOKEN:-}\"; CHATWOOT_API_TOKEN=\"${CHATWOOT_API_TOKEN:-}\"; if [ -n \"$BRIDGE_TOKEN_FILE\" ]; then BRIDGE_TOKEN=\"$(cat \"$BRIDGE_TOKEN_FILE\")\"; fi; if [ -n \"$CHATWOOT_API_TOKEN_FILE\" ]; then CHATWOOT_API_TOKEN=\"$(cat \"$CHATWOOT_API_TOKEN_FILE\")\"; fi; export BRIDGE_TOKEN CHATWOOT_API_TOKEN; exec supergateway --stdio \"mcp-chatwoot\" --outputTransport streamableHttp --port $BRIDGE_PORT --streamableHttpPath $BRIDGE_PREFIX/mcp --healthEndpoint $BRIDGE_PREFIX/health --header \"Authorization: Bearer $BRIDGE_TOKEN\""]
