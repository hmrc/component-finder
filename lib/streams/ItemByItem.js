import {Transform} from 'stream';

/**
 * Extract array item data and provide to the consumer stream item by item
 */
class ItemByItem extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(filePaths, encoding, done) {

    filePaths.forEach(path => this.push(path));
    done();
  }
}

export default ItemByItem;
