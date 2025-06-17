import { ZodObject } from "zod";

export interface ApiToolConfig<TArgs extends object = any> {
  name: string;
  description: string;
  apiEndpoint: string;
  inputSchema: ZodObject<any>;
  payloadMapper: (args: TArgs) => Record<string, any>;
  responseFormatter: (data: any) => string;
  method?: "GET" | "POST";
  resources?: string[];
}
