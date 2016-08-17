import config from './../config';
import toSshGitHubUrl from './utils/toSshGitHubUrl';

const Progress = require('progress');
const co = require('co');
const https = require('https');
const spawn = require('child_process').spawn;

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
 *
 * @param resolve
 * @param reject
 * @param sshGitHubUrl
 * @param repoName
 * @param progressBar
 */
const cloneTask = (sshGitHubUrl, repoName, progressBar) => {
  return new Promise((resolve, reject) => {
    const gitClone = spawn('git', ['clone', '--single-branch', sshGitHubUrl, `${__dirname}/../${config.repoDirectory}/${repoName}`]);

    gitClone.on('error', err => reject(`Error cloning ${repoName}: ${err}`));

    gitClone.on('close', code => {
      progressBar.tick();
      resolve();
    });

    gitClone.on('exit', code => gitClone.kill());
  });
};

/**
 * Clone specified services GitHub repositories
 * @param services
 * @param cloneTask
 * @returns {Promise}
 */
const clone = (services, task = cloneTask) => {
  const gitHubDetails = getGitHubDetails(services);
  const progressBar = new Progress('Cloning repos: :percent [:bar] (:current/:total)', {
    total: gitHubDetails.length,
    clear: true
  });

  return co(function *() {
    return yield gitHubDetails.map(githubDetail => {
      const url = githubDetail.url;
      const whichGitHub = githubDetail.name === 'github-com' ? 'public' : 'enterprise'
      const repoName = `${url.split('/').pop()}-${whichGitHub}`;
      const sshGitHubUrl = toSshGitHubUrl(url);

      return task(sshGitHubUrl, repoName, progressBar);
    });
  });
};

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

export default {
  getProjects,
  getServices,
  clone
};
