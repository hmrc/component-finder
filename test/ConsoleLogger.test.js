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

test.before(t => {
  sinon.stub(console, 'log');
  sinon.stub(process.stdout, 'write');
});

test.after(t => {
  console.log.restore();
  process.stdout.write.restore();
});

test('ConsoleLogger should output results one by one followed by totals', async t => {
  const consoleLogger = new ConsoleLogger({objectMode: true});
  const passThrough = new PassThrough({objectMode: true});
  let count = 0;
  let expectedData = serviceResults.slice(0);
  const expectedSummary = '5 occurrences found in 2 projects';

  expectedData.push(expectedSummary);
  serviceResults.forEach(serviceResult => passThrough.write(serviceResult));
  passThrough.end();

  await passThrough
    .pipe(consoleLogger)
    .on('data', data => t.deepEqual(data, expectedData[count++]))
    // validate correct number of 'data' assertions
    // t.plan(), and test of count after 'await' will not work
    // as pushing to stream in _transform AND _flush
    .on('finish', () => t.is(count, expectedData.length));
});
