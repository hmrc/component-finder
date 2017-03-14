/**
 * Format serviceResults object
 * <repository-name> (Github location) [result count]
 *
 * @param serviceResults
 * @returns {string}
 */
const formatter = (serviceResults) => {
  return `${serviceResults.name} (${serviceResults.github}) [${serviceResults.count}]`
}

module.exports = formatter
