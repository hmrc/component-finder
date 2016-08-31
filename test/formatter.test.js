import test from 'ava';
import formatter from './../lib/utils/formatter';

const serviceResults = [
  {
    name: 'service-name',
    github: 'public',
    count: 3,
    files: [
      '/example/file/path/file.html',
      '/example/file/path/file1.html',
      '/example/file/path/file2.html'
    ]
  },
  {
    name: 'service-name-other',
    github: 'public',
    count: 2,
    files: [
      '/example/file/path/file-other.html',
      '/example/file/path/file-other1.html'
    ]
  }
];

test('Logging formatter should log service results as expected', t => {

  const [serviceResult, serviceResultOther] = serviceResults;
  const formattedResults = formatter(serviceResult);
  const formattedResultsOther = formatter(serviceResultOther);

  t.is(formattedResults, 'service-name (public) [3]');

  t.is(formattedResultsOther, 'service-name-other (public) [2]');
});
