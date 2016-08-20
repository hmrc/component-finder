import co from 'co';
import https from 'https';

/**
 * Get projects from multiple endpoints
 * @param paths
 * @returns {Array}
 */
const getProjects = apiConfig => {
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
