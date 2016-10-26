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
const searchTerm = 'example-css-rule';
const resultsDir = './results';

let jsonLogger;
let passThrough;

test.beforeEach(t => {
  jsonLogger = new JSONLogger({objectMode: true}, [searchTerm]);
  passThrough = new PassThrough({objectMode: true});
});

test.after(t => {
  fs.unlinkSync(`${resultsDir}/${searchTerm}.json`);
  fs.rmdirSync(resultsDir);
});

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
      const data = fs.readFileSync(`${resultsDir}/${searchTerm}.json`, 'utf8');
      const json = JSON.parse(data);

      t.deepEqual(json, serviceResults);
    });
});

test(`${resultsDir} should be created if it does not exist`, async t => {
  serviceResults.forEach(serviceResult => passThrough.write(serviceResult));
  passThrough.end();

  await passThrough
    .pipe(jsonLogger)
    .on('data', () => t.true(!fs.existsSync(resultsDir)))
    .on('finish', () => t.true(fs.existsSync(resultsDir)));
});
