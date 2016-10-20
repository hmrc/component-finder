import fs from 'fs';
import path from 'path';
import test from 'ava';

const configSample = path.resolve('..', 'config.sample.json');

test.cb('config.sample.json should exist', t => {
  fs.stat(configSample, (err, stats) => {
    let isFile = stats && stats.isFile();
    t.true(isFile, 'config.sample.json does not exist');
    t.end();
  });
});
