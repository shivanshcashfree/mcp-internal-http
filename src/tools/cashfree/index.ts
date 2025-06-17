import getInternalAnalytics from "./getInternalAnalytics.js";
import getMerchantByName from "./getMerchantByName.js";
import { ApiToolConfig } from "./types.js";

export const cashfreeApiDefinitions: ApiToolConfig[] = [
  getMerchantByName,
  getInternalAnalytics,
];

export default cashfreeApiDefinitions;
export {
  getInternalAnalytics,
  getMerchantByName,
  ApiToolConfig,
};