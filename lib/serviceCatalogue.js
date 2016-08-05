const Progress = require('progress');
const co = require('co');
const https = require('https');
const spawn = require('child_process').spawn;
const toSshGitHubUrl = require('./utils/toSshGitHubUrl');
const config = require('./../config');

/**
 * Filter services with predicate.
 * @param services
 * @param predicate
 * @returns {Array}
 */
const filterServices = (services, predicate) => {
  return services.filter(service => predicate(service.name));
};

/**
 * get an array containing all Service GitHub details
 * @param services
 * @returns {Array[Object{name, displayName, url}]}
 */
const getGitHubDetails = services => {

  return services
    .map(service => {
      return service.githubUrls
    })
    .reduce(function (prev, curr) {
      // flatten nested arrays (when we have enterprise and public urls for one service)
      return prev.concat(curr);
    });
};

/**
 * Prepare clone task Promise by providing in service GitHub url
 * @param services
 * @returns {Array[Promise]}
 */
const prepClone = services => {
  const gitHubDetails = getGitHubDetails(services);
  const progressBar = new Progress('Cloning repos: :percent [:bar] (:current/:total)', {
    total: gitHubDetails.length,
    clear: true
  });

  return gitHubDetails.map(githubDetail => {
    const url = githubDetail.url;
    const whichGitHub = githubDetail.name === 'github-com' ? 'public' : 'enterprise'
    const repoName = `${url.split('/').pop()}-${whichGitHub}`;
    const sshGitHubUrl = toSshGitHubUrl(url);

    return new Promise((resolve, reject) => {
      const gitClone = spawn('git', ['clone', '--single-branch', sshGitHubUrl, `${__dirname}/../${config.repoDirectory}/${repoName}`]);

      gitClone.on('error', err => reject(`Error cloning ${repoName}: ${err}`));

      gitClone.on('close', code => {
        progressBar.tick();
        resolve();
      });

      gitClone.on('exit', code => gitClone.kill());
    });
  });
};

/**
 * Get all services from the service catalogue
 * @returns {Promise}
 */
const getServices = () => {

  return new Promise((resolve, reject) => {
    https.get({
      host: config.api.host,
      path: config.api.path,
      headers: config.api.headers
    }, res => {
      let data = '';
      res.setEncoding('utf8');

      if (res.statusCode !== 200) {
        reject(`ResponseCode: ${res.statusCode}, StatusMessage: ${res.statusMessage}`);
      }

      res.on('data', chunk => data += chunk);

      res.on('end', () => {
        let services;

        try {
          services = JSON.parse(data);
          resolve(services);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', err => reject(err));
  })
};

/**
 * Iterate through all Promises to clone repositories
 * @param services {Array[Promise]}
 * @returns {Promise}
 */
const clone = cloneTasks => {

  return new Promise((resolve, reject) => {
    co(function *() {
      yield cloneTasks;
      resolve();
    })
      .catch(err => reject(err.message, err.stack));
  });
};

module.exports = {
  filterServices,
  getServices,
  clone,
  prepClone
};
