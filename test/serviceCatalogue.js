import test from 'ava';
import serviceCatalogue from './../lib/serviceCatalogue';
import config from './../config';
const nock = require('nock');
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

  const services = serviceCatalogue.getServices();

  t.true(await services instanceof Array);
  t.deepEqual(await services, mockServices);
});

test('error should be returned when statusCode is not 200', t => {

  nock(`${config.api.protocol}://${config.api.host}:443`)
    .get(config.api.path)
    .reply(404, 'URI not found');

  serviceCatalogue.getServices()
    .catch(err => {
      t.is(err, 'Error: ResponseCode: 404, StatusMessage: URI not found');
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

