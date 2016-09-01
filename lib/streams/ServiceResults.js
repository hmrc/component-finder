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
      github: null,
      count: 0,
      files: []
    };
  }

  _transform(line, encoding, done) {
    const [, folder, ...filePathParts] = line.split(pathSeparator);
    const filePath = pathSeparator + filePathParts.join(pathSeparator);
    const repoNameParts = folder.split('-');
    const whichGithub = repoNameParts.splice((repoNameParts.length -1), 1)[0];
    const repoName = repoNameParts.join('-');

    if (this.serviceResults.name && this.serviceResults.name !== repoName) {
      this.push(this.serviceResults);
      this.createServiceResultsObj();
    }

    this.serviceResults.name = repoName;
    this.serviceResults.github = whichGithub;
    this.serviceResults.count++;
    this.serviceResults.files.push(filePath);

    done();
  }

  _flush(done) {
    if (this.serviceResults.name) {
      this.push(this.serviceResults);
      this.createServiceResultsObj();
    }

    done();
  }
}

export default ServiceResults;
