/**
 * Remove .# from the start of CSS selectors and remove psuedo selectors
 * @param searchString
 * @returns {Array}
 */
const sanitizer = (searchString) => {
  const searchTerms = searchString.split(',');
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
