import co from 'co';
import https from 'https';
import config from './../config';

/**
 * Get projects from multiple endpoints
 * @param paths
 * @returns {Array}
 */
const getProjects = paths => {
  return co(function *() {
    return yield paths.map(path => getServices(path));
  }).then(projects => {
    return projects.reduce((prev, curr) => prev.concat(curr));
  });
};

/**
 * Get all services from the service catalogue
 * @returns {Promise}
 */
const getServices = path => {
  return new Promise((resolve, reject) => {
    https.get({
      host: config.api.host,
      path,
      headers: config.api.headers
    }, res => {
      let data = '';
      res.setEncoding('utf8');

      if (res.statusCode !== 200) {
        reject(`ResponseCode: ${res.statusCode}, StatusMessage: ${res.statusMessage}`);
      }

      res.on('data', chunk => data += chunk);

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', err => reject(err));
  })
};

export default {
  getProjects,
  getServices
};
