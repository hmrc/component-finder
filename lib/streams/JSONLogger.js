import fs from 'fs';
import {Transform} from 'stream';

/**
 * Save service results objects to a results.json file
 */
class JSONLogger extends Transform {
  constructor(options, searchTerm) {
    super(options);
    this.data = [];
    this.searchTerm = searchTerm;
  }

  _transform(results, encoding, done) {
    this.data.push(results)

    done();
  }

  _flush(done) {
    const resultsDir = './results';
    let json

    try {
      json = JSON.stringify(this.data, null, 2);
    } catch (err) {
      throw err;
    }

    if (!fs.existsSync(resultsDir)){
      fs.mkdirSync(resultsDir);
    }

    fs.writeFileSync(`${resultsDir}/${this.searchTerm}.json`, json, 'utf-8');

    done();
  }
}

export default JSONLogger;
