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
 * Build an object containing all the repository github urls referenced by the repo name as a key <repoName-whichGitHub>
 * @param gitHubDetails
 * @param gitRepoUrls
 */
const getGitHubUrls = (gitHubDetails) => {
  const gitHubRepoUrls = {}

  gitHubDetails.forEach((githubDetail) => {
    const whichGitHub = githubDetail.name === 'github-com' ? 'public' : 'enterprise'
    const repoName = githubDetail.url.replace(/\/$/, '').split('/').slice(-1)

    gitHubRepoUrls[`${repoName}-${whichGitHub}`] = githubDetail.url
  })

  return gitHubRepoUrls
}

const buildServiceRepoDetails = (frontendServices) => {
  const gitHubDetails = getGitHubDetails(frontendServices)
  const gitHubUrls = getGitHubUrls(gitHubDetails)

  return {
    details: gitHubDetails,
    urls: gitHubUrls
  }
}

export default buildServiceRepoDetails
