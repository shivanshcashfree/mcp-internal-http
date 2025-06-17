import { z } from "zod";
import { formatDateTimeForCashfree } from "../../lib/formatters.js";
import { baseCashfreeToolArgs } from "../types.js";
const getInternalAnalytics = {
    name: "getInternalAnalytics",
    description: `Retrieves detailed transaction analytics for a specific merchant ID, including payment method breakdowns, transaction counts, amounts, and success/failure rates over time. 

WORKFLOW: If user provides merchant name, first use getMerchantByName tool to get the merchant ID, then use this tool.

PAYMENT METHOD FILTERS:
- paymentMethod: "UPI", "NET_BANKING", "CARD"

UPI-specific filters:
- paymentMethodType: "UPI_COLLECT", "UPI_INTENT"  
- platform: "ANDROID", "IOS", "WEB", "S2S"

NET_BANKING-specific filters:
- platform: "ANDROID", "IOS", "WEB", "S2S"

CARD-specific filters:
- paymentMethodType: "CREDIT_CARD", "DEBIT_CARD"
- cardType: "rupay", "mastercard", "visa", "maestro"
- customerBank: specify bank name (e.g., "qrcode")
- platform: "ANDROID", "IOS", "WEB", "S2S"`,
    apiEndpoint: "/dexter-report/v1/router/analytics/transaction",
    inputSchema: baseCashfreeToolArgs.extend({
        filter: z.record(z.any()).optional().default({}),
    }),
    resources: ["docs://getInternalAnalytics"],
    payloadMapper: (args) => ({
        aggregateTerm: args.aggregateTerm ?? "PAYMENT_METHOD",
        startDateTime: formatDateTimeForCashfree(args.startDateTime),
        endDateTime: formatDateTimeForCashfree(args.endDateTime),
        timeRange: args.timeRange,
        duration: args.duration,
        merchantId: args.merchantId,
        filter: args.filter ?? {},
    }),
    responseFormatter: (data) => `Internal Transaction Analytics:\n${JSON.stringify(data, null, 2)}`,
};
export default getInternalAnalytics;
