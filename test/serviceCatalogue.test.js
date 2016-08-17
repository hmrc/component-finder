import test from 'ava';
import nock from 'nock';
import sinon from 'sinon';
import config from './../config';
import serviceCatalogue from './../lib/serviceCatalogue';
const [servicesAPIPath, librariesAPIPath] = config.api.paths;
let mockServices = [];
let mockLibraries = [];

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

  mockLibraries = [
    {
      name: 'testLibrary',
      githubUrls: [
        {
          name: 'github-com',
          displayName: 'GitHub.com',
          url: 'https://github.com/test-url'
        }
      ],
    }
  ];
});

test('.getServices() should successfully return services', async t => {
  nock(`${config.api.protocol}://${config.api.host}:443`)
    .get(servicesAPIPath)
    .reply(200, mockServices);

  const services = await serviceCatalogue.getServices(servicesAPIPath);

  t.true(services instanceof Array);
  t.deepEqual(services, mockServices);
});

test('.getServices() should error/reject when statusCode is not 200', t => {
  nock(`${config.api.protocol}://${config.api.host}:443`)
    .get(servicesAPIPath)
    .reply(404, 'URI not found');

  return serviceCatalogue.getServices(servicesAPIPath)
    .catch(err => {
      // there is no way of adding statusMessage directly to the response https://github.com/node-nock/nock/issues/469
      t.is(err, 'ResponseCode: 404, StatusMessage: null');
    });
});

test('.getServices() should reject when bad JSON is returned', t => {
  nock(`${config.api.protocol}://${config.api.host}:443`)
    .get(servicesAPIPath)
    .reply(200, 'badJSON');

  return serviceCatalogue.getServices(servicesAPIPath)
    .catch(err => {
      t.is(err.name, 'SyntaxError');
      t.is(err.message, 'Unexpected token b');
    });
});

test('.getServices() should reject when errors are returned', t => {
  nock(`${config.api.protocol}://${config.api.host}:443`)
    .get(servicesAPIPath)
    .replyWithError('something awful happened');

  return serviceCatalogue.getServices(servicesAPIPath)
    .catch(err => {
      t.is(err.message, 'something awful happened');
    });
});

test('.clone() should resolve 2 cloneTask promises', async t => {
  const cloneTaskSpy = sinon.spy(() => {
    return new Promise(resolve => {
      resolve(mockServices);
    });
  });

  await serviceCatalogue.clone(mockServices, cloneTaskSpy);

  t.true(cloneTaskSpy.calledTwice);
});

test('.clone() should error when a cloneTask promise is rejected', async t => {
  const mockError = 'mock error';

  const cloneTaskRejection = () => {
    return new Promise((resolve, reject) => {
      reject(new Error(mockError));
    });
  };

  await serviceCatalogue.clone(mockServices, cloneTaskRejection)
    .catch(err => {
      t.true(err instanceof Error);
      t.is(err.message, mockError);
    });
});

test('.getProjects() should return an array of projects', async t => {
  const serviceScope = nock(`${config.api.protocol}://${config.api.host}:443`)
    .get(servicesAPIPath)
    .reply(200, mockServices);

  const libScope = nock(`${config.api.protocol}://${config.api.host}:443`)
    .get(librariesAPIPath)
    .reply(200, mockLibraries);

  const projects = await serviceCatalogue.getProjects(config.api.paths);

  t.true(Array.isArray(projects));
  t.is(projects.length, mockServices.length + mockLibraries.length);
});
