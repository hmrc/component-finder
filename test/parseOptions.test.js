import test from 'ava';
import {EOL} from 'os';

import parseOptions from './../lib/utils/parseOptions';
import {ERRORS} from './../lib/utils/constants';

const argArray = [
  'path/to/node',
  'path/to/js'
];

test('returns error if no search string passed', t => {
  const searchOptions = parseOptions(argArray.slice());

  t.deepEqual(searchOptions.optionErrors, [ERRORS.NO_SEARCH_STRING]);
});

test('returns error if no search string passed with -s option', t => {
  const testArray = [...argArray, '-s'];
  const searchOptions = parseOptions(testArray.slice());

  t.deepEqual(searchOptions.optionErrors, [ERRORS.NO_SEARCH_STRING]);
});

test('returns correct default options for search string as default third argument', t => {
  const testArray = [...argArray, 'SEARCH_STRING'];
  const searchOptions = parseOptions(testArray.slice());
  const expectedOptions = {
    searchString: 'SEARCH_STRING',
    fileExtensions: 'html',
    optionErrors: []
  };

  t.deepEqual(searchOptions, expectedOptions);
});

test('returns error if no file extension specified with -f option', t => {
  const testArray = [...argArray, 'SEARCH_STRING', '-f'];
  const searchOptions = parseOptions(testArray);

  t.deepEqual(searchOptions.optionErrors, [ERRORS.NO_FILE_EXTENSION]);
});

test('returns error if no file extension resolved with -f option', t => {
  const testArray = [...argArray, 'SEARCH_STRING', '-f', ' . ,. '];
  const searchOptions = parseOptions(testArray);

  t.deepEqual(searchOptions.optionErrors, [ERRORS.NO_FILE_EXTENSION]);
});

test('returns correct options for single specified file extensions', t => {
  const testArray = [...argArray, 'SEARCH_STRING', '-f', 'scala'];
  const searchOptions = parseOptions(testArray);
  const expectedOptions = {
    searchString: 'SEARCH_STRING',
    fileExtensions: 'scala',
    optionErrors: []
  };

  t.deepEqual(searchOptions, expectedOptions);
});

test('returns correct options object for multiple file extensions', t => {
  const testArray = [...argArray, 'SEARCH_STRING', '--file', 'html,scala'];
  const searchOptions = parseOptions(testArray);
  const expectedOptions = {
    searchString: 'SEARCH_STRING',
    fileExtensions: '{html,scala}',
    optionErrors: []
  };

  t.deepEqual(searchOptions, expectedOptions);
});

test('returns correct options object for multiple specified options', t => {
  const testArray = [...argArray, '--file', 'md', '-s', 'SEARCH_STRING'];
  const searchOptions = parseOptions(testArray);
  const expectedOptions = {
    searchString: 'SEARCH_STRING',
    fileExtensions: 'md',
    optionErrors: []
  };

  t.deepEqual(searchOptions, expectedOptions);
});
