import test from 'ava';
import isFrontendService from './../lib/utils/isFrontendService';

test('service name with "-frontend" should be identified as a frontend service', t => {
  t.plan(1);
  t.true(isFrontendService('test-frontend'));
});

test('service name without "-frontend" should not be identified as a frontend service', t => {
  t.plan(1);
  t.false(isFrontendService('test'));
});
