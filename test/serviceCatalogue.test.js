import test from 'ava';
import nock from 'nock';
import sinon from 'sinon';
import serviceCatalogue from './../lib/serviceCatalogue';

const apiConfig = {
  "protocol": "http",
  "host": "localhost",
  "paths": [
    "/endpoint-one",
    "/endpoint-two"
  ]
};

const [servicesAPIPath, librariesAPIPath] = apiConfig.paths;

const mockServices = [
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
        url: 'https://github.com/test-other'
      }
    ],
  }
];

const mockLibraries = [
  {
    name: 'testLibrary',
    githubUrls: [
      {
        name: 'github-com',
        displayName: 'GitHub.com',
        url: 'https://github.com/test-library'
      }
    ],
  }
];

const errMsg = (apiDomain) => `
Could not connect to ${apiDomain}.

Please make sure you're config details are correct
and you are connected to a VPN if you need to be.`;

test.before(t => sinon.stub(process.stdout, 'write'));

test.after(t => process.stdout.write.restore());

test('.getProjects() should throw without config', t => {
  t.throws(() => serviceCatalogue.getProjects(), 'No config object given');
});

test('.getProjects() should return an array of projects', async t => {
  nock(`${apiConfig.protocol}://${apiConfig.host}:443`)
    .get(servicesAPIPath)
    .reply(200, mockServices);

  nock(`${apiConfig.protocol}://${apiConfig.host}:443`)
    .get(librariesAPIPath)
    .reply(200, mockLibraries);

  const projects = await serviceCatalogue.getProjects(apiConfig);

  t.true(Array.isArray(projects));
  t.is(projects.length, mockServices.length + mockLibraries.length);
});

test('.getServices() should successfully return services', async t => {
  nock(`${apiConfig.protocol}://${apiConfig.host}:443`)
    .get(servicesAPIPath)
    .reply(200, mockServices);

  const services = await serviceCatalogue.getServices(apiConfig, servicesAPIPath);

  t.true(services instanceof Array);
  t.deepEqual(services, mockServices);
});

test('.getServices() should error/reject when statusCode is not 200', t => {
  nock(`${apiConfig.protocol}://${apiConfig.host}:443`)
    .get(servicesAPIPath)
    .reply(404, 'URI not found');

  return serviceCatalogue.getServices(apiConfig, servicesAPIPath)
    .catch(err => {
      // there is no way of adding statusMessage directly to the response
      // https://github.com/node-nock/nock/issues/469
      t.is(err, 'ResponseCode: 404, StatusMessage: null');
    });
});

test('.getServices() should reject when bad JSON is returned', t => {
  nock(`${apiConfig.protocol}://${apiConfig.host}:443`)
    .get(servicesAPIPath)
    .reply(200, 'badJSON');

  return serviceCatalogue.getServices(apiConfig, servicesAPIPath)
    .catch(err => {
      t.is(err.name, 'SyntaxError');
      t.true(err.message.includes('Unexpected token b'));
    });
});

test('.getServices() should reject when errors are returned', t => {
  nock(`${apiConfig.protocol}://${apiConfig.host}:443`)
    .get(servicesAPIPath)
    .replyWithError('something awful happened');

  return serviceCatalogue.getServices(apiConfig, servicesAPIPath)
    .catch(err => {
      t.is(err, errMsg(apiConfig.host));
    });
});
