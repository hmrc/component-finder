import {EOL} from 'os';

module.exports = {
  CONSTANTS: {
    FILE_EXTENSION_DEFAULT: 'html',
    COMMAND_USAGE: 'Usage: node $0 [-f file-extensions] search_string',
    COMMAND_EXAMPLE: 'index.js -f html,htm search_string'
  },
  ERRORS: {
    NO_SEARCH_STRING: `${EOL}MUST pass a search string to Component Finder.${EOL}${EOL}`,
    NO_FILE_EXTENSION: `${EOL}No File Extensions Specified with "-f" option. ` +
                         'Pass a comma separated list. ' +
                         `(Omit spaces or enclose in quotes)${EOL}` +
                         `e.g. "node index.js -f html,scala search_string"${EOL}${EOL}`
  }
};
