/**
 * convert a header string into a header object
 * @param headerString
 * @returns {*}
 */
const toHeaderObj = headerString => {
  return headerString.split(';')
    .reduce((obj, headerDetails) => {
      const [headerProperty, headerValue] = headerDetails.split(':');
      obj[headerProperty] = headerValue;
      return obj;
    }, {});
};

export default toHeaderObj;
