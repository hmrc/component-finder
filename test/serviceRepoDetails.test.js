import test from 'ava'
import getServiceRepoDetails from './../lib/utils/serviceRepoDetails'

const mockServices = [
  {
    name: 'example-repo-name',
    description: 'example description',
    createdAt: 1425991873000,
    lastActive: 1489744039000,
    teamNames: [
      'example team'
    ],
    repoType: 'example repo type',
    githubUrls: [
      {
        name: 'github-com',
        displayName: 'GitHub.com',
        url: 'https://github.com/example-repo-name-url'
      }
    ]
  },
  {
    name: 'example-repo-name-other',
    description: 'example description other',
    createdAt: 1425991873004,
    lastActive: 1489744039030,
    teamNames: [
      'example team other'
    ],
    repoType: 'example repo type other',
    githubUrls: [
      {
        name: 'github-other',
        displayName: 'Enterprise',
        url: 'https://github.com/example-repo-name-url-other'
      }
    ]
  }
]
const expectedServiceRepoDetails = [
  {
    name: 'github-com',
    displayName: 'GitHub.com',
    url: 'https://github.com/example-repo-name-url'
  },
  {
    name: 'github-other',
    displayName: 'Enterprise',
    url: 'https://github.com/example-repo-name-url-other'
  }
]

test('.gitHubDetails() should return the expected output', async t => {
  const serviceRepoDetails = getServiceRepoDetails(mockServices)

  t.deepEqual(serviceRepoDetails.details, expectedServiceRepoDetails)
  t.is(serviceRepoDetails.urls['example-repo-name-url-public'], 'https://github.com/example-repo-name-url')
  t.is(serviceRepoDetails.urls['example-repo-name-url-other-enterprise'], 'https://github.com/example-repo-name-url-other')
})
