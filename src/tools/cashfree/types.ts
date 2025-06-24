import { ZodObject } from "zod";

export interface ApiToolConfig<TArgs extends object = any> {
  name: string;
  description: string;
  apiEndpoint: string;
  inputSchema: ZodObject<any>;
  payloadMapper: (args: TArgs) => Record<string, any>;
  responseFormatter: (data: any) => string | object;
  method?: "GET" | "POST";
  resources?: string[];
  enableRetry?: boolean; // Enable retry logic for tools that may return empty data during DB processing
  maxRetries?: number; // Maximum number of retries (default 3)
  backoffSeconds?: number; // Seconds to wait between retries (default 5)
  handler?: (payload: TArgs) => Promise<any>; // <-- add this
}
