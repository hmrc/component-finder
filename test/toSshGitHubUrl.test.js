import test from 'ava'
import toSshGitHubUrl from './../lib/utils/toSshGitHubUrl'

test('https GitHub url should be correctly converted to GitHub ssh url', t => {
  t.plan(1)

  const gitHubSshUrl = toSshGitHubUrl('https://github.com/user/test-url')

  t.is(gitHubSshUrl, 'git@github.com:user/test-url.git')
})

