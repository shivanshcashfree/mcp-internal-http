import { z } from "zod";
import { formatDateTimeForCashfree } from "../lib/formatters.js";
import { baseCashfreeToolArgs } from "./types.js";
// Each entry infers its own type — no `as` needed
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
  {
    name: "getTransactionWithEvents",
    description: `Transaction analytics enriched with incident data for root-cause analysis and outage correlation.
    Filters support:

- paymentMethod: "UPI", "NET_BANKING", "CARD"
- If paymentMethod is "UPI":
    - paymentMethodType: "UPI_COLLECT", "UPI_INTENT"
    - platform: "ANDROID", "IOS", "WEB", "S2S"
- If paymentMethod is "NET_BANKING":
    - platform: "ANDROID", "IOS", "WEB", "S2S"
- If paymentMethod is "CARD":
    - paymentMethodType: "CREDIT_CARD", "DEBIT_CARD"
    - cardType: "rupay", "mastercard", "visa", "maestro"
    - customerBank: e.g. "qrcode"
    - platform: "ANDROID", "IOS", "WEB", "S2S"`,
    apiEndpoint: "/api/merchant/v1/router/analytics/transactionWithEvents",
    inputSchema: baseCashfreeToolArgs.extend({
      aggregateTerm: z.string().optional().default("PAYMENT_METHOD"),
      filter: z.record(z.any()).optional().default({}),
    }),
    payloadMapper: (args) => ({
      startDateTime: formatDateTimeForCashfree(args.startDateTime),
      endDateTime: formatDateTimeForCashfree(args.endDateTime),
      merchantId: args.merchantId,
      timeRange: args.timeRange,
      duration: args.duration,
      aggregateTerm: args.aggregateTerm ?? "PAYMENT_METHOD",
      failedReasonAggRequired: args.failedReasonAggRequired ?? false,
      filter: args.filter ?? {},
    }),
    responseFormatter: (data) =>
      `Transaction With Events:\n${JSON.stringify(data, null, 2)}`,
  },
  {
    name: "getTopPaymentErrors",
    description:
      "Get high-frequency payment error causes categorized by source, mode, and platform context.",
    apiEndpoint: "/api/merchant/v1/router/analytics/top-errors",
    inputSchema: baseCashfreeToolArgs.extend({
      paymentModes: z.array(z.string()).optional(),
      psps: z.array(z.string()).optional(),
      paymentMethodAnalytics: z.any().optional(),
      paymentMethodAnalyticsTypes: z.any().optional(),
      customerBanks: z.any().optional(),
      cardType: z.string().optional(),
      platforms: z.array(z.string()).optional(),
    }),
    payloadMapper: (args) => ({
      startDateTime: formatDateTimeForCashfree(args.startDateTime),
      endDateTime: formatDateTimeForCashfree(args.endDateTime),
      merchantId: args.merchantId,
      paymentModes: args.paymentModes,
      psps: args.psps,
      paymentMethodAnalytics: args.paymentMethodAnalytics,
      paymentMethodAnalyticsTypes: args.paymentMethodAnalyticsTypes,
      customerBanks: args.customerBanks,
      cardType: args.cardType,
      platforms: args.platforms,
    }),
    responseFormatter: (data) =>
      `Top Payment Errors:\n${JSON.stringify(data, null, 2)}`,
  },
  {
    name: "getDynamicRoutingImpact",
    description:
      "Analyze success rate and GMV impact from Dynamic Routing decisions.",
    apiEndpoint: "/api/merchant/v1/common/datalake/drImpact",
    inputSchema: z.object({
      startDate: z.string(),
      endDate: z.string(),
      merchantId: z.number(),
    }),
    method: "GET",
    payloadMapper: (args) => ({
      startDate: args.startDate,
      endDate: args.endDate,
      merchantId: args.merchantId,
    }),
    responseFormatter: (data) =>
      `Dynamic Routing Impact:\n${JSON.stringify(data, null, 2)}`,
  },
];
