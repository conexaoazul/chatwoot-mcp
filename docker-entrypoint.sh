#!/bin/sh
set -eu

BRIDGE_TOKEN="${BRIDGE_TOKEN:-}"
CHATWOOT_API_TOKEN="${CHATWOOT_API_TOKEN:-}"

if [ -n "${BRIDGE_TOKEN_FILE:-}" ]; then
  BRIDGE_TOKEN="$(cat "$BRIDGE_TOKEN_FILE")"
fi

if [ -n "${CHATWOOT_API_TOKEN_FILE:-}" ]; then
  CHATWOOT_API_TOKEN="$(cat "$CHATWOOT_API_TOKEN_FILE")"
fi

export BRIDGE_TOKEN CHATWOOT_API_TOKEN

exec supergateway   --stdio "mcp-chatwoot"   --outputTransport streamableHttp   --port "$BRIDGE_PORT"   --streamableHttpPath "$BRIDGE_PREFIX/mcp"   --healthEndpoint "$BRIDGE_PREFIX/health"   --header "Authorization: Bearer $BRIDGE_TOKEN"
