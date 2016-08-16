import test from 'ava';
import isFrontendService from './../lib/utils/isFrontendService';

const whitelist = process.env.WHITELIST.split(',');

test('service in the whitelist should be identified as a frontend service', t => {
  t.plan(2);
  t.true(isFrontendService('test', whitelist));
  t.true(isFrontendService('test-frontend', whitelist));
});

test('service not in the whitelist should not be identified as a frontend service', t => {
  t.plan(1);
  t.false(isFrontendService('test-service', whitelist));
});
