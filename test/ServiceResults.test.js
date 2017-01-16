import test from 'ava';
import ServiceResults from './../lib/streams/ServiceResults';
import {PassThrough} from 'stream';

const passThrough = new PassThrough({objectMode: true});
const serviceResults = new ServiceResults({objectMode: true});
const matchDetailInputs = [
  {
    filePath: 'target/service-name-public/example/file/path/file.html',
    lineNumber: 19,
    match: 'example match'
  },
  {
    filePath: 'target/service-name-public/example/file/path/file1.html',
    lineNumber: 34,
    match: 'other example match'
  },
  {
    filePath: 'target/service-name-public/example/file/path/file2.html',
    lineNumber: 101,
    match: 'another example match'
  },
  {
    filePath: 'target/service-name-other-public/example/file/path/file-other.html',
    lineNumber: 1,
    match: 'other match'
  },
  {
    filePath: 'target/service-name-other-public/example/file/path/file-other1.html',
    lineNumber: 3,
    match: 'another other match'
  }
];

const expectedServiceResults = [
  {
    name: 'service-name',
    github: 'public',
    count: 3,
    files: [
      {
        'path': '/example/file/path/file.html',
        'line': 19,
        'match': 'example match'
      },
      {
        'path': '/example/file/path/file1.html',
        'line': 34,
        'match': 'other example match'
      },
      {
        'path': '/example/file/path/file2.html',
        'line': 101,
        'match': 'another example match'
      }
    ]
  },
  {
    name: 'service-name-other',
    github: 'public',
    count: 2,
    files: [
      {
        'path': '/example/file/path/file-other.html',
        'line': 1,
        'match': 'other match'
      },
      {
        'path': '/example/file/path/file-other1.html',
        'line': 3,
        'match': 'another other match'
      }
    ]
  }
];

test('service results created from lined input should be provided to consumer', async t => {
  let count = 0;

  matchDetailInputs.forEach(matchDetail => passThrough.write(matchDetail));
  passThrough.end();

  await passThrough
    .pipe(serviceResults)
    .on('data', serviceResult => t.deepEqual(serviceResult, expectedServiceResults[count++]))
    // validate correct number of 'data' assertions
    // t.plan(), and test of count after 'await' will not work
    // as pushing to stream in _transform AND _flush
    .on('finish', () => t.is(count, expectedServiceResults.length));
});
