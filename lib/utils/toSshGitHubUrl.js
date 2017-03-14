/**
 * Convert https git repo url to ssh
 * @param url
 * @returns {string}
 */
const toSshGitHubUrl = url => {
  return `${url.replace('https://', 'git@').replace(/\.(com|uk)(\/)/, '.$1:')}.git`
}

module.exports = toSshGitHubUrl
