import { z } from "zod";
import { formatDateTimeForCashfree } from "../../lib/formatters.js";
import { baseCashfreeToolArgs } from "../types.js";
const getDetailedTransactionAnalytics = {
    name: "getDetailedTransactionAnalytics",
    description: "Time-series transaction stats with multiple aggregateTerm like NET_BANKING_BANK_NAME, UPI_PSP, CARD_BANK_NAME",
    apiEndpoint: "/api/merchant/v1/router/analytics/transaction",
    inputSchema: baseCashfreeToolArgs.extend({
        aggregateTerm: z.string().optional().default("PAYMENT_METHOD"),
    }),
    resources: ["docs://getDetailedTransactionAnalytics"],
    payloadMapper: (args) => ({
        startDateTime: formatDateTimeForCashfree(args.startDateTime),
        endDateTime: formatDateTimeForCashfree(args.endDateTime),
        timeRange: args.timeRange,
        duration: args.duration,
        merchantId: args.merchantId,
        failedReasonAggRequired: args.failedReasonAggRequired ?? false,
        aggregateTerm: args.aggregateTerm ?? "PAYMENT_METHOD",
    }),
    responseFormatter: (data) => `Detailed Transaction Analytics:\n${JSON.stringify(data, null, 2)}`,
};
export default getDetailedTransactionAnalytics;
