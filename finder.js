import {EOL} from 'os';
import clone from './lib/clone';
import search from './lib/search';
import sanitizer from './lib/utils/sanitizer';
import serviceCatalogue from './lib/serviceCatalogue';
import isFrontendService from './lib/utils/isFrontendService';

try {
  var config = require('./config.json');
}
catch(err) {
  process.stdout.write(`${EOL}No config.json file found.${EOL}Please see README.md for details.${EOL}`);
  process.exit();
};

let fileExtension;

const searchString = process.argv[2];
const searchMode = process.argv[3] || '';
const sanitisedSearchString = sanitizer(searchString);

console.log('Sanitised Search String : ', sanitisedSearchString);
console.log('Search Mode : ', searchMode);

serviceCatalogue.getProjects(config.api)
  .then(services => services.filter(service => isFrontendService(service.name, config.whitelist)))
  .then(frontendServices => clone(frontendServices))
  .then(() => search(sanitisedSearchString, fileExtension, searchMode))
  .catch(err => console.error(err));
