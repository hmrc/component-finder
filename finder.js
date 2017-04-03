import {EOL} from 'os'
import yargs from 'yargs'
import clone from './lib/clone'
import search from './lib/search'
import serviceCatalogue from './lib/serviceCatalogue'
import isFrontendService from './lib/utils/isFrontendService'
import getServiceRepoDetails from './lib/utils/serviceRepoDetails'
import {setupLogger, logger} from './lib/utils/logging'

try {
  var config = require('./config.json')
} catch (err) {
  process.stdout.write(`${EOL}No config.json file found.${EOL}Please see README.md for details.${EOL}${EOL}`)
  process.exit(1)
}

const args = yargs
  .usage('node $0 [options] search_string')
  .option('f', {
    alias: 'file',
    default: 'html',
    type: 'string',
    describe: 'The file extension(s) of the files to search'
  })
  .option('v', {
    alias: 'verbose',
    type: 'count',
    describe: 'Increase logging verbosity'
  })
  .demandCommand(1)
  .help()
  .argv

setupLogger(args.verbose)

serviceCatalogue.getProjects(config.api)
  .then((services) => services.filter(service => isFrontendService(service.name, config.whitelist)))
  .then((frontendServices) => {
    const serviceRepoDetails = getServiceRepoDetails(frontendServices)

    return clone(serviceRepoDetails.details)
      .then(() => search(serviceRepoDetails.urls, {fileExtensions: args.file, searchString: args._}))
  })
  .catch((err) => logger.log(err))
