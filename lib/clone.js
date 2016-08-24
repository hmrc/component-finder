import co from 'co';
import path from 'path';
import Progress from 'progress';
import {spawn} from 'child_process';
import toSshGitHubUrl from './utils/toSshGitHubUrl';

/**
 * get an array containing all Service GitHub details
 * @param services
 * @returns {Array[Object{name, displayName, url}]}
 */
const getGitHubDetails = services => {
  return services
    .map(service => service.githubUrls)
    .reduce((prev, curr) => prev.concat(curr));
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
    const clonePath = path.resolve(__dirname, '..', 'target', repoName);
    const gitClone = spawn('git', ['clone', '--single-branch', sshGitHubUrl, clonePath]);

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

export default clone;
