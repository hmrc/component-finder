import test from 'ava';
import FileRead from '../lib/streams/FileRead';

const files = [
  'test1.html',
  'test2.js',
  'node_modules/test3.html',
  'target/test4.html',
  'target/test5.js'
];

test('output from stream should be provided to consumer item by item', async t => {
  const fileRead = new FileRead({objectMode: true}, files);
  let count = 0;

  await fileRead
    .on('data', file => t.is(file, files[count++]));
});
