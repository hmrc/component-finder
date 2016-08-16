import serviceCatalogue from './lib/serviceCatalogue';
import isFrontendService from './lib/utils/isFrontendService';
import search from './lib/search';
import config from './config';
const searchString = process.argv[2];

serviceCatalogue.getServices()
  .then(services => services.filter(service => isFrontendService(service.name, config.whiteList)))
  .then(frontendServices => serviceCatalogue.clone(frontendServices))
  .then(() => search(searchString))
  .catch(err => console.error(err));
