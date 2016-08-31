import test from 'ava';
import {formatter} from './../lib/utils/logging';
import {EOL as newline} from 'os';

const serviceResults = [
  {
    name: 'service-name',
    github: 'GitHub Public',
    count: 3,
    files: [
      '/example/file/path/file.html',
      '/example/file/path/file1.html',
      '/example/file/path/file2.html'
    ]
  },
  {
    name: 'service-name-other',
    github: 'GitHub Public',
    count: 2,
    files: [
      '/example/file/path/file-other.html',
      '/example/file/path/file-other1.html'
    ]
  }
];

test('Logging formatter should log service results as expected', t => {

  const [serviceResult, serviceResultOther] = serviceResults;
  const formattedResults = formatter({meta: serviceResult});
  const formattedResultsOther = formatter({meta: serviceResultOther});

  t.is(
    formattedResults,
    `service-name (GitHub Public) [3]${newline}  /example/file/path/file.html${newline}  /example/file/path/file1.html${newline}  /example/file/path/file2.html${newline}`
  );

  t.is(
    formattedResultsOther,
    `service-name-other (GitHub Public) [2]${newline}  /example/file/path/file-other.html${newline}  /example/file/path/file-other1.html${newline}`
  );
});
