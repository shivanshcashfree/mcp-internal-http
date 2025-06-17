import getInternalAnalytics from "./getInternalAnalytics.js";
import { ApiToolConfig } from "./types.js";

export const cashfreeApiDefinitions: ApiToolConfig[] = [
  getInternalAnalytics
];

export default cashfreeApiDefinitions;
export {
  getInternalAnalytics,
  ApiToolConfig,
};
