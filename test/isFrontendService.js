import test from 'ava';
const isFrontendService = require('./../lib/utils/isFrontendService');

test('frontend service name should be identified as a frontend service', t => {
  t.plan(1);
  t.true(isFrontendService('test-frontend'));
});

test('non frontend service name should NOT be identified as a frontend service', t => {
  t.plan(1);
  t.false(isFrontendService('test'));
});
