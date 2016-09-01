import test from 'ava';
import sinon from 'sinon';
import ConsoleLogger from './../lib/streams/ConsoleLogger';
import {PassThrough} from 'stream';

const serviceResults = [
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

test.before(t => sinon.stub(console, 'log'));

test.after(t => console.log.restore());

test('Service result objects should be provided to consumer one by one', async t => {
  const consoleLogger = new ConsoleLogger({objectMode: true});
  const passThrough = new PassThrough({objectMode: true});
  let count = 0;

  serviceResults.forEach(serviceResult => passThrough.write(serviceResult));
  passThrough.end();

  await passThrough
    .pipe(consoleLogger)
    .on('data', data => t.deepEqual(data, serviceResults[count++]));
});

