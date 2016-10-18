import co from 'co';
import https from 'https';
import {EOL as newline} from 'os';

const errMsg = (apiDomain) => `
Could not connect to ${apiDomain}.

Please make sure you're config details are correct
and you are connected to a VPN if you need to be.`;

const errMsg = (apiDomain) => `
Could not connect to ${apiDomain}.

Please make sure you're config details are correct
and you are connected to a VPN if you need to be.`;

/**
 * Get projects from multiple endpoints
 * @param paths
 * @returns {Array}
 */
const getProjects = (apiConfig) => {
  if (!apiConfig) {
    throw new Error('No config object given');
  }

  process.stdout.write(newline);
  process.stdout.write(`Connecting to ${apiConfig.host}...${newline}`);

  return co(function *() {
    return yield apiConfig.paths.map(path => getServices(apiConfig, path));
  }).then(projects => {
    return projects.reduce((prev, curr) => prev.concat(curr));
  });
};

/**
 * Get all services from the service catalogue
 * @returns {Promise}
 */
const getServices = (apiConfig, path) => {
  return new Promise((resolve, reject) => {
    https.get({
      host: apiConfig.host,
      path,
      headers: apiConfig.headers
    }, res => {
      let data = '';
      res.setEncoding('utf8');

      if (res.statusCode !== 200) {
        reject(`ResponseCode: ${res.statusCode}, StatusMessage: ${res.statusMessage}`);
      }

      res.on('data', (chunk) => data += chunk);

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', (err) => reject(errMsg(apiConfig.host)));
  })
};

export default {
  getProjects,
  getServices
};
