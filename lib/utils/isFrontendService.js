const config = require('./../../config');
const whiteListedFrontendServices = config.serviceWhiteList;

/**
 * is contained in specified whitelist or follows the '-frontend' repository naming convention
 * @param serviceName
 * @returns {boolean}
 */
const isFrontendService = serviceName => {
  return serviceName.includes('-frontend') || whiteListedFrontendServices.indexOf(serviceName) >= 0;
};

module.exports = isFrontendService;
