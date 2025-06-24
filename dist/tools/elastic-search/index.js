// Exports Elasticsearch tool definitions for MCP server
import { z } from 'zod';
import { esClient } from './esClient.js'; // <-- import your shared client
// Each tool definition should match the format used in tools/cashfree/index.ts
const listIndicesInputSchema = z.object({
    indexPattern: z.string().min(1, 'Index pattern is required'),
});
const listIndices = {
    name: 'list_indices',
    description: 'List all available Elasticsearch indices',
    apiEndpoint: '', // not used when handler is present
    inputSchema: listIndicesInputSchema,
    payloadMapper: (args) => ({ indexPattern: args.indexPattern }),
    responseFormatter: (data) => data,
    async handler({ indexPattern }) {
        const response = await esClient.cat.indices({
            index: indexPattern,
            format: 'json',
        });
        return response;
    },
};
import getMappings from './getMappings.js';
import search from './search.js';
import getShards from './getShards.js';
export const elasticsearchToolDefinitions = [
    listIndices,
    getMappings,
    search,
    getShards,
];
export default elasticsearchToolDefinitions;
export { listIndices, getMappings, search, getShards, };
