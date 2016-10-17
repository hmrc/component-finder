import {spawn} from 'child_process';
import LineByLine from './streams/LineByLine';
import ServiceResults from './streams/ServiceResults';
import ConsoleLogger from './streams/ConsoleLogger';
import JSONLogger from './streams/JSONLogger';

const lineByLine = new LineByLine({objectMode: true});
const createServiceResults = new ServiceResults({objectMode: true});
const consoleLogger = new ConsoleLogger({objectMode: true, highWaterMark: 4});
const jsonLogger = new JSONLogger({objectMode: true, highWaterMark: 4});


/**
 * Search html markup using grep
 * @param searchString
 * @param [fileExtension=html]
 * @returns {Promise}
 */
const searchMarkup = (searchString, fileExtension = 'html') => {
  return new Promise((resolve, reject) => {
    const grep = spawn('grep', ['-nriF', `--include=*\.${fileExtension}`, searchString, 'target']);

    grep.stdout
      .pipe(lineByLine)
      .pipe(createServiceResults)
      .pipe(consoleLogger)
      .pipe(jsonLogger);

    grep.stderr.on('data', data => console.error(`Error: ${data.toString()}`));

    grep.on('error', err => reject(`Error: ${err}`));

    grep.on('close', code => resolve());

    grep.on('exit', code => grep.kill());
  });
};

export default searchMarkup;
