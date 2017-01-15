import test from 'ava';
import {EOL} from 'os';

import parseOptions from './../lib/utils/parseOptions';
import {CONSTANTS, ERRORS} from './../lib/utils/constants';

const argArray = [
  'path/to/node',
  'path/to/js'
];

test('returns error if no search string passed', t => {
  const searchOptions = parseOptions(argArray.slice());

  t.deepEqual(searchOptions.optionErrors, [ERRORS.NO_SEARCH_STRING]);
});

test('returns correct default options for search string only', t => {
  const testArray = [...argArray, 'SEARCH_STRING'];
  const searchOptions = parseOptions(testArray.slice());
  const expectedOptions = {
    searchString: 'SEARCH_STRING',
    searchMode: '',
    fileExtensions: 'html',
    optionErrors: []
  };

  t.deepEqual(searchOptions, expectedOptions);
});

test('returns error if multiple search modes specified', t => {
  const testArray = [...argArray, 'SEARCH_STRING', '-at'];
  const searchOptions = parseOptions(testArray.slice());

  t.deepEqual(searchOptions.optionErrors, [ERRORS.MULTIPLE_MODES]);
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

test('returns correct options object for a class search', t => {
  const testArray = [...argArray, 'SEARCH_STRING', '-c'];
  const searchOptions = parseOptions(testArray);
  const expectedOptions = {
    searchString: 'SEARCH_STRING',
    searchMode: CONSTANTS.CLASS,
    fileExtensions: 'html',
    optionErrors: []
  };

  t.deepEqual(searchOptions, expectedOptions);
});

test('returns correct options object for a tag search', t => {
  const testArray = [...argArray, 'SEARCH_STRING', '-t'];
  const searchOptions = parseOptions(testArray);
  const expectedOptions = {
    searchString: 'SEARCH_STRING',
    searchMode: CONSTANTS.TAG,
    fileExtensions: 'html',
    optionErrors: []
  };

  t.deepEqual(searchOptions, expectedOptions);
});

test('returns correct options object for a attribute search', t => {
  const testArray = [...argArray, 'SEARCH_STRING', '-a'];
  const searchOptions = parseOptions(testArray);
  const expectedOptions = {
    searchString: 'SEARCH_STRING',
    searchMode: CONSTANTS.ATTRIBUTE,
    fileExtensions: 'html',
    optionErrors: []
  };

  t.deepEqual(searchOptions, expectedOptions);
});

test('returns correct options for single specified file extensions', t => {
  const testArray = [...argArray, 'SEARCH_STRING', '-f', 'scala'];
  const searchOptions = parseOptions(testArray);
  const expectedOptions = {
    searchString: 'SEARCH_STRING',
    searchMode: '',
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
    searchMode: '',
    fileExtensions: '{html,scala}',
    optionErrors: []
  };

  t.deepEqual(searchOptions, expectedOptions);
});

test('returns correct options object for multiple objects', t => {
  const testArray = [...argArray, 'SEARCH_STRING', '--file', 'java', '--class'];
  const searchOptions = parseOptions(testArray);
  const expectedOptions = {
    searchString: 'SEARCH_STRING',
    searchMode: CONSTANTS.CLASS,
    fileExtensions: 'java',
    optionErrors: []
  };

  t.deepEqual(searchOptions, expectedOptions);
});
