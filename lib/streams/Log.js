import {Writable} from 'stream';
import {logger} from './../utils/logging';

/**
 * Log service results
 */
class Log extends Writable {
  constructor(options) {
    super(options);
  }

  _write(results, encoding, done) {
    logger.info(results);

    done();
  }
}

export default Log;
