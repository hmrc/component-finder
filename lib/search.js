import {EOL as newline} from 'os'
import Match from './streams/Match'
import FindFiles from './streams/FindFiles'
import ServiceResults from './streams/ServiceResults'
import ConsoleLogger from './streams/ConsoleLogger'
import JSONLogger from './streams/JSONLogger'
import config from './../config.json'

const createServiceResults = new ServiceResults({objectMode: true}, config.repositories)
const consoleLogger = new ConsoleLogger({objectMode: true})
const jsonLogger = new JSONLogger({objectMode: true})

/**
 * Search html markup using grep
 * @param {searchOptions}
 * @returns {Promise}
 */
const searchMarkup = (searchOptions) => {
  let { fileExtensions } = searchOptions
  process.stdout.write(`Searching files...${fileExtensions}${newline}`)

  fileExtensions = fileExtensions.includes(',')
    ? `{${fileExtensions.replace(/\s/g, '')}}`
    : fileExtensions

  // forward slash is made windows compatible inside glob https://www.npmjs.com/package/glob#windows
  const findFiles = new FindFiles({objectMode: true}, `target/**/*.${fileExtensions}`)
  const match = new Match({objectMode: true}, searchOptions.searchString)

  findFiles
    .pipe(match)
    .pipe(createServiceResults)
    .pipe(consoleLogger)
    .pipe(jsonLogger)
}

export default searchMarkup
