const glob = require('glob')
const Readable = require('stream').Readable

class FindFiles extends Readable {
  constructor (options, filePathPattern) {
    super(options)

    this.filePathPattern = filePathPattern
  }

  _read () {
    const files = glob.sync(this.filePathPattern, {
      ignore: '**/node_modules/**'
    })

    files.forEach((file) => this.push(file))

    this.push(null)
  }
}

module.exports = FindFiles
