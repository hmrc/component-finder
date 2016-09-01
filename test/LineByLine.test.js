import test from 'ava';
import LineByLine from './../lib/streams/LineByLine';
import {PassThrough} from 'stream';
import {EOL as newline} from 'os';

const passThrough = new PassThrough({objectMode: true});
const lineByLine = new LineByLine({objectMode: true});
const lines = [
  'line1',
  'line2',
  'line3'
];

test('output from stream should be provided to consumer line by line', async t => {
  let count = 0;

  passThrough.write(lines.join(newline));
  passThrough.end();

  await passThrough
    .pipe(lineByLine)
    .on('data', line => t.is(line, lines[count++]));
});
