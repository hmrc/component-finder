import yargs from 'yargs';
import {EOL} from 'os';

import sanitizer from './sanitizer';
import {CONSTANTS, ERRORS} from './constants';

function parseSearchString (args) {
  const searchErrors = [];
  let searchString = args[0];

  if (searchString && typeof(searchString) === 'string') {
    searchString = sanitizer(searchString);
  } else {
    searchErrors.push(ERRORS.NO_SEARCH_STRING);
  }

  return {
    searchString,
    searchErrors
  }
}

function parseFileExtensions (argv) {
  const extensionErrors = [];
  let fileExtensions = CONSTANTS.FILE_EXTENSION_DEFAULT;
  let extensionError    = false;

  const passedExtensions = argv.f;
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
  const argv = yargs.usage(CONSTANTS.COMMAND_USAGE)
                    .example(CONSTANTS.COMMAND_EXAMPLE)
                    .alias('f', 'file')
                    .parse(args);
  const optionErrors = [];

  const {searchString, searchErrors} = parseSearchString(argv._);
  optionErrors.push(...searchErrors);

  const {fileExtensions, extensionErrors} = parseFileExtensions(argv);
  optionErrors.push(...extensionErrors);

  return {
    searchString,
    fileExtensions,
    optionErrors
  };
}
