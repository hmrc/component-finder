import {Transform} from 'stream';
import formatter from './../utils/formatter';

/**
 * Log service results to the console
 */
class ConsoleLogger extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(results, encoding, done) {
    console.log(formatter(results));
    this.push(results);

    done();
  }
}

export default ConsoleLogger;
