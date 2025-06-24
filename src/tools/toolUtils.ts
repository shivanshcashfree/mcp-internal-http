import { makeApiCall, makeApiCallWithRetry } from "../lib/apiClient.js";
import { CASHFREE_API_BASE_URL } from "../config/constants.js";
import { ApiToolConfig } from "./cashfree/types.js";

export function createToolHandler(tool: ApiToolConfig<any>) {
  return async (args: any) => {
    try {
      const payload = tool.payloadMapper(args);

      // If the tool has a direct handler (for elasticsearch), use it
      if (typeof tool.handler === 'function') {
        const data = await tool.handler(payload);
        const formattedResponse = tool.responseFormatter(data);
        const responseText = typeof formattedResponse === 'string'
          ? formattedResponse
          : JSON.stringify(formattedResponse, null, 2);
        return {
          content: [
            { type: "text" as const, text: responseText },
          ],
        };
      }

      // Handle special case where merchantId needs to be appended to URL
      let endpoint = tool.apiEndpoint;
      if (payload._merchantIdForUrl) {
        endpoint = `${tool.apiEndpoint}/${payload._merchantIdForUrl}`;
        delete payload._merchantIdForUrl;
      }

      // --- CHANGED: Select base URL dynamically ---
      let baseUrl: string;
      if (endpoint.startsWith("/elasticsearch/")) {
        baseUrl = process.env.ES_URL || "http://localhost:9200";
      } else {
        baseUrl = CASHFREE_API_BASE_URL;
      }

      const data = tool.enableRetry
        ? await makeApiCallWithRetry(
            baseUrl,
            endpoint,
            payload,
            tool.method ?? "POST",
            tool.maxRetries ?? 3,
            tool.backoffSeconds ?? 5,
          )
        : await makeApiCall(
            baseUrl,
            endpoint,
            payload,
            tool.method ?? "POST",
          );

      if (!data) {
        return {
          isError: true,
          content: [{ type: "text" as const, text: "API call failed - no data returned" }],
        };
      }

      const formattedResponse = tool.responseFormatter(data);
      const responseText = typeof formattedResponse === 'string'
        ? formattedResponse
        : JSON.stringify(formattedResponse, null, 2);

      return {
        content: [
          { type: "text" as const, text: responseText },
        ],
      };
    } catch (error: any) {
      return {
        isError: true,
        content: [{ type: "text" as const, text: `Error: ${error.message}` }],
      };
    }
  };
}
