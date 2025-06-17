import { z } from "zod";
import { formatDateTimeForCashfree } from "../lib/formatters.js";
import { baseCashfreeToolArgs } from "./types.js";
export const cashfreeApiDefinitions = [
  {
    name: "getTransactionSummaryRate",
    description:
      "Summary of transaction performance per payment method — success/failure/decline rates.",
    apiEndpoint: "/api/merchant/v1/router/analytics/transaction/summary/rate",
    inputSchema: baseCashfreeToolArgs.extend({
      aggregateTerm: z.string().optional().default("PAYMENT_METHOD"),
      filter: z.record(z.any()).optional().default({}),
    }),
    payloadMapper: (args) => ({
      aggregateTerm: args.aggregateTerm ?? "PAYMENT_METHOD",
      filter: args.filter ?? {},
      merchantId: args.merchantId,
      startDateTime: formatDateTimeForCashfree(args.startDateTime),
      endDateTime: formatDateTimeForCashfree(args.endDateTime),
      timeRange: args.timeRange,
      duration: args.duration,
      failedReasonAggRequired: args.failedReasonAggRequired ?? false,
    }),
    responseFormatter: (data) =>
      `Transaction Summary Rate:\n${JSON.stringify(data, null, 2)}`,
  },
  {
    name: "getTransactionInsights",
    description: "LLM-readable transaction insights",
    apiEndpoint: "/api/merchant/v1/router/insights/transactions",
    inputSchema: baseCashfreeToolArgs,
    payloadMapper: (args) => ({
      startDateTime: formatDateTimeForCashfree(args.startDateTime),
      endDateTime: formatDateTimeForCashfree(args.endDateTime),
      timeRange: args.timeRange,
      duration: args.duration,
      merchantId: args.merchantId,
      failedReasonAggRequired: args.failedReasonAggRequired ?? false,
      aggregateTerm: args.aggregateTerm ?? "PAYMENT_METHOD",
    }),
    responseFormatter: (data) =>
      `Transaction Insights:\n${JSON.stringify(data, null, 2)}`,
  },
  {
    name: "getDetailedTransactionAnalytics",
    description:
      "Time-series transaction stats with multiple aggregateTerm like NET_BANKING_BANK_NAME, UPI_PSP, CARD_BANK_NAME",
    apiEndpoint: "/api/merchant/v1/router/analytics/transaction",
    inputSchema: baseCashfreeToolArgs.extend({
      aggregateTerm: z.string().optional().default("PAYMENT_METHOD"),
    }),
    payloadMapper: (args) => ({
      startDateTime: formatDateTimeForCashfree(args.startDateTime),
      endDateTime: formatDateTimeForCashfree(args.endDateTime),
      timeRange: args.timeRange,
      duration: args.duration,
      merchantId: args.merchantId,
      failedReasonAggRequired: args.failedReasonAggRequired ?? false,
      aggregateTerm: args.aggregateTerm ?? "PAYMENT_METHOD",
    }),
    responseFormatter: (data) =>
      `Detailed Transaction Analytics:\n${JSON.stringify(data, null, 2)}`,
  },
];
