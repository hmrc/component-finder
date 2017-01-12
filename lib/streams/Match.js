import fs from 'fs';
import {Transform} from 'stream';
import {EOL as newline} from 'os';

/**
 * Create a match detail object if a match is found, populate with file path, line number and match and provide to consumer stream match by match
 * Example Match Detail object:
 {
   filePath: "",
   lineNumber: 2,
   match: ""
 }
 */
class Match extends Transform {
  constructor(options, searchOptions) {
    super(options);
    this.searchString = searchOptions.searchString;
    this.searchMode   = searchOptions.searchMode;
    this.classRegex   = new RegExp('=[\'"]+([^>\'"]*\\s+|)'
                                   + searchOptions.searchString
                                   + '(|\\s+.[^>\'"]*)[\'"]+',
                                   'gi');
    this.tagRegex     = new RegExp('<' + searchOptions.searchString + '[ >]+',
                                   'gi');
    this.attrRegex    = new RegExp('<\\w+[ ]+([^>]*\\s+|)'
                                   + searchOptions.searchString
                                   + '[= >]+',
                                   'gi');
  }

  _isMatchFound(line) {
    switch (this.searchMode) {
      case '-c':
        return line.match(this.classRegex);
      case '-t':
        return line.match(this.tagRegex);
      case '-a':
        return line.match(this.attrRegex);
      default:
        return line.indexOf(this.searchString) !== -1;
    }
  }

  _transform(filePath, encoding, done) {
    const lines = fs.readFileSync(filePath, {encoding: 'utf8'}).split(newline);

    lines.forEach((line, lineNumber) => {
      if (this._isMatchFound(line)) {
        const matchDetail = {
          filePath,
          lineNumber,
          match: line
        }

        this.push(matchDetail);
      }
    }, this);

    done();
  }
}

export default Match;
