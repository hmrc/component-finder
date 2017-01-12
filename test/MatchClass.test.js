import test from 'ava';
import fs from 'fs';
import sinon from 'sinon';
import {EOL as newline} from 'os';
import Match from './../lib/streams/Match';
import {PassThrough} from 'stream';

const path = 'target/example-frontend-enterprise/app/views/example.scala.html'
const lineArray = [
  '="tag"',
  '="one tag three"',
  '="tag phase-tag"',
  '="phase-tag tag"',
  '<td class="tag">"This content contains the tag word."</td>',
  '="phase-tag"',                                                     // should not match
  '<td class="phase-tag">"This content contains the tag word."</td>', // should not match
  '<p tag>"tag"</p>',                                                 // should not match
  '<tag class="not-a-tag"></tag>'                                     // should not match
];
const fsStub = sinon.stub(fs, 'readFileSync', () => {
  return lineArray.join(newline);
});

test.after('cleanup', t => fsStub.restore());

test('with -c flag, lines only match against the class regex', async t => {
  const searchOptions = {
    searchString: 'tag',
    searchMode: '-c'
  };
  const match = new Match({objectMode: true}, searchOptions);
  const passThrough = new PassThrough({objectMode: true});
  const expectedResults = [
    {
      filePath: path,
      lineNumber: 0,
      match: lineArray[0]
    },
    {
      filePath: path,
      lineNumber: 1,
      match: lineArray[1]
    },
    {
      filePath: path,
      lineNumber: 2,
      match: lineArray[2]
    },
    {
      filePath: path,
      lineNumber: 3,
      match: lineArray[3]
    },
    {
      filePath: path,
      lineNumber: 4,
      match: lineArray[4]
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
