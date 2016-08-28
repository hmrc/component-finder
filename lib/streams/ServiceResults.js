import {Transform} from 'stream';
import {sep as pathSeparator} from 'path';

/**
 * Create service result object, populate with info and results then provide to consumer stream when complete
 */
class ServiceResults extends Transform {
  constructor(options) {
    super(options);
    this.createServiceResultsObj();
  }

  createServiceResultsObj() {
    this.serviceResults = {
      name: null,
      count: 0,
      files: []
    };
  }

  _transform(line, encoding, done) {
    const [, repoName, ...filePathParts] = line.split(pathSeparator);
    const filePath = pathSeparator + filePathParts.join(pathSeparator);

    if (this.serviceResults.name && this.serviceResults.name !== repoName) {
      this.push(this.serviceResults);
      this.createServiceResultsObj();
    }

    this.serviceResults.name = repoName;
    this.serviceResults.count++;
    this.serviceResults.files.push(filePath);

    done();
  }
}

export default ServiceResults;
