import co from 'co'
import path from 'path'
import Progress from 'progress'
import {EOL as newline, cpus} from 'os'
import {spawn} from 'child_process'
import toSshGitHubUrl from './utils/toSshGitHubUrl'
import chunkArray from './utils/chunkArray'

const numberOfCPUs = cpus().length

/**
 * get an array containing all Service GitHub details
 * @param services
 * @returns {Array[Object{name, displayName, url}]}
 */
const getGitHubDetails = services => {
  return services
    .map(service => service.githubUrls)
    .reduce((prev, curr) => prev.concat(curr))
}

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
    const clonePath = path.resolve(__dirname, '..', 'target', repoName)
    const gitClone = spawn('git', ['clone', '--depth', '1', sshGitHubUrl, clonePath])

    gitClone.on('error', err => reject(`Error cloning ${repoName}: ${err}`))

    gitClone.on('close', code => {
      progressBar.tick()
      resolve()
    })

    gitClone.on('exit', code => gitClone.kill())
  })
}

/**
 * Clone specified services GitHub repositories
 * @param services
 * @param cloneTask
 * @returns {Promise}
 */
const clone = (services, task = cloneTask) => {
  process.stdout.write(`Cloning repos...${newline}`)

  const gitHubRepoInfo = getGitHubDetails(services)
  const progressBar = new Progress(':percent [:bar] (:current/:total)', {
    total: gitHubRepoInfo.length,
    clear: true
  })
  const githubInfoParentArray = chunkArray(gitHubRepoInfo, numberOfCPUs * 4)

  return co(function * () {
    for (let i = 0; i < githubInfoParentArray.length; i++) {
      yield githubInfoParentArray[i].map((details) => {
        const url = details.url
        const whichGitHub = details.name === 'github-com' ? 'public' : 'enterprise'
        const repoName = `${url.split('/').pop()}-${whichGitHub}`
        const sshGitHubUrl = toSshGitHubUrl(url)

        return task(sshGitHubUrl, repoName, progressBar)
      })
    }
  })
}

export default clone
