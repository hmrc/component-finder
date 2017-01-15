import {EOL} from 'os';

module.exports = {
  CONSTANTS: {
    CLASS: 'class',
    TAG: 'tag',
    ATTRIBUTE: 'attribute',
    FILE_EXTENSION_DEFAULT: 'html'
  },
  ERRORS: {
    NO_SEARCH_STRING: `${EOL}MUST pass a search string as the FIRST option to Component Finder.${EOL}${EOL}`,
    MULTIPLE_MODES: `${EOL}Class, Tag, & Attribute search modes are optional, but mutually exclusive. ` +
                    `Please select a maximum of 1.${EOL}` +
                    `e.g. "./cf <SEARCH_STRING> -c"${EOL}${EOL}`,
    NO_FILE_EXTENSION: `${EOL}No File Extensions Specified with "-f" option. ` +
                         'Pass a comma separated list. ' +
                         `(Omit spaces or enclose in quotes)${EOL}` +
                         `e.g. "./cf <SEARCH_STRING> -f html,scala"${EOL}${EOL}`
  }
};
