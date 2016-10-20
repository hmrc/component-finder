import Match from './streams/Match';
import FindFiles from './streams/FindFiles';
import ServiceResults from './streams/ServiceResults';
import ConsoleLogger from './streams/ConsoleLogger';
import JSONLogger from './streams/JSONLogger';

const createServiceResults = new ServiceResults({objectMode: true});
const consoleLogger = new ConsoleLogger({objectMode: true});
const jsonLogger = new JSONLogger({objectMode: true});

/**
 * Search html markup using grep
 * @param searchString
 * @param pattern
 * @returns {Promise}
 */
const searchMarkup = (searchString, fileExtension = 'html') => {
  // forward slash is made windows compatible inside glob https://www.npmjs.com/package/glob#windows
  const findFiles = new FindFiles({objectMode: true}, `target/**/*.${fileExtension}`);
  const match = new Match({objectMode: true}, searchString);

  findFiles
    .pipe(match)
    .pipe(createServiceResults)
    .pipe(consoleLogger)
    .pipe(jsonLogger);
};

export default searchMarkup;
