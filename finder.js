import fs from 'fs';
import {EOL} from 'os';
import clone from './lib/clone';
import search from './lib/search';
import serviceCatalogue from './lib/serviceCatalogue';
import isFrontendService from './lib/utils/isFrontendService';

try {
  var config = require('./config.json');
}
catch(err) {
  process.stdout.write(`No config.json file found ${EOL}`);
  process.exit();
};

const searchString = process.argv[2];

serviceCatalogue.getProjects(config.api)
  .then(services => services.filter(service => isFrontendService(service.name, config.whitelist)))
  .then(frontendServices => clone(frontendServices))
  .then(() => search(searchString))
  .catch(err => console.error(err));
