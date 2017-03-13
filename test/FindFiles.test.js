import test from 'ava';
import sinon from 'sinon';
import glob from 'glob';
import minimatch from 'minimatch';
import FindFiles from './../lib/streams/FindFiles';

const files = [
  'test1.html',
  'test2.js',
  'node_modules/test3.html',
  'target/test4.html',
  'target/test5.js'
];

const globSyncStub = sinon.stub(glob, 'sync', (pattern) => {
  return files.filter((file) => minimatch(file, pattern));
});

test.after('cleanup', t => globSyncStub.restore());

test('should return the only html file from target dir', async t => {
  const findFiles = new FindFiles({objectMode: true}, 'target/**/*.html');

  await findFiles
    .on('data', file => t.is(file, files[3]));
});

test('should return multiple files from target dir', async t => {
  const findFiles = new FindFiles({objectMode: true}, 'target/**/*.{html,js}');
  let count = 3

  await findFiles
    .on('data', file => t.is(file, files[count++]));
});

test('should return results line by line', async t => {
  const findFiles = new FindFiles({objectMode: true}, '*');
  let count = 0;

  await findFiles
    .on('data', file => t.is(file, files[count++]));
});
