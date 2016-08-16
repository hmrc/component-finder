import test from 'ava';
import nock from 'nock';
import sinon from 'sinon';
import config from './../config';
import serviceCatalogue from './../lib/serviceCatalogue';
import isFrontendService from './../lib/utils/isFrontendService';

let mockServices = [];

test.beforeEach(t => {
  mockServices = [
    {
      name: 'testData',
      githubUrls: [
        {
          name: 'github-com',
          displayName: 'GitHub.com',
          url: 'https://github.com/test-url'
        }
      ],
    },
    {
      name: 'testDataOther',
      githubUrls: [
        {
          name: 'github-com',
          displayName: 'GitHub.com',
          url: 'https://github.com/test-url-other'
        }
      ],
    }
  ];
});

test('.getServices() should successfully return services', async t => {
  t.plan(2);

  nock(`${config.api.protocol}://${config.api.host}:443`)
    .get(config.api.path)
    .reply(200, mockServices);

  const services = await serviceCatalogue.getServices();

  t.true(services instanceof Array);
  t.deepEqual(services, mockServices);
});

test('.getServices() should error/reject when statusCode is not 200', t => {
  t.plan(1);

  nock(`${config.api.protocol}://${config.api.host}:443`)
    .get(config.api.path)
    .reply(404, 'URI not found');

  return serviceCatalogue.getServices()
    .catch(err => {
      // there is no way of adding statusMessage directly to the response https://github.com/node-nock/nock/issues/469
      t.is(err, 'ResponseCode: 404, StatusMessage: null');
    });
});

test('.getServices() should reject when bad JSON is returned', t => {
  t.plan(2);

  nock(`${config.api.protocol}://${config.api.host}:443`)
    .get(config.api.path)
    .reply(200, 'badJSON');

  return serviceCatalogue.getServices()
    .catch(err => {
      t.is(err.name, 'SyntaxError');
      t.is(err.message, 'Unexpected token b');
    });
});

test('.getServices() should reject when errors are returned', t => {
  t.plan(1);

  nock(`${config.api.protocol}://${config.api.host}:443`)
    .get(config.api.path)
    .replyWithError('something awful happened');

  return serviceCatalogue.getServices()
    .catch(err => {
      t.is(err.message, 'something awful happened');
    });
});

test('.clone() should resolve 2 cloneTask promises', async t => {
  const cloneTaskSpy = sinon.spy(resolve => {
    resolve();
  });

  await serviceCatalogue.clone(mockServices, cloneTaskSpy);

  t.true(cloneTaskSpy.calledTwice);
});


test('.clone() should error when a cloneTask promise is rejected', async t => {
  t.plan(1);

  const mockError = 'mock error';

  const cloneTaskRejection = (resolve, reject) => {
    reject(new Error(mockError));
  };

  await serviceCatalogue.clone(mockServices, cloneTaskRejection)
    .catch(err => {
      t.is(err, mockError);
    });
});

