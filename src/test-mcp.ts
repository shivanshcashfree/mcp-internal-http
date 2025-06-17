// test-mcp-client.ts or test-mcp-client.js
const MCP_SERVER_URL = "http://localhost:4000/mcp"; // Your MCP server endpoint
const AUTH_TOKEN = "Bearer 1234"; // Replace with real auth token if needed

// Helper: Common headers without session yet
const commonHeaders = {
  "Content-Type": "application/json",
  "Accept": "application/json, text/event-stream",
  "Authorization": AUTH_TOKEN,
};

async function testPaymentMCPServer() {
  console.log("🧪 Testing Payment Analytics MCP Server...\n");

  let sessionId = null;

  // STEP 0: Start Session
  try {
    console.log("0️⃣ Starting MCP session...");

    const sessionStartResponse = await fetch(MCP_SERVER_URL, {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 0,
        method: "session/start",
        params: {},
      }),
    });

    const sessionStartResult = await sessionStartResponse.json();
    if (sessionStartResult.result?.sessionId) {
      sessionId = sessionStartResult.result.sessionId;
      console.log("✅ Session started:", sessionId, "\n");
    } else {
      throw new Error("Failed to start session: " + JSON.stringify(sessionStartResult));
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error("❌ Failed to start session:", err.message);
    } else {
      console.error("❌ Failed to start session:", err);
    }
    process.exit(1);
  }

  const sessionHeaders = {
    ...commonHeaders,
    "Mcp-Session-Id": sessionId,
  };

  // STEP 1: tools/list
  try {
    console.log("1️⃣ tools/list...");
    const listResponse = await fetch(MCP_SERVER_URL, {
      method: "POST",
      headers: sessionHeaders,
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/list",
        params: {},
      }),
    });

    const listResult = await listResponse.json();
    console.log("Available tools:", listResult.result?.tools?.map((t: any) => t.name));
    console.log("✅ tools/list passed\n");
  } catch (err) {
    if (err instanceof Error) {
      console.error("❌ tools/list failed:", err.message);
    } else {
      console.error("❌ tools/list failed:", err);
    }
    process.exit(1);
  }

  // STEP 2: tools/call
  try {
    const toolToTest = "getInternalAnalytics"; // Change this to a real tool name
    console.log(`2️⃣ Calling tool '${toolToTest}'...`);

    const callResponse = await fetch(MCP_SERVER_URL, {
      method: "POST",
      headers: sessionHeaders,
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
          name: toolToTest,
          arguments: {
            startDateTime: "2023-01-01 00:00:00",
            endDateTime: "2023-01-01 23:59:59",
            merchantId: 12345,
            timeRange: 24,
            duration: "HOURS",
            aggregateTerm: "PAYMENT_METHOD",
            filter: {},
          },
        },
      }),
    });

    const callResult = await callResponse.json();
    console.log(`✅ '${toolToTest}' result:\n`, JSON.stringify(callResult.result, null, 2));
  } catch (err) {
    if (err instanceof Error) {
      console.error(`❌ tools/call failed:`, err.message);
    } else {
      console.error(`❌ tools/call failed:`, err);
    }
    process.exit(1);
  }

  console.log("🎉 All tests passed!");
}

testPaymentMCPServer();
