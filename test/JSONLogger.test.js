import test from 'ava';
import fs from 'fs';
import JSONLogger from './../lib/streams/JSONLogger';
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

let jsonLogger;
let passThrough;

test.beforeEach(t => {
  jsonLogger = new JSONLogger({objectMode: true});
  passThrough = new PassThrough({objectMode: true});
});

test.after(t => fs.unlinkSync('results.json'));

test('Service results object should be provided to consumer object by object', async t => {
  let count = 0;

  serviceResults.forEach(serviceResult => passThrough.write(serviceResult));
  passThrough.end();

  await passThrough
    .pipe(jsonLogger)
    .on('data', data => t.deepEqual(data, serviceResults[count++]));
});

test('JSON service results object should be written to results.json', async t => {
  serviceResults.forEach(serviceResult => passThrough.write(serviceResult));
  passThrough.end();

  await passThrough
    .pipe(jsonLogger)
    .on('finish', () => {
      const data = fs.readFileSync('results.json', 'utf8');
      const json = JSON.parse(data);

      t.deepEqual(json, serviceResults);
    });
});
