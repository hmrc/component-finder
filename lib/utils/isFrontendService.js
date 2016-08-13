/**
 * is contained in specified whitelist or follows the '-frontend' repository naming convention
 * @param serviceName
 * @returns {boolean}
 */
const isFrontendService = (serviceName, whitelist) => {
  let isFrontend = whitelist.filter(pattern => {
    let regexp = new RegExp(`^${pattern}$`);
    return regexp.test(serviceName);
  });

  return isFrontend.length !== 0;
};

export default isFrontendService;
