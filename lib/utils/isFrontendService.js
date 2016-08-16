/**
 * Service is contained in specified whitelist
 * @param serviceName
 * @param whitelist
 * @returns {boolean}
 */
const isFrontendService = (serviceName, whitelist) => {
  return whitelist.reduce((isFrontend, pattern) => {
    const regexp = new RegExp(`^${pattern}$`);
    const inWhitelist = regexp.test(serviceName);

    return inWhitelist || isFrontend;
  }, false);
};

export default isFrontendService;
