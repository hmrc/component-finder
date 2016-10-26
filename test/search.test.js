import test from 'ava';
import sinon from 'sinon';
import glob from 'glob';
import minimatch from 'minimatch';
import {getFilePaths} from '../lib/search';

const files = [
  'test1.html',
  'test2.js',
  'target/test3.html',
  'target/test4.js'
];
const globSyncStub = sinon.stub(glob, 'sync', (pattern) => {
  return files.filter((file) => minimatch(file, pattern));
});

test.after('cleanup', t => globSyncStub.restore());

test('file should be html file inside target dir', async t => {
  const retrievedFiles = getFilePaths('target/**/*.html');

  t.true(retrievedFiles.length === 1);
  t.is(retrievedFiles[0], files[2]);
});

test('files should be returned line by line', async t => {
  const retrievedFiles = getFilePaths('*');

  retrievedFiles.forEach((retrievedFile, i) => t.is(retrievedFile, files[i]));
});
