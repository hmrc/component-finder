import glob from 'glob';
import {Readable} from 'stream';

class FindFiles extends Readable {
  constructor(options, filePathPattern) {
    super(options);
console.log('FILE PATTERN  : ', filePathPattern);
    this.filePathPattern = filePathPattern;
  }

  _read() {
    const files = glob.sync(this.filePathPattern, {
      ignore: [
        '**/node_modules/**',
        '**/*jquery*/**'
      ]
    });

    files.forEach((file) => this.push(file));

    this.push(null);
  }
}

export default FindFiles;
