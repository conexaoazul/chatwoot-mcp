# Chatwoot MCP Bridge — source-built MCP v2 + Supergateway 4
# Supports MCP 2026-07-28 and legacy clients.

FROM oven/bun:1.2.23 AS build

WORKDIR /src
ENV HUSKY=0

COPY package.json bun.lock bunfig.toml tsconfig.json ./
COPY src ./src

RUN bun install --frozen-lockfile
RUN bun run build

FROM node:22-alpine

RUN npm install -g --silent supergateway@4.0.0 \
    && npm cache clean --force

COPY --from=build /src/dist/index.js /usr/local/bin/mcp-chatwoot
RUN chmod 0755 /usr/local/bin/mcp-chatwoot

ENV BRIDGE_PORT=8102 \
    BRIDGE_PREFIX=/chatwoot \
    BRIDGE_TOKEN_FILE="" \
    CHATWOOT_BASE_URL="" \
    CHATWOOT_API_TOKEN_FILE="" \
    CHATWOOT_ACCOUNT_ID="64"

EXPOSE 8102

CMD ["sh", "-c", "set -eu; BRIDGE_TOKEN=\"\${BRIDGE_TOKEN:-}\"; CHATWOOT_API_TOKEN=\"\${CHATWOOT_API_TOKEN:-}\"; if [ -n \"$BRIDGE_TOKEN_FILE\" ]; then BRIDGE_TOKEN=\"$(cat \"$BRIDGE_TOKEN_FILE\")\"; fi; if [ -n \"$CHATWOOT_API_TOKEN_FILE\" ]; then CHATWOOT_API_TOKEN=\"$(cat \"$CHATWOOT_API_TOKEN_FILE\")\"; fi; export BRIDGE_TOKEN CHATWOOT_API_TOKEN; exec supergateway --stdio \"mcp-chatwoot\" --outputTransport streamableHttp --port $BRIDGE_PORT --streamableHttpPath $BRIDGE_PREFIX/mcp --healthEndpoint $BRIDGE_PREFIX/health --header \"Authorization: Bearer $BRIDGE_TOKEN\""]
