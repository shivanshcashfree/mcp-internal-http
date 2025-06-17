import { z } from "zod";
import { formatDateTimeForCashfree } from "../../lib/formatters.js";
import { baseCashfreeToolArgs } from "../types.js";
const getTransactionWithEvents = {
    name: "getTransactionWithEvents",
    description: `Transaction analytics enriched with incident data for root-cause analysis and outage correlation.`,
    apiEndpoint: "/api/merchant/v1/router/analytics/transactionWithEvents",
    inputSchema: baseCashfreeToolArgs.extend({
        aggregateTerm: z.string().optional().default("PAYMENT_METHOD"),
        filter: z.record(z.any()).optional().default({}),
    }),
    resources: ["docs://getTransactionWithEvents"],
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
    responseFormatter: (data) => `Transaction With Events:\n${JSON.stringify(data, null, 2)}`,
};
export default getTransactionWithEvents;
