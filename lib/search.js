import glob from 'glob';
import {EOL as newline} from 'os';
import {Readable} from 'stream';
import Match from './streams/Match';
import FileRead from './streams/FileRead';
import ServiceResults from './streams/ServiceResults';
import ConsoleLogger from './streams/ConsoleLogger';
import JSONLogger from './streams/JSONLogger';

/**
 * Wrapper around glob
 * @param pattern
 */
const getFilePaths = (pattern) => {
// forward slash is made windows compatible inside glob https://www.npmjs.com/package/glob#windows
  const files = glob.sync(pattern, {
    ignore: [
      '**/node_modules/**',
      '**/.git/**',
      '**/documentum/**'
    ]
  });

  return files;
};

/**
 * Search html markup
 * @param searchTerms
 * @param pattern
 * @returns {Promise}
 */
const searchMarkup = (searchTerms, pattern) => {
  const files = getFilePaths(pattern);
  process.stdout.write(`Searching for: ${searchTerms.join(' & ') + newline}`);

  searchTerms.forEach((searchTerm) => {
    const fileRead = new FileRead({objectMode: true}, files);
    const match = new Match({objectMode: true}, searchTerm);
    const createServiceResults = new ServiceResults({objectMode: true});
    const consoleLogger = new ConsoleLogger({objectMode: true}, searchTerm);
    const jsonLogger = new JSONLogger({objectMode: true}, searchTerm);

    fileRead
      .pipe(match)
      .pipe(createServiceResults)
      .pipe(consoleLogger)
      .pipe(jsonLogger);
  });
};

export {
  getFilePaths,
  searchMarkup
};
