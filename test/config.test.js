import fs from 'fs';
import test from 'ava';

const config = './../config.json';

test.cb('should require a config.json file', t => {
  fs.stat(config, (err, stats) => {
    let isFile = stats && stats.isFile();
    t.true(isFile, 'config.json does not exist');
    t.end();
  });
});
