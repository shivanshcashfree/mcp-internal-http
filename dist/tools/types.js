import { z } from "zod";
export const baseCashfreeToolArgs = z.object({
    startDateTime: z.string().describe("Start datetime (YYYY-MM-DD HH:MM:SS)"),
    endDateTime: z.string().describe("End datetime (YYYY-MM-DD HH:MM:SS)"),
    merchantId: z.number().describe("Merchant ID"),
    timeRange: z.number().describe("Time range"),
    duration: z.string().describe("Duration unit ('DAYS', 'HOURS')"),
    aggregateTerm: z.string().default("PAYMENT_METHOD").describe("Aggregation term(UPI_PSP,NET_BANKING_BANK_NAME,PAYMENT_METHOD,CARD_BANK_NAME,PLATFORM)")
});
