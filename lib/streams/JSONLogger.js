import fs from 'fs';
import {Transform} from 'stream';

/**
 * Save service results objects to a results.json file
 */
class JSONLogger extends Transform {
  constructor(options) {
    super(options);
    this.data = [];
  }

  _transform(results, encoding, done) {
    this.data.push(results)

    done();
  }

  _flush(done) {
    let json

    try {
      json = JSON.stringify(this.data, null, 2);
    } catch (err) {
      throw err;
    }

    fs.writeFileSync('results.json', json, 'utf-8');

    done();
  }
}

export default JSONLogger;
