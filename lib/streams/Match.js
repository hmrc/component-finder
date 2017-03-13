import fs from 'fs'
import {Transform} from 'stream'
import {EOL as newline} from 'os'

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
  constructor (options, searchString) {
    super(options)
    this.searchString = searchString
  }

  _transform (filePath, encoding, done) {
    const lines = fs.readFileSync(filePath, {encoding: 'utf8'}).split(newline)

    lines.forEach((line, lineNumber) => {
      if (line.indexOf(this.searchString) !== -1) {
        const matchDetail = {
          filePath,
          lineNumber,
          match: line
        }

        this.push(matchDetail)
      }
    }, this)

    done()
  }
}

export default Match
