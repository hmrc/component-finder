import config from './config';
import clone from './lib/clone';
import search from './lib/search';
import serviceCatalogue from './lib/serviceCatalogue';
import isFrontendService from './lib/utils/isFrontendService';

const searchString = process.argv[2];

serviceCatalogue.getProjects(config.api.paths)
  .then(services => services.filter(service => isFrontendService(service.name, config.whitelist)))
  .then(frontendServices => clone(frontendServices))
  .then(() => search(searchString))
  .catch(err => console.error(err));
