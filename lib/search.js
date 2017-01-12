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
 * @param searchOptions
 * @returns {Promise}
 */
const searchMarkup = searchOptions => {
  // forward slash is made windows compatible inside glob https://www.npmjs.com/package/glob#windows
  const findFiles = new FindFiles({objectMode: true}, `target/**/*.${searchOptions.fileExtension}`);
  const match = new Match({objectMode: true}, searchOptions);

  console.log('CLASS   REGEX : ', match.classRegex);
  console.log('TAG     REGEX : ', match.tagRegex);
  console.log('ATTRIB. REGEX : ', match.attrRegex);

  findFiles
    .pipe(match)
    .pipe(createServiceResults)
    .pipe(consoleLogger)
    .pipe(jsonLogger);
};

export default searchMarkup;
