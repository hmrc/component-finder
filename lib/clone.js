import co from 'co'
import path from 'path'
import Progress from 'progress'
import {EOL as newline, cpus} from 'os'
import {spawn} from 'child_process'
import toSshGitHubUrl from './utils/toSshGitHubUrl'
import chunkArray from './utils/chunkArray'

const numberOfCPUs = cpus().length
const spawnProcessPerCPU = 4

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
const clone = (serviceRepoDetails, task = cloneTask) => {
  process.stdout.write(`Cloning repos...${newline}`)

  const progressBar = new Progress(':percent [:bar] (:current/:total)', {
    total: serviceRepoDetails.length,
    clear: true
  })
  const serviceRepoDetailsParentArray = chunkArray(serviceRepoDetails, numberOfCPUs * spawnProcessPerCPU)

  return co(function * () {
    for (let i = 0; i < serviceRepoDetailsParentArray.length; i++) {
      yield serviceRepoDetailsParentArray[i].map((serviceRepoDetail) => {
        const url = serviceRepoDetail.url
        const whichGitHub = serviceRepoDetail.name === 'github-com' ? 'public' : 'enterprise'
        const repoName = `${url.split('/').pop()}-${whichGitHub}`
        const sshGitHubUrl = toSshGitHubUrl(url)

        return task(sshGitHubUrl, repoName, progressBar)
      })
    }
  })
}

export default clone
