import { z } from "zod";

export const baseCashfreeToolArgs = z.object({
  startDateTime: z.string().describe("Start datetime (YYYY-MM-DD HH:MM:SS)"),
  endDateTime: z.string().describe("End datetime (YYYY-MM-DD HH:MM:SS)"),
  merchantId: z.number().describe("Merchant ID"),
  timeRange: z.number().describe("Time range"),
  duration: z.string().describe("Duration unit ('DAYS', 'HOURS')"),
  aggregateTerm: z.string().default("PAYMENT_METHOD").describe("Aggregation term(UPI_PSP,NET_BANKING_BANK_NAME,PAYMENT_METHOD,CARD_BANK_NAME,PLATFORM)")
});

export type CommonToolArgs = z.infer<typeof baseCashfreeToolArgs> & {
  aggregateTerm?: string;
  filter?: Record<string, any>;
};

// New schema for Dexter APIs that only need date ranges
export const baseDexterToolArgs = z.object({
  startDate: z.string().describe("Start date (YYYY-MM-DD)"),
  endDate: z.string().describe("End date (YYYY-MM-DD)"),
  merchantId: z.string().describe("Merchant ID as string"),
});

export type DexterToolArgs = z.infer<typeof baseDexterToolArgs>;

// Extended Dexter args for APIs that need additional parameters
export const extendedDexterToolArgs = baseDexterToolArgs.extend({
  path: z.string().describe("API path (e.g., /orders)"),
  method: z.string().describe("HTTP method (e.g., POST, GET)"),
  errorCode: z.string().optional().describe("Specific error code to filter"),
  limit: z.number().optional().describe("Number of results to return"),
  pageNumber: z.number().optional().describe("Page number for pagination"),
});

export type ExtendedDexterToolArgs = z.infer<typeof extendedDexterToolArgs>;
