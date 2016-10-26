import {Readable} from 'stream';

/**
 * Simple Readable class to the provide array argument to consumer stream item by item
 */
class FileRead extends Readable {
  constructor(options, files) {
    super(options);

    this.files = files;
  }

  _read() {
    this.files.forEach((file) => this.push(file));

    this.push(null);
  }
}

export default FileRead;
