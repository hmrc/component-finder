import minimist from 'minimist';
import {EOL} from 'os';

import sanitizer from './sanitizer';
import {CONSTANTS, ERRORS} from './constants';

function parseSearchMode (argv) {
  const modeErrors  = [];
  let searchModes   = 0;
  let searchMode    = '';

  const classSearch = argv['c']
                   || argv['class'];
  if (classSearch) {
    searchMode += CONSTANTS.CLASS;
    searchModes++;
  }

  const tagSearch   = argv['t']
                   || argv['tag']
                   || argv['tags'];
  if (tagSearch) {
    searchMode += CONSTANTS.TAG;
    searchModes++;
  }

  const attrSearch  = argv['a']
                   || argv['attr']
                   || argv['attribute']
                   || argv['attributes'];
  if (attrSearch) {
    searchMode += CONSTANTS.ATTRIBUTE;
    searchModes++;
  }

  if (searchModes > 1) {
    modeErrors.push(ERRORS.MULTIPLE_MODES);
  }

  return {
    searchMode,
    modeErrors
  };
}

function parseFileExtensions (argv) {
  const extensionErrors = [];
  let fileExtensions = CONSTANTS.FILE_EXTENSION_DEFAULT;
  let extensionError    = false;

  const passedExtensions = argv['f']
                       || argv['file']
                       || argv['files'];
  if (passedExtensions) {
    if (typeof(passedExtensions) === 'string') {
      fileExtensions = passedExtensions.replace(/[\.\s]/g, '')
                                       .split(',')
                                       .filter(extension => !!extension); // filter empty strings
      switch(fileExtensions.length) {
        case 0:
          extensionError = true;
          break;
        case 1:
          fileExtensions = fileExtensions[0];
          break;
        default:
          fileExtensions = '{' + fileExtensions.join(',') + '}';
      }
    } else {
      extensionError = true;
    }
  }

  if (extensionError) {
    extensionErrors.push(ERRORS.NO_FILE_EXTENSION);
  }

  return {
    fileExtensions,
    extensionErrors
  }
}

module.exports = args => {
  const argv = minimist(args.slice(3));
  const optionErrors = [];
  let searchString = args[2] || '';

  if (searchString) {
    searchString = sanitizer(searchString);
  } else {
    optionErrors.push(ERRORS.NO_SEARCH_STRING);
  }

  const {searchMode, modeErrors} = parseSearchMode(argv);
  optionErrors.push(...modeErrors);

  const {fileExtensions, extensionErrors} = parseFileExtensions(argv);
  optionErrors.push(...extensionErrors);

  return {
    searchString,
    searchMode,
    fileExtensions,
    optionErrors
  };
}
