import { z } from 'zod';
import { esClient } from './esClient.js';
const getShardsInputSchema = z.object({
    index: z.string().optional(),
});
const getShards = {
    name: 'get_shards',
    description: 'Get shard information for all or specific indices',
    apiEndpoint: '', // not used
    inputSchema: getShardsInputSchema,
    payloadMapper: (args) => ({ index: args.index }),
    responseFormatter: (data) => data,
    async handler({ index }) {
        const response = await esClient.cat.shards({
            index,
            format: 'json',
        });
        return response;
    },
};
export default getShards;
