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
COPY docker-entrypoint.sh /usr/local/bin/chatwoot-mcp-entrypoint
RUN chmod 0755 /usr/local/bin/mcp-chatwoot /usr/local/bin/chatwoot-mcp-entrypoint

ENV BRIDGE_PORT=8102 \
    BRIDGE_PREFIX=/chatwoot \
    BRIDGE_TOKEN_FILE="" \
    CHATWOOT_BASE_URL="" \
    CHATWOOT_API_TOKEN_FILE="" \
    CHATWOOT_ACCOUNT_ID="64"

EXPOSE 8102

ENTRYPOINT ["/usr/local/bin/chatwoot-mcp-entrypoint"]
