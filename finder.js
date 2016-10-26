import {EOL} from 'os';
import clone from './lib/clone';
import {searchMarkup as search} from './lib/search';
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

const searchString = process.argv[2];
const sanitisedSearchTerms = sanitizer(searchString);

serviceCatalogue.getProjects(config.api)
  .then(services => services.filter(service => isFrontendService(service.name, config.whitelist)))
  .then(frontendServices => clone(frontendServices))
  .then(() => search(sanitisedSearchTerms, 'target/**/*.html'))
  .catch(err => console.error(err));
