import {Transform} from 'stream';
import {EOL as newline} from 'os';

/**
 * Convert chunked data to lines and provide to the consumer stream line by line
 */
class LineByLine extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, done) {
    let data = chunk.toString();
    let lines;

    if (this.lastLine) {
      data = this.lastLine + data;
    }

    lines = data.split(newline);
    this.lastLine = lines.splice((lines.length - 1), 1)[0];

    lines.forEach(line => this.push(line));

    done();
  }

  _flush(done) {
    if (this.lastLine) {
      this.push(this.lastLine);
      this.lastLine = null;
    }

    done();
  }
}

export default LineByLine;
