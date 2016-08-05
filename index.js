const serviceCatalogue = require('./lib/serviceCatalogue');
const isFrontendService = require('./lib/utils/isFrontendService');
const search = require('./lib/search');
const searchString = process.argv[2];

serviceCatalogue.getServices()
  .then(services => serviceCatalogue.filterServices(services, isFrontendService))
  .then(frontendServices => serviceCatalogue.prepClone(frontendServices))
  .then(cloneTasks => serviceCatalogue.clone(cloneTasks))
  .then(() => search(searchString))
  .catch(err => console.error(err));
