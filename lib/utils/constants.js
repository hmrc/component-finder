import {EOL} from 'os';

module.exports = {
  CONSTANTS: {
    FILE_EXTENSION_DEFAULT: 'html'
  },
  ERRORS: {
    NO_SEARCH_STRING: `${EOL}MUST pass a search string as the FIRST option to Component Finder.${EOL}${EOL}`,
    NO_FILE_EXTENSION: `${EOL}No File Extensions Specified with "-f" option. ` +
                         'Pass a comma separated list. ' +
                         `(Omit spaces or enclose in quotes)${EOL}` +
                         `e.g. "./cf <SEARCH_STRING> -f html,scala"${EOL}${EOL}`
  }
};
