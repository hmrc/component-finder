import {EOL} from 'os';
import clone from './lib/clone';
import search from './lib/search';
import sanitizer from './lib/utils/sanitizer';
import serviceCatalogue from './lib/serviceCatalogue';
import isFrontendService from './lib/utils/isFrontendService';
import parseOptions from './lib/utils/parseOptions';

try {
  var config = require('./config.json');
}
catch(err) {
  process.stdout.write(`${EOL}No config.json file found.${EOL}Please see README.md for details.${EOL}${EOL}`);
  process.exit(1);
};

const searchOptions = parseOptions(process.argv.slice(2));
if (searchOptions.optionErrors.length) {
  searchOptions.optionErrors.forEach(msg => {
    process.stdout.write(msg);
  });
  process.exit(1);
}

serviceCatalogue.getProjects(config.api)
  .then(services => services.filter(service => isFrontendService(service.name, config.whitelist)))
  .then(frontendServices => clone(frontendServices))
  .then(() => search(searchOptions))
  .catch(err => console.error(err));
