import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express, { Request, Response } from "express";
import { randomUUID } from "crypto";
import cashfreeApiDefinitions from "./tools/cashfree/index.js";
import { createToolHandler } from "./tools/toolUtils.js";
import fs from "fs";
import path from "path";
import { zodToJsonSchema } from "zod-to-json-schema"; // Import zodToJsonSchema
import elasticsearchToolDefinitions from "./tools/elastic-search/index.js";

console.log("DEBUG: Content of cashfreeApiDefinitions:", JSON.stringify(cashfreeApiDefinitions, null, 2));

const MCP_PORT = 4000;
const app = express();
app.use(express.json());

const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: () => randomUUID(),
});

const server = new McpServer(
  { name: "payment-analytics-mcp", version: "1.0.0" },
  {
    capabilities: { resources: {}, tools: {} },
  }
);


async function startApplication() {
  try {
    console.log("Starting MCP Server initialization...");

    console.log("Registering tools...");
    cashfreeApiDefinitions.forEach((tool) => {
      server.tool(
        tool.name,
        tool.description,
        tool.inputSchema.shape,
        createToolHandler(tool),
      );
    });
    elasticsearchToolDefinitions.forEach((tool) => {
      server.tool(
        tool.name,
        tool.description,
        tool.inputSchema.shape,
        createToolHandler(tool),
      );
    });
    console.log("Tools registered.");

    console.log("Registering resources...");
    try {
      const resourcePath = path.join(process.cwd(), "src/docs/getInternalAnalytics.md");
      console.log(`Attempting to read resource from: ${resourcePath}`);
      const content = fs.readFileSync(resourcePath, "utf8");
      server.resource(
        "docs://getInternalAnalytics",
        "docs://getInternalAnalytics",
        async () => {
          return {
            contents: [
              {
                uri: "docs://getInternalAnalytics",
                text: content,
                mimeType: "text/markdown",
              },
            ],
          };
        },
      );
      console.log("Resource 'docs://getInternalAnalytics' registered.");
    } catch (resourceError: any) {
      console.error("❌ Error registering resource (is src/docs/getInternalAnalytics.md present?):", resourceError.message);
      process.exit(1);
    }

    console.log("Connecting MCP server to transport...");
    await server.connect(transport);
    console.log("MCP server connected to transport successfully. Ready to handle requests.");

    console.log("Applying a small diagnostic delay (100ms) before starting Express listener...");
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log("Diagnostic delay finished.");

    app.post("/mcp", async (req: Request, res: Response) => {
      console.log("Received POST request to /mcp");
      const mcpRequest = {
        ...req.body,
        params: {
          ...(req.body.params || {}),
          _meta: {
            ...(req.body.params?._meta || {}),
            headers: {
              authorization: req.headers.authorization,
              ...(req.body.params?._meta?.headers || {}),
            },
          },
        },
      };
      console.log("Forwarding MCP request:", JSON.stringify(mcpRequest, null, 2));
      await transport.handleRequest(req, res, mcpRequest);
    });

    app.get("/mcp", async (req: Request, res: Response) => {
      console.log("Received GET request to /mcp");
      const mcpRequest = {
        method: typeof req.query.method === "string" ? req.query.method : "tools/list",
        params: {
          _meta: {
            headers: {
              authorization: req.headers.authorization,
            },
          },
        },
      };
      console.log("Forwarding MCP request:", JSON.stringify(mcpRequest, null, 2));
      await transport.handleRequest(req, res, mcpRequest);
    });

    app.listen(MCP_PORT, () => {
      console.log(`🚀 Payment Analytics MCP Server running on http://localhost:${MCP_PORT}/mcp`);
      console.log(`🔑 Ensure 'Authorization: Bearer <your_token>' header is included in requests if authentication is needed.`);
      console.log("🛠 Registered Tools:");
      cashfreeApiDefinitions.forEach((t) => console.log(` - ${t.name}`));
      elasticsearchToolDefinitions.forEach((t) => console.error(` - ${t.name}`));
      console.log("📚 Registered Resources:");
      console.log(" - docs://getInternalAnalytics");
    }).on('error', (err: any) => {
      console.error("❌ Express server startup error:", err.message);
      process.exit(1);
    });

  } catch (err: any) {
    console.error("❌ Critical MCP Server startup failed:", err.message);
    process.exit(1);
  }
}

startApplication();
