import { z } from 'zod';
import { ApiToolConfig } from '../cashfree/types.js';
import { esClient } from './esClient.js';

const getMappingsInputSchema = z.object({
  index: z.string().min(1, 'Index name is required'),
});

const getMappings: ApiToolConfig = {
  name: 'get_mappings',
  description: 'Get field mappings for a specific Elasticsearch index',
  apiEndpoint: '', // not used
  inputSchema: getMappingsInputSchema,
  payloadMapper: (args) => ({ index: args.index }),
  responseFormatter: (data) => data,
  async handler({ index }) {
    const mappingResponse = await esClient.indices.getMapping({ index });
    return mappingResponse[index]?.mappings ?? {};
  },
};

export default getMappings;
