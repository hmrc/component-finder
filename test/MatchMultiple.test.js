import test from 'ava';
import fs from 'fs';
import sinon from 'sinon';
import {EOL as newline} from 'os';
import Match from './../lib/streams/Match';
import {PassThrough} from 'stream';

const path = 'target/example-frontend-enterprise/app/views/example.scala.html'
const fsStub = sinon.stub(fs, 'readFileSync', () => {
  return [
    'test1',
    'test2',
    'test3',
    'test4',
    'test5',
    'test4'
  ].join(newline);
});

test.after('cleanup', t => fsStub.restore());

test('multiple searchString matches should return correct details', async t => {

  const searchString = 'test4';
  const match = new Match({objectMode: true}, searchString);
  const passThrough = new PassThrough({objectMode: true});
  const expectedResults = [
    {
      filePath: path,
      lineNumber: 3,
      match: searchString
    },
    {
      filePath: path,
      lineNumber: 5,
      match: searchString
    }
  ];
  let count = 0;

  passThrough.write(path);
  passThrough.end();

  await passThrough
    .pipe(match)
    .on('data', item => t.deepEqual(item, expectedResults[count++]));

  t.is(count, expectedResults.length);
});
