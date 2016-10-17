import test from 'ava';
import ServiceResults from './../lib/streams/ServiceResults';
import {PassThrough} from 'stream';

const passThrough = new PassThrough({objectMode: true});
const serviceResults = new ServiceResults({objectMode: true});
const inputLines = [
  'target/service-name-public/example/file/path/file.html:19: example match',
  'target/service-name-public/example/file/path/file1.html:34: other example match',
  'target/service-name-public/example/file/path/file2.html:101: another example match',
  'target/service-name-other-public/example/file/path/file-other.html:1: other match',
  'target/service-name-other-public/example/file/path/file-other1.html:3: another other match'
];
const expectedServiceResults = [
  {
    name: 'service-name',
    github: 'public',
    count: 3,
    files: [
      {
        'path': '/example/file/path/file.html',
        'line': '19',
        'match': 'example match'
      },
      {
        'path': '/example/file/path/file1.html',
        'line': '34',
        'match': 'other example match'
      },
      {
        'path': '/example/file/path/file2.html',
        'line': '101',
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
        'line': '1',
        'match': 'other match'
      },
      {
        'path': '/example/file/path/file-other1.html',
        'line': '3',
        'match': 'another other match'
      }
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
