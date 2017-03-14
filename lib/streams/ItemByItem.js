const Transform = require('stream').Transform

/**
 * Extract array item data and provide to the consumer stream item by item
 */
class ItemByItem extends Transform {
  _transform (filePaths, encoding, done) {
    filePaths.forEach(path => this.push(path))
    done()
  }
}

module.exports = ItemByItem
