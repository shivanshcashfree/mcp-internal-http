import { z } from "zod";
import { ApiToolConfig } from "./types.js";

const getMerchantByName: ApiToolConfig = {
  name: "getMerchantByName",
  description: "Converts merchant name to merchant ID. Use this tool when the user provides a merchant name instead of a merchant ID. Returns one or more merchant IDs that match the provided merchant name.",
  apiEndpoint: "/commonmerchantsvc/merchants",
  inputSchema: z.object({
    merchantName: z.string().describe("Merchant name to search for"),
  }),
  method: "GET",
  payloadMapper: (args) => ({
    merchantName: args.merchantName,
    pageSize:100,
  }),
  responseFormatter: (data: any) => {
    if (!data || !data.content) {
      return "No merchants found with the given name.";
    }

    const merchants = data.content;
    const totalElements = data.totalElements || merchants.length;

    if (merchants.length === 0) {
      return "No merchants found with the given name.";
    }

    if (merchants.length === 1) {
      const merchant = merchants[0];
      return `Found 1 merchant:
Merchant ID: ${merchant.id}

You can now use merchant ID ${merchant.id} for analytics queries.`;
    }

    // Multiple merchants found
    let response = `Found ${totalElements} merchants matching the search:\n\n`;
    
    merchants.forEach((merchant: any, index: number) => {
      response += `${index + 1}. Merchant ID: ${merchant.id}\n`;
    });

    response += `\nDo not pickup the most frequent or old ID by yourself, instead please ask the user which merchant ID do they want to use for analytics by displaying all the ${totalElements} merchant IDs.`;
    
    return response;
  },
};

export default getMerchantByName;