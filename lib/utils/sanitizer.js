/**
 * Remove .# from the start of CSS selectors
 * Remove psuedo selectors from the end
 * Remove direct child selectors, universal selectors, attribute selectors, general sibling combinator, next sibling,
 * extraneous whitespace
 *
 * @param searchString
 * @returns {string}
 *
 */
const sanitizer = (searchString) => {
  const preparedSearchString = searchString
    .replace(/[>*~+]/g, '')
    .replace(/\s\s+/g, ' ')
    .replace(/\[[^\]]+]/g, '')
    .trim()

  const selectorParts = preparedSearchString.split(' ')
  const selector = selectorParts.length > 1
    ? selectorParts[(selectorParts.length - 1)]
    : preparedSearchString

  return selector.replace(/^[.#]/, '').replace(/:.*$/, '')
}

module.exports = sanitizer
