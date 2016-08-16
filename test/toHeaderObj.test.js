import test from 'ava';
import toHeaderObj from './../lib/utils/toHeaderObj';

const headerString = process.env.API_HEADERS;
const expectedHeaderObj = {
  Accept: 'application/json,text/html',
  'Content-Type': 'application/json'
};

test('header string should be correctly converted to header obj', t => {
  t.plan(1);
  t.deepEqual(toHeaderObj(headerString), expectedHeaderObj);
});
