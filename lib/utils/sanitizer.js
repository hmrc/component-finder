/**
 * Remove .# from the start of CSS selectors
 * Remove psuedo selectors from the end
 * Remove direct child selectors, universal selectors, attribute selectors, general sibling combinator, next sibling,
 * extraneous whitespace
 *
 * @param searchString
 * @returns {Array}
 */
const sanitizer = (searchString) => {

  const preparedSearchString = searchString
    .replace(/[>*~+]/g, '')
    .replace(/\s\s+/g, ' ')
    .replace(/\[[^\]]+\]/g, '')
    .trim();

  const searchTerms = preparedSearchString.split(',');
  const sanitisedSearchTerms = searchTerms.map((term) => {

    const selectorParts = term.split(' ');
    const selector = selectorParts.length > 1
      ? selectorParts[(selectorParts.length -1)]
      : term;

    return selector.replace(/^[.#]/, '').replace(/:.*$/, '');
  });

  return sanitisedSearchTerms;
};

export default sanitizer;
