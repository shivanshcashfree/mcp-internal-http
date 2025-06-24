import { z } from 'zod';
import { ApiToolConfig } from '../cashfree/types.js';
import { esClient } from './esClient.js';

const searchInputSchema = z.object({
  index: z.string().min(1, 'Index name is required'),
  queryBody: z.record(z.any()),
});

const search: ApiToolConfig = {
  name: 'search',
  description: 'Perform an Elasticsearch search with the provided query DSL. Highlights are always enabled.',
  apiEndpoint: '', // not used
  inputSchema: searchInputSchema,
  payloadMapper: (args) => ({ index: args.index, queryBody: args.queryBody }),
  responseFormatter: (data) => data,
  async handler({ index, queryBody }) {
    const result = await esClient.search({
      index,
      ...queryBody,
    });
    return result;
  },
};

export default search;
