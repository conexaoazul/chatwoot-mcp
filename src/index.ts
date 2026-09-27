import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { ChatwootClient } from "@/client.ts";
import { createServer } from "@/server.ts";

const baseUrl = process.env.CHATWOOT_BASE_URL;
const apiToken = process.env.CHATWOOT_API_TOKEN;

if (!baseUrl) {
  console.error("CHATWOOT_BASE_URL environment variable is required");
  process.exit(1);
}

if (!apiToken) {
  console.error("CHATWOOT_API_TOKEN environment variable is required");
  process.exit(1);
}

const client = new ChatwootClient(baseUrl, apiToken);

serveStdio(() => createServer(client));
