import { z } from "zod";
const getDynamicRoutingImpact = {
    name: "getDynamicRoutingImpact",
    description: "Analyze success rate and GMV impact from Dynamic Routing decisions.",
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
    responseFormatter: (data) => `Dynamic Routing Impact:\n${JSON.stringify(data, null, 2)}`,
};
export default getDynamicRoutingImpact;
