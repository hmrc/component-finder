import {spawn} from 'child_process';
import LineByLine from './streams/LineByLine';
import ServiceResults from './streams/ServiceResults';
import Log from './streams/Log';

const lineByLine = new LineByLine({objectMode: true});
const createServiceResults = new ServiceResults({objectMode: true});
const log = new Log({objectMode: true});

/**
 * Search html markup using grep
 * @param searchString
 * @param [fileExtension=html]
 * @returns {Promise}
 */
const searchMarkup = (searchString, fileExtension = 'html') => {
  return new Promise((resolve, reject) => {
    const grep = spawn('grep', ['-nrliF', `--include=*\.${fileExtension}`, searchString, 'target']);

    grep.stdout
      .pipe(lineByLine)
      .pipe(createServiceResults)
      .pipe(log);

    grep.stderr.on('data', data => console.error(`Error: ${data.toString()}`));

    grep.on('error', err => reject(`Error: ${err}`));

    grep.on('close', code => resolve());

    grep.on('exit', code => grep.kill());
  });
};

export default searchMarkup;
