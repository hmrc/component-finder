import serviceCatalogue from './lib/serviceCatalogue';
import isFrontendService from './lib/utils/isFrontendService';
import search from './lib/search';
const searchString = process.argv[2];
const whitelist = process.env.WHITELIST.split(',');

serviceCatalogue.getServices()
  .then(services => services.filter(service => isFrontendService(service.name, whitelist)))
  .then(frontendServices => serviceCatalogue.clone(frontendServices))
  .then(() => search(searchString))
  .catch(err => console.error(err));
