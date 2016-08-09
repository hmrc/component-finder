import test from 'ava';
import serviceCatalogue from './../lib/serviceCatalogue';
import config from './../config';
const nock = require('nock');
const sinon = require('sinon');
let mockServices;

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

test('response should be returned from service catalogue', async t => {
  t.plan(2);

  nock(`${config.api.protocol}://${config.api.host}:443`)
    .get(config.api.path)
    .reply(200, mockServices);

  const services = await serviceCatalogue.getServices();

  t.true(services instanceof Array);
  t.deepEqual(services, mockServices);
});

test('error should be returned when statusCode is not 200', t => {
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

test('getServices should reject when bad JSON is returned', t => {
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

test('getServices should reject when the get call errors', t => {
  t.plan(1);

  nock(`${config.api.protocol}://${config.api.host}:443`)
    .get(config.api.path)
    .replyWithError('something awful happened');

  return serviceCatalogue.getServices()
    .catch(err => {
      t.is(err.message, 'something awful happened');
    });
});

test('services should be filtered according to predicate', t => {
  t.plan(2);

  const services = serviceCatalogue
    .filterServices(mockServices, serviceName => {
      return serviceName !== 'testDataOther'
    });

  t.true(services instanceof Array);
  t.deepEqual(services, [mockServices[0]]);
});

test('an array should be returned from prepClone', t => {

  t.plan(2);

  nock(`${config.api.protocol}://${config.api.host}:443`)
    .get(config.api.path)
    .reply(200, mockServices);

  return serviceCatalogue.getServices()
    .then(services => serviceCatalogue.filterServices(services, serviceName => {
      return serviceName !== 'testDataOther'
    }))
    .then(filteredServices => serviceCatalogue.prepClone(filteredServices))
    .then(cloneTasks => {
      t.true(cloneTasks instanceof Array);
      t.is(cloneTasks.length, 1);
    });
});

test('clone should execute 2 promises', async t => {

  t.plan(1);

  nock(`${config.api.protocol}://${config.api.host}:443`)
    .get(config.api.path)
    .reply(200, mockServices);

  const cloneTaskSpy = sinon.spy((resolve, reject) => {
    resolve();
  });

  const services = await serviceCatalogue.getServices()
    .then(services => serviceCatalogue.filterServices(services, serviceName => {
      return true;
    }))
    .then(filteredServices => serviceCatalogue.prepClone(filteredServices, cloneTaskSpy))
    .then(cloneTasks => serviceCatalogue.clone(cloneTasks));

  t.true(cloneTaskSpy.calledTwice);
});


test('clone should error when a cloneTask promise is rejected', t => {

  t.plan(1);

  nock(`${config.api.protocol}://${config.api.host}:443`)
    .get(config.api.path)
    .reply(200, mockServices);

  const cloneTaskRejection = (resolve, reject) => {
    reject(new Error('mock error'));
  };

  return serviceCatalogue.getServices()
    .then(services => serviceCatalogue.filterServices(services, serviceName => {
      return true;
    }))
    .then(filteredServices => serviceCatalogue.prepClone(filteredServices, cloneTaskRejection))
    .then(cloneTasks => serviceCatalogue.clone(cloneTasks))
    .catch(err => {
      t.is(err, 'mock error');
    });
});

