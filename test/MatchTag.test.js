import test from 'ava';
import fs from 'fs';
import sinon from 'sinon';
import {EOL as newline} from 'os';
import Match from './../lib/streams/Match';
import {PassThrough} from 'stream';

const path = 'target/example-frontend-enterprise/app/views/example.scala.html'
const lineArray = [
  '<tag>',
  '<tag class="some-class">',
  '<tag-another>',             // should not match
  '<another-tag>'              // should not match
];
const fsStub = sinon.stub(fs, 'readFileSync', () => {
  return lineArray.join(newline);
});

test.after('cleanup', t => fsStub.restore());

test('with -t flag, lines only match against the tag regex', async t => {
  const searchOptions = {
    searchString: 'tag',
    searchMode: '-t'
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
