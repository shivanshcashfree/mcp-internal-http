import { z } from 'zod';
import { esClient } from './esClient.js';
const listIndicesInputSchema = z.object({
    indexPattern: z.string().min(1, 'Index pattern is required'),
});
const listIndices = {
    name: 'list_indices',
    description: 'List all available Elasticsearch indices',
    apiEndpoint: '', // not used
    inputSchema: listIndicesInputSchema,
    payloadMapper: (args) => ({ indexPattern: args.indexPattern }),
    responseFormatter: (data) => data,
    // THIS IS IMPORTANT:
    async handler({ indexPattern }) {
        const response = await esClient.cat.indices({
            index: indexPattern,
            format: 'json',
        });
        return response;
    },
};
export default listIndices;
