import {Transform} from 'stream';
import {EOL as newline} from 'os';
import formatter from './../utils/formatter';

/**
 * Log service results to the console
 */
class ConsoleLogger extends Transform {
  constructor(options) {
    super(options);
    this.data = {
      projects: 0,
      occurences: 0
    };
  }

  _transform(results, encoding, done) {
    this.data.projects++;
    this.data.occurences += results.count;

    console.log(formatter(results));
    this.push(results);

    done();
  }

  _flush(done) {
    process.stdout.write(newline);
    process.stdout.write(`${this.data.occurences} occurences found in ${this.data.projects} projects${newline}`);
    this.push(`${this.data.occurences} occurences found in ${this.data.projects} projects`);
    done();
  }
}

export default ConsoleLogger;
