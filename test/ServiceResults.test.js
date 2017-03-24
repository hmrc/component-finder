import test from 'ava'
import ServiceResults from './../lib/streams/ServiceResults'
import {PassThrough} from 'stream'

const passThrough = new PassThrough({objectMode: true})
const gitHubRepoUrls = {
  'service-name-other-enterprise': 'https://example.private.com/org/service-name-other',
  'service-name-public': 'https://example.open.com/org/service-name'
}

const serviceResults = new ServiceResults({objectMode: true}, gitHubRepoUrls)
const matchDetailInputs = [
  {
    filePath: 'target/service-name-public/example/file/path/file.html',
    lineNumber: 19,
    match: 'example match'
  },
  {
    filePath: 'target/service-name-public/example/file/path/file1.html',
    lineNumber: 34,
    match: 'other example match'
  },
  {
    filePath: 'target/service-name-public/example/file/path/file2.html',
    lineNumber: 101,
    match: 'another example match'
  },
  {
    filePath: 'target/service-name-other-enterprise/example/file/path/file-other.html',
    lineNumber: 1,
    match: 'other match'
  },
  {
    filePath: 'target/service-name-other-enterprise/example/file/path/file-other1.html',
    lineNumber: 3,
    match: 'another other match'
  }
]

const expectedServiceResults = [
  {
    name: 'service-name',
    github: 'public',
    count: 3,
    files: [
      {
        'url': 'https://example.open.com/org/service-name/blob/master/example/file/path/file.html#L19',
        'path': '/example/file/path/file.html',
        'line': 19,
        'match': 'example match'
      },
      {
        'url': 'https://example.open.com/org/service-name/blob/master/example/file/path/file1.html#L34',
        'path': '/example/file/path/file1.html',
        'line': 34,
        'match': 'other example match'
      },
      {
        'url': 'https://example.open.com/org/service-name/blob/master/example/file/path/file2.html#L101',
        'path': '/example/file/path/file2.html',
        'line': 101,
        'match': 'another example match'
      }
    ]
  },
  {
    name: 'service-name-other',
    github: 'enterprise',
    count: 2,
    files: [
      {
        'url': 'https://example.private.com/org/service-name-other/blob/master/example/file/path/file-other.html#L1',
        'path': '/example/file/path/file-other.html',
        'line': 1,
        'match': 'other match'
      },
      {
        'url': 'https://example.private.com/org/service-name-other/blob/master/example/file/path/file-other1.html#L3',
        'path': '/example/file/path/file-other1.html',
        'line': 3,
        'match': 'another other match'
      }
    ]
  }
]

test('service results created from lined input should be provided to consumer', async t => {
  let count = 0

  matchDetailInputs.forEach((matchDetail) => passThrough.write(matchDetail))
  passThrough.end()

  await passThrough
    .pipe(serviceResults)
    .on('data', (serviceResult) => t.deepEqual(serviceResult, expectedServiceResults[count++]))
    .on('finish', () => t.is(count, expectedServiceResults.length))
})
