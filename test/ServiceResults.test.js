import test from 'ava';
import ServiceResults from './../lib/streams/ServiceResults';
import {PassThrough} from 'stream';

const passThrough = new PassThrough({objectMode: true});
const serviceResults = new ServiceResults({objectMode: true});
const inputLines = [
  'target/service-name-public/example/file/path/file.html',
  'target/service-name-public/example/file/path/file1.html',
  'target/service-name-public/example/file/path/file2.html',
  'target/service-name-other-public/example/file/path/file-other.html',
  'target/service-name-other-public/example/file/path/file-other1.html'
];
const expectedServiceResults = [
  {
    name: 'service-name',
    github: 'public',
    count: 3,
    files: [
      '/example/file/path/file.html',
      '/example/file/path/file1.html',
      '/example/file/path/file2.html'
    ]
  },
  {
    name: 'service-name-other',
    github: 'public',
    count: 2,
    files: [
      '/example/file/path/file-other.html',
      '/example/file/path/file-other1.html'
    ]
  }
];

test('service results created from lined input should be provided to consumer', async t => {
  let count = 0;

  inputLines.forEach(line => passThrough.write(line));
  passThrough.end();

  await passThrough
    .pipe(serviceResults)
    .on('data', serviceResult => t.deepEqual(serviceResult, expectedServiceResults[count++]));
});
