import { formatDateTimeForCashfree } from "../../lib/formatters.js";
import { baseCashfreeToolArgs } from "../types.js";
const getTransactionInsights = {
    name: "getTransactionInsights",
    description: "To get json response of array of insights eg. `Upi has 50.00% more average success rate than other modes`",
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
    responseFormatter: (data) => `Transaction Insights:\n${JSON.stringify(data, null, 2)}`,
};
export default getTransactionInsights;
