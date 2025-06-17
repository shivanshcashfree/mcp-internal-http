import { z } from "zod";
import { formatDateTimeForCashfree } from "../../lib/formatters.js";
import { baseCashfreeToolArgs } from "../types.js";
const getInternalAnalytics = {
    name: "getInternalAnalytics",
    description: `Get info about transactions of merchant, grouped by payment method (UPI, Wallet, Card, etc.) along with counts, amounts, and success/failure details over time.
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
