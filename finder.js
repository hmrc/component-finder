import {EOL} from 'os'
import yargs from 'yargs'
import clone from './lib/clone'
import search from './lib/search'
import serviceCatalogue from './lib/serviceCatalogue'
import isFrontendService from './lib/utils/isFrontendService'

try {
  var config = require('./config.json')
} catch (err) {
  process.stdout.write(`${EOL}No config.json file found.${EOL}Please see README.md for details.${EOL}${EOL}`)
  process.exit(1)
};

const args = yargs
  .usage('node $0 [options] search_string')
  .option('f', {
    alias: 'file',
    default: 'html',
    type: 'string',
    describe: 'The file extension(s) of the files to search'
  })
  .demandCommand(1)
  .help()
  .argv

serviceCatalogue.getProjects(config.api)
  .then(services => services.filter(service => isFrontendService(service.name, config.whitelist)))
  .then(frontendServices => clone(frontendServices))
  .then(() => search({
    fileExtensions: args.file,
    searchString: args._
  }))
  .catch(err => console.error(err))
