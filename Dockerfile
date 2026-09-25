# Chatwoot MCP Bridge — Conexão Azul fork with Captain/Copilot tools
# Build the local TypeScript source so Conexão Azul extensions are actually shipped.

FROM oven/bun:1.1.38 AS build

WORKDIR /src

COPY package.json bun.lock bunfig.toml tsconfig.json ./
RUN HUSKY=0 bun install --frozen-lockfile

COPY src ./src
RUN HUSKY=0 bun run build

FROM node:22-alpine

RUN npm install -g --silent supergateway@3 \
    && npm cache clean --force

COPY --from=build /src/dist/index.js /opt/chatwoot-mcp/index.js
RUN chmod 0755 /opt/chatwoot-mcp/index.js

ENV BRIDGE_PORT=8102 \
    BRIDGE_PREFIX=/chatwoot \
    BRIDGE_TOKEN="" \
    CHATWOOT_BASE_URL="" \
    CHATWOOT_API_TOKEN="" \
    CHATWOOT_ACCOUNT_ID="64"

EXPOSE 8102

CMD ["sh", "-c", "supergateway --stdio \"node /opt/chatwoot-mcp/index.js\" --outputTransport streamableHttp --port ${BRIDGE_PORT} --streamableHttpPath ${BRIDGE_PREFIX}/mcp --healthEndpoint ${BRIDGE_PREFIX}/health --header \"Authorization: Bearer ${BRIDGE_TOKEN}\""]
