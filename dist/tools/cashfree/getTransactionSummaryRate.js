import { z } from "zod";
import { formatDateTimeForCashfree } from "../../lib/formatters.js";
import { baseCashfreeToolArgs } from "../types.js";
const getTransactionSummaryRate = {
    name: "getTransactionSummaryRate",
    description: "Summary of transaction performance per payment method — success/failure/decline rates, total count of transactions, and more count based metrics.",
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
    responseFormatter: (data) => `Transaction Summary Rate:\n${JSON.stringify(data, null, 2)}`,
};
export default getTransactionSummaryRate;
